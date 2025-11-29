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
  const modeRadios = document.querySelectorAll('input[name="mode"]');
  
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
        if (namespace === 'sync' && changes.mode) {
          currentSettings.mode = changes.mode.newValue;
          updateUI();
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
    // Check the appropriate radio button
    modeRadios.forEach(radio => {
      radio.checked = (radio.value === currentSettings.mode);
    });
    
    // Highlight active mode option
    modeOptions.forEach(option => {
      const mode = option.dataset.mode;
      if (mode === currentSettings.mode) {
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
    modeRadios.forEach(radio => {
      radio.addEventListener('change', handleModeChange);
    });
    
    // Make entire mode-option div clickable
    modeOptions.forEach(option => {
      option.addEventListener('click', (e) => {
        // Don't handle if clicking the radio directly (already handled)
        if (e.target.tagName !== 'INPUT') {
          const radio = option.querySelector('input[type="radio"]');
          radio.checked = true;
          radio.dispatchEvent(new Event('change'));
        }
      });
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
    const newMode = e.target.value;
    
    try {
      // Update mode in current settings
      currentSettings.mode = newMode;
      
      // Save to storage and notify service worker
      // Send complete settings object to ensure contrast/hue/edge values are included
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: currentSettings
      });
      
      // Update UI
      updateUI();
      
      console.log('Mode changed to:', newMode, 'with settings:', currentSettings);
      
      // Show visual confirmation
      const modeOption = document.querySelector(`.mode-option[data-mode="${newMode}"]`);
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
