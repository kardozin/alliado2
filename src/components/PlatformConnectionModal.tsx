import React, { useState } from 'react';
import { 
  X, 
  Linkedin, 
  Twitter, 
  Instagram, 
  Facebook, 
  Youtube,
  Key,
  CheckCircle,
  AlertTriangle,
  ExternalLink,
  Shield,
  Zap
} from 'lucide-react';

interface PlatformConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (platform: string, credentials: any) => void;
}

export function PlatformConnectionModal({ isOpen, onClose, onConnect }: PlatformConnectionModalProps) {
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<Record<string, string>>({});
  const [isConnecting, setIsConnecting] = useState(false);

  const platforms = [
    {
      id: 'linkedin',
      name: 'LinkedIn',
      icon: Linkedin,
      color: 'blue',
      description: 'Publica artículos y posts profesionales',
      authType: 'oauth',
      fields: []
    },
    {
      id: 'twitter',
      name: 'Twitter/X',
      icon: Twitter,
      color: 'sky',
      description: 'Comparte tweets y hilos',
      authType: 'oauth',
      fields: []
    },
    {
      id: 'instagram',
      name: 'Instagram',
      icon: Instagram,
      color: 'pink',
      description: 'Publica fotos, stories y reels',
      authType: 'oauth',
      fields: []
    },
    {
      id: 'facebook',
      name: 'Facebook',
      icon: Facebook,
      color: 'blue',
      description: 'Gestiona páginas y posts',
      authType: 'oauth',
      fields: []
    },
    {
      id: 'youtube',
      name: 'YouTube',
      icon: Youtube,
      color: 'red',
      description: 'Publica videos y posts de comunidad',
      authType: 'oauth',
      fields: []
    }
  ];

  const handleConnect = async () => {
    if (!selectedPlatform) return;

    setIsConnecting(true);
    try {
      // Simulate OAuth flow
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      onConnect(selectedPlatform, credentials);
      onClose();
    } catch (error) {
      console.error('Error connecting platform:', error);
    } finally {
      setIsConnecting(false);
    }
  };

  const startOAuthFlow = (platformId: string) => {
    // In a real implementation, this would redirect to the platform's OAuth URL
    console.log(`Starting OAuth flow for ${platformId}`);
    
    // Simulate successful OAuth
    setTimeout(() => {
      onConnect(platformId, { connected: true, token: 'mock-token' });
      onClose();
    }, 1500);
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
        <div className="bg-gray-950 border border-gray-800/60 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden animate-scale-in">
          {/* Header */}
          <div className="p-6 border-b border-gray-800/60">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold serif text-gray-100">Conectar Plataformas</h2>
                <p className="text-sm text-gray-400 mt-1">Autoriza el acceso para publicar contenido</p>
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
            {!selectedPlatform ? (
              <div className="space-y-4">
                <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-4 mb-6">
                  <div className="flex items-center space-x-3">
                    <Shield className="w-5 h-5 text-amber-400" />
                    <div>
                      <p className="text-amber-400 font-medium text-sm">Conexión Segura</p>
                      <p className="text-amber-300/80 text-xs">Usamos OAuth 2.0 para conectar de forma segura. No almacenamos contraseñas.</p>
                    </div>
                  </div>
                </div>

                <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Selecciona una Plataforma</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {platforms.map((platform, index) => {
                    const Icon = platform.icon;
                    
                    return (
                      <div
                        key={platform.id}
                        className="p-6 bg-gray-900/30 border border-gray-700/50 rounded-xl hover:bg-gray-800/40 transition-all duration-200 cursor-pointer group hover-lift animate-fade-in"
                        style={{ animationDelay: `${index * 100}ms` }}
                        onClick={() => setSelectedPlatform(platform.id)}
                      >
                        <div className="flex items-center space-x-4 mb-4">
                          <div className={`p-3 rounded-xl bg-${platform.color}-500/10`}>
                            <Icon className={`w-6 h-6 text-${platform.color}-400`} />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-100 group-hover:text-amber-400 transition-colors duration-200">
                              {platform.name}
                            </h4>
                            <p className="text-sm text-gray-400">{platform.description}</p>
                          </div>
                          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-300 transition-colors duration-200" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="animate-slide-up">
                {(() => {
                  const platform = platforms.find(p => p.id === selectedPlatform);
                  const Icon = platform?.icon || Key;
                  
                  return (
                    <div>
                      <button
                        onClick={() => setSelectedPlatform(null)}
                        className="flex items-center space-x-2 text-gray-400 hover:text-gray-200 transition-colors duration-200 mb-6"
                      >
                        <span>←</span>
                        <span>Volver a plataformas</span>
                      </button>

                      <div className="text-center mb-8">
                        <div className={`w-16 h-16 bg-${platform?.color}-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                          <Icon className={`w-8 h-8 text-${platform?.color}-400`} />
                        </div>
                        <h3 className="text-2xl font-bold serif text-gray-100 mb-2">Conectar {platform?.name}</h3>
                        <p className="text-gray-400">{platform?.description}</p>
                      </div>

                      <div className="bg-gray-900/30 rounded-xl p-6 border border-gray-800/40 mb-6">
                        <h4 className="font-semibold text-gray-100 mb-4 flex items-center space-x-2">
                          <Shield className="w-5 h-5 text-green-400" />
                          <span>Autorización OAuth 2.0</span>
                        </h4>
                        <div className="space-y-3 text-sm text-gray-300">
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Conexión segura y encriptada</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>No almacenamos tu contraseña</span>
                          </div>
                          <div className="flex items-center space-x-3">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                            <span>Puedes revocar el acceso en cualquier momento</span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-blue-500/5 border border-blue-500/20 rounded-xl p-4 mb-6">
                        <div className="flex items-center space-x-3">
                          <Zap className="w-5 h-5 text-blue-400" />
                          <div>
                            <p className="text-blue-400 font-medium text-sm">Permisos Solicitados</p>
                            <p className="text-blue-300/80 text-xs">Publicar contenido, leer perfil básico</p>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => startOAuthFlow(selectedPlatform)}
                        disabled={isConnecting}
                        className={`w-full bg-gradient-to-r from-${platform?.color}-600 to-${platform?.color}-500 text-white py-4 rounded-xl hover:from-${platform?.color}-500 hover:to-${platform?.color}-400 transition-all duration-200 font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed hover-lift flex items-center justify-center space-x-3`}
                      >
                        {isConnecting ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Conectando...</span>
                          </>
                        ) : (
                          <>
                            <Icon className="w-5 h-5" />
                            <span>Conectar con {platform?.name}</span>
                            <ExternalLink className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </div>
                  );
                })()}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}