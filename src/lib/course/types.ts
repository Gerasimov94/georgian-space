export type Vocab = {
  ka: string;
  latin: string;
  en: string;
  note?: string;
};

export type GrammarTable = {
  head: string[];
  rows: string[][];
};

/**
 * Everything a lesson can contain. Exercises are plain data so that units are
 * authored as content, not as components.
 */
export type Exercise =
  | {
      kind: "note";
      id: string;
      title: string;
      body: string;
      table?: GrammarTable;
    }
  | { kind: "flashcard"; id: string; item: Vocab }
  | {
      kind: "multipleChoice";
      id: string;
      /** Direction, used for styling the prompt in Georgian or Latin script. */
      direction: "kaToEn" | "enToKa" | "sound";
      prompt: string;
      answer: string;
      options: string[];
      helper?: string;
    }
  | {
      kind: "matchPairs";
      id: string;
      prompt: string;
      pairs: { left: string; right: string }[];
    }
  | {
      kind: "fillGap";
      id: string;
      /** The full word; the letter at `index` is hidden. */
      word: string;
      index: number;
      options: string[];
      en: string;
    }
  | {
      kind: "unscramble";
      id: string;
      /** Correct order. The player shuffles them deterministically. */
      words: string[];
      en: string;
    }
  | {
      kind: "typeAnswer";
      id: string;
      prompt: string;
      answer: string;
      alternatives?: string[];
      script: "georgian" | "latin";
      helper?: string;
    }
  | { kind: "writeLetter"; id: string; char: string; helper?: string }
  | {
      kind: "listenChoose";
      id: string;
      ka: string;
      answer: string;
      options: string[];
    };

export type Lesson = {
  id: string;
  title: string;
  subtitle?: string;
  exercises: Exercise[];
};

export type Unit = {
  id: string;
  title: string;
  ka?: string;
  description: string;
  vocab: Vocab[];
  lessons: Lesson[];
};

/** Exercises that only present information and are never marked wrong. */
export function isGraded(exercise: Exercise): boolean {
  return exercise.kind !== "note" && exercise.kind !== "flashcard";
}
