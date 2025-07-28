import React, { useState } from 'react';
import { FileText, Edit3, BarChart, Copy, Trash2, RefreshCw, Eye, Zap, Loader, Plus, Send } from 'lucide-react';
import { Draft, Project, ContentAnalysis } from '../types';
import { analyzeContent, generateContent } from '../lib/openai';
import { RichTextEditor } from './RichTextEditor';
import { NewDraftModal } from './NewDraftModal';
import { DraftAnalysisPanel } from './DraftAnalysisPanel';
import { ContentOptimizer } from './ContentOptimizer';
import { PublishingModal } from './PublishingModal';
import { PreviewModal } from './PreviewModal';

interface DraftsViewProps {
  drafts: Draft[];
  activeProject: Project | null;
  onEditDraft: (draft: Draft) => void;
  onDeleteDraft: (draftId: string) => void;
  onRegenerateDraft: (draftId: string) => void;
  onPublish?: (publicationData: any) => void;
  isAnalyzing?: boolean;
  isRegenerating?: boolean;
}

export function DraftsView({ drafts, activeProject, onEditDraft, onDeleteDraft, onRegenerateDraft, onPublish, isAnalyzing = false, isRegenerating = false }: DraftsViewProps) {
  const [selectedDraft, setSelectedDraft] = useState<Draft | null>(null);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [showNewDraftModal, setShowNewDraftModal] = useState(false);
  const [showOptimizer, setShowOptimizer] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [showPublishingModal, setShowPublishingModal] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const handleCreateManualDraft = async (draftData: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const newDraft = {
        ...draftData,
        id: Date.now().toString(), // Temporary ID
        createdAt: new Date(),
        updatedAt: new Date()
      } as Draft;
      
      await onEditDraft(newDraft);
      setShowNewDraftModal(false);
    } catch (error) {
      console.error('Error creating manual draft:', error);
    }
  };

  const handleEditClick = (draft: Draft) => {
    setEditContent(draft.content);
    setIsEditing(true);
  };

  const handleSaveEdit = () => {
    if (selectedDraft) {
      const updatedDraft = {
        ...selectedDraft,
        content: editContent,
        updatedAt: new Date()
      };
      onEditDraft(updatedDraft);
      setIsEditing(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditContent('');
  };

  const handleAnalyzeDraft = async () => {
    if (!selectedDraft) return;

    try {
      const analysis = await analyzeContent(selectedDraft.content);
      
      // Actualizar el borrador con el análisis
      const updatedDraft = {
        ...selectedDraft,
        analysis,
        updatedAt: new Date()
      };
      
      onEditDraft(updatedDraft);
      setSelectedDraft(updatedDraft);
    } catch (error) {
      console.error('Error analizando contenido:', error);
    }
  };

  const handleRegenerateDraftContent = async () => {
    if (!selectedDraft || !activeProject) return;

    try {
      // Buscar la idea original para regenerar
      // Por ahora, usaremos los datos del borrador actual
      const regeneratedContent = await generateContent({
        idea: {
          title: selectedDraft.title,
          description: `Regenerar y mejorar el siguiente contenido: ${selectedDraft.content.substring(0, 200)}...`,
          category: 'Regeneración'
        },
        projectSettings: activeProject.settings
      });

      const updatedDraft = {
        ...selectedDraft,
        content: regeneratedContent,
        version: selectedDraft.version + 1,
        analysis: null, // Reset analysis for new content
        updatedAt: new Date()
      };

      onEditDraft(updatedDraft);
      setSelectedDraft(updatedDraft);
    } catch (error) {
      console.error('Error regenerando contenido:', error);
    }
  };

  const handleOptimizeContent = async (optimizedContent: string) => {
    if (!selectedDraft) return;

    setIsOptimizing(true);
    try {
      const updatedDraft = {
        ...selectedDraft,
        content: optimizedContent,
        version: selectedDraft.version + 1,
        analysis: null, // Reset analysis for optimized content
        updatedAt: new Date()
      };

      onEditDraft(updatedDraft);
      setSelectedDraft(updatedDraft);
      setShowOptimizer(false);
    } catch (error) {
      console.error('Error optimizing content:', error);
    } finally {
      setIsOptimizing(false);
    }
  };

  const handlePublish = (publicationData: any) => {
    if (onPublish) {
      onPublish(publicationData);
    }
  };

  if (!activeProject) {
    return (
      <div className="p-8 text-center animate-fade-in">
        <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
          <FileText className="w-10 h-10 text-gray-500" />
        </div>
        <h3 className="text-2xl font-semibold serif text-gray-200 mb-4">Selecciona un proyecto</h3>
        <p className="text-gray-400 leading-relaxed">Elige un proyecto para ver y editar borradores</p>
      </div>
    );
  }

  const projectDrafts = drafts.filter(draft => draft.projectId === activeProject.id);

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold serif text-gray-100 mb-3">Taller Creativo</h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              Edita y refina tu contenido con precisión editorial. Cada borrador es una obra en progreso.
            </p>
          </div>
          <button
            onClick={() => setShowNewDraftModal(true)}
            className="bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-all duration-200 flex items-center space-x-3 font-semibold hover-lift animate-scale-in"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Borrador</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Drafts List */}
          <div className="lg:col-span-1 space-y-4">
            <h2 className="text-lg font-semibold text-gray-300 mb-4 serif">Borradores</h2>
            {projectDrafts.map((draft, index) => (
              <div
                key={draft.id}
                className={`editorial-card rounded-xl p-5 cursor-pointer transition-all duration-300 border group hover-lift animate-fade-in ${
                  selectedDraft?.id === draft.id
                    ? 'border-amber-500/40 bg-amber-500/10'
                    : 'nyt-border hover:bg-gray-800/40'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
                onClick={() => {
                  setSelectedDraft(draft);
                  setIsEditing(false);
                  setEditContent('');
                }}
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-gray-100 text-sm line-clamp-2 leading-tight group-hover:text-amber-400 transition-colors duration-200">
                    {draft.title}
                  </h3>
                  <span className="text-xs text-gray-500 bg-gray-800/50 px-2 py-1 rounded-full font-medium">
                    v{draft.version}
                  </span>
                </div>
                
                <p className="text-gray-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                  {draft.content.substring(0, 120)}...
                </p>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {draft.updatedAt.toLocaleDateString()}
                  </span>
                  {draft.analysis && (
                    <div className="flex items-center space-x-1">
                      <BarChart className="w-3 h-3 text-green-400" />
                      <span className="text-xs text-green-400 font-medium">Analizado</span>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {projectDrafts.length === 0 && (
              <div className="text-center py-12 animate-fade-in">
                <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm mb-2">No hay borradores aún</p>
                <p className="text-gray-500 text-xs leading-relaxed">Crea contenido desde las ideas capturadas</p>
              </div>
            )}
          </div>

          {/* Draft Editor */}
          <div className="lg:col-span-2">
            {selectedDraft ? (
              <div className="editorial-card rounded-xl border nyt-border h-full flex flex-col animate-scale-in">
                {/* Header */}
                <div className="p-6 border-b nyt-border flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold serif text-gray-100 text-xl">{selectedDraft.title}</h2>
                    <p className="text-sm text-gray-400 mt-1">Versión {selectedDraft.version} • {selectedDraft.updatedAt.toLocaleDateString()}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedDraft.analysis ? (
                      <>
                        <button
                          onClick={() => setShowAnalysis(!showAnalysis)}
                          className={`p-3 rounded-lg transition-all duration-200 ${
                            showAnalysis ? 'bg-amber-500/15 text-amber-400' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                          }`}
                        >
                          <BarChart className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setShowOptimizer(!showOptimizer)}
                          className={`p-3 rounded-lg transition-all duration-200 ${
                            showOptimizer ? 'bg-gray-600/20 text-gray-300' : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                          }`}
                          title="Optimizar contenido"
                        >
                          <Zap className="w-4 h-4" />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={handleAnalyzeDraft}
                        disabled={isAnalyzing}
                        className="p-3 text-gray-400 hover:text-amber-400 transition-all duration-200 hover:bg-gray-800/30 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        title="Analizar contenido con IA"
                      >
                        {isAnalyzing ? (
                          <Loader className="w-4 h-4 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4" />
                        )}
                      </button>
                    )}
                    <button
                      onClick={handleRegenerateDraftContent}
                      disabled={isRegenerating}
                      className="p-3 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/30 rounded-lg hover:rotate-180 disabled:opacity-50 disabled:cursor-not-allowed"
                      title="Regenerar contenido con IA"
                    >
                      {isRegenerating ? (
                        <Loader className="w-4 h-4 animate-spin" />
                      ) : (
                        <RefreshCw className="w-4 h-4" />
                      )}
                    </button>
                    <button
                      onClick={() => handleEditClick(selectedDraft)}
                      className={`p-3 transition-all duration-200 hover:bg-gray-800/50 rounded-lg ${
                        isEditing ? 'text-amber-400 bg-amber-500/15' : 'text-gray-400 hover:text-amber-400'
                      }`}
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onDeleteDraft(selectedDraft.id)}
                      className="p-3 text-gray-400 hover:text-red-400 transition-all duration-200 hover:bg-gray-800/30 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-6 overflow-y-auto">
                  {showOptimizer && selectedDraft.analysis && (
                    <div className="mb-8">
                      <ContentOptimizer
                        content={selectedDraft.content}
                        analysis={selectedDraft.analysis}
                        onOptimize={handleOptimizeContent}
                        onReanalyze={handleAnalyzeDraft}
                        isOptimizing={isOptimizing}
                        isAnalyzing={isAnalyzing}
                      />
                    </div>
                  )}
                  
                  {showAnalysis && selectedDraft.analysis && (
                    <div className="mb-8">
                      <DraftAnalysisPanel 
                        analysis={selectedDraft.analysis} 
                        onReanalyze={handleAnalyzeDraft}
                        isAnalyzing={isAnalyzing}
                      />
                    </div>
                  )}
                  
                  {!selectedDraft.analysis && !showAnalysis && (
                    <div className="mb-6 bg-gray-800/20 border border-gray-700/30 rounded-xl p-4 flex items-center space-x-3">
                      <Zap className="w-5 h-5 text-amber-400" />
                      <div>
                        <p className="text-amber-400 font-medium text-sm">Análisis de IA disponible</p>
                        <p className="text-gray-400 text-xs">Haz clic en el botón ⚡ para analizar este contenido con IA</p>
                      </div>
                    </div>
                  )}
                  
                  {isEditing ? (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="text-lg font-semibold text-gray-100">Editando Borrador</h4>
                        <div className="flex space-x-3">
                          <button
                            onClick={handleCancelEdit}
                            className="px-4 py-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                          >
                            Cancelar
                          </button>
                          <button
                            onClick={handleSaveEdit}
                            className="px-4 py-2 bg-amber-500 text-gray-900 rounded-lg hover:bg-amber-400 transition-all duration-200 font-medium"
                          >
                            Guardar Cambios
                          </button>
                        </div>
                      </div>
                      <RichTextEditor
                        content={editContent}
                        onChange={setEditContent}
                        placeholder="Escribe tu contenido aquí..."
                        className="min-h-[500px]"
                      />
                    </div>
                  ) : (
                    <RichTextEditor
                     key={selectedDraft.id}
                      content={selectedDraft.content}
                      onChange={() => {}} // Read-only mode
                      readOnly={true}
                      className="border-0"
                    />
                  )}
                </div>

                {/* Actions */}
                <div className="p-6 border-t nyt-border flex justify-between">
                  {isEditing ? (
                    <div className="flex justify-end w-full space-x-3">
                      <button 
                        onClick={handleCancelEdit}
                        className="px-6 py-2 text-gray-400 hover:text-gray-200 transition-colors duration-200"
                      >
                        Cancelar
                      </button>
                      <button 
                        onClick={handleSaveEdit}
                        className="bg-amber-500 text-gray-900 px-6 py-2 rounded-lg hover:bg-amber-400 transition-all duration-200 font-semibold hover-lift"
                      >
                        Guardar Cambios
                      </button>
                    </div>
                  ) : (
                    <>
                  <div className="flex space-x-3">
                    <button className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/30 rounded-lg">
                      <Copy className="w-4 h-4" />
                      <span className="text-sm font-medium">Copiar</span>
                    </button>
                    <button 
                      onClick={() => setShowPreview(true)}
                      className="flex items-center space-x-2 px-4 py-2 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/30 rounded-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span className="text-sm font-medium">Vista Previa</span>
                    </button>
                  </div>
                  <button 
                    onClick={() => setShowPublishingModal(true)}
                    className="bg-gray-700 text-gray-100 px-6 py-2 rounded-lg hover:bg-gray-600 transition-all duration-200 font-semibold hover-lift flex items-center space-x-2 border border-gray-600"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publicar</span>
                  </button>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="editorial-card rounded-xl border-2 border-dashed border-gray-700/40 h-full flex items-center justify-center animate-fade-in">
                <div className="text-center">
                  <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <p className="text-gray-400 text-lg serif">Selecciona un borrador para editarlo</p>
                  <p className="text-gray-500 text-sm mt-2">Tu taller creativo te espera</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Draft Modal */}
      {activeProject && (
        <NewDraftModal
          isOpen={showNewDraftModal}
          onClose={() => setShowNewDraftModal(false)}
          project={activeProject}
          onCreateDraft={handleCreateManualDraft}
        />
      )}

      {/* Publishing Modal */}
      {selectedDraft && activeProject && (
        <PublishingModal
          isOpen={showPublishingModal}
          onClose={() => setShowPublishingModal(false)}
          draft={selectedDraft}
          project={activeProject}
          onPublish={handlePublish}
        />
      )}

      {/* Preview Modal */}
      {selectedDraft && (
        <PreviewModal
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          draft={selectedDraft}
          project={activeProject!}
        />
      )}
    </div>
  );
}