import { useCallback, useMemo, useRef, useState } from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';

const makeTarget = () => Math.floor(Math.random() * 9) + 1;

const makeOptions = (target: number, numOptions = 2) => {
  const options = new Set([target]);
  while (options.size < numOptions) {
    options.add(makeTarget());
  }
  return Array.from(options).sort();
};

const getColumnClass = (numOptions: number) =>
  [2, 4].includes(numOptions) ? 'grid-cols-2' : 'grid-cols-3';

const App = () => {
  const [target, setTarget] = useState(makeTarget);
  const [numOptions, setNumOptions] = useState(2);

  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);

  const setInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback(
    (particleRatio: number, opts: confetti.Options) => {
      refAnimationInstance.current?.({
        ...opts,
        origin: { y: 0.7 },
        particleCount: Math.floor(200 * particleRatio),
      });
    },
    [],
  );

  const fire = useCallback(() => {
    makeShot(0.25, {
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      spread: 60,
    });

    makeShot(0.35, {
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      spread: 120,
      startVelocity: 45,
    });
  }, [makeShot]);

  const options = useMemo(
    () => makeOptions(target, numOptions),
    [target, numOptions],
  );

  const giveAnswer = (option: number) => {
    if (option === target) {
      fire();
    }
    const t = makeTarget();
    setTarget(t);
  };

  return (
    <div className="text-3xl">
      <div className="text-8xl font-bold mx-auto">{target}</div>
      <div
        className={`grid gap-4 justify-center mt-8  ${getColumnClass(
          numOptions,
        )}`}
      >
        {options.map((option) => (
          <button
            className="bg-green-500 text-white py-2 px-4 aspect-square font-bold"
            key={option}
            onClick={() => giveAnswer(option)}
          >
            {option}
          </button>
        ))}
      </div>
      <ReactCanvasConfetti
        refConfetti={setInstance}
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
        onChange={(e) => {
          setNumOptions(parseInt(e.target.value, 10));
        }}
        className="fixed left-4 right-4 bottom-4"
      />
    </div>
  );
};

export default App;
