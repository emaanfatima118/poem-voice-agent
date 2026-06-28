import { useState, useEffect } from 'react';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Card, CardHeader, CardContent } from '@/stackwise-demo/components/ui/card';
import { X, Monitor, User, TrendingUp, Target, Zap, Users, Brain, Lightbulb, BarChart3, MessageSquare, Rocket, CheckCircle2, Flame, Compass, Cog, UserCircle, DollarSign, Cpu, ArrowRight, Activity, Brush, Settings, Clock3 as Clock, AlertTriangle, Heart, Plane, Download, Sparkles, Fingerprint } from 'lucide-react';
import { Link } from 'wouter';

const emblemIcon = '/stackwise-demo/favicon.png';
const stackwiseLogo = '/stackwise-demo/stackwise-logo-full.png';

interface PollOption {
  text: string;
  percentage: number;
  highlighted?: boolean;
}

interface PollCardProps {
  prompt: string;
  options: Array<{ text: string }>;
  results: PollOption[];
  onVote: () => void;
  hasVoted: boolean;
}

function PollCard({ prompt, options, results, onVote, hasVoted }: PollCardProps) {
  return (
    <div className="mt-6">
      <h4 className="text-base font-semibold mb-3 flex items-center gap-2">
        <BarChart3 className="w-4 h-4 text-[#6218df]" />
        {prompt}
      </h4>
      {!hasVoted ? (
        <div className="grid grid-cols-2 gap-2">
          {options.map((option, idx) => (
            <Button
              key={idx}
              variant="outline"
              className="justify-start text-left text-sm h-auto py-3"
              onClick={onVote}
              data-testid={`button-poll-option-${idx}`}
            >
              {option.text}
            </Button>
          ))}
        </div>
      ) : (
        <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
          {results.map((result, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className={result.highlighted ? 'font-semibold' : ''}>{result.text}</span>
                <span className={result.highlighted ? 'font-semibold text-[#6218df]' : 'text-muted-foreground'}>
                  {result.percentage}%
                </span>
              </div>
              <div className="h-2 bg-white rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    result.highlighted ? 'bg-[#6218df]' : 'bg-gray-300'
                  }`}
                  style={{ width: `${result.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function StatBox({ stat, description }: { stat: string; description: string }) {
  return (
    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4 flex items-start gap-3">
      <TrendingUp className="w-5 h-5 text-[#6218df] flex-shrink-0 mt-0.5" />
      <div>
        <div className="font-bold text-base text-[#6218df]">{stat}</div>
        <div className="text-sm text-gray-700 mt-1">{description}</div>
      </div>
    </div>
  );
}

function KeyTakeaway({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-purple-50 border-l-4 border-[#6218df] p-4 rounded mt-6">
      <p className="font-semibold text-sm flex items-center gap-2">
        <CheckCircle2 className="w-4 h-4 text-[#6218df]" />
        Key Takeaway
      </p>
      <p className="text-sm text-gray-700 mt-2">{children}</p>
    </div>
  );
}

export function WebinarDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [pollStates, setPollStates] = useState<Record<string, boolean>>({});

  // Save scroll position when closing
  useEffect(() => {
    if (!isOpen) {
      const drawer = document.getElementById('webinar-drawer-content');
      if (drawer) {
        setScrollPosition(drawer.scrollTop);
      }
    }
  }, [isOpen]);

  // Restore scroll position when opening
  useEffect(() => {
    if (isOpen) {
      const drawer = document.getElementById('webinar-drawer-content');
      if (drawer) {
        drawer.scrollTop = scrollPosition;
      }
    }
  }, [isOpen, scrollPosition]);

  const handlePollVote = (pollId: string) => {
    setPollStates({ ...pollStates, [pollId]: true });
  };

  const handleDownloadPDF = () => {
    const originalTitle = document.title;
    document.title = 'Stackwise-Webinar-Presentation';
    
    const style = document.createElement('style');
    style.id = 'print-styles';
    style.textContent = `
      @media print {
        @page {
          size: portrait;
          margin: 0.5in;
        }
        
        /* Hide EVERYTHING initially */
        body > * {
          display: none !important;
        }
        
        /* Show only the root div */
        body > #root {
          display: block !important;
        }
        
        /* Hide everything in root except webinar drawer */
        #root > * {
          display: none !important;
        }
        
        /* Show only webinar drawer wrapper */
        #root > .fixed.inset-0.z-50 {
          display: flex !important;
          position: static !important;
          z-index: auto !important;
        }
        
        /* Hide spacer and backdrop */
        .w-64.flex-shrink-0,
        .absolute.inset-0.bg-black\\/30 {
          display: none !important;
        }
        
        /* Show drawer content column */
        .flex-1.relative {
          display: block !important;
          position: static !important;
          width: 100% !important;
        }
        
        /* Show drawer inner content */
        .absolute.inset-0.bg-white {
          display: flex !important;
          position: static !important;
          box-shadow: none !important;
          flex-direction: column !important;
        }
        
        /* Hide all buttons */
        button,
        [data-testid*="button"] {
          display: none !important;
        }
        
        /* Make content scrollable area visible and full width */
        #webinar-drawer-content {
          display: block !important;
          overflow: visible !important;
          width: 100% !important;
          max-width: 100% !important;
          height: auto !important;
          flex: 1 !important;
        }
        
        /* Remove padding constraints */
        #webinar-drawer-content .px-8 {
          padding-left: 0 !important;
          padding-right: 0 !important;
          width: 100% !important;
          max-width: 100% !important;
        }
        
        /* Ensure cards don't split across pages */
        .px-8 > *,
        .border-2,
        .border-4 {
          page-break-inside: avoid !important;
          break-inside: avoid !important;
        }
        
        /* Page break control */
        .print\\:break-before-page {
          page-break-before: always !important;
        }
        
        /* Preserve all colors and gradients */
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
        }
      }
    `;
    document.head.appendChild(style);
    
    setTimeout(() => {
      window.print();
      setTimeout(() => {
        document.title = originalTitle;
        const printStyle = document.getElementById('print-styles');
        if (printStyle) printStyle.remove();
      }, 1000);
    }, 100);
  };

  return (
    <>
      {/* Webinar Icon Button - Lower Left, Very Subtle */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 left-4 z-40 w-9 h-9 rounded-md bg-gray-400/25 hover:bg-gray-500/40 text-white shadow-sm flex items-center justify-center transition-all hover:scale-105 opacity-10"
        data-testid="button-webinar-toggle"
        aria-label="Open webinar"
      >
        <div className="relative w-5 h-5">
          <Monitor className="w-5 h-5 absolute" />
          <User className="w-2.5 h-2.5 absolute bottom-0 right-0" />
        </div>
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop - only covers content area, not sidebar */}
          <div className="w-64 flex-shrink-0" /> {/* Sidebar spacer */}
          <div className="flex-1 relative">
            <div
              className="absolute inset-0 bg-black/30"
              onClick={() => setIsOpen(false)}
            />

            {/* Drawer Content - Aligned to content column */}
            <div className="absolute inset-0 bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
              {/* Header - Simple Close Button */}
              <div className="absolute top-4 right-4 z-10">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  data-testid="button-close-webinar"
                  className="bg-white/80 hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>

              {/* Scrollable Content */}
              <div
                id="webinar-drawer-content"
                className="flex-1 overflow-y-auto"
              >
                {/* Card 1: Title Card with Gradient Border */}
                <div className="px-8 pt-8 pb-6">
                  <div className="bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] p-[3px] rounded-lg">
                    <div className="bg-white px-8 py-10 rounded-lg">
                      <div className="max-w-4xl">
                        <h2 
                          className="text-3xl font-bold bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent mb-2" 
                          data-testid="heading-webinar-title"
                        >
                          Doing It All Without Losing It: Smarter Marketing Systems for Solo Marketers and Lean Teams in the Age of AI
                        </h2>
                        
                        <div className="space-y-5">
                          <div className="flex items-start gap-2">
                            <span className="text-[#6218df] font-bold text-lg flex-shrink-0">&gt;&gt;</span>
                            <p className="text-base text-gray-700 leading-relaxed flex-1">
                              We're talking about why marketing doesn't need more automation — it needs systems that help humans <strong className="text-gray-900">lead</strong>, <strong className="text-gray-900">connect</strong>, and <strong className="text-gray-900">grow</strong>.
                            </p>
                          </div>
                          
                          <div className="flex items-start gap-2">
                            <span className="text-[#c009ba] font-bold text-lg flex-shrink-0">&gt;&gt;</span>
                            <p className="text-base text-gray-700 leading-relaxed flex-1">
                              You'll leave with <strong className="text-gray-900">actionable insights</strong>, <strong className="text-gray-900">real-world examples</strong>, and a look at <strong className="bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent">Stackwise</strong> — a tool built to help lean marketing teams make AI work <em>for you</em>, not the other way around.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Remaining Cards */}
                <div className="px-8 py-6 space-y-6">
                
                {/* Card 2: SMB Marketing Trends - By the Numbers */}
                <Card className="border-2 border-purple-100 shadow-sm">
                  <CardContent className="p-8">
                    <h3 className="text-2xl font-bold mb-2 bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent">
                      SMB Marketing in 2025: By the Numbers
                    </h3>
                    <p className="text-gray-600 mb-8">Resource constraints are the new normal for small-to-midsize teams.</p>
                    
                    {/* Stats Grid - 5 stats in responsive layout */}
                    <div className="grid grid-cols-2 gap-6 mb-8">
                      {/* Stat 1 - Team Size */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-5 border border-purple-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#6218df] flex items-center justify-center flex-shrink-0">
                            <Users className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-[#6218df]">2-5</div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <strong>people</strong> on the average SMB marketing team — wearing multiple hats
                        </p>
                      </div>
                      
                      {/* Stat 2 - Budget */}
                      <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-lg p-5 border border-pink-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#c009ba] flex items-center justify-center flex-shrink-0">
                            <DollarSign className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-[#c009ba]">$120K</div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          average <strong>annual marketing budget</strong> for SMBs with $5-50M revenue
                        </p>
                      </div>
                      
                      {/* Stat 3 - Turnover */}
                      <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-5 border border-blue-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-[#1e40f2] flex items-center justify-center flex-shrink-0">
                            <UserCircle className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-[#1e40f2]">47%</div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <strong>marketing team turnover</strong> in SMBs — burnout and retention are critical issues
                        </p>
                      </div>
                      
                      {/* Stat 4 - Content Pressure */}
                      <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-5 border border-orange-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center flex-shrink-0">
                            <TrendingUp className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-orange-600">3-5x</div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <strong>more content expected</strong> vs. 3 years ago — same team size, exponential demands
                        </p>
                      </div>
                      
                      {/* Stat 5 - AI Investment */}
                      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-5 border border-green-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
                            <Cpu className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-green-600">35%</div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          <strong>budget increase</strong> expected for AI/automation tools in 2025 — but most lack implementation roadmaps
                        </p>
                      </div>
                      
                      {/* Stat 6 - Time Allocation */}
                      <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-lg p-5 border border-teal-100">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 flex items-center justify-center flex-shrink-0">
                            <Clock className="w-5 h-5 text-white" />
                          </div>
                          <div className="text-4xl font-bold text-teal-600">25%</div>
                        </div>
                        <p className="text-sm text-gray-700 leading-relaxed">
                          of marketer time spent on <strong>strategy</strong> — the rest is execution, admin, and reporting
                        </p>
                      </div>
                    </div>
                    
                    {/* Key Insight */}
                    <div className="bg-gradient-to-r from-[#6218df]/5 via-[#c009ba]/5 to-[#1e40f2]/5 rounded-lg p-6 border-2 border-purple-200">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-6 h-6 text-[#6218df] flex-shrink-0 mt-1" />
                        <div>
                          <h4 className="font-bold text-gray-900 mb-2">The Reality</h4>
                          <p className="text-sm text-gray-700 leading-relaxed">
                            Small teams are stretched thin, budgets are tight, and the promise of AI isn't translating to <strong>actual efficiency gains</strong>. The gap between <em>potential</em> and <em>reality</em> is widening.
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                {/* Card 3: Combined Polls - The Real-World Challenges */}
                <Card className="border-2 border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-red-400 flex items-center justify-center flex-shrink-0">
                        <Target className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">The Real-World Challenges</h3>
                        <p className="text-sm text-muted-foreground">
                          Most marketers are juggling too many tools, too many priorities, and not enough focus.
                        </p>
                      </div>
                    </div>

                    {/* Side-by-side Polls with Separator */}
                    <div className="grid grid-cols-[1fr,2px,1fr] gap-6 items-start">
                      <div>
                        <PollCard
                          prompt="How many tools do you touch in a typical day?"
                          options={[
                            { text: 'Fewer than 5' },
                            { text: '5–10' },
                            { text: '10–20' },
                            { text: 'More than 20' },
                          ]}
                          results={[
                            { text: 'Fewer than 5', percentage: 5 },
                            { text: '5–10', percentage: 25 },
                            { text: '10–20', percentage: 55, highlighted: true },
                            { text: 'More than 20', percentage: 15 },
                          ]}
                          onVote={() => handlePollVote('tools')}
                          hasVoted={pollStates['tools'] || false}
                        />
                      </div>
                      
                      {/* Vertical Purple Separator */}
                      <div className="h-full bg-[#6218df] rounded-full" />
                      
                      <div>
                        <PollCard
                          prompt="What's draining your time most right now?"
                          options={[
                            { text: 'Reporting & proving results' },
                            { text: 'Shifting priorities' },
                            { text: 'Content creation & approvals' },
                            { text: 'Tool overload' },
                            { text: 'Leadership requests' },
                          ]}
                          results={[
                            { text: 'Reporting & proving results', percentage: 42, highlighted: true },
                            { text: 'Shifting priorities', percentage: 27 },
                            { text: 'Content creation & approvals', percentage: 18 },
                            { text: 'Tool overload', percentage: 9 },
                            { text: 'Leadership requests', percentage: 4 },
                          ]}
                          onVote={() => handlePollVote('time')}
                          hasVoted={pollStates['time'] || false}
                        />
                      </div>
                    </div>

                    {/* Always show in PDF, conditionally show on screen */}
                    <div className={(pollStates['tools'] && pollStates['time']) ? "block" : "hidden print:block"}>
                      <>
                        <div className="mt-6 border-2 border-orange-200 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg p-5">
                          <div className="flex items-start gap-3 mb-4">
                            <Flame className="w-7 h-7 text-orange-500 animate-pulse flex-shrink-0" />
                            <div className="flex-1 text-left">
                              <h4 className="text-base font-bold text-gray-900">Sometimes it feels like... A Dumpster Fire</h4>
                            </div>
                          </div>
                          
                          {/* 2x2 Grid Layout */}
                          <div className="grid grid-cols-2 gap-4">
                            {/* Top Left: Strategy & Alignment */}
                            <div className="bg-white rounded-lg p-4 border border-orange-100">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                                  <Compass className="w-4 h-4 text-purple-600" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-sm text-gray-900 mb-2">Strategy & Alignment</h5>
                                  <div className="space-y-1">
                                    {[
                                      'No clear priorities or direction',
                                      'Reactive instead of strategic',
                                      'Hard to connect marketing to revenue',
                                      'Misaligned with leadership expectations and goals',
                                      'Marketing, sales, and product working in silos'
                                    ].map((item) => (
                                      <p key={item} className="text-xs text-gray-600 flex items-start gap-2">
                                        <span className="text-orange-400 mt-0.5">•</span>
                                        <span>{item}</span>
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Top Right: Execution & Operations */}
                            <div className="bg-white rounded-lg p-4 border border-orange-100">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                                  <Cog className="w-4 h-4 text-blue-600" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-sm text-gray-900 mb-2">Execution & Operations</h5>
                                  <div className="space-y-1">
                                    {[
                                      'Content demand outpaces bandwidth',
                                      'Endless revisions and approval delays',
                                      'Pressure to produce fast over producing well',
                                      'Too many disconnected tools and manual reporting',
                                      "Hard to prove what's working"
                                    ].map((item) => (
                                      <p key={item} className="text-xs text-gray-600 flex items-start gap-2">
                                        <span className="text-orange-400 mt-0.5">•</span>
                                        <span>{item}</span>
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Left: People & Capacity + Resources & Perception */}
                            <div className="space-y-4">
                              <div className="bg-white rounded-lg p-4 border border-orange-100">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                    <UserCircle className="w-4 h-4 text-green-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-sm text-gray-900 mb-2">People & Capacity</h5>
                                    <div className="space-y-1">
                                      {[
                                        'Wearing too many hats',
                                        'No time for strategy or creativity',
                                        'Limited mentorship, support, or collaboration',
                                        'Burnout and constant context-switching'
                                      ].map((item) => (
                                        <p key={item} className="text-xs text-gray-600 flex items-start gap-2">
                                          <span className="text-orange-400 mt-0.5">•</span>
                                          <span>{item}</span>
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                              
                              <div className="bg-white rounded-lg p-4 border border-orange-100">
                                <div className="flex items-start gap-3">
                                  <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center flex-shrink-0">
                                    <DollarSign className="w-4 h-4 text-yellow-600" />
                                  </div>
                                  <div className="flex-1">
                                    <h5 className="font-semibold text-sm text-gray-900 mb-2">Resources & Perception</h5>
                                    <div className="space-y-1">
                                      {[
                                        'Limited budget, big expectations',
                                        'Marketing viewed as a cost center, not a growth driver'
                                      ].map((item) => (
                                        <p key={item} className="text-xs text-gray-600 flex items-start gap-2">
                                          <span className="text-orange-400 mt-0.5">•</span>
                                          <span>{item}</span>
                                        </p>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Bottom Right: AI & Modern Pressure */}
                            <div className="bg-white rounded-lg p-4 border border-orange-100">
                              <div className="flex items-start gap-3">
                                <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center flex-shrink-0">
                                  <Cpu className="w-4 h-4 text-pink-600" />
                                </div>
                                <div className="flex-1">
                                  <h5 className="font-semibold text-sm text-gray-900 mb-2">AI & Modern Pressure</h5>
                                  <div className="space-y-1">
                                    {[
                                      'Overwhelmed by new tools and expectations',
                                      'Fear of losing the human element — creativity, judgment, context'
                                    ].map((item) => (
                                      <p key={item} className="text-xs text-gray-600 flex items-start gap-2">
                                        <span className="text-orange-400 mt-0.5">•</span>
                                        <span>{item}</span>
                                      </p>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <KeyTakeaway>
                          <strong>Most marketers lose time to proving value, not creating it.</strong> What people need is TIME. They need the space to strategize, think critically and be creative.
                        </KeyTakeaway>
                      </>
                    </div>
                  </CardContent>
                </Card>

                {/* Section Title */}
                <div className="pt-8 pb-4">
                  <h2 className="text-3xl font-bold bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent mb-2 text-center">
                    Built for Humans. Designed for Real Marketing Work.
                  </h2>
                  <p className="text-xl text-gray-600 font-light text-center">
                    Navigating the "more with less" reality
                  </p>
                </div>

                {/* Card 4: Why Stackwise Exists */}
                <Card className="border-2 border-purple-100">
                  <CardContent className="p-6">
                    {/* Left-aligned Title & Subtitle */}
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6218df] via-[#c009ba] to-[#1e40f2] flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Why Stackwise Exists</h3>
                        <p className="text-sm text-muted-foreground">
                          A passion project from a fellow marketer
                        </p>
                      </div>
                    </div>

                    {/* Personal Narrative */}
                    <div className="space-y-4 mb-6">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        I've been there. Trying to establish focus and priorities when no one at the top is setting them. Trying to build reports that never quite add up and are immediately out-of-date.
                      </p>
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Having to do it all while constantly fighting fires. Trying to bring on the right tools, but held back by budget — or the usual "can't you just use…" questions.
                      </p>
                    </div>

                    {/* Connection Statement */}
                    <div className="flex flex-col items-start gap-4 mb-6 bg-gradient-to-r from-[#6218df]/5 via-[#c009ba]/5 to-[#1e40f2]/5 rounded-lg p-4 border-l-4" style={{ borderImage: 'linear-gradient(to bottom, #6218df, #c009ba, #1e40f2) 1' }}>
                      <img 
                        src={stackwiseLogo} 
                        alt="Stackwise" 
                        className="h-10 w-auto object-contain"
                        style={{ maxWidth: '300px' }}
                      />
                      <p className="text-lg font-bold text-gray-900 leading-tight">
                        Built to address every day challenges we face as marketers.
                      </p>
                    </div>

                    {/* Pain Point Mapping - 2x2 Grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                      {/* Strategy Studio */}
                      <div className="bg-gradient-to-r from-[#6218df]/5 via-[#c009ba]/5 to-[#1e40f2]/10 rounded-lg p-4 border-2 border-transparent bg-clip-padding" style={{ backgroundImage: 'linear-gradient(white, white), linear-gradient(to right, #6218df40, #c009ba40, #1e40f240)', backgroundOrigin: 'border-box', backgroundClip: 'padding-box, border-box' }}>
                        <div className="flex items-start gap-3 mb-3">
                          <Lightbulb className="w-5 h-5 text-[#6218df] flex-shrink-0 mt-0.5" />
                          <h4 className="font-semibold text-sm bg-gradient-to-r from-[#6218df] via-[#c009ba] to-[#1e40f2] bg-clip-text text-transparent">Strategy Studio</h4>
                        </div>
                        <div className="space-y-1.5 pl-8">
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">•</span>
                            <span>Lack of focus or priorities</span>
                          </p>
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">•</span>
                            <span>Misalignment with sales or leadership</span>
                          </p>
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">•</span>
                            <span>Ideas pile up with no process to prioritize</span>
                          </p>
                        </div>
                      </div>

                      {/* PulseHub */}
                      <div className="bg-gradient-to-r from-[#6218df]/5 to-[#6218df]/10 rounded-lg p-4 border border-[#6218df]/20">
                        <div className="flex items-start gap-3 mb-3">
                          <Activity className="w-5 h-5 text-[#6218df] flex-shrink-0 mt-0.5" />
                          <h4 className="font-semibold text-sm text-[#6218df]">PulseHub</h4>
                        </div>
                        <div className="space-y-1.5 pl-8">
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">•</span>
                            <span>Can't connect marketing to growth</span>
                          </p>
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">•</span>
                            <span>Drowning in dashboards, still missing insight</span>
                          </p>
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">•</span>
                            <span>Hard to translate metrics for leadership</span>
                          </p>
                        </div>
                      </div>

                      {/* BrandCraft */}
                      <div className="bg-gradient-to-r from-[#c009ba]/5 to-[#c009ba]/10 rounded-lg p-4 border border-[#c009ba]/20">
                        <div className="flex items-start gap-3 mb-3">
                          <Brush className="w-5 h-5 text-[#c009ba] flex-shrink-0 mt-0.5" />
                          <h4 className="font-semibold text-sm text-[#c009ba]">BrandCraft</h4>
                        </div>
                        <div className="space-y-1.5 pl-8">
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#c009ba] mt-0.5">•</span>
                            <span>Unclear or inconsistent brand voice</span>
                          </p>
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#c009ba] mt-0.5">•</span>
                            <span>Executives don't see the value of brand or exec vis work</span>
                          </p>
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#c009ba] mt-0.5">•</span>
                            <span>Brand tone doesn't match the audience</span>
                          </p>
                        </div>
                      </div>

                      {/* Flight Deck */}
                      <div className="bg-gradient-to-r from-[#1e40f2]/5 to-[#1e40f2]/10 rounded-lg p-4 border border-[#1e40f2]/20">
                        <div className="flex items-start gap-3 mb-3">
                          <Settings className="w-5 h-5 text-[#1e40f2] flex-shrink-0 mt-0.5" />
                          <h4 className="font-semibold text-sm text-[#1e40f2]">Flight Deck</h4>
                        </div>
                        <div className="space-y-1.5 pl-8">
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#1e40f2] mt-0.5">•</span>
                            <span>Budgets drift because tracking happens too late</span>
                          </p>
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#1e40f2] mt-0.5">•</span>
                            <span>Campaigns scattered across spreadsheets and tools</span>
                          </p>
                          <p className="text-xs text-gray-700 flex items-start gap-2">
                            <span className="text-[#1e40f2] mt-0.5">•</span>
                            <span>No single place to see what's live</span>
                          </p>
                        </div>
                      </div>
                    </div>

                    <KeyTakeaway>
                      This is why I created Stackwise. A passion project to provide guidance, mentorship, and ways to elevate YOU as the strategist.
                    </KeyTakeaway>
                  </CardContent>
                </Card>

                {/* Card 4.5: AI in Strategy */}
                <Card className="border-2 border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Cpu className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">AI in Strategy</h3>
                        <p className="text-muted-foreground text-sm">
                          AI is changing how we work.
                        </p>
                      </div>
                    </div>
                    
                    {/* Split into 2 columns */}
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      {/* Left side: Stat */}
                      <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <TrendingUp className="w-5 h-5 text-[#6218df] flex-shrink-0 mt-0.5" />
                          <div>
                            <div className="font-bold text-base text-[#6218df]">~40%</div>
                            <div className="text-sm text-gray-700 mt-1">
                              Among US small businesses (&lt; 250 employees), about 40% reported using AI tools in 2024.
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right side: Poll */}
                      <div>
                        <PollCard
                          prompt="What's your biggest blocker to adopting AI?"
                          options={[
                            { text: 'Lack of training / no clear process' },
                            { text: 'Not sure where to start' },
                            { text: 'Too many tools' },
                            { text: 'Fear of replacing people' },
                          ]}
                          results={[
                            { text: 'Lack of training / no clear process', percentage: 42, highlighted: true },
                            { text: 'Not sure where to start', percentage: 27 },
                            { text: 'Too many tools', percentage: 19 },
                            { text: 'Fear of replacing people', percentage: 12 },
                          ]}
                          onVote={() => handlePollVote('ai_blocker')}
                          hasVoted={pollStates['ai_blocker'] || false}
                        />
                      </div>
                    </div>

                    <KeyTakeaway>
                      <strong>AI adoption is rising — what's missing is direction, not desire.</strong>
                    </KeyTakeaway>
                  </CardContent>
                </Card>

                {/* Module Cards 2x2 Grid */}
                <div className="space-y-4">
                  <h2 className="text-2xl font-bold text-center">Sneak Peek into the Stackwise Platform</h2>
                  
                  {/* First Row: Strategy Studio | Pulse Hub */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Strategy Studio */}
                    <Card className="border-2 border-purple-100">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6218df] to-[#1e40f2] flex items-center justify-center flex-shrink-0">
                            <Lightbulb className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Strategy Studio</h3>
                            <p className="text-muted-foreground text-sm">
                              Every marketing motion starts here to align business goals and lay a solid foundation.
                            </p>
                          </div>
                        </div>

                        {/* Simplified 30-60-90 Graphic */}
                        <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-[#6218df] flex items-center justify-center">
                              <span className="text-white text-xs font-bold">30</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-purple-400" />
                            <div className="w-12 h-12 rounded-full bg-[#8B3FDF] flex items-center justify-center">
                              <span className="text-white text-xs font-bold">60</span>
                            </div>
                            <ArrowRight className="w-4 h-4 text-purple-400" />
                            <div className="w-12 h-12 rounded-full bg-[#1e40f2] flex items-center justify-center">
                              <span className="text-white text-xs font-bold">90</span>
                            </div>
                          </div>
                        </div>
                        
                        <PollCard
                          prompt="How often do you revisit your marketing strategy each quarter?"
                          options={[
                            { text: 'Every quarter or more' },
                            { text: 'Twice a year' },
                            { text: 'Once a year' },
                            { text: 'Rarely or never' },
                          ]}
                          results={[
                            { text: 'Every quarter or more', percentage: 22 },
                            { text: 'Twice a year', percentage: 33, highlighted: true },
                            { text: 'Once a year', percentage: 30 },
                            { text: 'Rarely or never', percentage: 15 },
                          ]}
                          onVote={() => handlePollVote('strategy_revisit')}
                          hasVoted={pollStates['strategy_revisit'] || false}
                        />

                        {pollStates['strategy_revisit'] && (
                          <KeyTakeaway>
                            <strong>Start with strategy so marketing stays aligned to business outcomes.</strong>
                          </KeyTakeaway>
                        )}
                      </CardContent>
                    </Card>

                    {/* Pulse Hub */}
                    <Card className="border-2 border-purple-100">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#6218df] flex items-center justify-center flex-shrink-0">
                            <Activity className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">PulseHub</h3>
                            <p className="text-muted-foreground text-sm">
                              PulseHub closes the loop between performance data and strategic decisions. See what's happening and why it matters.
                            </p>
                          </div>
                        </div>

                        {/* Simplified Metrics Graphic */}
                        <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-3 mb-4">
                          <div className="grid grid-cols-3 gap-2">
                            <div className="bg-white rounded p-2 text-center">
                              <p className="text-xs font-bold text-green-600">↑ 12%</p>
                            </div>
                            <div className="bg-white rounded p-2 text-center">
                              <p className="text-xs font-bold text-green-600">↑ 8%</p>
                            </div>
                            <div className="bg-white rounded p-2 text-center">
                              <p className="text-xs font-bold text-red-600">↓ 3%</p>
                            </div>
                          </div>
                        </div>

                        <PollCard
                          prompt="When leadership asks for marketing results, what do they really want?"
                          options={[
                            { text: 'Leads' },
                            { text: 'Revenue tie-in' },
                            { text: 'Brand visibility' },
                            { text: 'All of the above' },
                          ]}
                          results={[
                            { text: 'Leads', percentage: 10 },
                            { text: 'Revenue tie-in', percentage: 60, highlighted: true },
                            { text: 'Brand visibility', percentage: 5 },
                            { text: 'All of the above', percentage: 25 },
                          ]}
                          onVote={() => handlePollVote('leadership')}
                          hasVoted={pollStates['leadership'] || false}
                        />

                        {pollStates['leadership'] && (
                          <KeyTakeaway>
                            <strong>PulseHub bridges the gap between what you measure and what leadership actually needs to see.</strong>
                          </KeyTakeaway>
                        )}
                      </CardContent>
                    </Card>
                  </div>

                  {/* Second Row: Brand Craft | Flight Deck */}
                  <div className="grid grid-cols-2 gap-4">
                    {/* Brand Craft */}
                    <Card className="border-2 border-purple-100">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#c009ba] flex items-center justify-center flex-shrink-0">
                            <Brush className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">BrandCraft</h3>
                            <p className="text-muted-foreground text-sm">
                              Messaging and positioning built for impact. If PulseHub tells you what's working, BrandCraft ensures you say it the right way.
                            </p>
                          </div>
                        </div>

                        {/* Simplified Content Flow Graphic */}
                        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-[#c009ba] flex items-center justify-center">
                              <Brain className="w-5 h-5 text-white" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-pink-400" />
                            <div className="w-12 h-12 rounded-full bg-[#D834C6] flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>

                        <PollCard
                          prompt="What's the biggest challenge keeping your brand voice consistent?"
                          options={[
                            { text: 'Too many people creating content' },
                            { text: 'No clear messaging or tone framework' },
                            { text: 'Leadership feedback changes direction' },
                            { text: 'No time for review or quality checks' },
                          ]}
                          results={[
                            { text: 'Too many people creating content', percentage: 37, highlighted: true },
                            { text: 'No clear messaging or tone framework', percentage: 32 },
                            { text: 'Leadership feedback changes direction', percentage: 18 },
                            { text: 'No time for review or quality checks', percentage: 13 },
                          ]}
                          onVote={() => handlePollVote('brand_voice')}
                          hasVoted={pollStates['brand_voice'] || false}
                        />

                        {pollStates['brand_voice'] && (
                          <KeyTakeaway>
                            <strong>BrandCraft gives every voice the same playbook — so the story stays consistent, no matter who's telling it.</strong>
                          </KeyTakeaway>
                        )}
                      </CardContent>
                    </Card>

                    {/* Flight Deck */}
                    <Card className="border-2 border-purple-100">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-[#1e40f2] flex items-center justify-center flex-shrink-0">
                            <Plane className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-bold mb-2">Flight Deck</h3>
                            <p className="text-muted-foreground text-sm">
                              Connects strategy to execution; ties actions to growth.
                            </p>
                          </div>
                        </div>

                        {/* Simplified Campaign Board Graphic */}
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-3 mb-4">
                          <div className="flex items-center justify-center gap-2">
                            <div className="w-12 h-12 rounded-full bg-[#1e40f2] flex items-center justify-center">
                              <Plane className="w-5 h-5 text-white" />
                            </div>
                            <ArrowRight className="w-4 h-4 text-blue-400" />
                            <div className="w-12 h-12 rounded-full bg-[#4A63F5] flex items-center justify-center">
                              <CheckCircle2 className="w-5 h-5 text-white" />
                            </div>
                          </div>
                        </div>

                        <PollCard
                          prompt="What's the hardest part of keeping campaigns on track?"
                          options={[
                            { text: 'Too many moving parts' },
                            { text: 'Approvals and reviews drag out' },
                            { text: 'No single calendar or source of truth' },
                            { text: 'Budget or priorities keep shifting' },
                          ]}
                          results={[
                            { text: 'Too many moving parts', percentage: 35, highlighted: true },
                            { text: 'Approvals and reviews drag out', percentage: 28 },
                            { text: 'No single calendar or source of truth', percentage: 25 },
                            { text: 'Budget or priorities keep shifting', percentage: 12 },
                          ]}
                          onVote={() => handlePollVote('campaign_tracking')}
                          hasVoted={pollStates['campaign_tracking'] || false}
                        />

                        {pollStates['campaign_tracking'] && (
                          <KeyTakeaway>
                            <strong>Campaigns fall apart in the gaps between tools and people.</strong>
                          </KeyTakeaway>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Card 9: Stackwise Highlights */}
                <Card className="border-2 border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full border-2 border-[#6218df] flex items-center justify-center flex-shrink-0 bg-white p-1.5">
                        <img 
                          src={emblemIcon} 
                          alt="Stackwise" 
                          className="w-full h-full"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Stackwise Highlights</h3>
                        <p className="text-sm text-muted-foreground">Features that make the system smarter</p>
                      </div>
                    </div>
                    
                    {/* 3 columns x 2 rows grid */}
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      {[
                        { icon: MessageSquare, title: 'Coaching Prompts', desc: 'Built-in guidance', color: 'from-purple-400 to-purple-600' },
                        { icon: Target, title: 'GTM Test Pit', desc: 'Experiment first', color: 'from-blue-400 to-blue-600' },
                        { icon: Lightbulb, title: 'My Plays', desc: 'Repeatable motions', color: 'from-yellow-400 to-orange-500' },
                        { icon: Users, title: 'ABM Playbooks', desc: 'Multi-account campaigns', color: 'from-pink-400 to-pink-600' },
                        { icon: BarChart3, title: 'Eval Matrix', desc: 'Prioritize by impact', color: 'from-green-400 to-green-600' },
                        { icon: Compass, title: 'Quarterly Rhythm', desc: 'Stay on track', color: 'from-indigo-400 to-indigo-600' },
                      ].map((item) => (
                        <div key={item.title} className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-3 text-center">
                          <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center mx-auto mb-2`}>
                            <item.icon className="w-5 h-5 text-white" />
                          </div>
                          <p className="font-semibold text-xs mb-1">{item.title}</p>
                          <p className="text-xs text-muted-foreground leading-tight">{item.desc}</p>
                        </div>
                      ))}
                    </div>

                    <KeyTakeaway>
                      <strong>Guided, not automated — intelligence that keeps you in control.</strong>
                    </KeyTakeaway>
                  </CardContent>
                </Card>

                {/* Card 9.5: Modularity & Flexibility */}
                <Card className="border-2 border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-400 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Zap className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Modularity & Flexibility</h3>
                        <p className="text-sm text-muted-foreground italic">
                          Modularity = budget control for small teams
                        </p>
                      </div>
                    </div>

                    {/* Choose Your Stack - Module Icons & Legend */}
                    <div className="bg-white border-2 border-purple-200 rounded-lg p-5 mb-6">
                      <h4 className="font-semibold text-base text-center mb-4">Choose Your Stack</h4>
                      
                      {/* Module Icons Grid */}
                      <div className="grid grid-cols-4 gap-3 mb-5">
                        <div className="text-center">
                          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#6218df] to-[#8B3FDF] flex items-center justify-center mb-2">
                            <Lightbulb className="w-7 h-7 text-white" />
                          </div>
                          <p className="text-xs font-semibold text-[#6218df]">Strategy<br/>Studio</p>
                          <p className="text-xs text-gray-500 mt-1">Free</p>
                        </div>
                        <div className="text-center">
                          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#6218df] to-[#8B3FDF] flex items-center justify-center mb-2">
                            <Activity className="w-7 h-7 text-white" />
                          </div>
                          <p className="text-xs font-semibold text-[#6218df]">Pulse<br/>Hub</p>
                        </div>
                        <div className="text-center">
                          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#c009ba] to-[#D834C6] flex items-center justify-center mb-2">
                            <Brush className="w-7 h-7 text-white" />
                          </div>
                          <p className="text-xs font-semibold text-[#c009ba]">Brand<br/>Craft</p>
                        </div>
                        <div className="text-center">
                          <div className="w-14 h-14 mx-auto rounded-full bg-gradient-to-br from-[#1e40f2] to-[#4A63F5] flex items-center justify-center mb-2">
                            <Settings className="w-7 h-7 text-white" />
                          </div>
                          <p className="text-xs font-semibold text-[#1e40f2]">Flight<br/>Deck</p>
                        </div>
                      </div>

                      {/* Legend */}
                      <div className="bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-300 rounded-lg p-3 mb-4">
                        <div className="flex items-center justify-center gap-6">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full border-2 border-[#6218df] flex items-center justify-center">
                              <Activity className="w-4 h-4 text-[#6218df]" strokeWidth={2} />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">Outlined = Stacked</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6218df] to-[#8B3FDF] flex items-center justify-center">
                              <Activity className="w-4 h-4 text-white" strokeWidth={2} />
                            </div>
                            <span className="text-xs font-semibold text-gray-700">Filled = Fully Stacked</span>
                          </div>
                        </div>
                      </div>

                      {/* Combo Clusters - 3x2 Grid with Triangle/Abstract Icon Layouts */}
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <h5 className="text-xs font-bold text-purple-900 mb-3">Real Use Cases:</h5>
                        <div className="grid grid-cols-3 gap-3">
                          {/* Combo 1 */}
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <p className="text-xs font-bold text-gray-800 mb-3 text-center">No analyst available, needs steady reporting cadence</p>
                            <div className="flex flex-col items-center gap-2">
                              {/* Top icon */}
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6218df] to-[#8B3FDF] flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" strokeWidth={2} />
                              </div>
                              {/* Bottom two icons */}
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full border-2 border-[#c009ba] flex items-center justify-center">
                                  <Brush className="w-4 h-4 text-[#c009ba]" strokeWidth={2} />
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#1e40f2] flex items-center justify-center">
                                  <Settings className="w-4 h-4 text-[#1e40f2]" strokeWidth={2} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Combo 2 */}
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <p className="text-xs font-bold text-gray-800 mb-3 text-center">Building executive visibility program with ABM tracking</p>
                            <div className="flex flex-col items-center gap-2">
                              {/* Top icon */}
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c009ba] to-[#D834C6] flex items-center justify-center">
                                <Brush className="w-4 h-4 text-white" strokeWidth={2} />
                              </div>
                              {/* Bottom two icons */}
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full border-2 border-[#6218df] flex items-center justify-center">
                                  <Activity className="w-4 h-4 text-[#6218df]" strokeWidth={2} />
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#1e40f2] flex items-center justify-center">
                                  <Settings className="w-4 h-4 text-[#1e40f2]" strokeWidth={2} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Combo 3 */}
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <p className="text-xs font-bold text-gray-800 mb-3 text-center">Proving marketing value with aligned messaging & workflow</p>
                            <div className="flex flex-col items-center gap-2">
                              {/* Top icon */}
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c009ba] to-[#D834C6] flex items-center justify-center">
                                <Brush className="w-4 h-4 text-white" strokeWidth={2} />
                              </div>
                              {/* Bottom two icons */}
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full border-2 border-[#6218df] flex items-center justify-center">
                                  <Activity className="w-4 h-4 text-[#6218df]" strokeWidth={2} />
                                </div>
                                <div className="w-8 h-8 rounded-full border-2 border-[#1e40f2] flex items-center justify-center">
                                  <Settings className="w-4 h-4 text-[#1e40f2]" strokeWidth={2} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Combo 4 */}
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <p className="text-xs font-bold text-gray-800 mb-3 text-center">Performance storytelling with real-time campaign collaboration</p>
                            <div className="flex flex-col items-center gap-2">
                              {/* Top icon */}
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#6218df] to-[#8B3FDF] flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" strokeWidth={2} />
                              </div>
                              {/* Bottom two icons */}
                              <div className="flex items-center gap-4">
                                <div className="w-8 h-8 rounded-full border-2 border-[#c009ba] flex items-center justify-center">
                                  <Brush className="w-4 h-4 text-[#c009ba]" strokeWidth={2} />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#1e40f2] to-[#4A63F5] flex items-center justify-center">
                                  <Settings className="w-4 h-4 text-white" strokeWidth={2} />
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* Combo 5 - NEW: PulseHub Stacked + BrandCraft Fully Stacked */}
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <p className="text-xs font-bold text-gray-800 mb-3 text-center">Needs journey mapping, influence insights, and tone consistency across fragmented content</p>
                            <div className="flex flex-col items-center gap-3">
                              {/* Top icon */}
                              <div className="w-8 h-8 rounded-full border-2 border-[#6218df] flex items-center justify-center">
                                <Activity className="w-4 h-4 text-[#6218df]" strokeWidth={2} />
                              </div>
                              {/* Bottom icon */}
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#c009ba] to-[#D834C6] flex items-center justify-center">
                                <Brush className="w-4 h-4 text-white" strokeWidth={2} />
                              </div>
                            </div>
                          </div>

                          {/* Combo 6 - NEW: PulseHub Stacked only */}
                          <div className="bg-white rounded-lg p-4 border border-purple-200">
                            <p className="text-xs font-bold text-gray-800 mb-3 text-center">Needs audit finds of marketing performance</p>
                            <div className="flex flex-col items-center gap-2">
                              {/* Single centered icon */}
                              <div className="w-8 h-8 rounded-full border-2 border-[#6218df] flex items-center justify-center">
                                <Activity className="w-4 h-4 text-[#6218df]" strokeWidth={2} />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* How to Build Your Stack - 2x2 Cards */}
                    <div className="mb-4 print:break-before-page">
                      <p className="text-xl font-semibold text-center mb-4 text-gray-800">Built for the way marketing teams work — flexible, focused, and human.</p>
                      <div className="grid grid-cols-2 gap-3">
                        {/* Card 1 */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-bold text-sm mb-2 text-[#6218df]">Mix & Match Modules</h4>
                          <p className="text-xs text-gray-700">Choose the modules you need, with the features you'll actually use.</p>
                        </div>

                        {/* Card 2 */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-bold text-sm mb-2 text-[#6218df]">Affordable</h4>
                          <p className="text-xs text-gray-700">No contracts, no surprises — transparent pricing that won't crush your budget.</p>
                        </div>

                        {/* Card 3 */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-bold text-sm mb-2 text-[#6218df]">Easy Onboarding</h4>
                          <p className="text-xs text-gray-700">Guided setup helps you connect your tools and start working fast.</p>
                        </div>

                        {/* Card 4 */}
                        <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-4">
                          <h4 className="font-bold text-sm mb-2 text-[#6218df]">Built for Lean Teams</h4>
                          <p className="text-xs text-gray-700">Gives you headspace and time to lead, with Human-in-the-Loop built into every feature.</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <KeyTakeaway>
                        <strong>Stackwise fits your work — not the other way around.</strong>
                      </KeyTakeaway>
                      <KeyTakeaway>
                        <strong>Marketing doesn't need more automation — it needs systems that help humans lead, connect, and grow.</strong>
                      </KeyTakeaway>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 10: Humanality Definition */}
                <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 flex items-center justify-center flex-shrink-0 text-[#6218df]">
                        <Fingerprint className="w-12 h-12" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">Humanality</h3>
                        <p className="text-sm text-muted-foreground italic">
                          The human spark that machines can't replicate
                        </p>
                      </div>
                    </div>

                    {/* AI vs Human Spark Comparison */}
                    <div className="grid grid-cols-2 gap-6 mb-4 relative">
                      {/* AI Column */}
                      <div className="bg-white border border-gray-300 rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <Cpu className="w-5 h-5 text-gray-500" />
                          <h4 className="font-bold text-sm text-gray-700">AI's Strengths</h4>
                        </div>
                        <p className="text-xs text-gray-500 italic mb-3">Logic without context</p>
                        <p className="text-xs text-gray-500 italic mb-3">The function of intelligence</p>
                        <ul className="space-y-2 text-xs text-gray-600">
                          <li className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>Pattern recognition</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>Data processing</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>Automation at scale</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-gray-400 mt-0.5">•</span>
                            <span>Speed & efficiency</span>
                          </li>
                        </ul>
                      </div>

                      {/* Visual Divider */}
                      <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-300 to-pink-300 transform -translate-x-1/2" />

                      {/* Human Spark Column */}
                      <div className="bg-gradient-to-br from-purple-100 to-pink-100 border-2 border-[#6218df] rounded-lg p-4">
                        <div className="flex items-center gap-2 mb-2">
                          <img 
                            src={emblemIcon} 
                            alt="Stackwise" 
                            className="w-5 h-5"
                          />
                          <h4 className="font-bold text-sm text-[#6218df]">Human Spark</h4>
                        </div>
                        <p className="text-xs text-[#6218df] italic mb-3">Context that gives logic meaning</p>
                        <p className="text-xs text-[#6218df] italic mb-3">The feeling behind it</p>
                        <ul className="space-y-2 text-xs text-gray-700">
                          <li className="flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">✓</span>
                            <span><strong>Empathy</strong> & intuition</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">✓</span>
                            <span><strong>Context</strong> & judgment</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">✓</span>
                            <span><strong>Creativity</strong> & strategy</span>
                          </li>
                          <li className="flex items-start gap-2">
                            <span className="text-[#6218df] mt-0.5">✓</span>
                            <span><strong>Meaning</strong> from data</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    <p className="text-sm text-gray-700 mb-3">
                      The real advantage isn't automation — it's understanding how to use it.
                    </p>

                    <KeyTakeaway>
                      <strong>Humanality is the uniquely human ability to connect reason with feeling and data with meaning. As an example — humans can define humanality. AI can't.</strong>
                    </KeyTakeaway>
                  </CardContent>
                </Card>

                {/* Card 11: Human + AI Partnership */}
                <Card className="border-2 border-purple-100">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4 mb-6">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                        <Sparkles className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">The Future of AI Isn't AI. It's Human + AI</h3>
                        <p className="text-sm text-muted-foreground italic">
                          Because the real breakthrough isn't automation. It's partnership.
                        </p>
                      </div>
                    </div>

                    <div className="mb-6">
                      <p className="text-sm text-gray-700 mb-3">
                        Technology can scale. It can optimize. It can learn patterns and make predictions.
                      </p>
                      <p className="text-sm text-gray-700">
                        But only humans can connect the dots between what the data says and what it means for your business, your customers, and your brand.
                      </p>
                    </div>

                    {/* 3 Circles Visual - Blending Gradients with Arrows */}
                    <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-lg p-6 mb-6">
                      <div className="flex items-center justify-center gap-4">
                        {/* Circle 1: AI */}
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center">
                            <Cpu className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-xs text-center mt-2 font-medium text-gray-600">AI</p>
                        </div>

                        {/* Arrow from AI to Partnership */}
                        <ArrowRight className="w-6 h-6 text-gray-500 flex-shrink-0" />

                        {/* Circle 2: Blended - Partnership */}
                        <div className="relative">
                          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6218df] via-[#c009ba] to-[#1e40f2] flex items-center justify-center shadow-lg">
                            <Heart className="w-10 h-10 text-white" />
                          </div>
                          <p className="text-xs text-center mt-2 font-semibold text-[#6218df]">Partnership</p>
                        </div>

                        {/* Arrow from Human to Partnership */}
                        <ArrowRight className="w-6 h-6 text-[#6218df] flex-shrink-0 rotate-180" />

                        {/* Circle 3: Human */}
                        <div className="relative">
                          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                            <User className="w-8 h-8 text-white" />
                          </div>
                          <p className="text-xs text-center mt-2 font-medium text-[#6218df]">Human</p>
                        </div>
                      </div>
                    </div>

                    <KeyTakeaway>
                      <strong>AI amplifies what's possible. People define what's meaningful.</strong>
                    </KeyTakeaway>
                  </CardContent>
                </Card>

                {/* Card 12: Closing & CTA */}
                <Card className="border-4 border-[#6218df] bg-gradient-to-br from-purple-50 to-pink-50">
                  <CardContent className="p-8">
                    <div className="flex justify-center mb-6">
                      <img 
                        src={stackwiseLogo} 
                        alt="Stackwise" 
                        className="h-16 w-auto object-contain"
                      />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 text-center">You don't need more tools — you need a system that amplifies you.</h3>
                    <p className="text-lg text-muted-foreground mb-6 text-center">
                      You are the differentiator. Stackwise helps you prove it.
                    </p>
                    <div className="bg-white border-l-4 border-[#6218df] p-4 rounded mb-8">
                      <p className="font-semibold text-sm flex items-center gap-2 justify-center">
                        <CheckCircle2 className="w-4 h-4 text-[#6218df]" />
                        Key Takeaway
                      </p>
                      <p className="text-sm text-gray-700 mt-2 text-center">
                        Marketing runs on people — Stackwise helps them lead better.
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-3 justify-center">
                      <Button 
                        className="bg-[#6218df] hover:bg-[#6218df]/90" 
                        onClick={() => window.open('https://share-na2.hsforms.com/131RweUMoR1-tpigPr-l6Ew40e0ev', '_blank')}
                        data-testid="button-join-waitlist"
                      >
                        Join the Waitlist
                      </Button>
                      <Button 
                        variant="outline" 
                        className="border-2 border-[#6218df] text-[#6218df] hover:bg-[#6218df]/10"
                        onClick={() => window.open('https://stackwise-demo.replit.app/', '_blank')}
                        data-testid="button-visit-demo-final"
                      >
                        Demo
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-2 border-[#c009ba] text-[#c009ba] hover:bg-[#c009ba]/10"
                        onClick={() => window.open('https://jenpicardomarketing.com/services/stackwise/', '_blank')}
                        data-testid="button-learn-about-stackwise"
                      >
                        Learn about Stackwise
                      </Button>
                      <Button 
                        variant="outline"
                        className="border-2 border-[#c009ba] text-[#c009ba] hover:bg-[#c009ba]/10"
                        onClick={() => window.open('https://jenpicardomarketing.com/contact/', '_blank')}
                        data-testid="button-contact-us"
                      >
                        Contact Us
                      </Button>
                    </div>

                    {/* Download PDF Button */}
                    <div className="mt-6 flex justify-center">
                      <Button 
                        variant="outline"
                        onClick={handleDownloadPDF}
                        className="gap-2"
                        data-testid="button-download-pdf"
                      >
                        <Download className="w-4 h-4" />
                        Download Presentation as PDF
                      </Button>
                    </div>
                  </CardContent>
                </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
