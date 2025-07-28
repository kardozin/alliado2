import React, { useState } from 'react';
import { 
  X, 
  Upload, 
  FileText, 
  Link, 
  Trash2, 
  Plus, 
  Save,
  Settings,
  Users,
  MessageSquare,
  Database,
  Rss
} from 'lucide-react';
import { Project, ReferenceDocument } from '../types';

interface ProjectSettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onUpdateProject: (project: Project) => void;
}

export function ProjectSettingsPanel({ isOpen, onClose, project, onUpdateProject }: ProjectSettingsPanelProps) {
  const [activeTab, setActiveTab] = useState<'general' | 'voice' | 'knowledge' | 'feeds'>('general');
  const [editedProject, setEditedProject] = useState<Project>(project);
  const [newStyleGuide, setNewStyleGuide] = useState('');
  const [newRssFeed, setNewRssFeed] = useState('');
  const [dragActive, setDragActive] = useState(false);

  const tabs = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'voice', label: 'Voz y Tono', icon: MessageSquare },
    { id: 'knowledge', label: 'Base de Conocimiento', icon: Database },
    { id: 'feeds', label: 'Feeds RSS', icon: Rss }
  ];

  const handleSave = () => {
    onUpdateProject(editedProject);
    onClose();
  };

  const addStyleGuide = () => {
    if (newStyleGuide.trim()) {
      setEditedProject({
        ...editedProject,
        settings: {
          ...editedProject.settings,
          styleGuides: [...editedProject.settings.styleGuides, newStyleGuide.trim()]
        }
      });
      setNewStyleGuide('');
    }
  };

  const removeStyleGuide = (index: number) => {
    setEditedProject({
      ...editedProject,
      settings: {
        ...editedProject.settings,
        styleGuides: editedProject.settings.styleGuides.filter((_, i) => i !== index)
      }
    });
  };

  const addRssFeed = () => {
    if (newRssFeed.trim()) {
      setEditedProject({
        ...editedProject,
        settings: {
          ...editedProject.settings,
          rssFeeds: [...editedProject.settings.rssFeeds, newRssFeed.trim()]
        }
      });
      setNewRssFeed('');
    }
  };

  const removeRssFeed = (index: number) => {
    setEditedProject({
      ...editedProject,
      settings: {
        ...editedProject.settings,
        rssFeeds: editedProject.settings.rssFeeds.filter((_, i) => i !== index)
      }
    });
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = Array.from(e.dataTransfer.files);
    handleFileUpload(files);
  };

  const handleFileUpload = (files: File[]) => {
    files.forEach(file => {
      if (file.type === 'text/plain' || file.type === 'application/pdf' || file.name.endsWith('.md') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        const reader = new FileReader();
        reader.onload = (event) => {
          // Sanitize content to remove null characters and other problematic Unicode sequences
          const rawContent = event.target?.result as string;
          const sanitizedContent = rawContent.replace(/\u0000/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
          
          const newDoc: ReferenceDocument = {
            id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            name: file.name,
            content: sanitizedContent,
            uploadedAt: new Date()
          };
          setEditedProject({
            ...editedProject,
            settings: {
              ...editedProject.settings,
              referenceDocuments: [...editedProject.settings.referenceDocuments, newDoc]
            }
          });
        };
        reader.readAsText(file);
      }
    });
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      handleFileUpload(Array.from(files));
    }
  };

  const removeDocument = (docId: string) => {
    setEditedProject({
      ...editedProject,
      settings: {
        ...editedProject.settings,
        referenceDocuments: editedProject.settings.referenceDocuments.filter(doc => doc.id !== docId)
      }
    });
  };

  const [manualDocumentText, setManualDocumentText] = useState('');
  const [manualDocumentName, setManualDocumentName] = useState('');

  const addManualDocument = () => {
    if (manualDocumentText.trim() && manualDocumentName.trim()) {
      // Sanitize content to remove null characters and other problematic Unicode sequences
      const sanitizedContent = manualDocumentText.trim().replace(/\u0000/g, '').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '');
      
      const newDoc: ReferenceDocument = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        name: manualDocumentName.trim(),
        content: sanitizedContent,
        uploadedAt: new Date()
      };
      setEditedProject({
        ...editedProject,
        settings: {
          ...editedProject.settings,
          referenceDocuments: [...editedProject.settings.referenceDocuments, newDoc]
        }
      });
      setManualDocumentText('');
      setManualDocumentName('');
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-[600px] bg-gray-950 border-l border-gray-800/60 z-50 flex flex-col animate-slide-in-right">
        {/* Header */}
        <div className="p-6 border-b border-gray-800/60 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold serif text-gray-100">Configuración del Proyecto</h2>
            <p className="text-sm text-gray-400 mt-1">{project.name}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/50 rounded-lg hover:rotate-90"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 py-4 border-b border-gray-800/60">
          <div className="flex space-x-1">
            {tabs.map((tab, index) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 animate-fade-in ${
                    isActive 
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                      : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                  }`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'general' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Nombre del Proyecto
                </label>
                <input
                  type="text"
                  value={editedProject.name}
                  onChange={(e) => setEditedProject({ ...editedProject, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Descripción
                </label>
                <textarea
                  value={editedProject.description}
                  onChange={(e) => setEditedProject({ ...editedProject, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  rows={4}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tipo de Contenido Principal
                </label>
                <input
                  type="text"
                  value={editedProject.settings.contentType}
                  onChange={(e) => setEditedProject({
                    ...editedProject,
                    settings: { ...editedProject.settings, contentType: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  placeholder="Ej. Artículos para LinkedIn, Posts de Instagram"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Audiencia Objetivo
                </label>
                <input
                  type="text"
                  value={editedProject.settings.targetAudience}
                  onChange={(e) => setEditedProject({
                    ...editedProject,
                    settings: { ...editedProject.settings, targetAudience: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  placeholder="Ej. Emprendedores tecnológicos, Creativos"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tono General
                </label>
                <input
                  type="text"
                  value={editedProject.settings.tone}
                  onChange={(e) => setEditedProject({
                    ...editedProject,
                    settings: { ...editedProject.settings, tone: e.target.value }
                  })}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  placeholder="Ej. Profesional y accesible, Inspiracional"
                />
              </div>
            </div>
          )}

          {activeTab === 'voice' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Frases de Estilo Guía</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Define las reglas específicas que la IA debe seguir para mantener la voz y el tono únicos de este proyecto.
                </p>

                <div className="space-y-3 mb-4">
                  {editedProject.settings.styleGuides.map((guide, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 p-4 bg-gray-900/30 rounded-lg border border-gray-800/40 group hover:bg-gray-800/40 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <MessageSquare className="w-4 h-4 text-amber-400 flex-shrink-0" />
                      <span className="flex-1 text-gray-200 text-sm">{guide}</span>
                      <button
                        onClick={() => removeStyleGuide(index)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newStyleGuide}
                    onChange={(e) => setNewStyleGuide(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addStyleGuide()}
                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                    placeholder="Ej. Usa un tono conversacional pero profesional"
                  />
                  <button
                    onClick={addStyleGuide}
                    className="px-4 py-3 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-400 transition-all duration-200 font-medium hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="bg-gray-900/20 rounded-xl p-6 border border-gray-800/40">
                <h4 className="font-semibold text-gray-200 mb-3">Ejemplos de Frases Guía</h4>
                <div className="space-y-2 text-sm text-gray-400">
                  <p>• "Incluye siempre ejemplos prácticos en cada artículo"</p>
                  <p>• "Evita jerga técnica excesiva, explica conceptos complejos"</p>
                  <p>• "Usa preguntas retóricas para involucrar al lector"</p>
                  <p>• "Termina con un call-to-action claro y específico"</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'knowledge' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Documentos de Referencia</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Sube documentos que la IA usará como contexto para generar contenido más relevante y específico.
                </p>

                {/* Upload Zone */}
                <div
                  className={`border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 ${
                    dragActive 
                      ? 'border-amber-500/50 bg-amber-500/5' 
                      : 'border-gray-700/50 hover:border-gray-600/50 hover:bg-gray-900/20'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className={`w-12 h-12 mx-auto mb-4 transition-colors duration-200 ${
                    dragActive ? 'text-amber-400' : 'text-gray-500'
                  }`} />
                  <p className="text-gray-300 font-medium mb-2">
                    Arrastra archivos aquí o haz clic para seleccionar
                  </p>
                  <p className="text-sm text-gray-500">
                    Soporta: PDF, DOC, TXT, MD
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.doc,.docx,.txt,.md"
                    className="hidden"
                    onChange={handleFileInputChange}
                  />
                </div>

                {/* Documents List */}
                <div className="space-y-3">
                  {editedProject.settings.referenceDocuments.map((doc, index) => (
                    <div 
                      key={doc.id} 
                      className="flex items-center space-x-4 p-4 bg-gray-900/30 rounded-lg border border-gray-800/40 group hover:bg-gray-800/40 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <FileText className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="text-gray-200 font-medium text-sm">{doc.name}</p>
                        <p className="text-xs text-gray-500">
                          Subido el {doc.uploadedAt.toLocaleDateString()}
                        </p>
                      </div>
                      <button
                        onClick={() => removeDocument(doc.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                {/* Text Input for Manual Content */}
                <div className="mt-8">
                  <h4 className="text-md font-semibold text-gray-100 mb-4">Agregar Documento Manual</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Nombre del documento
                      </label>
                      <input
                        type="text"
                        value={manualDocumentName}
                        onChange={(e) => setManualDocumentName(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                        placeholder="Ej. Guía de marca, Manual de estilo..."
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-3">
                        Contenido del documento
                      </label>
                  <textarea
                        value={manualDocumentText}
                        onChange={(e) => setManualDocumentText(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                    rows={6}
                    placeholder="Pega aquí guías de marca, ejemplos de contenido, o cualquier texto de referencia..."
                  />
                    </div>
                  <button 
                    onClick={addManualDocument}
                    disabled={!manualDocumentText.trim() || !manualDocumentName.trim()}
                    className="mt-3 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-all duration-200 font-medium hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    Agregar como Documento
                  </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'feeds' && (
            <div className="space-y-6 animate-slide-up">
              <div>
                <h3 className="text-lg font-semibold serif text-gray-100 mb-4">Fuentes de Inspiración RSS</h3>
                <p className="text-sm text-gray-400 mb-6 leading-relaxed">
                  Configura feeds RSS para mantenerte actualizado con las últimas tendencias de tu industria.
                </p>

                <div className="space-y-3 mb-4">
                  {editedProject.settings.rssFeeds.map((feed, index) => (
                    <div 
                      key={index} 
                      className="flex items-center space-x-3 p-4 bg-gray-900/30 rounded-lg border border-gray-800/40 group hover:bg-gray-800/40 transition-all duration-200 animate-fade-in"
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <Rss className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="flex-1 text-gray-200 text-sm font-mono">{feed}</span>
                      <button
                        onClick={() => removeRssFeed(index)}
                        className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-red-400 transition-all duration-200 hover:scale-110"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <input
                    type="url"
                    value={newRssFeed}
                    onChange={(e) => setNewRssFeed(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addRssFeed()}
                    className="flex-1 px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                    placeholder="https://ejemplo.com/feed.xml"
                  />
                  <button
                    onClick={addRssFeed}
                    className="px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-500 transition-all duration-200 font-medium hover:scale-105"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                <div className="bg-gray-900/20 rounded-xl p-6 border border-gray-800/40 mt-6">
                  <h4 className="font-semibold text-gray-200 mb-3">Feeds Sugeridos</h4>
                  <div className="space-y-2 text-sm text-gray-400">
                    <p>• TechCrunch: https://techcrunch.com/feed/</p>
                    <p>• Product Hunt: https://www.producthunt.com/feed</p>
                    <p>• Behance: https://www.behance.net/feeds/projects</p>
                    <p>• Medium: https://medium.com/feed/@username</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-800/60 flex justify-between">
          <button
            onClick={onClose}
            className="px-6 py-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            className="bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-all duration-200 font-semibold hover:scale-105 flex items-center space-x-2"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </div>
    </>
  );
}