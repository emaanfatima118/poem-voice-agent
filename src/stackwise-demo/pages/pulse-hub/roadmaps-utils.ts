// Roadmaps & Connections Utility Functions

import type { RoadmapDataset, AccountNode, Stage, GraphData, GraphNode, GraphEdge } from './roadmaps-types';

export function accountsByStage(data: RoadmapDataset) {
  return data.accounts.reduce<Record<Stage, AccountNode[]>>((acc, acct) => {
    acc[acct.stage] = acc[acct.stage] || [];
    acc[acct.stage].push(acct);
    return acc;
  }, {
    'Awareness': [],
    'Engagement': [],
    'Activation': [],
    'Opportunity': [],
    'Negotiation': [],
    'Closed Won': [],
    'Closed Lost': [],
    'Expansion': []
  });
}

export function filterAccounts(
  data: RoadmapDataset,
  filters: {
    thread?: string;
    horizonTime?: string;
    horizonMagnitude?: string;
    industry?: string;
    persona?: string;
    pillar?: string;
    owner?: string;
  }
): AccountNode[] {
  return data.accounts.filter(acct => {
    if (filters.thread && !acct.threads.some(t => t.toLowerCase().includes(filters.thread!.toLowerCase()))) {
      return false;
    }
    if (filters.horizonTime && acct.horizon.time !== filters.horizonTime) {
      return false;
    }
    if (filters.horizonMagnitude && acct.horizon.magnitude !== filters.horizonMagnitude) {
      return false;
    }
    if (filters.industry && !acct.industry.toLowerCase().includes(filters.industry.toLowerCase())) {
      return false;
    }
    if (filters.persona && !acct.persona.some(p => p.toLowerCase().includes(filters.persona!.toLowerCase()))) {
      return false;
    }
    if (filters.pillar && !acct.pillar.some(p => p.toLowerCase().includes(filters.pillar!.toLowerCase()))) {
      return false;
    }
    if (filters.owner && !acct.owner.toLowerCase().includes(filters.owner.toLowerCase())) {
      return false;
    }
    return true;
  });
}

export function buildGraph(data: RoadmapDataset): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];

  // Threads
  for (const t of data.threads) {
    nodes.push({
      id: `thr-${t.name}`,
      type: 'Thread',
      label: t.name,
      meta: { description: t.description }
    });
  }

  // Plays
  for (const p of data.plays) {
    nodes.push({
      id: `ply-${p.id}`,
      type: 'Play',
      label: p.name,
      meta: { owner: p.owner, type: p.type, channels: p.channels }
    });

    // Play → Thread edges
    for (const th of p.threads) {
      edges.push({
        id: `${p.id}-${th}`,
        source: `ply-${p.id}`,
        target: `thr-${th}`,
        kind: 'supports'
      });
    }

    // Pillar node
    const pillarId = `pil-${p.pillar}`;
    if (!nodes.find(n => n.id === pillarId)) {
      nodes.push({ id: pillarId, type: 'Pillar', label: p.pillar });
    }
    edges.push({
      id: `${p.id}-pil-${p.pillar}`,
      source: `ply-${p.id}`,
      target: pillarId,
      kind: 'belongsTo'
    });

    // Persona nodes
    for (const per of p.persona) {
      const perId = `per-${per}`;
      if (!nodes.find(n => n.id === perId)) {
        nodes.push({ id: perId, type: 'Persona', label: per });
      }
      edges.push({
        id: `${p.id}-per-${per}`,
        source: `ply-${p.id}`,
        target: perId,
        kind: 'targets'
      });
    }
  }

  // Accounts
  for (const a of data.accounts) {
    nodes.push({
      id: `acc-${a.id}`,
      type: 'Account',
      label: a.name,
      meta: {
        stage: a.stage,
        owner: a.owner,
        industry: a.industry,
        horizon: a.horizon
      }
    });

    // Account → Thread edges
    for (const th of a.threads) {
      edges.push({
        id: `${a.id}-${th}`,
        source: `acc-${a.id}`,
        target: `thr-${th}`,
        kind: 'influences'
      });
    }

    // Account → Play edges
    for (const playId of a.linkedPlays) {
      edges.push({
        id: `${a.id}-${playId}`,
        source: `acc-${a.id}`,
        target: `ply-${playId}`,
        kind: 'influences'
      });
    }
  }

  return { nodes, edges };
}

export function suggestNextPlay(accountId: string, data: RoadmapDataset): string | null {
  const account = data.accounts.find(a => a.id === accountId);
  if (!account) return null;

  // Naive rule: if account is pre-opportunity, prefer plays that target Activation/Opportunity
  const preOpportunity = ['Awareness', 'Engagement', 'Activation'].includes(account.stage);
  
  if (preOpportunity) {
    const play = data.plays.find(p => 
      p.targetStages.includes('Activation') || p.targetStages.includes('Opportunity')
    );
    return play?.id || null;
  }

  // Else prefer Expansion/Advocacy motions
  const play = data.plays.find(p => 
    p.targetStages.includes('Expansion') || p.targetStages.includes('Closed Won')
  );
  return play?.id || null;
}
