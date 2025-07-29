import React, { useState } from 'react';
import { Plus, Calendar, Settings, Trash2, FolderOpen } from 'lucide-react';
import { Project } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  onProjectSelect: (project: Project) => void;
  onNewProject: (projectData?: any) => void;
  onDeleteProject: (projectId: string) => void;
  onOpenSettings: (project: Project) => void;
}

export function ProjectsView({ projects, onProjectSelect, onNewProject, onDeleteProject, onOpenSettings }: ProjectsViewProps) {
  const [showNewProjectForm, setShowNewProjectForm] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    contentType: '',
    targetAudience: '',
    tone: ''
  });

  const handleCreateProject = () => {
    if (newProject.name.trim()) {
      onNewProject(newProject);
      setShowNewProjectForm(false);
      setNewProject({
        name: '',
        description: '',
        contentType: '',
        targetAudience: '',
        tone: ''
      });
    }
  };

  return (
    <div className="p-8 animate-fade-in">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-12">
          <div className="animate-slide-up">
            <h1 className="text-4xl font-bold serif text-gray-100 mb-3">Proyectos</h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
              Gestiona tus contenedores estratégicos de contenido. Cada proyecto es un universo independiente 
              con su propia voz, audiencia y objetivos.
            </p>
          </div>
          <button
            onClick={() => setShowNewProjectForm(true)}
            className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 flex items-center space-x-3 font-semibold hover-lift animate-scale-in"
          >
            <Plus className="w-5 h-5" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>

        {/* New Project Form */}
        {showNewProjectForm && (
          <div className="glass-effect rounded-xl p-8 mb-8 animate-slide-up border nyt-border">
            <h3 className="text-xl font-semibold serif text-gray-100 mb-6">Crear Nuevo Proyecto</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Nombre del Proyecto
                </label>
                <input
                  type="text"
                  value={newProject.name}
                  onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                  placeholder="Ej. Blog de TechStartup"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tipo de Contenido Principal
                </label>
                <input
                  type="text"
                  value={newProject.contentType}
                  onChange={(e) => setNewProject({ ...newProject, contentType: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                  placeholder="Ej. Artículos para LinkedIn"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Descripción
                </label>
                <textarea
                  value={newProject.description}
                  onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                  rows={4}
                  placeholder="Describe el propósito y alcance de este proyecto..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Audiencia Objetivo
                </label>
                <input
                  type="text"
                  value={newProject.targetAudience}
                  onChange={(e) => setNewProject({ ...newProject, targetAudience: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                  placeholder="Ej. Emprendedores tecnológicos"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">
                  Tono de Voz
                </label>
                <input
                  type="text"
                  value={newProject.tone}
                  onChange={(e) => setNewProject({ ...newProject, tone: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-900/50 border nyt-border rounded-lg text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-gray-400/50 focus:border-gray-400/50 transition-all duration-200"
                  placeholder="Ej. Profesional y accesible"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setShowNewProjectForm(false)}
                className="px-6 py-3 text-gray-400 hover:text-gray-200 transition-colors duration-200"
              >
                Cancelar
              </button>
              <button
                onClick={handleCreateProject}
                className="bg-gray-200 text-black px-6 py-3 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold hover-lift"
              >
                Crear Proyecto
              </button>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div
              key={project.id}
              className="card-hover rounded-xl p-6 group animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
              onClick={() => onProjectSelect(project)}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold serif text-gray-100 group-hover:text-white transition-colors duration-300 mb-2">
                    {project.name}
                  </h3>
                  <p className="text-gray-400 leading-relaxed line-clamp-3">
                    {project.description}
                  </p>
                </div>
                <div className="flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenSettings(project);
                    }}
                    className="btn-ghost p-2"
                  >
                    <Settings className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteProject(project.id);
                    }}
                    className="btn-ghost p-2 hover:text-gray-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center text-gray-500 text-sm group-hover:text-gray-400 transition-colors duration-300">
                  <Calendar className="w-4 h-4 mr-3" />
                  <span>Actualizado {project.updatedAt.toLocaleDateString()}</span>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {project.settings.contentType && (
                    <div className="status-badge status-captured">
                      {project.settings.contentType}
                    </div>
                  )}
                  
                  {project.settings.targetAudience && (
                    <div className="status-badge status-captured">
                      {project.settings.targetAudience}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {projects.length === 0 && !showNewProjectForm && (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
              <FolderOpen className="w-10 h-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-semibold serif text-gray-200 mb-4">No hay proyectos aún</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
              Crea tu primer proyecto para comenzar a organizar tu estrategia de contenido con precisión editorial
            </p>
            <button
              onClick={() => setShowNewProjectForm(true)}
              className="bg-gray-200 text-black px-8 py-4 rounded-lg hover:bg-gray-100 transition-all duration-200 font-semibold hover-lift"
            >
              Crear Primer Proyecto
            </button>
          </div>
        )}
      </div>
    </div>
  );
}