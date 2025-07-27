// config.js

module.exports = {
  /**
   * If true: each destination will be opened in a NEW browser window (instance).
   * If false (default): new destinations are opened as additional tabs in the
   * existing window.
   */
  newBrowserInstancesForLocations: false,

  /**
   * Delay in milliseconds applied both between tabs (stay lengths) and between
   * different destination launches.
   */
  delayBetweenLaunchesMs: 10000,
};
