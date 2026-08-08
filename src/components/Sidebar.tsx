import React, { useState } from 'react';
import { 
  Project 
} from '../types/pbl';
import { 
  Layers, 
  FolderKanban, 
  MessageSquareHeart, 
  Presentation, 
  Sparkles, 
  Plus, 
  ChevronDown,
  Award, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';

interface SidebarProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  activeTab: 'canvas' | 'kanban' | 'logs' | 'gallery';
  onChangeTab: (tab: 'canvas' | 'kanban' | 'logs' | 'gallery') => void;
  onOpenNewProject: () => void;
  onOpenAiAssistant: () => void;
  taskCount?: number;
  logCount?: number;
  artifactCount?: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  activeTab,
  onChangeTab,
  onOpenNewProject,
  onOpenAiAssistant,
  taskCount = 0,
  logCount = 0,
  artifactCount = 0,
}) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const activeProject = projects.find((p) => p.id === activeProjectId) || projects[0];

  const navItems = [
    {
      id: 'canvas' as const,
      label: 'Không Gian Canvas',
      icon: Layers,
      description: 'Khung dự án & Tiêu chuẩn BIE',
    },
    {
      id: 'kanban' as const,
      label: 'Nhiệm Vụ Kanban',
      icon: FolderKanban,
      description: 'Quản lý công việc nhóm',
      badge: taskCount > 0 ? taskCount : undefined,
    },
    {
      id: 'logs' as const,
      label: 'Nhật Ký & Phản Hồi 4C',
      icon: MessageSquareHeart,
      description: 'Phản tư & Đánh giá 4C',
      badge: logCount > 0 ? logCount : undefined,
    },
    {
      id: 'gallery' as const,
      label: 'Sản Phẩm Triển Lãm',
      icon: Presentation,
      description: 'Kho lưu trữ & Triển lãm',
      badge: artifactCount > 0 ? artifactCount : undefined,
    },
  ];

  const sidebarContent = (
    <div className="flex flex-col h-full bg-slate-900 text-slate-200 border-r border-slate-800 select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-800/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm">
            P
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-base font-extrabold text-white tracking-tight leading-none">
                PBL <span className="text-indigo-400">Architect</span>
              </h1>
            </div>
            <span className="text-[10px] text-slate-400 font-semibold flex items-center gap-1 mt-0.5">
              <Award className="w-3 h-3 text-amber-400" /> BIE Gold Standard
            </span>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden text-slate-400 hover:text-white p-1 rounded-lg"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Project Switcher Section */}
      <div className="p-4 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-400 uppercase tracking-wider mb-2">
          <span>Dự Án Đang Chọn</span>
          <button
            onClick={onOpenNewProject}
            className="text-indigo-400 hover:text-indigo-300 flex items-center gap-1 text-[11px] normal-case font-bold transition hover:underline"
            title="Tạo dự án mới"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Tạo mới</span>
          </button>
        </div>

        <div className="relative">
          <select
            value={activeProjectId}
            onChange={(e) => onSelectProject(e.target.value)}
            className="w-full bg-slate-800/90 hover:bg-slate-800 text-white text-xs font-bold border border-slate-700/80 rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer appearance-none transition"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id} className="bg-slate-900 text-white py-1">
                {proj.title} ({proj.gradeLevel})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {activeProject && (
          <div className="mt-2.5 p-2 rounded-lg bg-slate-800/50 border border-slate-700/40 text-[11px]">
            <div className="flex items-center justify-between text-slate-300 font-semibold">
              <span className="text-indigo-300 font-bold truncate">{activeProject.subject}</span>
              <span className="text-slate-400 shrink-0 ml-1">{activeProject.gradeLevel}</span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation Links - Fully Prominent */}
      <div className="p-3 space-y-1.5 flex-1">
        <div className="px-2 text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-2">
          Điều Hướng Dự Án
        </div>

        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                onChangeTab(item.id);
                setIsMobileOpen(false);
              }}
              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition group ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-sm ring-1 ring-indigo-400/50'
                  : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-indigo-400'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="leading-tight text-xs font-extrabold">{item.label}</div>
                  <div className={`text-[10px] font-normal mt-0.5 ${isActive ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  isActive ? 'bg-indigo-700 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Assistant Quick Trigger */}
      <div className="p-3 m-3 rounded-2xl bg-gradient-to-b from-slate-800/90 to-slate-800 border border-slate-700/80 text-xs shrink-0">
        <div className="flex items-center gap-2 text-indigo-300 font-bold mb-1">
          <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
          <span>Trợ Lý AI PBL</span>
        </div>
        <p className="text-[10px] text-slate-400 mb-2 leading-relaxed">
          Tự động gợi ý Driving Question, Rubric 4C & Thẻ Kanban.
        </p>
        <button
          onClick={onOpenAiAssistant}
          className="w-full py-2 px-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Kích Hoạt Trợ Lý AI</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-slate-800/80 text-[11px] text-slate-400 flex items-center justify-between shrink-0">
        <span className="flex items-center gap-1 text-[10px]">
          <BookOpen className="w-3.5 h-3.5 text-slate-400" /> PBL Works BIE
        </span>
        <span className="font-mono text-[10px] text-slate-400">v2.0</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between text-white">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsMobileOpen(true)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="h-7 w-7 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-extrabold text-sm">
              P
            </div>
            <span className="font-extrabold text-sm tracking-tight">PBL Architect</span>
          </div>
        </div>

        <button
          onClick={onOpenAiAssistant}
          className="p-2 rounded-lg bg-indigo-600 text-white text-xs font-bold flex items-center gap-1"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>AI</span>
        </button>
      </div>

      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 h-screen sticky top-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile Slide-over Sidebar Drawer */}
      {isMobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex">
          <div className="w-72 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}
    </>
  );
};
