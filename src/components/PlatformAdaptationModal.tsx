import React, { useState } from 'react';
import { 
  X, 
  Zap, 
  Youtube, 
  Instagram, 
  Linkedin, 
  FileText,
  Video,
  Image,
  Type,
  Download,
  Copy,
  CheckCircle,
  Loader,
  Sparkles
} from 'lucide-react';
import { Draft, Project } from '../types';
import { generateContent } from '../lib/openai';

interface PlatformAdaptationModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: Draft;
  project: Project;
}

interface PlatformConfig {
  id: string;
  name: string;
  icon: any;
  color: string;
  maxLength: number;
  description: string;
  adaptationPrompt: string;
}

export function PlatformAdaptationModal({ isOpen, onClose, draft, project }: PlatformAdaptationModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [adaptedContent, setAdaptedContent] = useState<string>('');
  const [isAdapting, setIsAdapting] = useState(false);
  const [adaptationComplete, setAdaptationComplete] = useState(false);

  const platforms: PlatformConfig[] = [
    {
      id: 'youtube',
      name: 'YouTube Video Script',
      icon: Youtube,
      color: 'red',
      maxLength: 5000,
      description: 'Convierte en un guión para video de YouTube con ganchos, estructura y llamadas a la acción',
      adaptationPrompt: 'Convierte este contenido en un guión completo para video de YouTube. Incluye: gancho inicial potente, estructura clara con momentos clave, transiciones naturales, llamadas a la acción, y sugerencias para elementos visuales. Mantén un tono conversacional y engaging.'
    },
    {
      id: 'instagram-post',
      name: 'Instagram Post',
      icon: Instagram,
      color: 'pink',
      maxLength: 2200,
      description: 'Adapta para post de Instagram con formato visual y hashtags relevantes',
      adaptationPrompt: 'Adapta este contenido para un post de Instagram. Hazlo visualmente atractivo, incluye emojis estratégicos, estructura en párrafos cortos, añade hashtags relevantes al final, y mantén un tono inspiracional y personal.'
    },
    {
      id: 'instagram-reel',
      name: 'Instagram Reel Script',
      icon: Video,
      color: 'purple',
      maxLength: 300,
      description: 'Crea un guión conciso para Reel con ganchos y momentos clave',
      adaptationPrompt: 'Convierte este contenido en un guión para Instagram Reel de 30-60 segundos. Incluye: gancho en los primeros 3 segundos, 3-5 puntos clave máximo, transiciones rápidas, texto overlay sugerido, y un final memorable. Sé muy conciso y dinámico.'
    },
    {
      id: 'linkedin',
      name: 'LinkedIn Post',
      icon: Linkedin,
      color: 'blue',
      maxLength: 3000,
      description: 'Optimiza para LinkedIn con tono profesional y networking',
      adaptationPrompt: 'Adapta este contenido para LinkedIn con un enfoque profesional. Incluye insights de la industria, experiencias personales relevantes, preguntas para generar engagement, y un tono que invite a la conversación profesional. Estructura en párrafos cortos para mejor legibilidad.'
    },
    {
      id: 'substack',
      name: 'Substack Newsletter',
      icon: FileText,
      color: 'orange',
      maxLength: 10000,
      description: 'Expande para newsletter largo con análisis profundo y secciones',
      adaptationPrompt: 'Expande este contenido para un newsletter de Substack. Incluye: introducción personal, análisis más profundo, ejemplos adicionales, secciones bien definidas, insights únicos, y una conclusión que invite a la reflexión. Mantén un tono editorial y autoritativo.'
    },
    {
      id: 'twitter-thread',
      name: 'Twitter Thread',
      icon: Type,
      color: 'sky',
      maxLength: 280,
      description: 'Divide en hilo de Twitter con tweets conectados y engagement',
      adaptationPrompt: 'Convierte este contenido en un hilo de Twitter. Divide en tweets de máximo 280 caracteres cada uno, numerados (1/n), con ganchos en cada tweet, emojis estratégicos, y un tweet final que invite a RT y seguimiento. Mantén coherencia narrativa entre tweets.'
    }
  ];

  const handleAdaptContent = async (platformId: string) => {
    const platform = platforms.find(p => p.id === platformId);
    if (!platform) return;

    setIsAdapting(true);
    setAdaptationComplete(false);
    
    try {
      const adaptedResult = await generateContent({
        idea: {
          title: `${draft.title} - Adaptado para ${platform.name}`,
          description: `${platform.adaptationPrompt}\n\nCONTENIDO ORIGINAL:\n${draft.content}`,
          category: 'Adaptación de Plataforma'
        },
        projectSettings: project.settings
      });

      setAdaptedContent(adaptedResult);
      setAdaptationComplete(true);
    } catch (error) {
      console.error('Error adapting content:', error);
    } finally {
      setIsAdapting(false);
    }
  };

  const copyToClipboard = async () => {
    try {
      // Remove HTML tags for clipboard
      const textContent = adaptedContent.replace(/<[^>]*>/g, '');
      await navigator.clipboard.writeText(textContent);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const downloadAsText = () => {
    const textContent = adaptedContent.replace(/<[^>]*>/g, '');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.title} - ${selectedPlatform}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
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
        <div className="bg-gray-950 border border-gray-800/60 rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-6 border-b border-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold serif text-gray-100 flex items-center space-x-3">
                  <Sparkles className="w-6 h-6 text-amber-400" />
                  <span>Adaptar para Plataformas</span>
                </h2>
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
          <div className="flex h-[70vh]">
            {/* Platform Selection */}
            <div className="w-1/3 p-6 border-r border-gray-800/60 overflow-y-auto">
              <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Selecciona Plataforma</h3>
              <div className="space-y-3">
                {platforms.map((platform, index) => {
                  const Icon = platform.icon;
                  const isSelected = selectedPlatform === platform.id;
                  
                  return (
                    <div
                      key={platform.id}
                      className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer animate-fade-in ${
                        isSelected
                          ? `bg-${platform.color}-500/10 border-${platform.color}-500/30`
                          : 'bg-gray-900/30 border-gray-700/50 hover:bg-gray-800/40'
                      }`}
                      style={{ animationDelay: `${index * 100}ms` }}
                      onClick={() => {
                        setSelectedPlatform(platform.id);
                        setAdaptedContent('');
                        setAdaptationComplete(false);
                      }}
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className={`p-2 rounded-lg bg-${platform.color}-500/10`}>
                          <Icon className={`w-5 h-5 text-${platform.color}-400`} />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-100 text-sm">{platform.name}</h4>
                          <p className="text-xs text-gray-400">
                            Límite: {platform.maxLength.toLocaleString()} caracteres
                          </p>
                        </div>
                      </div>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        {platform.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 flex flex-col">
              {selectedPlatform ? (
                <>
                  {/* Platform Header */}
                  <div className="p-6 border-b border-gray-800/60">
                    {(() => {
                      const platform = platforms.find(p => p.id === selectedPlatform);
                      const Icon = platform?.icon || Zap;
                      
                      return (
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <Icon className={`w-6 h-6 text-${platform?.color}-400`} />
                            <div>
                              <h3 className="text-lg font-semibold text-gray-100">{platform?.name}</h3>
                              <p className="text-sm text-gray-400">{platform?.description}</p>
                            </div>
                          </div>
                          <button
                            onClick={() => handleAdaptContent(selectedPlatform)}
                            disabled={isAdapting}
                            className={`bg-${platform?.color}-600 text-white px-6 py-3 rounded-lg hover:bg-${platform?.color}-500 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 hover-lift`}
                          >
                            {isAdapting ? (
                              <>
                                <Loader className="w-4 h-4 animate-spin" />
                                <span>Adaptando...</span>
                              </>
                            ) : (
                              <>
                                <Zap className="w-4 h-4" />
                                <span>Adaptar Contenido</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })()}
                  </div>

                  {/* Adapted Content */}
                  <div className="flex-1 p-6 overflow-y-auto">
                    {adaptationComplete ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <CheckCircle className="w-5 h-5 text-green-400" />
                            <span className="text-green-400 font-medium">Contenido Adaptado</span>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={copyToClipboard}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 text-gray-200 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                            >
                              <Copy className="w-4 h-4" />
                              <span>Copiar</span>
                            </button>
                            <button
                              onClick={downloadAsText}
                              className="flex items-center space-x-2 px-4 py-2 bg-gray-800/50 text-gray-200 rounded-lg hover:bg-gray-700/50 transition-all duration-200"
                            >
                              <Download className="w-4 h-4" />
                              <span>Descargar</span>
                            </button>
                          </div>
                        </div>
                        <div 
                          className="prose prose-invert max-w-none bg-gray-900/30 rounded-xl p-6 border border-gray-800/40"
                          dangerouslySetInnerHTML={{ __html: adaptedContent }}
                        />
                      </div>
                    ) : isAdapting ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Loader className="w-12 h-12 text-amber-400 animate-spin mx-auto mb-4" />
                          <p className="text-gray-300 text-lg font-medium">Adaptando contenido con IA...</p>
                          <p className="text-gray-500 text-sm mt-2">Esto puede tomar unos segundos</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Zap className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                          <p className="text-gray-400 text-lg">Haz clic en "Adaptar Contenido" para comenzar</p>
                          <p className="text-gray-500 text-sm mt-2">La IA adaptará tu borrador para esta plataforma</p>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center">
                    <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Selecciona una plataforma para adaptar tu contenido</p>
                    <p className="text-gray-500 text-sm mt-2">Cada plataforma tiene su propio estilo y formato óptimo</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800/60 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Contenido original: {draft.content.replace(/<[^>]*>/g, '').length} caracteres
            </div>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-800 text-gray-200 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </>
  );
}