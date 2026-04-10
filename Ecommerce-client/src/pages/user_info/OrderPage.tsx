import { useEffect, useMemo, useState } from "react";

import { getAllOrderStatuses, getMyOrders } from "../../api/orderApi";
import { createVNPayUrl, type PaymentStatus } from "../../api/paymentApi";

import { formatMoneyString } from "../../utils/formatPrice";

import ReviewForm from "../../components/review/ReviewForm";

import OrderDetail from "../../components/order/OrderDetail";

import type {
  OrderStatusCode,
  OrderStatusType,
  OrderType,
} from "../../type/OrderType";

function OrderPage() {
  const [dataMyOrders, setDataMyOrders] = useState<OrderType[]>([]);

  const [dataOrderStatus, setDataOrderStatus] = useState<OrderStatusType[]>([]);

  const [selectOrderStatus, setSelectOrderStatus] =
    useState<OrderStatusCode>("");

  const [isShowDetail, setIsShowDetail] = useState(false);

  const [isOrder, setIsOrder] = useState<number | null>(null);

  const getDataMyOrder = async () => {
    try {
      const [resMOrder, resStatus] = await Promise.all([
        getMyOrders(),
        getAllOrderStatuses(),
      ]);
      setDataOrderStatus(resStatus.data);
      setDataMyOrders(
        resMOrder.data.map((order: OrderType) => ({
          ...order,
          isComment: false,
        })),
      );
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataMyOrder();
  }, []);

  const filterDataMyOrders = useMemo(() => {
    if (!selectOrderStatus) return dataMyOrders;

    return dataMyOrders.filter(
      (order) => order.status.code === selectOrderStatus,
    );
  }, [selectOrderStatus, dataMyOrders]);

  function hanldeShowComment(orderId: number) {
    setDataMyOrders((prev) =>
      prev.map((p) =>
        p.id === orderId ? { ...p, isComment: !p.isComment } : p,
      ),
    );
  }

  const paymentStatusConfig: Record<
    PaymentStatus,
    { label: string; bg: string; color: string }
  > = {
    pending: {
      label: "Chờ thanh toán",
      bg: "#FEF3C7",
      color: "#92400E",
    },
    processing: {
      label: "Đang xử lý",
      bg: "#DBEAFE",
      color: "#1E40AF",
    },
    success: {
      label: "Thanh toán thành công",
      bg: "#DCFCE7",
      color: "#166534",
    },
    failed: {
      label: "Thanh toán thất bại",
      bg: "#FEE2E2",
      color: "#991B1B",
    },
    refunded: {
      label: "Đã hoàn tiền",
      bg: "#F3E8FF",
      color: "#6B21A8",
    },
    partially_refunded: {
      label: "Hoàn tiền một phần",
      bg: "#E0F2FE",
      color: "#075985",
    },
  };

  const handlePayment = async (order: OrderType) => {
    try {
      if (order.payment.method.code === "VNPAY") {
        const resPayment = await createVNPayUrl({
          orderId: order.id,
          amount: Number(order.totalPrice),
        });

        window.location.href = resPayment.url;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-text-light-primary dark:text-text-dark-primary text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Quản lý đơn hàng
          </h1>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal">
            Xem và quản lý các đơn hàng hiện tại và đang chờ xử lý.
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
        <button
          onClick={() => setSelectOrderStatus("")}
          className={`flex-none px-5 py-2.5 text-sm rounded-lg ${selectOrderStatus === "" ? "font-semibold bg-primary/20 text-text-light-primary dark:text-text-dark-primary border border-primary/30" : "font-medium bg-white dark:bg-card-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-primary/10 transition-colors border border-border-light dark:border-border-dark"}`}
        >
          Tất cả
        </button>
        {dataOrderStatus.map((status) => {
          return (
            <button
              key={status.id}
              onClick={() => {
                setSelectOrderStatus(status.code);
              }}
              className={`flex-none px-5 py-2.5 text-sm rounded-lg ${selectOrderStatus === status.code ? "font-semibold bg-primary/20 text-text-light-primary dark:text-text-dark-primary border border-primary/30" : "font-medium bg-white dark:bg-card-dark text-text-light-secondary dark:text-text-dark-secondary hover:bg-primary/10 transition-colors border border-border-light dark:border-border-dark"}`}
            >
              {status.name}
            </button>
          );
        })}
      </div>
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-4 sm:p-6 flex flex-col gap-6">
        {filterDataMyOrders.map((order) => {
          const date = new Date(order.createdAt);

          const statusPayment = paymentStatusConfig[order.payment.status];

          return (
            <div
              key={order.id}
              className={`flex flex-col gap-4 border border-border-light dark:border-border-dark rounded-lg p-4 ${["CANCELLED", "RETURNED"].includes(order.status.code) ? "opacity-60 pointer-events-none" : ""}`}
            >
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 pb-4 border-b border-border-light dark:border-border-dark">
                <div className="flex flex-col flex-1">
                  <p className="font-bold text-text-light-primary dark:text-text-dark-primary">
                    Mã đơn hàng: {order.id}
                  </p>
                  <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    Ngày đặt:{" "}
                    {date.toLocaleString("vi-VN", {
                      timeZone: "Asia/Ho_Chi_Minh",
                    })}
                  </p>
                </div>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit"
                  style={{
                    backgroundColor: statusPayment.bg,
                    color: statusPayment.color,
                  }}
                >
                  {statusPayment.label}
                </span>
                <span
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium w-fit"
                  style={{
                    backgroundColor: order.status.hex,
                  }}
                >
                  {order.status.name}
                </span>
              </div>
              <div className="flex flex-col gap-4">
                {order.items.map((i) => {
                  return (
                    <div className="flex gap-4">
                      <img
                        alt="Product Image 1"
                        className="w-20 h-20 object-cover rounded-lg"
                        src={i.imageVariant}
                      />
                      <div className="flex flex-col flex-grow">
                        <h4 className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                          {i.name}
                        </h4>
                        <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                          Số lượng: {i.quantity}
                        </p>
                        <p className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary mt-auto">
                          {formatMoneyString(
                            String(i.quantity * Number(i.price)),
                          )}
                          ₫
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {order.status.code === "DELIVERED" && order ? (
                <button
                  onClick={() => hanldeShowComment(order.id)}
                  className="flex min-w-[84px] self-start sm:self-center cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/20 text-text-light-primary dark:bg-primary/30 dark:text-text-dark-primary text-xs font-bold leading-normal tracking-[0.015em]"
                >
                  <span className="truncate">Đánh giá sản phẩm</span>
                </button>
              ) : (
                <></>
              )}
              <ReviewForm
                items={order.items}
                isComment={order.isComment}
                order={order}
                onToggleComment={hanldeShowComment}
              />
              <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pt-4 border-t border-border-light dark:border-border-dark">
                <div className="flex flex-col">
                  <p className="font-bold text-text-light-primary dark:text-text-dark-primary">
                    Tổng cộng: {formatMoneyString(order.totalPrice)}₫
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  {["DELIVERED", "CANCELLED", "RETURNED"].includes(
                    order.status.code,
                  ) ? (
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/20 text-text-light-primary dark:bg-primary/30 dark:text-text-dark-primary text-xs font-bold leading-normal tracking-[0.015em]">
                      <span className="truncate">Mua lại</span>
                    </button>
                  ) : (
                    <button className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 text-text-light-primary dark:text-text-dark-primary bg-transparent border border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/5 text-xs font-bold leading-normal tracking-[0.015em]">
                      <span className="truncate">Liên hệ hỗ trợ</span>
                    </button>
                  )}
                  {["processing"].includes(order.payment.status) ? (
                    <button
                      onClick={() => {
                        handlePayment(order);
                      }}
                      className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/20 text-text-light-primary dark:bg-primary/30 dark:text-text-dark-primary text-xs font-bold leading-normal tracking-[0.015em]"
                    >
                      <span className="truncate">Thanh toán</span>
                    </button>
                  ) : (
                    <></>
                  )}
                  <button
                    onClick={() => {
                      setIsOrder(order.id);
                      setIsShowDetail(true);
                    }}
                    className="flex min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-9 px-4 bg-primary/20 text-text-light-primary dark:bg-primary/30 dark:text-text-dark-primary text-xs font-bold leading-normal tracking-[0.015em]"
                  >
                    <span className="truncate">Xem chi tiết</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
        <OrderDetail
          isShowDetail={isShowDetail}
          idOrder={isOrder}
          setIsShowDetail={setIsShowDetail}
        />
      </div>
    </div>
  );
}

export default OrderPage;
