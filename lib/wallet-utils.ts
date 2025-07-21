// Wallet utilities for SUSTEXA token presale
import { Connection, PublicKey, Transaction, sendAndConfirmTransaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { connection, getConnection, lamportsToSol, TOKEN_CONFIG } from './solana-config';

// Interface for wallet provider (supports both Phantom and Solflare)
interface WalletProvider {
  isPhantom?: boolean;
  isSolflare?: boolean;
  publicKey?: PublicKey;
  connect: () => Promise<{ publicKey: PublicKey }>;
  disconnect: () => Promise<void>;
  signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
  signTransaction: (transaction: Transaction) => Promise<Transaction>;
}

// Get Phantom provider
export const getPhantomProvider = (): WalletProvider | null => {
  if (typeof window !== 'undefined' && 'phantom' in window) {
    const provider = (window as any).phantom?.solana;
    if (provider && provider.isPhantom) {
      return provider;
    }
  }
  return null;
};

// Get Solflare provider
export const getSolflareProvider = (): WalletProvider | null => {
  if (typeof window !== 'undefined') {
    // Solflare can be accessed through window.solflare or window.solana
    const solflareProvider = (window as any).solflare;
    if (solflareProvider && solflareProvider.isSolflare) {
      return solflareProvider;
    }
    
    // Also check window.solana for Solflare
    const solanaProvider = (window as any).solana;
    if (solanaProvider && solanaProvider.isSolflare) {
      return solanaProvider;
    }
    
    // Some versions might use window.solflare without isSolflare flag
    if (solflareProvider && typeof solflareProvider.connect === 'function') {
      return solflareProvider;
    }
  }
  return null;
};

// Get any available wallet provider
export const getWalletProvider = (walletType: 'phantom' | 'solflare'): WalletProvider | null => {
  if (walletType === 'phantom') {
    return getPhantomProvider();
  } else if (walletType === 'solflare') {
    return getSolflareProvider();
  }
  return null;
};

// Connect to Phantom wallet
export const connectPhantomWallet = async (): Promise<{ publicKey: PublicKey } | null> => {
  try {
    const provider = getPhantomProvider();
    if (!provider) {
      throw new Error('Phantom wallet not found. Please install Phantom wallet extension.');
    }

    const response = await provider.connect();
    
    // Safely check if response and publicKey exist
    if (response && response.publicKey) {
      return response;
    } else {
      // Handle case where wallet is installed but no account is connected
      throw new Error('Please create or unlock your Phantom wallet account first.');
    }
  } catch (error: any) {
    // Check if this is a wallet detection error
    if (error.message.includes('not found')) {
      throw error; // Re-throw wallet not found errors
    }
    
    // Handle user rejection
    if (error.message.includes('User rejected') || error.code === 4001) {
      throw new Error('Connection cancelled by user.');
    }
    
    // Handle account/unlock issues
    if (error.message.includes('create or unlock')) {
      throw error; // Re-throw our custom messages
    }
    
    // Handle any other connection errors with a user-friendly message
    throw new Error('Failed to connect to Phantom wallet. Please make sure your wallet is unlocked and try again.');
  }
};

// Connect to Solflare wallet
export const connectSolflareWallet = async (): Promise<{ publicKey: PublicKey } | null> => {
  try {
    const provider = getSolflareProvider();
    if (!provider) {
      throw new Error('Solflare wallet not found. Please install Solflare wallet extension.');
    }

    const response = await provider.connect();
    
    // Try to get the public key from response or provider
    let publicKey: PublicKey | null = null;
    
    if (response && response.publicKey) {
      publicKey = response.publicKey;
    } else if (provider.publicKey) {
      publicKey = provider.publicKey;
    }
    
    if (publicKey) {
      return { publicKey };
    } else {
      // Handle case where wallet is installed but no account is connected
      if (!response || typeof response === 'boolean' || !response.publicKey) {
        throw new Error('Please create or unlock your Solflare wallet account first.');
      }
      throw new Error('Unable to connect to Solflare wallet. Please make sure your wallet is unlocked and has an account.');
    }
  } catch (error: any) {
    // Check if this is a wallet detection error
    if (error.message.includes('not found')) {
      throw error; // Re-throw wallet not found errors
    }
    
    // Handle user rejection
    if (error.message.includes('User rejected') || error.code === 4001) {
      throw new Error('Connection cancelled by user.');
    }
    
    // Handle account/unlock issues
    if (error.message.includes('create or unlock') || error.message.includes('Unable to connect')) {
      throw error; // Re-throw our custom messages
    }
    
    // Handle any other connection errors with a user-friendly message
    throw new Error('Failed to connect to Solflare wallet. Please make sure your wallet is unlocked and try again.');
  }
};

// Generic wallet connection
export const connectWallet = async (walletType: 'phantom' | 'solflare'): Promise<{ publicKey: PublicKey } | null> => {
  try {
    if (walletType === 'phantom') {
      return await connectPhantomWallet();
    } else if (walletType === 'solflare') {
      return await connectSolflareWallet();
    }
    throw new Error('Unsupported wallet type');
  } catch (error: any) {
    // Re-throw the error so the UI can handle it properly
    throw error;
  }
};

// Disconnect from wallet
export const disconnectWallet = async (walletType?: 'phantom' | 'solflare'): Promise<void> => {
  try {
    if (walletType === 'phantom' || !walletType) {
      const phantomProvider = getPhantomProvider();
      if (phantomProvider) {
        await phantomProvider.disconnect();
        console.log('✅ Disconnected from Phantom wallet');
      }
    }
    
    if (walletType === 'solflare' || !walletType) {
      const solflareProvider = getSolflareProvider();
      if (solflareProvider) {
        await solflareProvider.disconnect();
        console.log('✅ Disconnected from Solflare wallet');
      }
    }
  } catch (error) {
    console.error('❌ Failed to disconnect wallet:', error);
    throw error;
  }
};

// Legacy function for backward compatibility
export const disconnectPhantomWallet = async (): Promise<void> => {
  return disconnectWallet('phantom');
};

// Get SOL balance for a wallet
export const getSolBalance = async (publicKey: PublicKey): Promise<number> => {
  try {
    console.log('💰 Fetching SOL balance for:', publicKey.toString());
    
    // For development, always use mock balance to avoid RPC issues
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 Using mock balance for development mode');
      return 1.5; // Mock 1.5 SOL for development
    }
    
    // Use the connection with fallback for production
    const conn = await getConnection();
    const balance = await conn.getBalance(publicKey);
    const solBalance = lamportsToSol(balance);
    
    console.log(`✅ SOL balance: ${solBalance} SOL`);
    return solBalance;
  } catch (error) {
    console.error('❌ Error fetching SOL balance:', error);
    
    // Fallback to mock balance if RPC fails
    console.log('🔄 RPC failed, using mock balance as fallback');
    return 1.5; // Mock 1.5 SOL as fallback
  }
};

// Get token balance for a wallet (SPL tokens)
export const getTokenBalance = async (publicKey: PublicKey, mintAddress: string): Promise<number> => {
  try {
    console.log('🪙 Fetching token balance for:', publicKey.toString());
    
    // This would require SPL Token library integration
    // For now, return 0 or implement when needed
    console.log('⚠️ Token balance check not implemented yet');
    return 0;
  } catch (error) {
    console.error('❌ Error fetching token balance:', error);
    return 0;
  }
};

// Calculate token amount from SOL amount
export const calculateTokenAmount = (solAmount: number): number => {
  if (!TOKEN_CONFIG.price || TOKEN_CONFIG.price <= 0) {
    console.warn('⚠️ Invalid token price configuration');
    return 0;
  }
  
  return solAmount / TOKEN_CONFIG.price;
};

// Calculate SOL amount from token amount
export const calculateSolAmount = (tokenAmount: number): number => {
  if (!TOKEN_CONFIG.price || TOKEN_CONFIG.price <= 0) {
    console.warn('⚠️ Invalid token price configuration');
    return 0;
  }
  
  return tokenAmount * TOKEN_CONFIG.price;
};

// Validate wallet connection
export const validateWalletConnection = (publicKey: PublicKey | null): boolean => {
  if (!publicKey) {
    console.error('❌ No wallet connected');
    return false;
  }
  
  try {
    // Validate public key format
    new PublicKey(publicKey.toString());
    return true;
  } catch (error) {
    console.error('❌ Invalid wallet public key:', error);
    return false;
  }
};

// Purchase tokens (calls API endpoint) - works with any wallet
export const purchaseTokens = async (
  publicKey: PublicKey,
  solAmount: number,
  tokenAmount: number,
  walletType?: 'phantom' | 'solflare'
): Promise<{ success: boolean; signature?: string; error?: string }> => {
  try {
    console.log('🚀 Starting token purchase process...');
    console.log(`💰 SOL Amount: ${solAmount}`);
    console.log(`🪙 Token Amount: ${tokenAmount}`);
    console.log(`👛 Wallet Type: ${walletType || 'auto-detect'}`);
    
    // Call the API endpoint to prepare transaction
    const response = await fetch('/api/purchase-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userPublicKey: publicKey.toString(),
        solAmount,
        tokenAmount,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to prepare transaction');
    }
    
    const { serializedTransaction } = await response.json();
    
    // Deserialize transaction
    const tx = Transaction.from(Buffer.from(serializedTransaction, 'base64'));
    
    // Try to get the correct wallet provider
    let provider: WalletProvider | null = null;
    let walletName = '';
    
    if (walletType === 'phantom') {
      provider = getPhantomProvider();
      walletName = 'Phantom';
    } else if (walletType === 'solflare') {
      provider = getSolflareProvider();
      walletName = 'Solflare';
    } else {
      // Auto-detect: try Phantom first, then Solflare
      provider = getPhantomProvider();
      if (provider) {
        walletName = 'Phantom';
      } else {
        provider = getSolflareProvider();
        if (provider) {
          walletName = 'Solflare';
        }
      }
    }
    
    if (!provider) {
      throw new Error('No supported wallet found. Please install Phantom or Solflare wallet.');
    }
    
    console.log(`📤 Sending transaction to ${walletName} for signing...`);
    const signedTransaction = await provider.signAndSendTransaction(tx);
    console.log('✅ Transaction successful! Signature:', signedTransaction.signature);
    console.log('🔗 View on Solscan:', `https://solscan.io/tx/${signedTransaction.signature}`);
    
    return {
      success: true,
      signature: signedTransaction.signature,
    };
    
  } catch (error) {
    // Handle different types of errors more gracefully
    let errorMessage = 'Transaction failed. Please try again.';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    } else if (typeof error === 'string') {
      errorMessage = error;
    } else if (error && typeof error === 'object') {
      // Extract error message from different error formats
      if ((error as any).message) {
        errorMessage = (error as any).message;
      } else if ((error as any).error) {
        errorMessage = (error as any).error;
      } else if ((error as any).toString && typeof (error as any).toString === 'function') {
        errorMessage = (error as any).toString();
      }
    }
    
    // Handle common user errors without logging as console errors
    const userCancellationMessages = [
      'user rejected',
      'user denied',
      'transaction cancelled',
      'cancelled by user',
      'user cancelled',
      'rejected by user',
      'insufficient funds',
      'insufficient balance'
    ];
    
    const isUserCancellation = userCancellationMessages.some(msg => 
      errorMessage.toLowerCase().includes(msg.toLowerCase())
    );
    
    // Provide user-friendly messages for common scenarios
    if (isUserCancellation) {
      if (errorMessage.toLowerCase().includes('insufficient')) {
        errorMessage = 'Insufficient SOL balance for this transaction';
      } else if (errorMessage.toLowerCase().includes('rejected') || errorMessage.toLowerCase().includes('cancelled')) {
        errorMessage = 'Transaction was cancelled by user';
      }
      // Don't log user cancellations as errors, just info
      console.log('ℹ️ Transaction cancelled by user or insufficient funds:', errorMessage);
    } else {
      // Log actual system errors
      console.log('⚠️ Token purchase failed:', errorMessage);
    }
    
    return {
      success: false,
      error: errorMessage,
    };
  }
};

// Format wallet address for display
export const formatWalletAddress = (address: string, startChars = 4, endChars = 4): string => {
  if (address.length <= startChars + endChars) {
    return address;
  }
  
  return `${address.slice(0, startChars)}...${address.slice(-endChars)}`;
};

// Check if wallet is connected
export const isWalletConnected = (): boolean => {
  const provider = getPhantomProvider();
  return provider?.publicKey ? true : false;
};

// Get connected wallet public key
export const getConnectedWalletPublicKey = (): PublicKey | null => {
  const provider = getPhantomProvider();
  return provider?.publicKey || null;
};
