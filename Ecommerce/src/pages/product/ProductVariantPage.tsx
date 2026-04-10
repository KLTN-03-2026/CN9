import { IoMdAdd, IoMdAddCircle } from "react-icons/io";
import { MdCloudUpload, MdEdit } from "react-icons/md";

import Button from "../../components/common/Button";
import HeaderPage from "../../components/common/Header";
import ButtonBack from "../../components/common/ButtonBack";

import ColorOrSizeForm from "../../components/product/ColorOrSizeForm";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useToast } from "../../hook/useToast";
import { getAllColors } from "../../api/colorApi";
import { getAllSizes } from "../../api/sizeApi";
import { ColorType } from "../../types/ColorType";
import { SizeType } from "../../types/SizeType";
import ProductVariantList from "../../components/product/ProductVariantList";
import { CreateProductVariant } from "../../types/ProductType";
import { UploadFile } from "../../types/UploadType";
import { createProductVariant } from "../../api/productApi";
import { useParams } from "react-router-dom";

function ProductVariantPage() {
  const { showToast } = useToast();

  const { id } = useParams();

  const imageRefVariant = useRef<HTMLInputElement | null>(null);

  const [isOpenModal, setIsOpenModal] = useState(false);

  const [dataColors, setDataColors] = useState<ColorType[]>([]);

  const [dataSizes, setDataSizes] = useState<SizeType[]>([]);

  const [inputProductVariant, setInputProductVariant] =
    useState<CreateProductVariant>({ stock: 0, colorId: 0, sizeId: 0 });

  const [imagesSrcVariant, setImagesSrcVariant] = useState<UploadFile | null>(
    null,
  );

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputProductVariant | "image", string>>
  >({});

  const getDataColorsAndSizes = async () => {
    try {
      const [resColors, resSizes] = await Promise.all([
        getAllColors(),
        getAllSizes(),
      ]);

      setDataColors(resColors.data);
      setDataSizes(resSizes.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataColorsAndSizes();
  }, []);

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    setInputProductVariant((prev) => ({
      ...prev,
      [e.target.name]: Number(e.target.value),
    }));
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const readerFile = new FileReader();

      readerFile.onload = function (e) {
        if (e.target?.result) {
          setImagesSrcVariant({
            file: file,
            preview: e.target.result as string,
            isOld: false,
          });
        }
      };

      readerFile.readAsDataURL(file);
    }
  }

  const handleSubmitVariant = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputProductVariant.stock) {
        newErrors.stock = "Vui lòng nhập tên thể loại";
      }

      if (!inputProductVariant.sizeId) {
        newErrors.sizeId = "Vui lòng nhập mô tả thể loại";
      }

      if (!inputProductVariant.colorId) {
        newErrors.colorId = "Vui lòng nhập mô tả thể loại";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formData = new FormData();
      formData.append("stock", String(inputProductVariant.stock));
      formData.append("sizeId", String(inputProductVariant.sizeId));
      formData.append("colorId", String(inputProductVariant.colorId));
      if (imagesSrcVariant?.file) {
        formData.append("variantCover", imagesSrcVariant.file);
      }

      const resVariant = await createProductVariant(Number(id), formData);
      console.log(resVariant);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  return (
    <>
      <HeaderPage
        title="Biến thể: Son môi cao cấp"
        content="Quản lý kho, giá và hình ảnh cho từng màu sắc và kích cỡ."
        component={
          <>
            <Button
              title="Sửa thông tin cơ bản"
              onClick={() => {}}
              icon={<MdEdit />}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark text-sm font-semibold hover:bg-primary/10 transition-colors"
            />
          </>
        }
      />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <ButtonBack />
          <ProductVariantList idVar={Number(id)} />
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark sticky top-6">
            <div className="flex items-center gap-2 mb-6 text-primary">
              <IoMdAddCircle size={20} />
              <h2 className="text-lg font-semibold text-text-light dark:text-text-dark">
                Thêm biến thể mới
              </h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark block mb-2">
                  Màu sắc
                </label>
                <div className="flex flex-wrap gap-3">
                  {dataColors.map((color) => {
                    return (
                      <label className="cursor-pointer relative group">
                        <input
                          className="peer sr-only"
                          name="colorId"
                          type="radio"
                          value={color.id}
                          onChange={handleInputChange}
                        />
                        <div
                          className="size-8 rounded-full peer-checked:ring-2 peer-checked:ring-offset-2 peer-checked:ring-primary dark:ring-offset-card-dark transition-all hover:scale-110"
                          style={{ backgroundColor: color.hex }}
                        />
                        <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity bg-black/80 text-white px-1.5 py-0.5 rounded">
                          {color.name}
                        </span>
                      </label>
                    );
                  })}
                  <button
                    onClick={() => setIsOpenModal(true)}
                    className="size-8 rounded-full border border-dashed border-text-muted-light dark:border-text-muted-dark flex items-center justify-center text-text-muted-light hover:border-primary hover:text-primary transition-colors"
                  >
                    <IoMdAdd className="text-lg" />
                  </button>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark block mb-2">
                  Kích cỡ
                </label>
                <div className="flex flex-wrap gap-2">
                  {dataSizes.map((size) => {
                    return (
                      <label key={size.id} className="cursor-pointer">
                        <input
                          className="peer sr-only"
                          name="sizeId"
                          type="radio"
                          value={size.id}
                          onChange={handleInputChange}
                        />
                        <div className="min-w-[42px] px-2 h-8 rounded border border-border-light dark:border-border-dark flex items-center justify-center text-xs font-medium peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-primary hover:border-primary transition-all">
                          {size.symbol}
                        </div>
                      </label>
                    );
                  })}
                  <button
                    onClick={() => setIsOpenModal(true)}
                    className="size-8 rounded border border-dashed border-text-muted-light dark:border-text-muted-dark flex items-center justify-center text-text-muted-light hover:border-primary hover:text-primary transition-colors"
                  >
                    <IoMdAdd className="text-lg" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark block mb-1"
                    htmlFor="variant-stock"
                  >
                    Số lượng
                  </label>
                  <input
                    className="w-full p-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-sm"
                    id="variant-stock"
                    placeholder="0"
                    type="number"
                    name="stock"
                    onChange={handleInputChange}
                    value={inputProductVariant.stock}
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark block mb-2">
                  Hình ảnh biến thể
                </label>
                <div className="flex items-center gap-4">
                  <div
                    onClick={() => imageRefVariant.current?.click()}
                    className="size-16 rounded-lg bg-background-light dark:bg-background-dark border border-dashed border-border-light dark:border-border-dark flex items-center justify-center text-text-muted-light cursor-pointer hover:bg-primary/5 hover:border-primary transition-colors"
                  >
                    {imagesSrcVariant ? (
                      <img
                        className="rounded-lg mt-2"
                        src={imagesSrcVariant.preview}
                        alt=""
                      />
                    ) : (
                      <MdCloudUpload size={25} />
                    )}
                  </div>
                  <div className="text-xs text-text-muted-light dark:text-text-muted-dark">
                    <p>Tải lên 1 hình ảnh đại diện</p>
                    <p className="opacity-70">PNG, JPG, tối đa 2MB</p>
                  </div>
                </div>
                <input
                  ref={imageRefVariant}
                  className="hidden"
                  id="file-upload"
                  type="file"
                  onChange={handleFileChange}
                />
              </div>
              <div className="pt-4 border-t border-border-light dark:border-border-dark flex gap-3">
                <button
                  onClick={() => handleSubmitVariant()}
                  className="flex-1 py-2.5 rounded-lg bg-primary text-black text-sm font-bold hover:opacity-90 transition-opacity"
                >
                  Thêm biến thể
                </button>
                <button className="px-4 py-2.5 rounded-lg bg-transparent border border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark text-sm font-semibold hover:bg-primary/10 transition-colors">
                  Hủy
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ColorOrSizeForm
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </>
  );
}

export default ProductVariantPage;
