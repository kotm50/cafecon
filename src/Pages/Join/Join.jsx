import DocModal from "../../Components/DocModal";
import PopupDom from "../../Api/Kakao/PopupDom";
import PopupPostCode from "../../Api/Kakao/PopupPostCode";
import { useState } from "react";
import UploadFile from "../../Components/UploadFile";
import { useNavigate } from "react-router-dom";
import { smsAuth, smsCert } from "../../Api/Auth";
import { deleteFile, kyApi, uploadFile } from "../../Api/Api";
import { Helmet } from "react-helmet";

function Join() {
  const navi = useNavigate();
  const [submitNow, setSubmitNow] = useState(false);
  const [id, setId] = useState("");
  const [managerName, setManagerName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [correctId, setCorrectId] = useState(true);
  const [dupId, setDupId] = useState(true);
  const [correctPwdChk, setCorrectPwdChk] = useState(true);
  const [correctPwd, setCorrectPwd] = useState(true);

  const [fileName, setFileName] = useState("");

  const [pwdMsg, setPwdMsg] = useState("");
  const [businessAddress, setBusinessAddress] =
    useState("주소찾기를 눌러주세요");
  const [phone, setPhone] = useState("");
  const [phoneChk, setPhoneChk] = useState(false);
  const [phoneCert, setPhoneCert] = useState("");
  const [phoneCertChk, setPhoneCertChk] = useState(false);
  const [correctEmail2, setCorrectEmail2] = useState(true);

  const [agreeAll, setAgreeAll] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [priAgree, setPriAgree] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [businessNo, setBusinessNo] = useState("");
  const [businessStatus, setBusinessStatus] = useState("");
  const [businessSector, setBusinessSector] = useState("");
  const [errNo, setErrNo] = useState(true);
  const [businessEmail, setBusinessEmail] = useState("");
  const [companyFile, setCompanyFile] = useState("");

  const [modalOn, setModalOn] = useState(false);
  const [modalCount, setModalCount] = useState(0);

  const [birth, setBirth] = useState("2000-01-01");
  const [gender, setGender] = useState("여자");

  // 팝업창 상태 관리
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  /*
  const uploadTest = async () => {
    const url = await uploadFile(companyFile, "company");
    setFileUrl(url);
  };

  const deleteTest = async () => {
    const code = await deleteFile(fileUrl, "company");
    if (code === "C000") setFileUrl("");
  };
  */

  const join = async e => {
    e.preventDefault();
    setSubmitNow(true);
    const { data, result } = await getData();
    if (result !== "완료") {
      return alert(result);
    }
    const res = await kyApi
      .post("/api/v1/cafecon/user/join", {
        json: data,
      })
      .json();
    console.log("입력내용", data);
    console.log("결과", res);
    if (res.code !== "C000") {
      if (data.businessLicense)
        await deleteFile(data.businessLicense, "company");
      return alert(res.message);
    } else {
      alert("회원가입이 완료되었습니다");
      navi("/user/login?route=main");
    }
    setSubmitNow(false);
  };

  const getData = async () => {
    const data = {};
    if (!termsAgree) return { data, result: "이용약관에 동의해 주세요" };
    if (!priAgree)
      return { data, result: "개인정보 수집 및 이용에 동의해 주세요" };
    if (!id) return { data, result: "아이디를 입력해 주세요" };
    if (!correctId) return { data, result: "아이디 양식이 잘못되었습니다" };
    if (!dupId) return { data, result: "사용중인 아이디 입니다" };
    if (!managerName) return { data, result: "이름을 입력해 주세요" };
    if (!companyName) {
      return {
        data,
        result:
          "업체명 단체(회사)명을 입력해 주세요\n지점이 있을 경우 지점명까지 입력해 주세요.",
      };
    }
    if (!pwd) return { data, result: "비밀번호를 입력해 주세요" };
    if (!correctPwd) return { data, result: "비밀번호 양식이 잘못되었습니다" };
    if (!pwdChk) return { data, result: "비밀번호를 한번 더 입력해 주세요" };
    if (!correctPwdChk) return { data, result: "비밀번호가 일치하지 않습니다" };
    if (!phone) return { data, result: "휴대폰 번호를 입력해 주세요" };
    if (!phoneCertChk) return { data, result: "휴대폰 인증을 완료해 주세요" };

    //if (!gender) return { data, result: "성별을 선택해 주세요" };
    if (!birth) return { data, result: "생년월일을 입력해 주세요" };
    if (!businessAddress) return { data, result: "주소를 입력해 주세요" };
    if (!errNo) return { data, result: "사업자번호 양식을 확인해 주세요" };
    if (!businessName) return { data, result: "사업자명을 입력해 주세요" };
    if (!businessStatus) return { data, result: "업태를 입력해 주세요" };
    if (!businessSector) return { data, result: "업종을 입력해 주세요" };
    if (!businessEmail) return { data, result: "이메일을 입력해 주세요" };
    if (!companyFile)
      return { data, result: "사업자등록증을 업로드 해 주세요" };
    data.userId = id;
    data.managerName = managerName;
    data.userPwd = pwd;
    data.phone = phone;
    data.companyName = companyName;
    data.businessAddress = businessAddress;
    //data.birth = birth;
    //data.gender = gender;
    data.agreeTerms = "Y";
    data.agreePrivacy = "Y";
    data.agreeMarketing = marketingAgree ? "Y" : "N";

    data.businessName = businessName;
    data.businessNo = businessNo;
    data.businessEmail = businessEmail;
    data.businessLicense = await uploadFile(companyFile, "company");

    data.businessStatus = businessStatus;
    data.businessSector = businessSector;
    data.ownerName = ownerName || managerName;

    data.businessLicenseName = fileName;
    //data.point = 1000;
    return { data, result: "완료" };
  };

  //비밀번호 너무 길게쓰면 오류
  const pwdAlert = () => {
    alert("비밀번호는 20자를 넘길 수 없습니다");
  };

  //비밀번호 양식 확인
  const testPwd = () => {
    setPwdMsg("");
    const regex = /^(?=.*[a-zA-Z])(?=.*[0-9!@#$%^&*]).{2,}$/;
    let correct = regex.test(pwd);
    if (correct) {
      if (pwd.length > 7) {
        if (pwd.length > 20) {
          setPwdMsg("비밀번호는 최대 20자 입니다");
          setCorrectPwd(false);
          return false;
        }
        setCorrectPwd(true);
        return true;
      } else {
        setPwdMsg("비밀번호는 8자 이상입니다");
        setCorrectPwd(false);
        return false;
      }
    } else {
      setPwdMsg("영어/숫자/특수문자 중 2가지 이상 포함해야 합니다");
      setCorrectPwd(false);
      return false;
    }
  };

  //비밀번호 일치 확인
  const chkPwd = () => {
    if (pwd !== pwdChk) {
      setCorrectPwdChk(false);
    } else {
      setCorrectPwdChk(true);
    }
  };

  //아이디 유효성 및 중복검사
  const chkId = async () => {
    setCorrectId(true);
    if (id.length < 17) {
      setDupId(true);
      const regex = /^[a-z]+([0-9]+[a-z]*)*$/;
      let correct = regex.test(id);
      if (correct) {
        setCorrectId(true);
        const res = await kyApi
          .post("/api/v1/cafecon/user/check/id", {
            json: { userId: id },
          })
          .json();
        if (res.code !== "C000") setDupId(false);
      } else {
        setCorrectId(false);
      }
    } else {
      setCorrectId(false);
    }
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
  // 팝업창 열기
  const openPostCode = () => {
    setIsPopupOpen(true);
  };

  // 팝업창 닫기
  const closePostCode = () => {
    setIsPopupOpen(false);
  };
  const handleAgreeAll = () => {
    if (agreeAll) {
      setAgreeAll(false);
      setTermsAgree(false);
      setPriAgree(false);
      setMarketingAgree(false);
    } else {
      setAgreeAll(true);
      setTermsAgree(true);
      setPriAgree(true);
      setMarketingAgree(true);
    }
  };

  const getCert = async () => {
    if (!id) {
      return alert("아이디를 입력해 주세요");
    }
    if (!correctId) {
      return alert("아이디 양식이 잘못되었습니다");
    }
    if (!dupId) {
      return alert("사용중인 아이디 입니다");
    }
    if (!managerName) {
      return alert("이름을 입력해 주세요");
    }
    if (!phone) {
      return alert("휴대폰 번호를 입력해 주세요");
    }
    setPhoneCertChk(false);
    setPhoneCert("");
    const dup = await checkDupPhone(phone);
    if (!dup)
      return alert(
        "이미 가입한 연락처 입니다. 다른 번호를 입력해 주세요\n가입한 연락처가 아닐 경우 고객센터에 연락해 주세요"
      );
    const res = await smsAuth(managerName, phone);
    if (res.code === "C000") {
      setPhoneChk(true);
    } else {
      return alert(
        "인증번호 발송 실패. 이름과 휴대폰 번호를 확인해 주세요\n같은 현상이 반복되면 고객센터 1644-4223 으로 문의해 주세요"
      );
    }
  };

  const checkDupPhone = async phone => {
    const data = {
      phone,
    };

    const res = await kyApi
      .post("/api/v1/cafecon/user/dupCheck/phone", { json: data })
      .json();
    if (res === "C000") {
      return true;
    } else {
      return false;
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

  const handlePhoneNo = e => {
    const inputValue = e.target.value;

    // 숫자만 허용 (정규식 사용)
    if (/^\d*$/.test(inputValue)) {
      setPhone(inputValue); // 숫자만 입력 가능
    }
  };

  const chkBusinessNo = e => {
    const value = e.target.value;
    if (value.length === 10) {
      setBusinessNo(value); // 숫자만 입력 가능
      setErrNo(true);
    } else {
      setErrNo(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>카페콘닷컴 회원가입</title>
      </Helmet>
      <h2 className="text-center mt-[40px] mb-[20px] text-3xl font-extra">
        회원가입
      </h2>
      <div className="w-full max-w-[600px] mx-auto">
        <form onSubmit={e => join(e)}>
          <div className="flex flex-col gap-y-4">
            <div
              data="이용약관"
              className="flex flex-col gap-y-0 border-y lg:border-x lg:shadow-lg"
            >
              <div className="border rounded-t px-2 bg-white">
                <div
                  id="allAgree"
                  className="flex justify-between pr-10 w-full"
                >
                  <label
                    htmlFor="agreeAll"
                    className="text-sm font-neoextra text-left flex flex-col justify-center pl-2 py-2 col-span-6"
                  >
                    모두 동의합니다 (선택포함)
                  </label>
                  <div className="flex flex-col justify-center">
                    <input
                      type="checkbox"
                      id="agreeAll"
                      className="w-[16px] h-[16px]"
                      onChange={handleAgreeAll}
                      checked={agreeAll}
                    />
                  </div>
                </div>
              </div>
              <div
                id="agree"
                className="p-2 bg-gray-100 grid grid-cols-1 rounded-b"
              >
                <div id="terms" className="flex justify-between pr-10">
                  <label
                    htmlFor="agreeTerms"
                    className="text-xs text-left pl-2 py-2 col-span-5 text-stone-700"
                  >
                    이용약관에 동의합니다{" "}
                    <span className="text-red-500">(필수)</span>
                  </label>
                  <div className="flex justify-end gap-x-2">
                    <button
                      className="text-blue-500 hover:text-violet-700 p-2 text-xs w-full"
                      onClick={e => {
                        e.preventDefault();
                        setModalCount(2);
                        setModalOn(true);
                      }}
                    >
                      상세보기
                    </button>
                    <div className="flex flex-col justify-center">
                      <input
                        type="checkbox"
                        id="agreeTerms"
                        className="w-[16px] h-[16px]"
                        onChange={() => setTermsAgree(!termsAgree)}
                        checked={termsAgree}
                      />
                    </div>
                  </div>
                </div>
                <div id="private" className="flex justify-between pr-10">
                  <label
                    htmlFor="agreePrivate"
                    className="text-xs text-left pl-2 py-2 col-span-5 text-stone-700 whitespace-nowrap"
                  >
                    개인정보 수집 및 이용에 동의합니다{" "}
                    <span className="text-red-500">(필수)</span>
                  </label>

                  <div className="flex justify-end gap-x-2">
                    <button
                      className="text-blue-500 hover:text-violet-700 p-2 text-xs w-full"
                      onClick={e => {
                        e.preventDefault();
                        setModalCount(4);
                        setModalOn(true);
                      }}
                    >
                      상세보기
                    </button>
                    <div className="flex flex-col justify-center">
                      <input
                        type="checkbox"
                        id="agreePrivate"
                        className="w-[16px] h-[16px]"
                        onChange={() => setPriAgree(!priAgree)}
                        checked={priAgree}
                      />
                    </div>
                  </div>
                </div>
                <div id="marketing" className="flex justify-between pr-10">
                  <label
                    htmlFor="agreeMarketing"
                    className="text-xs text-left pl-2 py-2 col-span-6 text-stone-700"
                  >
                    마케팅 및 이벤트 정보수신에 동의합니다 (선택)
                  </label>
                  <div className="flex justify-end gap-x-2">
                    <button
                      className="text-blue-500 hover:text-violet-700 p-2 text-xs w-full"
                      onClick={e => {
                        e.preventDefault();
                        setModalCount(5);
                        setModalOn(true);
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
            </div>
            <div className="w-full border-y lg:border-x p-4 bg-white lg:rounded lg:shadow-lg flex flex-col gap-y-4">
              <h3 className="font-extra">기본정보</h3>
              <div
                id="id"
                className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border ${
                  !correctId || (!dupId && "lg:border-red-500")
                }`}
              >
                <label
                  htmlFor="inputId"
                  className={`text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 ${
                    correctId || !dupId ? "lg:bg-gray-100" : "lg:bg-red-100"
                  } `}
                >
                  <div>아이디</div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputId"
                    autoCapitalize="none"
                    className={`border ${
                      !correctId || (!dupId ? "lg:border-red-500" : "")
                    } lg:border-0 p-2 w-full text-sm`}
                    value={id}
                    onChange={e => {
                      setId(e.currentTarget.value);
                    }}
                    onBlur={e => {
                      setId(e.currentTarget.value);
                      if (id !== "") chkId();
                    }}
                    placeholder="영문 소문자와 숫자만 사용 가능합니다."
                    autoComplete="off"
                  />
                </div>
              </div>
              {!correctId && (
                <div className="text-sm text-rose-500">
                  아이디 양식이 잘못되었습니다.{" "}
                  <br className="block lg:hidden" />
                  확인 후 다시 입력해 주세요
                </div>
              )}
              {!dupId && (
                <div className="text-sm text-rose-500">
                  사용중인 아이디 입니다. <br className="block lg:hidden" />
                  확인 후 다시 입력해 주세요
                </div>
              )}
              <div
                id="pwd"
                className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border ${
                  !correctPwd ? "lg:border-red-500" : null
                }`}
              >
                <label
                  htmlFor="inputPwd"
                  className={`text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 ${
                    correctPwd ? "lg:bg-gray-100" : "lg:bg-red-100"
                  } `}
                >
                  <div>비밀번호</div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="password"
                    id="inputPwd"
                    className={`border ${
                      !correctPwd ? "border-red-500" : ""
                    } lg:border-0 p-2 w-full text-sm`}
                    value={pwd}
                    onChange={e => {
                      if (e.currentTarget.value.length > 20) {
                        pwdAlert();
                        setPwd(e.currentTarget.value.substring(0, 20));
                      } else {
                        setPwd(e.currentTarget.value);
                      }
                    }}
                    onBlur={e => {
                      if (e.currentTarget.value.length > 20) {
                        pwdAlert();
                        setPwd(e.currentTarget.value.substring(0, 20));
                      } else {
                        setPwd(e.currentTarget.value);
                      }
                      if (pwd !== "") testPwd();
                    }}
                    placeholder="8자 이상(영어/숫자/특수문자 중 2가지 이상 포함)"
                    autoComplete="off"
                  />
                </div>
              </div>
              {!correctPwd && (
                <div className="text-sm text-rose-500">{pwdMsg}</div>
              )}
              <div
                id="pwdChk"
                className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border ${
                  !correctPwdChk ? "lg:border-red-500" : ""
                }`}
              >
                <label
                  htmlFor="inputPwdChk"
                  className={`text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 ${
                    correctPwdChk ? "lg:bg-gray-100" : "lg:bg-red-100"
                  } `}
                >
                  비밀번호확인
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="password"
                    id="inputPwdChk"
                    className={`border ${
                      !correctPwdChk ? "border-red-500" : ""
                    } lg:border-0 p-2 w-full text-sm`}
                    value={pwdChk}
                    onChange={e => {
                      if (e.currentTarget.value.length > 20) {
                        pwdAlert();
                        setPwdChk(e.currentTarget.value.substring(0, 20));
                      } else {
                        setPwdChk(e.currentTarget.value);
                      }
                    }}
                    onBlur={e => {
                      if (e.currentTarget.value.length > 20) {
                        pwdAlert();
                        setPwdChk(e.currentTarget.value.substring(0, 20));
                      } else {
                        setPwdChk(e.currentTarget.value);
                      }
                      chkPwd();
                    }}
                    placeholder="비밀번호를 한번 더 입력해 주세요"
                    autoComplete="off"
                  />
                </div>
              </div>
              {!correctPwdChk && (
                <div className="text-sm text-rose-500">
                  비밀번호가 일치하지 않습니다{" "}
                  <br className="block lg:hidden" />
                  확인 후 다시 입력해 주세요
                </div>
              )}
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
                id="companyName"
                className={`grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border`}
              >
                <label
                  htmlFor="inputCName"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>업체명</div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputCName"
                    autoCapitalize="none"
                    className={`border lg:border-0 p-2 w-full text-sm`}
                    value={companyName}
                    onChange={e => {
                      setCompanyName(e.currentTarget.value);
                    }}
                    onBlur={e => {
                      setCompanyName(e.currentTarget.value);
                    }}
                    placeholder="지점이 있을 경우 지점명까지."
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
                      onChange={handlePhoneNo}
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
                    <div className="col-span-2" title={businessAddress}>
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
            </div>
            <div className="w-full border-y lg:border-x p-4 bg-white lg:rounded lg:shadow-lg flex flex-col gap-y-4">
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
                id="company"
                className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
              >
                <label
                  htmlFor="inputCompany"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>사업자명</div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputCompany"
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
                id="companyEmail"
                className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
              >
                <label
                  htmlFor="inputCompanyEmail"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>사업자이메일</div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputCompanyEmail"
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
                    placeholder="이메일을 입력해주세요"
                    autoComplete="off"
                  />
                </div>
              </div>
              {!correctEmail2 && (
                <div className="text-sm text-rose-500">
                  이메일 양식이 잘못되었습니다.{" "}
                  <br className="block lg:hidden" />
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
                id="companyFile"
                className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
              >
                <div className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100">
                  <div>사업자등록증</div>
                </div>
                <div className="lg:col-span-4">
                  <UploadFile
                    file={companyFile}
                    setFile={setCompanyFile}
                    setFileName={setFileName}
                  />
                </div>
              </div>
            </div>
            <div className="w-full text-center flex justify-center gap-x-4 mt-4 mb-10">
              <button
                className="bg-blue-600 hover:bg-opacity-80 py-2 px-4 text-white rounded w-fit"
                type="submit"
                disabled={submitNow}
              >
                회원가입
              </button>
              <button
                className="border bg-white hover:bg-gray-100 py-2 px-4 rounded w-fit"
                type="button"
                disabled={submitNow}
                onClick={() => {
                  navi("/");
                }}
              >
                취소
              </button>
            </div>
          </div>
        </form>
      </div>

      <div id="popupDom" className={isPopupOpen ? "popupModal" : ""}>
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

      {modalOn ? (
        <DocModal
          modalCount={modalCount}
          setModalOn={setModalOn}
          setModalCount={setModalCount}
        />
      ) : null}
    </>
  );
}

export default Join;
