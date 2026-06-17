"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { reportsApi, subscriptionApi } from '@/app/_lib/api';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { UpgradeModal } from '@/app/_components/UpgradeModal';
import { Loader2, FileText, Copy, Download, Share2, Lock, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const DEFAULT_DAYS = 30;

export default function ReportPage() {
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [dateFrom, setDateFrom] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - DEFAULT_DAYS);
    return d.toISOString().split('T')[0];
  });
  const [dateTo, setDateTo] = useState(() => new Date().toISOString().split('T')[0]);
  const [report, setReport] = useState<any>(null);
  const [error, setError] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);
  const [upgradeModalOpen, setUpgradeModalOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const subData = await subscriptionApi.get().catch(() => ({ tier: 'free' }));
      setSubscription(subData);
    } catch (err) {
      console.error('Failed to load subscription:', err);
    } finally {
      setLoading(false);
    }
  };

  const canAccessReport = subscription?.tier === 'pro' || subscription?.tier === 'plus';
  const canShare = subscription?.tier === 'plus';

  const handleGenerate = async () => {
    if (!canAccessReport) {
      setUpgradeModalOpen(true);
      return;
    }

    setGenerating(true);
    setError('');
    setReport(null);

    try {
      const result = await reportsApi.generate(
        `${dateFrom}T00:00:00`,
        `${dateTo}T23:59:59`
      );
      setReport(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate report');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopy = async () => {
    if (!report) return;
    await navigator.clipboard.writeText(report.content_text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (!report) return;
    try {
      const result = await reportsApi.getShareUrl(report.id);
      setShareUrl(result.share_url);
    } catch (err) {
      console.error('Failed to get share URL:', err);
    }
  };

  const handleDownloadPDF = () => {
    if (!report) return;
    const content = report.content_text;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `symptomsage-report-${dateFrom}-to-${dateTo}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div className="p-6 md:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Doctor-Ready Report</h1>
        <p className="text-gray-600 mt-1">Generate a shareable summary for your healthcare provider</p>
      </div>

      {!canAccessReport ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Lock className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Pro Feature</h3>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Generate professional reports to share with your healthcare provider.
              Upgrade to Pro or Plus to unlock this feature.
            </p>
            <Button onClick={() => setUpgradeModalOpen(true)}>
              View Pricing
            </Button>
          </CardContent>
        </Card>
      ) : (
        <>
          <Card>
            <CardHeader>
              <CardTitle>Select Date Range</CardTitle>
              <CardDescription>Choose the period to include in your report</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => setDateFrom(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => setDateTo(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  />
                </div>
              </div>

              <Button onClick={handleGenerate} disabled={generating} className="w-full">
                {generating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <FileText className="w-4 h-4 mr-2" />
                    Generate Report
                  </>
                )}
              </Button>

              {error && (
                <Alert variant="destructive">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>

          {report && (
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Your Report</CardTitle>
                  <CardDescription>
                    {new Date(dateFrom).toLocaleDateString()} — {new Date(dateTo).toLocaleDateString()}
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handleCopy}>
                    {copied ? 'Copied!' : <><Copy className="w-4 h-4 mr-1" /> Copy</>}
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownloadPDF}>
                    <Download className="w-4 h-4 mr-1" /> Download
                  </Button>
                  {canShare && (
                    <Button variant="outline" size="sm" onClick={handleShare}>
                      <Share2 className="w-4 h-4 mr-1" /> Share
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 whitespace-pre-wrap text-gray-800">
                  {report.content_text}
                </div>

                {shareUrl && (
                  <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-900 mb-2">Shareable link (valid for 30 days):</p>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-blue-300 rounded text-sm"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          navigator.clipboard.writeText(shareUrl);
                          setCopied(true);
                          setTimeout(() => setCopied(false), 2000);
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </>
      )}

      <UpgradeModal
        open={upgradeModalOpen}
        onOpenChange={setUpgradeModalOpen}
        feature="Doctor-ready report generation"
      />
    </div>
  );
}
