/**
 * ColorGuard Service Worker (Manifest V3 Background Script)
 * 
 * Responsibilities:
 * - Listen for keyboard shortcut commands
 * - Manage extension state and settings in chrome.storage
 * - Handle messages from content scripts and popup/options pages
 * - Provide centralized state management for all tabs
 */

// Default settings for first-time users
const DEFAULT_SETTINGS = {
  mode: 'off', // 'off', 'high-contrast', 'hue-shift', 'edge-highlight'
  globalEnabled: true, // Apply to all sites vs whitelist/blacklist
  whitelist: [], // Array of domains where extension is enabled
  blacklist: [], // Array of domains where extension is disabled
  contrastLevel: 2.5, // Multiplier for contrast enhancement (increased for visibility)
  hueShiftAmount: 90, // Degrees to shift red/green hues (increased for visibility)
  outlineThickness: 2, // Pixels for edge highlighting
  captureClicks: false // Whether overlay intercepts pointer events
};

/**
 * Initialize extension on install
 * Set up default settings in storage
 */
chrome.runtime.onInstalled.addListener(async () => {
  console.log('ColorGuard installed');
  
  // Initialize settings if not already present
  const stored = await chrome.storage.sync.get(DEFAULT_SETTINGS);
  await chrome.storage.sync.set(stored);
});

/**
 * Handle keyboard shortcut (Ctrl+Shift+Y by default)
 * Toggle between off and last active mode
 */
chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'toggle-overlay') {
    const settings = await chrome.storage.sync.get(['mode', 'lastActiveMode']);
    
    let newMode;
    if (settings.mode === 'off') {
      // Turn on: restore last active mode or default to high-contrast
      newMode = settings.lastActiveMode || 'high-contrast';
    } else {
      // Turn off: save current mode as last active
      await chrome.storage.sync.set({ lastActiveMode: settings.mode });
      newMode = 'off';
    }
    
    // Update mode in storage (content scripts listen for changes)
    await chrome.storage.sync.set({ mode: newMode });
    
    // Notify all tabs to update their overlays
    broadcastToAllTabs({ action: 'modeChanged', mode: newMode });
  }
});

/**
 * Listen for messages from content scripts, popup, and options page
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'getSettings') {
    // Return current settings
    chrome.storage.sync.get(DEFAULT_SETTINGS).then(sendResponse);
    return true; // Indicate async response
  }
  
  if (message.action === 'updateSettings') {
    // Update settings and notify all tabs
    chrome.storage.sync.set(message.settings).then(async () => {
      // Ensure content scripts are injected in all tabs
      await ensureContentScriptsInjected();
      
      // Broadcast to all tabs
      await broadcastToAllTabs({ 
        action: 'settingsUpdated', 
        settings: message.settings 
      });
      sendResponse({ success: true });
    });
    return true; // Indicate async response
  }
  
  if (message.action === 'checkCSP') {
    // Content script detected CSP violation
    // Log for debugging but don't interrupt user
    console.warn('CSP detected on', sender.tab?.url);
    sendResponse({ acknowledged: true });
    return false;
  }
});

/**
 * Helper: Ensure content scripts are injected in all eligible tabs
 * This is called before broadcasting to ensure all tabs can receive the message
 */
async function ensureContentScriptsInjected() {
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    // Skip chrome:// and other privileged URLs
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://') && !tab.url.startsWith('about:')) {
      try {
        // Try to ping the content script
        await chrome.tabs.sendMessage(tab.id, { action: 'ping' });
      } catch (error) {
        // Content script not injected, inject it now
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['contentScript.js']
          });
          console.log('Injected content script into tab', tab.id);
        } catch (injectError) {
          // Can't inject (restricted page or error), skip silently
          console.debug('Could not inject into tab', tab.id, injectError.message);
        }
      }
    }
  }
}

/**
 * Helper: Send message to all tabs
 * Used to synchronize settings changes across open pages
 */
async function broadcastToAllTabs(message) {
  const tabs = await chrome.tabs.query({});
  
  for (const tab of tabs) {
    // Skip chrome:// and other privileged URLs
    if (tab.url && !tab.url.startsWith('chrome://') && !tab.url.startsWith('chrome-extension://')) {
      try {
        await chrome.tabs.sendMessage(tab.id, message);
      } catch (error) {
        // Tab may not have content script injected yet, ignore
        console.debug('Could not message tab', tab.id, error.message);
      }
    }
  }
}

/**
 * Monitor storage changes and keep service worker state in sync
 * Useful for debugging and future enhancements
 */
chrome.storage.onChanged.addListener((changes, namespace) => {
  if (namespace === 'sync') {
    console.debug('Settings changed:', Object.keys(changes));
  }
});
