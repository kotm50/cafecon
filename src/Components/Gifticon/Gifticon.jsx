import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { kyApi } from "../../Api/Api";
import { useDispatch } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

function Gifticon({ setModalType, setModalOn, buyIt, user, goodsPrice }) {
  const dispatch = useDispatch();
  useEffect(() => {
    setSendNum(user.phone);
  }, [user]);
  const [sending, setSending] = useState(false);
  const [sendNum, setSendNum] = useState("");
  const [phoneCount, setPhoneCount] = useState(1);
  const [phone1, setPhone1] = useState({
    num: "",
    stat: "대기중",
    memo: "",
  });
  const [phone2, setPhone2] = useState({
    num: "",
    stat: "대기중",
    memo: "",
  });
  const [phone3, setPhone3] = useState({
    num: "",
    stat: "대기중",
    memo: "",
  });
  const [phone4, setPhone4] = useState({
    num: "",
    stat: "대기중",
    memo: "",
  });
  const [phone5, setPhone5] = useState({
    num: "",
    stat: "대기중",
    memo: "",
  });

  const handlePhoneChange = (index, value) => {
    if (index === 1) {
      setPhone1({ num: value, stat: phone1.stat, memo: phone1.memo });
    } else if (index === 2) {
      setPhone2({ num: value, stat: phone2.stat, memo: phone2.memo });
    } else if (index === 3) {
      setPhone3({ num: value, stat: phone3.stat, memo: phone3.memo });
    } else if (index === 4) {
      setPhone4({ num: value, stat: phone4.stat, memo: phone4.memo });
    } else if (index === 5) {
      setPhone5({ num: value, stat: phone5.stat, memo: phone5.memo });
    }
  };

  const handleMemoChange = (index, value) => {
    if (index === 1) {
      setPhone1({ num: phone1.num, stat: phone1.stat, memo: value });
    } else if (index === 2) {
      setPhone2({ num: phone2.num, stat: phone2.stat, memo: value });
    } else if (index === 3) {
      setPhone3({ num: phone3.num, stat: phone3.stat, memo: value });
    } else if (index === 4) {
      setPhone4({ num: phone4.num, stat: phone4.stat, memo: value });
    } else if (index === 5) {
      setPhone5({ num: phone5.num, stat: phone5.stat, memo: value });
    }
  };

  const removePhoneNumber = () => {
    if (phoneCount === 1) {
      alert("최소 1개 이상 입력해야 합니다.");
    } else if (phoneCount < 5) {
      setPhone5({ num: "", stat: "대기중" });
    } else if (phoneCount < 4) {
      setPhone4({ num: "", stat: "대기중" });
    } else if (phoneCount < 3) {
      setPhone3({ num: "", stat: "대기중" });
    } else if (phoneCount < 2) {
      setPhone2({ num: "", stat: "대기중" });
    } else if (phoneCount < 1) {
      setPhone1({ num: "", stat: "대기중" });
    }
    setPhoneCount(phoneCount - 1);
    if (phoneCount <= 1) setPhoneCount(1);
  };

  const buyAll = async () => {
    if (goodsPrice * phoneCount > user.point) {
      alert("포인트가 부족합니다");
      return false;
    }
    if (phone1.num === "") {
      alert("번호를 입력해 주세요");
      return false;
    }
    if (phoneCount > 1 && phone2.num === "") {
      alert("두번째 번호를 입력해 주세요");
      return false;
    }
    if (phoneCount > 2 && phone3.num === "") {
      alert("세번째 번호를 입력해 주세요");
      return false;
    }
    if (phoneCount > 3 && phone4.num === "") {
      alert("네번째 번호를 입력해 주세요");
      return false;
    }
    if (phoneCount > 4 && phone5.num === "") {
      alert("다섯번째 번호를 입력해 주세요");
      return false;
    }
    setSending(true);
    const phoneList = [];
    const completeList = [];
    const errList = [];
    phoneList.push({ num: phone1.num, idx: 1, memo: phone1.memo });
    if (phoneCount > 1)
      phoneList.push({ num: phone2.num, idx: 2, memo: phone2.memo });
    if (phoneCount > 2)
      phoneList.push({ num: phone3.num, idx: 3, memo: phone3.memo });
    if (phoneCount > 3)
      phoneList.push({ num: phone4.num, idx: 4, memo: phone4.memo });
    if (phoneCount > 4)
      phoneList.push({ num: phone5.num, idx: 5, memo: phone5.memo });
    for (const num of phoneList) {
      if (num.idx === 1)
        setPhone1({ num: num.num, stat: "전송중", memo: num.memo });
      if (num.idx === 2)
        setPhone2({ num: num.num, stat: "전송중", memo: num.memo });
      if (num.idx === 3)
        setPhone3({ num: num.num, stat: "전송중", memo: num.memo });
      if (num.idx === 4)
        setPhone4({ num: num.num, stat: "전송중", memo: num.memo });
      if (num.idx === 5)
        setPhone5({ num: num.num, stat: "전송중", memo: num.memo });
      const res = await buyIt(sendNum, num.num, num.memo);

      if (res === "완료") {
        if (num.idx === 1)
          setPhone1({ num: num.num, stat: "완료", memo: num.memo });
        if (num.idx === 2)
          setPhone2({ num: num.num, stat: "완료", memo: num.memo });
        if (num.idx === 3)
          setPhone3({ num: num.num, stat: "완료", memo: num.memo });
        if (num.idx === 4)
          setPhone4({ num: num.num, stat: "완료", memo: num.memo });
        if (num.idx === 5)
          setPhone5({ num: num.num, stat: "완료", memo: num.memo });
        completeList.push(num.num);
      } else if (res === "로그아웃") {
        setModalType(""); // ✅ 로그아웃 시 모달 닫기
        setModalOn(false);
        break;
      } else {
        if (num.idx === 1)
          setPhone1({ num: num.num, stat: "실패", memo: num.memo });
        if (num.idx === 2)
          setPhone2({ num: num.num, stat: "실패", memo: num.memo });
        if (num.idx === 3)
          setPhone3({ num: num.num, stat: "실패", memo: num.memo });
        if (num.idx === 4)
          setPhone4({ num: num.num, stat: "실패", memo: num.memo });
        if (num.idx === 5)
          setPhone5({ num: num.num, stat: "실패", memo: num.memo });
        errList.push(num.num);
      }
    }

    const point = await kyApi.get("/api/v1/cafecon/common/exper_cookie").json();
    dispatch(loginUser({ point: point.point }));

    if (phoneList.length === completeList.length) {
      alert("모든 번호로 발송되었습니다");
      setModalType("");
      setModalOn(false);
    }
    if (errList.length > 0) {
      alert(errList.join(",") + "번호는 발송에 실패했습니다.");
    }
    setSending(false);
  };

  return (
    <>
      <div className="w-full text-sm p-4">
        <h2 className="text-lg font-bold">상품발송</h2>
        <div className="flex flex-col gap-y-4 p-2 w-full">
          <div className="flex gap-x-2 w-full">
            <p className="p-1 whitespace-nowrap w-[15%] text-right">발신번호</p>
            <input
              type="text"
              id="phone"
              className="border border-gray-300 text-sm w-[85%] p-1"
              value={sendNum}
              placeholder="'-' 없이 숫자만 입력해 주세요"
              onChange={e => setSendNum(e.target.value)}
            />
          </div>
          <div className="flex gap-x-2 w-full">
            <p className="p-1 whitespace-nowrap w-[15%] text-right">
              수신번호 1
            </p>
            <input
              type="text"
              id="phone1"
              className="border  border-gray-300 text-sm w-[30%] p-1"
              value={phone1.num}
              placeholder="'-' 없이 숫자만 입력"
              onChange={e => handlePhoneChange(1, e.target.value)}
            />
            <input
              type="text"
              id="memo1"
              className="border  border-gray-300 text-sm w-[30%] p-1"
              value={phone1.memo}
              placeholder="고객 성함 등 간단메모"
              onChange={e => handleMemoChange(1, e.target.value)}
            />
            <div className="w-[10%] font-bold p-1 text-center">
              {phone1.stat}
            </div>
          </div>
          {phoneCount > 1 && (
            <div className="flex gap-x-2 w-full">
              <p className="p-1 whitespace-nowrap w-[15%] text-right">
                수신번호 2
              </p>
              <input
                type="text"
                id="phone2"
                className="border  border-gray-300 text-sm w-[30%] p-1"
                value={phone2.num}
                placeholder="'-' 없이 숫자만 입력해 주세요"
                onChange={e => handlePhoneChange(2, e.target.value)}
              />
              <input
                type="text"
                id="memo2"
                className="border  border-gray-300 text-sm w-[30%] p-1"
                value={phone2.memo}
                placeholder="고객 성함 등 간단메모"
                onChange={e => handleMemoChange(2, e.target.value)}
              />
              <div className="w-[10%] font-bold p-1 text-center">
                {phone2.stat}
              </div>
              {!sending && phoneCount === 2 && (
                <button
                  className="whitespace-nowrap text-red-500 p-1"
                  onClick={() => removePhoneNumber()}
                >
                  삭제
                </button>
              )}
            </div>
          )}

          {phoneCount > 2 && (
            <div className="flex gap-x-2 w-full">
              <p className="p-1 whitespace-nowrap w-[15%] text-right">
                수신번호 3
              </p>
              <input
                type="text"
                id="phone3"
                className="border  border-gray-300 text-sm w-[30%] p-1"
                value={phone3.num}
                placeholder="'-' 없이 숫자만 입력해 주세요"
                onChange={e => handlePhoneChange(3, e.target.value)}
              />
              <input
                type="text"
                id="memo3"
                className="border  border-gray-300 text-sm w-[30%] p-1"
                value={phone3.memo}
                placeholder="고객 성함 등 간단메모"
                onChange={e => handleMemoChange(3, e.target.value)}
              />
              <div className="w-[10%] font-bold p-1 text-center">
                {phone3.stat}
              </div>
              {!sending && phoneCount === 3 && (
                <button
                  className="whitespace-nowrap text-red-500 p-1"
                  onClick={() => removePhoneNumber()}
                >
                  삭제
                </button>
              )}
            </div>
          )}

          {phoneCount > 3 && (
            <div className="flex gap-x-2 w-full">
              <p className="p-1 whitespace-nowrap w-[15%] text-right">
                수신번호 4
              </p>
              <input
                type="text"
                id="phone4"
                className="border  border-gray-300 text-sm w-[30%] p-1"
                value={phone4.num}
                placeholder="'-' 없이 숫자만 입력해 주세요"
                onChange={e => handlePhoneChange(4, e.target.value)}
              />
              <input
                type="text"
                id="memo4"
                className="border  border-gray-300 text-sm w-[30%] p-1"
                value={phone4.memo}
                placeholder="고객 성함 등 간단메모"
                onChange={e => handleMemoChange(4, e.target.value)}
              />
              <div className="w-[10%] font-bold p-1 text-center">
                {phone4.stat}
              </div>
              {!sending && phoneCount === 4 && (
                <button
                  className="whitespace-nowrap text-red-500 p-1"
                  onClick={() => removePhoneNumber()}
                >
                  삭제
                </button>
              )}
            </div>
          )}

          {phoneCount > 4 && (
            <div className="flex gap-x-2 w-full">
              <p className="p-1 whitespace-nowrap w-[15%] text-right">
                수신번호 5
              </p>
              <input
                type="text"
                id="phone5"
                className="border  border-gray-300 text-sm w-[30%] p-1"
                value={phone5.num}
                placeholder="'-' 없이 숫자만 입력해 주세요"
                onChange={e => handlePhoneChange(5, e.target.value)}
              />
              <input
                type="text"
                id="memo5"
                className="border  border-gray-300 text-sm w-[30%] p-1"
                value={phone5.memo}
                placeholder="고객 성함 등 간단메모"
                onChange={e => handleMemoChange(5, e.target.value)}
              />
              <div className="w-[10%] font-bold p-1 text-center">
                {phone5.stat}
              </div>
              {!sending && phoneCount === 5 && (
                <button
                  className="whitespace-nowrap text-red-500 p-1"
                  onClick={() => removePhoneNumber()}
                >
                  삭제
                </button>
              )}
            </div>
          )}
          <button
            className="border border-dashed border-blue-600 text-blue-600 hover:bg-blue-100 p-2 mt-2"
            onClick={() => {
              if (phoneCount < 5) {
                setPhoneCount(phoneCount + 1);
              } else {
                alert("최대 5개까지 추가할 수 있습니다.");
              }
            }}
          >
            번호 추가
          </button>
        </div>
        <div className="w-full flex flex-center gap-x-[1%] mt-2 pt-2 border-t">
          <button
            className="w-[30%] bg-blue-600 hover:bg-opacity-80 p-2 text-white rounded"
            onClick={() => buyAll()}
          >
            상품발송
          </button>
          <button
            className="w-[39%] bg-white border hover:bg-opacity-80 p-2 rounded"
            onClick={() => {
              setModalType("");
              setModalOn(false);
            }}
          >
            취소
          </button>
        </div>
      </div>
    </>
  );
}

Gifticon.propTypes = {
  setModalType: PropTypes.func.isRequired,
  setModalOn: PropTypes.func.isRequired,
  buyIt: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  goodsPrice: PropTypes.number,
};

export default Gifticon;
