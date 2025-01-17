import { Route, Routes } from "react-router-dom";

import Header from "./Components/Header";
import Main from "./Pages/Main";
import GoodsMain from "./Pages/GoodsMain";
import GoodsList from "./Pages/GoodsList";
import GoodsDetail from "./Pages/GoodsDetail";
import ToTop from "./Components/ToTop";
import Join from "./Pages/Join";
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
        <Route path="/join" element={<Join />} />
      </Routes>
      <ToTop />
    </>
  );
}

export default App;
