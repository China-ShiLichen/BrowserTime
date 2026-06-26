import { getDomain } from "../utils/domain.js";
import { saveTime } from "../storage/storage.js";

let currentDomain = null;
let startTime = null;

async function record(tabId) {
    try {
        const tab = await chrome.tabs.get(tabId);

        if (!tab?.url) {
            return;
        }

        const now = Date.now();
        const domain = getDomain(tab.url);

        if (currentDomain && startTime) {
            const duration = now - startTime;

            await saveTime(currentDomain, duration);
        }

        currentDomain = domain;
        startTime = now;
        console.log("Tracking:", domain);
    } catch (err) {
        console.error(err);
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

console.log("Worker Started");
