import { Outlet, useLocation } from "react-router-dom";
import Header from "./header/Header";
import Footer from "./footer/Footer";

function MainLayout() {
  const location = useLocation();

  const noLayoutRoutes = ["/login", "/register", "/forgot-password"];
  const hideFooterRoutes = ["/chatAI"];

  const hideLayout = noLayoutRoutes.includes(location.pathname);
  const hideFooter = hideFooterRoutes.includes(location.pathname);

  return (
    <div>
      {!hideLayout && <Header />}
      <div className="pt-8 pb-2 bg-background-light">
        <Outlet />
      </div>
      {!hideLayout && !hideFooter && <Footer />}
    </div>
  );
}

export default MainLayout;
