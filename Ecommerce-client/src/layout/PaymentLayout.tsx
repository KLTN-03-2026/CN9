import { Outlet, useLocation } from "react-router-dom";

import HeaderPay from "./header_pay/HeaderPay";

function PaymentLayout() {
  const location = useLocation();

  const noLayoutRoutes = ["/payment/notification"];

  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <div className="container p-10 ">
      {!hideLayout && <HeaderPay />}
      <div className="mr-20 ml-20">
        <Outlet />
      </div>
    </div>
  );
}

export default PaymentLayout;
