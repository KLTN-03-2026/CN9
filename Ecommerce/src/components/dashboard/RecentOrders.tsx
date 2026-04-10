import { useEffect, useState } from "react";

import { OrderType } from "../../types/OrderType";

import { getLatestPendingOrders } from "../../api/orderApi";
import { formatMoneyString } from "../../utils/formatPrice";

function RecentOrders() {
  const [dataOrders, setDataOrders] = useState<OrderType[]>([]);

  const handleGetAllOrder = async () => {
    try {
      const resOrders = await getLatestPendingOrders();
      setDataOrders(resOrders.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllOrder();
  }, []);

  return (
    <div className="mt-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6">
      <h3 className="text-lg font-bold mb-4">Đơn hàng gần đây</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
              <th className="py-3 px-4 font-medium">Mã ĐH</th>
              <th className="py-3 px-4 font-medium">Khách hàng</th>
              <th className="py-3 px-4 font-medium">Ngày đặt</th>
              <th className="py-3 px-4 font-medium">Tổng tiền</th>
              <th className="py-3 px-4 font-medium">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {dataOrders.slice(0, 7).map((order) => {
              const timeCreate = new Date(order.createdAt).toLocaleDateString(
                "vi-VN",
              );
              return (
                <tr className="border-b border-border-light dark:border-border-dark">
                  <td className="py-3 px-4 font-medium">{order.id}</td>
                  <td className="py-3 px-4">{order.name}</td>
                  <td className="py-3 px-4">{timeCreate}</td>
                  <td className="py-3 px-4">
                    {formatMoneyString(String(order.totalPrice))}đ
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className="px-2 py-1 text-xs font-medium rounded-full"
                      style={{ backgroundColor: order.status.hex }}
                    >
                      {order.status.name}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RecentOrders;
