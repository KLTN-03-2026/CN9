import { FaRegSave } from "react-icons/fa";
import { BsFillCloudUploadFill } from "react-icons/bs";
import { IoMdClose } from "react-icons/io";

import Header from "../common/Header";
import Button from "../common/Button";

import { Modal } from "antd";

import { ChangeEvent, useEffect, useRef, useState } from "react";

import { useToast } from "../../hook/useToast";

import {
  createProduct,
  getProductById,
  updateProductById,
} from "../../api/productApi";
import { getAllSales } from "../../api/saleApi";

import { CreateProduct, UpdateProduct } from "../../types/ProductType";
import { CategoryType } from "../../types/CategoryType";
import { UploadFile } from "../../types/UploadType";
import { SaleType } from "../../types/SaleType";

interface ProductFormProps {
  idProduct: number | null;
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  dataCategories: CategoryType[];
  setIsProduct: React.Dispatch<React.SetStateAction<number | null>>;
  getDataProducts: () => void;
}

function ProductForm({
  idProduct,
  isOpenModal,
  dataCategories,
  setIsOpenModal,
  setIsProduct,
  getDataProducts,
}: ProductFormProps) {
  const inputRefImage = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToast();

  const [inputProduct, setInputProduct] = useState<CreateProduct>({
    description: "",
    name: "",
    price: 0,
    categoryId: 0,
    saleId: 0,
    season: "",
  });

  const [dataSales, setDataSales] = useState<SaleType[]>([]);

  const [originalDataProduct, setOriginalDataProduct] =
    useState<CreateProduct | null>(null);

  const [imagesSrcProduct, setImagesSrcProduct] = useState<UploadFile[]>([]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputProduct | "image", string>>
  >({});

  function handleInputChange(
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) {
    setInputProduct((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const readFileAsync = (file: File): Promise<UploadFile> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve({ file, preview: e.target.result as string, isOld: false });
        } else {
          reject("Lỗi đọc file");
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;

    if (files) {
      const fileArray = Array.from(files);
      const results: UploadFile[] = [];
      for (const file of fileArray) {
        try {
          const result = await readFileAsync(file);
          results.push(result);
        } catch (err) {
          console.error("Lỗi đọc file:", err);
        }
      }
      const array = results.reverse();
      setImagesSrcProduct((prev) => [...prev, ...array]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImagesSrcProduct((prev) => prev.filter((_, i) => i !== index));
  };

  function buildUpdateFormData(data: UpdateProduct) {
    const formData = new FormData();
    let hasChange = false;

    if (data.name !== undefined && data.name !== originalDataProduct?.name) {
      formData.append("name", data.name);
      hasChange = true;
    }

    if (
      data.description !== undefined &&
      data.description !== originalDataProduct?.description
    ) {
      formData.append("description", data.description);
      hasChange = true;
    }

    if (
      data.season !== undefined &&
      data.season !== originalDataProduct?.season
    ) {
      formData.append("season", data.season);
      hasChange = true;
    }

    if (data.price !== undefined && data.price !== originalDataProduct?.price) {
      formData.append("price", String(data.price));
      hasChange = true;
    }

    if (
      data.categoryId !== undefined &&
      data.categoryId !== originalDataProduct?.categoryId
    ) {
      formData.append("categoryId", String(data.categoryId));
      hasChange = true;
    }

    if (
      data.saleId !== undefined &&
      data.saleId !== originalDataProduct?.saleId
    ) {
      formData.append("saleId", String(data.saleId));
      hasChange = true;
    }

    if (imagesSrcProduct.length >= 0) {
      imagesSrcProduct.forEach((img) => {
        if (!img.isOld) {
          console.log(img);

          formData.append("productCover", img.file);
          hasChange = true;
        }
      });
    }

    return hasChange ? formData : null;
  }

  const handleSubmitProduct = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputProduct.name) {
        newErrors.name = "Vui lòng nhập của sản phẩm";
      }

      if (!inputProduct.description) {
        newErrors.description = "Vui lòng nhập mô tả sản phẩm";
      }

      if (!inputProduct.price) {
        newErrors.price = "Vui lòng nhập giá cho sản phẩm";
      }

      if (!inputProduct.categoryId) {
        newErrors.categoryId = "Vui lòng chọn thể loại phù hợp cho sản phẩm";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      if (idProduct) {
        const formData = buildUpdateFormData(inputProduct);

        if (!formData) {
          showToast("Không có gì thay đổi", "warning");
          return;
        }

        const resProduct = await updateProductById(idProduct, formData);
        setInputProduct({
          categoryId: 0,
          description: "",
          name: "",
          price: 0,
          saleId: 0,
          season: "",
        });

        setIsProduct(null);
      } else {
        const formData = new FormData();

        formData.append("name", inputProduct.name);
        formData.append("description", inputProduct.description);
        formData.append("price", String(inputProduct.price));
        formData.append("categoryId", String(inputProduct.categoryId));
        formData.append("season", String(inputProduct.season));
        if (imagesSrcProduct.length >= 0) {
          imagesSrcProduct.forEach((key, i) => {
            formData.append("productCover", imagesSrcProduct[i].file);
          });
        }

        if (inputProduct.saleId) {
          formData.append("saleId", String(inputProduct.saleId));
        }
        await createProduct(formData);
      }

      handleResetInfo();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  function handleResetInfo() {
    setImagesSrcProduct([]);
    setIsOpenModal(false);
    getDataProducts();
    setInputProduct({
      categoryId: 0,
      description: "",
      name: "",
      price: 0,
      saleId: 0,
      season: "",
    });
  }

  const getDataSales = async () => {
    try {
      const resSales = await getAllSales();
      setDataSales(resSales.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  const getDataProductById = async (id: number) => {
    try {
      const resProduct = await getProductById(id);

      const arrFiles: string[] = JSON.parse(resProduct.data.image_url || "[]");

      const data = {
        categoryId: resProduct.data.categoryId,
        description: resProduct.data.description,
        name: resProduct.data.name,
        price: resProduct.data.price,
        saleId: resProduct.data.saleId,
        season: resProduct.data.season,
      };
      setInputProduct(data);
      setOriginalDataProduct(data);

      const uploadFiles: UploadFile[] = arrFiles.map((url, index) => {
        const fileName = url.split("/").pop() || `image-${index}.jpg`;

        return {
          file: new File([], fileName),
          preview: url,
          isOld: true,
        };
      });

      setImagesSrcProduct(uploadFiles);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataSales();
  }, []);

  useEffect(() => {
    if (!idProduct) return;

    getDataProductById(idProduct);
  }, [idProduct]);

  return (
    <Modal
      width="auto"
      open={isOpenModal}
      onCancel={() => handleResetInfo()}
      footer={null}
      closable={false}
    >
      <Header
        title="Thêm sản phẩm mới"
        content="Điền thông tin chi tiết để tạo sản phẩm mới."
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => handleResetInfo()}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title={`${idProduct ? "Cập nhật" : "Lưu"} sản phẩm`}
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitProduct();
              }}
            />
          </>
        }
      />
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold mb-4">Thông tin chung</h2>
            <div className="space-y-4">
              <div>
                <label
                  className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                  htmlFor="product-name"
                >
                  Tên sản phẩm
                </label>
                <input
                  className="mt-1 p-2 w-full rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="product-name"
                  name="name"
                  value={inputProduct.name}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Son môi cao cấp"
                  type="text"
                />
              </div>
              <div>
                <label
                  className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                  htmlFor="product-description"
                >
                  Mô tả
                </label>
                <textarea
                  className="mt-1 p-2 w-full rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="product-description"
                  placeholder="Mô tả chi tiết về sản phẩm..."
                  rows={5}
                  name="description"
                  value={inputProduct.description}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold mb-4">Hình ảnh sản phẩm</h2>
            <div
              onClick={() => inputRefImage.current?.click()}
              className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-border-light dark:border-border-dark text-center cursor-pointer hover:bg-primary/5"
            >
              <BsFillCloudUploadFill className="text-4xl text-text-muted-light dark:text-text-muted-dark m-auto" />
              <p className="mt-2 text-sm text-text-muted-light dark:text-text-muted-dark">
                Kéo và thả hoặc{" "}
                <span className="font-semibold text-primary">
                  nhấn để tải lên
                </span>
              </p>
              <p className="text-xs text-text-muted-light dark:text-text-muted-dark/70 mt-1">
                PNG, JPG, GIF lên đến 10MB
              </p>
              <input
                ref={inputRefImage}
                className="hidden"
                id="file-upload"
                multiple
                type="file"
                onChange={handleFile}
              />
            </div>
            <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {imagesSrcProduct.map((imagePro, index) => {
                return (
                  <div key={index} className="relative group aspect-square">
                    <img
                      className="bg-center bg-no-repeat w-full h-full bg-cover rounded-lg"
                      src={imagePro.preview}
                    />
                    <button
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-1 right-1 size-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <IoMdClose className="text-sm" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="lg:col-span-1 space-y-6">
          <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold mb-4">Giá</h2>
            <div className="space-y-4">
              <div>
                <label
                  className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                  htmlFor="product-price"
                >
                  Giá (VND)
                </label>
                <input
                  className="mt-1 p-2 w-full rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="product-price"
                  placeholder="Ví dụ: 450000"
                  type="number"
                  name="price"
                  value={inputProduct.price}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold mb-4">Danh mục</h2>
            <div>
              <label
                className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                htmlFor="product-category"
              >
                Danh mục sản phẩm
              </label>
              <select
                className="mt-1 p-2 w-full rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-light dark:text-text-dark"
                id="product-category"
                name="categoryId"
                value={inputProduct.categoryId}
                onChange={handleInputChange}
              >
                <option value={0}>Chọn danh mục</option>
                {dataCategories.map((cate) => {
                  return (
                    <option key={cate.id} value={cate.id}>
                      {cate.name}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold mb-4">Danh mục Sale</h2>
            <div>
              <label
                className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                htmlFor="product-sale"
              >
                Danh mục sale
              </label>
              <select
                className="mt-1 p-2 w-full rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-light dark:text-text-dark"
                id="product-sale"
                name="saleId"
                value={inputProduct.saleId}
                onChange={handleInputChange}
              >
                <option value={0}>Chọn danh mục</option>
                {dataSales.map((sale) => {
                  const formatMoneyString = (value: string) =>
                    Number(value).toLocaleString("vi-VN");
                  return (
                    <option value={sale.id}>
                      Giảm giá{" "}
                      {sale.discount_type === "fixed"
                        ? formatMoneyString(String(sale.discount_value)) + "đ"
                        : sale.discount_value + "%"}
                    </option>
                  );
                })}
              </select>
            </div>
          </div>
          <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold mb-4">Mùa</h2>
            <div>
              <label
                className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark"
                htmlFor="product-sale"
              >
                mùa
              </label>
              <select
                className="mt-1 p-2 w-full rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-text-light dark:text-text-dark"
                id="product-sale"
                name="season"
                value={inputProduct.season}
                onChange={handleInputChange}
              >
                <option value="">Chọn mùa</option>
                <option value="SPRING">Xuân</option>
                <option value="SUMMER">Hạ</option>
                <option value="AUTUMN">Thu</option>
                <option value="WINTER">Đông</option>
                <option value="ALL">Tất cả mùa</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default ProductForm;
