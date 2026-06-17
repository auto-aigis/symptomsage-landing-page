"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Lock, Crown } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  feature: string;
  tier?: 'pro' | 'plus';
}

export function UpgradeModal({ open, onOpenChange, feature, tier = 'pro' }: UpgradeModalProps) {
  const router = useRouter();

  const handleUpgrade = () => {
    onOpenChange(false);
    router.push('/pricing');
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Lock className="w-5 h-5 text-gray-500" />
            Upgrade to Unlock
          </DialogTitle>
          <DialogDescription>
            {feature} is available on the {tier === 'pro' ? 'Pro' : 'Plus'} plan.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Crown className="w-5 h-5 text-blue-600" />
              <span className="font-medium text-blue-900">Upgrade to {tier === 'pro' ? 'Pro' : 'Plus'}</span>
            </div>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Full AI insights dashboard</li>
              <li>• Doctor-ready report generation</li>
              <li>{tier === 'plus' && '• Priority AI processing'}</li>
              {tier === 'plus' && <li>• Multiple condition profiles</li>}
              {tier === 'plus' && <li>• Shareable report links</li>}
            </ul>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Maybe Later
            </Button>
            <Button className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={handleUpgrade}>
              View Pricing
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
