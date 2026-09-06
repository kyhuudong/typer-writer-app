# Clear Typed Shortcut Design

## Purpose

Let users restart the current lesson quickly when they want to re-type an
interesting passage from the beginning.

## Behavior

The typing screen provides a visible **Clear typed** button and supports:

- `Command + Delete`
- `Command + Backspace`

Clearing affects only the current lesson.

For an in-progress lesson, clearing removes the typed text from the current
view and deletes that lesson's saved draft from progress storage.

For a completed lesson, clearing also removes that lesson ID from
`completedLessonIds`, so the lesson returns to an unfinished state and can be
typed from zero again.

Lifetime statistics and history are preserved. They describe past completed
typing work and should not be erased by re-practicing one lesson.

## State Flow

`useAppStore.clearLessonProgress(lessonId)` removes both:

- `lessonSaveStates[lessonId]`
- `lessonId` from `completedLessonIds`

It keeps `lastLessonId`, streak, words typed, highest WPM, average accuracy,
and history unchanged.

`InputStage` owns the button because it already connects the active lesson to
the progress store. It increments a reset token after clearing so the currently
mounted `TypingViewport` resets immediately even though the lesson ID does not
change.

`TypingViewport` listens for the shortcut and calls the same clear request as
the button. When reset, it clears translation/selection state, focuses the
typing surface, and places the caret at position 0.

## Compatibility

Progress remains keyed by lesson ID. Clearing deletes the old saved draft, so
refresh will not restore the text the user intentionally cleared. Existing
navigation, translation, paragraph rendering, and save-on-switch behavior stay
unchanged.

## Validation

Tests cover:

- shortcut request and default prevention;
- immediate viewport reset;
- saved draft deletion;
- completed lesson reset;
- preservation of lifetime statistics/history;
- full suite and production build.
