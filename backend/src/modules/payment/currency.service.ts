import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CurrencyService {
  private readonly logger = new Logger(CurrencyService.name);
  private cachedRate: number | null = null;
  private lastFetchedAt: number = 0;
  private readonly CACHE_DURATION_MS = 12 * 60 * 60 * 1000; // 12 hours cache
  private readonly DEFAULT_FALLBACK_RATE = 83.5; // Fallback in case API goes down entirely

  async getUsdToInrRate(): Promise<number> {
    const now = Date.now();
    
    // Return cached rate if it's still valid
    if (this.cachedRate !== null && (now - this.lastFetchedAt < this.CACHE_DURATION_MS)) {
      return this.cachedRate;
    }

    try {
      this.logger.log('Fetching live exchange rate from Frankfurter API...');
      const response = await fetch('https://api.frankfurter.app/latest?from=USD&to=INR');
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      
      if (data && data.rates && data.rates.INR) {
        const rate = Number(data.rates.INR);
        this.cachedRate = rate;
        this.lastFetchedAt = now;
        this.logger.log(`Exchange rate updated: 1 USD = ${this.cachedRate} INR`);
        return rate;
      } else {
        throw new Error('Invalid data format received from API');
      }
    } catch (error) {
      this.logger.error('Failed to fetch exchange rate, using fallback.', error);
      // If API fails, use the old cached rate, or the default fallback if no cache exists
      return this.cachedRate || this.DEFAULT_FALLBACK_RATE;
    }
  }
}
