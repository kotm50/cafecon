import { Route, Routes } from "react-router-dom";

import Header from "./Components/Header";
import Main from "./Pages/Main";
import GoodsMain from "./Pages/GoodsMain";
import GoodsList from "./Pages/GoodsList";
import GoodsDetail from "./Pages/GoodsDetail";
import ToTop from "./Components/ToTop";
import Join from "./Pages/Join";
import Login from "./Pages/Login";
import UserMain from "./Pages/UserMain";
import Mypage from "./Pages/Mypage";
import PointRequest from "./Pages/PointRequest";
import PointList from "./Pages/PointList";
import CouponList from "./Pages/CouponList/CouponList";
import AdminMain from "./Pages/AdminMain/AdminMain";
import AdminUserList from "./Pages/AdminUserList";
function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Main />} />
        <Route path="/goods" element={<GoodsMain />}>
          <Route path="list/:category?/:brand?" element={<GoodsList />} />
          <Route path="detail/:goodscode?" element={<GoodsDetail />} />
        </Route>
        <Route path="/user" element={<UserMain />}>
          <Route path="login" element={<Login />} />
          <Route path="join" element={<Join />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="pointreq" element={<PointRequest />} />
          <Route path="pointlist" element={<PointList />} />
          <Route path="couponlist" element={<CouponList />} />
        </Route>
        <Route path="/admin" element={<AdminMain />}>
          <Route path="userlist" element={<AdminUserList />} />
        </Route>
      </Routes>
      <ToTop />
    </>
  );
}

export default App;
