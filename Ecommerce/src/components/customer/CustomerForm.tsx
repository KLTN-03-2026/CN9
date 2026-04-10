import { FaRegSave } from "react-icons/fa";

import Button from "../common/Button";
import Header from "../common/Header";

import { Modal } from "antd";

import React, { useState } from "react";

import { CreateUserType } from "../../types/UserType";

import { useToast } from "../../hook/useToast";

import { createUser } from "../../api/userApi";

interface CustomerFormProps {
  isOpenModal: boolean;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  onReloadCustomer: () => void;
}

function CustomerForm({
  isOpenModal,
  setIsOpenModal,
  onReloadCustomer,
}: CustomerFormProps) {
  const { showToast } = useToast();

  const [inputUser, setInputUser] = useState<CreateUserType>({
    address: "",
    email: "",
    name: "",
    phone: "",
  });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof inputUser, string>>
  >({});

  function handleChangeInput(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) {
    setErrors((prev) => ({ ...prev, [e.target.name]: "" }));
    setInputUser((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  const handleSubmitUser = async () => {
    try {
      const newErrors: Partial<typeof errors> = {};

      if (!inputUser.name) {
        newErrors.name = "Vui lòng nhập tên của người dùng";
      }

      if (!inputUser.email) {
        newErrors.email = "Vui lòng nhập email của người dùng";
      }

      if (!inputUser.phone) {
        newErrors.phone = "Vui lòng nhập số điện thoại của người dùng";
      }

      if (!inputUser.address) {
        newErrors.address = "Vui lòng nhập địa chỉ của người dùng";
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      const formData = new FormData();
      formData.append("name", inputUser.name);
      formData.append("email", inputUser.email);
      formData.append("phone", inputUser.phone);
      formData.append("password", "12345678");
      formData.append("address", inputUser.address);

      const resUser = await createUser(formData);

      setIsOpenModal(false);
      onReloadCustomer();
      setInputUser({ address: "", email: "", name: "", phone: "" });
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
      <Header
        title="Thêm khách hàng mới"
        content="Điền thông tin dưới đây để tạo một khách hàng mới"
        component={
          <>
            <Button
              title="Hủy"
              onClick={() => setIsOpenModal(false)}
              className="border border-border-light dark:border-border-dark font-semibold text-sm hover:bg-primary/20"
            />
            <Button
              title="Lưu khách hàng"
              icon={<FaRegSave className="text-xl" />}
              onClick={() => {
                handleSubmitUser();
              }}
            />
          </>
        }
      />
      <div className="mt-4">
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <h2 className="text-lg font-semibold">Thông tin khách hàng</h2>
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
                  placeholder="Ví dụ: Nguyễn Văn A"
                  type="text"
                  onChange={handleChangeInput}
                  name="name"
                  value={inputUser.name}
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
                  placeholder="Ví dụ: email@example.com"
                  type="email"
                  onChange={handleChangeInput}
                  name="email"
                  value={inputUser.email}
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
                  onChange={handleChangeInput}
                  name="phone"
                  value={inputUser.phone}
                />
                <p className="text-red-500 font-medium">{errors.phone}</p>
              </div>
              <div>
                <label
                  className="text-sm font-medium mb-1 block"
                  htmlFor="address"
                >
                  Địa chỉ
                </label>
                <input
                  className="w-full px-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="address"
                  placeholder="Ví dụ: 123 Đường ABC, Phường X, Quận Y, Tỉnh Z"
                  type="text"
                  onChange={handleChangeInput}
                  name="address"
                  value={inputUser.address}
                />
                <p className="text-red-500 font-medium">{errors.address}</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default CustomerForm;
