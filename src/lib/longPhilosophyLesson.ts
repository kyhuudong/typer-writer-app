export function buildLongPhilosophyLesson() {
  const sentences = [
    "Philosophy begins when a person stops treating the world as a set of answers and starts noticing the shape of each question, the pressure behind each assumption, and the small distance between what is seen and what is understood.",
    "A careful thinker does not rush toward certainty, because certainty can be useful without being truthful, and truth can be patient without being loud, which is why attention matters more than opinion in the long weather of thought.",
    "When we pause long enough to examine our first reaction, we often find not a solid conclusion but a habit, a memory, a borrowed phrase, or a defense that arrived before the mind had time to ask for evidence.",
    "The habit of reflection teaches that clarity is rarely dramatic; it grows instead through repetition, revision, and a willingness to sit with discomfort until the discomfort reveals what was being hidden by speed.",
    "Language itself is a kind of philosophy in motion, because every word carries a history of use, a trail of intention, and a border where meaning begins to blur into tone, context, and the expectations of other minds.",
    "To speak carefully is to admit that the same sentence can encourage, mislead, soften, harden, clarify, or conceal, depending on who hears it, when they hear it, and what they bring with them into the moment.",
    "Ethics enters the room whenever a person asks not only what is true, but what should be done, and that second question is often harder because it asks us to measure our choices against people rather than abstractions.",
    "The more closely we look at a belief, the more likely we are to discover its seams, its shortcuts, and the quiet bargain it made with fear, convenience, family, ambition, or the wish to belong."
  ];

  // Each block is sentences joined by newlines so every sentence gets its own line.
  // Blocks are separated by a blank line for paragraph rhythm.
  const block = sentences.join("\n");
  return Array.from({ length: 12 }, () => block).join("\n\n");
}
