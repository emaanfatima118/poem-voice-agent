import { Link } from "wouter";
import { Button } from "@/stackwise-demo/components/ui/button";
import { Card } from "@/stackwise-demo/components/ui/card";
import { NavBar } from "@/stackwise-demo/components/NavBar";
import {
  Sparkles,
  Target,
  Repeat,
  TrendingUp,
  Calendar,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";

export default function StrategyStudioLanding() {
  const phases = [
    {
      number: 1,
      title: "Onboarding & Setup",
      duration: "25-30 minutes",
      activities: [
        "Define goals and focus areas",
        "Choose GTM motions",
        "Set up channel strategy",
        "Select campaign recipes",
      ],
      color: "purple",
    },
    {
      number: 2,
      title: "Active Quarter",
      duration: "90 days",
      activities: [
        "Run active plays",
        "Track performance",
        "Get AI insights",
        "Adjust as needed",
      ],
      color: "blue",
    },
    {
      number: 3,
      title: "Quarterly Review",
      duration: "10-12 minutes",
      activities: [
        "Review wins & misses",
        "Update goals",
        "Refresh channels",
        "Lock new strategy",
      ],
      color: "magenta",
    },
  ];

  const features = [
    {
      title: "6-Step Guided Setup",
      description: "Calm, conversational wizard builds your strategic foundation",
      icon: Target,
    },
    {
      title: "My Playbook",
      description: "Your living collection of active plays and campaign recipes",
      icon: CheckCircle2,
    },
    {
      title: "Quarterly Insights",
      description: "Auto-generated performance summaries with coaching tone",
      icon: TrendingUp,
    },
    {
      title: "AI Assistant",
      description: "Context-aware suggestions, simulations, and strategic guidance",
      icon: Sparkles,
    },
    {
      title: "90-Day Rhythm",
      description: "Never heavy, always evolving—review and refresh every quarter",
      icon: Repeat,
    },
    {
      title: "Module Integration",
      description: "Seamlessly connects PulseHub, BrandCraft, and Flight Deck",
      icon: Calendar,
    },
  ];

  return (
    <div className="h-full overflow-y-auto bg-background">
      <NavBar />

      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 bg-gradient-strategy dot-pattern opacity-90" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 fade-in-up">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-white text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                <span>Free Feature • No Credit Card Required</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                Your Marketing Strategy,
                <br />
                Guided Every 90 Days
              </h1>
              <p className="text-xl text-white/90">
                Set your direction once, see progress naturally, and evolve your strategy
                every quarter—without feeling like you're managing a tool.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/strategy-studio/onboarding">
                  <Button
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 h-12 px-8"
                    data-testid="button-start-setup"
                  >
                    Start Free Setup
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Button>
                </Link>
                <Link href="/dashboard">
                  <Button
                    size="lg"
                    variant="outline"
                    className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 h-12 px-8"
                    data-testid="button-view-demo"
                  >
                    View Demo
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:block">
              <div className="relative">
                <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-2xl" />
                <Card className="p-8 space-y-6 relative">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold">Current Quarter</h3>
                    <span className="text-sm text-muted-foreground">Q1 2025</span>
                  </div>
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      <span className="text-sm">3 active plays running</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <TrendingUp className="w-5 h-5 text-blue-600" />
                      <span className="text-sm">Engagement up 12% QoQ</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-amber-600" />
                      <span className="text-sm">37 days until review</span>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Everything You Need for Strategic Clarity
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Strategy Studio guides you through building, tracking, and evolving
              your marketing strategy with intelligent coaching
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <Card
                key={index}
                className="p-6 space-y-3 border-l-4 border-l-primary hover-elevate"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Your Strategic Journey
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Three phases that feel alive but never heavy
            </p>
          </div>
          <div className="space-y-8">
            {phases.map((phase, index) => (
              <div key={index} className="relative">
                {index < phases.length - 1 && (
                  <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-strategy opacity-30 hidden md:block" />
                )}
                <Card className="p-8 hover-elevate">
                  <div className="grid md:grid-cols-12 gap-8">
                    <div className="md:col-span-3">
                      <div className={`w-16 h-16 bg-gradient-${phase.color} rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4`}>
                        {phase.number}
                      </div>
                      <h3 className="text-2xl font-bold mb-2">{phase.title}</h3>
                      <p className="text-muted-foreground">{phase.duration}</p>
                    </div>
                    <div className="md:col-span-9">
                      <div className="grid sm:grid-cols-2 gap-4">
                        {phase.activities.map((activity, idx) => (
                          <div key={idx} className="flex items-center gap-2">
                            <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                            <span className="text-sm">{activity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-strategy dot-pattern opacity-90" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Build Your Strategy?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join marketers who've replaced guesswork with guided strategy.
            Setup takes just 25 minutes and it's completely free.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/strategy-studio/onboarding">
              <Button
                size="lg"
                className="bg-white text-primary hover:bg-white/90 h-12 px-8"
                data-testid="button-cta-start"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Start Free Setup
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button
                size="lg"
                variant="outline"
                className="bg-white/10 backdrop-blur-sm text-white border-white/20 hover:bg-white/20 h-12 px-8"
              >
                View Dashboard Demo
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
