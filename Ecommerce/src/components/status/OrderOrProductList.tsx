import { useEffect, useState } from "react";
import { getAllOrderStatus, getAllProductStatus } from "../../api/statusApi";
import { useToast } from "../../hook/useToast";
import { StatusType } from "../../types/StatusType";

interface OrderOrProductListProps {
  activeTypeStatus: "product" | "order";
}

function OrderOrProductList({ activeTypeStatus }: OrderOrProductListProps) {
  const { showToast } = useToast();

  const [dataStatuses, setDataStatuses] = useState<StatusType[]>([]);

  const getDataProductOrOrderStatus = async () => {
    try {
      if (activeTypeStatus === "order") {
        const resOrders = await getAllOrderStatus();
        setDataStatuses(resOrders.data);
      } else {
        const resProducts = await getAllProductStatus();
        setDataStatuses(resProducts.data);
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataProductOrOrderStatus();
  }, [activeTypeStatus]);

  return (
    <div className="mt-8 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-800">
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Tên trạng thái
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
              Mã màu
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">
              Mô tả chi tiết
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-center">
              Số lượng
            </th>
            <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
          {dataStatuses.map((status) => {
            return (
              <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="size-2 rounded-full animate-pulse"
                      style={{ backgroundColor: status.hex }}
                    />
                    <span className="font-semibold text-slate-900 dark:text-slate-100">
                      {status.name}
                    </span>
                  </div>
                </td>
                <td className="px-6 py-4 text-center">
                  <span
                    className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-tight"
                    style={{
                      backgroundColor: status.hex,
                      borderColor: status.hex,
                    }}
                  >
                    {status.hex}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500 dark:text-slate-400">
                  {status.description}
                </td>
                <td className="px-6 py-4 text-center">
                  <span className="text-sm font-bold text-slate-900 dark:text-slate-200">
                    {status.countNumber}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-primary/20 hover:text-primary rounded-lg transition-colors text-slate-400">
                      <span className="material-symbols-outlined">edit</span>
                    </button>
                    <button className="p-2 hover:bg-red-500/20 hover:text-red-500 rounded-lg transition-colors text-slate-400">
                      <span className="material-symbols-outlined">delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default OrderOrProductList;
