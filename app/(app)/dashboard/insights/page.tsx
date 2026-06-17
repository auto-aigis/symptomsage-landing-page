"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { insightsApi, subscriptionApi, logsApi } from '@/app/_lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { UpgradeModal } from '@/app/_components/UpgradeModal';
import { Loader2, RefreshCw, Sparkles, Lock } from 'lucide-react';

export default function InsightsPage() {
  const [insights, setInsights] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [logCount, setLogCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [insightsData, subData, logsData] = await Promise.all([
        insightsApi.get().catch(() => null),
        subscriptionApi.get().catch(() => ({ tier: 'free' })),
        logsApi.list().catch(() => []),
      ]);
      setInsights(insightsData);
      setSubscription(subData);
      setLogCount(logsData.length);
    } catch (err) {
      console.error('Failed to load insights:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    if (!hasEnoughLogs) return;
    setRefreshing(true);
    try {
      const result = await insightsApi.refresh();
      if (result.status === 'generated') {
        const newInsights = await insightsApi.get();
        setInsights(newInsights);
        setLogCount(result.log_count);
      }
    } catch (err) {
      console.error('Failed to refresh insights:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const canAccessFullInsights = subscription?.tier === 'pro' || subscription?.tier === 'plus';
  const hasEnoughLogs = logCount >= 3;

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">AI Insights</h1>
          <p className="text-gray-600 mt-1">Pattern detection and weekly summary</p>
        </div>
        {hasEnoughLogs && (
          <Button
            variant="outline"
            onClick={handleRefresh}
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
      </div>

      {!hasEnoughLogs ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Sparkles className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keep Logging</h3>
            <p className="text-gray-600 max-w-md mx-auto">
              Insights unlock after you have at least 3 log entries.
              You currently have {logCount} {logCount === 1 ? 'entry' : 'entries'}.
            </p>
          </CardContent>
        </Card>
      ) : insights ? (
        <div className="space-y-6">
          {insights.weekly_summary && (
            <Card>
              <CardHeader>
                <CardTitle>Weekly Summary</CardTitle>
                <CardDescription>AI-generated overview of your past 7 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-blue-900">{insights.weekly_summary}</p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle>Trigger Patterns</CardTitle>
              <CardDescription>
                Significant correlations found in your logs{' '}
                <span className="text-gray-400">(based on {insights.log_count_at_generation} entries)</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {insights.patterns?.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No patterns detected yet. Keep logging!</p>
              ) : (
                <>
                  {insights.patterns
                    ?.slice(0, canAccessFullInsights ? undefined : 1)
                    .map((pattern: any, idx: number) => (
                      <div
                        key={idx}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <p className="text-gray-800">{pattern.pattern_text}</p>
                        <div className="flex gap-2 mt-3">
                          <Badge
                            variant={
                              pattern.confidence === 'High'
                                ? 'default'
                                : pattern.confidence === 'Medium'
                                ? 'secondary'
                                : 'outline'
                            }
                            className={
                              pattern.confidence === 'High'
                                ? 'bg-green-600 hover:bg-green-700'
                                : ''
                            }
                          >
                            {pattern.confidence} Confidence
                          </Badge>
                          <Badge variant="secondary">
                            {pattern.observation_count} observations
                          </Badge>
                        </div>
                      </div>
                    ))}

                  {!canAccessFullInsights && insights.patterns?.length > 1 && (
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent z-10" />
                      <div className="blur-sm space-y-4">
                        {insights.patterns.slice(1).map((pattern: any, idx: number) => (
                          <div
                            key={idx}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 opacity-50"
                          >
                            <p className="text-gray-800">{pattern.pattern_text}</p>
                          </div>
                        ))}
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center z-20">
                        <Button onClick={() => setUpgradeModalOpen(true)}>
                          <Lock className="w-4 h-4 mr-2" />
                          Unlock All Insights
                        </Button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-gray-600">No insights generated yet</p>
            <Button onClick={handleRefresh} className="mt-4">
              Generate Insights
            </Button>
          </CardContent>
        </Card>
      )}

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        feature="Full AI insights dashboard"
      />
    </div>
  );
}
