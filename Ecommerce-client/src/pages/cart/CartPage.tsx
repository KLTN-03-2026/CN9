import { useSelector } from "react-redux";

import CartList from "../../components/cart/CartList";
import type { RootState } from "../../redux/store/store";

function CartPage() {
  const cart = useSelector((state: RootState) => state.cart);

  return (
    <div className="layout-content-container flex flex-col flex-1 container">
      <div className="flex flex-wrap justify-between items-center gap-3 pb-6">
        <p className="text-3xl font-black leading-tight tracking-[-0.033em] min-w-72">
          Giỏ hàng của bạn ({cart.totalQuantity} sản phẩm)
        </p>
        <button className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-100 dark:bg-gray-800 text-sm font-bold leading-normal tracking-[0.015em]">
          <span className="truncate">Tiếp tục mua sắm</span>
        </button>
      </div>
      <CartList dataCart={cart} />
    </div>
  );
}

export default CartPage;
