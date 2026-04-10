import { VoucherType } from "../../types/VoucherType";

import { useToast } from "../../hook/useToast";

import { toggleVoucherActive } from "../../api/voucherApi";

import ToggleActiveButton from "../common/ToggleActiveButton";
import ButtonIconEdit from "../common/ButtonIconEdit";
import ButtonIconDelete from "../common/ButtonIconDelete";

import React from "react";

interface VoucherListProps {
  dataVouchers: VoucherType[];
  onReloadVoucher: () => void;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIdVoucher: React.Dispatch<React.SetStateAction<number | null>>;
}

function VoucherList({
  dataVouchers,
  setIdVoucher,
  setIsOpenModal,
  onReloadVoucher,
}: VoucherListProps) {
  const { showToast } = useToast();

  const STATUS_UI = {
    active: {
      label: "Đang hoạt động",
      className: "bg-success/10 text-success",
    },
    used_up: {
      label: "Hết lượt",
      className: "bg-warning/10 text-warning",
    },
    expired: {
      label: "Đã hết hạn",
      className: "bg-danger/10 text-danger",
    },
    inactive: {
      label: "Chưa hoạt động",
      className: "bg-gray-200 text-gray-600",
    },
  };

  const getVoucherStatus = (voucher: VoucherType) => {
    const now = new Date();

    if (!voucher.isActive) return "inactive";

    if (voucher.start_date && now < new Date(voucher.start_date)) {
      return "inactive";
    }

    if (voucher.end_date && now > new Date(voucher.end_date)) {
      return "expired";
    }

    if (
      voucher.usage_limit != null &&
      voucher.usedCount >= voucher.usage_limit
    ) {
      return "used_up";
    }

    return "active";
  };

  const handleToggleVoucherActive = async (id: number, isActive: boolean) => {
    try {
      await toggleVoucherActive(id, { isActive });
      showToast(
        isActive ? "Mở khóa sale thành công" : "Khóa sale thành công",
        "success",
      );
      onReloadVoucher();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-text-muted-light dark:text-text-muted-dark uppercase bg-background-light dark:bg-background-dark">
          <tr>
            <th className="px-6 py-3" scope="col">
              Mã Voucher
            </th>
            <th className="px-4 py-3" scope="col">
              Giá trị đơn hàng
            </th>
            <th className="px-6 py-3 text-center" scope="col">
              Giá trị
            </th>
            <th className="px-4 py-3" scope="col">
              Số lượng
            </th>
            <th className="px-4 py-3" scope="col">
              Ngày bắt đầu
            </th>
            <th className="px-4 py-3" scope="col">
              Ngày kết thúc
            </th>
            <th className="px-6 py-3 text-center" scope="col">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-center" scope="col">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {dataVouchers.map((voucher) => {
            const formatMoneyString = (value: string) =>
              Number(value).toLocaleString("vi-VN");

            const config = STATUS_UI[getVoucherStatus(voucher)];

            return (
              <tr className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {voucher.code}
                </td>
                <td className="px-6 py-4">
                  {formatMoneyString(String(voucher.min_order_value))} đ
                </td>
                <td className="px-6 py-4">
                  {formatMoneyString(String(voucher.discount_value))}
                  {voucher.discount_type === "fixed" ? "đ" : "%"}
                </td>
                <td className="px-6 py-4">
                  {voucher.usedCount}/{voucher.usage_limit}
                </td>
                <td className="px-6 py-4">
                  {new Date(voucher.start_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4">
                  {new Date(voucher.end_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
                  >
                    {config.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <ToggleActiveButton
                      isActive={voucher.isActive}
                      onToggle={() =>
                        handleToggleVoucherActive(voucher.id, !voucher.isActive)
                      }
                    />
                    <ButtonIconEdit
                      onClick={() => {
                        setIdVoucher(voucher.id);
                        setIsOpenModal(true);
                      }}
                    />
                    <ButtonIconDelete />
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

export default VoucherList;
