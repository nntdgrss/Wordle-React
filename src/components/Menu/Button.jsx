import PropTypes from "prop-types";

export default function Button({ text, onClick }) {
  return (
    <button
      className="bg-gray-700 rounded-md p-2 mt-2 text-gray-200 font-montserrat"
      onClick={onClick}
    >
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
