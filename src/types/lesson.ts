export type LessonDifficulty = "Easy" | "Medium" | "Hard";

export type Lesson = {
  id: string;
  title: string;
  category: string;
  difficulty: LessonDifficulty;
  image: string;
  text: string;
};

export type LessonFilters = {
  category?: string;
  difficulty?: LessonDifficulty;
};
