import { JSX } from "react";
import {
  IoMdCheckmarkCircle,
  IoMdClose,
  IoMdCloseCircle,
  IoMdWarning,
} from "react-icons/io";
import { StatusMessageType } from "../../types/StatusType";

interface ToastProps {
  message: string;
  type: StatusMessageType;
  onClose: () => void;
}

function Toast({ message, type, onClose }: ToastProps) {
  const Icon: Record<StatusMessageType, JSX.Element> = {
    success: <IoMdCheckmarkCircle />,
    error: <IoMdCloseCircle />,
    warning: <IoMdWarning />,
  };

  const bgColor: Record<StatusMessageType, string> = {
    success: "border-success",
    error: "border-error",
    warning: "border-warning",
  };

  const textColor: Record<StatusMessageType, string> = {
    success: "text-success",
    error: "text-error",
    warning: "text-warning",
  };

  const titleMap: Record<StatusMessageType, string> = {
    success: "Thành công",
    error: "Có lỗi xảy ra",
    warning: "Cảnh báo",
  };

  return (
    <div
      className={`pointer-events-auto w-full bg-white/90 dark:bg-[#1a2e1f]/90 backdrop-blur-md rounded-lg shadow-lg border-l-4 ${bgColor[type]} flex items-start p-4 gap-3 transform transition-all duration-300 hover:scale-[1.02] cursor-pointer toast-animate`}
    >
      <div className={`shrink-0 ${textColor[type]} pt-0.5`}>{Icon[type]}</div>
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-bold text-dark-text dark:text-white leading-tight">
          {titleMap[type]}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 line-clamp-2">
          {message}
        </p>
      </div>
      <button
        className="shrink-0 text-gray-400 hover:text-dark-text dark:hover:text-white transition-colors"
        onClick={onClose}
      >
        <IoMdClose className="text-xl" />
      </button>
    </div>
  );
}

export default Toast;
