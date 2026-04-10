import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getOrderById, updateOrderStatusById } from "../../api/orderApi";

import { OrderDetailType, PaymentStatus } from "../../types/OrderType";

import { FaRegCheckCircle } from "react-icons/fa";
import {
  MdOutlineAccountCircle,
  MdOutlineAssignment,
  MdOutlineCancel,
  MdOutlineLocalShipping,
  MdOutlineReceipt,
  MdOutlineVerified,
  MdPayments,
  MdReplay,
} from "react-icons/md";
import { IoArrowForwardOutline, IoPersonOutline } from "react-icons/io5";
import { GiCardboardBoxClosed } from "react-icons/gi";

import { formatMoneyString } from "../../utils/formatPrice";

import HeaderPage from "../../components/common/Header";
import ButtonBack from "../../components/common/ButtonBack";

import OrderReturnForm from "../../components/order/OrderReturnForm";
import OrderCancelForm from "../../components/order/OrderCancelForm";
import { confirmCodPaymentReceived } from "../../api/paymentApi";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/auth/authStore";

function OrderDetailPage() {
  const { orderId } = useParams();

  const account = useSelector((state: RootState) => state.auth.user);

  const [isShowReturn, setIsShowReturn] = useState(false);

  const [isShowCancel, setIsShowCancel] = useState(false);

  const [dataOrderDetail, setDataOrderDetail] =
    useState<OrderDetailType | null>(null);

  const handeGetOrderDetail = async (orderId: number) => {
    try {
      const resDetail = await getOrderById(orderId);
      setDataOrderDetail(resDetail.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!orderId) return;

    handeGetOrderDetail(Number(orderId));
  }, [orderId]);

  const steps = [
    {
      code: "PENDING",
      label: "Chờ xác nhận",
      icon: <MdOutlineAssignment size={20} />,
    },
    {
      code: "CONFIRMED",
      label: "Đã xác nhận",
      icon: <MdOutlineVerified size={20} />,
    },
    {
      code: "PROCESSING",
      label: "Đang gói hàng",
      icon: <GiCardboardBoxClosed size={20} />,
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

  const currentIndex = steps.findIndex(
    (step) => step.code === dataOrderDetail?.status.code,
  );

  const progressPercent = ((currentIndex + 1) / steps.length) * 100;

  const paymentStatusConfig: Record<PaymentStatus, { label: string }> = {
    pending: {
      label: "Chờ thanh toán",
    },
    processing: {
      label: "Đang xử lý",
    },
    success: {
      label: "Thành công",
    },
    failed: {
      label: "Thất bại",
    },
    partially_refunded: {
      label: "Đã hoàn tiền 1 phần",
    },
    refunded: {
      label: "Đã hoàn tiền",
    },
  };

  type CancelableStatus = "PENDING" | "CONFIRMED" | "PROCESSING";

  const orderStatusCOnfig: Record<CancelableStatus, { label: string }> = {
    PENDING: {
      label: "Xác nhận đơn hàng",
    },
    CONFIRMED: {
      label: "Đóng gói đơn hàng",
    },
    PROCESSING: {
      label: "Giao đơn hàng cho ship",
    },
  };

  const totalPrice = useMemo(() => {
    if (!dataOrderDetail) return 0;

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

  if (!dataOrderDetail) {
    return null;
  }

  const handleToggleOrderStatus = async (orderId: number) => {
    try {
      await updateOrderStatusById(orderId);
      handeGetOrderDetail(Number(orderId));
    } catch (error) {
      console.log(error);
    }
  };

  const handleConfirmPayment = async (id: number) => {
    try {
      if (!account) return;

      await confirmCodPaymentReceived(id, account.accountId);
      handeGetOrderDetail(Number(orderId));
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <HeaderPage
        content="Quản lý chi tiết của đơn hàng và chuyển trạng thái đơn hàng"
        title={`Chi tiết đơn hàng ${orderId}`}
        component={<ButtonBack />}
      />
      <div className="max-w-7xl mx-auto w-full">
        <div className="bg-white dark:bg-slate-900 rounded-xl p-6 border border-slate-200 dark:border-slate-800 mb-8 shadow-sm">
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
            <div className="space-y-1 min-w-fit">
              <p className="text-slate-500 text-sm font-medium">
                Trạng thái hiện tại
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: dataOrderDetail.status.hex }}
                />
                <h3
                  className="text-xl font-bold"
                  style={{ color: dataOrderDetail.status.hex }}
                >
                  {dataOrderDetail.status.name}
                </h3>
              </div>
            </div>
            <div className="flex-1">
              <div className="flex justify-between text-[10px] sm:text-xs font-bold mb-3 uppercase tracking-wider">
                {steps.map((step, index) => {
                  const isActive = index <= currentIndex;

                  return (
                    <span
                      key={step.code}
                      className={`flex items-center gap-1 ${
                        isActive ? "text-primary" : "text-slate-400"
                      }`}
                    >
                      {step.icon}
                      {step.label}
                    </span>
                  );
                })}
              </div>

              <div className="relative h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="absolute top-0 left-0 h-full bg-primary transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            <OrderCancelForm
              isShowCancel={isShowCancel}
              setIsShowCancel={setIsShowCancel}
              orderId={dataOrderDetail.id}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-4 space-y-8">
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center">
                <h4 className="font-bold">Sản phẩm trong đơn</h4>
                <span className="bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-600 dark:text-slate-400">
                  {dataOrderDetail.items.length} Sản phẩm
                </span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-6 py-4 font-semibold">Sản phẩm</th>
                      <th className="px-6 py-4 font-semibold">Phân loại</th>
                      <th className="px-6 py-4 font-semibold">Giá</th>
                      <th className="px-6 py-4 font-semibold">Số lượng</th>
                      <th className="px-6 py-4 font-semibold text-right">
                        Thành tiền
                      </th>
                      {[
                        "RETURNED",
                        "RETURN_REQUESTED",
                        "RETURN_REJECTED",
                        "PARTIALLY_RETURNED",
                      ].includes(dataOrderDetail.status.code) ? (
                        <th className="px-6 py-4 font-semibold">Thao tác</th>
                      ) : (
                        <></>
                      )}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {dataOrderDetail.items.map((item) => {
                      return (
                        <tr>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 rounded-lg bg-slate-100 dark:bg-slate-800 flex-shrink-0 overflow-hidden">
                                <img
                                  alt="Product"
                                  className="w-full h-full object-cover"
                                  src={item.imageVariant}
                                />
                              </div>
                              <div>
                                <p className="font-bold text-sm">{item.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {item.color} | Size {item.size}
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {formatMoneyString(String(item.price))}đ
                          </td>
                          <td className="px-6 py-4 text-sm text-center font-medium">
                            {item.quantity}
                          </td>
                          <td className="px-6 py-4 text-sm font-bold text-right">
                            {formatMoneyString(
                              String(item.price * item.quantity),
                            )}
                            đ
                          </td>
                          {[
                            "RETURNED",
                            "RETURN_REQUESTED",
                            "RETURN_REJECTED",
                            "PARTIALLY_RETURNED",
                          ].includes(dataOrderDetail.status.code) ? (
                            <td className="px-6 py-4 text-sm text-right">
                              <button
                                onClick={() => {
                                  setIsShowReturn(true);
                                }}
                                className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center gap-2"
                              >
                                <MdReplay className="text-lg" />
                                Hoàn trả
                              </button>
                            </td>
                          ) : (
                            <></>
                          )}
                          {item.returns ? (
                            <OrderReturnForm
                              priceReturn={item.price * item.quantity}
                              orderItemId={item.id}
                              returnData={item.returns}
                              isShowReturn={isShowReturn}
                              setIsShowReturn={setIsShowReturn}
                            />
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
          </div>
          <div className="space-x-7 lg:col-span-4 flex">
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <IoPersonOutline className="text-slate-400 text-xl" />
                Khách hàng
              </h4>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <MdOutlineAccountCircle className="text-2xl" />
                  </div>
                  <div>
                    <p className="text-sm font-bold">{dataOrderDetail.name}</p>
                  </div>
                </div>
                <div className="grid gap-2 pt-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">SĐT:</span>
                    <span className="font-medium">{dataOrderDetail.phone}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-500">Email:</span>
                    <span className="font-medium text-wrap break-all">
                      {dataOrderDetail.email}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <MdOutlineLocalShipping className="text-slate-400 text-xl" />
                Vận chuyển
              </h4>
              <div className="space-y-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <p className="text-xs font-bold text-slate-500 uppercase mb-1">
                    Địa chỉ nhận hàng
                  </p>
                  <p className="text-sm leading-relaxed">
                    {dataOrderDetail.address}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex-1 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 p-6 shadow-sm">
              <h4 className="font-bold mb-4 flex items-center gap-2">
                <MdOutlineReceipt className="text-slate-400 text-xl" />
                Thanh toán
              </h4>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Tạm tính:</span>
                  <span>{formatMoneyString(String(totalPrice))}đ</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Phí vận chuyển:</span>
                  <span>0đ</span>
                </div>
                <div className="flex justify-between text-sm text-green-500">
                  <span>Voucher giảm giá:</span>
                  <span>-{formatMoneyString(String(voucherDiscount))}đ</span>
                </div>
                <div className="flex justify-between text-sm text-red-500">
                  <span>Voucher giảm giá:</span>
                  <span>
                    -{formatMoneyString(String(dataOrderDetail.pointDiscount))}đ
                  </span>
                </div>
                <div className="pt-3 mt-3 border-t border-dashed border-slate-200 dark:border-slate-700 flex justify-between">
                  <span className="font-bold">Tổng cộng:</span>
                  <span className="text-lg font-black text-slate-900 dark:text-white">
                    {formatMoneyString(String(dataOrderDetail.totalPrice))}đ
                  </span>
                </div>
                <div className="mt-4 p-2 bg-green-500/10 text-green-600 dark:text-green-500 rounded text-center text-xs font-bold uppercase tracking-widest">
                  (
                  {
                    paymentStatusConfig[
                      dataOrderDetail.payment.status as PaymentStatus
                    ].label
                  }
                  )
                </div>
              </div>
            </div>
          </div>
          <div className="col-span-4">
            <div className="flex flex-col sm:flex-row items-center gap-3 justify-end">
              {dataOrderDetail.status.isCancelable ||
              dataOrderDetail.status.code === "SHIPPING" ? (
                <button
                  onClick={() => setIsShowCancel(true)}
                  className="px-4 py-2.5 rounded-lg bg-red-500/10 border border-red-200 dark:border-red-900/30 text-red-500 text-sm font-bold hover:bg-red-50 dark:hover:bg-red-900/10 transition-all flex items-center gap-2"
                >
                  <MdOutlineCancel className="text-lg" />
                  Hủy đơn
                </button>
              ) : (
                <></>
              )}
              {dataOrderDetail.status.isFinal ? (
                <></>
              ) : (
                <button
                  onClick={() => {
                    handleToggleOrderStatus(dataOrderDetail.id);
                  }}
                  className="flex items-center gap-2 bg-primary px-6 py-3 rounded-lg text-slate-900 font-bold hover:shadow-lg hover:shadow-primary/20 transition-all border-none outline-none group"
                >
                  <span>
                    {
                      orderStatusCOnfig[
                        dataOrderDetail.status.code as CancelableStatus
                      ].label
                    }
                  </span>
                  <IoArrowForwardOutline className="text-xl group-hover:translate-x-1 transition-transform" />
                </button>
              )}

              {dataOrderDetail.status.code === "DELIVERED" &&
              dataOrderDetail.payment.status === "pending" &&
              dataOrderDetail.payment.method.code === "COD" ? (
                <button
                  onClick={() =>
                    handleConfirmPayment(dataOrderDetail.payment.id)
                  }
                  className="flex items-center gap-2 bg-primary px-6 py-3 rounded-lg text-slate-900 font-bold hover:shadow-lg hover:shadow-primary/20 transition-all border-none outline-none group"
                >
                  <MdPayments className="text-lg" />
                  Đã nhận tiền
                </button>
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailPage;
