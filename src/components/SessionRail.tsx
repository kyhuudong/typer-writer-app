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
    <section className="space-y-4">
      <CollapsePanel title="Progress" description="Save or review your local learning file.">
        {progress ? <ProgressSummary progress={progress} /> : <LoginForm />}
      </CollapsePanel>

      <CollapsePanel title="Lessons" description="Open the lesson browser when you want to switch text.">
        <LessonGrid
          lessons={lessons}
          selectedLessonId={selectedLessonId}
          onSelectLesson={(lesson) => onSelectLesson(lesson.id)}
        />
      </CollapsePanel>
    </section>
  );
}
