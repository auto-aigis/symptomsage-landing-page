"use client";

export const dynamic = 'force-dynamic';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { settingsApi, subscriptionApi } from '@/app/_lib/api';
import { useAuth } from '@/app/_components/AuthProvider';
import { User, Mail, Heart, Clock, CreditCard, Loader2, Check, ExternalLink } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Checkbox } from '@/components/ui/checkbox';

const CONDITIONS = [
  { id: 'IBS', label: 'IBS', description: 'Irritable Bowel Syndrome' },
  { id: 'Migraine', label: 'Migraine', description: 'Chronic migraine attacks' },
  { id: 'Long COVID', label: 'Long COVID', description: 'Post-COVID symptoms' },
  { id: 'Fibromyalgia', label: 'Fibromyalgia', description: 'Widespread pain condition' },
  { id: 'Chronic Pain', label: 'Chronic Pain', description: 'Persistent pain issues' },
  { id: 'Autoimmune', label: 'Autoimmune', description: 'Autoimmune conditions' },
  { id: 'Other', label: 'Other', description: 'Other chronic condition' },
];

interface SettingsContentProps {}

function SettingsContent({}: SettingsContentProps) {
  const [displayName, setDisplayName] = useState('');
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [reminderTime, setReminderTime] = useState('');
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const { user, refresh } = useAuth();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [settingsData, subData] = await Promise.all([
        settingsApi.get(),
        subscriptionApi.get().catch(() => ({ tier: 'free', status: 'inactive' })),
      ]);
      setDisplayName(settingsData.display_name || '');
      setSelectedConditions(settingsData.conditions || []);
      setReminderTime(settingsData.reminder_time || '');
      setSubscription(subData);
    } catch (err) {
      console.error('Failed to load settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const toggleCondition = (id: string) => {
    const maxConditions = subscription?.tier === 'plus' ? 3 : 1;
    setSelectedConditions(prev => {
      if (prev.includes(id)) {
        return prev.filter(c => c !== id);
      }
      if (prev.length >= maxConditions) {
        setError(subscription?.tier === 'plus' 
          ? 'Plus supports up to 3 conditions' 
          : 'Free/Pro supports 1 condition. Upgrade to Plus for more.');
        return prev;
      }
      return [...prev, id];
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setError('');
    setSuccess(false);

    try {
      await settingsApi.update({
        display_name: displayName,
        conditions: selectedConditions,
        reminder_time: reminderTime || undefined,
      });
      await refresh();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleManageBilling = () => {
    // Would open Paddle customer portal
    alert('Billing management will open in Paddle customer portal');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  const maxConditions = subscription?.tier === 'plus' ? 3 : 1;

  return (
    <div className="p-6 md:p-8 max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account and preferences</p>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="bg-green-50 border-green-200">
          <Check className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">Settings saved successfully</AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Profile
          </CardTitle>
          <CardDescription>Your personal information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="displayName">Display Name</Label>
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Your name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={user?.email || ''}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-gray-500">Contact support to change your email</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Heart className="w-5 h-5" />
            Conditions
          </CardTitle>
          <CardDescription>
            {subscription?.tier === 'plus' 
              ? 'Select up to 3 conditions to track' 
              : `Select 1 condition to track (upgrade to Plus for 3)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {CONDITIONS.map((condition) => (
              <label
                key={condition.id}
                className={`flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedConditions.includes(condition.id)
                    ? 'border-blue-600 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div>
                  <div className="font-medium text-gray-900">{condition.label}</div>
                  <div className="text-sm text-gray-500">{condition.description}</div>
                </div>
                <Checkbox
                  checked={selectedConditions.includes(condition.id)}
                  onCheckedChange={() => toggleCondition(condition.id)}
                />
              </label>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Reminders
          </CardTitle>
          <CardDescription>Set a daily reminder to log your symptoms</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <Label htmlFor="reminderTime">Reminder Time</Label>
            <Input
              id="reminderTime"
              type="time"
              value={reminderTime}
              onChange={(e) => setReminderTime(e.target.value)}
            />
            <p className="text-xs text-gray-500">Leave empty to disable reminders</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Subscription
          </CardTitle>
          <CardDescription>Manage your subscription and billing</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <div className="font-medium text-gray-900 capitalize">{subscription?.tier || 'Free'} Plan</div>
              <div className="text-sm text-gray-500">
                {subscription?.status === 'active' 
                  ? `Active until ${new Date(subscription.current_period_end).toLocaleDateString()}`
                  : subscription?.status === 'trialing'
                  ? `Trial ends ${new Date(subscription.trial_ends_at).toLocaleDateString()}`
                  : 'Free tier'}
              </div>
            </div>
            {subscription?.tier !== 'free' && (
              <Button variant="outline" size="sm" onClick={handleManageBilling}>
                <ExternalLink className="w-4 h-4 mr-2" />
                Manage
              </Button>
            )}
          </div>

          {subscription?.tier === 'free' && (
            <Button asChild className="w-full">
              <a href="/pricing">Upgrade to Pro</a>
            </Button>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    }>
    >
      <SettingsContent />
    </Suspense>
  );
}
