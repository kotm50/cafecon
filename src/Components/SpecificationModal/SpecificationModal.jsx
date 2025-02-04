import PropTypes from "prop-types";
import Specification from "../Specification/Specification";
import { useState } from "react";

function SpecificationModal(props) {
  const [includeCancel, setIncludeCancel] = useState(false);
  return (
    <>
      {props.modalOn ? (
        <>
          <div className="fixed top-1/2 left-1/2 min-w-[1000px] max-h-[98vh] min-h-[100px] -translate-x-1/2 -translate-y-1/2 p-2 z-[2000] bg-white overflow-y-auto">
            <div
              className={`flex justify-between py-2 px-5 ${
                props.modalType !== "withdrawAll" && "mb-5"
              } border-b border-black`}
            >
              <span>거 래 명 세 서</span>
              <button
                className="font-extrabold"
                onClick={() => {
                  props.setModalType("");
                  props.setModalOn(false);
                }}
              >
                X
              </button>
            </div>
            {props.modalType === "withdrawAll" && (
              <>
                <div
                  id="allAgree"
                  className="flex justify-start gap-x-1 pr-10 w-full mb-2 px-5"
                >
                  <div className="flex flex-col justify-center">
                    <input
                      type="checkbox"
                      id="agreeAll"
                      className="w-[16px] h-[16px]"
                      onChange={() => setIncludeCancel(!includeCancel)}
                      checked={includeCancel}
                    />
                  </div>
                  <label
                    htmlFor="agreeAll"
                    className="text-sm font-neoextra text-left flex flex-col justify-center pl-2 py-2 col-span-6"
                  >
                    취소 상품 포함
                  </label>
                </div>
              </>
            )}
            <Specification
              modalType={props.modalType}
              setModalOn={props.setModalOn}
              setModalType={props.setModalType}
              type={props.modalType}
              pointInfo={props.pointInfo}
              includeCancel={includeCancel}
              startDate={props.startDate}
              endDate={props.endDate}
            />
          </div>
          <div
            className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-y-hidden bg-black bg-opacity-50 z-[1000]"
            onClick={() => {
              props.setModalType("");
              props.setModalOn(false);
            }}
          ></div>
        </>
      ) : null}
    </>
  );
}

SpecificationModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  setModalOn: PropTypes.func.isRequired,
  setModalType: PropTypes.func.isRequired,
  modalType: PropTypes.string.isRequired,
  buyIt: PropTypes.func,
  login: PropTypes.object,
  goodsPrice: PropTypes.number,
  limit: PropTypes.number,
  setLimit: PropTypes.func,
  extendLogin: PropTypes.func,
  getLimitandPoint: PropTypes.func,
  setUserPwd: PropTypes.func,
  pointInfo: PropTypes.object,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

export default SpecificationModal;
