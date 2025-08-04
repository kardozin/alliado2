import React, { useState } from 'react';
import { Settings } from 'lucide-react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AuthForm } from './components/AuthForm';
import { LandingPage } from './components/LandingPage';
import { Sidebar } from './components/Sidebar';
import { ProjectsView } from './components/ProjectsView';
import { IdeasView } from './components/IdeasView';
import { DraftsView } from './components/DraftsView';
import { PublicationsView } from './components/PublicationsView';
import { AnalyticsView } from './components/AnalyticsView';
import { ProjectSettingsPanel } from './components/ProjectSettingsPanel';
import { ToastContainer } from './components/Toast';
import { useProjects, useIdeas, useDrafts, usePublications } from './hooks/useSupabaseData';
import { useToast } from './hooks/useToast';
import { generateContent } from './lib/openai';
import { ViewMode, Project, Idea, Draft } from './types';

function AppContent() {
  const [currentView, setCurrentView] = useState<ViewMode>('projects');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProjectSettings, setShowProjectSettings] = useState(false);
  const [settingsProject, setSettingsProject] = useState<Project | null>(null);
  const [isGeneratingDraft, setIsGeneratingDraft] = useState(false);
  const [isAnalyzingContent, setIsAnalyzingContent] = useState(false);
  
  const { user, loading } = useAuth();
  const { messages, removeToast, showSuccess, showError, showLoading, updateToast } = useToast();
  const { projects, createProject, updateProject, deleteProject } = useProjects();
  const { ideas, createIdea, updateIdea, deleteIdea } = useIdeas();
  const { drafts, createDraft, updateDraft, deleteDraft } = useDrafts();
  const { publications, createPublication } = usePublications();
  
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  
  // Check if Supabase is configured
  const isSupabaseConfigured = !!(import.meta.env.VITE_SUPABASE_URL && import.meta.env.VITE_SUPABASE_ANON_KEY);

  // Set active project when projects load
  React.useEffect(() => {
    if (projects.length > 0 && !activeProject) {
      setActiveProject(projects[0]);
    }
  }, [projects, activeProject]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Cargando Allia.do...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div>
        <LandingPage onGetStarted={() => {}} />
        <AuthForm />
      </div>
    );
  }

  // Show configuration message if Supabase is not configured
  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gray-950 flex items-center justify-center p-8">
        <div className="max-w-2xl text-center animate-fade-in">
          <div className="w-20 h-20 bg-gray-800/50 rounded-full flex items-center justify-center mx-auto mb-6">
            <Settings className="w-10 h-10 text-gray-300" />
          </div>
          <h1 className="text-3xl font-bold serif text-gray-100 mb-4">Configuración Requerida</h1>
          <p className="text-gray-400 text-lg leading-relaxed mb-8">
            La aplicación necesita ser configurada con las credenciales de Supabase para funcionar correctamente.
          </p>
          <div className="bg-gray-900/50 border border-gray-800/60 rounded-xl p-6 text-left">
            <h3 className="text-lg font-semibold text-gray-100 mb-4">Variables de Entorno Requeridas:</h3>
            <div className="space-y-2 font-mono text-sm">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-300">VITE_SUPABASE_URL</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <span className="text-gray-300">VITE_SUPABASE_ANON_KEY</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                <span className="text-gray-300">VITE_OPENAI_API_KEY (opcional)</span>
              </div>
            </div>
          </div>
          <div className="mt-8 text-sm text-gray-500">
            <p>Contacta al administrador para configurar estas variables en Netlify</p>
          </div>
        </div>
      </div>
    );
  }

  const handleProjectSelect = (project: Project) => {
    setActiveProject(project);
    setSidebarOpen(false); // Close sidebar on mobile after selection
    // Only change to ideas view if we're currently on projects view
    if (currentView === 'projects') {
      setCurrentView('ideas');
    }
  };

  const handleNewProject = async (projectData?: any) => {
    try {
      const newProject = await createProject({
        name: projectData?.name || 'Nuevo Proyecto',
        description: projectData?.description || 'Descripción del proyecto',
        settings: {
          styleGuides: [],
          contentType: projectData?.contentType || '',
          targetAudience: projectData?.targetAudience || '',
          tone: projectData?.tone || '',
          referenceDocuments: [],
          rssFeeds: []
        }
      });
      setActiveProject(newProject);
      showSuccess(
        'Proyecto Creado',
        `El proyecto "${newProject.name}" ha sido creado exitosamente`
      );
    } catch (error) {
      console.error('Error creating project:', error);
      showError(
        'Error al Crear Proyecto',
        error instanceof Error ? error.message : 'No se pudo crear el proyecto. Verifica la configuración de la base de datos.'
      );
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    try {
      await deleteProject(projectId);
      if (activeProject?.id === projectId) {
        setActiveProject(projects.find(p => p.id !== projectId) || null);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const handleCreateIdea = async (ideaData: Partial<Idea>) => {
    try {
      if (!activeProject) {
        showError('Error', 'No hay proyecto activo seleccionado');
        return;
      }
      
      await createIdea({
        projectId: ideaData.projectId!,
        title: ideaData.title!,
        description: ideaData.description!,
        category: ideaData.category!,
        source: ideaData.source!,
        sourceData: ideaData.sourceData,
        status: 'captured'
      });
      showSuccess(
        'Idea Capturada',
        'La idea ha sido guardada exitosamente en tu proyecto'
      );
    } catch (error) {
      console.error('Error creating idea:', error);
      showError(
        'Error al Capturar Idea',
        error instanceof Error ? error.message : 'No se pudo guardar la idea. Verifica la configuración de la base de datos.'
      );
    }
  };

  const handleDeleteIdea = async (ideaId: string) => {
    try {
      await deleteIdea(ideaId);
      showSuccess(
        'Idea Eliminada',
        'La idea ha sido eliminada exitosamente'
      );
    } catch (error) {
      console.error('Error deleting idea:', error);
      showError(
        'Error al Eliminar Idea',
        'No se pudo eliminar la idea. Intenta nuevamente.'
      );
    }
  };
  
  const handleGenerateDraft = async (idea: Idea) => {
    if (!activeProject) return;

    setIsGeneratingDraft(true);
    const loadingToastId = showLoading(
      'Generando Borrador',
      'La IA está creando contenido basado en tu idea...'
    );
    
    try {
      // Calculate the next version number for this idea
      const existingDrafts = drafts.filter(draft => draft.ideaId === idea.id);
      const nextVersion = existingDrafts.length + 1;

      // Generar contenido real con OpenAI
      const generatedContent = await generateContent({
        idea: {
          title: idea.title,
          description: idea.description,
          category: idea.category,
          sourceData: idea.sourceData
        },
        projectSettings: activeProject.settings
      });

      // Crear el borrador con el contenido generado
      await createDraft({
        ideaId: idea.id,
        projectId: idea.projectId,
        title: idea.title,
        content: generatedContent,
        version: nextVersion,
        analysis: null // El análisis se hará on-demand
      });
      
      // Update idea status to in-progress
      await updateIdea(idea.id, { status: 'in-progress' });
      
      // Update toast to success
      updateToast(loadingToastId, {
        type: 'success',
        title: 'Borrador Generado',
        message: `Borrador v${nextVersion} creado exitosamente con IA`,
        duration: 4000
      });
      
      setCurrentView('drafts');
    } catch (error) {
      console.error('Error generando borrador:', error);
      updateToast(loadingToastId, {
        type: 'error',
        title: 'Error al Generar',
        message: 'No se pudo generar el borrador. Verifica tu configuración de OpenAI.',
        duration: 6000
      });
    } finally {
      setIsGeneratingDraft(false);
    }
  };

  const handleCreateManualDraft = async (draftData: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createDraft(draftData);
      showSuccess(
        'Borrador Creado',
        'El borrador ha sido creado exitosamente'
      );
    } catch (error) {
      console.error('Error creating draft:', error);
      showError(
        'Error al Crear Borrador',
        'No se pudo crear el borrador'
      );
    }
  };

  const handleCreatePublicationFromAdaptation = async (publicationData: any) => {
    try {
      await createPublication(publicationData);
      showSuccess(
        'Publicación Creada',
        'La adaptación ha sido guardada como publicación exitosamente'
      );
    } catch (error) {
      console.error('Error creating publication from adaptation:', error);
      showError(
        'Error al Crear Publicación',
        'No se pudo guardar la adaptación como publicación'
      );
    }
  };

  const handleEditDraft = async (draft: Draft) => {
    try {
      await updateDraft(draft.id, draft);
    } catch (error) {
      console.error('Error updating draft:', error);
    }
  };

  const handleDeleteDraft = async (draftId: string) => {
    try {
      await deleteDraft(draftId);
    } catch (error) {
      console.error('Error deleting draft:', error);
    }
  };

  const handleFinalizeDraft = async (draft: Draft) => {
    try {
      // Create a publication from the draft
      await createPublication({
        projectId: draft.projectId,
        title: draft.title,
        content: draft.content,
        platform: 'Final',
        publishedAt: new Date(),
        analysis: draft.analysis || {
          tone: 'Profesional',
          emotion: 'Neutral',
          readability: 75,
          keyThemes: ['Contenido'],
          seoScore: 70
        }
      });
      
      // Update the idea status to completed if it has an ideaId
      if (draft.ideaId) {
        await updateIdea(draft.ideaId, { status: 'completed' });
      }
      
      showSuccess(
        'Publicación Final Creada',
        'El borrador ha sido guardado como publicación final y está disponible en el archivo editorial'
      );
      
      // Switch to publications view to show the new publication
      setCurrentView('publications');
    } catch (error) {
      console.error('Error creating final publication:', error);
      showError(
        'Error al Crear Publicación',
        'No se pudo crear la publicación final. Intenta nuevamente.'
      );
    }
  };
  
  const handleRegenerateDraft = async (draftId: string) => {
    const draft = drafts.find(d => d.id === draftId);
    if (draft && activeProject) {
      setIsAnalyzingContent(true);
      const loadingToastId = showLoading(
        'Regenerando Contenido',
        'La IA está mejorando y regenerando el borrador...'
      );
      
      try {
        // Regenerar contenido real con OpenAI
        const regeneratedContent = await generateContent({
          idea: {
            title: draft.title,
            description: `Regenerar y mejorar el siguiente contenido: ${draft.content.substring(0, 200)}...`,
            category: 'Regeneración'
          },
          projectSettings: activeProject.settings
        });

        const updatedDraft = {
          ...draft,
          content: regeneratedContent,
          version: draft.version + 1,
          analysis: null,
          updatedAt: new Date()
        };

        await updateDraft(draft.id, updatedDraft);
        
        updateToast(loadingToastId, {
          type: 'success',
          title: 'Contenido Regenerado',
          message: 'El borrador ha sido mejorado exitosamente',
          duration: 4000
        });
      } catch (error) {
        console.error('Error regenerating draft:', error);
        updateToast(loadingToastId, {
          type: 'error',
          title: 'Error al Regenerar',
          message: 'No se pudo regenerar el contenido. Intenta nuevamente.',
          duration: 6000
        });
      } finally {
        setIsAnalyzingContent(false);
      }
    }
  };

  const handleUpdateProject = async (updatedProject: Project) => {
    try {
      const updated = await updateProject(updatedProject.id, updatedProject);
      if (activeProject?.id === updatedProject.id) {
        setActiveProject(updated);
      }
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleOpenProjectSettings = (project: Project) => {
    setSettingsProject(project);
    setShowProjectSettings(true);
  };

  const renderCurrentView = () => {
    switch (currentView) {
      case 'projects':
        return (
          <ProjectsView
            projects={projects}
            onProjectSelect={handleProjectSelect}
            onNewProject={handleNewProject}
            onDeleteProject={handleDeleteProject}
            onOpenSettings={handleOpenProjectSettings}
          />
        );
      case 'ideas':
        return (
          <IdeasView
            ideas={ideas}
            drafts={drafts}
            publications={publications}
            activeProject={activeProject}
            onCreateIdea={handleCreateIdea}
            onDeleteIdea={handleDeleteIdea}
            onGenerateDraft={handleGenerateDraft}
            isGeneratingDraft={isGeneratingDraft}
          />
        );
      case 'drafts':
        return (
          <DraftsView
            drafts={drafts}
            activeProject={activeProject}
            onEditDraft={handleEditDraft}
            onDeleteDraft={handleDeleteDraft}
            onRegenerateDraft={handleRegenerateDraft}
            onFinalizeDraft={handleFinalizeDraft}
            isAnalyzing={isAnalyzingContent}
            isRegenerating={isAnalyzingContent}
          />
        );
      case 'publications':
        return (
          <PublicationsView
            publications={publications}
            activeProject={activeProject}
            onCreateDraft={handleCreateManualDraft}
            onCreatePublication={handleCreatePublicationFromAdaptation}
          />
        );
      case 'analytics':
        return (
          <AnalyticsView
            publications={publications}
            activeProject={activeProject}
          />
        );
      default:
        return <ProjectsView projects={projects} onProjectSelect={handleProjectSelect} onNewProject={handleNewProject} onDeleteProject={handleDeleteProject} onOpenSettings={handleOpenProjectSettings} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-950">
      <Sidebar
        currentView={currentView}
        onViewChange={setCurrentView}
        projects={projects}
        activeProject={activeProject}
        onProjectSelect={handleProjectSelect}
        onNewProject={handleNewProject}
        onUpdateProject={handleUpdateProject}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <main className="flex-1 overflow-y-auto bg-gray-950 lg:ml-0">
        {renderCurrentView()}
      </main>
      
      {/* Toast Notifications */}
      <ToastContainer messages={messages} onClose={removeToast} />
      
      {/* Project Settings Panel */}
      {settingsProject && (
        <ProjectSettingsPanel
          isOpen={showProjectSettings}
          onClose={() => {
            setShowProjectSettings(false);
            setSettingsProject(null);
          }}
          project={settingsProject}
          onUpdateProject={(updatedProject) => {
            handleUpdateProject(updatedProject);
            setShowProjectSettings(false);
            setSettingsProject(null);
          }}
          onGenerateDraft={handleGenerateDraft}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;