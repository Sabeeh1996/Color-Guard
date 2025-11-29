# ColorGuard Troubleshooting Guide

## Quick Debugging Steps

### Step 1: Check Extension is Loaded
1. Go to `chrome://extensions/`
2. Find "ColorGuard — Color-Blind Accessibility Layer"
3. **Check for errors**: Should show "Errors: 0" in green
4. If there are errors, click "Errors" to see details
5. Make sure the extension is **enabled** (toggle should be blue/on)

### Step 2: Reload Extension
1. On `chrome://extensions/`, find ColorGuard
2. Click the **refresh/reload icon** (circular arrow)
3. This reloads all extension code

### Step 3: Check Console for Messages
1. Open any webpage (e.g., `wikipedia.org`)
2. Press `F12` to open DevTools
3. Go to **Console** tab
4. Look for ColorGuard messages:
   - `ColorGuard content script initializing on: [domain]`
   - `ColorGuard settings loaded: {mode: "...", ...}`
   - `ColorGuard enabled on this domain`
   - `ColorGuard overlay activated: [mode]`

### Step 4: Manually Enable a Mode
1. **Click the ColorGuard icon** in your toolbar (blue CG icon)
2. Select **"High Contrast"** mode (should have a radio button)
3. Watch the console for: `ColorGuard overlay activated: high-contrast`
4. You should see: `ColorGuard: High-contrast applied: 1.5x`

### Step 5: Check Visual Effect
**For High-Contrast mode:**
- Colors should appear more vivid/saturated
- Text should be darker/more readable
- The entire page should look higher contrast

**For Hue-Shift mode:**
- Colors should shift (reds become orange, greens become cyan)
- The entire page should have different color tones

**For Edge-Highlight mode:**
- Yellow outlines should appear around buttons, links, and inputs
- Look for a canvas overlay

## Common Issues & Solutions

### Issue: "Cannot see any effect"

**Solution 1: Check the mode is not "Off"**
- Click extension icon
- Make sure "Off" is NOT selected
- Select "High Contrast" and wait 1 second

**Solution 2: Refresh the page**
- After selecting a mode, refresh the page (F5)
- Extension applies to pages as they load

**Solution 3: Check domain isn't blacklisted**
- Right-click extension icon → Options
- Check "Enable on all sites" is ON (toggle should be blue)
- If OFF, make sure current site is in whitelist

**Solution 4: Test on a different site**
- Try a simple site: `example.com` or `wikipedia.org`
- Some sites may block content scripts (CSP)

### Issue: No console messages appear

**This means content script isn't loading:**
1. Check `chrome://extensions/` for errors
2. Make sure extension has permission for the site
3. Check manifest.json is valid (no syntax errors)
4. Reload extension and refresh page

### Issue: Console shows errors

**Common errors and fixes:**

**Error: "Cannot read property 'init' of undefined"**
- The overlay.js script didn't load
- Check `chrome://extensions/` - is overlay.js listed?
- Check web_accessible_resources in manifest.json

**Error: "chrome.runtime.sendMessage is not defined"**
- Content script can't communicate with background
- Reload the extension
- Check service-worker.js is running

**Error: "Refused to load script... Content Security Policy"**
- The website blocks extensions (by design)
- This is normal for banking sites, chrome:// pages
- Try a different website

### Issue: Effect appears then disappears

**Solution:**
- Check if page has dynamic content loading
- Some single-page apps may reset styles
- Try disabling other extensions that modify pages

## Manual Testing Commands

Open DevTools Console (F12) and run these commands:

### Check if content script loaded:
```javascript
console.log('Content script active:', typeof chrome !== 'undefined');
```

### Check if overlay module loaded:
```javascript
console.log('Overlay loaded:', typeof window.ColorGuardOverlay !== 'undefined');
```

### Manually trigger high-contrast:
```javascript
document.documentElement.style.filter = 'contrast(2.0)';
```
You should see the effect immediately. If not, browser doesn't support CSS filters.

### Check current filter:
```javascript
console.log('Current filter:', document.documentElement.style.filter);
```

### Clear all filters:
```javascript
document.documentElement.style.filter = '';
```

## Verification Checklist

- [ ] Extension appears in `chrome://extensions/`
- [ ] Extension shows "Errors: 0"
- [ ] Extension is enabled (blue toggle)
- [ ] Clicked extension icon shows popup
- [ ] Selected a mode other than "Off"
- [ ] Refreshed the webpage
- [ ] Checked Console for ColorGuard messages
- [ ] Tested on multiple websites
- [ ] "Enable on all sites" is ON in options

## Still Not Working?

### Try this complete reset:
1. Go to `chrome://extensions/`
2. **Remove** ColorGuard extension
3. **Reload** the folder: Click "Load unpacked"
4. Select `f:\Chrome Extension\Color Guard`
5. **Refresh** your test webpage
6. **Select** High Contrast mode
7. **Open Console** (F12) and look for messages

### Report the issue:
If still not working, copy these details:
- Chrome version: Type `chrome://version/` in address bar
- Console messages: Copy all ColorGuard-related logs
- Extension errors: Copy from `chrome://extensions/`
- Operating System: Windows/Mac/Linux
- Test website URL

---

**Most likely cause**: Mode is set to "Off" or page needs to be refreshed after selecting mode.

**Quick test**: 
1. Open `example.com`
2. Open Console (F12)
3. Click ColorGuard icon
4. Select "High Contrast"
5. Look in Console for "ColorGuard overlay activated: high-contrast"
6. Page should look more contrasted
