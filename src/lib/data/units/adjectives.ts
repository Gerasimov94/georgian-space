import { matchPairs, vocabDrills } from "@/lib/course/generate";
import type { Exercise, Unit, Vocab } from "@/lib/course/types";

/** Unit 6: adjectives, and how they attach to nouns. */

const PAIRS: Vocab[] = [
  { ka: "დიდი", latin: "didi", en: "big" },
  { ka: "პატარა", latin: "patara", en: "small" },
  { ka: "კარგი", latin: "kargi", en: "good" },
  { ka: "ცუდი", latin: "tsudi", en: "bad" },
  { ka: "ახალი", latin: "akhali", en: "new" },
  { ka: "ძველი", latin: "dzveli", en: "old" },
  { ka: "ცხელი", latin: "tskheli", en: "hot" },
  { ka: "ცივი", latin: "tsivi", en: "cold" },
];

const MORE: Vocab[] = [
  { ka: "ლამაზი", latin: "lamazi", en: "beautiful" },
  { ka: "გრძელი", latin: "grdzeli", en: "long" },
  { ka: "მოკლე", latin: "mokle", en: "short" },
  { ka: "ძვირი", latin: "dzviri", en: "expensive" },
  { ka: "იაფი", latin: "iapi", en: "cheap" },
  { ka: "ბედნიერი", latin: "bednieri", en: "happy" },
  { ka: "სწრაფი", latin: "stsrapi", en: "fast" },
  { ka: "ნელი", latin: "neli", en: "slow" },
];

const PHRASES: Vocab[] = [
  { ka: "დიდი სახლი", latin: "didi sakhli", en: "a big house" },
  { ka: "პატარა კატა", latin: "patara kata", en: "a small cat" },
  { ka: "ცივი წყალი", latin: "tsivi tsqali", en: "cold water" },
  { ka: "ძალიან კარგი", latin: "dzalian kargi", en: "very good" },
  { ka: "ახალი ტელეფონი", latin: "akhali telefoni", en: "a new phone" },
];

const VOCAB = [...PAIRS, ...MORE, ...PHRASES];

const SENTENCES: Exercise[] = [
  {
    kind: "unscramble",
    id: "adj-scramble-1",
    words: ["ეს", "სახლი", "დიდია"],
    en: "This house is big.",
  },
  {
    kind: "unscramble",
    id: "adj-scramble-2",
    words: ["ჩემი", "ტელეფონი", "ახალია"],
    en: "My phone is new.",
  },
  {
    kind: "unscramble",
    id: "adj-scramble-3",
    words: ["ყავა", "ძალიან", "ცხელია"],
    en: "The coffee is very hot.",
  },
];

export const adjectivesUnit: Unit = {
  id: "adjectives",
  title: "Adjectives",
  ka: "ზედსართავები",
  description:
    "Sixteen everyday adjectives, mostly in opposite pairs, and how to attach them to nouns.",
  vocab: VOCAB,
  lessons: [
    {
      id: "opposites",
      title: "Opposites",
      subtitle: "8 words",
      exercises: [
        {
          kind: "note",
          id: "opposites-note",
          title: "Adjectives go before the noun",
          body: "The adjective comes first and does not change for the noun: დიდი სახლი (a big house), დიდი ქალაქი (a big city), დიდი ოჯახი (a big family).\n\nLearning them in opposite pairs doubles your vocabulary for the same effort.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: PAIRS.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(PAIRS, VOCAB, "opposites"),
        matchPairs(PAIRS.slice(0, 5), "opposites-match"),
      ],
    },
    {
      id: "descriptions",
      title: "Describing things",
      subtitle: "8 more words",
      exercises: [
        {
          kind: "note",
          id: "descriptions-note",
          title: "Very, and “is” as an ending",
          body: "ძალიან means very and goes before the adjective: ძალიან ლამაზი, very beautiful.\n\nWhen the adjective is the whole statement, the “is” is glued to it: სახლი დიდია — the house is big. Compare სახლი დიდია with დიდი სახლი, which is just the phrase “a big house”.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: MORE.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(MORE, VOCAB, "descriptions"),
        ...vocabDrills(PHRASES, VOCAB, "adj-phrases", { typeAnswers: 2 }),
        ...SENTENCES,
      ],
    },
  ],
};
