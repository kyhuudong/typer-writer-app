export type CharacterState = "correct" | "incorrect" | "current" | "pending";

export function countTypedWords(text: string) {
  const trimmed = text.trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

export function countCorrectCharacters(target: string, typed: string) {
  return target.split("").reduce((count, character, index) => {
    return count + (typed[index] === character ? 1 : 0);
  }, 0);
}

export function calculateWpm(input: { correctChars: number; elapsedMs: number }) {
  if (input.elapsedMs <= 0) {
    return 0;
  }

  return Math.round((input.correctChars / 5) / (input.elapsedMs / 60000));
}

export function calculateAccuracy(input: { correctChars: number; totalChars: number }) {
  if (input.totalChars <= 0) {
    return 0;
  }

  return Math.round((input.correctChars / input.totalChars) * 100);
}

export function calculateCompletionPercent(input: { typedChars: number; totalChars: number }) {
  if (input.totalChars <= 0) {
    return 0;
  }

  return Math.min(100, Math.round((input.typedChars / input.totalChars) * 100));
}

export function getCharacterStates(target: string, typed: string) {
  return target.split("").map((character, index) => {
    if (typed[index] === character) {
      return { character, state: "correct" as CharacterState };
    }

    if (index < typed.length) {
      return { character, state: "incorrect" as CharacterState };
    }

    if (index === typed.length) {
      return { character, state: "current" as CharacterState };
    }

    return { character, state: "pending" as CharacterState };
  });
}
