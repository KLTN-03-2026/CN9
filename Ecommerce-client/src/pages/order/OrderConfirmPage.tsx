import { useDispatch, useSelector } from "react-redux";

import { formatMoneyString } from "../../utils/formatPrice";

import { MdLocalShipping } from "react-icons/md";

import {
  selectFinalTotal,
  selectOriginalTotal,
  selectPointDiscount,
  selectTotalDiscount,
} from "../../redux/order/orderSelector";

import { removeItem } from "../../redux/cart/cartSlice";

import { createOrder } from "../../api/orderApi";
import { removeProductToCart } from "../../api/cartApi";
import { createPayment, createVNPayUrl } from "../../api/paymentApi";

import { useNavigate } from "react-router-dom";
import { clearOrder } from "../../redux/order/orderSlice";
import type { RootState } from "../../redux/store/store";

function OrderConfirmPage() {
  const navigate = useNavigate();

  const order = useSelector((state: RootState) => state.order);

  const dispatch = useDispatch();

  const finalTotal = useSelector(selectFinalTotal);
  const originalTotal = useSelector(selectOriginalTotal);
  const discountTotal = useSelector(selectTotalDiscount);
  const pointDiscount = useSelector(selectPointDiscount);

  const handleSubmitOrder = async () => {
    try {
      if (!order.isSubmitting) return;

      const variantIds = order.items.map((item) => item.variantId);

      const earnedPoints = finalTotal / 10000;

      const resOrder = await createOrder({
        address: order.customer.shippingAddress,
        email: order.customer.email,
        name: order.customer.fullName,
        phone: order.customer.phone,
        paymentMethod: order.paymentMethod.id,
        shippingFee: 0,
        totalPrice: finalTotal,
        earnedPoints,
        item: order.items,
        note: order.note,
        usedPoints: order.pointDiscount?.value,
        voucherId: order.voucher?.id,
        pointDiscount: pointDiscount,
      });

      variantIds.map(async (v) => {
        dispatch(removeItem(v));
        await removeProductToCart(v);
      });

      if (order.paymentMethod.code === "VNPAY") {
        const resPayment = await createVNPayUrl({
          orderId: resOrder.orderId,
          amount: resOrder.totalPrice,
        });

        window.location.href = resPayment.url;
      } else {
        await createPayment({
          orderId: resOrder.orderId,
          amount: resOrder.totalPrice,
        });

        navigate(
          `/payment/notification?order=${resOrder.orderId}&amount=${resOrder.totalPrice}&method=${"COD"}`,
        );
      }

      dispatch(clearOrder());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      <div className="lg:col-span-2 space-y-8">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Xác nhận đơn hàng
        </h1>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
            Sản phẩm
          </h2>
          <div className="space-y-4">
            {order.items.map((i) => {
              const totalPrice = i.price * i.quantity;

              return (
                <div className="flex items-center gap-4">
                  <img
                    alt={i.name}
                    className="w-16 h-16 object-cover rounded-lg bg-slate-100 dark:bg-slate-700"
                    src={i.image_url}
                  />
                  <div className="flex-1">
                    <p className="font-semibold">{i.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {i.color}, Size: {i.size}
                    </p>
                  </div>
                  <p className="font-semibold">
                    {" "}
                    {formatMoneyString(
                      String(
                        i.sale
                          ? i.sale.discount_type === "fixed"
                            ? totalPrice - i.sale.discount_value
                            : totalPrice -
                              totalPrice * (i.sale.discount_value / 100)
                          : totalPrice,
                      ),
                    )}
                    ₫
                  </p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
              Địa chỉ giao hàng
            </h2>
            <div className="space-y-2 text-slate-600 dark:text-slate-300">
              <p className="font-semibold">{order.customer.fullName}</p>
              <p>{order.customer.phone}</p>
              <p>{order.customer.shippingAddress}</p>
            </div>
          </div>
          <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
            <h2 className="text-lg font-bold mb-4 text-slate-900 dark:text-white">
              Phương thức
            </h2>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <MdLocalShipping className="text-slate-500 dark:text-slate-400" />
                <span className="text-slate-600 dark:text-slate-300">
                  Giao hàng tiêu chuẩn
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-slate-600 dark:text-slate-300">
                  {order.paymentMethod.code}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
            Tóm tắt đơn hàng
          </h2>
          <div className="space-y-3 text-slate-600 dark:text-slate-300">
            <div className="flex justify-between">
              <span>Tạm tính</span>
              <span>{formatMoneyString(String(originalTotal))}₫</span>
            </div>
            <div className="flex justify-between">
              <span>Phí vận chuyển</span>
              <span>0₫</span>
            </div>
            <div className="flex justify-between">
              <span>Giảm giá</span>
              <span>-{formatMoneyString(String(discountTotal))}₫</span>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
          <div className="flex justify-between items-center text-slate-900 dark:text-white">
            <span className="font-bold text-lg">Tổng cộng</span>
            <span className="font-bold text-2xl text-primary">
              {formatMoneyString(String(finalTotal))}₫
            </span>
          </div>
        </div>
        <button
          onClick={() => {
            handleSubmitOrder();
          }}
          className="w-full bg-primary text-white font-bold py-4 px-6 rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center gap-2"
        >
          <span>Hoàn tất đơn hàng</span>
        </button>
      </div>
    </div>
  );
}

export default OrderConfirmPage;
