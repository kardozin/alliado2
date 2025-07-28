import React from 'react';
import { X, FileText, Calendar, User, Eye, Clock } from 'lucide-react';
import { Draft, Project } from '../types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: Draft;
  project: Project;
}

export function PreviewModal({ isOpen, onClose, draft, project }: PreviewModalProps) {
  if (!isOpen) return null;

  // Calculate reading time (average 200 words per minute)
  const wordCount = draft.content.replace(/<[^>]*>/g, '').split(/\s+/).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 animate-fade-in"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden animate-scale-in shadow-2xl">
          {/* Header */}
          <div className="bg-gray-50 px-8 py-6 border-b border-gray-200 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                <Eye className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900 serif">Vista Previa</h2>
                <p className="text-sm text-gray-600">Cómo se verá tu contenido publicado</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-all duration-200 hover:bg-gray-200 rounded-lg"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[70vh] bg-white">
            {/* Article Header */}
            <div className="px-8 py-8 border-b border-gray-100">
              <div className="max-w-3xl mx-auto">
                <h1 className="text-4xl font-bold text-gray-900 serif leading-tight mb-6">
                  {draft.title}
                </h1>
                
                <div className="flex items-center space-x-6 text-sm text-gray-600 mb-8">
                  <div className="flex items-center space-x-2">
                    <User className="w-4 h-4" />
                    <span className="font-medium">{project.name}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>{draft.updatedAt.toLocaleDateString('es-ES', { 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <FileText className="w-4 h-4" />
                    <span>Versión {draft.version}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="w-4 h-4" />
                    <span>{readingTime} min de lectura</span>
                  </div>
                </div>

                {/* Project context */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                  <div className="flex items-center space-x-2 text-gray-700 mb-2">
                    <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                    <span className="text-sm font-medium">Contexto Editorial</span>
                  </div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p><span className="font-medium">Audiencia:</span> {project.settings.targetAudience || 'No definida'}</p>
                    <p><span className="font-medium">Tono:</span> {project.settings.tone || 'No definido'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Article Content */}
            <div className="px-8 py-8">
              <div className="max-w-3xl mx-auto">
                <div 
                  className="prose prose-lg prose-gray max-w-none text-gray-900 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: draft.content }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gray-50 px-8 py-6 border-t border-gray-200">
              <div className="max-w-3xl mx-auto">
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div>
                    <p className="font-medium text-gray-700">{project.name}</p>
                    <p>Centro de Comando de Contenido Estratégico</p>
                  </div>
                  <div className="text-right">
                    <p>Última actualización: {draft.updatedAt.toLocaleString('es-ES')}</p>
                    <p className="text-xs text-gray-500">Generado con Allia.do</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex justify-end">
            <button
              onClick={onClose}
              className="bg-gray-800 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium"
            >
              Cerrar Vista Previa
            </button>
          </div>
        </div>
      </div>
    </>
  );
}