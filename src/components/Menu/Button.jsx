import PropTypes from "prop-types";

export default function Button({ text, icon, onClick }) {
  return (
    <button
      className="bg-gray-700 rounded-md p-2 mt-2 text-gray-200 font-montserrat hover:bg-gray-800/60 transition-all duration-300 flex items-center justify-center gap-2"
      onClick={onClick}
    >
      <div className="size-6">{icon}</div>
      {text}
    </button>
  );
}

Button.propTypes = {
  text: PropTypes.string.isRequired,
  icon: PropTypes.string,
  onClick: PropTypes.func.isRequired,
};
