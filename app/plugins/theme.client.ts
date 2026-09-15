export default defineNuxtPlugin(() => {
  if (!import.meta.client) return;
  const cleanup = initThemeClient();
  if (import.meta.hot) {
    import.meta.hot.dispose(() => cleanup?.());
  }
});
