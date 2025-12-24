// src/utils/random-code-generator.ts

export const generateSixDigitsCode = (): Number => {
  return Math.floor(900000 * Math.random()) + 100000;
};
