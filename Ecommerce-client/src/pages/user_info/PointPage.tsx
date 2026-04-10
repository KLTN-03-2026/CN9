import { FaRegCheckCircle } from "react-icons/fa";
import { MdWorkspacePremium } from "react-icons/md";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store/store";

function PointPage() {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-wrap justify-between gap-3 p-4">
        <div className="flex min-w-72 flex-col gap-2">
          <h1 className="text-text-light-primary dark:text-text-dark-primary text-3xl md:text-4xl font-black leading-tight tracking-[-0.033em]">
            Điểm tích lũy
          </h1>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-base font-normal leading-normal">
            Theo dõi và quản lý điểm thưởng của bạn.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm flex flex-col items-center justify-center text-center">
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm font-medium">
            Tổng điểm hiện có
          </p>
          <div className="flex items-center gap-2 mt-2">
            <MdWorkspacePremium className="!text-4xl text-primary" />
            <p className="text-4xl font-black text-text-light-primary dark:text-text-dark-primary">
              {user?.points}
            </p>
          </div>
          {/* <p className="text-text-light-secondary dark:text-text-dark-secondary text-xs mt-2">
            Điểm sẽ hết hạn vào 31/12/2024
          </p> */}
        </div>
        <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm">
          <h3 className="text-text-light-primary dark:text-text-dark-primary text-lg font-bold">
            Quy đổi điểm thưởng
          </h3>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-1">
            Sử dụng điểm của bạn để nhận các ưu đãi độc quyền.
          </p>
          <ul className="mt-4 space-y-2 text-sm text-text-light-primary dark:text-text-dark-primary">
            <li className="flex items-center gap-2">
              <FaRegCheckCircle className="text-primary !text-xl" />
              <span>100 điểm = Giảm 10,000đ cho đơn hàng.</span>
            </li>
            <li className="flex items-center gap-2">
              <FaRegCheckCircle className="text-primary !text-xl" />
              <span>500 điểm = Miễn phí vận chuyển.</span>
            </li>
            <li className="flex items-center gap-2">
              <FaRegCheckCircle className="text-primary !text-xl" />
              <span>1000 điểm = Voucher giảm giá 15%.</span>
            </li>
          </ul>
          <button className="flex min-w-[120px] w-full sm:w-auto mt-4 cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-primary text-text-light-primary text-sm font-bold leading-normal tracking-[0.015em]">
            <span className="truncate">Đổi thưởng ngay</span>
          </button>
        </div>
      </div>
      <div className="bg-card-light dark:bg-card-dark rounded-xl p-6 shadow-sm">
        <div className="pb-4 border-b border-border-light dark:border-border-dark mb-4">
          <h2 className="text-text-light-primary dark:text-text-dark-primary text-xl font-bold">
            Lịch sử giao dịch điểm
          </h2>
          <p className="text-text-light-secondary dark:text-text-dark-secondary text-sm mt-1">
            Theo dõi chi tiết các giao dịch tích và tiêu điểm của bạn.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-text-light-secondary dark:text-text-dark-secondary text-xs font-medium uppercase border-b border-border-light dark:border-border-dark">
                <th className="py-3 pr-4 font-semibold">Ngày</th>
                <th className="py-3 px-4 font-semibold">Mô tả</th>
                <th className="py-3 px-4 font-semibold text-right">Thay đổi</th>
                <th className="py-3 pl-4 font-semibold text-right">
                  Tổng điểm
                </th>
              </tr>
            </thead>
            <tbody className="text-text-light-primary dark:text-text-dark-primary text-sm">
              <tr className="border-b border-border-light dark:border-border-dark">
                <td className="py-4 pr-4">25/07/2024</td>
                <td className="py-4 px-4">Tích điểm từ đơn hàng #12345</td>
                <td className="py-4 px-4 text-right font-medium text-green-600 dark:text-green-400">
                  +150
                </td>
                <td className="py-4 pl-4 text-right font-semibold">1,250</td>
              </tr>
              <tr className="border-b border-border-light dark:border-border-dark">
                <td className="py-4 pr-4">15/07/2024</td>
                <td className="py-4 px-4">Sử dụng điểm cho đơn hàng #12300</td>
                <td className="py-4 px-4 text-right font-medium text-red-600 dark:text-red-400">
                  -500
                </td>
                <td className="py-4 pl-4 text-right font-semibold">1,100</td>
              </tr>
              <tr className="border-b border-border-light dark:border-border-dark">
                <td className="py-4 pr-4">10/07/2024</td>
                <td className="py-4 px-4">Tích điểm từ đơn hàng #12250</td>
                <td className="py-4 px-4 text-right font-medium text-green-600 dark:text-green-400">
                  +600
                </td>
                <td className="py-4 pl-4 text-right font-semibold">1,600</td>
              </tr>
              <tr className="border-b border-border-light dark:border-border-dark">
                <td className="py-4 pr-4">01/07/2024</td>
                <td className="py-4 px-4">Điểm thưởng đăng ký thành viên</td>
                <td className="py-4 px-4 text-right font-medium text-green-600 dark:text-green-400">
                  +1000
                </td>
                <td className="py-4 pl-4 text-right font-semibold">1,000</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="flex justify-center pt-6">
          <button className="flex cursor-pointer items-center justify-center overflow-hidden rounded-lg h-10 px-4 bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light-primary dark:text-text-dark-primary text-sm font-bold leading-normal tracking-[0.015em] hover:bg-black/5 dark:hover:bg-white/5">
            <span className="truncate">Xem thêm</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default PointPage;
