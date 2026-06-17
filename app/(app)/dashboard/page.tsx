"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { insightsApi, subscriptionApi, logsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { UpgradeModal } from '@/app/_components/UpgradeModal';
import {
  ClipboardList,
  BarChart2,
  FileText,
  Calendar,
  ArrowRight,
  Sparkles,
  Info,
  RefreshCw,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

function DashboardContent() {
  const { user } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [insights, setInsights] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [logCount, setLogCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const [processingPayment, setProcessingPayment] = useState(false);

  const checkoutSuccess = searchParams.get('checkout') === 'success';
  const transactionId = searchParams.get('transaction_id');

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    if (checkoutSuccess && transactionId) {
      verifyTransaction(transactionId);
    }
  }, [checkoutSuccess, transactionId]);

  const verifyTransaction = async (txnId: string) => {
    try {
      await subscriptionApi.verifyTransaction(txnId);
      const sub = await subscriptionApi.get();
      setSubscription(sub);
      router.replace('/dashboard');
    } catch (err) {
      console.error('Transaction verification failed:', err);
    }
  };

  const loadData = async () => {
    try {
      const [insightsData, subData, logsData] = await Promise.all([
        insightsApi.get().catch(() => null),
        subscriptionApi.get().catch(() => ({ tier: 'free', status: 'inactive' })),
        logsApi.list().catch(() => []),
      ]);
      setInsights(insightsData);
      setSubscription(subData);
      setLogCount(logsData.length);
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshInsights = async () => {
    setRefreshing(true);
    try {
      const result = await insightsApi.refresh();
      if (result.status === 'generated') {
        const newInsights = await insightsApi.get();
        setInsights(newInsights);
      }
    } catch (err) {
      console.error('Failed to refresh insights:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const canAccessFullInsights = subscription?.tier === 'pro' || subscription?.tier === 'plus';
  const canAccessReport = subscription?.tier === 'pro' || subscription?.tier === 'plus';
  const hasEnoughLogs = logCount >= 3;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6">
      {checkoutSuccess && (
        <Alert className="bg-green-50 border-green-200">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            Payment successful! Your subscription is now active.
          </AlertDescription>
        </Alert>
      )}

      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Welcome back{user?.display_name ? `, ${user.display_name}` : ''}
        </h1>
        <p className="text-gray-600 mt-1">Here&apos;s an overview of your health journey</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Logs</CardTitle>
            <ClipboardList className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{logCount}</div>
            <p className="text-xs text-gray-500 mt-1">{hasEnoughLogs ? 'Insights unlocked' : `${3 - logCount} more to unlock insights`}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Subscription</CardTitle>
            <Sparkles className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900 capitalize">{subscription?.tier || 'Free'}</div>
            <p className="text-xs text-gray-500 mt-1">
              {subscription?.status === 'trialing' ? `Trial ends ${new Date(subscription.trial_ends_at).toLocaleDateString()}` : 
               subscription?.status === 'active' ? 'Active' : 'Free tier'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Conditions</CardTitle>
            <Info className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{user?.conditions?.length || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Being tracked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Insights</CardTitle>
            <BarChart2 className="w-4 h-4 text-gray-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {insights?.patterns?.length || 0}
            </div>
            <p className="text-xs text-gray-500 mt-1">Patterns detected</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Button asChild className="h-auto py-4">
          <Link href="/dashboard/log">
            <div className="flex items-center gap-3">
              <ClipboardList className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Log Today&apos;s Symptoms</div>
                <div className="text-xs opacity-80">Record how you&apos;re feeling</div>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </div>
          </Link>
        </Button>

        <Button asChild variant="outline" className="h-auto py-4">
          <Link href="/dashboard/history">
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">View History</div>
                <div className="text-xs text-gray-500">Browse past entries</div>
              </div>
              <ArrowRight className="w-4 h-4 ml-auto" />
            </div>
          </Link>
        </Button>

        {canAccessReport ? (
          <Button asChild variant="outline" className="h-auto py-4">
            <Link href="/dashboard/report">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5" />
                <div className="text-left">
                  <div className="font-medium">Generate Report</div>
                  <div className="text-xs text-gray-500">Doctor-ready summary</div>
                </div>
                <ArrowRight className="w-4 h-4 ml-auto" />
              </div>
            </Link>
          </Button>
        ) : (
          <Button variant="outline" className="h-auto py-4" onClick={() => setUpgradeModalOpen(true)}>
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5" />
              <div className="text-left">
                <div className="font-medium">Generate Report</div>
                <div className="text-xs text-gray-500">Upgrade to unlock</div>
              </div>
              <Sparkles className="w-4 h-4 ml-auto text-blue-600" />
            </div>
          </Button>
        )}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>AI Insights</CardTitle>
            <CardDescription>Pattern detection and weekly summary</CardDescription>
          </div>
          {hasEnoughLogs && (
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshInsights}
              disabled={refreshing}
            >
              {refreshing ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <RefreshCw className="w-4 h-4" />
              )}
              <span className="ml-2">Refresh</span>
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {!hasEnoughLogs ? (
            <div className="text-center py-8">
              <ClipboardList className="w-12 h-12 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-600">Keep logging — insights unlock after 3 entries</p>
              <Button asChild className="mt-4">
                <Link href="/dashboard/log">Log your first entry</Link>
              </Button>
            </div>
          ) : insights ? (
            <div className="space-y-6">
              {insights.weekly_summary && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-900 mb-2">Weekly Summary</h4>
                  <p className="text-blue-800 text-sm">{insights.weekly_summary}</p>
                </div>
              )}

              <div className="space-y-3">
                <h4 className="font-medium text-gray-900">Trigger Patterns</h4>
                {insights.patterns?.slice(0, canAccessFullInsights ? undefined : 1).map((pattern: any, idx: number) => (
                  <div
                    key={idx}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                  >
                    <p className="text-gray-800 text-sm">{pattern.pattern_text}</p>
                    <div className="flex gap-2 mt-3">
                      <Badge variant="secondary">
                        {pattern.confidence} Confidence
                      </Badge>
                      <Badge variant="outline">
                        {pattern.observation_count} observations
                      </Badge>
                    </div>
                  </div>
                ))}

                {!canAccessFullInsights && insights.patterns?.length > 1 && (
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
                    <div className="blur-sm space-y-3">
                      {insights.patterns.slice(1).map((pattern: any, idx: number) => (
                        <div
                          key={idx}
                          className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-50"
                        >
                          <p className="text-gray-800 text-sm">{pattern.pattern_text}</p>
                        </div>
                      ))}
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Button onClick={() => setUpgradeModalOpen(true)}>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Unlock All Insights
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-600">No insights available yet</p>
              <Button onClick={handleRefreshInsights} className="mt-4">
                Generate Insights
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        feature="Full AI insights dashboard"
      />
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
    >
      <DashboardContent />
    </Suspense>
  );
}
