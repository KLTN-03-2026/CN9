import { Modal } from "antd";

import HeaderPage from "../../common/Header";
import Button from "../../common/Button";

import { FaRegSave } from "react-icons/fa";

import { ChangeEvent, useState } from "react";

import { CreatePaymentMethood } from "../../../types/PaymentMethoodType";
import { useToast } from "../../../hook/useToast";
import { createPaymentMethood } from "../../../api/paymentMethoodApi";

interface PaymentFormProps {
  isShowModalPayment: boolean;
  setIsShowModalPayment: React.Dispatch<React.SetStateAction<boolean>>;
}

function PaymentForm({
  isShowModalPayment,
  setIsShowModalPayment,
}: PaymentFormProps) {
  const { showToast } = useToast();

  const [inputPaymentMethod, setInputPaymentMethod] =
    useState<CreatePaymentMethood>({
      code: "",
      description: "",
      name: "",
    });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputPaymentMethod, string>>
  >({});

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setInputPaymentMethod((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  }

  const handleSubmitPaymentMethood = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputPaymentMethod.name) {
        newErrors.name = "Vui lòng nhập tên của phương thức thanh toán";
      }

      if (!inputPaymentMethod.code) {
        newErrors.code = "Vui lòng nhập mã của phương thức thanh toán";
      }

      if (!inputPaymentMethod.description) {
        newErrors.description = "Vui lòng mô tả về phương thức thanh toán";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data: CreatePaymentMethood = {
        code: inputPaymentMethod.code,
        description: inputPaymentMethod.description,
        name: inputPaymentMethod.name,
      };

      const resPaymentMethood = await createPaymentMethood(data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  return (
    <Modal
      open={isShowModalPayment}
      onCancel={() => setIsShowModalPayment(false)}
      footer={[]}
      width="980px"
      closable={false}
    >
      <HeaderPage
        title="Tạo phương thức thanh toán"
        content="Điền thông tin chi tiết để tạo phương thức thanh toán."
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => setIsShowModalPayment(false)}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title="Lưu thanh toán"
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitPaymentMethood();
              }}
            />
          </>
        }
      />
      <div className="mt-8 gap-8">
        <div className="flex flex-col gap-6">
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Thông tin cơ bản</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="payment-name"
                >
                  Tên phương thức thanh toán
                </label>
                <input
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="payment-name"
                  name="name"
                  onChange={handleInputChange}
                  value={inputPaymentMethod.name}
                  placeholder="Ví dụ: Thanh toán qua VNPAY"
                  type="text"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="payment-code"
                >
                  Mã code của phương thức thanh toán
                </label>
                <input
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="payment-code"
                  name="code"
                  onChange={handleInputChange}
                  value={inputPaymentMethod.code}
                  placeholder="Ví dụ: COD"
                  type="text"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="payment-description"
                >
                  Mô tả về phương thức thanh toán
                </label>
                <textarea
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="payment-description"
                  placeholder="Mô tả ngắn gọn về phương thức thanh toán"
                  rows={3}
                  name="description"
                  onChange={handleInputChange}
                  value={inputPaymentMethod.description}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PaymentForm;
