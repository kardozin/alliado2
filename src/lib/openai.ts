import OpenAI from 'openai';

// Simple Markdown to HTML converter
function markdownToHtml(markdown: string): string {
  let html = markdown
    // Headers
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // Bold text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic text
    .replace(/(?<!\*)\*([^*]+?)\*(?!\*)/g, '<em>$1</em>')
    // Lists
    .replace(/^\* (.+)$/gm, '<li>$1</li>')
    // Numbered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

  // Convert line breaks to paragraphs
  const paragraphs = html.split('\n\n').filter(p => p.trim());
  html = paragraphs.map(paragraph => {
    const trimmed = paragraph.trim();
    // Don't wrap headers or list items in paragraphs
    if (trimmed.startsWith('<h') || trimmed.startsWith('<li>')) {
      return trimmed;
    }
    // Replace single line breaks with <br> within paragraphs
    const withBreaks = trimmed.replace(/\n/g, '<br>');
    return `<p>${withBreaks}</p>`;
  }).join('');

  // Wrap consecutive list items in ul/ol tags
  html = html.replace(/(<li>.*?<\/li>)(\s*<li>.*?<\/li>)*/g, (match) => {
    return `<ul>${match}</ul>`;
  });

  return html.trim();
}

// Verificar que la API key esté disponible
const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

if (!apiKey) {
  console.error('VITE_OPENAI_API_KEY no está configurada en el archivo .env');
}

const openai = apiKey ? new OpenAI({
  apiKey: apiKey,
  dangerouslyAllowBrowser: true // Solo para desarrollo, en producción usar edge functions
}) : null;

export interface GenerateContentOptions {
  idea: {
    title: string;
    description: string;
    category: string;
    sourceData?: string;
  };
  projectSettings: {
    styleGuides: string[];
    contentType: string;
    targetAudience: string;
    tone: string;
  };
  contentType?: 'article' | 'social-post' | 'blog-post';
}

export interface ContentAnalysis {
  tone: string;
  emotion: string;
  readability: number;
  keyThemes: string[];
  seoScore?: number;
  suggestedKeywords?: string[];
  suggestions?: string[];
}

export async function generateContent(options: GenerateContentOptions): Promise<string> {
  if (!openai) {
    throw new Error('OpenAI no está configurado. Por favor, añade VITE_OPENAI_API_KEY a tu archivo .env');
  }

  const { idea, projectSettings } = options;
  
  // Construir el prompt contextual
  const styleGuidesText = projectSettings.styleGuides.length > 0 
    ? `\n\nGuías de estilo a seguir:\n${projectSettings.styleGuides.map(guide => `- ${guide}`).join('\n')}`
    : '';

  const sourceContext = idea.sourceData 
    ? `\n\nContexto adicional de la fuente:\n${idea.sourceData}`
    : '';

  const prompt = `Eres un escritor experto especializado en crear contenido estratégico de alta calidad.

CONTEXTO DEL PROYECTO:
- Tipo de contenido: ${projectSettings.contentType}
- Audiencia objetivo: ${projectSettings.targetAudience}
- Tono deseado: ${projectSettings.tone}${styleGuidesText}

IDEA A DESARROLLAR:
- Título: ${idea.title}
- Descripción: ${idea.description}
- Categoría: ${idea.category}${sourceContext}

INSTRUCCIONES:
1. Crea un contenido completo y bien estructurado basado en la idea proporcionada
2. Mantén el tono y estilo consistente con las guías del proyecto
3. Asegúrate de que el contenido sea relevante para la audiencia objetivo
4. Incluye una estructura clara con introducción, desarrollo y conclusión
5. Añade valor práctico y ejemplos cuando sea apropiado
6. El contenido debe ser original y engaging
7. NO incluyas bloques de código markdown (```html, ```markdown, etc.)
8. Responde ÚNICAMENTE con el contenido HTML limpio, sin prefijos ni sufijos

Genera el contenido completo ahora:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini", // Modelo más económico pero potente
      messages: [
        {
          role: "system",
          content: "Eres un escritor experto y estratega de contenido. Creas contenido de alta calidad que conecta con audiencias específicas y cumple objetivos estratégicos claros."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7,
    });

    const rawContent = completion.choices[0]?.message?.content || 'Error: No se pudo generar contenido';
    
    // Clean the content and convert Markdown to HTML
    let cleanContent = rawContent.trim();
    
    // Remove any markdown code block delimiters
    cleanContent = cleanContent.replace(/^```html\s*\n?/i, '').replace(/\n?\s*```$/i, '');
    cleanContent = cleanContent.replace(/^```markdown\s*\n?/i, '').replace(/\n?\s*```$/i, '');
    cleanContent = cleanContent.replace(/^```\s*\n?/i, '').replace(/\n?\s*```$/i, '');
    
    // Remove any leading quotes or backticks
    cleanContent = cleanContent.replace(/^['"`]+|['"`]+$/g, '');
    
    // Convert Markdown to HTML for rich text display
    return markdownToHtml(cleanContent);
  } catch (error) {
    console.error('Error generating content:', error);
    throw new Error('Error al generar contenido con IA. Verifica tu API key de OpenAI.');
  }
}

export async function analyzeContent(content: string): Promise<ContentAnalysis> {
  if (!openai) {
    throw new Error('OpenAI no está configurado. Por favor, añade VITE_OPENAI_API_KEY a tu archivo .env');
  }

  const prompt = `Analiza el siguiente contenido enfocándote en el estilo de escritura, consistencia de voz y calidad editorial. Proporciona un análisis detallado en formato JSON.

CONTENIDO A ANALIZAR:
${content}

Analiza estos aspectos específicos:
1. Tono y emoción dominante
2. Nivel de legibilidad y complejidad
3. Temas clave identificados
4. Calidad SEO básica
5. Estilo de escritura (vocabulario, estructura de oraciones)
6. Patrones de escritura únicos
7. Frases o expresiones características

Proporciona el análisis en este formato JSON exacto:
{
  "tone": "descripción del tono (ej: Profesional, Casual, Inspiracional)",
  "emotion": "emoción dominante (ej: Optimismo, Confianza, Curiosidad)",
  "readability": número_entre_0_y_100,
  "keyThemes": ["tema1", "tema2", "tema3"],
  "seoScore": número_entre_0_y_100,
  "suggestedKeywords": ["palabra1", "palabra2", "palabra3"],
  "writingStyle": {
    "vocabularyLevel": "Básico/Intermedio/Avanzado",
    "sentenceComplexity": "Simple/Moderada/Compleja",
    "commonPhrases": ["frase1", "frase2", "frase3"],
    "writingPatterns": ["patrón1", "patrón2"]
  },
  "voiceConsistency": {
    "score": número_entre_0_y_100,
    "deviations": ["desviación1", "desviación2"],
    "recommendations": ["recomendación1", "recomendación2"]
  },
  "suggestions": ["sugerencia_editorial1", "sugerencia_editorial2"]
}

Responde SOLO con el JSON, sin texto adicional:`;

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Eres un analista de contenido experto. Analizas texto y proporcionas métricas precisas en formato JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 500,
      temperature: 0.3,
    });

    const response = completion.choices[0]?.message?.content;
    if (!response) {
      throw new Error('No response from OpenAI');
    }

    // Intentar parsear el JSON
    try {
      // Strip markdown code block delimiters if present
      const cleanedResponse = response.replace(/```json\s*|\s*```/g, '').trim();
      return JSON.parse(cleanedResponse);
    } catch (parseError) {
      console.error('Error parsing analysis JSON:', parseError);
      // Fallback analysis si el JSON no es válido
      return {
        tone: 'Profesional',
        emotion: 'Neutral',
        readability: 75,
        keyThemes: ['Contenido', 'Análisis'],
        seoScore: 70,
        suggestedKeywords: ['contenido', 'análisis'],
        suggestions: ['El análisis automático no pudo completarse correctamente']
      };
    }
  } catch (error) {
    console.error('Error analyzing content:', error);
    throw new Error('Error al analizar contenido con IA. Verifica tu API key de OpenAI.');
  }
}