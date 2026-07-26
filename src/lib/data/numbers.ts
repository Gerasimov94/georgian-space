/**
 * Georgian numerals 1–100.
 *
 * Above twenty Georgian counts in twenties (a vigesimal system): you name how
 * many twenties there are, join them with "და" (and) and finish with the
 * remainder, which is itself a plain 1–19 word. Every number in that range is
 * therefore derivable, so the words are composed here instead of being listed —
 * that also gives us the breakdown to show the learner.
 */

export type NumberPart = {
  ka: string;
  latin: string;
  /** What this piece contributes, in English. */
  en: string;
  /** Numeric contribution, or null for the joining "and". */
  value: number | null;
};

export type GeorgianNumber = {
  value: number;
  ka: string;
  latin: string;
  /** English name, e.g. "forty-seven". */
  en: string;
  parts: NumberPart[];
  /** Arithmetic behind the word, e.g. "2 × 20 + 7". */
  sum: string;
  /** One sentence explaining why the word looks the way it does. */
  why: string;
};

type Word = { ka: string; latin: string };

/** 1–19, learned as whole words. */
const UNITS: Record<number, Word> = {
  1: { ka: "ერთი", latin: "erti" },
  2: { ka: "ორი", latin: "ori" },
  3: { ka: "სამი", latin: "sami" },
  4: { ka: "ოთხი", latin: "otkhi" },
  5: { ka: "ხუთი", latin: "khuti" },
  6: { ka: "ექვსი", latin: "ekvsi" },
  7: { ka: "შვიდი", latin: "shvidi" },
  8: { ka: "რვა", latin: "rva" },
  9: { ka: "ცხრა", latin: "tskhra" },
  10: { ka: "ათი", latin: "ati" },
  11: { ka: "თერთმეტი", latin: "tertmeti" },
  12: { ka: "თორმეტი", latin: "tormeti" },
  13: { ka: "ცამეტი", latin: "tsameti" },
  14: { ka: "თოთხმეტი", latin: "totkhmeti" },
  15: { ka: "თხუთმეტი", latin: "tkhutmeti" },
  16: { ka: "თექვსმეტი", latin: "tekvsmeti" },
  17: { ka: "ჩვიდმეტი", latin: "chvidmeti" },
  18: { ka: "თვრამეტი", latin: "tvrameti" },
  19: { ka: "ცხრამეტი", latin: "tskhrameti" },
};

/** Stems for 1–4 twenties. Add -ი for the round number, -და before a remainder. */
const TWENTY_STEMS: Record<number, Word> = {
  1: { ka: "ოც", latin: "ots" },
  2: { ka: "ორმოც", latin: "ormots" },
  3: { ka: "სამოც", latin: "samots" },
  4: { ka: "ოთხმოც", latin: "otkhmots" },
};

const AND: Word = { ka: "და", latin: "da" };
const HUNDRED: Word = { ka: "ასი", latin: "asi" };

const ONES_EN = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const TENS_EN = [
  "",
  "ten",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

export function englishNumber(value: number): string {
  if (value === 100) return "one hundred";
  if (value < 20) return ONES_EN[value];
  const tens = Math.floor(value / 10);
  const ones = value % 10;
  return ones === 0 ? TENS_EN[tens] : `${TENS_EN[tens]}-${ONES_EN[ones]}`;
}

const TWENTIES_EN: Record<number, string> = {
  1: "twenty",
  2: "two twenties",
  3: "three twenties",
  4: "four twenties",
};

export const NUMBER_RANGE = { min: 1, max: 100 } as const;

/** Builds the Georgian word for `value` together with its breakdown. */
export function georgianNumber(value: number): GeorgianNumber {
  if (!Number.isInteger(value) || value < 1 || value > 100) {
    throw new RangeError(`Only whole numbers 1–100 are supported, got ${value}`);
  }

  const en = englishNumber(value);

  if (value === 100) {
    return {
      value,
      ka: HUNDRED.ka,
      latin: HUNDRED.latin,
      en,
      parts: [{ ...HUNDRED, en: "one hundred", value: 100 }],
      sum: "100",
      why: "A hundred has its own word, ასი, and the counting starts over from there.",
    };
  }

  if (value < 20) {
    const word = UNITS[value];
    return {
      value,
      ka: word.ka,
      latin: word.latin,
      en,
      parts: [{ ...word, en, value }],
      sum: String(value),
      why:
        value <= 10
          ? "One of the ten base words — everything else is built from these."
          : `A teen: the unit ${UNITS[value - 10].ka} plus -მეტი, “more (than ten)”. The stem shortens, so learn the whole word by ear.`,
    };
  }

  const twenties = Math.floor(value / 20);
  const rest = value % 20;
  const stem = TWENTY_STEMS[twenties];
  const twentiesEn = TWENTIES_EN[twenties];
  const twentiesValue = twenties * 20;

  if (rest === 0) {
    return {
      value,
      ka: `${stem.ka}ი`,
      latin: `${stem.latin}i`,
      en,
      parts: [
        {
          ka: `${stem.ka}ი`,
          latin: `${stem.latin}i`,
          en: twentiesEn,
          value: twentiesValue,
        },
      ],
      sum: twenties === 1 ? "20" : `${twenties} × 20`,
      why:
        twenties === 1
          ? "ოცი (20) is the base of the whole system: from here on you count in twenties."
          : `${twentiesEn}: ${twenties} × 20 = ${value}. The stem ${stem.ka}- is “${twentiesEn}”, and -ი closes the round number.`,
    };
  }

  const remainder = UNITS[rest];

  return {
    value,
    ka: `${stem.ka}${AND.ka}${remainder.ka}`,
    latin: `${stem.latin}${AND.latin}${remainder.latin}`,
    en,
    parts: [
      { ka: stem.ka, latin: stem.latin, en: twentiesEn, value: twentiesValue },
      { ...AND, en: "and", value: null },
      { ...remainder, en: englishNumber(rest), value: rest },
    ],
    sum: twenties === 1 ? `20 + ${rest}` : `${twenties} × 20 + ${rest}`,
    why: `${capitalize(twentiesEn)} and ${englishNumber(rest)}: ${
      twenties === 1 ? "20" : `${twenties} × 20`
    } + ${rest} = ${value}. The three pieces run together into one word.`,
  };
}

function capitalize(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

export function numberRange(from: number, to: number): GeorgianNumber[] {
  const out: GeorgianNumber[] = [];
  for (let value = from; value <= to; value += 1) out.push(georgianNumber(value));
  return out;
}

export function numbersOf(values: number[]): GeorgianNumber[] {
  return values.map(georgianNumber);
}

/** Round numbers: the skeleton of the system. */
export const ROUND_NUMBERS = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/** Composed numbers worth reading aloud once the pattern clicks. */
export const COMPOSED_NUMBERS = [21, 25, 33, 39, 42, 47, 58, 63, 76, 88, 99];
