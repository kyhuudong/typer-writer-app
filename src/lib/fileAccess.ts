import type { ProgressProfile } from "../types/progress";
import { createDefaultProgressProfile, deserializeProgress, serializeProgress } from "./progressFile";

type BrowserWindowWithPickers = Window & {
  showOpenFilePicker?: (options?: unknown) => Promise<FileSystemFileHandle[]>;
  showSaveFilePicker?: (options?: unknown) => Promise<FileSystemFileHandle>;
};

function getBrowserWindow() {
  return typeof window === "undefined" ? null : (window as BrowserWindowWithPickers);
}

export async function readProgressFile(file: File): Promise<ProgressProfile> {
  return deserializeProgress(await file.text());
}

export async function saveProgressFile(
  profile: ProgressProfile,
  handle?: FileSystemFileHandle | null
) {
  if (handle) {
    const writable = await handle.createWritable();
    await writable.write(serializeProgress(profile));
    await writable.close();
    return handle;
  }

  const browserWindow = getBrowserWindow();
  if (browserWindow?.showSaveFilePicker) {
    const nextHandle = await browserWindow.showSaveFilePicker({
      suggestedName: "user_progress.json",
      types: [
        {
          description: "JSON progress file",
          accept: { "application/json": [".json"] }
        }
      ]
    });
    const writable = await nextHandle.createWritable();
    await writable.write(serializeProgress(profile));
    await writable.close();
    return nextHandle;
  }

  const blob = new Blob([serializeProgress(profile)], {
    type: "application/json"
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "user_progress.json";
  link.click();
  URL.revokeObjectURL(url);
  return null;
}

export async function pickProgressFile() {
  const browserWindow = getBrowserWindow();
  if (!browserWindow?.showOpenFilePicker) {
    return null;
  }

  const [handle] = await browserWindow.showOpenFilePicker({
    types: [
      {
        description: "JSON progress file",
        accept: { "application/json": [".json"] }
      }
    ],
    multiple: false
  });

  return handle ?? null;
}

export async function loadProgressFromFileHandle(
  handle: FileSystemFileHandle
): Promise<ProgressProfile> {
  const file = await handle.getFile();
  return readProgressFile(file);
}

export function createProgressProfile(username: string): ProgressProfile {
  return createDefaultProgressProfile(username);
}
