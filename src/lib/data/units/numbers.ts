import { matchPairs, vocabDrills } from "@/lib/course/generate";
import type { Unit, Vocab } from "@/lib/course/types";

/** Unit 7: numbers 1 to 100, including the base-20 counting system. */

const ONE_TO_TEN: Vocab[] = [
  { ka: "ერთი", latin: "erti", en: "one" },
  { ka: "ორი", latin: "ori", en: "two" },
  { ka: "სამი", latin: "sami", en: "three" },
  { ka: "ოთხი", latin: "otkhi", en: "four" },
  { ka: "ხუთი", latin: "khuti", en: "five" },
  { ka: "ექვსი", latin: "ekvsi", en: "six" },
  { ka: "შვიდი", latin: "shvidi", en: "seven" },
  { ka: "რვა", latin: "rva", en: "eight" },
  { ka: "ცხრა", latin: "tskhra", en: "nine" },
  { ka: "ათი", latin: "ati", en: "ten" },
];

const TEENS: Vocab[] = [
  { ka: "თერთმეტი", latin: "tertmeti", en: "eleven" },
  { ka: "თორმეტი", latin: "tormeti", en: "twelve" },
  { ka: "ცამეტი", latin: "tsameti", en: "thirteen" },
  { ka: "თოთხმეტი", latin: "totkhmeti", en: "fourteen" },
  { ka: "თხუთმეტი", latin: "tkhutmeti", en: "fifteen" },
  { ka: "თექვსმეტი", latin: "tekvsmeti", en: "sixteen" },
  { ka: "ჩვიდმეტი", latin: "chvidmeti", en: "seventeen" },
  { ka: "თვრამეტი", latin: "tvrameti", en: "eighteen" },
  { ka: "ცხრამეტი", latin: "tskhrameti", en: "nineteen" },
  { ka: "ოცი", latin: "otsi", en: "twenty" },
];

const TENS: Vocab[] = [
  {
    ka: "ოცდაერთი",
    latin: "otsdaerti",
    en: "twenty-one",
    note: "ოცი (20) + და (and) + ერთი (1).",
  },
  { ka: "ოცდაათი", latin: "otsdaati", en: "thirty", note: "Twenty and ten." },
  { ka: "ორმოცი", latin: "ormotsi", en: "forty", note: "Two twenties." },
  {
    ka: "ორმოცდაათი",
    latin: "ormotsdaati",
    en: "fifty",
    note: "Two twenties and ten.",
  },
  { ka: "სამოცი", latin: "samotsi", en: "sixty", note: "Three twenties." },
  {
    ka: "სამოცდაათი",
    latin: "samotsdaati",
    en: "seventy",
    note: "Three twenties and ten.",
  },
  { ka: "ოთხმოცი", latin: "otkhmotsi", en: "eighty", note: "Four twenties." },
  {
    ka: "ოთხმოცდაათი",
    latin: "otkhmotsdaati",
    en: "ninety",
    note: "Four twenties and ten.",
  },
  { ka: "ასი", latin: "asi", en: "one hundred" },
];

const VOCAB = [...ONE_TO_TEN, ...TEENS, ...TENS];

export const numbersUnit: Unit = {
  id: "numbers",
  title: "Numbers",
  ka: "რიცხვები",
  description:
    "One to a hundred. Above twenty, Georgian counts in twenties — once you see the pattern the rest is arithmetic.",
  vocab: VOCAB,
  lessons: [
    {
      id: "one-to-ten",
      title: "One to ten",
      subtitle: "10 numbers",
      exercises: [
        {
          kind: "note",
          id: "one-note",
          title: "The first ten",
          body: "Only two of these are irregular in shape: რვა (8) and ცხრა (9) do not end in -ი like the rest.",
          table: {
            head: ["Georgian", "Pronunciation", "Number"],
            rows: ONE_TO_TEN.map((item, index) => [
              item.ka,
              item.latin,
              String(index + 1),
            ]),
          },
        },
        ...vocabDrills(ONE_TO_TEN, VOCAB, "one-to-ten"),
        matchPairs(ONE_TO_TEN.slice(0, 5), "one-match"),
      ],
    },
    {
      id: "eleven-to-twenty",
      title: "Eleven to twenty",
      subtitle: "10 numbers",
      exercises: [
        {
          kind: "note",
          id: "teens-note",
          title: "The -მეტი pattern",
          body: "Eleven to nineteen are built from the unit plus -მეტი, which means “more”: ერთ-მეტი is “one more (than ten)”, ორ-მეტი becomes თორმეტი, and so on. The stems shorten a little, so learn them as whole words but hear the pattern.",
          table: {
            head: ["Georgian", "Pronunciation", "Number"],
            rows: TEENS.map((item, index) => [
              item.ka,
              item.latin,
              String(index + 11),
            ]),
          },
        },
        ...vocabDrills(TEENS, VOCAB, "teens"),
      ],
    },
    {
      id: "twenties",
      title: "Counting in twenties",
      subtitle: "up to 100",
      exercises: [
        {
          kind: "note",
          id: "tens-note",
          title: "Georgian counts in twenties",
          body: "Above twenty the system is vigesimal: you say how many twenties, then add the rest. ორმოცი is “two twenties” (40) and ორმოცდაათი is “two twenties and ten” (50).\n\nSo 47 is ორმოცდაშვიდი — two twenties and seven. Long, but completely regular.",
          table: {
            head: ["Georgian", "Pronunciation", "Number"],
            rows: [
              ["ოცი", "otsi", "20"],
              ["ოცდაათი", "otsdaati", "30"],
              ["ორმოცი", "ormotsi", "40"],
              ["ორმოცდაათი", "ormotsdaati", "50"],
              ["სამოცი", "samotsi", "60"],
              ["სამოცდაათი", "samotsdaati", "70"],
              ["ოთხმოცი", "otkhmotsi", "80"],
              ["ოთხმოცდაათი", "otkhmotsdaati", "90"],
              ["ასი", "asi", "100"],
            ],
          },
        },
        ...vocabDrills(TENS, VOCAB, "tens"),
        matchPairs(TENS.slice(1, 6), "tens-match", "Match the numbers"),
      ],
    },
  ],
};
