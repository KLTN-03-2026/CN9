import { Modal } from "antd";

import { IoMdCloseCircleOutline } from "react-icons/io";
import { IoClose } from "react-icons/io5";

interface OrderCancelFormProps {
  isShowCancel: boolean;
  orderId: number;
  setIsShowCancel: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderCancelForm({
  isShowCancel,
  orderId,
  setIsShowCancel,
}: OrderCancelFormProps) {
  return (
    <Modal
      className="p-0 bg-white dark:bg-slate-900 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden"
      open={isShowCancel}
      closable={false}
      onCancel={() => setIsShowCancel(false)}
      footer={
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/50 flex flex-col sm:flex-row-reverse gap-3">
          <button className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold shadow-lg shadow-red-500/20 transition-all">
            Xác nhận hủy
          </button>
          <button
            onClick={() => setIsShowCancel(false)}
            className="px-6 py-2.5 border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800 rounded-lg text-sm font-bold transition-all"
          >
            Đóng
          </button>
        </div>
      }
      styles={{
        container: {
          padding: 0,
        },
      }}
    >
      <div>
        <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <IoMdCloseCircleOutline className="text-red-500" />
            Xác nhận hủy đơn hàng {orderId}
          </h3>
          <button
            onClick={() => setIsShowCancel(false)}
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
              defaultValue={""}
            />
          </div>
          <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-100 dark:border-blue-900/30">
            <label className="text-sm" htmlFor="restock">
              <span className="font-bold text-blue-700 dark:text-blue-400 block">
                Hoàn kho tự động
              </span>
              <span className="text-xs text-blue-600/80 dark:text-blue-400/60">
                Cộng lại số lượng sản phẩm vào kho hàng sau khi hủy thành công.
              </span>
            </label>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default OrderCancelForm;
