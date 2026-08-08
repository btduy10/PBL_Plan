export type Skill4C = 'Tư duy phản biện' | 'Hợp tác' | 'Giao tiếp' | 'Sáng tạo';

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export type MilestonePhase = 'launch' | 'investigation' | 'creation' | 'exhibition';

export type ArtifactType = 'pdf' | 'video' | 'design' | 'presentation' | 'code' | '3d_model';

export interface Member {
  id: string;
  name: string;
  avatar: string;
  roleInGroup: 'Trưởng nhóm (Leader)' | 'Nghiên cứu viên (Researcher)' | 'Thiết kế (Designer)' | 'Kỹ thuật/CNTT (Tech Lead)' | 'Thuyết trình viên (Presenter)' | 'Giáo viên hướng dẫn (Teacher)';
  email: string;
}

export interface Milestone {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  completed: boolean;
  phase: MilestonePhase;
}

export interface RubricCriteria {
  id: string;
  category: Skill4C | 'Chất lượng sản phẩm' | 'Tính thực tiễn';
  developing: string;  // Cần cố gắng
  proficient: string;  // Đạt chuẩn BIE
  exemplary: string;   // Xuất sắc
}

export interface Task {
  id: string;
  projectId: string;
  title: string;
  description: string;
  status: TaskStatus;
  assignedMemberId: string;
  skillTag: Skill4C;
  isVoiceAndChoice: boolean; // Student Voice & Choice
  choiceNote?: string;
  dueDate: string;
}

export interface LogFeedback {
  id: string;
  authorName: string;
  authorRole: 'teacher' | 'peer' | 'ai';
  text: string;
  reflectionQuestion?: string;
  ratings?: {
    criticalThinking?: number;
    collaboration?: number;
    communication?: number;
    creativity?: number;
  };
  createdAt: string;
}

export interface LearningLog {
  id: string;
  projectId: string;
  studentId: string;
  studentName: string;
  studentRole: string;
  content: string;
  createdAt: string;
  tags: Skill4C[];
  feedbacks: LogFeedback[];
}

export interface ArtifactComment {
  id: string;
  authorName: string;
  authorRole: string;
  text: string;
  createdAt: string;
}

export interface Artifact {
  id: string;
  projectId: string;
  title: string;
  description: string;
  type: ArtifactType;
  fileUrl?: string;
  embedUrl?: string;
  authorName: string;
  createdAt: string;
  publicExhibitionReady: boolean;
  likesCount: number;
  comments: ArtifactComment[];
}

export interface Project {
  id: string;
  title: string;
  drivingQuestion: string; // Câu hỏi cốt lõi
  subject: string;
  gradeLevel: string;
  description: string;
  startDate: string;
  endDate: string;
  status: 'planning' | 'active' | 'exhibition' | 'completed';
  
  // 7 BIE Gold Standards checklist
  bieStandards: {
    keyKnowledge: boolean; // Kiến thức & Kỹ năng cốt lõi
    challengingProblem: boolean; // Vấn đề/Câu hỏi thử thách
    sustainedInquiry: boolean; // Tiến trình khám phá kéo dài
    authenticity: boolean; // Tính thực tế & Ý nghĩa
    studentVoiceChoice: boolean; // Quyền tự chủ & Lựa chọn
    reflection: boolean; // Phản hồi & Đánh giá
    publicProduct: boolean; // Sản phẩm công khai
  };

  members: Member[];
  milestones: Milestone[];
  rubrics: RubricCriteria[];
}
