import { getStats } from "../storage/storage.js";
import { formatTime } from "../utils/format.js";

async function render() {
    const summary = document.getElementById("summary");

    const list = document.getElementById("list");

    const stats = await getStats();

    const data = Object.entries(stats).sort((a, b) => b[1] - a[1]);

    let total = 0;

    data.forEach(([, ms]) => {
        total += ms;
    });

    summary.textContent = `今日总时长 ${formatTime(total)}`;

    data.forEach(([domain, ms]) => {
        const row = document.createElement("div");

        row.className = "row";

        row.innerHTML = `
            <div>${domain}</div>
            <div class="time">
                ${formatTime(ms)}
            </div>
        `;

        list.appendChild(row);
    });
}

render();
