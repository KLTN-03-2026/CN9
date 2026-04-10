import { IoMdAdd } from "react-icons/io";
import { IoSearchSharp } from "react-icons/io5";
import Header from "../../components/common/Header";
import OrderList from "../../components/order/OrderList";
import { useNavigate } from "react-router-dom";
import Button from "../../components/common/Button";
import OrderCreateForm from "../../components/order/OrderCreateForm";
import { useState } from "react";
import SearchInput from "../../components/common/SearchInput";

function OrderPage() {
  const navigate = useNavigate();

  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <>
      <Header title="Đơn hàng" content="Quản lý tất cả đơn hàng" />
      <div className="mt-8">
        <div className="bg-card-light dark:bg-card-dark rounded-xl border border-border-light dark:border-border-dark">
          <div className="p-6 border-b border-border-light dark:border-border-dark">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <SearchInput
                value=""
                placeholder="Tìm kiếm đơn hàng..."
                onChange={() => {}}
              />
              <div className="flex items-center gap-2">
                <select className="p-2 rounded-lg bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm">
                  <option>Tất cả trạng thái</option>
                  <option>Chờ xử lý</option>
                  <option>Đang giao</option>
                  <option>Hoàn thành</option>
                  <option>Đã hủy</option>
                </select>
                <Button
                  title="Tạo đơn hàng"
                  icon={<IoMdAdd className="text-lg" />}
                  onClick={() => setIsOpenModal((prev) => !prev)}
                />
              </div>
            </div>
          </div>
          <OrderList />
          <div className="p-6 flex items-center justify-between">
            <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
              Hiển thị 1-8 trên 125 đơn hàng
            </p>
            <div className="flex items-center gap-2">
              <button className="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/20 text-sm font-medium">
                Trước
              </button>
              <button className="px-3 py-1.5 rounded-lg border border-border-light dark:border-border-dark hover:bg-primary/20 text-sm font-medium">
                Sau
              </button>
            </div>
          </div>
        </div>
      </div>
      <OrderCreateForm
        isOpenModal={isOpenModal}
        setIsOpenModal={setIsOpenModal}
      />
    </>
  );
}
export default OrderPage;
