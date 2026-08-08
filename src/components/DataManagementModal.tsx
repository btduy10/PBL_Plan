import React, { useRef, useState, useEffect } from 'react';
import { Database, Download, Upload, RefreshCw, X, HardDrive, CheckCircle2, Folder, FolderOpen, Settings, AlertCircle } from 'lucide-react';
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
  const [folderName, setFolderName] = useState<string>(() => {
    return localStorage.getItem('pbl_custom_folder_name') || 'Mặc định (Trình duyệt localStorage)';
  });
  const [isFileSystemSupported, setIsFileSystemSupported] = useState<boolean>(false);
  const [directoryHandle, setDirectoryHandle] = useState<FileSystemDirectoryHandle | null>(null);
  const [autoSyncToFile, setAutoSyncToFile] = useState<boolean>(() => {
    return localStorage.getItem('pbl_auto_sync_file') === 'true';
  });
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && 'showDirectoryPicker' in window) {
      setIsFileSystemSupported(true);
    }
  }, []);

  if (!isOpen) return null;

  // Save JSON helper
  const getFullDataJson = () => ({
    version: '2.0',
    exportedAt: new Date().toISOString(),
    projects,
    tasks,
    logs,
    artifacts,
  });

  const handleExport = () => {
    const data = getFullDataJson();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `pbl-architect-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePickDirectory = async () => {
    if (!('showDirectoryPicker' in window)) {
      alert('Trình duyệt hiện tại không hỗ trợ chọn thư mục trực tiếp (File System Access API). Vẫn tự động lưu trong localStorage.');
      return;
    }

    try {
      // @ts-ignore - showDirectoryPicker exists on modern desktop browsers
      const handle: FileSystemDirectoryHandle = await window.showDirectoryPicker({
        mode: 'readwrite',
      });
      setDirectoryHandle(handle);
      const name = handle.name;
      setFolderName(`Thư mục chọn: ${name}`);
      localStorage.setItem('pbl_custom_folder_name', `Thư mục chọn: ${name}`);
      localStorage.setItem('pbl_auto_sync_file', 'true');
      setAutoSyncToFile(true);

      // Write initial backup file into the directory
      const fileHandle = await handle.getFileHandle('pbl-architect-data.json', { create: true });
      // @ts-ignore
      const writable = await fileHandle.createWritable();
      await writable.write(JSON.stringify(getFullDataJson(), null, 2));
      await writable.close();

      setStatusMessage(`Đã kết nối thành công với thư mục "${name}"! File 'pbl-architect-data.json' đã được khởi tạo.`);
    } catch (err) {
      if ((err as Error).name !== 'AbortError') {
        alert('Không thể mở thư mục: ' + (err as Error).message);
      }
    }
  };

  const handleResetStoragePath = () => {
    setDirectoryHandle(null);
    setFolderName('Mặc định (Trình duyệt localStorage)');
    localStorage.removeItem('pbl_custom_folder_name');
    localStorage.setItem('pbl_auto_sync_file', 'false');
    setAutoSyncToFile(false);
    setStatusMessage('Đã chuyển về vị trí lưu mặc định (localStorage trình duyệt).');
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
                Cấu Hình Vị Trí Lưu Dữ Liệu
              </h3>
              <p className="text-xs text-slate-500">
                Lưu mặc định hoặc tự chọn ổ đĩa / thư mục trên máy
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

        {/* Directory/Drive Configuration Section */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <HardDrive className="w-4 h-4 text-blue-600" />
              <span>Vị Trí & Đường Dẫn Lưu Trữ Dữ Liệu:</span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-blue-100 text-blue-800 border border-blue-200">
              {directoryHandle ? 'Ổ đĩa Tự chọn' : 'Đường dẫn Mặc định'}
            </span>
          </div>

          <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs font-medium text-slate-700 space-y-1.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <Folder className="w-4 h-4 text-amber-500 shrink-0" />
                <span className="font-bold truncate text-slate-900">{folderName}</span>
              </div>
              {directoryHandle && (
                <button
                  onClick={handleResetStoragePath}
                  className="text-[11px] text-rose-600 hover:text-rose-700 font-bold underline shrink-0"
                >
                  Khôi phục mặc định
                </button>
              )}
            </div>
            {!directoryHandle && (
              <div className="pt-1 text-[11px] text-slate-500 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                <span className="text-slate-400">Đường dẫn mặc định:</span> Browser LocalStorage (IndexedDB / Local Storage)
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
            <button
              onClick={handlePickDirectory}
              className="w-full sm:w-auto flex-1 flex items-center justify-center gap-2 px-3.5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-2xs transition"
            >
              <FolderOpen className="w-4 h-4" />
              <span>Thay Đổi Ổ Đĩa / Thư Mục Lưu Tự Động...</span>
            </button>
          </div>

          {!isFileSystemSupported && (
            <p className="text-[11px] text-amber-700 bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center gap-1.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
              Trình duyệt này dùng bộ nhớ chuẩn localStorage. Để chọn trực tiếp ổ đĩa C/D/E, vui lòng dùng Google Chrome, Microsoft Edge hoặc Brave trên máy tính.
            </p>
          )}

          {statusMessage && (
            <div className="p-2.5 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Status Card */}
        <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-100 flex items-start gap-3">
          <CheckCircle2 className="w-4.5 h-4.5 text-blue-600 shrink-0 mt-0.5" />
          <div className="space-y-1 text-xs">
            <div className="font-bold text-blue-900">
              Tự động sao lưu và bảo đảm an toàn dữ liệu
            </div>
            <p className="text-slate-600 leading-relaxed text-[11px]">
              Tất cả dự án, nhiệm vụ Kanban, tiêu chuẩn Rubric BIE và sản phẩm đều được bảo toàn. Bạn cũng có thể chủ động Xuất/Nhập file sao lưu dạng JSON dưới đây.
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
            Sao Lưu & Khôi Phục File
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Export JSON */}
            <button
              onClick={handleExport}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-2xs transition"
            >
              <Download className="w-4 h-4" />
              <span>Tải File Sao Lưu (.JSON)</span>
            </button>

            {/* Import JSON */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-bold text-xs shadow-2xs transition"
            >
              <Upload className="w-4 h-4 text-blue-600" />
              <span>Khôi Phục Từ File JSON</span>
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
          <div className="pt-1">
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
              <span>Khôi Phục Dữ Liệu Mẫu Mặc Định</span>
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

