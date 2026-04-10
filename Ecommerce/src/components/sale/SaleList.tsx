import { useToast } from "../../hook/useToast";

import { SaleType } from "../../types/SaleType";

import { toggleSaleActive } from "../../api/saleApi";

import ToggleActiveButton from "../common/ToggleActiveButton";
import ButtonIconEdit from "../common/ButtonIconEdit";
import ButtonIconDelete from "../common/ButtonIconDelete";

interface SaleListProps {
  dataSales: SaleType[];
  onReloadSale: () => void;
  setIsOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  setIdSale: React.Dispatch<React.SetStateAction<number | null>>;
}

function SaleList({
  dataSales,
  setIdSale,
  onReloadSale,
  setIsOpenModal,
}: SaleListProps) {
  const { showToast } = useToast();

  const STATUS_UI = {
    active: {
      label: "Đang hoạt động",
      className: "bg-success/10 text-success",
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

  const getSaleStatus = (voucher: SaleType) => {
    const now = new Date();

    if (!voucher.isActive) return "inactive";

    if (voucher.start_date && now < new Date(voucher.start_date)) {
      return "inactive";
    }

    if (voucher.end_date && now > new Date(voucher.end_date)) {
      return "expired";
    }

    return "active";
  };

  const handleToggleSaleActive = async (id: number, isActive: boolean) => {
    try {
      await toggleSaleActive(id, { isActive });
      showToast(
        isActive ? "Mở khóa sale thành công" : "Khóa sale thành công",
        "success",
      );
      onReloadSale();
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
              Mã Sale
            </th>
            <th className="px-6 py-3" scope="col">
              Giá trị
            </th>
            <th className="px-6 py-3" scope="col">
              Ngày bắt đầu
            </th>
            <th className="px-6 py-3" scope="col">
              Ngày kết thúc
            </th>
            <th className="px-6 py-3" scope="col">
              Trạng thái
            </th>
            <th className="px-6 py-3" scope="col">
              Hành động
            </th>
          </tr>
        </thead>
        <tbody>
          {dataSales.map((sale) => {
            const formatMoneyString = (value: string) =>
              Number(value).toLocaleString("vi-VN");

            const config = STATUS_UI[getSaleStatus(sale)];

            return (
              <tr className="bg-card-light dark:bg-card-dark border-b border-border-light dark:border-border-dark">
                <td className="px-6 py-4 font-medium whitespace-nowrap">
                  {sale.name}
                </td>

                <td className="px-6 py-4">
                  {formatMoneyString(String(sale.discount_value))}
                  {sale.discount_type === "fixed" ? "đ" : "%"}
                </td>

                <td className="px-6 py-4">
                  {new Date(sale.start_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4">
                  {new Date(sale.end_date).toLocaleDateString("vi-VN")}
                </td>
                <td className="px-6 py-4">
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.className}`}
                  >
                    {config.label}
                  </span>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-start gap-2">
                    <ToggleActiveButton
                      isActive={sale.isActive}
                      onToggle={() =>
                        handleToggleSaleActive(sale.id, !sale.isActive)
                      }
                    />
                    <ButtonIconEdit
                      onClick={() => {
                        setIdSale(sale.id);
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

export default SaleList;
