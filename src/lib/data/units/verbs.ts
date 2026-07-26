import { matchPairs, vocabDrills } from "@/lib/course/generate";
import type { Exercise, Unit, Vocab } from "@/lib/course/types";

/** Unit 8: present-tense verbs in the first person, plus the ვ- subject marker. */

const ACTIONS: Vocab[] = [
  { ka: "ვმუშაობ", latin: "vmushaob", en: "I work" },
  { ka: "ვსწავლობ", latin: "vstsavlob", en: "I study" },
  { ka: "ვჭამ", latin: "vch'am", en: "I eat" },
  { ka: "ვსვამ", latin: "vsvam", en: "I drink" },
  { ka: "ვცხოვრობ", latin: "vtskhovrob", en: "I live" },
  { ka: "ვლაპარაკობ", latin: "vlaparakob", en: "I speak" },
];

const MORE: Vocab[] = [
  { ka: "ვკითხულობ", latin: "vkitkhulob", en: "I read" },
  { ka: "ვწერ", latin: "vtser", en: "I write" },
  { ka: "მივდივარ", latin: "mivdivar", en: "I go" },
  { ka: "ვიცი", latin: "vitsi", en: "I know" },
  {
    ka: "მინდა",
    latin: "minda",
    en: "I want",
    note: "An indirect verb: the “I” is marked by მ- at the front, not by ვ-.",
  },
  {
    ka: "მიყვარს",
    latin: "miqvars",
    en: "I love",
    note: "Literally “it is loved by me” — also marked with მ-.",
  },
];

const USEFUL: Vocab[] = [
  { ka: "ქართულად", latin: "kartulad", en: "in Georgian" },
  { ka: "ინგლისურად", latin: "inglisurad", en: "in English" },
  { ka: "ცოტა", latin: "tsota", en: "a little" },
  { ka: "ყავა", latin: "qava", en: "coffee" },
  { ka: "წყალი", latin: "tsqali", en: "water" },
];

const VOCAB = [...ACTIONS, ...MORE, ...USEFUL];

const SENTENCES: Exercise[] = [
  {
    kind: "unscramble",
    id: "verbs-scramble-1",
    words: ["მე", "ვმუშაობ", "ოფისში"],
    en: "I work in the office.",
  },
  {
    kind: "unscramble",
    id: "verbs-scramble-2",
    words: ["ცოტა", "ვლაპარაკობ", "ქართულად"],
    en: "I speak a little Georgian.",
  },
  {
    kind: "unscramble",
    id: "verbs-scramble-3",
    words: ["მე", "ვცხოვრობ", "თბილისში"],
    en: "I live in Tbilisi.",
  },
  {
    kind: "unscramble",
    id: "verbs-scramble-4",
    words: ["ყავა", "მინდა"],
    en: "I want coffee.",
  },
];

export const verbsUnit: Unit = {
  id: "verbs",
  title: "Verbs",
  ka: "ზმნები",
  description:
    "Twelve verbs you use every day, and the prefix that turns any of them into “I …”.",
  vocab: VOCAB,
  lessons: [
    {
      id: "actions",
      title: "Everyday actions",
      subtitle: "6 verbs",
      exercises: [
        {
          kind: "note",
          id: "actions-note",
          title: "ვ- means “I”",
          body: "Georgian verbs carry the subject inside them. The prefix ვ- marks a first-person subject, the bare stem is “you”, and -ს on the end is “he/she/it”.\n\nSo from მუშაობ (work): ვმუშაობ I work, მუშაობ you work, მუშაობს he works, ვმუშაობთ we work, მუშაობთ you work (plural), მუშაობენ they work.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: [
              ["ვმუშაობ", "vmushaob", "I work"],
              ["მუშაობ", "mushaob", "you work"],
              ["მუშაობს", "mushaobs", "he / she works"],
              ["ვმუშაობთ", "vmushaobt", "we work"],
              ["მუშაობთ", "mushaobt", "you work (plural)"],
              ["მუშაობენ", "mushaoben", "they work"],
            ],
          },
        },
        ...vocabDrills(ACTIONS, VOCAB, "actions"),
        matchPairs(ACTIONS.slice(0, 5), "actions-match", "Match the verbs"),
      ],
    },
    {
      id: "more-verbs",
      title: "Want, know, love",
      subtitle: "6 more verbs",
      exercises: [
        {
          kind: "note",
          id: "more-note",
          title: "Verbs that put you in the dative",
          body: "მინდა (I want) and მიყვარს (I love) do not take ვ-. They belong to a group where the person is marked at the front with მ- for “me”, გ- for “you”: მინდა / გინდა, მიყვარს / გიყვარს.\n\nThis pattern also gave you მქვია (my name is) in the survival kit — literally “I am called”.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: [
              ["მინდა", "minda", "I want"],
              ["გინდა", "ginda", "you want"],
              ["მიყვარს", "miqvars", "I love"],
              ["გიყვარს", "giqvars", "you love"],
            ],
          },
        },
        ...vocabDrills(MORE, VOCAB, "more-verbs"),
        ...vocabDrills(USEFUL, VOCAB, "useful", { typeAnswers: 2 }),
        ...SENTENCES,
      ],
    },
  ],
};
