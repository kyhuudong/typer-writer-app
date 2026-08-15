import { useState } from "react";
import { lessonCatalog } from "../lib/lessonCatalog";
import { useAppStore } from "../store/useAppStore";
import { TopBar } from "./TopBar";
import { SessionRail } from "./SessionRail";
import { InputStage } from "./InputStage";

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
      <section className="mx-auto grid max-w-[1680px] gap-4 px-4 py-5 xl:grid-cols-[132px_minmax(0,1fr)]">
        <aside className="xl:sticky xl:top-4 xl:h-[calc(100vh-2rem)] xl:overflow-auto">
          <SessionRail
            progress={progress}
            lessons={lessonCatalog}
            selectedLessonId={selectedLesson?.id ?? ""}
            onSelectLesson={setSelectedLessonId}
          />
        </aside>

        <div className="space-y-5">
          <InputStage lesson={selectedLesson} />
        </div>
      </section>
    </main>
  );
}
