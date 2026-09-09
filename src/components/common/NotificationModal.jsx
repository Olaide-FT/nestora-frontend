import { useEffect } from "react";
import { CheckCircle, XCircle, Info, AlertTriangle, X } from "lucide-react";
import useBodyScrollLock from "../../utils/useBodyScrollLock";

const ICONS = {
  success: <CheckCircle size={24} className="text-green-500" />,
  error: <XCircle size={24} className="text-red-500" />,
  info: <Info size={24} className="text-blue-500" />,
  warning: <AlertTriangle size={24} className="text-yellow-500" />,
};

const TITLE_COLORS = {
  success: "text-green-700",
  error: "text-red-700",
  info: "text-blue-700",
  warning: "text-yellow-700",
};

const BUTTON_COLORS = {
  success: "bg-green-600 hover:bg-green-700",
  error: "bg-red-600 hover:bg-red-700",
  info: "bg-primary hover:bg-primary/90",
  warning: "bg-yellow-500 hover:bg-yellow-600",
};


function NotificationModal({
  open,
  type = "info",
  title,
  message,
  onClose,
  autoClose = 0,
}) {
  useBodyScrollLock(open);

  // Auto-close timer
  useEffect(() => {
    if (!open || !autoClose) return;
    const t = setTimeout(onClose, autoClose);
    return () => clearTimeout(t);
  }, [open, autoClose, onClose]);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onClose]);

  if (!open) return null;

  const defaultTitles = {
    success: "Success",
    error: "Error",
    info: "Info",
    warning: "Warning",
  };

  const resolvedTitle = title || defaultTitles[type];

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="notif-modal-title"
    >
      {/* Panel */}
      <div
        className="relative w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-primary/30 transition hover:text-primary/70"
          aria-label="Close notification"
        >
          <X size={18} />
        </button>

        {/* Icon + content */}
        <div className="flex flex-col items-center text-center">
          <div className="mb-4">{ICONS[type]}</div>

          <h2
            id="notif-modal-title"
            className={`font-heading text-lg font-bold ${TITLE_COLORS[type]}`}
          >
            {resolvedTitle}
          </h2>

          {message && (
            <p className="mt-2 font-body text-sm leading-6 text-primary/60">
              {message}
            </p>
          )}

          <button
            type="button"
            onClick={onClose}
            className={`mt-6 w-full rounded-lg px-4 py-2.5 font-body text-sm font-semibold text-white transition ${BUTTON_COLORS[type]}`}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotificationModal;
