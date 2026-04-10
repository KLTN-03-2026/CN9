import { Modal } from "antd";

import {
  MdAssignmentReturn,
  MdLocalShipping,
  MdOutlineAssignment,
  MdOutlineLocalShipping,
  MdOutlineVerified,
  MdPayments,
  MdSupportAgent,
} from "react-icons/md";
import { IoCloseCircleOutline } from "react-icons/io5";
import { FaRegCheckCircle } from "react-icons/fa";
import { FaArrowRotateRight, FaLocationDot } from "react-icons/fa6";
import { RiShoppingCartLine } from "react-icons/ri";

import { formatMoneyString } from "../../utils/formatPrice";

import { confirmOrderReceived, getOrderById } from "../../api/orderApi";

import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import {
  addOrderItem,
  setOrderItem,
  type OrderItem,
} from "../../redux/order/orderSlice";

import OrderCancelForm from "./OrderCancelForm";
import OrderReturnForm from "./OrderReturnForm";
import type { OrderItemType, OrderType } from "../../type/OrderType";
import type { PaymentStatus } from "../../api/paymentApi";

interface OrderDetailProps {
  isShowDetail: boolean;
  idOrder: number | null;
  setIsShowDetail: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderDetail({
  isShowDetail,
  idOrder,
  setIsShowDetail,
}: OrderDetailProps) {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [dataOrderDetail, setDataOrderDetail] = useState<OrderType | null>(
    null,
  );

  const [overlayCancel, setOverlayCancel] = useState(false);

  const [overlayReturn, setOverlayReturn] = useState(false);

  const [orderItemReturn, setOrderItemReturn] = useState<OrderItemType | null>(
    null,
  );

  const handeGetOrderDetail = async (orderId: number) => {
    try {
      const resDetail = await getOrderById(orderId);
      setDataOrderDetail(resDetail.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!idOrder) return;

    handeGetOrderDetail(idOrder);
  }, [idOrder]);

  const steps = [
    {
      code: "PENDING",
      label: "Chờ xử lý",
      icon: <MdOutlineAssignment size={20} />,
    },
    {
      code: "CONFIRMED",
      label: "Đã xác nhận",
      icon: <MdOutlineVerified size={20} />,
    },
    {
      code: "SHIPPING",
      label: "Đang giao",
      icon: <MdOutlineLocalShipping size={20} />,
    },
    {
      code: "DELIVERED",
      label: "Hoàn thành",
      icon: <FaRegCheckCircle size={20} />,
    },
  ];

  const paymentStatusConfig: Record<PaymentStatus, { label: string }> = {
    pending: {
      label: "Chờ thanh toán",
    },
    processing: {
      label: "Đang xử lý",
    },
    success: {
      label: "Thanh toán thành công",
    },
    failed: {
      label: "Thanh toán thất bại",
    },
    refunded: {
      label: "Đã hoàn tiền",
    },
    partially_refunded: {
      label: "Đã hoàn tiền 1 phần",
    },
  };

  const totalPrice = useMemo(() => {
    if (!dataOrderDetail) return;

    return dataOrderDetail.items.reduce(
      (sum, n) => (sum += Number(n.price) * n.quantity),
      0,
    );
  }, [dataOrderDetail]);

  const voucherDiscount = useMemo(() => {
    if (!dataOrderDetail?.voucher) return 0;
    if (!totalPrice) return 0;

    const voucher = dataOrderDetail.voucher;

    if (voucher.discount_type === "fixed") {
      return Number(voucher.discount_value);
    }

    return (totalPrice * Number(voucher.discount_value)) / 100;
  }, [dataOrderDetail, totalPrice]);

  function handleBuyAllAgain(order: OrderType) {
    const data: OrderItem[] = order.items.map((item) => {
      return {
        color: item.color,
        image_url: item.imageVariant,
        name: item.name,
        price: Number(item.price),
        quantity: item.quantity,
        size: item.size,
        variantId: item.id,
        productId: item.productId,
      };
    });
    dispatch(setOrderItem(data));
    navigate("/payment");
  }

  const handleOrderReceived = async (orderId: number) => {
    try {
      await confirmOrderReceived(orderId);
      handeGetOrderDetail(orderId);
    } catch (error) {
      console.log(error);
    }
  };

  function handleBuyItemAgain(order: OrderItemType) {
    dispatch(
      addOrderItem({
        color: order.color,
        image_url: order.imageVariant,
        name: order.name,
        price: Number(order.price),
        quantity: order.quantity,
        size: order.size,
        variantId: order.id,
        productId: order.productId,
      }),
    );
    navigate("/payment");
  }

  if (!dataOrderDetail) {
    return null;
  }

  return (
    <>
      <Modal
        open={isShowDetail}
        width="auto"
        footer={null}
        onCancel={() => setIsShowDetail(false)}
        mask={false}
      >
        <main className="lg:col-span-9 flex flex-col gap-6 ">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div className="flex flex-col gap-1">
              <h1 className="text-text-light-primary dark:text-text-dark-primary text-2xl font-black">
                Chi tiết Đơn hàng {dataOrderDetail.id}
              </h1>
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                Ngày đặt: 25/10/2023 14:30
              </p>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6 shadow-sm overflow-x-auto">
            <div className="min-w-[600px] relative flex justify-between">
              <div className="absolute top-5 left-0 w-full h-0.5 bg-gray-200 dark:bg-gray-700 -z-10" />
              <div className="absolute top-5 left-0 w-2/3 h-0.5 bg-primary -z-10" />
              <div className="flex justify-between items-center w-full">
                {steps.map((step, index) => {
                  const currentIndex = steps.findIndex(
                    (step) => step.code === dataOrderDetail.status.code,
                  );
                  const isActive = index <= currentIndex;

                  return (
                    <div
                      key={step.code}
                      className={`flex flex-col items-center gap-3 ${
                        isActive ? "" : "opacity-40"
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
                          isActive
                            ? "bg-primary text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-500"
                        }`}
                      >
                        {step.icon}
                      </div>

                      <div className="text-center">
                        <p className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">
                          {step.label}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-text-light-primary dark:text-text-dark-primary mb-4 flex items-center gap-2">
                <FaLocationDot className="text-primary" />
                Địa chỉ nhận hàng
              </h3>
              <div className="flex flex-col gap-1 text-sm">
                <p className="font-semibold text-text-light-primary dark:text-text-dark-primary">
                  {dataOrderDetail.name}
                </p>
                <p className="text-text-light-secondary dark:text-text-dark-secondary">
                  {dataOrderDetail.phone}
                </p>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
                  {dataOrderDetail.address}
                </p>
              </div>
            </div>
            <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-5 shadow-sm">
              <h3 className="font-bold text-text-light-primary dark:text-text-dark-primary mb-4 flex items-center gap-2">
                <MdPayments className="text-primary" />
                Phương thức thanh toán
              </h3>
              <div className="flex flex-col gap-1 text-sm">
                <div className="flex items-center gap-2 text-text-light-primary dark:text-text-dark-primary">
                  <p className="font-semibold">
                    {dataOrderDetail.payment.method.code}
                  </p>
                </div>
                <p className="text-text-light-secondary dark:text-text-dark-secondary mt-1">
                  Trạng thái:{" "}
                  <span className="text-green-600 font-medium">
                    {paymentStatusConfig[dataOrderDetail.payment.status].label}
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl shadow-sm overflow-hidden">
            <div className="p-5 border-b border-border-light dark:border-border-dark">
              <h3 className="font-bold text-text-light-primary dark:text-text-dark-primary">
                Sản phẩm đã chọn
              </h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-white/5 text-xs font-bold uppercase text-text-light-secondary dark:text-text-dark-secondary tracking-wider">
                    <th className="px-5 py-3">Sản phẩm</th>
                    <th className="px-5 py-3 text-center">Đơn giá</th>
                    <th className="px-5 py-3 text-center">Số lượng</th>
                    <th className="px-5 py-3 text-right">Thành tiền</th>
                    {dataOrderDetail.status.code === "DELIVERED" ? (
                      <th className="px-5 py-3 text-center">Thao tác</th>
                    ) : (
                      <></>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-border-light dark:divide-border-dark">
                  {dataOrderDetail.items.map((i) => {
                    return (
                      <tr>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-4">
                            <img
                              className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                              src={i.imageVariant}
                            />
                            <div>
                              <h4 className="text-sm font-bold text-text-light-primary dark:text-text-dark-primary">
                                {i.name}
                              </h4>
                              <p className="text-xs text-text-light-secondary dark:text-text-dark-secondary mt-0.5">
                                {i.color} | Size {i.size}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-center text-sm text-text-light-primary dark:text-text-dark-primary">
                          {formatMoneyString(i.price)}₫
                        </td>
                        <td className="px-5 py-4 text-center text-sm text-text-light-primary dark:text-text-dark-primary">
                          {i.quantity}
                        </td>
                        <td className="px-5 py-4 text-right text-sm font-bold text-text-light-primary dark:text-text-dark-primary">
                          {formatMoneyString(
                            String(Number(i.price) * i.quantity),
                          )}
                          ₫
                        </td>
                        {dataOrderDetail.status.code === "DELIVERED" ? (
                          <td className="px-5 py-4 text-center">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                onClick={() => handleBuyItemAgain(i)}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary hover:bg-primary/90 text-text-light-primary rounded-lg text-xs font-bold transition-colors shadow-sm"
                              >
                                <RiShoppingCartLine className="!text-sm" />
                                <span>Mua lại</span>
                              </button>
                              <button
                                onClick={() => {
                                  setOrderItemReturn(i);
                                  setOverlayReturn(true);
                                }}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400 rounded-lg text-xs font-bold hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                              >
                                <MdAssignmentReturn className="!text-sm" />
                                Trả hàng
                              </button>
                            </div>
                          </td>
                        ) : (
                          <></>
                        )}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
          <div className="flex flex-col md:flex-row gap-6 justify-end">
            <div className="w-full md:w-96">
              <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-5 shadow-sm">
                <h3 className="font-bold text-text-light-primary dark:text-text-dark-primary mb-4">
                  Tổng kết đơn hàng
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    <span>Tạm tính</span>
                    <span>{formatMoneyString(String(totalPrice))}₫</span>
                  </div>
                  <div className="flex justify-between text-sm text-text-light-secondary dark:text-text-dark-secondary">
                    <span>Phí vận chuyển</span>
                    <span>0₫</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light-secondary dark:text-text-dark-secondary">
                      Voucher (LUXE2024)
                    </span>
                    <span className="text-green-700 dark:text-green-500 font-medium">
                      -{formatMoneyString(String(voucherDiscount))}₫
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-text-light-secondary dark:text-text-dark-secondary">
                      Điểm tích lũy
                    </span>
                    <span className="text-red-500 font-medium">
                      -{" "}
                      {formatMoneyString(String(dataOrderDetail.pointDiscount))}
                      ₫
                    </span>
                  </div>
                  <div className="border-t border-border-light dark:border-border-dark my-2 pt-4 flex justify-between items-center">
                    <span className="text-base font-bold text-text-light-primary dark:text-text-dark-primary">
                      Tổng cộng
                    </span>
                    <span className="text-xl font-black text-primary">
                      {formatMoneyString(String(dataOrderDetail.totalPrice))}₫
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-4 justify-end mt-4">
            <button className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-white dark:bg-card-dark border border-border-light dark:border-border-dark text-sm font-bold text-text-light-primary dark:text-text-dark-primary hover:bg-black/5 transition-colors">
              <MdSupportAgent className="!text-xl" />
              <span>Liên hệ hỗ trợ</span>
            </button>
            {["PENDING", "CONFIRMED", "PROCESSING"].includes(
              dataOrderDetail.status.code,
            ) ? (
              <button
                onClick={() => setOverlayCancel(true)}
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-6 bg-white dark:bg-card-dark border border-red-200 dark:border-red-900 text-sm font-bold text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors cursor-pointer"
              >
                <IoCloseCircleOutline className="!text-xl" />
                <span>Hủy đơn hàng</span>
              </button>
            ) : (
              <></>
            )}
            {dataOrderDetail.status.code === "DELIVERED" ? (
              <button
                onClick={() => {
                  handleBuyAllAgain(dataOrderDetail);
                }}
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-8 bg-primary hover:bg-primary/90 text-text-light-primary text-sm font-bold transition-colors shadow-lg shadow-primary/20"
              >
                <FaArrowRotateRight className="!text-xl" />
                <span>Mua lại lần nữa</span>
              </button>
            ) : (
              <></>
            )}
            {dataOrderDetail.status.code === "SHIPPING" ? (
              <button
                onClick={() => {
                  handleOrderReceived(dataOrderDetail.id);
                }}
                className="flex items-center justify-center gap-2 rounded-lg h-11 px-8 bg-primary hover:bg-primary/90 text-text-light-primary text-sm font-bold transition-colors shadow-lg shadow-primary/20"
              >
                <MdLocalShipping className="!text-xl" />
                <span>Đã nhận hàng</span>
              </button>
            ) : (
              <></>
            )}
          </div>
        </main>
      </Modal>
      {overlayCancel && (
        <OrderCancelForm
          orderId={dataOrderDetail.id}
          setOverlayCancel={setOverlayCancel}
          setIsShowDetail={setIsShowDetail}
        />
      )}
      {overlayReturn && (
        <OrderReturnForm
          orderItem={orderItemReturn}
          setOverlayReturn={setOverlayReturn}
        />
      )}
    </>
  );
}

export default OrderDetail;
