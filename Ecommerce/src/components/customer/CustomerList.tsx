import { IoMdReturnRight } from "react-icons/io";
import { RiDeleteBin6Line } from "react-icons/ri";

import { useNavigate } from "react-router-dom";

import { UserType } from "../../types/UserType";

import ToggleActiveButton from "../common/ToggleActiveButton";

import { useToast } from "../../hook/useToast";

import { toggleUserActive } from "../../api/userApi";

interface CustomerListProps {
  dataUser: UserType[];
  onReloadCustomer: () => void;
}

function CustomerList({ dataUser, onReloadCustomer }: CustomerListProps) {
  const { showToast } = useToast();

  const navigate = useNavigate();

  const handleToggleCustomerActive = async (id: number, isActive: boolean) => {
    try {
      await toggleUserActive(id, { isActive });
      showToast(
        isActive ? "Mở khóa sale thành công" : "Khóa sale thành công",
        "success",
      );
      onReloadCustomer();
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
            <th className="py-3 px-4 font-medium text-center">Tổng đơn hàng</th>
            <th className="py-3 px-4 font-medium text-center">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {dataUser.map((user) => {
            const timeCreate = new Date(user.createdAt).toLocaleDateString(
              "vi-VN",
            );
            return (
              <tr className="border-b border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <img
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxrLoqLFpB8QTbz10BVp9re0BgLeyMwDeAjg9-_dH3WOgLIBoSKfyY6XVIYlIaLDrkNHW8dHWnGOQZ_MMaDyRiND99aciTEdfiH7MdNJhxUJYiwWRXMpcSDHN16X0EDwWsVIi6DU6AwBJyipuRJHgoU9NS5nI_ZCLYqkgGkT5zT-64PaTPELwUWnxFmwr3hM1KFbK7JOi3BrggcA5vwxRptag4PFN97bznwZNDJ9ToxOTRdbcRoeHa1SISxPn9iIDMsZEHTG6fBAY"
                      alt=""
                    />
                    <div>
                      <p className="font-medium text-text-light dark:text-text-dark">
                        {user.name}
                      </p>
                      <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                        Đã đăng ký: {timeCreate}
                      </p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4">{user.email}</td>
                <td className="py-3 px-4">{user.phone}</td>
                <td className="py-3 px-4 text-center">{user.countOrder}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center justify-end gap-2">
                    <ToggleActiveButton
                      isActive={user.isActive}
                      onToggle={() =>
                        handleToggleCustomerActive(user.id, !user.isActive)
                      }
                    />
                    <button className="p-2 rounded-lg hover:bg-danger/20 text-danger">
                      <RiDeleteBin6Line className="text-lg" />
                    </button>
                    <button
                      className="p-2 rounded-lg hover:bg-primary/20 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark"
                      onClick={() => {
                        navigate(`${user.id}`);
                      }}
                    >
                      <IoMdReturnRight className="text-lg" />
                    </button>
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

export default CustomerList;
