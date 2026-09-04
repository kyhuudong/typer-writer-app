import type { LessonCollection } from "../types/lesson";

type CollectionPickerProps = {
  collections: LessonCollection[];
  selectedCollectionId: string;
  onSelectCollection: (collectionId: string) => void;
};

export function CollectionPicker({
  collections,
  selectedCollectionId,
  onSelectCollection
}: CollectionPickerProps) {
  return (
    <div className="space-y-1">
      {collections.map((collection) => {
        const isSelected = collection.id === selectedCollectionId;
        const lessonCount = collection.lessons.length;
        return (
          <button
            key={collection.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelectCollection(collection.id)}
            className={`w-full rounded-xl px-3 py-2.5 text-left transition ${
              isSelected
                ? "bg-fuchsia-500/15 text-zinc-100"
                : "text-zinc-400 hover:bg-white/5 hover:text-zinc-200"
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium">{collection.title}</span>
              <span className="shrink-0 text-[10px] uppercase tracking-[0.16em] text-zinc-500">
                {lessonCount} {lessonCount === 1 ? "lesson" : "lessons"}
              </span>
            </div>
            <p className="mt-0.5 text-xs leading-5 text-zinc-500">
              {collection.description}
            </p>
          </button>
        );
      })}
    </div>
  );
}
