"use client";

import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Separator } from "@/components/ui/separator";
import {
  Brain,
  FileText,
  TrendingUp,
  Shield,
  Zap,
  MessageSquare,
  CheckCircle,
  ArrowRight,
  Menu,
  X,
  Activity,
  Clock,
  Heart,
} from "lucide-react";
import { useState } from "react";

interface Feature {
  icon: React.ReactNode;
  title: string;
  description: string;
}

interface Step {
  number: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface PricingPlan {
  name: string;
  price: string;
  period: string;
  description: string;
  features: string[];
  popular: boolean;
  cta: string;
}

interface FAQ {
  question: string;
  answer: string;
}

export default function Page() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const features: Feature[] = [
    {
      icon: <MessageSquare className="h-6 w-6 text-emerald-600" />,
      title: "Natural Language Logging",
      description:
        "Just type how you feel in plain English. No dropdowns, no scales — write freely like texting a friend.",
    },
    {
      icon: <Brain className="h-6 w-6 text-emerald-600" />,
      title: "AI Pattern Detection",
      description:
        "Our NLP engine analyzes your entries to find hidden correlations between symptoms, triggers, and lifestyle factors.",
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
      title: "Actionable Insights",
      description:
        "Get clear, percentage-based correlations like \"migraines correlate 87% with poor sleep + high-stress days.\"",
    },
    {
      icon: <FileText className="h-6 w-6 text-emerald-600" />,
      title: "Doctor-Ready Reports",
      description:
        "Generate shareable PDF summaries with timelines, patterns, and trends that help your doctor help you.",
    },
    {
      icon: <Shield className="h-6 w-6 text-emerald-600" />,
      title: "Private & Secure",
      description:
        "Your health data is encrypted end-to-end. We never sell your information or share it with third parties.",
    },
    {
      icon: <Zap className="h-6 w-6 text-emerald-600" />,
      title: "Instant Summaries",
      description:
        "Weekly and monthly AI digests show what improved, what worsened, and what you should watch out for.",
    },
  ];

  const steps: Step[] = [
    {
      number: "01",
      title: "Log in Plain Language",
      description:
        "Write about your day naturally — symptoms, food, sleep, mood, energy. No forms or rigid structures.",
      icon: <MessageSquare className="h-8 w-8 text-emerald-600" />,
    },
    {
      number: "02",
      title: "AI Connects the Dots",
      description:
        "Our engine processes your entries, identifies patterns, and finds correlations you would never spot manually.",
      icon: <Brain className="h-8 w-8 text-emerald-600" />,
    },
    {
      number: "03",
      title: "Get Actionable Insights",
      description:
        "Receive clear alerts when patterns emerge and understand your triggers with data-backed confidence scores.",
      icon: <TrendingUp className="h-8 w-8 text-emerald-600" />,
    },
    {
      number: "04",
      title: "Share with Your Doctor",
      description:
        "Generate a polished, evidence-based report and walk into appointments with real data, not fuzzy memories.",
      icon: <FileText className="h-8 w-8 text-emerald-600" />,
    },
  ];

  const pricingPlans: PricingPlan[] = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Start tracking and see what SymptomSage can do.",
      features: [
        "Unlimited daily logs",
        "Basic pattern detection",
        "7-day insight window",
        "1 report per month",
        "Community support",
      ],
      popular: false,
      cta: "Get Started Free",
    },
    {
      name: "Pro",
      price: "$9",
      period: "per month",
      description: "Full AI power for serious health trackers.",
      features: [
        "Everything in Free",
        "Advanced NLP correlations",
        "Unlimited insight history",
        "Unlimited doctor reports",
        "Weekly AI digests",
        "Export to PDF & CSV",
        "Priority support",
      ],
      popular: true,
      cta: "Start Pro Trial",
    },
    {
      name: "Family",
      price: "$19",
      period: "per month",
      description: "Track health patterns for your whole household.",
      features: [
        "Everything in Pro",
        "Up to 5 profiles",
        "Caregiver dashboard",
        "Shared doctor reports",
        "Family pattern insights",
        "Dedicated support",
      ],
      popular: false,
      cta: "Start Family Trial",
    },
  ];

  const faqs: FAQ[] = [
    {
      question: "How is SymptomSage different from other symptom trackers?",
      answer:
        "Most symptom trackers are glorified spreadsheets — they store data but generate zero insight. SymptomSage uses advanced NLP to interpret your freeform entries and surface actionable correlations you would never find on your own.",
    },
    {
      question: "What conditions does SymptomSage help with?",
      answer:
        "SymptomSage works for any condition where tracking symptoms over time reveals patterns. It is especially powerful for IBS, migraines, fibromyalgia, PCOS, long COVID, autoimmune conditions, and mental health tracking.",
    },
    {
      question: "Is my health data safe?",
      answer:
        "Absolutely. All data is encrypted end-to-end with AES-256 encryption. We are HIPAA-compliant, never sell your data, and you can delete your account and all associated data at any time.",
    },
    {
      question: "Can I share reports with my doctor?",
      answer:
        "Yes! SymptomSage generates clean, professional PDF reports designed to be shared with healthcare providers. They include timelines, correlation data, and trend visualizations.",
    },
    {
      question: "How long before I see useful patterns?",
      answer:
        "Most users start seeing initial correlations within 1-2 weeks of consistent logging. The more you log, the smarter the AI gets at detecting your unique patterns.",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <Activity className="h-7 w-7 text-emerald-600" />
              <span className="text-xl font-bold text-gray-900">SymptomSage</span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 hover:text-gray-900 transition-colors">
                FAQ
              </a>
            </div>

            <div className="hidden md:flex items-center gap-3">
              <a href="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </a>
              <a href="/register">
                <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                  Get Started
                </Button>
              </a>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-b border-gray-100 px-4 pb-4">
            <div className="flex flex-col gap-3">
              <a href="#features" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Features
              </a>
              <a href="#how-it-works" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                How It Works
              </a>
              <a href="#pricing" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                Pricing
              </a>
              <a href="#faq" className="text-sm text-gray-600 py-2" onClick={() => setMobileMenuOpen(false)}>
                FAQ
              </a>
              <Separator />
              <div className="flex gap-3 pt-2">
                <a href="/login">
                  <Button variant="outline" size="sm">
                    Sign In
                  </Button>
                </a>
                <a href="/register">
                  <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Get Started
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-4xl mx-auto">
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-sm bg-emerald-50 text-emerald-700 border-emerald-200">
              Trusted by 10,000+ chronic illness warriors
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
              Your AI health journal that{" "}
              <span className="text-emerald-600">actually connects the dots</span>
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Log symptoms in plain language. Our AI surfaces hidden patterns and correlations — then generates
              doctor-ready reports so you never show up to appointments with vague memories again.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-6 text-lg">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
              <a href="#how-it-works">
                <Button variant="outline" size="lg" className="px-8 py-6 text-lg">
                  See How It Works
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-gray-500">No credit card required. Free forever plan available.</p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-emerald-50 to-teal-50 rounded-2xl border border-emerald-100 p-6 sm:p-8 shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <MessageSquare className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">Your Log</span>
                  </div>
                  <p className="text-sm text-gray-700 italic leading-relaxed">
                    {"\"Woke up with a headache again. Only slept 5 hours because of the neighbor's dog. Had coffee and skipped breakfast. Felt foggy all morning. Stomach acting up after lunch — had that spicy Thai place again...\""}
                  </p>
                </div>
                <div className="bg-white rounded-xl p-5 shadow-sm border border-emerald-200">
                  <div className="flex items-center gap-2 mb-3">
                    <Brain className="h-4 w-4 text-emerald-600" />
                    <span className="text-xs font-medium text-emerald-600 uppercase tracking-wide">AI Insight</span>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-red-400 mt-1.5 shrink-0" />
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Migraine correlation: 87%</span> with sleep under 6hrs + skipped meals
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">GI flare pattern:</span> 4 of 5 episodes follow spicy food + poor sleep
                      </p>
                    </div>
                    <div className="flex items-start gap-2">
                      <div className="h-2 w-2 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                      <p className="text-sm text-gray-700">
                        <span className="font-semibold">Suggestion:</span> Prioritize 7+ hrs sleep to reduce symptom days by ~40%
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50 border-y border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-3xl font-bold text-gray-900">10K+</p>
              <p className="text-sm text-gray-600 mt-1">Active Users</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">2M+</p>
              <p className="text-sm text-gray-600 mt-1">Symptoms Logged</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">87%</p>
              <p className="text-sm text-gray-600 mt-1">Report Satisfaction</p>
            </div>
            <div>
              <p className="text-3xl font-bold text-gray-900">4.9/5</p>
              <p className="text-sm text-gray-600 mt-1">User Rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">
              Features
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Stop guessing. Start understanding.
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              SymptomSage transforms your freeform health entries into actionable intelligence that actually helps you
              manage your conditions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card key={index} className="border-gray-100 hover:border-emerald-200 hover:shadow-md transition-all">
                <CardHeader>
                  <div className="h-12 w-12 rounded-lg bg-emerald-50 flex items-center justify-center mb-2">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base leading-relaxed">{feature.description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">
              How It Works
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              From chaos to clarity in 4 simple steps
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              No complicated setup. No learning curve. Just write how you feel and let the AI do the heavy lifting.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm h-full">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl font-bold text-emerald-200">{step.number}</span>
                    {step.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                    <ArrowRight className="h-5 w-5 text-emerald-300" />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">
              Testimonials
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Real people, real breakthroughs
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-gray-100">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Heart key={star} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {"\"After 3 years of IBS misery, SymptomSage found that my flares correlate with anxiety + dairy within the same 24hr window. My GI doctor was impressed with the report. Game changer.\""}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-700">SK</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Sarah K.</p>
                    <p className="text-xs text-gray-500">IBS patient, 8 months on SymptomSage</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Heart key={star} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {"\"I have long COVID and was losing hope. SymptomSage showed me that my energy crashes follow a pattern — 2 days after any cardio. My doctor adjusted my rehab plan based on the data.\""}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-700">MJ</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Marcus J.</p>
                    <p className="text-xs text-gray-500">Long COVID, 5 months on SymptomSage</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-100">
              <CardContent className="pt-6">
                <div className="flex items-center gap-1 mb-4">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Heart key={star} className="h-4 w-4 fill-emerald-500 text-emerald-500" />
                  ))}
                </div>
                <p className="text-gray-700 text-sm leading-relaxed mb-4">
                  {"\"Finally, an app that doesn't make me choose from a list of 200 symptoms. I just write freely and it UNDERSTANDS me. The migraine pattern it found saved me from so much pain.\""}
                </p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <span className="text-sm font-semibold text-emerald-700">RL</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Rachel L.</p>
                    <p className="text-xs text-gray-500">Chronic migraines, 1 year on SymptomSage</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <Badge variant="secondary" className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">
              Pricing
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Simple pricing, powerful insights
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Start free and upgrade when you need deeper analysis. Cancel anytime.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card
                key={index}
                className={`relative ${plan.popular ? "border-emerald-500 border-2 shadow-lg scale-105" : "border-gray-200"}`}
              >
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-emerald-600 text-white px-3">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center pb-2">
                  <CardTitle className="text-xl">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="mb-6">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 ml-1">/{plan.period}</span>
                  </div>
                  <ul className="space-y-3 text-left">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start gap-2">
                        <CheckCircle className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
                        <span className="text-sm text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter>
                  <a href="/register" className="w-full">
                    <Button
                      className={`w-full ${plan.popular ? "bg-emerald-600 hover:bg-emerald-700 text-white" : ""}`}
                      variant={plan.popular ? "default" : "outline"}
                    >
                      {plan.cta}
                    </Button>
                  </a>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Conditions Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Built for people living with
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Whether you have a diagnosis or are still searching for answers, SymptomSage helps you find your patterns.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
            {[
              "IBS / IBD",
              "Migraines",
              "Fibromyalgia",
              "PCOS",
              "Long COVID",
              "Endometriosis",
              "Autoimmune",
              "ADHD",
              "Anxiety & Depression",
              "Chronic Fatigue",
              "Allergies",
              "Arthritis",
            ].map((condition) => (
              <Badge
                key={condition}
                variant="secondary"
                className="px-4 py-2 text-sm bg-white border border-gray-200 text-gray-700 hover:border-emerald-300 transition-colors"
              >
                {condition}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <Badge variant="secondary" className="mb-4 bg-emerald-50 text-emerald-700 border-emerald-200">
              FAQ
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900">
              Frequently asked questions
            </h2>
          </div>

          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left text-base font-medium">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl p-8 sm:p-12 text-center text-white">
            <Clock className="h-12 w-12 mx-auto mb-6 text-emerald-200" />
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              Stop losing clues to your health
            </h2>
            <p className="text-lg text-emerald-100 max-w-2xl mx-auto mb-8">
              Every day you wait is another day of symptoms logged in your memory instead of analyzed by AI.
              Start today — your future self (and your doctor) will thank you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="/register">
                <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-50 px-8 py-6 text-lg font-semibold">
                  Get Started Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </a>
            </div>
            <p className="mt-4 text-sm text-emerald-200">Free forever plan. No credit card needed.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 sm:px-6 lg:px-8 border-t border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <Activity className="h-6 w-6 text-emerald-600" />
                <span className="text-lg font-bold text-gray-900">SymptomSage</span>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                AI-powered health journaling that connects the dots between your symptoms, triggers, and lifestyle.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a></li>
                <li><a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a></li>
                <li><a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How It Works</a></li>
                <li><a href="#faq" className="text-sm text-gray-600 hover:text-gray-900">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Company</h4>
              <ul className="space-y-2">
                <li><a href="/about" className="text-sm text-gray-600 hover:text-gray-900">About</a></li>
                <li><a href="/blog" className="text-sm text-gray-600 hover:text-gray-900">Blog</a></li>
                <li><a href="/careers" className="text-sm text-gray-600 hover:text-gray-900">Careers</a></li>
                <li><a href="/contact" className="text-sm text-gray-600 hover:text-gray-900">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-3 text-sm">Legal</h4>
              <ul className="space-y-2">
                <li><a href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">Privacy Policy</a></li>
                <li><a href="/terms" className="text-sm text-gray-600 hover:text-gray-900">Terms of Service</a></li>
                <li><a href="/hipaa" className="text-sm text-gray-600 hover:text-gray-900">HIPAA Compliance</a></li>
                <li><a href="/security" className="text-sm text-gray-600 hover:text-gray-900">Security</a></li>
              </ul>
            </div>
          </div>
          <Separator className="my-8" />
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-gray-500">
              {"© 2024 SymptomSage. All rights reserved."}
            </p>
            <p className="text-sm text-gray-500">
              {"Made with care for the chronic illness community."}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}