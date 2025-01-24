// Header
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import SearchArea from "../SearchArea";
import Modal from "../Modal";
import { kyApi, useLogout } from "../../Api/Api";
import { loginUser } from "../../Reducer/userSlice";

function Header() {
  const logout = useLogout();
  const navi = useNavigate();
  const login = useSelector(state => state.user);
  const dispatch = useDispatch();
  const thisLocation = useLocation();
  const [modalOn, setModalOn] = useState(false);
  const [modalType, setModalType] = useState("");
  const [headType, setHeadType] = useState("goods");

  useEffect(() => {
    getHeadType(thisLocation.pathname);
    if (login.userId) {
      getLimitandPoint();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [thisLocation, login.userId]);

  const extendLogin = async () => {
    try {
      const res = await kyApi
        .get("/api/v1/cafecon/common/reissu/AccessToken")
        .json();
      if (res.code === "C000") {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to extend login session", error);
      return false;
    }
  };

  const getLimitandPoint = async () => {
    if (!login.userId) return; // 로그인 상태가 아닌 경우 실행하지 않음

    try {
      const res = await kyApi.get("/api/v1/cafecon/common/exper_cookie").json();

      if (res.code === "C000") {
        dispatch(loginUser({ point: res.point }));
        if (res.limit > 0 && res.limit < 300) {
          const reset = extendLogin();
          if (reset) {
            const res = await kyApi
              .get("/api/v1/cafecon/common/exper_cookie")
              .json();
            dispatch(loginUser({ point: res.point }));
          } else {
            logout();
          }
        }
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch limit and point", error);
      logout();
    }
  };

  const getHeadType = p => {
    console.log(p.split("/")[2] === "join" || p.split("/")[2] === "login");
    if (p.split("/")[2] === "join" || p.split("/")[2] === "login") {
      setHeadType("");
    } else {
      const path = p.split("/")[1];
      setHeadType(path);
    }
  };

  return (
    <>
      {headType && (
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

                {headType === "goods" ? (
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
                  <div className="flex justify-end gap-x-2 pb-2">
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
                ) : null}
              </div>
            </div>
          </header>
        </>
      )}

      <Modal
        modalOn={modalOn}
        setModalOn={setModalOn}
        modalType={modalType}
        setModalType={setModalType}
        extendLogin={extendLogin}
        getLimitandPoint={getLimitandPoint}
      />
    </>
  );
}

export default Header;
