import { useState, useEffect, useCallback } from 'react';

const GREETINGS = ["Heyyyyyy", "Hi", "Wolaaa", "¿?", "Kiuboooo", "¿Qué tal?"];
const TYPING_SPEED = 100;
const DELETING_SPEED = 50;
const PAUSE_DURATION = 2000;

export default function TypewriterText() {
  const [displayText, setDisplayText] = useState('');
  const [greetingIndex, setGreetingIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const currentGreeting = GREETINGS[greetingIndex];

  const tick = useCallback(() => {
    if (isPaused) return;

    if (!isDeleting) {
      if (displayText.length < currentGreeting.length) {
        setDisplayText(currentGreeting.slice(0, displayText.length + 1));
      } else {
        setIsPaused(true);
        setTimeout(() => {
          setIsPaused(false);
          setIsDeleting(true);
        }, PAUSE_DURATION);
      }
    } else {
      if (displayText.length > 0) {
        setDisplayText(displayText.slice(0, -1));
      } else {
        setIsDeleting(false);
        setGreetingIndex((prev) => (prev + 1) % GREETINGS.length);
      }
    }
  }, [displayText, greetingIndex, isDeleting, isPaused, currentGreeting]);

  useEffect(() => {
    if (isPaused) return;
    const speed = isDeleting ? DELETING_SPEED : TYPING_SPEED;
    const timer = setTimeout(tick, speed);
    return () => clearTimeout(timer);
  }, [tick, isDeleting, isPaused]);

  return (
    <h1 className="font-geist text-white text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] mb-6 min-h-[4rem] md:min-h-[7rem]">
      {displayText}
      <span
        className="inline-block ml-1 text-white"
        style={{ animation: 'blink 1s step-end infinite' }}
      >
        |
      </span>
    </h1>
  );
}
