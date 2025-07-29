import React, { useState } from 'react';
import { 
  BarChart, 
  TrendingUp, 
  Eye, 
  Target, 
  Lightbulb, 
  AlertTriangle,
  CheckCircle,
  Zap,
  RefreshCw
} from 'lucide-react';
import { ContentAnalysis } from '../types';

interface DraftAnalysisPanelProps {
  analysis: ContentAnalysis;
  onReanalyze?: () => void;
  isAnalyzing?: boolean;
}

export function DraftAnalysisPanel({ analysis, onReanalyze, isAnalyzing }: DraftAnalysisPanelProps) {
  const [showDetails, setShowDetails] = useState(false);

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-400 bg-green-500/10';
    if (score >= 60) return 'text-amber-400 bg-amber-500/10';
    return 'text-red-400 bg-red-500/10';
  };

  const getScoreIcon = (score: number) => {
    if (score >= 80) return <CheckCircle className="w-4 h-4" />;
    if (score >= 60) return <AlertTriangle className="w-4 h-4" />;
    return <AlertTriangle className="w-4 h-4" />;
  };

  return (
    <div className="glass-effect rounded-xl p-6 space-y-6 border nyt-border animate-slide-up">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold serif text-gray-100 text-lg flex items-center space-x-2">
          <BarChart className="w-5 h-5 text-amber-400" />
          <span>Análisis de Contenido</span>
        </h4>
        {onReanalyze && (
          <button
            onClick={onReanalyze}
            disabled={isAnalyzing}
            className="p-2 text-gray-400 hover:text-amber-400 transition-all duration-200 hover:bg-gray-800/50 rounded-lg disabled:opacity-50"
            title="Re-analizar contenido"
          >
            <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
          </button>
        )}
      </div>
      
      {/* Main Metrics */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900/30 rounded-xl p-4">
          <div className="flex items-center space-x-3 mb-3">
            <Eye className="w-5 h-5 text-purple-400" />
            <label className="text-sm font-medium text-gray-300">Legibilidad</label>
          </div>
          <div className="flex items-center space-x-3">
            <div className="flex-1 bg-gray-800 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-purple-500 to-purple-400 h-3 rounded-full transition-all duration-1000" 
                style={{ width: `${analysis.readability}%` }}
              ></div>
            </div>
            <span className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(analysis.readability)}`}>
              {analysis.readability}%
            </span>
          </div>
        </div>

        {analysis.seoScore && (
          <div className="bg-gray-900/30 rounded-xl p-4">
            <div className="flex items-center space-x-3 mb-3">
              <Target className="w-5 h-5 text-green-400" />
              <label className="text-sm font-medium text-gray-300">SEO Score</label>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex-1 bg-gray-800 rounded-full h-3">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-1000" 
                  style={{ width: `${analysis.seoScore}%` }}
                ></div>
              </div>
              <span className={`text-lg font-bold px-2 py-1 rounded ${getScoreColor(analysis.seoScore)}`}>
                {analysis.seoScore}%
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Tone and Emotion */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-gray-900/30 rounded-xl p-4">
          <label className="text-sm font-medium text-gray-400 mb-2 block">Tono</label>
          <p className="text-gray-100 font-semibold text-lg">{analysis.tone}</p>
        </div>
        <div className="bg-gray-900/30 rounded-xl p-4">
          <label className="text-sm font-medium text-gray-400 mb-2 block">Emoción Dominante</label>
          <p className="text-gray-100 font-semibold text-lg">{analysis.emotion}</p>
        </div>
      </div>

      {/* Key Themes */}
      <div>
        <label className="text-sm font-medium text-gray-400 mb-3 block">Temas Clave</label>
        <div className="flex flex-wrap gap-2">
          {analysis.keyThemes.map((theme, index) => (
            <span 
              key={index} 
              className={`theme-tag theme-tag-${['blue', 'green', 'purple', 'amber', 'red', 'indigo'][index % 6]} animate-fade-in`}
              style={{ animationDelay: `${index * 50}ms` }}
            >
              {theme}
            </span>
          ))}
        </div>
      </div>

      {/* SEO Keywords */}
      {analysis.suggestedKeywords && analysis.suggestedKeywords.length > 0 && (
        <div>
          <label className="text-sm font-medium text-gray-400 mb-3 block">Palabras Clave Sugeridas</label>
          <div className="flex flex-wrap gap-2">
            {analysis.suggestedKeywords.map((keyword, index) => (
              <span 
                key={index} 
                className={`theme-tag theme-tag-${['green', 'blue', 'purple', 'amber'][index % 4]} animate-fade-in`}
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {keyword}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Suggestions */}
      {analysis.suggestions && analysis.suggestions.length > 0 && (
        <div>
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="flex items-center space-x-2 text-sm font-medium text-gray-300 hover:text-gray-100 transition-colors duration-200 mb-3"
          >
            <Lightbulb className="w-4 h-4" />
            <span>Sugerencias de Mejora</span>
            <span className={`transform transition-transform duration-200 ${showDetails ? 'rotate-180' : ''}`}>
              ▼
            </span>
          </button>
          
          {showDetails && (
            <div className="space-y-2 animate-slide-up">
              {analysis.suggestions.map((suggestion, index) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 p-3 bg-amber-500/5 border border-amber-500/20 rounded-lg animate-fade-in"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <Lightbulb className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-gray-300 leading-relaxed">{suggestion}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Overall Score */}
      <div className="bg-gradient-to-r from-gray-900/50 to-gray-800/50 rounded-xl p-6 border border-gray-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h5 className="font-semibold text-gray-100 mb-2">Puntuación General</h5>
            <p className="text-sm text-gray-400">Basado en legibilidad, SEO y estructura</p>
          </div>
          <div className="text-right">
            {(() => {
              const overallScore = Math.round((analysis.readability + (analysis.seoScore || 70)) / 2);
              return (
                <div className={`flex items-center space-x-2 px-4 py-2 rounded-lg ${getScoreColor(overallScore)}`}>
                  {getScoreIcon(overallScore)}
                  <span className="text-2xl font-bold">{overallScore}%</span>
                </div>
              );
            })()}
          </div>
        </div>
      </div>
    </div>
  );
}