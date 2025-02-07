import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { useLocation, useNavigate } from "react-router-dom";
import { kyApi } from "../../Api/Api";
import { smsAuth, smsCert } from "../../Api/Auth";

import dayjs from "dayjs";
import queryString from "query-string";

function FindUser() {
  const navi = useNavigate();
  const login = useSelector(state => state.user);
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const check = parsed.check || null;
  const [checkUser, setCheckUser] = useState("");

  const [userId, setUserId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [phoneChk, setPhoneChk] = useState(false);
  const [phoneCert, setPhoneCert] = useState("");
  const [phone, setPhone] = useState("");
  const [isErr, setIsErr] = useState(false);
  const [errMessage, setErrMessage] = useState("");

  const [isFound, setIsFound] = useState(false);
  const [foundId, setFoundId] = useState("");
  const [regDate, setRegDate] = useState("");

  const [userPwd, setUserPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [correctPwdChk, setCorrectPwdChk] = useState(true);
  const [correctPwd, setCorrectPwd] = useState(true);

  const submit = async e => {
    e.preventDefault();
    const cert = await chkCert();
    if (!cert) return false;
    setIsErr(false);
    const data = {
      managerName: managerName,
      phone: phone,
    };
    let url = "/api/v1/cafecon/user/find/id";
    if (checkUser === "pw") {
      if (!userId) {
        return alert("아이디를 입력하세요");
      }
      data.userId = userId;
      url = "/api/v1/cafecon/user/find/pwd/before/cert";
    }
    const res = await kyApi.post(url, { json: data }).json();
    console.log(res);
    if (res.code !== "C000") {
      setErrMessage(res.message);
      setIsErr(true);
    } else {
      setIsFound(true);
      if (checkUser === "id") {
        setFoundId(res.userId);
        setRegDate(dayjs(res.createdAt).format("YYYY년 MM월 DD일"));
      }
    }
  };

  useEffect(() => {
    if (login.userId) {
      navi("/");
    }
    //eslint-disable-next-line
  }, [thisLocation, login]);

  const reset = () => {
    setUserId("");
    setManagerName("");
    setPhoneChk("");
    setPhoneCert("");
    setPhone("");
    setIsErr("");
    setErrMessage("");
    setIsFound("");
    setFoundId("");
    setRegDate("");
  };

  useEffect(() => {
    reset();
    if (!check) {
      navi("/");
    } else {
      setCheckUser(check);
    }
    //eslint-disable-next-line
  }, [thisLocation, check]);

  const handlePhoneNo = e => {
    const inputValue = e.target.value;

    // 숫자만 허용 (정규식 사용)
    if (/^\d*$/.test(inputValue)) {
      setPhone(inputValue); // 숫자만 입력 가능
    }
  };

  const handlePhoneCert = e => {
    const inputValue = e.target.value;

    // 숫자만 허용 (정규식 사용)
    if (/^\d*$/.test(inputValue)) {
      setPhoneCert(inputValue); // 숫자만 입력 가능
    }
  };

  const getCert = async () => {
    if (checkUser === "pw" && !userId) {
      return alert("아이디를 입력해 주세요");
    }
    if (!managerName) {
      return alert("이름을 입력해 주세요");
    }
    if (!phone) {
      return alert("휴대폰 번호를 입력해 주세요");
    }
    setPhoneCert("");
    const res = await smsAuth(managerName, phone, userId);
    if (res.code === "C000") {
      setPhoneChk(true);
    } else {
      return alert(
        "인증번호 발송 실패. 이름과 휴대폰 번호를 확인해 주세요\n같은 현상이 반복되면 고객센터 1644-4223 으로 문의해 주세요"
      );
    }
  };

  const chkCert = async () => {
    const res = await smsCert(managerName, phone, phoneCert);
    if (res.code === "C000") {
      return true;
    } else {
      alert(
        "인증번호 확인 실패. 인증번호를 확인해 주세요\n같은 현상이 반복되면 고객센터 1644-4223 으로 문의해 주세요"
      );
      return false;
    }
  };

  //비밀번호 너무 길게쓰면 오류
  const pwdAlert = () => {
    alert("비밀번호는 20자를 넘길 수 없습니다");
  };

  //비밀번호 양식 확인
  const testPwd = () => {
    if (userPwd.length > 0) {
      const regex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{2,}$/;
      let correct = regex.test(userPwd);
      if (correct) {
        if (userPwd.length > 5) {
          setCorrectPwd(true);
        } else {
          setCorrectPwd(false);
        }
      } else {
        setCorrectPwd(false);
      }
    } else {
      setCorrectPwd(true);
    }
  };

  const errAlert = m => {
    alert(m);
  };

  const editPwd = async e => {
    e.preventDefault();
    if (pwdChk === "") {
      errAlert("비밀번호를 확인해 주세요");
      return false;
    }
    if (!correctPwd) {
      errAlert("비밀번호 양식이 잘못되었습니다");
      return false;
    }
    if (!correctPwdChk) {
      errAlert("비밀번호가 일치하지 않습니다");
      return false;
    }
    const data = {
      userId: userId,
      userNewPwd: userPwd,
    };
    const res = await kyApi
      .put("/api/v1/cafecon/user/reset/pwd", { json: data })
      .json();
    console.log(res);
    if (res.code === "C000") {
      alert("비밀번호가 변경되었습니다\n로그인 해주세요");
      navi("/user/login");
    }
  };

  //비밀번호 일치 확인
  const chkPwd = () => {
    if (userPwd.length > 0) {
      if (userPwd !== pwdChk) {
        setCorrectPwdChk(false);
      } else {
        setCorrectPwdChk(true);
      }
    } else {
      setCorrectPwdChk(true);
    }
  };

  return (
    <>
      <Helmet>
        <title>아이디/비밀번호 찾기</title>
      </Helmet>
      {checkUser && (
        <div className="w-full max-w-[540px] h-fit fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col gap-y-10">
          <h1 className="text-center ppbold text-4xl">카페콘닷컴</h1>
          <div className="w-full grid grid-cols-2 border divide-x">
            <button
              className={`p-2 text-center w-full ${
                checkUser === "id" ? "bg-rose-500 text-white" : "bg-white"
              }`}
              onClick={() => {
                if (checkUser !== "id") navi("/user/find?check=id");
              }}
            >
              아이디 찾기
            </button>
            <button
              className={`p-2 text-center w-full ${
                checkUser === "pw" ? "bg-rose-500 text-white" : "bg-white"
              }`}
              onClick={() => {
                if (checkUser !== "pw") navi("/user/find?check=pw");
              }}
            >
              비밀번호 찾기
            </button>
          </div>
          {!isFound ? (
            <div className="w-full bg-white border-y lg:border-x lg:rounded lg:shadow-lg">
              <form onSubmit={e => submit(e)}>
                <div
                  id="loginArea"
                  className="mx-auto p-4 flex flex-col gap-3 w-full"
                >
                  <h2 className="text-xl text-center">
                    {checkUser === "id" ? "아이디" : "비밀번호"} 찾기
                  </h2>
                  {checkUser === "pw" && (
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
                      />
                    </div>
                  )}

                  <div id="name" className="flex flex-col">
                    <label
                      htmlFor="inputName"
                      className="text-sm text-left flex flex-col justify-center mb-2"
                    >
                      이름
                    </label>
                    <input
                      type="text"
                      id="inputId"
                      autoCapitalize="none"
                      className="border px-2 py-3 w-full rounded shadow-sm"
                      value={managerName}
                      onChange={e => setManagerName(e.currentTarget.value)}
                      onBlur={e => setManagerName(e.currentTarget.value)}
                      autoComplete="on"
                    />
                  </div>

                  <div id="phone" className="flex flex-col">
                    <label
                      htmlFor="inputName"
                      className="text-sm text-left flex flex-col justify-center mb-2"
                    >
                      휴대폰 번호
                    </label>
                    <div className="grid grid-cols-4 gap-x-1">
                      <input
                        type="text"
                        id="inputId"
                        autoCapitalize="none"
                        className="border px-2 py-3 w-full rounded shadow-sm col-span-3"
                        value={phone}
                        onChange={handlePhoneNo}
                        autoComplete="on"
                      />

                      <button
                        type="button"
                        className="w-full h-full p-2 text-white bg-green-600 hover:bg-opacity-80 text-sm rounded"
                        onClick={e => {
                          e.preventDefault();
                          getCert();
                        }}
                      >
                        인증번호 발송
                      </button>
                    </div>
                  </div>

                  {phoneChk && (
                    <div id="phone" className="flex flex-col">
                      <label
                        htmlFor="inputName"
                        className="text-sm text-left flex flex-col justify-center mb-2"
                      >
                        인증번호
                      </label>
                      <input
                        type="text"
                        id="inputId"
                        autoCapitalize="none"
                        className="border px-2 py-3 w-full rounded shadow-sm col-span-3"
                        value={phoneCert}
                        onChange={handlePhoneCert}
                        autoComplete="on"
                      />
                    </div>
                  )}

                  {isErr && (
                    <div className="text-center text-sm pb-2 text-rose-500">
                      {errMessage}
                    </div>
                  )}
                  <div className="w-full">
                    <button
                      className="transition duration-100 w-full bg-blue-500 hover:bg-blue-700 p-2 text-white rounded hover:animate-wiggle"
                      type="submit"
                      disabled={!phoneChk}
                    >
                      휴대폰 인증 후{" "}
                      {checkUser === "id" ? "아이디" : "비밀번호"} 찾기
                    </button>
                  </div>
                </div>
              </form>
            </div>
          ) : (
            <>
              {checkUser === "id" ? (
                <div className="w-full bg-white border-y lg:border-x lg:rounded lg:shadow-lg">
                  <div
                    id="foundId"
                    className="mx-auto p-4 flex flex-col gap-3 w-full"
                  >
                    <h2 className="text-xl text-center">아이디 찾기 결과</h2>
                    <div className="text-base text-left">
                      아이디 : <span className="font-extra">{foundId}</span>
                    </div>
                    <div className="text-base text-left">
                      가입일 : <span className="font-extra">{regDate}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-x-2">
                      <button
                        className="bg-green-600 hover:bg-opacity-80 text-white p-2 rounded"
                        onClick={() => navi("/user/login")}
                      >
                        로그인 하기
                      </button>
                      <button
                        className="bg-rose-600 hover:bg-opacity-80 text-white p-2 rounded"
                        onClick={() => {
                          navi("/user/find?check=pw");
                        }}
                      >
                        비밀번호 찾기
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="w-full bg-white border-y lg:border-x lg:rounded lg:shadow-lg">
                  <form onSubmit={e => editPwd(e)}>
                    <div
                      id="pwd"
                      className="mx-auto p-4 flex flex-col gap-3 w-full"
                    >
                      <h2 className="text-xl text-center">비밀번호 재등록</h2>
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
                          onChange={e => {
                            if (e.currentTarget.value.length > 20) {
                              pwdAlert();
                              setUserPwd(
                                e.currentTarget.value.substring(0, 20)
                              );
                            } else {
                              setUserPwd(e.currentTarget.value);
                            }
                          }}
                          onBlur={e => {
                            if (e.currentTarget.value.length > 20) {
                              pwdAlert();
                              setUserPwd(
                                e.currentTarget.value.substring(0, 20)
                              );
                            } else {
                              setUserPwd(e.currentTarget.value);
                            }
                            if (userPwd !== "") testPwd();
                          }}
                          autoComplete="on"
                        />
                      </div>

                      <div id="userPwd" className="flex flex-col">
                        <label
                          htmlFor="inputPwdChk"
                          className="text-sm text-left flex flex-col justify-center mb-2"
                        >
                          비밀번호 확인
                        </label>
                        <input
                          type="password"
                          id="inputPwdChk"
                          className="border px-2 py-3 w-full rounded shadow-sm"
                          value={pwdChk}
                          onChange={e => setPwdChk(e.currentTarget.value)}
                          onBlur={e => {
                            setPwdChk(e.currentTarget.value);
                            if (pwdChk !== "") chkPwd();
                          }}
                          autoComplete="on"
                        />
                      </div>

                      {!correctPwdChk && (
                        <div className="text-sm text-rose-500">
                          비밀번호가 일치하지 않습니다{" "}
                          <br className="block lg:hidden" />
                          확인 후 다시 입력해 주세요
                        </div>
                      )}

                      {isErr && (
                        <div className="text-center text-sm pb-2 text-rose-500">
                          {errMessage}
                        </div>
                      )}
                      <div className="w-full">
                        <button
                          className="transition duration-100 w-full bg-blue-500 hover:bg-blue-700 p-2 text-white rounded hover:animate-wiggle"
                          type="submit"
                          disabled={!correctPwdChk || isErr}
                        >
                          비밀번호 변경
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default FindUser;
