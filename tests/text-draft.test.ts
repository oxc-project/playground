import assert from "node:assert/strict";
import { test } from "node:test";
import { effectScope, ref } from "vue";
import { useTextDraft } from "../src/composables/text-draft.ts";

test("normalized JSON echoes preserve partial drafts, whitespace, and undo text", () => {
  const scope = effectScope();
  try {
    scope.run(() => {
      const config = ref({ semi: true, tabWidth: 2 });
      const draft = useTextDraft(
        () => JSON.stringify(config.value, null, 2),
        (text) => {
          try {
            config.value = { ...config.value, ...JSON.parse(text) };
          } catch {
            // Invalid drafts keep the last valid compiler configuration.
          }
        },
      );
      const initial = draft.value;
      draft.value = '{ "semi": false }';
      assert.equal(draft.value, '{ "semi": false }');
      assert.deepEqual(config.value, { semi: false, tabWidth: 2 });
      draft.value = '{ "semi": fal';
      assert.equal(draft.value, '{ "semi": fal');
      assert.equal(config.value.semi, false);
      draft.value = initial;
      assert.equal(draft.value, initial);
      assert.equal(config.value.semi, true);
      config.value.tabWidth = 4;
      assert.equal(draft.value, JSON.stringify(config.value, null, 2));
    });
  } finally {
    scope.stop();
  }
});

test("a throwing setter does not suppress subsequent external updates", () => {
  const scope = effectScope();
  try {
    scope.run(() => {
      const value = ref("initial");
      const draft = useTextDraft(
        () => value.value,
        () => {
          throw new Error("invalid");
        },
      );
      assert.throws(() => {
        draft.value = "invalid";
      }, /invalid/);
      value.value = "external";
      assert.equal(draft.value, "external");
    });
  } finally {
    scope.stop();
  }
});
