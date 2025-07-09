import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    console.log('🔄 Fetching SOL price from server-side...');
    
    // Try CoinGecko first (free API, no API key needed)
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=solana&vs_currencies=usd&include_24hr_change=true&include_last_updated_at=true',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'SolanaTokenSite/1.0'
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data.solana) {
          const result = {
            price: data.solana.usd,
            priceChange24h: data.solana.usd_24h_change || 0,
            lastUpdated: new Date(data.solana.last_updated_at * 1000).toISOString(),
            source: 'CoinGecko'
          };
          
          console.log('✅ SOL price fetched from CoinGecko:', result);
          return NextResponse.json(result);
        }
      }
    } catch (coinGeckoError) {
      console.warn('CoinGecko failed:', coinGeckoError);
    }

    // Fallback to CoinLore API
    try {
      const response = await fetch(
        'https://api.coinlore.net/api/ticker/?id=48543', // Solana ID
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        
        if (data && data.length > 0) {
          const solData = data[0];
          const result = {
            price: parseFloat(solData.price_usd),
            priceChange24h: parseFloat(solData.percent_change_24h) || 0,
            lastUpdated: new Date().toISOString(),
            source: 'CoinLore'
          };
          
          console.log('✅ SOL price fetched from CoinLore:', result);
          return NextResponse.json(result);
        }
      }
    } catch (coinLoreError) {
      console.warn('CoinLore failed:', coinLoreError);
    }

    // Fallback to Binance API
    try {
      const response = await fetch(
        'https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT',
        {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        const result = {
          price: parseFloat(data.lastPrice),
          priceChange24h: parseFloat(data.priceChangePercent) || 0,
          lastUpdated: new Date().toISOString(),
          source: 'Binance'
        };
        
        console.log('✅ SOL price fetched from Binance:', result);
        return NextResponse.json(result);
      }
    } catch (binanceError) {
      console.warn('Binance failed:', binanceError);
    }

    // If all APIs fail
    throw new Error('All cryptocurrency APIs failed');
    
  } catch (error) {
    console.error('❌ Error in SOL price API route:', error);
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch Solana price',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
