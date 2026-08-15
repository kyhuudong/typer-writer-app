import { useState } from "react";
import { lessonCatalog } from "../lib/lessonCatalog";
import { useAppStore } from "../store/useAppStore";
import { TopBar } from "./TopBar";
import { SessionRail } from "./SessionRail";
import { FocusStage } from "./FocusStage";

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

  return (
    <main className="min-h-screen bg-surface-950 text-zinc-50">
      <TopBar userName={currentUser} />
      <section className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <FocusStage lesson={selectedLesson} />
        <SessionRail
          progress={progress}
          lessons={lessonCatalog}
          selectedLessonId={selectedLesson?.id ?? ""}
          onSelectLesson={setSelectedLessonId}
        />
      </section>
    </main>
  );
}
