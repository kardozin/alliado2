import React from 'react';
import { X, Eye, Download, Copy } from 'lucide-react';
import { Draft, Project } from '../types';

interface PreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  draft: Draft;
  project: Project;
}

export function PreviewModal({ isOpen, onClose, draft, project }: PreviewModalProps) {
  if (!isOpen) return null;

  const copyToClipboard = async () => {
    try {
      // Remove HTML tags for clipboard
      const textContent = draft.content.replace(/<[^>]*>/g, '');
      await navigator.clipboard.writeText(textContent);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  const downloadAsText = () => {
    const textContent = draft.content.replace(/<[^>]*>/g, '');
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.title}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

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
                <h2 className="text-2xl font-bold serif text-gray-100 flex items-center space-x-3">
                  <Eye className="w-6 h-6 text-amber-400" />
                  <span>Vista Previa</span>
                </h2>
                <p className="text-sm text-gray-400 mt-1">{draft.title}</p>
              </div>
              <div className="flex items-center space-x-2">
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
                <button
                  onClick={onClose}
                  className="p-2 text-gray-400 hover:text-gray-200 transition-all duration-200 hover:bg-gray-800/50 rounded-lg hover:rotate-90"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-[70vh]">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <div 
                className="prose prose-lg max-w-none text-gray-900"
                dangerouslySetInnerHTML={{ __html: draft.content }}
                style={{
                  fontFamily: 'Georgia, serif',
                  lineHeight: '1.7',
                  color: '#1f2937'
                }}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-800/60 flex justify-between items-center">
            <div className="text-sm text-gray-400">
              Proyecto: {project.name} • Versión {draft.version}
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