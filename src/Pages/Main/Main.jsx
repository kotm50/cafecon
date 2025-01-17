import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

function Main() {
  const thisLocation = useLocation();
  const navi = useNavigate();
  useEffect(() => {
    navi("/goods/list");
    //eslint-disable-next-line
  }, [thisLocation]);
  return null;
}

export default Main;
