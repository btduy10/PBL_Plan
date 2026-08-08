import React from 'react';
import { Project } from '../types/pbl';
import { 
  FolderKanban, 
  Sparkles, 
  Plus, 
  Layers, 
  MessageSquareHeart, 
  Presentation,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  projects: Project[];
  activeProjectId: string;
  onSelectProject: (id: string) => void;
  activeTab: 'canvas' | 'kanban' | 'logs' | 'gallery';
  onChangeTab: (tab: 'canvas' | 'kanban' | 'logs' | 'gallery') => void;
  onOpenNewProject: () => void;
  onOpenAiAssistant: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  projects,
  activeProjectId,
  onSelectProject,
  activeTab,
  onChangeTab,
  onOpenNewProject,
  onOpenAiAssistant,
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200 text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Navbar */}
        <div className="h-16 flex items-center justify-between gap-4">
          
          {/* Logo & Project Switcher */}
          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-2.5">
              <div className="h-9 w-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-2xs">
                P
              </div>
              <div>
                <h1 className="text-base font-extrabold tracking-tight text-slate-900 leading-none">
                  PBL <span className="text-indigo-600">Architect</span>
                </h1>
                <span className="text-[10px] text-slate-400 font-medium">BIE Standard</span>
              </div>
            </div>

            <div className="h-5 w-px bg-slate-200 hidden sm:block" />

            {/* Project Switcher */}
            <div className="relative">
              <select
                value={activeProjectId}
                onChange={(e) => onSelectProject(e.target.value)}
                className="bg-slate-50 hover:bg-slate-100 text-slate-800 text-xs font-bold border border-slate-200 rounded-xl px-3 py-1.5 pr-7 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition appearance-none"
              >
                {projects.map((proj) => (
                  <option key={proj.id} value={proj.id}>
                    {proj.title} ({proj.gradeLevel})
                  </option>
                ))}
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-slate-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenNewProject}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold border border-slate-200 transition shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span className="hidden sm:inline">Dự án mới</span>
            </button>

            <button
              onClick={onOpenAiAssistant}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition shadow-2xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>Trợ lý AI</span>
            </button>
          </div>
        </div>

        {/* Minimal Navigation Tabs */}
        <div className="flex items-center space-x-1 overflow-x-auto scrollbar-none pb-2 pt-1 border-t border-slate-100">
          {[
            { id: 'canvas' as const, label: 'Không gian Canvas', icon: Layers },
            { id: 'kanban' as const, label: 'Nhiệm vụ Kanban', icon: FolderKanban },
            { id: 'logs' as const, label: 'Nhật ký & Phản hồi 4C', icon: MessageSquareHeart },
            { id: 'gallery' as const, label: 'Kho sản phẩm Triển lãm', icon: Presentation },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onChangeTab(tab.id)}
                className={`flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold rounded-lg transition whitespace-nowrap ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200/80 shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};

