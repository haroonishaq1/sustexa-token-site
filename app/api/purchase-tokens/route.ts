import { NextRequest, NextResponse } from 'next/server';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  Keypair,
  SystemProgram,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID,
  getAssociatedTokenAddress,
  createTransferInstruction,
  getAccount,
  createAssociatedTokenAccountInstruction
} from '@solana/spl-token';
import { getConnection } from '@/lib/solana-config';

// Next.js configuration for dynamic API routes
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Environment variables
const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || 'https://api.mainnet-beta.solana.com';
const TOKEN_MINT_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS;
const TOKEN_PRICE = parseFloat(process.env.NEXT_PUBLIC_TOKEN_PRICE || '0.002');

// Security Note: In production, NEVER store private keys in environment variables
// Use AWS Secrets Manager, Azure Key Vault, or similar secure key management
const TREASURY_PRIVATE_KEY = process.env.TREASURY_PRIVATE_KEY;

export async function POST(request: NextRequest) {
  try {
    console.log('🚀 API: Starting token purchase...');
    
    const { userPublicKey, solAmount, tokenAmount } = await request.json();
    console.log('📦 API: Received data:', { userPublicKey, solAmount, tokenAmount });

    // Validation
    if (!userPublicKey || !solAmount || !tokenAmount) {
      console.error('❌ API: Missing required parameters');
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      );
    }

    if (!TOKEN_MINT_ADDRESS) {
      console.error('❌ API: Token mint address not configured');
      return NextResponse.json(
        { error: 'Token mint address not configured' },
        { status: 500 }
      );
    }

    console.log('🔑 API: Treasury private key exists:', !!TREASURY_PRIVATE_KEY);
    console.log('🔑 API: Treasury private key length:', TREASURY_PRIVATE_KEY?.length);
    
    if (!TREASURY_PRIVATE_KEY || TREASURY_PRIVATE_KEY === 'your_secure_private_key_here') {
      console.error('❌ API: Treasury private key not configured');
      return NextResponse.json(
        { error: 'Treasury private key not configured. Please set TREASURY_PRIVATE_KEY in environment variables.' },
        { status: 500 }
      );
    }

    // Connect to Solana
    console.log('🌐 API: Connecting to Solana...');
    const connection = await getConnection();
    const userPubKey = new PublicKey(userPublicKey);
    const tokenMint = new PublicKey(TOKEN_MINT_ADDRESS);
    
    // Treasury keypair (handle different private key formats)
    console.log('🔑 API: Creating treasury keypair...');
    let treasuryKeypair;
    try {
      // Try base58 format first (Phantom export format)
      const bs58 = require('bs58');
      const secretKey = bs58.decode(TREASURY_PRIVATE_KEY);
      treasuryKeypair = Keypair.fromSecretKey(secretKey);
      console.log('✅ API: Treasury keypair created with base58 format');
    } catch (base58Error) {
      try {
        // Fallback to base64 format
        treasuryKeypair = Keypair.fromSecretKey(
          Buffer.from(TREASURY_PRIVATE_KEY, 'base64')
        );
        console.log('✅ API: Treasury keypair created with base64 format');
      } catch (base64Error) {
        console.error('❌ API: Failed to parse private key:', 
          base58Error instanceof Error ? base58Error.message : base58Error, 
          base64Error instanceof Error ? base64Error.message : base64Error);
        return NextResponse.json(
          { error: 'Invalid treasury private key format' },
          { status: 500 }
        );
      }
    }
    
    console.log('🏦 API: Treasury public key:', treasuryKeypair.publicKey.toString());

    // Get current SOL price from the same endpoint as frontend
    let solPriceUSD = 150; // Fallback price
    try {
      const solPriceResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/sol-price`);
      if (solPriceResponse.ok) {
        const priceData = await solPriceResponse.json();
        solPriceUSD = priceData.price;
        console.log('💰 API: Current SOL price from sol-price API:', solPriceUSD);
      }
    } catch (error) {
      console.warn('⚠️ API: Failed to fetch SOL price, using fallback:', solPriceUSD);
    }

    // Calculate expected SOL amount using the same logic as dashboard
    // Token price is $0.002 USD, so: expectedUSD = tokenAmount * 0.002
    // Then convert to SOL: expectedSOL = expectedUSD / solPriceUSD
    const expectedUSDValue = tokenAmount * TOKEN_PRICE; // USD value of tokens
    const expectedSolAmount = expectedUSDValue / solPriceUSD; // Convert USD to SOL
    
    console.log('🧮 API: Price calculation:', {
      tokenAmount,
      tokenPriceUSD: TOKEN_PRICE,
      expectedUSDValue,
      solPriceUSD,
      expectedSolAmount,
      receivedSolAmount: solAmount,
      difference: Math.abs(solAmount - expectedSolAmount)
    });

    // Allow for small rounding differences (0.5% tolerance to handle price fluctuations)
    const tolerance = expectedSolAmount * 0.005;
    if (Math.abs(solAmount - expectedSolAmount) > tolerance) {
      console.error('❌ API: Price mismatch detected:', {
        expectedSolAmount,
        receivedSolAmount: solAmount,
        difference: Math.abs(solAmount - expectedSolAmount),
        tolerance,
        percentDifference: ((Math.abs(solAmount - expectedSolAmount) / expectedSolAmount) * 100).toFixed(2) + '%'
      });
      return NextResponse.json(
        { error: `Price calculation mismatch. Expected: ${expectedSolAmount.toFixed(6)} SOL, Received: ${solAmount.toFixed(6)} SOL` },
        { status: 400 }
      );
    }

    // Get user's token account address
    const userTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      userPubKey
    );

    // Get treasury's token account address
    const treasuryTokenAccount = await getAssociatedTokenAddress(
      tokenMint,
      treasuryKeypair.publicKey
    );

    // Create transaction
    const transaction = new Transaction();

    // Check if user's token account exists
    let userTokenAccountExists = true;
    try {
      await getAccount(connection, userTokenAccount);
    } catch (error) {
      userTokenAccountExists = false;
    }

    // If user's token account doesn't exist, create it
    if (!userTokenAccountExists) {
      transaction.add(
        createAssociatedTokenAccountInstruction(
          userPubKey, // payer
          userTokenAccount, // associatedToken
          userPubKey, // owner
          tokenMint // mint
        )
      );
    }

    // Add SOL payment instruction (user pays SOL to treasury)
    transaction.add(
      SystemProgram.transfer({
        fromPubkey: userPubKey,
        toPubkey: treasuryKeypair.publicKey,
        lamports: Math.floor(solAmount * LAMPORTS_PER_SOL)
      })
    );

    // Add token transfer instruction (treasury sends tokens to user)
    const tokenAmountInLamports = Math.floor(tokenAmount * Math.pow(10, 9)); // Assuming 9 decimals
    transaction.add(
      createTransferInstruction(
        treasuryTokenAccount, // source
        userTokenAccount, // destination
        treasuryKeypair.publicKey, // owner
        tokenAmountInLamports // amount
      )
    );

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPubKey;

    // Partially sign with treasury keypair
    transaction.partialSign(treasuryKeypair);

    // Serialize transaction for user to sign
    const serializedTransaction = transaction.serialize({
      requireAllSignatures: false
    });

    return NextResponse.json({
      success: true,
      serializedTransaction: Buffer.from(serializedTransaction).toString('base64'),
      message: 'Transaction prepared successfully'
    });

  } catch (error: any) {
    console.error('Token purchase error:', error);
    return NextResponse.json(
      { error: 'Failed to process token purchase', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Token purchase API endpoint',
    tokenPrice: TOKEN_PRICE,
    mintAddress: TOKEN_MINT_ADDRESS
  });
}
