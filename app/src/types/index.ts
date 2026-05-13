export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface DimensionScores {
  mind: number;
  body: number;
  spirit: number;
  vocation: number;
}

export interface AssessmentResult {
  metatypeName: string;
  metatypeDescription: string;
  lifestyleArchetype: string;
  dimensionScores: DimensionScores;
  dominantDimension: string;
  weakestDimension: string;
  bottleneck: string;
  transformationStrategy: string;
  nextSteps: string[];
  quadrantAnalysis: {
    mind: { level: number; phase: number; traits: string; analysis: string };
    body: { level: number; phase: number; traits: string; analysis: string };
    spirit: { level: number; phase: number; traits: string; analysis: string };
    vocation: { level: number; phase: number; traits: string; analysis: string };
  };
}

export type AppPhase = 'loading' | 'hero' | 'assessment' | 'metatype' | 'report';

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
  isComplete: boolean;
  result: AssessmentResult | null;
}
