import React, { useState } from 'react';
import { Artifact, ArtifactType } from '../types/pbl';
import { 
  Presentation, 
  FileText, 
  Video, 
  Box, 
  Code, 
  Plus, 
  Heart, 
  MessageSquare, 
  ExternalLink, 
  Globe, 
  Eye, 
  X,
  Send,
  Award
} from 'lucide-react';

interface ArtifactGalleryProps {
  projectId: string;
  artifacts: Artifact[];
  onAddArtifact: (artifact: Omit<Artifact, 'id' | 'likesCount' | 'comments'>) => void;
  onLikeArtifact: (artifactId: string) => void;
  onAddComment: (artifactId: string, text: string) => void;
}

export const ArtifactGallery: React.FC<ArtifactGalleryProps> = ({
  projectId,
  artifacts,
  onAddArtifact,
  onLikeArtifact,
  onAddComment,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [isExhibitionMode, setIsExhibitionMode] = useState<boolean>(true);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [activePreviewArtifact, setActivePreviewArtifact] = useState<Artifact | null>(null);

  // New Artifact form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newType, setNewType] = useState<ArtifactType>('pdf');
  const [newAuthorName, setNewAuthorName] = useState('Lê Minh Anh & Nhóm 1');
  const [newEmbedUrl, setNewEmbedUrl] = useState('');

  // Comment input state
  const [commentText, setCommentText] = useState('');

  const filteredArtifacts = artifacts.filter((art) => {
    if (art.projectId !== projectId) return false;
    if (selectedTypeFilter !== 'all' && art.type !== selectedTypeFilter) return false;
    if (isExhibitionMode && !art.publicExhibitionReady) return false;
    return true;
  });

  const handleCreateArtifactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    onAddArtifact({
      projectId,
      title: newTitle.trim(),
      description: newDescription.trim(),
      type: newType,
      embedUrl: newEmbedUrl.trim() || undefined,
      authorName: newAuthorName,
      createdAt: new Date().toISOString().split('T')[0],
      publicExhibitionReady: true,
    });

    setNewTitle('');
    setNewDescription('');
    setNewEmbedUrl('');
    setIsUploadModalOpen(false);
  };

  const handleCommentSubmit = (e: React.FormEvent, artifactId: string) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    onAddComment(artifactId, commentText.trim());
    setCommentText('');
  };

  const getTypeIcon = (type: ArtifactType) => {
    switch (type) {
      case 'pdf':
        return <FileText className="w-5 h-5 text-rose-400" />;
      case 'video':
        return <Video className="w-5 h-5 text-cyan-400" />;
      case '3d_model':
        return <Box className="w-5 h-5 text-amber-400" />;
      case 'presentation':
        return <Presentation className="w-5 h-5 text-indigo-400" />;
      case 'code':
        return <Code className="w-5 h-5 text-emerald-400" />;
      default:
        return <FileText className="w-5 h-5 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Public Product Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm text-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wider bg-cyan-50 text-cyan-700 rounded-md border border-cyan-200">
              PBL Pillar 5: Public Product & Exhibition Day
            </span>
          </div>
          <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mt-1 flex items-center gap-2">
            Kho Lưu Trữ & Triển Lãm Sản Phẩm
            <Globe className="w-5 h-5 text-cyan-600 animate-pulse" />
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 max-w-2xl">
            Sản phẩm hoàn chỉnh công khai dành cho hội đồng đánh giá, phụ huynh và cộng đồng trường học.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={() => setIsExhibitionMode(!isExhibitionMode)}
            className={`px-3.5 py-2 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              isExhibitionMode
                ? 'bg-cyan-50 border-cyan-300 text-cyan-800 shadow-2xs'
                : 'bg-slate-100 border-slate-300 text-slate-600'
            }`}
          >
            <Globe className="w-4 h-4 text-cyan-600" />
            <span>{isExhibitionMode ? 'Chế độ Triển Lãm (Bật)' : 'Tất cả sản phẩm (Tắt)'}</span>
          </button>

          <button
            onClick={() => setIsUploadModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition"
          >
            <Plus className="w-4 h-4" />
            <span>Thêm Sản Phẩm Mới</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-bold">
        {[
          { id: 'all', label: 'Tất cả dạng sản phẩm' },
          { id: 'pdf', label: '📄 Báo cáo PDF' },
          { id: 'video', label: '🎥 Video Phim' },
          { id: '3d_model', label: '🧊 Mô hình 3D / CAD' },
          { id: 'presentation', label: '📊 Slide Thuyết trình' },
        ].map((type) => (
          <button
            key={type.id}
            onClick={() => setSelectedTypeFilter(type.id)}
            className={`px-3.5 py-1.5 rounded-lg transition ${
              selectedTypeFilter === type.id
                ? 'bg-blue-600 text-white font-bold shadow-2xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            {type.label}
          </button>
        ))}
      </div>

      {/* Artifact Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArtifacts.length === 0 ? (
          <div className="col-span-full p-12 text-center bg-white rounded-2xl border border-dashed border-slate-300 text-slate-500">
            <Presentation className="w-10 h-10 mx-auto text-slate-400 mb-2" />
            <p className="font-semibold text-sm">Chưa có sản phẩm triển lãm nào thuộc mục này.</p>
          </div>
        ) : (
          filteredArtifacts.map((art) => (
            <div
              key={art.id}
              className="bg-white rounded-2xl border border-slate-200 hover:border-indigo-300 transition shadow-sm hover:shadow-md overflow-hidden flex flex-col justify-between group"
            >
              <div>
                {/* Media Preview Box */}
                <div className="h-44 bg-slate-50 relative overflow-hidden flex items-center justify-center border-b border-slate-100 group-hover:bg-slate-100/50 transition">
                  {art.type === 'video' && art.embedUrl ? (
                    <iframe
                      src={art.embedUrl}
                      title={art.title}
                      className="w-full h-full object-cover"
                      allowFullScreen
                    />
                  ) : art.type === '3d_model' ? (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      <Box className="w-12 h-12 text-amber-500 animate-bounce mb-2" />
                      <span className="text-xs font-bold text-amber-800">Bản Vẽ Mô Hình CAD 3D</span>
                      <span className="text-[10px] text-slate-500 mt-1">Sẵn sàng để xem trực quan</span>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center text-center p-4">
                      {getTypeIcon(art.type)}
                      <span className="text-xs font-bold text-slate-600 mt-2">
                        {art.type.toUpperCase()} File Preview
                      </span>
                    </div>
                  )}

                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 text-indigo-700 border border-slate-200 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
                    {getTypeIcon(art.type)}
                    {art.type}
                  </span>

                  {art.publicExhibitionReady && (
                    <span className="absolute top-3 right-3 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
                      Public Exhibition
                    </span>
                  )}
                </div>

                {/* Body Content */}
                <div className="p-5 space-y-2">
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition line-clamp-1">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {art.description}
                  </p>
                  <div className="pt-2 text-[11px] text-slate-500 flex items-center justify-between font-medium">
                    <span>✍️ {art.authorName}</span>
                    <span className="font-mono text-[10px]">📅 {art.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Footer Actions & Comments */}
              <div className="p-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-xs">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => onLikeArtifact(art.id)}
                    className="flex items-center gap-1 text-rose-600 hover:text-rose-700 font-bold transition"
                  >
                    <Heart className="w-4 h-4 fill-rose-500/20" />
                    <span>{art.likesCount}</span>
                  </button>

                  <button
                    onClick={() => setActivePreviewArtifact(art)}
                    className="flex items-center gap-1 text-slate-600 hover:text-indigo-600 font-bold transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{art.comments.length} nhận xét</span>
                  </button>
                </div>

                <button
                  onClick={() => setActivePreviewArtifact(art)}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold flex items-center gap-1 text-xs transition shadow-2xs"
                >
                  <Eye className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Xem Chi Tiết</span>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Modal: View Artifact Details & Exhibition Feedback */}
      {activePreviewArtifact && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl text-slate-900 space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                {getTypeIcon(activePreviewArtifact.type)}
                <h3 className="font-bold text-lg text-slate-900">
                  {activePreviewArtifact.title}
                </h3>
              </div>
              <button
                onClick={() => setActivePreviewArtifact(null)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Box */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-center">
              {activePreviewArtifact.type === 'video' && activePreviewArtifact.embedUrl ? (
                <iframe
                  src={activePreviewArtifact.embedUrl}
                  title={activePreviewArtifact.title}
                  className="w-full h-80 rounded-lg"
                  allowFullScreen
                />
              ) : (
                <div className="py-12 space-y-3">
                  <div className="inline-block p-4 rounded-full bg-white border border-slate-200 shadow-2xs">
                    {getTypeIcon(activePreviewArtifact.type)}
                  </div>
                  <p className="text-sm font-bold text-slate-900">
                    {activePreviewArtifact.title}
                  </p>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {activePreviewArtifact.description}
                  </p>
                  {activePreviewArtifact.fileUrl && (
                    <a
                      href={activePreviewArtifact.fileUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition mt-2 shadow-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      <span>Mở Tài Liệu Gốc</span>
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Author info */}
            <div className="text-xs text-slate-600 flex justify-between items-center border-b border-slate-100 pb-3">
              <span>Tác giả: <strong className="text-slate-900">{activePreviewArtifact.authorName}</strong></span>
              <span>Ngày đăng: <strong className="text-slate-900">{activePreviewArtifact.createdAt}</strong></span>
            </div>

            {/* Comments List */}
            <div className="space-y-3">
              <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-indigo-600" />
                Góp Ý Từ Khán Giả Triển Lãm ({activePreviewArtifact.comments.length})
              </h4>

              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {activePreviewArtifact.comments.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">Chưa có góp ý nào. Hãy gửi lời động viên cho nhóm nhé!</p>
                ) : (
                  activePreviewArtifact.comments.map((c) => (
                    <div key={c.id} className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1">
                      <div className="flex justify-between font-bold text-indigo-700">
                        <span>{c.authorName} ({c.authorRole})</span>
                        <span className="text-[10px] text-slate-400">{c.createdAt}</span>
                      </div>
                      <p className="text-slate-800 leading-relaxed">{c.text}</p>
                    </div>
                  ))
                )}
              </div>

              {/* Add Comment form */}
              <form onSubmit={(e) => handleCommentSubmit(e, activePreviewArtifact.id)} className="flex items-center gap-2 pt-2">
                <input
                  type="text"
                  required
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Viết cảm tưởng / câu hỏi cho nhóm tác giả..."
                  className="flex-1 bg-slate-50 border border-slate-300 rounded-xl p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-1 transition shrink-0 shadow-2xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Gửi</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Upload New Artifact */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-900 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-lg text-slate-900 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Thêm Sản Phẩm Mới Vào Kho
              </h3>
              <button
                onClick={() => setIsUploadModalOpen(false)}
                className="text-slate-400 hover:text-slate-700 transition"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateArtifactSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Tên sản phẩm <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="Ví dụ: Báo cáo khảo sát thực trạng rác thải nhựa..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Mô tả sản phẩm
                </label>
                <textarea
                  rows={3}
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Tóm tắt ý nghĩa và giá trị đầu ra của sản phẩm..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Loại sản phẩm
                  </label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as ArtifactType)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="pdf">📄 Báo cáo PDF</option>
                    <option value="video">🎥 Video Clip</option>
                    <option value="3d_model">🧊 Mô hình 3D / CAD</option>
                    <option value="presentation">📊 Slide Thuyết trình</option>
                    <option value="code">💻 Mã nguồn Code</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">
                    Tác giả / Nhóm
                  </label>
                  <input
                    type="text"
                    value={newAuthorName}
                    onChange={(e) => setNewAuthorName(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Đường dẫn Embed / Video URL (tùy chọn)
                </label>
                <input
                  type="text"
                  value={newEmbedUrl}
                  onChange={(e) => setNewEmbedUrl(e.target.value)}
                  placeholder="https://www.youtube.com/embed/..."
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold transition"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold transition shadow-sm"
                >
                  Đăng Sản Phẩm
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
