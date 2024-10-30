export class WordCounter {
  constructor() {
    // Get elements
    this.inputText = document.getElementById("inputText");
    this.output = document.getElementById("output");

    if (!this.inputText || !this.output) {
      console.error("WordCounter: Required elements not found");
      return;
    }

    // Bind the event listener
    this.inputText.addEventListener("input", () => {
      this.updateOutput();
    });

    // Initial update
    this.updateOutput();
  }

  updateOutput() {
    if (!this.inputText || !this.output) return;

    const text = this.inputText.value;
    if (!text.trim()) {
      this.output.textContent = "Words will appear here";
      return;
    }

    // Display the text in the output box
    this.output.textContent = text;
  }
}
