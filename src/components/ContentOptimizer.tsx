import React, { useState } from 'react';
import { 
  Target, 
  TrendingUp, 
  Eye, 
  Zap, 
  CheckCircle, 
  AlertTriangle, 
  Lightbulb,
  RefreshCw,
  Copy,
  Download,
  Loader
} from 'lucide-react';
import { ContentAnalysis } from '../types';
import { generateContent } from '../lib/openai';

interface ContentOptimizerProps {
  content: string;
  analysis: ContentAnalysis;
  onOptimize: (optimizedContent: string) => void;
  onReanalyze: () => void;
  projectSettings?: any;
  isOptimizing?: boolean;
  isAnalyzing?: boolean;
}

export function ContentOptimizer({ 
  content, 
  analysis, 
  onOptimize, 
  onReanalyze,
  projectSettings,
  isOptimizing = false,
  isAnalyzing = false 
}: ContentOptimizerProps) {
  const [selectedOptimizations, setSelectedOptimizations] = useState<string[]>([]);
  const [showOptimizationPreview, setShowOptimizationPreview] = useState(false);
  const [isOptimizingContent, setIsOptimizingContent] = useState(false);

  const optimizationSuggestions = [
    {
      id: 'readability',
      title: 'Mejorar Legibilidad',
      description: 'Simplificar oraciones complejas y mejorar la estructura',
      impact: 'Alto',
      enabled: analysis.readability < 70,
      icon: Eye,
      color: 'purple'
    },
    {
      id: 'seo',
      title: 'Optimización SEO',
      description: 'Integrar palabras clave y mejorar estructura para buscadores',
      impact: 'Alto',
      enabled: (analysis.seoScore || 0) < 80,
      icon: Target,
      color: 'green'
    },
    {
      id: 'engagement',
      title: 'Aumentar Engagement',
      description: 'Añadir elementos que generen más interacción',
      impact: 'Medio',
      enabled: true,
      icon: TrendingUp,
      color: 'blue'
    },
    {
      id: 'tone',
      title: 'Ajustar Tono',
      description: 'Refinar el tono para mejor conexión con la audiencia',
      impact: 'Medio',
      enabled: true,
      icon: Lightbulb,
      color: 'amber'
    }
  ];

  const handleOptimizationToggle = (optimizationId: string) => {
    setSelectedOptimizations(prev => 
      prev.includes(optimizationId)
        ? prev.filter(id => id !== optimizationId)
        : [...prev, optimizationId]
    );
  };

  const handleOptimize = async () => {
    if (selectedOptimizations.length === 0) return;
    
    setIsOptimizingContent(true);
    try {
      // Crear prompt específico para optimización
      const optimizationPrompt = `Optimiza el siguiente contenido aplicando estas mejoras específicas: ${selectedOptimizations.map(id => {
        const suggestion = optimizationSuggestions.find(s => s.id === id);
        return suggestion ? `${suggestion.title}: ${suggestion.description}` : id;
      }).join(', ')}.

CONTENIDO ORIGINAL:
${content}

INSTRUCCIONES:
- Mantén el mensaje y estructura principal
- Aplica ÚNICAMENTE las optimizaciones seleccionadas
- No cambies el tono general del contenido
- Devuelve el contenido optimizado en formato HTML
- NO agregues explicaciones adicionales, solo el contenido optimizado`;

      const optimizedContent = await generateContent({
        idea: {
          title: 'Optimización de contenido',
          description: optimizationPrompt,
          category: 'Optimización'
        },
        projectSettings: projectSettings || {
          styleGuides: [],
          contentType: '',
          targetAudience: '',
          tone: ''
        }
      });

      onOptimize(optimizedContent);
    } catch (error) {
      console.error('Error optimizing content:', error);
    } finally {
      setIsOptimizingContent(false);
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'Alto': return 'text-red-400 bg-red-500/10';
      case 'Medio': return 'text-amber-400 bg-amber-500/10';
      case 'Bajo': return 'text-green-400 bg-green-500/10';
      default: return 'text-gray-400 bg-gray-500/10';
    }
  };

  return (
    <div className="glass-effect rounded-xl p-6 border nyt-border animate-slide-up">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-semibold serif text-gray-100 flex items-center space-x-2">
          <Zap className="w-5 h-5 text-amber-400" />
          <span>Optimizador de Contenido</span>
        </h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="p-2 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/50 rounded-lg disabled:opacity-50"
            title="Re-analizar contenido"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Current Scores */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-gray-900/30 rounded-lg p-4 text-center">
          <Eye className="w-6 h-6 text-purple-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-100">{analysis.readability}%</p>
          <p className="text-xs text-gray-400">Legibilidad</p>
        </div>
        <div className="bg-gray-900/30 rounded-lg p-4 text-center">
          <Target className="w-6 h-6 text-green-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-100">{analysis.seoScore || 'N/A'}</p>
          <p className="text-xs text-gray-400">SEO Score</p>
        </div>
        <div className="bg-gray-900/30 rounded-lg p-4 text-center">
          <TrendingUp className="w-6 h-6 text-blue-400 mx-auto mb-2" />
          <p className="text-2xl font-bold text-gray-100">
            {Math.round((analysis.readability + (analysis.seoScore || 70)) / 2)}%
          </p>
          <p className="text-xs text-gray-400">General</p>
        </div>
      </div>

      {/* Optimization Suggestions */}
      <div className="space-y-4 mb-6">
        <h4 className="font-semibold text-gray-100 mb-4">Optimizaciones Sugeridas</h4>
        {optimizationSuggestions.map((suggestion, index) => {
          const Icon = suggestion.icon;
          const isSelected = selectedOptimizations.includes(suggestion.id);
          
          return (
            <div
              key={suggestion.id}
              className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer animate-fade-in ${
                suggestion.enabled
                  ? isSelected
                    ? 'bg-amber-500/10 border-amber-500/30'
                    : 'bg-gray-900/30 border-gray-700/50 hover:bg-gray-800/40'
                  : 'bg-gray-900/20 border-gray-800/30 opacity-50 cursor-not-allowed'
              }`}
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => suggestion.enabled && handleOptimizationToggle(suggestion.id)}
            >
              <div className="flex items-center space-x-4">
                <div className={`p-2 rounded-lg bg-${suggestion.color}-500/10`}>
                  <Icon className={`w-5 h-5 text-${suggestion.color}-400`} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-1">
                    <h5 className="font-semibold text-gray-100">{suggestion.title}</h5>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getImpactColor(suggestion.impact)}`}>
                      {suggestion.impact}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{suggestion.description}</p>
                </div>
                {suggestion.enabled && (
                  <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                    isSelected 
                      ? 'bg-amber-500 border-amber-500' 
                      : 'border-gray-600'
                  }`}>
                    {isSelected && <CheckCircle className="w-5 h-5 text-gray-900" />}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-800/60">
        <div className="text-sm text-gray-400">
          {selectedOptimizations.length} optimización(es) seleccionada(s)
        </div>
        <div className="flex space-x-3">
          <button
            onClick={() => setShowOptimizationPreview(!showOptimizationPreview)}
            className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors duration-200 flex items-center space-x-2"
          >
            <Eye className="w-4 h-4" />
            <span>Vista Previa</span>
          </button>
          <button
            onClick={handleOptimize}
            disabled={selectedOptimizations.length === 0 || isOptimizingContent}
            className="btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
          >
            {isOptimizingContent ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                <span>Optimizando...</span>
              </>
            ) : (
              <>
                <Zap className="w-4 h-4" />
                <span>Optimizar Contenido</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Optimization Preview */}
      {showOptimizationPreview && selectedOptimizations.length > 0 && (
        <div className="mt-6 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl animate-slide-up">
          <h5 className="font-semibold text-amber-400 mb-3 flex items-center space-x-2">
            <Lightbulb className="w-4 h-4" />
            <span>Vista Previa de Optimizaciones</span>
          </h5>
          <div className="space-y-2 text-sm text-gray-300">
            {selectedOptimizations.map(id => {
              const suggestion = optimizationSuggestions.find(s => s.id === id);
              return suggestion ? (
                <div key={id} className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4 text-green-400" />
                  <span>{suggestion.title}: {suggestion.description}</span>
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  );
}