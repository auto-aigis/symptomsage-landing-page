"use client";

export const dynamic = 'force-dynamic';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { settingsApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { Check, ChevronRight, ChevronLeft, Clock, Sparkles, Heart, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const CONDITIONS = [
  { id: 'IBS', label: 'IBS', description: 'Irritable Bowel Syndrome' },
  { id: 'Migraine', label: 'Migraine', description: 'Chronic migraine attacks' },
  { id: 'Long COVID', label: 'Long COVID', description: 'Post-COVID symptoms' },
  { id: 'Fibromyalgia', label: 'Fibromyalgia', description: 'Widespread pain condition' },
  { id: 'Chronic Pain', label: 'Chronic Pain', description: 'Persistent pain issues' },
  { id: 'Autoimmune', label: 'Autoimmune', description: 'Autoimmune conditions' },
  { id: 'Other', label: 'Other', description: 'Other chronic condition' },
];

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { refresh } = useAuth();

  const toggleCondition = (id: string) => {
    setSelectedConditions(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    setError('');
    try {
      await settingsApi.update({
        conditions: selectedConditions,
        reminder_time: reminderTime || undefined,
      });
      await refresh();
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to complete onboarding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 mb-4">
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>1</span>
            <span className="w-8 h-px bg-gray-300" />
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>2</span>
            <span className="w-8 h-px bg-gray-300" />
            <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
            }`}>3</span>
          </div>
          <h1 className="text-2xl font-semibold text-gray-900">
            {step === 1 && 'Select your condition(s)'}
            {step === 2 && 'Set a daily reminder'}
            {step === 3 && 'What to expect'}
          </h1>
          <p className="text-gray-600 mt-2">
            {step === 1 && 'Choose the conditions you want to track'}
            {step === 2 && 'Get a gentle nudge to log your symptoms'}
            {step === 3 && 'See how AI insights will help you'}
          </p>
        </div>

        <Card>
          <CardContent className="pt-6">
            {error && (
              <Alert variant="destructive" className="mb-6">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {step === 1 && (
              <div className="space-y-3">
                {CONDITIONS.map((condition) => (
                  <button
                    key={condition.id}
                    onClick={() => toggleCondition(condition.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-lg border-2 transition-all ${
                      selectedConditions.includes(condition.id)
                        ? 'border-blue-600 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-left">
                      <div className="font-medium text-gray-900">{condition.label}</div>
                      <div className="text-sm text-gray-500">{condition.description}</div>
                    </div>
                    {selectedConditions.includes(condition.id) && (
                      <Check className="w-5 h-5 text-blue-600" />
                    )}
                  </button>
                ))}
              </div>
            )}

            {step === 2 && (
              <div className="space-y-6">
                <div className="text-center">
                  <Clock className="w-12 h-12 mx-auto text-blue-600 mb-4" />
                  <p className="text-gray-600">
                    Set a daily reminder time to log your symptoms.
                    <br />This is optional — you can skip this step.
                  </p>
                </div>
                <div className="max-w-xs mx-auto">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reminder time
                  </label>
                  <input
                    type="time"
                    value={reminderTime}
                    onChange={(e) => setReminderTime(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="w-5 h-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Sample AI Insight</span>
                  </div>
                  <p className="text-blue-800 text-sm italic">
                    "Your migraines appear 87% more often on days following poor sleep (score ≤4)
                    combined with high stress (≥7). Based on 12 observations."
                  </p>
                  <div className="mt-4 flex gap-2">
                    <Badge variant="secondary">High Confidence</Badge>
                    <Badge variant="secondary">12 observations</Badge>
                  </div>
                </div>
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Heart className="w-5 h-5 text-green-600" />
                    <span className="font-medium text-green-900">Track. Discover. Share.</span>
                  </div>
                  <p className="text-green-800 text-sm">
                    After a few days of logging, you&apos;ll start seeing patterns in your symptoms.
                    Use these insights to have more productive conversations with your healthcare provider.
                  </p>
                </div>
              </div>
            )}

            <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={step === 1}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              {step < 3 ? (
                <Button onClick={handleNext}>
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button onClick={handleComplete} disabled={loading}>
                  {loading ? 'Setting up...' : 'Get Started'}
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}