// index.js

const BookingLauncher = require("./BookingLauncher");
const appConfig = require("./config");

const favoriteDestinations = require("./locations");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Example configuration ----------------------------------------------------
const launcher = new BookingLauncher({
  //destination: "Neos Marmaras, Macedonia, Greece",
  checkin: "2025-08-03",
  stayLengths: [3, 6],
  adults: 1,
  rooms: 1,
  filters: [
    "oos=1", // only show available
    "roomfacility=38", // private bathroom
    "roomfacility=11", // air conditioning
  ],
  order: "price",
  delayMs: appConfig.delayBetweenLaunchesMs,
  newBrowserInstancesForLocations: appConfig.newBrowserInstancesForLocations,
});

(async () => {
  for (const destination of favoriteDestinations) {
    await launcher.updateConfig({ destination }).launch();

    // Do not sleep for the last destination
    if (destination !== favoriteDestinations[favoriteDestinations.length - 1]) {
      await sleep(appConfig.delayBetweenLaunchesMs);
    }
  }
})();
