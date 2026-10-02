// Pure helpers for the timeline scrubber. Kept free of React/DOM so they can be unit-tested.
export interface HasYear {
  left_behind: number;
}

export function yearBounds(items: HasYear[]): { min: number; max: number } | null {
  if (items.length === 0) return null;
  let min = Infinity;
  let max = -Infinity;
  for (const it of items) {
    if (it.left_behind < min) min = it.left_behind;
    if (it.left_behind > max) max = it.left_behind;
  }
  return { min, max };
}

/** Objects left behind in or before `year`. A null year means "show everything". */
export function filterByYear<T extends HasYear>(items: T[], year: number | null): T[] {
  return year === null ? items.slice() : items.filter((it) => it.left_behind <= year);
}

export function sortByYear<T extends HasYear & { name: string }>(items: T[]): T[] {
  return items.slice().sort((a, b) => a.left_behind - b.left_behind || a.name.localeCompare(b.name));
}
