export class ThemeManager {
  constructor() {
    this.theme = localStorage.getItem("theme") || "light";
    document.body.setAttribute("data-theme", this.theme);
  }

  setTheme(theme) {
    this.theme = theme;
    document.body.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  getTheme() {
    return this.theme;
  }
}
