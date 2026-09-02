'use client';

import Link from 'next/link';
import { useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';

export default function PaymentSuccess() {
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    // Clear the cart when the user lands on the success page
    clearCart();
  }, [clearCart]);

  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-32">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-lg w-full text-center backdrop-blur-xl">
        <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Payment Successful!</h1>
        <p className="text-gray-300 mb-8">
          Thank you for your purchase. Your payment has been confirmed successfully. You will receive an email shortly with the details.
        </p>
        <Link href="/" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition">
          Return Home
        </Link>
      </div>
    </div>
  );
}
