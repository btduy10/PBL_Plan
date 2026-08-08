import React, { useState } from 'react';
import { Task, Member, TaskStatus, Skill4C } from '../types/pbl';
import { 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Filter, 
  User, 
  Tag, 
  Volume2, 
  ArrowRight, 
  ArrowLeft,
  X,
  Zap
} from 'lucide-react';

interface TaskBoardProps {
  projectId: string;
  tasks: Task[];
  members: Member[];
  onAddTask: (task: Omit<Task, 'id'>) => void;
  onUpdateTaskStatus: (taskId: string, newStatus: TaskStatus) => void;
  onOpenAiAssistant: (action?: string) => void;
}

export const TaskBoard: React.FC<TaskBoardProps> = ({
  projectId,
  tasks,
  members,
  onAddTask,
  onUpdateTaskStatus,
  onOpenAiAssistant,
}) => {
  const [selectedMemberFilter, setSelectedMemberFilter] = useState<string>('all');
  const [selectedSkillFilter, setSelectedSkillFilter] = useState<string>('all');
  const [showVoiceChoiceOnly, setShowVoiceChoiceOnly] = useState<boolean>(false);
  const [isNewTaskModalOpen, setIsNewTaskModalOpen] = useState<boolean>(false);

  // New task form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newAssignedId, setNewAssignedId] = useState(members[1]?.id || members[0]?.id || '');
  const [newSkillTag, setNewSkillTag] = useState<Skill4C>('Tư duy phản biện');
  const [newIsVoiceChoice, setNewIsVoiceChoice] = useState(true);
  const [newChoiceNote, setNewChoiceNote] = useState('');
  const [newDueDate, setNewDueDate] = useState('2026-11-01');

  const filteredTasks = tasks.filter((task) => {
    if (task.projectId !== projectId) return false;
    if (selectedMemberFilter !== 'all' && task.assignedMemberId !== selectedMemberFilter) return false;
    if (selectedSkillFilter !== 'all' && task.skillTag !== selectedSkillFilter) return false;
    if (showVoiceChoiceOnly && !task.isVoiceAndChoice) return false;
    return true;
  });

  const columns: { status: TaskStatus; title: string; color: string }[] = [
    {
      status: 'todo',
      title: 'Cần Làm',
      color: 'text-slate-700',
    },
    {
      status: 'in_progress',
      title: 'Đang Thực Hiện',
      color: 'text-blue-700',
    },
    {
      status: 'review',
      title: 'Chờ Duyệt',
      color: 'text-purple-700',
    },
    {
      status: 'done',
      title: 'Hoàn Thành',
      color: 'text-emerald-700',
    },
  ];

  const handleCreateTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddTask({
      projectId,
      title: newTitle.trim(),
      description: newDescription.trim(),
      status: 'todo',
      assignedMemberId: newAssignedId,
      skillTag: newSkillTag,
      isVoiceAndChoice: newIsVoiceChoice,
      choiceNote: newChoiceNote.trim() || undefined,
      dueDate: newDueDate,
    });

    setNewTitle('');
    setNewDescription('');
    setNewChoiceNote('');
    setIsNewTaskModalOpen(false);
  };

  const getMember = (id: string) => members.find((m) => m.id === id);

  return (
    <div className="space-y-6 pb-12">
      {/* Top Header & Filters */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
            Bảng Nhiệm Vụ Nhóm (Kanban)
            <span className="px-2.5 py-0.5 text-xs bg-indigo-50 text-indigo-700 font-bold rounded-md border border-indigo-200">
              {filteredTasks.length} nhiệm vụ
            </span>
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1">
            Phân công công việc, áp dụng kỹ năng 4C và thể hiện Quyền Tự Chủ (Student Voice & Choice)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button
            onClick={() => onOpenAiAssistant('suggest_tasks')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold border border-slate-300 transition shadow-xs"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>Gợi ý bài tập AI</span>
          </button>

          <button
            onClick={() => setIsNewTaskModalOpen(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Nhiệm Vụ</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-slate-600 font-bold">
            <Filter className="w-3.5 h-3.5" />
            <span>Lọc:</span>
          </div>

          {/* Member Filter */}
          <select
            value={selectedMemberFilter}
            onChange={(e) => setSelectedMemberFilter(e.target.value)}
            className="bg-white text-slate-800 font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="all">Tất cả thành viên</option>
            {members.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name} ({m.roleInGroup.split(' ')[0]})
              </option>
            ))}
          </select>

          {/* 4Cs Filter */}
          <select
            value={selectedSkillFilter}
            onChange={(e) => setSelectedSkillFilter(e.target.value)}
            className="bg-white text-slate-800 font-semibold border border-slate-300 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="all">Tất cả Kỹ năng 4Cs</option>
            <option value="Tư duy phản biện">Tư duy phản biện</option>
            <option value="Sáng tạo">Sáng tạo</option>
            <option value="Hợp tác">Hợp tác</option>
            <option value="Giao tiếp">Giao tiếp</option>
          </select>

          {/* Student Voice & Choice Filter */}
          <button
            onClick={() => setShowVoiceChoiceOnly(!showVoiceChoiceOnly)}
            className={`px-3 py-1.5 rounded-lg border font-bold transition flex items-center gap-1.5 ${
              showVoiceChoiceOnly
                ? 'bg-purple-100 border-purple-300 text-purple-900 shadow-2xs'
                : 'bg-white border-slate-300 text-slate-600 hover:text-slate-900'
            }`}
          >
            <Volume2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Student Voice & Choice Only</span>
          </button>
        </div>

        {(selectedMemberFilter !== 'all' || selectedSkillFilter !== 'all' || showVoiceChoiceOnly) && (
          <button
            onClick={() => {
              setSelectedMemberFilter('all');
              setSelectedSkillFilter('all');
              setShowVoiceChoiceOnly(false);
            }}
            className="text-slate-500 hover:text-indigo-600 font-semibold underline text-xs"
          >
            Xóa bộ lọc
          </button>
        )}
      </div>

      {/* Kanban Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => {
          const colTasks = filteredTasks.filter((t) => t.status === col.status);

          return (
            <div
              key={col.status}
              className="rounded-2xl border border-slate-200 bg-slate-50/70 p-4 flex flex-col justify-between min-h-[500px]"
            >
              <div>
                {/* Column Title Header */}
                <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-200/80">
                  <h3 className={`font-extrabold text-xs uppercase tracking-wider ${col.color} flex items-center gap-2`}>
                    {col.title}
                  </h3>
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-full bg-white border border-slate-300 text-slate-800 shadow-2xs">
                    {colTasks.length}
                  </span>
                </div>

                {/* Task Cards Stack */}
                <div className="space-y-3">
                  {colTasks.length === 0 ? (
                    <div className="p-6 rounded-xl border border-dashed border-slate-300 text-center text-slate-400 text-xs font-medium">
                      Chưa có nhiệm vụ
                    </div>
                  ) : (
                    colTasks.map((task) => {
                      const member = getMember(task.assignedMemberId);

                      return (
                        <div
                          key={task.id}
                          className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 transition shadow-xs space-y-2.5 text-slate-800"
                        >
                          {/* Badges */}
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                              {task.skillTag}
                            </span>

                            {task.isVoiceAndChoice && (
                              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-purple-50 text-purple-700 border border-purple-200 flex items-center gap-1" title="Học sinh tự chọn hình thức làm">
                                <Volume2 className="w-2.5 h-2.5" /> Voice & Choice
                              </span>
                            )}
                          </div>

                          {/* Title & Description */}
                          <div>
                            <h4 className="font-bold text-xs text-slate-900 leading-snug">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                              {task.description}
                            </p>
                          </div>

                          {/* Voice Choice Note if present */}
                          {task.choiceNote && (
                            <div className="p-2 rounded-lg bg-purple-50 border border-purple-200 text-[10px] text-purple-900 font-medium italic">
                              💡 Lựa chọn của HS: "{task.choiceNote}"
                            </div>
                          )}

                          {/* Footer: Member & Due Date */}
                          <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                            {member ? (
                              <div className="flex items-center gap-1.5">
                                <img
                                  src={member.avatar}
                                  alt={member.name}
                                  className="w-5 h-5 rounded-full object-cover shadow-2xs"
                                />
                                <span className="font-bold text-slate-800 truncate max-w-[100px]">
                                  {member.name.split(' ').slice(-2).join(' ')}
                                </span>
                              </div>
                            ) : (
                              <span className="italic text-slate-400">Chưa gán</span>
                            )}

                            <span className="font-mono text-[10px] text-slate-500 font-bold">
                              📅 {task.dueDate}
                            </span>
                          </div>

                          {/* Action Controls to move status */}
                          <div className="pt-1 flex items-center justify-end gap-1">
                            {col.status !== 'todo' && (
                              <button
                                onClick={() => {
                                  const prevStatus: TaskStatus = col.status === 'done' ? 'review' : col.status === 'review' ? 'in_progress' : 'todo';
                                  onUpdateTaskStatus(task.id, prevStatus);
                                }}
                                className="p-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-600 transition"
                                title="Lùi lại một bước"
                              >
                                <ArrowLeft className="w-3 h-3" />
                              </button>
                            )}

                            {col.status !== 'done' && (
                              <button
                                onClick={() => {
                                  const nextStatus: TaskStatus = col.status === 'todo' ? 'in_progress' : col.status === 'in_progress' ? 'review' : 'done';
                                  onUpdateTaskStatus(task.id, nextStatus);
                                }}
                                className="p-1 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 transition flex items-center gap-1 text-[10px] font-bold px-2"
                                title="Chuyển bước tiếp"
                              >
                                <span>Tiến</span>
                                <ArrowRight className="w-3 h-3" />
                              </button>
                            )}
                          </div>

                        </div>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Bottom Quick Add */}
              <div className="mt-4 pt-2">
                <button
                  onClick={() => setIsNewTaskModalOpen(true)}
                  className="w-full py-2 px-2 rounded-xl bg-white hover:bg-slate-50 text-slate-600 hover:text-slate-900 text-xs font-bold border border-slate-300 flex items-center justify-center gap-1 transition shadow-2xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Thêm thẻ</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: New Task Modal */}
      {isNewTaskModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Tạo Nhiệm Vụ Mới
              </h3>
              <button
                onClick={() => setIsNewTaskModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTaskSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên nhiệm vụ <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Thiết kế bản vẽ sơ đồ mạch cảm biến rác..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả chi tiết
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Mô tả kết quả mong đợi, tài liệu tham khảo..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Phân công người phụ trách
                  </label>
                  <select
                    value={newAssignedId}
                    onChange={(e) => setNewAssignedId(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.name} ({m.roleInGroup.split(' ')[0]})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Kỹ năng 4C tập trung
                  </label>
                  <select
                    value={newSkillTag}
                    onChange={(e) => setNewSkillTag(e.target.value as Skill4C)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="Tư duy phản biện">Tư duy phản biện</option>
                    <option value="Sáng tạo">Sáng tạo</option>
                    <option value="Hợp tác">Hợp tác</option>
                    <option value="Giao tiếp">Giao tiếp</option>
                  </select>
                </div>
              </div>

              {/* Student Voice & Choice toggle */}
              <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-4 h-4 text-purple-700" />
                    <span className="font-bold text-purple-950">
                      Tự chủ học sinh (Student Voice & Choice)
                    </span>
                  </div>
                  <input
                    type="checkbox"
                    checked={newIsVoiceChoice}
                    onChange={(e) => setNewIsVoiceChoice(e.target.checked)}
                    className="w-4 h-4 accent-purple-600 rounded cursor-pointer"
                  />
                </div>
                {newIsVoiceChoice && (
                  <input
                    type="text"
                    value={newChoiceNote}
                    onChange={(e) => setNewChoiceNote(e.target.value)}
                    placeholder="Ghi chú lựa chọn của học sinh (ví dụ: làm video thay vì viết bài)..."
                    className="w-full bg-white border border-purple-200 rounded-lg p-2 text-purple-900 focus:outline-none focus:ring-1 focus:ring-purple-500"
                  />
                )}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Hạn hoàn thành
                </label>
                <input
                  type="date"
                  value={newDueDate}
                  onChange={(e) => setNewDueDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewTaskModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
                >
                  Tạo Thẻ Nhiệm Vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
