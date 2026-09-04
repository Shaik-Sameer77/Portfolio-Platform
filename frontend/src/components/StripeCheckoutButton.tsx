'use client';

import { useState } from 'react';
import proxy from '@/services/proxy';
import { getErrorMessage } from '@/utils/error';

interface Props {
  type: 'PRODUCT' | 'SERVICE' | 'APPOINTMENT';
  itemId?: number;
  itemSlug?: string;
  customerName: string;
  customerEmail: string;
}

export default function StripeCheckoutButton({ type, itemId, itemSlug, customerName, customerEmail }: Props) {
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const { data } = await proxy.post('/payments/create-order', {
        type,
        itemId,
        itemSlug,
        gateway: 'STRIPE',
        customerName,
        customerEmail,
        currency: 'USD',
      });

      if (data.checkoutUrl) {
        window.location.href = data.checkoutUrl;
      } else {
        alert('Failed to initiate Stripe checkout. Please try again.');
        setIsLoading(false);
      }
    } catch (error: any) {
      console.error('Stripe checkout error:', error);
      alert(getErrorMessage(error, 'Failed to initiate Stripe checkout. Please try again.'));
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCheckout} 
      disabled={isLoading}
      className={`bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Processing...' : 'Pay with Stripe (International)'}
    </button>
  );
}
