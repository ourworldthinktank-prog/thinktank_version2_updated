// Words that rotate in the hero headline: "Ideas for [a fairer] world."
// "a"/"an" is part of the rotating phrase so the grammar is always right. c1/c2 tint the word and the globe glow.
export const HERO_WORDS = [
  { a: "a", w: "fairer", c1: "#F7A21B", c2: "#FF5C8A" },
  { a: "an", w: "inclusive", c1: "#7FE8F5", c2: "#8A8CFF" },
  { a: "a", w: "sustainable", c1: "#5FE3B8", c2: "#1FC1DE" },
  { a: "a", w: "democratic", c1: "#FFB48F", c2: "#F26B3A" },
  { a: "a", w: "progressive", c1: "#C9A8FF", c2: "#FF5C8A" },
  { a: "a", w: "just", c1: "#FFD08A", c2: "#F26B3A" },
] as const;
export const HERO_WORD_EVENT = "owii:word";
