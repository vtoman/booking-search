const BookingLauncher = require("./BookingLauncher");
const locations = require("./locations");
const config = require("./config");
// Default filters used in index.js example
const defaultFilters = [
  "oos=1", // only show available
  "roomfacility=38", // private bathroom
  "roomfacility=11", // air conditioning
];

const locationSelect = document.getElementById("locationSelect");
const daysSelect = document.getElementById("daysSelect");
const checkinInput = document.getElementById("checkinInput");

// Load saved check-in date or default to tomorrow
const savedDate = localStorage.getItem("checkinDate");
if (savedDate) {
  checkinInput.value = savedDate;
} else {
  const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);
  checkinInput.value = tomorrow;
}

// Persist date on change
checkinInput.addEventListener("change", () => {
  localStorage.setItem("checkinDate", checkinInput.value);
});
const delayInput = document.getElementById("delayInput");
const launchButton = document.getElementById("launchButton");
const themeBtn = document.getElementById("themeBtn");

// Theme toggle logic
const themeClasses = [
  "theme-light",
  "theme-dark",
  "theme-darker",
  "theme-blue",
  "theme-green",
  "theme-yellow",
];

// Load saved theme or default to first
let savedTheme = localStorage.getItem("selectedTheme");
let themeIndex = savedTheme ? themeClasses.indexOf(savedTheme) : 0;
if (themeIndex === -1) themeIndex = 0; // fallback if unknown

themeBtn.addEventListener("click", () => {
  themeIndex = (themeIndex + 1) % themeClasses.length;
  const current = themeClasses[themeIndex];
  document.body.className = current;
  localStorage.setItem("selectedTheme", current);
});

// Populate location dropdown
locations.forEach((loc, idx) => {
  const option = document.createElement("option");
  option.value = loc;
  option.textContent = loc;
  if (idx === 0) option.selected = true;
  locationSelect.appendChild(option);
});

// Populate days dropdown
for (let i = 1; i <= 6; i++) {
  const option = document.createElement("option");
  option.value = i;
  option.textContent = i.toString();
  if (i === 1) option.selected = true;
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
  // Save chosen date for next session
  localStorage.setItem("checkinDate", checkin);
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
      filters: defaultFilters,
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
