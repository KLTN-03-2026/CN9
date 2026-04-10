import { Route, Routes } from "react-router-dom";

import PaymentLayout from "../layout/PaymentLayout";

import PayPage from "../pages/payment/PayPage";
import OrderConfirmPage from "../pages/order/OrderConfirmPage";
import DeliveryInfoPage from "../pages/order/DeliveryInfoPage";
import NotificationPage from "../pages/payment/NotificationPage";

function PaymentRoutes() {
  return (
    <Routes>
      <Route element={<PaymentLayout />}>
        <Route path="/pay" element={<PayPage />} />
        <Route path="/" element={<DeliveryInfoPage />} />
        <Route path="/confirm" element={<OrderConfirmPage />} />
        <Route path="/notification" element={<NotificationPage />} />
      </Route>
    </Routes>
  );
}

export default PaymentRoutes;
