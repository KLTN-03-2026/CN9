import { FaRegSave } from "react-icons/fa";
import { RxDoubleArrowDown } from "react-icons/rx";

import Button from "../common/Button";
import HeaderPage from "../common/Header";

import { Modal } from "antd";

import React, { useEffect, useState } from "react";

import { useToast } from "../../hook/useToast";

import { CreateEmployee } from "../../types/EmployeeType";

import { getAllRole } from "../../api/roleApi";
import { createEmployee } from "../../api/employeeApi";

interface EmployeeFormprops {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function EmployeeForm({ isOpenModal, setIsOpenModal }: EmployeeFormprops) {
  const { showToast } = useToast();

  const [input, setInput] = useState<{
    name: string;
    email: string;
    phone: string;
    roleId: number;
  }>({ email: "", name: "", phone: "", roleId: 0 });

  const [dateRole, setDataRole] = useState<{ id: number; name: string }[]>([]);

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof input, string>>
  >({});

  function handleChangeInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const getDataPermission = async () => {
    try {
      const resRole = await getAllRole();
      showToast(resRole.message, resRole.type);
      setDataRole(resRole.data);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  useEffect(() => {
    getDataPermission();
  }, []);

  const handleSubmitRole = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!input.name) {
        newErrors.name = "Vui lòng nhập tên của nhân viên";
      }

      if (!input.email) {
        newErrors.email = "Vui lòng nhập email của nhân viên";
      }

      if (!input.phone) {
        newErrors.phone = "Vui lòng nhập số điện thoại của nhân viên";
      }

      if (!input.roleId) {
        newErrors.roleId = "Vui lòng chọn vai trò cho nhân viên";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const data: CreateEmployee = {
        name: input.name,
        email: input.email,
        password: 12345,
        phone: input.phone,
        roleId: input.roleId,
      };

      const resEmployee = await createEmployee(data);

      showToast(resEmployee.message, resEmployee.type);
    } catch (error: any) {
      showToast(error.response?.data?.message || "Lỗi", "error");
    }
  };

  return (
    <Modal
      width="auto"
      open={isOpenModal}
      onCancel={() => setIsOpenModal((prev) => !prev)}
      footer={null}
      closable={false}
    >
      <HeaderPage
        title="Thêm nhân viên mới"
        content="Điền thông tin dưới đây để tạo hồ sơ nhân viên và gán vai trò"
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => setIsOpenModal(false)}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title="Lưu tài khoản"
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitRole();
              }}
            />
          </>
        }
      />
      <div className="mt-4">
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold">
              Thông tin cá nhân &amp; Vai trò
            </h2>
          </div>
          <div className="p-6">
            <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label
                  className="text-sm font-medium mb-1 block"
                  htmlFor="full-name"
                >
                  Tên đầy đủ
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="full-name"
                  placeholder="Ví dụ: Trần Văn B"
                  type="text"
                  name="name"
                  value={input.name}
                  onChange={handleChangeInput}
                />
                <p className="text-red-500 font-medium">{errors.name}</p>
              </div>
              <div>
                <label
                  className="text-sm font-medium mb-1 block"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="email"
                  placeholder="Ví dụ: nhanvien@company.com"
                  type="email"
                  name="email"
                  value={input.email}
                  onChange={handleChangeInput}
                />
                <p className="text-red-500 font-medium">{errors.email}</p>
              </div>
              <div>
                <label
                  className="text-sm font-medium mb-1 block"
                  htmlFor="phone-number"
                >
                  Số điện thoại
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="phone-number"
                  placeholder="Ví dụ: 0987654321"
                  type="tel"
                  name="phone"
                  value={input.phone}
                  onChange={handleChangeInput}
                />
                <p className="text-red-500 font-medium">{errors.phone}</p>
              </div>
              <div>
                <div className="md:col-span-2">
                  <label
                    className="text-sm font-medium mb-2 block"
                    htmlFor="role"
                  >
                    Gán vai trò
                  </label>
                  <div className="relative">
                    <select
                      name="roleId"
                      value={input.roleId}
                      onChange={handleChangeInput}
                      className="w-full px-4 py-2.5 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 appearance-none cursor-pointer"
                      id="role"
                    >
                      <option value={0}>Chọn vai trò...</option>

                      {dateRole.map((role) => {
                        return <option value={role.id}>{role.name}</option>;
                      })}
                    </select>
                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-text-muted-light dark:text-text-muted-dark">
                      <RxDoubleArrowDown className="text-xl" />
                    </div>
                  </div>
                  <p className="mt-1.5 text-xs text-text-muted-light dark:text-text-muted-dark">
                    Vai trò sẽ xác định quyền hạn truy cập của nhân viên trong
                    hệ thống.
                  </p>
                  <p className="text-red-500 font-medium">{errors.roleId}</p>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default EmployeeForm;
