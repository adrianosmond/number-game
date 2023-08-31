import { ChangeEventHandler, useEffect, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import useConfetti from './hooks/useConfetti';
import useVisualViewportHeight from './hooks/useVisualViewportHeight';

type Target = number | string;

enum TARGET_TYPE {
  NUMBERS,
  LETTERS,
}

const LETTERS = 'abcdefghijklmnopqrstuvwxyz';

const pickRandom = (targetType: TARGET_TYPE) =>
  targetType === TARGET_TYPE.NUMBERS
    ? Math.floor(Math.random() * 9) + 1
    : LETTERS[Math.floor(Math.random() * 26)];

const makeTarget = (targetType: TARGET_TYPE, currentTarget?: Target) => {
  let newTarget = pickRandom(targetType);

  while (newTarget === currentTarget) {
    newTarget = pickRandom(targetType);
  }
  return newTarget;
};

const makeOptions = (
  targetType: TARGET_TYPE,
  target: Target,
  numOptions = 2,
) => {
  const options = new Set([target]);
  while (options.size < numOptions) {
    options.add(makeTarget(targetType));
  }
  return Array.from(options).sort();
};

const getColumnClass = (numOptions: number) =>
  [2, 4].includes(numOptions) ? 'grid-cols-2' : 'grid-cols-3';

const SAVED_NUM_OPTIONS_KEY = '__NUM_OPTIONS';

const App = () => {
  const [showSettings, setShowSettings] = useState(false);
  const [targetType, setTargetType] = useState(TARGET_TYPE.NUMBERS);
  const height = useVisualViewportHeight();
  const [target, setTarget] = useState(makeTarget(targetType));
  const [hidden, setHidden] = useState(false);
  const [numOptions, setNumOptions] = useState(
    parseInt(window.localStorage.getItem(SAVED_NUM_OPTIONS_KEY) || '2', 10),
  );

  const { fireConfetti, setConfettiInstance } = useConfetti();

  const options = makeOptions(targetType, target, numOptions);

  const giveAnswer = (option: Target) => {
    if (option === target) {
      fireConfetti();
    } else {
      setHidden(true);
      setTimeout(() => {
        setHidden(false);
      }, 1000);
    }

    setTarget(makeTarget(targetType, target));
  };

  useEffect(() => {
    const toSpeak = new SpeechSynthesisUtterance(`${target}`);
    toSpeak.rate = 0.7;
    window.speechSynthesis.speak(toSpeak);
  }, [target]);

  const updateNumOptions: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newNumOptions = parseInt(e.target.value, 10);
    setNumOptions(newNumOptions);
    window.localStorage.setItem(
      SAVED_NUM_OPTIONS_KEY,
      newNumOptions.toString(),
    );
  };

  return (
    <div style={{ minHeight: height }} className="flex flex-col justify-center">
      <button
        onClick={() => {
          setShowSettings((s) => !s);
        }}
        className="fixed top-2 right-2 w-8 h-8"
      >
        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48">
          <path
            className="fill-gray-400"
            d="m19.4 44-1-6.3q-.95-.35-2-.95t-1.85-1.25l-5.9 2.7L4 30l5.4-3.95q-.1-.45-.125-1.025Q9.25 24.45 9.25 24q0-.45.025-1.025T9.4 21.95L4 18l4.65-8.2 5.9 2.7q.8-.65 1.85-1.25t2-.9l1-6.35h9.2l1 6.3q.95.35 2.025.925Q32.7 11.8 33.45 12.5l5.9-2.7L44 18l-5.4 3.85q.1.5.125 1.075.025.575.025 1.075t-.025 1.05q-.025.55-.125 1.05L44 30l-4.65 8.2-5.9-2.7q-.8.65-1.825 1.275-1.025.625-2.025.925l-1 6.3ZM24 30.5q2.7 0 4.6-1.9 1.9-1.9 1.9-4.6 0-2.7-1.9-4.6-1.9-1.9-4.6-1.9-2.7 0-4.6 1.9-1.9 1.9-1.9 4.6 0 2.7 1.9 4.6 1.9 1.9 4.6 1.9Zm0-3q-1.45 0-2.475-1.025Q20.5 25.45 20.5 24q0-1.45 1.025-2.475Q22.55 20.5 24 20.5q1.45 0 2.475 1.025Q27.5 22.55 27.5 24q0 1.45-1.025 2.475Q25.45 27.5 24 27.5Zm0-3.5Zm-2.2 17h4.4l.7-5.6q1.65-.4 3.125-1.25T32.7 32.1l5.3 2.3 2-3.6-4.7-3.45q.2-.85.325-1.675.125-.825.125-1.675 0-.85-.1-1.675-.1-.825-.35-1.675L40 17.2l-2-3.6-5.3 2.3q-1.15-1.3-2.6-2.175-1.45-.875-3.2-1.125L26.2 7h-4.4l-.7 5.6q-1.7.35-3.175 1.2-1.475.85-2.625 2.1L10 13.6l-2 3.6 4.7 3.45q-.2.85-.325 1.675-.125.825-.125 1.675 0 .85.125 1.675.125.825.325 1.675L8 30.8l2 3.6 5.3-2.3q1.2 1.2 2.675 2.05Q19.45 35 21.1 35.4Z"
          />
        </svg>
      </button>
      {showSettings && (
        <div className="p-4">
          <div className="text-xl text-center">{numOptions}</div>
          <input
            type="range"
            min={2}
            max={9}
            value={numOptions}
            onChange={updateNumOptions}
            className="w-full"
          />
          {targetType !== TARGET_TYPE.LETTERS && (
            <button
              className="w-full p-2 bg-green-700 text-white"
              onClick={() => {
                setTargetType(TARGET_TYPE.LETTERS);
                setTarget(makeTarget(TARGET_TYPE.LETTERS, target));
              }}
            >
              Switch to Letters
            </button>
          )}
          {targetType !== TARGET_TYPE.NUMBERS && (
            <button
              className="w-full p-2 bg-green-700 text-white"
              onClick={() => {
                setTargetType(TARGET_TYPE.NUMBERS);
                setTarget(makeTarget(TARGET_TYPE.NUMBERS, target));
              }}
            >
              Switch to Numbers
            </button>
          )}
        </div>
      )}
      {!hidden && !showSettings && (
        <div className="text-3xl flex portrait:flex-col items-center landscape:justify-between portrait:gap-12">
          <div className="text-8xl font-bold mx-auto flex-grow landscape:basis-0 capitalize">
            {target}
          </div>
          <div
            className={`grid gap-4 justify-center flex-grow landscape:basis-0 ${getColumnClass(
              numOptions,
            )}`}
          >
            {options.map((option) => (
              <button
                className="bg-green-500 text-white py-2 px-4 aspect-square font-bold leading-none capitalize"
                key={option}
                onClick={() => giveAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
          <ReactCanvasConfetti
            refConfetti={setConfettiInstance}
            style={{
              position: 'fixed',
              pointerEvents: 'none',
              width: '100%',
              height: '100%',
              top: 0,
              left: 0,
            }}
          />
        </div>
      )}
    </div>
  );
};

export default App;
