import type { Lesson } from "../types/lesson";
import type { ProgressProfile } from "../types/progress";
import { CollapsePanel } from "./CollapsePanel";
import { LoginForm } from "../features/auth/LoginForm";
import { LessonGrid } from "../features/lessons/LessonGrid";
import { ProgressSummary } from "./ProgressSummary";

type SessionRailProps = {
  progress: ProgressProfile | null;
  lessons: Lesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
};

export function SessionRail({
  progress,
  lessons,
  selectedLessonId,
  onSelectLesson
}: SessionRailProps) {
  return (
    <section className="space-y-2">
      <CollapsePanel title="Progress" icon={<MenuIcon kind="progress" />}>
        {progress ? <ProgressSummary progress={progress} /> : <LoginForm />}
      </CollapsePanel>

      <CollapsePanel title="Lessons" icon={<MenuIcon kind="lessons" />}>
        <LessonGrid
          lessons={lessons}
          selectedLessonId={selectedLessonId}
          onSelectLesson={(lesson) => onSelectLesson(lesson.id)}
        />
      </CollapsePanel>
    </section>
  );
}

function MenuIcon({ kind }: { kind: "progress" | "lessons" }) {
  if (kind === "progress") {
    return (
      <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <path d="M4 15V5" />
        <path d="M8 15V8" />
        <path d="M12 15V3" />
        <path d="M16 15V10" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 20 20" width="14" height="14" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4.5h12v11H4z" />
      <path d="M7 7h6" />
      <path d="M7 10h6" />
    </svg>
  );
}
