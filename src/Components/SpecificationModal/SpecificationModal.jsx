import PropTypes from "prop-types";
import Specification from "../Specification/Specification";

function SpecificationModal(props) {
  return (
    <>
      {props.modalOn ? (
        <>
          <div className="fixed top-1/2 left-1/2 min-w-[1000px] max-h-[98vh] min-h-[100px] -translate-x-1/2 -translate-y-1/2 p-2 z-[2000] bg-white overflow-y-auto">
            <div className="flex justify-between py-2 px-5 mb-5 border-b border-black">
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
            <Specification
              setModalOn={props.setModalOn}
              setModalType={props.setModalType}
              type={props.modalType}
              pointInfo={props.pointInfo}
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
};

export default SpecificationModal;
