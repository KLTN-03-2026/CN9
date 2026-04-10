import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

import { formatMoneyString } from "../../utils/formatPrice";

import {
  selectFinalTotal,
  selectOriginalTotal,
  selectPointDiscount,
  selectSubTotalAfterSale,
  selectVoucherDiscount,
} from "../../redux/order/orderSelector";

import { MdOutlineStars } from "react-icons/md";

import { getAllPointRules } from "../../api/pointApi";
import { getVoucherByCode } from "../../api/voucherApi";

import {
  setInfo,
  setPoint,
  setVoucherForOrder,
} from "../../redux/order/orderSlice";

import type { RootState } from "../../redux/store/store";

import type { PointType } from "../../type/PointType";

function DeliveryInfoPage() {
  const [dataPointRules, setDataPointRules] = useState<PointType[]>([]);

  const order = useSelector((state: RootState) => state.order);
  const user = useSelector((state: RootState) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const finalTotal = useSelector(selectFinalTotal);
  const originalTotal = useSelector(selectOriginalTotal);
  const saleTotal = useSelector(selectSubTotalAfterSale);
  const pointDiscount = useSelector(selectPointDiscount);
  const voucherDiscount = useSelector(selectVoucherDiscount);

  const [input, setInput] = useState<{
    name: string;
    email: string;
    phone: string;
    address: string;
    voucher: string;
    point: number;
  }>({ point: 0, voucher: "", address: "", email: "", name: "", phone: "" });

  const [errors, setErrors] = useState<
    Partial<Record<keyof typeof input, string>>
  >({});

  const getDataPointRules = async () => {
    try {
      const resPointRules = await getAllPointRules();
      setDataPointRules(resPointRules.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVoucherByCode = async (code: string, total: number) => {
    try {
      const resVoucher = await getVoucherByCode(code, total);
      dispatch(setVoucherForOrder(resVoucher.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handlePointRule = (point: number) => {
    const getValuePoint = dataPointRules.find(
      (pointR) => pointR.point === Number(point),
    );

    if (!getValuePoint) return;

    dispatch(
      setPoint({
        type: getValuePoint?.discount_type!,
        value: getValuePoint?.discount_value!,
      }),
    );
  };

  function handleInputChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.name == "point") {
      if ((user.user?.points || 0) < Number(e.target.value)) {
        setInput((prev) => ({ ...prev, point: 0 }));
      } else {
        setInput((prev) => ({ ...prev, point: Number(e.target.value) }));
      }
    } else {
      setInput((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    }
  }

  function handleSubmitInfo() {
    const newErrors: Partial<typeof errors> = {};

    if (!input.name) {
      newErrors.name = "Vui lòng nhập tên của người nhận";
    }

    if (!input.email) {
      newErrors.email = "Vui lòng nhập email của người nhận";
    }

    if (!input.phone) {
      newErrors.phone = "Vui lòng nhập số điện thoại của người nhận";
    }

    if (!input.address) {
      newErrors.address = "Vui lòng chọn vai trò của người nhận";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    dispatch(
      setInfo({
        email: input.email,
        fullName: input.name,
        phone: input.phone,
        shippingAddress: input.address,
      }),
    );
    navigate("/payment/pay");
  }

  useEffect(() => {
    getDataPointRules();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3 lg:gap-16">
      {/* Left Column: Form */}
      <div className="lg:col-span-2">
        <p className="text-3xl font-black leading-tight tracking-tight">
          Thông tin giao hàng
        </p>
        <div className="mt-8 space-y-6">
          <div className="grid grid-cols-1 gap-x-6 gap-y-6 sm:grid-cols-2">
            <label className="flex flex-col">
              <p className="pb-2 text-sm font-medium">Họ và tên</p>
              <input
                className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-surface-light p-3 text-sm font-normal placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark"
                placeholder="Nhập họ tên đầy đủ"
                name="name"
                onChange={handleInputChange}
                value={input.name}
              />
              <p className="text-red-500 font-medium">{errors.name}</p>
            </label>
            <label className="flex flex-col">
              <p className="pb-2 text-sm font-medium">Số điện thoại</p>
              <input
                className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-surface-light p-3 text-sm font-normal placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark"
                placeholder="Nhập số điện thoại"
                name="phone"
                onChange={handleInputChange}
                value={input.phone}
              />
              <p className="text-red-500 font-medium">{errors.phone}</p>
            </label>
          </div>
          <label className="flex flex-col">
            <p className="pb-2 text-sm font-medium">Địa chỉ Email</p>
            <input
              className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-surface-light p-3 text-sm font-normal placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark"
              placeholder="example@email.com"
              type="email"
              name="email"
              onChange={handleInputChange}
              value={input.email}
            />
            <p className="text-red-500 font-medium">{errors.email}</p>
          </label>
          <label className="flex flex-col">
            <p className="pb-2 text-sm font-medium">Địa chỉ chi tiết</p>
            <input
              className="form-input flex h-12 w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg border border-border-light bg-surface-light p-3 text-sm font-normal placeholder:text-gray-400 focus:border-primary focus:outline-0 focus:ring-2 focus:ring-primary/20 dark:border-border-dark dark:bg-surface-dark"
              placeholder="Số nhà, tên đường, Phường/Xã, Quận/Huyện, Tỉnh/Thành phố"
              name="address"
              onChange={handleInputChange}
              value={input.address}
            />
            <p className="text-red-500 font-medium">{errors.address}</p>
          </label>
          <div className="flex items-center justify-end border-t border-border-light pt-6 dark:border-border-dark">
            <button
              onClick={() => {
                handleSubmitInfo();
              }}
              className="flex h-12 cursor-pointer items-center justify-center overflow-hidden rounded-lg bg-primary px-8 text-base font-bold text-white transition-all hover:bg-primary/90"
            >
              Tiếp tục đến thanh toán
            </button>
          </div>
        </div>
      </div>
      <div className="lg:col-span-1">
        <div className="sticky top-28">
          <div className="rounded-xl border border-border-light dark:border-border-dark bg-card-light dark:bg-card-dark p-6">
            <h2 className="text-xl font-bold mb-6">Tóm tắt đơn hàng</h2>
            <div className="space-y-4">
              {order.items.map((i) => {
                const totalPrice = i.price * i.quantity;
                return (
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <img
                        className="h-16 w-16 rounded-lg object-cover"
                        data-alt={i.name}
                        src={i.image_url}
                      />
                      <span className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary/60 text-sm font-bold">
                        {i.quantity}
                      </span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{i.name}</p>
                      <p className="text-sm text-subtle-light dark:text-subtle-dark">
                        Size: {i.size}
                      </p>
                      <p className="text-sm text-subtle-light dark:text-subtle-dark">
                        Màu: {i.color}
                      </p>
                    </div>
                    <p className="font-semibold">
                      {formatMoneyString(
                        String(
                          i.sale
                            ? i.sale.discount_type === "fixed"
                              ? totalPrice - i.sale.discount_value
                              : totalPrice -
                                totalPrice * (i.sale.discount_value / 100)
                            : totalPrice,
                        ),
                      )}
                      ₫
                    </p>
                  </div>
                );
              })}
            </div>
            <div className="my-6 h-px bg-border-light dark:bg-border-dark" />
            <div className="space-y-6">
              <div>
                <p className="text-sm font-bold mb-3">Mã Voucher</p>
                <div className="flex gap-2">
                  <input
                    className="form-input flex w-full flex-1 rounded-lg text-text-light dark:text-text-dark focus:outline-0 focus:ring-2 focus:ring-primary/50 border border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark h-11 placeholder:text-subtle-light dark:placeholder:text-subtle-dark px-4 text-sm"
                    placeholder="Nhập mã voucher"
                    type="text"
                    name="voucher"
                    value={input.voucher}
                    onChange={handleInputChange}
                  />
                  <button
                    onClick={() =>
                      handleVoucherByCode(input.voucher, originalTotal)
                    }
                    className="flex h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-background-dark hover:opacity-90 transition-opacity"
                  >
                    Áp dụng
                  </button>
                </div>
              </div>
              <div className="bg-primary/5 dark:bg-primary/10 rounded-lg p-4 border border-primary/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MdOutlineStars className="text-primary" size={30} />
                    <div>
                      <p className="text-sm font-bold">Dùng điểm tích lũy</p>
                      <p className="text-xs text-subtle-light dark:text-subtle-dark">
                        Bạn có{" "}
                        <span className="text-primary font-bold">
                          {user.user?.points}
                        </span>{" "}
                        điểm
                      </p>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <input
                    className="form-input w-24 rounded-lg text-xs text-text-light dark:text-text-dark border border-border-light dark:border-border-dark bg-white dark:bg-card-dark h-8 px-2"
                    placeholder="Số điểm"
                    type="number"
                    name="point"
                    value={input.point}
                    onChange={handleInputChange}
                  />
                  <button
                    onClick={() => {
                      handlePointRule(input.point);
                    }}
                    className="flex h-7 items-center justify-center rounded-lg bg-primary px-4 text-sm font-bold text-background-dark hover:opacity-90 transition-opacity"
                  >
                    Áp dụng
                  </button>
                </div>
                <div className="mt-4 pt-3 border-t border-primary/10 space-y-1">
                  {dataPointRules.map((pointR) => {
                    return (
                      <p className="text-[11px] text-subtle-light/70 dark:text-subtle-dark/50 flex items-start gap-1.5">
                        <span className="mt-1 block h-1 w-1 shrink-0 rounded-full bg-subtle-light/40" />
                        {pointR.point} điểm ={" "}
                        {pointR.discount_type === "fixed"
                          ? formatMoneyString(String(pointR.discount_value)) +
                            "đ"
                          : pointR.discount_value + "%"}
                      </p>
                    );
                  })}
                </div>
              </div>
            </div>
            <div className="my-6 h-px bg-border-light dark:bg-border-dark" />
            <div className="space-y-3 text-base">
              <div className="flex justify-between">
                <span className="text-subtle-light dark:text-subtle-dark">
                  Tạm tính
                </span>
                <span className="font-medium">
                  {formatMoneyString(String(saleTotal))}₫
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-subtle-light dark:text-subtle-dark">
                  Phí vận chuyển
                </span>
                <span className="font-medium">0₫</span>
              </div>
              <div className="flex justify-between text-primary">
                <span className="text-subtle-light dark:text-subtle-dark">
                  Giảm giá voucher
                </span>
                <span className="font-medium">
                  -{formatMoneyString(String(voucherDiscount))}₫
                </span>
              </div>
              <div className="flex justify-between text-primary">
                <span className="text-subtle-light dark:text-subtle-dark">
                  Điểm tích lũy
                </span>
                <span className="font-medium">
                  -{formatMoneyString(String(pointDiscount))}₫
                </span>
              </div>
            </div>
            <div className="my-6 h-px bg-border-light dark:bg-border-dark" />
            <div className="flex justify-between items-center">
              <span className="text-lg font-bold">Tổng cộng</span>
              <span className="text-2xl font-black tracking-tight">
                {formatMoneyString(String(finalTotal))}₫
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryInfoPage;
