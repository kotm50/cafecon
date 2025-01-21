import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadFile from "../../Components/UploadFile";
import Modal from "../Modal";
import { smsAuth, smsCert } from "../../Api/Auth";
import { deleteFile, kyApi, uploadFile } from "../../Api/Api";
//import PopupDom from "../../Api/Kakao/PopupDom";
//import PopupPostCode from "../../Api/Kakao/PopupPostCode";
//import PropTypes from "prop-types";
import DocModal from "../DocModal";

function EditUser(props) {
  const navi = useNavigate();
  const [beforeData, setBeforeData] = useState(null);
  const [beforeFile, setBeforeFile] = useState(null);
  const [id, setId] = useState("");
  const [managerName, setManagerName] = useState("");

  //const [mainAddr, setMainAddr] = useState("주소찾기를 눌러주세요");
  //const [sido, setSido] = useState("");
  // const [sigungu, setSigungu] = useState("");
  const [phone, setPhone] = useState("");
  const [phoneChk, setPhoneChk] = useState(false);
  const [phoneCert, setPhoneCert] = useState("");
  const [phoneCertChk, setPhoneCertChk] = useState(false);

  const [correctEmail2, setCorrectEmail2] = useState(true);
  const [marketingAgree, setMarketingAgree] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [businessNo, setBusinessNo] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessFile, setBusinessFile] = useState("");

  const [modalOn, setModalOn] = useState(false);
  const [modalType, setModalType] = useState(0);

  const [docModalOn, setDocModalOn] = useState(false);
  const [docModalCount, setDocModalCount] = useState(0);

  //const [birth, setBirth] = useState("2000-01-01");
  //const [gender, setGender] = useState("여자");
  /*
  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);


  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };

  */
  useEffect(() => {
    getUserInfo();
  }, []);

  const getUserInfo = async () => {
    const data = {
      userId: props.login.userId,
    };
    const res = await kyApi
      .post("/api/v1/cafecon/user/find/one", { json: data })
      .json();
    console.log(res);
    setBeforeData(res.user);
    setId(res.user.userId);
    setManagerName(res.user.managerName);
    setPhone(res.user.phone);
    //setMainAddr(res.user.address);

    setBusinessName(res.user.businessName);
    setBusinessNo(res.user.businessNo);
    setBusinessEmail(res.user.businessEmail);
    setBeforeFile(res.user.businessLicense);
    setMarketingAgree(res.user.agreeMarketing === "Y");
  };

  const modify = async e => {
    e.preventDefault();
    console.log(e);
  };

  //이메일 및 중복검사
  const chkEmail = async () => {
    setCorrectEmail2(true);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (businessEmail) {
      if (emailPattern.test(businessEmail)) {
        setCorrectEmail2(true);
      } else {
        setCorrectEmail2(false);
      }
    }
  };
  return (
    <>
      <div className="w-full max-w-[600px] mx-auto">
        <form onSubmit={e => modify(e)}>
          <div className="flex flex-col gap-y-4 mb-5">
            <div className="w-full border-y lg:border-x p-4 bg-white lg:rounded lg:shadow-lg flex flex-col gap-y-4">
              <h3 className="font-extra">
                기본정보 <span className="text-red-500">(필수)</span>
              </h3>
              <div
                id="id"
                className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border`}
              >
                <div className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100">
                  <div>아이디</div>
                </div>
                <div className="lg:col-span-4">
                  <div className="p-2 text-sm">{id || "　"}</div>
                </div>
              </div>
              <div
                id="pwd"
                className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border`}
              >
                <div className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100">
                  <div>비밀번호</div>
                </div>
                <div className="lg:col-span-4 grid grid-cols-3 gap-1">
                  <div className="col-span-2">
                    <div className="p-2 text-sm bg-gray-100">
                      비밀번호 변경 버튼을 눌러주세요
                    </div>
                  </div>
                  <div>
                    <button
                      className="w-full h-full p-2 text-white bg-blue-600 hover:bg-opacity-80 text-sm"
                      onClick={e => {
                        e.preventDefault();
                        setModalOn(true);
                        setModalType("password");
                      }}
                    >
                      비밀번호변경
                    </button>
                  </div>
                </div>
              </div>
              <div
                id="managerName"
                className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border`}
              >
                <label
                  htmlFor="inputName"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>이름</div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputName"
                    autoCapitalize="none"
                    className={`border lg:border-0 p-2 w-full text-sm`}
                    value={managerName}
                    onChange={e => {
                      setManagerName(e.currentTarget.value);
                    }}
                    onBlur={e => {
                      setManagerName(e.currentTarget.value);
                    }}
                    placeholder="이름을 입력하세요"
                    autoComplete="off"
                  />
                </div>
              </div>
              <div
                id="Phone"
                className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
              >
                <label
                  htmlFor="inputPhone"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>휴대폰</div>
                </label>
                <div className="lg:col-span-4 grid grid-cols-3 gap-1">
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="inputPhone"
                      className={`border lg:border-0 p-2 w-full text-sm`}
                      value={phone}
                      placeholder="'-' 없이 11자리 숫자만 입력해 주세요"
                      onChange={e => setPhone(e.currentTarget.value)}
                      onBlur={e => setPhone(e.currentTarget.value)}
                    />
                  </div>
                  <div>
                    <button
                      className="w-full h-full p-2 text-white bg-green-600 hover:bg-opacity-80 text-sm"
                      onClick={e => {
                        e.preventDefault();
                        getCert();
                      }}
                    >
                      인증번호 발송
                    </button>
                  </div>
                </div>
              </div>
              {phoneChk && (
                <div
                  id="PhoneCert"
                  className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
                >
                  <label
                    htmlFor="inputPhoneCert"
                    className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                  >
                    <div>인증번호</div>
                  </label>
                  <div className="lg:col-span-4 grid grid-cols-3 gap-1">
                    <div className="col-span-2">
                      <input
                        type="text"
                        id="inputPhoneCert"
                        className={`border lg:border-0 p-2 w-full text-sm`}
                        value={phoneCert}
                        placeholder="인증번호를 입력해 주세요"
                        onChange={e => setPhoneCert(e.currentTarget.value)}
                        onBlur={e => setPhoneCert(e.currentTarget.value)}
                      />
                    </div>
                    <div>
                      <button
                        className={`w-full h-full p-2 text-white ${
                          !phoneCertChk
                            ? "bg-sky-500 hover:bg-opacity-80"
                            : "bg-gray-500"
                        } text-sm`}
                        onClick={e => {
                          e.preventDefault();
                          chkCert();
                        }}
                        disabled={phoneCertChk}
                      >
                        {phoneCertChk ? "인증완료" : "인증번호 확인"}
                      </button>
                    </div>
                  </div>
                </div>
              )}
              {/*
              <div
                id="mainAddr"
                className="grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border hidden"
              >
                <label
                  htmlFor="inputMainAddr"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>주소</div>
                </label>
                <div className="lg:col-span-4 grid grid-cols-3 gap-1">
                  <div className="col-span-2">
                    <input
                      type="text"
                      id="inputMainAddr"
                      className={`border lg:border-0 p-2 w-full text-sm ${
                        mainAddr === "주소찾기를 눌러주세요"
                          ? "text-stone-500"
                          : undefined
                      }`}
                      value={mainAddr}
                      onChange={e => setMainAddr(e.currentTarget.value)}
                      onBlur={e => setMainAddr(e.currentTarget.value)}
                      disabled
                    />
                  </div>
                  <div>
                    <button
                      className="w-full h-full p-2 text-white bg-amber-600 hover:bg-opacity-80 text-sm"
                      onClick={e => {
                        e.preventDefault();
                        openPostCode();
                      }}
                    >
                      주소찾기
                    </button>
                  </div>
                </div>
              </div>

              <div
                id="birth"
                className={`hidden grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border`}
              >
                <label
                  htmlFor="inputBirth"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>생년월일</div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="date"
                    id="inputBirth"
                    autoCapitalize="none"
                    className={`border lg:border-0 p-2 w-full text-sm`}
                    value={birth}
                    onChange={e => {
                      setBirth(e.currentTarget.value);
                    }}
                    onBlur={e => {
                      setBirth(e.currentTarget.value);
                    }}
                    autoComplete="off"
                  />
                </div>
              </div>
              <div
                id="gender"
                className={`grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border hidden`}
              >
                <div className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100">
                  <div>성별</div>
                </div>
                <div className="lg:col-span-4 flex justify-start gap-x-4 items-center">
                  <div className="flex items-center gap-x-2 p-2">
                    <input
                      id="gender-female"
                      type="radio"
                      value="여자"
                      name="gender"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={gender === "여자"}
                      onChange={e => setGender(e.currentTarget.value)}
                    />
                    <label
                      htmlFor="gender-female"
                      className="text-sm break-keep"
                    >
                      여자
                    </label>
                  </div>
                  <div className="flex items-center gap-x-2 p-2">
                    <input
                      id="gender-male"
                      type="radio"
                      value="남자"
                      name="gender"
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-2"
                      checked={gender === "남자"}
                      onChange={e => setGender(e.currentTarget.value)}
                    />
                    <label htmlFor="gender-male" className="text-sm break-keep">
                      남자
                    </label>
                  </div>
                </div>
              </div>
*/}
            </div>
          </div>
          <div className="w-full border-y lg:border-x p-4 bg-white lg:rounded lg:shadow-lg flex flex-col gap-y-4  mb-5">
            <h3 className="font-extra">
              사업자 정보 <span className="text-gray-500">(선택)</span>{" "}
              {/* <span className="text-xs">세금계산서 발행 등에 필요합니다</span> */}
            </h3>
            <div
              id="businessNo"
              className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
            >
              <label
                htmlFor="inputBusinessNo"
                className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
              >
                <div>사업자번호</div>
              </label>
              <div className="lg:col-span-4">
                <input
                  type="text"
                  id="inputBusinessNo"
                  autoCapitalize="none"
                  className={`border lg:border-0 p-2 w-full text-sm`}
                  value={businessNo}
                  onChange={e => {
                    setBusinessNo(e.currentTarget.value);
                  }}
                  onBlur={e => {
                    setBusinessNo(e.currentTarget.value);
                  }}
                  placeholder="'-' 없이 10자리 숫자만 입력해 주세요"
                  autoComplete="off"
                />
              </div>
            </div>
            <div
              id="businessName"
              className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
            >
              <label
                htmlFor="inputBusiness"
                className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
              >
                <div>사업자명</div>
              </label>
              <div className="lg:col-span-4">
                <input
                  type="text"
                  id="inputBusiness"
                  autoCapitalize="none"
                  className={`border lg:border-0 p-2 w-full text-sm`}
                  value={businessName}
                  onChange={e => {
                    setBusinessName(e.currentTarget.value);
                  }}
                  onBlur={e => {
                    setBusinessName(e.currentTarget.value);
                  }}
                  placeholder="사업자명을 입력해 주세요"
                  autoComplete="off"
                />
              </div>
            </div>
            <div
              id="businessEmail"
              className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
            >
              <label
                htmlFor="inputBusinessEmail"
                className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
              >
                <div>사업자이메일</div>
              </label>
              <div className="lg:col-span-4">
                <input
                  type="text"
                  id="inputBusinessEmail"
                  autoCapitalize="none"
                  className={`border lg:border-0 p-2 w-full text-sm`}
                  value={businessEmail}
                  onChange={e => {
                    setBusinessEmail(e.currentTarget.value);
                  }}
                  onBlur={e => {
                    setBusinessEmail(e.currentTarget.value);
                    chkEmail();
                  }}
                  placeholder="사업자용 이메일이 있다면 추가로 입력해주세요"
                  autoComplete="off"
                />
              </div>
            </div>
            {!correctEmail2 && (
              <div className="text-sm text-rose-500">
                이메일 양식이 잘못되었습니다. <br className="block lg:hidden" />
                확인 후 다시 입력해 주세요
              </div>
            )}

            <div
              id="businessFile"
              className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
            >
              <div className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100">
                <div>사업자등록증</div>
              </div>
              <div className="lg:col-span-4">
                <UploadFile file={businessFile} setFile={setBusinessFile} />
              </div>
            </div>
          </div>

          <div
            data="광고성 정보수신"
            className="flex flex-col gap-y-0 border-y lg:border-x lg:shadow-lg bg-white"
          >
            <div id="marketing" className="flex justify-between pr-10">
              <label
                htmlFor="agreeMarketing"
                className="text-sm text-left pl-4 py-2 col-span-6 text-stone-700"
              >
                마케팅 및 이벤트 정보수신에 동의합니다
              </label>
              <div className="flex justify-end gap-x-2">
                <button
                  className="text-blue-500 hover:text-violet-700 p-2 text-sm w-full"
                  onClick={e => {
                    e.preventDefault();
                    setDocModalCount(5);
                    setDocModalOn(true);
                  }}
                >
                  상세보기
                </button>
                <div className="flex flex-col justify-center">
                  <input
                    type="checkbox"
                    id="agreeMarketing"
                    className="w-[16px] h-[16px]"
                    onChange={() => setMarketingAgree(!marketingAgree)}
                    checked={marketingAgree}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="w-full text-center flex justify-center gap-x-4 mt-4 mb-5">
            <button
              className="bg-blue-600 hover:bg-opacity-80 py-2 px-4 text-white rounded w-fit"
              type="submit"
            >
              회원가입
            </button>
            <button
              className="border bg-white hover:bg-gray-100 py-2 px-4 rounded w-fit"
              type="button"
              onClick={() => {
                navi("/");
              }}
            >
              취소
            </button>
          </div>
        </form>
      </div>

      {/*
      <div id="popupDom" className={isPopupOpen ? "popupModal" : undefined}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode
              onClose={closePostCode}
              setMainAddr={setMainAddr}
              setSido={setSido}
              setSigungu={setSigungu}
              modify={false}
            />
          </PopupDom>
        )}
      </div>
*/}
      {docModalOn ? (
        <DocModal
          modalCount={docModalCount}
          setModalOn={setDocModalOn}
          setModalCount={setDocModalCount}
        />
      ) : null}

      {modalOn ? (
        <Modal
          modalOn={modalOn}
          modalType={modalType}
          setModalOn={setModalOn}
          setModalType={setModalType}
          login={props.login}
        />
      ) : null}
    </>
  );
}

EditUser.propTypes = {
  login: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }).isRequired,
};

export default EditUser;
