import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet";
import MypageMenu from "../../Components/MypageMenu";

function UserMain() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  const [title, setTitle] = useState("마이페이지");
  const [site, setSite] = useState("");
  useEffect(() => {
    if (thisLocation.pathname === "/user") navi("/user/login");
    const path = thisLocation.pathname.split("/")[2];
    if (path === "mypage") setTitle("마이페이지");
    setSite(path);
    //eslint-disable-next-line
  }, [thisLocation]);
  return (
    <>
      <Helmet>
        <title>{title} | 카페콘</title>
      </Helmet>
      {site !== "login" && site !== "join" ? <MypageMenu /> : null}
      <Outlet />
    </>
  );
}

export default UserMain;
