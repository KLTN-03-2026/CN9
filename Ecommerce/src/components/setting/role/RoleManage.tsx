import { useEffect, useState } from "react";

import Button from "../../common/Button";
import ButtonIconDelete from "../../common/ButtonIconDelete";
import ButtonIconEdit from "../../common/ButtonIconEdit";

import { IoMdAdd } from "react-icons/io";
import RoleForm from "./RoleForm";
import { getRole } from "../../../types/RoleType";
import { useToast } from "../../../hook/useToast";
import { deleteRoleById, getAllRole } from "../../../api/roleApi";

function RoleManage() {
  const [isShowModalRole, setIsShowModalRole] = useState(false);

  const [dataRole, setDataRole] = useState<getRole[]>([]);

  const { showToast } = useToast();

  const [idRole, setIdRole] = useState<number | null>(null);

  const getDataALlRoles = async () => {
    try {
      const resRole = await getAllRole();
      // showToast(resRole.message, resRole.type);
      setDataRole(resRole.data);
    } catch (error: any) {
      showToast(
        error.response?.data?.message || "Tạo nhóm quyền thất bại",
        "error",
      );
    }
  };

  const handleDeleteRole = async (id: number) => {
    try {
      const resRole = await deleteRoleById(id);
      showToast(resRole.message, resRole.type);
      setDataRole(resRole.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataALlRoles();
  }, []);

  return (
    <section
      className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark"
      id="user-roles"
    >
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Quản lý vai trò</h2>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
            Quản lý vai trò và phân quyền cho người dùng.
          </p>
        </div>
        <Button
          title="Thêm vai trò"
          icon={<IoMdAdd className="text-xl" />}
          onClick={() => setIsShowModalRole((prev) => !prev)}
        />
      </div>
      <div className="overflow-x-auto mt-4">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
              <th className="py-3 px-4 font-medium">Vai trò</th>
              <th className="py-3 px-4 font-medium">Số người dùng</th>
              <th className="py-3 px-4 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {dataRole.map((role) => {
              return (
                <tr
                  className="border-b border-border-light dark:border-border-dark"
                  key={role.id}
                >
                  <td className="py-3 px-4 font-medium">{role.name}</td>
                  <td className="py-3 px-4">{role.roleCount}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-2">
                      <ButtonIconEdit
                        onClick={() => {
                          setIsShowModalRole(true);
                          setIdRole(role.id);
                        }}
                      />
                      <ButtonIconDelete
                        onClick={() => {
                          handleDeleteRole(role.id);
                        }}
                      />
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <RoleForm
        idRole={idRole}
        setIdRole={setIdRole}
        isShowModalRole={isShowModalRole}
        setIsShowModalRole={setIsShowModalRole}
      />
    </section>
  );
}

export default RoleManage;
