import { FiShoppingCart } from "react-icons/fi";
import { RiDeleteBin6Line } from "react-icons/ri";

import {
  decreaseQuantity,
  increaseQuantity,
  removeItem,
  setVoucher,
  toggleAll,
  toggleItem,
  type CartItem,
  type CartState,
} from "../../redux/cart/cartSlice";

import { formatMoneyString } from "../../utils/formatPrice";

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  selectOriginalTotal,
  selectTotalDiscount,
  selectTotalPrice,
} from "../../redux/cart/cartselector";

import { getVoucherByCode } from "../../api/voucherApi";
import { useNavigate } from "react-router-dom";
import { setOrderItem, setSubmitting, setVoucherForOrder } from "../../redux/order/orderSlice";
import {
  decreaseQuantityForCart,
  increaseQuantityForCart,
  removeProductToCart,
} from "../../api/cartApi";

interface CartListProps {
  dataCart: CartState;
}

function CartList({ dataCart }: CartListProps) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAllChecked =
    dataCart.items.length > 0 && dataCart.items.every((item) => item.isChecked);

  const totalPrice = useSelector(selectTotalPrice);
  const totalDiscount = useSelector(selectTotalDiscount);
  const originalTotal = useSelector(selectOriginalTotal);

  const [inputVoucher, setInputVoucher] = useState<string>("");

  const handleGetVoucherByCode = async (code: string, total: number) => {
    try {
      const resVoucher = await getVoucherByCode(code, total);
      dispatch(setVoucher(resVoucher.data));
      dispatch(setVoucherForOrder(resVoucher.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleSutmitOrder = () => {
    const selectedItems = dataCart.items.filter((item) => item.isChecked);

    if (selectedItems.length === 0) {
      alert("Vui lòng chọn sản phẩm để thanh toán");
      return;
    }

    dispatch(setSubmitting(true));

    dispatch(setOrderItem(selectedItems));
    navigate("/payment");
  };

  const handleIncreraseQuantity = async (cart: CartItem) => {
    dispatch(increaseQuantity(cart.variantId));
    await increaseQuantityForCart(cart.variantId);
  };
  const handleDecreaseQuantity = async (cart: CartItem) => {
    dispatch(decreaseQuantity(cart.variantId));
    await decreaseQuantityForCart(cart.variantId);
  };

  const handleDeleteProductToCart = async (cart: CartItem) => {
    dispatch(removeItem(cart.variantId));
    await removeProductToCart(cart.variantId);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <div className="hidden sm:grid grid-cols-12 gap-4 uppercase text-xs font-bold text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2 px-4">
          <div className="col-span-6 flex items-center gap-4">
            <input
              className="form-checkbox h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary dark:text-primary-dark focus:ring-primary/50 dark:focus:ring-primary-dark/50 bg-gray-100 dark:bg-gray-700"
              type="checkbox"
              checked={isAllChecked}
              onChange={(e) => dispatch(toggleAll(e.target.checked))}
            />
            <label htmlFor="select-all">Chọn tất cả</label>
          </div>
          <span className="col-span-2 text-right">Giá</span>
          <span className="col-span-2 text-center">Số lượng</span>
          <span className="col-span-2 text-right">Tạm tính</span>
        </div>
        {dataCart.items.length !== 0 ? (
          dataCart.items.map((cart) => {
            return (
              <div className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center bg-white dark:bg-gray-800/50 p-4 rounded-xl shadow-sm">
                <div className="flex items-center gap-4 col-span-12 sm:col-span-6 w-full">
                  <input
                    className="form-checkbox h-5 w-5 rounded border-gray-300 dark:border-gray-600 text-primary dark:text-primary-dark focus:ring-primary/50 dark:focus:ring-primary-dark/50 bg-gray-100 dark:bg-gray-700"
                    type="checkbox"
                    checked={cart.isChecked}
                    onChange={() => dispatch(toggleItem(cart.variantId))}
                  />
                  <img
                    src={cart.image_url}
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-lg size-16 sm:size-20 flex-shrink-0"
                    alt=""
                  />
                  <div className="flex flex-1 flex-col justify-center">
                    <p className="font-medium leading-normal">{cart.name}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-sm font-normal leading-normal">
                      Màu: {cart.color}, Size: {cart.size}
                    </p>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-2 w-full text-right sm:text-right">
                  <span className="sm:hidden text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                    Giá:
                  </span>
                  {cart.sale ? (
                    <span className="line-through mr-2">
                      {formatMoneyString(String(cart.price))}
                    </span>
                  ) : (
                    <></>
                  )}
                  <span className="text-primary">
                    {formatMoneyString(
                      String(
                        cart.sale && cart.price
                          ? cart.sale.discount_type === "fixed"
                            ? cart.price - cart.sale.discount_value
                            : cart.price -
                              cart.price * (cart.sale.discount_value / 100)
                          : cart.price,
                      ),
                    )}
                    đ
                  </span>
                </div>
                <div className="col-span-12 sm:col-span-2 w-full flex justify-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleDecreaseQuantity(cart)}
                      className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 cursor-pointer"
                    >
                      -
                    </button>
                    <input
                      className="text-base font-medium leading-normal w-8 p-0 text-center bg-transparent focus:outline-0 focus:ring-0 focus:border-none border-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                      type="number"
                      value={cart.quantity}
                    />
                    <button
                      onClick={() => handleIncreraseQuantity(cart)}
                      className="text-base font-medium leading-normal flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-700 cursor-pointer"
                    >
                      +
                    </button>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-2 w-full text-right font-bold">
                  <span className="sm:hidden text-xs font-bold uppercase text-gray-500 dark:text-gray-400">
                    Tạm tính:
                  </span>
                  <span>
                    {formatMoneyString(String(cart.quantity * cart.price))}đ
                  </span>
                </div>
                <div className="col-span-12 sm:col-span-12 text-right -mt-2">
                  <button
                    onClick={() => handleDeleteProductToCart(cart)}
                    className="text-red-500 hover:text-red-700 dark:hover:text-red-400 text-sm font-medium flex items-center gap-1 ml-auto"
                  >
                    <RiDeleteBin6Line className="text-base" />
                    Xóa
                  </button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-20">
            <FiShoppingCart className="m-auto text-6xl text-gray-300 dark:text-gray-600" />
            <h2 className="mt-4 text-2xl font-bold">
              Giỏ hàng của bạn đang trống
            </h2>
            <p className="mt-2 text-gray-500 dark:text-gray-400">
              Trông có vẻ như bạn chưa thêm sản phẩm nào vào giỏ hàng.
            </p>
            <button
              onClick={() => navigate("/collections")}
              className="mt-6 flex mx-auto max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-6 bg-primary text-black text-base font-bold leading-normal tracking-[0.015em]"
            >
              <span className="truncate">Bắt đầu mua sắm</span>
            </button>
          </div>
        )}
      </div>
      <div className="lg:col-span-1">
        <div className="bg-white dark:bg-gray-800/50 p-6 rounded-xl shadow-sm sticky top-8">
          <h3 className="text-lg font-bold border-b border-gray-200 dark:border-gray-700 pb-3 mb-4">
            Tóm tắt đơn hàng
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Tạm tính</span>
              <span>{formatMoneyString(String(originalTotal))}đ</span>
            </div>
            <div className="flex justify-between text-sm">
              <span>Giảm giá</span>
              <span>-{formatMoneyString(String(totalDiscount))}đ</span>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-700 mt-4 pt-4">
            <div className="flex justify-between font-bold text-lg">
              <span>Tổng cộng</span>
              <span>{formatMoneyString(String(totalPrice))}đ</span>
            </div>
          </div>
          <div className="mt-6">
            <label className="text-sm font-medium" htmlFor="promo-code">
              Mã voucher
            </label>
            <div className="flex gap-2 mt-1">
              <input
                className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-gray-800 dark:text-gray-200 focus:outline-0 focus:ring-1 focus:ring-primary/50 border-gray-300 dark:border-gray-600 bg-transparent h-10 placeholder:text-gray-400 dark:placeholder:text-gray-500 px-3 text-sm"
                id="promo-code"
                placeholder="Nhập mã ở đây"
                value={inputVoucher}
                onChange={(e) => setInputVoucher(e.target.value)}
              />
              <button
                onClick={() => handleGetVoucherByCode(inputVoucher, totalPrice)}
                className="flex min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-gray-200 dark:bg-gray-700 text-sm font-bold leading-normal tracking-[0.015em]"
              >
                <span className="truncate">Áp dụng</span>
              </button>
            </div>
          </div>
          <button
            onClick={() => handleSutmitOrder()}
            className="w-full mt-6 flex max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-xl h-12 px-4 bg-primary text-black text-base font-bold leading-normal tracking-[0.015em]"
          >
            <span className="truncate">Tiến hành thanh toán</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CartList;
