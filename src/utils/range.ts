import { editorCursor } from "~/composables/state";

export type Range = [start: number, end: number];

export function getRange(node: unknown): [number, number] | undefined {
  if (node && typeof node === "object" && "start" in node && "end" in node) {
    return [node.start as number, node.end as number];
  }
}

export function checkRange(range?: Range) {
  if (!range) return false;
  return range[0] <= editorCursor.value && range[1] > editorCursor.value;
}
