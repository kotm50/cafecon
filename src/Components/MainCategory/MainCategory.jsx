import { Link } from "react-router-dom";
import PropTypes from "prop-types";
import { category } from "../../Data/Category";
import all from "../../assets/mainCategory/all.png";
import MainCategoryImg from "../MainCategoryImg";

function MainCategory({ path }) {
  return (
    <div className="lg:w-full mx-auto pt-3 lg:pt-0">
      <div
        id="touch-target"
        className="container mx-auto flex flex-row flex-nowrap overflow-x-auto giftCategoryMenu gap-3 lg:grid lg:grid-cols-10"
      >
        <Link
          to={`/goods/list`}
          className={`text-center text-xs giftcategory p-2 ${
            path.length === 3 && "bg-indigo-100 rounded-lg"
          }`}
        >
          <div className="mainCategory group">
            <div className="bg-sky-50 rounded-full text-center w-20 h-20 mx-auto mb-2 flex flex-col justify-center">
              <img
                src={all}
                alt="전체상품"
                className="w-12 h-auto max-w-full mx-auto"
              />
            </div>
            <div className="group-hover:text-rose-500">전체상품</div>
          </div>
        </Link>
        {category.map((cat, idx) => (
          <Link
            to={`/goods/list/${cat.category1Seq}`}
            key={idx}
            className={`text-center text-xs giftcategory p-2 ${
              cat.category1Seq === "etc" && "hidden"
            } ${
              Number(path[3]) === cat.category1Seq && "bg-indigo-100 rounded-lg"
            }`}
          >
            <div className="mainCategory group">
              <div className="bg-sky-50 rounded-full text-center w-20 h-20 mx-auto mb-2 flex flex-col justify-center">
                <MainCategoryImg
                  cat={Number(cat.category1Seq)}
                  txt={cat.category1Name}
                />
              </div>
              <div className="group-hover:text-rose-500">
                {cat.category1Name}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

MainCategory.propTypes = {
  path: PropTypes.array.isRequired,
};
export default MainCategory;
