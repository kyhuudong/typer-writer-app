import { useEffect, useState } from "react";
import { lessonCatalog } from "../lib/lessonCatalog";
import { TypingSession } from "../features/typing/TypingSession";
import { useAppStore } from "../store/useAppStore";
import { TopBar } from "./TopBar";
import { SessionRail } from "./SessionRail";
import type { TypingSessionSummary } from "../features/typing/useTypingSession";

export function AppShell() {
  const currentUser = useAppStore((state) => state.currentUser);
  const progress = useAppStore((state) => state.progress);
  const [selectedLessonId, setSelectedLessonId] = useState(
    lessonCatalog[0]?.id ?? ""
  );

  const selectedLesson =
    lessonCatalog.find((lesson) => lesson.id === selectedLessonId) ??
    lessonCatalog[0] ??
    null;
  const [typingSummary, setTypingSummary] = useState<TypingSessionSummary>({
    typedWords: 0,
    correctChars: 0,
    totalChars: selectedLesson?.text.length ?? 0,
    elapsedMs: 0,
    wpm: 0,
    accuracy: 0
  });

  useEffect(() => {
    setTypingSummary({
      typedWords: 0,
      correctChars: 0,
      totalChars: selectedLesson?.text.length ?? 0,
      elapsedMs: 0,
      wpm: 0,
      accuracy: 0
    });
  }, [selectedLesson?.id, selectedLesson?.text.length]);

  return (
    <main className="min-h-screen bg-surface-950 text-zinc-50">
      <TopBar userName={currentUser} />
      <section className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <TypingSession
          text={selectedLesson?.text ?? ""}
          title={selectedLesson?.title ?? "Choose a lesson"}
          onSummaryChange={setTypingSummary}
        />

        <SessionRail
          progress={progress}
          lessons={lessonCatalog}
          selectedLessonId={selectedLesson?.id ?? ""}
          onSelectLesson={setSelectedLessonId}
          typingSummary={typingSummary}
          lessonText={selectedLesson?.text ?? ""}
        />
      </section>
    </main>
  );
}
