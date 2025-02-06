import PropTypes from "prop-types";
import "../../Pages/AdminUserList/User.css";
import { useEffect, useState } from "react";
import { kyApi, useLogout } from "../../Api/Api";
import dayjs from "dayjs";
import { MdExpandMore } from "react-icons/md";
function UserPointModal(props) {
  const logout = useLogout();
  const [point, setPoint] = useState("");
  const [status, setStatus] = useState("deposit");
  const [listCount, setListCount] = useState(1);
  const [pointList, setPointList] = useState([]);
  const [last, setLast] = useState(1);

  useEffect(() => {
    setPointList([]);
  }, [props.modalOn]);

  useEffect(() => {
    setPointList([]);
    setListCount(1);
    getPointList(status, 1, true);
    //eslint-disable-next-line
  }, [status]);

  useEffect(() => {
    getPointList(status, listCount, false);
    //eslint-disable-next-line
  }, [listCount]);

  const getPointList = async (status, listCount, reset) => {
    let url;

    if (status === "deposit") {
      url = "/api/v1/cafecon/user/find/chargeList";
    } else {
      url = "/api/v1/cafecon/user/find/pointLogList";
    }

    const data = {
      userId: props.userInfo.userId,
      page: listCount,
      size: 10,
    };

    const res = await kyApi.post(url, { json: data }).json();
    console.log(res);
    if (reset) {
      const list = res.pointLogList;
      setPointList(list);
    } else {
      const list = pointList.concat(res.pointLogList);
      setPointList(list);
    }
    setLast(res.totalPages);
  };

  const pointSubmit = async logType => {
    if (!point) return alert("포인트를 입력해 주세요");
    if (logType === "차감") {
      if (Number(point) > props.userInfo.point) {
        return alert("보유포인트가 부족합니다");
      }
    }
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
      console.log(res);
      if (res.code === "C000") {
        props.getUserList();
        props.setModalOn(false);
        setPointList([]);
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
      <div className="w-full sticky top-0 left-0 bg-white p-2 h-[35%]">
        <h4 className="text-center font-extra text-xl my-5">
          포인트 지급/차감
        </h4>
        <table id="userList">
          <thead>
            <tr>
              <th className="text-sm">아이디</th>
              <th className="text-sm">이름</th>
              <th className="text-sm">연락처</th>
              <th className="text-sm">사업자명</th>
              <th className="text-sm">이메일</th>
              <th className="text-sm">보유포인트</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="text-sm">{props.userInfo.userId}</td>
              <td className="text-sm">{props.userInfo.managerName}</td>
              <td className="text-sm">{props.userInfo.phone}</td>
              <td className="text-sm">{props.userInfo.businessName}</td>
              <td className="text-sm">{props.userInfo.businessEmail}</td>
              <td className="right">
                {props.userInfo.point
                  ? props.userInfo.point.toLocaleString()
                  : 0}
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
        <div className="flex justify-center gap-x-4 pb-5 border-b">
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
      </div>
      <div className="w-full h-[65%] overflow-auto relative bg-white">
        <div className="sticky top-0 left-0 p-2 flex justify-start gap-x-2 bg-white w-fit">
          <button
            className="p-2 text-center bg-gray-200 border border-gray-500 hover:bg-opacity-50 text-sm"
            disabled={status === "deposit"}
            onClick={() => setStatus("deposit")}
          >
            충전 내역
          </button>
          <button
            className="p-2 text-center bg-gray-200 border border-gray-500 hover:bg-opacity-50 text-sm"
            disabled={status === "withdraw"}
            onClick={() => setStatus("withdraw")}
          >
            구매 내역
          </button>
        </div>
        <h4 className="text-center font-extra text-xl mb-5">포인트 내역</h4>
        <div className="w-full h-fit p-2">
          {pointList &&
            pointList.length > 0 &&
            (status === "deposit" ? (
              <table id="pointList">
                <thead>
                  <tr>
                    <th className="text-sm">일시/거래번호</th>
                    <th className="text-sm">충전포인트</th>
                    <th className="text-sm">충전금액</th>
                  </tr>
                </thead>
                <tbody>
                  {pointList.map((item, index) => (
                    <tr key={index}>
                      <td className="text-sm">
                        <span className="text-sm font-bold">
                          {dayjs(item.regDate).format("YYYY-MM-DD HH:mm")}
                        </span>
                        <br />
                        <span className="text-xs gext-gray-500">
                          {item.num}
                        </span>
                      </td>
                      <td className="text-sm">
                        <span className="font-extra text-blue-500">
                          {item.point ? item.point.toLocaleString() : 0}
                        </span>
                        P
                      </td>
                      <td className="text-sm">
                        {item.point ? item.point.toLocaleString() : 0}원
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <table id="pointList">
                <thead>
                  <tr>
                    <th className="text-sm">구매일</th>
                    <th className="text-sm">구분</th>
                    <th className="text-sm">메모</th>
                    <th className="text-sm">수신번호</th>
                    <th className="text-sm">상품명</th>
                    <th className="text-sm">마감일</th>
                    <th className="text-sm">변동포인트</th>
                  </tr>
                </thead>
                <tbody>
                  {pointList.map((item, index) => (
                    <tr key={index}>
                      <td className="text-sm">
                        {dayjs(item.regDate).format("YYYY-MM-DD HH:mm")}
                      </td>
                      <td className="text-sm">
                        {item.logType === "CP"
                          ? "구매"
                          : item.logType === "GI"
                          ? "출금"
                          : item.logType === "AP"
                          ? "관리자 지급"
                          : item.logType === "AD"
                          ? "관리자 차감"
                          : item.logType === "CE"
                          ? "구매취소"
                          : ""}
                      </td>
                      <td className="text-sm">{item.memo || ""}</td>
                      <td className="text-sm">{item.phone || ""}</td>
                      <td className="text-sm">{item.goodsName || ""}</td>
                      <td className="text-sm">
                        {item.limitDate
                          ? dayjs(item.limitDate).format("YYYY-MM-DD")
                          : ""}
                      </td>
                      <td
                        className={`${
                          item.logType === "CP" ||
                          item.logType === "GI" ||
                          item.logType === "AD"
                            ? "text-red-500"
                            : "text-green-600"
                        }`}
                      >
                        {item.logType === "CP" ||
                        item.logType === "GI" ||
                        item.logType === "AD"
                          ? "-"
                          : "+"}{" "}
                        {item.point ? item.point.toLocaleString() : 0}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ))}
          {last > listCount && (
            <button
              className="w-full text-sm p-2 mt-5 flex justify-center gap-x-2"
              onClick={() => setListCount(prev => prev + 1)}
            >
              <MdExpandMore size={20} />
              <span>10개 더보기</span>
              <MdExpandMore size={20} />
            </button>
          )}
        </div>
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
  modalOn: PropTypes.bool.isRequired,
  setModalOn: PropTypes.func.isRequired,
  getUserList: PropTypes.func.isRequired,
};

export default UserPointModal;
