import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import Modal from "react-modal";
import {
  ArrowPathIcon,
  HomeIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { WORDS } from "./words";
import { useNavigate } from "react-router";
import ThemeToggle from "../ThemeToggle";

// Константы для статусов букв
const LETTER_STATUS = {
  CORRECT: "correct",
  PRESENT: "present",
  ABSENT: "absent",
  EMPTY: "empty",
  REVEALED: "revealed",
};

// Стили для модального окна
const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    backgroundColor: "var(--bg-secondary)",
    borderRadius: "1rem",
    border: "2px solid var(--border-color)",
    padding: "2rem",
    maxWidth: "400px",
    width: "90%",
    zIndex: 200,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    backdropFilter: "blur(4px)",
    zIndex: 200,
  },
};

Modal.setAppElement("#root");

// Компонент конфетти
const Confetti = () => (
  <div className="confetti-container">
    {Array(50)
      .fill(null)
      .map((_, i) => (
        <div
          key={i}
          className="confetti"
          style={{
            "--delay": `${Math.random() * 3}s`,
            "--rotation": `${Math.random() * 360}deg`,
            "--position": `${Math.random() * 100}%`,
          }}
        />
      ))}
  </div>
);

// Компонент для отображения клавиатуры
const Keyboard = ({ onKeyPress, letterStatuses }) => {
  const rows = [
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
    ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"],
  ];

  return (
    <div className="flex flex-col gap-1 sm:gap-2 w-full max-w-[800px] mx-auto mt-4">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`w-[8vw] h-[8vw] sm:w-[45px] sm:h-[55px] rounded-lg font-bold text-sm sm:text-base transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 min-w-[20px]
                ${
                  letterStatuses[key] === LETTER_STATUS.CORRECT
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : letterStatuses[key] === LETTER_STATUS.PRESENT
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : letterStatuses[key] === LETTER_STATUS.ABSENT
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
              translate="no"
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onKeyPress("Backspace")}
          className="w-[15vw] sm:w-[80px] h-[55px] rounded-lg bg-gray-700 text-gray-200 font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:bg-gray-600"
        >
          ←
        </button>
        <button
          onClick={() => onKeyPress("Enter")}
          className="w-[15vw] sm:w-[80px] h-[55px] rounded-lg bg-gray-700 text-gray-200 font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:bg-gray-600"
          translate="no"
        >
          ВВОД
        </button>
      </div>
    </div>
  );
};

Keyboard.propTypes = {
  onKeyPress: PropTypes.func.isRequired,
  letterStatuses: PropTypes.objectOf(PropTypes.string).isRequired,
};

// Компонент для отображения одной буквы
const Letter = ({
  value,
  status,
  revealedLetters,
  position,
  isCorrectWord,
}) => {
  const isRevealed =
    revealedLetters &&
    revealedLetters[value.toLowerCase()] &&
    revealedLetters[value.toLowerCase()].includes(position) &&
    status === LETTER_STATUS.EMPTY;

  return (
    <div
      className={`w-[14vw] h-[14vw] sm:w-[62px] sm:h-[62px] border-2 flex items-center justify-center font-bold text-2xl rounded-lg transition-all duration-300
      ${
        status === LETTER_STATUS.CORRECT
          ? "bg-green-600 border-green-500 text-white shadow-green-900/20"
          : status === LETTER_STATUS.PRESENT
          ? "bg-yellow-600 border-yellow-500 text-white shadow-yellow-900/20"
          : status === LETTER_STATUS.ABSENT
          ? "bg-gray-600 border-gray-500 text-white shadow-gray-900/20"
          : isRevealed
          ? "border-green-500 text-green-400 bg-gray-800"
          : "border-gray-600 text-gray-300 bg-gray-800 shadow-gray-900/20"
      }
      ${status !== LETTER_STATUS.EMPTY ? "shadow-lg" : ""}
      ${isCorrectWord ? "animate-bounce-once" : ""}
      `}
    >
      {value.toUpperCase()}
    </div>
  );
};

Letter.propTypes = {
  value: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  revealedLetters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)),
  position: PropTypes.number.isRequired,
  isCorrectWord: PropTypes.bool,
};

// Компонент для отображения строки букв
const Row = ({
  word,
  statuses,
  revealedLetters,
  rowIndex,
  currentRow,
  message,
  isCorrectWord,
}) => (
  <div className="relative flex justify-center w-full">
    <div className="flex gap-2">
      {Array(5)
        .fill(null)
        .map((_, i) => (
          <Letter
            key={i}
            value={word[i] || ""}
            status={statuses[i] || LETTER_STATUS.EMPTY}
            revealedLetters={revealedLetters}
            position={i}
            isCorrectWord={isCorrectWord}
          />
        ))}
    </div>
    {rowIndex === currentRow && message && (
      <div className="hidden sm:block absolute left-full top-1/2 -translate-y-1/2 ml-4 bg-red-500/10 border-l-4 border-red-500 pl-3 pr-4 py-2 rounded-r-lg text-red-400 text-sm animate-fade-in whitespace-nowrap shadow-lg backdrop-blur-sm">
        {message}
      </div>
    )}
  </div>
);

Row.propTypes = {
  word: PropTypes.string.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  revealedLetters: PropTypes.objectOf(PropTypes.arrayOf(PropTypes.number)),
  rowIndex: PropTypes.number,
  currentRow: PropTypes.number,
  message: PropTypes.string,
  isCorrectWord: PropTypes.bool,
};

// Компонент для эффекта проигрыша
const LoseEffect = () => (
  <div className="absolute inset-0 bg-red-500/20 animate-pulse-once backdrop-blur-sm z-40" />
);

export default function Game() {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentRow, setCurrentRow] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [letterStatuses, setLetterStatuses] = useState({});
  const [message, setMessage] = useState("");
  const [revealedLetters, setRevealedLetters] = useState({});
  const [showConfetti, setShowConfetti] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastCorrectRow, setLastCorrectRow] = useState(-1);
  const navigate = useNavigate();

  // Инициализация игры
  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
  }, []);

  const resetGame = useCallback(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
    setGuesses(Array(6).fill(""));
    setCurrentRow(0);
    setGameStatus("playing");
    setLetterStatuses({});
    setMessage("");
    setRevealedLetters({});
    setShowConfetti(false);
    setIsModalOpen(false);
    setLastCorrectRow(-1);
  }, []);

  // Проверка слова
  const checkGuess = useCallback(
    (guess) => {
      const statuses = Array(5).fill(LETTER_STATUS.ABSENT);
      const targetLetters = targetWord.split("");

      // Сначала проверяем точные совпадения
      for (let i = 0; i < 5; i++) {
        if (guess[i] === targetLetters[i]) {
          statuses[i] = LETTER_STATUS.CORRECT;
          targetLetters[i] = null;
        }
      }

      // Затем проверяем буквы, которые есть в слове, но на других позициях
      for (let i = 0; i < 5; i++) {
        if (
          statuses[i] !== LETTER_STATUS.CORRECT &&
          targetLetters.includes(guess[i])
        ) {
          statuses[i] = LETTER_STATUS.PRESENT;
          targetLetters[targetLetters.indexOf(guess[i])] = null;
        }
      }

      return statuses;
    },
    [targetWord]
  );

  // Обработка нажатия клавиш
  const handleKeyPress = useCallback(
    (key) => {
      if (gameStatus !== "playing") return;

      setMessage("");
      const currentGuess = guesses[currentRow];

      if (key === "Backspace") {
        setGuesses((prev) => {
          const newGuesses = [...prev];
          newGuesses[currentRow] = currentGuess.slice(0, -1);
          return newGuesses;
        });
      } else if (key === "Enter") {
        if (currentGuess.length !== 5) {
          setMessage("Слово должно состоять из 5 букв");
          return;
        }
        if (!WORDS.includes(currentGuess)) {
          setMessage("Слово не найдено в словаре");
          return;
        }

        const statuses = checkGuess(currentGuess);
        const newLetterStatuses = { ...letterStatuses };
        const newRevealedLetters = { ...revealedLetters };

        currentGuess.split("").forEach((letter, index) => {
          const currentStatus = statuses[index];
          const existingStatus = newLetterStatuses[letter];

          if (
            !existingStatus ||
            currentStatus === LETTER_STATUS.CORRECT ||
            (currentStatus === LETTER_STATUS.PRESENT &&
              existingStatus === LETTER_STATUS.ABSENT)
          ) {
            newLetterStatuses[letter] = currentStatus;
          }

          if (currentStatus === LETTER_STATUS.CORRECT) {
            if (!newRevealedLetters[letter]) {
              newRevealedLetters[letter] = [];
            }
            if (!newRevealedLetters[letter].includes(index)) {
              newRevealedLetters[letter].push(index);
            }
          }
        });

        setLetterStatuses(newLetterStatuses);
        setRevealedLetters(newRevealedLetters);

        if (currentGuess === targetWord) {
          setLastCorrectRow(currentRow);
          setGameStatus("won");
          setShowConfetti(true);
          setTimeout(() => {
            setIsModalOpen(true);
          }, 1000);
        } else if (currentRow === 5) {
          setGameStatus("lost");
          setTimeout(() => {
            setIsModalOpen(true);
          }, 1500);
        } else {
          setCurrentRow((prev) => prev + 1);
        }
      } else if (/^[а-яё]$/.test(key) && currentGuess.length < 5) {
        setGuesses((prev) => {
          const newGuesses = [...prev];
          newGuesses[currentRow] = currentGuess + key;
          return newGuesses;
        });
      } else if (/^[a-zA-Z0-9]$/.test(key)) {
        setMessage("Используйте русскую раскладку клавиатуры");
      }
    },
    [
      currentRow,
      guesses,
      gameStatus,
      checkGuess,
      targetWord,
      letterStatuses,
      revealedLetters,
    ]
  );

  // Обработка физической клавиатуры
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Backspace" || e.key === "Enter") {
        handleKeyPress(e.key);
      } else if (/^[а-яёА-ЯЁ]$/.test(e.key)) {
        handleKeyPress(e.key.toLowerCase());
      } else if (/^[a-zA-Z0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-800 p-4">
      <div className="absolute top-4 left-4">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2 px-3 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors shadow-lg"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          <span className="hidden sm:inline">В меню</span>
        </button>
      </div>

      <h1 className="text-4xl font-bold text-gray-100 mb-2" translate="no">
        Wordle
      </h1>

      <div className="h-[60px] flex items-center justify-center mb-2 sm:hidden">
        {message && (
          <div className="inline-block bg-red-500/10 border-l-4 border-red-500 pl-3 pr-4 py-2 rounded-r-lg text-red-400 text-sm animate-fade-in backdrop-blur-sm">
            {message}
          </div>
        )}
      </div>

      <div className="relative w-full max-w-lg mx-auto">
        {showConfetti && <Confetti />}
        {gameStatus === "lost" && <LoseEffect />}

        <div className="flex flex-col gap-2 mb-8">
          {guesses.map((guess, i) => (
            <Row
              key={i}
              word={guess}
              statuses={
                i === currentRow
                  ? Array(5).fill(LETTER_STATUS.EMPTY)
                  : i < currentRow
                  ? checkGuess(guess)
                  : Array(5).fill(LETTER_STATUS.EMPTY)
              }
              revealedLetters={revealedLetters}
              rowIndex={i}
              currentRow={currentRow}
              message={i === currentRow ? message : ""}
              isCorrectWord={i === lastCorrectRow}
            />
          ))}
        </div>
      </div>

      <Keyboard onKeyPress={handleKeyPress} letterStatuses={letterStatuses} />

      <ThemeToggle className="fixed bottom-4 right-4 z-50" />

      <Modal
        isOpen={isModalOpen}
        onRequestClose={() => {
          setIsModalOpen(false);
          setShowConfetti(false);
        }}
        style={customModalStyles}
        contentLabel="Game Over"
      >
        <div className="text-center">
          <h2
            className="text-2xl font-bold mb-4"
            style={{ color: "var(--text-primary)" }}
          >
            {gameStatus === "won" ? "Поздравляем!" : "Игра окончена"}
          </h2>
          <p className="mb-6" style={{ color: "var(--text-secondary)" }}>
            {gameStatus === "won"
              ? `Вы угадали слово! Слово: ${targetWord.toUpperCase()}`
              : `Загаданное слово было: ${targetWord.toUpperCase()}`}
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={resetGame}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ArrowPathIcon className="w-5 h-5" />
              <span>Играть снова</span>
            </button>
            <button
              onClick={() => {
                navigate("/");
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
            >
              <HomeIcon className="w-5 h-5" />
              <span>В меню</span>
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
