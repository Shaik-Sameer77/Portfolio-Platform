'use client';

import Link from 'next/link';

export default function PaymentFailed() {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 pt-32">
      <div className="bg-white/5 border border-white/10 p-8 rounded-2xl max-w-lg w-full text-center backdrop-blur-xl">
        <div className="w-20 h-20 bg-red-500/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">Payment Failed</h1>
        <p className="text-gray-300 mb-8">
          Unfortunately, your payment could not be processed. Please check your payment details and try again.
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
