import Modal from "react-modal";
import Button from "./Button";
import { useState, useEffect } from "react";

export default function Menu() {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [language, setLanguage] = useState("ru");

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);

  const openModal = () => {
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const modalContent = (
    <div className="bg-gray-800/95 dark:bg-gray-800/95 p-8 rounded-lg w-[300px] mx-auto border border-gray-700 shadow-lg">
      <h2 className="font-montserrat font-semibold text-center text-2xl mb-4 text-gray-100">
        Выберите язык интерфейса
      </h2>
      <div className="flex justify-center gap-4">
        <button
          onClick={() => {
            setLanguage("ru");
            closeModal();
          }}
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
  );

  return (
    <>
      <div className="flex justify-center w-screen">
        <h1 className="font-montserrat font-semibold text-5xl mt-32">Вордли</h1>
      </div>

      <div className="flex justify-center w-screen mt-10">
        <div className="flex flex-col w-[90%] md:w-[30%] bg-gray-600 p-6 rounded-lg">
          <Button text="Начать игру" />
          <Button text="Выбрать язык" onClick={openModal} />
          <Button text="Настройки" />
          <Button
            text="Автор"
            onClick={() => window.open("https://github.com/nntdgrss", "_blank")}
          />
        </div>
      </div>

      <h1 className="font-montserrat text-1xl mt-auto mb-5 text-center fixed bottom-0 w-full text-gray-400">
        Created by{" "}
        <a
          href="https://github.com/nntdgrss"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 hover:text-gray-200"
        >
          nntdgrs
        </a>
      </h1>

      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={true}
        style={{
          overlay: {
            backgroundColor: "rgba(0, 0, 0, 0.25)",
            backdropFilter: "blur(4px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
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
        {modalContent}
      </Modal>
    </>
  );
}
