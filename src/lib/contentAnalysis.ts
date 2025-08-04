import { generateContent } from './openai';

// Simulate URL content analysis
export async function analyzeUrlContent(url: string): Promise<{title: string, description: string, category: string}> {
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  const domain = new URL(url).hostname.replace('www.', '');
  
  const mockAnalysis = {
    title: `Insights de ${domain}: Estrategias de Contenido Digital`,
    description: `Análisis profundo de las tendencias y estrategias de contenido identificadas en ${domain}. Esta idea explora las mejores prácticas, técnicas innovadoras y enfoques únicos que pueden aplicarse a tu estrategia de contenido. Incluye insights sobre audiencia, formato, distribución y optimización basados en el contenido analizado.`,
    category: domain.includes('tech') ? 'Tecnología' : 
              domain.includes('business') ? 'Negocios' :
              domain.includes('design') ? 'Diseño' : 'General'
  };
  
  return mockAnalysis;
}

// Analyze text content to generate ideas
export async function analyzeTextContent(text: string): Promise<{title: string, description: string, category: string}> {
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Extract key themes from text for better categorization
  const textLower = text.toLowerCase();
  let category = 'General';
  
  if (textLower.includes('tecnología') || textLower.includes('tech') || textLower.includes('software')) {
    category = 'Tecnología';
  } else if (textLower.includes('negocio') || textLower.includes('empresa') || textLower.includes('startup')) {
    category = 'Negocios';
  } else if (textLower.includes('diseño') || textLower.includes('creatividad') || textLower.includes('arte')) {
    category = 'Diseño';
  } else if (textLower.includes('marketing') || textLower.includes('contenido') || textLower.includes('social')) {
    category = 'Marketing';
  }
  
  // Generate a more contextual title and description
  const firstSentence = text.split('.')[0].substring(0, 100);
  
  return {
    title: `Análisis Estratégico: ${firstSentence}${firstSentence.length >= 100 ? '...' : ''}`,
    description: `Idea desarrollada a partir del análisis del texto proporcionado. Esta perspectiva explora los conceptos clave, tendencias identificadas y oportunidades estratégicas presentes en el contenido original. Incluye insights sobre aplicación práctica, audiencia objetivo y potencial de desarrollo en múltiples formatos de contenido.`,
    category
  };
}

// Generate ideas from RSS post
export async function generateIdeasFromRss(post: any): Promise<Array<{title: string, description: string, category: string}>> {
  // In a real implementation, you would use OpenAI to analyze the RSS post content
  // and generate 3 relevant ideas based on it
  
  // Simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock 3 ideas based on the RSS post
  const baseTitle = post.title;
  const baseContent = post.description;
  
  return [
    {
      title: `Análisis profundo: ${baseTitle}`,
      description: `Explorar las implicaciones y tendencias detrás de "${baseTitle}". Analizar el impacto en la industria y las oportunidades que presenta.`,
      category: 'Análisis'
    },
    {
      title: `Guía práctica inspirada en: ${baseTitle}`,
      description: `Crear una guía paso a paso basada en los conceptos presentados en "${baseTitle}". Incluir ejemplos prácticos y casos de uso.`,
      category: 'Tutorial'
    },
    {
      title: `Perspectiva contraria: ${baseTitle}`,
      description: `Examinar el otro lado de la historia presentada en "${baseTitle}". Ofrecer una perspectiva alternativa y balanceada del tema.`,
      category: 'Opinión'
    }
  ];
}

// Validate URL format
export function isValidUrl(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}