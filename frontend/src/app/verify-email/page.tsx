'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import proxy from '@/services/proxy';

type Status = 'loading' | 'success' | 'error';

// Inner component that uses useSearchParams — must be wrapped in Suspense
function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [status, setStatus] = useState<Status>('loading');
  const [message, setMessage] = useState('Verifying your email address…');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('No verification token was provided in the URL.');
      return;
    }

    proxy
      .get(`/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => {
        setStatus('success');
        setMessage(res.data?.message || 'Email successfully verified!');
      })
      .catch((err) => {
        setStatus('error');
        const msg =
          err?.response?.data?.message ||
          (typeof err?.response?.data === 'string' ? err.response.data : null) ||
          'Verification failed. The link may have expired.';
        setMessage(Array.isArray(msg) ? msg.join(' ') : msg);
      });
  }, [token]);

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full">
        {/* Card */}
        <div className="rounded-2xl border border-border bg-surface/60 backdrop-blur-sm p-8 text-center shadow-2xl">
          {/* Icon */}
          <div
            className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full text-3xl transition-all duration-500 ${
              status === 'loading'
                ? 'bg-primary/10 animate-pulse'
                : status === 'success'
                ? 'bg-success/10'
                : 'bg-destructive/10'
            }`}
          >
            {status === 'loading' ? '⏳' : status === 'success' ? '✅' : '❌'}
          </div>

          {/* Heading */}
          <h1 className="font-display text-2xl font-bold tracking-tight text-foreground mb-2">
            {status === 'loading'
              ? 'Verifying…'
              : status === 'success'
              ? 'Email Verified!'
              : 'Verification Failed'}
          </h1>

          {/* Message */}
          <p className="text-sm text-muted-foreground leading-relaxed mb-8">{message}</p>

          {/* Actions */}
          {status !== 'loading' && (
            <div className="flex flex-col gap-3">
              {status === 'success' && (
                <Link
                  href="/blog"
                  className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-all shadow-sm shadow-primary/20 inline-block"
                >
                  Browse the Blog →
                </Link>
              )}
              <Link
                href="/"
                className="w-full rounded-xl border border-border bg-surface/40 py-3 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors inline-block"
              >
                ← Back to Home
              </Link>
            </div>
          )}
        </div>

        {/* Branding */}
        <p className="mt-6 text-center text-xs text-muted-foreground">
          sameer.dev ·{' '}
          <span className="text-primary font-medium">admin@example.com</span>
        </p>
      </div>
    </div>
  );
}

// Skeleton shown while Suspense resolves
function LoadingSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-background">
      <div className="max-w-md w-full rounded-2xl border border-border bg-surface/60 p-8 text-center animate-pulse">
        <div className="mx-auto mb-6 h-16 w-16 rounded-full bg-surface-2" />
        <div className="h-5 w-40 mx-auto rounded bg-surface-2 mb-3" />
        <div className="h-3 w-64 mx-auto rounded bg-surface-2" />
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<LoadingSkeleton />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
