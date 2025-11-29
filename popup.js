/**
 * ColorGuard Popup Script
 * 
 * Manages the popup UI:
 * - Load and display current settings
 * - Handle mode selection changes
 * - Show current domain status
 * - Open options page
 */

(async function() {
  'use strict';
  
  // DOM elements
  const loadingEl = document.getElementById('loading');
  const contentEl = document.getElementById('content');
  const currentDomainEl = document.getElementById('currentDomain');
  const openOptionsBtn = document.getElementById('openOptions');
  const modeOptions = document.querySelectorAll('.mode-option');
  const modeCheckboxes = document.querySelectorAll('input[type="checkbox"]');
  
  let currentSettings = null;
  
  /**
   * Initialize popup
   */
  async function init() {
    try {
      // Get current settings from service worker
      currentSettings = await chrome.runtime.sendMessage({ action: 'getSettings' });
      
      // Get current tab to show domain
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab?.url) {
        const url = new URL(tab.url);
        currentDomainEl.textContent = url.hostname || url.href;
      }
      
      // Update UI with current settings
      updateUI();
      
      // Hide loading, show content
      loadingEl.style.display = 'none';
      contentEl.style.display = 'block';
      
      // Attach event listeners
      attachListeners();
      
      // Listen for storage changes (from keyboard shortcut or other popup instances)
      chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
          if (changes.enableHighContrast || changes.enableHueShift || changes.enableEdgeHighlight) {
            if (changes.enableHighContrast) currentSettings.enableHighContrast = changes.enableHighContrast.newValue;
            if (changes.enableHueShift) currentSettings.enableHueShift = changes.enableHueShift.newValue;
            if (changes.enableEdgeHighlight) currentSettings.enableEdgeHighlight = changes.enableEdgeHighlight.newValue;
            updateUI();
          }
        }
      });
      
    } catch (error) {
      console.error('Popup init error:', error);
      loadingEl.textContent = 'Error loading settings';
    }
  }
  
  /**
   * Update UI to reflect current settings
   */
  function updateUI() {
    // Update checkboxes
    document.getElementById('mode-contrast').checked = currentSettings.enableHighContrast || false;
    document.getElementById('mode-hue').checked = currentSettings.enableHueShift || false;
    document.getElementById('mode-edge').checked = currentSettings.enableEdgeHighlight || false;
    
    // Highlight active mode options
    modeOptions.forEach(option => {
      const mode = option.dataset.mode;
      const isActive = (
        (mode === 'high-contrast' && currentSettings.enableHighContrast) ||
        (mode === 'hue-shift' && currentSettings.enableHueShift) ||
        (mode === 'edge-highlight' && currentSettings.enableEdgeHighlight)
      );
      
      if (isActive) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });
  }
  
  /**
   * Attach event listeners
   */
  function attachListeners() {
    // Mode selection change
    modeCheckboxes.forEach(checkbox => {
      checkbox.addEventListener('change', handleModeChange);
    });
    
    // Make entire mode-option div clickable
    modeOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        // Don't handle if clicking the checkbox directly (already handled)
        if (e.target.tagName !== 'INPUT') {
          const checkbox = option.querySelector('input[type="checkbox"]');
          checkbox.checked = !checkbox.checked;
          checkbox.dispatchEvent(new Event('change'));
        }
      });
    });
    
    // Turn off all modes
    const turnOffAllBtn = document.getElementById('turnOffAll');
    turnOffAllBtn.addEventListener('click', async () => {
      currentSettings.enableHighContrast = false;
      currentSettings.enableHueShift = false;
      currentSettings.enableEdgeHighlight = false;
      
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: currentSettings
      });
      
      updateUI();
      
      // Visual feedback
      turnOffAllBtn.textContent = '✓ All Off';
      setTimeout(() => {
        turnOffAllBtn.textContent = '⏹️ Turn Off All';
      }, 1000);
    });
    
    // Open options page
    openOptionsBtn.addEventListener('click', () => {
      chrome.runtime.openOptionsPage();
      // Close popup after opening options
      window.close();
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', handleKeyboard);
  }
  
  /**
   * Handle mode change
   */
  async function handleModeChange(e) {
    const checkbox = e.target;
    const mode = checkbox.value;
    const isChecked = checkbox.checked;
    
    try {
      // Update settings based on checkbox
      if (mode === 'high-contrast') {
        currentSettings.enableHighContrast = isChecked;
      } else if (mode === 'hue-shift') {
        currentSettings.enableHueShift = isChecked;
      } else if (mode === 'edge-highlight') {
        currentSettings.enableEdgeHighlight = isChecked;
      }
      
      // Save to storage and notify service worker
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: currentSettings
      });
      
      // Update UI
      updateUI();
      
      const enabledModes = [];
      if (currentSettings.enableHighContrast) enabledModes.push('High Contrast');
      if (currentSettings.enableHueShift) enabledModes.push('Hue Shift');
      if (currentSettings.enableEdgeHighlight) enabledModes.push('Edge Highlight');
      
      console.log('Active modes:', enabledModes.length ? enabledModes.join(' + ') : 'None', 'with settings:', currentSettings);
      
      // Show visual confirmation
      const modeOption = document.querySelector(`.mode-option[data-mode="${mode}"]`);
      if (modeOption) {
        modeOption.style.transform = 'scale(1.05)';
        setTimeout(() => {
          modeOption.style.transform = '';
        }, 200);
      }
      
    } catch (error) {
      console.error('Error changing mode:', error);
    }
  }
  
  /**
   * Handle keyboard navigation
   * Arrow keys to navigate modes, Enter/Space to select
   */
  function handleKeyboard(e) {
    const currentIndex = Array.from(modeRadios).findIndex(r => r.checked);
    
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      
      let newIndex;
      if (e.key === 'ArrowDown') {
        newIndex = (currentIndex + 1) % modeRadios.length;
      } else {
        newIndex = (currentIndex - 1 + modeRadios.length) % modeRadios.length;
      }
      
      modeRadios[newIndex].focus();
      modeRadios[newIndex].checked = true;
      modeRadios[newIndex].dispatchEvent(new Event('change'));
    }
  }
  
  // Start the popup
  init();
})();
