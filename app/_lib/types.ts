export type SubscriptionTier = 'free' | 'pro' | 'plus';
export type SubscriptionStatus = 'inactive' | 'active' | 'canceled' | 'trialing';
export type ConfidenceLevel = 'Low' | 'Medium' | 'High';

export interface User {
  id: string;
  email: string;
  display_name: string;
  conditions: string[];
  reminder_time: string | null;
  onboarding_completed: boolean;
  created_at: string;
}

export interface Subscription {
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  trial_ends_at: string | null;
  current_period_end: string | null;
}

export interface SymptomLog {
  id: string;
  user_id: string;
  entry_text: string;
  sleep_quality: number | null;
  energy_level: number | null;
  stress_level: number | null;
  pain_level: number | null;
  logged_at: string;
  created_at: string;
}

export interface InsightPattern {
  pattern_text: string;
  observation_count: number;
  confidence: ConfidenceLevel;
}

export interface InsightsData {
  patterns: InsightPattern[];
  weekly_summary: string;
  generated_at: string;
  log_count_at_generation: number;
}

export interface ReportData {
  id: string;
  user_id: string;
  date_from: string;
  date_to: string;
  content_text: string;
  share_token: string | null;
  created_at: string;
}

export interface SettingsData {
  display_name: string;
  email: string;
  conditions: string[];
  reminder_time: string | null;
  subscription: Subscription;
}

export const CONDITIONS = ['IBS', 'Migraine', 'Long COVID', 'Fibromyalgia', 'Chronic Pain', 'Autoimmune', 'Other'] as const;
export type Condition = typeof CONDITIONS[number];

export interface RegisterData {
  email: string;
  password: string;
  display_name?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface LogEntryInput {
  entry_text?: string;
  sleep_quality?: number;
  energy_level?: number;
  stress_level?: number;
  pain_level?: number;
}
