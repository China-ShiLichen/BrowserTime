import { getStats } from "/storage/storage.js";
import { formatTime } from "/utils/format.js";

async function render() {
    const summary = document.getElementById("summary");
    const list = document.getElementById("list");
    const temporary = document.getElementById("temporary");

    try {
        const stats = await getStats();

        const data = Object.entries(stats)
            .filter(([key]) => key !== "newtab")
            .sort((a, b) => b[1] - a[1]);

        list.innerHTML = "";

        if (data.length === 0) {
            summary.textContent = "暂无统计数据";

            return;
        }

        const total = data.reduce((sum, [, ms]) => sum + ms, 0);

        summary.innerHTML = `
            今日总时长：
            ${formatTime(total)}
        `;

        const normal = data.filter(([, ms]) => ms >= 1000);
        const short = data.filter(([, ms]) => ms < 1000);

        normal.forEach(([domain, ms], index) => {
            const row = document.createElement("div");

            row.className = "row";

            row.innerHTML = `
            <div>
                ${index + 1}. ${domain}
            </div>

            <div class="time">
                ${formatTime(ms)}
            </div>
        `;

            list.appendChild(row);
        });

        if (short.length) {
            temporary.innerHTML = `
        <div
            class="group-title"
            id="toggle"
        >
            临时使用的网站（${short.length}个）
            ▼
        </div>

        <div
            id="short-list"
            class="hidden"
        ></div>
    `;

            const container = document.getElementById("short-list");

            short.forEach(([domain, ms]) => {
                const row = document.createElement("div");

                row.className = "row";

                row.innerHTML = `
                <div>
                    ${domain}
                </div>

                <div class="time">
                    ${formatTime(ms)}
                </div>
            `;

                container.appendChild(row);
            });

            document.getElementById("toggle").addEventListener("click", () => {
                container.classList.toggle("hidden");
            });
        }
    } catch (err) {
        console.error(err);

        summary.textContent = "加载失败";
    }
}

document.addEventListener("DOMContentLoaded", render);
