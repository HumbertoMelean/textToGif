import { utils } from "./utils.js";

class Reader {
  constructor(settings) {
    this.settings = settings;
    this.wordInterval = null;
    this.isPaused = true;
    this.currentIndex = 0;
    this.words = [];
    this.completionCallback = null;

    this.elements = {
      inputText: document.getElementById("inputText"),
      output: document.getElementById("output"),
      controlButton: document.getElementById("controlButton"),
    };
  }

  onComplete(callback) {
    this.completionCallback = callback;
  }

  toggleReading() {
    if (this.isPaused) {
      this.startReading();
    } else {
      this.pauseReading();
    }
  }

  startReading() {
    const text = this.elements.inputText.value.trim();
    if (!text) return;

    if (this.currentIndex === 0) {
      this.words = text.split(/\s+/).filter((word) => word.length > 0);
    }

    this.isPaused = false;
    this.elements.controlButton.textContent = "Pause";
    this.elements.controlButton.classList.add("active");

    const interval = Math.floor(60000 / this.settings.getReadingSpeed());
    this.wordInterval = setInterval(() => this.displayNextWord(), interval);
  }

  pauseReading() {
    clearInterval(this.wordInterval);
    this.isPaused = true;
    this.elements.controlButton.textContent = "Start Reading";
    this.elements.controlButton.classList.remove("active");
  }

  displayNextWord() {
    if (this.currentIndex >= this.words.length) {
      this.currentIndex = 0;
      this.pauseReading();
      if (this.completionCallback) {
        this.completionCallback();
      }
      return;
    }

    this.elements.output.textContent = this.words[this.currentIndex];
    this.currentIndex++;
  }

  resetAndStart() {
    this.currentIndex = 0;
    if (this.wordInterval) {
      clearInterval(this.wordInterval);
    }
    this.startReading();
  }
}

export { Reader };
