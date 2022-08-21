import { ChangeEventHandler, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import useConfetti from './hooks/useConfetti';
import useVisualViewportHeight from './hooks/useVisualViewportHeight';

const makeTarget = (currentTarget?: number) => {
  let newTarget = Math.floor(Math.random() * 9) + 1;
  while (newTarget === currentTarget) {
    newTarget = Math.floor(Math.random() * 9) + 1;
  }
  return newTarget;
};

const makeOptions = (target: number, numOptions = 2) => {
  const options = new Set([target]);
  while (options.size < numOptions) {
    options.add(makeTarget());
  }
  return Array.from(options).sort();
};

const getColumnClass = (numOptions: number) =>
  [2, 4].includes(numOptions) ? 'grid-cols-2' : 'grid-cols-3';

const SAVED_NUM_OPTIONS_KEY = '__NUM_OPTIONS';

const App = () => {
  const height = useVisualViewportHeight();

  const [target, setTarget] = useState(makeTarget);
  const [numOptions, setNumOptions] = useState(
    parseInt(window.localStorage.getItem(SAVED_NUM_OPTIONS_KEY) || '2', 10),
  );

  const { fireConfetti, setConfettiInstance } = useConfetti();

  const options = makeOptions(target, numOptions);

  const giveAnswer = (option: number) => {
    if (option === target) {
      fireConfetti();
    }
    const t = makeTarget(target);
    setTarget(t);
  };

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
      <div className="text-3xl flex portrait:flex-col items-center landscape:justify-between portrait:gap-12">
        <div className="text-8xl font-bold mx-auto flex-grow landscape:basis-0">
          {target}
        </div>
        <div
          className={`grid gap-4 justify-center flex-grow landscape:basis-0 ${getColumnClass(
            numOptions,
          )}`}
        >
          {options.map((option) => (
            <button
              className="bg-green-500 text-white py-2 px-4 aspect-square font-bold leading-none"
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
        <input
          type="range"
          min={2}
          max={9}
          value={numOptions}
          onChange={updateNumOptions}
          className="fixed left-4 right-4 top-4"
        />
      </div>
    </div>
  );
};

export default App;
