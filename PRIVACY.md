# Privacy Policy

**Last Updated:** November 30, 2025

## 🔒 Zero Data Collection

**ColorGuard does NOT collect, transmit, or store any personal user data.**

Everything happens locally on your device. No tracking. No analytics. No external servers.

---

## Overview

ColorGuard is a privacy-first Chrome extension designed to provide accessibility features for users with color blindness and low vision. This privacy policy explains what data the extension accesses, how it's used, and your rights.

## Information We Do NOT Collect

ColorGuard is built with privacy as the foundation. We explicitly do **NOT** collect:

- ❌ **Browsing history** - We don't track which websites you visit
- ❌ **Personal information** - No names, emails, addresses, or identifiers
- ❌ **Usage analytics** - No telemetry, crash reports, or feature usage data
- ❌ **Cookies or tracking pixels** - Zero tracking mechanisms
- ❌ **Form data** - We never access or store form inputs
- ❌ **Login credentials** - No password or authentication data
- ❌ **Location data** - No geographic tracking
- ❌ **Device information** - No hardware or system details collected

## Data Stored Locally

ColorGuard only stores your **preferences and settings** locally using Chrome's storage API. This data never leaves your device except through Chrome's built-in sync feature (which you control).

### What Settings Are Stored:

- Selected accessibility modes (high-contrast, hue-shift, edge-highlight)
- Customization values (contrast level, hue shift amount, outline thickness)
- Global enabled/disabled state
- Whitelist/blacklist of domains (if configured)

**Storage Location:** Chrome's local storage API (`chrome.storage.sync`)  
**Data Retention:** Until you uninstall the extension or clear your browser data  
**Third-Party Access:** None - data stays on your device

## Chrome Permissions Explained

ColorGuard requires certain Chrome permissions to function. Here's exactly what each permission does and why it's needed:

| Permission | Purpose | Data Access |
|------------|---------|-------------|
| **storage** | Save your accessibility preferences locally | Only your ColorGuard settings - nothing else |
| **activeTab** | Apply accessibility filters to the current tab | Page content for CSS filtering only - not stored or transmitted |
| **scripting** | Inject CSS filters and visual enhancements | DOM access for applying filters - no data collection |
| **host_permissions (`<all_urls>`)** | Work on any website you visit | Page rendering access only - no browsing history recorded |

## How ColorGuard Works

ColorGuard applies visual accessibility enhancements entirely in your browser:

1. **You select** which accessibility modes to enable (high-contrast, hue-shift, edge-highlight)
2. **ColorGuard applies** CSS filters and DOM modifications locally on your device
3. **Your preferences are saved** in Chrome's local storage for persistence
4. **No data leaves your device** - everything happens offline

### 🔒 Security Guarantee

- **No External Connections:** ColorGuard does not make any network requests, connect to external servers, or communicate with third-party services. The extension operates entirely offline.
- **Open Source:** Our code is publicly available on [GitHub](https://github.com/Sabeeh1996/Color-Guard) for full transparency and community review.

## Third-Party Services

**None.** ColorGuard does not integrate with, share data with, or connect to any third-party services, analytics platforms, or external APIs.

## Data Sharing

**We do not share any data** because we do not collect any data. Your ColorGuard settings are stored exclusively in your browser's local storage and are never transmitted to us or anyone else.

## Children's Privacy

ColorGuard does not collect any data from anyone, including children under 13. The extension is safe for all ages and complies with COPPA (Children's Online Privacy Protection Act).

## Changes to Privacy Policy

If we make changes to this privacy policy, we will update the "Last Updated" date and notify users through the extension or GitHub repository. Continued use of ColorGuard after changes constitutes acceptance of the updated policy.

## Your Rights & Control

You have complete control over ColorGuard:

- **View Settings:** Click the extension icon → Options to see all stored preferences
- **Delete Settings:** Uninstall the extension or clear Chrome's extension data
- **Control Sync:** Disable Chrome Sync to prevent settings from syncing across devices
- **Disable Extension:** Turn off ColorGuard anytime from `chrome://extensions`

## Compliance

ColorGuard complies with:

- ✅ **Chrome Web Store Developer Program Policies**
- ✅ **GDPR** (General Data Protection Regulation) - No data collection means no GDPR concerns
- ✅ **CCPA** (California Consumer Privacy Act) - We don't sell data because we don't collect it
- ✅ **COPPA** (Children's Online Privacy Protection Act) - Safe for all ages

## Contact

If you have any questions about this privacy policy or ColorGuard's data practices:

- 📧 **Email:** [muhammadsabeeh1996@gmail.com](mailto:muhammadsabeeh1996@gmail.com)
- 🐛 **GitHub Issues:** [Report an Issue](https://github.com/Sabeeh1996/Color-Guard/issues)
- 💻 **Source Code:** [View on GitHub](https://github.com/Sabeeh1996/Color-Guard)

---

## Our Commitment

**Privacy is not a feature - it's a fundamental right.** ColorGuard is built by developers who care about accessibility AND privacy. We believe you shouldn't have to sacrifice one for the other.

---

© 2025 ColorGuard. Licensed under MIT License.  
Made with ❤️ for a more accessible and private web
