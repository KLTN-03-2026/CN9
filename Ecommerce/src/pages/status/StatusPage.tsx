import { IoMdAdd } from "react-icons/io";
import { MdInventory2, MdLocalShipping } from "react-icons/md";

import Button from "../../components/common/Button";
import HeaderPage from "../../components/common/Header";

import { useState } from "react";

import OrderOrProductForm from "../../components/status/OrderOrProductForm";
import OrderOrProductList from "../../components/status/OrderOrProductList";

function StatusPage() {
  const [activeTypeStatus, setActiveTypeStatus] = useState<"product" | "order">(
    "product",
  );

  const [isOpenModal, setIsOpenModal] = useState(false);

  return (
    <>
      <HeaderPage
        content="Quản lý Trạng thái"
        title="Quản trị tập trung các loại trạng thái cho Sản phẩm và Đơn hàng."
        component={
          <Button
            title="Thêm trạng thái mới"
            onClick={() => {
              setIsOpenModal(true);
            }}
            icon={<IoMdAdd size={18} />}
          />
        }
      />
      <div className="flex border-b border-slate-200 dark:border-slate-800 mt-2">
        <button
          onClick={() => setActiveTypeStatus("product")}
          className={`px-6 py-3 border-b-2 ${activeTypeStatus === "product" ? "border-primary text-slate-900 dark:text-white font-bold" : "border-transparent text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-300"} text-sm flex items-center gap-2 transition-colors`}
        >
          <MdInventory2 className="text-xl" />
          Trạng thái Sản phẩm
        </button>
        <button
          onClick={() => setActiveTypeStatus("order")}
          className={`px-6 py-3 border-b-2 ${activeTypeStatus === "order" ? "border-primary text-slate-900 dark:text-white font-bold" : "border-transparent text-slate-500 dark:text-slate-400 font-medium hover:text-slate-700 dark:hover:text-slate-300"}  text-sm flex items-center gap-2 transition-colors`}
        >
          <MdLocalShipping className="text-xl" />
          Trạng thái Đơn hàng
        </button>
      </div>
      <OrderOrProductList activeTypeStatus={activeTypeStatus} />
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/30 rounded-xl">
          <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider mb-1">
            Tổng sản phẩm Sẵn hàng
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-emerald-500">
            1,240
          </h3>
        </div>
        <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/30 rounded-xl">
          <p className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">
            Cần nhập thêm ngay
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-amber-500">
            12
          </h3>
        </div>
        <div className="p-4 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl">
          <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
            Loại trạng thái khả dụng
          </p>
          <h3 className="text-2xl font-black text-slate-900 dark:text-slate-300">
            04
          </h3>
        </div>
      </div>
      <OrderOrProductForm
        activeTypeStatus={activeTypeStatus}
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </>
  );
}

export default StatusPage;
