import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import PropTypes from "prop-types";

import coffee from "../../assets/mainCategory/coffee.png";
import donut from "../../assets/mainCategory/donut.png";
import icecream from "../../assets/mainCategory/icecream.png";
import conv from "../../assets/mainCategory/conv.png";
import pizza from "../../assets/mainCategory/pizza.png";
import dinner from "../../assets/mainCategory/dinner.png";
import movie from "../../assets/mainCategory/movie.png";
import cosmetic from "../../assets/mainCategory/cosmetic.png";
import baby from "../../assets/mainCategory/baby.png";

function MainCategoryImg(props) {
  const location = useLocation();
  const [img, setImg] = useState("");

  useEffect(() => {
    if (props.cat >= 1 && props.cat <= 10) {
      const imagesArray = [
        coffee,
        donut,
        icecream,
        conv,
        pizza,
        dinner,
        movie,
        "",
        cosmetic,
        baby,
      ];

      const imgToSet = imagesArray[props.cat - 1];
      setImg(imgToSet);
    }
    //eslint-disable-next-line
  }, [location]);
  return (
    <img src={img} alt={props.txt} className="w-12 h-auto max-w-full mx-auto" />
  );
}

MainCategoryImg.propTypes = {
  cat: PropTypes.number.isRequired,
  txt: PropTypes.string.isRequired,
};

export default MainCategoryImg;
