import { useState } from "react";
import {
  findLessonCollection,
  lessonCatalog,
  lessonCollections
} from "../lib/lessonCatalog";
import { useAppStore } from "../store/useAppStore";
import { TopBar } from "./TopBar";
import { SessionRail } from "./SessionRail";
import { SlideSidebar } from "./SlideSidebar";
import { InputStage } from "./InputStage";

const COLLECTION_PREFERENCE_KEY = "minimal_typer_collection";

export function AppShell() {
  const currentUser = useAppStore((state) => state.currentUser);
  const progress = useAppStore((state) => state.progress);
  const setLastLesson = useAppStore((state) => state.setLastLesson);

  const lastLessonCollection = findLessonCollection(
    lessonCollections,
    progress?.lastLessonId
  );
  const storedCollectionId = localStorage.getItem(COLLECTION_PREFERENCE_KEY);
  const initialCollectionId =
    lastLessonCollection?.id ??
    lessonCollections.find((collection) => collection.id === storedCollectionId)?.id ??
    lessonCollections[0]?.id ??
    "";
  const initialCollection = lessonCollections.find(
    (collection) => collection.id === initialCollectionId
  );
  const initialLessonId =
    progress?.lastLessonId && initialCollection?.lessons.some(
      (lesson) => lesson.id === progress.lastLessonId
    )
      ? progress.lastLessonId
      : initialCollection?.lessons[0]?.id ?? lessonCatalog[0]?.id ?? "";
  const [selectedLessonId, setSelectedLessonId] = useState(initialLessonId);
  const [selectedCollectionId, setSelectedCollectionId] = useState(initialCollectionId);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const selectedCollection =
    lessonCollections.find((collection) => collection.id === selectedCollectionId) ??
    lessonCollections[0] ??
    null;
  const selectedLesson =
    selectedCollection?.lessons.find((lesson) => lesson.id === selectedLessonId) ??
    selectedCollection?.lessons[0] ??
    null;

  function handleSelectLesson(id: string) {
    setSelectedLessonId(id);
    setLastLesson(id);
    setSidebarOpen(false);
  }

  function handleSelectCollection(id: string) {
    const collection = lessonCollections.find((entry) => entry.id === id);
    const firstLesson = collection?.lessons[0];
    if (!collection || !firstLesson) return;
    localStorage.setItem(COLLECTION_PREFERENCE_KEY, collection.id);
    setSelectedCollectionId(collection.id);
    setSelectedLessonId(firstLesson.id);
    setLastLesson(firstLesson.id);
  }

  return (
    <main className="min-h-screen bg-surface-950 text-zinc-50">
      <TopBar userName={currentUser} lessonTitle={selectedLesson?.title ?? null} onMenuClick={() => setSidebarOpen(true)} />

      {/* Slide-over sidebar */}
      <SlideSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)}>
        <SessionRail
          progress={progress}
          collections={lessonCollections}
          selectedCollectionId={selectedCollection?.id ?? ""}
          onSelectCollection={handleSelectCollection}
          lessons={selectedCollection?.lessons ?? []}
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
