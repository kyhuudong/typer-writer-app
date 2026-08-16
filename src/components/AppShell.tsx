import { useState } from "react";
import { lessonCatalog } from "../lib/lessonCatalog";
import { useAppStore } from "../store/useAppStore";
import { TopBar } from "./TopBar";
import { SessionRail } from "./SessionRail";
import { SlideSidebar } from "./SlideSidebar";
import { InputStage } from "./InputStage";

export function AppShell() {
  const currentUser = useAppStore((state) => state.currentUser);
  const progress = useAppStore((state) => state.progress);
  const setLastLesson = useAppStore((state) => state.setLastLesson);

  const initialLessonId = progress?.lastLessonId ?? lessonCatalog[0]?.id ?? "";
  const [selectedLessonId, setSelectedLessonId] = useState(initialLessonId);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedLesson =
    lessonCatalog.find((lesson) => lesson.id === selectedLessonId) ??
    lessonCatalog[0] ??
    null;

  function handleSelectLesson(id: string) {
    setSelectedLessonId(id);
    setLastLesson(id);
    setSidebarOpen(false);
  }

  return (
    <main className="min-h-screen bg-surface-950 text-zinc-50">
      <TopBar userName={currentUser} lessonTitle={selectedLesson?.title ?? null} onMenuClick={() => setSidebarOpen(true)} />

      {/* Slide-over sidebar */}
      <SlideSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <SessionRail
          progress={progress}
          lessons={lessonCatalog}
          selectedLessonId={selectedLesson?.id ?? ""}
          onSelectLesson={handleSelectLesson}
          onResumeLesson={handleSelectLesson}
        />
      </SlideSidebar>

      {/* Full-width typing area */}
      <section className="mx-auto max-w-[1400px] px-6 py-5">
        <InputStage lesson={selectedLesson} />
      </section>
    </main>
  );
}
