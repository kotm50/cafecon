import PropTypes from "prop-types";
import { useState } from "react";
import { kyApi } from "../../Api/Api";

function PwdChk(props) {
  const [userPwd, setUserPwd] = useState("");

  const checkPwd = async e => {
    e.preventDefault();
    if (userPwd === "") {
      alert("비밀번호를 입력해 주세요");
      return;
    }
    const data = {
      userId: props.userId,
      userPwd: userPwd,
    };
    console.log(data);
    const res = await kyApi
      .post("/api/v1/cafecon/user/check/pwd", { json: data })
      .json();

    console.log(res);
    if (res.code === "C000") {
      props.setChecked(true);
    } else {
      alert("비밀번호가 일치하지 않습니다\n확인 후 다시 시도해주세요");
    }
  };
  return (
    <>
      <form onSubmit={checkPwd}>
        <div className="bg-white p-4 w-full max-w-[540px] mx-auto lg:rounded-lg lg:border-x border-y flex flex-col gap-y-4">
          <div id="userPwd" className="flex flex-col">
            <label
              htmlFor="inputPwd"
              className="text-base text-left flex flex-col justify-center mb-2"
            >
              비밀번호를 한번 더 입력해 주세요
            </label>
            <input
              type="password"
              id="inputPwd"
              className="border px-2 py-3 w-full rounded shadow-sm bg-gray-50"
              value={userPwd}
              onChange={e => setUserPwd(e.currentTarget.value)}
              onBlur={e => setUserPwd(e.currentTarget.value)}
              autoComplete="on"
            />
          </div>
          <button
            className="bg-blue-600 hover:bg-opacity-80 text-white p-2 w-full rounded-lg"
            type="submit"
          >
            비밀번호확인
          </button>
        </div>
      </form>
    </>
  );
}

PwdChk.propTypes = {
  setChecked: PropTypes.func.isRequired,
  userId: PropTypes.string.isRequired,
};

export default PwdChk;
