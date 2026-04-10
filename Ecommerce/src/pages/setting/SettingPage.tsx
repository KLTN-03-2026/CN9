import { MdOutlineLocalShipping, MdOutlineSpeed } from "react-icons/md";
import { IoMdAdd } from "react-icons/io";

import Header from "../../components/common/Header";

import RoleManage from "../../components/setting/role/RoleManage";
import PointMange from "../../components/setting/point/PointMange";
import PaymentMange from "../../components/setting/payment/PaymentMange";

function SettingPage() {
  return (
    <>
      <Header
        title="Cài đặt"
        content="Quản lý các cài đặt chung cho hệ thống của bạn"
      />
      <div className="mt-8 px-10 gap-8">
        <div className="m-auto flex flex-col gap-8">
          <section
            className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark"
            id="store-info"
          >
            <h2 className="text-lg font-bold">Thông tin cửa hàng</h2>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
              Cập nhật thông tin chi tiết về cửa hàng của bạn.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="col-span-2 flex items-center gap-6">
                <img
                  className="w-24 h-24 rounded-lg bg-center bg-no-repeat bg-cover flex-shrink-0"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBD3dOK_tOewsaN4HBLx8WCc3YTOXhMKZbdo2F7oqmv1dHY0pS6yKePRpsr9s4GQgvChRaIe2RTmLb0G4NDE6x7Oi14dG-_av5C1bHTkd7VuXMpxWTL06Hsqr1ePNbZN-kUuow-jZAGuHv4bXjA9OvHAu65dWxAXsonp4gB-QihjdCEBknPE2JprOY9YBedbL9yVil2syNoOmqnQqgU6lQJeb2vdf7Jy2JmsPmdOUpNtQgZZYO93J754w0cYd5GmAspDXsAntU9fcQ"
                  alt=""
                />
                <div className="flex flex-col gap-2">
                  <h3 className="font-medium">Logo cửa hàng</h3>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
                    Tải lên logo của bạn. Tệp PNG hoặc JPG, không quá 5MB.
                  </p>
                  <div className="flex gap-2 mt-2">
                    <button className="px-3 py-1.5 text-sm font-medium border border-border-light dark:border-border-dark rounded-md hover:bg-primary/10">
                      Thay đổi
                    </button>
                    <button className="px-3 py-1.5 text-sm font-medium text-danger hover:bg-danger/10 rounded-md">
                      Xóa
                    </button>
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Tên cửa hàng
                </label>
                <input
                  className="w-full pl-4 pr-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="store-name"
                  type="text"
                  value="E-Commerce Store"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Email hỗ trợ
                </label>
                <input
                  className="w-full pl-4 pr-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="store-email"
                  type="email"
                  value="support@example.com"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-2">
                  Địa chỉ
                </label>
                <input
                  className="w-full pl-4 pr-4 py-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark"
                  id="store-address"
                  type="text"
                  value="123 Đường ABC, Phường X, Quận Y, TP. Hồ Chí Minh"
                />
              </div>
            </div>
          </section>
          <PaymentMange />
          <PointMange />
          <RoleManage />
          <section
            className="bg-card-light dark:bg-card-dark p-6 rounded-xl border border-border-light dark:border-border-dark"
            id="security"
          >
            <h2 className="text-lg font-bold">Bảo mật</h2>
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
              Quản lý cài đặt bảo mật cho tài khoản của bạn.
            </p>
            <div className="mt-6 flex flex-col gap-6">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border border-border-light dark:border-border-dark rounded-lg">
                <div>
                  <h3 className="font-medium">Quản lý mật khẩu</h3>
                  <p className="text-sm text-text-muted-light dark:text-text-muted-dark mt-1">
                    Thay đổi mật khẩu của bạn để tăng cường bảo mật.
                  </p>
                </div>
                <button className="mt-3 md:mt-0 px-4 py-2 text-sm font-medium border border-border-light dark:border-border-dark rounded-lg hover:bg-primary/10">
                  Đổi mật khẩu
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}

export default SettingPage;
