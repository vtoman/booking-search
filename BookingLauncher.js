// BookingLauncher.js

const { execSync } = require("child_process");

/**
 * BookingLauncher
 * ---------------
 * Utility class that opens Booking.com search pages in Chrome based on a
 * configuration object. Intended for scripting multiple stay-length queries
 * with optional filters.
 */
class BookingLauncher {
  /**
   * @param {Object} options
   * @param {string} options.destination   Human-readable destination string accepted by Booking.com (e.g. "Neos Marmaras, Macedonia, Greece").
   * @param {string} options.checkin       Check-in date in YYYY-MM-DD format.
   * @param {number[]} [options.stayLengths=[1,2,3]] Array of night counts to query (e.g. [1,2,3]).
   * @param {number}   [options.adults=1]  Number of adults.
   * @param {number}   [options.children=0]Number of children.
   * @param {number}   [options.rooms=1]   Number of rooms.
   * @param {string[]} [options.filters=[]]Raw Booking.com filter strings (e.g. ["oos=1","roomfacility=38" ]). They will be joined with ";" and assigned to the nflt query param.
   * @param {string}   [options.order="price"] Sort order parameter.
   * @param {number}   [options.delayMs=2000] Delay between opening tabs, in milliseconds.
   * @param {string}   [options.baseUrl]   Alternate base URL, defaults to Booking.com searchresults endpoint.
   * @param {boolean}  [options.newBrowserInstancesForLocations=false] If true, opens a new browser instance for each destination.
   */
  constructor({
    destination,
    checkin,
    stayLengths = [1, 2, 3],
    adults = 1,
    children = 0,
    rooms = 1,
    filters = [],
    order = "price",
    delayMs = 2000,
    baseUrl = "https://www.booking.com/searchresults.html",
    newBrowserInstancesForLocations = false,
  }) {
    this.baseUrl = baseUrl;
    this.stayLengths = stayLengths;
    this.delayMs = delayMs;
    this.newBrowserInstancesForLocations = newBrowserInstancesForLocations;

    // Assemble fixed query parameters (conditionally for destination/checkin)
    this.baseParams = {
      group_adults: adults,
      no_rooms: rooms,
      group_children: children,
      order,
    };

    if (destination) this.baseParams.ss = destination;
    if (checkin) this.baseParams.checkin = checkin;

    if (filters.length) {
      this.baseParams.nflt = filters.join(";");
    }
  }

  /** Simple sleep helper */
  static sleep(ms) {
    return new Promise((res) => setTimeout(res, ms));
  }

  /** Add days to YYYY-MM-DD and return in same format */
  addDays(dateStr, days) {
    const d = new Date(dateStr);
    d.setDate(d.getDate() + days);
    return d.toISOString().slice(0, 10);
  }

  /**
   * Launch Chrome tabs/windows for each stay length configured.
   */
  async launch() {
    if (!this.baseParams.ss || !this.baseParams.checkin) {
      throw new Error(
        "Both destination (ss) and check-in date must be set before launching. Use updateConfig() to supply them."
      );
    }

    for (let idx = 0; idx < this.stayLengths.length; idx++) {
      const nights = this.stayLengths[idx];

      const params = {
        ...this.baseParams,
        checkout: this.addDays(this.baseParams.checkin, nights),
      };

      const url = `${this.baseUrl}?${new URLSearchParams(params).toString()}`;
      console.log(`🌐 Opening ${nights}-night stay: ${url}`);

      // Open a new window if destination differs from the last window's destination
      const isFirstTabForDestination =
        idx === 0 && this.baseParams.ss !== BookingLauncher._currentDestination;
      const chromeFlags =
        isFirstTabForDestination && this.newBrowserInstancesForLocations
          ? "--new-window"
          : "";
      const command = `start "" "chrome" ${chromeFlags} "${url}"`;
      try {
        execSync(command);
        // If we opened a new window, remember the destination it corresponds to
        if (isFirstTabForDestination) {
          BookingLauncher._currentDestination = this.baseParams.ss;
        }
      } catch (err) {
        console.error(
          `❌ Failed to launch Chrome for ${nights}-night stay:`,
          err.message
        );
      }

      await BookingLauncher.sleep(this.delayMs);
    }

    console.log("✅ All queries dispatched to Chrome.");
  }

  /**
   * Update configuration properties so the same instance can be reused.
   * @param {Object} updates Same shape as constructor options; only supplied
   *                         keys will be modified.
   */
  updateConfig(updates = {}) {
    const {
      destination,
      checkin,
      stayLengths,
      adults,
      children,
      rooms,
      filters,
      order,
      delayMs,
      newBrowserInstancesForLocations,
    } = updates;

    if (destination) this.baseParams.ss = destination;
    if (checkin) this.baseParams.checkin = checkin;
    if (Array.isArray(stayLengths)) this.stayLengths = stayLengths;
    if (typeof delayMs === "number") this.delayMs = delayMs;
    if (typeof newBrowserInstancesForLocations === "boolean")
      this.newBrowserInstancesForLocations = newBrowserInstancesForLocations;

    if (typeof adults === "number") this.baseParams.group_adults = adults;
    if (typeof children === "number") this.baseParams.group_children = children;
    if (typeof rooms === "number") this.baseParams.no_rooms = rooms;
    if (order) this.baseParams.order = order;

    if (filters) {
      if (filters.length) {
        this.baseParams.nflt = filters.join(";");
      } else {
        // Remove nflt if empty array provided
        delete this.baseParams.nflt;
      }
    }

    return this; // enable chaining
  }
}

// Track which destination the current Chrome window corresponds to
BookingLauncher._currentDestination = null;

module.exports = BookingLauncher;
