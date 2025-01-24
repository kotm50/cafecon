import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminMain() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);
  useEffect(() => {
    if (thisLocation.pathname === "/admin") {
      navi("/admin/userlist");
    }
    console.log(login.role);
    // eslint-disable-next-line
  }, [thisLocation]);
  return <Outlet />;
}

export default AdminMain;
