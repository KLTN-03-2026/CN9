import { useToast } from "../../hook/useToast";

import { EmployeeType } from "../../types/EmployeeType";

import ButtonIconEdit from "../common/ButtonIconEdit";
import ToggleActiveButton from "../common/ToggleActiveButton";
import ButtonIconDelete from "../common/ButtonIconDelete";

import { toggleAccountActive } from "../../api/employeeApi";

import React from "react";

interface EmployeeListProps {
  dataEmployee: EmployeeType[];
  onReloadEmployee: () => void;
  setIdEmployee: React.Dispatch<React.SetStateAction<number | null>>;
}

function EmployeeList({
  dataEmployee,
  setIdEmployee,
  onReloadEmployee,
}: EmployeeListProps) {
  const { showToast } = useToast();

  const handleToggleEmployeeActive = async (id: number, isActive: boolean) => {
    try {
      await toggleAccountActive(id, { isActive });
      showToast(
        isActive ? "Mở khóa sale thành công" : "Khóa sale thành công",
        "success",
      );
      onReloadEmployee();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
            <th className="py-3 px-4 font-medium">Khách hàng</th>
            <th className="py-3 px-4 font-medium">Email</th>
            <th className="py-3 px-4 font-medium">Số điện thoại</th>
            <th className="py-3 px-4 font-medium text-center">Vai trò</th>
            <th className="py-3 px-4 font-medium text-right">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {dataEmployee.map((employee) => {
            const timeCreate = new Date(employee.createdAt).toLocaleDateString(
              "vi-VN",
            );
            return (
              <tr className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                      src={
                        employee.avatar ||
                        "https://lh3.googleusercontent.com/aida-public/AB6AXuBxrLoqLFpB8QTbz10BVp9re0BgLeyMwDeAjg9-_dH3WOgLIBoSKfyY6XVIYlIaLDrkNHW8dHWnGOQZ_MMaDyRiND99aciTEdfiH7MdNJhxUJYiwWRXMpcSDHN16X0EDwWsVIi6DU6AwBJyipuRJHgoU9NS5nI_ZCLYqkgGkT5zT-64PaTPELwUWnxFmwr3hM1KFbK7JOi3BrggcA5vwxRptag4PFN97bznwZNDJ9ToxOTRdbcRoeHa1SISxPn9iIDMsZEHTG6fBAY"
                      }
                    />
                    <div>
                      <p className="font-medium text-text-light dark:text-text-dark">
                        {employee.name}
                      </p>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        Đã đăng ký: {timeCreate}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4"> {employee.email}</td>
                <td className="py-3 px-4"> {employee.phone}</td>
                <td className="py-3 px-4 text-center"> {employee.nameRole}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <ToggleActiveButton
                      isActive={employee.isActive}
                      onToggle={() =>
                        handleToggleEmployeeActive(
                          employee.id,
                          !employee.isActive,
                        )
                      }
                    />
                    <ButtonIconEdit
                      onClick={() => setIdEmployee(employee.id)}
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
  );
}

export default EmployeeList;
