import { useEffect, useState } from "react";

import { MdOutlineVisibility } from "react-icons/md";

import { OrderType } from "../../types/OrderType";

import { getAllOrders } from "../../api/orderApi";
import { useNavigate } from "react-router-dom";

function OrderList() {
  const navigate = useNavigate();

  const [dataOrders, setDataOrders] = useState<OrderType[]>([]);

  const handleGetAllOrder = async () => {
    try {
      const resOrders = await getAllOrders();
      setDataOrders(resOrders.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetAllOrder();
  }, []);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark text-text-muted-light dark:text-text-muted-dark">
            <th className="py-3 px-4 font-medium">Mã ĐH</th>
            <th className="py-3 px-4 font-medium">Khách hàng</th>
            <th className="py-3 px-4 font-medium">Ngày đặt</th>
            <th className="py-3 px-4 font-medium">Tổng tiền</th>
            <th className="py-3 px-4 font-medium">Trạng thái</th>
            <th className="py-3 px-4 font-medium"></th>
          </tr>
        </thead>
        <tbody>
          {dataOrders.map((order) => {
            const formatMoneyString = (value: string) =>
              Number(value).toLocaleString("vi-VN");

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
                <td className="py-3 px-4 text-right">
                  <button
                    onClick={() => {
                      navigate("/orders/" + order.id);
                    }}
                    className="p-1.5 rounded-full hover:bg-primary/20"
                  >
                    <MdOutlineVisibility className="text-lg" />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
export default OrderList;
