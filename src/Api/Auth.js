import { kyApi } from "./Api";

// 휴대폰 인증
export const smsAuth = async (name, phone) => {
  const data = {
    managerName: name,
    phone: phone,
    site: "카페콘",
  };
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
