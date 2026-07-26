import { matchPairs, vocabDrills } from "@/lib/course/generate";
import type { Exercise, Unit, Vocab } from "@/lib/course/types";

/** Unit 3: the 11 phrases from Lesson 03 of the PDF, plus its dialogue. */

const GREETINGS: Vocab[] = [
  { ka: "გამარჯობა", latin: "gamarjoba", en: "hello (formal)" },
  { ka: "სალამი", latin: "salami", en: "hi" },
  { ka: "როგორ ხარ?", latin: "rogor khar?", en: "how are you?" },
  { ka: "კარგად", latin: "kargad", en: "goodbye / well" },
  { ka: "ნახვამდის", latin: "nakhvamdis", en: "see you" },
];

const COURTESY: Vocab[] = [
  { ka: "მადლობა", latin: "madloba", en: "thank you" },
  {
    ka: "გაიხარე",
    latin: "gaikhare",
    en: "you are welcome",
    note: "Literally “be happy”.",
  },
  { ka: "ბოდიში", latin: "bodishi", en: "sorry" },
  { ka: "უკაცრავად", latin: "ukatsravad", en: "excuse me" },
];

const INTRODUCTIONS: Vocab[] = [
  { ka: "მე მქვია", latin: "me mqvia", en: "my name is" },
  { ka: "რა გქვია?", latin: "ra gqvia?", en: "what is your name?" },
  { ka: "სასიამოვნოა", latin: "sasiamovnoa", en: "nice to meet you" },
];

const VOCAB = [...GREETINGS, ...COURTESY, ...INTRODUCTIONS];

/** Exercise 6 of the PDF: unscramble the sentences. */
const SENTENCES: Exercise[] = [
  {
    kind: "unscramble",
    id: "survival-scramble-1",
    words: ["გამარჯობა", "როგორ", "ხარ"],
    en: "Hello, how are you?",
  },
  {
    kind: "unscramble",
    id: "survival-scramble-2",
    words: ["მე", "მქვია", "ანა"],
    en: "My name is Ana.",
  },
  {
    kind: "unscramble",
    id: "survival-scramble-3",
    words: ["სასიამოვნოა", "რა", "გქვია"],
    en: "Nice to meet you. What is your name?",
  },
  {
    kind: "unscramble",
    id: "survival-scramble-4",
    words: ["სალამი", "ბოდიში", "რა", "გქვია"],
    en: "Hi. Sorry, what is your name?",
  },
];

export const survivalUnit: Unit = {
  id: "survival",
  title: "Survival kit",
  ka: "პირველი ფრაზები",
  description:
    "Greet someone, thank them, apologise and introduce yourself — the eleven phrases that get you through your first day.",
  vocab: VOCAB,
  lessons: [
    {
      id: "hello",
      title: "Hello and goodbye",
      subtitle: "5 phrases",
      exercises: [
        {
          kind: "note",
          id: "hello-note",
          title: "Greetings",
          body: "გამარჯობა is the everyday greeting and is safe with anyone; სალამი is casual, between friends. კარგად literally means “well” and is used as “bye”, while ნახვამდის is closer to “see you”.\n\nThere is no separate “good morning” or “good evening” you need on day one — გამარჯობა covers the whole day.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: GREETINGS.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(GREETINGS, VOCAB, "hello"),
      ],
    },
    {
      id: "courtesy",
      title: "Please and sorry",
      subtitle: "4 phrases",
      exercises: [
        {
          kind: "note",
          id: "courtesy-note",
          title: "Being polite",
          body: "მადლობა is thank you; the warm reply გაიხარე literally means “be happy”. ბოდიში is an apology, while უკაცრავად is the “excuse me” you use to get someone's attention or to interrupt.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: COURTESY.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(COURTESY, VOCAB, "courtesy"),
      ],
    },
    {
      id: "introductions",
      title: "Introducing yourself",
      subtitle: "3 phrases and a dialogue",
      exercises: [
        {
          kind: "note",
          id: "introductions-note",
          title: "Names",
          body: "მე მქვია ნინი means “my name is Nini”. The verb მქვია already carries “to me”, so the pronoun მე is optional: მქვია ნინი is perfectly natural.\n\nრა გქვია? is “what are you called?” — the same verb with the “to you” marker გ-.",
          table: {
            head: ["Georgian", "Pronunciation", "English"],
            rows: INTRODUCTIONS.map((item) => [item.ka, item.latin, item.en]),
          },
        },
        ...vocabDrills(INTRODUCTIONS, VOCAB, "introductions"),
        {
          kind: "note",
          id: "introductions-dialogue",
          title: "The dialogue from Lesson 03",
          body: "— გამარჯობა\n— სალამი\n— ბოდიში, რა გქვია?\n— იპოლიტე\n— მე მქვია ნინი\n— სასიამოვნოა. კარგად, ნინი\n— ნახვამდის",
        },
        ...SENTENCES,
        matchPairs(
          [GREETINGS[0], GREETINGS[2], INTRODUCTIONS[0], COURTESY[2]],
          "survival-match",
          "Match the phrases",
        ),
      ],
    },
  ],
};
