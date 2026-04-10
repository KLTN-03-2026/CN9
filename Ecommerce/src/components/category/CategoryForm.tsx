import { FaRegSave } from "react-icons/fa";
import { BsFillCloudUploadFill } from "react-icons/bs";

import Header from "../common/Header";
import Button from "../common/Button";

import { Modal } from "antd";
import React, { useEffect, useRef, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { CreateCategory, UpdateCategory } from "../../types/CategoryType";
import { useToast } from "../../hook/useToast";
import {
  createCategory,
  getCategoryById,
  updateCategoryById,
} from "../../api/categoryApi";
import GenderForm from "./GenderForm";

interface CategoryFormProps {
  isOpenModal: boolean;
  idCategory: number | null;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIdCategory: React.Dispatch<React.SetStateAction<number | null>>;
  getdataCategory: () => void;
}

function CategoryForm({
  idCategory,
  isOpenModal,
  setIdCategory,
  setIsOpenModal,
  getdataCategory,
}: CategoryFormProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { showToast } = useToast();

  const [originalData, setOriginalData] = useState<CreateCategory | null>(null);

  const [imageSrcCategory, setImageSrcCategory] = useState<string>();

  const [input, setInput] = useState<CreateCategory>({
    name: "",
    description: "",
    genderId: 0,
    imageCategory: null,
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof input, string>>
  >({});

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];

    if (file) {
      const readerFile = new FileReader();

      readerFile.onload = function (e) {
        if (e.target?.result) {
          setImageSrcCategory(e.target.result as string);
          setInput((prev) => ({
            ...prev,
            imageCategory: file,
          }));
        }
      };

      readerFile.readAsDataURL(file);
    }
  }

  function handleChangeInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function buildUpdateFormData(data: UpdateCategory) {
    const formData = new FormData();
    let hasChange = false;

    if (data.name !== originalData?.name && data.name !== undefined) {
      formData.append("name", data.name);
      hasChange = true;
    }

    if (data.genderId !== originalData?.genderId) {
      formData.append("genderId", String(data.genderId));
      hasChange = true;
    }

    if (
      data.description !== originalData?.description &&
      data.description !== undefined
    ) {
      formData.append("description", data.description);
      hasChange = true;
    }

    if (input.imageCategory) {
      formData.append("imageCategory", input.imageCategory);
      hasChange = true;
    }

    return hasChange ? formData : null;
  }

  const handleSubmitCategory = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!input.name) {
        newErrors.name = "Vui lòng nhập tên thể loại";
      }

      if (!input.description) {
        newErrors.description = "Vui lòng nhập mô tả thể loại";
      }

      if (!input.imageCategory) {
        newErrors.imageCategory = "Vui lòng chọn hình cho thể loại";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      if (idCategory) {
        const formData = buildUpdateFormData(input);

        if (!formData) {
          showToast("Không có gì thay đổi", "warning");
          return;
        }
        await updateCategoryById(idCategory, formData);
        setIdCategory(null);
      } else {
        const formData = new FormData();
        formData.append("name", input.name);
        formData.append("description", input.description);
        if (input.genderId && input.genderId > 0) {
          formData.append("genderId", input.genderId.toString());
        }
        if (input.imageCategory) {
          formData.append("imageCategory", input.imageCategory);
        }
        await createCategory(formData);
      }
      handleResetFormCategory();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  const getDataCategoryById = async (id: number) => {
    try {
      const resCategory = await getCategoryById(id);

      const data = {
        description: resCategory.data.description,
        genderId: Number(resCategory.data.genderId),
        name: resCategory.data.name_category,
        imageCategory: resCategory.data.image_category,
      };
      
      setInput(data);
      setOriginalData(data);
      showToast(resCategory.message, resCategory.type);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    if (!idCategory) return;

    getDataCategoryById(idCategory);
  }, [idCategory]);

  function handleResetFormCategory() {
    getdataCategory();
    setInput({
      description: "",
      genderId: 0,
      name: "",
      imageCategory: null,
    });
    setIsOpenModal(false);
    setImageSrcCategory("");
    setOriginalData(null);
  }

  return (
    <Modal
      open={isOpenModal}
      closable={false}
      onCancel={() => handleResetFormCategory()}
      footer={null}
      width="auto"
    >
      <Header
        title="Thêm thể loại mới"
        content="Điền thông tin chi tiết để thêm một thể loại quần áo mới vào hệ thống."
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => handleResetFormCategory()}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title="Lưu thể loại"
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitCategory();
              }}
            />
          </>
        }
      />
      <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark mt-6">
        <div className="p-8 space-y-6">
          <div>
            <label
              className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5"
              htmlFor="category-name"
            >
              Tên thể loại
            </label>
            <input
              className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary"
              id="category-name"
              placeholder="Ví dụ: Áo thun, Quần jeans"
              type="text"
              name="name"
              value={input.name}
              onChange={handleChangeInput}
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5"
              htmlFor="category-description"
            >
              Mô tả (tùy chọn)
            </label>
            <textarea
              className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-4 py-2 focus:ring-2 focus:ring-primary/50 focus:border-primary h-24 resize-none"
              id="category-description"
              placeholder="Mô tả ngắn gọn về thể loại này..."
              name="description"
              value={input.description}
              onChange={handleChangeInput}
            />
          </div>
          <GenderForm
            selectedGenderId={input.genderId}
            onGenderSelect={(id) =>
              setInput((prev) => ({ ...prev, genderId: id }))
            }
          />
          <div>
            <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5">
              Hình ảnh đại diện
            </label>
            <div className="p-6 bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
              <div
                className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg border-border-light dark:border-border-dark text-center cursor-pointer hover:bg-primary/5"
                onClick={() => inputRef.current?.click()}
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
              </div>
              <input
                className="sr-only"
                id="file-upload"
                name="file-upload"
                type="file"
                ref={inputRef}
                onChange={handleFileChange}
                accept="image/*"
              />
            </div>
          </div>
          <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
            {imageSrcCategory || originalData?.imageCategory ? (
              <div className="relative group aspect-square">
                <img
                  src={imageSrcCategory || String(originalData?.imageCategory)}
                  className="bg-center bg-no-repeat w-full h-full bg-cover rounded-lg"
                />
                <button
                  className="absolute top-1 right-1 size-6 bg-black/50 rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => {
                    if (inputRef.current) {
                      inputRef.current.value = "";
                    }
                    setImageSrcCategory("");
                    setOriginalData((prev) =>
                      prev ? { ...prev, imageCategory: null } : null,
                    );
                  }}
                >
                  <IoMdClose className="text-sm" />
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CategoryForm;
