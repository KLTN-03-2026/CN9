import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { IoMdArrowBack } from "react-icons/io";


import { getAllPaymentMethodsActive } from "../../api/paymentMethodApi";

import { setPayment } from "../../redux/order/orderSlice";
import { formatMoneyString } from "../../utils/formatPrice";
import {
  selectFinalTotal,
  selectOriginalTotal,
  selectTotalDiscount,
} from "../../redux/order/orderSelector";
import type { PaymentMethoodType } from "../../type/PaymentMethoodType";
import type { RootState } from "../../redux/store/store";

function PayPage() {
  const navigate = useNavigate();

  const originalTotal = useSelector(selectOriginalTotal);
  const discountTotal = useSelector(selectTotalDiscount);
  const finalTotal = useSelector(selectFinalTotal);

  const [dataPaymentMethod, setDataPaymentMethod] = useState<
    PaymentMethoodType[]
  >([]);

  const order = useSelector((state: RootState) => state.order);

  const dispatch = useDispatch();

  const getDataPaymentMethods = async () => {
    try {
      const resPaymentMethod = await getAllPaymentMethodsActive();
      setDataPaymentMethod(resPaymentMethod.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataPaymentMethods();
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-16">
      <div className="lg:col-span-3">
        <h1 className="text-3xl font-bold mb-8 text-slate-900 dark:text-white">
          Phương thức thanh toán
        </h1>
        <div className="space-y-4">
          {dataPaymentMethod.map((paymentMethod) => {
            return (
              <div
                className={`border ${order.paymentMethod.id === paymentMethod.id ? "border-primary bg-green-50 dark:bg-green-900/30" : " border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800/50"}  rounded p-4`}
              >
                <label
                  htmlFor={paymentMethod.code}
                  className="flex items-center cursor-pointer"
                >
                  <input
                    className="form-radio text-primary focus:ring-primary"
                    id={paymentMethod.code}
                    name={paymentMethod.code}
                    type="radio"
                    checked={order.paymentMethod.id === paymentMethod.id}
                    onChange={() =>
                      dispatch(
                        setPayment({
                          id: paymentMethod.id,
                          code: paymentMethod.code,
                        }),
                      )
                    }
                  />
                  <div className="ml-4 flex-grow">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {paymentMethod.name + " (" + paymentMethod.code + ")"}
                      </span>
                    </div>
                  </div>
                </label>
              </div>
            );
          })}
        </div>
        <div className="mt-8 flex justify-between items-center">
          <p
            onClick={() => navigate(-1)}
            className="text-sm cursor-pointer font-medium text-slate-600 dark:text-slate-400 hover:text-primary dark:hover:text-primary transition-colors flex items-center gap-1"
          >
            <IoMdArrowBack className="text-base" />
            Quay lại
          </p>
          <button
            onClick={() => {
              navigate("/payment/confirm");
            }}
            className="bg-primary text-white font-bold py-3 px-6 rounded hover:bg-green-600 transition-colors shadow-lg shadow-primary/20"
          >
            Hoàn tất đặt hàng
          </button>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm">
          <h2 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">
            Tóm tắt đơn hàng
          </h2>
          <div className="space-y-4">
            {order.items.map((i) => {
              const totalPrice = i.price * i.quantity;

              return (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <img
                      alt={i.name}
                      className="w-16 h-16 rounded object-cover bg-slate-100"
                      src={i.image_url}
                    />
                    <div>
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {i.name}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Màu: {i.color}, Size: {i.size}
                      </p>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Số lượng: {i.quantity}
                      </p>
                    </div>
                  </div>
                  <p className="font-medium text-slate-800 dark:text-slate-200">
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
                    đ
                  </p>
                </div>
              );
            })}
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
          <div className="space-y-2">
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <p>Tạm tính</p>
              <p>{formatMoneyString(String(originalTotal))}đ</p>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <p>Phí vận chuyển</p>
              <p>0đ</p>
            </div>
            <div className="flex justify-between text-slate-600 dark:text-slate-300">
              <p>Giảm giá</p>
              <p>-{formatMoneyString(String(discountTotal))}đ</p>
            </div>
          </div>
          <div className="border-t border-slate-200 dark:border-slate-700 my-4" />
          <div className="flex justify-between items-center">
            <p className="text-lg font-bold text-slate-900 dark:text-white">
              Tổng cộng
            </p>
            <p className="text-xl font-bold text-primary">
              {formatMoneyString(String(finalTotal))}đ
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PayPage;
