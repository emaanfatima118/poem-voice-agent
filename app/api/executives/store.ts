/**
 * In-memory store for executives (demo purposes)
 * In production, replace this with database operations
 */

export interface Executive {
  id: string;
  name: string;
  title: string;
  company: string;
  audience: string;
  goals: string;
  bio: string;
  linkedin: string;
  twitter: string;
  facebook: string;
  instagram: string;
  youtube: string;
  tiktok: string;
  reddit: string;
  wechat: string;
  website: string;
  expertise: string[];
  followPeople: string[];
  follows: string[];
  eventsInterest: string[];
  phrasesUse: string;
  phrasesAvoid: string;
  communities: string[];
  newsSources: string[];
  industry: string;
  vertical: string;
  motivates: string;
  personality: string;
  visibilityScore: number;
  toneScore: number;
  engagementScore: number;
  personaScore: number;
  toneMapping: {
    emotional: {
      reflective: number;
      inspirational: number;
      optimistic: number;
      compassionate: number;
      humor: number;
    };
    persuasive: {
      assertive: number;
      persuasive: number;
      authoritative: number;
    };
    communication: {
      serious: number;
      conversational: number;
      informative: number;
      curious: number;
      matterOfFact: number;
    };
  };
}

let executivesStore: Executive[] = [];
let nextId = 1;

export function getAllExecutives(): Executive[] {
  return executivesStore;
}

export function getExecutiveById(id: string): Executive | undefined {
  return executivesStore.find((e) => e.id === id);
}

export function createExecutive(data: Partial<Executive>): Executive {
  const newExecutive: Executive = {
    id: `exec-${nextId++}`,
    name: data.name || 'New Executive',
    title: data.title || '',
    company: data.company || '',
    audience: data.audience || '',
    goals: data.goals || '',
    bio: data.bio || '',
    linkedin: data.linkedin || '',
    twitter: data.twitter || '',
    facebook: data.facebook || '',
    instagram: data.instagram || '',
    youtube: data.youtube || '',
    tiktok: data.tiktok || '',
    reddit: data.reddit || '',
    wechat: data.wechat || '',
    website: data.website || '',
    expertise: data.expertise || [],
    followPeople: data.followPeople || [],
    follows: data.follows || [],
    eventsInterest: data.eventsInterest || [],
    phrasesUse: data.phrasesUse || '',
    phrasesAvoid: data.phrasesAvoid || '',
    communities: data.communities || [],
    newsSources: data.newsSources || [],
    industry: data.industry || '',
    vertical: data.vertical || '',
    motivates: data.motivates || '',
    personality: data.personality || '',
    visibilityScore: data.visibilityScore || 0,
    toneScore: data.toneScore || 0,
    engagementScore: data.engagementScore || 0,
    personaScore: data.personaScore || 0,
    toneMapping: data.toneMapping || {
      emotional: {
        reflective: 50,
        inspirational: 50,
        optimistic: 50,
        compassionate: 50,
        humor: 50,
      },
      persuasive: {
        assertive: 50,
        persuasive: 50,
        authoritative: 50,
      },
      communication: {
        serious: 50,
        conversational: 50,
        informative: 50,
        curious: 50,
        matterOfFact: 50,
      },
    },
  };

  executivesStore.push(newExecutive);
  return newExecutive;
}

export function updateExecutive(id: string, data: Partial<Executive>): Executive | null {
  const index = executivesStore.findIndex((e) => e.id === id);
  if (index === -1) {
    return null;
  }

  executivesStore[index] = { ...executivesStore[index], ...data };
  return executivesStore[index];
}

export function deleteExecutive(id: string): boolean {
  const index = executivesStore.findIndex((e) => e.id === id);
  if (index === -1) {
    return false;
  }

  executivesStore.splice(index, 1);
  return true;
}

