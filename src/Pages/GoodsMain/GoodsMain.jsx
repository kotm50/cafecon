import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function GoodsMain() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  useEffect(() => {
    if (thisLocation.pathname === "/goods") navi("/goods/list");
    //eslint-disable-next-line
  }, [thisLocation]);
  return <Outlet />;
}

export default GoodsMain;
