import { kyApi } from "./Api";

export const chkPhoneNum = phone => {
  // 전화번호가 01로 시작하지 않으면 false 반환
  if (!phone.startsWith("01")) return false;

  // '010'으로 시작하는 경우
  if (phone.startsWith("010")) {
    return phone.length === 11;
  }

  // '010'이 아닌 경우 ('011', '015', '016', '017', '018', '019'만 허용)
  const validPrefixes = ["011", "015", "016", "017", "018", "019"];
  if (!validPrefixes.some(prefix => phone.startsWith(prefix))) {
    return false;
  }

  // 길이가 10 또는 11일 경우만 true 반환
  return phone.length === 10 || phone.length === 11;
};

// 휴대폰 인증
export const smsAuth = async (name, phone, id) => {
  const data = {
    managerName: name,
    phone: phone,
    site: "카페콘",
  };
  if (id) data.userId = id;
  console.log(data);
  const res = await kyApi
    .post("/api/v1/cafecon/user/cert/sms", { json: data })
    .json();
  return res;
};

export const smsCert = async (name, phone, cert) => {
  const data = {
    managerName: name,
    phone: phone,
    smsCode: cert,
  };

  const res = await kyApi
    .post("/api/v1/cafecon/user/cert/code", { json: data })
    .json();
  return res;
};
