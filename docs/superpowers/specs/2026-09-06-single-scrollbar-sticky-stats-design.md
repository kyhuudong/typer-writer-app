# Single Scrollbar and Sticky Stats Design

## Purpose

Long lessons should have one clear scroll behavior. The app should not show a
browser scrollbar and a second scrollbar inside the typing surface at the same
time.

## Root Cause

`TypingViewport` used `max-h-[88vh] overflow-auto`, making it a nested vertical
scroll container. The page also scrolls when content is long, so long lessons
could display two scrollbars and feel difficult to control.

## Behavior

The browser page is now the only vertical scroll container for lesson content.
The typing surface remains in normal page flow and grows with the lesson.

The typing session toolbar stays sticky below the navbar. It keeps WPM,
accuracy, completion percent, clear action, and saved status visible while the
user scrolls through long content.

## Auto-Follow

The current-character auto-follow logic now checks the current character
against the browser viewport instead of an internal scroll container. It only
scrolls when the current character is near the top or bottom margin, preventing
constant recentering and preserving the previous jitter fix.

## Compatibility

This is a layout-only change. It does not change lesson data, typing metrics,
translation selection, `⌘ Delete`, Alt+Arrow navigation, saved progress,
completion, or refresh restoration.

## Validation

Tests assert that TypingViewport no longer has internal scroll classes and that
the session toolbar is sticky. Existing typing, translation, navigation,
clear, and progress tests continue to run with the production build.
