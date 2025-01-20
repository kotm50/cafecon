import PropTypes from "prop-types";
import sorry from "../../assets/sorry.png";

function Sorry(props) {
  return (
    <div className="container mx-auto flex flex-col justify-center p-4 gap-y-3 pt-20 lg:pt-10">
      <img src={sorry} alt="죄송합니다" className="w-40 max-w-full mx-auto" />
      <div className="text-center">{props.message}</div>
    </div>
  );
}

Sorry.propTypes = {
  message: PropTypes.string.isRequired,
};

export default Sorry;
