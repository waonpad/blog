export const getUniqueChars = (text: string): string => {
  const charSet = new Set<string>();

  for (const char of text) {
    charSet.add(char);
  }

  return Array.from(charSet).join("");
};
