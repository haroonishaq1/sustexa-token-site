'use client';

import React from 'react';
import { TrendingUp, TrendingDown, RefreshCw } from 'lucide-react';
import { useSolanaPrice } from '@/hooks/use-solana-price';

interface SolanaPriceDisplayProps {
  className?: string;
  showRefreshButton?: boolean;
  compact?: boolean;
}

export function SolanaPriceDisplay({ 
  className = '', 
  showRefreshButton = false,
  compact = false 
}: SolanaPriceDisplayProps) {
  const { price, priceChange24h, lastUpdated, isLoading, error, refetch } = useSolanaPrice();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    }).format(price);
  };

  const formatPercentage = (change: number) => {
    const formatted = Math.abs(change).toFixed(2);
    return change >= 0 ? `+${formatted}%` : `-${formatted}%`;
  };

  const formatLastUpdated = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (error) {
    return (
      <div className={`bg-red-900/20 border border-red-500/40 rounded-lg p-4 ${className}`}>
        <div className="text-red-300 text-sm">
          <p>⚠️ Failed to load SOL price</p>
          <p className="text-red-200/70 text-xs mt-1">{error}</p>
          {showRefreshButton && (
            <button
              onClick={refetch}
              className="mt-2 text-red-200 hover:text-red-100 text-xs flex items-center gap-1"
            >
              <RefreshCw className="w-3 h-3" />
              Retry
            </button>
          )}
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <div className="flex items-center gap-1">
          <span className="text-green-200 font-mono text-sm">SOL</span>
          <span className="text-green-100 font-bold">
            {isLoading ? '...' : formatPrice(price)}
          </span>
        </div>
        
        {!isLoading && (
          <div className={`flex items-center gap-1 text-xs ${
            priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {priceChange24h >= 0 ? (
              <TrendingUp className="w-3 h-3" />
            ) : (
              <TrendingDown className="w-3 h-3" />
            )}
            <span>{formatPercentage(priceChange24h)}</span>
          </div>
        )}
        
        {isLoading && (
          <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-green-900/20 backdrop-blur-md rounded-2xl p-6 border border-green-500/40 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-green-300 flex items-center gap-2">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full flex items-center justify-center">
            <span className="text-white text-xs font-bold">SOL</span>
          </div>
          Solana Price
        </h3>
        
        {showRefreshButton && (
          <button
            onClick={refetch}
            className="text-green-200/70 hover:text-green-200 transition-colors"
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>

      <div className="space-y-3">
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-green-100">
            {isLoading ? (
              <div className="h-8 w-24 bg-green-400/20 rounded animate-pulse"></div>
            ) : (
              formatPrice(price)
            )}
          </span>
          <span className="text-green-200/70 text-sm">USD</span>
        </div>
        
        {!isLoading && (
          <div className={`flex items-center gap-2 ${
            priceChange24h >= 0 ? 'text-green-400' : 'text-red-400'
          }`}>
            {priceChange24h >= 0 ? (
              <TrendingUp className="w-4 h-4" />
            ) : (
              <TrendingDown className="w-4 h-4" />
            )}
            <span className="font-semibold">{formatPercentage(priceChange24h)}</span>
            <span className="text-green-200/70 text-sm">24h</span>
          </div>
        )}
        
        {lastUpdated && (
          <div className="text-green-200/50 text-xs flex items-center gap-1">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span>Last updated: {formatLastUpdated(lastUpdated)}</span>
          </div>
        )}
        
        {isLoading && !lastUpdated && (
          <div className="flex items-center gap-2 text-green-200/70 text-sm">
            <div className="w-4 h-4 border-2 border-green-400/30 border-t-green-400 rounded-full animate-spin"></div>
            <span>Loading live price...</span>
          </div>
        )}
      </div>
    </div>
  );
}
