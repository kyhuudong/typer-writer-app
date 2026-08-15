import { useState } from "react";
import { lessonCatalog } from "../lib/lessonCatalog";
import { LessonGrid } from "../features/lessons/LessonGrid";
import { LoginForm } from "../features/auth/LoginForm";
import { TypingSession } from "../features/typing/TypingSession";
import { useAppStore } from "../store/useAppStore";
import { EmptyState } from "./EmptyState";
import { ProgressSummary } from "./ProgressSummary";
import { TopBar } from "./TopBar";

export function AppShell() {
  const authStatus = useAppStore((state) => state.authStatus);
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
      <section className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl gap-6 px-6 py-8 xl:grid-cols-[360px_minmax(0,1fr)]">
        <aside className="space-y-6">
          {authStatus === "signed-in" ? (
            <ProgressSummary progress={progress} />
          ) : (
            <LoginForm />
          )}
          <EmptyState
            title="Minimal by design"
            description="Focus on one lesson at a time, save progress locally, and keep distractions out of the way."
          />
        </aside>

        <div className="space-y-6">
          <section className="space-y-4">
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-sm uppercase tracking-[0.25em] text-zinc-500">
                  Lessons
                </p>
                <h2 className="text-2xl font-medium">Choose a paragraph</h2>
              </div>
              <p className="text-sm text-zinc-400">
                {lessonCatalog.length} lessons available
              </p>
            </div>
            <LessonGrid
              lessons={lessonCatalog}
              selectedLessonId={selectedLesson?.id}
              onSelectLesson={(lesson) => setSelectedLessonId(lesson.id)}
            />
          </section>

          {authStatus === "signed-in" && selectedLesson ? (
            <TypingSession
              text={selectedLesson.text}
              title={selectedLesson.title}
            />
          ) : (
            <EmptyState
              title="Sign in to start typing"
              description="Choose a lesson above, then sign in to save your streak and typing stats locally."
            />
          )}
        </div>
      </section>
    </main>
  );
}
