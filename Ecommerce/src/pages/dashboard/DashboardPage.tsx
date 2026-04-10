import Header from "../../components/common/Header";
import Calendar from "../../components/common/Calendar";
import InfoBoards from "../../components/common/InfoBoards";

import RecentOrders from "../../components/dashboard/RecentOrders";
import RevenueTrend from "../../components/dashboard/RevenueTrend";
import ButtonForHeader from "../../components/dashboard/ButtonForHeader";
import TopSellingProducts from "../../components/dashboard/TopSellingProducts";

import { useSelector } from "react-redux";
import { useEffect, useState } from "react";

import { RootState } from "../../redux/auth/authStore";

import { FaShoppingBag } from "react-icons/fa";
import { MdPayments, MdPersonAddAlt1 } from "react-icons/md";

import { DashboardData, TrendType } from "../../types/DashboardType";

import { getTotalUsers } from "../../api/userApi";
import { getTotalOrders } from "../../api/orderApi";
import { getRevenue } from "../../api/paymentApi";
import { getDailyReportsByDay } from "../../api/dailyReportApi";

import { formatMoneyString } from "../../utils/formatPrice";
import ReviewApproval from "../../components/dashboard/ReviewApproval";

function DashboardPage() {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState<Date>(today);

  const account = useSelector((state: RootState) => state.auth.user);

  const [dataDashboard, setDataDashboard] = useState<DashboardData>({
    revenue: {
      title: "Doanh thu hôm nay",
      value: 0,
      growth: 0,
      icon: <MdPayments className="text-primary" />,
      trend: "natural",
      type: "currency",
    },
    orders: {
      title: "Tổng số đơn hàng",
      value: 0,
      growth: 0,
      icon: <FaShoppingBag className="text-primary" />,
      trend: "natural",
      type: "number",
    },
    users: {
      title: "Người dùng mới",
      value: 0,
      growth: 0,
      icon: <MdPersonAddAlt1 className="text-primary" />,
      trend: "natural",
      type: "number",
    },
  });

  const calcTrend = (curr: number, prev: number): TrendType =>
    curr > prev ? "up" : curr < prev ? "down" : "natural";

  const handleDataDashboard = async (date: Date = selectedDate) => {
    try {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const [resOrder, resPayment, resUser, resDailyByDay] = await Promise.all([
        getTotalOrders({
          day,
          month,
          year,
        }),
        getRevenue({
          day,
          month,
          year,
        }),
        getTotalUsers({
          day,
          month,
          year,
        }),

        getDailyReportsByDay(day),
      ]);

      setDataDashboard((prev) => ({
        orders: {
          ...prev.orders,
          value: resOrder.data,
          growth: resDailyByDay.data?.totalOrders
            ? ((resOrder.data - resDailyByDay.data.totalOrders) /
                resDailyByDay.data.totalOrders) *
              100
            : 0,
          trend: calcTrend(
            resOrder.data,
            resDailyByDay.data?.totalOrders ?? resOrder.data,
          ),
        },
        revenue: {
          ...prev.revenue,
          value: resPayment.data,
          growth: resDailyByDay.data?.totalRevenue
            ? ((resPayment.data - resDailyByDay.data.totalRevenue) /
                resDailyByDay.data.totalRevenue) *
              100
            : 0,
          trend: calcTrend(
            resPayment.data,
            resDailyByDay.data?.totalRevenue ?? resPayment.data,
          ),
        },
        users: {
          ...prev.users,
          value: resUser.data,
          growth: resDailyByDay.data?.totalUsers
            ? ((resUser.data - resDailyByDay.data.totalUsers) /
                resDailyByDay.data.totalUsers) *
              100
            : 0,
          trend: calcTrend(
            resUser.data,
            resDailyByDay.data?.totalUsers ?? resUser.data,
          ),
        },
      }));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleDataDashboard(selectedDate);
  }, [selectedDate]);

  return (
    <>
      <Header
        title="Bảng điều khiển"
        content={`Chào mừng trở lại, ${account?.username}!`}
        component={<ButtonForHeader />}
      />
      <div className="mt-8 grid grid-cols-12 gap-8">
        <div className="col-span-12 lg:col-span-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            <InfoBoards
              title={`Doanh thu hôm nay`}
              content={dataDashboard.revenue.growth + "% so với hôm qua"}
              value={formatMoneyString(String(dataDashboard.revenue.value))}
              icon={dataDashboard.revenue.icon}
              trend={dataDashboard.revenue.trend}
              type={dataDashboard.revenue.type}
            />
            <InfoBoards
              title={`Tổng số đơn hàng hôm nay`}
              content={dataDashboard.orders.growth + "% so với hôm qua"}
              value={dataDashboard.orders.value}
              icon={dataDashboard.orders.icon}
              trend={dataDashboard.orders.trend}
              type={dataDashboard.orders.type}
            />
            <InfoBoards
              title={`Người dùng mới hôm nay`}
              content={dataDashboard.users.growth + "% so với hôm qua"}
              value={dataDashboard.users.value}
              icon={dataDashboard.users.icon}
              trend={dataDashboard.users.trend}
              type={dataDashboard.users.type}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
            <RevenueTrend selectedDate={selectedDate} />
            <TopSellingProducts />
          </div>
          <RecentOrders />
        </div>
        <div className="col-span-12 lg:col-span-4">
          <Calendar
            today={today}
            onSelectDate={(date) => setSelectedDate(date)}
          />
          <ReviewApproval />
        </div>
      </div>
    </>
  );
}

export default DashboardPage;
