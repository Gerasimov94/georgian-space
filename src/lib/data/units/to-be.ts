import { matchPairs, vocabDrills } from "@/lib/course/generate";
import type { Exercise, Unit, Vocab } from "@/lib/course/types";

/** Unit 4, following Lesson 04 of the syllabus: pronouns and the verb "to be". */

const PRONOUNS: Vocab[] = [
  { ka: "მე", latin: "me", en: "I" },
  { ka: "შენ", latin: "shen", en: "you" },
  { ka: "ის", latin: "is", en: "he / she / it" },
  { ka: "ჩვენ", latin: "chven", en: "we" },
  { ka: "თქვენ", latin: "tkven", en: "you (plural / polite)" },
  { ka: "ისინი", latin: "isini", en: "they" },
];

const FORMS: Vocab[] = [
  { ka: "ვარ", latin: "var", en: "I am" },
  { ka: "ხარ", latin: "khar", en: "you are" },
  { ka: "არის", latin: "aris", en: "he / she / it is" },
  { ka: "ვართ", latin: "vart", en: "we are" },
  { ka: "ხართ", latin: "khart", en: "you are (plural)" },
  { ka: "არიან", latin: "arian", en: "they are" },
];

const WORDS: Vocab[] = [
  { ka: "სტუდენტი", latin: "studenti", en: "student" },
  { ka: "მასწავლებელი", latin: "mastsavlebeli", en: "teacher" },
  { ka: "ექიმი", latin: "ekimi", en: "doctor" },
  { ka: "ქართველი", latin: "kartveli", en: "Georgian (person)" },
  { ka: "აქ", latin: "ak", en: "here" },
  { ka: "სახლში", latin: "sakhlshi", en: "at home" },
];

const VOCAB = [...PRONOUNS, ...FORMS, ...WORDS];

const SENTENCES: Exercise[] = [
  {
    kind: "unscramble",
    id: "tobe-scramble-1",
    words: ["მე", "ვარ", "სტუდენტი"],
    en: "I am a student.",
  },
  {
    kind: "unscramble",
    id: "tobe-scramble-2",
    words: ["ის", "არის", "ექიმი"],
    en: "He is a doctor.",
  },
  {
    kind: "unscramble",
    id: "tobe-scramble-3",
    words: ["ჩვენ", "ვართ", "სახლში"],
    en: "We are at home.",
  },
  {
    kind: "unscramble",
    id: "tobe-scramble-4",
    words: ["თქვენ", "ხართ", "აქ"],
    en: "You are here.",
  },
];

export const toBeUnit: Unit = {
  id: "to-be",
  title: "To be",
  ka: "ყოფნა",
  description:
    "Pronouns and the present tense of “to be”, enough to say who and where you are.",
  vocab: VOCAB,
  lessons: [
    {
      id: "pronouns",
      title: "Pronouns",
      subtitle: "6 words",
      exercises: [
        {
          kind: "note",
          id: "pronouns-note",
          title: "Georgian pronouns",
          body: "Georgian has no grammatical gender, so ის covers he, she and it — context tells you which.\n\nთქვენ is both the plural “you” and the polite singular, exactly like French vous.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: PRONOUNS.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(PRONOUNS, VOCAB, "pronouns"),
      ],
    },
    {
      id: "forms",
      title: "I am, you are",
      subtitle: "the verb to be",
      exercises: [
        {
          kind: "note",
          id: "forms-note",
          title: "The present tense of “to be”",
          body: "The verb endings already tell you who the subject is, so the pronoun is optional: ვარ სტუდენტი is as correct as მე ვარ სტუდენტი.\n\nTo make it negative, put არ in front of the verb: მე არ ვარ ექიმი — I am not a doctor.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: [
              ["მე ვარ", "me var", "I am"],
              ["შენ ხარ", "shen khar", "you are"],
              ["ის არის", "is aris", "he / she / it is"],
              ["ჩვენ ვართ", "chven vart", "we are"],
              ["თქვენ ხართ", "tkven khart", "you are (plural)"],
              ["ისინი არიან", "isini arian", "they are"],
            ],
          },
        },
        ...vocabDrills(FORMS, VOCAB, "forms"),
        matchPairs(FORMS.slice(0, 5), "forms-match", "Match the verb forms"),
      ],
    },
    {
      id: "sentences",
      title: "Saying who you are",
      subtitle: "first sentences",
      exercises: [
        {
          kind: "note",
          id: "sentences-note",
          title: "Word order and “at home”",
          body: "The neutral order is subject – verb – complement, but Georgian is flexible and the verb often comes last in speech.\n\nსახლი means house; adding -ში gives the location: სახლში, “at home”. The same ending works for cities: თბილისში, “in Tbilisi”.",
        },
        ...vocabDrills(WORDS, VOCAB, "words"),
        ...SENTENCES,
      ],
    },
  ],
};
