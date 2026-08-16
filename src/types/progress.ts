export type ProgressHistoryEntry = {
  lessonId: string;
  timestamp: string;
  wpm: number;
  accuracy: number;
};

export type LessonSaveState = {
  typedText: string;
  savedAt: string;
};

export type ProgressProfile = {
  username: string;
  lastLessonId: string | null;
  lessonSaveStates: Record<string, LessonSaveState>;
  streak: number;
  totalWordsTyped: number;
  highestWpm: number;
  averageAccuracy: number;
  completedLessonIds: string[];
  history: ProgressHistoryEntry[];
};

export type LoginCredentials = {
  username: string;
};
