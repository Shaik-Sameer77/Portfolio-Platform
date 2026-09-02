'use client';

import { useState } from 'react';
import proxy from '@/services/proxy';

interface Props {
  type: 'PRODUCT' | 'SERVICE' | 'APPOINTMENT';
  itemId?: number;
  itemSlug?: string;
  amount: number;
  customerName: string;
  customerEmail: string;
  customerMobile?: string;
}

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export default function RazorpayCheckoutButton({ 
  type, itemId, itemSlug, amount, customerName, customerEmail, customerMobile 
}: Props) {
  const [isLoading, setIsLoading] = useState(false);
  
  const handlePayment = async () => {
    if (isLoading) return;
    setIsLoading(true);

    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      alert('Failed to load Razorpay. Check your internet connection.');
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await proxy.post('/payments/create-order', {
        type,
        itemId,
        itemSlug,
        gateway: 'RAZORPAY',
        customerName,
        customerEmail,
        currency: 'INR',
        amount,
      });

      if (!data.razorpayKeyId) {
        alert('Failed to initiate Razorpay checkout.');
        setIsLoading(false);
        return;
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: data.currency,
        name: 'Portfolio Platform',
        description: `Payment for ${type}`,
        order_id: data.gatewayOrderId,
        prefill: {
          name: customerName,
          email: customerEmail,
          contact: customerMobile || '',
        },
        theme: { color: '#6366f1' },
        handler: async function (response: any) {
          try {
            await proxy.post('/payments/verify-razorpay', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            window.location.href = '/payment/success';
          } catch {
            window.location.href = '/payment/failed';
          }
        },
        modal: {
          ondismiss: function () {
            setIsLoading(false); // Enable the button again if user closes the popup
          },
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.on('payment.failed', function (response: any) {
        setIsLoading(false);
      });
      razorpay.open();
    } catch (error: any) {
      console.error('Razorpay checkout error:', error);
      const message = error.response?.data?.message || 'Failed to initiate Razorpay checkout.';
      alert(message);
      setIsLoading(false);
    }
  };

  return (
    <button 
      onClick={handlePayment} 
      disabled={isLoading}
      className={`bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg w-full transition duration-200 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
    >
      {isLoading ? 'Processing...' : 'Pay with Razorpay (India Only)'}
    </button>
  );
}
