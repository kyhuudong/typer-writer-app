# Alt+Arrow Category Navigation Design

## Purpose

Enable quick lesson navigation without leaving the typing surface:

- `Alt + Left Arrow` selects the previous lesson.
- `Alt + Right Arrow` selects the next lesson.

## Behavior

The shortcut is handled at the AppShell level so it works while the typing
textarea has focus. It uses the same category-only neighbor calculation and
selection callback as the visible Previous and Next buttons.

At the first or last lesson in a category, the unavailable shortcut does
nothing. Browser default behavior is prevented only for a valid in-app move,
so the app does not interfere unnecessarily with Alt+Arrow outside a valid
navigation action.

Completion remains manual: the shortcut does not change the existing rule that
Next becomes visually prominent after completion but does not auto-advance.

## Progress Compatibility

The shortcut calls the existing lesson selection path. That path updates
`lastLessonId`, triggers InputStage's departure save behavior, and remounts the
destination typing surface with its own ID-keyed saved progress. Refresh
restoration and collection selection therefore retain their current behavior.

## Validation

An AppShell integration test confirms that Alt+Right moves to the next lesson
and prevents browser navigation, while Alt+Left at the first lesson does
nothing and does not prevent the default action. The existing full suite and
production build verify all related behavior.
