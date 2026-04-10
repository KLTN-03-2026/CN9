import {
  MdOutlineExpandMore,
  MdOutlineFileDownload,
  MdOutlinePercent,
  MdPayments,
  MdPersonAddAlt1,
} from "react-icons/md";
import { FaRegCalendarAlt, FaShoppingBag } from "react-icons/fa";

import Header from "../../components/common/Header";
import Calendar from "../../components/common/Calendar";

import { useState } from "react";
import DonutChart from "../../components/report/DonutChart";
import InfoBoards from "../../components/common/InfoBoards";
import RevenueChart from "../../components/report/RevenueChart";

function ButtonForHeader() {
  const today = new Date();
  const [isShowCalendar, setIsShowCalendar] = useState<boolean>(false);

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <button
          className="flex items-center gap-2 pl-4 pr-3 py-2 text-sm font-medium rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark hover:bg-primary/10"
          onClick={() => setIsShowCalendar((prev) => !prev)}
        >
          <FaRegCalendarAlt className="text-lg" />
          <span>Tháng này</span>
          <MdOutlineExpandMore className="text-lg" />
        </button>
        <div
          className={`${isShowCalendar ? "" : "hidden "}absolute right-0 mt-2`}
        >
          <Calendar today={today} />
        </div>
      </div>
      <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg bg-primary text-background-dark hover:opacity-90">
        <MdOutlineFileDownload className="text-lg" />
        <span>Xuất báo cáo</span>
      </button>
    </div>
  );
}

function ReportPage() {
  return (
    <>
      <Header
        title="Báo cáo & thống kê"
        content="Xem tổng quan về hiệu suất cửa hàng của bạn"
        component={<ButtonForHeader />}
      />
      <div className="mt-2 grid grid-cols-12 gap-6">
        <div className="col-span-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <InfoBoards
            content="+12.5% so với tháng trước"
            title="Tổng doanh thu"
            value={"256000000đ"}
            icon={<MdPayments className="text-primary" />}
            trend="up"
          />
          <InfoBoards
            content="+8.2% so với tháng trước"
            title="Tổng số đơn hàng"
            value={1204}
            icon={<FaShoppingBag className="text-primary" />}
            trend="up"
          />
          <InfoBoards
            content="   -2.1% so với tháng trước"
            title="Khách hàng mới"
            value={152}
            icon={<MdPersonAddAlt1 className="text-primary" />}
            trend="down"
          />
          <InfoBoards
            content="+0.5% so với tháng trước"
            title="Tỷ lệ chuyển"
            value={"3.2%"}
            icon={<MdOutlinePercent className="text-primary" />}
            trend="up"
          />
        </div>
        <div className="col-span-12 lg:col-span-8 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
          <h3 className="text-lg font-bold">Biểu đồ doanh thu</h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Doanh thu trong 12 tháng qua
          </p>
          <RevenueChart />
        </div>
        <div className="col-span-12 lg:col-span-4 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
          <h3 className="text-lg font-bold">Danh mục bán chạy</h3>
          <p className="text-sm text-text-muted-light dark:text-text-muted-dark">
            Top 5 danh mục theo doanh thu
          </p>

          <div className="mt-4 flex h-[300px] items-center justify-center">
            <DonutChart />
          </div>
          <div className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
              <span className="text-sm font-medium">Mỹ phẩm</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-400"></div>
              <span className="text-sm font-medium">Thời trang</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-300"></div>
              <span className="text-sm font-medium">Điện tử</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-200"></div>
              <span className="text-sm font-medium">Gia dụng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full bg-green-100"></div>
              <span className="text-sm font-medium">Khác</span>
            </div>
          </div>
        </div>
        <div className="col-span-12 rounded-xl border border-border-light dark:border-border-dark p-6 bg-card-light dark:bg-card-dark">
          <h3 className="text-lg font-bold mb-4">Sản phẩm bán chạy nhất</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-border-light dark:border-border-dark text-text-muted-light dark:text-text-muted-dark">
                  <th className="py-3 px-4 font-medium">Sản phẩm</th>
                  <th className="py-3 px-4 font-medium">Danh mục</th>
                  <th className="py-3 px-4 font-medium">Số lượng bán</th>
                  <th className="py-3 px-4 font-medium">Doanh thu</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-border-light dark:border-border-dark">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC16B15iYWq2V0lOc7hANiWTccF3D-Q7en-Xh19i6vpfy-UsikHa4YB3QrZvUDuSE1XdObc9tpVTzvEFme0j5oSlLZUi-KMA_TBtNWqrlrXxYSrw75-2_uTfkRIbripxOfS1rrNv7agK_KOtIRG7PsZJJa-M4AVhnOB3upmL8dZwmhdB11XU3tu81YX1em78CN1k773iXIAZOee-vIUy5NbGxjSDjZ0lbMDBpnBMfd1iR1e3jZD8W5bMZiZnAERF4IVu4PJzUYTYUk"
                        alt=""
                        className="h-12 w-12 flex-shrink-0 rounded-lg bg-cover bg-center"
                      />
                      <div>
                        <p className="font-medium">Son môi</p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                          SKU: SM001
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">Mỹ phẩm</td>
                  <td className="py-3 px-4 font-medium">1,250</td>
                  <td className="py-3 px-4 font-medium">375.000.000đ</td>
                </tr>
                <tr className="border-b border-border-light dark:border-border-dark">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC16B15iYWq2V0lOc7hANiWTccF3D-Q7en-Xh19i6vpfy-UsikHa4YB3QrZvUDuSE1XdObc9tpVTzvEFme0j5oSlLZUi-KMA_TBtNWqrlrXxYSrw75-2_uTfkRIbripxOfS1rrNv7agK_KOtIRG7PsZJJa-M4AVhnOB3upmL8dZwmhdB11XU3tu81YX1em78CN1k773iXIAZOee-vIUy5NbGxjSDjZ0lbMDBpnBMfd1iR1e3jZD8W5bMZiZnAERF4IVu4PJzUYTYUk"
                        alt=""
                        className="h-12 w-12 flex-shrink-0 rounded-lg bg-cover bg-center"
                      />
                      <div>
                        <p className="font-medium">Áo thun nam</p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                          SKU: ATN012
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">Thời trang</td>
                  <td className="py-3 px-4 font-medium">980</td>
                  <td className="py-3 px-4 font-medium">196.000.000đ</td>
                </tr>
                <tr>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-4">
                      <img
                        src="https://lh3.googleusercontent.com/aida-public/AB6AXuC16B15iYWq2V0lOc7hANiWTccF3D-Q7en-Xh19i6vpfy-UsikHa4YB3QrZvUDuSE1XdObc9tpVTzvEFme0j5oSlLZUi-KMA_TBtNWqrlrXxYSrw75-2_uTfkRIbripxOfS1rrNv7agK_KOtIRG7PsZJJa-M4AVhnOB3upmL8dZwmhdB11XU3tu81YX1em78CN1k773iXIAZOee-vIUy5NbGxjSDjZ0lbMDBpnBMfd1iR1e3jZD8W5bMZiZnAERF4IVu4PJzUYTYUk"
                        alt=""
                        className="h-12 w-12 flex-shrink-0 rounded-lg bg-cover bg-center"
                      />
                      <div>
                        <p className="font-medium">Tai nghe không dây</p>
                        <p className="text-xs text-text-muted-light dark:text-text-muted-dark">
                          SKU: TWS-X5
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">Điện tử</td>
                  <td className="py-3 px-4 font-medium">720</td>
                  <td className="py-3 px-4 font-medium">540.000.000đ</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReportPage;
