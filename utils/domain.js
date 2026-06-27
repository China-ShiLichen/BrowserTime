export function extractDomain(url) {
    try {
        const host = new URL(url).hostname.replace(/^www\./, "");
        const parts = host.split(".");

        if (parts.length >= 2) {
            return parts.slice(-2).join(".");
        }

        return host;
    } catch {
        return "newtab";
    }
}
//future issue : Public Suffix List (eTLD+1)
