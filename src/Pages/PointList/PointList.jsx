import { Link, useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import { useEffect, useState } from "react";
import { kyApi } from "../../Api/Api";
import { useSelector } from "react-redux";
import "./Point.css";
import Pagenation from "../../Components/Pagenation";
import Deposit from "../../Components/Deposit";
import Withdraw from "../../Components/Withdraw";
import dayjs from "dayjs";
import SpecificationModal from "../../Components/SpecificationModal";

function PointList() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  const userInfo = useSelector(state => state.user);
  const parsed = queryString.parse(thisLocation.search);
  const status = parsed.status || "";
  const page = parsed.page || 1;
  const size = parsed.size || 20;
  const start = parsed.start || "";
  const end = parsed.end || "";
  const stype = parsed.stype || "";
  const keyword = parsed.keyword || "";
  const [loading, setLoading] = useState(false);
  const [pointList, setPointList] = useState([]);
  const [modalOn, setModalOn] = useState(false);
  const [modalType, setModalType] = useState("");
  const [last, setLast] = useState(1);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchType, setSearchType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [pointInfo, setPointInfo] = useState(null);

  useEffect(() => {
    if (!status) navi(`${thisLocation.pathname}?status=withdraw`);
    if (status === "withdraw") {
      setSearchKeyword(keyword);
      setSearchType(stype);
      const today = new Date();
      const beforeDate = new Date();
      let startD;
      let endD;
      if (start) {
        startD = dayjs(startDate).format("YYYY-MM-DD");
        setStartDate(dayjs(startDate).format("YYYY-MM-DD"));
      } else {
        beforeDate.setMonth(today.getMonth() - 3);
        startD = dayjs(beforeDate).format("YYYY-MM-DD");
        setStartDate(dayjs(beforeDate).format("YYYY-MM-DD"));
      }
      if (end) {
        endD = dayjs(end).format("YYYY-MM-DD");
        setEndDate(dayjs(end).format("YYYY-MM-DD"));
      } else {
        endD = dayjs(today).format("YYYY-MM-DD");
        setEndDate(dayjs(today).format("YYYY-MM-DD"));
      }
      getPointList(startD, endD);
    } else {
      getPointList();
    }
    //eslint-disable-next-line
  }, [thisLocation]);
  const getPointList = async (s, e) => {
    setLoading(true);
    const data = {
      page: page,
      size: size,
    };
    let url = await chkApi(status);
    if (status === "deposit") {
      data.userId = userInfo.userId;
    } else {
      data.userId = userInfo.userId;
      data.startDate = s;
      data.endDate = e;
      if (stype) data.searchType = stype;
      if (keyword) data.searchKeyword = keyword;
    }
    console.log(data);
    const res = await kyApi.post(url, { json: data }).json();
    console.log(res);
    setPointList(res.pointLogList);
    setLast(res.totalPages);
    setLoading(false);
  };

  const chkApi = async status => {
    if (status === "deposit") {
      return "/api/v1/cafecon/user/find/chargeList";
    } else {
      return "/api/v1/cafecon/user/find/pointLogList";
    }
  };

  const handleKeyword = e => {
    const value = e.target.value;

    if (searchType === "orderNo" || searchType === "phone") {
      if (/^\d*$/.test(value)) {
        // 숫자만 허용
        setSearchKeyword(value);
      }
    } else {
      setSearchKeyword(value);
    }
  };

  const handleType = e => {
    const newType = e.target.value;
    setSearchType(newType);

    if (newType === "orderNo" || newType === "phone") {
      setSearchKeyword(searchKeyword.replace(/\D/g, "")); // 숫자만 남기기
    }
  };

  const changeMonth = month => {
    const today = new Date();
    const beforeDate = new Date();
    beforeDate.setMonth(today.getMonth() - month);
    setStartDate(dayjs(beforeDate).format("YYYY-MM-DD"));
    setEndDate(dayjs(today).format("YYYY-MM-DD"));
  };
  const searchIt = () => {
    if (!searchType && !searchKeyword) {
      navi(
        `${thisLocation.pathname}?status=withdraw${
          startDate !== start
            ? `&start=${startDate}&end=${endDate}`
            : endDate !== end
            ? `&start=${startDate}&end=${endDate}`
            : ""
        }`
      );
      return true;
    }
    if (!searchType) return alert("검색 유형을 선택하세요");
    if (!searchKeyword) return alert("검색어를 입력하세요");
    navi(
      `${
        thisLocation.pathname
      }?status=withdraw&keyword=${searchKeyword}&stype=${searchType}${
        startDate !== start
          ? `&start=${startDate}&end=${endDate}`
          : endDate !== end
          ? `&start=${startDate}&end=${endDate}`
          : ""
      }`
    );
  };
  return (
    <>
      <div className="lg:hidden w-full h-[200px] relative">
        <div className="absolute w-full top-1/2 -translate-y-1/2 text-center">
          모바일 페이지 준비중 입니다 <br />
          PC에서 접속해주세요
          <br />
          <br />
          <button
            className="text-indigo-600 border-b border-indigo-600 mr-4"
            onClick={() => navi(-1)}
          >
            이전으로
          </button>
          <button
            className="text-indigo-600 border-b border-indigo-600 ml-4"
            onClick={() => navi("/")}
          >
            메인으로
          </button>
        </div>
      </div>
      <div className="w-full bg-white p-5 hidden lg:block">
        <div className="flex justify-start gap-x-0 mb-5 pb-0 border-b">
          <Link
            to={`${thisLocation.pathname}?status=deposit`}
            className={`${
              !status || status === "deposit"
                ? "bg-primary text-white hover:bg-opacity-50"
                : "bg-white text-black hover:bg-gray-50"
            } py-5 px-4 border border-b-0 rounded-t-lg`}
          >
            충전내역
          </Link>
          <Link
            to={`${thisLocation.pathname}?status=withdraw`}
            className={`${
              !status || status === "withdraw"
                ? "bg-primary text-white hover:bg-opacity-50"
                : "bg-white text-black hover:bg-gray-50"
            } py-5 px-4 border border-b-0 rounded-t-lg`}
          >
            구매내역
          </Link>
        </div>
        {status === "withdraw" && (
          <div className="border border-gray-300 bg-gray-100 p-4 flex flex-col gap-y-2 mb-5">
            <div className="flex flex-row justify-start gap-x-2">
              <input
                type="date"
                value={startDate}
                className="p-2 border border-[#ccc] rounded-sm"
                onChange={e => setStartDate(e.target.value)}
              />
              <div className="py-2">~</div>
              <input
                type="date"
                value={endDate}
                className="p-2 border border-[#ccc] rounded-sm"
                onChange={e => setEndDate(e.target.value)}
              />
              <button
                className="py-2 px-4 bg-white border border-gray-300 hover:bg-opacity-50"
                onClick={() => changeMonth(3)}
              >
                3개월
              </button>

              <button
                className="py-2 px-4 bg-white border border-gray-300 hover:bg-opacity-50"
                onClick={() => changeMonth(6)}
              >
                6개월
              </button>

              <button
                className="py-2 px-4 bg-white border border-gray-300 hover:bg-opacity-50"
                onClick={() => changeMonth(12)}
              >
                12개월
              </button>
            </div>
            <form
              onSubmit={e => {
                e.preventDefault();
                searchIt();
              }}
            >
              <div className="flex flex-row justify-start gap-x-2">
                <select
                  className="py-2 pl-2 pr-8 border border-[#ccc] rounded-sm"
                  value={searchType}
                  onChange={handleType}
                >
                  <option value="">검색유형</option>
                  <option value="goodsName">상품명</option>
                  {/*<option value="orderNo">주문번호</option>*/}
                  <option value="phone">수신번호</option>
                  <option value="memo">메모</option>
                </select>
                <input
                  type="text"
                  className="p-2 border border-[#ccc] rounded-sm w-full"
                  value={searchKeyword}
                  onChange={handleKeyword}
                  placeholder={`${
                    !searchType ? "검색유형 선택 후 " : ""
                  }검색어를 입력하세요`}
                />
                <button
                  className="bg-success hover:bg-opacity-80 text-white px-4 p-2 whitespace-nowrap"
                  type="submit"
                >
                  검색
                </button>

                <button
                  className="bg-white hover:bg-opacity-50 text-black border px-4 p-2 whitespace-nowrap"
                  type="button"
                  onClick={() =>
                    navi(`${thisLocation.pathname}?status=withdraw`)
                  }
                >
                  초기화
                </button>
              </div>
            </form>
          </div>
        )}
        <div
          className={`flex ${
            status === "withdraw" ? "justify-between" : "justify-start"
          }`}
        >
          <div className="text-xl mb-5">
            <span className="font-extra">{userInfo.managerName}</span>님의
            잔여포인트{" "}
            <span className="font-extra text-blue-500">
              {userInfo.point.toLocaleString()}
            </span>
            P
          </div>
          <div className="mb-5">
            <button
              className="py-2 px-4 bg-gray-200 border border-gray-500 hover:bg-opacity-50"
              onClick={() => {
                setModalOn(true);
                setModalType("withdrawAll");
              }}
            >
              기간별 거래명세서
            </button>
          </div>
        </div>
        {pointList &&
          pointList.length > 0 &&
          (status === "deposit" ? (
            <Deposit
              pointList={pointList}
              setModalOn={setModalOn}
              setModalType={setModalType}
              setPointInfo={setPointInfo}
              userInfo={userInfo}
            />
          ) : (
            <Withdraw
              pointList={pointList}
              setModalOn={setModalOn}
              setModalType={setModalType}
              setPointInfo={setPointInfo}
              userInfo={userInfo}
            />
          ))}
        {pointList && pointList.length > 0 ? (
          <div className="my-10">
            <Pagenation last={last} />
          </div>
        ) : null}
      </div>

      <SpecificationModal
        modalOn={modalOn}
        setModalOn={setModalOn}
        modalType={modalType}
        setModalType={setModalType}
        pointInfo={pointInfo}
        startDate={startDate}
        endDate={endDate}
      />
      {loading && (
        <div className="bg-white bg-opacity-55 w-[100vw] h-[100vh] fixed top-0 left-0 overflow-hidden z-[9999999999]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit min-w-[50px] text-center flex flex-col justify-center z-[10000000000]">
            <div className="loader" />
            <span className="absolute w-[50vw] bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
              불러오는 중...
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default PointList;
