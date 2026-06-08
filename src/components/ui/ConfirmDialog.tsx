import { UserMinus } from "lucide-react";

interface ConfirmDialogProps {
  displayName: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({
  displayName,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  return (
    <div
      className="fixed inset-0 z-[90] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
    >
      <div className="bg-white rounded-2xl shadow-xl p-6 w-80 mx-4 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-center w-11 h-11 rounded-full bg-red-100 mx-auto mb-4">
          <UserMinus size={20} className="text-red-500" />
        </div>
        <h3 className="text-sm font-semibold text-text-primary text-center mb-1">
          Hủy kết bạn?
        </h3>
        <p className="text-xs text-text-muted text-center mb-5 leading-relaxed">
          Bạn sẽ không còn là bạn bè với{" "}
          <span className="font-medium text-text-secondary">{displayName}</span>{" "}
          nữa.
        </p>
        <div className="flex gap-2">
          <button
            onClick={onCancel}
            className="flex-1 py-2 text-sm font-medium text-text-secondary bg-surface-100 hover:bg-surface-200 rounded-xl transition-colors"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-colors"
          >
            Hủy kết bạn
          </button>
        </div>
      </div>
    </div>
  );
}
