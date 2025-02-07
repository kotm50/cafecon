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
      <div
        className={`${
          site === "login" || site === "join" || site === "find"
            ? ""
            : "w-full max-w-[1240px] mx-auto min-h-[calc(100vh-121px)]"
        }`}
      >
        {site !== "login" && site !== "join" && site !== "find" ? (
          <div className="mb-5 pb-5 border-b  p-4 bg-white border-gray-100">
            <MypageMenu path={thisLocation.pathname.split("/")[2]} />
          </div>
        ) : null}
        <Outlet />
      </div>
    </>
  );
}

export default UserMain;
