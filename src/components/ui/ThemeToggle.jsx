import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

const STORAGE_KEY = "oma-theme";

export default function ThemeToggle({ className = "" }) {
  const [theme, setTheme] = useState(() =>
    window.localStorage.getItem(STORAGE_KEY) === "light" ? "light" : "dark"
  );
  const nextTheme = theme === "dark" ? "light" : "dark";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]')?.setAttribute(
      "content",
      theme === "light" ? "#ffffff" : "#090909"
    );
    const syncTheme = (event) => setTheme(event.detail);
    window.addEventListener("oma-theme-change", syncTheme);
    return () => window.removeEventListener("oma-theme-change", syncTheme);
  }, [theme]);

  const toggleTheme = () => {
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
    document.documentElement.dataset.theme = nextTheme;
    window.dispatchEvent(new CustomEvent("oma-theme-change", { detail: nextTheme }));
    setTheme(nextTheme);
  };

  return (
    <button
      className={`theme-toggle ${className}`.trim()}
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} theme`}
      aria-pressed={theme === "light"}
      title={`Switch to ${nextTheme} theme`}
    >
      {theme === "dark" ? <Sun size={17} aria-hidden="true" /> : <Moon size={17} aria-hidden="true" />}
      <span>{theme === "dark" ? "Light mode" : "Dark mode"}</span>
    </button>
  );
}
