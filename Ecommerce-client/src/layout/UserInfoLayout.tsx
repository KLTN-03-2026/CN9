import { Outlet } from "react-router-dom";
import SideBarLeftForUser from "./sidebar_Left/SideBarLeftForUser";

function UserInfoLayout() {
  return (
    <div className="container grid grid-cols-1 lg:grid-cols-12 gap-10">
      <div className="lg:col-span-3">
        <SideBarLeftForUser />
      </div>
      <div className="lg:col-span-9">
        <Outlet />
      </div>
    </div>
  );
}

export default UserInfoLayout;
