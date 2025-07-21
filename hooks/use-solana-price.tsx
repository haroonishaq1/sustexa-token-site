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
      const response = await fetch('/api/sol-price', {
        method: 'GET',
        headers: { 
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.success && data.data) {
        setPrice(data.data.price);
        setPriceChange24h(data.data.change24h || 0);
        setLastUpdated(new Date());
        setIsLoading(false);
        
        console.log('✅ SOL price updated:', {
          price: data.data.price,
          change: data.data.change24h,
          source: data.data.source,
          timestamp: new Date()
        });
      } else {
        throw new Error(data.error || 'No price data available');
      }
      
    } catch (err) {
      console.error('❌ Failed to fetch SOL price:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch SOL price');
      setIsLoading(false);
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
      console.log('🔄 Auto-fetching SOL price update...');
      fetchSolanaPrice();
    }, 5000);

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
