import React, { useRef, useState } from "react";

import { FaCheckCircle } from "react-icons/fa";
import { IoMdCloudDownload } from "react-icons/io";
import { IoClose } from "react-icons/io5";
import {
  MdAddAPhoto,
  MdChatBubbleOutline,
  MdOutlinePayment,
} from "react-icons/md";

import { RootState } from "../../redux/auth/authStore";

import { useSelector } from "react-redux";

import { processManualRefund } from "../../api/refundApi";

import { formatMoneyString } from "../../utils/formatPrice";
import { UploadFile } from "../../types/UploadType";

interface RefundFormProps {
  setOverlayRefund: React.Dispatch<React.SetStateAction<boolean>>;
  paymentMethood?: string;
  refundId: number;
  priceReturn: number;
}

function OrderRefundForm({
  setOverlayRefund,
  paymentMethood,
  priceReturn,
  refundId,
}: RefundFormProps) {
  const account = useSelector((state: RootState) => state.auth.user);

  const [inputRefund, setInputRefund] = useState<{ reason: string }>({
    reason: "",
  });

  const [imageSrcRefund, setImageSrcRefund] = useState<UploadFile | null>(null);

  const imageRefRefund = useRef<HTMLInputElement | null>(null);

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputRefund, string>>
  >({});

  const handleSubmitRefund = async () => {
    try {
      if (!account) return;

      const newErrors: Partial<typeof errors> = {};

      if (!inputRefund.reason) {
        newErrors.reason = "Admin vui lòng nhập nội dung hoàn tiền";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formData = new FormData();

      formData.append("reason", inputRefund.reason);

      formData.append("adminId", account.accountId.toString());

      if (imageSrcRefund?.file) {
        formData.append("imageRefund", imageSrcRefund.file);
      }

      const resRefund = await processManualRefund(refundId, formData);

      console.log(resRefund);
    } catch (error) {
      console.log(error);
    }
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const readerFile = new FileReader();

      readerFile.onload = (e) => {
        if (e.target?.result) {
          setImageSrcRefund({
            file,
            preview: e.target.result as string,
            isOld: false,
          });
        }
      };
      readerFile.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="w-full max-w-xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl pointer-events-auto max-h-[100vh] overflow-y-auto">
        <div className="p-8 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <MdOutlinePayment className="text-blue-500 text-lg fill-icon" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  THÔNG TIN HOÀN TIỀN
                </span>
              </div>
              <button
                onClick={() => setOverlayRefund(false)}
                className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-all"
              >
                <IoClose />
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-2 bg-blue-50/50 border border-blue-100 rounded-xl">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">
                      Số tài khoản
                    </p>
                    <p className="font-bold text-gray-800">190345678910</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">
                      Ngân hàng
                    </p>
                    <p className="font-bold text-gray-800">Techcombank</p>
                  </div>

                  <div className="col-span-2">
                    <p className="text-[10px] text-blue-600 font-bold uppercase mb-1">
                      Chủ tài khoản
                    </p>
                    <p className="font-bold text-gray-800 uppercase">
                      NGUYEN VAN A
                    </p>
                  </div>
                </div>
              </div>
              <div>
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest mb-1">
                  TỔNG TIỀN HOÀN TRẢ
                </p>
                <div className="text-4xl font-extrabold text-[var(--primary-color)]">
                  {formatMoneyString(String(priceReturn))}đ
                </div>
              </div>
            </div>
          </div>
          <div className="space-y-2 pt-1">
            <label className="text-xs font-bold text-slate-500 uppercase flex items-center gap-1.5">
              <MdChatBubbleOutline className="text-sm" />
              Lời nhắn cho hoàn tiền
            </label>
            <textarea
              name="reason"
              className="w-full bg-slate-100 dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-xl text-sm focus:ring-2 focus:ring-primary focus:border-transparent p-4 placeholder:text-slate-400 min-h-[80px]"
              placeholder="Điền phản hồi của Admin về hoàn tiền này..."
              value={inputRefund.reason}
              onChange={(e) =>
                setInputRefund((prev) => ({ ...prev, reason: e.target.value }))
              }
            />
            <p className="text-red-500 font-medium">{errors.reason}</p>
          </div>
          {paymentMethood ? (
            <></>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <IoMdCloudDownload className="text-gray-400 text-lg" />
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">
                  TẢI LÊN BIÊN LAI CHUYỂN KHOẢN
                </span>
              </div>
              <input
                hidden
                type="file"
                onChange={handleFile}
                ref={imageRefRefund}
              />
              {imageSrcRefund ? (
                <div className="w-full h-60 border rounded-xl overflow-hidden bg-gray-50 relative flex items-center justify-center">
                  <img
                    src={imageSrcRefund.preview}
                    className="object-contain h-full"
                  />
                  <button
                    onClick={() => setImageSrcRefund(null)}
                    className="absolute top-2 right-2 bg-white hover:bg-red-50 text-red-500 p-2 rounded-full shadow transition"
                  >
                    <IoClose />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => imageRefRefund.current?.click()}
                  className="border-2 border-dashed border-gray-200 rounded-2xl p-8 flex flex-col items-center justify-center bg-gray-50/30 hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                    <MdAddAPhoto className="text-gray-400" />
                  </div>
                  <p className="text-sm font-medium text-gray-600">
                    Kéo thả hoặc nhấp để tải ảnh
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Định dạng JPG, PNG (Tối đa 5MB)
                  </p>
                </div>
              )}
            </div>
          )}
          <div className="pt-4">
            <button
              onClick={() => handleSubmitRefund()}
              className="w-full bg-primary hover:bg-green-600 text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-green-100 transition-all"
            >
              <FaCheckCircle className="fill-icon" />
              Hoàn tất thủ tục
            </button>
            {paymentMethood ? (
              <></>
            ) : (
              <p className="text-center text-[10px] text-gray-400 mt-3 italic">
                * Yêu cầu tải biên lai trước khi xác nhận hoàn tất
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderRefundForm;
