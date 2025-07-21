'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Wallet, CheckCircle, AlertCircle, X } from 'lucide-react';
import Image from 'next/image';
import { connectWallet, disconnectWallet, getPhantomProvider, getSolflareProvider } from '@/lib/wallet-utils';
import { usePresaleCountdown } from '@/hooks/use-presale-countdown';

// Wallet connection functions (ported from client_1-main)
declare global {
  interface Window {
    phantom?: any;
    solana?: any;
    solflare?: any;
    ethereum?: any;
  }
}

export default function PresalePage() {
  const router = useRouter();
  const { timeLeft, phase, isPresaleActive } = usePresaleCountdown();
  
  // Debug logging
  console.log('🐞 Presale Debug:', { phase, isPresaleActive, timeLeft });
  
  // All hooks must be called before any conditional returns
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [isModalClosing, setIsModalClosing] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [connectingWallet, setConnectingWallet] = useState<string | null>(null);
  const [connectedWallet, setConnectedWallet] = useState<string | null>(null);
  const [modalError, setModalError] = useState<string | null>(null);
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

  // Check for existing wallet connection
  useEffect(() => {
    const existingWallet = localStorage.getItem('connectedWallet');
    if (existingWallet) {
      setConnectedWallet(existingWallet);
    }
  }, []);

  // Debug function for testing (can be called from browser console)
  useEffect(() => {
    // Make debug functions available globally for testing
    (window as any).debugWallets = () => {
      console.log('=== WALLET DEBUG INFO ===');
      console.log('window.phantom:', window.phantom);
      console.log('window.solana:', window.solana);
      console.log('window.solflare:', window.solflare);
      console.log('getPhantomProvider():', getPhantomProvider());
      console.log('getSolflareProvider():', getSolflareProvider());
    };

    (window as any).testWalletConnection = async (walletType: 'phantom' | 'solflare') => {
      console.log(`🧪 Testing ${walletType} connection...`);
      try {
        await connectToWallet(walletType);
      } catch (error) {
        console.error('Test connection failed:', error);
      }
    };
  }, []);
  
  // Don't render anything if presale is not active
  if (!isPresaleActive) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-green-300 mb-4">Presale Coming Soon</h1>
          <p className="text-green-200 mb-8">Please wait for the countdown to complete</p>
          <Button onClick={() => router.push('/')} className="bg-green-600 hover:bg-green-700">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  // Check if presale is accessible
  const isPresaleAccessible = phase === 'presale-ending' || phase === 'ended';

  const showNotification = (message: string, type: 'success' | 'error' | 'info') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  // Updated wallet connection functions using wallet-utils
  const connectToWallet = async (walletType: 'phantom' | 'solflare') => {
    setConnectingWallet(walletType.charAt(0).toUpperCase() + walletType.slice(1));
    setModalError(null);
    
    try {
      const result = await connectWallet(walletType);
      if (result && result.publicKey) {
        const publicKey = result.publicKey.toString();
        
        // Store wallet info
        localStorage.setItem('connectedWallet', walletType.charAt(0).toUpperCase() + walletType.slice(1));
        localStorage.setItem('walletPublicKey', publicKey);
        localStorage.setItem('walletAddress', publicKey);
        
        // Update state
        setConnectedWallet(walletType.charAt(0).toUpperCase() + walletType.slice(1));
        setShowWalletModal(false);
        
        showNotification(`Successfully connected to ${walletType.charAt(0).toUpperCase() + walletType.slice(1)} wallet!`, 'success');
        
        // Navigate to dashboard after a short delay
        setTimeout(() => router.push('/dashboard'), 1500);
      } else {
        // If result is null, it means wallet connection failed
        throw new Error(`${walletType.charAt(0).toUpperCase() + walletType.slice(1)} wallet not detected or connection failed`);
      }
    } catch (error: any) {
      // Check if this is a wallet detection error (expected behavior)
      const isWalletNotFound = error.message.includes('not found') || error.message.includes('not detected');
      
      if (isWalletNotFound) {
        // Don't log wallet detection errors to console - this is expected behavior
        const walletName = walletType.charAt(0).toUpperCase() + walletType.slice(1);
        const installMessage = `${walletName} wallet not found. Redirecting to install ${walletName}...`;
        setModalError(installMessage);
        
        // Redirect to wallet installation page after 2 seconds
        setTimeout(() => {
          if (walletType === 'phantom') {
            window.open('https://phantom.app/', '_blank');
          } else if (walletType === 'solflare') {
            window.open('https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic', '_blank');
          }
        }, 2000);
        
      } else {
        // Handle connection errors with user-friendly notifications
        const errorMessage = error.message || `Failed to connect to ${walletType} wallet`;
        setModalError(errorMessage);
        showNotification(errorMessage, 'error');
      }
    } finally {
      setConnectingWallet(null);
    }
  };

  const closeModal = () => {
    setIsModalClosing(true);
    setTimeout(() => {
      setShowWalletModal(false);
      setIsModalClosing(false);
      setModalError(null);
      setConnectingWallet(null);
    }, 300); // Match animation duration
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
      
      // Reset state
      setConnectedWallet(null);
      
      showNotification('Wallet disconnected successfully', 'info');
    } catch (error) {
      console.error('❌ Error disconnecting wallet:', error);
      showNotification('Error disconnecting wallet', 'error');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-600 via-emerald-700 to-black relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-400/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-400/5 rounded-full blur-3xl"></div>
      </div>

      {/* Notification */}
      {notification && (
        <div className={`fixed top-4 right-4 p-3 sm:p-4 rounded-lg shadow-lg z-50 transform transition-all duration-300 border max-w-xs sm:max-w-sm ${
          notification.type === 'success' 
            ? 'bg-green-900/90 text-green-100 border-green-500/50 backdrop-blur-md' :
          notification.type === 'error' 
            ? 'bg-green-900/90 text-red-200 border-red-400/50 backdrop-blur-md' :
            'bg-green-900/90 text-blue-200 border-blue-400/50 backdrop-blur-md'
        }`}>
          <div className="flex items-center space-x-2">
            {notification.type === 'success' && (
              <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-400 flex-shrink-0" />
            )}
            {notification.type === 'error' && (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-400 flex-shrink-0" />
            )}
            {notification.type === 'info' && (
              <AlertCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-400 flex-shrink-0" />
            )}
            <span className="font-medium text-xs sm:text-sm break-words">{notification.message}</span>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
        <Button 
          onClick={() => router.push('/')}
          variant="ghost" 
          className="text-green-300 hover:bg-green-900/20 flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="text-sm sm:text-base">Back to Home</span>
        </Button>

        {connectedWallet && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <div className="bg-green-900/40 backdrop-blur-md rounded-lg px-3 py-2 text-green-300 border border-green-500/30">
              <span className="text-xs sm:text-sm truncate">Connected: {connectedWallet}</span>
            </div>
            <Button 
              onClick={disconnectWalletHandler}
              variant="ghost"
              className="text-green-300/70 hover:text-green-300 text-sm"
            >
              Disconnect
            </Button>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] px-4 sm:px-6">
        <div className="max-w-md w-full">
          {/* Logo/Icon */}
          <div className="text-center mb-6 sm:mb-8">
            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-3 sm:mb-4 flex items-center justify-center">
              <Image 
                src="/logo.png" 
                alt="SUSTEXA Logo" 
                width={64} 
                height={64}
                className="object-contain sm:w-20 sm:h-20"
              />
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-green-300 mb-2 tracking-wider">SUSTEXA Presale</h1>
            <p className="text-green-200/70 text-sm sm:text-base px-2">Connect your wallet to participate in the presale</p>
          </div>

          {/* Wallet Connection Card */}
          <div className="bg-green-900/20 backdrop-blur-md rounded-xl sm:rounded-2xl p-6 sm:p-8 border border-green-500/40">
            {!connectedWallet ? (
              <>
                <h2 className="text-lg sm:text-xl font-semibold text-green-300 mb-4 sm:mb-6 text-center">
                  Connect Your Wallet
                </h2>
                
                <Button
                  onClick={() => setShowWalletModal(true)}
                  disabled={connectingWallet !== null}
                  className="w-full bg-gradient-to-r from-green-200 to-green-500 hover:from-green-600 hover:to-green-700 text-green-900 font-semibold py-3 sm:py-4 px-4 sm:px-6 rounded-lg transition-all duration-300 disabled:opacity-50 transform hover:scale-105 active:scale-95 hover:shadow-lg hover:shadow-green-500/25"
                >
                  <div className="flex items-center justify-center space-x-2 sm:space-x-3">
                    {connectingWallet ? (
                      <>
                        <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-green-900 border-t-transparent rounded-full"></div>
                        <span className="text-sm sm:text-base">Connecting to {connectingWallet}...</span>
                      </>
                    ) : (
                      <>
                        <Wallet className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span className="text-sm sm:text-base">Connect Wallet</span>
                      </>
                    )}
                  </div>
                </Button>

                <div className="mt-4 sm:mt-6 text-center text-green-200/60 text-xs sm:text-sm">
                  <p>Choose from supported wallets</p>
                </div>
              </>
            ) : (
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <CheckCircle className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <h2 className="text-lg sm:text-xl font-semibold text-green-300 mb-2">Wallet Connected!</h2>
                <p className="text-green-200/70 mb-4 sm:mb-6 text-sm sm:text-base">You're ready to access the dashboard</p>
                
                <Button
                  onClick={() => router.push('/dashboard')}
                  className="w-full bg-gradient-to-r from-green-200 to-green-500 hover:from-green-600 hover:to-green-700 text-green-900 font-semibold py-2.5 sm:py-3 rounded-lg text-sm sm:text-base"
                >
                  Go to Dashboard
                </Button>
              </div>
            )}
          </div>

          {/* Info Cards */}
          <div className="mt-6 sm:mt-8 grid grid-cols-2 gap-3 sm:gap-4">
            <div className="bg-green-900/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-green-500/30">
              <div className="text-xl sm:text-2xl font-bold text-green-200">$0.002</div>
              <div className="text-green-200/60 text-xs sm:text-sm">Token Price</div>
            </div>
            <div className="bg-green-900/20 backdrop-blur-sm rounded-lg p-3 sm:p-4 text-center border border-green-500/30">
              <div className="text-base sm:text-lg font-bold text-green-200">
                {timeLeft.days}d {timeLeft.hours.toString().padStart(2, '0')}h {timeLeft.minutes.toString().padStart(2, '0')}m
              </div>
              <div className="text-green-200/60 text-xs sm:text-sm">Time Left</div>
            </div>
          </div>
        </div>
      </div>

      {/* Wallet Selection Modal */}
      {showWalletModal && (
        <div className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300 ${
          isModalClosing ? 'animate-out fade-out duration-300' : 'animate-in fade-in duration-300'
        }`}>
          <div className={`bg-green-900/30 backdrop-blur-md rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-green-500/40 max-w-sm sm:max-w-md w-full relative transition-all duration-500 ease-out ${
            isModalClosing 
              ? 'animate-out slide-out-to-bottom-4 zoom-out-95 duration-300' 
              : 'animate-in slide-in-from-bottom-4 zoom-in-95 duration-500'
          }`}>
            <button
              onClick={closeModal}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-green-300/70 hover:text-green-300"
            >
              <X className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            
            <div className="text-center mb-4 sm:mb-6 pr-6">
              <h3 className="text-xl sm:text-2xl font-bold text-green-300 mb-1 sm:mb-2">Choose Wallet</h3>
              <p className="text-green-200/70 text-sm sm:text-base">Select your preferred wallet to connect</p>
            </div>
            
            {/* Error Message in Modal */}
            {modalError && (
              <div className="mb-3 sm:mb-4 p-2.5 sm:p-3 bg-red-500/20 border border-red-500/40 rounded-lg">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="w-3 h-3 sm:w-4 sm:h-4 text-red-400 flex-shrink-0" />
                  <span className="text-red-200 text-xs sm:text-sm">{modalError}</span>
                </div>
              </div>
            )}
            
            <div className="space-y-3 sm:space-y-4">
              {/* Phantom Wallet Option */}
              <button
                onClick={() => connectToWallet('phantom')}
                disabled={connectingWallet !== null}
                className="w-full bg-green-900/20 hover:bg-green-900/40 border border-green-500/30 rounded-lg p-3 sm:p-4 text-left transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] hover:border-green-400/50 active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-purple-600/20 border border-purple-500/30 rounded-lg flex items-center justify-center flex-shrink-0 p-1.5 sm:p-2">
                      <Image 
                        src="/phantom-logo.svg" 
                        alt="Phantom Logo" 
                        width={32} 
                        height={32}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-green-300 font-semibold text-sm sm:text-base">Phantom</div>
                      <div className="text-green-200/60 text-xs sm:text-sm">Popular Solana wallet</div>
                    </div>
                  </div>
                  {connectingWallet === 'Phantom' && (
                    <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-green-400 border-t-transparent rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </button>

              {/* Solflare Wallet Option */}
              <button
                onClick={() => connectToWallet('solflare')}
                disabled={connectingWallet !== null}
                className="w-full bg-green-900/20 hover:bg-green-900/40 border border-green-500/30 rounded-lg p-3 sm:p-4 text-left transition-all duration-300 disabled:opacity-50 transform hover:scale-[1.02] hover:border-green-400/50 active:scale-[0.98]"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 sm:space-x-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-orange-600/20 border border-orange-500/30 rounded-lg flex items-center justify-center flex-shrink-0 p-1.5 sm:p-2">
                      <Image 
                        src="/Solflare_logo.png" 
                        alt="Solflare Logo" 
                        width={32} 
                        height={32}
                        className="w-full h-full object-contain"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-green-300 font-semibold text-sm sm:text-base">Solflare</div>
                      <div className="text-green-200/60 text-xs sm:text-sm">Advanced Solana wallet</div>
                    </div>
                  </div>
                  {connectingWallet === 'Solflare' && (
                    <div className="animate-spin h-4 w-4 sm:h-5 sm:w-5 border-2 border-green-400 border-t-transparent rounded-full flex-shrink-0"></div>
                  )}
                </div>
              </button>
            </div>

            <div className="mt-4 sm:mt-6 text-center text-green-200/60 text-xs sm:text-sm">
              <p>
                Don't have a wallet?{' '}
                <a 
                  href="https://phantom.app/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline"
                >
                  Get Phantom
                </a>
                {' '}or{' '}
                <a 
                  href="https://chromewebstore.google.com/detail/solflare-wallet/bhhhlbepdkbapadjdnnojkbgioiodbic" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-green-400 hover:text-green-300 underline"
                >
                  Get Solflare
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
