import { ThemeManager } from "./modules/themeManager.js";
import { ThemeToggle } from "./modules/themeToggle.js";
import { Settings } from "./modules/settings.js";
import { SpeedReader } from "./modules/speedReader.js";

// Initialize theme management
const themeManager = new ThemeManager();
const themeToggle = new ThemeToggle(themeManager);

// Initialize settings and speed reader
const settings = new Settings();
const speedReader = new SpeedReader(settings);

// Add event listeners
document.getElementById("startReading").addEventListener("click", () => {
  speedReader.startReading();
});

document.getElementById("startRecording").addEventListener("click", () => {
  speedReader.toggleRecording();
});

// Word count functionality
const inputText = document.getElementById("inputText");
const wordCount = document.querySelector(".word-count");

inputText.addEventListener("input", () => {
  const text = inputText.value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  wordCount.textContent = `${words} word${words === 1 ? "" : "s"}`;
});
