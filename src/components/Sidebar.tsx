import React from 'react';
import { LogOut, Menu, X } from 'lucide-react';
import { ProjectSettingsPanel } from './ProjectSettingsPanel';
import { 
  FolderOpen, 
  Lightbulb, 
  FileText, 
  Send, 
  BarChart3, 
  Plus,
  Settings
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
  isOpen?: boolean;
  onToggle?: () => void;
}

export function Sidebar({ 
  currentView, 
  onViewChange, 
  projects, 
  activeProject, 
  onProjectSelect,
  onNewProject,
  onUpdateProject,
  isOpen = true,
  onToggle
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
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden animate-fade-in"
          onClick={onToggle}
        />
      )}
      
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggle}
        className="fixed top-4 left-4 z-40 lg:hidden p-3 bg-gray-900/90 backdrop-blur-sm border border-gray-800/60 rounded-xl text-gray-300 hover:text-gray-100 transition-all duration-200"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      <div className={`
        fixed lg:relative top-0 left-0 h-screen z-40 lg:z-auto
        w-72 bg-gray-950 border-r border-gray-800/60 flex flex-col
        transform transition-transform duration-300 ease-out lg:transform-none
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        animate-fade-in
      `}>
      {/* Header */}
      <div className="p-8 border-b nyt-border">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-gray-200 rounded-lg flex items-center justify-center">
            <span className="text-lg font-bold serif text-black">A</span>
          </div>
          <h1 className="text-2xl font-bold serif text-gray-100">Allia.do</h1>
        </div>
        <p className="text-sm text-gray-400 leading-relaxed">Centro de Comando de Contenido Estratégico</p>
      </div>

      {/* Active Project */}
      {activeProject && (
        <div className="p-6 border-b nyt-border card-hover mx-4 my-4 rounded-lg animate-slide-up">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-xs text-gray-500 uppercase tracking-wider font-medium mb-1">Proyecto Activo</p>
              <p className="font-semibold text-gray-200 text-sm leading-tight">{activeProject.name}</p>
              <p className="text-xs text-gray-400 mt-1 line-clamp-1">{activeProject.description}</p>
            </div>
            <button
            onClick={(e) => {
              e.stopPropagation();
              setShowSettings(true);
            }}
            className="btn-ghost p-2">
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
                  className={`w-full flex items-center space-x-4 px-4 py-3 rounded-lg transition-all duration-300 group ${
                    isActive 
                      ? 'bg-gray-800/40 text-white border border-gray-700/50' 
                      : 'text-gray-300 hover:bg-gray-800/20 hover:text-gray-100'
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`} />
                  <span className="font-medium">{item.label}</span>
                  {isActive && (
                    <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse-subtle"></div>
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
            className="btn-ghost p-2 rounded-lg hover:scale-105"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>
        <ul className="space-y-1 max-h-48 overflow-y-auto">
          {projects.map((project, index) => (
            <li key={project.id} className="animate-fade-in" style={{ animationDelay: `${index * 30}ms` }}>
              <button
                onClick={() => onProjectSelect(project)}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-all duration-300 group ${
                  activeProject?.id === project.id
                    ? 'bg-gray-800/40 text-white border border-gray-700/50'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/20'
                }`}
              >
                <div className="font-medium group-hover:translate-x-1 transition-transform duration-300">
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
          className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg btn-ghost mb-4"
        >
          <LogOut className="w-4 h-4" />
          <span className="text-sm font-medium">Cerrar Sesión</span>
        </button>
        <p className="text-xs text-gray-500 text-center">
          Creado por{' '}
          <span className="text-gray-300 font-medium">Marcelo Cardozo</span>
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