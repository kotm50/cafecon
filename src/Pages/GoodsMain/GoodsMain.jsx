import { Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import MainCategory from "../../Components/MainCategory";

function GoodsMain() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  useEffect(() => {
    if (thisLocation.pathname === "/goods") navi("/goods/list");
    //eslint-disable-next-line
  }, [thisLocation]);
  return (
    <div className="w-full max-w-[1240px] mx-auto bg-white p-4 min-h-[calc(100vh-119px)]">
      <div className="mb-5 pb-5 border-b border-gray-100">
        <MainCategory />
      </div>
      <Outlet />
    </div>
  );
}

export default GoodsMain;
