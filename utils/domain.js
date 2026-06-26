export function extractDomain(url) {
    try {
        const host = new URL(url).hostname;

        return host.replace(/^www\./, "");
    } catch {
        return "newtab";
    }
}
