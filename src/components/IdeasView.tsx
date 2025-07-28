import React, { useState } from 'react';
import { Plus, Lightbulb, ExternalLink, Rss, Youtube, FileText, Clock, CheckCircle, Trash2, Eye } from 'lucide-react';
import { Idea, Project } from '../types';
import { IdeaDetailModal } from './IdeaDetailModal';

interface IdeasViewProps {
  ideas: Idea[];
  drafts: any[]; // Add drafts to show relationships
  activeProject: Project | null;
  onCreateIdea: (idea: Partial<Idea>) => void;
  onDeleteIdea: (ideaId: string) => void;
  onGenerateDraft: (idea: Idea) => void;
  isGeneratingDraft?: boolean;
}

export function IdeasView({ ideas, drafts, activeProject, onCreateIdea, onDeleteIdea, onGenerateDraft, isGeneratingDraft = false }: IdeasViewProps) {
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [ideaSource, setIdeaSource] = useState<'direct' | 'text' | 'url' | 'rss'>('direct');
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: '',
    sourceData: ''
  });

  // Get drafts for a specific idea
  const getDraftsForIdea = (ideaId: string) => {
    return drafts.filter(draft => draft.ideaId === ideaId);
  };

  const handleDeleteIdea = (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the idea detail modal
    if (window.confirm('¿Estás seguro de que quieres eliminar esta idea?')) {
      onDeleteIdea(ideaId);
    }
  };

  const handleViewDrafts = (ideaId: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening the idea detail modal
    // This could navigate to drafts view with filter, or open a modal
    // For now, we'll just log it - you can implement navigation logic
    console.log('View drafts for idea:', ideaId);
  };
  const handleCreateIdea = () => {
    if (newIdea.title.trim() && activeProject) {
      onCreateIdea({
        ...newIdea,
        projectId: activeProject.id,
        source: ideaSource,
        status: 'captured',
        sourceData: newIdea.sourceData || undefined
      });
      setShowNewIdeaForm(false);
      setNewIdea({ title: '', description: '', category: '', sourceData: '' });
    }
  };

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'url': return <ExternalLink className="w-4 h-4" />;
      case 'rss': return <Rss className="w-4 h-4" />;
      case 'youtube': return <Youtube className="w-4 h-4" />;
      case 'text': return <FileText className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'in-progress': return <Clock className="w-4 h-4 text-amber-400" />;
      default: return <Lightbulb className="w-4 h-4 text-gray-500" />;
    }
  };

  if (!activeProject) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <Lightbulb className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-2xl font-semibold serif text-gray-200 mb-4">Selecciona un proyecto</h3>
        <p className="text-gray-400 leading-relaxed">Elige un proyecto para comenzar a capturar y desarrollar ideas</p>
      </div>
    );
  }

  const projectIdeas = ideas.filter(idea => idea.projectId === activeProject.id);

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold serif text-gray-100 mb-3">Ideas & Inspiración</h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              Captura y desarrolla ideas desde múltiples fuentes. La génesis de todo gran contenido.
            </p>
          </div>
          <button
            onClick={() => setShowNewIdeaForm(true)}
            className="bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-all duration-200 flex items-center space-x-3 font-semibold hover-lift animate-scale-in"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Idea</span>
          </button>
        </div>

        {/* New Idea Form */}
        {showNewIdeaForm && (
          <div className="glass-effect rounded-xl p-8 mb-8 animate-slide-up border nyt-border">
            <h3 className="text-xl font-semibold serif text-gray-100 mb-6">Capturar Nueva Idea</h3>
            
            {/* Source Selection */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-300 mb-4">
                Fuente de Inspiración
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {[
                  { id: 'direct', label: 'Directa', icon: Lightbulb },
                  { id: 'text', label: 'Texto', icon: FileText },
                  { id: 'url', label: 'URL', icon: ExternalLink },
                  { id: 'rss', label: 'RSS', icon: Rss }
                ].map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setIdeaSource(id as any)}
                    className={`flex items-center space-x-3 px-4 py-3 rounded-lg border transition-all duration-200 ${
                      ideaSource === id
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-gray-800/30 border-gray-700/50 text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Source Data Input */}
            {(ideaSource === 'text' || ideaSource === 'url') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {ideaSource === 'url' ? 'URL del artículo' : 'Texto a analizar'}
                </label>
                {ideaSource === 'text' ? (
                  <textarea
                    value={newIdea.sourceData}
                    onChange={(e) => setNewIdea({ ...newIdea, sourceData: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                    rows={4}
                    placeholder="Pega aquí el texto que quieres analizar..."
                  />
                ) : (
                  <input
                    type="url"
                    value={newIdea.sourceData}
                    onChange={(e) => setNewIdea({ ...newIdea, sourceData: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                    placeholder="https://ejemplo.com/articulo"
                  />
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Título de la Idea
                </label>
                <input
                  type="text"
                  value={newIdea.title}
                  onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  placeholder="Ej. El futuro del trabajo remoto"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Categoría
                </label>
                <input
                  type="text"
                  value={newIdea.category}
                  onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  placeholder="Ej. Tendencias, Tecnología, Análisis"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Descripción
                </label>
                <textarea
                  value={newIdea.description}
                  onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  rows={4}
                  placeholder="Describe la idea y el ángulo que quieres explorar..."
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowNewIdeaForm(false)}
                className="px-6 py-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateIdea}
                disabled={!newIdea.title.trim()}
                className="bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-all duration-200 font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500"
              >
                Capturar Idea
              </button>
            </div>
          </div>
        )}

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectIdeas.map((idea, index) => {
              const ideaDrafts = getDraftsForIdea(idea.id);
              const hasDrafts = ideaDrafts.length > 0;
              
              return (
            <div
              key={idea.id}
              className="glass-effect rounded-xl p-6 hover:bg-gray-800/40 transition-all duration-300 cursor-pointer group hover-lift border nyt-border animate-fade-in relative"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedIdea(idea)}
            >
              <div className="flex items-start justify-between mb-4 relative">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-amber-500/10 transition-colors duration-200">
                    {getSourceIcon(idea.source)}
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {idea.source}
                  </span>
                </div>
                <div className="flex items-center space-x-2 relative">
                  {hasDrafts && (
                    <div className="flex items-center space-x-1 bg-green-500/10 text-green-400 px-2 py-1 rounded-full border border-green-500/20">
                      <FileText className="w-3 h-3" />
                      <span className="text-xs font-medium">{ideaDrafts.length}</span>
                    </div>
                  )}
                  <div className="transition-transform duration-200 group-hover:scale-110">
                  {getStatusIcon(idea.status)}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold serif text-gray-100 group-hover:text-amber-400 transition-colors duration-200 mb-3 leading-tight">
                {idea.title}
              </h3>
              
              <p className="text-gray-400 text-sm mb-4 line-clamp-3 leading-relaxed">
                {idea.description}
              </p>

              <div className="flex items-center justify-between relative">
                <span className="bg-gray-800/50 text-gray-300 px-3 py-1 rounded-full text-xs font-medium">
                  {idea.category}
                </span>
                <div className="flex items-center space-x-2">
                  {/* Action buttons - appear on hover to the left of the date */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-200">
                    {hasDrafts && (
                      <button
                        onClick={(e) => handleViewDrafts(idea.id, e)}
                        className="p-1.5 bg-blue-500/10 text-blue-400 rounded-md hover:bg-blue-500/20 transition-all duration-200 hover:scale-110"
                        title={`Ver ${ideaDrafts.length} borrador(es)`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteIdea(idea.id, e)}
                      className="p-1.5 bg-red-500/10 text-red-400 rounded-md hover:bg-red-500/20 transition-all duration-200 hover:scale-110"
                      title="Eliminar idea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500">
                    {idea.createdAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
              );
            })}
        </div>

        {projectIdeas.length === 0 && !showNewIdeaForm && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lightbulb className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold serif text-gray-200 mb-4">No hay ideas capturadas</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Comienza capturando ideas desde diferentes fuentes de inspiración para alimentar tu creatividad
            </p>
            <button
              onClick={() => setShowNewIdeaForm(true)}
              className="bg-amber-500 text-gray-900 px-8 py-4 rounded-lg hover:bg-amber-400 transition-all duration-200 font-semibold hover-lift"
            >
              Capturar Primera Idea
            </button>
          </div>
        )}
      </div>

      {/* Idea Detail Modal */}
      {selectedIdea && activeProject && (
        <IdeaDetailModal
          idea={selectedIdea}
          project={activeProject}
          isOpen={!!selectedIdea}
          onClose={() => setSelectedIdea(null)}
          onGenerateDraft={onGenerateDraft}
          isGenerating={isGeneratingDraft}
        />
      )}
    </div>
  );
}