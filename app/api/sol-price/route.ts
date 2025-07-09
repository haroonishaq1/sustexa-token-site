import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  try {
    console.log('🔄 API: Fetching SOL price from external APIs...');

    // Try multiple APIs for better reliability
    const apis = [
      {
        name: 'Binance',
        url: 'https://api.binance.com/api/v3/ticker/24hr?symbol=SOLUSDT',
        parser: (data: any) => ({
          price: parseFloat(data.lastPrice),
          change24h: parseFloat(data.priceChangePercent),
        })
      },
      {
        name: 'CoinLore',
        url: 'https://api.coinlore.net/api/ticker/?id=48543',
        parser: (data: any) => ({
          price: parseFloat(data[0].price_usd),
          change24h: parseFloat(data[0].percent_change_24h),
        })
      },
      {
        name: 'CryptoCompare',
        url: 'https://min-api.cryptocompare.com/data/price?fsym=SOL&tsyms=USD',
        parser: (data: any) => ({
          price: parseFloat(data.USD),
          change24h: 0, // This API doesn't provide 24h change
        })
      }
    ];

    for (const api of apis) {
      try {
        console.log(`🌐 Trying ${api.name} API...`);
        
        const response = await fetch(api.url, {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'User-Agent': 'Mozilla/5.0 (compatible; SOL-Price-Fetcher/1.0)',
          },
          signal: AbortSignal.timeout(5000), // 5 second timeout
        });

        if (response.ok) {
          const data = await response.json();
          const parsed = api.parser(data);
          
          if (parsed.price && parsed.price > 0) {
            console.log(`✅ Successfully fetched from ${api.name}:`, parsed);
            
            return NextResponse.json({
              success: true,
              data: {
                price: parsed.price,
                change24h: parsed.change24h,
                source: api.name,
                lastUpdated: new Date().toISOString(),
              }
            });
          }
        }
      } catch (apiError) {
        console.warn(`⚠️ ${api.name} failed:`, apiError);
        continue; // Try next API
      }
    }

    // If all APIs fail
    throw new Error('All price APIs failed');

  } catch (error) {
    console.error('❌ Sol price API error:', error);
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch SOL price',
        data: null,
      },
      { status: 500 }
    );
  }
}
