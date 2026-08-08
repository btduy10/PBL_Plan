import React, { useRef } from 'react';
import { Database, Download, Upload, RefreshCw, X, HardDrive, CheckCircle2 } from 'lucide-react';
import { Project, Task, LearningLog, Artifact } from '../types/pbl';

interface DataManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  projects: Project[];
  tasks: Task[];
  logs: LearningLog[];
  artifacts: Artifact[];
  onImportData: (data: {
    projects: Project[];
    tasks: Task[];
    logs: LearningLog[];
    artifacts: Artifact[];
  }) => void;
  onResetData: () => void;
}

export const DataManagementModal: React.FC<DataManagementModalProps> = ({
  isOpen,
  onClose,
  projects,
  tasks,
  logs,
  artifacts,
  onImportData,
  onResetData,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleExport = () => {
    const data = {
      version: '2.0',
      exportedAt: new Date().toISOString(),
      projects,
      tasks,
      logs,
      artifacts,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pbl-architect-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.projects && json.tasks && json.logs && json.artifacts) {
          onImportData({
            projects: json.projects,
            tasks: json.tasks,
            logs: json.logs,
            artifacts: json.artifacts,
          });
          alert('Đã khôi phục dữ liệu từ file JSON thành công!');
          onClose();
        } else {
          alert('Cấu trúc file JSON không hợp lệ.');
        }
      } catch (err) {
        alert('Lỗi đọc file JSON: ' + (err as Error).message);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-xl p-6 shadow-2xl text-slate-900 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                Quản Lý Dữ Liệu Trình Duyệt (localStorage)
              </h3>
              <p className="text-xs text-slate-500">
                Dữ liệu được lưu trực tiếp trên máy của bạn
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Card */}
        <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
          <HardDrive className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-1.5 font-bold text-blue-900">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Đang bật chế độ tự động lưu vào localStorage</span>
            </div>
            <p className="text-slate-600 leading-relaxed">
              Mọi chỉnh sửa của bạn (Dự án, Nhiệm vụ Kanban, Nhật ký học tập, Sản phẩm triển lãm) tự động được đồng bộ và lưu giữ an toàn trên trình duyệt này mà không cần đăng nhập server.
            </p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <div className="text-lg font-extrabold text-blue-700">{projects.length}</div>
            <div className="text-[11px] font-semibold text-slate-500">Dự Án</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <div className="text-lg font-extrabold text-blue-700">{tasks.length}</div>
            <div className="text-[11px] font-semibold text-slate-500">Nhiệm Vụ</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <div className="text-lg font-extrabold text-blue-700">{logs.length}</div>
            <div className="text-[11px] font-semibold text-slate-500">Nhật Ký</div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 text-center">
            <div className="text-lg font-extrabold text-blue-700">{artifacts.length}</div>
            <div className="text-[11px] font-semibold text-slate-500">Sản Phẩm</div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
            Thao Tác Dữ Liệu
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export JSON */}
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Dữ Liệu (Backup JSON)</span>
            </button>

            {/* Import JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs shadow-2xs transition"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Nhập Dữ Liệu (Restore)</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          {/* Reset to Default */}
          <div className="pt-2">
            <button
              onClick={() => {
                if (confirm('Bạn có chắc chắn muốn đặt lại toàn bộ dữ liệu về mẫu ban đầu? Các thay đổi cục bộ hiện tại sẽ bị ghi đè.')) {
                  onResetData();
                  onClose();
                }
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 font-bold text-xs transition"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Khôi Phục Dữ Liệu Mẫu Ban Đầu</span>
            </button>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="pt-3 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
};
