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
};

export const useAppStore = create<AppState>((set, get) => ({
  authStatus: "signed-out",
  currentUser: null,
  // Pre-load progress from localStorage so returning users don't need to re-load a file.
  progress: loadProgressFromLocalStorage(),
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
    const updated: ProgressProfile = {
      ...progress,
      totalWordsTyped: progress.totalWordsTyped + summary.typedWords,
      highestWpm: Math.max(progress.highestWpm, summary.wpm),
      averageAccuracy: progress.history.length === 0
        ? summary.accuracy
        : Math.round(
            (progress.averageAccuracy * progress.history.length + summary.accuracy) /
            (progress.history.length + 1)
          ),
      completedLessonIds: alreadyDone
        ? progress.completedLessonIds
        : [...progress.completedLessonIds, lessonId],
      history: [
        ...progress.history,
        {
          lessonId,
          timestamp: new Date().toISOString(),
          wpm: summary.wpm,
          accuracy: summary.accuracy
        }
      ]
    };
    saveProgressToLocalStorage(updated);
    set({ progress: updated });
  }
}));
