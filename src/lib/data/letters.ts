/**
 * The 33 letters of the modern Mkhedruli alphabet, in alphabetical order.
 *
 * The pronunciation notes spend most of their effort on the sounds English
 * speakers cannot guess: the ejectives (კ პ ტ ყ წ ჭ) and the uvulars (ღ ყ ხ).
 */

export type LetterZone = "midline" | "ascender" | "descender" | "full";

export type Letter = {
  /** The glyph itself. Mkhedruli is unicase, so there is only one form. */
  char: string;
  /** Traditional letter name, e.g. "ban" for ბ. */
  name: string;
  /** Georgian national transliteration. */
  latin: string;
  ipa: string;
  /** Short "sounds like" anchor in English. */
  soundsLike: string;
  /** Longer articulation help, shown for the sounds that need it. */
  tip?: string;
  example: { ka: string; latin: string; en: string };
};

export const LETTERS: Letter[] = [
  {
    char: "ა",
    name: "an",
    latin: "a",
    ipa: "/ɑ/",
    soundsLike: "a in father",
    example: { ka: "არა", latin: "ara", en: "no" },
  },
  {
    char: "ბ",
    name: "ban",
    latin: "b",
    ipa: "/b/",
    soundsLike: "b in Ben",
    example: { ka: "ბავშვი", latin: "bavshvi", en: "child" },
  },
  {
    char: "გ",
    name: "gan",
    latin: "g",
    ipa: "/ɡ/",
    soundsLike: "g in go",
    example: { ka: "გამარჯობა", latin: "gamarjoba", en: "hello" },
  },
  {
    char: "დ",
    name: "don",
    latin: "d",
    ipa: "/d/",
    soundsLike: "d in David",
    example: { ka: "დედა", latin: "deda", en: "mother" },
  },
  {
    char: "ე",
    name: "en",
    latin: "e",
    ipa: "/ɛ/",
    soundsLike: "e in bed",
    example: { ka: "ერთი", latin: "erti", en: "one" },
  },
  {
    char: "ვ",
    name: "vin",
    latin: "v",
    ipa: "/v/",
    soundsLike: "v in vowel",
    example: { ka: "ვაშლი", latin: "vashli", en: "apple" },
  },
  {
    char: "ზ",
    name: "zen",
    latin: "z",
    ipa: "/z/",
    soundsLike: "z in zebra",
    example: { ka: "ზამთარი", latin: "zamtari", en: "winter" },
  },
  {
    char: "თ",
    name: "tan",
    latin: "t",
    ipa: "/tʰ/",
    soundsLike: "t in tower",
    tip: "Aspirated t: a clear puff of air follows it, unlike the ejective ტ.",
    example: { ka: "თბილისი", latin: "tbilisi", en: "Tbilisi" },
  },
  {
    char: "ი",
    name: "in",
    latin: "i",
    ipa: "/i/",
    soundsLike: "ea in easy",
    example: { ka: "იტალია", latin: "italia", en: "Italy" },
  },
  {
    char: "კ",
    name: "k'an",
    latin: "k'",
    ipa: "/kʼ/",
    soundsLike: "k in king, but harder",
    tip: "Ejective k. Hold your hand in front of your mouth and say English “key” — you feel air. For კ no air should escape: tighten the throat and release without breath.",
    example: { ka: "კატა", latin: "kata", en: "cat" },
  },
  {
    char: "ლ",
    name: "las",
    latin: "l",
    ipa: "/l/",
    soundsLike: "l in lemon",
    example: { ka: "ლომი", latin: "lomi", en: "lion" },
  },
  {
    char: "მ",
    name: "man",
    latin: "m",
    ipa: "/m/",
    soundsLike: "m in mama",
    example: { ka: "მადლობა", latin: "madloba", en: "thank you" },
  },
  {
    char: "ნ",
    name: "nar",
    latin: "n",
    ipa: "/n/",
    soundsLike: "n in Nairobi",
    example: { ka: "ნინო", latin: "nino", en: "Nino (name)" },
  },
  {
    char: "ო",
    name: "on",
    latin: "o",
    ipa: "/ɔ/",
    soundsLike: "o in British pot",
    example: { ka: "ოთახი", latin: "otakhi", en: "room" },
  },
  {
    char: "პ",
    name: "p'ar",
    latin: "p'",
    ipa: "/pʼ/",
    soundsLike: "p in spin",
    tip: "Ejective p. Say “spin” — that p has almost no air. Then tighten the glottis and release a quick burst. No air on your palm.",
    example: { ka: "პური", latin: "puri", en: "bread" },
  },
  {
    char: "ჟ",
    name: "zhan",
    latin: "zh",
    ipa: "/ʒ/",
    soundsLike: "s in measure",
    tip: "Voiced postalveolar fricative. Hold the middle of “measure” — your vocal cords vibrate, unlike the “sh” of “ship”.",
    example: { ka: "ჟურნალი", latin: "zhurnali", en: "magazine" },
  },
  {
    char: "რ",
    name: "rae",
    latin: "r",
    ipa: "/r/",
    soundsLike: "rolled r, Spanish pero",
    tip: "Tap the tip of your tongue once on the ridge behind your upper teeth — like the “dd” in American “ladder” — or roll it a few times.",
    example: { ka: "რძე", latin: "rdze", en: "milk" },
  },
  {
    char: "ს",
    name: "san",
    latin: "s",
    ipa: "/s/",
    soundsLike: "s in Superman",
    example: { ka: "სახლი", latin: "sakhli", en: "house" },
  },
  {
    char: "ტ",
    name: "t'ar",
    latin: "t'",
    ipa: "/tʼ/",
    soundsLike: "t in stop",
    tip: "Ejective t: same place as English “top”, but pressure comes from a closed throat and no air follows.",
    example: { ka: "ტელეფონი", latin: "telefoni", en: "telephone" },
  },
  {
    char: "უ",
    name: "un",
    latin: "u",
    ipa: "/u/",
    soundsLike: "oo in boot",
    example: { ka: "უნივერსიტეტი", latin: "universiteti", en: "university" },
  },
  {
    char: "ფ",
    name: "par",
    latin: "p",
    ipa: "/pʰ/",
    soundsLike: "p in pen",
    tip: "Aspirated p — the airy English p. Contrast it with the airless ejective პ.",
    example: { ka: "ფული", latin: "puli", en: "money" },
  },
  {
    char: "ქ",
    name: "kan",
    latin: "k",
    ipa: "/kʰ/",
    soundsLike: "k in kite",
    tip: "Aspirated k: back of the tongue on the soft palate, released with a strong puff. More explosive than კ, which has no air at all.",
    example: { ka: "ქალი", latin: "kali", en: "woman" },
  },
  {
    char: "ღ",
    name: "ghan",
    latin: "gh",
    ipa: "/ʁ/",
    soundsLike: "throaty French r in Paris",
    tip: "Voiced uvular fricative. Move the back of your tongue near the uvula and let the air vibrate there — a soft gargle. Unlike ხ, your vocal cords stay switched on.",
    example: { ka: "ღვინო", latin: "ghvino", en: "wine" },
  },
  {
    char: "ყ",
    name: "q'ar",
    latin: "q",
    ipa: "/qʼ/",
    soundsLike: "no English equivalent",
    tip: "Voiceless uvular ejective. Pull the tongue right back to the uvula, close the throat completely, then pop the pressure out dry. Similar to Arabic ق but harder.",
    example: { ka: "ყველი", latin: "qveli", en: "cheese" },
  },
  {
    char: "შ",
    name: "shin",
    latin: "sh",
    ipa: "/ʃ/",
    soundsLike: "sh in shoe",
    example: { ka: "შენ", latin: "shen", en: "you" },
  },
  {
    char: "ჩ",
    name: "chin",
    latin: "ch",
    ipa: "/tʃʰ/",
    soundsLike: "ch in chair",
    example: { ka: "ჩემი", latin: "chemi", en: "my" },
  },
  {
    char: "ც",
    name: "tsan",
    latin: "ts",
    ipa: "/tsʰ/",
    soundsLike: "ts in bits",
    example: { ka: "ცხენი", latin: "tskheni", en: "horse" },
  },
  {
    char: "ძ",
    name: "dzil",
    latin: "dz",
    ipa: "/dz/",
    soundsLike: "ds in kids",
    tip: "Voiced affricate: it starts as d and ends as z, with the vocal cords vibrating throughout.",
    example: { ka: "ძაღლი", latin: "dzaghli", en: "dog" },
  },
  {
    char: "წ",
    name: "ts'il",
    latin: "ts'",
    ipa: "/tsʼ/",
    soundsLike: "ts in cats, tighter",
    tip: "Ejective version of ც. Hold your breath slightly to build pressure, then release it sharply with no voicing.",
    example: { ka: "წიგნი", latin: "tsigni", en: "book" },
  },
  {
    char: "ჭ",
    name: "ch'ar",
    latin: "ch'",
    ipa: "/tʃʼ/",
    soundsLike: "ch in chair, ejective",
    tip: "Ejective ჩ: same tongue position, but voiceless with tight pressure and a sharp burst from the throat.",
    example: { ka: "ჭიქა", latin: "chika", en: "glass" },
  },
  {
    char: "ხ",
    name: "khan",
    latin: "kh",
    ipa: "/χ/",
    soundsLike: "ch in German Bach",
    tip: "A rough, throaty h — much deeper than the soft English h in “hello”, and voiceless unlike ღ.",
    example: { ka: "ხე", latin: "khe", en: "tree" },
  },
  {
    char: "ჯ",
    name: "jan",
    latin: "j",
    ipa: "/dʒ/",
    soundsLike: "j in jam",
    example: { ka: "ჯიბე", latin: "jibe", en: "pocket" },
  },
  {
    char: "ჰ",
    name: "hae",
    latin: "h",
    ipa: "/h/",
    soundsLike: "h in hello",
    example: { ka: "ჰაერი", latin: "haeri", en: "air" },
  },
];

export const LETTER_COUNT = LETTERS.length;

const BY_CHAR = new Map(LETTERS.map((letter) => [letter.char, letter]));

export function getLetter(char: string): Letter | undefined {
  return BY_CHAR.get(char);
}

export function letterIndex(char: string): number {
  return LETTERS.findIndex((letter) => letter.char === char);
}

export const ZONE_LABELS: Record<LetterZone, string> = {
  midline: "sits between baseline and midline",
  ascender: "rises above the midline",
  descender: "drops below the baseline",
  full: "spans ascender and descender",
};

export const ZONE_HINTS: Record<LetterZone, string> = {
  midline: "Keep it inside the two middle lines.",
  ascender: "The tall part must reach up past the midline.",
  descender: "The tail must cross below the baseline.",
  full: "It reaches both above the midline and below the baseline.",
};
