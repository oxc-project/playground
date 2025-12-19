import { computed, ref } from "vue";

// Global viz instance - loaded lazily
let vizInstance: any = null;
const isLoading = ref(false);
const isLoaded = ref(false);
const loadError = ref<string | null>(null);

export async function createVizInstance() {
  if (vizInstance) return vizInstance;

  if (isLoading.value) {
    // Wait for existing load to complete
    return new Promise((resolve, reject) => {
      const checkLoaded = () => {
        if (vizInstance) {
          resolve(vizInstance);
        } else if (loadError.value) {
          reject(new Error(loadError.value));
        } else {
          setTimeout(checkLoaded, 10);
        }
      };
      checkLoaded();
    });
  }

  isLoading.value = true;
  loadError.value = null;

  try {
    const { instance } = await import("@viz-js/viz");
    vizInstance = await instance();
    isLoaded.value = true;
    return vizInstance;
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Failed to load visualization library";
    loadError.value = errorMessage;
    console.warn("Failed to load @viz-js/viz:", error);
    throw new Error(errorMessage);
  } finally {
    isLoading.value = false;
  }
}

// Export reactive state for components
export const vizLoading = computed(() => isLoading.value);
export const vizLoaded = computed(() => isLoaded.value);
export const vizError = computed(() => loadError.value);

// Utility function to render SVG with error handling
export async function renderSVG(dotSource: string): Promise<SVGElement | null> {
  try {
    const viz = await createVizInstance();
    return viz.renderSVGElement(dotSource);
  } catch (error) {
    console.warn("Failed to render graph:", error);
    return null;
  }
}
