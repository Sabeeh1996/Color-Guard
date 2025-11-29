# Quick Installation Guide

Follow these steps to install ColorGuard in Chrome:

## Step 1: Open Chrome Extensions Page
1. Open Chrome browser
2. Type `chrome://extensions/` in the address bar and press Enter
3. Or click the puzzle icon (⋮) → More tools → Extensions

## Step 2: Enable Developer Mode
1. Look for the **Developer mode** toggle in the top-right corner
2. Click it to enable (it should turn blue)

## Step 3: Load the Extension
1. Click the **"Load unpacked"** button (appears after enabling Developer mode)
2. Navigate to this folder: `f:\Chrome Extension\Color Guard`
3. Select the folder and click **"Select Folder"**

## Step 4: Verify Installation
✅ You should see "ColorGuard — Color-Blind Accessibility Layer" in your extensions list
✅ The extension should show "Errors: 0" (no errors)
✅ A blue icon with "CG" should appear in your Chrome toolbar

## Step 5: Try It Out
1. **Pin the extension**: Click the puzzle icon in toolbar, find ColorGuard, click the pin icon
2. **Open any website** (e.g., wikipedia.org)
3. **Click the ColorGuard icon** to open the popup
4. **Select "High Contrast"** mode
5. **See the effect** — page contrast should increase
6. **Try the keyboard shortcut**: Press `Ctrl+Shift+Y` to toggle

## Troubleshooting

### "Manifest is invalid" error
- Make sure you selected the correct folder (`Color Guard`)
- The folder should contain `manifest.json` directly (not nested)

### Extension appears but doesn't work
1. Open DevTools (F12) and check Console for errors
2. Try clicking the extension icon - does popup appear?
3. Refresh the webpage after enabling
4. Check if site is in blacklist (Options page)

### Need Help?
- Read the full README.md in this folder
- Check the Troubleshooting section
- Open browser console (F12) to see debug messages

---

**Ready to use!** Visit [options page](chrome://extensions/?options=YOUR_EXTENSION_ID) for advanced settings.
