import type { Lesson } from "../types/lesson";
import type { ProgressProfile } from "../types/progress";
import type { TypingSessionSummary } from "../features/typing/useTypingSession";
import { CollapsePanel } from "./CollapsePanel";
import { LoginForm } from "../features/auth/LoginForm";
import { LessonGrid } from "../features/lessons/LessonGrid";
import { ProgressSummary } from "./ProgressSummary";
import { TypingStats } from "../features/typing/TypingStats";
import { TypingTools } from "../features/typing/TypingTools";

type SessionRailProps = {
  progress: ProgressProfile | null;
  lessons: Lesson[];
  selectedLessonId: string;
  onSelectLesson: (lessonId: string) => void;
  typingSummary: TypingSessionSummary;
  lessonText: string;
};

export function SessionRail({
  progress,
  lessons,
  selectedLessonId,
  onSelectLesson,
  typingSummary,
  lessonText
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

      <CollapsePanel title="Live stats" description="WPM and accuracy stay out of the main typing area.">
        <TypingStats summary={typingSummary} />
      </CollapsePanel>

      <CollapsePanel title="Study tools" description="Listen to the paragraph or look up words only when needed.">
        <TypingTools text={lessonText} />
      </CollapsePanel>
    </section>
  );
}
