import { Route, Routes } from "react-router-dom";

import MainLayout from "../layout/MainLayout/MainLayout";

import SalePage from "../pages/sale/SalePage";
import LoginPage from "../pages/login/LoginPage";
import OrderPage from "../pages/order/OrderPage";
import ReportPage from "../pages/report/ReportPage";
import StatusPage from "../pages/status/StatusPage";
import ReviewPage from "../pages/review/ReviewPage";
import SettingPage from "../pages/setting/SettingPage";
import ProductPage from "../pages/product/ProductPage";
import VoucherPage from "../pages/voucher/VoucherPage";
import CategoryPage from "../pages/category/CategoryPage";
import CustomerPage from "../pages/customer/CustomerPage";
import EmployeePage from "../pages/employee/EmployeePage";
import DashboardPage from "../pages/dashboard/DashboardPage";
import SizeGuidePage from "../pages/sizeguide/SizeGuidePage";
import PermissionPage from "../pages/permission/PermissionPage";

import OrderDetailPage from "../pages/order/OrderDetailPage";
import ProductVariantPage from "../pages/product/ProductVariantPage";
import CustomerDetailPage from "../pages/customer/CustomerDetailPage";
import PermissionFormPage from "../pages/permission/PermissionFormPage";

function MainRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/sales" element={<SalePage />} />
        <Route path="/login" element={<LoginPage />} />

        <Route path="/orders">
          <Route index element={<OrderPage />} />
          <Route path=":orderId" element={<OrderDetailPage />} />
        </Route>

        <Route path="/reports" element={<ReportPage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/statuses" element={<StatusPage />} />

        <Route path="/products">
          <Route index element={<ProductPage />} />
          <Route path=":id" element={<ProductVariantPage />} />
        </Route>

        <Route path="/sizes" element={<SizeGuidePage />} />

        <Route path="/settings" element={<SettingPage />} />
        <Route path="/vouchers" element={<VoucherPage />} />

        <Route path="/customers">
          <Route index element={<CustomerPage />} />
          <Route path=":id" element={<CustomerDetailPage />} />
        </Route>

        <Route path="/employees" element={<EmployeePage />} />
        <Route path="/categories" element={<CategoryPage />} />

        <Route path="/permissions">
          <Route index element={<PermissionPage />} />
          <Route path="add" element={<PermissionFormPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default MainRoutes;
