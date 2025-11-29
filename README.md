# 🛡️ ColorGuard — Color-Blind Accessibility Layer

<div align="center">

[![Chrome Web Store](https://img.shields.io/badge/Chrome-Extension-blue?logo=google-chrome)](https://github.com/Sabeeh1996/Color-Guard)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)
[![GitHub Sponsors](https://img.shields.io/badge/Sponsor-❤-red?logo=github-sponsors)](https://github.com/sponsors/Sabeeh1996)
[![Issues](https://img.shields.io/github/issues/Sabeeh1996/Color-Guard)](https://github.com/Sabeeh1996/Color-Guard/issues)
[![Stars](https://img.shields.io/github/stars/Sabeeh1996/Color-Guard?style=social)](https://github.com/Sabeeh1996/Color-Guard/stargazers)

</div>

A fast, non-invasive Chrome extension that helps users with red-green color blindness and low vision by providing customizable accessibility overlays.

---

## 📋 Table of Contents

- [Features](#-features)
- [Installation](#-installation)
- [Usage](#-usage)
- [Support](#-support)
- [Contributing](#-contributing)
- [Roadmap](#-roadmap)
- [FAQ](#-faq)
- [Contact](#-contact)
- [License](#-license)

---

## ✨ Features

- **High-Contrast Mode** — Increases contrast without distorting page layout
- **Hue-Shift Mode** — Adjusts red/green colors to distinguishable hues for color-blind users
- **Edge-Highlight Mode** — Emphasizes boundaries of interactive UI elements
- **Per-Site Settings** — Enable globally or use whitelist/blacklist for specific domains
- **Keyboard Shortcut** — Quick toggle with `Ctrl+Shift+Y` (customizable)
- **Privacy-First** — All processing happens locally; no data leaves your device

## Installation

### From Source (Developer Mode)

1. **Clone or download this repository** to your local machine

2. **Open Chrome** and navigate to `chrome://extensions/`

3. **Enable Developer Mode** (toggle in top-right corner)

4. **Click "Load unpacked"** and select the `Color Guard` folder

5. **Pin the extension** to your toolbar for easy access

### Verify Installation

- You should see the ColorGuard icon (blue with "CG") in your Chrome toolbar
- Click it to open the popup and verify it loads correctly
- Try the keyboard shortcut `Ctrl+Shift+Y` to toggle the overlay

## Usage

### Quick Start

1. **Click the ColorGuard icon** in your toolbar to open the popup
2. **Select a mode**:
   - **Off** — No modifications
   - **High Contrast** — Boost contrast for better visibility
   - **Hue Shift** — Adjust colors for red-green color blindness
   - **Edge Highlight** — Outline interactive elements
3. **Use keyboard shortcut** `Ctrl+Shift+Y` to quickly toggle on/off

### Advanced Configuration

1. **Click "⚙️ Advanced Options"** in the popup, or right-click the extension icon and select "Options"

2. **Adjust mode-specific settings**:
   - **Contrast Level** — Multiplier from 1.0x (normal) to 3.0x (maximum)
   - **Hue Shift Amount** — Rotation in degrees (0° - 180°)
   - **Edge Outline Thickness** — Line width in pixels (1 - 5)

3. **Manage sites**:
   - **Enable on all sites** — Apply globally (use blacklist to exclude)
   - **Disable global** — Use whitelist for specific sites only
   - **Add Current Site** — Quick-add the current domain to active list

4. **Advanced settings**:
   - **Capture clicks** — Make overlay intercept pointer events (rarely needed)

5. **Click "💾 Save All Settings"** to apply changes

### Customizing Keyboard Shortcut

1. Go to `chrome://extensions/shortcuts`
2. Find "ColorGuard — Color-Blind Accessibility Layer"
3. Click the pencil icon next to "Toggle ColorGuard accessibility overlay"
4. Press your desired key combination
5. Click outside to save

## Testing & Verification

### Test Plan

#### 1. High-Contrast Mode
- **Setup**: Open a web page with light gray text on white background
- **Action**: Enable High-Contrast mode and set level to 2.0x
- **Expected**: Text becomes darker and more readable; colors intensify
- **Test sites**: news articles, documentation pages

#### 2. Hue-Shift Mode
- **Setup**: Open a page with red and green elements (e.g., status indicators, charts)
- **Action**: Enable Hue-Shift mode with 60° rotation
- **Expected**: Red shifts toward orange, green shifts toward cyan; colors become distinguishable
- **Test sites**: dashboards with status indicators, color-coded charts

#### 3. Edge-Highlight Mode
- **Setup**: Open a page with buttons, links, and forms
- **Action**: Enable Edge-Highlight mode with 2px thickness
- **Expected**: Yellow outlines appear around interactive elements
- **Test sites**: login forms, search pages, e-commerce sites

#### 4. Per-Site Settings
- **Setup**: Add `example.com` to whitelist (with global disabled)
- **Action**: Visit `example.com` and another site
- **Expected**: Overlay active only on `example.com`
- **Test**: Verify blacklist works similarly with global enabled

#### 5. Keyboard Shortcut
- **Setup**: Open any page
- **Action**: Press `Ctrl+Shift+Y` repeatedly
- **Expected**: Overlay toggles between last active mode and off
- **Test**: Works from any tab, even when popup is closed

### Browser Console Testing

Open DevTools Console (`F12`) to see debug messages:
- `ColorGuard overlay activated: [mode]` — Mode successfully applied
- `ColorGuard overlay deactivated` — Overlay turned off
- CSP warnings if extension is blocked on a page

## Troubleshooting

### Extension doesn't work on some pages

**Problem**: Content Security Policy (CSP) restrictions block the extension

**Affected pages**: 
- Chrome internal pages (`chrome://`, `chrome-extension://`)
- Some banking/security-focused sites
- Chrome Web Store

**Solution**: 
- This is a browser security feature and cannot be bypassed
- The extension logs a console warning when CSP blocks it
- Use the extension on other pages that allow content scripts

### Overlay not appearing

**Checklist**:
1. ✅ Mode is not set to "Off" (check popup)
2. ✅ Current domain is not blacklisted (check options)
3. ✅ Extension has permission to run on page (check `chrome://extensions/`)
4. ✅ Page doesn't block content scripts (check console for CSP warnings)
5. ✅ Try refreshing the page after changing settings

### Performance issues

**If page becomes slow**:
- **Edge-Highlight mode** uses canvas processing; disable if page has many elements
- **Reduce outline thickness** to 1px in options
- **Add slow pages to blacklist** to exclude them

**Tips**:
- Edge detection only processes visible viewport, not entire page
- Updates are throttled to ~10fps to minimize CPU usage
- High-Contrast and Hue-Shift modes use CSS filters (very fast)

### Colors look wrong

**Hue-Shift mode**:
- Affects ALL colors globally; some color combinations may look unusual
- Adjust **Hue Shift Amount** in options (try 30°, 60°, or 90°)
- Combine with High-Contrast mode for better results

**High-Contrast mode**:
- Very high values (>2.5x) may cause clipping/posterization
- Reduce **Contrast Level** if colors look oversaturated

### Settings not saving

- Check that you clicked **"💾 Save All Settings"** in options page
- Browser sync must be enabled for `chrome.storage.sync`
- Check DevTools console for errors
- Try disabling and re-enabling the extension

## Architecture & Implementation

### File Structure

```
Color Guard/
├── manifest.json          # Extension manifest (Manifest V3)
├── service-worker.js      # Background script (service worker)
├── contentScript.js       # Content script (injected into pages)
├── overlay.js             # Core overlay logic (ES module)
├── overlay.css            # Overlay styles
├── popup.html             # Popup UI
├── popup.js               # Popup logic
├── options.html           # Options page UI
├── options.js             # Options page logic
├── icons/                 # Extension icons (16, 32, 48, 128px)
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README.md              # This file
```

### How It Works

1. **Service Worker** (`service-worker.js`)
   - Listens for keyboard shortcut commands
   - Manages settings in `chrome.storage.sync`
   - Broadcasts settings changes to all tabs

2. **Content Script** (`contentScript.js`)
   - Injected into every page
   - Checks if extension should run on current domain
   - Dynamically imports overlay module when needed
   - Minimal footprint when disabled

3. **Overlay Module** (`overlay.js`)
   - **High-Contrast**: Applies CSS `contrast()` filter to document root
   - **Hue-Shift**: Applies CSS `hue-rotate()` filter to document root
   - **Edge-Highlight**: Uses canvas to draw outlines around interactive elements
   - Cleans up resources when deactivated

4. **UI Components**
   - **Popup**: Quick mode selection (HTML/JS, no frameworks)
   - **Options**: Detailed configuration with sliders and domain management

### Performance Optimizations

- **Lazy loading**: Overlay module only loads when needed
- **CSS filters**: High-Contrast and Hue-Shift use GPU-accelerated filters
- **Throttling**: Edge detection limited to ~10fps
- **Viewport-only**: Edge highlighting only processes visible elements
- **Event cleanup**: All listeners removed when overlay is deactivated

### Edge Detection Algorithm

The Edge-Highlight mode uses a lightweight DOM-based approach:

1. Query interactive elements (buttons, links, inputs, etc.)
2. Get bounding rectangles for visible elements in viewport
3. Draw outlines on canvas overlay
4. Update at throttled interval (100ms)

**Future enhancement**: Sobel operator for pixel-level edge detection (requires WebGL or html2canvas library)

## Privacy & Security

- ✅ **All processing is local** — No data sent to external servers
- ✅ **No tracking** — Extension doesn't collect usage data
- ✅ **No third-party dependencies** — Vanilla JavaScript only
- ✅ **Minimal permissions** — Only requests `storage`, `activeTab`, and `scripting`
- ✅ **Open source** — Review the code yourself

**Data storage**:
- Settings stored in `chrome.storage.sync` (synced across your Chrome profile)
- No personal information collected
- Domain whitelist/blacklist stored locally

## Browser Compatibility

- ✅ **Chrome** 88+ (Manifest V3 support)
- ✅ **Edge** 88+ (Chromium-based)
- ✅ **Brave** 1.20+ (Chromium-based)
- ✅ **Opera** 74+ (Chromium-based)
- ❌ **Firefox** (requires Manifest V2 port)

## 💖 Support

If ColorGuard has helped make the web more accessible for you, consider supporting the project:

### GitHub Sponsors
[![Sponsor on GitHub](https://img.shields.io/badge/Sponsor-❤-red?logo=github-sponsors)](https://github.com/sponsors/Sabeeh1996)

Your sponsorship helps maintain and improve ColorGuard with new features and better accessibility support.

### Other Ways to Support
- ⭐ **Star this repository** to help others discover it
- 🐛 **Report bugs** to help improve the extension
- 📢 **Share** with friends who might benefit from it
- 💬 **Leave feedback** about your experience

---

## 🤝 Contributing

Contributions are welcome and appreciated! Here's how you can help:

### Ways to Contribute
- 🐛 **Report bugs** via [GitHub Issues](https://github.com/Sabeeh1996/Color-Guard/issues)
- 💡 **Suggest features** that would improve accessibility
- 📝 **Improve documentation** for better clarity
- 🔧 **Submit pull requests** with enhancements or fixes
- 🌍 **Translate** the extension to other languages

### Development Process

1. **Fork** this repository
2. **Clone** your fork: `git clone https://github.com/YOUR-USERNAME/Color-Guard.git`
3. **Create a feature branch**: `git checkout -b feature-name`
4. **Make your changes** and test thoroughly
5. **Commit** with clear messages: `git commit -m "Add feature X"`
6. **Push** to your fork: `git push origin feature-name`
7. **Open a Pull Request** with detailed description

### Development Tips

- Use `console.debug()` for logging (appears in DevTools console)
- Test on multiple sites: Wikipedia, GitHub, Gmail, Reddit
- Test with DevTools Network throttling for slow connections
- Verify cleanup: toggle overlay rapidly and check for memory leaks

---

## 🗺️ Roadmap

### Planned Features
- [ ] Additional color-blind modes (Deuteranopia, Protanopia, Tritanopia presets)
- [ ] AI-powered image recoloring for better contrast
- [ ] Screen reader integration
- [ ] Customizable keyboard shortcuts
- [ ] Dark mode overlay option
- [ ] Export/import settings
- [ ] Multi-language support

### Future Enhancements
- [ ] WebGL-based Sobel edge detection
- [ ] Real-time video filter support
- [ ] Sync settings across devices
- [ ] Browser extension for Firefox and Safari

**Vote for features** in [GitHub Discussions](https://github.com/Sabeeh1996/Color-Guard/discussions)!

---

## ❓ FAQ

### How do I use ColorGuard?
1. Click the ColorGuard icon in your Chrome toolbar
2. Select a mode (High Contrast, Hue Shift, or Edge Highlight)
3. The changes apply instantly without refreshing the page
4. Use `Ctrl+Shift+Y` to quickly toggle on/off

### Does ColorGuard work on all websites?
ColorGuard works on most websites. However, it cannot run on:
- Chrome internal pages (`chrome://` URLs)
- Chrome Web Store pages
- Some sites with strict Content Security Policies

### Will ColorGuard slow down my browsing?
No! ColorGuard uses GPU-accelerated CSS filters and processes only visible elements. Performance impact is minimal.

### Is my data safe?
Yes! ColorGuard processes everything locally on your device. No data is sent to external servers, and we don't collect any usage information.

### Can I use ColorGuard on mobile?
Currently, ColorGuard is only available for desktop Chrome browsers. Mobile support may come in future versions.

### How do I report bugs or request features?
Open an issue on our [GitHub Issues page](https://github.com/Sabeeh1996/Color-Guard/issues) with detailed information.

---

## 📞 Contact

### Get Help
- 📖 **Documentation**: [GitHub Wiki](https://github.com/Sabeeh1996/Color-Guard/wiki)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Sabeeh1996/Color-Guard/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Sabeeh1996/Color-Guard/discussions)
- 📧 **Email**: sabeeh.colorguard@gmail.com

### Links
- 🔗 **GitHub Repository**: [https://github.com/Sabeeh1996/Color-Guard](https://github.com/Sabeeh1996/Color-Guard)
- 💰 **Sponsor**: [GitHub Sponsors](https://github.com/sponsors/Sabeeh1996)
- 🌟 **Star the Project**: [Give us a star](https://github.com/Sabeeh1996/Color-Guard/stargazers) if you find ColorGuard helpful!

### Social Media
- 🐦 **Twitter**: [@Sabeeh1996](https://twitter.com/Sabeeh1996)
- 💼 **LinkedIn**: [Connect with me](https://linkedin.com/in/sabeeh1996)

---

## 📄 License

MIT License — See [LICENSE](./LICENSE) file for details.

Copyright (c) 2025 Sabeeh

---

## 🙏 Acknowledgments

- Inspired by the accessibility needs of color-blind users worldwide
- Thanks to the Chrome Extensions team for comprehensive Manifest V3 documentation
- Shoutout to accessibility advocates and organizations making the web inclusive for everyone
- Special thanks to all contributors and supporters of this project

---

<div align="center">

**Made with ❤️ for a more accessible web**

If ColorGuard helps you, please consider [⭐ starring the repository](https://github.com/Sabeeh1996/Color-Guard) and [💖 sponsoring the project](https://github.com/sponsors/Sabeeh1996)!

</div>

*Last updated: November 29, 2025*
