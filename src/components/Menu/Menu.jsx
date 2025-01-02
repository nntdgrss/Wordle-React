import Modal from "react-modal";
import Button from "./Button";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import {
  ArchiveBoxIcon,
  BeakerIcon,
  LanguageIcon,
  PlayIcon,
  QuestionMarkCircleIcon,
} from "@heroicons/react/24/outline";
import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import ThemeToggle from "../ThemeToggle";

export default function Menu() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [helpModalIsOpen, setHelpModalIsOpen] = useState(false);
  const [settingsModalIsOpen, setSettingsModalIsOpen] = useState(false);
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const titleLetters = "ВОРДЛИ".split("");

  const getLetterColor = (index) => {
    if (index === hoveredLetter) {
      return "text-sky-400";
    }
    switch (index) {
      case 0:
        return "text-green-500";
      case 1:
        return "text-yellow-500";
      case 2:
        return "text-blue-500";
      case 3:
        return "text-purple-500";
      case 4:
        return "text-pink-500";
      case 5:
        return "text-red-500";
      default:
        return "text-white";
    }
  };

  const helpModalContent = (
    <div className="bg-gray-800/95 p-8 rounded-lg w-[90%] max-w-[500px] mx-auto border border-gray-700 shadow-lg">
      <h2 className="font-montserrat font-semibold text-center text-2xl mb-6 text-gray-100">
        Как играть
      </h2>
      <div className="space-y-4 text-gray-300">
        <p>Угадайте слово из 5 букв за 6 попыток.</p>
        <p>
          После каждой попытки цвет букв будет меняться, показывая насколько
          близко ваше предположение к загаданному слову.
        </p>
        <div className="flex flex-col gap-4 mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-600 rounded flex items-center justify-center text-white">
              А
            </div>
            <span>Буква на правильном месте</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-600 rounded flex items-center justify-center text-white">
              Б
            </div>
            <span>Буква есть в слове, но не на своём месте</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center text-white">
              В
            </div>
            <span>Буквы нет в слове</span>
          </div>
        </div>
      </div>
      <button
        onClick={() => setHelpModalIsOpen(false)}
        className="mt-6 w-full py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors"
      >
        Понятно!
      </button>
    </div>
  );

  const settingsModalContent = (
    <div className="bg-gray-800/95 p-8 rounded-lg w-auto max-w-[600px] mx-auto border border-gray-700 shadow-lg">
      <h2 className="font-montserrat font-semibold text-center text-2xl mb-6 text-gray-100">
        Настройки
      </h2>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-gray-300 mr-3">Тема оформления</span>
          <ThemeToggle />
        </div>
      </div>
      <button
        onClick={() => setSettingsModalIsOpen(false)}
        className="mt-6 w-full py-2 bg-sky-600 text-white rounded hover:bg-sky-700 transition-colors"
      >
        Закрыть
      </button>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-center w-screen">
        <div className="flex mt-32 mb-4">
          {titleLetters.map((letter, index) => (
            <span
              key={index}
              className={`font-montserrat font-bold text-6xl ${getLetterColor(
                index
              )} transition-all duration-300 hover:scale-110 cursor-default select-none`}
              onMouseEnter={() => setHoveredLetter(index)}
              onMouseLeave={() => setHoveredLetter(null)}
            >
              {letter}
            </span>
          ))}
        </div>
        <p className="font-montserrat text-gray-300 text-lg mt-4 cursor-default text-center px-4">
          Угадайте слово из пяти букв за шесть попыток
        </p>
      </div>

      <div className="flex justify-center w-auto mt-10">
        <div className="flex flex-col w-[90%] md:w-[30%] bg-gray-500/50 dark:bg-gray-800/50 backdrop-blur-sm p-6 rounded-lg border-transparent border-solid border-2 hover:border-sky-500 transition-all duration-400 shadow-lg">
          <Button
            text="Начать игру"
            icon={<PlayIcon />}
            onClick={() => navigate("/game")}
            className="bg-sky-600 hover:bg-sky-700"
          />
          <Button
            text="Как играть"
            icon={<QuestionMarkCircleIcon />}
            onClick={() => setHelpModalIsOpen(true)}
            className="bg-purple-600 hover:bg-purple-700"
          />
          <Button
            text="Выбрать язык"
            icon={<LanguageIcon />}
            onClick={() => setModalIsOpen(true)}
            className="bg-green-600 hover:bg-green-700"
          />
          <Button
            text="Настройки"
            icon={<Cog6ToothIcon />}
            onClick={() => setSettingsModalIsOpen(true)}
            className="bg-yellow-600 hover:bg-yellow-700"
          />
          <Button
            text="GitHub"
            icon={<ArchiveBoxIcon />}
            onClick={() =>
              window.open("https://github.com/nntdgrss/Wordle-React", "_blank")
            }
            className="bg-gray-600 hover:bg-gray-700"
          />
        </div>
      </div>

      <h1 className="font-montserrat text-1xl mt-auto mb-5 text-center fixed bottom-0 w-full text-gray-400">
        {<BeakerIcon className="size-5 inline-block mr-2" />}Created by{" "}
        <a
          href="https://github.com/nntdgrss"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 hover:text-gray-200 transition-colors"
        >
          nntdgrs
        </a>
      </h1>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          },
          content: {
            position: "relative",
            inset: "auto",
            border: "none",
            background: "none",
            padding: 0,
            margin: 0,
          },
        }}
      >
        <div className="bg-gray-800/95 p-8 rounded-lg w-[300px] mx-auto border border-gray-700 shadow-lg">
          <h2 className="font-montserrat font-semibold text-center text-2xl mb-4 text-gray-100">
            Выберите язык интерфейса
          </h2>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => setModalIsOpen(false)}
              className="w-20 h-20 rounded-lg flex items-center justify-center text-6xl hover:opacity-80 transition-opacity"
            >
              <img src="/ru_icon.png" alt="Russia" className="w-full h-full" />
            </button>
            <button
              disabled
              className="w-20 h-20 rounded-lg flex items-center justify-center text-6xl opacity-40 cursor-not-allowed"
            >
              <img src="/usa_icon.png" alt="USA" className="w-full h-full" />
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        isOpen={helpModalIsOpen}
        onRequestClose={() => setHelpModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          },
          content: {
            position: "relative",
            inset: "auto",
            border: "none",
            background: "none",
            padding: 0,
            margin: 0,
          },
        }}
      >
        {helpModalContent}
      </Modal>

      <Modal
        isOpen={settingsModalIsOpen}
        onRequestClose={() => setSettingsModalIsOpen(false)}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 50,
          },
          content: {
            position: "relative",
            inset: "auto",
            border: "none",
            background: "none",
            padding: 0,
            margin: 0,
          },
        }}
      >
        {settingsModalContent}
      </Modal>

      <ThemeToggle className="fixed bottom-4 right-4 z-50" />
    </>
  );
}
