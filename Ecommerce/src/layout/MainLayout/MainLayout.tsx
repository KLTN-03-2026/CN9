import { Outlet, useLocation } from "react-router-dom";
import SidebarLeft from "./SidebarLeft";

function MainLayout() {
  const location = useLocation();

  const noLayoutRoutes = ["/login", "/register", "/forgot-password"];

  const hideLayout = noLayoutRoutes.includes(location.pathname);

  return (
    <div className="flex h-full bg-background-light">
      {!hideLayout && (
        <div className={`flex-[2] bg-white border-r relative`}>
          <SidebarLeft />
        </div>
      )}
      <div className={`flex-[8] p-8`}>
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;
