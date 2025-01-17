import queryString from "query-string";
import { useEffect, useState } from "react";
import { Link, useLocation, useParams } from "react-router-dom";

import { Helmet } from "react-helmet";
//import { goodsList } from "../../Data/Dummy";
import { kyApi, getPrice } from "../../Api/Api";
import Pagenation from "../../Components/Pagenation";

import sorry from "../../assets/sorry.png";
import ImgLoad from "../../Components/ImgLoad";
import MainCategory from "../../Components/MainCategory";

function GoodsList() {
  const [goods, setGoods] = useState([]);
  const thisLocation = useLocation();
  const { category, brand } = useParams();
  const parsed = queryString.parse(location.search);
  const page = parsed.page || 1;
  const size = parsed.size || 20;
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [loading, setLoading] = useState(false);
  const [last, setLast] = useState(1);

  const [catName, setCatName] = useState("");
  const [errMsg, setErrMsg] = useState("조회 된 내용이 없습니다");

  useEffect(() => {
    setGoods([]);
    // location이 바뀔 때마다 스크롤을 맨 위로 이동
    window.scrollTo(0, 0);
    setLoadMsg("상품을 불러오고 있습니다");
    getGoods(category, brand, page, size);
    setCatName(
      Number(category) === 1
        ? "커피/음료"
        : Number(category) === 2
        ? "베이커리/도넛"
        : Number(category) === 3
        ? "아이스크림"
        : Number(category) === 4
        ? "편의점"
        : Number(category) === 5
        ? "피자/버거/치킨"
        : Number(category) === 6
        ? "외식/분식/배달"
        : Number(category) === 7
        ? "영화/음악/도서"
        : Number(category) === 9
        ? "뷰티/헤어/바디"
        : Number(category) === 10
        ? "출산/생활/통신"
        : category === "etc"
        ? "기타상품"
        : "전체 상품"
    );
    //eslint-disable-next-line
  }, [thisLocation]);
  /*
  const getGoods = async () => {
    setLoading(true);
    setGoods(goodsList);
    setLoading(false);
  };
  */

  const getGoods = async (c, b, p, s) => {
    setLoading(true);
    let listUrl = "/biz/v1/shop/goods/list";
    if (c !== undefined && b === undefined) {
      listUrl = "/biz/v1/shop/goods/list";
      listUrl = listUrl + "/" + c;
    }
    if (b !== undefined) {
      listUrl = "/biz/v1/shop/goods/list/brand";
      listUrl = listUrl + "/" + b;
    }
    if (c === "etc") {
      listUrl = "/biz/v1/shop/goods/etc/list";
    }
    const data = {
      page: p,
      size: s,
    };
    try {
      const res = await kyApi.get(listUrl, { searchParams: data }).json();
      console.log(res);
      setGoods(res.goodsList);
      setLast(res.totalPages);
    } catch (error) {
      console.log(error);
      setErrMsg("알 수 없는 오류 발생");
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet>
        <title>{catName ? `${catName} | ` : ""}카페콘닷컴</title>
      </Helmet>
      <div className="w-full max-w-[1240px] mx-auto bg-white p-4">
        <MainCategory />
        {goods && goods.length > 0 ? (
          <div className="w-full grid grid-cols-2 lg:grid-cols-5 gap-4">
            {goods.map((good, idx) => (
              <Link
                key={idx}
                to={`/goods/detail/${good.goodsCode}`}
                className="pb-0 min-h-0 h-fit"
              >
                <div className="group p-2 rounded">
                  <div className="w-32 h-32 lg:w-48 lg:h-48 mx-auto rounded overflow-hidden max-w-full bg-white drop-shadow hover:drop-shadow-xl">
                    <ImgLoad good={good} />
                  </div>
                  <div className="w-32 lg:w-48 mx-auto grid grid-cols-1 pt-1 border-gray-100 max-w-full mt-3">
                    <p className="lg:text-base group-hover:font-neobold keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left font-neobold text-blue-500">
                      {good.brandName}
                    </p>
                    <p
                      className="lg:text-lg group-hover:font-neobold keep-all overflow-hidden text-ellipsis whitespace-nowrap text-left"
                      title={good.goodsName}
                    >
                      {good.goodsName}
                    </p>
                    <p className="lg:text-lg text-left mt-3">
                      <span className="text-xl text-rose-500">
                        {getPrice(Number(good.discountPrice)).toLocaleString()}
                      </span>{" "}
                      P
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <>
            {!loading && (
              <div className="text-2xl text-bold text-center">
                <img
                  src={sorry}
                  className="mx-auto w-[240px] h-auto mb-5 mt-20"
                  alt="오류"
                />
                {errMsg}
              </div>
            )}
          </>
        )}
        {goods && goods.length > 0 ? <Pagenation last={last} /> : null}
      </div>
      {loading && (
        <div className="bg-white bg-opacity-55 w-[100vw] h-[100vh] fixed top-0 left-0 overflow-hidden z-[9999999999]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit min-w-[50px] text-center flex flex-col justify-center z-[10000000000]">
            <div className="loader" />
            <span className="absolute w-[50vw] bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
              {loadMsg}
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default GoodsList;
