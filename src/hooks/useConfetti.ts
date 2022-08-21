import { useCallback, useRef } from 'react';

export default () => {
  const refAnimationInstance = useRef<confetti.CreateTypes | null>(null);

  const setConfettiInstance = useCallback(
    (instance: confetti.CreateTypes | null) => {
      refAnimationInstance.current = instance;
    },
    [],
  );

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

  const fireConfetti = useCallback(() => {
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

  return { fireConfetti, setConfettiInstance };
};
