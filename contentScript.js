/**
 * ColorGuard Content Script
 * 
 * Injected into every page to manage the accessibility overlay.
 * Responsibilities:
 * - Check if extension should be active on current domain
 * - Initialize and manage the overlay based on user settings
 * - Listen for settings changes from service worker
 * - Handle CSP detection and graceful degradation
 * - Minimal performance footprint when disabled
 */

// IMMEDIATE LOG - If you don't see this, content script isn't loading
console.log('[ColorGuard] Content script file loaded!');

(function() {
  'use strict';
  
  // State management
  let currentSettings = null;
  let overlayActive = false;
  let overlayModule = null;
  
  /**
   * Initialize the content script
   * Fetch settings and determine if overlay should be active
   */
  async function init() {
    console.log('ColorGuard content script initializing on:', window.location.hostname);
    
    try {
      // Request settings from service worker
      currentSettings = await chrome.runtime.sendMessage({ action: 'getSettings' });
      console.log('ColorGuard settings loaded:', currentSettings);
      
      // Check if extension should run on this domain
      if (shouldRunOnDomain()) {
        console.log('ColorGuard enabled on this domain');
        
        // Apply current settings directly
        await applySettings(currentSettings);
      } else {
        console.log('ColorGuard disabled on this domain (check whitelist/blacklist)');
      }
    } catch (error) {
      console.error('ColorGuard init error:', error);
      // Possible CSP violation - notify service worker
      try {
        chrome.runtime.sendMessage({ action: 'checkCSP', error: error.message });
      } catch (e) {
        // Cannot communicate with background, extension may be disabled
      }
    }
  }
  
  /**
   * Determine if extension should run on current domain
   * Based on globalEnabled, whitelist, and blacklist settings
   */
  function shouldRunOnDomain() {
    const hostname = window.location.hostname;
    
    if (currentSettings.globalEnabled) {
      // Check if domain is blacklisted
      return !currentSettings.blacklist.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
    } else {
      // Check if domain is whitelisted
      return currentSettings.whitelist.some(domain => 
        hostname === domain || hostname.endsWith('.' + domain)
      );
    }
  }
  
  /**
   * Apply CSS filters directly - simple and reliable
   * Works for high-contrast and hue-shift modes
   */
  function applyDirectCSSFilter(settings) {
    console.log('[ColorGuard] Applying CSS filter for mode:', settings.mode);
    
    // Clear any existing filters first
    document.documentElement.style.filter = '';
    document.documentElement.style.webkitFilter = '';
    
    switch(settings.mode) {
      case 'high-contrast':
        const contrastLevel = settings.contrastLevel || 2.5;
        const filterValue = `contrast(${contrastLevel}) brightness(1.1)`;
        document.documentElement.style.filter = filterValue;
        document.documentElement.style.webkitFilter = filterValue;
        console.log('[ColorGuard] ✓ High-contrast applied:', contrastLevel + 'x');
        console.log('[ColorGuard] Filter value:', document.documentElement.style.filter);
        break;
        
      case 'hue-shift':
        const hueAmount = settings.hueShiftAmount || 90;
        const hueFilter = `hue-rotate(${hueAmount}deg) saturate(1.3)`;
        document.documentElement.style.filter = hueFilter;
        document.documentElement.style.webkitFilter = hueFilter;
        console.log('[ColorGuard] ✓ Hue-shift applied:', hueAmount + '°');
        console.log('[ColorGuard] Filter value:', document.documentElement.style.filter);
        break;
        
      case 'edge-highlight':
        console.log('[ColorGuard] Edge-highlight mode - simple outline version');
        document.documentElement.style.filter = 'drop-shadow(0 0 2px yellow)';
        document.documentElement.style.webkitFilter = 'drop-shadow(0 0 2px yellow)';
        break;
        
      default:
        console.log('[ColorGuard] Unknown mode:', settings.mode);
    }
  }
  
  /**
   * Apply settings and activate/deactivate overlay as needed
   */
  async function applySettings(settings) {
    console.log('[ColorGuard] applySettings called with mode:', settings.mode);
    currentSettings = settings;
    
    if (settings.mode === 'off') {
      console.log('[ColorGuard] Mode is OFF, deactivating');
      deactivateOverlay();
    } else {
      console.log('[ColorGuard] Mode is', settings.mode, '- activating');
      // Use direct CSS approach - it's simpler and more reliable
      applyDirectCSSFilter(settings);
      overlayActive = true;
    }
  }
  

  
  /**
   * Deactivate the overlay and clean up resources
   */
  function deactivateOverlay() {
    if (!overlayActive) return;
    
    // Clear all CSS filters
    document.documentElement.style.filter = '';
    document.documentElement.style.webkitFilter = '';
    console.log('[ColorGuard] Filters cleared, overlay deactivated');
    
    overlayActive = false;
  }
  
  /**
   * Notify user of CSP issues via console
   * In production, this could show a small unobtrusive notification
   */
  function notifyCSPIssue() {
    console.warn(
      'ColorGuard: This page\'s Content Security Policy (CSP) blocks the accessibility overlay. ' +
      'The extension cannot modify this page for security reasons.'
    );
    
    // Notify service worker
    chrome.runtime.sendMessage({ action: 'checkCSP' }).catch(() => {});
  }
  
  /**
   * Listen for messages from service worker (settings updates, mode changes)
   */
  chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'ping') {
      // Service worker checking if content script is injected
      sendResponse({ injected: true });
      return true;
    }
    
    if (message.action === 'modeChanged') {
      // Keyboard shortcut or popup changed the mode
      console.log('[ColorGuard] Mode changed to:', message.mode);
      applySettings({ ...currentSettings, mode: message.mode });
      sendResponse({ success: true });
      return true;
    }
    
    if (message.action === 'settingsUpdated') {
      // Options page updated settings
      console.log('[ColorGuard] Settings updated:', message.settings);
      applySettings(message.settings);
      sendResponse({ success: true });
      return true;
    }
    
    sendResponse({ received: true });
    return false; // Synchronous response
  });
  
  /**
   * Listen for storage changes directly (backup mechanism)
   * Service worker messages are primary, but this catches edge cases
   */
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && currentSettings) {
      // Rebuild settings object with changes
      const updatedSettings = { ...currentSettings };
      for (const [key, { newValue }] of Object.entries(changes)) {
        updatedSettings[key] = newValue;
      }
      applySettings(updatedSettings);
    }
  });
  
  /**
   * Clean up on page unload
   * Important to prevent memory leaks in single-page apps
   */
  window.addEventListener('beforeunload', () => {
    deactivateOverlay();
  });
  
  // Start the content script
  init();
})();
