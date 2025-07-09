'use client';

import { useState, useEffect, useCallback } from 'react';

interface UseSolanaPriceReturn {
  price: number;
  priceChange24h: number;
  lastUpdated: Date | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

export function useSolanaPrice(): UseSolanaPriceReturn {
  const [price, setPrice] = useState<number>(0);
  const [priceChange24h, setPriceChange24h] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSolanaPrice = useCallback(async () => {
    try {
      setError(null);
      
      console.log('🔄 Fetching SOL price from internal API...');
      
      // Use our internal API route to avoid CORS issues
      const response = await fetch('/api/solana-price', {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        
        if (data.price) {
          setPrice(data.price);
          setPriceChange24h(data.priceChange24h || 0);
          setLastUpdated(new Date(data.lastUpdated));
          setIsLoading(false);
          
          console.log(`✅ SOL price updated from ${data.source}:`, {
            price: data.price,
            change: data.priceChange24h,
            timestamp: new Date(data.lastUpdated)
          });
          return;
        } else {
          throw new Error('Invalid response format');
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `API error: ${response.status}`);
      }
      
    } catch (err) {
      console.error('❌ Failed to fetch SOL price:', err);
      
      // Set specific error messages
      if (err instanceof TypeError && err.message === 'Failed to fetch') {
        setError('Network error - Unable to connect to price API');
      } else {
        setError(err instanceof Error ? err.message : 'Unknown error occurred');
      }
      
      setIsLoading(false);
      
      // Don't update price on error, keep the last known price
      console.warn('⚠️ Keeping last known price due to fetch error');
    }
  }, []);

  const refetch = useCallback(() => {
    setIsLoading(true);
    fetchSolanaPrice();
  }, [fetchSolanaPrice]);

  useEffect(() => {
    // Initial fetch
    fetchSolanaPrice();

    // Set up interval for auto-updates every 5 seconds
    const interval = setInterval(() => {
      console.log('🔄 Fetching SOL price update...');
      fetchSolanaPrice();
    }, 5000); // 5 seconds as requested

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, [fetchSolanaPrice]);

  return {
    price,
    priceChange24h,
    lastUpdated,
    isLoading,
    error,
    refetch,
  };
}
