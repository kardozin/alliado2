import React, { useState } from 'react';
import { Send, BarChart, Calendar, ExternalLink, Filter, TrendingUp, Settings, Linkedin, Twitter, Instagram, Facebook, Youtube, Globe } from 'lucide-react';
import { Publication, Project } from '../types';
import { RichTextEditor } from './RichTextEditor';
import { PlatformConnectionModal } from './PlatformConnectionModal';

interface PublicationsViewProps {
  publications: Publication[];
  activeProject: Project | null;
}

export function PublicationsView({ publications, activeProject }: PublicationsViewProps) {
  const [selectedPublication, setSelectedPublication] = useState<Publication | null>(null);
  const [filterPlatform, setFilterPlatform] = useState<string>('all');
  const [showConnectionModal, setShowConnectionModal] = useState(false);
  const [connectedPlatforms, setConnectedPlatforms] = useState<string[]>(['LinkedIn', 'Twitter/X']);

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

  const getPlatformColor = (platform: string) => {
    const colors: Record<string, string> = {
      'LinkedIn': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      'Blog': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Instagram': 'bg-pink-500/10 text-pink-400 border-pink-500/20',
      'Twitter': 'bg-sky-500/10 text-sky-400 border-sky-500/20',
    };
    return colors[platform] || 'bg-gray-500/10 text-gray-400 border-gray-500/20';
  };

  const getPlatformIcon = (platform: string) => {
    const icons: Record<string, any> = {
      'LinkedIn': Linkedin,
      'Twitter/X': Twitter,
      'Instagram': Instagram,
      'Facebook': Facebook,
      'YouTube': Youtube,
    };
    return icons[platform] || Globe;
  };

  const handleConnectPlatform = (platform: string, credentials: any) => {
    setConnectedPlatforms(prev => [...prev, platform]);
  };
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
            <button
              onClick={() => setShowConnectionModal(true)}
              className="flex items-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 font-medium hover-lift"
            >
              <Settings className="w-4 h-4" />
              <span>Conectar Plataformas</span>
            </button>
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
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-300 serif">Publicaciones</h2>
              <div className="flex items-center space-x-2">
                {connectedPlatforms.slice(0, 3).map((platform, index) => {
                  const Icon = getPlatformIcon(platform);
                  return (
                    <div 
                      key={platform}
                      className="w-6 h-6 bg-gray-800/50 rounded-full flex items-center justify-center animate-fade-in"
                      style={{ animationDelay: `${index * 100}ms` }}
                      title={`Conectado: ${platform}`}
                    >
                      <Icon className="w-3 h-3 text-gray-400" />
                    </div>
                  );
                })}
                {connectedPlatforms.length > 3 && (
                  <div className="w-6 h-6 bg-gray-800/50 rounded-full flex items-center justify-center text-xs text-gray-400">
                    +{connectedPlatforms.length - 3}
                  </div>
                )}
              </div>
            </div>
            {filteredPublications.map((publication, index) => (
              <div
                key={publication.id}
                className={`glass-effect rounded-xl p-5 cursor-pointer transition-all duration-300 border group hover-lift animate-fade-in ${
                  selectedPublication?.id === publication.id
                    ? 'border-amber-500/30 bg-amber-500/5'
                    : 'nyt-border hover:bg-gray-800/40'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => setSelectedPublication(publication)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2 mb-2">
                    {(() => {
                      const Icon = getPlatformIcon(publication.platform);
                      return <Icon className="w-4 h-4 text-gray-400" />;
                    })()}
                  <h3 className="font-semibold text-gray-100 text-sm line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors duration-200">
                    {publication.title}
                  </h3>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium border ${getPlatformColor(publication.platform)}`}>
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
                    <span className="bg-gray-800/50 text-gray-300 px-2 py-1 rounded-full text-xs font-medium">
                      {publication.analysis.tone}
                    </span>
                    <span className="bg-purple-500/10 text-purple-400 px-2 py-1 rounded-full text-xs font-medium border border-purple-500/20">
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
          <div className="lg:col-span-2">
            {selectedPublication ? (
              <div className="glass-effect rounded-xl border nyt-border h-full flex flex-col animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b nyt-border">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold serif text-gray-100 mb-3 leading-tight">{selectedPublication.title}</h2>
                      <div className="flex items-center space-x-4 text-sm text-gray-400">
                        <span className={`px-3 py-1 rounded-full font-medium border ${getPlatformColor(selectedPublication.platform)}`}>
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
                <div className="flex-1 p-6 overflow-y-auto">
                  <RichTextEditor
                    content={selectedPublication.content}
                    onChange={() => {}} // Read-only mode
                    readOnly={true}
                    className="border-0"
                  />
                </div>

                {/* Analysis */}
                <div className="p-6 border-t nyt-border bg-gray-900/20">
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
                          className="bg-blue-500/10 text-blue-400 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20 animate-fade-in"
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

      {/* Platform Connection Modal */}
      <PlatformConnectionModal
        isOpen={showConnectionModal}
        onClose={() => setShowConnectionModal(false)}
        onConnect={handleConnectPlatform}
      />
    </div>
  );
}