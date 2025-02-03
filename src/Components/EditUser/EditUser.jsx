import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import UploadFile from "../../Components/UploadFile";
import Modal from "../Modal";
import { smsAuth, smsCert } from "../../Api/Auth";
import { deleteFile, kyApi, uploadFile, useLogout } from "../../Api/Api";
import PopupDom from "../../Api/Kakao/PopupDom";
import PopupPostCode from "../../Api/Kakao/PopupPostCode";
import PropTypes from "prop-types";
import DocModal from "../DocModal";

function EditUser(props) {
  const navi = useNavigate();
  const logout = useLogout();
  const [submitNow, setSubmitNow] = useState(false);
  const [beforeData, setBeforeData] = useState(null);
  const [beforeFile, setBeforeFile] = useState(null);
  const [id, setId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [fileName, setFileName] = useState("");
  const [businessAddress, setBusinessAddress] =
    useState("주소찾기를 눌러주세요");

  const [phone, setPhone] = useState("");
  const [phoneChk, setPhoneChk] = useState(false);
  const [phoneCert, setPhoneCert] = useState("");
  const [phoneCertChk, setPhoneCertChk] = useState(false);

  const [correctEmail2, setCorrectEmail2] = useState(true);
  const [marketingAgree, setMarketingAgree] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [businessNo, setBusinessNo] = useState("");
  const [businessStatus, setBusinessStatus] = useState("");
  const [businessSector, setBusinessSector] = useState("");
  const [errNo, setErrNo] = useState(true);
  const [businessEmail, setBusinessEmail] = useState("");
  const [businessFile, setBusinessFile] = useState("");

  const [modalOn, setModalOn] = useState(false);
  const [modalType, setModalType] = useState(0);

  const [docModalOn, setDocModalOn] = useState(false);
  const [docModalCount, setDocModalCount] = useState(0);

  //const [birth, setBirth] = useState("2000-01-01");
  //const [gender, setGender] = useState("여자");

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

  useEffect(() => {
    getUserInfo();
    //eslint-disable-next-line
  }, []);

  const getUserInfo = async () => {
    const data = {
      userId: props.login.userId,
    };
    const res = await kyApi
      .post("/api/v1/cafecon/user/find/one", { json: data })
      .json();
    if (res.code === "E403") {
      logout();
      return false;
    }
    setBeforeData(res.user);
    setId(res.user.userId || "");
    setManagerName(res.user.managerName || "");
    setPhone(res.user.phone || "");
    setOwnerName(res.user.ownerName || "");
    setBusinessStatus(res.user.businessStatus || "");
    setBusinessSector(res.user.businessSector || "");
    setBusinessAddress(res.user.businessAddress || "주소찾기를 눌러주세요");
    setBusinessName(res.user.businessName || "");
    setBusinessNo(res.user.businessNo || "");
    setBusinessEmail(res.user.businessEmail || "");
    setBeforeFile(res.user.businessLicense || "");
    setMarketingAgree(res.user.agreeMarketing === "Y");
    setFileName(res.user.businessLicenseName || "");
  };

  const modify = async e => {
    e.preventDefault();
    setSubmitNow(true);
    const data = await chkData();
    if (Object.keys(data).length === 0) {
      return alert("수정된 내용이 없습니다. 확인 후 다시 시도해 주세요");
    }
    data.userId = props.login.userId;
    data.userPwd = props.userPwd;
    const res = await kyApi
      .put("/api/v1/cafecon/user/edit", { json: data })
      .json();
    if (res.code === "C000") {
      if (beforeData.businessLicense !== data.businessLicense) {
        if (data.businessLicense) await deleteFile(beforeData.businessLicense);
      }
      alert("수정되었습니다");
      navi("/");
    } else if (res.code === "E403") {
      logout();
    } else {
      alert("수정 실패. 다시 시도해 주세요");
    }
    setSubmitNow(false);
  };

  const chkData = async () => {
    const data = {};
    if (phone !== beforeData.phone && phoneCertChk) data.phone = phone;
    if (beforeData.businessName !== businessName)
      data.businessName = businessName;
    if (beforeData.businessEmail !== businessEmail)
      data.businessEmail = businessEmail;
    if (beforeData.businessNo !== businessNo) {
      if (errNo) data.businessNo = businessNo;
    }
    if (businessFile) {
      data.businessLicense = await uploadFile(businessFile, "company");
      data.businessLicenseName = fileName;
    }
    const marketing = marketingAgree ? "Y" : "N";
    if (marketing !== beforeData.agreeMarketing)
      data.agreeMarketing = marketing;
    if (beforeData.businessStatus !== businessStatus)
      data.businessStatus = businessStatus;
    if (beforeData.businessSector !== businessSector)
      data.businessSector = businessSector;
    if (beforeData.businessAddress !== businessAddress)
      data.businessAddress = businessAddress;
    return data;
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

  const getCert = async () => {
    if (!phone || phone.length !== 11) {
      return alert("휴대폰 번호를 정확히 입력해 주세요");
    }
    if (phone === beforeData.phone) {
      return alert("이전 휴대폰 번호와 동일합니다");
    }
    setPhoneCertChk(false);
    setPhoneCert("");
    const res = await smsAuth(managerName, phone);
    if (res.code === "C000") {
      setPhoneChk(true);
    } else {
      return alert(
        "인증번호 발송 실패. 이름과 휴대폰 번호를 확인해 주세요\n같은 현상이 반복되면 고객센터 1644-4223 으로 문의해 주세요"
      );
    }
  };

  const chkCert = async () => {
    const res = await smsCert(managerName, phone, phoneCert);
    if (res.code === "C000") {
      setPhoneCertChk(true);
    } else {
      return alert(
        "인증번호 확인 실패. 인증번호를 확인해 주세요\n같은 현상이 반복되면 고객센터 1644-4223 으로 문의해 주세요"
      );
    }
  };

  const handleBusinessNo = e => {
    const inputValue = e.target.value;

    // 숫자만 허용 (정규식 사용)
    if (/^\d*$/.test(inputValue)) {
      setBusinessNo(inputValue); // 숫자만 입력 가능
    }
  };

  const chkBusinessNo = e => {
    const value = e.target.value;
    if (value.length === 10) {
      setErrNo(true);
    } else {
      setErrNo(false);
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
                <div className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100">
                  <div>이름</div>
                </div>
                <div className="lg:col-span-4">
                  <div className="p-2 text-sm">{managerName || "　"}</div>
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
                      value={phone || ""}
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
                        value={phoneCert || ""}
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
                    value={birth || "" }
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
              사업자 정보
              {/* <span className="text-xs">세금계산서 발행 등에 필요합니다</span> */}
            </h3>

            <div
              id="businessNo"
              className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border ${
                !errNo && "lg:border-red-500"
              }`}
            >
              <label
                htmlFor="inputBusinessNo"
                className={`text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 ${
                  errNo ? "lg:bg-gray-100" : "lg:bg-red-100"
                } `}
              >
                <div>사업자번호</div>
              </label>
              <div className="lg:col-span-4">
                <input
                  type="text"
                  id="inputBusinessNo"
                  autoCapitalize="none"
                  className={`border ${
                    !errNo && "lg:border-red-500"
                  } lg:border-0 p-2 w-full text-sm`}
                  value={businessNo}
                  onFocus={() => {
                    setErrNo(true);
                  }}
                  onChange={handleBusinessNo}
                  onBlur={chkBusinessNo}
                  placeholder="'-' 없이 10자리 숫자만 입력해 주세요"
                  autoComplete="off"
                />
              </div>
            </div>
            {!errNo && (
              <div className="text-sm text-rose-500">
                사업자번호 양식이 잘못되었습니다.{" "}
                <br className="block lg:hidden" />
                확인 후 다시 입력해 주세요
              </div>
            )}
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
                  value={businessName || ""}
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
              id="ownerName"
              className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border`}
            >
              <label
                htmlFor="inputOwnerName"
                className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
              >
                <div>대표자명</div>
              </label>
              <div className="lg:col-span-4">
                <input
                  type="text"
                  id="inputOwnerName"
                  autoCapitalize="none"
                  className={`border lg:border-0 p-2 w-full text-sm`}
                  value={ownerName}
                  onChange={e => {
                    setOwnerName(e.currentTarget.value);
                  }}
                  onBlur={e => {
                    setOwnerName(e.currentTarget.value);
                  }}
                  placeholder="미입력시 회원 성함이 대표자명이 됩니다"
                  autoComplete="off"
                />
              </div>
            </div>
            <div
              id="businessAddress"
              className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
            >
              <label
                htmlFor="inputMainAddr"
                className="text-sm text-left lg:text-right flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100 flex"
              >
                <div>사업장 주소</div>
              </label>
              <div className="lg:col-span-4 grid grid-cols-3 gap-1">
                <div className="col-span-2" title={businessAddress}>
                  <input
                    type="text"
                    id="inputMainAddr"
                    className={`border lg:border-0 p-2 w-full text-sm ${
                      businessAddress === "주소찾기를 눌러주세요"
                        ? "text-stone-500"
                        : ""
                    }`}
                    value={businessAddress}
                    onChange={e => setBusinessAddress(e.currentTarget.value)}
                    onBlur={e => setBusinessAddress(e.currentTarget.value)}
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
                  value={businessEmail || ""}
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
              id="bstatus"
              className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
            >
              <label
                htmlFor="inputStatus"
                className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
              >
                <div>업태</div>
              </label>
              <div className="lg:col-span-4">
                <input
                  type="text"
                  id="inputStatus"
                  autoCapitalize="none"
                  className={`border lg:border-0 p-2 w-full text-sm`}
                  value={businessStatus}
                  onChange={e => {
                    setBusinessStatus(e.currentTarget.value);
                  }}
                  onBlur={e => {
                    setBusinessStatus(e.currentTarget.value);
                  }}
                  placeholder="업태를 입력해 주세요"
                  autoComplete="off"
                />
              </div>
            </div>

            <div
              id="bsector"
              className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
            >
              <label
                htmlFor="inputSector"
                className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
              >
                <div>업종</div>
              </label>
              <div className="lg:col-span-4">
                <input
                  type="text"
                  id="inputSector"
                  autoCapitalize="none"
                  className={`border lg:border-0 p-2 w-full text-sm`}
                  value={businessSector}
                  onChange={e => {
                    setBusinessSector(e.currentTarget.value);
                  }}
                  onBlur={e => {
                    setBusinessSector(e.currentTarget.value);
                  }}
                  placeholder="업종을 입력해 주세요"
                  autoComplete="off"
                />
              </div>
            </div>
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
              {beforeFile && (
                <>
                  <div className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"></div>
                  <div className="lg:col-span-4 p-2">
                    <a
                      href={beforeFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" text-xs p-2 bg-blue-100 block w-fit"
                    >
                      이전 사업자등록증 확인
                    </a>
                  </div>
                </>
              )}
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
              disabled={submitNow}
            >
              정보수정
            </button>
            <button
              className="border bg-white hover:bg-gray-100 py-2 px-4 rounded w-fit"
              type="button"
              disabled={submitNow}
              onClick={() => {
                navi(-1);
              }}
            >
              취소
            </button>
          </div>
        </form>
      </div>
      <div id="popupDom" className={isPopupOpen ? "popupModal" : undefined}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode
              onClose={closePostCode}
              setMainAddr={setBusinessAddress}
              modify={false}
            />
          </PopupDom>
        )}
      </div>
      *
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
          setUserPwd={props.setUserPwd}
        />
      ) : null}
    </>
  );
}

EditUser.propTypes = {
  login: PropTypes.shape({
    userId: PropTypes.string.isRequired,
  }).isRequired,
  userPwd: PropTypes.string.isRequired,
  setUserPwd: PropTypes.func.isRequired,
};

export default EditUser;
