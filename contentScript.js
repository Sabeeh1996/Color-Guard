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
   * Can combine multiple modes simultaneously
   */
  function applyDirectCSSFilter(settings) {
    console.log('[ColorGuard] Applying filters with settings:', settings);
    
    // Build combined CSS filter
    const filters = [];
    
    // High Contrast
    if (settings.enableHighContrast) {
      const contrastLevel = settings.contrastLevel || 2.5;
      const brightness = 1.0 + (contrastLevel - 1.0) * 0.1;
      filters.push(`contrast(${contrastLevel})`);
      filters.push(`brightness(${brightness})`);
      console.log('[ColorGuard] ✓ High-contrast:', contrastLevel + 'x contrast,', brightness.toFixed(2) + 'x brightness');
    }
    
    // Hue Shift
    if (settings.enableHueShift) {
      const hueAmount = settings.hueShiftAmount || 90;
      const saturation = 1.0 + (hueAmount / 180) * 0.5;
      filters.push(`hue-rotate(${hueAmount}deg)`);
      filters.push(`saturate(${saturation.toFixed(2)})`);
      console.log('[ColorGuard] ✓ Hue-shift:', hueAmount + '° rotation,', saturation.toFixed(2) + 'x saturation');
    }
    
    // Apply combined filters
    if (filters.length > 0) {
      const filterValue = filters.join(' ');
      document.documentElement.style.filter = filterValue;
      document.documentElement.style.webkitFilter = filterValue;
    } else {
      document.documentElement.style.filter = '';
      document.documentElement.style.webkitFilter = '';
    }
    
    // Edge Highlight
    if (settings.enableEdgeHighlight) {
      const thickness = settings.outlineThickness || 2;
      console.log('[ColorGuard] ✓ Edge-highlight:', thickness + 'px thickness');
      applyEdgeHighlight(thickness);
    } else {
      removeEdgeCanvas();
    }
    
    const enabledModes = [];
    if (settings.enableHighContrast) enabledModes.push('High Contrast');
    if (settings.enableHueShift) enabledModes.push('Hue Shift');
    if (settings.enableEdgeHighlight) enabledModes.push('Edge Highlight');
    console.log('[ColorGuard] Active modes:', enabledModes.length ? enabledModes.join(' + ') : 'None');
  }
  
  /**
   * Apply edge highlighting using CSS outline injection
   * More reliable than canvas for interactive elements
   */
  let edgeStyleElement = null;
  
  function applyEdgeHighlight(thickness) {
    removeEdgeCanvas();
    
    // Create or update style element
    if (!edgeStyleElement) {
      edgeStyleElement = document.createElement('style');
      edgeStyleElement.id = 'colorguard-edge-styles';
      document.head.appendChild(edgeStyleElement);
    }
    
    // CSS to highlight interactive elements
    const outlineColor = '#FFD700'; // Gold/yellow for visibility
    const outlineStyle = `${thickness}px solid ${outlineColor}`;
    
    edgeStyleElement.textContent = `
      /* ColorGuard Edge Highlighting */
      a:not([href=""]),
      button:not([disabled]),
      input:not([type="hidden"]):not([disabled]),
      select:not([disabled]),
      textarea:not([disabled]),
      [role="button"]:not([aria-disabled="true"]),
      [role="link"],
      [onclick],
      [tabindex]:not([tabindex="-1"]) {
        outline: ${outlineStyle} !important;
        outline-offset: 1px !important;
      }
      
      /* Focus state - make it even more visible */
      a:focus,
      button:focus,
      input:focus,
      select:focus,
      textarea:focus {
        outline: ${thickness + 1}px solid #FF6B00 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 8px ${outlineColor} !important;
      }
    `;
    
    console.log('[ColorGuard] ✓ Edge highlighting applied with', thickness + 'px outlines');
  }
  
  /**
   * Remove edge canvas and style elements
   */
  function removeEdgeCanvas() {
    // Remove any canvas elements
    const canvas = document.getElementById('colorguard-edge-canvas');
    if (canvas) {
      canvas.remove();
    }
    
    // Remove style element
    const styleEl = document.getElementById('colorguard-edge-styles');
    if (styleEl) {
      styleEl.remove();
    }
    edgeStyleElement = null;
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
    
    // Remove edge highlighting
    removeEdgeCanvas();
    
    console.log('[ColorGuard] All filters cleared, overlay deactivated');
    
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
    
    if (message.action === 'settingsChanged') {
      // Keyboard shortcut or popup changed settings
      console.log('[ColorGuard] Settings changed');
      // Fetch latest settings
      chrome.storage.sync.get(null, (fullSettings) => {
        applySettings(fullSettings);
        sendResponse({ success: true });
      });
      return true; // Async response
    }
    
    if (message.action === 'settingsUpdated') {
      // Options page updated settings - includes all current values
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
   * This ensures real-time updates when sliders are moved in options page
   */
  chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && currentSettings) {
      // Rebuild settings object with all changes
      const updatedSettings = { ...currentSettings };
      
      for (const [key, { newValue }] of Object.entries(changes)) {
        updatedSettings[key] = newValue;
        console.log('[ColorGuard] Storage changed:', key, '→', newValue);
      }
      
      // Only reapply if relevant settings changed
      const relevantKeys = [
        'enableHighContrast', 'enableHueShift', 'enableEdgeHighlight',
        'contrastLevel', 'hueShiftAmount', 'outlineThickness'
      ];
      const relevantChange = Object.keys(changes).some(key => relevantKeys.includes(key));
      
      if (relevantChange) {
        console.log('[ColorGuard] Reapplying due to settings change');
        applySettings(updatedSettings);
      }
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
