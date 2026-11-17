import { computed, ref, watch } from "vue";

// Keep the user's text and undo history when a setter normalizes its own edit.
// Changes from other controls still replace the draft with the current value.
export function useTextDraft(read: () => string, write: (value: string) => void) {
  const draft = ref(read());
  let writing = false;
  watch(
    read,
    (value) => {
      if (!writing) draft.value = value;
    },
    { flush: "sync" },
  );
  return computed({
    get: () => draft.value,
    set: (value: string) => {
      draft.value = value;
      writing = true;
      try {
        write(value);
      } finally {
        writing = false;
      }
    },
  });
}
