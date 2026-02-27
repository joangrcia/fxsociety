import { useState, type ReactNode } from 'react';

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'default';
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  variant = 'default',
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  if (!open) return null;

  const confirmStyles = variant === 'danger'
    ? 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/20'
    : 'bg-gradient-to-br from-slate-100 via-white to-slate-300 text-black font-bold hover:shadow-[0_0_24px_rgba(59,130,246,0.18)]';

  return (
    <div className="fixed inset-0 z-[9998] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative bg-[#14141a] border border-white/10 rounded-2xl p-6 shadow-2xl max-w-sm w-full mx-4 animate-slide-up">
        <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed">{message}</p>

        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl transition-all"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-xl border transition-all ${confirmStyles}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

// Hook for easier usage
// eslint-disable-next-line react-refresh/only-export-components
export function useConfirmDialog() {
  const [state, setState] = useState<{
    open: boolean;
    title: string;
    message: string;
    variant?: 'danger' | 'default';
    resolve?: (value: boolean) => void;
  }>({ open: false, title: '', message: '' });

  const confirm = (title: string, message: string, variant?: 'danger' | 'default'): Promise<boolean> => {
    return new Promise((resolve) => {
      setState({ open: true, title, message, variant, resolve });
    });
  };

  const handleConfirm = () => {
    state.resolve?.(true);
    setState({ open: false, title: '', message: '' });
  };

  const handleCancel = () => {
    state.resolve?.(false);
    setState({ open: false, title: '', message: '' });
  };

  const dialog: ReactNode = (
    <ConfirmDialog
      open={state.open}
      title={state.title}
      message={state.message}
      variant={state.variant}
      onConfirm={handleConfirm}
      onCancel={handleCancel}
    />
  );

  return { confirm, dialog };
}
