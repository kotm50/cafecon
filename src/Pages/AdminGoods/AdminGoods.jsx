import { useState, useEffect } from "react";
import "./Goods.css";
import { kyApi } from "../../Api/Api";
import { FaSortNumericDown, FaSortNumericUp } from "react-icons/fa";

function AdminGoods() {
  const [loading, setLoading] = useState();
  const [goods, setGoods] = useState([]);
  const [isAscending, setIsAscending] = useState(true);

  useEffect(() => {
    getGoods();
  }, []);

  useEffect(() => {
    if (goods.length > 0) {
      sortGoods();
    }
    //eslint-disable-next-line
  }, [isAscending]);

  const sortGoods = () => {
    let list = goods;
    setGoods([]);
    if (isAscending) {
      setGoods(
        list.sort((a, b) => Number(a.discountRate) - Number(b.discountRate))
      );
    } else {
      setGoods(
        list.sort((a, b) => Number(b.discountRate) - Number(a.discountRate))
      );
    }
  };

  const getGoods = async () => {
    setLoading(true);
    let listUrl = "/biz/v1/shop/goods/list";
    const data = {
      page: 1,
      size: 99999,
    };
    try {
      const res = await kyApi.get(listUrl, { searchParams: data }).json();
      console.log(res);
      setGoods(
        res.goodsList.sort(
          (a, b) => Number(a.discountRate) - Number(b.discountRate)
        )
      );
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };
  return (
    <>
      {goods && goods.length > 0 && (
        <table id="goods">
          <thead>
            <tr>
              <th>카테고리</th>
              <th>브랜드</th>
              <th>상품명</th>
              <th>정가</th>
              <th
                className="hover:cursor-pointer"
                onClick={setIsAscending(!isAscending)}
              >
                할인율
                <>{isAscending ? <FaSortNumericDown /> : <FaSortNumericUp />}</>
              </th>
              <th>할인가</th>
            </tr>
          </thead>
          <tbody>
            {goods.map((item, idx) => (
              <tr key={idx}>
                <td className="center">{item.goodsTypeDtlNm}</td>
                <td className="center">{item.brandName}</td>
                <td>{item.goodsName}</td>
                <td className="right">
                  {Number(item.realPrice).toLocaleString()}원
                </td>
                <td className="right">{item.discountRate}%</td>
                <td className="right">
                  {Number(item.discountPrice).toLocaleString()}원
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {loading && (
        <div className="bg-white bg-opacity-55 w-[100vw] h-[100vh] fixed top-0 left-0 overflow-hidden z-[9999999999]">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-fit min-w-[50px] text-center flex flex-col justify-center z-[10000000000]">
            <div className="loader" />
            <span className="absolute w-[50vw] bottom-0 left-1/2 -translate-x-1/2 translate-y-8">
              로딩 중 입니다...
            </span>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminGoods;
