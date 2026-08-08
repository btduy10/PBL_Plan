import React, { useState } from 'react';
import { Project, RubricCriteria, Task, Skill4C } from '../types/pbl';
import { 
  Sparkles, 
  X, 
  HelpCircle, 
  BookOpen, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Bot,
  RefreshCw
} from 'lucide-react';

interface AiAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeProject: Project;
  onUpdateProject: (updatedProject: Project) => void;
  onAddTasks: (newTasks: Omit<Task, 'id'>[]) => void;
  initialAction?: string;
}

export const AiAssistantModal: React.FC<AiAssistantModalProps> = ({
  isOpen,
  onClose,
  activeProject,
  onUpdateProject,
  onAddTasks,
  initialAction = 'generate_driving_question',
}) => {
  const [activeTab, setActiveTab] = useState<string>(initialAction);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Driving Question state
  const [topicInput, setTopicInput] = useState(activeProject.title || 'Mô hình kinh tế tuần hoàn & Tái chế nhựa');
  const [subjectInput, setSubjectInput] = useState(activeProject.subject || 'Sinh học - Địa lý - Công nghệ');
  const [gradeInput, setGradeInput] = useState(activeProject.gradeLevel || 'Khối 10-11');
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  // Rubric state
  const [generatedRubrics, setGeneratedRubrics] = useState<any[]>([]);

  // Task suggestion state
  const [generatedTasks, setGeneratedTasks] = useState<any[]>([]);

  if (!isOpen) return null;

  const handleGenerateQuestions = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/gemini/pbl-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_driving_question',
          payload: {
            topic: topicInput,
            subject: subjectInput,
            gradeLevel: gradeInput,
          },
        }),
      });

      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error);
      } else if (data.data?.drivingQuestions) {
        setGeneratedQuestions(data.data.drivingQuestions);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi gọi Gemini AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateRubrics = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/gemini/pbl-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_rubric',
          payload: {
            projectTitle: activeProject.title,
            drivingQuestion: activeProject.drivingQuestion,
          },
        }),
      });

      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error);
      } else if (data.data?.rubricCriteria) {
        setGeneratedRubrics(data.data.rubricCriteria);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi gọi Gemini AI');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateTasks = async () => {
    setIsLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/gemini/pbl-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'suggest_tasks',
          payload: {
            projectTitle: activeProject.title,
            drivingQuestion: activeProject.drivingQuestion,
            teamRoles: activeProject.members.map((m) => m.roleInGroup),
          },
        }),
      });

      const data = await res.json();
      if (data.error) {
        setErrorMsg(data.error);
      } else if (data.data?.suggestedTasks) {
        setGeneratedTasks(data.data.suggestedTasks);
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Lỗi khi gọi Gemini AI');
    } finally {
      setIsLoading(false);
    }
  };

  const applyDrivingQuestion = (qText: string) => {
    onUpdateProject({
      ...activeProject,
      drivingQuestion: qText,
    });
    alert('Đã cập nhật câu hỏi cốt lõi cho dự án!');
  };

  const applyRubricsToProject = () => {
    if (generatedRubrics.length === 0) return;
    const formattedRubrics: RubricCriteria[] = generatedRubrics.map((r, idx) => ({
      id: `rub-ai-${Date.now()}-${idx}`,
      category: r.category || 'Tư duy phản biện',
      developing: r.developing || '',
      proficient: r.proficient || '',
      exemplary: r.exemplary || '',
    }));

    onUpdateProject({
      ...activeProject,
      rubrics: formattedRubrics,
    });
    alert('Đã áp dụng bộ Rubric mới từ AI vào dự án!');
  };

  const applyTasksToKanban = () => {
    if (generatedTasks.length === 0) return;
    const formattedTasks = generatedTasks.map((t) => ({
      projectId: activeProject.id,
      title: t.title,
      description: t.description || '',
      status: 'todo' as const,
      assignedMemberId: activeProject.members[1]?.id || activeProject.members[0]?.id || '',
      skillTag: (t.skillTag as Skill4C) || 'Tư duy phản biện',
      isVoiceAndChoice: t.isVoiceAndChoice ?? true,
      dueDate: new Date(Date.now() + 14 * 24 * 3600 * 1000).toISOString().split('T')[0],
    }));

    onAddTasks(formattedTasks);
    alert(`Đã thêm ${formattedTasks.length} nhiệm vụ gợi ý vào Bảng Kanban!`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-slate-900">
        
        {/* Modal Header */}
        <div className="p-5 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-sm">
              <Bot className="w-6 h-6 font-bold" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-white flex items-center gap-2">
                Trợ Lý PBL AI Co-Pilot (Gemini 3.6 Flash)
                <Sparkles className="w-4 h-4 text-amber-300 animate-pulse" />
              </h2>
              <p className="text-xs text-slate-300">
                Thiết kế bài giảng, câu hỏi cốt lõi, tiêu chí Rubric & phân công công việc chuẩn BIE
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white transition p-1"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="flex items-center space-x-1 px-4 py-2 bg-slate-100 border-b border-slate-200 text-xs font-bold overflow-x-auto">
          <button
            onClick={() => setActiveTab('generate_driving_question')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'generate_driving_question'
                ? 'bg-white text-indigo-700 border border-slate-300 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <HelpCircle className="w-4 h-4 text-indigo-600" />
            <span>1. Câu Hỏi Cốt Lõi (Driving Question)</span>
          </button>

          <button
            onClick={() => setActiveTab('generate_rubric')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'generate_rubric'
                ? 'bg-white text-indigo-700 border border-slate-300 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4 text-indigo-600" />
            <span>2. Rubric BIE 4Cs</span>
          </button>

          <button
            onClick={() => setActiveTab('suggest_tasks')}
            className={`px-4 py-2 rounded-lg transition whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'suggest_tasks'
                ? 'bg-white text-indigo-700 border border-slate-300 shadow-2xs font-extrabold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Zap className="w-4 h-4 text-indigo-600" />
            <span>3. Gợi Ý Thẻ Kanban</span>
          </button>
        </div>

        {/* Error Alert if any */}
        {errorMsg && (
          <div className="m-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
            ⚠️ {errorMsg}
          </div>
        )}

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          
          {/* TAB 1: DRIVING QUESTION GENERATOR */}
          {activeTab === 'generate_driving_question' && (
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Chủ đề / Tên dự án</label>
                  <input
                    type="text"
                    value={topicInput}
                    onChange={(e) => setTopicInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Môn học tích hợp</label>
                  <input
                    type="text"
                    value={subjectInput}
                    onChange={(e) => setSubjectInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Khối lớp / Đối tượng</label>
                  <input
                    type="text"
                    value={gradeInput}
                    onChange={(e) => setGradeInput(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
                  />
                </div>
              </div>

              <button
                onClick={handleGenerateQuestions}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang suy nghĩ câu hỏi cốt lõi chuẩn BIE...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Tạo 3 Gợi Ý Câu Hỏi Cốt Lõi Với Gemini AI</span>
                  </>
                )}
              </button>

              {generatedQuestions.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <h4 className="font-bold text-slate-900 text-sm">Gợi ý từ Gemini AI:</h4>
                  {generatedQuestions.map((q, idx) => (
                    <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                      <p className="text-sm font-bold text-indigo-900 italic">
                        "{q.question}"
                      </p>
                      <p className="text-slate-600 text-[11px] font-medium">{q.rationale}</p>
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-[10px] text-slate-500 font-medium">
                          Sản phẩm gợi ý: {q.suggestedProducts?.join(', ')}
                        </span>
                        <button
                          onClick={() => applyDrivingQuestion(q.question)}
                          className="px-3 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-[11px] flex items-center gap-1 shadow-2xs"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Áp Dụng Câu Hỏi Này</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: RUBRIC BIE 4CS GENERATOR */}
          {activeTab === 'generate_rubric' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-indigo-600 font-bold uppercase">Dự án đang chọn</span>
                <p className="font-bold text-slate-900 text-sm">{activeProject.title}</p>
                <p className="text-xs text-slate-600 italic">"{activeProject.drivingQuestion}"</p>
              </div>

              <button
                onClick={handleGenerateRubrics}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang xây dựng ma trận Rubric 4Cs...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Tạo Ma Trận Rubric BIE 4Cs Tự Động</span>
                  </>
                )}
              </button>

              {generatedRubrics.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Ma Trận Rubric Đã Tạo:</h4>
                    <button
                      onClick={applyRubricsToProject}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Cập Nhật Vào Dự Án</span>
                    </button>
                  </div>

                  <div className="space-y-3">
                    {generatedRubrics.map((r, idx) => (
                      <div key={idx} className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
                        <span className="font-bold text-indigo-700 text-xs block">{r.category}</span>
                        <div className="grid grid-cols-3 gap-2 text-[11px]">
                          <div className="p-2 rounded-lg bg-amber-50 border border-amber-200">
                            <span className="font-bold text-amber-900 block mb-0.5">Cần cố gắng:</span>
                            <p className="text-slate-700">{r.developing}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-emerald-50 border border-emerald-200">
                            <span className="font-bold text-emerald-900 block mb-0.5">Đạt chuẩn BIE:</span>
                            <p className="text-slate-800 font-medium">{r.proficient}</p>
                          </div>
                          <div className="p-2 rounded-lg bg-cyan-50 border border-cyan-200">
                            <span className="font-bold text-cyan-900 block mb-0.5">Xuất sắc:</span>
                            <p className="text-slate-900 font-bold">{r.exemplary}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 3: KANBAN TASK SUGGESTIONS */}
          {activeTab === 'suggest_tasks' && (
            <div className="space-y-5">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                <span className="text-[10px] text-indigo-600 font-bold uppercase">Dự án & Các vai trò</span>
                <p className="font-bold text-slate-900 text-sm">{activeProject.title}</p>
                <p className="text-xs text-slate-600">
                  Thành viên: {activeProject.members.map((m) => m.name).join(', ')}
                </p>
              </div>

              <button
                onClick={handleGenerateTasks}
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm transition disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Đang chia nhỏ bài tập cho các vai trò...</span>
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 text-amber-300" />
                    <span>Gợi Ý 6-8 Nhiệm Vụ Kanban Chuẩn PBL</span>
                  </>
                )}
              </button>

              {generatedTasks.length > 0 && (
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-900 text-sm">Nhiệm Vụ Đề Xuất ({generatedTasks.length}):</h4>
                    <button
                      onClick={applyTasksToKanban}
                      className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 shadow-2xs"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Thêm Tất Cả Vào Kanban</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {generatedTasks.map((t, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1.5">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-900 text-xs">{t.title}</span>
                          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold">
                            {t.skillTag}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600">{t.description}</p>
                        <div className="pt-1 text-[10px] text-slate-500 flex justify-between font-medium">
                          <span>Phân công: {t.assignedRole}</span>
                          <span>Voice & Choice: {t.isVoiceAndChoice ? 'Có' : 'Không'}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
