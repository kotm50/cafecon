import queryString from "query-string";
import "./Coupon.css";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { kyApi } from "../../Api/Api";
import Sorry from "../../Components/Sorry";
import dayjs from "dayjs";
import Pagenation from "../../Components/Pagenation";
import { useSelector } from "react-redux";

function CouponList() {
  const login = useSelector(state => state.user);
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const page = parsed.page || 1;
  const size = parsed.size || 20;
  const [last, setLast] = useState(1);
  const [couponList, setCouponList] = useState([]);
  const [errMsg, setErrMsg] = useState("조회 된 내용이 없습니다");
  useEffect(() => {
    console.log(login);
    getCouponList(page, size);
    //eslint-disable-next-line
  }, [thisLocation]);

  const getCouponList = async (page, size) => {
    setCouponList([]);
    const data = {
      page: page,
      size: size,
    };
    try {
      const res = await kyApi
        .post("/api/v1/cafecon/user/find/couponList", { json: data })
        .json();
      console.log(res);
      setCouponList(res.couponList);
      setLast(res.totalPages);
    } catch (error) {
      console.log(error);
      setErrMsg("알 수 없는 오류 발생");
    }
  };

  const resendCoupon = async coupon => {
    if (coupon.resendCnt < 1) return alert("더 이상 재전송이 불가능합니다");
    const confirm = window.confirm(
      "재발송 횟수가 1회 차감됩니다.\n재발송 하시겠습니까?"
    );
    if (!confirm) return false;
    const reg = dayjs(coupon.regDate);
    const now = dayjs();

    // 5분 차이 계산
    const fiveMin = now.diff(reg, "minute") >= 5;
    if (!fiveMin) {
      alert("구매 후 5분 이내에 재발송 할 수 없습니다.");
      return;
    }
    const data = {
      trId: coupon.trId,
    };
    const res = await kyApi
      .post("/api/v1/cafecon/common/goods/resend", { json: data })
      .json();
    if (res.code === "C000") {
      alert(
        `기프티콘을 재전송 하였습니다. (남은 횟수 : ${
          coupon.resendCnt - 1
        }회)\n재전송은 일반 전송보다 시간이 오래걸릴 수 있습니다.`
      );
      getCouponList(page, size);
    } else {
      alert(
        "재전송에 실패했습니다.\n계속 실패할 경우 고객센터로 문의해 주세요"
      );
    }
  };

  const cancelCoupon = async coupon => {
    const confirm1 = window.confirm(
      "쿠폰 발송을 취소하시겠습니까?\n취소하면 다시 구매하셔야 합니다."
    );
    if (!confirm1) return false;
    if (coupon.phone !== login.phone) {
      const confirm2 = window.confirm(
        "다른사람에게 선물한 쿠폰입니다\n정말 취소하시겠습니까?"
      );
      if (!confirm2) return false;
    }
    const reg = dayjs(coupon.regDate);
    const now = dayjs();

    // 5분 차이 계산
    const fiveMin = now.diff(reg, "minute") >= 5;
    if (!fiveMin) {
      alert("구매 후 5분 이내에 취소 할 수 없습니다.");
      return;
    }

    const oneWeek = now.diff(reg, "week") >= 1;
    if (oneWeek) {
      alert("구매 후 1주일 경과시 취소가 불가능 합니다");
      return;
    }

    const data = {
      trId: coupon.trId,
      userId: coupon.userId,
    };
    const res = await kyApi
      .post("/api/v1/cafecon/common/cancel/bizapi", { json: data })
      .json();
    alert(res.message || "");
    if (res.code === "C000") getCouponList(page, size);
  };
  return (
    <>
      <div className="w-full bg-white p-5">
        {couponList && couponList.length > 0 ? (
          <>
            <table className="couponList">
              <thead>
                <tr>
                  <th>구매일</th>
                  <th>만료일</th>
                  <th>취소일</th>
                  <th>수신번호</th>
                  <th>이미지</th>
                  <th>상품명(클릭시 상세페이지로)</th>
                  <th colSpan={2}>재발송</th>
                  <th>취소</th>
                </tr>
              </thead>
              <tbody>
                {couponList.map((coupon, idx) => (
                  <tr key={idx}>
                    <td className="center">
                      {coupon.regDate
                        ? dayjs(coupon.regDate).format("YYYY-MM-DD")
                        : ""}
                    </td>
                    <td className="center">
                      {coupon.limitDate
                        ? dayjs(coupon.limitDate).format("YYYY-MM-DD")
                        : ""}
                    </td>
                    <td className="center">
                      {coupon.cancelDate
                        ? dayjs(coupon.cancelDate).format("YYYY-MM-DD")
                        : "-"}
                    </td>
                    <td className="center">{coupon.phone}</td>
                    <td className="center">
                      <a
                        href={`/goods/detail/${coupon.goodsCode}`}
                        target="_blank"
                      >
                        <img
                          src={coupon.goodsImgB}
                          alt={coupon.goodsName}
                          className="w-[36px] h-auto mx-auto"
                        />
                      </a>
                    </td>
                    <td>
                      <a
                        href={`/goods/detail/${coupon.goodsCode}`}
                        target="_blank"
                      >
                        {coupon.goodsName}
                      </a>
                    </td>
                    <td className="center">
                      {coupon.resendCnt
                        ? `${coupon.resendCnt}회 가능`
                        : "불가능"}
                    </td>
                    <td>
                      <button
                        className="w-full py-1 px-2 bg-green-200 border border-green-500 hover:bg-opacity-50"
                        onClick={() => resendCoupon(coupon)}
                        disabled={!coupon.resendCnt}
                      >
                        재발송
                      </button>
                    </td>
                    <td>
                      <button
                        className="w-full py-1 px-2 bg-gray-200 border border-gray-500 hover:bg-opacity-50"
                        onClick={() => cancelCoupon(coupon)}
                      >
                        취소
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <Sorry message={errMsg} />
        )}
      </div>

      {couponList && couponList.length > 0 ? (
        <div className="my-10">
          <Pagenation last={last} />
        </div>
      ) : null}
    </>
  );
}

export default CouponList;
