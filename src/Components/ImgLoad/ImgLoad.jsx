import PropTypes from "prop-types";
import { useState } from "react";

function ImgLoad(props) {
  const [imgLoaded, setImgLoaded] = useState(false);
  return (
    <div>
      {imgLoaded ? (
        <img
          src={props.good.goodsImgS}
          alt={props.good.goodsName}
          className="w-full mx-auto my-auto duration-300 transition-all ease-in-out hover:scale-125"
        />
      ) : (
        <>
          <img
            src={props.good.goodsImgS}
            alt={props.good.goodsName}
            className="fixed top-0 left-0 opacity-0"
            onLoad={() => setImgLoaded(true)}
          />
          <div className="bg-slate-200 animate-pulse w-32 h-32 lg:w-60 lg:h-60"></div>
        </>
      )}
    </div>
  );
}

ImgLoad.propTypes = {
  good: PropTypes.shape({
    goodsImgS: PropTypes.string.isRequired,
    goodsName: PropTypes.string.isRequired,
  }).isRequired,
};

export default ImgLoad;
