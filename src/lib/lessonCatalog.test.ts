import { filterLessons, loadLessons } from "./lessonCatalog";

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
