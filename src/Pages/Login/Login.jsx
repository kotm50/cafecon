import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { kyApi } from "../../Api/Api";
import { clearUser, loginUser } from "../../Reducer/userSlice";
import dayjs from "dayjs";

function Login() {
  const dispatch = useDispatch();
  const navi = useNavigate();
  const login = useSelector(state => state.user);
  const thisLocation = useLocation();
  const inputIdRef = useRef();
  const inputPwdRef = useRef();
  const [userId, setUserId] = useState("");
  const [userPwd, setUserPwd] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const submit = async e => {
    e.preventDefault();
    setIsErr(false);
    const data = {
      userId: userId,
      userPwd: userPwd,
    };
    const res = await kyApi
      .post("/api/v1/cafecon/user/login", { json: data })
      .json();
    if (res.code !== "C000") {
      setErrMessage(res.message);
      setIsErr(true);
      dispatch(clearUser());
    } else {
      dispatch(
        loginUser({
          userId: userId,
          managerName: res.user.managerName,
          phone: res.user.phone,
          point: res.user.point,
          role: res.user.role,
          lastLogin: dayjs().format("YYYY-MM-DD HH:mm:ss"),
        })
      );
    }
  };

  useEffect(() => {
    if (login.userId) navi("/");
  }, [thisLocation, login, navi]);

  return (
    <>
      <Helmet>
        <title>카페콘닷컴 로그인</title>
      </Helmet>
      <div className="w-full max-w-[540px] h-fit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-y-10">
        <h1 className="text-center ppbold text-4xl">카페콘닷컴</h1>
        <div className="w-full bg-white border-y lg:border-x lg:rounded lg:shadow-lg">
          <form onSubmit={e => submit(e)}>
            <div
              id="loginArea"
              className="mx-auto p-4 flex flex-col gap-3 w-full"
            >
              <h2 className="text-xl text-center">로그인</h2>
              <div id="id" className="flex flex-col">
                <label
                  htmlFor="inputId"
                  className="text-sm text-left flex flex-col justify-center mb-2"
                >
                  아이디
                </label>
                <input
                  type="text"
                  id="inputId"
                  autoCapitalize="none"
                  className="border px-2 py-3 w-full rounded shadow-sm"
                  value={userId}
                  onChange={e => setUserId(e.currentTarget.value)}
                  onBlur={e => setUserId(e.currentTarget.value)}
                  autoComplete="on"
                  ref={inputIdRef}
                />
              </div>
              <div id="userPwd" className="flex flex-col">
                <label
                  htmlFor="inputPwd"
                  className="text-sm text-left flex flex-col justify-center mb-2"
                >
                  비밀번호
                </label>
                <input
                  type="password"
                  id="inputPwd"
                  className="border px-2 py-3 w-full rounded shadow-sm"
                  value={userPwd}
                  onChange={e => setUserPwd(e.currentTarget.value)}
                  onBlur={e => setUserPwd(e.currentTarget.value)}
                  autoComplete="on"
                  ref={inputPwdRef}
                />
              </div>
              {isErr && (
                <div className="text-center text-sm pb-2 text-rose-500">
                  {errMessage}
                </div>
              )}
              {/*
              <div className="text-left text-sm text-gray-500 pb-2 flex items-center">
                <input
                  id="saveId"
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                  checked={isSave}
                  onChange={e => setIsSave(!isSave)}
                />
                <label
                  htmlFor="saveId"
                  className="ml-1 text-sm font-medium text-gray-900 dark:text-gray-300"
                >
                  아이디 저장
                </label>
              </div>
              */}
              <div className="text-center text-sm text-gray-500 border-b pb-2">
                <button
                  type="button"
                  onClick={e => {
                    e.preventDefault();
                    navi("/user/join");
                  }}
                >
                  처음이신가요? 여기를 눌러 <br className="block lg:hidden" />
                  <span className="text-blue-500 border-b">회원가입</span>을
                  진행해 주세요
                </button>
              </div>

              <div className="w-full">
                <button
                  className="transition duration-100 w-full bg-emerald-500 hover:bg-emerald-700 p-2 text-white rounded hover:animate-wiggle"
                  type="submit"
                >
                  로그인
                </button>
              </div>
              <div className="flex flex-col lg:flex-row justify-between gap-2">
                <div className="text-sm text-center lg:text-left lg:pl-3 lg:w-[50%]">
                  로그인 정보가 기억나지 않으세요?
                </div>
                <div className="lg:w-[40%] flex flex-row justify-center gap-x-4 items-center">
                  <div className="text-center text-sm text-gray-500 hover:text-rose-500">
                    <button
                      type="button"
                      onClick={() =>
                        alert("계정정보는 고객센터로 문의해 주세요")
                      }
                    >
                      아이디 찾기
                    </button>
                  </div>
                  <div className="text-xs text-gray-300">|</div>
                  <div className="text-center text-sm text-gray-500 hover:text-rose-500">
                    <button
                      type="button"
                      onClick={() =>
                        alert("계정정보는 고객센터로 문의해 주세요")
                      }
                    >
                      비밀번호 찾기
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
