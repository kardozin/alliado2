export interface Project {
  id: string;
  name: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
  settings: ProjectSettings;
}

export interface ProjectSettings {
  styleGuides: string[];
  contentType: string;
  targetAudience: string;
  tone: string;
  referenceDocuments: ReferenceDocument[];
  rssFeeds: string[];
}

export interface ReferenceDocument {
  id: string;
  name: string;
  content: string;
  uploadedAt: Date;
}

export interface Idea {
  id: string;
  projectId: string;
  title: string;
  description: string;
  category: string;
  source: 'direct' | 'text' | 'url' | 'rss' | 'youtube';
  sourceData?: string;
  createdAt: Date;
  status: 'captured' | 'in-progress' | 'completed';
}

export interface Draft {
  id: string;
  ideaId: string;
  projectId: string;
  title: string;
  content: string;
  version: number;
  analysis?: ContentAnalysis;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentAnalysis {
  tone: string;
  emotion: string;
  readability: number;
  keyThemes: string[];
  seoScore?: number;
  suggestedKeywords?: string[];
  writingStyle?: {
    vocabularyLevel: string;
    sentenceComplexity: string;
    commonPhrases: string[];
    writingPatterns: string[];
  };
  voiceConsistency?: {
    score: number;
    deviations: string[];
    recommendations: string[];
  };
}

export interface Publication {
  id: string;
  projectId: string;
  title: string;
  content: string;
  platform: string;
  publishedAt: Date;
  analysis: ContentAnalysis;
}

export type ViewMode = 'projects' | 'ideas' | 'drafts' | 'publications' | 'analytics';