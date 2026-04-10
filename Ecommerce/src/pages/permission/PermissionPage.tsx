import { IoMdAdd } from "react-icons/io";

import Header from "../../components/common/Header";
import Button from "../../components/common/Button";
import SearchInput from "../../components/common/SearchInput";

import { useNavigate } from "react-router-dom";
import React, { useEffect, useState } from "react";

import { useToast } from "../../hook/useToast";

import { getAllPermissionGroup } from "../../api/permissionApi";

import { PermissionGroup } from "../../types/PermissionGroupType";

import PermissionList from "../../components/permission/PermissionList";

function PermissionPage() {
  type PermissionGroupSelect = Pick<PermissionGroup, "id" | "name" | "label">;

  const navigate = useNavigate();

  const { showToast } = useToast();

  const [catePermission, setCatePermission] = useState<number>(0);

  const [inputSearch, setInputSearch] = useState<{ searchPermission: string }>({
    searchPermission: "",
  });

  const [dataPermissionGroupSelect, setDataPermissionGroupSelect] = useState<
    PermissionGroupSelect[]
  >([]);

  const getDataAllPermissionGroups = async () => {
    try {
      const resPermissionGroup = await getAllPermissionGroup();
      showToast(resPermissionGroup.message, resPermissionGroup.type);
      setDataPermissionGroupSelect(resPermissionGroup.data);
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

  return (
    <>
      <Header
        content="Xem và quản lý danh sách các quyền hạn trong hệ thống. Bạn có thể thêm quyền mới, chỉnh sửa thông tin hoặc xóa các quyền không còn sử dụng"
        title="Quản lý quyền"
        component={
          <Button
            title="Thêm quyền mới"
            onClick={() => navigate("add")}
            icon={<IoMdAdd className="text-lg" />}
          />
        }
      />
      <div className="mt-4 rounded-xl border border-[#e7f3ea] dark:border-[#2a4030] bg-surface-light dark:bg-surface-dark p-4 shadow-sm">
        <div className="flex flex-col md:flex-row gap-4">
          <SearchInput
            value={inputSearch.searchPermission}
            onChange={(e) =>
              setInputSearch((prev) => ({
                ...prev,
                searchPermission: e.target.value,
              }))
            }
            placeholder="Tìm kiếm quyền..."
          />
          <div className="flex gap-4">
            <select
              className="block w-full md:w-48 rounded-lg border-0 bg-[#e7f3ea] dark:bg-gray-800 py-3 pl-3 pr-10 text-text-main dark:text-white focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
              onChange={(e) => {
                setCatePermission(Number(e.target.value));
              }}
            >
              <option value={0}>Tất cả module</option>
              {dataPermissionGroupSelect.map((perGroup) => {
                return <option value={perGroup.id}>{perGroup.name}</option>;
              })}
            </select>
            <select className="block w-full md:w-40 rounded-lg border-0 bg-[#e7f3ea] dark:bg-gray-800 py-3 pl-3 pr-10 text-text-main dark:text-white focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6">
              <option>Mới nhất</option>
              <option>Cũ nhất</option>
              <option>Tên A-Z</option>
            </select>
          </div>
        </div>
        <PermissionList
          catePermission={catePermission}
          searchPermission={inputSearch.searchPermission}
        />
      </div>
    </>
  );
}

export default PermissionPage;
