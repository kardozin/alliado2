import React from 'react';
import { 
  X, 
  Lightbulb, 
  ExternalLink, 
  FileText, 
  Rss, 
  Youtube, 
  Calendar,
  Tag,
  Zap,
  ArrowRight,
  Loader
} from 'lucide-react';
import { Idea, Project } from '../types';
import { EditableTitle } from './EditableTitle';

interface IdeaDetailModalProps {
  idea: Idea;
  project: Project;
  isOpen: boolean;
  onClose: () => void;
  onGenerateDraft: (idea: Idea) => void;
  isGenerating?: boolean;
}

export function IdeaDetailModal({ idea, project, isOpen, onClose, onGenerateDraft, isGenerating = false }: IdeaDetailModalProps) {
  if (!isOpen) return null;

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'url': return <ExternalLink className="w-5 h-5" />;
      case 'rss': return <Rss className="w-5 h-5" />;
      case 'youtube': return <Youtube className="w-5 h-5" />;
      case 'text': return <FileText className="w-5 h-5" />;
      default: return <Lightbulb className="w-5 h-5" />;
    }
  };

  const getSourceLabel = (source: string) => {
    switch (source) {
      case 'url': return 'Desde URL';
      case 'rss': return 'Feed RSS';
      case 'youtube': return 'YouTube';
      case 'text': return 'Texto Analizado';
      default: return 'Idea Directa';
    }
  };

  const getSourceColor = (source: string) => {
    switch (source) {
      case 'url': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'rss': return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'youtube': return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'text': return 'bg-purple-500/10 text-purple-400 border-purple-500/20';
      default: return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
  };

  const handleGenerateDraft = () => {
    onGenerateDraft(idea);
    // No cerramos el modal inmediatamente para mostrar el estado de carga
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-950 border border-gray-800/60 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-8 border-b border-gray-800/60">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-xl border ${getSourceColor(idea.source)}`}>
                    {getSourceIcon(idea.source)}
                  </div>
                  <div>
                    <span className="text-sm font-medium px-3 py-1 rounded-full border bg-gray-800/50 text-gray-300 border-gray-700/40">
                      {getSourceLabel(idea.source)}
                    </span>
                    <p className="text-xs text-gray-500 mt-1">
                      Capturada el {idea.createdAt.toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <h2 className="text-3xl font-bold serif text-gray-100 leading-tight">
                  <EditableTitle
                    value={idea.title}
                    onSave={(newTitle) => onUpdateIdea && onUpdateIdea(idea.id, { title: newTitle })}
                    className="text-3xl font-bold serif text-gray-100 leading-tight"
                  />
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/50 rounded-lg hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-8 overflow-y-auto max-h-[60vh]">
            {/* Project Context */}
            <div className="bg-gray-900/30 rounded-xl p-6 mb-8 border border-gray-800/40">
              <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Contexto del Proyecto</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <label className="text-gray-400 font-medium">Proyecto:</label>
                  <p className="text-gray-200 mt-1">{project.name}</p>
                </div>
                <div>
                  <label className="text-gray-400 font-medium">Audiencia:</label>
                  <p className="text-gray-200 mt-1">{project.settings.targetAudience || 'No definida'}</p>
                </div>
                <div>
                  <label className="text-gray-400 font-medium">Tipo de Contenido:</label>
                  <p className="text-gray-200 mt-1">{project.settings.contentType || 'No definido'}</p>
                </div>
                <div>
                  <label className="text-gray-400 font-medium">Tono:</label>
                  <p className="text-gray-200 mt-1">{project.settings.tone || 'No definido'}</p>
                </div>
              </div>
            </div>

            {/* Idea Details */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Descripción de la Idea</h3>
                <div className="bg-gray-900/20 rounded-xl p-6 border border-gray-800/40">
                  <p className="text-gray-200 leading-relaxed text-lg">
                    {idea.description}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Tag className="w-4 h-4 text-gray-400" />
                  <span className="text-sm font-medium text-gray-400">Categoría:</span>
                </div>
                <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                  {idea.category}
                </span>
              </div>

              {/* Source Data */}
              {idea.sourceData && (
                <div>
                  <h4 className="text-md font-semibold text-gray-100 mb-3">Fuente de Inspiración</h4>
                  <div className="bg-gray-900/20 rounded-xl p-4 border border-gray-800/40">
                    {idea.source === 'url' ? (
                      <a 
                        href={idea.sourceData} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-200 text-sm font-mono break-all"
                      >
                        {idea.sourceData}
                      </a>
                    ) : (
                      <p className="text-gray-300 text-sm leading-relaxed font-mono">
                        {idea.sourceData.length > 200 
                          ? `${idea.sourceData.substring(0, 200)}...` 
                          : idea.sourceData
                        }
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* AI Generation Preview */}
              <div className="bg-gradient-to-r from-amber-500/5 to-amber-600/5 rounded-xl p-6 border border-amber-500/20">
                <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-700/40">
                  <div className="flex items-center space-x-3 mb-4">
                    <Zap className="w-5 h-5 text-gray-300" />
                    <h4 className="text-md font-semibold text-gray-100">Generación con IA</h4>
                  </div>
                  <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    OpenAI GPT-4 utilizará esta idea junto con la configuración de tu proyecto para crear un borrador completo que incluya:
                  </p>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Estructura narrativa alineada con tu audiencia objetivo</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Tono y voz consistentes con las guías de estilo del proyecto</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Contenido original y relevante basado en la descripción de la idea</span>
                    </li>
                    <li className="flex items-center space-x-2">
                      <div className="w-1.5 h-1.5 bg-gray-400 rounded-full"></div>
                      <span>Análisis opcional de tono, emoción y optimización SEO (on-demand)</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-gray-800/60 flex justify-between items-center">
            <div className="flex items-center space-x-2 text-sm text-gray-400">
              <Calendar className="w-4 h-4" />
              <span>Idea capturada el {idea.createdAt.toLocaleDateString()}</span>
            </div>
            <button
              onClick={handleGenerateDraft}
              disabled={isGenerating}
              className="btn-primary px-8 py-4 rounded-xl text-lg flex items-center justify-center space-x-3"
            >
              {isGenerating ? (
                <>
                  <Loader className="w-5 h-5 animate-spin" />
                  <span>Generando con IA...</span>
                  <div className="w-5 h-5" />
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5" />
                  <span>Generar Borrador con IA</span>
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}