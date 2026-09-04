# Category Lesson Navigation Design

## Purpose

Help learners move between lessons without reopening the sidebar. Navigation is
limited to the current category so a learner can follow a focused sequence
without unexpectedly entering another topic.

## User Experience

A compact header appears above the typing area:

`Previous | Collection · Category · position | Next`

For example: `Previous | English Practice · English · 3 of 12 | Next`.

The current collection's JSON order determines the sequence. Previous is
disabled on the first category lesson and Next is disabled on the last. The
controls never cross a category boundary.

Navigation is always manual. When a lesson reaches 100%, Next becomes a more
prominent action but does not advance automatically. This preserves a learner's
opportunity to review the completed text.

## Architecture

`LessonNavigator` is a presentational component that receives position,
boundary, completion, and callback props. It does not access lesson data or
progress storage.

`AppShell` derives the ordered lessons for the selected lesson's category from
the active collection. It passes the neighboring lesson IDs to the existing
`handleSelectLesson` callback.

## Progress Compatibility

The feature does not change the progress profile or localStorage schema.
Existing `handleSelectLesson` behavior continues to update `lastLessonId`.
InputStage's save-on-unmount logic continues to save the departing lesson, and
the destination lesson restores its own saved text through its stable lesson
ID. Refresh therefore reopens the most recently navigated lesson as before.

## Validation

Tests cover accessible boundary controls, position display, manual
completion-aware emphasis, and app-level Next navigation within the active
category. The complete main-source test suite and production build run before
release.
