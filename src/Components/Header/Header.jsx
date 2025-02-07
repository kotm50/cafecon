// Header
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SearchArea from "../SearchArea";
import Modal from "../Modal";
import { kyApi, useLogout } from "../../Api/Api";
import { loginUser } from "../../Reducer/userSlice";
import { FaUser } from "react-icons/fa";

function Header() {
  const logout = useLogout();
  const navi = useNavigate();
  const login = useSelector(state => state.user);
  const dispatch = useDispatch();
  const thisLocation = useLocation();
  const [modalOn, setModalOn] = useState(false);
  const [modalType, setModalType] = useState("");
  const [headType, setHeadType] = useState("goods");
  const [limit, setLimit] = useState(null);

  useEffect(() => {
    getHeadType(thisLocation.pathname);
    if (login.userId) {
      getLimitandPoint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisLocation, login.userId]);

  useEffect(() => {
    if (login.userId) {
      if (limit === 0) {
        logout();
        setLimit(null);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [limit]);

  useEffect(() => {
    if (limit === 0) return; // limit이 0이면 setInterval 실행 안 함

    const interval = setInterval(() => {
      setLimit(prevLimit => Math.max(prevLimit - 1, 0)); // 0 이하로 내려가지 않도록 설정
    }, 1000);

    return () => clearInterval(interval); // 컴포넌트 언마운트 시 인터벌 제거
  }, [limit]);

  const extendLogin = async () => {
    try {
      const res = await kyApi
        .get("/api/v1/cafecon/common/reissu/AccessToken")
        .json();
      if (res.code === "C000") {
        await getLimitandPoint();
      }
      console.log(res);
    } catch (error) {
      console.error("Failed to extend login session", error);
      logout();
    }
  };

  const getLimitandPoint = async () => {
    if (!login.userId) return; // 로그인 상태가 아닌 경우 실행하지 않음
    setLimit(3600);
    try {
      const res = await kyApi.get("/api/v1/cafecon/common/exper_cookie").json();

      if (res.code === "C000") {
        dispatch(loginUser({ point: res.point }));
        setLimit(res.limit);
      } else {
        setLimit(null);
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch limit and point", error);
      setLimit(null);
      logout();
    }
  };

  const getHeadType = p => {
    if (
      p.split("/")[2] === "join" ||
      p.split("/")[2] === "login" ||
      p.split("/")[2] === "find"
    ) {
      setHeadType("");
    } else {
      const path = p.split("/")[1];
      setHeadType(path);
    }
  };

  const doLogout = async () => {
    await logout();
    setLimit(null);
  };

  return (
    <>
      {headType && (
        <>
          <header className="w-full border-b bg-white">
            <div className="w-full max-w-[1240px] mx-auto relative">
              <h1 className="text-center">
                <button
                  className="p-2 w-fit ppbold text-4xl text-amber-900"
                  onClick={() => navi("/")}
                >
                  카페콘닷컴
                </button>
              </h1>
              <div className="absolute top-2 right-2 lg:hidden">
                <button
                  className="p-2 rounded-full bg-gray-100 border"
                  onClick={() => {
                    setModalOn(true);
                    setModalType("login");
                  }}
                >
                  <FaUser size={20} />
                </button>
              </div>
              <div className="w-full flex flex-col lg:flex-row gap-y-4 lg:justify-between pb-4">
                <SearchArea />

                {headType === "goods" ? (
                  <div className="hidden lg:flex justify-end gap-x-2">
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
                        {login.role === "ADMIN" && (
                          <>
                            <button
                              onClick={() => navi("/admin")}
                              className="px-4 py-2 bg-amber-800 hover:bg-opacity-80 text-white rounded-lg"
                            >
                              관리자페이지
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => navi("/user/mypage")}
                          className="px-4 py-2 bg-primary hover:bg-opacity-80 text-white rounded-lg"
                        >
                          마이페이지
                        </button>
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
                ) : headType === "user" ? (
                  <div className="hidden lg:flex justify-end gap-x-2 pb-2">
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
                        <div className="flex gap-x-2">
                          <button
                            onClick={() => navi("/goods/list")}
                            className="px-4 py-2 bg-primary hover:bg-opacity-80 text-white rounded-lg"
                          >
                            샵으로 이동
                          </button>
                          {login.role === "ADMIN" && (
                            <button
                              onClick={() => navi("/admin")}
                              className="px-4 py-2 bg-amber-800 hover:bg-opacity-80 text-white rounded-lg"
                            >
                              관리자페이지
                            </button>
                          )}
                          <button
                            onClick={() => logout()}
                            className="px-4 py-2 bg-success hover:bg-opacity-80 text-white rounded-lg"
                          >
                            로그아웃
                          </button>
                        </div>
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
                ) : headType === "admin" ? (
                  <div className="hidden lg:flex justify-end gap-x-2 pb-2">
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
                        <div className="flex gap-x-2">
                          <button
                            onClick={() => navi("/goods/list")}
                            className="px-4 py-2 bg-primary hover:bg-opacity-80 text-white rounded-lg"
                          >
                            샵으로 이동
                          </button>
                          <button
                            onClick={() => navi("/user/mypage")}
                            className="px-4 py-2 bg-amber-800 hover:bg-opacity-80 text-white rounded-lg"
                          >
                            마이페이지
                          </button>
                          <button
                            onClick={() => logout()}
                            className="px-4 py-2 bg-success hover:bg-opacity-80 text-white rounded-lg"
                          >
                            로그아웃
                          </button>
                        </div>
                      </>
                    ) : (
                      <>로그인이 필요합니다</>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          </header>
        </>
      )}
      {limit > 0 && limit < 60 && (
        <>
          <div className="fixed z-[999] top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white border border-b-0 flex flex-col justify-start gap-x-2 p-4 rounded-lg">
            <div className="p-2">
              <span className="font-extra text-indigo-600">{limit}</span>초 뒤
              로그아웃 됩니다
            </div>
            <div className="p-2 text-center flex justify-center gap-x-2">
              <button
                className="bg-success hover:bg-opacity-80 text-white rounded-lg px-4 py-2 font-bold"
                onClick={() => extendLogin()}
              >
                연장하기
              </button>
              <button
                className="border border-success bg-white hover:bg-gray-100 text-success rounded-lg px-4 py-2"
                onClick={() => doLogout()}
              >
                로그아웃
              </button>
            </div>
          </div>
          <div className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-60 z-[998]"></div>
        </>
      )}
      <Modal
        modalOn={modalOn}
        setModalOn={setModalOn}
        modalType={modalType}
        setModalType={setModalType}
        extendLogin={extendLogin}
        getLimitandPoint={getLimitandPoint}
        headType={headType}
      />
    </>
  );
}

export default Header;
