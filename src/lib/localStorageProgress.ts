import type { ProgressProfile } from "../types/progress";
import { deserializeProgress, serializeProgress } from "./progressFile";

const KEY = "minimal_typer_progress";

export function saveProgressToLocalStorage(profile: ProgressProfile): void {
  try {
    localStorage.setItem(KEY, serializeProgress(profile));
  } catch {
    // localStorage may be unavailable (private mode, storage full, etc.)
  }
}

export function loadProgressFromLocalStorage(): ProgressProfile | null {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return null;
    return deserializeProgress(raw);
  } catch {
    return null;
  }
}

export function clearProgressFromLocalStorage(): void {
  try {
    localStorage.removeItem(KEY);
  } catch {
    // ignore
  }
}
