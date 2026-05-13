import { useState, useEffect, useRef, useCallback } from 'react';

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

export function useTextScramble(
  finalText: string,
  options: { speed?: number; delay?: number; onComplete?: () => void } = {}
) {
  const { speed = 30, delay = 0, onComplete } = options;
  const [displayText, setDisplayText] = useState('');
  const [isComplete, setIsComplete] = useState(false);
  const frameRef = useRef<number>(0);
  const startTimeRef = useRef<number>(0);

  const scramble = useCallback(() => {
    const start = () => {
      startTimeRef.current = Date.now();
      let iteration = 0;
      const totalIterations = finalText.length * 3;

      const tick = () => {
        const progress = Math.min(iteration / totalIterations, 1);
        const revealedCount = Math.floor(progress * finalText.length);

        let result = '';
        for (let i = 0; i < finalText.length; i++) {
          if (i < revealedCount) {
            result += finalText[i];
          } else if (i < revealedCount + 3 && Math.random() > 0.5) {
            result += finalText[i];
          } else {
            result += CHARS[Math.floor(Math.random() * CHARS.length)];
          }
        }

        setDisplayText(result);
        iteration++;

        if (progress < 1) {
          frameRef.current = setTimeout(tick, speed);
        } else {
          setDisplayText(finalText);
          setIsComplete(true);
          onComplete?.();
        }
      };

      tick();
    };

    if (delay > 0) {
      setTimeout(start, delay);
    } else {
      start();
    }

    return () => {
      if (frameRef.current) clearTimeout(frameRef.current);
    };
  }, [finalText, speed, delay, onComplete]);

  useEffect(() => {
    const cleanup = scramble();
    return cleanup;
  }, [scramble]);

  return { displayText, isComplete };
}
