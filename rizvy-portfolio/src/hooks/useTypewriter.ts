import { useEffect, useState } from "react";

// Types a word, pauses, deletes it, then moves to the next word
export function useTypewriter(
  words: string[],
  typingSpeed = 80,
  deletingSpeed = 40,
  pause = 1400
) {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index % words.length];
    let delay = deleting ? deletingSpeed : typingSpeed;
    if (!deleting && text === word) delay = pause;

    const timer = setTimeout(() => {
      if (!deleting && text === word) {
        setDeleting(true);
        return;
      }
      if (deleting && text === "") {
        setDeleting(false);
        setIndex((i) => i + 1);
        return;
      }
      setText(
        deleting ? word.slice(0, text.length - 1) : word.slice(0, text.length + 1)
      );
    }, delay);

    return () => clearTimeout(timer);
  }, [text, deleting, index, words, typingSpeed, deletingSpeed, pause]);

  return text;
}