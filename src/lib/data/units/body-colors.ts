import { matchPairs, vocabDrills } from "@/lib/course/generate";
import type { Exercise, Unit, Vocab } from "@/lib/course/types";

/** Unit 9: body parts and colours, following Lesson 09 of the syllabus. */

const BODY: Vocab[] = [
  { ka: "თავი", latin: "tavi", en: "head" },
  { ka: "თმა", latin: "tma", en: "hair" },
  { ka: "თვალი", latin: "tvali", en: "eye" },
  { ka: "ცხვირი", latin: "tskhviri", en: "nose" },
  { ka: "პირი", latin: "piri", en: "mouth" },
  { ka: "ყური", latin: "quri", en: "ear" },
  { ka: "კბილი", latin: "kbili", en: "tooth" },
  { ka: "ხელი", latin: "kheli", en: "hand / arm" },
  { ka: "ფეხი", latin: "pekhi", en: "foot / leg" },
  { ka: "გული", latin: "guli", en: "heart" },
];

const COLORS: Vocab[] = [
  { ka: "წითელი", latin: "tsiteli", en: "red" },
  { ka: "ლურჯი", latin: "lurji", en: "blue" },
  { ka: "ცისფერი", latin: "tsisperi", en: "light blue", note: "Sky-coloured: ცა means sky." },
  { ka: "მწვანე", latin: "mtsvane", en: "green" },
  { ka: "ყვითელი", latin: "qviteli", en: "yellow" },
  { ka: "შავი", latin: "shavi", en: "black" },
  { ka: "თეთრი", latin: "tetri", en: "white" },
  { ka: "ნარინჯისფერი", latin: "narinjisperi", en: "orange" },
  {
    ka: "ვარდისფერი",
    latin: "vardisperi",
    en: "pink",
    note: "Rose-coloured: ვარდი means rose.",
  },
  {
    ka: "ყავისფერი",
    latin: "qavisperi",
    en: "brown",
    note: "Coffee-coloured: ყავა means coffee.",
  },
  { ka: "ნაცრისფერი", latin: "natsrisperi", en: "grey", note: "Ash-coloured." },
];

const VOCAB = [...BODY, ...COLORS];

const SENTENCES: Exercise[] = [
  {
    kind: "unscramble",
    id: "body-scramble-1",
    words: ["ჩემი", "თვალები", "ლურჯია"],
    en: "My eyes are blue.",
  },
  {
    kind: "unscramble",
    id: "body-scramble-2",
    words: ["მას", "შავი", "თმა", "აქვს"],
    en: "She has black hair.",
  },
  {
    kind: "unscramble",
    id: "body-scramble-3",
    words: ["ეს", "ვაშლი", "წითელია"],
    en: "This apple is red.",
  },
];

export const bodyColorsUnit: Unit = {
  id: "body-colors",
  title: "Body and colours",
  ka: "სხეული და ფერები",
  description:
    "Ten body parts, eleven colours, and the -ფერი ending that builds a colour out of any object.",
  vocab: VOCAB,
  lessons: [
    {
      id: "body",
      title: "Body parts",
      subtitle: "10 words",
      exercises: [
        {
          kind: "note",
          id: "body-note",
          title: "One word for arm and hand",
          body: "ხელი covers the whole arm including the hand, and ფეხი covers the leg and the foot — Georgian does not split them the way English does.\n\nPlurals add -ები: თვალი → თვალები (eyes), ხელი → ხელები (hands).",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: BODY.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(BODY, VOCAB, "body"),
        matchPairs(BODY.slice(0, 5), "body-match"),
      ],
    },
    {
      id: "colors",
      title: "Colours",
      subtitle: "11 words",
      exercises: [
        {
          kind: "note",
          id: "colors-note",
          title: "Colours made of things",
          body: "Many colours are literally “X-coloured”, built from a noun plus -ისფერი: ვარდი (rose) gives ვარდისფერი for pink, ყავა (coffee) gives ყავისფერი for brown, ცა (sky) gives ცისფერი for light blue.\n\nGeorgian keeps ლურჯი (deep blue) and ცისფერი (light blue) as separate colours, the way Russian does.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: COLORS.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(COLORS, VOCAB, "colors"),
        ...SENTENCES,
      ],
    },
  ],
};
