"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { logsApi, subscriptionApi } from '@/app/_lib/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronDown, ChevronUp, Calendar, Loader2 } from 'lucide-react';

interface LogEntry {
  id: string;
  entry_text: string;
  sleep_quality: number | null;
  energy_level: number | null;
  stress_level: number | null;
  pain_level: number | null;
  logged_at: string;
}

export default function HistoryPage() {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [logsData, subData] = await Promise.all([
        logsApi.list(),
        subscriptionApi.get().catch(() => ({ tier: 'free' })),
      ]);
      setLogs(logsData);
      setSubscription(subData);
    } catch (err) {
      console.error('Failed to load history:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId(prev => prev === id ? null : id);
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const canViewAll = subscription?.tier === 'pro' || subscription?.tier === 'plus';

  const displayLogs = canViewAll ? logs : logs.slice(0, 30);

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Log History</h1>
        <p className="text-gray-600 mt-1">Browse your past symptom entries</p>
        {!canViewAll && logs.length > 30 && (
          <p className="text-sm text-amber-600 mt-2">
            Showing last 30 days. Upgrade to Pro to view unlimited history.
          </p>
        )}
      </div>

      {displayLogs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-600">No log entries yet</p>
            <Button asChild className="mt-4">
              <a href="/dashboard/log">Log your first entry</a>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {displayLogs.map((log) => (
            <Card key={log.id} className="overflow-hidden">
              <button
                onClick={() => toggleExpand(log.id)}
                className="w-full text-left"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className="text-sm font-medium text-gray-900">
                          {formatDate(log.logged_at)}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {log.entry_text || 'No text entry'}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {log.sleep_quality !== null && (
                          <Badge variant="secondary">
                            Sleep: {log.sleep_quality}/10
                          </Badge>
                        )}
                        {log.energy_level !== null && (
                          <Badge variant="secondary">
                            Energy: {log.energy_level}/10
                          </Badge>
                        )}
                        {log.stress_level !== null && (
                          <Badge variant="secondary">
                            Stress: {log.stress_level}/10
                          </Badge>
                        )}
                        {log.pain_level !== null && (
                          <Badge variant="secondary">
                            Pain: {log.pain_level}/10
                          </Badge>
                        )}
                      </div>
                    </div>
                    {expandedId === log.id ? (
                      <ChevronUp className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-gray-400 flex-shrink-0" />
                    )}
                  </div>
                </CardContent>
              </button>

              {expandedId === log.id && log.entry_text && (
                <div className="border-t border-gray-200 px-4 py-4 bg-gray-50">
                  <p className="text-gray-800 whitespace-pre-wrap">{log.entry_text}</p>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
