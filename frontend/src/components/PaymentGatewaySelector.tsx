'use client';

import { useState, useEffect } from 'react';
import StripeCheckoutButton from './StripeCheckoutButton';
import RazorpayCheckoutButton from './RazorpayCheckoutButton';
import proxy from '@/services/proxy';

interface Props {
  type: 'PRODUCT' | 'SERVICE' | 'APPOINTMENT';
  itemId?: number;
  itemSlug?: string;
  amount: number;
  customerName: string;
  customerEmail: string;
}

export default function PaymentGatewaySelector(props: Props) {
  const [gateway, setGateway] = useState<'STRIPE' | 'RAZORPAY'>('STRIPE');
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const { data } = await proxy.get('/payments/exchange-rate');
        if (data && data.rate) setExchangeRate(data.rate);
      } catch (error) {
        console.error('Failed to fetch exchange rate', error);
      }
    };
    fetchRate();
  }, []);

  const getInrAmount = () => {
    if (!exchangeRate) return null;
    return (props.amount * exchangeRate).toLocaleString('en-IN', { maximumFractionDigits: 2 });
  };

  return (
    <div className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-4 w-full">
      <h3 className="text-lg font-semibold text-foreground text-center">Complete Your Payment</h3>
      
      <div className="flex bg-background rounded-lg p-1 border border-border">
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${gateway === 'STRIPE' ? 'bg-indigo-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'}`}
          onClick={() => setGateway('STRIPE')}
        >
          🌍 International
        </button>
        <button 
          className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${gateway === 'RAZORPAY' ? 'bg-blue-600 text-white shadow-md' : 'text-muted-foreground hover:text-foreground hover:bg-surface-2'}`}
          onClick={() => setGateway('RAZORPAY')}
        >
          🇮🇳 India (UPI)
        </button>
      </div>

      <div className="mt-1">
        {gateway === 'RAZORPAY' && exchangeRate && (
          <div className="text-center mb-3">
            <span className="text-sm text-muted-foreground">
              Total in INR: <span className="font-semibold text-foreground">₹{getInrAmount()}</span>
            </span>
          </div>
        )}
        
        {gateway === 'STRIPE' ? (
          <StripeCheckoutButton 
            type={props.type} 
            itemId={props.itemId} 
            itemSlug={props.itemSlug} 
            customerName={props.customerName} 
            customerEmail={props.customerEmail} 
          />
        ) : (
          <RazorpayCheckoutButton 
            type={props.type} 
            itemId={props.itemId} 
            itemSlug={props.itemSlug} 
            amount={props.amount} 
            customerName={props.customerName} 
            customerEmail={props.customerEmail} 
          />
        )}
      </div>
      
      <p className="text-xs text-muted-foreground text-center">
        Secure payments powered by {gateway === 'STRIPE' ? 'Stripe' : 'Razorpay'}.
      </p>
    </div>
  );
}
