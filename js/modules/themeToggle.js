export class ThemeToggle {
  constructor(themeManager) {
    this.themeManager = themeManager;
    this.checkbox = document.getElementById("checkbox");
    this.initialize();
  }

  initialize() {
    // Set initial state
    this.checkbox.checked = this.themeManager.getTheme() === "dark";

    // Add event listener
    this.checkbox.addEventListener("change", () => {
      const newTheme = this.checkbox.checked ? "dark" : "light";
      this.themeManager.setTheme(newTheme);
    });
  }
}
