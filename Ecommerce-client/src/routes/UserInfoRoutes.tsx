import { Route, Routes } from "react-router-dom";

import UserInfoLayout from "../layout/UserInfoLayout";

import Info from "../pages/user_info/InfoPage";
import PointPage from "../pages/user_info/PointPage";
import OrderPage from "../pages/user_info/OrderPage";
import BankAccountpage from "../pages/user_info/BankAccountPage";

function UserInfoRoutes() {
  return (
    <Routes>
      <Route element={<UserInfoLayout />}>
        <Route path="/" element={<Info />} />
        <Route path="/order" element={<OrderPage />} />
        <Route path="/point" element={<PointPage />} />
        <Route path="/bank" element={<BankAccountpage />} />
      </Route>
    </Routes>
  );
}

export default UserInfoRoutes;
