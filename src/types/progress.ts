export type ProgressHistoryEntry = {
  lessonId: string;
  timestamp: string;
  wpm: number;
  accuracy: number;
};

export type ProgressProfile = {
  username: string;
  passwordHash: string;
  streak: number;
  totalWordsTyped: number;
  highestWpm: number;
  averageAccuracy: number;
  completedLessonIds: string[];
  history: ProgressHistoryEntry[];
};

export type LoginCredentials = {
  username: string;
  password: string;
};
