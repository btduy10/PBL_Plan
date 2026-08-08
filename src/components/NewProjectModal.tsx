import React, { useState } from 'react';
import { Project, Member } from '../types/pbl';
import { PlusCircle, X, Sparkles, FolderPlus, HelpCircle } from 'lucide-react';

interface NewProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateProject: (newProject: Project) => void;
}

export const NewProjectModal: React.FC<NewProjectModalProps> = ({
  isOpen,
  onClose,
  onCreateProject,
}) => {
  const [title, setTitle] = useState('');
  const [drivingQuestion, setDrivingQuestion] = useState('');
  const [subject, setSubject] = useState('Tích hợp Khoa Học - Công Nghệ - Nghệ Thuật');
  const [gradeLevel, setGradeLevel] = useState('Khối 10');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState('2026-09-01');
  const [endDate, setEndDate] = useState('2026-11-30');
  const [isAiLoading, setIsAiLoading] = useState(false);

  if (!isOpen) return null;

  const handleGenerateQuestionAi = async () => {
    if (!title.trim()) {
      alert('Vui lòng nhập Tên dự án / Chủ đề trước khi dùng AI gợi ý!');
      return;
    }
    setIsAiLoading(true);
    try {
      const res = await fetch('/api/gemini/pbl-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_driving_question',
          payload: {
            topic: title,
            subject,
            gradeLevel,
          },
        }),
      });

      const data = await res.json();
      if (data.data?.drivingQuestions?.[0]?.question) {
        setDrivingQuestion(data.data.drivingQuestions[0].question);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !drivingQuestion.trim()) return;

    const defaultMembers: Member[] = [
      {
        id: 'm-teacher-1',
        name: 'Giáo viên Hướng dẫn',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
        roleInGroup: 'Giáo viên hướng dẫn (Teacher)',
        email: 'teacher@school.edu.vn',
      },
      {
        id: 'm-student-1',
        name: 'Học sinh Trưởng nhóm',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
        roleInGroup: 'Trưởng nhóm (Leader)',
        email: 'leader@student.edu.vn',
      },
      {
        id: 'm-student-2',
        name: 'Học sinh Nghiên cứu',
        avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
        roleInGroup: 'Nghiên cứu viên (Researcher)',
        email: 'researcher@student.edu.vn',
      },
    ];

    const newProject: Project = {
      id: `pbl-${Date.now()}`,
      title: title.trim(),
      drivingQuestion: drivingQuestion.trim(),
      subject,
      gradeLevel,
      description: description.trim() || 'Dự án học tập trải nghiệm theo chuẩn phương pháp BIE.',
      startDate,
      endDate,
      status: 'active',
      bieStandards: {
        keyKnowledge: true,
        challengingProblem: true,
        sustainedInquiry: true,
        authenticity: true,
        studentVoiceChoice: true,
        reflection: true,
        publicProduct: true,
      },
      members: defaultMembers,
      milestones: [
        {
          id: `ms-${Date.now()}-1`,
          title: 'Mốc 1: Khởi động & Khảo sát ban đầu',
          description: 'Xác định vấn đề cốt lõi và thu thập ý kiến thực tế.',
          dueDate: startDate,
          completed: false,
          phase: 'launch',
        },
        {
          id: `ms-${Date.now()}-2`,
          title: 'Mốc 2: Nghiên cứu & Chế tạo mẫu thử (Prototype)',
          description: 'Thực hiện giải pháp sáng tạo và kiểm thử.',
          dueDate: endDate,
          completed: false,
          phase: 'creation',
        },
      ],
      rubrics: [
        {
          id: `rub-${Date.now()}-1`,
          category: 'Tư duy phản biện',
          developing: 'Thông tin chưa được đối chiếu hoặc phân tích logic.',
          proficient: 'Phân tích lập luận chặt chẽ dựa trên số liệu thực tế.',
          exemplary: 'Đánh giá đa chiều, đề xuất giải pháp có tính thực tiễn cao.',
        },
        {
          id: `rub-${Date.now()}-2`,
          category: 'Sáng tạo',
          developing: 'Ý tưởng rập khuôn theo các mô hình có sẵn.',
          proficient: 'Kết hợp độc đáo nhiều giải pháp mang tính đột phá.',
          exemplary: 'Giải pháp hoàn toàn mới, mang giá trị ứng dụng cộng đồng.',
        },
      ],
    };

    onCreateProject(newProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-900 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
            <FolderPlus className="w-5 h-5 text-blue-600" />
            Tạo Dự Án Học Tập PBL Mới
          </h3>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Tên dự án / Chủ đề <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ví dụ: Năng lượng xanh cho trường học 2026..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="font-bold text-slate-700">
                Driving Question (Câu hỏi cốt lõi) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateQuestionAi}
                disabled={isAiLoading}
                className="text-[11px] font-bold text-amber-600 hover:text-amber-700 flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>{isAiLoading ? 'AI đang viết...' : 'AI gợi ý câu hỏi'}</span>
              </button>
            </div>
            <textarea
              rows={2}
              required
              value={drivingQuestion}
              onChange={(e) => setDrivingQuestion(e.target.value)}
              placeholder="Ví dụ: Làm thế nào để chúng ta giảm 50% lượng điện tiêu thụ của các phòng học thông qua hệ thống chiếu sáng thông minh?"
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 italic"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Môn học tích hợp</label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Khối lớp</label>
              <input
                type="text"
                value={gradeLevel}
                onChange={(e) => setGradeLevel(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-slate-700 mb-1">Mô tả dự án</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tóm tắt bối cảnh thực tế và mong đợi đầu ra..."
              className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày bắt đầu</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              />
            </div>
            <div>
              <label className="block font-bold text-slate-700 mb-1">Ngày kết thúc (Exhibition Day)</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 font-medium"
              />
            </div>
          </div>

          <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition shadow-2xs"
            >
              Tạo Dự Án
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
