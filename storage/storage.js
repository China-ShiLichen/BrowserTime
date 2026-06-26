export async function saveTime(domain, duration) {
    const today = new Date().toISOString().slice(0, 10);

    const result = await chrome.storage.local.get("data");
    const data = result.data || {};

    if (!data[today]) {
        data[today] = {};
    }

    data[today][domain] = (data[today][domain] || 0) + duration;

    await chrome.storage.local.set({
        data,
    });
}

export async function getStats() {
    const today = new Date().toISOString().slice(0, 10);

    const result = await chrome.storage.local.get("data");

    return result.data?.[today] || {};
}

export async function clearStats() {
    const today = new Date().toISOString().slice(0, 10);

    const result = await chrome.storage.local.get("data");
    const data = result.data || {};

    data[today] = {};

    await chrome.storage.local.set({
        data,
    });
}
