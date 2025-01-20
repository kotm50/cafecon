import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function UserMain() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  useEffect(() => {
    if (thisLocation.pathname === "/user") navi("/user/login");
    //eslint-disable-next-line
  }, [thisLocation]);
  return <Outlet />;
}

export default UserMain;
