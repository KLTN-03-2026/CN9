import { RxDoubleArrowDown } from "react-icons/rx";
import { FaInfoCircle, FaRegSave } from "react-icons/fa";
import { IoMdAdd, IoMdFingerPrint } from "react-icons/io";
import { MdAddModerator, MdAutorenew, MdEdit } from "react-icons/md";

import Button from "../../components/common/Button";
import Header from "../../components/common/Header";

import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import PermissionGroupForm from "../../components/permission_group/PermissionGroupForm";

import { useToast } from "../../hook/useToast";

import {
  createPermission,
  getAllPermissionGroup,
  getPermissionById,
} from "../../api/permissionApi";

import { PermissionGroup } from "../../types/PermissionGroupType";
import { CreatePermission } from "../../types/PermissionType";

import {
  iconForPermissionGroup,
  PermissionGroupKey,
} from "../../utils/icon/IconPermissionGroup";

function PermissionFormPage() {
  const navigate = useNavigate();
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [idPermissionGroup, setIsPermissionGroup] = useState<number | null>(
    null,
  );

  const [dataPermissionGroup, setDataPermissionGroup] = useState<
    PermissionGroup[]
  >([]);

  const { showToast } = useToast();

  const [inputPermission, setInputPermission] = useState<CreatePermission>({
    name: "",
    label: "",
    description: "",
    groupId: 0,
  });

  const [searchParams] = useSearchParams();

  const id = searchParams.get("id");

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputPermission, string>>
  >({});

  const getDataAllPermissionGroups = async () => {
    try {
      const resPermissionGroup = await getAllPermissionGroup();
      showToast(resPermissionGroup.message, resPermissionGroup.type);
      setDataPermissionGroup(resPermissionGroup.data);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error",
      );
    }
  };

  const getDataPermissionById = async (id: number) => {
    try {
      const resPermission = await getPermissionById(id);
      showToast(resPermission.message, resPermission.type);
      const data: CreatePermission = {
        name: resPermission.data.name,
        label: resPermission.data.label,
        groupId: resPermission.data.groupId,
        description: resPermission.data.description,
      };

      setInputPermission(data);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error",
      );
    }
  };

  useEffect(() => {
    getDataAllPermissionGroups();
    if (!id) return;
    getDataPermissionById(Number(id));
  }, []);

  function handleChangeInput(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    const name = e.target.name;
    const value = e.target.value;
    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));

    if (name === "groupId" && e.target instanceof HTMLSelectElement) {
      const option = e.target.selectedOptions[0];
      const label = option.text;

      setInputPermission((prev) => ({
        ...prev,
        [name]: Number(value),
        name: label + ".",
      }));
      return;
    }

    setInputPermission((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "groupId" && { name: "" }),
    }));
  }

  const handleSubmitPermission = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (inputPermission.label === "") {
        newErrors.label = "Vui lòng nhập tên quyền";
      }

      if (inputPermission.name === "") {
        newErrors.name = "Vui lòng nhập tên định danh";
      }

      if (inputPermission.description === "") {
        newErrors.description = "Vui lòng mô tả quyền";
      }

      if (inputPermission.groupId === 0) {
        newErrors.groupId = "Vui lòng chọn quyền";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data: CreatePermission = {
        name: inputPermission.name,
        label: inputPermission.label,
        description: inputPermission.description,
        groupId: inputPermission.groupId,
      };

      setInputPermission({ description: "", groupId: 0, label: "", name: "" });

      const res = await createPermission(data);
      getDataAllPermissionGroups();
      showToast(res.message, res.type);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error",
      );
    }
  };

  return (
    <>
      <Header
        content="Thiết lập các quyền hạn cụ thể và quản lý các nhóm quyền để kiểm soát truy cập cho các vai trò quản trị viên."
        title="Thêm quyền mới"
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => navigate(-1)}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title="Lưu quyền"
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitPermission();
              }}
            />
          </>
        }
      />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 bg-white dark:bg-[#1a2e1f] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800/50 overflow-hidden">
          <div className="p-6 md:p-8 flex flex-col gap-6">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <MdAddModerator className="text-primary" />
              Thông tin quyền hạn
            </h2>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1"
                htmlFor="perm-name"
              >
                Tên quyền <span className="text-red-500">*</span>
              </label>
              <input
                className="form-input w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 px-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                id="perm-name"
                placeholder="Ví dụ: Xem kho hàng"
                type="text"
                name="label"
                value={inputPermission.label}
                onChange={handleChangeInput}
              />
              <p className="text-xs text-slate-500">
                Tên hiển thị ngắn gọn, dễ hiểu cho quản trị viên.
              </p>
              <p className="text-red-500 font-medium">{errors.label}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1"
                htmlFor="perm-group"
              >
                Nhóm quyền
              </label>
              <div className="relative">
                <select
                  className="form-select w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-4 pr-10 transition-all appearance-none"
                  id="perm-group"
                  name="groupId"
                  value={inputPermission.groupId}
                  onChange={handleChangeInput}
                >
                  <option value="0">Chọn nhóm quyền...</option>
                  {dataPermissionGroup.map((perGroup) => {
                    return (
                      <option
                        key={perGroup.id}
                        label={perGroup.label}
                        value={perGroup.id}
                      >
                        {perGroup.name}
                      </option>
                    );
                  })}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                  <RxDoubleArrowDown />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Phân loại quyền này vào một nhóm chức năng cụ thể.
              </p>
              <p className="text-red-500 font-medium">{errors.groupId}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-slate-900 dark:text-white flex items-center justify-between"
                htmlFor="perm-slug"
              >
                <span>Mã định danh (Slug)</span>
                <span className="text-xs font-normal text-primary cursor-pointer hover:underline flex items-center gap-1">
                  <MdAutorenew className="text-[14px]" /> Tự động tạo
                </span>
              </label>
              <div className="relative">
                <input
                  className="form-input w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary h-12 pl-4 pr-10 font-mono text-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-all"
                  id="perm-slug"
                  placeholder="inventory.management"
                  type="text"
                  name="name"
                  value={inputPermission.name}
                  onChange={handleChangeInput}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
                  <IoMdFingerPrint className="text-[20px]" />
                </div>
              </div>
              <p className="text-xs text-slate-500">
                Mã duy nhất dùng trong hệ thống (chỉ chứa chữ thường, số và dấu
                gạch dưới).
              </p>
              <p className="text-red-500 font-medium">{errors.name}</p>
            </div>
            <div className="flex flex-col gap-2">
              <label
                className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1"
                htmlFor="perm-desc"
              >
                Mô tả quyền <span className="text-red-500">*</span>
              </label>
              <textarea
                className="form-textarea w-full rounded-lg border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-black/20 text-slate-900 dark:text-white focus:border-primary focus:ring-1 focus:ring-primary p-4 placeholder:text-slate-400 dark:placeholder:text-slate-500 resize-none transition-all"
                id="perm-desc"
                placeholder="Mô tả chi tiết về phạm vi truy cập của quyền này..."
                rows={3}
                name="description"
                value={inputPermission.description}
                onChange={handleChangeInput}
              />
              <p className="text-red-500 font-medium">{errors.description}</p>
            </div>
            <div className="h-px w-full bg-gray-100 dark:bg-gray-700 my-2" />
          </div>
        </div>
        <div className="lg:col-span-1 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a2e1f] rounded-xl shadow-sm border border-gray-100 dark:border-gray-800/50 overflow-hidden">
            <div className="p-5 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Nhóm quyền
              </h3>
              <label
                className="cursor-pointer text-xs font-semibold bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5 rounded-md transition-colors flex items-center gap-1"
                htmlFor="modal-toggle"
                onClick={() => setIsOpenModal(true)}
              >
                <IoMdAdd className="text-[16px]" /> Mới
              </label>
            </div>
            <div className="flex flex-col divide-y divide-gray-100 dark:divide-gray-800 max-h-[500px] overflow-y-auto">
              {dataPermissionGroup.map((perGroup, i) => {
                const Icon =
                  iconForPermissionGroup[perGroup.name as PermissionGroupKey];
                return (
                  <div className="p-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors group cursor-pointer">
                    <div className="flex items-start justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Icon className="text-slate-400 text-[20px]" />
                        <span className="font-semibold text-sm text-slate-900 dark:text-white">
                          {perGroup.label}
                        </span>
                      </div>
                      <button
                        className="text-slate-400 hover:text-primary transition-colors opacity-0 group-hover:opacity-100"
                        onClick={() => {
                          setIsPermissionGroup(perGroup.id);
                          setIsOpenModal(true);
                        }}
                      >
                        <MdEdit className="text-[18px]" />
                      </button>
                    </div>
                    <p className="text-xs text-slate-500 pl-7 line-clamp-2">
                      {perGroup.description}
                    </p>
                    <div className="mt-2 pl-7 flex items-center gap-2">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-slate-600 dark:text-slate-400">
                        {perGroup.permissionCount + " quyền"}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-5 border border-blue-100 dark:border-blue-800/50">
            <div className="flex items-start gap-3">
              <FaInfoCircle className="text-blue-500 shrink-0" />
              <div className="flex flex-col gap-1">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Lưu ý
                </h4>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Phân loại quyền vào đúng nhóm giúp việc quản lý và cấp quyền
                  cho nhân viên dễ dàng hơn. Bạn có thể thêm nhóm mới bất cứ lúc
                  nào.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <PermissionGroupForm
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
        idPermissionGroup={idPermissionGroup}
        setIsPermissionGroup={setIsPermissionGroup}
      />
    </>
  );
}

export default PermissionFormPage;
