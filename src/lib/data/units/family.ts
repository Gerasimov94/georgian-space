import { matchPairs, vocabDrills } from "@/lib/course/generate";
import type { Exercise, Unit, Vocab } from "@/lib/course/types";

/** Unit 5: family members and the possessive pronouns that go with them. */

const CLOSE: Vocab[] = [
  { ka: "ოჯახი", latin: "ojakhi", en: "family" },
  {
    ka: "დედა",
    latin: "deda",
    en: "mother",
    note: "Careful: დედა is mother and მამა is father — the opposite of what a Russian or Italian ear expects.",
  },
  { ka: "მამა", latin: "mama", en: "father" },
  { ka: "ძმა", latin: "dzma", en: "brother" },
  { ka: "და", latin: "da", en: "sister" },
  { ka: "შვილი", latin: "shvili", en: "child" },
];

const EXTENDED: Vocab[] = [
  { ka: "ბებია", latin: "bebia", en: "grandmother" },
  { ka: "ბაბუა", latin: "babua", en: "grandfather" },
  { ka: "ვაჟიშვილი", latin: "vazhishvili", en: "son" },
  { ka: "ქალიშვილი", latin: "kalishvili", en: "daughter" },
  { ka: "ცოლი", latin: "tsoli", en: "wife" },
  { ka: "ქმარი", latin: "kmari", en: "husband" },
  { ka: "ბიძა", latin: "bidza", en: "uncle" },
  {
    ka: "დეიდა",
    latin: "deida",
    en: "aunt (mother's sister)",
    note: "Georgian distinguishes your mother's sister (დეიდა) from your father's sister (მამიდა).",
  },
  { ka: "მამიდა", latin: "mamida", en: "aunt (father's sister)" },
];

const POSSESSIVES: Vocab[] = [
  { ka: "ჩემი", latin: "chemi", en: "my" },
  { ka: "შენი", latin: "sheni", en: "your" },
  { ka: "მისი", latin: "misi", en: "his / her" },
  { ka: "ჩვენი", latin: "chveni", en: "our" },
  { ka: "თქვენი", latin: "tkveni", en: "your (plural)" },
  { ka: "მათი", latin: "mati", en: "their" },
];

const PHRASES: Vocab[] = [
  { ka: "ჩემი დედა", latin: "chemi deda", en: "my mother" },
  { ka: "შენი ძმა", latin: "sheni dzma", en: "your brother" },
  { ka: "მისი ოჯახი", latin: "misi ojakhi", en: "his family" },
  { ka: "ჩვენი სახლი", latin: "chveni sakhli", en: "our house" },
];

const VOCAB = [...CLOSE, ...EXTENDED, ...POSSESSIVES, ...PHRASES];

const SENTENCES: Exercise[] = [
  {
    kind: "unscramble",
    id: "family-scramble-1",
    words: ["ჩემი", "დედა", "ექიმია"],
    en: "My mother is a doctor.",
  },
  {
    kind: "unscramble",
    id: "family-scramble-2",
    words: ["ეს", "არის", "ჩემი", "ოჯახი"],
    en: "This is my family.",
  },
  {
    kind: "unscramble",
    id: "family-scramble-3",
    words: ["მისი", "ძმა", "სახლშია"],
    en: "His brother is at home.",
  },
];

export const familyUnit: Unit = {
  id: "family",
  title: "Family",
  ka: "ოჯახი",
  description:
    "Family members plus the possessive pronouns, and the short -ა ending that turns a noun into “is a …”.",
  vocab: VOCAB,
  lessons: [
    {
      id: "close-family",
      title: "Close family",
      subtitle: "6 words",
      exercises: [
        {
          kind: "note",
          id: "close-note",
          title: "The closest relatives",
          body: "Two traps in this list. First, დედა is mother and მამა is father. Second, და means sister, and it is also the word for “and” — you tell them apart by position: დედა და მამა is “mother and father”.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: CLOSE.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(CLOSE, VOCAB, "close"),
      ],
    },
    {
      id: "extended-family",
      title: "The whole family",
      subtitle: "9 words",
      exercises: [
        {
          kind: "note",
          id: "extended-note",
          title: "Sons, daughters and aunts",
          body: "შვილი is a child of any gender; add ვაჟი (boy) or ქალი (woman) to be specific: ვაჟიშვილი is a son, ქალიშვილი a daughter.\n\nAunts are split by side of the family: დეიდა on your mother's side, მამიდა on your father's.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: EXTENDED.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(EXTENDED, VOCAB, "extended"),
      ],
    },
    {
      id: "possessives",
      title: "My, your, our",
      subtitle: "possessive pronouns",
      exercises: [
        {
          kind: "note",
          id: "possessives-note",
          title: "Possessives come first",
          body: "The possessive goes straight before the noun and does not change: ჩემი დედა, ჩემი ძმა, ჩემი ოჯახი.\n\nIn speech, “is” is often glued onto the end of the word as -ა instead of using არის: ჩემი დედა ექიმია means “my mother is a doctor”, and სახლშია means “is at home”.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: POSSESSIVES.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(POSSESSIVES, VOCAB, "possessives"),
        ...vocabDrills(PHRASES, VOCAB, "phrases", { typeAnswers: 2 }),
        ...SENTENCES,
        matchPairs(POSSESSIVES.slice(0, 4), "possessives-match"),
      ],
    },
  ],
};
