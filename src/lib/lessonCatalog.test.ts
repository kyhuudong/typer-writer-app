import { filterLessons, lessonCatalog, loadLessons } from "./lessonCatalog";

test("loads lesson metadata and filters by category", () => {
  const lessons = loadLessons([
    {
      id: "stoic_001",
      title: "Control",
      category: "Stoicism",
      difficulty: "Easy",
      image: "",
      text: "You have power over your mind."
    },
    {
      id: "sci_001",
      title: "Orbit",
      category: "Science",
      difficulty: "Medium",
      image: "",
      text: "Bodies move in stable paths."
    }
  ]);

  expect(filterLessons(lessons, { category: "Stoicism" })).toHaveLength(1);
});

test("filters lessons by difficulty", () => {
  const lessons = loadLessons([
    {
      id: "lit_001",
      title: "Winter",
      category: "Literature",
      difficulty: "Hard",
      image: "",
      text: "The snow folded the world into silence."
    },
    {
      id: "sci_001",
      title: "Orbit",
      category: "Science",
      difficulty: "Medium",
      image: "",
      text: "Bodies move in stable paths."
    }
  ]);

  expect(filterLessons(lessons, { difficulty: "Hard" })).toEqual([
    expect.objectContaining({ id: "lit_001" })
  ]);
});

test("keeps visual paragraph breaks aligned with space-only typing text", () => {
  const [lesson] = loadLessons([
    {
      id: "lit_001",
      title: "Paragraphs",
      category: "Literature",
      difficulty: "Easy",
      image: "",
      text: "First thought.\n\nSecond thought."
    }
  ]);

  expect(lesson.text).toBe("First thought. Second thought.");
  expect(lesson.displayText).toBe("First thought.\nSecond thought.");
  expect(lesson.displayText).toHaveLength(lesson.text.length);
  expect(lesson.text[lesson.displayText.indexOf("\n")]).toBe(" ");
});

test("keeps every catalog display string aligned with its typing target", () => {
  expect(
    lessonCatalog.every((lesson) => lesson.displayText?.length === lesson.text.length)
  ).toBe(true);
});
