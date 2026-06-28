import { useState, useMemo } from 'react';
import { ThreeColumnLayout } from '@/stackwise-demo/components/layouts/ThreeColumnLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/stackwise-demo/components/ui/card';
import { Badge } from '@/stackwise-demo/components/ui/badge';
import { Input } from '@/stackwise-demo/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/stackwise-demo/components/ui/select';
import { Button } from '@/stackwise-demo/components/ui/button';
import { QuickActions } from '@/stackwise-demo/components/QuickActions';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/stackwise-demo/components/ui/tabs';
import { 
  Filter, TrendingUp, Target, Users, Building2, Lightbulb, 
  Clock, Zap, BarChart3, Network, ArrowRight, Plus, 
  ChevronDown, ChevronUp, Info, Activity, DollarSign, Calendar
} from 'lucide-react';
import { DATASET } from './roadmaps-dataset';
import { accountsByStage, filterAccounts, buildGraph } from './roadmaps-utils';
import type { Stage, AccountNode, TimeHorizon, ImpactMagnitude } from './roadmaps-types';
import { useToast } from '@/stackwise-demo/hooks/use-toast';

const STAGES: Stage[] = [
  'Awareness',
  'Engagement',
  'Activation',
  'Opportunity',
  'Negotiation',
  'Closed Won',
  'Closed Lost',
  'Expansion'
];

const STAGE_COLORS: Record<Stage, string> = {
  'Awareness': 'bg-blue-100 border-blue-300 text-blue-800',
  'Engagement': 'bg-green-100 border-green-300 text-green-800',
  'Activation': 'bg-yellow-100 border-yellow-300 text-yellow-800',
  'Opportunity': 'bg-orange-100 border-orange-300 text-orange-800',
  'Negotiation': 'bg-purple-100 border-purple-300 text-purple-800',
  'Closed Won': 'bg-emerald-100 border-emerald-300 text-emerald-800',
  'Closed Lost': 'bg-red-100 border-red-300 text-red-800',
  'Expansion': 'bg-indigo-100 border-indigo-300 text-indigo-800'
};

export default function RoadmapsConnections() {
  const [currentStep, setCurrentStep] = useState('stage-flow');
  const [threadFilter, setThreadFilter] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [personaFilter, setPersonaFilter] = useState('');
  const [pillarFilter, setPillarFilter] = useState('');
  const [horizonTimeFilter, setHorizonTimeFilter] = useState<TimeHorizon | ''>('');
  const [horizonMagnitudeFilter, setHorizonMagnitudeFilter] = useState<ImpactMagnitude | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoverAccount, setHoverAccount] = useState<AccountNode | null>(null);
  const [hoverGraphNode, setHoverGraphNode] = useState<any | null>(null);
  const [stageFlowTab, setStageFlowTab] = useState('view');
  const [connectionGraphTab, setConnectionGraphTab] = useState('view');
  const { toast } = useToast();

  const moduleColor = '#6218df';

  const steps = [
    { id: 'stage-flow', label: 'Stage Flow', description: 'Linear journey visualization' },
    { id: 'connection-graph', label: 'Connection Graph', description: 'Cluster journey network' }
  ];

  const filteredAccounts = useMemo(() => {
    return filterAccounts(DATASET, {
      thread: threadFilter,
      industry: industryFilter,
      persona: personaFilter,
      pillar: pillarFilter,
      horizonTime: horizonTimeFilter || undefined,
      horizonMagnitude: horizonMagnitudeFilter || undefined
    });
  }, [threadFilter, industryFilter, personaFilter, pillarFilter, horizonTimeFilter, horizonMagnitudeFilter]);

  const accountsGrouped = useMemo(() => {
    const filtered = { ...DATASET, accounts: filteredAccounts };
    return accountsByStage(filtered);
  }, [filteredAccounts]);

  const graphData = useMemo(() => {
    return buildGraph(DATASET);
  }, []);

  // Filter graph nodes based on search
  const filteredGraphNodes = useMemo(() => {
    if (!searchTerm) return graphData.nodes;
    return graphData.nodes.filter(node =>
      node.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [graphData.nodes, searchTerm]);

  const filteredGraphEdges = useMemo(() => {
    if (!searchTerm) return graphData.edges;
    const nodeIds = new Set(filteredGraphNodes.map(n => n.id));
    return graphData.edges.filter(edge =>
      nodeIds.has(edge.source) && nodeIds.has(edge.target)
    );
  }, [graphData.edges, filteredGraphNodes, searchTerm]);

  const handleAddToNextPlay = (accountId: string, accountName: string) => {
    toast({
      title: "Added to Next Play",
      description: `${accountName} added to Next Play queue`
    });
  };

  const handleSendToStackNavigator = (accountId: string, accountName: string) => {
    toast({
      title: "Sent to Stack Navigator",
      description: `${accountName} sent to Strategy Studio Stack Navigator`
    });
  };

  const renderStageFlowInstructions = () => (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="w-5 h-5 text-purple-600" />
            How to Read Stage Flow
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <strong>Columns = Stages.</strong> Each represents a defined funnel step: Awareness → Engagement → Activation → Opportunity → Negotiation → Closed Won → Closed Lost → Expansion.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Cards = Accounts.</strong> Each card shows a company or client and metadata: owners, last activity, threads, linked plays, deals, and Impact Horizon score.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Badges = Context.</strong> Thread tags (orange), Persona focus (purple), and Pillar indicators (green) highlight what's driving or framing each account.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Hover on a card</strong> to preview: summary, health, and last signal. <strong>Click to open the drawer</strong> with deeper insight, impact scores, and next‑play recommendations.
            </p>
          </div>

          <div className="border-t border-purple-300 pt-4">
            <h4 className="font-semibold text-sm mb-3">Legend: Stage Flow</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="text-left p-2 font-semibold">Element</th>
                    <th className="text-left p-2 font-semibold">Visual</th>
                    <th className="text-left p-2 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-200">
                  <tr>
                    <td className="p-2">Stage Column</td>
                    <td className="p-2">Vertical cards under a header (e.g., "Engagement")</td>
                    <td className="p-2">Represents a step in the GTM funnel</td>
                  </tr>
                  <tr>
                    <td className="p-2">Account Card</td>
                    <td className="p-2">White card with border and subtle shadow</td>
                    <td className="p-2">Active company or client</td>
                  </tr>
                  <tr>
                    <td className="p-2">Thread Badge</td>
                    <td className="p-2"><Badge variant="outline" className="text-orange-600 border-orange-600 text-xs">Orange outline</Badge></td>
                    <td className="p-2">Strategic intent influencing this account (e.g., Revenue Expansion)</td>
                  </tr>
                  <tr>
                    <td className="p-2">Linked Play Badge</td>
                    <td className="p-2"><Badge className="bg-blue-600 text-xs">Blue solid</Badge></td>
                    <td className="p-2">Specific play influencing the account</td>
                  </tr>
                  <tr>
                    <td className="p-2">Impact Horizon</td>
                    <td className="p-2">Text label showing time + magnitude + score</td>
                    <td className="p-2">Describes time‑to‑impact and depth of effect</td>
                  </tr>
                  <tr>
                    <td className="p-2">Health Status</td>
                    <td className="p-2">
                      <div className="flex gap-1">
                        <Badge className="bg-green-600 text-xs">Improving</Badge>
                        <Badge variant="secondary" className="text-xs">Neutral</Badge>
                        <Badge className="bg-red-600 text-xs">At Risk</Badge>
                      </div>
                    </td>
                    <td className="p-2">Snapshot of account momentum</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-purple-300 pt-4 space-y-2">
            <h4 className="font-semibold text-sm mb-2">💡 Strategic Guidance</h4>
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
              <p className="text-xs text-yellow-800">
                <strong>Look for accounts that stall across stages</strong> — those often lack thread alignment or are over‑indexed on short horizons.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-300 rounded p-3">
              <p className="text-xs text-blue-800">
                <strong>Compare average Horizon scores by thread</strong> to gauge where your energy is compounding vs. fading.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderConnectionGraphInstructions = () => (
    <div className="space-y-6">
      <Card className="border-2 border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="w-5 h-5 text-purple-600" />
            How to Read Connection Graph
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-700">
              <strong>Each node = an entity</strong> (Account, Play, Thread, Pillar, Persona).
            </p>
            <p className="text-sm text-gray-700">
              <strong>Lines = relationships or influence.</strong> A connection means the two entities interact or belong together (e.g., an Account is influenced by a Play, a Play supports a Thread).
            </p>
            <p className="text-sm text-gray-700">
              <strong>Dense clusters = synergy.</strong> Areas with many connections show strategic alignment. Sparse areas indicate opportunity.
            </p>
            <p className="text-sm text-gray-700">
              <strong>Hover on any node</strong> to see core info: name, type, related threads, and impact. <strong>Click to open full details</strong> and metrics in the drawer.
            </p>
          </div>

          <div className="border-t border-purple-300 pt-4">
            <h4 className="font-semibold text-sm mb-3">Legend: Connection Graph Nodes</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="text-left p-2 font-semibold">Node Type</th>
                    <th className="text-left p-2 font-semibold">Color</th>
                    <th className="text-left p-2 font-semibold">Shape</th>
                    <th className="text-left p-2 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-200">
                  <tr>
                    <td className="p-2">Account</td>
                    <td className="p-2"><div className="w-4 h-4 rounded-full bg-blue-500 inline-block"></div> Teal (#0EA5E9)</td>
                    <td className="p-2">Circle</td>
                    <td className="p-2">Company or client moving through the journey. Connects to Plays and Threads.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Play / Motion</td>
                    <td className="p-2"><div className="w-4 h-4 rounded bg-green-500 inline-block"></div> Blue (#3B82F6)</td>
                    <td className="p-2">Rounded Square</td>
                    <td className="p-2">Campaign or execution motion. Connects to Threads, Pillars, Personas.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Strategic Thread</td>
                    <td className="p-2"><div className="w-4 h-4 rotate-45 bg-yellow-500 inline-block"></div> Orange (#F97316)</td>
                    <td className="p-2">Diamond</td>
                    <td className="p-2">Strategic intent connecting plays and accounts.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Pillar</td>
                    <td className="p-2"><div className="w-4 h-4 rounded bg-purple-500 inline-block"></div> Green (#22C55E)</td>
                    <td className="p-2">Hexagon</td>
                    <td className="p-2">Brand or content pillar (Sustainability, Innovation, Trust & Proof).</td>
                  </tr>
                  <tr>
                    <td className="p-2">Persona</td>
                    <td className="p-2"><div className="w-4 h-4 bg-pink-500 inline-block" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }}></div> Purple (#A855F7)</td>
                    <td className="p-2">Triangle</td>
                    <td className="p-2">Audience role (CIO, CFO, VP Ops).</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-purple-300 pt-4">
            <h4 className="font-semibold text-sm mb-3">Edge Types & Meanings</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="text-left p-2 font-semibold">Edge Type</th>
                    <th className="text-left p-2 font-semibold">Color</th>
                    <th className="text-left p-2 font-semibold">Direction</th>
                    <th className="text-left p-2 font-semibold">Meaning</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-200">
                  <tr>
                    <td className="p-2">Account → Play</td>
                    <td className="p-2">Gray</td>
                    <td className="p-2">→</td>
                    <td className="p-2">The account is influenced by this play.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Play → Thread</td>
                    <td className="p-2">Gray</td>
                    <td className="p-2">→</td>
                    <td className="p-2">The play supports this strategic thread.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Play → Pillar / Persona</td>
                    <td className="p-2">Gray</td>
                    <td className="p-2">→</td>
                    <td className="p-2">The play aligns to this theme or targets this audience.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Account → Thread</td>
                    <td className="p-2">Gray</td>
                    <td className="p-2">→</td>
                    <td className="p-2">The account aligns with this strategy.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-purple-300 pt-4">
            <h4 className="font-semibold text-sm mb-3">Searchable Nodes</h4>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="bg-purple-100">
                  <tr>
                    <th className="text-left p-2 font-semibold">Search Type</th>
                    <th className="text-left p-2 font-semibold">Example</th>
                    <th className="text-left p-2 font-semibold">What You'll See</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-purple-200">
                  <tr>
                    <td className="p-2">Account</td>
                    <td className="p-2">FormFactor, Novartis, Roche</td>
                    <td className="p-2">All related Plays, Threads, and Pillars influencing that account.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Play</td>
                    <td className="p-2">Exec POV, Customer Advocacy, ABM Funnel</td>
                    <td className="p-2">Threads, Personas, and Accounts linked to that play.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Thread</td>
                    <td className="p-2">Revenue Expansion, Thought Leadership</td>
                    <td className="p-2">Full strategy network and affected accounts.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Pillar</td>
                    <td className="p-2">Sustainability, Innovation</td>
                    <td className="p-2">Theme-based cluster of plays and connected accounts.</td>
                  </tr>
                  <tr>
                    <td className="p-2">Persona</td>
                    <td className="p-2">CIO, CFO, VP Ops</td>
                    <td className="p-2">Roles targeted and the plays influencing them.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="border-t border-purple-300 pt-4 space-y-2">
            <h4 className="font-semibold text-sm mb-2">👁️ Visual Cues</h4>
            <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
              <li><strong>Node Size:</strong> Optional scaling by engagement volume or impact score</li>
              <li><strong>Edge Thickness:</strong> Optional scaling by influence strength (number of shared connections or performance weight)</li>
              <li><strong>Hover Highlight:</strong> Connected nodes remain bright; others fade for clarity</li>
              <li><strong>Color Consistency:</strong> Node color matches legend across all modules</li>
            </ul>
          </div>

          <div className="border-t border-purple-300 pt-4 space-y-2">
            <h4 className="font-semibold text-sm mb-2">💡 Tips for Reading</h4>
            <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
              <p className="text-xs text-yellow-800">
                <strong>Start with Thread searches</strong> to understand overall strategy spread.
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-300 rounded p-3">
              <p className="text-xs text-blue-800">
                <strong>Switch to Account searches</strong> to see what's truly driving deals.
              </p>
            </div>
            <div className="bg-green-50 border border-green-300 rounded p-3">
              <p className="text-xs text-green-800">
                <strong>Look for unconnected Threads or Pillars</strong> — these reveal under‑activated strategies.
              </p>
            </div>
            <div className="bg-purple-50 border border-purple-300 rounded p-3">
              <p className="text-xs text-purple-800">
                <strong>Filter by Persona</strong> to test coverage or identify who's being missed in current motions.
              </p>
            </div>
          </div>

          <div className="border-t border-purple-300 pt-4">
            <h4 className="font-semibold text-sm mb-2">🔄 Example User Flow Across Tabs</h4>
            <div className="space-y-2 text-xs text-gray-700">
              <div className="flex items-start gap-2">
                <span className="font-semibold text-purple-600">1.</span>
                <p>Start in Stage Flow → identify where FormFactor is stalled at Engagement.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-purple-600">2.</span>
                <p>Switch to Connection Graph → search FormFactor to see which Plays and Threads are connected.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-purple-600">3.</span>
                <p>Spot that Revenue Expansion thread links to only two Plays — decide to add one more ABM play.</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="font-semibold text-purple-600">4.</span>
                <p>Jump back to Stage Flow → confirm new play appears under FormFactor next cycle.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderHoverDrawer = () => {
    if (!hoverAccount) return null;
    
    const play = DATASET.plays.find(p => p.id === hoverAccount.nextPlaySuggestion);
    const linkedPlays = DATASET.plays.filter(p => 
      hoverAccount.linkedPlays?.includes(p.id)
    );
    
    return (
      <div 
        className="fixed right-8 top-1/4 w-96 bg-white border-2 border-purple-300 rounded-lg shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
        onMouseEnter={() => setHoverAccount(hoverAccount)}
        onMouseLeave={() => setHoverAccount(null)}
      >
        <div className="bg-purple-600 text-white p-4 rounded-t-lg">
          <h3 className="font-bold text-lg">{hoverAccount.name}</h3>
          <p className="text-xs text-purple-100 mt-1">{hoverAccount.industry}</p>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Account Overview
            </h4>
            <div className="space-y-1 text-xs text-gray-700">
              <p><strong>Owner:</strong> {hoverAccount.owner}</p>
              <p><strong>Stage:</strong> {hoverAccount.stage}</p>
              <p><strong>Last Activity:</strong> {hoverAccount.lastActivity}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-2">
              <Lightbulb className="w-4 h-4" />
              Strategic Threads
            </h4>
            <div className="flex flex-wrap gap-1">
              {hoverAccount.threads.map(thread => (
                <Badge key={thread} variant="outline" className="text-orange-600 border-orange-600 text-xs">
                  {thread}
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-2">
              <Target className="w-4 h-4" />
              Linked Plays
            </h4>
            {linkedPlays.length > 0 ? (
              <div className="space-y-1">
                {linkedPlays.map(p => (
                  <div key={p.id} className="text-xs bg-blue-50 border border-blue-200 rounded p-2">
                    {p.name}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500 italic">No linked plays</p>
            )}
          </div>

          <div>
            <h4 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Impact Horizon
            </h4>
            <div className="bg-gray-50 border border-gray-200 rounded p-3 space-y-1 text-xs">
              <p><strong>Time:</strong> {hoverAccount.horizon.time}</p>
              <p><strong>Magnitude:</strong> {hoverAccount.horizon.magnitude}</p>
              <p><strong>Score:</strong> {hoverAccount.horizon.score}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Personas
            </h4>
            <div className="flex flex-wrap gap-1">
              {hoverAccount.persona.map(p => (
                <Badge key={p} variant="outline" className="text-purple-600 border-purple-600 text-xs">
                  {p}
                </Badge>
              ))}
            </div>
          </div>

          {play && (
            <div>
              <h4 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Next Play Suggestion
              </h4>
              <div className="bg-yellow-50 border border-yellow-300 rounded p-3">
                <p className="text-xs font-semibold text-yellow-800">{play.name}</p>
                <p className="text-xs text-yellow-700 mt-1">Recommended to advance this account to the next stage</p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderGraphNodeHoverDrawer = () => {
    if (!hoverGraphNode) return null;

    const connectedEdges = filteredGraphEdges.filter(
      e => e.source === hoverGraphNode.id || e.target === hoverGraphNode.id
    );

    const getNodeTypeColor = () => {
      switch (hoverGraphNode.type) {
        case 'Account': return 'bg-blue-600';
        case 'Play': return 'bg-green-600';
        case 'Thread': return 'bg-yellow-600';
        case 'Pillar': return 'bg-purple-600';
        case 'Persona': return 'bg-pink-600';
        default: return 'bg-gray-600';
      }
    };

    return (
      <div 
        className="fixed right-8 top-1/4 w-96 bg-white border-2 border-purple-300 rounded-lg shadow-2xl z-50 max-h-[70vh] overflow-y-auto"
        onMouseEnter={() => setHoverGraphNode(hoverGraphNode)}
        onMouseLeave={() => setHoverGraphNode(null)}
      >
        <div className={`${getNodeTypeColor()} text-white p-4 rounded-t-lg`}>
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg">{hoverGraphNode.label}</h3>
            <Badge variant="secondary" className="text-xs">
              {hoverGraphNode.type}
            </Badge>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <h4 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-2">
              <Network className="w-4 h-4" />
              Node Information
            </h4>
            <div className="space-y-1 text-xs text-gray-700">
              <p><strong>ID:</strong> {hoverGraphNode.id}</p>
              <p><strong>Type:</strong> {hoverGraphNode.type}</p>
              <p><strong>Connections:</strong> {connectedEdges.length}</p>
            </div>
          </div>

          {hoverGraphNode.meta?.description && (
            <div>
              <h4 className="font-semibold text-sm text-purple-700 mb-2">Description</h4>
              <p className="text-xs text-gray-700">{hoverGraphNode.meta.description}</p>
            </div>
          )}

          {/* Account-specific data */}
          {hoverGraphNode.type === 'Account' && hoverGraphNode.meta && (
            <div className="space-y-3">
              {hoverGraphNode.meta.stage && (
                <div>
                  <h4 className="font-semibold text-sm text-purple-700 mb-2">Stage Details</h4>
                  <div className="bg-blue-50 border border-blue-200 rounded p-2 text-xs">
                    <p><strong>Current Stage:</strong> {hoverGraphNode.meta.stage}</p>
                    {hoverGraphNode.meta.owner && <p><strong>Owner:</strong> {hoverGraphNode.meta.owner}</p>}
                    {hoverGraphNode.meta.industry && <p><strong>Industry:</strong> {hoverGraphNode.meta.industry}</p>}
                  </div>
                </div>
              )}
              {hoverGraphNode.meta.horizon && (
                <div>
                  <h4 className="font-semibold text-sm text-purple-700 mb-2">Impact Horizon</h4>
                  <div className="bg-gray-50 border border-gray-200 rounded p-2 text-xs">
                    <p><strong>Time:</strong> {hoverGraphNode.meta.horizon.time}</p>
                    <p><strong>Magnitude:</strong> {hoverGraphNode.meta.horizon.magnitude}</p>
                    <p><strong>Score:</strong> {hoverGraphNode.meta.horizon.score}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Play-specific data */}
          {hoverGraphNode.type === 'Play' && hoverGraphNode.meta && (
            <div className="space-y-3">
              {hoverGraphNode.meta.playType && (
                <div>
                  <h4 className="font-semibold text-sm text-purple-700 mb-2">Play Details</h4>
                  <div className="bg-green-50 border border-green-200 rounded p-2 text-xs">
                    <p><strong>Type:</strong> {hoverGraphNode.meta.playType}</p>
                    {hoverGraphNode.meta.channels && (
                      <p><strong>Channels:</strong> {hoverGraphNode.meta.channels.join(', ')}</p>
                    )}
                    {hoverGraphNode.meta.owner && <p><strong>Owner:</strong> {hoverGraphNode.meta.owner}</p>}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Thread-specific data */}
          {hoverGraphNode.type === 'Thread' && hoverGraphNode.meta && (
            <div>
              <h4 className="font-semibold text-sm text-purple-700 mb-2">Thread Impact</h4>
              <div className="bg-yellow-50 border border-yellow-200 rounded p-2 text-xs">
                <p>Strategic thread influencing {connectedEdges.filter(e => e.source === hoverGraphNode.id).length} entities</p>
                <p className="mt-1 text-gray-600">This thread connects multiple plays and accounts to create strategic alignment</p>
              </div>
            </div>
          )}

          {/* Pillar-specific data */}
          {hoverGraphNode.type === 'Pillar' && (
            <div>
              <h4 className="font-semibold text-sm text-purple-700 mb-2">Content Pillar</h4>
              <div className="bg-purple-50 border border-purple-200 rounded p-2 text-xs">
                <p>Brand pillar supporting {connectedEdges.length} connected plays</p>
                <p className="mt-1 text-gray-600">Represents a core theme or messaging area in your content strategy</p>
              </div>
            </div>
          )}

          {/* Persona-specific data */}
          {hoverGraphNode.type === 'Persona' && (
            <div>
              <h4 className="font-semibold text-sm text-purple-700 mb-2">Target Persona</h4>
              <div className="bg-pink-50 border border-pink-200 rounded p-2 text-xs">
                <p>Audience role targeted by {connectedEdges.filter(e => e.target === hoverGraphNode.id).length} plays</p>
                <p className="mt-1 text-gray-600">Key decision-maker or influencer in the buying process</p>
              </div>
            </div>
          )}

          <div>
            <h4 className="font-semibold text-sm text-purple-700 mb-2 flex items-center gap-2">
              <ArrowRight className="w-4 h-4" />
              Connected Nodes
            </h4>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {connectedEdges.slice(0, 10).map((edge, idx) => {
                const connectedNodeId = edge.source === hoverGraphNode.id ? edge.target : edge.source;
                const connectedNode = graphData.nodes.find(n => n.id === connectedNodeId);
                return connectedNode ? (
                  <div key={idx} className="text-xs bg-gray-50 border border-gray-200 rounded p-2">
                    <Badge variant="outline" className="text-xs mr-2">{connectedNode.type}</Badge>
                    {connectedNode.label}
                  </div>
                ) : null;
              })}
              {connectedEdges.length > 10 && (
                <p className="text-xs text-gray-500 italic">+ {connectedEdges.length - 10} more connections</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFilters = () => (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-2 mb-2">
        <Filter className="w-4 h-4 text-purple-600" />
        <h4 className="font-semibold text-sm">Filters</h4>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Strategic Thread</label>
          <Input
            placeholder="e.g., Revenue Expansion"
            value={threadFilter}
            onChange={(e) => setThreadFilter(e.target.value)}
            data-testid="filter-thread"
            className="text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Industry</label>
          <Input
            placeholder="e.g., Life Sciences"
            value={industryFilter}
            onChange={(e) => setIndustryFilter(e.target.value)}
            data-testid="filter-industry"
            className="text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Persona</label>
          <Input
            placeholder="e.g., CTO"
            value={personaFilter}
            onChange={(e) => setPersonaFilter(e.target.value)}
            data-testid="filter-persona"
            className="text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Pillar</label>
          <Input
            placeholder="e.g., Innovation"
            value={pillarFilter}
            onChange={(e) => setPillarFilter(e.target.value)}
            data-testid="filter-pillar"
            className="text-sm"
          />
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Time Horizon</label>
          <Select value={horizonTimeFilter || 'all'} onValueChange={(val) => setHorizonTimeFilter(val === 'all' ? '' : val as TimeHorizon)}>
            <SelectTrigger data-testid="filter-horizon-time" className="text-sm">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Immediate">Immediate</SelectItem>
              <SelectItem value="Near-Term">Near-Term</SelectItem>
              <SelectItem value="Long-Term">Long-Term</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-xs text-gray-600 mb-1 block">Impact Magnitude</label>
          <Select value={horizonMagnitudeFilter || 'all'} onValueChange={(val) => setHorizonMagnitudeFilter(val === 'all' ? '' : val as ImpactMagnitude)}>
            <SelectTrigger data-testid="filter-horizon-magnitude" className="text-sm">
              <SelectValue placeholder="All" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Tactical">Tactical</SelectItem>
              <SelectItem value="Programmatic">Programmatic</SelectItem>
              <SelectItem value="Transformational">Transformational</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-end">
          <Button
            variant="outline"
            onClick={() => {
              setThreadFilter('');
              setIndustryFilter('');
              setPersonaFilter('');
              setPillarFilter('');
              setHorizonTimeFilter('');
              setHorizonMagnitudeFilter('');
              setSearchTerm('');
            }}
            data-testid="button-clear-filters"
            className="w-full text-sm"
          >
            Clear All
          </Button>
        </div>
      </div>
    </div>
  );

  const renderAccountCard = (account: AccountNode) => {
    const play = DATASET.plays.find(p => p.id === account.nextPlaySuggestion);
    
    return (
      <Card 
        key={account.id} 
        className="border border-gray-200 hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer" 
        data-testid={`account-card-${account.id}`}
        onMouseEnter={() => setHoverAccount(account)}
        onMouseLeave={() => setHoverAccount(null)}
      >
        <CardContent className="p-4 space-y-3">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h5 className="font-bold">{account.name}</h5>
              <p className="text-xs text-gray-600 mt-1">{account.industry}</p>
            </div>
            <div className="flex flex-col items-end gap-1">
              <Badge variant="outline" className="text-xs">
                Score: {account.horizon.score}
              </Badge>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <Lightbulb className="w-3 h-3 text-yellow-600" />
              <span className="font-semibold">Threads:</span>
              <span className="text-gray-700">{account.threads.join(', ')}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Clock className="w-3 h-3 text-blue-600" />
              <span className="font-semibold">Horizon:</span>
              <span className="text-gray-700">{account.horizon.time} • {account.horizon.magnitude}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Users className="w-3 h-3 text-green-600" />
              <span className="font-semibold">Owner:</span>
              <span className="text-gray-700">{account.owner}</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <Target className="w-3 h-3 text-purple-600" />
              <span className="font-semibold">Personas:</span>
              <span className="text-gray-700">{account.persona.join(', ')}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-1">
            {account.pillar.map(p => (
              <Badge key={p} variant="outline" className="text-xs">{p}</Badge>
            ))}
          </div>

          {play && (
            <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
              <p className="text-xs font-semibold text-yellow-800 flex items-center gap-1">
                <Zap className="w-3 h-3" />
                Suggested Next Play
              </p>
              <p className="text-xs text-yellow-700 mt-1">{play.name}</p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleAddToNextPlay(account.id, account.name)}
              data-testid={`button-add-nextplay-${account.id}`}
              className="flex-1 text-xs"
            >
              <Plus className="w-3 h-3 mr-1" />
              Next Play
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSendToStackNavigator(account.id, account.name)}
              data-testid={`button-stack-nav-${account.id}`}
              className="flex-1 text-xs"
            >
              <ArrowRight className="w-3 h-3 mr-1" />
              Stack Nav
            </Button>
          </div>

          <p className="text-xs text-gray-500 italic">Last activity: {account.lastActivity}</p>
        </CardContent>
      </Card>
    );
  };

  const renderContent = () => (
    <div className="h-full overflow-y-auto bg-white">
      <div className="bg-white px-8 py-4 border-b border-purple-100 sticky top-0 z-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2" style={{ color: moduleColor }}>Roadmaps & Connections</h1>
        <p className="text-gray-600 max-w-3xl">
          Visualize the journey from awareness to expansion with Stage Flow (Linear Journey) and discover strategic connections with Connection Graph (Cluster Journey).
        </p>
      </div>

      <div className="p-4 sm:p-6 lg:p-8 space-y-6">
        {/* Stage Flow Step */}
        {currentStep === 'stage-flow' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <p className="text-sm text-gray-600">
                Canonical journey: Awareness → Engagement → Activation → Opportunity → Negotiation → Closed → Expansion
              </p>
              <Badge variant="outline" data-testid="total-accounts-badge">
                {filteredAccounts.length} accounts
              </Badge>
            </div>

            <Tabs value={stageFlowTab} onValueChange={setStageFlowTab} data-testid="tabs-stage-flow">
              <TabsList data-testid="tabs-list-stage-flow">
                <TabsTrigger value="instructions" data-testid="tab-trigger-instructions">How to Read</TabsTrigger>
                <TabsTrigger value="view" data-testid="tab-trigger-view">View Journey</TabsTrigger>
              </TabsList>

              <TabsContent value="instructions" data-testid="tab-content-instructions">
                {renderStageFlowInstructions()}
              </TabsContent>

              <TabsContent value="view" data-testid="tab-content-view">
                <div className="space-y-6">
                  {renderFilters()}

                  {/* Directional Arrow Indicator */}
                  <div className="flex items-center gap-2 text-purple-600 font-semibold text-sm">
                    <ArrowRight className="w-5 h-5" />
                    <span>Read journey left to right →</span>
                  </div>

                  {/* Stage Columns */}
                  <div className="overflow-x-auto">
                    <div className="flex gap-4 pb-4 min-w-max">
                      {STAGES.map((stage, index) => {
                        const stageAccounts = accountsGrouped[stage] || [];
                        return (
                          <div key={stage} className="flex-shrink-0 w-72">
                            {index === 0 && (
                              <div className="flex items-center justify-center mb-2">
                                <div className="flex items-center gap-1 text-purple-600 text-xs font-semibold">
                                  <ArrowRight className="w-4 h-4" />
                                  <span>Start here</span>
                                </div>
                              </div>
                            )}
                            <div className={`${STAGE_COLORS[stage]} border-2 rounded-lg p-3 mb-3`}>
                              <h4 className="font-bold text-sm flex items-center justify-between">
                                {stage}
                                <Badge variant="secondary" className="text-xs">
                                  {stageAccounts.length}
                                </Badge>
                              </h4>
                            </div>
                            <div className="space-y-3 max-h-[600px] overflow-y-auto">
                              {stageAccounts.length > 0 ? (
                                stageAccounts.map(account => renderAccountCard(account))
                              ) : (
                                <p className="text-sm text-gray-500 italic text-center py-4">No accounts</p>
                              )}
                            </div>
                          </div>
                        );
                      })}

                      {/* Insight Card at the end of journey */}
                      <div className="flex-shrink-0 w-80">
                        <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-blue-50 sticky top-0">
                          <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-purple-700">
                              <TrendingUp className="w-5 h-5" />
                              Journey Insights
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="space-y-4">
                            <div>
                              <h4 className="font-semibold text-sm mb-2">📊 What We Learned</h4>
                              <ul className="text-xs text-gray-700 space-y-1 list-disc list-inside">
                                <li>Most accounts cluster in {Object.entries(accountsGrouped).sort((a, b) => b[1].length - a[1].length)[0]?.[0] || 'N/A'} stage</li>
                                <li>{filteredAccounts.filter(a => a.horizon.time === 'Immediate').length} accounts have Immediate horizons</li>
                                <li>Average Horizon score: {Math.round(filteredAccounts.reduce((sum, a) => sum + a.horizon.score, 0) / filteredAccounts.length) || 0}</li>
                              </ul>
                            </div>

                            <div className="border-t border-purple-200 pt-3">
                              <h4 className="font-semibold text-sm mb-2">💡 Ideas for Future</h4>
                              <div className="space-y-2">
                                <div className="bg-yellow-50 border border-yellow-200 rounded p-2">
                                  <p className="text-xs text-yellow-800">
                                    <strong>Thread Alignment:</strong> Review accounts stalled in early stages—they may need different thread emphasis
                                  </p>
                                </div>
                                <div className="bg-blue-50 border border-blue-200 rounded p-2">
                                  <p className="text-xs text-blue-800">
                                    <strong>Horizon Balance:</strong> Mix short-term tactical wins with longer transformational plays
                                  </p>
                                </div>
                                <div className="bg-green-50 border border-green-200 rounded p-2">
                                  <p className="text-xs text-green-800">
                                    <strong>Next Plays:</strong> {filteredAccounts.filter(a => a.nextPlaySuggestion).length} accounts have play suggestions ready
                                  </p>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-purple-200 pt-3">
                              <h4 className="font-semibold text-sm mb-2">🎯 Quick Actions</h4>
                              <div className="space-y-2">
                                <Button variant="outline" size="sm" className="w-full text-xs" data-testid="button-export-insights">
                                  <BarChart3 className="w-3 h-3 mr-1" />
                                  Export Analysis
                                </Button>
                                <Button variant="outline" size="sm" className="w-full text-xs" data-testid="button-schedule-review">
                                  <Calendar className="w-3 h-3 mr-1" />
                                  Schedule Review
                                </Button>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}

        {/* Connection Graph Step */}
        {currentStep === 'connection-graph' && (
          <div className="space-y-6">
            <p className="text-sm text-gray-600">
              Explore how Accounts ↔ Plays ↔ Threads ↔ Pillars/Personas connect and influence each other.
            </p>

            <Tabs value={connectionGraphTab} onValueChange={setConnectionGraphTab} data-testid="tabs-connection-graph">
              <TabsList data-testid="tabs-list-connection-graph">
                <TabsTrigger value="instructions" data-testid="tab-trigger-graph-instructions">How to Read</TabsTrigger>
                <TabsTrigger value="view" data-testid="tab-trigger-graph-view">View Network</TabsTrigger>
              </TabsList>

              <TabsContent value="instructions" data-testid="tab-content-graph-instructions">
                {renderConnectionGraphInstructions()}
              </TabsContent>

              <TabsContent value="view" data-testid="tab-content-graph-view">
                <div className="space-y-6">
                  <div>
                    <Input
                      placeholder="Search nodes (e.g., Novartis, Revenue Expansion, CIO)..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      data-testid="input-graph-search"
                      className="max-w-md"
                    />
                  </div>

                  {/* Simple Force-Layout Visualization Placeholder */}
                  <Card className="border-2 border-purple-200">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Network className="w-5 h-5" />
                        Connection Network
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="min-h-[500px]">
                      <div className="space-y-4">
                        {/* Node Legend */}
                        <div className="flex gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-blue-500" />
                            <span className="text-xs">Account</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-green-500" />
                            <span className="text-xs">Play</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-yellow-500" />
                            <span className="text-xs">Thread</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-purple-500" />
                            <span className="text-xs">Pillar</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 rounded-full bg-pink-500" />
                            <span className="text-xs">Persona</span>
                          </div>
                        </div>

                        {/* Node List (Simplified Visualization) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {filteredGraphNodes.slice(0, 30).map(node => {
                            const nodeColor = {
                              Account: 'bg-blue-100 border-blue-300 text-blue-800',
                              Play: 'bg-green-100 border-green-300 text-green-800',
                              Thread: 'bg-yellow-100 border-yellow-300 text-yellow-800',
                              Pillar: 'bg-purple-100 border-purple-300 text-purple-800',
                              Persona: 'bg-pink-100 border-pink-300 text-pink-800'
                            }[node.type];

                            const connectedEdges = filteredGraphEdges.filter(
                              e => e.source === node.id || e.target === node.id
                            );

                            return (
                              <Card 
                                key={node.id} 
                                className={`border-2 ${nodeColor} hover:shadow-lg hover:border-purple-400 transition-all cursor-pointer`} 
                                data-testid={`graph-node-${node.id}`}
                                onMouseEnter={() => setHoverGraphNode(node)}
                                onMouseLeave={() => setHoverGraphNode(null)}
                              >
                                <CardContent className="p-3">
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <Badge variant="outline" className="text-xs mb-2">
                                        {node.type}
                                      </Badge>
                                      <p className="font-semibold text-sm">{node.label}</p>
                                      {node.meta?.description && (
                                        <p className="text-xs text-gray-600 mt-1">{node.meta.description}</p>
                                      )}
                                    </div>
                                    <Badge variant="secondary" className="text-xs">
                                      {connectedEdges.length}
                                    </Badge>
                                  </div>
                                </CardContent>
                              </Card>
                            );
                          })}
                        </div>

                        {filteredGraphNodes.length > 30 && (
                          <p className="text-sm text-gray-600 italic text-center">
                            Showing 30 of {filteredGraphNodes.length} nodes. Use search to refine.
                          </p>
                        )}

                        {filteredGraphNodes.length === 0 && (
                          <p className="text-sm text-gray-500 italic text-center py-8">
                            No nodes match your search.
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <p className="text-sm text-blue-800">
                        <Lightbulb className="w-4 h-4 inline mr-2" />
                        <strong>Pro Tip:</strong> This simplified view shows node relationships. For advanced force-layout visualization with D3.js or React-ForceGraph, integrate a graph library.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>

      {/* Hover Drawers */}
      {renderHoverDrawer()}
      {renderGraphNodeHoverDrawer()}
    </div>
  );

  return (
    <ThreeColumnLayout
      leftNav={null}
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      content={
        <div className="h-full overflow-y-auto">
          <div className="sticky top-0 z-10 bg-white dark:bg-background pb-4 border-b px-8 pt-4">
            <QuickActions module="PulseHub" />
          </div>
          <div className="px-8 py-6">
            {renderContent()}
          </div>
        </div>
      }
      moduleColor={moduleColor}
      completedSteps={[]}
      featureName="Roadmaps & Connections"
    />
  );
}
