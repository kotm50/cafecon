import DocModal from "../../Components/DocModal";
import PopupDom from "../../Api/Kakao/PopupDom";
import PopupPostCode from "../../Api/Kakao/PopupPostCode";
import { useState } from "react";
import UploadFile from "../../Components/UploadFile";
import { useNavigate } from "react-router-dom";
//import { kyApi } from "../../Api/Api";

function Join() {
  const navi = useNavigate();
  const [id, setId] = useState("");
  const [pwd, setPwd] = useState("");
  const [pwdChk, setPwdChk] = useState("");
  const [correctId, setCorrectId] = useState(true);
  const [dupId, setDupId] = useState(true);
  const [correctPwdChk, setCorrectPwdChk] = useState(true);
  const [correctPwd, setCorrectPwd] = useState(true);

  const [pwdMsg, setPwdMsg] = useState("");
  const [mainAddr, setMainAddr] = useState("주소찾기를 눌러주세요");
  const [phone, setPhone] = useState("");
  const [phoneCert, setPhoneCert] = useState("");
  const [email, setEmail] = useState("");
  const [dupEmail, setDupEmail] = useState(true);
  const [correctEmail, setCorrectEmail] = useState(true);
  const [correctEmail2, setCorrectEmail2] = useState(true);

  const [agreeAll, setAgreeAll] = useState(false);
  const [termsAgree, setTermsAgree] = useState(false);
  const [priAgree, setPriAgree] = useState(false);
  const [marketingAgree, setMarketingAgree] = useState(false);

  const [company, setCompany] = useState("");
  const [companyNum, setCompanyNum] = useState("");
  const [taxEmail, setTaxEmail] = useState("");
  const [companyFile, setCompanyFile] = useState("");

  const [modalOn, setModalOn] = useState(false);
  const [modalCount, setModalCount] = useState(0);

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

  const join = e => {
    e.preventDefault();
    console.log(e);
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
      } else {
        setCorrectId(false);
      }
    } else {
      setCorrectId(false);
    }
  };
  //이메일 및 중복검사
  const chkEmail = async () => {
    setCorrectEmail(true);
    setCorrectEmail2(true);
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (email) {
      if (emailPattern.test(email)) {
        setCorrectEmail(true);
      } else {
        setCorrectEmail(false);
      }
    }
    if (taxEmail) {
      if (emailPattern.test(taxEmail)) {
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

  const getCert = () => {
    console.log("인증번호 발송");
  };

  const chkCert = () => {
    console.log("인증번호 확인");
  };

  return (
    <>
      <h2 className="text-center mt-[100px] mb-[20px] text-3xl font-extra">
        회원가입
      </h2>
      <div className="w-full max-w-[600px] mx-auto">
        <div className="text-xs text-right px-1">
          <span className="text-red-500">*</span>는 필수 입력 항목입니다
        </div>

        <form onSubmit={e => join(e)}>
          <div className="flex flex-col gap-y-4">
            <div
              data="이용약관"
              className="flex flex-col gap-y-0 border shadow-lg"
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
                    className="text-sm text-left pl-2 py-2 col-span-5 text-stone-700"
                  >
                    이용약관에 동의합니다 (필수)
                    <span className="text-red-500">*</span>
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
                    className="text-sm text-left pl-2 py-2 col-span-5 text-stone-700 whitespace-nowrap"
                  >
                    개인정보 수집 및 이용에 동의합니다 (필수)
                    <span className="text-red-500">*</span>
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
                    className="text-sm text-left pl-2 py-2 col-span-6 text-stone-700"
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
            <div className="w-full border p-4 bg-white rounded shadow-lg flex flex-col gap-y-4">
              <h3>기본정보</h3>
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
                  <div>
                    아이디<span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputId"
                    autoCapitalize="none"
                    className={`border ${
                      !correctId || (!dupId ? "lg:border-red-500" : undefined)
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
                  <div>
                    비밀번호<span className="text-red-500">*</span>
                  </div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="password"
                    id="inputPwd"
                    className={`border ${
                      !correctPwd ? "border-red-500" : undefined
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
                  !correctPwdChk ? "lg:border-red-500" : undefined
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
                      !correctPwdChk ? "border-red-500" : undefined
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
                id="mainAddr"
                className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
              >
                <label
                  htmlFor="inputMainAddr"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>주소</div>
                </label>
                <div className="lg:col-span-4 grid grid-cols-3 gap-1">
                  <div className="col-span-2" title={mainAddr}>
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
                  <div className="col-span-2" title={mainAddr}>
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
                  <div className="col-span-2" title={mainAddr}>
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
                      className="w-full h-full p-2 text-white bg-sky-500 hover:bg-opacity-80 text-sm"
                      onClick={e => {
                        e.preventDefault();
                        chkCert();
                      }}
                    >
                      휴대폰 인증하기
                    </button>
                  </div>
                </div>
              </div>
              <div
                id="email"
                className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
              >
                <label
                  htmlFor="inputEmail"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  이메일
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputEmail"
                    className="border lg:border-0 p-2 w-full text-sm"
                    value={email}
                    onChange={e => {
                      setEmail(e.currentTarget.value);
                      setCorrectEmail(true);
                      setDupEmail(true);
                    }}
                    onBlur={e => {
                      setEmail(e.currentTarget.value);
                      chkEmail();
                    }}
                    placeholder="이메일 주소를 입력하세요"
                  />
                </div>
              </div>

              {!correctEmail && (
                <div className="text-sm text-rose-500">
                  이메일 양식이 잘못되었습니다.{" "}
                  <br className="block lg:hidden" />
                  확인 후 다시 입력해 주세요
                </div>
              )}

              {!dupEmail && (
                <div className="text-sm text-rose-500">
                  사용중인 이메일 입니다. <br className="block lg:hidden" />
                  확인 후 다시 입력해 주세요
                </div>
              )}
            </div>
            <div className="w-full border p-4 bg-white rounded shadow-lg flex flex-col gap-y-4">
              <h3>
                사업자 정보{" "}
                <span className="text-xs">
                  (세금계산서 발행 등에 필요합니다)
                </span>
              </h3>
              <div
                id="companyNum"
                className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
              >
                <label
                  htmlFor="inputCompanyNum"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>사업자번호</div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputCompanyNum"
                    autoCapitalize="none"
                    className={`border lg:border-0 p-2 w-full text-sm`}
                    value={companyNum}
                    onChange={e => {
                      setCompanyNum(e.currentTarget.value);
                    }}
                    onBlur={e => {
                      setCompanyNum(e.currentTarget.value);
                    }}
                    placeholder="'-' 없이 10자리 숫자만 입력해 주세요"
                    autoComplete="off"
                  />
                </div>
              </div>
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
                    value={company}
                    onChange={e => {
                      setCompany(e.currentTarget.value);
                    }}
                    onBlur={e => {
                      setCompany(e.currentTarget.value);
                    }}
                    autoComplete="off"
                  />
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
                  <div>계산서이메일</div>
                </label>
                <div className="lg:col-span-4">
                  <input
                    type="text"
                    id="inputCompanyEmail"
                    autoCapitalize="none"
                    className={`border lg:border-0 p-2 w-full text-sm`}
                    value={taxEmail}
                    onChange={e => {
                      setTaxEmail(e.currentTarget.value);
                    }}
                    onBlur={e => {
                      setTaxEmail(e.currentTarget.value);
                      chkEmail();
                    }}
                    placeholder="계산서 발행 시 사용할 이메일을 입력해 주세요"
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
                id="companyEmail"
                className="grid grid-cols-1 lg:grid-cols-5 lg:divide-x lg:border"
              >
                <label
                  htmlFor="inputCompanyEmail"
                  className="text-sm text-left lg:text-right flex flex-col justify-center mb-2 lg:mb-0 lg:pr-2 lg:bg-gray-100"
                >
                  <div>파일첨부</div>
                </label>
                <div className="lg:col-span-4">
                  <UploadFile file={companyFile} setFile={setCompanyFile} />
                </div>
              </div>
            </div>
            <div className="w-full text-center flex justify-center gap-x-4 mt-4 mb-10">
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
          </div>
        </form>
      </div>

      <div id="popupDom" className={isPopupOpen ? "popupModal" : undefined}>
        {isPopupOpen && (
          <PopupDom>
            <PopupPostCode
              onClose={closePostCode}
              setMainAddr={setMainAddr}
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
