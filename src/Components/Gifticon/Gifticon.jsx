import PropTypes from "prop-types";
import { useState } from "react";

function Gifticon(props) {
  const [phone, setPhone] = useState("");
  const handlePhoneChange = e => {
    const value = e.currentTarget.value;

    // 숫자만 허용 (정규식으로 숫자가 아닌 문자 모두 제거)
    const numberOnly = value.replace(/[^0-9]/g, "");

    if (numberOnly.length > 11) {
      alert("휴대폰 번호는 11자리를 초과할 수 없습니다.");
      return; // 이전 값 유지
    }

    setPhone(numberOnly);
  };
  return (
    <>
      <div className="w-full text-sm p-4">
        <h2 className="text-lg font-bold">상품발송</h2>
        <div className="flex flex-col gap-y-2 p-2 w-full">
          <div className="flex gap-x-2 w-full">
            <p className="p-1 whitespace-nowrap w-[10%] text-right">번호 1</p>
            <input
              type="text"
              id="inputPhone"
              className={`border text-sm w-[80%] p-1`}
              value={phone}
              placeholder="'-' 없이 11자리 숫자만 입력해 주세요"
              onChange={handlePhoneChange}
            />
            <div className="w-[10%] font-bold p-1">전송 중</div>
          </div>
        </div>
        <div className="w-full flex flex-center gap-x-[1%] mt-2 pt-2 border-t">
          <button className="w-[60%] bg-blue-600 hover:bg-opacity-80 p-2 text-white rounded">
            상품발송
          </button>
          <button
            className="w-[39%] bg-white border hover:bg-opacity-80 p-2 rounded"
            onClick={() => {
              props.setModalType("");
              props.setModalOn(false);
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
};

export default Gifticon;
