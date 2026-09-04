import {
  filterLessons,
  findLessonCollection,
  lessonCatalog,
  loadLessonCollections,
  loadLessons
} from "./lessonCatalog";

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

test("loads named collections and preserves their normalized lessons", () => {
  const collections = loadLessonCollections([
    {
      id: "stoicism",
      title: "Stoicism",
      description: "Practice Stoic ideas.",
      lessons: [
        {
          id: "stoic_001",
          title: "Control",
          category: "Stoicism",
          difficulty: "Easy",
          image: "",
          text: "First thought.\n\nSecond thought."
        }
      ]
    },
    {
      id: "science",
      title: "Science",
      description: "Practice science.",
      lessons: [
        {
          id: "science_001",
          title: "Orbit",
          category: "Science",
          difficulty: "Medium",
          image: "",
          text: "Bodies move."
        }
      ]
    }
  ]);

  expect(collections.map((collection) => collection.id)).toEqual(["science", "stoicism"]);
  expect(collections[1].lessons[0]).toMatchObject({
    id: "stoic_001",
    text: "First thought. Second thought.",
    displayText: "First thought.\nSecond thought."
  });
});

test("rejects duplicate lesson IDs across collections", () => {
  expect(() =>
    loadLessonCollections([
      {
        id: "first",
        title: "First",
        description: "First collection.",
        lessons: [{
          id: "shared_001",
          title: "One",
          category: "First",
          difficulty: "Easy",
          image: "",
          text: "First."
        }]
      },
      {
        id: "second",
        title: "Second",
        description: "Second collection.",
        lessons: [{
          id: "shared_001",
          title: "Two",
          category: "Second",
          difficulty: "Easy",
          image: "",
          text: "Second."
        }]
      }
    ])
  ).toThrow(/duplicate lesson id/i);
});

test("finds the collection owning a saved last lesson", () => {
  const collections = loadLessonCollections([
    {
      id: "stoicism",
      title: "Stoicism",
      description: "Practice Stoic ideas.",
      lessons: [{
        id: "stoic_001",
        title: "Control",
        category: "Stoicism",
        difficulty: "Easy",
        image: "",
        text: "Control."
      }]
    },
    {
      id: "science",
      title: "Science",
      description: "Practice science.",
      lessons: [{
        id: "science_001",
        title: "Orbit",
        category: "Science",
        difficulty: "Easy",
        image: "",
        text: "Orbit."
      }]
    }
  ]);

  expect(findLessonCollection(collections, "science_001")?.id).toBe("science");
  expect(findLessonCollection(collections, "missing")).toBeUndefined();
});
