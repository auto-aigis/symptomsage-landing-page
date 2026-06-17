"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { subscriptionApi, settingsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { Check, Sparkles, Crown, Zap, Users, Share2, Mail, Loader2, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const TIERS = [
  {
    id: 'free',
    name: 'Free',
    monthlyPrice: 0,
    yearlyPrice: 0,
    description: 'Get started with basic tracking',
    features: [
      'Unlimited daily symptom logging',
      'Log history (30 days)',
      '1 AI trigger pattern per week',
      'Basic weekly trend summary',
    ],
    notIncluded: [
      'Full AI insights dashboard',
      'Doctor-ready report generation',
      'Unlimited log history',
    ],
    cta: 'Current Plan',
    popular: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    monthlyPrice: 12,
    yearlyPrice: 99,
    description: 'Advanced insights for serious tracking',
    features: [
      'Everything in Free',
      'Full AI insights dashboard',
      'Daily AI trend summaries',
      'Doctor-ready report (PDF + text)',
      'Unlimited log history',
      'Condition-specific insight framing',
      'Email support',
      '14-day free trial',
    ],
    notIncluded: [
      'Multiple condition profiles',
      'Shareable report links',
      'Priority processing',
    ],
    cta: 'Start Pro Trial',
    popular: true,
  },
  {
    id: 'plus',
    name: 'Plus',
    monthlyPrice: 24,
    yearlyPrice: 199,
    description: 'Maximum features and priority support',
    features: [
      'Everything in Pro',
      'Priority AI processing',
      'Multiple condition profiles (up to 3)',
      'Shareable report links',
      'Early access to new features',
      'Priority email support',
      '14-day free trial',
    ],
    notIncluded: [],
    cta: 'Start Plus Trial',
    popular: false,
  },
];

function PricingContent() {
  const [subscription, setSubscription] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [billingInterval, setBillingInterval] = useState<'monthly' | 'yearly'>('monthly');
  const [paddleReady, setPaddleReady] = useState(false);
  const [checkingOut, setCheckingOut] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const { user, refresh } = useAuth();

  const error = searchParams.get('error');
  const success = searchParams.get('success');

  useEffect(() => {
    loadData();
    initPaddle();
  }, []);

  const loadData = async () => {
    try {
      const [subData, settingsData] = await Promise.all([
        subscriptionApi.get().catch(() => ({ tier: 'free', status: 'inactive' })),
        settingsApi.get().catch(() => null),
      ]);
      setSubscription(subData);
      setSettings(settingsData);
    } catch (err) {
      console.error('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const initPaddle = async () => {
    const clientToken = process.env.NEXT_PUBLIC_PADDLE_CLIENT_TOKEN;
    if (!clientToken) {
      console.warn('Paddle client token not configured');
      return;
    }

    if (typeof window !== 'undefined' && (window as any).Paddle) {
      (window as any).Paddle.Environment.set('sandbox');
      (window as any).Paddle.Initialize({
        token: clientToken,
        eventCallback: (event: Record<string, unknown>) => {
          const eventName = (event as { name?: string }).name;
          if (eventName === 'checkout.completed') {
            const data = event as { data?: { transaction_id?: string } };
            const txnId = data?.data?.transaction_id;
            if (txnId) {
              window.location.href = `/dashboard?checkout=success&transaction_id=${txnId}`;
            }
          }
        },
      });
      setPaddleReady(true);
    }
  };

  const handleCheckout = async (tier: string) => {
    if (!user) {
      window.location.href = '/login';
      return;
    }

    if (tier === 'free') return;

    setCheckingOut(tier);
    try {
      const result = await subscriptionApi.checkout(
        tier as 'pro' | 'plus',
        billingInterval
      );

      if ((window as any).Paddle) {
        (window as any).Paddle.Checkout.open({
          items: [{ priceId: result.price_id, quantity: 1 }],
          customData: { user_id: user.id },
          settings: { displayMode: 'overlay' },
        });
      }
    } catch (err) {
      console.error('Checkout failed:', err);
    } finally {
      setCheckingOut(null);
    }
  };

  const handleManageBilling = async () => {
    // This would open Paddle customer portal - placeholder for now
    alert('Billing management will open in Paddle customer portal');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const currentTier = subscription?.tier || 'free';
  const isPaidTier = currentTier === 'pro' || currentTier === 'plus';

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto">
        {error && (
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{decodeURIComponent(error)}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="mb-6 bg-green-50 border-green-200">
            <AlertDescription className="text-green-800">Payment successful! Welcome to {currentTier === 'pro' ? 'Pro' : 'Plus'}.</AlertDescription>
          </Alert>
        )}

        <div className="text-center mb-12">
          <h1 className="text-3xl font-semibold text-gray-900 mb-4">
            Choose your plan
          </h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Start tracking your symptoms with AI-powered insights. Upgrade anytime to unlock more features.
          </p>

          {isPaidTier && (
            <div className="mt-4">
              <Button variant="outline" onClick={handleManageBilling}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage Billing
              </Button>
            </div>
          )}
        </div>

        {currentTier !== 'free' && (
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 border border-gray-200 inline-flex">
              <button
                onClick={() => setBillingInterval('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingInterval === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingInterval('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors flex items-center gap-1 ${
                  billingInterval === 'yearly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Yearly
                <Badge variant="secondary" className="ml-1 text-xs bg-green-100 text-green-700">
                  Save 31%
                </Badge>
              </button>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6">
          {TIERS.map((tier) => {
            const price = billingInterval === 'monthly' ? tier.monthlyPrice : tier.yearlyPrice;
            const isCurrentTier = currentTier === tier.id;
            const isUpgrade = TIERS.findIndex(t => t.id === currentTier) < TIERS.findIndex(t => t.id === tier.id);

            return (
              <Card
                key={tier.id}
                className={`relative ${tier.popular ? 'border-blue-600 ring-2 ring-blue-600 ring-opacity-50' : ''}`}
              >
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="bg-blue-600">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{tier.name}</CardTitle>
                  <CardDescription>{tier.description}</CardDescription>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${price}
                    </span>
                    {price > 0 && (
                      <span className="text-gray-500">/{billingInterval === 'monthly' ? 'mo' : 'yr'}</span>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {tier.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm">
                        <Check className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                    {tier.notIncluded.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-sm opacity-50">
                        <span className="w-4 h-4 flex-shrink-0 mt-0.5">×</span>
                        <span className="text-gray-500">{feature}</span>
                      </li>
                    ))}
                  </ul>

<Button
                    className="w-full"
                    variant={tier.popular ? 'default' : 'outline'}
                    disabled={isCurrentTier || checkingOut === tier.id || (!paddleReady && tier.id !== 'free')}
                    onClick={() => handleCheckout(tier.id)}
                  >
                    {checkingOut === tier.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : isCurrentTier ? (
                      'Current Plan'
                    ) : !isUpgrade && tier.id !== 'free' ? (
                      'Downgrade'
                    ) : (
                      tier.cta
                    )}
                  </Button>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function PricingPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
    >
      <PricingContent />
    </Suspense>
  );
}
