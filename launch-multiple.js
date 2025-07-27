const { execSync } = require("child_process");

// ------- Base query configuration ------------------------------------------
const BASE_URL = "https://www.booking.com/searchresults.html";
const baseParams = {
  // ss: "Olympic Beach", // Previous destination
  // ss: "Leptokaria, Macedonia, Greece", // Destination
  //ss: "Sarti, Macedonia, Greece", // Destination
  ss: "Neos Marmaras, Macedonia, Greece", // Destination
  checkin: "2025-08-06", // Arrival date (YYYY-MM-DD)
  group_adults: 1,
  no_rooms: 1,
  group_children: 0,
  // Filters: only available (oos=1), private bathroom (roomfacility=38), air conditioning (roomfacility=11)
  nflt: "oos=1;roomfacility=38;roomfacility=11",
  order: "price", // Sort results by price
};

// Define the different stay lengths you want to open (in nights)
const stayLengths = [1, 2, 3, 4]; // 1-night, 2-night, 3-night stays

// Utility to add days to YYYY-MM-DD and return the same format
function addDays(dateStr, days) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

// ------- Launch each query --------------------------------------------------
// Simple sleep utility (ms)
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

(async () => {
  for (const nights of stayLengths) {
    const params = {
      ...baseParams,
      checkout: addDays(baseParams.checkin, nights), // check-out based on length
    };

    const url = `${BASE_URL}?${new URLSearchParams(params).toString()}`;
    console.log(`🌐 Opening ${nights}-night stay: ${url}`);

    // Windows: use "start" to launch Chrome (new window/tab)
    const command = `start "" "chrome" "${url}"`;
    try {
      execSync(command);
    } catch (err) {
      console.error(
        `❌ Failed to launch Chrome for ${nights}-night stay:`,
        err.message
      );
    }

    // Wait before opening the next page
    await sleep(4000);
  }

  console.log("✅ All queries dispatched to Chrome.");
})();
