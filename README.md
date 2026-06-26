# Browsertime

A lightweight browser time tracker built for people who want to understand where their attention goes.

Browsertime records active browsing time locally and turns scattered tab activity into clear daily statistics — without accounts, cloud sync, or unnecessary complexity.

---

## Features

### Accurate active-time tracking

Tracks only when the browser window is actually in focus.

Idle time caused by switching to other applications is excluded from statistics.

### Domain-level aggregation

URLs are automatically normalized:

```text
https://github.com/user/project
↓
github.com
```

Statistics stay clean instead of being fragmented by page paths.

### Daily statistics

Usage is grouped by date and automatically reset each day.

Designed for continuous use without manual maintenance.

### Dashboard view

A dedicated statistics page provides:

* Total usage time
* Website ranking
* Expandable short-visit groups
* Search and filtering
* Time distribution overview

### Local-first

All data stays inside Chrome local storage.

No login.
No external server.
No telemetry.

---

## Preview

Popup

* Quick overview of today's activity
* Open detailed dashboard

Dashboard

* Complete ranking
* Collapsed temporary websites
* Focused reading experience

(Add screenshots here)

---

## Installation

### Development Mode

1. Download or clone the repository

```bash
git clone https://github.com/yourname/browsertime.git
```

2. Open Chrome

```text
chrome://extensions
```

3. Enable Developer Mode

4. Click

```text
Load unpacked
```

5. Select project folder

---

## Project Structure

```text
browsertime/

manifest.json

background/
└── worker.js

popup/
├── popup.html
├── popup.css
└── popup.js

dashboard/
├── dashboard.html
├── dashboard.css
└── dashboard.js

storage/
└── storage.js

utils/
├── domain.js
├── date.js
└── format.js
```

---

## Design Notes

This project intentionally avoids:

* Cloud synchronization
* User accounts
* Recommendation systems
* Attention scoring

The goal is simple:

Make browsing time visible.

---

## Roadmap

* [ ] Website category system
* [ ] Historical trends
* [ ] Export statistics
* [ ] Multi-device support

---

## License

MIT
