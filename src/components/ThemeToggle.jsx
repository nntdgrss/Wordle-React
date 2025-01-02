import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";
import { useTheme } from "../context/ThemeContext";
import PropTypes from "prop-types";

export default function ThemeToggle({ className = "" }) {
  const { isDarkTheme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`p-3 rounded-full bg-gray-600/50 backdrop-blur-sm hover:bg-gray-700/50 transition-all duration-300 shadow-lg border border-gray-700/50 ${className}`}
      aria-label="Переключить тему"
    >
      {isDarkTheme ? (
        <SunIcon className="w-6 h-6 text-yellow-400" />
      ) : (
        <MoonIcon className="w-6 h-6 text-gray-100" />
      )}
    </button>
  );
}

ThemeToggle.propTypes = {
  className: PropTypes.string,
};
