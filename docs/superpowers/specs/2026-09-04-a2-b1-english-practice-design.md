# A2-B1 Everyday English Practice Design

## Purpose

Add twelve original English typing lessons for A2-B1 learners to the existing
English Practice collection. The lessons provide practical language for common
situations while reinforcing grammar through meaningful examples.

## Scope

Add the following lessons to `data/english-practice.json`:

1. Daily Routines and Frequency
2. Plans and Arrangements
3. Making Polite Requests
4. Giving Opinions and Reasons
5. Comparing Choices
6. Talking About Experience
7. Telling a Short Past Story
8. Giving Advice
9. Shopping and Quantities
10. Describing Places and Directions
11. Study and Work Communication
12. Solving Everyday Problems

Existing lessons, all existing lesson IDs, the collection model, and progress
storage remain unchanged.

## Lesson Format

Each new lesson contains a situation-focused title, a concise plain-language
use note, and several original model sentences in a coherent everyday context.
Vocabulary and sentence length target A2-B1 learners. New stable IDs continue
the English sequence from `eng_038` through `eng_049`.

## Evidence-Informed Principles

This is evidence-informed instructional content, not a claim of a
scientifically validated curriculum. It follows widely used
second-language-learning principles:

- meaningful communicative context instead of isolated word lists;
- comprehensible A2-B1 input;
- focused attention on one main language feature per lesson;
- meaningful repetition of target language across varied examples;
- high-frequency functional language for everyday communication.

The approach is consistent with the CEFR action-oriented approach and
communicative language teaching. Typing is a supplementary practice activity;
it does not by itself establish language mastery.

## Data and Progress Compatibility

All new lessons use unique IDs. Existing lesson text and IDs are unchanged.
Because saved progress and completions are keyed by lesson ID, current saved
sessions, refresh restoration, and completed lessons remain compatible.

## Validation

Tests verify that all twelve IDs exist, English lesson IDs remain unique, and
the new lessons meet the collection's basic content expectations. The full
test suite and production build run after the data update.
