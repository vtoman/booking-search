const BookingLauncher = require("./BookingLauncher");
const locations = require("./locations");
const config = require("./config");

const locationSelect = document.getElementById("locationSelect");
const daysSelect = document.getElementById("daysSelect");
const checkinInput = document.getElementById("checkinInput");
const delayInput = document.getElementById("delayInput");
const launchButton = document.getElementById("launchButton");

// Populate location dropdown
locations.forEach((loc) => {
  const option = document.createElement("option");
  option.value = loc;
  option.textContent = loc;
  locationSelect.appendChild(option);
});

// Populate days dropdown (1-7)
for (let i = 1; i <= 7; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i.toString();
  daysSelect.appendChild(option);
}

// Launch button handler
launchButton.addEventListener("click", async () => {
  const destinations = Array.from(locationSelect.selectedOptions).map(
    (o) => o.value
  );
  const stayLengths = Array.from(daysSelect.selectedOptions).map((o) =>
    parseInt(o.value, 10)
  );

  if (!destinations.length || !stayLengths.length) {
    alert("Please choose at least one destination and one stay length.");
    return;
  }

  const checkin = checkinInput.value || new Date().toISOString().slice(0, 10);
  const delayMs =
    parseInt(delayInput.value, 10) || config.delayBetweenLaunchesMs;

  for (let i = 0; i < destinations.length; i++) {
    const destination = destinations[i];
    const launcher = new BookingLauncher({
      destination,
      checkin,
      stayLengths,
      adults: 1,
      rooms: 1,
      delayMs,
      newBrowserInstancesForLocations: config.newBrowserInstancesForLocations,
    });

    try {
      await launcher.launch();
    } catch (err) {
      console.error(err);
      alert("Failed to launch search for " + destination + ": " + err.message);
    }

    if (i < destinations.length - 1) {
      // Wait before launching next destination
      await BookingLauncher.sleep(delayMs);
    }
  }
});
