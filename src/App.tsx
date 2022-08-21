import {
  ChangeEventHandler,
  useCallback,
  useMemo,
  useRef,
  useState,
} from 'react';
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

const SAVED_NUM_OPTIONS_KEY = '__NUM_OPTIONS';

const App = () => {
  const [target, setTarget] = useState(makeTarget);
  const [numOptions, setNumOptions] = useState(
    parseInt(window.localStorage.getItem(SAVED_NUM_OPTIONS_KEY) || '2', 10),
  );

  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);

  const setInstance = useCallback((instance: confetti.CreateTypes | null) => {
    refAnimationInstance.current = instance;
  }, []);

  const makeShot = useCallback(
    (particleRatio: number, opts: confetti.Options) => {
      refAnimationInstance.current?.({
        ...opts,
        origin: { y: 1 },
        particleCount: Math.floor(200 * particleRatio),
      });
    },
    [],
  );

  const fire = useCallback(() => {
    makeShot(0.25, {
      ticks: 60,
      spread: 26,
      startVelocity: 55,
    });

    makeShot(0.2, {
      ticks: 60,
      spread: 60,
    });

    makeShot(0.35, {
      ticks: 60,
      spread: 100,
      decay: 0.91,
      scalar: 0.8,
    });

    makeShot(0.1, {
      ticks: 60,
      spread: 120,
      startVelocity: 25,
      decay: 0.92,
      scalar: 1.2,
    });

    makeShot(0.1, {
      ticks: 60,
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

  const updateNumOptions: ChangeEventHandler<HTMLInputElement> = (e) => {
    const newNumOptions = parseInt(e.target.value, 10);
    setNumOptions(newNumOptions);
    window.localStorage.setItem(
      SAVED_NUM_OPTIONS_KEY,
      newNumOptions.toString(),
    );
  };

  return (
    <>
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
          onChange={updateNumOptions}
          className="fixed left-4 right-4 bottom-4"
        />
      </div>
    </>
  );
};

export default App;
