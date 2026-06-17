"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { logsApi } from '@/app/_lib/api';
import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const SLIDER_CONFIG = [
  { key: 'sleep_quality', label: 'Sleep Quality', min: 1, max: 10, icon: '😴' },
  { key: 'energy_level', label: 'Energy Level', min: 1, max: 10, icon: '⚡' },
  { key: 'stress_level', label: 'Stress Level', min: 1, max: 10, icon: '😰' },
  { key: 'pain_level', label: 'Pain Level', min: 0, max: 10, icon: '🤕' },
];

export default function LogEntryPage() {
  const [entryText, setEntryText] = useState('');
  const [sliders, setSliders] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const hasContent = entryText.trim() || Object.keys(sliders).length > 0;

  const handleSliderChange = (key: string, value: number) => {
    setSliders(prev => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!hasContent) {
      setError('Please add some text or at least one metric');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await logsApi.create({
        entry_text: entryText.trim() || undefined,
        ...sliders,
      });
      setSuccess(true);
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save entry');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="p-6 md:p-8">
        <Card className="max-w-lg mx-auto">
          <CardContent className="pt-6 text-center">
            <CheckCircle className="w-16 h-16 mx-auto text-green-600 mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Entry Saved!</h2>
            <p className="text-gray-600">Your symptoms have been logged successfully.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">How are you feeling today?</h1>
      <p className="text-gray-600 mb-6">Describe your symptoms, energy, mood, food, sleep — anything relevant.</p>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="pt-6 space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div>
              <Textarea
                placeholder="Started the day with a dull headache, had coffee around 10am, noticed increased bloating after lunch..."
                value={entryText}
                onChange={(e) => setEntryText(e.target.value)}
                className="min-h-[200px] resize-none"
              />
            </div>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-gray-900">Quick Metrics</h3>
                <span className="text-sm text-gray-500">Optional</span>
              </div>

              {SLIDER_CONFIG.map((config) => (
                <div key={config.key} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      {config.icon} {config.label}
                    </span>
                    <span className="text-sm text-gray-900 font-medium">
                      {sliders[config.key] ?? '-'}
                    </span>
                  </div>
                  <input
                    type="range"
                    min={config.min}
                    max={config.max}
                    value={sliders[config.key] ?? config.min}
                    onChange={(e) => handleSliderChange(config.key, parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>{config.min === 0 ? 'None' : 'Very Low'}</span>
                    <span>Very High</span>
                  </div>
                </div>
              ))}
            </div>

            <Button type="submit" className="w-full" disabled={loading || !hasContent}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Entry'
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
