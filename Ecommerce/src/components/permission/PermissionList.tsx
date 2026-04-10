import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Permission } from "../../types/PermissionType";

import { getAllPermission } from "../../api/permissionApi";

import { useToast } from "../../hook/useToast";

import ButtonIconEdit from "../common/ButtonIconEdit";
import ButtonIconDelete from "../common/ButtonIconDelete";

import { HiOutlineChevronLeft, HiOutlineChevronRight } from "react-icons/hi";

interface PermissionListProps {
  catePermission: number;
  searchPermission: string;
}

function PermissionList({
  catePermission,
  searchPermission,
}: PermissionListProps) {
  const { showToast } = useToast();

  const navigate = useNavigate();

  const [dataPermission, setDataPermission] = useState<Permission[]>([]);

  const filteredDatePermission = useMemo(() => {
    return dataPermission.filter((per) =>
      catePermission ? per.groupId === catePermission : per,
    );
  }, [catePermission, dataPermission]);

  const { isAllChecked, isSomeChecked } = useMemo(() => {
    const total = dataPermission.length;
    const checkedCount = dataPermission.filter((p) => p.checked).length;

    return {
      isAllChecked: total > 0 && checkedCount === total,
      isSomeChecked: checkedCount > 0 && checkedCount < total,
    };
  }, [dataPermission]);

  const getDataAllPermission = async (search?: string) => {
    try {
      const resPermission = await getAllPermission(search);
      setDataPermission(
        resPermission.data.map((permision: Permission) => ({
          ...permision,
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

  useEffect(() => {
    getDataAllPermission();
  }, []);

  useEffect(() => {
    if (!searchPermission) {
      getDataAllPermission();
      return;
    }

    getDataAllPermission(searchPermission);
  }, [searchPermission]);

  return (
    <div className="overflow-hidden rounded-xl border border-[#cfe8d5] dark:border-[#2a4030] bg-surface-light dark:bg-surface-dark shadow-sm mt-8">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-text-secondary dark:text-gray-400">
          <thead className="bg-[#f8fcf9] dark:bg-gray-800 text-xs uppercase text-text-main dark:text-gray-300">
            <tr>
              <th className="px-6 py-4 font-bold" scope="col">
                <div className="flex items-center gap-2">
                  <input
                    className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary focus:ring-2 focus:ring-primary checkbox-accent"
                    type="checkbox"
                    checked={isAllChecked}
                    ref={(el) => {
                      if (el) el.indeterminate = !isAllChecked && isSomeChecked;
                    }}
                    onChange={(e) => {
                      const checked = e.target.checked;

                      setDataPermission((prev) =>
                        prev.map((p) => ({ ...p, checked })),
                      );
                    }}
                  />
                  Tên quyền
                </div>
              </th>
              <th className="px-6 py-4 font-bold" scope="col">
                Mã quyền
              </th>
              <th className="px-6 py-4 font-bold" scope="col">
                Mô tả
              </th>
              <th className="px-6 py-4 font-bold" scope="col">
                Ngày cập nhật
              </th>
              <th className="px-6 py-4 font-bold text-center" scope="col">
                Hành động
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#cfe8d5] dark:divide-[#2a4030]">
            {filteredDatePermission.map((permission) => {
              return (
                <tr className="group hover:bg-[#e7f3ea] dark:hover:bg-gray-800/50 transition-colors">
                  <td className="px-6 py-4 font-medium text-text-main dark:text-white whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <input
                        className="h-4 w-4 rounded border-gray-300 bg-gray-100 text-primary focus:ring-2 focus:ring-primary checkbox-accent"
                        type="checkbox"
                        checked={permission.checked}
                        onChange={(e) => {
                          const checked = e.target.checked;

                          setDataPermission((prev) =>
                            prev.map((p) =>
                              p.id == permission.id ? { ...p, checked } : p,
                            ),
                          );
                        }}
                      />
                      <span>{permission.label}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10 dark:bg-blue-900/30 dark:text-blue-400">
                      {permission.name}
                    </span>
                  </td>
                  <td
                    className="px-6 py-4 max-w-xs truncate"
                    title="Cho phép thêm, sửa, xóa sản phẩm"
                  >
                    {permission.description}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(permission.updatedAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <ButtonIconEdit
                        onClick={() =>
                          navigate({
                            pathname: "add",
                            search: `?id=${permission.id}`,
                          })
                        }
                      />
                      <ButtonIconDelete />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {/* Pagination */}
      <div className="flex items-center justify-between border-t border-[#cfe8d5] dark:border-[#2a4030] bg-[#f8fcf9] dark:bg-gray-800 px-4 py-3 sm:px-6">
        <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-text-secondary dark:text-gray-400">
              Hiển thị{" "}
              <span className="font-medium text-text-main dark:text-white">
                1{" "}
              </span>
              đến{" "}
              <span className="font-medium text-text-main dark:text-white">
                10{" "}
              </span>
              trong số{" "}
              <span className="font-medium text-text-main dark:text-white">
                {dataPermission.length}
              </span>{" "}
              kết quả
            </p>
          </div>
          <div>
            <nav
              aria-label="Pagination"
              className="isolate inline-flex -space-x-px rounded-md shadow-sm"
            >
              <a
                className="relative inline-flex items-center rounded-l-md px-2 py-2 text-text-secondary ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-600 dark:hover:bg-gray-700"
                href="#"
              >
                <span className="sr-only">Previous</span>
                <HiOutlineChevronLeft className="text-sm" />
              </a>
              <a
                aria-current="page"
                className="relative z-10 inline-flex items-center bg-primary px-4 py-2 text-sm font-semibold text-black focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                href="#"
              >
                1
              </a>
              <a
                className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-main ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700"
                href="#"
              >
                2
              </a>
              <a
                className="relative hidden items-center px-4 py-2 text-sm font-semibold text-text-main ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 md:inline-flex dark:text-white dark:ring-gray-600 dark:hover:bg-gray-700"
                href="#"
              >
                3
              </a>
              <span className="relative inline-flex items-center px-4 py-2 text-sm font-semibold text-text-secondary ring-1 ring-inset ring-gray-300 focus:outline-offset-0 dark:ring-gray-600">
                ...
              </span>
              <a
                className="relative inline-flex items-center rounded-r-md px-2 py-2 text-text-secondary ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0 dark:ring-gray-600 dark:hover:bg-gray-700"
                href="#"
              >
                <span className="sr-only">Next</span>
                <HiOutlineChevronRight className="text-sm" />
              </a>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PermissionList;
