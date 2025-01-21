import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { kyApi } from "../../Api/Api";

function EditPwd(props) {
  const pwdRef = useRef();
  const [beforePwd, setBeforePwd] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [correctPwdChk, setCorrectPwdChk] = useState(true);
  const [correctPwd, setCorrectPwd] = useState(true);

  const [isErr, setIsErr] = useState(false);

  //비밀번호 양식 확인
  const testPwd = () => {
    if (pwd.length > 0) {
      const regex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{2,}$/;
      let correct = regex.test(pwd);
      if (correct) {
        if (pwd.length > 5) {
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

  //비밀번호 너무 길게쓰면 오류
  const pwdAlert = () => {
    alert("비밀번호는 20자를 넘길 수 없습니다");
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
    if (beforePwd === pwd) {
      errAlert("비밀번호가 변경되지 않았습니다");
      return false;
    }
    const data = {
      userId: props.user.userId,
      userPwd: beforePwd,
      userNewPwd: pwd,
    };
    const res = await kyApi
      .put("/api/v1/cafecon/user/change/pwd", { json: data })
      .json();
    if (res.code === "C000") {
      alert("비밀번호가 변경되었습니다");
      props.setModalOn(false);
      props.setModalType("");
      setBeforePwd("");
      setPwd("");
      setPwdChk("");
      setCorrectPwdChk(true);
      setCorrectPwd(true);
    }
  };

  //비밀번호 일치 확인
  const chkPwd = () => {
    if (pwd.length > 0) {
      if (pwd !== pwdChk) {
        setCorrectPwdChk(false);
      } else {
        setCorrectPwdChk(true);
      }
    } else {
      setCorrectPwdChk(true);
    }
  };
  const cancelChange = () => {
    props.setModalOn(false);
    props.setModalType("");
    setBeforePwd("");
    setPwd("");
    setPwdChk("");
    setCorrectPwdChk(true);
    setCorrectPwd(true);
  };
  const chkBeforePwd = async value => {
    setIsErr(false);
    const data = {
      userId: props.user.userId,
      userPwd: value,
    };
    const res = await kyApi
      .post("/api/v1/cafecon/user/check/pwd", { json: data })
      .json();
    if (res.code !== "C000") setIsErr(true);
  };

  useEffect(() => {
    pwdRef.current.focus();
  }, []);
  return (
    <>
      <form onSubmit={e => editPwd(e)}>
        <div className="my-2 mx-auto p-2 grid grid-cols-1 gap-3  w-full">
          <h2 className="my-3 text-2xl font-neoextra text-center">
            비밀번호 변경하기
          </h2>
          <div id="beforePwd" className={`grid grid-cols-1`}>
            <label
              htmlFor="inputBeforePwd"
              className={`text-sm text-left flex flex-col justify-center mb-2 `}
            >
              기존 비밀번호
            </label>
            <div className="lg:col-span-4">
              <input
                ref={pwdRef}
                type="password"
                id="inputBeforePwd"
                className={`border ${
                  isErr ? "border-red-500" : undefined
                } p-2 w-full text-sm`}
                value={beforePwd}
                onChange={e => {
                  setBeforePwd(e.currentTarget.value);
                  setIsErr(false);
                }}
                onBlur={e => {
                  setBeforePwd(e.currentTarget.value);
                  chkBeforePwd(e.currentTarget.value);
                }}
                placeholder="현재 사용중인 비밀번호"
                autoComplete="off"
              />
            </div>
          </div>

          {isErr && (
            <div className="text-sm text-rose-500">
              기존 비밀번호가 일치하지 않습니다
            </div>
          )}
          <div id="pwd" className={`grid grid-cols-1`}>
            <label
              htmlFor="inputPwd"
              className={`text-sm text-left flex flex-col justify-center mb-2 `}
            >
              새 비밀번호
            </label>
            <div className="lg:col-span-4">
              <input
                type="password"
                id="inputPwd"
                className={`border ${
                  !correctPwd ? "border-red-500" : undefined
                } p-2 w-full text-sm`}
                value={pwd}
                onChange={e => {
                  if (e.currentTarget.value.length > 20) {
                    pwdAlert();
                    setPwd(e.currentTarget.value.substring(0, 20));
                  } else {
                    setPwd(e.currentTarget.value);
                  }
                }}
                onBlur={e => {
                  if (e.currentTarget.value.length > 20) {
                    pwdAlert();
                    setPwd(e.currentTarget.value.substring(0, 20));
                  } else {
                    setPwd(e.currentTarget.value);
                  }
                  if (pwd !== "") testPwd();
                }}
                placeholder="영어/숫자/특수문자 중 2가지 이상"
                autoComplete="off"
              />
            </div>
          </div>
          {!correctPwd && (
            <div className="text-sm text-rose-500">
              비밀번호 양식이 틀렸습니다 <br className="block lg:hidden" />
              확인 후 다시 입력해 주세요
            </div>
          )}
          <div
            id="pwdChk"
            className={`grid grid-cols-1 ${
              !correctPwdChk ? "lg:border-red-500" : undefined
            }`}
          >
            <label
              htmlFor="inputPwdChk"
              className={`text-sm text-left flex flex-col justify-center mb-2 `}
            >
              새 비밀번호확인
            </label>
            <div className="lg:col-span-4">
              <input
                type="password"
                id="inputPwdChk"
                className={`border ${
                  !correctPwdChk ? "border-red-500" : undefined
                } p-2 w-full text-sm`}
                value={pwdChk}
                onChange={e => {
                  setPwdChk(e.currentTarget.value);
                }}
                onBlur={e => {
                  setPwdChk(e.currentTarget.value);
                  if (pwdChk !== "") chkPwd();
                }}
                placeholder="비밀번호를 한번 더 입력해 주세요"
                autoComplete="off"
              />
            </div>
          </div>
          {!correctPwdChk && (
            <div className="text-sm text-rose-500">
              비밀번호가 일치하지 않습니다 <br className="block lg:hidden" />
              확인 후 다시 입력해 주세요
            </div>
          )}
          <div className="p-2 flex justify-center gap-x-2">
            <button
              className="bg-teal-500 hover:bg-teal-700 text-white py-2 px-10"
              onClick={e => editPwd(e)}
            >
              수정하기
            </button>
            <button
              className="px-4 py-2 bg-gray-500 hover:bg-gray-700 text-white"
              onClick={() => cancelChange()}
            >
              취소하기
            </button>
          </div>
        </div>
      </form>
    </>
  );
}

EditPwd.propTypes = {
  setModalOn: PropTypes.func.isRequired,
  setModalType: PropTypes.func.isRequired,
  user: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditPwd;
