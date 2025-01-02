import { useNavigate } from "react-router";
import { HomeIcon } from "@heroicons/react/24/outline";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-gray-100 mb-4 animate-bounce-slow">
          4
          <span className="inline-block mx-2 text-sky-500 animate-pulse">
            0
          </span>
          4
        </h1>
        <p className="text-2xl text-gray-300 mb-8 font-montserrat">
          Упс! Страница не найдена
        </p>
        <div className="max-w-md text-gray-400 mb-8">
          Возможно, страница была удалена или её никогда не существовало. Не
          волнуйтесь, давайте вернёмся на главную и начнём сначала!
        </div>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors mx-auto font-montserrat"
        >
          <HomeIcon className="w-5 h-5" />
          На главную
        </button>
      </div>
    </div>
  );
}
