import { useEffect } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminMain() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const login = useSelector(state => state.user);
  useEffect(() => {
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
      <div className="w-full max-w-[1240px] p-5 bg-white mx-auto">
        <div className="w-full flex justify-start gap-x-2 mb-5">
          <Link
            to={"/admin/pointlist"}
            className="p-2 text-center bg-gray-200 border border-gray-500 hover:bg-opacity-50"
          >
            포인트내역
          </Link>
          <Link
            to={"/admin/userlist"}
            className="p-2 text-center bg-gray-200 border border-gray-500 hover:bg-opacity-50"
          >
            회원 목록
          </Link>
        </div>
        <Outlet />
      </div>
    </>
  );
}

export default AdminMain;
