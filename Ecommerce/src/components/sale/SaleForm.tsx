import { Modal } from "antd";

import HeaderPage from "../common/Header";

import { FaRegSave } from "react-icons/fa";

import { ChangeEvent, useEffect, useState } from "react";

import { CreateSale, UpdateSale } from "../../types/SaleType";

import { useToast } from "../../hook/useToast";

import { createSale, getSaleById, updateSaleById } from "../../api/saleApi";

interface SaleFormProps {
  idSale: number | null;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIdSale: React.Dispatch<React.SetStateAction<number | null>>;
  onReloadSale: () => void;
}

function SaleForm({
  idSale,
  isOpenModal,
  setIdSale,
  onReloadSale,
  setIsOpenModal,
}: SaleFormProps) {
  const { showToast } = useToast();

  const [originalData, setOriginalData] = useState<CreateSale | null>(null);

  const [inputSale, setInputSale] = useState<CreateSale>({
    description: "",
    discount_type: "fixed",
    discount_value: 0,
    end_date: "",
    name: "",
    start_date: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputSale, string>>
  >({});

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setInputSale((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function buildUpdateData(data: CreateSale) {
    const updateData: UpdateSale = {};

    if (data.name !== originalData?.name) {
      updateData.name = data.name;
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

    if (data.start_date !== originalData?.start_date) {
      updateData.start_date = data.start_date;
    }

    if (data.end_date !== originalData?.end_date) {
      updateData.end_date = data.end_date;
    }

    return Object.keys(updateData).length > 0 ? updateData : null;
  }

  const handleSubmitSale = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputSale.name) {
        newErrors.name = "Vui lòng nhập mã sale";
      }

      if (!inputSale.description) {
        newErrors.description = "Vui lòng nhập mô tả sale";
      }

      if (!inputSale.discount_value) {
        newErrors.description = "Vui lòng nhập số giảm giá cho sản phẩm";
      }

      if (!inputSale.start_date) {
        newErrors.start_date = "Vui lòng chọn ngày bắt đầu cho sale";
      }

      if (!inputSale.end_date) {
        newErrors.end_date = "Vui lòng chọn ngày kết thúc cho voucher";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data = {
        description: inputSale.description,
        name: inputSale.name,
        discount_type: inputSale.discount_type,
        discount_value: inputSale.discount_value,
        end_date: inputSale.end_date,
        start_date: inputSale.start_date,
      };

      if (idSale) {
        const updateData = buildUpdateData(data);

        if (!updateData) {
          showToast("Không có gì thay đổi", "warning");
          return;
        }
        const resVoucher = await updateSaleById(idSale, updateData);
        setIdSale(null);
      } else {
        const resSale = await createSale(data);
      }
      onReloadSale();
      handleResetVoucher();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  const getDataSaleById = async (id: number) => {
    try {
      const resVoucher = await getSaleById(id);

      const data = {
        name: resVoucher.data.name,
        description: resVoucher.data.description,
        discount_type: resVoucher.data.discount_type,
        discount_value: resVoucher.data.discount_value,
        start_date: resVoucher.data.start_date,
        end_date: resVoucher.data.end_date,
      };

      setInputSale(data);
      setOriginalData(data);
      showToast(resVoucher.message, resVoucher.type);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    if (!idSale) return;

    getDataSaleById(idSale);
  }, [idSale]);

  function handleResetVoucher() {
    setIsOpenModal(false);
    setInputSale({
      description: "",
      discount_type: "fixed",
      discount_value: 0,
      end_date: "",
      start_date: "",
      name: "",
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
      <HeaderPage
        title="Tạo mã giảm giá"
        content="Điền thông tin chi tiết để tạo một giảm giá mới."
        component={
          <>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleResetVoucher()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-primary/10"
              >
                <span>Hủy</span>
              </button>
              <button
                onClick={() => handleSubmitSale()}
                className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-background-dark hover:opacity-90"
              >
                <FaRegSave className="text-lg" />
                <span>Lưu mã giảm giá</span>
              </button>
            </div>
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
                  Tên mã giảm giá
                </label>
                <input
                  className="p-2 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="campaign-name"
                  name="name"
                  value={inputSale.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Giảm giá 15%"
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
                  className="p-2 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="campaign-description"
                  name="description"
                  value={inputSale.description}
                  onChange={handleInputChange}
                  placeholder="Mô tả ngắn gọn về mã giảm giá"
                  rows={4}
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
                  className="p-2 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="discount-type"
                  name="discount_type"
                  value={inputSale.discount_type}
                  onChange={handleInputChange}
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
                    className="p-2 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm pr-10"
                    id="discount-value"
                    placeholder="Ví dụ: 20"
                    type="number"
                    name="discount_value"
                    onChange={handleInputChange}
                    value={inputSale.discount_value}
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted-light dark:text-text-muted-dark text-sm">
                    {inputSale.discount_type === "percent" ? "%" : "đ"}
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
                  className="p-2 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="start-date"
                  type="date"
                  name="start_date"
                  onChange={handleInputChange}
                  value={inputSale.start_date.slice(0, 10)}
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
                  className="p-2 w-full rounded-lg border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark focus:border-primary focus:ring-primary/50 text-sm"
                  id="end-date"
                  type="date"
                  name="end_date"
                  onChange={handleInputChange}
                  value={inputSale.end_date.slice(0, 10)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SaleForm;
