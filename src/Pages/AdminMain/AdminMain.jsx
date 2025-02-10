import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminMain() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);
  useEffect(() => {
    console.log(thisLocation.pathname.split("/")[1]);
    if (thisLocation.pathname === "/admin") {
      navi("/admin/userlist");
    }
    if (login.role !== "ADMIN") {
      alert("관리자만 이용 가능합니다");
      navi("/");
    }
    // eslint-disable-next-line
  }, [thisLocation]);
  return (
    <>
      <div className="lg:hidden bg-white w-screen h-screen fixed top-0 left-0 z-[999999]">
        <div className="absolute w-full top-1/2 -translate-y-1/2 text-center">
          모바일 관리자페이지는 준비중 입니다 <br />
          PC에서 접속해주세요
          <br />
          <br />
          <button
            className="text-indigo-600 border-b border-indigo-600"
            onClick={() => navi("/")}
          >
            메인으로
          </button>
        </div>
      </div>
      <div className="hidden lg:block w-full max-w-[1240px] p-5 bg-white mx-auto">
        <div className="w-full flex justify-start gap-x-2 mb-5">
          <Link
            to={"/admin/pointlist"}
            className={`p-2 text-center  border border-gray-500 hover:bg-opacity-50 ${
              thisLocation.pathname.split("/")[2] === "pointlist"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            포인트내역
          </Link>
          <Link
            to={"/admin/userlist"}
            className={`p-2 text-center  border border-gray-500 hover:bg-opacity-50 ${
              thisLocation.pathname.split("/")[2] === "userlist"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            회원 목록
          </Link>
          <Link
            to={"/admin/goodsList"}
            className={`p-2 text-center  border border-gray-500 hover:bg-opacity-50 ${
              thisLocation.pathname.split("/")[2] === "userlist"
                ? "bg-blue-500 text-white"
                : "bg-gray-200"
            }`}
          >
            상품목록
          </Link>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default AdminMain;
