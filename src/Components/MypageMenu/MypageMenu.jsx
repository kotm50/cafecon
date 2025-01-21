import { Link } from "react-router-dom";

import interview from "../../assets/mypage/interview.png";
import user from "../../assets/mypage/user.png";
import coupon from "../../assets/mypage/coupon.png";
import diamond from "../../assets/mypage/diamond.png";

function MypageMenu() {
  return (
    <div className="mx-auto flex flex-row flex-nowrap gap-3 w-full max-w-[1240px] mb-5">
      <Link
        to="/user/mypage"
        className="p-4 text-center bg-blue-50 hover:bg-blue-200 rounded-lg flex flex-col justify-center gap-2 group drop-shadow-lg"
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
          <img
            src={user}
            alt="개인정보수정"
            className="mx-auto w-10 drop-shadow-lg"
          />
        </div>
        <span className="text-sm">개인정보수정</span>
      </Link>
      <Link
        to="/mypage/pointrequest"
        className="p-4 text-center bg-blue-50 hover:bg-blue-200 rounded-lg flex flex-col justify-center gap-2 group drop-shadow-lg"
        onClick={e => {
          e.preventDefault;
          alert("준비중입니다");
        }}
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
          <img
            src={interview}
            alt="포인트신청"
            className="mx-auto w-10 drop-shadow-lg"
          />
        </div>
        <span className="text-sm">포인트신청</span>
      </Link>
      <Link
        to="/mypage/coupon"
        className="p-4 text-center bg-blue-50 hover:bg-blue-200 rounded-lg flex flex-col justify-center gap-2 group drop-shadow-lg"
        onClick={e => {
          e.preventDefault;
          alert("준비중입니다");
        }}
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
          <img
            src={coupon}
            alt="보유쿠폰확인"
            className="mx-auto w-10 drop-shadow-lg"
          />
        </div>
        <span className="text-sm">보유쿠폰확인</span>
      </Link>
      <Link
        to="/mypage/pointhistory"
        className="p-4 text-center bg-blue-50 hover:bg-blue-200 rounded-lg flex flex-col justify-center gap-2 group drop-shadow-lg"
        onClick={e => {
          e.preventDefault;
          alert("준비중입니다");
        }}
      >
        <div className="w-20 h-20 mx-auto rounded-full bg-white flex flex-col justify-center text-gray-500 group-hover:bg-indigo-500 group-hover:text-white">
          <img
            src={diamond}
            alt="포인트내역"
            className="mx-auto w-10 drop-shadow-lg"
          />
        </div>
        <span className="text-sm">포인트내역</span>
      </Link>
    </div>
  );
}

export default MypageMenu;
