import React, { useState } from 'react';
import { Plus, Lightbulb, ExternalLink, Rss, Youtube, FileText, Clock, CheckCircle, Trash2, Eye, Send, Loader, Globe, Calendar, ArrowRight, Zap, RefreshCw } from 'lucide-react';
import { Idea, Project } from '../types';
import { IdeaDetailModal } from './IdeaDetailModal';
import { analyzeUrlContent, generateIdeasFromRss } from '../lib/contentAnalysis';

interface IdeasViewProps {
  ideas: Idea[];
  drafts: any[]; // Add drafts to show relationships
  publications: any[]; // Add publications to show relationships
  activeProject: Project | null;
  onCreateIdea: (idea: Partial<Idea>) => void;
  onDeleteIdea: (ideaId: string) => void;
  onGenerateDraft: (idea: Idea) => void;
  isGeneratingDraft?: boolean;
}

export function IdeasView({ 
  ideas, 
  drafts, 
  publications, 
  activeProject, 
  onCreateIdea, 
  onDeleteIdea, 
  onGenerateDraft, 
  isGeneratingDraft = false 
}: IdeasViewProps) {
  const [showNewIdeaForm, setShowNewIdeaForm] = useState(false);
  const [selectedIdea, setSelectedIdea] = useState<Idea | null>(null);
  const [ideaSource, setIdeaSource] = useState<'direct' | 'text' | 'url' | 'rss'>('direct');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [urlSuggestions, setUrlSuggestions] = useState<{title: string, description: string, category: string} | null>(null);
  const [rssFeeds, setRssFeeds] = useState<any[]>([]);
  const [selectedRssPost, setSelectedRssPost] = useState<any>(null);
  const [rssIdeasSuggestions, setRssIdeasSuggestions] = useState<any[]>([]);
  const [isLoadingRss, setIsLoadingRss] = useState(false);
  const [newIdea, setNewIdea] = useState({
    title: '',
    description: '',
    category: '',
    sourceData: ''
  });

  // Load RSS feeds when RSS source is selected
  React.useEffect(() => {
    if (ideaSource === 'rss' && activeProject?.settings.rssFeeds?.length > 0) {
      loadRssFeeds();
    }
  }, [ideaSource, activeProject]);

  const loadRssFeeds = async () => {
    if (!activeProject?.settings.rssFeeds?.length) return;
    
    setIsLoadingRss(true);
    try {
      // Simulate RSS feed loading - in a real app, you'd fetch from RSS feeds
      // For now, we'll create mock data based on the configured feeds
      const mockRssData = activeProject.settings.rssFeeds.map((feedUrl, index) => ({
        id: `feed-${index}`,
        feedUrl,
        feedName: feedUrl.includes('techcrunch') ? 'TechCrunch' : 
                  feedUrl.includes('producthunt') ? 'Product Hunt' :
                  feedUrl.includes('behance') ? 'Behance' : 'RSS Feed',
        posts: [
          {
            id: `post-${index}-1`,
            title: `Artículo de ejemplo ${index + 1}`,
            description: `Descripción del artículo de ejemplo que viene del feed RSS. Este contenido sería extraído del feed real.`,
            publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            url: `${feedUrl}/article-${index + 1}`
          },
          {
            id: `post-${index}-2`,
            title: `Otro artículo interesante ${index + 1}`,
            description: `Otra descripción de ejemplo que vendría del feed RSS configurado en el proyecto.`,
            publishedAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
            url: `${feedUrl}/article-${index + 2}`
          }
        ]
      }));
      
      setRssFeeds(mockRssData);
    } catch (error) {
      console.error('Error loading RSS feeds:', error);
    } finally {
      setIsLoadingRss(false);
    }
  };

  const handleAnalyzeUrl = async () => {
    if (!newIdea.sourceData.trim()) return;
    
    setIsAnalyzing(true);
    try {
      // Simulate URL analysis - in a real app, you'd extract content from the URL
      const suggestions = await analyzeUrlContent(newIdea.sourceData);
      setUrlSuggestions(suggestions);
      setNewIdea({
        ...newIdea,
        title: suggestions.title,
        description: suggestions.description,
        category: suggestions.category
      });
    } catch (error) {
      console.error('Error analyzing URL:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectRssPost = async (post: any) => {
    setSelectedRssPost(post);
    setRssIdeasSuggestions([]); // Reset suggestions when selecting a new post
  };

  const handleGenerateRssIdeas = async (post: any) => {
    setIsAnalyzing(true);
    try {
      const suggestions = await generateIdeasFromRss(post);
      setRssIdeasSuggestions(suggestions);
    } catch (error) {
      console.error('Error generating ideas from RSS:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCreateRssIdea = (suggestion: any) => {
    if (activeProject && selectedRssPost) {
      onCreateIdea({
        title: suggestion.title,
        description: suggestion.description,
        category: suggestion.category,
        projectId: activeProject.id,
        source: 'rss',
        status: 'captured',
        sourceData: `RSS: ${selectedRssPost.title}\n\nURL: ${selectedRssPost.url}\n\nContenido original: ${selectedRssPost.description}`
      });
      
      // Reset RSS state
      setSelectedRssPost(null);
      setRssIdeasSuggestions([]);
      setShowNewIdeaForm(false);
    }
  };

  const resetForm = () => {
    setNewIdea({ title: '', description: '', category: '', sourceData: '' });
    setUrlSuggestions(null);
    setSelectedRssPost(null);
    setRssIdeasSuggestions([]);
    setIdeaSource('direct');
  };

  const isFormValid = () => {
    switch (ideaSource) {
      case 'direct':
        return newIdea.description.trim().length > 0;
      case 'text':
        return newIdea.sourceData.trim().length > 0;
      case 'url':
        return newIdea.sourceData.trim().length > 0 && newIdea.sourceData.startsWith('http');
      case 'rss':
        return selectedRssPost !== null;
      default:
        return false;
    }
  };

  // Get drafts for a specific idea
  const getDraftsForIdea = (ideaId: string) => {
    return drafts.filter(draft => draft.ideaId === ideaId);
  };

  // Get publications for a specific idea (through drafts)
  const getPublicationsForIdea = (ideaId: string) => {
    const ideaDrafts = getDraftsForIdea(ideaId);
    return publications.filter(pub => 
      ideaDrafts.some(draft => draft.title === pub.title.split(' - ')[0]) ||
      pub.ideaId === ideaId
    );
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
    if (isFormValid() && activeProject) {
      const ideaData = {
        projectId: activeProject.id,
        source: ideaSource,
        status: 'captured' as const,
        title: newIdea.title.trim() || 'Idea sin título',
        description: newIdea.description.trim() || 'Descripción generada automáticamente',
        category: newIdea.category.trim() || 'General',
        sourceData: newIdea.sourceData || undefined
      };
      
      onCreateIdea({
        ...ideaData
      });
      setShowNewIdeaForm(false);
      resetForm();
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
        <p className="text-gray-400 leading-relaxed mb-6">Elige un proyecto para comenzar a capturar y desarrollar ideas</p>
        <button
          onClick={() => window.location.reload()}
          className="bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-all duration-200 font-semibold"
        >
          Recargar Página
        </button>
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
            className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center space-x-3 font-semibold hover-lift animate-scale-in"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Idea</span>
          </button>
        </div>

        {/* New Idea Form */}
        {showNewIdeaForm && (
          <div className="glass-effect rounded-xl p-8 mb-8 animate-slide-up border nyt-border max-w-4xl mx-auto">
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
                        ? 'bg-gray-800/50 border-gray-700/50 text-gray-100'
                        : 'bg-gray-800/30 border-gray-700/50 text-gray-400 hover:bg-gray-700/30 hover:text-gray-200'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="font-medium">{label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dynamic Content Based on Source */}
            {(ideaSource === 'text' || ideaSource === 'url') && (
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  {ideaSource === 'url' ? 'URL del artículo' : 'Texto a analizar'}
                </label>
                {ideaSource === 'text' ? (
                  <textarea
                    value={newIdea.sourceData}
                    onChange={(e) => setNewIdea({ ...newIdea, sourceData: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                    rows={4}
                    placeholder="Pega aquí el texto que quieres analizar..."
                  />
                ) : (
                  <input
                    type="url"
                    value={newIdea.sourceData}
                    onChange={(e) => setNewIdea({ ...newIdea, sourceData: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                    placeholder="https://ejemplo.com/articulo"
                  />
                )}
                {ideaSource === 'url' && newIdea.sourceData.trim() && (
                  <button
                    onClick={handleAnalyzeUrl}
                    disabled={isAnalyzing}
                    className="mt-3 px-4 py-2 bg-gray-700 text-gray-100 rounded-lg hover:bg-gray-600 transition-all duration-200 font-medium disabled:opacity-50 flex items-center space-x-2"
                  >
                    {isAnalyzing ? (
                      <Loader className="w-4 h-4 animate-spin" />
                    ) : (
                      <Globe className="w-4 h-4" />
                    )}
                    <span>{isAnalyzing ? 'Analizando...' : 'Analizar URL'}</span>
                  </button>
                )}
              </div>
            )}

            {/* RSS Feed Selection */}
            {ideaSource === 'rss' && (
              <div className="mb-6">
                {!selectedRssPost ? (
                  <div>
                    <h4 className="text-lg font-semibold text-gray-100 mb-4">Selecciona un Post de RSS</h4>
                    {isLoadingRss ? (
                      <div className="text-center py-8">
                        <Loader className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Cargando feeds RSS...</p>
                      </div>
                    ) : rssFeeds.length > 0 ? (
                      <div className="space-y-6">
                        {rssFeeds.map((feed) => (
                          <div key={feed.id} className="bg-gray-900/30 rounded-xl p-6 border border-gray-800/40">
                            <h5 className="font-semibold text-gray-100 mb-4 flex items-center space-x-2">
                              <Rss className="w-4 h-4 text-gray-400" />
                              <span>{feed.feedName}</span>
                            </h5>
                            <div className="space-y-3">
                              {feed.posts.map((post: any) => (
                                <div
                                  key={post.id}
                                  className="p-4 bg-gray-800/30 rounded-lg hover:bg-gray-700/40 transition-all duration-200 cursor-pointer group"
                                  onClick={() => handleSelectRssPost(post)}
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <h6 className="font-medium text-gray-100 group-hover:text-gray-200 transition-colors duration-200 mb-2">
                                        {post.title}
                                      </h6>
                                      <p className="text-sm text-gray-400 line-clamp-2 mb-2">
                                        {post.description}
                                      </p>
                                      <div className="flex items-center space-x-3 text-xs text-gray-500">
                                        <div className="flex items-center space-x-1">
                                          <Calendar className="w-3 h-3" />
                                          <span>{post.publishedAt.toLocaleDateString()}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                          <ExternalLink className="w-3 h-3" />
                                          <span>Ver original</span>
                                        </div>
                                      </div>
                                    </div>
                                    <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors duration-200" />
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 bg-gray-900/20 rounded-xl border border-gray-800/40">
                        <Rss className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400 mb-2">No hay feeds RSS configurados</p>
                        <p className="text-gray-500 text-sm">Configura feeds RSS en la configuración del proyecto</p>
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="text-lg font-semibold text-gray-100">Post Seleccionado</h4>
                      <button
                        onClick={() => {
                          setSelectedRssPost(null);
                          setRssIdeasSuggestions([]);
                        }}
                        className="text-gray-400 hover:text-gray-200 transition-colors duration-200"
                      >
                        ← Cambiar post
                      </button>
                    </div>
                    
                    <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800/40 mb-6">
                      <h5 className="font-semibold text-gray-100 mb-2">{selectedRssPost.title}</h5>
                      <p className="text-gray-300 text-sm mb-4">{selectedRssPost.description}</p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-3 h-3" />
                          <span>{selectedRssPost.publishedAt.toLocaleDateString()}</span>
                        </div>
                        <a 
                          href={selectedRssPost.url} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="flex items-center space-x-1 text-blue-400 hover:text-blue-300 transition-colors duration-200"
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Ver artículo original</span>
                        </a>
                      </div>
                    </div>

                    {isAnalyzing ? (
                      <div className="text-center py-8">
                        <Loader className="w-8 h-8 text-gray-400 animate-spin mx-auto mb-4" />
                        <p className="text-gray-400">Generando ideas basadas en este post...</p>
                      </div>
                    ) : rssIdeasSuggestions.length > 0 ? (
                      <div>
                        <h4 className="text-lg font-semibold text-gray-100 mb-4">Ideas Sugeridas por IA</h4>
                        <div className="space-y-4">
                          {rssIdeasSuggestions.map((suggestion, index) => (
                            <div
                              key={index}
                              className="p-4 bg-gray-800/30 rounded-xl border border-gray-700/40 hover:bg-gray-700/40 transition-all duration-200 cursor-pointer group"
                              onClick={() => handleCreateRssIdea(suggestion)}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <h6 className="font-semibold text-gray-100 group-hover:text-gray-200 transition-colors duration-200 mb-2">
                                    {suggestion.title}
                                  </h6>
                                  <p className="text-sm text-gray-300 mb-2">{suggestion.description}</p>
                                  <span className="text-xs bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full border border-gray-700/40">
                                    {suggestion.category}
                                  </span>
                                </div>
                                <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors duration-200" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between mb-6">
                        <h4 className="text-lg font-semibold text-gray-100">Leer Post Completo</h4>
                        <button
                          onClick={handleGenerateRssIdeas}
                          disabled={isAnalyzing}
                          className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        >
                          {isAnalyzing ? (
                            <>
                              <Loader className="w-4 h-4 animate-spin" />
                              <span>Generando...</span>
                            </>
                          ) : (
                            <>
                              <Lightbulb className="w-4 h-4" />
                              <span>Sugerir Ideas con IA</span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Form Fields - Only show for direct, text, and url (after analysis) */}
            {(ideaSource !== 'rss') && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Título de la Idea {ideaSource === 'direct' ? '(opcional)' : ''}
                  </label>
                  <input
                    type="text"
                    value={newIdea.title}
                    onChange={(e) => setNewIdea({ ...newIdea, title: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                    placeholder={ideaSource === 'direct' ? "Ej. El futuro del trabajo remoto" : "Se generará automáticamente"}
                    disabled={ideaSource === 'url' && isAnalyzing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Categoría {ideaSource === 'direct' ? '(opcional)' : ''}
                  </label>
                  <input
                    type="text"
                    value={newIdea.category}
                    onChange={(e) => setNewIdea({ ...newIdea, category: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                    placeholder={ideaSource === 'direct' ? "Ej. Tendencias, Tecnología" : "Se generará automáticamente"}
                    disabled={ideaSource === 'url' && isAnalyzing}
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-300 mb-3">
                    Descripción {ideaSource === 'direct' ? '(obligatorio)' : ideaSource === 'text' ? '(opcional)' : ''}
                  </label>
                  <textarea
                    value={newIdea.description}
                    onChange={(e) => setNewIdea({ ...newIdea, description: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                    rows={4}
                    placeholder={
                      ideaSource === 'direct' ? "Describe la idea y el ángulo que quieres explorar..." :
                      ideaSource === 'text' ? "Descripción adicional (opcional)" :
                      "Se generará automáticamente desde la URL"
                    }
                    disabled={ideaSource === 'url' && isAnalyzing}
                  />
                </div>
              </div>
            )}

            {/* URL Analysis Results */}
            {ideaSource === 'url' && urlSuggestions && (
              <div className="mb-6 p-4 bg-gray-800/30 border border-gray-700/40 rounded-xl">
                <h4 className="font-semibold text-gray-300 mb-3 flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>Análisis Completado</span>
                </h4>
                <div className="text-sm text-gray-300 space-y-2">
                  <p><strong>Título sugerido:</strong> {urlSuggestions.title}</p>
                  <p><strong>Categoría sugerida:</strong> {urlSuggestions.category}</p>
                  <p><strong>Descripción:</strong> {urlSuggestions.description}</p>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            {ideaSource !== 'rss' && (
              <div className="flex justify-end space-x-4 mt-8">
                <button
                  onClick={() => {
                    setShowNewIdeaForm(false);
                    resetForm();
                  }}
                  className="px-6 py-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCreateIdea}
                  disabled={!isFormValid() || isAnalyzing}
                  className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {isAnalyzing && <Loader className="w-4 h-4 animate-spin" />}
                  <span>Capturar Idea</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Ideas Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectIdeas.map((idea, index) => {
              const ideaDrafts = getDraftsForIdea(idea.id);
              const ideaPublications = getPublicationsForIdea(idea.id);
              const hasDrafts = ideaDrafts.length > 0;
              const hasPublications = ideaPublications.length > 0;
              
              return (
            <div
              key={idea.id}
              className="card-hover rounded-xl p-6 group animate-fade-in relative"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => setSelectedIdea(idea)}
            >
              <div className="flex items-start justify-between mb-4 relative">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-800/50 rounded-lg group-hover:bg-gray-700/50 transition-colors duration-300">
                    {getSourceIcon(idea.source)}
                  </div>
                  <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">
                    {idea.source}
                  </span>
                </div>
                <div className="flex items-center space-x-2 relative">
                  {hasDrafts && (
                    <div className="flex items-center space-x-1 bg-gray-700/50 text-gray-300 px-2 py-1 rounded-full border border-gray-600/40">
                      <FileText className="w-3 h-3" />
                      <span className="text-xs font-medium">{ideaDrafts.length}</span>
                    </div>
                  )}
                  {hasPublications && (
                    <div className="flex items-center space-x-1 bg-gray-600/50 text-gray-200 px-2 py-1 rounded-full border border-gray-500/40">
                      <Send className="w-3 h-3" />
                      <span className="text-xs font-medium">{ideaPublications.length}</span>
                    </div>
                  )}
                  <div className="transition-transform duration-300 group-hover:scale-110">
                  {getStatusIcon(idea.status)}
                  </div>
                </div>
              </div>

              <h3 className="text-lg font-semibold serif text-gray-100 group-hover:text-white transition-colors duration-300 mb-3 leading-tight">
                {idea.title}
              </h3>
              
              <p className="text-gray-400 group-hover:text-gray-300 text-sm mb-4 line-clamp-3 leading-relaxed transition-colors duration-300">
                {idea.description}
              </p>

              <div className="flex items-center justify-between relative">
                <span className="status-badge status-captured group-hover:bg-gray-700/50 group-hover:text-gray-200 transition-colors duration-300">
                  {idea.category}
                </span>
                <div className="flex items-center space-x-2">
                  {/* Action buttons - appear on hover to the left of the date */}
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    {(hasDrafts || hasPublications) && (
                      <button
                        onClick={(e) => handleViewDrafts(idea.id, e)}
                        className="btn-ghost p-1.5 rounded-md relative"
                        title={`Ver ${ideaDrafts.length} borrador(es) y ${ideaPublications.length} publicación(es)`}
                      >
                        <Eye className="w-3.5 h-3.5" />
                        {(hasDrafts || hasPublications) && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-gray-200 rounded-full flex items-center justify-center">
                            <span className="text-xs font-bold text-black">
                              {ideaDrafts.length + ideaPublications.length}
                            </span>
                          </div>
                        )}
                      </button>
                    )}
                    <button
                      onClick={(e) => handleDeleteIdea(idea.id, e)}
                      className="btn-ghost p-1.5 rounded-md hover:text-gray-300"
                      title="Eliminar idea"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors duration-300">
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
              className="bg-gray-200 text-black px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold hover-lift"
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