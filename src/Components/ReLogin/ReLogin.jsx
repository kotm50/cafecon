import PropTypes from "prop-types";
import { useLogout } from "../../Api/Api";

function ReLogin(props) {
  const logout = useLogout();
  const extendCookie = async () => {
    try {
      const res = await props.extendLogin();
      if (res) {
        const reload = await props.getLimitandPoint();
        if (reload) {
          props.setModalOn(false);
          props.setModalType("");
        }
      } else {
        console.error("Failed to extend login session.");
      }
    } catch (error) {
      console.error("Error extending login session:", error);
      // 필요한 경우 사용자에게 알림 추가
    }
  };

  return (
    <>
      <div className="flex flex-col justify-center gap-y-10 min-h-fit max-w-full text-center">
        <h4 className="text-primary font-extra text-lg lg:text-xl">
          로그인 연장 필요
        </h4>
        <div className="flex flex-col justify-start gap-x-2 text-sm">
          <div>장기간 활동이 감지되지 않아</div>
          <div>
            <span className="text-success font-extra text-lg">
              {props.limit}
            </span>
            초 후 로그아웃 됩니다
          </div>
        </div>

        <div className="grid grid-cols-3 gap-x-2 text-sm h-fit">
          <button
            className="w-full bg-primary hover:bg-opacity-80 text-white col-span-2 p-2 rounded-lg"
            onClick={extendCookie}
          >
            로그인 연장하기
          </button>
          <button
            className="w-full border border-gray-300 hover:bg-gray-100 p-2 rounded-lg"
            onClick={() => {
              logout();
              props.setModalOn(false);
              props.setModalType("");
            }}
          >
            로그아웃
          </button>
        </div>
      </div>
    </>
  );
}

ReLogin.propTypes = {
  limit: PropTypes.number.isRequired,
  setLimit: PropTypes.func.isRequired,
  extendLogin: PropTypes.func.isRequired,
  getLimitandPoint: PropTypes.func.isRequired,
  setModalOn: PropTypes.func.isRequired,
  setModalType: PropTypes.func.isRequired,
};

export default ReLogin;
