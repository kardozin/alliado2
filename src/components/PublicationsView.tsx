import React, { useState } from 'react';
import { Send, BarChart, Calendar, ExternalLink, Filter, TrendingUp, Globe } from 'lucide-react';
import { Publication, Project } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { PlatformAdaptationModal } from './PlatformAdaptationModal';

interface PublicationsViewProps {
  publications: Publication[];
  activeProject: Project | null;
  onCreateDraft?: (draftData: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCreatePublication?: (publicationData: Omit<Publication, 'id'>) => void;
}

export function PublicationsView({ 
  publications, 
  activeProject, 
  onCreateDraft, 
  onCreatePublication 
}: PublicationsViewProps) {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [showAdaptationModal, setShowAdaptationModal] = useState(false);

  const onSaveAdaptationAsDraft = async (draftData: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (onCreateDraft) {
      await onCreateDraft(draftData);
    }
  };

  const onSaveAdaptationAsPublication = async (publicationData: Omit<Publication, 'id'>) => {
    if (onCreatePublication) {
      await onCreatePublication(publicationData);
    }
  };

  if (!activeProject) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Send className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-2xl font-semibold serif text-gray-200 mb-4">Selecciona un proyecto</h3>
        <p className="text-gray-400 leading-relaxed">Elige un proyecto para ver las publicaciones</p>
      </div>
    );
  }

  const projectPublications = publications.filter(pub => pub.projectId === activeProject.id);
  const filteredPublications = filterPlatform === 'all' 
    ? projectPublications 
    : projectPublications.filter(pub => pub.platform === filterPlatform);

  const platforms = [...new Set(projectPublications.map(pub => pub.platform))];

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold serif text-gray-100 mb-3">Archivo Editorial</h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              Tu biblioteca inteligente de contenido publicado. Cada pieza cuenta una historia.
            </p>
          </div>
          
          {/* Filters and Actions */}
          <div className="flex items-center space-x-4 animate-scale-in">
            <Filter className="w-4 h-4 text-gray-500" />
            <select
              value={filterPlatform}
              onChange={(e) => setFilterPlatform(e.target.value)}
              className="px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
            >
              <option value="all">Todas las plataformas</option>
              {platforms.map(platform => (
                <option key={platform} value={platform}>{platform}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Publications List */}
          <div className="lg:col-span-1 space-y-4 lg:max-w-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-300 serif">Publicaciones</h2>
            </div>
            {filteredPublications.map((publication, index) => (
              <div
                key={publication.id}
                className={`card-hover rounded-xl p-5 group animate-fade-in ${
                  selectedPublication?.id === publication.id
                    ? 'border-gray-600/60 bg-gray-800/30'
                    : ''
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedPublication(publication)}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-100 text-sm line-clamp-2 leading-tight group-hover:text-white transition-colors duration-300">
                    {publication.title}
                  </h3>
                  <span className="status-badge status-captured">
                    {publication.platform}
                  </span>
                </div>
                
                <div className="flex items-center space-x-4 text-xs text-gray-500 mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>{publication.publishedAt.toLocaleDateString()}</span>
                  </div>
                  {publication.performance && (
                    <div className="flex items-center space-x-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{publication.performance.views.toLocaleString()} vistas</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="status-badge status-captured group-hover:bg-gray-700/50 group-hover:text-gray-200 transition-colors duration-300">
                      {publication.analysis.tone}
                    </span>
                    <span className="status-badge status-progress group-hover:bg-gray-600/50 group-hover:text-gray-100 transition-colors duration-300">
                      {publication.analysis.emotion}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {filteredPublications.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <Send className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm mb-2">No hay publicaciones</p>
                <p className="text-gray-500 text-xs leading-relaxed">Finaliza borradores para crear publicaciones</p>
              </div>
            )}
          </div>

          {/* Publication Detail */}
          <div className="lg:col-span-2 lg:max-w-none">
            {selectedPublication ? (
              <div className="glass-effect rounded-xl border nyt-border min-h-[80vh] flex flex-col animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b nyt-border">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold serif text-gray-100 mb-3 leading-tight">{selectedPublication.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className="status-badge status-captured">
                          {selectedPublication.platform}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{selectedPublication.publishedAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                    <button className="p-3 text-gray-400 hover:text-amber-400 transition-all duration-200 hover:bg-gray-800/50 rounded-lg hover:scale-105">
                      <ExternalLink className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Performance Metrics */}
                  {selectedPublication.performance && (
                    <div className="grid grid-cols-3 gap-6 bg-gray-900/30 rounded-xl p-6 animate-slide-up">
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-100 mb-1">{selectedPublication.performance.views.toLocaleString()}</p>
                        <p className="text-sm text-gray-400 font-medium">Vistas</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-100 mb-1">{selectedPublication.performance.engagement}</p>
                        <p className="text-sm text-gray-400 font-medium">Interacciones</p>
                      </div>
                      <div className="text-center">
                        <p className="text-3xl font-bold text-gray-100 mb-1">{selectedPublication.performance.shares}</p>
                        <p className="text-sm text-gray-400 font-medium">Compartidos</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto max-w-4xl">
                  <RichTextEditor
                    content={selectedPublication.content}
                    onChange={() => {}} // Read-only mode
                    readOnly={true}
                    className="border-0"
                  />
                </div>

                {/* Analysis */}
                <div className="p-6 border-t nyt-border bg-gray-900/20">
                  <div className="grid grid-cols-3 gap-6 bg-gray-900/30 rounded-xl p-6 animate-slide-up mb-6">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-100 mb-1">{selectedPublication.analysis.readability || 0}%</p>
                      <p className="text-sm text-gray-400 font-medium">Legibilidad</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-100 mb-1">{selectedPublication.analysis.seoScore || 0}%</p>
                      <p className="text-sm text-gray-400 font-medium">SEO Score</p>
                    </div>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-100 mb-1">{selectedPublication.analysis.voiceConsistency?.score || 0}%</p>
                      <p className="text-sm text-gray-400 font-medium">Consistencia</p>
                    </div>
                  </div>
                  <h4 className="font-semibold serif text-gray-100 mb-4 text-lg">Análisis de Contenido</h4>
                  <div className="grid grid-cols-2 gap-6 mb-6">
                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">Tono</label>
                      <p className="text-gray-100 font-medium">{selectedPublication.analysis.tone}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-400 mb-2 block">Emoción</label>
                      <p className="text-gray-100 font-medium">{selectedPublication.analysis.emotion}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-3 block">Temas Clave</label>
                    <div className="flex flex-wrap gap-2">
                      {selectedPublication.analysis.keyThemes.map((theme, index) => (
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
                </div>
              </div>
            ) : (
              <div className="glass-effect rounded-xl border-2 border-dashed border-gray-700/50 h-full flex items-center justify-center animate-fade-in">
                <div className="text-center">
                  <Send className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg serif">Selecciona una publicación para ver detalles</p>
                  <p className="text-gray-500 text-sm mt-2">Explora tu archivo editorial</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Platform Adaptation Modal */}
      {selectedPublication && activeProject && (
        <PlatformAdaptationModal
          isOpen={showAdaptationModal}
          onClose={() => setShowAdaptationModal(false)}
          draft={{
            id: selectedPublication.id,
            ideaId: selectedPublication.ideaId || '', // Mantener conexión con idea si existe
            projectId: selectedPublication.projectId,
            title: selectedPublication.title,
            content: selectedPublication.content,
            version: 1,
            analysis: selectedPublication.analysis,
            createdAt: selectedPublication.publishedAt,
            updatedAt: selectedPublication.publishedAt
          }}
          project={activeProject}
          onSaveAsDraft={onSaveAdaptationAsDraft}
          onSaveAsPublication={onSaveAdaptationAsPublication}
        />
      )}
    </div>
  );
}