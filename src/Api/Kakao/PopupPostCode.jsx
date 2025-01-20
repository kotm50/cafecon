import PropTypes from "prop-types";
import DaumPostcode from "react-daum-postcode";

const PopupPostCode = props => {
  // 우편번호 검색 후 주소 클릭 시 실행될 함수, data callback 용
  const handlePostCode = data => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress +=
          extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }
    if (props.modify) {
      props.editIt("/api/v1/user/myinfo/editaddr", "mainAddr", fullAddress);
      props.setMainAddr(fullAddress);
      props.setSido(data.sido);
      props.setSigungu(data.sigungu);
    } else {
      props.setMainAddr(fullAddress);
      props.setSido(data.sido);
      props.setSigungu(data.sigungu);
    }
    props.onClose();
  };
  return (
    <>
      <div
        id="addrAPI"
        className="fixed top-0 botton-0 w-full h-full lg:w-[600px] lg:h-fit lg:min-h-[480px] bg-white border drop-shadow-md rounded lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 z-[1001]"
      >
        <DaumPostcode className="addrAPIInput" onComplete={handlePostCode} />
        <button
          type="button"
          onClick={() => {
            props.onClose();
          }}
          className="postCode_btn bg-rose-500 text-white py-2 w-full mt-1"
        >
          닫기
        </button>
      </div>
      <div className="opacity-25 fixed inset-0 z-[1000] bg-black h-screen overflow-hidden"></div>
    </>
  );
};

PopupPostCode.propTypes = {
  modify: PropTypes.bool,
  editIt: PropTypes.func,
  setMainAddr: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  isEmploy: PropTypes.string,
  setSido: PropTypes.func,
  setSigungu: PropTypes.func,
};

export default PopupPostCode;
