import { getStats, clearStats } from "../storage/storage.js";

function formatTime(ms) {
    const seconds = Math.floor(ms / 1000);

    if (seconds < 60) {
        return `${seconds}s`;
    }

    if (seconds < 3600) {
        return `${Math.floor(seconds / 60)}min`;
    }

    return `${(seconds / 3600).toFixed(1)}h`;
}

async function loadStats() {
    const statsEl = document.getElementById("stats");
    const totalEl = document.getElementById("total");

    try {
        const stats = await getStats();

        const list = Object.entries(stats)
            .filter(([key]) => key !== "newtab")
            .sort((a, b) => b[1] - a[1]);

        statsEl.innerHTML = "";

        if (list.length === 0) {
            statsEl.innerHTML = `<div class="empty">暂无统计数据</div>`;

            totalEl.textContent = "今日 0min";

            return;
        }

        let total = 0;

        for (const [domain, ms] of list.slice(0, 8)) {
            total += ms;
        }

        totalEl.textContent = `今日 ${formatTime(total)}`;

        list.slice(0, 8).forEach(([domain, ms], index) => {
            const row = document.createElement("div");

            row.className = "row";

            row.innerHTML = `
                <div class="rank">${index + 1}</div>
                <div class="domain">${domain}</div>
                <div class="time">${formatTime(ms)}</div>
            `;

            statsEl.appendChild(row);
        });
    } catch (err) {
        console.error(err);

        statsEl.innerHTML = `<div class="empty">加载失败</div>`;
    }
}

async function clearAll() {
    await clearStats();
    loadStats();
}

document.addEventListener("DOMContentLoaded", () => {
    loadStats();

    document.getElementById("clear-btn")?.addEventListener("click", clearAll);
});
document.getElementById("open-dashboard")?.addEventListener("click", () => {
    chrome.tabs.create({
        url: chrome.runtime.getURL("dashboard/dashboard.html"),
    });
});
