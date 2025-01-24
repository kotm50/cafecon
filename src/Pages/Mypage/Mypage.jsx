import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import PwdChk from "../../Components/PwdChk/PwdChk";
import EditUser from "../../Components/EditUser";

function Mypage() {
  const navi = useNavigate();
  const login = useSelector(state => state.user);
  const thisLocation = useLocation();
  const [checked, setChecked] = useState(false);
  const [pwd, setPwd] = useState("");
  useEffect(() => {
    if (login.userId === "") {
      alert("로그인 후 이용 가능합니다");
      navi("/user/login");
    } else {
      setChecked(false);
    }
    //eslint-disable-next-line
  }, [thisLocation]);
  return (
    <>
      <h2 className="text-center text-4xl mb-10">개인정보수정</h2>
      {!checked ? (
        <PwdChk
          setChecked={setChecked}
          userId={login.userId}
          userPwd={pwd}
          setUserPwd={setPwd}
        />
      ) : (
        <EditUser login={login} userPwd={pwd} setUserPwd={setPwd} />
      )}
    </>
  );
}

export default Mypage;
