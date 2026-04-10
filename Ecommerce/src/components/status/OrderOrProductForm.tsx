import { Modal } from "antd";

import Button from "../common/Button";
import HeaderPage from "../common/Header";

import { FaCheckCircle, FaRegSave } from "react-icons/fa";
import {
  MdCategory,
  MdOutlineDescription,
  MdOutlineEditNote,
} from "react-icons/md";
import { IoColorPaletteOutline } from "react-icons/io5";

import { ChangeEvent, useEffect, useState } from "react";

import { CreateOrderStatus, CreateProductStatus } from "../../types/StatusType";

import { useToast } from "../../hook/useToast";

import { createOrderStatus, createProductStatus } from "../../api/statusApi";

interface OrderOrProductFormProps {
  activeTypeStatus: "product" | "order";
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function OrderOrProductForm({
  isOpenModal,
  activeTypeStatus,
  setIsOpenModal,
}: OrderOrProductFormProps) {
  const { showToast } = useToast();

  const [activeType, setActiveType] = useState<"product" | "order">(
    activeTypeStatus,
  );

  useEffect(() => {
    if (isOpenModal) {
      setActiveType(activeTypeStatus);
    }
  }, [isOpenModal, activeTypeStatus]);

  const colors = [
    { hex: "#94a3b8", bg: "bg-slate-400", ring: "ring-slate-400" },
    { hex: "#3b82f6", bg: "bg-blue-500", ring: "ring-blue-500" },
    { hex: "#f59e0b", bg: "bg-amber-500", ring: "ring-amber-500" },
    { hex: "#10b981", bg: "bg-emerald-500", ring: "ring-emerald-500" },
    { hex: "#f43f5e", bg: "bg-rose-500", ring: "ring-rose-500" },
    { hex: "#6366f1", bg: "bg-indigo-500", ring: "ring-indigo-500" },
    { hex: "#a855f7", bg: "bg-purple-500", ring: "ring-purple-500" },
  ];

  type StatusForm =
    | ({ type: "order" } & CreateOrderStatus)
    | ({ type: "product" } & CreateProductStatus);

  const [inputStatus, setInputStatus] = useState<StatusForm>({
    type: "order",
    name: "",
    code: "",
    hex: "",
    description: "",
    is_cancelable: false,
    is_final: false,
    sequence: 0,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateOrderStatus, string>>
  >({});

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setInputStatus((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmitStatus = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (inputStatus.type === "product") {
        if (!inputStatus.name) {
          newErrors.name = "Vui lòng nhập tên trạng thái sản phẩm";
        }

        if (!inputStatus.description) {
          newErrors.description = "Vui lòng mô tả trạng thái sản phẩm";
        }

        if (!inputStatus.hex) {
          newErrors.hex = "Vui lòng chọn màu cho trạng thái sản phẩm";
        }
      } else {
        if (!inputStatus.name) {
          newErrors.name = "Vui lòng nhập tên trạng thái đơn hàng";
        }

        if (!inputStatus.description) {
          newErrors.description = "Vui lòng mô tả trạng thái đơn hàng";
        }

        if (!inputStatus.hex) {
          newErrors.hex = "Vui lòng chọn màu cho trạng thái đơn hàng";
        }

        if (!inputStatus.code) {
          newErrors.code = "Vui lòng nhập tên code của trạng thái đơn hàng";
        }

        if (!inputStatus.sequence) {
          newErrors.sequence =
            "Vui lòng điền số thứ tự cho trạng thái đơn hàng";
        }
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      if (inputStatus.type === "order") {
        const data: CreateOrderStatus = {
          hex: inputStatus.hex,
          name: inputStatus.name,
          code: inputStatus.code,
          is_final: inputStatus.is_final,
          sequence: inputStatus.sequence,
          description: inputStatus.description,
          is_cancelable: inputStatus.is_cancelable,
        };

        const resOrder = await createOrderStatus(data);
        console.log(resOrder);
      } else {
        const data: CreateProductStatus = {
          hex: inputStatus.hex,
          name: inputStatus.name,
          description: inputStatus.description,
        };

        const resProduct = await createProductStatus(data);
        console.log(resProduct);
      }
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  return (
    <Modal
      width="1100px"
      open={isOpenModal}
      onCancel={() => setIsOpenModal((prev) => !prev)}
      footer={null}
      closable={false}
    >
      <HeaderPage
        title="Thêm Trạng thái Mới"
        content="Định nghĩa các trạng thái mới để tùy chỉnh quy trình xử lý đơn hàng và quản lý tồn kho của bạn một cách linh hoạt hơn."
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => setIsOpenModal(false)}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title="Lưu tài khoản"
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitStatus();
              }}
            />
          </>
        }
      />
      <form className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800 overflow-hidden">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
            <MdCategory className="text-primary" size={20} /> 1. Phân loại trạng
            thái
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
            <label className="relative flex cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <input
                defaultChecked
                className="sr-only peer"
                name="status-type"
                type="radio"
                defaultValue="product"
                onClick={() => {
                  setActiveType("product");
                  setInputStatus((prev) =>
                    prev.type === "product"
                      ? { type: "product", name: "", hex: "", description: "" }
                      : { ...prev },
                  );
                }}
                checked={activeType === "product" ? true : false}
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">
                    Trạng thái Sản phẩm
                  </span>
                  <span className="mt-1 flex items-center text-xs text-slate-500 uppercase tracking-wide font-medium">
                    Ví dụ: Còn hàng, Ngừng kinh doanh
                  </span>
                </span>
              </span>
              <FaCheckCircle
                size={20}
                className="text-primary invisible peer-checked:visible"
              />
              <span
                aria-hidden="true"
                className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-primary pointer-events-none"
              />
            </label>
            <label className="group relative flex cursor-pointer rounded-lg border border-slate-200 dark:border-slate-700 p-4 shadow-sm focus:outline-none hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <input
                className="sr-only peer"
                id="type-order"
                name="status-type"
                type="radio"
                defaultValue="order"
                onClick={() => {
                  setActiveType("order");
                  setInputStatus((prev) =>
                    prev.type === "order"
                      ? {
                          type: "order",
                          name: "",
                          code: "",
                          hex: "",
                          description: "",
                          is_cancelable: false,
                          is_final: false,
                          sequence: 0,
                        }
                      : { ...prev },
                  );
                }}
                checked={activeType === "order" ? true : false}
              />
              <span className="flex flex-1">
                <span className="flex flex-col">
                  <span className="block text-sm font-bold text-slate-900 dark:text-white">
                    Trạng thái Đơn hàng
                  </span>
                  <span className="mt-1 flex items-center text-xs text-slate-500 uppercase tracking-wide font-medium">
                    Ví dụ: Chờ thanh toán, Đang giao
                  </span>
                </span>
              </span>
              <FaCheckCircle
                size={20}
                className="text-primary invisible peer-checked:visible"
              />
              <span
                aria-hidden="true"
                className="absolute -inset-px rounded-lg border-2 border-transparent peer-checked:border-primary pointer-events-none"
              />
            </label>
          </div>
          {activeType === "product" ? (
            <></>
          ) : (
            <div
              className="mt-4 p-5 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700 space-y-4"
              id="order-settings-container"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    Thiết lập Đơn hàng
                  </h3>
                  <p className="text-xs text-slate-500">
                    Các tùy chọn nâng cao chỉ dành cho quy trình xử lý đơn hàng.
                  </p>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-primary/10 text-primary border border-primary/20">
                  Chế độ Đơn hàng
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Đánh dấu là trạng thái kết thúc
                    </span>
                    <span className="text-xs text-slate-500">
                      Dùng cho đơn đã Hoàn thành hoặc Đã hủy
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      name="is_final"
                      type="checkbox"
                      onChange={handleInputChange}
                      checked={
                        inputStatus.type === "order"
                          ? inputStatus.is_final
                          : false
                      }
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
                <div className="flex items-center justify-between gap-4 p-3 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Đánh dấu hủy đơn hàng
                    </span>
                    <span className="text-xs text-slate-500">
                      Cho phép trạng thái này được hủy đơn hàng hay không
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      className="sr-only peer"
                      name="is_cancelable"
                      onChange={handleInputChange}
                      type="checkbox"
                      checked={
                        inputStatus.type === "order"
                          ? inputStatus.is_cancelable
                          : false
                      }
                    />
                    <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none dark:bg-slate-700 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
            <MdOutlineEditNote className="text-primary" size={20} />
            2. Thông tin cơ bản
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <label
                className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1"
                htmlFor="name"
              >
                Tên trạng thái <span className="text-red-500">*</span>
              </label>
              <input
                className="w-full rounded-lg p-2 border focus:outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary text-sm"
                name="name"
                id="name"
                placeholder="Ví dụ: Đã kiểm kho"
                type="text"
                onChange={handleInputChange}
                value={inputStatus.name}
              />
            </div>

            {activeType === "product" ? (
              <></>
            ) : (
              <>
                <div>
                  <label
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    htmlFor="code"
                  >
                    Mã code <span className="text-red-500">*</span>
                  </label>
                  <input
                    className="w-full rounded-lg p-2 border focus:outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary text-sm"
                    id="code"
                    name="code"
                    placeholder="Ví dụ: Pending"
                    type="text"
                    onChange={handleInputChange}
                    value={inputStatus.type === "order" ? inputStatus.code : ""}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1"
                    htmlFor="sequence"
                  >
                    Thứ tự hiển thị
                  </label>
                  <input
                    className="w-full rounded-lg p-2 border focus:outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary text-sm"
                    id="sequence"
                    min={1}
                    name="sequence"
                    type="number"
                    onChange={handleInputChange}
                    value={
                      inputStatus.type === "order" ? inputStatus.sequence : 12
                    }
                  />
                </div>
              </>
            )}
          </div>
        </div>
        <div className="p-6 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
            <IoColorPaletteOutline className="text-primary" size={20} />
            3. Nhận diện màu sắc
          </h2>
          <div className="flex flex-col md:flex-row gap-8 items-start">
            <div className="w-full md:w-auto">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                Chọn màu sắc nhãn
              </label>
              <div className="flex flex-wrap gap-3 mb-4">
                {colors.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() =>
                      setInputStatus((prev) => ({
                        ...prev,
                        hex: c.hex,
                      }))
                    }
                    className={`w-8 h-8 rounded-full ${c.bg} border-2 border-white transition-all duration-200 hover:scale-110 ${inputStatus.hex === c.hex ? `ring-2 ring-offset-2 ${c.ring} scale-110` : ""}`}
                  />
                ))}
              </div>
              <div className="flex items-center gap-2">
                <input
                  className="p-1 h-10 w-20 rounded border-slate-200 dark:border-slate-700 bg-transparent"
                  type="color"
                  name="hex"
                  onChange={handleInputChange}
                  value={inputStatus.hex}
                />
                <input
                  className="w-24 text-xs p-2 border font-mono rounded-lg border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:ring-primary"
                  type="text"
                  name="hex"
                  onChange={handleInputChange}
                  value={inputStatus.hex}
                />
              </div>
            </div>
            <div className="flex-1 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-xs font-bold text-slate-400 uppercase mb-3 tracking-widest">
                Xem trước nhãn (Preview)
              </p>
              <div className="flex items-center gap-4">
                <span className="px-3 py-1 rounded-full bg-slate-400 text-white text-xs font-bold shadow-sm">
                  Mẫu Trạng Thái
                </span>
                <div className="flex flex-col">
                  <p className="text-xs text-slate-500">
                    Đây là cách trạng thái sẽ xuất hiện trong danh sách quản lý
                    của bạn.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <h2 className="text-slate-900 dark:text-white text-lg font-bold mb-4 flex items-center gap-2">
            <MdOutlineDescription className="text-primary" size={20} />
            4. Mô tả chi tiết
          </h2>
          <label
            className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1"
            htmlFor="description"
          >
            Ghi chú &amp; Ý nghĩa
          </label>
          <textarea
            className="w-full rounded-lg p-2 border focus:outline-none border-slate-200 dark:border-slate-700 dark:bg-slate-800 focus:border-primary focus:ring-primary text-sm"
            id="description"
            name="description"
            placeholder="Nhập mô tả chi tiết về cách thức và thời điểm áp dụng trạng thái này..."
            rows={4}
            onChange={handleInputChange}
            value={inputStatus.description}
          />
        </div>
      </form>
    </Modal>
  );
}

export default OrderOrProductForm;
