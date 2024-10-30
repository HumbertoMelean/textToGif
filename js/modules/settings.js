export class Settings {
  constructor() {
    // Font settings elements
    this.fontSizeInput = document.getElementById("fontSize");
    this.fontSizeDisplay = this.fontSizeInput?.nextElementSibling;
    this.fontWeightInput = document.getElementById("fontWeight");
    this.fontWeightDisplay = this.fontWeightInput?.nextElementSibling;

    // Color settings elements
    this.textColorInput = document.getElementById("outputTextColor");
    this.bgColorInput = document.getElementById("outputBgColor");

    // WPM settings
    this.wpmInput = document.getElementById("wpm");
    this.wpmDisplay = this.wpmInput?.nextElementSibling;

    // Output and word count elements
    this.output = document.getElementById("output");
    this.inputText = document.getElementById("inputText");
    this.wordCountDisplay = document.querySelector(".word-count");

    // GIF settings elements
    this.gifLoopInput = document.getElementById("gifLoop");
    this.gifWidthInput = document.getElementById("gifWidth");
    this.gifHeightInput = document.getElementById("gifHeight");

    // Initialize settings
    this.initializeSettings();
    this.initializeWordCount();
  }

  initializeSettings() {
    // Font size initialization
    if (this.fontSizeInput) {
      this.fontSizeInput.value = localStorage.getItem("fontSize") || "40";
      this.updateFontSize();
      this.fontSizeInput.addEventListener("input", () => this.updateFontSize());
    }

    // Font weight initialization
    if (this.fontWeightInput) {
      this.fontWeightInput.value = localStorage.getItem("fontWeight") || "400";
      this.updateFontWeight();
      this.fontWeightInput.addEventListener("input", () =>
        this.updateFontWeight()
      );
    }

    // Text color initialization
    if (this.textColorInput) {
      this.textColorInput.value =
        localStorage.getItem("outputTextColor") || "#000000";
      this.updateTextColor();
      this.textColorInput.addEventListener("input", () =>
        this.updateTextColor()
      );
    }

    // Background color initialization
    if (this.bgColorInput) {
      this.bgColorInput.value =
        localStorage.getItem("outputBgColor") || "#ffffff";
      this.updateBgColor();
      this.bgColorInput.addEventListener("input", () => this.updateBgColor());
    }

    // WPM initialization
    if (this.wpmInput) {
      this.wpmInput.value = localStorage.getItem("wpm") || "300";
      this.updateWpm();
      this.wpmInput.addEventListener("input", () => this.updateWpm());
    }

    // GIF settings initialization
    if (this.gifLoopInput) {
      this.gifLoopInput.checked = localStorage.getItem("gifLoop") !== "false";
    }

    if (this.gifWidthInput) {
      this.gifWidthInput.value = localStorage.getItem("gifWidth") || "200";
      this.gifWidthInput.addEventListener("change", () =>
        this.updateGifDimensions()
      );
    }

    if (this.gifHeightInput) {
      this.gifHeightInput.value = localStorage.getItem("gifHeight") || "75";
      this.gifHeightInput.addEventListener("change", () =>
        this.updateGifDimensions()
      );
    }

    // Initial update of output dimensions
    this.updateGifDimensions();
  }

  updateFontSize() {
    if (!this.output || !this.fontSizeInput) return;
    const size = this.fontSizeInput.value;
    this.output.style.fontSize = `${size}px`;
    localStorage.setItem("fontSize", size);
    if (this.fontSizeDisplay) {
      this.fontSizeDisplay.textContent = `${size}px`;
    }
  }

  updateFontWeight() {
    if (!this.output || !this.fontWeightInput) return;
    const weight = this.fontWeightInput.value;
    this.output.style.fontWeight = weight;
    localStorage.setItem("fontWeight", weight);
    if (this.fontWeightDisplay) {
      this.fontWeightDisplay.textContent = weight;
    }
  }

  updateTextColor() {
    if (!this.output || !this.textColorInput) return;
    const color = this.textColorInput.value;
    this.output.style.color = color;
    localStorage.setItem("outputTextColor", color);
  }

  updateBgColor() {
    if (!this.output || !this.bgColorInput) return;
    const color = this.bgColorInput.value;
    this.output.style.backgroundColor = color;
    localStorage.setItem("outputBgColor", color);
  }

  updateWpm() {
    if (!this.wpmInput) return;
    const wpm = this.wpmInput.value;
    localStorage.setItem("wpm", wpm);
    if (this.wpmDisplay) {
      this.wpmDisplay.textContent = `${wpm} WPM`;
    }
  }

  getWpm() {
    return parseInt(this.wpmInput?.value || "300", 10);
  }

  initializeWordCount() {
    if (this.inputText && this.wordCountDisplay) {
      this.updateWordCount();
      this.inputText.addEventListener("input", () => this.updateWordCount());
    }
  }

  updateWordCount() {
    if (!this.inputText || !this.wordCountDisplay) return;
    const text = this.inputText.value.trim();
    const wordCount = text
      ? text.split(/\s+/).filter((word) => word.length > 0).length
      : 0;
    this.wordCountDisplay.textContent = `${wordCount} words`;
  }

  getSettings() {
    return {
      fontSize: this.fontSizeInput?.value || "40",
      fontWeight: this.fontWeightInput?.value || "400",
      textColor: this.textColorInput?.value || "#000000",
      bgColor: this.bgColorInput?.value || "#ffffff",
      wpm: this.getWpm(),
    };
  }

  updateGifDimensions() {
    if (!this.gifWidthInput || !this.gifHeightInput || !this.output) return;

    const width = this.gifWidthInput.value;
    const height = this.gifHeightInput.value;

    // Store values
    localStorage.setItem("gifWidth", width);
    localStorage.setItem("gifHeight", height);

    // Update output box style
    this.output.style.aspectRatio = `${width}/${height}`;

    // Calculate font size based on dimensions
    const minDimension = Math.min(width, height);
    const fontSize = Math.max(minDimension * 0.15, 16); // 15% of min dimension, minimum 16px
    this.output.style.fontSize = `${fontSize}px`;

    // Force output box to maintain aspect ratio while fitting container
    this.output.style.width = "100%";
    this.output.style.height = "auto";
    this.output.style.maxHeight = "50vh"; // Prevent it from getting too tall
  }

  getGifSettings() {
    return {
      loop: this.gifLoopInput ? this.gifLoopInput.checked : true,
      width: parseInt(this.gifWidthInput?.value || "200", 10),
      height: parseInt(this.gifHeightInput?.value || "75", 10),
    };
  }
}
