import React, { useState } from 'react';
import { LearningLog, LogFeedback, Member, Skill4C } from '../types/pbl';
import { 
  MessageSquareHeart, 
  Sparkles, 
  Plus, 
  UserCheck, 
  Bot, 
  Send, 
  Award, 
  HelpCircle, 
  CheckCircle,
  X,
  MessageSquare
} from 'lucide-react';

interface ReflectionLogProps {
  projectId: string;
  projectTitle: string;
  logs: LearningLog[];
  members: Member[];
  onAddLog: (newLog: Omit<LearningLog, 'id' | 'feedbacks'>) => void;
  onAddFeedback: (logId: string, feedback: Omit<LogFeedback, 'id'>) => void;
  onOpenAiAssistant: (action?: string, extraData?: any) => void;
}

export const ReflectionLog: React.FC<ReflectionLogProps> = ({
  projectId,
  projectTitle,
  logs,
  members,
  onAddLog,
  onAddFeedback,
  onOpenAiAssistant,
}) => {
  const [isNewLogModalOpen, setIsNewLogModalOpen] = useState(false);
  const [activeLogForFeedback, setActiveLogForFeedback] = useState<string | null>(null);

  // New Log form state
  const [selectedAuthorId, setSelectedAuthorId] = useState(members[1]?.id || members[0]?.id || '');
  const [logContent, setLogContent] = useState('');
  const [selectedTags, setSelectedTags] = useState<Skill4C[]>(['Tư duy phản biện']);

  // Feedback form state
  const [feedbackAuthorName, setFeedbackAuthorName] = useState('Thầy Nguyễn Văn Minh');
  const [feedbackRole, setFeedbackRole] = useState<'teacher' | 'peer'>('teacher');
  const [feedbackText, setFeedbackText] = useState('');
  const [reflectionQuestion, setReflectionQuestion] = useState('');
  const [isAiLoading, setIsAiLoading] = useState<string | null>(null);

  const filteredLogs = logs.filter((log) => log.projectId === projectId);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logContent.trim()) return;

    const author = members.find((m) => m.id === selectedAuthorId) || members[0];

    onAddLog({
      projectId,
      studentId: author.id,
      studentName: author.name,
      studentRole: author.roleInGroup,
      content: logContent.trim(),
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
      tags: selectedTags,
    });

    setLogContent('');
    setIsNewLogModalOpen(false);
  };

  const handleAddFeedbackSubmit = (e: React.FormEvent, logId: string) => {
    e.preventDefault();
    if (!feedbackText.trim()) return;

    onAddFeedback(logId, {
      authorName: feedbackAuthorName,
      authorRole: feedbackRole,
      text: feedbackText.trim(),
      reflectionQuestion: reflectionQuestion.trim() || undefined,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
    });

    setFeedbackText('');
    setReflectionQuestion('');
    setActiveLogForFeedback(null);
  };

  const handleGenerateAiFeedback = async (log: LearningLog) => {
    setIsAiLoading(log.id);
    try {
      const res = await fetch('/api/gemini/pbl-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'review_learning_log',
          payload: {
            logText: log.content,
            studentRole: log.studentRole,
            projectTitle,
          },
        }),
      });

      const data = await res.json();
      if (data.success && data.data) {
        onAddFeedback(log.id, {
          authorName: 'Trợ lý AI PBL (Gemini 3.6)',
          authorRole: 'ai',
          text: data.data.feedbackText || 'Bài viết nhật ký thể hiện rõ tư duy độc lập.',
          reflectionQuestion: data.data.reflectionQuestion,
          ratings: data.data.score4C,
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 16),
        });
      }
    } catch (err) {
      console.error('Error generating AI feedback:', err);
    } finally {
      setIsAiLoading(null);
    }
  };

  const toggleTag = (tag: Skill4C) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((t) => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-indigo-50 text-indigo-700 rounded-md border border-indigo-200">
              Formative Assessment & Reflection
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1">
            Nhật Ký Học Tập & Vòng Phản Hồi 4C
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl">
            Nơi học sinh phản tư về tiến trình học tập, tự soi chiếu kỹ năng và nhận góp ý mang tính xây dựng từ thầy cô & bạn học.
          </p>
        </div>

        <button
          onClick={() => setIsNewLogModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>Viết Nhật Ký Học Tập</span>
        </button>
      </div>

      {/* Logs Timeline List */}
      <div className="space-y-6">
        {filteredLogs.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
            <MessageSquare className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="font-semibold text-sm">Chưa có nhật ký học tập nào cho dự án này.</p>
            <p className="text-xs text-slate-400 mt-1">
              Hãy khuyến khích học sinh viết nhật ký để ghi lại bài học và nhận phản hồi!
            </p>
          </div>
        ) : (
          filteredLogs.map((log) => (
            <div
              key={log.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-sm space-y-4 text-slate-800"
            >
              {/* Log Top Author Bar */}
              <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-indigo-50 border border-indigo-200 flex items-center justify-center overflow-hidden shadow-2xs">
                    <span className="font-extrabold text-indigo-700 text-sm">
                      {log.studentName.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-slate-900">
                      {log.studentName}
                    </h3>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-[10px] bg-slate-100 text-slate-700 font-semibold px-2 py-0.5 rounded border border-slate-200">
                        {log.studentRole}
                      </span>
                      <span className="text-[10px] font-mono font-medium text-slate-500">
                        🕒 {log.createdAt}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4C Skill Tags */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {log.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-0.5 text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Reflection Content Body */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-800 leading-relaxed font-sans">
                "{log.content}"
              </div>

              {/* Feedbacks Section */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700 uppercase tracking-wider">
                  <span className="flex items-center gap-1.5">
                    <MessageSquareHeart className="w-4 h-4 text-rose-500" />
                    Phản hồi & Nhận xét ({log.feedbacks.length})
                  </span>

                  <button
                    onClick={() => handleGenerateAiFeedback(log)}
                    disabled={isAiLoading === log.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-200 transition disabled:opacity-50"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                    <span>{isAiLoading === log.id ? 'Đang phân tích...' : 'Xin AI Nhận Xét Phản Tư'}</span>
                  </button>
                </div>

                {/* Feedback cards */}
                <div className="space-y-3 pl-2 sm:pl-4 border-l-2 border-indigo-200">
                  {log.feedbacks.map((fb) => (
                    <div
                      key={fb.id}
                      className={`p-3.5 rounded-xl border text-xs space-y-2 ${
                        fb.authorRole === 'ai'
                          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
                          : fb.authorRole === 'teacher'
                          ? 'bg-indigo-50/70 border-indigo-200 text-indigo-950'
                          : 'bg-slate-50 border-slate-200 text-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold">
                        <div className="flex items-center gap-1.5">
                          {fb.authorRole === 'ai' ? (
                            <Bot className="w-4 h-4 text-emerald-600" />
                          ) : fb.authorRole === 'teacher' ? (
                            <UserCheck className="w-4 h-4 text-indigo-600" />
                          ) : (
                            <MessageSquare className="w-4 h-4 text-cyan-600" />
                          )}
                          <span className="text-slate-900 font-bold">{fb.authorName}</span>
                          <span className="text-[10px] text-slate-500">({fb.createdAt})</span>
                        </div>

                        {fb.ratings && (
                          <div className="flex items-center gap-1 text-[10px] font-mono font-bold bg-white px-2 py-0.5 rounded border border-slate-200 text-amber-700 shadow-2xs">
                            <Award className="w-3 h-3 text-amber-500" />
                            <span>
                              Đánh giá 4C: {Math.round(
                                (Object.values(fb.ratings) as (number | undefined)[]).reduce(
                                  (acc: number, val: number | undefined) => acc + (val || 0),
                                  0
                                ) / Object.values(fb.ratings).length
                              )}/10
                            </span>
                          </div>
                        )}
                      </div>

                      <p className="leading-relaxed">{fb.text}</p>

                      {fb.reflectionQuestion && (
                        <div className="p-2.5 rounded-lg bg-amber-50/80 border border-amber-200 text-amber-950 flex items-start gap-2">
                          <HelpCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <div>
                            <span className="font-bold text-[11px] block text-amber-900">Câu hỏi gợi mở từ thầy cô:</span>
                            <p className="italic">{fb.reflectionQuestion}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Add Feedback Input toggle */}
                <div className="pt-2">
                  {activeLogForFeedback === log.id ? (
                    <form
                      onSubmit={(e) => handleAddFeedbackSubmit(e, log.id)}
                      className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 space-y-3 text-xs"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <select
                            value={feedbackRole}
                            onChange={(e) => setFeedbackRole(e.target.value as 'teacher' | 'peer')}
                            className="bg-white text-slate-800 border border-slate-300 rounded-lg p-1.5 font-bold"
                          >
                            <option value="teacher">Giáo viên nhận xét</option>
                            <option value="peer">Bạn học nhận xét (Peer Review)</option>
                          </select>

                          <input
                            type="text"
                            value={feedbackAuthorName}
                            onChange={(e) => setFeedbackAuthorName(e.target.value)}
                            placeholder="Tên người góp ý..."
                            className="bg-white text-slate-900 border border-slate-300 rounded-lg p-1.5 font-medium"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setActiveLogForFeedback(null)}
                          className="text-slate-400 hover:text-slate-700"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div>
                        <textarea
                          rows={2}
                          required
                          value={feedbackText}
                          onChange={(e) => setFeedbackText(e.target.value)}
                          placeholder="Góp ý mang tính xây dựng (khen ngợi điểm mạnh & gợi ý cải thiện)..."
                          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>

                      <div>
                        <input
                          type="text"
                          value={reflectionQuestion}
                          onChange={(e) => setReflectionQuestion(e.target.value)}
                          placeholder="Câu hỏi gợi mở tiếp theo (Reflection Question)..."
                          className="w-full bg-white border border-amber-300 rounded-lg p-2 text-amber-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                      </div>

                      <div className="flex justify-end gap-2">
                        <button
                          type="submit"
                          className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold flex items-center gap-1.5 shadow-2xs"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Gửi Phản Hồi</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <button
                      onClick={() => setActiveLogForFeedback(log.id)}
                      className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 transition"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm phản hồi / Peer Review mới</span>
                    </button>
                  )}
                </div>

              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: Write New Learning Log */}
      {isNewLogModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <MessageSquareHeart className="w-5 h-5 text-indigo-600" />
                Viết Nhật Ký Học Tập (Learning Log)
              </h3>
              <button
                onClick={() => setIsNewLogModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Học sinh viết nhật ký
                </label>
                <select
                  value={selectedAuthorId}
                  onChange={(e) => setSelectedAuthorId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  {members.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.name} ({m.roleInGroup})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nội dung phản tư (Hôm nay em đã làm gì, gặp khó khăn gì & giải quyết ra sao?) <span className="text-rose-500">*</span>
                </label>
                <textarea
                  rows={5}
                  required
                  value={logContent}
                  onChange={(e) => setLogContent(e.target.value)}
                  placeholder="Ghi lại tiến trình thử nghiệm, kết quả đạt được, bài học rút ra hoặc vướng mắc cần giúp đỡ..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 leading-relaxed"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-2">
                  Kỹ năng 4C áp dụng trong bài viết
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {(['Tư duy phản biện', 'Sáng tạo', 'Hợp tác', 'Giao tiếp'] as Skill4C[]).map((tag) => {
                    const isSel = selectedTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => toggleTag(tag)}
                        className={`px-3 py-1.5 rounded-lg border font-bold transition ${
                          isSel
                            ? 'bg-indigo-600 border-indigo-600 text-white shadow-2xs'
                            : 'bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900'
                        }`}
                      >
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewLogModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
                >
                  Lưu Nhật Ký
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
