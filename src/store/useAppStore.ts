import { create } from "zustand";
import type { ProgressProfile } from "../types/progress";
import type { TypingSessionSummary } from "../features/typing/useTypingSession";
import {
  createProgressProfile,
  loadProgressFromFileHandle,
  saveProgressFile
} from "../lib/fileAccess";
import { deserializeProgress } from "../lib/progressFile";
import {
  loadProgressFromLocalStorage,
  saveProgressToLocalStorage
} from "../lib/localStorageProgress";

type AppStatus = "signed-out" | "signed-in";

type AppState = {
  authStatus: AppStatus;
  currentUser: string | null;
  progress: ProgressProfile | null;
  progressFileHandle: FileSystemFileHandle | null;
  isBusy: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  signIn: (username: string) => void;
  signOut: () => void;
  loadProgressFile: (handle: FileSystemFileHandle) => Promise<void>;
  importProgressFile: (file: File) => Promise<void>;
  saveProgress: () => Promise<void>;
  setLastLesson: (lessonId: string) => void;
  recordLessonComplete: (lessonId: string, summary: TypingSessionSummary) => void;
  saveLessonProgress: (lessonId: string, typedText: string) => void;
};

export const useAppStore = create<AppState>((set, get) => {
  // If a profile is already in localStorage, restore the signed-in state
  // automatically so the user doesn't need to click "Continue" after F5.
  const restoredProfile = loadProgressFromLocalStorage();

  return {
  authStatus: restoredProfile ? "signed-in" : "signed-out",
  currentUser: restoredProfile?.username ?? null,
  progress: restoredProfile,
  progressFileHandle: null,
  isBusy: false,
  error: null,
  setError: (error) => set({ error }),

  signIn: (username) => {
    const current = get().progress;
    const progress = current ?? createProgressProfile(username);
    saveProgressToLocalStorage(progress);
    set({
      authStatus: "signed-in",
      currentUser: progress.username,
      progress
    });
  },

  signOut: () =>
    set({
      authStatus: "signed-out",
      currentUser: null
    }),

  loadProgressFile: async (handle) => {
    set({ isBusy: true, error: null });
    try {
      const progress = await loadProgressFromFileHandle(handle);
      set({
        progress,
        progressFileHandle: handle,
        currentUser: progress.username
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      set({ error: message });
      throw error;
    } finally {
      set({ isBusy: false });
    }
  },

  importProgressFile: async (file) => {
    set({ isBusy: true, error: null });
    try {
      const progress = deserializeProgress(await file.text());
      saveProgressToLocalStorage(progress);
      set({
        progress,
        currentUser: progress.username
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      set({ error: message });
      throw error;
    } finally {
      set({ isBusy: false });
    }
  },

  saveProgress: async () => {
    const { progress, progressFileHandle } = get();
    if (!progress) {
      throw new Error("No progress profile is loaded.");
    }

    set({ isBusy: true, error: null });
    try {
      saveProgressToLocalStorage(progress);
      const handle = await saveProgressFile(progress, progressFileHandle);
      set({ progressFileHandle: handle });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      set({ error: message });
      throw error;
    } finally {
      set({ isBusy: false });
    }
  },

  setLastLesson: (lessonId) => {
    const { progress } = get();
    if (!progress) return;
    const updated = { ...progress, lastLessonId: lessonId };
    saveProgressToLocalStorage(updated);
    set({ progress: updated });
  },

  recordLessonComplete: (lessonId, summary) => {
    const { progress } = get();
    if (!progress) return;
    const alreadyDone = progress.completedLessonIds.includes(lessonId);
    // Remove save state — completed lessons don't need resuming.
    const lessonSaveStates = { ...progress.lessonSaveStates };
    delete lessonSaveStates[lessonId];

    // Streak: compare today's date with the last history entry's date.
    const now = new Date();
    const todayStr = now.toISOString().slice(0, 10); // "YYYY-MM-DD"
    const lastEntry = progress.history.at(-1);
    const lastDateStr = lastEntry ? lastEntry.timestamp.slice(0, 10) : null;
    let streak = progress.streak;
    if (lastDateStr === null) {
      // First ever session
      streak = 1;
    } else if (lastDateStr === todayStr) {
      // Already logged a session today — streak unchanged
    } else {
      const yesterday = new Date(now);
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().slice(0, 10);
      streak = lastDateStr === yesterdayStr ? streak + 1 : 1;
    }

    const newHistory = [
      ...progress.history,
      {
        lessonId,
        timestamp: now.toISOString(),
        wpm: summary.wpm,
        accuracy: summary.accuracy
      }
    ];

    const updated: ProgressProfile = {
      ...progress,
      lessonSaveStates,
      streak,
      totalWordsTyped: progress.totalWordsTyped + summary.typedWords,
      highestWpm: Math.max(progress.highestWpm, summary.wpm),
      averageAccuracy: progress.history.length === 0
        ? Math.round(summary.accuracy)
        : Math.round(
            (progress.averageAccuracy * progress.history.length + summary.accuracy) /
            (progress.history.length + 1)
          ),
      completedLessonIds: alreadyDone
        ? progress.completedLessonIds
        : [...progress.completedLessonIds, lessonId],
      history: newHistory
    };
    saveProgressToLocalStorage(updated);
    set({ progress: updated });
  },

  saveLessonProgress: (lessonId, typedText) => {
    const { progress } = get();
    if (!progress) return;
    // Don't save if the lesson is already completed or typed text is trivial.
    if (progress.completedLessonIds.includes(lessonId)) return;
    if (!typedText) {
      // Clear the save state if user hasn't typed anything.
      const lessonSaveStates = { ...progress.lessonSaveStates };
      delete lessonSaveStates[lessonId];
      const updated = { ...progress, lessonSaveStates };
      saveProgressToLocalStorage(updated);
      set({ progress: updated });
      return;
    }
    const updated = {
      ...progress,
      lessonSaveStates: {
        ...progress.lessonSaveStates,
        [lessonId]: { typedText, savedAt: new Date().toISOString() }
      }
    };
    saveProgressToLocalStorage(updated);
    set({ progress: updated });
  }
  };
});
