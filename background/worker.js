import { extractDomain } from "../utils/domain.js";
import { saveTime } from "../storage/storage.js";

let currentDomain = null;
let startTime = 0;
let browserActive = true;

async function flush() {
    if (!currentDomain || !startTime) {
        return;
    }

    const duration = Date.now() - startTime;

    if (duration <= 1000) {
        return;
    }

    await saveTime(currentDomain, duration);

    startTime = Date.now();
}

async function record(tabId) {
    try {
        const tab = await chrome.tabs.get(tabId);

        if (!tab || !tab.url) {
            return;
        }

        const domain = extractDomain(tab.url);

        if (browserActive) {
            await flush();
        }

        currentDomain = domain;

        startTime = Date.now();

        console.log("Tracking:", domain);
    } catch (e) {
        console.log("Skip:", e);
    }
}

chrome.tabs.onActivated.addListener(({ tabId }) => {
    record(tabId);
});

chrome.tabs.onUpdated.addListener((tabId, info) => {
    if (info.status === "complete") {
        record(tabId);
    }
});

setInterval(
    () => {
        if (browserActive) {
            flush();
        }
    },

    1000,
);

chrome.windows.onFocusChanged.addListener(async (id) => {
    if (id === chrome.windows.WINDOW_ID_NONE) {
        browserActive = false;

        await flush();

        return;
    }

    browserActive = true;

    startTime = Date.now();
});

console.log("Worker Started");
