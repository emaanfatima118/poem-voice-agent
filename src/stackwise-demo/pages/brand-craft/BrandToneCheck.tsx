import { useMemo, useState } from 'react';
import { Button } from '@/stackwise-demo/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/stackwise-demo/components/ui/dialog';
import { Input } from '@/stackwise-demo/components/ui/input';
import { Label } from '@/stackwise-demo/components/ui/label';
import { Textarea } from '@/stackwise-demo/components/ui/textarea';
import { useQuery, useMutation } from '@tanstack/react-query';
import { apiRequest, queryClient } from '@/stackwise-demo/lib/queryClient';
import { useToast } from '@/stackwise-demo/hooks/use-toast';
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout';
import { QuickActions } from '@/stackwise-demo/components/QuickActions';
import type { Project, VoiceCheck, AssetComparison } from '@shared/schema';

type StepKey = 'dashboard' | 'insights';

export default function Dashboard() {
  const [currentStep, setCurrentStep] = useState<StepKey>('dashboard');
  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [openDialogOpen, setOpenDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [voiceCheckResults, setVoiceCheckResults] = useState<any>(null);
  const [comparisonResults, setComparisonResults] = useState<any>(null);
  
  const { toast } = useToast();

  // Fetch all projects
  const { data: projects = [] } = useQuery<Project[]>({
    queryKey: ['/api/projects'],
  });

  // Create project mutation
  const createProjectMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const res = await apiRequest('POST', '/api/projects', data);
      return await res.json();
    },
    onSuccess: (project: Project) => {
      queryClient.invalidateQueries({ queryKey: ['/api/projects'] });
      setCurrentProjectId(project.id);
      setSaveDialogOpen(false);
      setProjectName('');
      setProjectDescription('');
      toast({
        title: 'Project Saved',
        description: `"${project.name}" has been saved successfully.`
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save project',
        variant: 'destructive'
      });
    }
  });

  // Load project mutation
  const loadProjectMutation = useMutation({
    mutationFn: async (projectId: string) => {
      const res = await fetch(`/api/projects/${projectId}`, {
        credentials: 'include'
      });
      if (!res.ok) {
        throw new Error('Failed to load project');
      }
      return await res.json();
    },
    onSuccess: (data: any) => {
      setCurrentProjectId(data.project.id);
      setOpenDialogOpen(false);
      toast({
        title: 'Project Loaded',
        description: `"${data.project.name}" has been loaded.`
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to load project',
        variant: 'destructive'
      });
    }
  });

  const onSave = () => {
    if (!currentProjectId) {
      setSaveDialogOpen(true);
    } else {
      toast({
        title: 'Saved',
        description: 'All changes have been saved to the current project.'
      });
    }
  };

  const onOpenProject = () => {
    setOpenDialogOpen(true);
  };

  const handleSaveProject = () => {
    if (!projectName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a project name',
        variant: 'destructive'
      });
      return;
    }
    createProjectMutation.mutate({
      name: projectName,
      description: projectDescription || undefined
    });
  };

  const handleLoadProject = (projectId: string) => {
    loadProjectMutation.mutate(projectId);
  };

  // Data
  const summaryMetrics = [
    { label: 'Tone Match', score: 89, trend: '+5%', detail: 'Alignment improving across campaigns.' },
    { label: 'Clarity', score: 91, trend: '+2%', detail: 'Simpler phrasing raised readability.' },
    { label: 'Consistency', score: 87, trend: '-1%', detail: 'Slight drift in MoFu emails.' },
    { label: 'Language Fit', score: 84, trend: '+1%', detail: 'Minor jargon in exec posts.' },
    { label: 'Rhythm', score: 88, trend: '+3%', detail: 'More varied sentence lengths.' }
  ];

  const alerts = [
    { title: 'Tone Drift Detected', severity: 'High', message: 'Mid‑funnel campaigns show inconsistent tone.' },
    { title: 'Persona Misalignment', severity: 'Medium', message: 'Executive Voice not applied in leadership copy.' }
  ];

  const breakdown = {
    Stage: ['Awareness', 'Consideration', 'Decision', 'Retention'],
    Goal: [
      'Brand Awareness', 'Demand Gen', 'Lead Gen', 'Pipeline Acceleration', 'Revenue',
      'Retention', 'Advocacy', 'NPS', 'Product Adoption', 'Thought Leadership'
    ],
    Channel: [
      'Website', 'Blog', 'Landing Pages', 'Email', 'Newsletter', 'Webinar', 'Docs/KB',
      'Search Ads', 'Display', 'Programmatic', 'LinkedIn Ads', 'Paid Social', 'Sponsored Content', 'ABM Platforms',
      'LinkedIn (Organic)', 'X/Twitter (Organic)', 'Facebook (Organic)', 'Instagram (Organic)', 'Reddit (Organic)', 'YouTube (Organic)', 'TikTok (Organic)',
      'PR', 'Podcasts', 'Reviews', 'Communities'
    ],
    Persona: ['Brand Core', 'Executive Voice', 'Thought Leadership', 'Practitioner', 'Buyer (Economic)', 'Buyer (Technical)'],
    Pillar: ['Messaging', 'Engagement', 'Trust']
  };

  const pillarSubtopics: Record<string, Array<{ name: string; score: number; insight: string; reco: string }>> = {
    Messaging: [
      { name: 'Core Story', score: 92, insight: 'Storyline consistent across campaigns.', reco: 'Maintain proof‑first framing.' },
      { name: 'Key Phrases', score: 85, insight: 'Repetition of generic words.', reco: 'Replace with specific descriptors.' }
    ],
    Engagement: [
      { name: 'Social Tone', score: 83, insight: 'Tone casual for exec audience.', reco: 'Tighten phrasing; use professional verbs.' },
      { name: 'Conversation Hooks', score: 88, insight: 'Good interaction triggers.', reco: 'Add stronger CTAs early.' }
    ],
    Trust: [
      { name: 'Transparency', score: 84, insight: 'Proof underused.', reco: 'Add metrics or customer examples.' },
      { name: 'Empathy Markers', score: 78, insight: 'Tone cool in openings.', reco: 'Start with a relatable problem.' }
    ]
  };

  const assetsCatalog = [
    'Website Hero Copy', 'Email Nurture #2', 'LinkedIn Thought Piece', 'Ad Variant B', 'Case Study: ACME', 'Landing Page: Demo',
    'Product One‑Pager', 'Webinar Invite', 'Post‑Event Follow‑up', 'Pricing Page', 'Product FAQ'
  ];

  const campaigns = ['Q4 Launch', 'Evergreen ABM', 'Partner Push'];

  const [selectedFilters, setSelectedFilters] = useState<Record<string, string>>({});
  const handleSelect = (key: string, value: string) => setSelectedFilters({ ...selectedFilters, [key]: value });
  const rand = (min = 80, max = 95) => Math.floor(Math.random() * (max - min + 1)) + min;

  // Dashboard Tab - Breakdown Card
  const renderBreakdownCard = (title: string, options: string[]) => {
    const selected = selectedFilters[title] || '';
    let results: string[] = [];
    if (selected === 'Select All') results = options;
    else if (selected) results = [selected];

    return (
      <Card key={title} className="p-4">
        <h4 className="font-semibold text-slate-800 mb-2">{title}</h4>
        <label className="text-slate-600 text-xs">Select {title}:</label>
        <select
          className="border border-input rounded-md w-full p-2 text-sm mt-1"
          value={selected}
          onChange={(e) => handleSelect(title, e.target.value)}
          data-testid={`select-${title.toLowerCase()}`}
        >
          <option value="">Choose</option>
          <option value="Select All">Select All</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>

        {results.length > 0 && (
          <div className="mt-3 space-y-2">
            {results.map((r, i) => (
              <div key={i} className="bg-slate-50 border border-slate-200 rounded-md p-3">
                <p className="font-medium text-indigo-700">{r}</p>
                <p className="text-sm text-slate-700">Score: {rand()} | Comment: Clarity consistent, tone balanced.</p>
                <p className="text-sm text-slate-600">Insight: {r} performing above baseline; steady tone adherence.</p>
                <p className="text-sm text-slate-600 italic">Recos: Continue rhythm variance and emphasize empathy cues.</p>
                {title === 'Pillar' && pillarSubtopics[r] && (
                  <div className="mt-2 border-t pt-2">
                    <p className="font-semibold text-indigo-600 mb-1">Subtopics</p>
                    {pillarSubtopics[r].map((s, idx) => (
                      <div key={idx} className="ml-2 mb-1">
                        <p className="text-sm">◦ {s.name}: {s.score}</p>
                        <p className="text-[12px] text-slate-600">Insight: {s.insight}</p>
                        <p className="text-[12px] text-slate-600 italic">Recos: {s.reco}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>
    );
  };

  // Voice Check Tab - Unified asset management (max 5 assets from any source)
  type Asset = { id: string; type: 'text' | 'file' | 'link' | 'catalog'; name: string; content?: string };
  const [vcSelectedAssets, setVcSelectedAssets] = useState<Asset[]>([
    { id: '1', type: 'catalog', name: 'Website Hero Copy' }
  ]);
  const [vcText, setVcText] = useState('');
  const [vcLinkInput, setVcLinkInput] = useState('');
  const [vcSearch, setVcSearch] = useState('');
  const [vcRan, setVcRan] = useState(false);
  
  // Add asset with 5-item limit
  const addVcAsset = (asset: Omit<Asset, 'id'>) => {
    if (vcSelectedAssets.length >= 5) {
      toast({
        title: 'Asset Limit Reached',
        description: 'You can select up to 5 assets. Please remove one to add another.',
        variant: 'destructive'
      });
      return false;
    }
    setVcSelectedAssets([...vcSelectedAssets, { ...asset, id: Date.now().toString() }]);
    return true;
  };
  
  const removeVcAsset = (id: string) => {
    setVcSelectedAssets(vcSelectedAssets.filter(a => a.id !== id));
  };

  const filteredAssets = useMemo(() => {
    const q = vcSearch.trim().toLowerCase();
    return !q ? assetsCatalog : assetsCatalog.filter(a => a.toLowerCase().includes(q));
  }, [vcSearch, assetsCatalog]);

  const guidelineFlags = [
    { k: 'Empathy Tone', msg: 'Open with user problem; add warmth in first 2 sentences.' },
    { k: 'Jargon Use', msg: 'Replace platform‑jargon with specific outcomes and verbs.' },
    { k: 'Clarity Drift', msg: 'Tighten long sentences (>24 words); remove nested clauses.' },
    { k: 'Rhythm Pacing', msg: 'Vary sentence length; use 1–2 punchy lines per section.' },
    { k: 'Consistency Drift', msg: 'Align CTA phrasing with approved forms (e.g., "Book a demo").' }
  ];

  const phrasesWeUse = ['"Show your work" proof blocks', '"Book a demo" / "See it live"', 'Problem–Insight–Proof–Action arc'];
  const phrasesDontUse = ['"Synergy", "cutting‑edge", "leverage AI" (generic)', 'Over‑formal ("therefore", "henceforth")'];

  const renderVoiceCheck = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-slate-800">Brand Voice Check</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSave} data-testid="button-save-voice">
            {currentProjectId ? 'Save Progress' : 'Save New Project'}
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenProject} data-testid="button-open-voice">
            Open Project
          </Button>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-4">Add up to 5 assets from any source (text, files, links, or catalog). All inputs contribute to the same pool.</p>
      
      {/* Selected Assets Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-700">Selected Assets ({vcSelectedAssets.length}/5)</p>
          {vcSelectedAssets.length === 5 && (
            <span className="text-xs text-amber-600 font-medium">Maximum reached</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {vcSelectedAssets.map((asset) => (
            <div
              key={asset.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs"
              data-testid={`asset-${asset.id}`}
            >
              <span className="px-1.5 py-0.5 bg-indigo-100 rounded text-[10px] font-medium text-indigo-700">
                {asset.type}
              </span>
              <span className="text-slate-700">{asset.name}</span>
              <button
                onClick={() => removeVcAsset(asset.id)}
                className="text-slate-400 hover:text-red-600"
                data-testid={`button-remove-${asset.id}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Text Input */}
        <div className="space-y-3">
          <Label className="text-xs font-medium text-slate-700">Paste Content</Label>
          <textarea
            value={vcText}
            onChange={(e) => setVcText(e.target.value)}
            placeholder="Paste your content here..."
            className="border border-input rounded-md w-full p-3 text-sm h-32"
            data-testid="textarea-content"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            disabled={!vcText.trim() || vcSelectedAssets.length >= 5}
            onClick={() => {
              if (addVcAsset({ type: 'text', name: `Text snippet ${vcSelectedAssets.length + 1}`, content: vcText })) {
                setVcText('');
              }
            }}
            data-testid="button-add-text"
          >
            Add Text as Asset
          </Button>
        </div>

        {/* File, Link, and Catalog */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-medium text-slate-700 mb-2 block">Upload Files</Label>
            <input
              type="file"
              multiple
              className="border border-input w-full text-xs p-2 rounded"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(file => {
                  addVcAsset({ type: 'file', name: file.name });
                });
                e.target.value = '';
              }}
              disabled={vcSelectedAssets.length >= 5}
              data-testid="input-files"
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-700 mb-2 block">Add Link</Label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://..."
                value={vcLinkInput}
                onChange={(e) => setVcLinkInput(e.target.value)}
                className="border border-input flex-1 text-xs p-2 rounded"
                disabled={vcSelectedAssets.length >= 5}
                data-testid="input-link"
              />
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={!vcLinkInput.trim() || vcSelectedAssets.length >= 5}
                onClick={() => {
                  if (addVcAsset({ type: 'link', name: vcLinkInput })) {
                    setVcLinkInput('');
                  }
                }}
                data-testid="button-add-link"
              >
                Add
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-700 mb-2 block">Search Catalog Assets</Label>
            <input
              className="border border-input rounded p-2 text-xs w-full mb-2"
              placeholder="Search assets..."
              value={vcSearch}
              onChange={(e) => setVcSearch(e.target.value)}
              data-testid="input-search-assets"
            />
            <div className="border border-input rounded p-2 max-h-24 overflow-y-auto space-y-1">
              {filteredAssets.map(a => (
                <button
                  key={a}
                  className="block w-full text-left text-xs px-2 py-1 hover-elevate rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => addVcAsset({ type: 'catalog', name: a })}
                  disabled={vcSelectedAssets.length >= 5 || vcSelectedAssets.some(asset => asset.name === a)}
                  data-testid={`button-catalog-${a}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-4"
        onClick={() => setVcRan(true)}
        disabled={vcSelectedAssets.length === 0}
        data-testid="button-run-check"
      >
        Run Voice Check ({vcSelectedAssets.length} {vcSelectedAssets.length === 1 ? 'Asset' : 'Assets'})
      </Button>

      {vcRan && (() => {
        // Generate comprehensive dummy data for each asset
        const assetResults = vcSelectedAssets.map((asset, idx) => {
          const baseScore = 82 + idx * 3;
          return {
            asset,
            scores: {
              toneMatch: baseScore + rand(-5, 8),
              clarity: baseScore + rand(-3, 10),
              consistency: baseScore + rand(-7, 6),
              languageFit: baseScore + rand(-4, 7),
              rhythm: baseScore + rand(-6, 9)
            },
            insights: [
              idx === 0 ? 'Strong emotional appeal with clear value proposition' : 
              idx === 1 ? 'Consistent brand voice throughout, good use of proof points' :
              idx === 2 ? 'Well-structured narrative arc, maintains reader engagement' :
              idx === 3 ? 'Effective use of customer-centric language' :
              'Compelling storytelling with authentic brand personality',
              
              idx % 2 === 0 ? 'CTA placement is optimal for conversion' :
              'Rhythm variance keeps content engaging'
            ],
            flags: [
              idx === 0 ? { type: 'warning', text: 'Consider adding more empathy cues in opening line' } :
              idx === 1 ? { type: 'success', text: 'Excellent alignment with executive voice persona' } :
              idx === 2 ? { type: 'warning', text: 'Some technical jargon may alienate non-technical readers' } :
              idx === 3 ? { type: 'info', text: 'Sentence length could be more varied for better rhythm' } :
              { type: 'success', text: 'Strong proof-first approach resonates with target audience' }
            ],
            recommendations: [
              idx % 3 === 0 ? 'Add more metric-based proof in first paragraph' :
              idx % 3 === 1 ? 'Strengthen CTA with urgency element' :
              'Include customer success story for credibility',
              
              idx % 2 === 0 ? 'Vary sentence length: add 1-2 punchy statements' :
              'Replace industry jargon with outcome-focused language'
            ]
          };
        });
        
        const avgScores = {
          toneMatch: Math.round(assetResults.reduce((s, r) => s + r.scores.toneMatch, 0) / assetResults.length),
          clarity: Math.round(assetResults.reduce((s, r) => s + r.scores.clarity, 0) / assetResults.length),
          consistency: Math.round(assetResults.reduce((s, r) => s + r.scores.consistency, 0) / assetResults.length),
          languageFit: Math.round(assetResults.reduce((s, r) => s + r.scores.languageFit, 0) / assetResults.length),
          rhythm: Math.round(assetResults.reduce((s, r) => s + r.scores.rhythm, 0) / assetResults.length)
        };
        
        return (
          <div className="mt-6">
            {/* Overall Scores */}
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Overall Analysis</h3>
            <div className="grid md:grid-cols-5 gap-4 mb-6">
              {[
                { label: 'Tone Match', val: avgScores.toneMatch },
                { label: 'Clarity', val: avgScores.clarity },
                { label: 'Consistency', val: avgScores.consistency },
                { label: 'Language Fit', val: avgScores.languageFit },
                { label: 'Rhythm', val: avgScores.rhythm }
              ].map((m, i) => (
                <div key={i} className="p-4 bg-indigo-50 border border-indigo-100 rounded-xl">
                  <p className="text-xs text-slate-600">{m.label}</p>
                  <p className="text-2xl font-semibold text-indigo-800" data-testid={`score-${m.label.toLowerCase().replace(' ', '-')}`}>{m.val}</p>
                  <div className="mt-2 bg-slate-200 rounded-full h-1.5 overflow-hidden">
                    <div className="bg-indigo-600 h-full" style={{ width: `${m.val}%` }}></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Individual Asset Results */}
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Individual Asset Analysis</h3>
            <div className="space-y-4 mb-6">
              {assetResults.map((result, idx) => (
                <Card key={result.asset.id} className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-slate-900">{result.asset.name}</h4>
                        <span className={`text-[10px] px-2 py-0.5 rounded ${
                          result.asset.type === 'text' ? 'bg-blue-100 text-blue-700' :
                          result.asset.type === 'file' ? 'bg-green-100 text-green-700' :
                          result.asset.type === 'link' ? 'bg-purple-100 text-purple-700' :
                          'bg-indigo-100 text-indigo-700'
                        }`}>
                          {result.asset.type}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-slate-500">Overall Score</p>
                      <p className="text-xl font-bold text-indigo-600">
                        {Math.round(Object.values(result.scores).reduce((s, v) => s + v, 0) / 5)}
                      </p>
                    </div>
                  </div>

                  {/* Scores Grid */}
                  <div className="grid grid-cols-5 gap-3 mb-3">
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Tone</p>
                      <p className="text-lg font-semibold text-slate-800">{result.scores.toneMatch}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Clarity</p>
                      <p className="text-lg font-semibold text-slate-800">{result.scores.clarity}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Consistency</p>
                      <p className="text-lg font-semibold text-slate-800">{result.scores.consistency}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Language</p>
                      <p className="text-lg font-semibold text-slate-800">{result.scores.languageFit}</p>
                    </div>
                    <div className="text-center">
                      <p className="text-[10px] text-slate-500 uppercase mb-1">Rhythm</p>
                      <p className="text-lg font-semibold text-slate-800">{result.scores.rhythm}</p>
                    </div>
                  </div>

                  {/* Insights */}
                  <div className="mb-3 pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-700 mb-1.5">Key Insights:</p>
                    {result.insights.map((insight, i) => (
                      <p key={i} className="text-xs text-slate-600 mb-1">✓ {insight}</p>
                    ))}
                  </div>

                  {/* Flags */}
                  <div className="mb-3">
                    {result.flags.map((flag, i) => (
                      <div
                        key={i}
                        className={`text-xs px-3 py-2 rounded ${
                          flag.type === 'warning' ? 'bg-amber-50 text-amber-800 border border-amber-200' :
                          flag.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' :
                          'bg-blue-50 text-blue-800 border border-blue-200'
                        }`}
                      >
                        {flag.text}
                      </div>
                    ))}
                  </div>

                  {/* Recommendations */}
                  <div className="pt-3 border-t border-slate-200">
                    <p className="text-xs font-medium text-slate-700 mb-1.5">Recommendations:</p>
                    {result.recommendations.map((rec, i) => (
                      <p key={i} className="text-xs text-slate-600 mb-1 italic">→ {rec}</p>
                    ))}
                  </div>
                </Card>
              ))}
            </div>

            {/* Summary Analysis */}
            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm font-semibold text-slate-800 mb-2">Cross-Asset Insights</p>
                <p className="text-sm text-slate-700">
                  Tone alignment is {avgScores.toneMatch >= 90 ? 'excellent' : avgScores.toneMatch >= 80 ? 'strong' : 'developing'} across selected assets. 
                  {avgScores.clarity >= 90 ? ' Clarity is exceptional with precise, accessible language.' : ' Consider simplifying complex phrases for better readability.'}
                  {avgScores.consistency < 85 ? ' Some inconsistency detected in voice application across channels.' : ' Brand voice consistency is well-maintained.'}
                </p>
              </Card>
              
              <Card className="p-4">
                <p className="text-sm font-semibold text-slate-800 mb-2">Priority Actions</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li>• Standardize CTAs across all assets ("Book a demo" vs "See it live")</li>
                  <li>• Add proof points (metrics, testimonials) in first paragraph</li>
                  <li>• Increase sentence variety: mix short punchy statements with longer explanations</li>
                </ul>
              </Card>

              <Card className="p-4">
                <p className="text-sm font-semibold text-slate-800 mb-2">Guideline Compliance</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  {guidelineFlags.slice(0, 3).map((f) => (
                    <li key={f.k}><span className="font-medium">{f.k}:</span> {f.msg}</li>
                  ))}
                </ul>
              </Card>

              <Card className="p-4">
                <p className="text-sm font-semibold text-slate-800 mb-2">Brand Voice Strength Matrix</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li><strong>S</strong>: {avgScores.clarity >= 85 ? 'Clear, accessible language' : 'Consistent messaging structure'}</li>
                  <li><strong>W</strong>: {avgScores.rhythm < 85 ? 'Rhythm monotony in some assets' : 'Minor CTA variations'}</li>
                  <li><strong>O</strong>: Expand proof-first approach, add customer stories</li>
                  <li><strong>T</strong>: Competitors using warmer executive tone</li>
                </ul>
              </Card>
            </div>
          </div>
        );
      })()}
    </Card>
  );

  // Compare Assets Tab - Unified asset management (max 5 assets from any source)
  const [cmpSelectedAssets, setCmpSelectedAssets] = useState<Asset[]>([
    { id: 'cmp1', type: 'catalog', name: 'Website Hero Copy' },
    { id: 'cmp2', type: 'catalog', name: 'Email Nurture #2' }
  ]);
  const [cmpText, setCmpText] = useState('');
  const [cmpLinkInput, setCmpLinkInput] = useState('');
  const [cmpSearch, setCmpSearch] = useState('');
  const [cmpRan, setCmpRan] = useState(false);
  
  const addCmpAsset = (asset: Omit<Asset, 'id'>) => {
    if (cmpSelectedAssets.length >= 5) {
      toast({
        title: 'Asset Limit Reached',
        description: 'You can compare up to 5 assets. Please remove one to add another.',
        variant: 'destructive'
      });
      return false;
    }
    setCmpSelectedAssets([...cmpSelectedAssets, { ...asset, id: `cmp${Date.now()}` }]);
    return true;
  };
  
  const removeCmpAsset = (id: string) => {
    setCmpSelectedAssets(cmpSelectedAssets.filter(a => a.id !== id));
  };

  const filteredCmpAssets = useMemo(() => {
    const q = cmpSearch.trim().toLowerCase();
    return !q ? assetsCatalog : assetsCatalog.filter(a => a.toLowerCase().includes(q));
  }, [cmpSearch, assetsCatalog]);

  const genScoreRow = () => ({ Tone: rand(), Clarity: rand(), Consistency: rand(), 'Language Fit': rand(), Rhythm: rand() });

  const renderCompare = () => (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <h2 className="text-xl font-semibold text-slate-800">Compare Assets</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={onSave} data-testid="button-save-compare">
            {currentProjectId ? 'Save Progress' : 'Save New Project'}
          </Button>
          <Button variant="outline" size="sm" onClick={onOpenProject} data-testid="button-open-compare">
            Open Project
          </Button>
        </div>
      </div>

      <p className="text-slate-600 text-sm mb-4">Add up to 5 assets from any source (text, files, links, or catalog). All inputs contribute to the same pool.</p>
      
      {/* Selected Assets Display */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-medium text-slate-700">Selected Assets ({cmpSelectedAssets.length}/5)</p>
          {cmpSelectedAssets.length === 5 && (
            <span className="text-xs text-amber-600 font-medium">Maximum reached</span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {cmpSelectedAssets.map((asset) => (
            <div
              key={asset.id}
              className="inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-full text-xs"
              data-testid={`asset-${asset.id}`}
            >
              <span className="px-1.5 py-0.5 bg-indigo-100 rounded text-[10px] font-medium text-indigo-700">
                {asset.type}
              </span>
              <span className="text-slate-700">{asset.name}</span>
              <button
                onClick={() => removeCmpAsset(asset.id)}
                className="text-slate-400 hover:text-red-600"
                data-testid={`button-remove-${asset.id}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {/* Text Input */}
        <div className="space-y-3">
          <Label className="text-xs font-medium text-slate-700">Paste Content</Label>
          <textarea
            value={cmpText}
            onChange={(e) => setCmpText(e.target.value)}
            placeholder="Paste content to compare..."
            className="border border-input rounded-md w-full p-3 text-sm h-32"
            data-testid="textarea-compare-content"
          />
          <Button
            variant="outline"
            size="sm"
            className="w-full text-xs"
            disabled={!cmpText.trim() || cmpSelectedAssets.length >= 5}
            onClick={() => {
              if (addCmpAsset({ type: 'text', name: `Text snippet ${cmpSelectedAssets.length + 1}`, content: cmpText })) {
                setCmpText('');
              }
            }}
            data-testid="button-add-compare-text"
          >
            Add Text as Asset
          </Button>
        </div>

        {/* File, Link, and Catalog */}
        <div className="space-y-3">
          <div>
            <Label className="text-xs font-medium text-slate-700 mb-2 block">Upload Files</Label>
            <input
              type="file"
              multiple
              className="border border-input w-full text-xs p-2 rounded"
              onChange={(e) => {
                const files = Array.from(e.target.files || []);
                files.forEach(file => {
                  addCmpAsset({ type: 'file', name: file.name });
                });
                e.target.value = '';
              }}
              disabled={cmpSelectedAssets.length >= 5}
              data-testid="input-compare-files"
            />
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-700 mb-2 block">Add Link</Label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="https://..."
                value={cmpLinkInput}
                onChange={(e) => setCmpLinkInput(e.target.value)}
                className="border border-input flex-1 text-xs p-2 rounded"
                disabled={cmpSelectedAssets.length >= 5}
                data-testid="input-compare-link"
              />
              <Button
                variant="outline"
                size="sm"
                className="text-xs"
                disabled={!cmpLinkInput.trim() || cmpSelectedAssets.length >= 5}
                onClick={() => {
                  if (addCmpAsset({ type: 'link', name: cmpLinkInput })) {
                    setCmpLinkInput('');
                  }
                }}
                data-testid="button-add-compare-link"
              >
                Add
              </Button>
            </div>
          </div>

          <div>
            <Label className="text-xs font-medium text-slate-700 mb-2 block">Search Catalog Assets</Label>
            <input
              className="border border-input rounded p-2 text-xs w-full mb-2"
              placeholder="Search assets..."
              value={cmpSearch}
              onChange={(e) => setCmpSearch(e.target.value)}
              data-testid="input-search-compare"
            />
            <div className="border border-input rounded p-2 max-h-24 overflow-y-auto space-y-1">
              {filteredCmpAssets.map(a => (
                <button
                  key={a}
                  className="block w-full text-left text-xs px-2 py-1 hover-elevate rounded disabled:opacity-50 disabled:cursor-not-allowed"
                  onClick={() => addCmpAsset({ type: 'catalog', name: a })}
                  disabled={cmpSelectedAssets.length >= 5 || cmpSelectedAssets.some(asset => asset.name === a)}
                  data-testid={`button-compare-catalog-${a}`}
                >
                  {a}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <Button
        className="w-full mt-4"
        onClick={() => setCmpRan(true)}
        disabled={cmpSelectedAssets.length < 2}
        data-testid="button-run-comparison"
      >
        Run Comparison ({cmpSelectedAssets.length} {cmpSelectedAssets.length === 1 ? 'Asset' : 'Assets'})
      </Button>

      {cmpRan && (() => {
        const rows = cmpSelectedAssets.reduce<Record<string, Record<string, number>>>((acc, asset) => {
          acc[asset.name] = genScoreRow();
          return acc;
        }, {});
        const avg = (obj: Record<string, number>) => Math.round(Object.values(obj).reduce((s, v) => s + v, 0) / Object.values(obj).length);
        const bestAsset = Object.keys(rows).sort((a, b) => avg(rows[b]) - avg(rows[a]))[0];

        return (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-slate-800 mb-3">Comparison Results</h3>
            <div className="overflow-x-auto mb-4">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-600">
                    <th className="p-2">Asset</th>
                    {['Tone', 'Clarity', 'Consistency', 'Language Fit', 'Rhythm', 'Avg'].map(h => <th key={h} className="p-2">{h}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {cmpSelectedAssets.map((asset) => {
                    const r = rows[asset.name];
                    const avgScore = avg(r);
                    const isBest = asset.name === bestAsset;
                    return (
                      <tr key={asset.id} className={`border-t ${isBest ? 'bg-indigo-50' : ''}`} data-testid={`row-asset-${asset.id}`}>
                        <td className="p-2">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-indigo-700">{asset.name}</span>
                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${
                              asset.type === 'text' ? 'bg-blue-100 text-blue-700' :
                              asset.type === 'file' ? 'bg-green-100 text-green-700' :
                              asset.type === 'link' ? 'bg-purple-100 text-purple-700' :
                              'bg-indigo-100 text-indigo-700'
                            }`}>
                              {asset.type}
                            </span>
                            {isBest && <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-600 text-white">Best</span>}
                          </div>
                        </td>
                        <td className="p-2">{r.Tone}</td>
                        <td className="p-2">{r.Clarity}</td>
                        <td className="p-2">{r.Consistency}</td>
                        <td className="p-2">{r['Language Fit']}</td>
                        <td className="p-2">{r.Rhythm}</td>
                        <td className="p-2 font-semibold">{avgScore}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <Card className="p-4">
                <p className="text-sm font-semibold text-slate-800 mb-2">Why "{bestAsset}" wins</p>
                <p className="text-sm text-slate-700">Highest aggregate balance across Tone and Clarity with consistent CTA phrasing; opener pattern matches approved style guide; proof blocks appear earlier.</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm font-semibold text-slate-800 mb-2">Where others fall short</p>
                <p className="text-sm text-slate-700">Jargon spikes in weaker assets; rhythm monotony in nurtures; CTA drift on social vs web; intros bury the problem statement.</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm font-semibold text-slate-800 mb-2">Recommendations</p>
                <p className="text-sm text-slate-700">Mirror the winning opener and CTA language, reduce sentence length in nurtures, add metrics in first screen, and align social CTAs to web standard.</p>
              </Card>
              <Card className="p-4">
                <p className="text-sm font-semibold text-slate-800 mb-2">SWOT (Cross‑Asset)</p>
                <ul className="text-sm text-slate-700 space-y-1">
                  <li><strong>S</strong>: Consistent tone in core website primitives.</li>
                  <li><strong>W</strong>: Rhythm monotony and CTA drift in emails/social.</li>
                  <li><strong>O</strong>: Templatize strongest headline + opener combo.</li>
                  <li><strong>T</strong>: Competitors ship warmer executive POV with higher frequency.</li>
                </ul>
              </Card>
            </div>
          </div>
        );
      })()}
    </Card>
  );

  // Generate report HTML content
  const generateReportHTML = () => {
    return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Brand Tone Check Report</title>
  <style>
    body { font-family: Inter, Arial, sans-serif; max-width: 1200px; margin: 0 auto; padding: 20px; background: #f8fafc; }
    h1 { color: #1e293b; font-size: 28px; margin-bottom: 10px; }
    h2 { color: #334155; font-size: 20px; margin-top: 30px; margin-bottom: 15px; }
    .metric-grid { display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin-bottom: 20px; }
    .metric-card { background: white; border: 1px solid #e2e8f0; border-radius: 8px; padding: 16px; }
    .metric-label { font-size: 12px; color: #64748b; }
    .metric-value { font-size: 24px; font-weight: 600; color: #0f172a; }
    .section { background: white; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 16px; }
    .alert { background: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 16px; margin-bottom: 12px; }
    .alert-high { border-left: 4px solid #ef4444; }
    .alert-medium { border-left: 4px solid #f59e0b; }
    ul { margin: 10px 0; padding-left: 20px; }
    li { margin: 6px 0; }
    .footer { text-align: center; color: #64748b; font-size: 12px; margin-top: 40px; padding-top: 20px; border-top: 1px solid #e2e8f0; }
  </style>
</head>
<body>
  <h1>Brand Tone Check Report</h1>
  <p style="color: #64748b; margin-bottom: 30px;">Generated on ${new Date().toLocaleDateString()}</p>
  
  <div class="section">
    <h2>Executive Summary</h2>
    <div class="metric-grid">
      ${summaryMetrics.map(m => `
        <div class="metric-card">
          <div class="metric-label">${m.label}</div>
          <div class="metric-value">${m.score}</div>
          <div class="metric-label">${m.trend}</div>
        </div>
      `).join('')}
    </div>
  </div>
  
  <div class="section">
    <h2>Critical Alerts</h2>
    ${alerts.map(a => `
      <div class="alert alert-${a.severity.toLowerCase()}">
        <strong>${a.title}</strong> (${a.severity})<br>
        ${a.message}
      </div>
    `).join('')}
  </div>
  
  <div class="section">
    <h2>Key Recommendations</h2>
    <ul>
      <li>Align mid-funnel campaigns to maintain consistent tone with upper-funnel content</li>
      <li>Apply Executive Voice guidelines more rigorously to leadership content</li>
      <li>Continue improving clarity and simplifying phrasing across all channels</li>
      <li>Maintain current rhythm variance while adding more empathy cues</li>
    </ul>
  </div>
  
  <div class="footer">
    Brand Tone Check Dashboard &middot; ${new Date().getFullYear()}
  </div>
</body>
</html>
    `;
  };

  // Export as HTML
  const exportAsHTML = () => {
    const reportHTML = generateReportHTML();
    const blob = new Blob([reportHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `brand-voice-report-${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({
      title: 'HTML Report Exported',
      description: 'Your brand voice report has been downloaded as HTML.'
    });
  };

  // Export as PDF
  const exportAsPDF = async () => {
    const reportHTML = generateReportHTML();
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = reportHTML;
    tempDiv.style.position = 'absolute';
    tempDiv.style.left = '-9999px';
    document.body.appendChild(tempDiv);

    const opt = {
      margin: 10,
      filename: `brand-voice-report-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' as const }
    };

    // Dynamic import to avoid SSR issues
    const html2pdf = (await import('html2pdf.js')).default;
    
    html2pdf().from(tempDiv).set(opt).save().then(() => {
      document.body.removeChild(tempDiv);
      toast({
        title: 'PDF Report Exported',
        description: 'Your brand voice report has been downloaded as PDF.'
      });
    });
  };

  // Insights & Analytics Tab - Comprehensive deep dive
  const renderInsightsAnalytics = () => (
    <div className="space-y-4">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <h2 className="text-xl font-semibold text-slate-800">Program Overview</h2>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportAsHTML}
              data-testid="button-export-html"
            >
              Export HTML
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={exportAsPDF}
              data-testid="button-export-pdf"
            >
              Export PDF
            </Button>
          </div>
        </div>
        <div className="grid md:grid-cols-5 gap-3 mb-3">
          {['Tone Match', 'Clarity', 'Consistency', 'Language Fit', 'Rhythm'].map((label, i) => (
            <div key={i} className="p-3 bg-white border border-slate-200 rounded-xl">
              <p className="text-[12px] text-slate-600">{label}</p>
              <p className="text-xl font-semibold text-slate-900" data-testid={`metric-${label.toLowerCase().replace(' ', '-')}`}>{rand()}</p>
            </div>
          ))}
        </div>
        <p className="text-sm text-slate-700 mb-3">
          Executive Voice at Awareness on Web for Lead Gen (Campaign: Q4 Launch) shows balanced tone and high clarity.
          Messaging → Core Story improving with proof but needs added warmth.
        </p>
        <div className="grid md:grid-cols-2 gap-4">
          <Card className="p-3">
            <p className="font-semibold text-sm mb-1">Key Takeaways</p>
            <ul className="list-disc pl-5 text-sm text-slate-700">
              <li>CTA consistency improved +3pts.</li>
              <li>Proof-first content better in MoFu assets.</li>
              <li>Warmth and empathy improving but still mid-range.</li>
            </ul>
          </Card>
          <Card className="p-3">
            <p className="font-semibold text-sm mb-1">SWOT Summary</p>
            <ul className="text-sm text-slate-700 space-y-1">
              <li><strong>S</strong>: Clarity + alignment with tone guide.</li>
              <li><strong>W</strong>: Rhythm monotony in social copy.</li>
              <li><strong>O</strong>: Add voice examples to internal wiki.</li>
              <li><strong>T</strong>: Competitors using conversational CTAs more effectively.</li>
            </ul>
          </Card>
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Detailed Breakdown</h2>
        <p className="text-sm text-slate-600 mb-4">Analyze performance across different dimensions. Select filters to see detailed insights.</p>
        
        <div className="grid md:grid-cols-2 gap-4">
          {renderBreakdownCard('Stage', breakdown.Stage)}
          {renderBreakdownCard('Goal', breakdown.Goal)}
          {renderBreakdownCard('Channel', breakdown.Channel)}
          {renderBreakdownCard('Persona', breakdown.Persona)}
          {renderBreakdownCard('Pillar', breakdown.Pillar)}
        </div>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-semibold text-slate-800 mb-4">Trends & Insights</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-sm text-slate-700"><strong>Trends vs Last Audit:</strong> Tone +3 | Clarity +2 | Consistency −1 | Rhythm +2 | Language Fit +1</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
            <p className="text-sm text-slate-700"><strong>Key Insight:</strong> Executive content stronger on clarity but under-index on empathy in Web channels.</p>
          </div>
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl md:col-span-2">
            <p className="text-sm font-semibold text-slate-800 mb-2">SWOT by Segment</p>
            <ul className="text-sm text-slate-700 space-y-1">
              <li><strong>S</strong>: Depth in Messaging; clear structure.</li>
              <li><strong>W</strong>: Tone drift in executive social copy.</li>
              <li><strong>O</strong>: Add story-led proof sections mid-page.</li>
              <li><strong>T</strong>: Competitors increasing frequency with emotional hooks.</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );

  const moduleColor = '#c009ba'; // Brand Craft pink

  const steps = [
    { id: 'dashboard', label: 'Dashboard', description: 'Overview and recent projects' },
    { id: 'insights', label: 'Insights & Analytics', description: 'Performance trends and metrics' }
  ];

  const renderContent = () => {
    return (
      <div className="h-full overflow-y-auto bg-white brandcraft-buttons">
        <style>{`
          /* Override all default buttons to use BrandCraft pink */
          .brandcraft-buttons button:not([class*="outline"]):not([class*="ghost"]):not([class*="secondary"]):not([class*="destructive"]) {
            background-color: ${moduleColor} !important;
            border-color: ${moduleColor} !important;
            color: white !important;
          }
          .brandcraft-buttons button:not([class*="outline"]):not([class*="ghost"]):not([class*="secondary"]):not([class*="destructive"]):hover {
            opacity: 0.9 !important;
          }
        `}</style>
        <div className="bg-white px-8 py-4 border-b border-pink-100 sticky top-0 z-10">
          <div className="flex justify-between items-center flex-wrap gap-3">
            <div>
              <h1 className="text-3xl font-bold mb-2" style={{ color: moduleColor }}>Brand Tone Check</h1>
              <p className="text-gray-600 max-w-3xl">
                Ensure brand consistency across all content and campaigns with AI-powered tone analysis.
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={onSave} data-testid="button-save-header">
                {currentProjectId ? 'Save Progress' : 'Save New Project'}
              </Button>
              <Button variant="outline" size="sm" onClick={onOpenProject} data-testid="button-open-header">
                Open Project
              </Button>
            </div>
          </div>
        </div>

        <div className="p-8">
        {currentStep === 'dashboard' && (
          <div className="space-y-4">
            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">At a Glance</h2>
              <div className="grid md:grid-cols-5 gap-4">
                {summaryMetrics.map((m, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
                    <p className="text-xs text-slate-600">{m.label}</p>
                    <p className="text-2xl font-semibold text-slate-900" data-testid={`dashboard-${m.label.toLowerCase().replace(' ', '-')}`}>{m.score}</p>
                    <p className="text-xs text-slate-600">{m.trend}</p>
                    <p className="text-[11px] text-slate-500 mt-1">{m.detail}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Alerts & Highlights</h2>
              <div className="space-y-3">
                {alerts.map((alert, i) => (
                  <div key={i} className="p-4 bg-white border border-slate-200 rounded-xl">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-2 py-0.5 rounded ${
                        alert.severity === 'High' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                      }`}>
                        {alert.severity}
                      </span>
                      <p className="font-semibold text-slate-800">{alert.title}</p>
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{alert.message}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">Recent Activity</h2>
              <div className="space-y-3">
                <div className="p-4 bg-white rounded-xl border border-slate-200 hover-elevate">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">Voice Check</p>
                        <span className="text-xs px-2 py-0.5 rounded bg-indigo-100 text-indigo-700">Completed</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">Website Hero Copy analyzed</p>
                      <div className="grid grid-cols-5 gap-3">
                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-[10px] text-slate-500 uppercase">Tone</p>
                          <p className="text-lg font-semibold text-indigo-600">92</p>
                        </div>
                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-[10px] text-slate-500 uppercase">Clarity</p>
                          <p className="text-lg font-semibold text-indigo-600">89</p>
                        </div>
                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-[10px] text-slate-500 uppercase">Consistency</p>
                          <p className="text-lg font-semibold text-indigo-600">91</p>
                        </div>
                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-[10px] text-slate-500 uppercase">Language</p>
                          <p className="text-lg font-semibold text-indigo-600">86</p>
                        </div>
                        <div className="bg-slate-50 rounded p-2">
                          <p className="text-[10px] text-slate-500 uppercase">Rhythm</p>
                          <p className="text-lg font-semibold text-indigo-600">88</p>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs font-medium text-slate-700 mb-1">Key Insights:</p>
                        <p className="text-xs text-slate-600">✓ Strong emotional appeal and clear value proposition</p>
                        <p className="text-xs text-slate-600">⚠ Consider adding more empathy cues in opening line</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 ml-4">2h ago</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-slate-200 hover-elevate">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">Asset Comparison</p>
                        <span className="text-xs px-2 py-0.5 rounded bg-green-100 text-green-700">5 Assets</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">Q4 Launch Campaign: Email variants analyzed</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Best Performer:</span>
                          <span className="font-semibold text-green-700">Email Nurture #2 (Score: 94)</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Average Score:</span>
                          <span className="font-semibold text-slate-700">88.4</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Consistency Range:</span>
                          <span className="font-semibold text-slate-700">82-94</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs font-medium text-slate-700 mb-1">Key Insights:</p>
                        <p className="text-xs text-slate-600">✓ Email Nurture #2 maintains consistent brand voice</p>
                        <p className="text-xs text-slate-600">⚠ Variant B needs tone adjustment for executive audience</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 ml-4">1d ago</p>
                  </div>
                </div>
                
                <div className="p-4 bg-white rounded-xl border border-slate-200 hover-elevate">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-slate-900">Project Saved</p>
                        <span className="text-xs px-2 py-0.5 rounded bg-blue-100 text-blue-700">Updated</span>
                      </div>
                      <p className="text-sm text-slate-600 mb-3">Q4 Launch project updated with new assets</p>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Total Assets:</span>
                          <span className="font-semibold text-slate-700">12 items</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Voice Checks:</span>
                          <span className="font-semibold text-slate-700">8 completed</span>
                        </div>
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-slate-600">Avg. Score:</span>
                          <span className="font-semibold text-indigo-600">89.2</span>
                        </div>
                      </div>
                      <div className="mt-3 pt-3 border-t border-slate-200">
                        <p className="text-xs font-medium text-slate-700 mb-1">Key Insights:</p>
                        <p className="text-xs text-slate-600">✓ Overall brand voice consistency improving across campaign</p>
                        <p className="text-xs text-slate-600">📈 Tone Match increased 7% since last audit</p>
                      </div>
                    </div>
                    <p className="text-xs text-slate-500 ml-4">3d ago</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}

        {currentStep === 'insights' && renderInsightsAnalytics()}
        </div>

        {/* Save Project Dialog */}
        <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
          <DialogContent data-testid="dialog-save-project">
            <DialogHeader>
              <DialogTitle>Save Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="project-name">Project Name</Label>
                <Input
                  id="project-name"
                  data-testid="input-project-name"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="Enter project name"
                />
              </div>
              <div>
                <Label htmlFor="project-description">Description (Optional)</Label>
                <Textarea
                  id="project-description"
                  data-testid="input-project-description"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                  placeholder="Enter project description"
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setSaveDialogOpen(false)}
                data-testid="button-cancel-save"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveProject}
                disabled={createProjectMutation.isPending}
                data-testid="button-confirm-save"
              >
                {createProjectMutation.isPending ? 'Saving...' : 'Save Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Open Project Dialog */}
        <Dialog open={openDialogOpen} onOpenChange={setOpenDialogOpen}>
          <DialogContent data-testid="dialog-open-project">
            <DialogHeader>
              <DialogTitle>Open Project</DialogTitle>
            </DialogHeader>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {projects.length === 0 ? (
                <p className="text-sm text-slate-600 text-center py-4">No projects found. Create a new project by clicking Save Progress.</p>
              ) : (
                projects.map((project) => (
                  <div
                    key={project.id}
                    className="p-4 border border-slate-200 rounded-lg hover-elevate cursor-pointer"
                    onClick={() => handleLoadProject(project.id)}
                    data-testid={`project-item-${project.id}`}
                  >
                    <div className="font-semibold text-slate-900">{project.name}</div>
                    {project.description && (
                      <p className="text-sm text-slate-600 mt-1">{project.description}</p>
                    )}
                    <p className="text-xs text-slate-500 mt-2">
                      Updated: {project.updatedAt ? new Date(project.updatedAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                ))
              )}
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setOpenDialogOpen(false)}
                data-testid="button-cancel-open"
              >
                Close
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    );
  };

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={steps}
      currentStep={currentStep}
      onStepChange={(stepId) => setCurrentStep(stepId as StepKey)}
      content={
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-8 pt-4">
            <QuickActions module="BrandCraft" />
          </div>
          {renderContent()}
        </div>
      }
      moduleColor={moduleColor}
    />
  );
}
