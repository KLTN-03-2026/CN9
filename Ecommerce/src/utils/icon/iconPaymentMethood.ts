import { IconType } from "react-icons";
import { BsFillPhoneFill } from "react-icons/bs";
import { FaRegCreditCard } from "react-icons/fa6";
import { MdAccountBalance, MdOutlinePayments } from "react-icons/md";

export type PaymentMethoodKey = "COD" | "BANK_TRANSFER" | "VNPAY" | "MOMO";

export const iconForPaymentMethood: Record<PaymentMethoodKey, IconType> = {
  COD: MdOutlinePayments,
  BANK_TRANSFER: MdAccountBalance,
  VNPAY: FaRegCreditCard,
  MOMO: BsFillPhoneFill,
};
