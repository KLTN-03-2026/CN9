import { Modal } from "antd";

import HeaderPage from "../../common/Header";
import Button from "../../common/Button";

import { FaRegSave } from "react-icons/fa";

import { ChangeEvent, useState } from "react";

import { CreatePointRule } from "../../../types/PointRuleType";
import { useToast } from "../../../hook/useToast";
import { createPointRule } from "../../../api/pointRuleApi";

interface PointFormProps {
  isShowModalPoint: boolean;
  setIsShowModalPoint: React.Dispatch<React.SetStateAction<boolean>>;
}

function PointForm({ isShowModalPoint, setIsShowModalPoint }: PointFormProps) {
  const { showToast } = useToast();

  const [inputPoint, setInputPoint] = useState<CreatePointRule>({
    discount_type: "fixed",
    discount_value: 0,
    point: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputPoint, string>>
  >({});

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setInputPoint((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmitPointRule = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputPoint.point) {
        newErrors.point = "Vui lòng nhập tên số cần để đổi điểm";
      }

      if (!inputPoint.discount_value) {
        newErrors.discount_value = "Vui lòng nhập tên số tiền sẽ giảm";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data: CreatePointRule = {
        discount_type: inputPoint.discount_type,
        discount_value: inputPoint.discount_value,
        point: inputPoint.point,
      };

      const resPointRule = await createPointRule(data);

      console.log(resPointRule);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error",
      );
    }
  };

  return (
    <Modal
      open={isShowModalPoint}
      onCancel={() => setIsShowModalPoint(false)}
      footer={[]}
      width="1100px"
      closable={false}
    >
      <HeaderPage
        title="Tạo điểm thưởng"
        content="Điền thông tin chi tiết để tạo điểm thưởng."
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => setIsShowModalPoint(false)}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title="Lưu điểm thưởng"
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitPointRule();
              }}
            />
          </>
        }
      />
      <div className="mt-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-6">
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Thông tin cơ bản</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="campaign-point"
                >
                  Số điểm thưởng
                </label>
                <input
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="campaign-point"
                  name="point"
                  onChange={handleInputChange}
                  value={inputPoint.point}
                  placeholder="Ví dụ: 200"
                  type="number"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Chi tiết giảm giá</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="discount-type"
                >
                  Loại giảm giá
                </label>
                <select
                  onChange={handleInputChange}
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="discount-type"
                  name="discount_type"
                  value={inputPoint.discount_type}
                >
                  <option value={"percent"}>Phần trăm</option>
                  <option value={"fixed"}>Số tiền cố định</option>
                </select>
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="discount-value"
                >
                  Giá trị
                </label>
                <div className="relative">
                  <input
                    className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm pr-10"
                    id="discount-value"
                    name="discount_value"
                    placeholder="Ví dụ: 20"
                    type="number"
                    onChange={handleInputChange}
                    value={inputPoint.discount_value}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark text-sm">
                    {inputPoint.discount_type === "percent" ? "%" : "đ"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default PointForm;
