import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Project, Idea, Draft, Publication } from '../types';
import { useAuth } from '../context/AuthContext';

// Helper function to convert database row to Project type
const dbRowToProject = (row: any): Project => ({
  id: row.id,
  name: row.name,
  description: row.description,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at),
  settings: row.settings || {
    styleGuides: [],
    contentType: '',
    targetAudience: '',
    tone: '',
    referenceDocuments: [],
    rssFeeds: []
  },
  // Ensure referenceDocuments have proper Date objects for uploadedAt
  ...(row.settings?.referenceDocuments && {
    settings: {
      ...row.settings,
      referenceDocuments: row.settings.referenceDocuments.map((doc: any) => ({
        ...doc,
        uploadedAt: new Date(doc.uploadedAt)
      }))
    }
  })
});

// Helper function to convert database row to Idea type
const dbRowToIdea = (row: any): Idea => ({
  id: row.id,
  projectId: row.project_id,
  title: row.title,
  description: row.description,
  category: row.category,
  source: row.source as any,
  sourceData: row.source_data,
  createdAt: new Date(row.created_at),
  status: row.status as any
});

// Helper function to convert database row to Draft type
const dbRowToDraft = (row: any): Draft => ({
  id: row.id,
  ideaId: row.idea_id,
  projectId: row.project_id,
  title: row.title,
  content: row.content,
  version: row.version,
  analysis: row.analysis,
  createdAt: new Date(row.created_at),
  updatedAt: new Date(row.updated_at)
});

// Helper function to convert database row to Publication type
const dbRowToPublication = (row: any): Publication => ({
  id: row.id,
  projectId: row.project_id,
  ideaId: row.idea_id,
  title: row.title,
  content: row.content,
  platform: row.platform,
  publishedAt: new Date(row.published_at),
  analysis: row.analysis || {},
  performance: row.performance
});

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchProjects = async () => {
    if (!user) {
      setProjects([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setProjects(data.map(dbRowToProject));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const createProject = async (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (!user) throw new Error('User not authenticated');

    console.log('Creating project with data:', projectData);

    const { data, error } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: projectData.name,
        description: projectData.description,
        settings: projectData.settings
      })
      .select()
      .single();

    if (error) {
      console.error('Supabase error creating project:', error);
      throw error;
    }

    console.log('Project created successfully:', data);

    const newProject = dbRowToProject(data);
    setProjects(prev => [newProject, ...prev]);
    return newProject;
  };

  const updateProject = async (id: string, updates: Partial<Project>) => {
    const { data, error } = await supabase
      .from('projects')
      .update({
        name: updates.name,
        description: updates.description,
        settings: updates.settings,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const updatedProject = dbRowToProject(data);
    setProjects(prev => prev.map(p => p.id === id ? updatedProject : p));
    return updatedProject;
  };

  const deleteProject = async (id: string) => {
    const { error } = await supabase
      .from('projects')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setProjects(prev => prev.filter(p => p.id !== id));
  };

  return {
    projects,
    loading,
    error,
    createProject,
    updateProject,
    deleteProject,
    refetch: fetchProjects
  };
}

export function useIdeas() {
  const [ideas, setIdeas] = useState<Idea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchIdeas = async () => {
    if (!user) {
      setIdeas([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('ideas')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setIdeas(data.map(dbRowToIdea));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching ideas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIdeas();
  }, [user]);

  const createIdea = async (ideaData: Omit<Idea, 'id' | 'createdAt'>) => {
    const { data, error } = await supabase
      .from('ideas')
      .insert({
        project_id: ideaData.projectId,
        title: ideaData.title,
        description: ideaData.description,
        category: ideaData.category,
        source: ideaData.source,
        source_data: ideaData.sourceData,
        status: ideaData.status
      })
      .select()
      .single();

    if (error) throw error;

    const newIdea = dbRowToIdea(data);
    setIdeas(prev => [newIdea, ...prev]);
    return newIdea;
  };

  const updateIdea = async (id: string, updates: Partial<Idea>) => {
    const { data, error } = await supabase
      .from('ideas')
      .update({
        title: updates.title,
        description: updates.description,
        category: updates.category,
        status: updates.status
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const updatedIdea = dbRowToIdea(data);
    setIdeas(prev => prev.map(i => i.id === id ? updatedIdea : i));
    return updatedIdea;
  };

  const deleteIdea = async (id: string) => {
    const { error } = await supabase
      .from('ideas')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setIdeas(prev => prev.filter(i => i.id !== id));
  };

  return {
    ideas,
    loading,
    error,
    createIdea,
    updateIdea,
    deleteIdea,
    refetch: fetchIdeas
  };
}

export function useDrafts() {
  const [drafts, setDrafts] = useState<Draft[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchDrafts = async () => {
    if (!user) {
      setDrafts([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('drafts')
        .select('*')
        .order('updated_at', { ascending: false });

      if (error) throw error;

      setDrafts(data.map(dbRowToDraft));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching drafts');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrafts();
  }, [user]);

  const createDraft = async (draftData: Omit<Draft, 'id' | 'createdAt' | 'updatedAt'>) => {
    const { data, error } = await supabase
      .from('drafts')
      .insert({
        idea_id: draftData.ideaId || null, // Allow null for manual drafts
        project_id: draftData.projectId,
        title: draftData.title,
        content: draftData.content,
        version: draftData.version,
        analysis: draftData.analysis
      })
      .select()
      .single();

    if (error) throw error;

    const newDraft = dbRowToDraft(data);
    setDrafts(prev => [newDraft, ...prev]);
    return newDraft;
  };

  const updateDraft = async (id: string, updates: Partial<Draft>) => {
    console.log('Updating draft with analysis:', updates.analysis);
    const { data, error } = await supabase
      .from('drafts')
      .update({
        title: updates.title,
        content: updates.content,
        analysis: updates.analysis,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const updatedDraft = dbRowToDraft(data);
    console.log('Draft updated successfully:', updatedDraft);
    setDrafts(prev => prev.map(d => d.id === id ? updatedDraft : d));
    return updatedDraft;
  };

  const deleteDraft = async (id: string) => {
    const { error } = await supabase
      .from('drafts')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setDrafts(prev => prev.filter(d => d.id !== id));
  };

  return {
    drafts,
    loading,
    error,
    createDraft,
    updateDraft,
    deleteDraft,
    refetch: fetchDrafts
  };
}

export function usePublications() {
  const [publications, setPublications] = useState<Publication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  const fetchPublications = async () => {
    if (!user) {
      setPublications([]);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('publications')
        .select('*')
        .order('published_at', { ascending: false });

      if (error) throw error;

      setPublications(data.map(dbRowToPublication));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching publications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [user]);

  const createPublication = async (publicationData: Omit<Publication, 'id'>) => {
    const { data, error } = await supabase
      .from('publications')
      .insert({
        project_id: publicationData.projectId,
        idea_id: publicationData.ideaId,
        title: publicationData.title,
        content: publicationData.content,
        platform: publicationData.platform,
        published_at: publicationData.publishedAt.toISOString(),
        analysis: publicationData.analysis,
        performance: publicationData.performance
      })
      .select()
      .single();

    if (error) throw error;

    const newPublication = dbRowToPublication(data);
    setPublications(prev => [newPublication, ...prev]);
    return newPublication;
  };

  const updatePublication = async (id: string, updates: Partial<Publication>) => {
    const { data, error } = await supabase
      .from('publications')
      .update({
        idea_id: updates.ideaId,
        title: updates.title,
        content: updates.content,
        platform: updates.platform,
        analysis: updates.analysis,
        performance: updates.performance
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    const updatedPublication = dbRowToPublication(data);
    setPublications(prev => prev.map(p => p.id === id ? updatedPublication : p));
    return updatedPublication;
  };

  const deletePublication = async (id: string) => {
    const { error } = await supabase
      .from('publications')
      .delete()
      .eq('id', id);

    if (error) throw error;

    setPublications(prev => prev.filter(p => p.id !== id));
  };

  return {
    publications,
    loading,
    error,
    createPublication,
    updatePublication,
    deletePublication,
    refetch: fetchPublications
  };
}