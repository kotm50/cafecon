import PropTypes from "prop-types";
import dayjs from "dayjs";

function Withdraw(props) {
  const getLogtype = logType => {
    if (logType === "CP" || logType === "GI" || logType === "AP") {
      return true;
    }
    return false;
  };
  return (
    <table id="pointList">
      <thead>
        <tr>
          <th>구매일</th>
          <th>구분</th>
          <th>메모</th>
          <th>수신번호</th>
          <th>상품명</th>
          <th>마감일</th>
          <th>변동포인트</th>
          <th>증빙서류</th>
        </tr>
      </thead>
      <tbody>
        {props.pointList.map((item, index) => (
          <tr key={index}>
            <td>{dayjs(item.regDate).format("YYYY-MM-DD HH:mm")}</td>
            <td>
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
            <td>{item.memo || ""}</td>
            <td>{item.phone || ""}</td>
            <td>{item.goodsName || ""}</td>
            <td>
              {item.limitDate ? dayjs(item.limitDate).format("YYYY-MM-DD") : ""}
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
            <td>
              {item.logType && getLogtype(item.logType) && (
                <button
                  className="py-2 px-4 bg-gray-200 border border-gray-500 hover:bg-opacity-50"
                  onClick={() => {
                    props.setModalOn(true);
                    props.setModalType(
                      item.logType === "AP" ? "deposit" : "withdraw"
                    );
                    props.setPointInfo(item);
                  }}
                >
                  거래명세서
                </button>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

Withdraw.propTypes = {
  pointList: PropTypes.arrayOf(
    PropTypes.shape({
      regDate: PropTypes.string.isRequired,
      phone: PropTypes.string,
      point: PropTypes.number,
      logType: PropTypes.string,
      status: PropTypes.string,
    })
  ).isRequired,
  setModalOn: PropTypes.func.isRequired,
  setModalType: PropTypes.func.isRequired,
  setPointInfo: PropTypes.func.isRequired,
};

export default Withdraw;
