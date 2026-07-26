import type { Exercise, Vocab } from "./types";

/**
 * Exercise builders. Distractors and shuffles are seeded from the exercise id so
 * that server and client renders agree and a lesson looks the same on reload.
 */

function hash(seed: string): number {
  let value = 2166136261;
  for (let i = 0; i < seed.length; i += 1) {
    value ^= seed.charCodeAt(i);
    value = Math.imul(value, 16777619);
  }
  return value >>> 0;
}

function mulberry32(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function seededShuffle<T>(items: T[], seed: string): T[] {
  const random = mulberry32(hash(seed));
  const out = [...items];
  for (let i = out.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function distractors(
  correct: string,
  pool: string[],
  seed: string,
  count = 3,
): string[] {
  const candidates = seededShuffle(
    pool.filter((value) => value !== correct),
    seed,
  );
  return candidates.slice(0, count);
}

export function flashcards(items: Vocab[], prefix: string): Exercise[] {
  return items.map((item, index) => ({
    kind: "flashcard",
    id: `${prefix}-flash-${index}`,
    item,
  }));
}

export function kaToEn(item: Vocab, pool: Vocab[], id: string): Exercise {
  const answer = item.en;
  const options = seededShuffle(
    [answer, ...distractors(answer, pool.map((entry) => entry.en), id)],
    `${id}-opts`,
  );
  return {
    kind: "multipleChoice",
    id,
    direction: "kaToEn",
    prompt: item.ka,
    answer,
    options,
    helper: item.latin,
  };
}

export function enToKa(item: Vocab, pool: Vocab[], id: string): Exercise {
  const answer = item.ka;
  const options = seededShuffle(
    [answer, ...distractors(answer, pool.map((entry) => entry.ka), id)],
    `${id}-opts`,
  );
  return {
    kind: "multipleChoice",
    id,
    direction: "enToKa",
    prompt: item.en,
    answer,
    options,
  };
}

export function typeKa(item: Vocab, id: string): Exercise {
  return {
    kind: "typeAnswer",
    id,
    prompt: item.en,
    answer: item.ka,
    script: "georgian",
    helper: item.latin,
  };
}

export function listen(item: Vocab, pool: Vocab[], id: string): Exercise {
  const answer = item.en;
  return {
    kind: "listenChoose",
    id,
    ka: item.ka,
    answer,
    options: seededShuffle(
      [answer, ...distractors(answer, pool.map((entry) => entry.en), id)],
      `${id}-opts`,
    ),
  };
}

export function matchPairs(
  items: Vocab[],
  id: string,
  prompt = "Match the Georgian words with their meanings",
): Exercise {
  return {
    kind: "matchPairs",
    id,
    prompt,
    pairs: items.map((item) => ({ left: item.ka, right: item.en })),
  };
}

export function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    out.push(items.slice(i, i + size));
  }
  return out;
}

/**
 * The standard drill sequence for a batch of new words: meet them, recognise
 * them in both directions, hear them, then produce them from memory.
 */
export function vocabDrills(
  batch: Vocab[],
  pool: Vocab[],
  prefix: string,
  options?: { typeAnswers?: number },
): Exercise[] {
  const exercises: Exercise[] = [
    ...flashcards(batch, prefix),
    ...batch.map((item, index) => kaToEn(item, pool, `${prefix}-ka-${index}`)),
    ...batch.map((item, index) => enToKa(item, pool, `${prefix}-en-${index}`)),
    ...batch.map((item, index) => listen(item, pool, `${prefix}-listen-${index}`)),
  ];

  const typeCount = options?.typeAnswers ?? Math.min(3, batch.length);
  exercises.push(
    ...batch
      .slice(0, typeCount)
      .map((item, index) => typeKa(item, `${prefix}-type-${index}`)),
  );

  if (batch.length >= 3) {
    exercises.push(matchPairs(batch.slice(0, 5), `${prefix}-match`));
  }

  return exercises;
}
