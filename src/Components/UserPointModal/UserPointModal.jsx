import PropTypes from "prop-types";
import "../../Pages/AdminUserList/User.css";
import { useState } from "react";
import { kyApi, useLogout } from "../../Api/Api";
function UserPointModal(props) {
  const logout = useLogout();
  const [point, setPoint] = useState("");
  const pointSubmit = async logType => {
    const data = {
      userId: props.userInfo.userId,
      point: Number(point),
      logType: logType,
    };
    try {
      const res = await kyApi
        .put("/api/v1/cafecon/user/update/point", {
          json: data,
        })
        .json();
      if (res.code === "C000") {
        props.getUserList();
        props.setModalOn(false);
        props.setModalType("");
        alert(`포인트 ${logType} 완료`);
      } else if (res.code === "E403") {
        logout();
        return false;
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleChange = e => {
    const inputValue = e.target.value;

    // 숫자만 허용 (정규식 사용)
    if (/^\d*$/.test(inputValue)) {
      setPoint(inputValue); // 숫자만 입력 가능
    }
  };
  return (
    <>
      <h3 className="text-center font-extra text-2xl my-5">포인트 지급/차감</h3>
      <table id="userList">
        <thead>
          <tr>
            <th>아이디</th>
            <th>이름</th>
            <th>연락처</th>
            <th>사업자명</th>
            <th>이메일</th>
            <th>보유포인트</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{props.userInfo.userId}</td>
            <td>{props.userInfo.managerName}</td>
            <td>{props.userInfo.phone}</td>
            <td>{props.userInfo.businessName}</td>
            <td>{props.userInfo.businessEmail}</td>
            <td className="right">
              {props.userInfo.point ? props.userInfo.point.toLocaleString() : 0}
              P
            </td>
          </tr>
        </tbody>
      </table>
      <div
        id="id"
        className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border border-gray-300 my-5`}
      >
        <label
          htmlFor="inputPoint"
          className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
        >
          <div>포인트</div>
        </label>
        <div className="lg:col-span-4">
          <input
            type="text"
            id="inputPoint"
            autoCapitalize="none"
            className={`border lg:border-0 p-2 w-full text-sm`}
            value={point}
            onChange={handleChange}
            placeholder="지급/차감할 포인트"
            autoComplete="off"
          />
        </div>
      </div>
      <div className="flex justify-center gap-x-4">
        <button
          className="py-2 px-4 bg-blue-600 hover:bg-opacity-80 text-white"
          onClick={() => pointSubmit("지급")}
        >
          포인트 지급
        </button>
        <button
          className="py-2 px-4 bg-red-600 hover:bg-opacity-80 text-white"
          onClick={() => pointSubmit("차감")}
        >
          포인트 차감
        </button>
      </div>
    </>
  );
}

UserPointModal.propTypes = {
  userInfo: PropTypes.shape({
    userId: PropTypes.string.isRequired,
    managerName: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    businessNo: PropTypes.string.isRequired,
    businessName: PropTypes.string.isRequired,
    businessEmail: PropTypes.string.isRequired,
    point: PropTypes.number.isRequired,
  }).isRequired,
  setModalOn: PropTypes.func.isRequired,
  setModalType: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
};

export default UserPointModal;
