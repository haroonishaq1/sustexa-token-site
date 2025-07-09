// Solana mainnet configuration and utilities
import { Connection, PublicKey, LAMPORTS_PER_SOL } from '@solana/web3.js';

// Free mainnet RPC endpoints that work without API keys
const FREE_MAINNET_RPCS = [
  'https://solana-mainnet.g.alchemy.com/v2/demo', // Alchemy demo
  'https://mainnet.helius-rpc.com/?api-key=demo', // Helius demo  
  'https://api.mainnet-beta.solana.com', // Official (fallback)
];

// Network configuration (mainnet for production)
export const NETWORK = process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta';
export const RPC_ENDPOINT = process.env.NEXT_PUBLIC_RPC_ENDPOINT || FREE_MAINNET_RPCS[0];

// Simple connection setup (mainnet)
export const connection = new Connection(RPC_ENDPOINT, 'confirmed');

// Get working connection with fallback
export const getConnection = async (): Promise<Connection> => {
  // If environment variable is set, use it directly
  if (process.env.NEXT_PUBLIC_RPC_ENDPOINT) {
    return new Connection(process.env.NEXT_PUBLIC_RPC_ENDPOINT, 'confirmed');
  }
  
  // Try free RPC endpoints
  for (const rpc of FREE_MAINNET_RPCS) {
    try {
      const testConnection = new Connection(rpc, 'confirmed');
      // Test with a simple call
      await testConnection.getSlot();
      console.log('✅ Using RPC:', rpc);
      return testConnection;
    } catch (error) {
      console.log('⚠️ RPC failed:', rpc);
      continue;
    }
  }
  
  // If all fail, return the primary connection
  console.warn('⚠️ All RPC endpoints failed, using primary');
  return connection;
};

// Token configuration
export const TOKEN_CONFIG = {
  mintAddress: process.env.NEXT_PUBLIC_TOKEN_MINT_ADDRESS || '',
  price: 1/75725, // ~0.000013 SOL per token (1 SOL = 75,725 SUSTEXA at $0.002 per token)
  symbol: 'SUSTEXA',
  decimals: 9
};

// Validate token mint address
export const getTokenMintPublicKey = (): PublicKey | null => {
  try {
    if (!TOKEN_CONFIG.mintAddress) {
      console.error('Token mint address not configured');
      return null;
    }
    return new PublicKey(TOKEN_CONFIG.mintAddress);
  } catch (error) {
    console.error('Invalid token mint address:', error);
    return null;
  }
};

// Helper functions
export const lamportsToSol = (lamports: number): number => {
  return lamports / LAMPORTS_PER_SOL;
};

export const solToLamports = (sol: number): number => {
  return Math.floor(sol * LAMPORTS_PER_SOL);
};

export const formatTokenAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6
  }).format(amount);
};

export const formatSolAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 4,
    maximumFractionDigits: 9
  }).format(amount);
};

// API endpoints
export const API_ENDPOINTS = {
  purchase: '/api/purchase-tokens',
  balance: '/api/get-balance',
  transaction: '/api/get-transaction'
};

// Mainnet safety checks
export const isMainnet = (): boolean => {
  return NETWORK === 'mainnet-beta';
};

export const validateMainnetConfig = (): boolean => {
  if (!isMainnet()) return true;
  
  const required = [
    TOKEN_CONFIG.mintAddress,
    process.env.NEXT_PUBLIC_API_ENDPOINT
  ];
  
  return required.every(config => config && config.length > 0);
};
