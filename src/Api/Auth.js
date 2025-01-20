import { kyApi } from "./Api";

// 휴대폰 인증
export const smsAuth = async (name, phone) => {
  const data = {
    userName: name,
    phone: phone,
  };

  const res = await kyApi
    .post("/api/v1/formMail/cert/sms", { json: data })
    .json();
  return res;
};

export const smsCert = async (name, phone, cert) => {
  const data = {
    userName: name,
    phone: phone,
    smsCode: cert,
  };

  const res = await kyApi
    .post("/api/v1/jobsite/user/cert", { json: data })
    .json();
  return res;
};
