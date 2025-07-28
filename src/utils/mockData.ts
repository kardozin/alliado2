import { Project, Idea, Draft, Publication, ContentAnalysis } from '../types';

export const mockProjects: Project[] = [
  {
    id: '1',
    name: 'TechStartup Blog',
    description: 'Contenido técnico para emprendedores',
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-12-20'),
    settings: {
      styleGuides: [
        'Usa un tono conversacional pero profesional',
        'Incluye ejemplos prácticos en cada artículo',
        'Evita jerga técnica excesiva'
      ],
      contentType: 'Artículos para LinkedIn y blog',
      targetAudience: 'Emprendedores tecnológicos',
      tone: 'Profesional y accesible',
      referenceDocuments: [],
      rssFeeds: ['https://techcrunch.com/feed/', 'https://www.producthunt.com/feed']
    }
  },
  {
    id: '2',
    name: 'Creative Agency',
    description: 'Contenido visual y narrativo para redes sociales',
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-12-18'),
    settings: {
      styleGuides: [
        'Prioriza la narrativa visual',
        'Usa emociones para conectar',
        'Mantén mensajes concisos y poderosos'
      ],
      contentType: 'Posts para Instagram y TikTok',
      targetAudience: 'Creativos y diseñadores',
      tone: 'Inspiracional y creativo',
      referenceDocuments: [],
      rssFeeds: ['https://www.behance.net/feeds/projects']
    }
  }
];

export const mockIdeas: Idea[] = [
  {
    id: '1',
    projectId: '1',
    title: 'El futuro del trabajo remoto en startups',
    description: 'Explorar cómo las startups están adaptando sus culturas al trabajo híbrido',
    category: 'Tendencias',
    source: 'direct',
    createdAt: new Date('2024-12-18'),
    status: 'captured'
  },
  {
    id: '2',
    projectId: '1',
    title: 'Herramientas de IA para productividad',
    description: 'Análisis de las mejores herramientas de IA para equipos pequeños',
    category: 'Tecnología',
    source: 'url',
    sourceData: 'https://example.com/ai-tools-article',
    createdAt: new Date('2024-12-17'),
    status: 'in-progress'
  }
];

export const mockDrafts: Draft[] = [
  {
    id: '1',
    ideaId: '2',
    projectId: '1',
    title: 'Las 5 Herramientas de IA que Están Transformando la Productividad',
    content: `En el panorama actual de las startups, la eficiencia no es solo una ventaja competitiva, es una necesidad de supervivencia. Las herramientas de inteligencia artificial han emergido como los grandes catalizadores de esta transformación.

## 1. Automatización Inteligente de Tareas

La primera revolución viene de la mano de herramientas que no solo automatizan, sino que aprenden de nuestros patrones de trabajo...`,
    version: 1,
    analysis: {
      tone: 'Profesional',
      emotion: 'Optimismo',
      readability: 85,
      keyThemes: ['IA', 'Productividad', 'Startups', 'Automatización'],
      seoScore: 78,
      suggestedKeywords: ['herramientas IA', 'productividad startup', 'automatización']
    },
    createdAt: new Date('2024-12-17'),
    updatedAt: new Date('2024-12-17')
  }
];

export const mockPublications: Publication[] = [
  {
    id: '1',
    projectId: '1',
    title: 'Cómo Validar tu Idea de Startup en 30 Días',
    content: 'Contenido completo del artículo publicado...',
    platform: 'LinkedIn',
    publishedAt: new Date('2024-12-10'),
    analysis: {
      tone: 'Educativo',
      emotion: 'Confianza',
      readability: 82,
      keyThemes: ['Validación', 'Startup', 'MVP', 'Mercado'],
      writingStyle: {
        vocabularyLevel: 'Intermedio',
        sentenceComplexity: 'Moderada',
        commonPhrases: ['es importante', 'debemos considerar', 'en este contexto'],
        writingPatterns: ['Uso de ejemplos prácticos', 'Estructura paso a paso']
      },
      voiceConsistency: {
        score: 85,
        deviations: ['Tono más técnico en párrafo 3'],
        recommendations: ['Mantener lenguaje accesible']
      }
    }
  },
  {
    id: '2',
    projectId: '1',
    title: 'El Arte de Hacer Pitch Perfecto',
    content: 'Contenido completo del artículo publicado...',
    platform: 'Blog',
    publishedAt: new Date('2024-12-05'),
    analysis: {
      tone: 'Inspiracional',
      emotion: 'Motivación',
      readability: 79,
      keyThemes: ['Pitch', 'Presentación', 'Inversores', 'Storytelling'],
      writingStyle: {
        vocabularyLevel: 'Avanzado',
        sentenceComplexity: 'Compleja',
        commonPhrases: ['la clave está en', 'es fundamental', 'no olvides que'],
        writingPatterns: ['Uso de metáforas', 'Llamadas a la acción']
      },
      voiceConsistency: {
        score: 92,
        deviations: [],
        recommendations: ['Excelente consistencia de voz']
      }
    }
  }
];