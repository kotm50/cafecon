import { Link } from "react-router-dom";

import list from "../../assets/mypage/list.png";
import user from "../../assets/mypage/user.png";
import coupon from "../../assets/mypage/coupon.png";
import diamond from "../../assets/mypage/diamond.png";

function MypageMenu() {
  return (
    <div className="container mx-auto flex flex-row flex-nowrap overflow-x-auto giftCategoryMenu gap-3">
      <Link to="/user/mypage" className="text-center text-xs giftcategory p-2">
        <div className="bg-sky-50 rounded-full text-center w-20 h-20 mx-auto mb-2 flex flex-col justify-center">
          <img
            src={user}
            alt="개인정보수정"
            className="w-12 h-auto max-w-full mx-auto"
          />
        </div>
        <span className="text-sm">개인정보수정</span>
      </Link>
      <Link
        to="/user/pointreq"
        className="text-center text-xs giftcategory p-2"
      >
        <div className="bg-sky-50 rounded-full text-center w-20 h-20 mx-auto mb-2 flex flex-col justify-center">
          <img
            src={diamond}
            alt="포인트 충전"
            className="w-12 h-auto max-w-full mx-auto"
          />
        </div>
        <span className="text-sm">포인트 충전</span>
      </Link>
      <Link
        to="/user/pointlist"
        className="text-center text-xs giftcategory p-2"
      >
        <div className="bg-sky-50 rounded-full text-center w-20 h-20 mx-auto mb-2 flex flex-col justify-center">
          <img
            src={list}
            alt="포인트내역"
            className="w-12 h-auto max-w-full mx-auto"
          />
        </div>
        <span className="text-sm">포인트내역</span>
      </Link>
      <Link
        to="/user/couponlist"
        className="text-center text-xs giftcategory p-2 hidden"
      >
        <div className="bg-sky-50 rounded-full text-center w-20 h-20 mx-auto mb-2 flex flex-col justify-center">
          <img
            src={coupon}
            alt="쿠폰관리"
            className="w-12 h-auto max-w-full mx-auto"
          />
        </div>
        <span className="text-sm">쿠폰관리</span>
      </Link>
    </div>
  );
}

export default MypageMenu;
