import { Modal, Switch } from "antd";
import React, { useEffect, useState } from "react";
import Header from "../../common/Header";
import Button from "../../common/Button";
import { FaRegSave } from "react-icons/fa";
import { getAllPermissionGroup } from "../../../api/permissionApi";
import { useToast } from "../../../hook/useToast";
import { PermissionGroupWithPermissions } from "../../../types/PermissionGroupType";
import { MdInventory } from "react-icons/md";
import { createRole } from "../../../types/RoleType";
import {
  addRole,
  getRoleById,
  getStatusPermissionGroupByRoleId,
} from "../../../api/roleApi";
import {
  iconForPermissionGroup,
  PermissionGroupKey,
} from "../../../utils/icon/IconPermissionGroup";

interface RoleFormProps {
  idRole: number | null;
  isShowModalRole: boolean;
  setIdRole: React.Dispatch<React.SetStateAction<number | null>>;
  setIsShowModalRole: React.Dispatch<React.SetStateAction<boolean>>;
}

function RoleForm({
  idRole,
  setIdRole,
  isShowModalRole,
  setIsShowModalRole,
}: RoleFormProps) {
  const { showToast } = useToast();

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof input, string>>
  >({});

  const [input, setInput] = useState<createRole>({
    description: "",
    name: "",
    permissions: [],
  });

  const [statusPermissionGroup, setStatusPermissionGroup] = useState<
    { permissionGroupId: number; is_enabled: boolean }[]
  >([]);

  const [dataPermissionGroup, setDataPermissionGroup] = useState<
    PermissionGroupWithPermissions[]
  >([]);

  const getDataAllPermissionGroups = async () => {
    try {
      const resPermissionGroup = await getAllPermissionGroup();
      showToast(resPermissionGroup.message, resPermissionGroup.type);
      setDataPermissionGroup(
        resPermissionGroup.data.map((item: PermissionGroupWithPermissions) => ({
          ...item,
          checked: false,
        })),
      );
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error",
      );
    }
  };

  const getDataRoleById = async (id: number) => {
    try {
      const resRole = await getRoleById(id);
      const statusPermissionGroup = await getStatusPermissionGroupByRoleId(id);

      showToast(resRole.message, resRole.type);
      setStatusPermissionGroup(statusPermissionGroup.data);
      setInput({
        name: resRole.data.name,
        description: resRole.data.description,
        permissions: resRole.data.permissions,
      });
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error",
      );
    }
  };

  useEffect(() => {
    getDataAllPermissionGroups();
  }, []);

  useEffect(() => {
    if (!statusPermissionGroup.length) return;

    setDataPermissionGroup((prev) =>
      prev.map((item) => ({
        ...item,
        checked:
          statusPermissionGroup.find((s) => s.permissionGroupId === item.id)
            ?.is_enabled ?? false,
      })),
    );
  }, [statusPermissionGroup]);

  useEffect(() => {
    if (idRole === null) return;

    getDataRoleById(idRole);
  }, [idRole]);

  const handleChangeInput = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleTogglePermission = (permissionId: number) => {
    setErrors((prev) => ({ ...prev, permissions: "" }));

    setInput((prev) => {
      const exists = prev.permissions.includes(permissionId);

      return {
        ...prev,
        permissions: exists
          ? prev.permissions.filter((id) => id !== permissionId)
          : [...prev.permissions, permissionId],
      };
    });
  };

  const handleSubmitRole = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!input.name) {
        newErrors.name = "Vui lòng nhập tên vai trò";
      }

      if (!input.description) {
        newErrors.description = "Vui lòng nhập mô tả cho vai trò";
      }

      if (input.permissions.length === 0) {
        newErrors.permissions = "Vui lòng chọn quyền cho vai trò";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data: createRole = {
        name: input.name,
        description: input.description,
        permissions: input.permissions,
      };

      if (idRole) {
      } else {
        const resRole = await addRole(data);
        showToast(resRole.message, resRole.type);
      }
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error",
      );
    }
  };

  return (
    <Modal
      open={isShowModalRole}
      onCancel={() => setIsShowModalRole(false)}
      footer={[]}
      width="auto"
      closable={false}
    >
      <main className="flex-1 p-8 overflow-y-auto">
        <Header
          title="Phân quyền chi tiết"
          content="Phân quyền cho vai trò"
          component={
            <>
              <Button
                title="Hủy"
                onClick={() => {
                  setIsShowModalRole(false);
                  setIdRole(null);
                }}
                className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
              />
              <Button
                title="Lưu quyền"
                icon={<FaRegSave className="text-xl" />}
                onClick={() => {
                  handleSubmitRole();
                }}
              />
            </>
          }
        />
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          <div className="xl:col-span-4 space-y-6">
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6 shadow-sm">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5">
                    Tên hiển thị
                  </label>
                  <input
                    className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all"
                    type="text"
                    name="name"
                    value={input.name}
                    onChange={handleChangeInput}
                  />
                  <p className="text-red-500 font-medium">{errors.name}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-light dark:text-text-dark mb-1.5">
                    Mô tả
                  </label>
                  <textarea
                    className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg px-3 py-2 text-sm text-text-light dark:text-text-dark focus:ring-2 focus:ring-primary/50 focus:border-primary outline-none transition-all resize-none"
                    rows={4}
                    name="description"
                    value={input.description}
                    onChange={handleChangeInput}
                  />
                  <p className="text-red-500 font-medium">
                    {errors.description}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark p-6 shadow-sm">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-sm font-bold uppercase tracking-wider text-text-muted-light dark:text-text-muted-dark">
                  Người dùng (5)
                </h3>
                <a
                  className="text-xs font-medium text-primary hover:underline"
                  href="#"
                >
                  Xem tất cả
                </a>
              </div>
              <div className="flex items-center -space-x-3">
                <div className="w-10 h-10 rounded-full border-2 border-card-light dark:border-card-dark bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                  JD
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-card-light dark:border-card-dark bg-blue-200 flex items-center justify-center text-blue-500 font-bold">
                  AS
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-card-light dark:border-card-dark bg-green-200 flex items-center justify-center text-green-500 font-bold">
                  MR
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-card-light dark:border-card-dark bg-background-light dark:bg-background-dark flex items-center justify-center text-xs font-medium text-text-muted-light">
                  +2
                </div>
              </div>
              <div className="mt-4 p-3 bg-primary/10 rounded-lg flex gap-3 items-start">
                <span className="material-symbols-outlined text-success text-lg mt-0.5">
                  info
                </span>
                <p className="text-xs text-text-muted-light dark:text-text-muted-dark leading-relaxed">
                  Thay đổi quyền hạn sẽ cập nhật ngay lập tức cho tất cả 5 người
                  dùng thuộc vai trò này.
                </p>
              </div>
            </div>
          </div>
          <div className="xl:col-span-8">
            <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark shadow-sm">
              <p className="ml-2 mt-2 text-red-500 font-medium">
                {errors.permissions}
              </p>
              {dataPermissionGroup.map((perGroup) => {
                const Icon =
                  iconForPermissionGroup[perGroup.name as PermissionGroupKey];
                const permissions = perGroup.permissions.map((per) => {
                  return (
                    <label
                      key={per.id}
                      className={`relative flex items-start py-3 px-4 rounded-lg border border-border-light dark:border-border-dark ${
                        perGroup.checked
                          ? "hover:bg-background-light dark:hover:bg-background-dark cursor-pointer transition-colors group opacity-75"
                          : "bg-background-light dark:bg-background-dark "
                      } `}
                    >
                      <div className="flex items-center h-5 mt-0.5">
                        <input
                          className="w-4 h-4 text-primary bg-background-light border-border-light rounded focus:ring-primary dark:focus:ring-primary dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                          type="checkbox"
                          checked={
                            per.checked || input.permissions.includes(per.id)
                          }
                          onClick={() => handleTogglePermission(per.id)}
                          onChange={(e) => {
                            const checked = e.target.checked;

                            setDataPermissionGroup((prev) =>
                              prev.map((p) => ({
                                ...p,
                                permissions: p.permissions.map((item) =>
                                  item.id === per.id
                                    ? { ...item, checked }
                                    : item,
                                ),
                              })),
                            );
                          }}
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <span className="font-medium text-text-light dark:text-text-dark group-hover:text-primary transition-colors">
                          {per.label}
                        </span>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark mt-0.5">
                          {per.description}
                        </p>
                      </div>
                    </label>
                  );
                });
                return (
                  <div
                    className="p-6 border-b border-border-light dark:border-border-dark"
                    key={perGroup.id}
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex gap-3">
                        <div className="mt-1 p-2 bg-background-light dark:bg-background-dark rounded-lg">
                          <Icon className="text-text-muted-light" size={25} />
                        </div>
                        <div>
                          <h3 className="text-lg font-bold text-text-light dark:text-text-dark">
                            {perGroup.label}
                          </h3>
                          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                            {perGroup.description}
                          </p>
                        </div>
                      </div>
                      <label className="inline-flex items-center cursor-pointer">
                        <Switch
                          checked={perGroup.checked}
                          onChange={(checked) => {
                            setDataPermissionGroup((prev) =>
                              prev.map((p) =>
                                p.id === perGroup.id ? { ...p, checked } : p,
                              ),
                            );
                            if (!checked) {
                              const permissionIds = perGroup.permissions.map(
                                (p) => p.id,
                              );

                              setInput((prev) => ({
                                ...prev,
                                permissions: prev.permissions.filter(
                                  (id) => !permissionIds.includes(id),
                                ),
                              }));
                            } else {
                              const selectedPermissionIds = perGroup.permissions
                                .filter((p) => p.checked)
                                .map((p) => p.id);

                              setInput((prev) => ({
                                ...prev,
                                permissions: [
                                  ...prev.permissions,
                                  ...selectedPermissionIds,
                                ],
                              }));
                            }
                          }}
                        />
                        <span className="ms-3 text-sm font-medium text-text-muted-light dark:text-text-muted-dark">
                          Bật nhóm
                        </span>
                      </label>
                    </div>
                    <div
                      className={`grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 ${
                        perGroup.checked ? "" : "opacity-50 pointer-events-none"
                      }`}
                    >
                      {permissions}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>
    </Modal>
  );
}

export default RoleForm;
