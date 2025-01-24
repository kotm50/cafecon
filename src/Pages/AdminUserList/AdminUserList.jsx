import { useEffect, useState } from "react";
import "./User.css";
import { kyApi } from "../../Api/Api";
import dayjs from "dayjs";
import { useLocation } from "react-router-dom";
import Modal from "../../Components/Modal";
import Pagenation from "../../Components/Pagenation";

function AdminUserList() {
  const thisLocation = useLocation();
  const [userList, setUserList] = useState([]);
  const [last, setLast] = useState(1);
  const [modalOn, setModalOn] = useState(false);
  const [modalType, setModalType] = useState("");
  const [userInfo, setUserInfo] = useState(null);

  useEffect(() => {
    getUserList();
    //eslint-disable-next-line
  }, [thisLocation]);

  const getUserList = async () => {
    const data = {
      page: 1,
      size: 20,
    };
    const res = await kyApi
      .post("/api/v1/cafecon/user/find/all", { json: data })
      .json();
    console.log(res);
    setUserList(res.cafeconUserList);
    setLast(res.totalPages);
  };
  return (
    <>
      <div className="w-full max-w-[1240px] p-5 bg-white mx-auto">
        <h2 className="text-3xl font-extra mb-5">회원목록</h2>
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
                        setModalType("userPoint");
                        setUserInfo(user);
                      }}
                    >
                      지급/차감
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
      </div>
      <Modal
        modalOn={modalOn}
        setModalOn={setModalOn}
        modalType={modalType}
        setModalType={setModalType}
        userInfo={userInfo}
        getUserList={getUserList}
      />
    </>
  );
}

export default AdminUserList;
