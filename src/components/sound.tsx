"use client";

import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSpeech } from "@/lib/speech";
import { cn } from "@/lib/utils";

/**
 * The single way audio is offered in this app: anything Georgian can be heard,
 * and it always looks the same. The button stays in place even when the browser
 * has no voice at all, so the layout never shifts after hydration.
 */
export function SoundButton({
  text,
  latin,
  label = "Listen",
  variant = "ghost",
  size = "icon-sm",
  className,
  showLabel = false,
}: {
  text: string;
  latin?: string;
  label?: string;
  variant?: "ghost" | "outline" | "secondary" | "default";
  size?: "icon-sm" | "icon" | "sm" | "lg" | "default";
  className?: string;
  showLabel?: boolean;
}) {
  const { enabled, speak } = useSpeech();

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      className={cn("text-primary", className)}
      aria-label={`${label}: ${text}`}
      disabled={!enabled}
      onClick={(event) => {
        event.stopPropagation();
        speak(text, latin);
      }}
    >
      <Volume2 className="size-4" />
      {showLabel ? label : null}
    </Button>
  );
}

/**
 * Georgian text that speaks itself when tapped. Used in tables, word lists and
 * anywhere a full speaker button would be too heavy.
 */
export function SpeakableText({
  text,
  latin,
  className,
  children,
}: {
  text: string;
  latin?: string;
  className?: string;
  children?: React.ReactNode;
}) {
  const { enabled, speak } = useSpeech();

  return (
    <button
      type="button"
      disabled={!enabled}
      onClick={(event) => {
        event.stopPropagation();
        speak(text, latin);
      }}
      aria-label={`Listen: ${text}`}
      className={cn(
        "glyph group inline-flex items-center gap-1.5 rounded-md text-left transition-colors",
        "hover:text-primary focus-visible:ring-[3px] focus-visible:ring-ring focus-visible:outline-none",
        "disabled:cursor-default disabled:hover:text-ink",
        className,
      )}
    >
      {children ?? text}
      <Volume2
        aria-hidden
        className="size-3.5 shrink-0 text-primary/45 transition-opacity group-hover:text-primary"
      />
    </button>
  );
}
