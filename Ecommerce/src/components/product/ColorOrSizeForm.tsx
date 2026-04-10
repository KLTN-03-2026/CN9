import { Modal } from "antd";
import HeaderPage from "../common/Header";
import Button from "../common/Button";
import { ChangeEvent, useState } from "react";
import { CreateColor } from "../../types/ColorType";
import { CreateSize } from "../../types/SizeType";
import { useToast } from "../../hook/useToast";
import { createColor } from "../../api/colorApi";
import { createSize } from "../../api/sizeApi";

interface ColorOrSizeFormProps {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function ColorOrSizeForm({
  isOpenModal,
  setIsOpenModal,
}: ColorOrSizeFormProps) {
  const { showToast } = useToast();

  const [inputColor, setInputColor] = useState<CreateColor>({
    hex: "",
    name: "",
  });

  const [inputSize, setInputSize] = useState<CreateSize>({
    symbol: "",
    name: "",
  });

  const [errorsSize, setErrorsSize] = useState<
    Partial<Record<keyof typeof inputSize, string>>
  >({});

  const [errorsColor, setErrorsColor] = useState<
    Partial<Record<keyof typeof inputColor, string>>
  >({});

  function handleInputChangeColor(e: ChangeEvent<HTMLInputElement>) {
    setInputColor((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }
  function handleInputChangeSize(e: ChangeEvent<HTMLInputElement>) {
    setInputSize((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmitColor = async () => {
    try {
      const newErrors: Partial<typeof errorsColor> = {};

      if (!inputColor.name) {
        newErrors.name = "Vui lòng nhập tên của sản phẩm nhỏ";
      }

      if (!inputColor.hex) {
        newErrors.hex = "Vui lòng chọn màu cho sản phẩm nhỏ";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrorsColor(newErrors);
        return;
      }

      const data: CreateColor = {
        hex: inputColor.hex,
        name: inputColor.name,
      };

      const resColor = await createColor(data);
      console.log(resColor);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  const handleSubmitSize = async () => {
    try {
      const newErrors: Partial<typeof errorsSize> = {};

      if (!inputSize.name) {
        newErrors.name = "Vui lòng nhập tên kích cỡ của sản phẩm nhỏ";
      }

      if (!inputSize.symbol) {
        newErrors.symbol = "Vui lòng nhập kí hiệu cho sản phẩm nhỏ";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrorsSize(newErrors);
        return;
      }

      const data: CreateSize = {
        symbol: inputSize.symbol,
        name: inputSize.name,
      };

      const resSize = await createSize(data);
      console.log(resSize);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  return (
    <Modal
      open={isOpenModal}
      footer={null}
      closable={false}
      width={"auto"}
      onCancel={() => setIsOpenModal(false)}
    >
      <HeaderPage
        title="Thêm màu hoặc kích cỡ mới"
        content="Điền thông tin dưới đây để tạo màu hoặc kích cõ mới"
        component={
          <Button
            title="Hủy"
            onClick={() => setIsOpenModal(false)}
            className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
          />
        }
      />
      <div className="mt-12 p-6 bg-card-light dark:bg-card-dark rounded-xl border border-dashed border-border-light dark:border-border-dark">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted-light">
              Thêm màu mới nhanh
            </h3>
            <div className="flex items-center gap-4">
              <input
                className="size-12 rounded border-0 p-0 cursor-pointer bg-transparent"
                type="color"
                name="hex"
                onChange={handleInputChangeColor}
                value={inputColor.hex}
              />
              <input
                className="w-24 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark px-4 py-2 text-sm focus:ring-primary/50 focus:border-primary"
                type="text"
                name="hex"
                onChange={handleInputChangeColor}
                value={inputColor.hex}
              />
              <input
                className="flex-1 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark px-4 py-2 text-sm focus:ring-primary/50 focus:border-primary"
                placeholder="Tên màu (VD: Xanh Neon)"
                type="text"
                name="name"
                onChange={handleInputChangeColor}
                value={inputColor.name}
              />
              <button
                onClick={() => handleSubmitColor()}
                className="px-6 py-2 bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Lưu màu
              </button>
            </div>
          </div>
          <div className="w-px bg-border-light dark:bg-border-dark hidden md:block" />
          <div className="flex-1 space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted-light">
              Thêm kích cỡ mới nhanh
            </h3>
            <div className="flex items-center gap-4">
              <input
                className="w-40 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark px-4 py-2 text-sm focus:ring-primary/50 focus:border-primary font-bold"
                placeholder="Ký hiệu (VD: XXL)"
                type="text"
                name="symbol"
                onChange={handleInputChangeSize}
                value={inputSize.symbol}
              />
              <input
                className="flex-1 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark px-4 py-2 text-sm focus:ring-primary/50 focus:border-primary"
                placeholder="Tên size VD: Size M"
                type="text"
                name="name"
                onChange={handleInputChangeSize}
                value={inputSize.name}
              />
              <button
                onClick={() => handleSubmitSize()}
                className="px-6 py-2 bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark text-sm font-bold rounded-lg hover:opacity-90 transition-opacity"
              >
                Lưu size
              </button>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ColorOrSizeForm;
