import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { pathname } from "../../Data/Pathname";
import SearchArea from "../SearchArea";
import Modal from "../Modal";

function Header() {
  const navi = useNavigate();
  const thisLocation = useLocation();
  const [modalOn, setModalOn] = useState(false);
  const [modalType, setModalType] = useState("");
  const [correct, setCorrect] = useState(false);

  useEffect(() => {
    isCorrect(thisLocation.pathname);
  }, [thisLocation]);

  const isCorrect = path => {
    setCorrect(pathname.includes(path));
  };
  return (
    <>
      {!correct ? (
        <>
          <header className="w-full border-b bg-white">
            <div className="w-full max-w-[1240px] mx-auto">
              <h1 className="text-center">
                <button
                  className="p-2 w-fit ppbold text-4xl text-amber-900"
                  onClick={() => navi("/")}
                >
                  카페콘닷컴
                </button>
              </h1>
              <div className="w-full flex justify-between pb-4">
                <SearchArea />
                <div className="flex justify-end gap-x-2">
                  <button className="px-4 py-2 bg-green-600 hover:bg-opacity-80 text-white rounded-lg">
                    로그인
                  </button>
                  <button
                    className="px-4 py-2 bg-gray-600 hover:bg-opacity-80 text-white rounded-lg"
                    onClick={() => {
                      setModalOn(true);
                      setModalType("join");
                    }}
                  >
                    회원가입
                  </button>
                </div>
              </div>
            </div>
          </header>

          <Modal
            modalOn={modalOn}
            setModalOn={setModalOn}
            modalType={modalType}
            setModalType={setModalType}
          />
        </>
      ) : null}
    </>
  );
}

export default Header;
