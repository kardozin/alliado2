import React from 'react';
import { LogOut } from 'lucide-react';
import { ProjectSettingsPanel } from './ProjectSettingsPanel';
import { 
  FolderOpen, 
  Lightbulb, 
  FileText, 
  Send, 
  BarChart3, 
  Plus,
  Settings,
  Zap
} from 'lucide-react';
import { ViewMode, Project } from '../types';
import { useAuth } from '../context/AuthContext';

interface SidebarProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  projects: Project[];
  activeProject: Project | null;
  onProjectSelect: (project: Project) => void;
  onNewProject: () => void;
  onUpdateProject: (project: Project) => void;
}

export function Sidebar({ 
  currentView, 
  onViewChange, 
  projects, 
  activeProject, 
  onProjectSelect,
  onNewProject,
  onUpdateProject
}: SidebarProps) {
  const [showSettings, setShowSettings] = React.useState(false);
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const menuItems = [
    { id: 'projects' as ViewMode, label: 'Proyectos', icon: FolderOpen },
    { id: 'ideas' as ViewMode, label: 'Ideas', icon: Lightbulb },
    { id: 'drafts' as ViewMode, label: 'Borradores', icon: FileText },
    { id: 'publications' as ViewMode, label: 'Publicaciones', icon: Send },
    { id: 'analytics' as ViewMode, label: 'Análisis', icon: BarChart3 },
  ];

  return (
    <>
      <div className="w-72 bg-gray-950 border-r border-gray-800/60 h-screen flex flex-col animate-fade-in">
      {/* Header */}
      <div className="p-8 border-b nyt-border">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-amber-500 rounded-lg flex items-center justify-center">
            <Zap className="w-5 h-5 text-gray-900" />
          </div>
          <h1 className="text-2xl font-bold serif text-gray-100">Allia.do</h1>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">Centro de Comando de Contenido Estratégico</p>
      </div>

      {/* Active Project */}
      {activeProject && (
        <div className="p-6 border-b nyt-border editorial-card mx-4 my-4 rounded-lg animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Proyecto Activo</p>
              <p className="font-semibold text-gray-200 text-sm leading-tight">{activeProject.name}</p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-2">{activeProject.description}</p>
            </div>
            <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(true);
            }}
            className="p-2 text-gray-400 hover:text-amber-400 transition-all duration-200 hover:bg-gray-800/30 rounded-lg">
              <Settings className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-4 py-2">
        <ul className="space-y-1">
          {menuItems.map((item, index) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            
            return (
              <li key={item.id} className="animate-fade-in" style={{ animationDelay: `${index * 50}ms` }}>
                <button
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-200 group ${
                    isActive 
                      ? 'bg-amber-500/15 text-amber-400 border border-amber-500/30' 
                      : 'text-gray-300 hover:bg-gray-800/30 hover:text-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-amber-400 rounded-full animate-pulse-subtle"></div>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Projects List */}
      <div className="p-4 border-t nyt-border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Proyectos</h3>
          <button
            onClick={onNewProject}
            className="p-2 rounded-lg hover:bg-gray-800/50 transition-all duration-200 text-gray-400 hover:text-amber-400 hover:scale-105"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-1 max-h-48 overflow-y-auto">
          {projects.map((project, index) => (
            <li key={project.id} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
              <button
                onClick={() => onProjectSelect(project)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-200 group ${
                  activeProject?.id === project.id
                    ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/30'
                }`}
              >
                <div className="font-medium group-hover:translate-x-1 transition-transform duration-200">
                  {project.name}
                </div>
                <div className="text-xs text-gray-500 mt-0.5 line-clamp-1">
                  {project.settings.contentType || 'Sin configurar'}
                </div>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="p-4 border-t nyt-border">
        <button
          onClick={handleSignOut}
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-gray-400 hover:text-gray-200 hover:bg-gray-800/30 transition-all duration-200 mb-4"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
        <p className="text-xs text-gray-500 text-center">
          Creado por{' '}
          <span className="text-amber-400 font-medium">Marcelo Cardozo</span>
          <br />
          Implementado por IA © 2025
        </p>
      </div>
    </div>

      {/* Settings Panel */}
      {activeProject && (
        <ProjectSettingsPanel
          isOpen={showSettings}
          onClose={() => setShowSettings(false)}
          project={activeProject}
          onUpdateProject={onUpdateProject}
        />
      )}
    </>
  );
}