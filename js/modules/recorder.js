export class Recorder {
  constructor(settings) {
    this.settings = settings;
    this.isRecording = false;
    this.frames = [];
    this.reader = null; // Will store reference to Reader

    this.elements = {
      recordButton: document.getElementById("recordButton"),
      recordingIndicator: document.getElementById("recordingIndicator"),
      output: document.getElementById("output"),
      loopGif: document.getElementById("loopGif"),
    };

    this.initGif();
  }

  initGif() {
    this.gif = new GIF({
      workers: 2,
      quality: 10,
      width: 600,
      height: 200,
      workerScript: "js/gif.worker.js",
      repeat: this.elements.loopGif?.checked ? 0 : -1,
    });

    this.gif.on("finished", (blob) => {
      const downloadLink = document.createElement("a");
      downloadLink.href = URL.createObjectURL(blob);
      downloadLink.download = "speed-reading.gif";

      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      URL.revokeObjectURL(downloadLink.href);
      this.frames = [];
      this.gif = null;
      this.initGif();
    });
  }

  setReader(reader) {
    this.reader = reader;
  }

  toggleRecording() {
    console.log("Toggle recording called, current state:", this.isRecording);
    if (!this.isRecording) {
      this.startRecording();
    } else {
      this.stopRecording();
    }
  }

  startRecording() {
    console.log("Starting recording");
    if (!this.reader) {
      console.error("Reader not initialized");
      return;
    }

    this.isRecording = true;
    this.frames = [];
    this.elements.recordButton.textContent = "Recording...";
    this.elements.recordButton.classList.add("recording");
    if (this.elements.recordingIndicator) {
      this.elements.recordingIndicator.style.display = "block";
    }

    setTimeout(() => {
      this.reader.resetAndStart();
      this.captureFrame();
    }, 100);

    this.reader.onComplete(() => {
      if (this.isRecording) {
        this.stopRecording();
      }
    });
  }

  stopRecording() {
    console.log("Stopping recording");
    this.isRecording = false;
    this.elements.recordButton.textContent = "Start Recording";
    this.elements.recordButton.classList.remove("recording");
    if (this.elements.recordingIndicator) {
      this.elements.recordingIndicator.style.display = "none";
    }

    if (this.frames.length > 0) {
      this.createGif();
    }

    if (this.reader) {
      this.reader.pauseReading();
    }
  }

  captureFrame() {
    if (!this.isRecording) return;

    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const output = this.elements.output;

    canvas.width = 600;
    canvas.height = 200;

    ctx.fillStyle = getComputedStyle(output).backgroundColor || "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const text = output.textContent || "";
    if (text.trim()) {
      ctx.fillStyle = getComputedStyle(output).color || "#000000";
      ctx.font = `${output.style.fontWeight || "400"} ${
        output.style.fontSize || "32px"
      } Arial`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2);
    }

    const image = new Image();
    image.onload = () => {
      this.frames.push(image);
    };
    image.src = canvas.toDataURL();

    const wpm = this.settings.getReadingSpeed();
    const msPerWord = 60000 / wpm;
    setTimeout(() => this.captureFrame(), msPerWord);
  }

  createGif() {
    console.log("Creating GIF from", this.frames.length, "frames");
    this.gif.options.repeat = this.elements.loopGif?.checked ? 0 : -1;

    const wpm = this.settings.getReadingSpeed();
    const msPerWord = 60000 / wpm;

    this.frames.forEach((frame) => {
      this.gif.addFrame(frame, { delay: msPerWord });
    });

    this.gif.render();
  }
}
