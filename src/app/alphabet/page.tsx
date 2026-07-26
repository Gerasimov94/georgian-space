import { AlphabetGrid } from "@/components/alphabet-grid";
import { LETTER_COUNT } from "@/lib/data/letters";

export const metadata = { title: "Alphabet · Georgian Space" };

export default function AlphabetPage() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8">
      <header className="max-w-2xl">
        <p className="label-caps">Mkhedruli · მხედრული</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight">
          {LETTER_COUNT} letters, {LETTER_COUNT} sounds
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          Georgian is unicase and fully phonetic: no capitals, no silent letters,
          and every letter is always pronounced the same way. Tap a letter for
          its name, its sound and how to make it.
        </p>
      </header>

      <AlphabetGrid />
    </div>
  );
}
