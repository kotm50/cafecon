import { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useLocation, /* useNavigate, */ useParams } from "react-router-dom";
import Modal from "../../Components/Modal";
import dompurify from "dompurify";
import { kyApi, getPrice } from "../../Api/Api";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../Reducer/userSlice";

function GoodsDetail() {
  const dispatch = useDispatch();
  const login = useSelector(state => state.user);
  const sanitizer = dompurify.sanitize;
  const thisLocation = useLocation();
  //const navi = useNavigate();
  const { goodscode } = useParams();
  const [goods, setGoods] = useState(null);
  const [goodsPrice, setGoodsPrice] = useState(0);
  const [content, setContent] = useState("");
  const [imgLoaded, setImgLoaded] = useState(false);
  const [loadMsg, setLoadMsg] = useState("상품을 불러오고 있습니다");
  const [loading, setLoading] = useState(false);
  const [modalOn, setModalOn] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    getGoods();
    //eslint-disable-next-line
  }, [thisLocation]);
  const isMobileDevice = () => {
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );
  };

  const getGoods = async () => {
    setLoading(true);
    setLoadMsg("상품을 불러오고 있습니다");
    try {
      const res = await kyApi
        .get(`/biz/v1/shop/goods/detail/${goodscode}`)
        .json();

      setGoods(res.goods);
      setGoodsPrice(getPrice(res.goods.discountPrice));
      contentForm(res.goods.content);
      if (isMobileDevice()) {
        window.scrollTo(0, 560);
      }
    } catch (e) {
      console.log(e);
    }
    setLoading(false);
  };

  const contentForm = c => {
    // URL을 찾기 위한 수정된 정규식
    const regexLink =
      /(\bhttps?:\/\/[-A-Z0-9+&@#/%?=~_|!:,.;]*[-A-Z0-9+&@#/%=~_|])/gi;

    const regexParentheses = /([({[])(.*?)([)}\]])/g;

    let contentText = c;

    // 괄호 처리
    contentText = contentText.replace(
      regexParentheses,
      (match, open, content, close) => {
        return `${open} ${content} ${close}`;
      }
    );

    let contentWB = contentText.replace(/(?:\r\n|\r|\n)/g, " <br />");

    // 링크 대체
    let replacedText = contentWB.replace(
      regexLink,
      '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-indigo-500 hover:cursor-pointer hover:text-indigo-700 hover:border-b-2 border-indigo-700">$1</a>'
    );

    setContent(replacedText);
  };

  const buyItSelf = async () => {
    if (login.phone === "") {
      return alert("로그인 후 이용 가능합니다");
    }
    const data = {
      phoneNo: login.phone,
      goodsCode: goods.goodsCode,
      limitDay: goods.limitDay,
      goodsImgB: goods.goodsImgB,
      goodsName: goods.goodsName,
      callbackNo: login.phone,
      discountPrice: goodsPrice,
      realPrice: Number(goods.realPrice),
    };

    const res = await kyApi
      .post("/api/v1/cafecon/common/goods/send", { json: data })
      .json();

    if (res.code === "C000") {
      const point = await kyApi
        .get("/api/v1/cafecon/common/exper_cookie")
        .json();

      dispatch(loginUser({ point: point.point }));
    }
  };

  const buyIt = async (phone1, phone2, memo) => {
    const data = {
      phoneNo: phone2,
      goodsCode: goods.goodsCode,
      limitDay: goods.limitDay,
      goodsImgB: goods.goodsImgB,
      goodsName: goods.goodsName,
      callbackNo: phone1,
      memo: memo,
      discountPrice: Number(goodsPrice),
      realPrice: Number(goods.realPrice),
    };

    const res = await kyApi
      .post("/api/v1/cafecon/common/goods/send", { json: data })
      .json();

    if (res.code === "0000") return "완료";
    return "실패";
  };

  return (
    <>
      {goods ? (
        <>
          <Helmet>
            <title>{`${goods.goodsName} - ${goods.brandName} | 카페콘닷컴`}</title>
            <meta
              name="description"
              content={`${goods.goodsName} - ${goods.brandName}  | 카페콘닷컴`}
            />
            <meta property="og:image" content={goods.goodsImgB} />
          </Helmet>
          {goods !== undefined && (
            <img
              src={goods.goodsImgB}
              alt={goods.goodsName}
              className="fixed top-0 left-0 w-0 h-0 opacity-0"
              onLoad={() => setImgLoaded(true)}
            />
          )}
          <div className="w-full bg-white p-4 flex flex-col lg:flex-row lg:justify-center gap-3  lg:mt-2">
            <div className="lg:basis-4/12 p-1">
              <img
                src={goods.goodsImgB}
                alt={goods.goodsName}
                className="border bg-gray-100 mx-auto w-3/4"
              />
            </div>
            <div className="lg:basis-6/12 p-1 flex flex-col justify-start">
              <div className="lg:text-lg">{goods.brandName}</div>
              <h2 className="text-lg lg:text-2xl font-bold">
                {goods.goodsName}
              </h2>
              <div className="mt-5">
                <span className="text-2xl lg:text-4xl font-bold text-indigo-500">
                  {goodsPrice ? goodsPrice.toLocaleString() : 0}
                </span>
                <span className="text-xl lg:text-2xl ml-1">Point</span>
              </div>
              <div className="mt-5 flex flex-row gap-3">
                <span className="lg:text-lg font-bold basis-1/4 lg:basis-1/6">
                  교환처
                </span>
                <span className="lg:text-lg basis-3/4 lg:basis-5/6">
                  {goods.affiliate}
                </span>
              </div>
              <div className="mt-5 flex flex-row gap-3">
                <span className="lg:text-lg font-bold basis-1/4 lg:basis-1/6">
                  유효기간
                </span>
                <span className="lg:text-lg basis-3/4 lg:basis-5/6">
                  {goods.limitDay}일/유효기간 만료 후 연장 및 환불 불가
                </span>
              </div>
              <div className="mt-5 flex flex-row gap-3">
                <span className="lg:text-lg font-bold basis-1/4 lg:basis-1/6">
                  구매방식
                </span>
                <span className="lg:text-lg basis-3/4 lg:basis-5/6">
                  모바일 쿠폰 발송
                </span>
              </div>
              <div className="mt-5 flex flex-col lg:flex-row justify-start gap-3 relative">
                <div className="flex justify-start gap-x-2 ">
                  <button
                    className="w-fit transition-all duration-150 ease-in-out bg-indigo-500 text-white py-2 px-5 rounded hover:bg-indigo-700"
                    onClick={() => {
                      buyItSelf();
                    }}
                  >
                    포인트로 구입하기
                  </button>
                  <button
                    className="w-fit transition-all duration-150 ease-in-out bg-orange-600 text-white py-2 px-5 rounded hover:bg-orange-700"
                    onClick={() => {
                      setModalOn(true);
                      setModalType("buy");
                    }}
                  >
                    포인트로 선물하기
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="w-full bg-white mt-3 p-4  lg:mt-2">
            <h3 className="lg:pl-32 p-3 lg:text-2xl font-bold mb-3 pb-3 border-y">
              상품 상세정보 및 유의사항
            </h3>
            <div
              className="lg:pl-32 leading-7"
              dangerouslySetInnerHTML={{
                __html: sanitizer(content, { ADD_ATTR: ["target"] }),
              }}
            />
            <div className="lg:pl-32 leading-7">
              <br />
              - 구매 취소는 구매 후 7일 이내에 신청하셔야 가능합니다.
              <br />- 기타 이용 관련 문의는 기프티콘 고객센터 1588-6474 로 문의
              바랍니다.
            </div>
          </div>
        </>
      ) : null}

      <Modal
        modalOn={modalOn}
        setModalOn={setModalOn}
        modalType={modalType}
        setModalType={setModalType}
        buyIt={buyIt}
        login={login}
        goodsPrice={goodsPrice}
      />

      {!imgLoaded && loading && (
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

export default GoodsDetail;
