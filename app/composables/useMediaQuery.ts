/**
 * Client-only media query match. Starts false on SSR / before mount so
 * server HTML and hydration stay aligned; updates after mount.
 */
export function useMediaQuery(query: string) {
  const matches = ref(false);

  onMounted(() => {
    const media = window.matchMedia(query);
    matches.value = media.matches;

    const onChange = (event: MediaQueryListEvent) => {
      matches.value = event.matches;
    };
    media.addEventListener("change", onChange);
    onUnmounted(() => media.removeEventListener("change", onChange));
  });

  return matches;
}
