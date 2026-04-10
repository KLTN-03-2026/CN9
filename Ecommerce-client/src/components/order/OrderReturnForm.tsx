
import { IoMdClose } from "react-icons/io";
import {
  MdEditNote,
  MdOutlineAddAPhoto,
  MdOutlineAssignmentReturn,
  MdOutlineInfo,
} from "react-icons/md";
import { FaRegImage } from "react-icons/fa";

import { formatMoneyString } from "../../utils/formatPrice";
import { IoSendSharp } from "react-icons/io5";
import { useRef, useState } from "react";
import { returnOrderByUserId } from "../../api/orderApi";
import type { UploadFile } from "../../type/UploadType";
import type { OrderItemType } from "../../type/OrderType";

interface OrderReturnFormProps {
  orderItem: OrderItemType | null;
  setOverlayReturn: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderReturnForm({
  orderItem,
  setOverlayReturn,
}: OrderReturnFormProps) {
  const refImage = useRef<HTMLInputElement | null>(null);

  const [inputReturn, setInputReturn] = useState<{ reason: string }>({
    reason: "",
  });

  const [imagesSrcReturn, setImagesSrcReturn] = useState<UploadFile[]>([]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputReturn | "image", string>>
  >({});

  const readFileAsync = (file: File): Promise<UploadFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve({ file, preview: e.target.result as string });
        } else {
          reject("Lỗi đọc file");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const results: UploadFile[] = [];
      for (const file of fileArray) {
        try {
          const result = await readFileAsync(file);
          results.push(result);
        } catch (err) {
          console.error("Lỗi đọc file:", err);
        }
      }
      const array = results.reverse();
      setImagesSrcReturn((prev) => [...prev, ...array]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesSrcReturn((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmitReturnRequest = async (orderItem: OrderItemType) => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputReturn.reason) {
        newErrors.reason = "Vui lòng cho lý do hoàn hàng";
      }

      if (imagesSrcReturn.length === 0) {
        newErrors.image = "Vui lòng thêm ảnh khi sản phẩm lỗi";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formData = new FormData();

      formData.append("reason", inputReturn.reason);

      if (imagesSrcReturn.length >= 0) {
        imagesSrcReturn.forEach((key, i) => {
          formData.append("iamgesReturn", imagesSrcReturn[i].file);
        });
      }

      const resReturn = await returnOrderByUserId(orderItem.id, formData);
      console.log(resReturn);
    } catch (error) {
      console.log(error);
    }
  };

  if (!orderItem) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="max-w-2xl w-full bg-card-light dark:bg-card-dark rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-all">
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <MdOutlineAssignmentReturn className="text-orange-600 dark:text-orange-400" />
            </div>
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
              Gửi yêu cầu Trả hàng
            </h2>
          </div>
          <button
            onClick={() => setOverlayReturn(false)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <IoMdClose />
          </button>
        </div>
        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
          <div className="flex gap-4 p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
            <img
              alt={orderItem.name}
              className="w-20 h-20 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
              src={orderItem.imageVariant}
            />
            <div className="flex flex-col justify-center">
              <h3 className="font-semibold text-slate-800 dark:text-slate-100">
                {orderItem.name}
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                Phân loại: {orderItem.color} / Size {orderItem.size}
              </p>
              <p className="text-sm font-medium text-primary mt-1">
                {formatMoneyString(
                  String(Number(orderItem.price) * orderItem.quantity),
                )}
                đ
              </p>
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
                <MdEditNote /> Lý do muốn hoàn hàng
              </label>
              <textarea
                className="p-2 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-all resize-none"
                placeholder="Hãy mô tả chi tiết vấn đề bạn gặp phải với sản phẩm này..."
                rows={3}
                name="reason"
                value={inputReturn.reason}
                onChange={(e) =>
                  setInputReturn((prev) => ({
                    ...prev,
                    reason: e.target.value,
                  }))
                }
              />
              <p className="text-red-500 font-medium">{errors.reason}</p>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-2">
              <FaRegImage className="text-sm" /> TẢI LÊN BẰNG CHỨNG (Tối đa 5
              hình ảnh/video)
            </label>
            <div className="grid grid-cols-4 sm:grid-cols-5 gap-3">
              <input
                type="file"
                hidden
                ref={refImage}
                multiple
                onChange={handleFile}
              />
              {imagesSrcReturn.map((imageReturn, index) => {
                return (
                  <div className="relative aspect-square rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden group">
                    <img
                      className="w-full h-full object-cover"
                      src={imageReturn.preview}
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-lg"
                    >
                      <IoMdClose className="text-xs" />
                    </button>
                  </div>
                );
              })}

              <button
                onClick={() => refImage.current?.click()}
                className="relative aspect-square rounded-xl border-2 border-dashed border-slate-200 dark:border-slate-700 flex flex-col items-center justify-center text-slate-400 hover:text-primary hover:border-primary transition-all bg-slate-50/50 dark:bg-slate-900/50"
              >
                <MdOutlineAddAPhoto />
              </button>
              <p className="text-red-500 font-medium">{errors.image}</p>
            </div>
          </div>
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3">
            <MdOutlineInfo size={30} className="text-blue-500 text-lg mt-0.5" />
            <p className="text-[13px] text-blue-700 dark:text-blue-300 leading-relaxed">
              Yêu cầu của bạn sẽ được người bán phản hồi trong vòng 24-48h. Vui
              lòng giữ sản phẩm còn nguyên tem mác và bao bì để quá trình hoàn
              trả diễn ra thuận lợi nhất.
            </p>
          </div>
        </div>
        <div className="px-6 py-5 bg-slate-50 dark:bg-slate-800/30 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setOverlayReturn(false)}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2"
          >
            Hủy bỏ
          </button>
          <button
            onClick={() => handleSubmitReturnRequest(orderItem)}
            className="w-full sm:flex-1 py-3 px-6 rounded-xl bg-primary text-white font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
          >
            <IoSendSharp className="text-sm" />
            Gửi yêu cầu
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderReturnForm;
