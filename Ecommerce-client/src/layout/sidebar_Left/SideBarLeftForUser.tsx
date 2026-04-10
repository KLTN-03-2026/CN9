import { IoPersonOutline, IoSettingsOutline } from "react-icons/io5";
import {
  MdLocalShipping,
  MdOutlineAccountBalance,
  MdOutlineWorkspacePremium,
} from "react-icons/md";
import { IoIosHelpCircleOutline } from "react-icons/io";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { logoutUser } from "../../api/userApi";
import type { RootState } from "../../redux/store/store";


function SideBarLeftForUser() {
  const user = useSelector((state: RootState) => state.auth);

  const location = useLocation();

  const navigate = useNavigate();

  const handleLogoutUser = async () => {
    try {
      const resUser = await logoutUser();
      console.log(resUser);
      navigate("/login");
    } catch (error) {
      // showToast("Đăng xuất lỗi", "error");
    }
  };

  const menuItems = [
    {
      path: "/info",
      label: "Thông tin cá nhân",
      icon: IoPersonOutline,
      active: true,
    },
    {
      path: "/info/order",
      label: "Quản lý đơn hàng",
      icon: MdLocalShipping,
    },
    {
      path: "/info/point",
      label: "Điểm tích lũy",
      icon: MdOutlineWorkspacePremium,
    },
    {
      path: "/info/bank",
      label: "Tài khoản ngân hàng",
      icon: MdOutlineAccountBalance,
    },
  ];

  return (
    <div className="sticky top-8 flex h-full min-h-[700px] flex-col justify-between rounded-xl bg-card-light dark:bg-card-dark p-4 shadow-sm">
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 items-center">
          <img
            src={
              user.user?.avatar ||
              "https://lh3.googleusercontent.com/aida-public/AB6AXuA5mo65JZvjKp6Szj-9f6BMvLAMW89ZuWAlR7dfbBBRLzLgk-3ui66PriRFoPiKVS1Ie7mLTCDItRYvtv72cHYjgEySRDtmZ6iWZshlG5dhl-8b0IrV54im9IxSeR4qbQ6iOFYCRyyaZIYwjO_LX_rIYaamw7Yx3A3-bwSvFaqJ7NGNu_fqbOdS2WSil1TSr2G64iwa8o9_Cz5oU1EmTThK01_-lzYYkx1UwqE44JQRfQGn9zTv9mJLzeyDQt97Et6WwCNx-9yOXhs"
            }
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-12"
          />
          <div className="flex flex-col">
            <h1 className="text-text-light-primary dark:text-text-dark-primary text-base font-bold leading-normal">
              {user.user?.username}
            </h1>
            <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-normal leading-normal">
              {user.user?.email}
            </p>
          </div>
        </div>
        <div className="flex flex-col gap-2 pt-4">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg ${isActive ? "bg-primary/20 text-text-light-primary dark:text-text-dark-primary" : "hover:bg-black/5 dark:hover:bg-white/5"} `}
              >
                <Icon className="!text-2xl text-text-light-primary dark:text-text-dark-primary" />
                <p className="text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal">
                  {item.label}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
          <IoSettingsOutline className="!text-2xl text-text-light-primary dark:text-text-dark-primary" />
          <p className="text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal">
            Cài đặt
          </p>
        </a>
        <a className="flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/5 dark:hover:bg-white/5">
          <IoIosHelpCircleOutline className="!text-2xl text-text-light-primary dark:text-text-dark-primary" />
          <p className="text-text-light-primary dark:text-text-dark-primary text-sm font-medium leading-normal">
            Trợ giúp
          </p>
        </a>
        <button
          onClick={() => handleLogoutUser()}
          className="flex min-w-[84px] w-full mt-4 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-11 px-4 bg-primary text-text-light-primary text-sm font-bold leading-normal tracking-[0.015em]"
        >
          <span className="truncate">Đăng xuất</span>
        </button>
      </div>
    </div>
  );
}

export default SideBarLeftForUser;
