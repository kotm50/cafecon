import { useEffect, useState } from "react";
import "./Admin.css";
import { kyApi } from "../../Api/Api";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";

function AdminPointList() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  const parsed = queryString.parse(thisLocation.search);
  const start = parsed.start || 0;
  const end = parsed.end || 0;
  const stype = parsed.stype || 0;
  const keyword = parsed.userkeyword || 0;
  const [pointList, setPointList] = useState([]);

  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [apPntTotal, setApPntTotal] = useState(0);
  const [adPntTotal, setAdPntTotal] = useState(0);
  const [cePntTotal, setCePntTotal] = useState(0);
  const [cpPntTotal, setCpPntTotal] = useState(0);
  const [giPntTotal, setGiPntTotal] = useState(0);
  const [plusPntTotal, setPlusPntTotal] = useState(0);
  const [miunsPntTotal, setMinusPntTotal] = useState(0);

  useEffect(() => {
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
    //eslint-disable-next-line
  }, [thisLocation]);

  const getPointList = async () => {
    const data = {
      startDate: startDate,
      endDate: endDate,
    };

    if (keyword) data.searchKeyword = keyword;
    if (stype) data.searchType = stype;
    const res = await kyApi
      .post("/api/v1/cafecon/user/find/all/pointLog", { json: data })
      .json();
    console.log(res);
    const total = res.totalResult;
    if (res.pointList.length === 0) {
      return false;
    }
    let apPntTotal = 0;
    let cePntTotal = 0;
    let adPntTotal = 0;
    let cpPntTotal = 0;
    let giPntTotal = 0;
    let plusPntTotal = 0;
    let miunsPntTotal = 0;
    res.pointList.forEach(doc => {
      apPntTotal = apPntTotal + doc.apPnt;
      cePntTotal = cePntTotal + doc.cePnt;
      adPntTotal = adPntTotal + doc.adPnt;
      cpPntTotal = cpPntTotal + doc.cpPnt;
      giPntTotal = giPntTotal + doc.giPnt;
      plusPntTotal = plusPntTotal + doc.plusPnt;
      miunsPntTotal = miunsPntTotal + doc.miunsPnt;
    });

    setApPntTotal(total.totalApPnt);
    setAdPntTotal(total.totalAdPnt);
    setCpPntTotal(total.totalCpPnt);
    setCePntTotal(total.totalCePnt);
    setGiPntTotal(total.totalGiPnt);
    setPlusPntTotal(total.totalPlusPnt);
    setMinusPntTotal(total.totalMiunsPnt);
    setPointList(res.pointList);
  };

  const searchIt = () => {
    navi(`${thisLocation.pathname}?start=${startDate}&end=${endDate}`);
  };

  const changeMonth = month => {
    const today = new Date();
    const beforeDate = new Date();
    beforeDate.setMonth(today.getMonth() - month);
    setStartDate(dayjs(beforeDate).format("YYYY-MM-DD"));
    setEndDate(dayjs(today).format("YYYY-MM-DD"));
  };

  return (
    <>
      <h2 className="text-3xl font-extra mb-5">일일 포인트 내역</h2>
      <form
        onSubmit={e => {
          e.preventDefault();
          searchIt();
        }}
      >
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

            <button
              className="bg-success hover:bg-opacity-80 text-white px-4 p-2 whitespace-nowrap"
              type="submit"
            >
              검색
            </button>

            <button
              className="bg-white hover:bg-opacity-50 text-black border px-4 p-2 whitespace-nowrap"
              type="button"
              onClick={() => navi(`${thisLocation.pathname}`)}
            >
              초기화
            </button>
          </div>
        </div>
      </form>
      {pointList.length > 0 && (
        <table id="totalPointList">
          <thead>
            <tr>
              <th className="bg-stone-600 text-white">날짜</th>
              <th className="bg-green-600 text-white">관리자 지급</th>
              <th className="bg-green-600 text-white">구매 취소</th>
              <th className="bg-green-600 text-white">총 지급포인트</th>
              <th className="bg-rose-600 text-white">관리자 차감</th>
              <th className="bg-rose-600 text-white">쿠폰 구매</th>
              <th className="bg-rose-600 text-white">쿠폰 선물</th>
              <th className="bg-rose-600 text-white">총 차감포인트</th>
            </tr>
            <tr id="total">
              <th className="bg-[#f0f8ff] text-center">합계</th>
              <th className="bg-[#f0f8ff] text-center">
                {apPntTotal.toLocaleString()} p
              </th>
              <th className="bg-[#f0f8ff] text-center">
                {cePntTotal.toLocaleString()} p
              </th>
              <th className="bg-[#f0f8ff] text-center">
                {plusPntTotal.toLocaleString()} p
              </th>
              <th className="bg-[#f0f8ff] text-center">
                {adPntTotal.toLocaleString()} p
              </th>
              <th className="bg-[#f0f8ff] text-center">
                {cpPntTotal.toLocaleString()} p
              </th>
              <th className="bg-[#f0f8ff] text-center">
                {giPntTotal.toLocaleString()} p
              </th>
              <th className="bg-[#f0f8ff] text-center">
                {miunsPntTotal.toLocaleString()} p
              </th>
            </tr>
          </thead>
          <tbody>
            {pointList.map((point, idx) => (
              <tr key={idx}>
                <td className="center">
                  {point.regDate
                    ? dayjs(point.regDate).format("YYYY-MM-DD")
                    : ""}
                </td>
                <td className="center">
                  {point.apPnt ? point.apPnt.toLocaleString() : 0} p
                </td>
                <td className="center">
                  {point.cePnt ? point.cePnt.toLocaleString() : 0} p
                </td>
                <td className="center">
                  {point.plusPnt ? point.plusPnt.toLocaleString() : 0} p
                </td>
                <td className="center">
                  {point.adPnt ? point.adPnt.toLocaleString() : 0} p
                </td>
                <td className="center">
                  {point.cpPnt ? point.cpPnt.toLocaleString() : 0} p
                </td>
                <td className="center">
                  {point.giPnt ? point.giPnt.toLocaleString() : 0} p
                </td>
                <td className="center">
                  {point.miunsPnt ? point.miunsPnt.toLocaleString() : 0} p
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default AdminPointList;
