const domain = new URLSearchParams(location.search).get("domain");

document.getElementById("domain").textContent = domain;

let sec = 60;

const count = document.getElementById("count");

const timer = setInterval(
    () => {
        sec--;

        count.textContent = `${sec}s 后自动忽略`;

        if (sec <= 0) {
            window.close();
        }
    },

    1000,
);

document.getElementById("yes").onclick = () => {
    clearInterval(timer);

    chrome.runtime.sendMessage({
        type: "continue",
    });

    window.close();
};

document.getElementById("no").onclick = () => {
    clearInterval(timer);

    chrome.runtime.sendMessage({
        type: "stop",
    });

    window.close();
};
