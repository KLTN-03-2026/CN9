import { FaArrowRight, FaCheckCircle } from "react-icons/fa";
import { MdOutlineFileDownload, MdVisibility } from "react-icons/md";

import { Link, useLocation } from "react-router-dom";

import { formatMoneyString } from "../../utils/formatPrice";

function NotificationPage() {
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);

  const order = searchParams.get("order");
  const amount = searchParams.get("amount");
  const code = searchParams.get("code");
  const method = searchParams.get("method");

  return (
    <main className="flex-grow flex items-center justify-center p-6 md:p-12">
      <div className="max-w-[640px] w-full bg-white dark:bg-zinc-900 rounded-xl shadow-xl shadow-slate-200/50 dark:shadow-none overflow-hidden border border-slate-100 dark:border-zinc-800">
        <div className="pt-12 pb-8 flex flex-col items-center text-center px-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-6">
            <FaCheckCircle className="text-primary text-[60px]" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
            Thanh toán thành công!
          </h1>
          <p className="text-slate-500 dark:text-slate-400 max-w-sm">
            Cảm ơn bạn đã tin tưởng mua sắm tại cửa hàng của chúng tôi! Đơn hàng
            của bạn đang được xử lý.
          </p>
        </div>
        <div className="px-8 pb-8">
          <div className="bg-background-light dark:bg-zinc-800/50 rounded-lg p-6 border border-slate-100 dark:border-zinc-800">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-4">
              Chi tiết giao dịch
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 text-sm">
                  Mã đơn hàng
                </span>
                <span className="font-mono font-medium text-slate-900 dark:text-white">
                  {order}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 text-sm">
                  Số tiền đã thanh toán
                </span>
                <span className="font-bold text-lg text-primary">
                  {formatMoneyString(String(amount))}đ
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400 text-sm">
                  Phương thức thanh toán
                </span>
                <div className="flex items-center gap-2">
                  <span className="font-medium text-slate-900 dark:text-white">
                    {method}
                  </span>
                </div>
              </div>
              {code ? (
                <div className="flex justify-between items-center pt-4 border-t border-slate-200 dark:border-zinc-700">
                  <span className="text-slate-600 dark:text-slate-400 text-sm">
                    Mã giao dịch
                  </span>
                  <span className="font-medium text-slate-900 dark:text-white">
                    {code}
                  </span>
                </div>
              ) : (
                <></>
              )}
            </div>
          </div>
          <div className="mt-8 flex flex-col sm:flex-row gap-4">
            <a
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-slate-200 dark:border-zinc-700 hover:border-primary/50 dark:hover:border-primary/50 hover:bg-slate-50 dark:hover:bg-zinc-800 rounded-lg font-semibold transition-all group"
              href="#"
            >
              <MdVisibility className="text-[20px] group-hover:text-primary" />
              Xem chi tiết đơn hàng
            </a>
            <Link
              to={"/"}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-slate-900 hover:bg-primary/90 rounded-lg font-semibold shadow-lg shadow-primary/20 transition-all"
            >
              Tiếp tục mua sắm
              <FaArrowRight className="text-[20px]" />
            </Link>
          </div>
          <div className="mt-6 text-center">
            <button className="text-slate-400 dark:text-slate-500 text-sm hover:text-primary flex items-center justify-center gap-1 mx-auto transition-colors">
              <MdOutlineFileDownload className="text-[18px]" />
              Tải hóa đơn (PDF)
            </button>
          </div>
        </div>
        <div className="h-1.5 w-full bg-gradient-to-r from-primary/20 via-primary to-primary/20" />
      </div>
    </main>
  );
}

export default NotificationPage;
