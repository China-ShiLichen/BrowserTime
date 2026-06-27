import { extractDomain } from "../utils/domain.js";
import { saveTime } from "../storage/storage.js";
import { getStats } from "../storage/storage.js";

let waitingConfirm = false;
let pendingStart = null;
let confirmWindow = null;

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
    await updateBadge();

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
async function updateBadge() {
    if (waitingConfirm) {
        return;
    }
    const stats = await getStats();
    const total = Object.values(stats).reduce((a, b) => a + b, 0);

    const minute = Math.floor(total / 60000);
    let text = "";

    if (minute < 60) {
        text = `${minute}m`;
    } else {
        text = `${Math.floor(minute / 60)}h`;
    }

    chrome.action.setBadgeText({
        text,
    });
    chrome.action.setBadgeBackgroundColor({
        color: "#5A8CFF",
    });
}

async function askContinue() {
    if (waitingConfirm) {
        return;
    }

    waitingConfirm = true;
    await setPendingBadge();
    pendingStart = startTime;
    browserActive = false;

    const win = await chrome.windows.create({
        url: `../popup/confirm.html?domain=
            ${encodeURIComponent(currentDomain)}`,
        type: "popup",
        width: 460,
        height: 300,
    });

    confirmWindow = win.id;

    setTimeout(async () => {
        if (waitingConfirm) {
            waitingConfirm = false;
            pendingStart = null;
        }
    }, 60000);
}
globalThis.askContinue = askContinue;

async function setPendingBadge() {
    waitingConfirm = true;

    await chrome.action.setBadgeBackgroundColor({
        color: "#1a73e8",
    });

    await chrome.action.setBadgeText({
        text: "X",
    });
}
globalThis.setPendingBadge = setPendingBadge;

async function clearPendingBadge() {
    waitingConfirm = false;
    await updateBadge();
}
globalThis.clearPendingBadge = clearPendingBadge;

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

chrome.windows.onFocusChanged.addListener(async (windowId) => {
    if (windowId === chrome.windows.WINDOW_ID_NONE) {
        browserActive = false;
        await flush();

        return;
    }

    browserActive = true;

    try {
        const tabs = await chrome.tabs.query({
            active: true,
            lastFocusedWindow: true,
        });

        if (tabs[0]) {
            await record(tabs[0].id);
        }
    } catch (e) {
        console.log(e);
    }
});

chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.type === "continue") {
        await clearPendingBadge();
        browserActive = true;
        waitingConfirm = false;
        startTime = pendingStart;
    }

    if (msg.type === "stop") {
        await clearPendingBadge();
        waitingConfirm = false;
        pendingStart = null;
        await clearPendingBadge();
        startTime = Date.now();
    }
});

chrome.idle.setDetectionInterval(600);

chrome.idle.onStateChanged.addListener((state) => {
    if (state === "idle") {
        askContinue();
    }
});

console.log("Worker Started");
updateBadge();
