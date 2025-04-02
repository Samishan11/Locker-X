chrome.storage.sync.get(["lockedSites"], (data) => {
    const lockedSites = data.lockedSites || [];
    updateLockedSitesList(lockedSites);

    document.getElementById("add-website-btn").addEventListener("click", () => {
        const site = document.getElementById("website-input").value.trim();
        const password = document.getElementById("site-password-input").value.trim();
        const errorElement = document.getElementById("error-message");

        errorElement.textContent = "";

        if (!site || !password) {
            errorElement.textContent = "Please enter both a website and password.";
            return;
        }

        if (lockedSites.some(s => s.url === site)) {
            errorElement.textContent = "This website is already locked!";
            return;
        }

        lockedSites.push({ url: site, password });
        chrome.storage.sync.set({ lockedSites });
        updateLockedSitesList(lockedSites);

        document.getElementById("website-input").value = "";
        document.getElementById("site-password-input").value = "";
    });
});

// Update the locked sites list (now includes passwords)
function updateLockedSitesList(sites) {
    const list = document.getElementById("sites-list");
    list.innerHTML = sites.map(site => `
        <li>
            ${site.url} 
            <button class="remove-btn" data-site="${site.url}">Remove</button>
        </li>
    `).join("");

    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const siteToRemove = e.target.getAttribute("data-site");
            const updatedSites = sites.filter(s => s.url !== siteToRemove);
            chrome.storage.sync.set({ lockedSites: updatedSites });
            updateLockedSitesList(updatedSites);
        });
    });
}