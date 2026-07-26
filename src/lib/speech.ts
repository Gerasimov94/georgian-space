"use client";

import { useCallback, useEffect, useState } from "react";
import { LETTERS } from "@/lib/data/letters";

/**
 * Speaking Georgian in the browser.
 *
 * Almost no system ships a ka-GE voice, and hiding every speaker button on
 * those machines leaves the app silent — which is useless for learning sounds.
 * So when there is no Georgian voice we read the romanization with a voice
 * whose vowels are closest to Georgian (Italian, then Spanish, then Russian).
 * It is an approximation, but an audible one.
 */

const TRANSLITERATION = new Map(
  LETTERS.map((letter) => [letter.char, letter.latin]),
);

export function romanize(text: string): string {
  return [...text].map((char) => TRANSLITERATION.get(char) ?? char).join("");
}

/** Fallback languages in order of how close their vowels are to Georgian. */
const FALLBACK_LANGS = ["it", "es", "pt", "ru", "de", "en"];

type Picked = {
  georgian: SpeechSynthesisVoice | null;
  fallback: SpeechSynthesisVoice | null;
};

function pickVoices(): Picked {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) {
    return { georgian: null, fallback: null };
  }

  const voices = window.speechSynthesis.getVoices();
  const georgian =
    voices.find((voice) => voice.lang.toLowerCase().startsWith("ka")) ?? null;

  let fallback: SpeechSynthesisVoice | null = null;
  for (const lang of FALLBACK_LANGS) {
    fallback =
      voices.find((voice) => voice.lang.toLowerCase().startsWith(lang)) ?? null;
    if (fallback) break;
  }

  return { georgian, fallback: fallback ?? voices[0] ?? null };
}

/**
 * Says a Georgian string. `latin` overrides the automatic romanization used by
 * the fallback voice, for words whose transliteration is already known.
 */
export function speak(text: string, latin?: string): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  const { georgian, fallback } = pickVoices();
  const voice = georgian ?? fallback;
  if (!voice) return;

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(
    georgian ? text : (latin ?? romanize(text)),
  );
  utterance.voice = voice;
  utterance.lang = voice.lang;
  utterance.rate = georgian ? 0.85 : 0.75;
  window.speechSynthesis.speak(utterance);
}

export type Speech = {
  /** Whether the browser can speak at all. */
  enabled: boolean;
  /** Whether a real Georgian voice is doing the speaking. */
  native: boolean;
  speak: (text: string, latin?: string) => void;
};

/** Voices load asynchronously in Chrome, hence the voiceschanged listener. */
export function useSpeech(): Speech {
  const [{ enabled, native }, setState] = useState({
    enabled: false,
    native: false,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

    const sync = () => {
      const { georgian, fallback } = pickVoices();
      setState({
        enabled: Boolean(georgian ?? fallback),
        native: Boolean(georgian),
      });
    };
    sync();

    window.speechSynthesis.addEventListener("voiceschanged", sync);
    return () =>
      window.speechSynthesis.removeEventListener("voiceschanged", sync);
  }, []);

  return {
    enabled,
    native,
    speak: useCallback((text: string, latin?: string) => speak(text, latin), []),
  };
}
