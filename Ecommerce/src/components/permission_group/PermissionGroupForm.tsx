import { Modal } from "antd";
import Button from "../common/Button";
import { FaRegSave } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { CreatePermissionGroup } from "../../types/PermissionGroupType";
import {
  createPermissionGroup,
  getPermissionGroupById,
  updatePermissionGroupById,
} from "../../api/permissionApi";
import { useToast } from "../../hook/useToast";

interface PermissionGroupFormProps {
  isOpenModal: boolean;
  idPermissionGroup: number | null;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPermissionGroup: React.Dispatch<React.SetStateAction<number | null>>;
}

function PermissionGroupForm({
  isOpenModal,
  idPermissionGroup,
  setIsOpenModal,
  setIsPermissionGroup,
}: PermissionGroupFormProps) {
  const [errors, setErrors] = useState<Partial<CreatePermissionGroup>>({});

  const [originalData, setOriginalData] =
    useState<CreatePermissionGroup | null>(null);

  const [input, setInput] = useState<CreatePermissionGroup>({
    name: "",
    label: "",
    description: "",
  });

  const { showToast } = useToast();

  useEffect(() => {
    if (idPermissionGroup === null) return;

    getDataPermissionGroupById(idPermissionGroup);
  }, [idPermissionGroup]);

  const hasChangesData = (data: CreatePermissionGroup) => {
    const newInput: Partial<CreatePermissionGroup> = {};

    if (data.name !== originalData?.name) newInput.name = data.name;

    if (data.label !== originalData?.label) newInput.label = data.label;

    if (data.description !== originalData?.description)
      newInput.description = data.description;

    return newInput;
  };

  const getDataPermissionGroupById = async (id: number) => {
    try {
      const resPerGroupById = await getPermissionGroupById(id);
      const data = {
        name: resPerGroupById.data.name,
        label: resPerGroupById.data.label,
        description: resPerGroupById.data.description,
      };
      setOriginalData(data);
      setInput(data);
      showToast(resPerGroupById.message, resPerGroupById.type);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error"
      );
    }
  };

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const HandleSubmitPermissionGroup = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (input.label === "") {
        newErrors.label = "Vui lòng nhập tên nhóm quyền";
      }

      if (input.name === "") {
        newErrors.name = "Vui lòng nhập tên quyền";
      }

      if (input.description === "") {
        newErrors.description = "Vui lòng mô tả quyền";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data: CreatePermissionGroup = {
        name: input.name,
        label: input.label,
        description: input.description,
      };

      if (idPermissionGroup) {
        const dataNew: Partial<CreatePermissionGroup> = hasChangesData(data);

        const res = await updatePermissionGroupById(idPermissionGroup, dataNew);

        handleResetValue();
        showToast(res.message, res.type);
      } else {
        const res = await createPermissionGroup(data);

        handleResetValue();
        showToast(res.message, res.type);
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error"
      );
    }
  };

  function handleResetValue() {
    setInput({ name: "", label: "", description: "" });
    setIsPermissionGroup(null);
  }

  return (
    <Modal
      open={isOpenModal}
      onCancel={() => {
        setIsOpenModal(false);
        handleResetValue();
      }}
      footer={
        <div className="flex justify-end">
          <Button
            title="Hủy"
            onClick={() => {
              setIsOpenModal(false);
              handleResetValue();
            }}
            className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20 mr-2"
          />
          <Button
            title="Lưu nhóm"
            icon={<FaRegSave className="text-xl" />}
            onClick={() => HandleSubmitPermissionGroup()}
          />
        </div>
      }
    >
      <div className="p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar">
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1"
            htmlFor="group-name"
          >
            Tên nhóm quyền <span className="text-red-500">*</span>
          </label>
          <input
            className="form-input w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-11 px-4 placeholder:text-slate-400 transition-all"
            name="label"
            placeholder="Ví dụ: Quản lý Sản phẩm"
            type="text"
            value={input.label}
            onChange={handleChangeInput}
          />
          <p className="text-red-500 font-medium">{errors.label}</p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-1"
            htmlFor="group-name"
          >
            Tên quyền <span className="text-red-500">*</span>
          </label>
          <input
            className="form-input w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-11 px-4 placeholder:text-slate-400 transition-all"
            name="name"
            placeholder="Ví dụ: product"
            type="text"
            value={input.name}
            onChange={handleChangeInput}
          />
          <p className="text-red-500 font-medium">{errors.name}</p>
        </div>
        <div className="flex flex-col gap-2">
          <label
            className="text-sm font-bold text-slate-900 dark:text-white"
            htmlFor="group-desc"
          >
            Mô tả nhóm quyền
          </label>
          <textarea
            className="form-textarea w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary p-4 placeholder:text-slate-400 resize-none transition-all"
            id="group-desc"
            placeholder="Tập hợp các quyền liên quan đến quản lý sản phẩm..."
            rows={3}
            name="description"
            value={input.description}
            onChange={handleChangeInput}
          />
          <p className="text-red-500 font-medium">{errors.description}</p>
        </div>
      </div>
    </Modal>
  );
}

export default PermissionGroupForm;
