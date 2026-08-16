import type { ProgressProfile } from "../types/progress";

// Accept extra fields like passwordHash from old JSON exports — just ignore them.
type PartialProgressProfile = Partial<ProgressProfile> & Pick<ProgressProfile, "username">;

export function createDefaultProgressProfile(username: string): ProgressProfile {
  return {
    username,
    lastLessonId: null,
    streak: 0,
    totalWordsTyped: 0,
    highestWpm: 0,
    averageAccuracy: 0,
    completedLessonIds: [],
    history: []
  };
}

export function normalizeProgressProfile(
  profile: PartialProgressProfile
): ProgressProfile {
  return {
    username: profile.username,
    lastLessonId: profile.lastLessonId ?? null,
    streak: profile.streak ?? 0,
    totalWordsTyped: profile.totalWordsTyped ?? 0,
    highestWpm: profile.highestWpm ?? 0,
    averageAccuracy: profile.averageAccuracy ?? 0,
    completedLessonIds: profile.completedLessonIds ?? [],
    history: profile.history ?? []
  };
}

export function serializeProgress(profile: ProgressProfile) {
  return JSON.stringify(profile, null, 2);
}

export function deserializeProgress(raw: string): ProgressProfile {
  const parsed = JSON.parse(raw) as PartialProgressProfile;
  return normalizeProgressProfile(parsed);
}
