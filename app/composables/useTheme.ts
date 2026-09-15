export type Theme = "light" | "dark" | "system";

export const THEME_STORAGE_KEY = "theme";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark" || value === "system";
}

export function themeIsDark(theme: Theme, systemDark: boolean) {
  return theme === "dark" || (theme === "system" && systemDark);
}

export function applyThemeClass(theme: Theme) {
  if (typeof document === "undefined") return;
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.classList.toggle(
    "dark",
    themeIsDark(theme, systemDark),
  );
}

function readStoredTheme(): Theme {
  if (typeof window === "undefined") return "system";
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  return isTheme(stored) ? stored : "system";
}

export function useTheme() {
  const theme = useState<Theme>("theme", () => "system");

  function setTheme(next: Theme) {
    theme.value = next;
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME_STORAGE_KEY, next);
      applyThemeClass(next);
    }
  }

  return { theme, setTheme };
}

export function initThemeClient() {
  const theme = useState<Theme>("theme", () => "system");
  theme.value = readStoredTheme();
  applyThemeClass(theme.value);

  const media = window.matchMedia("(prefers-color-scheme: dark)");
  const onChange = () => applyThemeClass(theme.value);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}
