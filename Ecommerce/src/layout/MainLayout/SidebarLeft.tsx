import logo from "../../assets/imgs/$40 (3).avif";

import {
  MdBadge,
  MdLogout,
  MdDashboard,
  MdOutlineSettings,
  MdOutlineBarChart,
  MdOutlineInventory2,
  MdConfirmationNumber,
  MdOutlineToggleOn,
  MdCategory,
} from "react-icons/md";
import { LuShoppingCart } from "react-icons/lu";
import { FaRulerHorizontal, FaTag, FaUserGroup } from "react-icons/fa6";
import { IoStar } from "react-icons/io5";
import { FaUnlockAlt } from "react-icons/fa";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { RootState } from "../../redux/auth/authStore";

import { useToast } from "../../hook/useToast";

import { logoutUser } from "../../api/authApi";

function SidebarLeft() {
  const user = useSelector((state: RootState) => state.auth.user);

  const { showToast } = useToast();

  const navigate = useNavigate();

  const handleLogoutUser = async () => {
    try {
      const resUser = await logoutUser();
      console.log(resUser);
      navigate("/login");
    } catch (error) {
      showToast("Đăng xuất lỗi", "error");
    }
  };

  const menuItems = [
    {
      path: "/",
      label: "Tổng quan",
      icon: MdDashboard,
      active: true,
    },
    {
      path: "/orders",
      label: "Đơn hàng",
      icon: LuShoppingCart,
    },
    {
      path: "/products",
      label: "Sản phẩm",
      icon: MdOutlineInventory2,
    },
    {
      path: "/customers",
      label: "Khách hàng",
      icon: FaUserGroup,
    },
    {
      path: "/employees",
      label: "Nhân viên",
      icon: MdBadge,
    },
    {
      path: "/categories",
      label: "Thể loại",
      icon: MdCategory,
    },
    {
      path: "/reviews",
      label: "Đánh giá",
      icon: IoStar,
    },
    {
      path: "/sales",
      label: "Sale",
      icon: FaTag,
    },
    {
      path: "/vouchers",
      label: "Voucher",
      icon: MdConfirmationNumber,
    },
    {
      path: "/statuses",
      label: "Trạng thái",
      icon: MdOutlineToggleOn,
    },
    {
      path: "/permissions",
      label: "Quyền",
      icon: FaUnlockAlt,
    },
    {
      path: "/sizes",
      label: "Kích cỡ",
      icon: FaRulerHorizontal,
    },
    // {
    //   path: "/reports",
    //   label: "Báo cáo",
    //   icon: MdOutlineBarChart,
    // },
    {
      path: "/settings",
      label: "Cài đặt",
      icon: MdOutlineSettings,
    },
  ];

  const location = useLocation();

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="ml-6">
        <div className="flex items-center text-xl font-inter mt-6">
          <img src={logo} alt="" style={{ width: 50 }} />
          <span className="font-bold ml-2">E-Commerce</span>
        </div>
        <div className="mt-10">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              location.pathname === item.path ||
              location.pathname.startsWith(item.path + "/");

            return (
              <Link key={item.path} to={item.path}>
                <div
                  className={`flex items-center p-3 mr-8 rounded-lg cursor-pointer mb-2
              ${
                isActive
                  ? "bg-primary/20 text-text-light"
                  : "text-text-muted-light hover:text-text-light hover:bg-primary/20"
              }`}
                >
                  <Icon size={20} className="mr-4" />
                  <span className="text-lg">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
      <div className="flex flex-col gap-2 ml-6 mb-2 mt-10">
        <div className="flex gap-3 items-center border-t border-border-light dark:border-border-dark pt-4">
          <img
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuBxrLoqLFpB8QTbz10BVp9re0BgLeyMwDeAjg9-_dH3WOgLIBoSKfyY6XVIYlIaLDrkNHW8dHWnGOQZ_MMaDyRiND99aciTEdfiH7MdNJhxUJYiwWRXMpcSDHN16X0EDwWsVIi6DU6AwBJyipuRJHgoU9NS5nI_ZCLYqkgGkT5zT-64PaTPELwUWnxFmwr3hM1KFbK7JOi3BrggcA5vwxRptag4PFN97bznwZNDJ9ToxOTRdbcRoeHa1SISxPn9iIDMsZEHTG6fBAY"
            alt=""
            className="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          />
          <div className="flex flex-col">
            <h1 className="text-base font-medium">{user?.username}</h1>
            <p className="text-text-muted-light dark:text-text-muted-dark text-sm font-normal">
              {user?.role}
            </p>
          </div>
        </div>
        <button
          className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-primary/20 text-text-muted-light dark:text-text-muted-dark hover:text-text-light dark:hover:text-text-dark mr-2"
          onClick={() => {
            handleLogoutUser();
          }}
        >
          <MdLogout />
          <p className="text-sm font-medium">Đăng xuất</p>
        </button>
      </div>
    </div>
  );
}

export default SidebarLeft;
