'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, TrendingUp, Users, DollarSign, Copy, ExternalLink, LogOut, X } from 'lucide-react';
import Image from 'next/image';
import { purchaseTokens, getSolBalance, calculateTokenAmount, validateWalletConnection, connectWallet, disconnectWallet, getPhantomProvider, getSolflareProvider } from '@/lib/wallet-utils';
import { TOKEN_CONFIG } from '@/lib/solana-config';
import { PublicKey } from '@solana/web3.js';
import { useSolanaPrice } from '@/hooks/use-solana-price';
import { usePresaleCountdown } from '@/hooks/use-presale-countdown';

export default function DashboardPage() {
  const router = useRouter();
  const { price: solPriceUSD, priceChange24h: solPriceChange } = useSolanaPrice();
  const { phase, isPresaleActive } = usePresaleCountdown();
  
  // All hooks must be called before any conditional returns
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [spendAmount, setSpendAmount] = useState<string>('');
  const [currency, setCurrency] = useState<string>('SOL'); // Fixed to SOL only
  const [tokenAmount, setTokenAmount] = useState<string>('0.00');
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [solBalance, setSolBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<Array<{
    signature: string;
    solAmount: number;
    tokenAmount: string;
    usdValue: number;
    timestamp: string;
    status: 'success' | 'pending' | 'failed';
  }>>([]);
  const [notification, setNotification] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);
  
  // Redirect if presale is not active (still in phase 1)
  useEffect(() => {
    if (!isPresaleActive) {
      router.push('/');
    }
  }, [isPresaleActive, router]);
  
  // Don't render anything if presale is not active
  if (!isPresaleActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-300 mb-4">Dashboard Coming Soon</h1>
          <p className="text-green-200 mb-8">Please wait for the presale to go live</p>
          <Button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }
  
  // Check if dashboard is accessible
  const isDashboardAccessible = phase === 'presale-ending' || phase === 'ended';

  useEffect(() => {
    // Check for wallet connection
    const wallet = localStorage.getItem('connectedWallet');
    const address = localStorage.getItem('walletPublicKey') || localStorage.getItem('walletAddress');
    
    if (!wallet || !address) {
      // If no wallet connected, redirect to presale page for wallet connection
      showNotification('Please connect your wallet first', 'info');
      router.push('/presale');
      return;
    }
    
    setConnectedWallet(wallet);
    setWalletAddress(address);
    
    // Fetch SOL balance
    if (address) {
      fetchBalances(address);
      loadTransactionHistory(address);
    }
  }, [router]);

  const fetchBalances = async (address: string) => {
    try {
      console.log('🔄 Fetching balances for address:', address);
      const publicKey = new PublicKey(address);
      const balance = await getSolBalance(publicKey);
      
      setSolBalance(balance);
      console.log(`✅ Balance loaded: ${balance} SOL`);
    } catch (error: any) {
      console.error('❌ Error fetching balances:', error);
      showNotification('Unable to fetch wallet balance', 'error');
      // Set a default balance for testing
      setSolBalance(0.1);
    }
  };

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  const disconnectWalletHandler = async () => {
    try {
      // Disconnect from the current wallet
      const currentWallet = localStorage.getItem('connectedWallet')?.toLowerCase();
      if (currentWallet === 'phantom' || currentWallet === 'solflare') {
        await disconnectWallet(currentWallet as 'phantom' | 'solflare');
      }
      
      // Clear localStorage
      localStorage.removeItem('connectedWallet');
      localStorage.removeItem('walletPublicKey');
      localStorage.removeItem('walletAddress');
      localStorage.removeItem('walletChainId');
      
      // Reset state
      setConnectedWallet(null);
      setWalletAddress(null);
      setTransactions([]);
      setSolBalance(0);
      
      showNotification('Wallet disconnected successfully', 'info');
      
      // Redirect to presale page for wallet connection
      router.push('/presale');
    } catch (error) {
      console.error('❌ Error disconnecting wallet:', error);
      showNotification('Error disconnecting wallet', 'error');
    }
  };

  const copyAddress = () => {
    if (walletAddress) {
      navigator.clipboard.writeText(walletAddress);
      showNotification('Address copied to clipboard!', 'success');
    }
  };

  const truncateAddress = (address: string) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  // Load transaction history from localStorage
  const loadTransactionHistory = (address: string) => {
    try {
      const stored = localStorage.getItem(`transactions_${address}`);
      if (stored) {
        const parsedTransactions = JSON.parse(stored);
        setTransactions(parsedTransactions);
        console.log('📋 Loaded transaction history:', parsedTransactions.length, 'transactions');
      }
    } catch (error) {
      console.error('❌ Error loading transaction history:', error);
    }
  };

  // Save transaction to localStorage
  const saveTransaction = (transactionData: {
    signature: string;
    solAmount: number;
    tokenAmount: string;
    usdValue: number;
    timestamp: string;
    status: 'success' | 'pending' | 'failed';
  }) => {
    if (!walletAddress) return;
    
    try {
      const stored = localStorage.getItem(`transactions_${walletAddress}`);
      const existingTransactions = stored ? JSON.parse(stored) : [];
      
      // Add new transaction to the beginning of the array
      const updatedTransactions = [transactionData, ...existingTransactions];
      
      // Keep only the last 20 transactions
      const limitedTransactions = updatedTransactions.slice(0, 20);
      
      localStorage.setItem(`transactions_${walletAddress}`, JSON.stringify(limitedTransactions));
      setTransactions(limitedTransactions);
      
      console.log('💾 Transaction saved to history');
    } catch (error) {
      console.error('❌ Error saving transaction:', error);
    }
  };

  // Calculate token amount based on SOL spend amount with dynamic pricing
  const calculateTokens = (amount: string) => {
    if (!amount || isNaN(Number(amount))) {
      setTokenAmount('0.00');
      return;
    }

    // Fixed SUSTEXA token price in USD
    const SUSTEXA_USD_PRICE = 0.002;
    
    // Calculate tokens based on live SOL price
    const solAmount = Number(amount);
    const usdValue = solAmount * solPriceUSD; // Convert SOL to USD using live price
    const tokens = usdValue / SUSTEXA_USD_PRICE; // Divide by fixed token price
    
    setTokenAmount(tokens.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 6 }));
  };

  // Auto-recalculate tokens when SOL price changes (real-time fluctuation)
  useEffect(() => {
    if (spendAmount && solPriceUSD > 0) {
      calculateTokens(spendAmount);
    }
  }, [solPriceUSD]); // Re-calculate whenever SOL price changes

  const handleAmountChange = (value: string) => {
    setSpendAmount(value);
    calculateTokens(value);
  };

  // Check if amount is valid (minimum 0.1 SOL, maximum 1 SOL)
  const isAmountValid = () => {
    const amount = Number(spendAmount);
    return !spendAmount || amount === 0 || (amount >= 0.1 && amount <= 1);
  };

  const getAmountError = () => {
    const amount = Number(spendAmount);
    if (spendAmount && amount > 0) {
      if (amount < 0.1) {
        return 'Minimum amount should be 0.1 SOL';
      } else if (amount > 1) {
        return 'Maximum amount should be 1 SOL';
      }
    }
    return null;
  };

  const setQuickAmount = (amount: number) => {
    const amountStr = amount.toString();
    setSpendAmount(amountStr);
    calculateTokens(amountStr);
  };

  const handlePurchase = async () => {
    if (!spendAmount || Number(spendAmount) <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    // Check minimum amount validation
    if (Number(spendAmount) < 0.1) {
      showNotification('Minimum purchase amount is 0.1 SOL', 'error');
      return;
    }

    if (!walletAddress) {
      showNotification('Wallet not connected', 'error');
      return;
    }

    // Always working with SOL since currency is fixed
    const solAmount = Number(spendAmount);

    // Check if SOL price is available
    if (!solPriceUSD || solPriceUSD <= 0) {
      showNotification('SOL price not available. Please wait a moment and try again.', 'error');
      return;
    }

    // Recalculate tokens using the same logic to avoid precision issues
    const SUSTEXA_USD_PRICE = 0.002;
    const usdValue = solAmount * solPriceUSD;
    const tokensToReceive = usdValue / SUSTEXA_USD_PRICE;

    // Debug logging for precision issues
    console.log('💰 Purchase Debug Info:');
    console.log(`SOL Amount: ${solAmount}`);
    console.log(`SOL Price USD: ${solPriceUSD}`);
    console.log(`USD Value: ${usdValue}`);
    console.log(`Tokens to Receive: ${tokensToReceive}`);
    console.log(`Displayed Token Amount: ${tokenAmount}`);

    // Basic validation
    if (solAmount <= 0) {
      showNotification('Please enter a valid amount', 'error');
      return;
    }

    if (solAmount > solBalance) {
      showNotification(`Insufficient SOL balance. You have ${solBalance.toFixed(4)} SOL`, 'error');
      return;
    }

    if (tokensToReceive <= 0) {
      showNotification('Token amount calculation error', 'error');
      return;
    }

    setIsPurchasing(true);
    try {
      // Get wallet public key
      const publicKey = new PublicKey(walletAddress);
      const walletType = connectedWallet?.toLowerCase() as 'phantom' | 'solflare';

      const result = await purchaseTokens(
        publicKey,
        solAmount,
        tokensToReceive,
        walletType
      );

      if (result.success) {
        const usdValue = solAmount * solPriceUSD;
        
        // Save transaction to history
        const newTransaction = {
          signature: result.signature || 'Unknown',
          solAmount,
          tokenAmount,
          usdValue,
          timestamp: new Date().toISOString(),
          status: 'success' as const
        };
        saveTransaction(newTransaction);
        
        showNotification(`Successfully purchased ${tokenAmount} SUSTEXA tokens for ${solAmount.toFixed(4)} SOL (~$${usdValue.toFixed(2)})!`, 'success');
        setSpendAmount('');
        setTokenAmount('0.00');
        
        console.log('Transaction signature:', result.signature);
        
        // Refresh balance after purchase
        await fetchBalances(walletAddress);
      } else {
        showNotification(result.error || 'Purchase failed', 'error');
      }
      
    } catch (error: any) {
      // Handle different types of errors more gracefully
      let errorMessage = 'Purchase failed. Please try again.';
      
      // Extract the actual error message
      if (typeof error === 'string') {
        errorMessage = error;
      } else if (error?.message) {
        errorMessage = error.message;
      } else if (error?.error) {
        errorMessage = error.error;
      } else if (error?.toString && typeof error.toString === 'function') {
        errorMessage = error.toString();
      }
      
      // Check if it's a user cancellation or insufficient funds
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
        } else {
          errorMessage = 'Transaction was cancelled by user';
        }
        // Don't log user cancellations as errors, just show notification
        console.log('ℹ️ Purchase cancelled by user or insufficient funds');
      } else {
        // Log actual system errors
        console.error('Purchase error:', error);
      }
      
      showNotification(errorMessage, 'error');
    } finally {
      setIsPurchasing(false);
    }
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gradient-to-br from-green-600 via-emerald-700 to-black overflow-auto">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 border ${
          notification.type === 'success' 
            ? 'bg-green-900/90 text-green-100 border-green-500/50 backdrop-blur-md' :
          notification.type === 'error' 
            ? 'bg-green-900/90 text-red-200 border-red-400/50 backdrop-blur-md' :
            'bg-green-900/90 text-blue-200 border-blue-400/50 backdrop-blur-md'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && (
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            )}
            {notification.type === 'error' && (
              <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse"></div>
            )}
            {notification.type === 'info' && (
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            )}
            <span className="font-medium">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
        <div className="flex items-center space-x-3">
          <Image 
            src="/logo.png" 
            alt="SUSTEXA Logo" 
            width={40} 
            height={40}
            className="object-contain"
          />
          <h1 className="text-green-300 text-xl sm:text-2xl font-bold">SUSTEXA Dashboard</h1>
        </div>
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
          <div className="bg-green-900/40 backdrop-blur-md rounded-lg px-3 py-2 text-green-300 flex items-center gap-2 border border-green-500/30 text-xs sm:text-sm">
            <Wallet className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="truncate max-w-32 sm:max-w-none">Connected: {connectedWallet}</span>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={disconnectWalletHandler}
              variant="ghost"
              className="text-green-300/70 hover:text-green-200 hover:bg-green-900/30 border border-transparent hover:border-green-500/30 transition-all duration-300 text-sm px-3 py-2 rounded-lg"
            >
              <LogOut className="w-4 h-4" />
              <span className="hidden sm:inline ml-1">Disconnect</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="relative z-10 container mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Welcome Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold text-green-300 mb-2 sm:mb-4 tracking-wider">
            Buy <span className="bg-gradient-to-r from-green-200 to-green-500 bg-clip-text text-transparent">SUSTEXA</span>
          </h2>
          <p className="text-green-200/80 text-lg sm:text-xl mb-4 sm:mb-8 max-w-2xl mx-auto px-4">
            Purchase SUSTEXA tokens directly from your connected wallet. Join the sustainable future today!
          </p>
        </div>

        {/* Main Purchase Section */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 relative px-4">
          
          <div className="bg-green-900/20 backdrop-blur-md rounded-2xl sm:rounded-3xl p-4 sm:p-8 border border-green-500/40 shadow-2xl relative">
            <div className="flex items-center justify-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <Image 
                src="/logo.png" 
                alt="SUSTEXA Logo" 
                width={24} 
                height={24}
                className="object-contain sm:w-8 sm:h-8"
              />
              <h3 className="text-xl sm:text-2xl font-bold text-green-300">Buy SUSTEXA Tokens</h3>
            </div>
            
            {/* SOL Price Display */}
            <div className="mb-4 sm:mb-6">
              <div className="bg-green-900/40 backdrop-blur-md rounded-lg p-3 sm:p-4 border border-green-500/30">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <Image 
                      src="/solana-sol-logo.svg" 
                      alt="Solana Logo" 
                      width={24} 
                      height={24}
                      className="object-contain sm:w-8 sm:h-8"
                    />
                    <div>
                      <h4 className="text-green-300 font-medium text-sm sm:text-base">Solana</h4>
                      <p className="text-green-400/60 text-xs sm:text-sm">SOL</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-green-300 font-bold text-lg sm:text-xl">${solPriceUSD.toFixed(4)}</p>
                    <div className="flex items-center gap-1">
                      <span className="text-green-400/80 text-xs sm:text-sm">Live</span>
                      <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full animate-pulse"></div>
                      <span className="text-green-400/60 text-xs hidden sm:inline">Updated {new Date().toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Purchase Form */}
            <div className="space-y-4 sm:space-y-6">
              {/* Amount Input */}
              <div>
                <label className="block text-green-300/80 mb-2 font-medium text-sm sm:text-base">Amount to Spend</label>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="0.00"
                    className={`w-full bg-black/40 border rounded-lg px-3 sm:px-4 py-2 sm:py-3 pr-12 sm:pr-16 text-green-100 placeholder-green-200/50 focus:ring-2 focus:ring-green-400/20 outline-none text-sm sm:text-base transition-colors ${
                      !isAmountValid() 
                        ? 'border-red-400/60 focus:border-red-400' 
                        : 'border-green-500/30 focus:border-green-400'
                    }`}
                    step="0.01"
                    min="0.005"
                    value={spendAmount}
                    onChange={(e) => handleAmountChange(e.target.value)}
                    style={{ 
                      MozAppearance: 'textfield',
                      WebkitAppearance: 'none' 
                    }}
                    onKeyDown={(e) => {
                      // Disable arrow keys for incrementing/decrementing
                      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                        e.preventDefault();
                      }
                    }}
                  />
                  <div className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-green-200 text-xs sm:text-sm font-medium pointer-events-none">
                    SOL
                  </div>
                  <style jsx>{`
                    input[type="number"]::-webkit-outer-spin-button,
                    input[type="number"]::-webkit-inner-spin-button {
                      -webkit-appearance: none;
                      margin: 0;
                    }
                    input[type="number"] {
                      -moz-appearance: textfield;
                    }
                  `}</style>
                </div>
                
                {/* Amount Validation Error */}
                {getAmountError() && (
                  <div className="mt-2 text-xs sm:text-sm text-red-400 flex items-center gap-1">
                    <div className="w-1 h-1 bg-red-400 rounded-full"></div>
                    {getAmountError()}
                  </div>
                )}
                
                {/* Live USD Conversion Display */}
                {spendAmount && Number(spendAmount) > 0 && solPriceUSD > 0 && isAmountValid() && (
                  <div className="mt-2 text-xs sm:text-sm text-green-400/80">
                    ≈ ${(Number(spendAmount) * solPriceUSD).toFixed(2)} USD
                  </div>
                )}
              </div>

              {/* Token Output */}
              <div>
                <label className="block text-green-300/80 mb-2 font-medium text-sm sm:text-base">You'll Receive</label>
                <div className="bg-black/40 border border-green-500/30 rounded-lg px-3 sm:px-4 py-2 sm:py-3 text-green-100">
                  <span className="text-xl sm:text-2xl font-bold">{tokenAmount}</span>
                  <span className="text-green-200/70 ml-2 text-sm sm:text-base">$SUSTEXA</span>
                </div>
              </div>

              {/* Purchase Button */}
              <Button 
                onClick={handlePurchase}
                className="w-full bg-gradient-to-r from-green-200 to-green-500 hover:from-green-600 hover:to-green-700 text-green-900 font-bold py-3 sm:py-4 px-4 sm:px-6 rounded-lg sm:rounded-xl transition-all duration-300 transform hover:scale-105 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isPurchasing || !isAmountValid() || !spendAmount}
              >
                {isPurchasing ? 'Processing...' : 'Buy SUSTEXA Tokens'}
              </Button>

              {/* Transaction Info */}
              <div className="text-center text-green-200/60 text-xs sm:text-sm space-y-1">
                <p>Minimum Purchase: 0.1 SOL</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-green-900/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/40">
            <h3 className="text-lg sm:text-xl font-bold text-green-300 mb-3 sm:mb-4">Recent Transactions</h3>
            {transactions.length > 0 ? (
              <div className="space-y-2 sm:space-y-3">
                {transactions.map((tx, index) => (
                  <div key={index} className="bg-green-900/30 rounded-lg p-3 sm:p-4 border border-green-500/20">
                    <div className="flex flex-col sm:flex-row justify-between items-start mb-2 gap-1 sm:gap-0">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full"></div>
                        <span className="text-green-300 font-medium text-sm sm:text-base">Token Purchase</span>
                        <span className="text-green-400 text-xs bg-green-900/50 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded">
                          {tx.status}
                        </span>
                      </div>
                      <div className="text-green-200/60 text-xs">
                        {new Date(tx.timestamp).toLocaleString()}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 text-xs sm:text-sm">
                      <div>
                        <span className="text-green-200/60">SOL Spent:</span>
                        <div className="text-green-300 font-medium">{tx.solAmount.toFixed(4)} SOL</div>
                      </div>
                      <div>
                        <span className="text-green-200/60">USD Value:</span>
                        <div className="text-green-300 font-medium">${tx.usdValue.toFixed(2)}</div>
                      </div>
                      <div>
                        <span className="text-green-200/60">Tokens Received:</span>
                        <div className="text-green-300 font-medium break-words">{tx.tokenAmount} $SUSTEXA</div>
                      </div>
                      <div>
                        <span className="text-green-200/60">Transaction:</span>
                        <div className="flex items-center gap-1 sm:gap-2">
                          <span className="text-green-300 font-mono text-xs break-all sm:break-normal">
                            {tx.signature.slice(0, 6)}...{tx.signature.slice(-6)}
                          </span>
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(tx.signature);
                              showNotification('Transaction signature copied!', 'info');
                            }}
                            className="text-green-400/60 hover:text-green-400 transition-colors flex-shrink-0"
                          >
                            <Copy className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </button>
                          <a
                            href={`https://solscan.io/tx/${tx.signature}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-green-400/60 hover:text-green-400 transition-colors flex-shrink-0"
                          >
                            <ExternalLink className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-green-200/60 py-6 sm:py-8">
                <Wallet className="w-8 h-8 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 opacity-50" />
                <p className="text-sm sm:text-base">No transactions yet</p>
                <p className="text-xs sm:text-sm">Your transaction history will appear here</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
