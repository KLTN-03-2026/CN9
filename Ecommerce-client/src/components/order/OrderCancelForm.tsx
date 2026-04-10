import React, { useState } from "react";

import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";

import { cancelOrderByUserId } from "../../api/orderApi";

interface OrderCancelFormProps {
  orderId: number;
  setOverlayCancel: React.Dispatch<React.SetStateAction<boolean>>;
  setIsShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderCancelForm({
  orderId,
  setOverlayCancel,
  setIsShowDetail,
}: OrderCancelFormProps) {
  const [input, setInput] = useState<{ reason: string }>({ reason: "" });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof input, string>>
  >({});

  const handleSubmitOrderCancel = async (orderId: number) => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!input.reason) {
        newErrors.reason = "Vui lòng nhập lý do hủy đơn hàng";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      await cancelOrderByUserId(orderId, {
        reason: input.reason,
      });
      setOverlayCancel(false);
      setIsShowDetail(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-slate-900 w-[500px] rounded-xl shadow-xl">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <IoMdCloseCircleOutline className="text-red-500" />
            Xác nhận hủy đơn hàng {orderId}
          </h3>

          <button
            onClick={() => setOverlayCancel(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <IoClose />
          </button>
        </div>

        <div className="p-6 space-y-5">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 dark:text-slate-300">
              Lý do hủy đơn hàng
            </label>
            <textarea
              className="w-full bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-red-500 focus:border-red-500 placeholder:text-slate-400 p-3"
              placeholder="Nhập lý do chi tiết để lưu vào lịch sử đơn hàng..."
              rows={3}
              value={input.reason}
              name="reason"
              onChange={(e) => {
                setInput((prev) => ({ ...prev, reason: e.target.value }));
              }}
            />
            <p className="text-red-500 font-medium">{errors.reason}</p>
          </div>
        </div>
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row-reverse gap-3">
          <button
            onClick={() => {
              handleSubmitOrderCancel(orderId);
            }}
            className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20 transition-all"
          >
            Xác nhận hủy
          </button>
          <button
            onClick={() => setOverlayCancel(false)}
            className="px-6 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-sm font-bold transition-all"
          >
            Đóng
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderCancelForm;
