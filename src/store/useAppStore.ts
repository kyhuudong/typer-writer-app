import { create } from "zustand";
import type { LoginCredentials, ProgressProfile } from "../types/progress";
import {
  authenticateProgressProfile,
  createProgressProfileFromCredentials,
  loadProgressFromFileHandle,
  saveProgressFile
} from "../lib/fileAccess";
import { deserializeProgress } from "../lib/progressFile";

type AppStatus = "signed-out" | "signed-in";

type AppState = {
  authStatus: AppStatus;
  currentUser: string | null;
  progress: ProgressProfile | null;
  progressFileHandle: FileSystemFileHandle | null;
  isBusy: boolean;
  error: string | null;
  setError: (error: string | null) => void;
  signIn: (credentials: LoginCredentials) => Promise<void>;
  signOut: () => void;
  loadProgressFile: (handle: FileSystemFileHandle) => Promise<void>;
  importProgressFile: (file: File) => Promise<void>;
  saveProgress: () => Promise<void>;
};

export const useAppStore = create<AppState>((set, get) => ({
  authStatus: "signed-out",
  currentUser: null,
  progress: null,
  progressFileHandle: null,
  isBusy: false,
  error: null,
  setError: (error) => set({ error }),
  signIn: async (credentials) => {
    set({ isBusy: true, error: null });
    try {
      const current = get().progress;
      if (!current) {
        const progress = await createProgressProfileFromCredentials(credentials);
        set({
          authStatus: "signed-in",
          currentUser: progress.username,
          progress
        });
        return;
      }

      const isValid = await authenticateProgressProfile(current, credentials);
      if (!isValid) {
        throw new Error("Username or password is invalid.");
      }

      set({
        authStatus: "signed-in",
        currentUser: current.username
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      set({ error: message });
      throw error;
    } finally {
      set({ isBusy: false });
    }
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
      const handle = await saveProgressFile(progress, progressFileHandle);
      set({ progressFileHandle: handle });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Something went wrong.";
      set({ error: message });
      throw error;
    } finally {
      set({ isBusy: false });
    }
  }
}));
