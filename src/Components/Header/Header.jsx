import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useLocation, useNavigate } from "react-router-dom";
import SearchArea from "../SearchArea";
import Modal from "../Modal";
import { useLogout } from "../../Api/Api";

function Header() {
  const logout = useLogout();
  const navi = useNavigate();
  const login = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [modalOn, setModalOn] = useState(false);
  const [modalType, setModalType] = useState("");
  const [headType, setHeadType] = useState("goods");

  useEffect(() => {
    getHeadType(thisLocation.pathname);
  }, [thisLocation]);

  const getHeadType = p => {
    if (p.split("/")[2] === "join") {
      setHeadType("");
    } else {
      const path = p.split("/")[1];
      setHeadType(path);
    }
  };
  return (
    <>
      {headType === "goods" ? (
        <>
          <header className="w-full border-b bg-white">
            <div className="w-full max-w-[1240px] mx-auto">
              <h1 className="text-center">
                <button
                  className="p-2 w-fit ppbold text-4xl text-amber-900"
                  onClick={() => navi("/")}
                >
                  카페콘닷컴
                </button>
              </h1>
              <div className="w-full flex justify-between pb-4">
                <SearchArea />
                <div className="flex justify-end gap-x-2">
                  {login.userId ? (
                    <>
                      <div className="p-2 flex justify-start gap-x-2">
                        <div>{login.managerName}님</div>
                        <div>
                          <span className="font-extra text-indigo-600">
                            {!isNaN(login.point)
                              ? login.point.toLocaleString()
                              : 0}
                          </span>
                          P 보유중
                        </div>
                      </div>
                      <button
                        onClick={() => logout()}
                        className="px-4 py-2 bg-success hover:bg-opacity-80 text-white rounded-lg"
                      >
                        로그아웃
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => navi("/user/login")}
                        className="px-4 py-2 bg-green-600 hover:bg-opacity-80 text-white rounded-lg"
                      >
                        로그인
                      </button>
                      <button
                        onClick={() => navi("/user/join")}
                        className="px-4 py-2 bg-gray-600 hover:bg-opacity-80 text-white rounded-lg"
                      >
                        회원가입
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </header>

          <Modal
            modalOn={modalOn}
            setModalOn={setModalOn}
            modalType={modalType}
            setModalType={setModalType}
          />
        </>
      ) : headType === "user" ? (
        <>
          <header className="w-full border-b bg-white">
            <div className="w-full max-w-[1240px] mx-auto">
              <h1 className="text-center">
                <button
                  className="p-2 w-fit ppbold text-4xl text-amber-900"
                  onClick={() => navi("/")}
                >
                  카페콘닷컴
                </button>
              </h1>
              <div className="w-full flex justify-start gap-x-4 pb-4">
                <Link
                  to="/"
                  className="hover:bg-warning py-2 px-4 rounded-full"
                >
                  마이페이지
                </Link>
              </div>
            </div>
          </header>

          <Modal
            modalOn={modalOn}
            setModalOn={setModalOn}
            modalType={modalType}
            setModalType={setModalType}
          />
        </>
      ) : null}
    </>
  );
}

export default Header;
