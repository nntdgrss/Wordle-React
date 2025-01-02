import { useState, useEffect, useCallback } from "react";
import PropTypes from "prop-types";
import { WORDS } from "./words";

// Константы для статусов букв
const LETTER_STATUS = {
  CORRECT: "correct",
  PRESENT: "present",
  ABSENT: "absent",
  EMPTY: "empty",
  REVEALED: "revealed",
};

// Компонент для отображения клавиатуры
const Keyboard = ({ onKeyPress, letterStatuses }) => {
  const rows = [
    ["й", "ц", "у", "к", "е", "н", "г", "ш", "щ", "з", "х", "ъ"],
    ["ф", "ы", "в", "а", "п", "р", "о", "л", "д", "ж", "э"],
    ["я", "ч", "с", "м", "и", "т", "ь", "б", "ю"],
  ];

  return (
    <div className="flex flex-col gap-2 w-full max-w-3xl mx-auto mt-4">
      {rows.map((row, i) => (
        <div key={i} className="flex justify-center gap-1">
          {row.map((key) => (
            <button
              key={key}
              onClick={() => onKeyPress(key)}
              className={`px-2 py-4 rounded-lg font-bold text-sm transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5
                ${
                  letterStatuses[key] === LETTER_STATUS.CORRECT
                    ? "bg-green-600 text-white hover:bg-green-700"
                    : letterStatuses[key] === LETTER_STATUS.PRESENT
                    ? "bg-yellow-600 text-white hover:bg-yellow-700"
                    : letterStatuses[key] === LETTER_STATUS.ABSENT
                    ? "bg-gray-600 text-white hover:bg-gray-700"
                    : "bg-gray-700 text-gray-200 hover:bg-gray-600"
                }`}
            >
              {key.toUpperCase()}
            </button>
          ))}
        </div>
      ))}
      <div className="flex justify-center gap-2">
        <button
          onClick={() => onKeyPress("Backspace")}
          className="px-6 py-4 rounded-lg bg-gray-700 text-gray-200 font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:bg-gray-600"
        >
          ←
        </button>
        <button
          onClick={() => onKeyPress("Enter")}
          className="px-6 py-4 rounded-lg bg-gray-700 text-gray-200 font-bold shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 hover:bg-gray-600"
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
const Letter = ({ value, status, revealedLetters }) => {
  const isRevealed = revealedLetters && revealedLetters[value.toLowerCase()];

  return (
    <div
      className={`w-14 h-14 border-2 flex items-center justify-center font-bold text-2xl rounded-lg transition-all duration-300
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
      `}
    >
      {value.toUpperCase()}
    </div>
  );
};

Letter.propTypes = {
  value: PropTypes.string.isRequired,
  status: PropTypes.string.isRequired,
  revealedLetters: PropTypes.objectOf(PropTypes.bool),
};

// Компонент для отображения строки букв
const Row = ({ word, statuses, revealedLetters }) => (
  <div className="flex gap-2">
    {Array(5)
      .fill(null)
      .map((_, i) => (
        <Letter
          key={i}
          value={word[i] || ""}
          status={statuses[i] || LETTER_STATUS.EMPTY}
          revealedLetters={revealedLetters}
        />
      ))}
  </div>
);

Row.propTypes = {
  word: PropTypes.string.isRequired,
  statuses: PropTypes.arrayOf(PropTypes.string).isRequired,
  revealedLetters: PropTypes.objectOf(PropTypes.bool),
};

export default function Game() {
  const [targetWord, setTargetWord] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(""));
  const [currentRow, setCurrentRow] = useState(0);
  const [gameStatus, setGameStatus] = useState("playing");
  const [letterStatuses, setLetterStatuses] = useState({});
  const [message, setMessage] = useState("");
  const [revealedLetters, setRevealedLetters] = useState({});

  // Инициализация игры
  useEffect(() => {
    const randomWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setTargetWord(randomWord);
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

        // Обновляем статусы букв на клавиатуре
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

          // Обновляем разгаданные буквы
          if (currentStatus === LETTER_STATUS.CORRECT) {
            newRevealedLetters[letter] = true;
          }
        });

        setLetterStatuses(newLetterStatuses);
        setRevealedLetters(newRevealedLetters);

        if (currentGuess === targetWord) {
          setGameStatus("won");
          setMessage("Поздравляем! Вы угадали слово!");
        } else if (currentRow === 5) {
          setGameStatus("lost");
          setMessage(
            `Игра окончена. Загаданное слово: ${targetWord.toUpperCase()}`
          );
        } else {
          setCurrentRow((prev) => prev + 1);
        }
      } else if (/^[а-яё]$/.test(key) && currentGuess.length < 5) {
        setGuesses((prev) => {
          const newGuesses = [...prev];
          newGuesses[currentRow] = currentGuess + key;
          return newGuesses;
        });
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
      if (
        e.key === "Backspace" ||
        e.key === "Enter" ||
        /^[а-яё]$/.test(e.key)
      ) {
        handleKeyPress(e.key);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div className="flex flex-col items-center min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 p-4">
      <h1 className="text-4xl font-bold text-gray-100 mb-8">Wordle</h1>

      {message && (
        <div className="bg-gray-800 border-l-4 border-blue-500 text-blue-400 p-4 rounded-lg shadow-md mb-6 animate-fade-in">
          {message}
        </div>
      )}

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
          />
        ))}
      </div>

      <Keyboard onKeyPress={handleKeyPress} letterStatuses={letterStatuses} />
    </div>
  );
}
