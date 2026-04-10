import React, { useEffect, useState } from "react";

import { FaCheck } from "react-icons/fa6";
import { IoMdAddCircle, IoMdClose } from "react-icons/io";
import { RiDeleteBin6Line, RiEdit2Fill } from "react-icons/ri";

import { CreateGender, GenderType } from "../../types/GenderType";

import { useToast } from "../../hook/useToast";
import {
  createGender,
  getAllGenders,
  updateGenderById,
} from "../../api/genderApi";

interface GenderFormProps {
  selectedGenderId?: number | null;
  onGenderSelect?: (id: number) => void;
}

function GenderForm({ selectedGenderId, onGenderSelect }: GenderFormProps) {
  const [isActiveAddGender, setIsActiveAddGender] = useState<boolean>(false);

  const [input, setInput] = useState<CreateGender>({ name_gender: "" });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof input, string>>
  >({});

  const { showToast } = useToast();

  const [dataGender, setDataGender] = useState<GenderType[]>([]);

  const [idGender, setIdGender] = useState<number | null>(null);

  useEffect(() => {
    getDataGenders();
  }, []);

  const getDataGenders = async () => {
    try {
      const resGenders = await getAllGenders();
      setDataGender(resGenders.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  function handleChangeInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmitGender = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!input.name_gender) {
        newErrors.name_gender = "Vui lòng nhập tên giới tính";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data: CreateGender = { name_gender: input.name_gender };
      if (idGender) {
        const resGender = await updateGenderById(idGender, data);
        setIdGender(null);
      } else {
        const resGender = await createGender(data);
        setIsActiveAddGender(false);
        setInput({ name_gender: "" });
      }
      getDataGenders();
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <label
          className="block text-sm font-medium text-text-light dark:text-text-dark"
          htmlFor="category-gender"
        >
          Phân loại giới tính
        </label>
        <span className="text-xs text-text-muted-light dark:text-text-muted-dark bg-background-light dark:bg-background-dark px-2 py-1 rounded border border-border-light dark:border-border-dark">
          Quản lý các loại giới tính
        </span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {dataGender.map((gender) => {
          return gender.id === idGender ? (
            <div className="relative group h-full w-full">
              <div className="h-full min-h-[58px] w-full flex items-center justify-between rounded-lg border border-primary bg-background-light dark:border-primary dark:bg-background-dark p-1.5 ring-2 ring-primary/20 shadow-sm">
                <input
                  autoFocus
                  className="flex-grow outline-none bg-transparent border-none p-2 text-sm font-medium text-text-light dark:text-text-dark focus:ring-0 placeholder:font-normal placeholder:text-text-muted-light/70"
                  placeholder="Nhập tên giới tính..."
                  type="text"
                  value={input.name_gender}
                  name="name_gender"
                  onChange={handleChangeInput}
                />
                <div className="flex items-center gap-1">
                  <button
                    className="size-8 flex items-center justify-center rounded-md bg-primary text-background-dark hover:brightness-110 transition-all shadow-sm"
                    title="Lưu"
                    type="button"
                    onClick={() => {
                      handleSubmitGender();
                    }}
                  >
                    <FaCheck className="text-[20px]" />
                  </button>
                  <button
                    className="size-8 flex items-center justify-center rounded-md hover:bg-border-light dark:hover:bg-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-danger transition-colors"
                    title="Hủy"
                    type="button"
                    onClick={() => {
                      setIdGender(null);
                    }}
                  >
                    <IoMdClose className="text-[20px]" />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="relative group">
              <input
                className="peer hidden"
                id={gender.id + gender.name_gender}
                name="genderId"
                type="radio"
                value={gender.id}
                checked={selectedGenderId === gender.id}
                onChange={() => {
                  onGenderSelect?.(gender.id);
                }}
              />
              <div className="h-full w-full flex items-center justify-between rounded-lg border border-border-light bg-background-light dark:border-border-dark dark:bg-background-dark p-1.5 peer-checked:border-primary peer-checked:bg-primary/10 peer-checked:text-text-light dark:peer-checked:text-text-dark transition-all hover:border-primary/50 ring-0 peer-checked:ring-1 peer-checked:ring-primary">
                <label
                  className="flex-grow cursor-pointer py-2 pl-3 font-medium text-sm select-none text-text-light dark:text-text-dark"
                  htmlFor={gender.id + gender.name_gender}
                >
                  {gender.name_gender}
                </label>
                <div className="flex items-center gap-1 opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity">
                  <button
                    className="size-8 flex items-center justify-center rounded-md hover:bg-border-light dark:hover:bg-border-dark text-text-muted-light dark:text-text-muted-dark transition-colors"
                    title="Chỉnh sửa tên"
                    type="button"
                    onClick={() => {
                      setIdGender(gender.id);
                      setInput({ name_gender: gender.name_gender });
                    }}
                  >
                    <RiEdit2Fill className="text-[18px]" />
                  </button>
                  <button
                    className="size-8 flex items-center justify-center rounded-md hover:bg-danger/10 text-text-muted-light dark:text-text-muted-dark hover:text-danger transition-colors"
                    title="Xóa phân loại"
                    type="button"
                  >
                    <RiDeleteBin6Line className="text-[18px]" />
                  </button>
                </div>
              </div>
              <div className="absolute -top-1.5 -right-1.5 hidden peer-checked:flex size-5 items-center justify-center rounded-full bg-primary text-background-dark shadow-sm z-10 pointer-events-none ring-2 ring-background-light dark:ring-background-dark">
                <FaCheck className="text-[14px] font-bold" />
              </div>
            </div>
          );
        })}
        {isActiveAddGender ? (
          <div className="relative group h-full w-full">
            <div className="h-full min-h-[58px] w-full flex items-center justify-between rounded-lg border border-primary bg-background-light dark:border-primary dark:bg-background-dark p-1.5 ring-2 ring-primary/20 shadow-sm">
              <input
                autoFocus
                className="flex-grow outline-none bg-transparent border-none p-2 text-sm font-medium text-text-light dark:text-text-dark focus:ring-0 placeholder:font-normal placeholder:text-text-muted-light/70"
                placeholder="Nhập tên giới tính..."
                type="text"
                value={input.name_gender}
                name="name_gender"
                onChange={handleChangeInput}
              />
              <div className="flex items-center gap-1">
                <button
                  className="size-8 flex items-center justify-center rounded-md bg-primary text-background-dark hover:brightness-110 transition-all shadow-sm"
                  title="Lưu"
                  type="button"
                  onClick={() => {
                    handleSubmitGender();
                  }}
                >
                  <FaCheck className="text-[20px]" />
                </button>
                <button
                  className="size-8 flex items-center justify-center rounded-md hover:bg-border-light dark:hover:bg-border-dark text-text-muted-light dark:text-text-muted-dark hover:text-danger transition-colors"
                  title="Hủy"
                  type="button"
                  onClick={() => {
                    setIsActiveAddGender(false);
                  }}
                >
                  <IoMdClose className="text-[20px]" />
                </button>
              </div>
            </div>
          </div>
        ) : (
          <button
            className="group h-full min-h-[58px] relative flex items-center justify-center gap-2 rounded-lg border-2 border-dashed border-border-light hover:border-primary/50 bg-transparent px-4 py-2 text-sm font-medium text-text-muted-light dark:border-border-dark dark:text-text-muted-dark hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
            type="button"
            onClick={() => {
              setIsActiveAddGender(true);
            }}
          >
            <IoMdAddCircle className="text-xl group-hover:scale-110 transition-transform" />
            <span>Thêm giới tính</span>
          </button>
        )}
      </div>
    </div>
  );
}

export default GenderForm;
