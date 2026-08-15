import type { Lesson } from "../types/lesson";
import type { ProgressProfile } from "../types/progress";
import { CollapsePanel } from "./CollapsePanel";
import { LoginForm } from "../features/auth/LoginForm";
import { LessonGrid } from "../features/lessons/LessonGrid";
import { ProgressSummary } from "./ProgressSummary";
import { TypingTools } from "../features/typing/TypingTools";

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
    <section className="space-y-3">
      <CollapsePanel title="Progress">
        {progress ? <ProgressSummary progress={progress} /> : <LoginForm />}
      </CollapsePanel>

      <CollapsePanel title="Lessons">
        <LessonGrid
          lessons={lessons}
          selectedLessonId={selectedLessonId}
          onSelectLesson={(lesson) => onSelectLesson(lesson.id)}
        />
      </CollapsePanel>

      <CollapsePanel title="Tools">
        <TypingTools text={lessons.find((lesson) => lesson.id === selectedLessonId)?.text ?? ""} />
      </CollapsePanel>
    </section>
  );
}
