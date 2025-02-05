import { useEffect, useState } from "react";
import "./User.css";
import { kyApi } from "../../Api/Api";
import dayjs from "dayjs";
import { useLocation, useNavigate } from "react-router-dom";
import AdminModal from "../../Components/AdminModal";
import Pagenation from "../../Components/Pagenation";
import queryString from "query-string";

function AdminUserList() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  const parsed = queryString.parse(thisLocation.search);
  const page = parsed.page || 1;
  const size = parsed.size || 20;
  const stype = parsed.stype || "";
  const keyword = parsed.userkeyword || "";
  const [userList, setUserList] = useState([]);
  const [last, setLast] = useState(1);
  const [modalOn, setModalOn] = useState(false);

  const [userInfo, setUserInfo] = useState(null);
  const [searchType, setSearchType] = useState("");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    setSearchKeyword(keyword);
    setSearchType(stype);
    getUserList();
    //eslint-disable-next-line
  }, [thisLocation]);

  const getUserList = async () => {
    const data = {
      page: page,
      size: size,
    };

    if (keyword) data.searchKeyword = keyword;
    if (stype) data.searchType = stype;
    const res = await kyApi
      .post("/api/v1/cafecon/user/find/all", { json: data })
      .json();
    console.log(res);
    setUserList(res.cafeconUserList);
    setLast(res.totalPages);
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

    if (newType === "businessNo" || newType === "phone") {
      setSearchKeyword(searchKeyword.replace(/\D/g, "")); // 숫자만 남기기
    }
  };

  const searchIt = () => {
    if (!searchType && !searchKeyword) {
      navi(`${thisLocation.pathname}`);
      return true;
    }
    if (!searchType) return alert("검색 유형을 선택하세요");
    if (!searchKeyword) return alert("검색어를 입력하세요");
    navi(
      `${thisLocation.pathname}?userkeyword=${searchKeyword}&stype=${searchType}`
    );
  };

  return (
    <>
      <h2 className="text-3xl font-extra mb-5">회원목록</h2>

      <form
        onSubmit={e => {
          e.preventDefault();
          searchIt();
        }}
      >
        <div className="flex flex-row justify-start gap-x-2 mb-5 w-[50%]">
          <select
            className="py-2 pl-2 pr-8 border border-[#ccc] rounded-sm"
            value={searchType}
            onChange={handleType}
          >
            <option value="">검색유형</option>
            <option value="userId">아이디</option>
            <option value="managerName">담당자</option>
            <option value="phone">연락처</option>
            <option value="businessNo">사업자번호</option>
            <option value="businessName">사업자명</option>
            <option value="businessEmail">이메일</option>
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
            className="bg-success hover:bg-opacity-80 text-white px-4 py-2 whitespace-nowrap"
            type="submit"
          >
            검색
          </button>

          <button
            className="py-2 px-4 bg-gray-200 border border-gray-300 hover:bg-opacity-50 whitespace-nowrap"
            type="button"
            onClick={() => navi(`${thisLocation.pathname}`)}
          >
            초기화
          </button>
        </div>
      </form>
      {userList.length > 0 && (
        <table id="userList">
          <thead>
            <tr>
              <th className="hidden">가입일시</th>
              <th>아이디</th>
              <th>이름</th>
              <th>연락처</th>
              <th>사업자번호</th>
              <th>사업자명</th>
              <th>이메일</th>
              <th>보유포인트</th>
              <th>포인트지급</th>
            </tr>
          </thead>
          <tbody>
            {userList.map((user, idx) => (
              <tr key={idx}>
                <td className="hidden">
                  {user.regDate
                    ? dayjs(user.regDate).format("YYYY-MM-DD HH:mm")
                    : ""}
                </td>
                <td className="center">{user.userId || ""}</td>
                <td className="center">{user.managerName || ""}</td>
                <td className="center">{user.phone || ""}</td>
                <td className="center">{user.businessNo || ""}</td>
                <td className="center">{user.businessName || ""}</td>
                <td>{user.businessEmail || ""}</td>
                <td className="right">
                  {user.point ? user.point.toLocaleString() : 0}P
                </td>
                <td className="center">
                  <button
                    className="py-2 px-4 bg-gray-200 border border-gray-500 hover:bg-opacity-50"
                    onClick={() => {
                      setModalOn(true);
                      setUserInfo(user);
                    }}
                  >
                    포인트 내역
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {userList && userList.length > 0 ? (
        <div className="my-10">
          <Pagenation last={last} />
        </div>
      ) : null}
      <AdminModal
        modalOn={modalOn}
        setModalOn={setModalOn}
        userInfo={userInfo}
        getUserList={getUserList}
      />
    </>
  );
}

export default AdminUserList;
