import { LETTERS, type Letter } from "@/lib/data/letters";
import { seededShuffle } from "@/lib/course/generate";
import type { Exercise, Lesson, Unit } from "@/lib/course/types";

/**
 * Unit 1 follows Lesson 01 of the introductory PDF: all 33 letters, in three
 * batches, each letter recognised by sound and then written by hand.
 */

function recognition(letter: Letter, pool: Letter[], id: string): Exercise {
  const options = seededShuffle(
    [
      letter.char,
      ...seededShuffle(
        pool.filter((entry) => entry.char !== letter.char),
        id,
      )
        .slice(0, 3)
        .map((entry) => entry.char),
    ],
    `${id}-opts`,
  );

  return {
    kind: "multipleChoice",
    id,
    direction: "sound",
    prompt: letter.soundsLike,
    answer: letter.char,
    options,
    helper: `${letter.name} · ${letter.ipa}`,
  };
}

function batchLesson(
  id: string,
  title: string,
  letters: Letter[],
  intro: string,
): Lesson {
  const exercises: Exercise[] = [
    {
      kind: "note",
      id: `${id}-note`,
      title,
      body: intro,
      table: {
        head: ["Letter", "Name", "Latin", "Sounds like"],
        rows: letters.map((letter) => [
          letter.char,
          letter.name,
          letter.latin,
          letter.soundsLike,
        ]),
      },
    },
  ];

  for (const [index, letter] of letters.entries()) {
    exercises.push(recognition(letter, LETTERS, `${id}-mc-${index}`));
    exercises.push({
      kind: "writeLetter",
      id: `${id}-write-${index}`,
      char: letter.char,
      helper: letter.tip ?? `${letter.name} — ${letter.soundsLike}.`,
    });
  }

  exercises.push({
    kind: "matchPairs",
    id: `${id}-match`,
    prompt: "Match each letter with its sound",
    pairs: letters
      .slice(0, 5)
      .map((letter) => ({ left: letter.char, right: letter.soundsLike })),
  });

  return { id, title, subtitle: `${letters.length} letters`, exercises };
}

const FIRST = LETTERS.slice(0, 11);
const SECOND = LETTERS.slice(11, 22);
const THIRD = LETTERS.slice(22);

export const alphabetUnit: Unit = {
  id: "alphabet",
  title: "The alphabet",
  ka: "ანბანი",
  description:
    "All 33 Mkhedruli letters. Georgian is fully phonetic and unicase: one letter, one sound, no capitals.",
  vocab: LETTERS.map((letter) => ({
    ka: letter.char,
    latin: letter.latin,
    en: letter.soundsLike,
  })),
  lessons: [
    batchLesson(
      "letters-1",
      "Letters ა to ლ",
      FIRST,
      "Georgian has 33 letters and each one maps to exactly one sound, so once you know the letters you can pronounce any word you can read. There are no capitals and no silent letters.\n\nWrite each letter between the guide lines. The middle two lines are the x-height band; some letters rise above it and some drop below it, and the score checks that too.",
    ),
    batchLesson(
      "letters-2",
      "Letters მ to ფ",
      SECOND,
      "This batch contains the first ejectives. კ, პ and ტ are pronounced with a closed throat and no puff of air — hold your palm in front of your mouth and you should feel nothing.",
    ),
    batchLesson(
      "letters-3",
      "Letters ქ to ჰ",
      THIRD,
      "The last batch has the sounds English does not have: the uvulars ღ, ყ and ხ, made at the very back of the throat, and the ejective affricates წ and ჭ.",
    ),
  ],
};
