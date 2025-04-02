(async function () {
    // checking session storage to see if website is unlocked
    if (sessionStorage.getItem('websiteLockerUnlocked') === 'true') return;

    const { lockedSites = [] } = await chrome.storage.sync.get("lockedSites");
    const currentHost = window.location.hostname;

    const lockedSite = lockedSites.find(site =>
        new URL(site.url).hostname === currentHost
    );

    if (!lockedSite) return;

    // Create blocking overlay
    const overlay = document.createElement('div');
    overlay.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100%;height:100%;
                   background:rgba(0,0,0,0.9);z-index:999999;
                   display:flex;justify-content:center;align-items:center;
                   color:white;font-family:Arial,sans-serif">
            <div style="background:#333;padding:2rem;border-radius:8px;
                        max-width:400px;text-align:center">
                <h2>🔒 Website Locked</h2>
                <p>Enter password to continue</p>
                <input type="password" id="pwdInput" placeholder="Password" 
                       style="margin:1rem 0;padding:0.5rem;width:100%;">
                <button id="unlockBtn" 
                        style="padding:0.5rem 1rem;background:#4CAF50;
                               color:white;border:none;border-radius:4px;">
                    Unlock
                </button>
                <p id="errorMsg" style="color:#ff4444;margin-top:1rem;"></p>
            </div>
        </div>
    `;

    document.body.innerHTML = '';
    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    document.getElementById('unlockBtn').addEventListener('click', () => {
        const entered = document.getElementById('pwdInput').value;
        if (entered === lockedSite.password) {
            // Mark as unlocked in session storage
            sessionStorage.setItem('websiteLockerUnlocked', 'true');
            location.reload();
        } else {
            document.getElementById('errorMsg').textContent = "Incorrect password!";
        }
    });
})();