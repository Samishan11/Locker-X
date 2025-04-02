chrome.tabs.onUpdated.addListener(async (tabId, changeInfo, tab) => {
    if (changeInfo.status !== 'complete') return;

    if (!tab.url?.startsWith('http')) return;

    const { lockedSites = [] } = await chrome.storage.sync.get("lockedSites");
    const currentHost = new URL(tab.url).hostname;

    if (lockedSites.some(site => new URL(site.url).hostname === currentHost)) {
        try {
            await chrome.scripting.executeScript({
                target: { tabId },
                files: ['content.js']
            });
        } catch (err) {
            console.log("Injection failed (likely restricted page):", err);
        }
    }
});