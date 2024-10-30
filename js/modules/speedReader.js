export class SpeedReader {
  constructor(settings) {
    this.settings = settings;
    this.inputText = document.getElementById("inputText");
    this.output = document.getElementById("output");
    this.startButton = document.getElementById("startReading");
    this.recordButton = document.getElementById("startRecording");
    this.isReading = false;
    this.isRecording = false;
    this.currentWordIndex = 0;
    this.words = [];
    this.gif = null;
    this.isRendering = false;
    this.frames = [];
  }

  startReading() {
    if (!this.inputText.value.trim()) {
      alert("Please enter some text first");
      return;
    }

    this.isReading = !this.isReading;
    if (this.isReading) {
      this.words = this.inputText.value.trim().split(/\s+/);
      this.currentWordIndex = 0;
      this.readWords();
      this.startButton.textContent = "Stop Reading";
    } else {
      this.startButton.textContent = "Start Reading";
    }
  }

  readWords() {
    if (!this.isReading || this.currentWordIndex >= this.words.length) {
      this.isReading = false;
      this.startButton.textContent = "Start Reading";
      return;
    }

    this.output.textContent = this.words[this.currentWordIndex];
    this.currentWordIndex++;

    setTimeout(() => this.readWords(), 60000 / this.settings.getWpm());
  }

  toggleRecording() {
    if (this.isRecording) {
      this.stopRecording();
    } else {
      this.startRecording();
    }
  }

  startRecording() {
    if (!this.inputText.value.trim()) {
      alert("Please enter some text first");
      return;
    }

    const gifSettings = this.settings.getGifSettings();

    // Initialize GIF with new settings
    this.gif = new GIF({
      workers: 4,
      quality: 10,
      width: gifSettings.width,
      height: gifSettings.height,
      workerScript: "js/gif.worker.js",
      repeat: gifSettings.loop ? 0 : -1, // 0 for infinite loop, -1 for no loop
    });

    this.frames = [];
    this.isRecording = true;
    this.recordButton.textContent = "Stop Recording";
    this.recordButton.classList.add("recording");

    // Start recording frames
    this.words = this.inputText.value.trim().split(/\s+/);
    this.currentWordIndex = 0;
    this.captureFrame();
  }

  captureFrame() {
    if (!this.isRecording || this.currentWordIndex >= this.words.length) {
      if (this.isRecording) {
        this.stopRecording();
      }
      return;
    }

    // Display current word
    this.output.textContent = this.words[this.currentWordIndex];

    // Get GIF dimensions from settings
    const gifSettings = this.settings.getGifSettings();

    // Create frame
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = gifSettings.width;
    canvas.height = gifSettings.height;

    // Set background
    ctx.fillStyle =
      window.getComputedStyle(this.output).backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    const computedStyle = window.getComputedStyle(this.output);
    const fontSize = parseInt(computedStyle.fontSize); // Get base font size

    // Scale font size based on GIF dimensions
    const scaleFactor = Math.min(
      gifSettings.width / this.output.offsetWidth,
      gifSettings.height / this.output.offsetHeight
    );
    const adjustedFontSize = Math.floor(fontSize * scaleFactor);

    // Set font with adjusted size
    ctx.font = `${computedStyle.fontWeight} ${adjustedFontSize}px ${computedStyle.fontFamily}`;
    ctx.fillStyle = computedStyle.color || "#000000";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";

    // Calculate text metrics for vertical centering
    const text = this.words[this.currentWordIndex];
    const textMetrics = ctx.measureText(text);
    const textHeight =
      textMetrics.actualBoundingBoxAscent +
      textMetrics.actualBoundingBoxDescent;

    // Draw text in the exact center
    ctx.fillText(
      text,
      canvas.width / 2, // Horizontal center
      canvas.height / 2 + textHeight / 4 // Vertical center with adjustment
    );

    // Store frame
    this.frames.push({
      imageData: ctx.getImageData(0, 0, canvas.width, canvas.height),
      delay: 60000 / this.settings.getWpm(),
    });

    // Move to next word
    this.currentWordIndex++;

    // Schedule next frame
    setTimeout(() => this.captureFrame(), 60000 / this.settings.getWpm());
  }

  stopRecording() {
    if (!this.isRecording || this.isRendering) return;

    this.isRecording = false;
    this.isRendering = true;
    this.recordButton.textContent = "Processing 0%";

    const gifSettings = this.settings.getGifSettings();

    // Create a single canvas for all frames
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = gifSettings.width;
    canvas.height = gifSettings.height;

    console.log("Adding frames to GIF:", this.frames.length);

    // Add frames to GIF
    this.frames.forEach((frame, index) => {
      ctx.putImageData(frame.imageData, 0, 0);
      this.gif.addFrame(canvas, {
        delay: frame.delay,
        copy: true,
      });
    });

    // Set up event handlers
    this.gif.on("progress", (p) => {
      const percent = Math.round(p * 100);
      console.log("Processing:", percent + "%");
      this.recordButton.textContent = `Processing ${percent}%`;
    });

    this.gif.on("finished", (blob) => {
      console.log("Finished processing GIF");

      // Create and trigger download
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "speed-reading.gif";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      // Reset state
      this.gif = null;
      this.frames = [];
      this.isRendering = false;
      this.recordButton.textContent = "Start Recording";
      this.recordButton.classList.remove("recording");
    });

    // Start rendering
    console.log("Starting render...");
    requestAnimationFrame(() => {
      try {
        this.gif.render();
      } catch (error) {
        console.error("Render error:", error);
        this.recordButton.textContent = "Start Recording";
        this.isRendering = false;
        this.frames = [];
        this.gif = null;
      }
    });
  }
}
