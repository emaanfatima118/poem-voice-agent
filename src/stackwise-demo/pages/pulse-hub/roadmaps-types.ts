// Roadmaps & Connections Type Definitions

export type Stage =
  | 'Awareness'
  | 'Engagement'
  | 'Activation'
  | 'Opportunity'
  | 'Negotiation'
  | 'Closed Won'
  | 'Closed Lost'
  | 'Expansion';

export type TimeHorizon = 'Immediate' | 'Near-Term' | 'Long-Term';
export type ImpactMagnitude = 'Tactical' | 'Programmatic' | 'Transformational';

export interface ImpactHorizon {
  time: TimeHorizon;
  magnitude: ImpactMagnitude;
  score: number; // 0-100 synthetic blend
}

export interface StrategicThread {
  name: string;
  description: string;
}

export interface AccountNode {
  id: string;
  name: string;
  stage: Stage;
  threads: string[]; // references StrategicThread.name
  horizon: ImpactHorizon;
  owner: string;
  industry: string;
  persona: string[];
  pillar: string[];
  linkedPlays: string[]; // references PlayMotion.id
  lastActivity: string; // date or relative
  nextPlaySuggestion?: string;
}

export interface PlayMotion {
  id: string;
  name: string;
  type: '1:1' | 'Cluster' | 'Awareness';
  threads: string[];
  horizon: ImpactHorizon;
  channels: string[];
  owner: string;
  targetStages: Stage[];
  pillar: string;
  persona: string[];
  accounts: string[]; // linked account IDs
}

export interface RoadmapDataset {
  threads: StrategicThread[];
  accounts: AccountNode[];
  plays: PlayMotion[];
}

// Graph types for Connection Graph (Cluster Journey)
export type NodeType = 'Account' | 'Play' | 'Thread' | 'Pillar' | 'Persona';

export interface GraphNode {
  id: string;
  type: NodeType;
  label: string;
  meta?: Record<string, any>;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  kind: 'influences' | 'belongsTo' | 'targets' | 'supports';
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
}
