import { FaCheck, FaRegCreditCard } from "react-icons/fa";
import { MdOutlineLocalShipping, MdOutlineTaskAlt } from "react-icons/md";
import { useLocation } from "react-router-dom";

function HeaderPay() {
  const location = useLocation();
  const path = location.pathname;

  const layoutRoutes = ["/payment", "/payment/pay", "/payment/confirm"];

  const checkInfo = path === layoutRoutes.at(0);
  const checkPay = path === layoutRoutes.at(1);
  const checkConfirm = path === layoutRoutes.at(2);

  return (
    <div className="flex items-center justify-between mb-12 max-w-4xl m-auto">
      <div className="flex flex-col items-center text-center">
        {checkPay || checkConfirm ? (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-2">
            <FaCheck className="text-primary" />
          </div>
        ) : (
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full ${
              checkInfo
                ? "bg-primary/20 dark:bg-primary/30 mb-2 border-2 border-primary"
                : "bg-slate-200 dark:bg-slate-800 mb-2"
            }`}
          >
            <MdOutlineLocalShipping
              className={`text-2xl ${
                checkInfo
                  ? "text-primary"
                  : "text-slate-500 dark:text-slate-500"
              }`}
            />
          </div>
        )}
        <span
          className={`text-sm ${
            checkInfo
              ? "font-bold text-primary"
              : "font-medium text-slate-600 dark:text-slate-400"
          }`}
        >
          Thông tin giao hàng
        </span>
      </div>
      <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700 mx-4" />
      <div className="flex flex-col items-center text-center">
        {checkConfirm ? (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 mb-2">
            <FaCheck className="text-primary" />
          </div>
        ) : (
          <div
            className={`w-12 h-12 flex items-center justify-center rounded-full ${
              checkPay
                ? "bg-primary/20 dark:bg-primary/30 mb-2 border-2 border-primary"
                : "bg-slate-200 dark:bg-slate-800 mb-2"
            }`}
          >
            <FaRegCreditCard
              className={`text-2xl ${
                checkPay ? "text-primary" : "text-slate-500 dark:text-slate-500"
              }`}
            />
          </div>
        )}
        <span
          className={`text-sm ${
            checkPay
              ? "font-bold text-primary"
              : "font-medium text-slate-600 dark:text-slate-400"
          }`}
        >
          Thanh toán
        </span>
      </div>
      <div className="flex-grow h-px bg-slate-200 dark:bg-slate-700 mx-4" />
      <div className="flex flex-col items-center text-center">
        {checkConfirm ? (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-primary/20 dark:bg-primary/30 mb-2 border-2 border-primary">
            <MdOutlineTaskAlt className="text-2xl text-primary" />
          </div>
        ) : (
          <div className="w-12 h-12 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 mb-2">
            <MdOutlineTaskAlt className="text-2xl text-slate-500 dark:text-slate-500" />
          </div>
        )}
        <span
          className={`text-sm ${
            checkConfirm
              ? "font-bold text-primary"
              : "font-medium text-slate-600 dark:text-slate-400"
          }`}
        >
          Xác nhận
        </span>
      </div>
    </div>
  );
}

export default HeaderPay;
