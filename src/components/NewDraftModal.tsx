import React, { useState } from 'react';
import { X, FileText, Zap, Loader } from 'lucide-react';
import { RichTextEditor } from './RichTextEditor';
import { Draft, Project } from '../types';

interface NewDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Project;
  onCreateDraft: (draftData: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => void;
}

export function NewDraftModal({ isOpen, onClose, project, onCreateDraft }: NewDraftModalProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) return;

    setLoading(true);
    try {
      // For manual drafts, we'll use version 1 since they don't have an ideaId
      await onCreateDraft({
        ideaId: '', // This will be a manual draft without an idea
        projectId: project.id,
        title: title.trim(),
        content,
        version: 1,
        analysis: null
      });
      
      // Reset form
      setTitle('');
      setContent('');
      onClose();
    } catch (error) {
      console.error('Error creating draft:', error);
    } finally {
      setLoading(false);
    }
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
          <div className="p-6 border-b border-gray-800/60 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold serif text-gray-100">Nuevo Borrador</h2>
              <p className="text-sm text-gray-400 mt-1">Proyecto: {project.name}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/50 rounded-lg hover:rotate-90"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Título del Borrador
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-900/50 border border-gray-800/60 rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all duration-200"
                  placeholder="Ej. Guía completa de productividad para startups"
                />
              </div>

              {/* Content Editor */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Contenido
                </label>
                <RichTextEditor
                  content={content}
                  onChange={setContent}
                  placeholder="Comienza a escribir tu borrador..."
                  className="min-h-[400px]"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800/60 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              <FileText className="w-4 h-4 inline mr-2" />
              Borrador manual • Versión 1
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onClose}
                className="px-6 py-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleSubmit}
                disabled={loading || !title.trim() || !content.trim()}
                className="bg-amber-500 text-gray-900 px-6 py-3 rounded-lg hover:bg-amber-400 transition-all duration-200 font-semibold hover-lift disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Creando...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4" />
                    <span>Crear Borrador</span>
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