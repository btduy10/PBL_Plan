import React, { useState, useEffect } from 'react';
import { Project, Task, LearningLog, Artifact, TaskStatus, LogFeedback } from './types/pbl';
import { INITIAL_PROJECTS, INITIAL_TASKS, INITIAL_LOGS, INITIAL_ARTIFACTS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { ProjectCanvas } from './components/ProjectCanvas';
import { TaskBoard } from './components/TaskBoard';
import { ReflectionLog } from './components/ReflectionLog';
import { ArtifactGallery } from './components/ArtifactGallery';
import { AiAssistantModal } from './components/AiAssistantModal';
import { NewProjectModal } from './components/NewProjectModal';
import { Sparkles, Plus, Layers, FolderKanban, MessageSquareHeart, Presentation, Award } from 'lucide-react';

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

  // Counts for active project
  const projectTasksCount = tasks.filter((t) => t.projectId === activeProject.id).length;
  const projectLogsCount = logs.filter((l) => l.projectId === activeProject.id).length;
  const projectArtifactsCount = artifacts.filter((a) => a.projectId === activeProject.id).length;

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

  // Section details map
  const sectionMeta = {
    canvas: {
      title: 'Không Gian Dự Án (Canvas)',
      subtitle: 'Xây dựng mục tiêu, Driving Question & Đánh giá 7 tiêu chuẩn BIE',
      icon: Layers,
    },
    kanban: {
      title: 'Bảng Nhiệm Vụ (Kanban)',
      subtitle: 'Theo dõi tiến độ, phân công vai trò & thúc đẩy sự tự chủ Voice & Choice',
      icon: FolderKanban,
    },
    logs: {
      title: 'Nhật Ký & Phản Hồi 4C',
      subtitle: 'Ghi chép tiến trình, phản tư 4Cs & nhận góp ý từ giáo viên / chuyên gia',
      icon: MessageSquareHeart,
    },
    gallery: {
      title: 'Kho Sản Phẩm Triển Lãm',
      subtitle: 'Lưu trữ & Công khai sản phẩm học tập (Public Product) chuẩn BIE Works',
      icon: Presentation,
    },
  }[activeTab];

  const SectionIcon = sectionMeta.icon;

  return (
    <div className="min-h-screen bg-[#F4F7FA] text-slate-900 font-sans selection:bg-blue-600 selection:text-white flex flex-col lg:flex-row">
      {/* Left Sidebar Menu */}
      <Sidebar
        projects={projects}
        activeProjectId={activeProjectId}
        onSelectProject={(id) => setActiveProjectId(id)}
        activeTab={activeTab}
        onChangeTab={(tab) => setActiveTab(tab)}
        onOpenNewProject={() => setIsNewProjectModalOpen(true)}
        onOpenAiAssistant={() => handleOpenAiAssistant('generate_driving_question')}
        taskCount={projectTasksCount}
        logCount={projectLogsCount}
        artifactCount={projectArtifactsCount}
      />

      {/* Main Content Viewport */}
      <div className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Top Header Bar inside Main Viewport */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-blue-100 px-4 sm:px-8 py-3.5 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 shrink-0">
              <SectionIcon className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight leading-none">
                {sectionMeta.title}
              </h1>
              <p className="text-xs text-slate-500 font-medium hidden sm:block mt-0.5">
                {sectionMeta.subtitle}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsNewProjectModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">Dự án mới</span>
            </button>

            <button
              onClick={() => handleOpenAiAssistant('generate_driving_question')}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Trợ lý AI</span>
            </button>
          </div>
        </header>

        {/* Main Content Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
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
      </div>

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

