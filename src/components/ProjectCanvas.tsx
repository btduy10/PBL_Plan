import React, { useState } from 'react';
import { Project, Milestone } from '../types/pbl';
import { 
  CheckCircle, 
  Circle, 
  Calendar, 
  Users, 
  HelpCircle, 
  Sparkles, 
  CheckSquare, 
  Award,
  Layers,
  Compass,
  Zap,
  BookOpen
} from 'lucide-react';

interface ProjectCanvasProps {
  project: Project;
  onUpdateProject: (updated: Project) => void;
  onOpenAiAssistant: (initialAction?: string) => void;
}

export const ProjectCanvas: React.FC<ProjectCanvasProps> = ({
  project,
  onUpdateProject,
  onOpenAiAssistant,
}) => {
  const [activePhaseFilter, setActivePhaseFilter] = useState<string>('all');

  const toggleBieStandard = (key: keyof Project['bieStandards']) => {
    onUpdateProject({
      ...project,
      bieStandards: {
        ...project.bieStandards,
        [key]: !project.bieStandards[key],
      },
    });
  };

  const toggleMilestone = (milestoneId: string) => {
    const updatedMilestones = project.milestones.map((ms) =>
      ms.id === milestoneId ? { ...ms, completed: !ms.completed } : ms
    );
    onUpdateProject({
      ...project,
      milestones: updatedMilestones,
    });
  };

  const filteredMilestones = project.milestones.filter((ms) =>
    activePhaseFilter === 'all' ? true : ms.phase === activePhaseFilter
  );

  const completedMilestones = project.milestones.filter((ms) => ms.completed).length;
  const progressPercent = project.milestones.length > 0 
    ? Math.round((completedMilestones / project.milestones.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 pb-12">
      {/* Driving Question Hero Banner */}
      <div className="rounded-2xl bg-white p-6 sm:p-7 border border-slate-200 shadow-2xs text-slate-900 space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 text-[11px] font-bold bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-200/80">
              PBL BIE Standard
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-lg">
              Môn: {project.subject}
            </span>
            <span className="px-2.5 py-1 text-[11px] font-semibold bg-slate-100 text-slate-700 rounded-lg">
              Khối: {project.gradeLevel}
            </span>
          </div>
          
          <button
            onClick={() => onOpenAiAssistant('generate_driving_question')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 text-xs font-bold border border-slate-200 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>AI gợi ý lại Driving Question</span>
          </button>
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            {project.title}
          </h2>
          <p className="mt-1 text-slate-600 text-xs sm:text-sm leading-relaxed max-w-4xl">
            {project.description}
          </p>
        </div>

        {/* Driving Question Card */}
        <div className="p-4 sm:p-5 rounded-xl bg-indigo-50/50 border border-indigo-100">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-100/80 text-indigo-700 shrink-0 mt-0.5">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <span className="text-[10px] font-extrabold text-indigo-600 uppercase tracking-wider">
                Câu Hỏi Cốt Lõi (Driving Question)
              </span>
              <p className="text-sm sm:text-lg font-bold text-slate-900 leading-snug italic">
                "{project.drivingQuestion}"
              </p>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-500 font-medium border-t border-slate-100">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-indigo-600" />
            <span>Thời gian: {project.startDate} — {project.endDate}</span>
          </div>
          <div className="flex items-center gap-3">
            <span>Tiến độ ({completedMilestones}/{project.milestones.length} mốc)</span>
            <div className="w-28 bg-slate-100 h-2 rounded-full overflow-hidden">
              <div 
                className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
            <span className="font-bold text-slate-900">{progressPercent}%</span>
          </div>
        </div>
      </div>

      {/* Grid: 7 Gold Standards & Team Members */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* 7 BIE Gold Standards Checklist */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs text-slate-900">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-amber-500" />
              <h3 className="font-bold text-base text-slate-900">
                7 Tiêu Chuẩn Vàng BIE
              </h3>
            </div>
            <span className="text-xs text-slate-400 font-medium">BIE Gold Standard</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {[
              { key: 'keyKnowledge' as const, title: '1. Kiến thức & Kỹ năng cốt lõi', desc: 'Mục tiêu môn học tích hợp' },
              { key: 'challengingProblem' as const, title: '2. Vấn đề thử thách', desc: 'Thúc đẩy tư duy sâu' },
              { key: 'sustainedInquiry' as const, title: '3. Khám phá kéo dài', desc: 'Thu thập dữ liệu liên tục' },
              { key: 'authenticity' as const, title: '4. Tính thực tế & Ý nghĩa', desc: 'Gắn liền với đời sống' },
              { key: 'studentVoiceChoice' as const, title: '5. Quyền tự chủ (Voice & Choice)', desc: 'Học sinh lựa chọn' },
              { key: 'reflection' as const, title: '6. Nhật ký phản hồi', desc: 'Soi chiếu tiến trình' },
              { key: 'publicProduct' as const, title: '7. Sản phẩm công khai', desc: 'Trưng bày giải pháp' },
            ].map((item) => {
              const isChecked = project.bieStandards[item.key];
              return (
                <div
                  key={item.key}
                  onClick={() => toggleBieStandard(item.key)}
                  className={`p-3 rounded-xl border transition cursor-pointer flex items-center justify-between gap-2 ${
                    isChecked
                      ? 'bg-slate-50 border-slate-300 text-slate-900'
                      : 'bg-white border-slate-200 text-slate-400 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    {isChecked ? (
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                    )}
                    <div>
                      <h4 className={`text-xs font-bold ${isChecked ? 'text-slate-900' : 'text-slate-600'}`}>
                        {item.title}
                      </h4>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Team Members & Roles */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs text-slate-900 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-slate-100">
              <Users className="w-4 h-4 text-indigo-600" />
              <h3 className="font-bold text-base text-slate-900">
                Thành Viên Nhóm
              </h3>
            </div>

            <div className="space-y-2.5">
              {project.members.map((member) => (
                <div
                  key={member.id}
                  className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/80 flex items-center gap-3"
                >
                  <img
                    src={member.avatar}
                    alt={member.name}
                    className="w-8 h-8 rounded-full object-cover border border-white shadow-2xs"
                  />
                  <div className="overflow-hidden">
                    <p className="text-xs font-bold text-slate-900 truncate">
                      {member.name}
                    </p>
                    <span className="text-[10px] font-semibold text-indigo-700">
                      {member.roleInGroup}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <button
              onClick={() => onOpenAiAssistant('suggest_tasks')}
              className="w-full py-2 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-xs font-bold text-slate-700 border border-slate-200 flex items-center justify-center gap-1.5 transition"
            >
              <Zap className="w-3.5 h-3.5 text-amber-500" />
              <span>Gợi ý phân công AI</span>
            </button>
          </div>
        </div>

      </div>

      {/* Milestones & Timeline Phase */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Cột Mốc & Tiến Trình Dự Án (Milestones)
              </h3>
              <p className="text-xs text-slate-500">
                Các giai đoạn quan trọng từ Khởi động đến Triển lãm công khai
              </p>
            </div>
          </div>

          {/* Phase Filter Buttons */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
            {[
              { id: 'all', label: 'Tất cả mốc' },
              { id: 'launch', label: '🚀 Khởi động' },
              { id: 'investigation', label: '🔍 Khám phá' },
              { id: 'creation', label: '🛠️ Chế tạo' },
              { id: 'exhibition', label: '🎪 Triển lãm' },
            ].map((phase) => (
              <button
                key={phase.id}
                onClick={() => setActivePhaseFilter(phase.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                  activePhaseFilter === phase.id
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {phase.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMilestones.map((ms) => (
            <div
              key={ms.id}
              className={`p-4 rounded-xl border transition flex items-start gap-3.5 ${
                ms.completed
                  ? 'bg-slate-50 border-slate-200 opacity-75'
                  : 'bg-white border-slate-200 hover:border-indigo-300 shadow-2xs'
              }`}
            >
              <button
                onClick={() => toggleMilestone(ms.id)}
                className="mt-0.5 text-slate-400 hover:text-indigo-600 transition"
              >
                {ms.completed ? (
                  <CheckSquare className="w-5 h-5 text-indigo-600" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300" />
                )}
              </button>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <h4 className={`text-sm font-bold ${ms.completed ? 'line-through text-slate-400' : 'text-slate-900'}`}>
                    {ms.title}
                  </h4>
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200 shrink-0">
                    📅 {ms.dueDate}
                  </span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {ms.description}
                </p>
                <div className="pt-1">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Giai đoạn: {ms.phase === 'launch' ? 'Khởi động' : ms.phase === 'investigation' ? 'Khám phá' : ms.phase === 'creation' ? 'Chế tạo' : 'Triển lãm'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rubric Matrix 4Cs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-slate-900">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-indigo-50 text-indigo-600 border border-indigo-200">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-lg text-slate-900">
                Bộ Tiêu Chí Đánh Giá BIE (Rubric Matrix 4Cs)
              </h3>
              <p className="text-xs text-slate-500">
                Xác định mong đợi đầu ra theo 3 mức độ cho Tư duy phản biện, Sáng tạo, Hợp tác & Giao tiếp
              </p>
            </div>
          </div>

          <button
            onClick={() => onOpenAiAssistant('generate_rubric')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold border border-indigo-200 transition"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Tạo Rubric AI mới</span>
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-200">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3.5 w-1/4 uppercase tracking-wider">Kỹ năng / Tiêu chí</th>
                <th className="p-3.5 w-1/4 text-amber-800 bg-amber-50 uppercase tracking-wider">Cần Cố Gắng (Developing)</th>
                <th className="p-3.5 w-1/4 text-emerald-800 bg-emerald-50 uppercase tracking-wider">Đạt Chuẩn (Proficient)</th>
                <th className="p-3.5 w-1/4 text-indigo-800 bg-indigo-50 uppercase tracking-wider">Xuất Sắc (Exemplary)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white">
              {project.rubrics.map((rubric) => (
                <tr key={rubric.id} className="hover:bg-slate-50/80 transition">
                  <td className="p-3.5 font-bold text-slate-900 bg-slate-50/60 align-top">
                    <span className="text-indigo-700 font-extrabold">{rubric.category}</span>
                  </td>
                  <td className="p-3.5 text-slate-700 align-top bg-amber-50/30 leading-relaxed">
                    {rubric.developing}
                  </td>
                  <td className="p-3.5 text-slate-800 align-top bg-emerald-50/30 leading-relaxed font-medium">
                    {rubric.proficient}
                  </td>
                  <td className="p-3.5 text-slate-900 align-top bg-indigo-50/30 leading-relaxed font-semibold">
                    {rubric.exemplary}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
