'use client';

import Link from 'next/link';

export default function PaymentCancel() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-32">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-lg w-full text-center backdrop-blur-xl">
        <div className="w-20 h-20 bg-yellow-500/20 text-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Payment Cancelled</h1>
        <p className="text-gray-300 mb-8">
          You have cancelled the checkout process. No charges were made to your account.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/" className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-lg transition">
            Return Home
          </Link>
          <button onClick={() => window.history.back()} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-lg transition">
            Try Again
          </button>
        </div>
      </div>
    </div>
  );
}
