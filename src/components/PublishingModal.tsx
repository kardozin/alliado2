import React, { useState } from 'react';
import { 
  X, 
  Send, 
  Calendar, 
  Clock, 
  Globe, 
  Instagram, 
  Twitter, 
  Linkedin, 
  Facebook,
  Youtube,
  CheckCircle,
  AlertTriangle,
  Loader,
  Eye,
  Settings
} from 'lucide-react';
import { Draft, Project, Publication } from '../types';

interface PublishingModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: Draft;
  project: Project;
  onPublish: (publicationData: Omit<Publication, 'id'>) => void;
}

export function PublishingModal({ isOpen, onClose, draft, project, onPublish }: PublishingModalProps) {
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [isScheduled, setIsScheduled] = useState(false);
  const [customizations, setCustomizations] = useState<Record<string, string>>({});
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishingStatus, setPublishingStatus] = useState<Record<string, 'pending' | 'success' | 'error'>>({});

  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'blue',
      maxLength: 3000,
      features: ['text', 'images', 'links'],
      connected: true
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'sky',
      maxLength: 280,
      features: ['text', 'images', 'threads'],
      connected: true
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'pink',
      maxLength: 2200,
      features: ['images', 'stories', 'reels'],
      connected: false
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'blue',
      maxLength: 63206,
      features: ['text', 'images', 'videos'],
      connected: false
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'red',
      maxLength: 5000,
      features: ['videos', 'community'],
      connected: false
    }
  ];

  const handlePlatformToggle = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform?.connected) return;

    setSelectedPlatforms(prev => 
      prev.includes(platformId)
        ? prev.filter(id => id !== platformId)
        : [...prev, platformId]
    );
  };

  const handleCustomizationChange = (platformId: string, content: string) => {
    setCustomizations(prev => ({
      ...prev,
      [platformId]: content
    }));
  };

  const getContentForPlatform = (platformId: string) => {
    return customizations[platformId] || draft.content;
  };

  const validateContent = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    const content = getContentForPlatform(platformId);
    
    if (!platform) return { valid: false, message: 'Plataforma no encontrada' };
    
    const textLength = content.replace(/<[^>]*>/g, '').length; // Remove HTML tags for length calculation
    
    if (textLength > platform.maxLength) {
      return { 
        valid: false, 
        message: `Excede el límite de ${platform.maxLength} caracteres (${textLength})` 
      };
    }
    
    return { valid: true, message: `${textLength}/${platform.maxLength} caracteres` };
  };

  const handlePublish = async () => {
    if (selectedPlatforms.length === 0) return;

    setIsPublishing(true);
    setPublishingStatus({});

    for (const platformId of selectedPlatforms) {
      setPublishingStatus(prev => ({ ...prev, [platformId]: 'pending' }));
      
      try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
        
        // Simulate success/failure (90% success rate)
        const success = Math.random() > 0.1;
        
        if (success) {
          const publicationData: Omit<Publication, 'id'> = {
            projectId: project.id,
            title: draft.title,
            content: getContentForPlatform(platformId),
            platform: platforms.find(p => p.id === platformId)?.name || platformId,
            publishedAt: isScheduled && scheduledDate && scheduledTime 
              ? new Date(`${scheduledDate}T${scheduledTime}`)
              : new Date(),
            analysis: draft.analysis || {
              tone: 'Profesional',
              emotion: 'Neutral',
              readability: 75,
              keyThemes: ['Contenido']
            },
            performance: {
              views: Math.floor(Math.random() * 1000) + 100,
              engagement: Math.floor(Math.random() * 50) + 10,
              shares: Math.floor(Math.random() * 20) + 2
            }
          };
          
          onPublish(publicationData);
          setPublishingStatus(prev => ({ ...prev, [platformId]: 'success' }));
        } else {
          setPublishingStatus(prev => ({ ...prev, [platformId]: 'error' }));
        }
      } catch (error) {
        setPublishingStatus(prev => ({ ...prev, [platformId]: 'error' }));
      }
    }

    setIsPublishing(false);
    
    // Close modal after successful publishing
    setTimeout(() => {
      if (Object.values(publishingStatus).some(status => status === 'success')) {
        onClose();
      }
    }, 2000);
  };

  const getPlatformIcon = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return Globe;
    return platform.icon;
  };

  const getPlatformColor = (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    return platform?.color || 'gray';
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-gray-950 border border-gray-800/60 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-6 border-b border-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold serif text-gray-100">Publicar Contenido</h2>
                <p className="text-sm text-gray-400 mt-1">{draft.title}</p>
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
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-8">
              {/* Platform Selection */}
              <div>
                <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Seleccionar Plataformas</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {platforms.map((platform, index) => {
                    const Icon = platform.icon;
                    const isSelected = selectedPlatforms.includes(platform.id);
                    const isConnected = platform.connected;
                    
                    return (
                      <div
                        key={platform.id}
                        className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer animate-fade-in ${
                          !isConnected
                            ? 'bg-gray-900/20 border-gray-800/30 opacity-50 cursor-not-allowed'
                            : isSelected
                            ? `bg-${platform.color}-500/10 border-${platform.color}-500/30`
                            : 'bg-gray-900/30 border-gray-700/50 hover:bg-gray-800/40'
                        }`}
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => handlePlatformToggle(platform.id)}
                      >
                        <div className="flex items-center space-x-3 mb-3">
                          <div className={`p-2 rounded-lg bg-${platform.color}-500/10`}>
                            <Icon className={`w-5 h-5 text-${platform.color}-400`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-100">{platform.name}</h4>
                            <p className="text-xs text-gray-400">
                              {isConnected ? 'Conectado' : 'No conectado'}
                            </p>
                          </div>
                          {isConnected && (
                            <div className={`w-5 h-5 rounded border-2 transition-all duration-200 ${
                              isSelected 
                                ? `bg-${platform.color}-500 border-${platform.color}-500` 
                                : 'border-gray-600'
                            }`}>
                              {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                            </div>
                          )}
                        </div>
                        
                        <div className="text-xs text-gray-500">
                          <p>Límite: {platform.maxLength.toLocaleString()} caracteres</p>
                          <p>Funciones: {platform.features.join(', ')}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Scheduling */}
              <div>
                <div className="flex items-center space-x-3 mb-4">
                  <h3 className="text-lg font-semibold serif text-gray-100">Programación</h3>
                  <button
                    onClick={() => setIsScheduled(!isScheduled)}
                    className={`flex items-center space-x-2 px-3 py-1 rounded-lg border transition-all duration-200 ${
                      isScheduled
                        ? 'bg-amber-500/10 border-amber-500/30 text-amber-400'
                        : 'bg-gray-900/30 border-gray-700/50 text-gray-400 hover:text-gray-200'
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Programar</span>
                  </button>
                </div>

                {isScheduled && (
                  <div className="grid grid-cols-2 gap-4 animate-slide-up">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Fecha
                      </label>
                      <input
                        type="date"
                        value={scheduledDate}
                        onChange={(e) => setScheduledDate(e.target.value)}
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Hora
                      </label>
                      <input
                        type="time"
                        value={scheduledTime}
                        onChange={(e) => setScheduledTime(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Platform Customizations */}
              {selectedPlatforms.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Personalizar por Plataforma</h3>
                  <div className="space-y-4">
                    {selectedPlatforms.map((platformId, index) => {
                      const platform = platforms.find(p => p.id === platformId);
                      const Icon = platform?.icon || Globe;
                      const validation = validateContent(platformId);
                      
                      return (
                        <div 
                          key={platformId} 
                          className="bg-gray-900/30 rounded-xl p-4 border border-gray-800/40 animate-fade-in"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <Icon className={`w-5 h-5 text-${platform?.color}-400`} />
                            <h4 className="font-semibold text-gray-100">{platform?.name}</h4>
                            <div className={`text-xs px-2 py-1 rounded-full ${
                              validation.valid 
                                ? 'bg-green-500/10 text-green-400' 
                                : 'bg-red-500/10 text-red-400'
                            }`}>
                              {validation.message}
                            </div>
                          </div>
                          
                          <textarea
                            value={getContentForPlatform(platformId)}
                            onChange={(e) => handleCustomizationChange(platformId, e.target.value)}
                            className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                            rows={4}
                            placeholder={`Personaliza el contenido para ${platform?.name}...`}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Publishing Status */}
              {isPublishing && (
                <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800/40 animate-slide-up">
                  <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Estado de Publicación</h3>
                  <div className="space-y-3">
                    {selectedPlatforms.map(platformId => {
                      const platform = platforms.find(p => p.id === platformId);
                      const Icon = platform?.icon || Globe;
                      const status = publishingStatus[platformId];
                      
                      return (
                        <div key={platformId} className="flex items-center space-x-3">
                          <Icon className={`w-5 h-5 text-${platform?.color}-400`} />
                          <span className="flex-1 text-gray-200">{platform?.name}</span>
                          <div className="flex items-center space-x-2">
                            {status === 'pending' && (
                              <>
                                <Loader className="w-4 h-4 animate-spin text-amber-400" />
                                <span className="text-sm text-amber-400">Publicando...</span>
                              </>
                            )}
                            {status === 'success' && (
                              <>
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-sm text-green-400">Publicado</span>
                              </>
                            )}
                            {status === 'error' && (
                              <>
                                <AlertTriangle className="w-4 h-4 text-red-400" />
                                <span className="text-sm text-red-400">Error</span>
                              </>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800/60 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              {selectedPlatforms.length} plataforma(s) seleccionada(s)
              {isScheduled && scheduledDate && scheduledTime && (
                <span className="ml-2">• Programado para {scheduledDate} a las {scheduledTime}</span>
              )}
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handlePublish}
                disabled={selectedPlatforms.length === 0 || isPublishing}
                className="bg-gradient-to-r from-green-600 to-green-500 text-white px-8 py-3 rounded-lg hover:from-green-500 hover:to-green-400 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 hover-lift"
              >
                {isPublishing ? (
                  <>
                    <Loader className="w-5 h-5 animate-spin" />
                    <span>Publicando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>{isScheduled ? 'Programar Publicación' : 'Publicar Ahora'}</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}