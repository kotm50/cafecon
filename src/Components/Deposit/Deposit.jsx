import PropTypes from "prop-types";
import dayjs from "dayjs";

function Deposit(props) {
  return (
    <>
      {props.pointList && props.pointList.length > 0 && (
        <table id="pointList">
          <thead>
            <tr>
              <th>일시/거래번호</th>
              <th>충전포인트</th>
              <th>충전금액</th>
              <th>증빙서류</th>
            </tr>
          </thead>
          <tbody>
            {props.pointList.map((item, index) => (
              <tr key={index}>
                <td>
                  <span className="text-sm font-bold">
                    {dayjs(item.regDate).format("YYYY-MM-DD HH:mm")}
                  </span>
                  <br />
                  <span className="text-xs gext-gray-500">{item.num}</span>
                </td>
                <td>
                  <span className="font-extra text-blue-500">
                    {item.point ? item.point.toLocaleString() : 0}
                  </span>
                  P
                </td>
                <td>{item.point ? item.point.toLocaleString() : 0}원</td>
                <td>
                  <button
                    className="py-2 px-4 bg-gray-200 border border-gray-500 hover:bg-opacity-50"
                    onClick={() => {
                      props.setModalOn(true);
                      props.setModalType("deposit");
                      props.setPointInfo(item);
                    }}
                  >
                    거래명세서
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

Deposit.propTypes = {
  pointList: PropTypes.arrayOf(
    PropTypes.shape({
      regDate: PropTypes.string.isRequired,
      num: PropTypes.string,
      chargePoint: PropTypes.number,
      depositAmount: PropTypes.number,
      depositorName: PropTypes.string,
      status: PropTypes.string,
      chargeRequest: PropTypes.string,
    })
  ).isRequired,
  setModalOn: PropTypes.func.isRequired,
  setModalType: PropTypes.func.isRequired,
  setPointInfo: PropTypes.func.isRequired,
};

export default Deposit;
