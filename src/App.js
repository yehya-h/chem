import { useState, useEffect, useRef } from "react";
import "./App.css";

const QUESTIONS = [
  {
    q: "What is the functional group in alcohols?",
    options: ["-COOH", "-OH", "-NH2", "-CHO"],
    answer: "-OH",
  },
  {
    q: "What type of bond exists in alkenes?",
    options: ["Single", "Double", "Triple", "Ionic"],
    answer: "Double",
  },
  {
    q: "What is the simplest alkane?",
    options: ["Methane", "Ethane", "Propane", "Butane"],
    answer: "Methane",
  },
  {
    q: "What is the general formula of alkanes?",
    options: ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"],
    answer: "CnH2n+2",
  },
  {
    q: "Which element is always present in organic chemistry?",
    options: ["Oxygen", "Carbon", "Nitrogen", "Sulfur"],
    answer: "Carbon",
  },
  {
    q: "Single bonds allow what type of rotation?",
    options: ["No rotation", "Free rotation", "Ionic rotation", "Fixed"],
    answer: "Free rotation",
  },
];

const PHRASE = "Happy Birthday rukia";

function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

export default function App() {
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(
    PHRASE.split("")
      .map((c, i) => (c === " " ? i : null))
      .filter((i) => i !== null),
  );
  const [selected, setSelected] = useState(null);
  const [completed, setCompleted] = useState(false);

  const audioRef = useRef(null);

  // const revealLetters = () => {
  //   setRevealed((prev) => {
  //     // only letters that are NOT spaces and NOT revealed
  //     const remaining = PHRASE.split("")
  //       .map((c, i) => (c !== " " ? i : null))
  //       .filter((i) => i !== null && !prev.includes(i));

  //     const amountToReveal = Math.min(3, remaining.length);
  //     const newLetters = shuffle(remaining).slice(0, amountToReveal);

  //     const updated = [...prev, ...newLetters];

  //     if (remaining.length === amountToReveal) {
  //       setTimeout(() => {
  //         setCompleted(true);
  //         audioRef.current?.play();
  //       }, 800);
  //     }

  //     return updated;
  //   });
  // };

  // const handleAnswer = (option) => {
  //   if (selected) return;

  //   setSelected(option);

  //   const isCorrect = option === QUESTIONS[index].answer;

  //   setTimeout(() => {
  //     if (isCorrect) {
  //       revealLetters();

  //       if (index + 1 < QUESTIONS.length) {
  //         setIndex(index + 1);
  //       }
  //     }

  //     // IMPORTANT: reset selection in BOTH cases
  //     setSelected(null);
  //   }, 800);
  // };

  const revealLetters = () => {
  setRevealed((prev) => {
    // only letters that are NOT spaces and NOT revealed
    const remaining = PHRASE.split("")
      .map((c, i) => (c !== " " ? i : null))
      .filter((i) => i !== null && !prev.includes(i));

    const amountToReveal = Math.min(3, remaining.length);
    const newLetters = shuffle(remaining).slice(0, amountToReveal);

    const updated = [...prev, ...newLetters];

    // Check if this is the final reveal (all letters except spaces)
    const lettersOnlyCount = PHRASE.replace(/ /g, "").length;
    if (updated.length >= lettersOnlyCount) {
      setCompleted(true);

      // Play audio directly on user click
      audioRef.current?.play();
    }

    return updated;
  });
};

const handleAnswer = (option) => {
  if (selected) return;

  setSelected(option);

  const isCorrect = option === QUESTIONS[index].answer;

  setTimeout(() => {
    if (isCorrect) {
      revealLetters();

      if (index + 1 < QUESTIONS.length) {
        setIndex(index + 1);
      }
    }

    // reset selection in BOTH cases
    setSelected(null);
  }, 300); // shorter timeout to make it feel responsive
};


  useEffect(() => {
    if (revealed.length >= PHRASE.length) {
      setTimeout(() => {
        setCompleted(true);
        audioRef.current.play();
      }, 1000);
    }
  }, [revealed]);

  return (
    <div className="app">
      {/* <h1>🎂 Birthday Challenge 🎂</h1> */}

      <div className={`phrase ${completed ? "ordered" : ""}`}>
        {PHRASE.split("").map((char, i) =>
          revealed.includes(i) ? (
            <span key={i}>{char}</span>
          ) : (
            <span key={i} className="hidden">
              •
            </span>
          ),
        )}
      </div>

      {!completed ? (
        <div className="card">
          <h2>{QUESTIONS[index].q}</h2>

          {QUESTIONS[index].options.map((opt) => {
            let className = "";

            if (selected === opt) {
              className = opt === QUESTIONS[index].answer ? "correct" : "wrong";
            }

            return (
              <button
                key={opt}
                className={className}
                onClick={() => handleAnswer(opt)}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ) : (
        <div className="final">
          <h2>🎉 HAPPY BIRTHDAY RUKIA 🎉</h2>
          <img src={process.env.PUBLIC_URL + "/birthday.gif"} alt="birthday gif" />
        </div>
      )}

      <audio ref={audioRef} src={process.env.PUBLIC_URL + "/birthday.mp3"} />
    </div>
  );
}
