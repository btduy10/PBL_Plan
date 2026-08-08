import React, { useState, useEffect } from 'react';
import { Project, Task, LearningLog, Artifact, TaskStatus, LogFeedback } from './types/pbl';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_LOGS, INITIAL_ARTIFACTS } from './data/mockData';
import { Header } from './components/Header';
import { ProjectCanvas } from './components/ProjectCanvas';
import { TaskBoard } from './components/TaskBoard';
import { ReflectionLog } from './components/ReflectionLog';
import { ArtifactGallery } from './components/ArtifactGallery';
import { AiAssistantModal } from './components/AiAssistantModal';
import { NewProjectModal } from './components/NewProjectModal';

export default function App() {
  // Local state initialized with LocalStorage fallback
  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('pbl_projects');
    return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
  });

  const [activeProjectId, setActiveProjectId] = useState<string>(() => {
    return projects[0]?.id || 'pbl-001';
  });

  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('pbl_tasks');
    return saved ? JSON.parse(saved) : INITIAL_TASKS;
  });

  const [logs, setLogs] = useState<LearningLog[]>(() => {
    const saved = localStorage.getItem('pbl_logs');
    return saved ? JSON.parse(saved) : INITIAL_LOGS;
  });

  const [artifacts, setArtifacts] = useState<Artifact[]>(() => {
    const saved = localStorage.getItem('pbl_artifacts');
    return saved ? JSON.parse(saved) : INITIAL_ARTIFACTS;
  });

  const [activeTab, setActiveTab] = useState<'canvas' | 'kanban' | 'logs' | 'gallery'>('canvas');
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);
  const [aiModalAction, setAiModalAction] = useState('generate_driving_question');
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);

  // Sync state to localStorage on changes
  useEffect(() => {
    localStorage.setItem('pbl_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('pbl_tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('pbl_logs', JSON.stringify(logs));
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('pbl_artifacts', JSON.stringify(artifacts));
  }, [artifacts]);

  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  // Handlers
  const handleUpdateProject = (updated: Project) => {
    setProjects(projects.map((p) => (p.id === updated.id ? updated : p)));
  };

  const handleCreateProject = (newProject: Project) => {
    setProjects([newProject, ...projects]);
    setActiveProjectId(newProject.id);
  };

  const handleAddTask = (newTaskData: Omit<Task, 'id'>) => {
    const newTask: Task = {
      ...newTaskData,
      id: `task-${Date.now()}`,
    };
    setTasks([newTask, ...tasks]);
  };

  const handleAddTasks = (newTasksData: Omit<Task, 'id'>[]) => {
    const createdTasks: Task[] = newTasksData.map((t, idx) => ({
      ...t,
      id: `task-${Date.now()}-${idx}`,
    }));
    setTasks([...createdTasks, ...tasks]);
  };

  const handleUpdateTaskStatus = (taskId: string, newStatus: TaskStatus) => {
    setTasks(
      tasks.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  const handleAddLog = (newLogData: Omit<LearningLog, 'id' | 'feedbacks'>) => {
    const newLog: LearningLog = {
      ...newLogData,
      id: `log-${Date.now()}`,
      feedbacks: [],
    };
    setLogs([newLog, ...logs]);
  };

  const handleAddFeedback = (logId: string, feedbackData: Omit<LogFeedback, 'id'>) => {
    const newFb: LogFeedback = {
      ...feedbackData,
      id: `fb-${Date.now()}`,
    };

    setLogs(
      logs.map((log) =>
        log.id === logId
          ? { ...log, feedbacks: [...log.feedbacks, newFb] }
          : log
      )
    );
  };

  const handleAddArtifact = (
    newArtData: Omit<Artifact, 'id' | 'likesCount' | 'comments'>
  ) => {
    const newArt: Artifact = {
      ...newArtData,
      id: `art-${Date.now()}`,
      likesCount: 0,
      comments: [],
    };
    setArtifacts([newArt, ...artifacts]);
  };

  const handleLikeArtifact = (artifactId: string) => {
    setArtifacts(
      artifacts.map((a) =>
        a.id === artifactId ? { ...a, likesCount: a.likesCount + 1 } : a
      )
    );
  };

  const handleAddArtifactComment = (artifactId: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: 'Khán giả Triển lãm',
      authorRole: 'Khách tham quan',
      text,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setArtifacts(
      artifacts.map((a) =>
        a.id === artifactId
          ? { ...a, comments: [...a.comments, newComment] }
          : a
      )
    );
  };

  const handleOpenAiAssistant = (action = 'generate_driving_question') => {
    setAiModalAction(action);
    setIsAiModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 font-sans selection:bg-indigo-600 selection:text-white pb-12">
      {/* App Header */}
      <Header
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => setActiveProjectId(id)}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onOpenAiAssistant={() => handleOpenAiAssistant('generate_driving_question')}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        {activeTab === 'canvas' && (
          <ProjectCanvas
            project={activeProject}
            onUpdateProject={handleUpdateProject}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'kanban' && (
          <TaskBoard
            projectId={activeProject.id}
            tasks={tasks}
            members={activeProject.members}
            onAddTask={handleAddTask}
            onUpdateTaskStatus={handleUpdateTaskStatus}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'logs' && (
          <ReflectionLog
            projectId={activeProject.id}
            projectTitle={activeProject.title}
            logs={logs}
            members={activeProject.members}
            onAddLog={handleAddLog}
            onAddFeedback={handleAddFeedback}
            onOpenAiAssistant={handleOpenAiAssistant}
          />
        )}

        {activeTab === 'gallery' && (
          <ArtifactGallery
            projectId={activeProject.id}
            artifacts={artifacts}
            onAddArtifact={handleAddArtifact}
            onLikeArtifact={handleLikeArtifact}
            onAddComment={handleAddArtifactComment}
          />
        )}
      </main>

      {/* Modals */}
      <AiAssistantModal
        isOpen={isAiModalOpen}
        onClose={() => setIsAiModalOpen(false)}
        activeProject={activeProject}
        onUpdateProject={handleUpdateProject}
        onAddTasks={handleAddTasks}
        initialAction={aiModalAction}
      />

      <NewProjectModal
        isOpen={isNewProjectModalOpen}
        onClose={() => setIsNewProjectModalOpen(false)}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}
