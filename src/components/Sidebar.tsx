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
  onOpenDataManagement?: () => void;
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
  onOpenDataManagement,
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
    <div className="flex flex-col h-full bg-white text-slate-800 border-r border-slate-200 select-none overflow-y-auto">
      {/* Brand Header */}
      <div className="p-4 border-b border-slate-100 flex items-center justify-center relative shrink-0 bg-blue-600 text-white text-center">
        <h1 className="text-lg font-black text-white tracking-tight leading-none text-center">
          AI - PROJECT
        </h1>

        {/* Mobile close button */}
        <button
          onClick={() => setIsMobileOpen(false)}
          className="lg:hidden text-blue-100 hover:text-white p-1 rounded-lg absolute right-3"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Project Switcher Section */}
      <div className="p-4 border-b border-slate-100 bg-slate-50/80 shrink-0">
        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-500 uppercase tracking-wider mb-2">
          <span>Dự Án Đang Chọn</span>
          <button
            onClick={onOpenNewProject}
            className="text-blue-600 hover:text-blue-700 flex items-center gap-1 text-[11px] normal-case font-extrabold transition hover:underline"
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
            className="w-full bg-white hover:bg-slate-50 text-slate-800 text-xs font-bold border border-slate-200 rounded-xl px-3 py-2.5 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer appearance-none transition shadow-2xs"
          >
            {projects.map((proj) => (
              <option key={proj.id} value={proj.id} className="bg-white text-slate-900 py-1">
                {proj.title} ({proj.gradeLevel})
              </option>
            ))}
          </select>
          <ChevronDown className="w-4 h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {activeProject && (
          <div className="mt-2.5 p-2 rounded-lg bg-white border border-slate-200/80 text-[11px] shadow-2xs">
            <div className="flex items-center justify-between text-slate-700 font-semibold">
              <span className="text-blue-700 font-bold truncate">{activeProject.subject}</span>
              <span className="text-slate-500 shrink-0 ml-1 font-medium">{activeProject.gradeLevel}</span>
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
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-700 hover:bg-blue-50/80 hover:text-blue-700'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-blue-100 group-hover:text-blue-600 transition'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="text-left">
                  <div className="leading-tight text-xs font-extrabold">{item.label}</div>
                  <div className={`text-[10px] font-normal mt-0.5 ${isActive ? 'text-blue-100' : 'text-slate-500'}`}>
                    {item.description}
                  </div>
                </div>
              </div>

              {item.badge !== undefined && (
                <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold ${
                  isActive ? 'bg-blue-700 text-white' : 'bg-blue-50 text-blue-700 border border-blue-100'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* AI Assistant Quick Trigger */}
      <div className="p-3.5 m-3 rounded-2xl bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-50 border border-blue-200/80 text-xs shrink-0 shadow-2xs">
        <div className="flex items-center gap-2 text-blue-900 font-bold mb-1">
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>Trợ Lý AI PBL</span>
        </div>
        <p className="text-[10px] text-slate-600 mb-2.5 leading-relaxed">
          Tự động gợi ý Driving Question, Rubric 4C & Thẻ Kanban.
        </p>
        <button
          onClick={onOpenAiAssistant}
          className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>Kích Hoạt Trợ Lý AI</span>
        </button>
      </div>

      {/* Footer Info */}
      <div className="px-4 py-3 border-t border-slate-100 text-[11px] text-slate-500 flex items-center justify-between shrink-0 bg-slate-50/50">
        <span className="flex items-center gap-1 text-[10px]">
          <BookOpen className="w-3.5 h-3.5 text-blue-600" /> PBL Works BIE
        </span>
        <span className="font-mono text-[10px] text-slate-400">v2.0</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Top Header Bar */}
      <div className="lg:hidden sticky top-0 z-30 bg-blue-600 border-b border-blue-700 px-4 py-3 flex items-center justify-between text-white">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="p-1.5 rounded-lg bg-blue-700 text-blue-100 hover:text-white"
        >
          <Menu className="w-5 h-5" />
        </button>
        <span className="font-black text-base tracking-tight text-white text-center flex-1 mx-2">
          AI - PROJECT
        </span>

        <button
          onClick={onOpenAiAssistant}
          className="p-2 rounded-lg bg-white/20 text-white text-xs font-bold flex items-center gap-1 border border-white/30"
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
        <div className="lg:hidden fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex">
          <div className="w-72 max-w-[80vw] h-full shadow-2xl">
            {sidebarContent}
          </div>
          <div className="flex-1" onClick={() => setIsMobileOpen(false)} />
        </div>
      )}
    </>
  );
};
