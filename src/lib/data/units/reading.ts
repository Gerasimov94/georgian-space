import { matchPairs, vocabDrills } from "@/lib/course/generate";
import type { Exercise, Unit, Vocab } from "@/lib/course/types";

/**
 * Unit 2 mirrors Lesson 02 of the PDF: the first words you can read are place
 * names and loanwords, because you already know what they mean.
 */

const PLACES: Vocab[] = [
  { ka: "თბილისი", latin: "tbilisi", en: "Tbilisi" },
  { ka: "ლონდონი", latin: "londoni", en: "London" },
  { ka: "პარიზი", latin: "parizi", en: "Paris" },
  { ka: "ნიუ-იორკი", latin: "niu-iorki", en: "New York" },
  { ka: "დუბაი", latin: "dubai", en: "Dubai" },
  { ka: "იტალია", latin: "italia", en: "Italy" },
];

const THINGS: Vocab[] = [
  { ka: "ტელეფონი", latin: "telefoni", en: "telephone" },
  { ka: "კამერა", latin: "kamera", en: "camera" },
  { ka: "ლეპტოპი", latin: "leptopi", en: "laptop" },
  { ka: "პრინტერი", latin: "printeri", en: "printer" },
  { ka: "აიფონი", latin: "aiponi", en: "iPhone" },
  { ka: "ოფისი", latin: "opisi", en: "office" },
  { ka: "ტექსტი", latin: "teksti", en: "text" },
];

const VOCAB = [...PLACES, ...THINGS];

/** The missing-letter drill from Exercise 3 of the PDF. */
const GAPS: { word: string; index: number; options: string[]; en: string }[] = [
  { word: "დუბაი", index: 3, options: ["ა", "ო", "უ", "ე"], en: "Dubai" },
  {
    word: "პრინტერი",
    index: 4,
    options: ["ტ", "თ", "დ", "ფ"],
    en: "printer",
  },
  { word: "კამერა", index: 2, options: ["მ", "ნ", "ბ", "პ"], en: "camera" },
  { word: "ლეპტოპი", index: 5, options: ["პ", "ფ", "ბ", "ქ"], en: "laptop" },
  { word: "აიფონი", index: 2, options: ["ფ", "პ", "ვ", "ხ"], en: "iPhone" },
  { word: "ოფისი", index: 3, options: ["ს", "შ", "ზ", "ც"], en: "office" },
  { word: "იტალია", index: 3, options: ["ლ", "რ", "ნ", "მ"], en: "Italy" },
  { word: "ტექსტი", index: 2, options: ["ქ", "კ", "ხ", "ღ"], en: "text" },
];

const gapExercises: Exercise[] = GAPS.map((gap, index) => ({
  kind: "fillGap",
  id: `reading-gap-${index}`,
  ...gap,
}));

export const readingUnit: Unit = {
  id: "reading",
  title: "Your first words",
  ka: "პირველი სიტყვები",
  description:
    "Place names and loanwords: real Georgian text you can decode with nothing but the alphabet.",
  vocab: VOCAB,
  lessons: [
    {
      id: "places",
      title: "Cities and countries",
      subtitle: "6 words",
      exercises: [
        {
          kind: "note",
          id: "places-note",
          title: "Read, do not translate",
          body: "Georgian spelling is exactly what you hear, so borrowed names are transparent once you sound them out letter by letter. Notice that almost every noun ends in -ი: that is the nominative case ending, not part of the name.\n\nTry reading each word aloud before you look at the meaning.",
          table: {
            head: ["Georgian", "Sounds like", "Meaning"],
            rows: PLACES.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(PLACES, VOCAB, "places"),
      ],
    },
    {
      id: "things",
      title: "Everyday objects",
      subtitle: "7 words",
      exercises: [
        {
          kind: "note",
          id: "things-note",
          title: "Loanwords for everyday things",
          body: "Technology vocabulary is borrowed, so these words cost you nothing to learn — they are pure reading practice. Watch the pairs ტ/თ and პ/ფ: the first of each pair is the airless ejective, and swapping them changes the word.",
        },
        ...vocabDrills(THINGS, VOCAB, "things"),
      ],
    },
    {
      id: "spelling",
      title: "Spelling drill",
      subtitle: "fill in the missing letters",
      exercises: [
        {
          kind: "note",
          id: "spelling-note",
          title: "Fill in the missing letter",
          body: "Exercise 3 from the PDF. Each word is missing one letter — pick the one that makes the word sound right.",
        },
        ...gapExercises,
        matchPairs(
          [...PLACES.slice(0, 3), ...THINGS.slice(0, 2)],
          "spelling-match",
        ),
      ],
    },
  ],
};
