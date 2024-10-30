export class OutputManager {
  constructor() {
    this.inputText = document.getElementById("inputText");
    this.output = document.getElementById("output");

    if (!this.inputText || !this.output) {
      console.error("OutputManager: Required elements not found");
      return;
    }

    // Bind event listener
    this.inputText.addEventListener("input", () => this.updateOutput());

    // Initial update
    this.updateOutput();
  }

  updateOutput() {
    if (!this.inputText || !this.output) return;

    const text = this.inputText.value.trim();
    if (!text) {
      this.output.textContent = "Words will appear here";
      return;
    }

    // Get the first word only
    const firstWord = text.split(/\s+/)[0];

    // Display only the first word in the output box
    this.output.textContent = firstWord;
  }
}
