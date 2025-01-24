import queryString from "query-string";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { kyApi } from "../../Api/Api";
import Sorry from "../../Components/Sorry";
import dayjs from "dayjs";

function CouponList() {
  const thisLocation = useLocation();
  const parsed = queryString.parse(thisLocation.search);
  const page = parsed.page || 1;
  const size = parsed.size || 20;
  const [couponList, setCouponList] = useState([]);
  const [errMsg, setErrMsg] = useState("조회 된 내용이 없습니다");
  useEffect(() => {
    getCouponList(page, size);
    //eslint-disable-next-line
  }, [thisLocation]);
  const getCouponList = async (page, size) => {
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
    } catch (error) {
      console.log(error);
      setErrMsg("알 수 없는 오류 발생");
    }
  };
  const cancelCoupon = async coupon => {
    const reg = dayjs(coupon.regDate);
    const now = dayjs();

    // 5분 차이 계산
    const fiveMin = now.diff(reg, "minute") >= 5;
    if (!fiveMin) {
      alert("5분 이내에 취소 할 수 없습니다.");
      return;
    }
    const data = {
      trId: coupon.trId,
      userId: coupon.userId,
    };
    const res = await kyApi
      .post("/api/v1/cafecon/common/cancel/bizapi", { json: data })
      .json();
    console.log(res);
  };
  return (
    <div className="w-full bg-white p-5">
      {couponList && couponList.length > 0 ? (
        <>
          <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4">
            {couponList.map((coupon, idx) => (
              <div
                key={idx}
                className="pb-0 min-h-0 h-fit"
                onClick={() => cancelCoupon(coupon)}
              >
                <div className="group p-2 rounded">
                  <div className="w-32 h-32 lg:w-48 lg:h-48 mx-auto rounded overflow-hidden max-w-full bg-white hover:drop-shadow-xl border">
                    <img
                      src={coupon.goodsImgB}
                      alt={coupon.goodsName}
                      className="w-full mx-auto my-auto duration-300 transition-all ease-in-out hover:scale-125"
                    />
                  </div>
                  <div className="w-32 lg:w-48 mx-auto grid grid-cols-1 pt-1 border-gray-100 max-w-full mt-3">
                    <p
                      className="lg:text-lg group-hover:font-neobold keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left"
                      title={coupon.goodsName}
                    >
                      {coupon.goodsName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        <Sorry message={errMsg} />
      )}
    </div>
  );
}

export default CouponList;
