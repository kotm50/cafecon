import PropTypes from "prop-types";
import UserPointModal from "../UserPointModal";

function AdminModal(props) {
  return (
    <>
      {props.modalOn ? (
        <>
          <div className="fixed top-1/2 left-1/2 w-[1240px] h-[95vh] -translate-x-1/2 -translate-y-1/2 p-2 z-[2000] bg-white rounded-lg overflow-hidden">
            <button
              className="absolute p-2 w-fit h-fit top-2 right-2 z-[2001]"
              onClick={() => {
                props.setModalOn(false);
              }}
            >
              X
            </button>
            <UserPointModal
              modalOn={props.modalOn}
              setModalOn={props.setModalOn}
              userInfo={props.userInfo}
              getUserList={props.getUserList}
            />
          </div>
          <div
            className="fixed top-0 left-0 w-[100vw] h-[100vh] overflow-y-hidden bg-black bg-opacity-50 z-[1000]"
            onClick={() => {
              props.setModalOn(false);
            }}
          ></div>
        </>
      ) : null}
    </>
  );
}

AdminModal.propTypes = {
  modalOn: PropTypes.bool.isRequired,
  setModalOn: PropTypes.func.isRequired,
  userInfo: PropTypes.object,
  getUserList: PropTypes.func,
};

export default AdminModal;
