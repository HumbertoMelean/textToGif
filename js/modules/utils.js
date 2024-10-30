export const utils = {
  getIntervalFromWPM(wpm) {
    return Math.floor(60000 / wpm);
  },

  formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  },

  // Add any other utility functions you have
};
