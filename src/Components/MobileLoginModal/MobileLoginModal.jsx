import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogout } from "../../Api/Api";

function MobileLoginModal(props) {
  const logout = useLogout();
  const login = useSelector(state => state.user);
  const navi = useNavigate();
  return (
    <div className="w-full p-2 flex flex-col justify-center gap-y-2">
      {!login.userId ? (
        <>
          <button
            onClick={() => {
              navi("/user/login");
              props.setModalType("");
              props.setModalOn(false);
            }}
            className="w-full px-4 py-2 bg-green-600 hover:bg-opacity-80 text-white rounded-lg"
          >
            로그인
          </button>
          <button
            onClick={() => {
              navi("/user/join");
              props.setModalType("");
              props.setModalOn(false);
            }}
            className="w-full px-4 py-2 bg-gray-600 hover:bg-opacity-80 text-white rounded-lg"
          >
            회원가입
          </button>
        </>
      ) : (
        <>
          {props.headType === "goods" ? (
            <>
              <div className="p-2 flex justify-start gap-x-2">
                <div>{login.managerName}님</div>
                <div>
                  <span className="font-extra text-indigo-600">
                    {!isNaN(login.point) ? login.point.toLocaleString() : 0}
                  </span>
                  P 보유중
                </div>
              </div>
              <button
                onClick={() => {
                  navi("/user/mypage");
                  props.setModalType("");
                  props.setModalOn(false);
                }}
                className="px-4 py-2 bg-primary hover:bg-opacity-80 text-white rounded-lg"
              >
                마이페이지
              </button>
              <button
                onClick={() => {
                  logout();
                  props.setModalType("");
                  props.setModalOn(false);
                }}
                className="px-4 py-2 bg-success hover:bg-opacity-80 text-white rounded-lg"
              >
                로그아웃
              </button>
            </>
          ) : props.headType === "user" ? (
            <>
              <div className="p-2 flex justify-start gap-x-2">
                <div>{login.managerName}님</div>
                <div>
                  <span className="font-extra text-indigo-600">
                    {!isNaN(login.point) ? login.point.toLocaleString() : 0}
                  </span>
                  P 보유중
                </div>
              </div>

              <button
                onClick={() => {
                  navi("/goods/list");
                  props.setModalType("");
                  props.setModalOn(false);
                }}
                className="px-4 py-2 bg-primary hover:bg-opacity-80 text-white rounded-lg"
              >
                샵으로 이동
              </button>
              <button
                onClick={() => {
                  logout();
                  props.setModalType("");
                  props.setModalOn(false);
                }}
                className="px-4 py-2 bg-success hover:bg-opacity-80 text-white rounded-lg"
              >
                로그아웃
              </button>
            </>
          ) : props.headType === "admin" ? (
            <>
              <div className="p-2 flex justify-start gap-x-2">
                <div>{login.managerName}님</div>
                <div>
                  <span className="font-extra text-indigo-600">
                    {!isNaN(login.point) ? login.point.toLocaleString() : 0}
                  </span>
                  P 보유중
                </div>
              </div>

              <button
                onClick={() => {
                  navi("/goods/list");
                  props.setModalType("");
                  props.setModalOn(false);
                }}
                className="px-4 py-2 bg-primary hover:bg-opacity-80 text-white rounded-lg"
              >
                샵으로 이동
              </button>
              <button
                onClick={() => {
                  navi("/user/mypage");
                  props.setModalType("");
                  props.setModalOn(false);
                }}
                className="px-4 py-2 bg-amber-800 hover:bg-opacity-80 text-white rounded-lg"
              >
                마이페이지
              </button>
              <button
                onClick={() => {
                  logout();
                  props.setModalType("");
                  props.setModalOn(false);
                }}
                className="px-4 py-2 bg-success hover:bg-opacity-80 text-white rounded-lg"
              >
                로그아웃
              </button>
            </>
          ) : null}
        </>
      )}
    </div>
  );
}
MobileLoginModal.propTypes = {
  setModalOn: PropTypes.func.isRequired,
  setModalType: PropTypes.func.isRequired,
  headType: PropTypes.string,
};
export default MobileLoginModal;
