# Booking Search Launcher

A small cross-platform Electron GUI for quickly opening Booking.com search pages for multiple destinations and stay lengths.

---

## Features

- **Destination & stay-length multi-select** – hold Ctrl / Cmd / Shift to choose several options at once.
- **Tomorrow-by-default check-in** – or pick any date with the calendar.
- **Configurable delay** between successive launches.
- **Reusable BookingLauncher class** – opens Chrome tabs/windows with the same filters you would set manually.
- **Theme switcher** ☯ – cycles through _Light_, _Dark_, _Darker_, _Blue_, _Green_, _Yellow_. Choice is stored in `localStorage` and restored on next launch (no flicker thanks to early injection).
- **Keyboard-friendly** – tab through controls, hit <kbd>Enter</kbd> on **Launch**.

---

## Getting Started

### Prerequisites

- **Node.js ≥ 18** (includes `npm`).
- **Google Chrome** installed and on `PATH` (the launcher uses the `start "" "chrome" <url>` Windows command).

### Install dependencies

```bash
npm install
```

### Run the Electron UI

```bash
npm run electron
```

### Classic CLI mode (optional)

```bash
npm start    # runs index.js exactly like before
```

---

## Usage

1. Launch the app – a small window appears.
2. Select one or more **destinations** and **stay lengths**.
3. Optionally change the **check-in date** and **delay** (ms).
4. Click **Launch**. Chrome opens a new tab (or window, depending on `config.js`) for every (destination × stay-length) combination.
5. Use the ☯ button (top-right) to cycle through color schemes. The chosen theme is saved between sessions.

---

## Configuration

`config.js` holds two global behaviours:

| Key                               | Default | Meaning                                                                                                  |
| --------------------------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `newBrowserInstancesForLocations` | `false` | If `true`, each first tab for a destination opens in a **new Chrome window**.                            |
| `delayBetweenLaunchesMs`          | `10000` | Default delay when launching via the **Node.js** script. The Electron UI lets you override this per run. |

`locations.js` is the list shown in the Destinations box – edit, remove or extend lines as needed.

---

## License

ISC – do whatever you’d like. Attribution appreciated.
