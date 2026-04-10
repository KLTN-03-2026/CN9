import { FaRegCreditCard } from "react-icons/fa6";
import { IoMdAdd } from "react-icons/io";
import { MdAccountBalance, MdOutlinePayments } from "react-icons/md";

import Button from "../../common/Button";

import { useEffect, useState } from "react";
import { useToast } from "../../../hook/useToast";

import PaymentForm from "./PaymentForm";

import { PaymentMethoodType } from "../../../types/PaymentMethoodType";
import {
  getAllPaymentMethoods,
  toggleActivePaymentMethood,
} from "../../../api/paymentMethoodApi";
import {
  iconForPaymentMethood,
  PaymentMethoodKey,
} from "../../../utils/icon/iconPaymentMethood";

function PaymentMange() {
  const { showToast } = useToast();

  const [isShowModalPayment, setIsShowModalPayment] = useState(false);

  const [dataPaymentMethoods, setDataPaymentMethoods] = useState<
    PaymentMethoodType[]
  >([]);

  const getDataALlPaymentMethoods = async () => {
    try {
      const resPaymentMethoods = await getAllPaymentMethoods();
      console.log(resPaymentMethoods);
      setDataPaymentMethoods(resPaymentMethoods.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataALlPaymentMethoods();
  }, []);

  const handleActiveChangePaymentMethood = async (id: number) => {
    try {
      const resActive = await toggleActivePaymentMethood(id);
      getDataALlPaymentMethoods();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  return (
    <section
      className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark"
      id="payment-settings"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Cài đặt phương thức thanh toán</h2>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
            Quản lý các phương thức thanh toán có sẵn.
          </p>
        </div>
        <Button
          title="Thêm thanh toán"
          icon={<IoMdAdd className="text-xl" />}
          onClick={() => setIsShowModalPayment(true)}
        />
      </div>
      <div className="flex flex-col gap-4 mt-6">
        {dataPaymentMethoods.map((payMe) => {
          const Icon = iconForPaymentMethood[payMe.code as PaymentMethoodKey];
          return (
            <div className="flex items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
              <div className="flex items-center gap-4">
                <Icon className="text-2xl" />
                <div>
                  <p className="font-medium">{payMe.name}</p>
                  <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    {payMe.description}
                  </p>
                </div>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  className="sr-only peer"
                  type="checkbox"
                  value=""
                  onClick={() => handleActiveChangePaymentMethood(payMe.id)}
                  checked={payMe.is_active}
                />
                <div className="w-11 h-6 bg-border-light peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-primary/50 rounded-full peer dark:bg-border-dark peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
              </label>
            </div>
          );
        })}
      </div>
      <PaymentForm
        isShowModalPayment={isShowModalPayment}
        setIsShowModalPayment={setIsShowModalPayment}
      />
    </section>
  );
}

export default PaymentMange;
