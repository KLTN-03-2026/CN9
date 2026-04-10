import { useEffect, useState } from "react";
import { FaCheckCircle } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import {
  MdOutlineCameraAlt,
  MdOutlineEdit,
  MdOutlineErrorOutline,
} from "react-icons/md";
import { RiDeleteBin6Line } from "react-icons/ri";
import { getInfoUser } from "../../api/userApi";
import type { UserType } from "../../type/UserType";

function Info() {
  const [inputInfo, setInputInfo] = useState<UserType>({
    email: "",
    name: "",
    phone: "",
    avatar: "",
    address: "",
  });

  const getDataUSer = async () => {
    try {
      const resUser = await getInfoUser();
      const data = resUser.data;
      console.log(data);

      setInputInfo(data);
    } catch (error) {}
  };

  useEffect(() => {
    getDataUSer();
  }, []);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-text-light-primary dark:text-text-dark-primary text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Cài đặt tài khoản
          </h1>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal">
            Quản lý thông tin cá nhân và cài đặt bảo mật của bạn.
          </p>
        </div>
        <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-text-light-primary text-sm font-bold leading-normal tracking-[0.015em]">
          <IoMdAdd className="!text-xl" />
          <span className="truncate">Cập nhật thông tin</span>
        </button>
      </div>
      <div className="bg-card-light dark:bg-card-dark rounded-xl shadow-sm p-4 sm:p-6 flex flex-col gap-8">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-border-light dark:border-border-dark">
          <div className="relative">
            <img
              className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-24"
              src={
                inputInfo.avatar ||
                "https://lh3.googleusercontent.com/aida-public/AB6AXuA5mo65JZvjKp6Szj-9f6BMvLAMW89ZuWAlR7dfbBBRLzLgk-3ui66PriRFoPiKVS1Ie7mLTCDItRYvtv72cHYjgEySRDtmZ6iWZshlG5dhl-8b0IrV54im9IxSeR4qbQ6iOFYCRyyaZIYwjO_LX_rIYaamw7Yx3A3-bwSvFaqJ7NGNu_fqbOdS2WSil1TSr2G64iwa8o9_Cz5oU1EmTThK01_-lzYYkx1UwqE44JQRfQGn9zTv9mJLzeyDQt97Et6WwCNx-9yOXhs"
              }
            />
            <button className="absolute bottom-0 right-0 flex items-center justify-center size-8 bg-card-light dark:bg-card-dark rounded-full border border-border-light dark:border-border-dark hover:bg-background-light dark:hover:bg-background-dark">
              <MdOutlineCameraAlt className="!text-lg text-text-light-primary dark:text-text-dark-primary" />
            </button>
          </div>
          <div className="flex flex-col">
            <h2 className="text-xl font-bold text-text-light-primary dark:text-text-dark-primary">
              Ảnh đại diện
            </h2>
            <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
              Tải lên ảnh đại diện mới của bạn. Chúng tôi khuyến nghị ảnh có
              kích thước 200x200px.
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
          <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary"
              htmlFor="full-name"
            >
              Tên đầy đủ
            </label>
            <div className="relative">
              <input
                className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-2.5 text-sm text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary/70 dark:placeholder:text-text-dark-secondary/70 focus:ring-primary focus:border-primary pr-24"
                id="full-name"
                type="text"
                defaultValue="Tên người dùng"
                value={inputInfo.name}
              />
            </div>
          </div>
          {/* <div className="flex flex-col gap-1.5">
            <label
              className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary"
              htmlFor="dob"
            >
              Ngày sinh
            </label>
            <div className="relative">
              <input
                className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-2.5 text-sm text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary/70 dark:placeholder:text-text-dark-secondary/70 focus:ring-primary focus:border-primary pr-24"
                id="dob"
                type="date"
                defaultValue="1995-08-15"
              />
              <button className="absolute inset-y-0 right-0 flex items-center justify-center px-4 text-sm font-bold text-primary">
                Chỉnh sửa
              </button>
            </div>
          </div> */}
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary"
              htmlFor="email"
            >
              Địa chỉ email
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark rounded-lg p-2.5 text-sm text-text-light-secondary dark:text-text-dark-secondary cursor-not-allowed pr-28"
                disabled
                id="email"
                type="email"
                value={inputInfo.email}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                <div className="flex items-center gap-1 text-sm text-green-600 dark:text-green-400">
                  <FaCheckCircle className="!text-base" />
                  <span className="font-medium">Đã xác minh</span>
                </div>
              </div>
            </div>
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1 mt-1">
              <MdOutlineErrorOutline className="!text-sm" />
              Chưa xác minh
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary"
              htmlFor="phone"
            >
              Số điện thoại
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-2.5 text-sm text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary/70 dark:placeholder:text-text-dark-secondary/70 focus:ring-primary focus:border-primary pr-24"
                id="phone"
                type="tel"
                value={inputInfo.phone}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label
              className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary"
              htmlFor="address"
            >
              Địa chỉ
            </label>
            <div className="relative flex items-center">
              <input
                className="w-full bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark rounded-lg p-2.5 text-sm text-text-light-primary dark:text-text-dark-primary placeholder:text-text-light-secondary/70 dark:placeholder:text-text-dark-secondary/70 focus:ring-primary focus:border-primary pr-24"
                id="paddresse"
                type="text"
                value={inputInfo.address}
              />
            </div>
          </div>
          <div className="md:col-span-2 pt-6 border-t border-border-light dark:border-border-dark flex flex-col gap-4">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-col gap-1.5">
                <h3 className="text-lg font-bold text-text-light-primary dark:text-text-dark-primary">
                  Sổ địa chỉ
                </h3>
                <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                  Quản lý các địa chỉ giao hàng của bạn.
                </p>
              </div>
              <button className="flex min-w-[84px] cursor-pointer items-center justify-center gap-2 overflow-hidden rounded-lg h-10 px-4 bg-primary text-text-light-primary text-sm font-bold leading-normal tracking-[0.015em]">
                <IoMdAdd className="!text-xl" />
                <span className="truncate">Thêm địa chỉ mới</span>
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="border border-primary rounded-lg p-4 flex flex-col gap-3 relative bg-primary/5 dark:bg-primary/10">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <p className="text-base font-bold text-text-light-primary dark:text-text-dark-primary">
                      Tên người dùng
                    </p>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                      123 Đường ABC, Phường XYZ, Quận GHI, TP. Hồ Chí Minh
                    </p>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      0987654321
                    </p>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1">
                    <button className="flex items-center justify-center size-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-text-light-primary dark:text-text-dark-primary">
                      <MdOutlineEdit className="!text-xl" />
                    </button>
                    <button className="flex items-center justify-center size-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-red-500">
                      <RiDeleteBin6Line className="!text-xl" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-primary text-text-light-primary rounded-full text-xs font-medium">
                    Mặc định
                  </span>
                </div>
              </div>
              <div className="border border-border-light dark:border-border-dark rounded-lg p-4 flex flex-col gap-3">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex flex-col">
                    <p className="text-base font-bold text-text-light-primary dark:text-text-dark-primary">
                      Tên người dùng
                    </p>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary mt-1">
                      456 Đường DEF, Phường UVW, Quận KLM, TP. Hà Nội
                    </p>
                    <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary">
                      0123456789
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button className="flex items-center justify-center size-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-text-light-primary dark:text-text-dark-primary">
                      <MdOutlineEdit className="!text-xl" />
                    </button>
                    <button className="flex items-center justify-center size-8 rounded-full hover:bg-black/10 dark:hover:bg-white/10 text-red-500">
                      <RiDeleteBin6Line className="!text-xl" />
                    </button>
                  </div>
                </div>
                <button className="text-sm font-bold text-primary self-start">
                  Đặt làm mặc định
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-1.5 md:col-span-2 pt-6 border-t border-border-light dark:border-border-dark">
            <label
              className="text-sm font-medium text-text-light-primary dark:text-text-dark-primary"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <p className="text-sm text-text-light-secondary dark:text-text-dark-secondary flex-grow">
                ***********
              </p>
              <button className="flex w-full sm:w-auto min-w-[84px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 text-text-light-primary dark:text-text-dark-primary bg-transparent border border-border-light dark:border-border-dark hover:bg-black/5 dark:hover:bg-white/5 text-sm font-bold leading-normal tracking-[0.015em]">
                <span className="truncate">Đổi mật khẩu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Info;
