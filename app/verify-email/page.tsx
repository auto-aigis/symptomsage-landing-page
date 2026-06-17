"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { authApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { Mail, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function VerifyEmailContent() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [showResent, setShowResent] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refresh } = useAuth();

  const token = searchParams.get('token');
  const emailParam = searchParams.get('email');

  useEffect(() => {
    if (emailParam) {
      setEmail(emailParam);
    }
  }, [emailParam]);

  useEffect(() => {
    if (token) {
      verifyToken();
    }
  }, [token]);

  const verifyToken = async () => {
    try {
      await authApi.verifyEmail(token!);
      await refresh();
      setStatus('success');
      setTimeout(() => router.push('/dashboard'), 1500);
    } catch (err) {
      setStatus('error');
      setErrorMessage(err instanceof Error ? err.message : 'Verification failed');
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      await authApi.resendVerification(email);
      setShowResent(true);
      setTimeout(() => setShowResent(false), 3000);
    } catch {
      setErrorMessage('Failed to resend verification email');
    }
  };

  if (token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
        <Card className="w-full max-w-md">
          <CardHeader className="space-y-1 text-center">
            {status === 'loading' && (
              <>
                <Loader2 className="w-12 h-12 mx-auto text-blue-600 animate-spin mb-4" />
                <CardTitle>Verifying your email</CardTitle>
                <CardDescription>Please wait while we confirm your account...</CardDescription>
              </>
            )}
            {status === 'success' && (
              <>
                <CheckCircle className="w-12 h-12 mx-auto text-green-600 mb-4" />
                <CardTitle className="text-green-700">Email verified!</CardTitle>
                <CardDescription>Redirecting you to the dashboard...</CardDescription>
              </>
            )}
            {status === 'error' && (
              <>
                <AlertCircle className="w-12 h-12 mx-auto text-red-600 mb-4" />
                <CardTitle className="text-red-700">Verification failed</CardTitle>
                <CardDescription className="text-red-600">{errorMessage}</CardDescription>
              </>
            )}
          </CardHeader>
          {status === 'error' && (
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/login">Back to login</Link>
              </Button>
            </CardContent>
          )}
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <Mail className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>
            We sent a verification link to{' '}
            <span className="font-medium text-gray-900">{email || 'your email'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-600 text-center">
            Click the link in the email to verify your account. The link expires in 24 hours.
          </p>

          {showResent && (
            <Alert className="bg-green-50 border-green-200">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">Verification email sent!</AlertDescription>
            </Alert>
          )}

          <div className="flex flex-col gap-2">
            <Button variant="outline" onClick={handleResend} disabled={!email}>
              Resend verification email
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/login">Back to login</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full" />
      </div>
    }>
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
