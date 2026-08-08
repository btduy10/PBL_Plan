import React, { useState, useEffect } from 'react';
import { Key, Eye, EyeOff, Check, Trash2, ExternalLink, X, Sparkles, AlertCircle, CheckCircle2 } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onKeySaved?: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose, onKeySaved }) => {
  const [apiKey, setApiKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const savedKey = localStorage.getItem('gemini_api_key') || '';
      setApiKey(savedKey);
      setTestStatus('idle');
      setStatusMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    const trimmed = apiKey.trim();
    if (trimmed) {
      localStorage.setItem('gemini_api_key', trimmed);
      setStatusMessage('Đã lưu Gemini API Key vào bộ nhớ trình duyệt!');
    } else {
      localStorage.removeItem('gemini_api_key');
      setStatusMessage('Đã xóa Gemini API Key.');
    }
    setTestStatus('idle');
    if (onKeySaved) onKeySaved();
  };

  const handleClear = () => {
    localStorage.removeItem('gemini_api_key');
    setApiKey('');
    setStatusMessage('Đã xóa API Key khỏi thiết bị.');
    setTestStatus('idle');
    if (onKeySaved) onKeySaved();
  };

  const handleTestConnection = async () => {
    const keyToTest = apiKey.trim() || localStorage.getItem('gemini_api_key') || '';
    if (!keyToTest) {
      setTestStatus('error');
      setStatusMessage('Vui lòng nhập API Key trước khi thử kết nối.');
      return;
    }

    setTestStatus('testing');
    setStatusMessage('Đang kiểm tra kết nối tới Gemini AI...');

    try {
      const res = await fetch('/api/gemini/pbl-assistant', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': keyToTest,
        },
        body: JSON.stringify({
          action: 'generate_driving_question',
          payload: {
            topic: 'Thử nghiệm kết nối AI',
            subject: 'CNTT',
            gradeLevel: 'Lớp 10',
          },
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        setTestStatus('success');
        setStatusMessage('Kết nối thành công! Trợ lý AI Gemini đã sẵn sàng hoạt động.');
        localStorage.setItem('gemini_api_key', keyToTest);
        if (onKeySaved) onKeySaved();
      } else {
        setTestStatus('error');
        setStatusMessage(data.error || 'Kết nối thất bại. Vui lòng kiểm tra lại API Key.');
      }
    } catch (err: any) {
      setTestStatus('error');
      setStatusMessage('Lỗi mạng hoặc server: ' + (err.message || 'Không kết nối được'));
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white border border-slate-200 rounded-2xl w-full max-w-lg p-6 shadow-2xl text-slate-900 space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-600 border border-amber-200 shadow-2xs">
              <Key className="w-5 h-5 font-bold" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-1.5">
                Cấu Hình Google Gemini API Key
                <Sparkles className="w-4 h-4 text-amber-500 fill-amber-300" />
              </h3>
              <p className="text-xs text-slate-500">
                Kích hoạt trợ lý AI Co-Pilot thiết kế dự án PBL chuẩn BIE
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

        {/* Input Form */}
        <div className="space-y-3">
          <label className="block text-xs font-bold text-slate-700">
            Gemini API Key của bạn
          </label>

          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full pr-10 pl-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white"
            />
            <button
              type="button"
              onClick={() => setShowKey(!showKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Chưa có API Key? Tải key miễn phí tại Google AI Studio</span>
            <a
              href="https://aistudio.google.com/app/apikey"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 text-blue-600 font-bold hover:underline"
            >
              <span>Lấy API Key</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Feedback message */}
        {statusMessage && (
          <div
            className={`p-3 rounded-xl text-xs font-semibold border flex items-start gap-2 ${
              testStatus === 'success'
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : testStatus === 'error'
                ? 'bg-rose-50 text-rose-800 border-rose-200'
                : 'bg-blue-50 text-blue-800 border-blue-200'
            }`}
          >
            {testStatus === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            ) : testStatus === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            ) : (
              <Sparkles className="w-4 h-4 text-blue-600 shrink-0 mt-0.5 animate-spin" />
            )}
            <span className="leading-relaxed">{statusMessage}</span>
          </div>
        )}

        {/* Info Box */}
        <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-600 leading-relaxed">
          🔒 <strong className="text-slate-800">Bảo mật dữ liệu:</strong> API Key được lưu trực tiếp trên bộ nhớ cục bộ (<code className="font-mono bg-slate-200/70 px-1 py-0.5 rounded text-[10px]">localStorage</code>) trình duyệt máy bạn. Không lưu trữ trên máy chủ bên ngoài.
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
          {apiKey ? (
            <button
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 font-bold text-xs transition border border-rose-200"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Xóa Key</span>
            </button>
          ) : <div />}

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleTestConnection}
              disabled={testStatus === 'testing'}
              className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold transition"
            >
              {testStatus === 'testing' ? 'Đang thử...' : 'Thử Kết Nối'}
            </button>

            <button
              type="button"
              onClick={() => {
                handleSave();
                onClose();
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-2xs transition"
            >
              <Check className="w-4 h-4" />
              <span>Lưu API Key</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
