import { useState, useEffect } from "react";

const sillyOptions = [
  "blockchain-native petstore",
  "AI-powered fortune cookie generator",
  "NFT marketplace for digital socks",
  "social network for houseplants",
  "cryptocurrency for imaginary friends",
  "dating app for robots",
  "food delivery service for ghosts",
  "streaming platform for elevator music",
  "crowdfunding site for time travel research",
  "marketplace for selling dreams",
];

export function useCyclingPlaceholder(
  intervalMs: number = 2000,
  typewriterSpeed: number = 50
) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (isTyping) return; // Don't start new cycle while typing

    const cycleInterval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sillyOptions.length;
      const nextText = sillyOptions[nextIndex];

      // Start clearing current text
      setIsTyping(true);
      setDisplayText("");

      // After clearing, start typing new text
      setTimeout(() => {
        let charIndex = 0;
        const typeInterval = setInterval(() => {
          if (charIndex < nextText.length) {
            setDisplayText(nextText.slice(0, charIndex + 1));
            charIndex++;
          } else {
            clearInterval(typeInterval);
            setIsTyping(false);
            setCurrentIndex(nextIndex);
          }
        }, typewriterSpeed);
      }, 200); // Small delay after clearing
    }, intervalMs);

    return () => clearInterval(cycleInterval);
  }, [currentIndex, intervalMs, typewriterSpeed, isTyping]);

  // Initial typing effect on mount
  useEffect(() => {
    const initialText = sillyOptions[0];
    setIsTyping(true);
    let charIndex = 0;
    const typeInterval = setInterval(() => {
      if (charIndex < initialText.length) {
        setDisplayText(initialText.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typeInterval);
        setIsTyping(false);
      }
    }, typewriterSpeed);

    return () => clearInterval(typeInterval);
  }, [typewriterSpeed]);

  return displayText;
}
