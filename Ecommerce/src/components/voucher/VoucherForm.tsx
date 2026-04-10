import { FaRegSave } from "react-icons/fa";

import Button from "../common/Button";
import Header from "../common/Header";

import { Modal } from "antd";

import { ChangeEvent, useEffect, useState } from "react";

import { CreateVoucher, UpdateVoucher } from "../../types/VoucherType";

import { useToast } from "../../hook/useToast";

import {
  createVoucher,
  getVoucherById,
  updateVoucherById,
} from "../../api/voucherApi";

interface VoucherFormProps {
  idVoucher: number | null;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIdVoucher: React.Dispatch<React.SetStateAction<number | null>>;
  onReloadVoucher: () => void;
}

function VoucherForm({
  idVoucher,
  isOpenModal,
  setIdVoucher,
  setIsOpenModal,
  onReloadVoucher,
}: VoucherFormProps) {
  const { showToast } = useToast();

  const [originalData, setOriginalData] = useState<CreateVoucher | null>(null);

  const [inputVoucher, setInputVoucher] = useState<CreateVoucher>({
    code: "",
    description: "",
    discount_type: "percent",
    discount_value: 0,
    end_date: "",
    min_order_value: 0,
    start_date: "",
    usage_limit: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputVoucher, string>>
  >({});

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    setInputVoucher((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function buildUpdateData(data: CreateVoucher) {
    const updateData: UpdateVoucher = {};

    if (data.code !== originalData?.code) {
      updateData.code = data.code;
    }

    if (data.description !== originalData?.description) {
      updateData.description = data.description;
    }

    if (data.discount_type !== originalData?.discount_type) {
      updateData.discount_type = data.discount_type;
    }

    if (data.discount_value !== originalData?.discount_value) {
      updateData.discount_value = data.discount_value;
    }

    if (data.min_order_value !== originalData?.min_order_value) {
      updateData.min_order_value = data.min_order_value;
    }

    if (data.start_date !== originalData?.start_date) {
      updateData.start_date = data.start_date;
    }

    if (data.end_date !== originalData?.end_date) {
      updateData.end_date = data.end_date;
    }

    if (data.usage_limit !== originalData?.usage_limit) {
      updateData.usage_limit = data.usage_limit;
    }

    return Object.keys(updateData).length > 0 ? updateData : null;
  }

  const handleSubmitVoucher = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputVoucher.code) {
        newErrors.code = "Vui lòng nhập mã voucher";
      }

      if (!inputVoucher.description) {
        newErrors.description = "Vui lòng nhập mô tả voucher";
      }

      if (!inputVoucher.discount_value) {
        newErrors.discount_value = "Vui lòng nhập số giảm giá cho đơn hàng";
      }

      if (!inputVoucher.min_order_value) {
        newErrors.min_order_value = "Vui lòng nhập giá trị đơn hàng tối thiểu";
      }

      if (!inputVoucher.start_date) {
        newErrors.start_date = "Vui lòng chọn ngày bắt đầu cho voucher";
      }

      if (!inputVoucher.end_date) {
        newErrors.end_date = "Vui lòng chọn ngày kết thúc cho voucher";
      }

      if (!inputVoucher.usage_limit) {
        newErrors.usage_limit = "Vui lòng nhập số lượng voucher tạo ra";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data: CreateVoucher = {
        code: inputVoucher.code,
        description: inputVoucher.description,
        discount_type: inputVoucher.discount_type,
        discount_value: inputVoucher.discount_value,
        usage_limit: inputVoucher.usage_limit,
        start_date: inputVoucher.start_date,
        end_date: inputVoucher.end_date,
        min_order_value: inputVoucher.min_order_value,
      };

      if (idVoucher) {
        const updateData = buildUpdateData(data);

        if (!updateData) {
          showToast("Không có gì thay đổi", "warning");
          return;
        }
        const resVoucher = await updateVoucherById(idVoucher, updateData);
        setIdVoucher(null);
      } else {
        const resVoucher = await createVoucher(data);
      }
      handleResetVoucher();
      onReloadVoucher();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  const getDataVoucherById = async (id: number) => {
    try {
      const resVoucher = await getVoucherById(id);

      const data = {
        code: resVoucher.data.code,
        description: resVoucher.data.description,
        min_order_value: resVoucher.data.min_order_value,
        usage_limit: resVoucher.data.usage_limit,
        discount_type: resVoucher.data.discount_type,
        discount_value: resVoucher.data.discount_value,
        start_date: resVoucher.data.start_date,
        end_date: resVoucher.data.end_date,
      };
      setInputVoucher(data);
      setOriginalData(data);
      showToast(resVoucher.message, resVoucher.type);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    if (!idVoucher) return;

    getDataVoucherById(idVoucher);
  }, [idVoucher]);

  function handleResetVoucher() {
    setIsOpenModal(false);
    setInputVoucher({
      code: "",
      description: "",
      discount_type: "fixed",
      discount_value: 0,
      end_date: "",
      min_order_value: 0,
      start_date: "",
      usage_limit: 0,
    });
  }

  return (
    <Modal
      width="auto"
      open={isOpenModal}
      onCancel={() => handleResetVoucher()}
      footer={null}
      closable={false}
    >
      <Header
        title="Tạo Chiến dịch Giảm giá"
        content="Điền thông tin chi tiết để tạo một chiến dịch giảm giá mới."
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => handleResetVoucher()}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title={`${idVoucher ? "Cập nhật" : "Lưu"} đơn hàng`}
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitVoucher();
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
                  htmlFor="campaign-name"
                >
                  Tên chiến dịch
                </label>
                <input
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="campaign-name"
                  name="code"
                  onChange={handleInputChange}
                  value={inputVoucher.code}
                  placeholder="Ví dụ: Giảm giá cuối năm"
                  type="text"
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="campaign-description"
                >
                  Mô tả
                </label>
                <textarea
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="campaign-description"
                  placeholder="Mô tả ngắn gọn về chiến dịch"
                  rows={4}
                  name="description"
                  onChange={handleInputChange}
                  value={inputVoucher.description}
                />
              </div>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">
              Đơn hàng tối thiểu và số lượng voucher
            </h3>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="campaign-order"
                >
                  Đơn hàng tối thiểu
                </label>
                <input
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="campaign-order"
                  placeholder="Ví dụ: 1.000.000đ"
                  type="text"
                  name="min_order_value"
                  onChange={handleInputChange}
                  value={inputVoucher.min_order_value}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="campaign-use"
                >
                  Số lượng voucher
                </label>
                <input
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="campaign-use"
                  placeholder="Ví dụ: 30"
                  type="number"
                  name="usage_limit"
                  onChange={handleInputChange}
                  value={inputVoucher.usage_limit}
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
                  value={inputVoucher.discount_type}
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
                    value={inputVoucher.discount_value}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark text-sm">
                    {inputVoucher.discount_type === "percent" ? "%" : "đ"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-xl p-6">
            <h3 className="text-lg font-bold mb-4">Thời gian hiệu lực</h3>
            <div className="flex flex-col gap-4">
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="start-date"
                >
                  Ngày bắt đầu
                </label>
                <input
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="start-date"
                  type="date"
                  name="start_date"
                  onChange={handleInputChange}
                  value={inputVoucher.start_date.slice(0, 10)}
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark mb-1.5"
                  htmlFor="end-date"
                >
                  Ngày kết thúc
                </label>
                <input
                  className="w-full p-2 rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="end-date"
                  type="date"
                  name="end_date"
                  onChange={handleInputChange}
                  value={inputVoucher.end_date.slice(0, 10)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default VoucherForm;
