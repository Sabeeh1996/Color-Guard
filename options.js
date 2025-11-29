/**
 * ColorGuard Options Page Script
 * 
 * Manages the options page:
 * - Load settings from storage
 * - Update UI controls with current values
 * - Handle user input and save settings
 * - Manage whitelist/blacklist domains
 */

(function() {
  'use strict';
  
  // DOM elements
  const contrastSlider = document.getElementById('contrastLevel');
  const contrastValue = document.getElementById('contrastValue');
  const hueSlider = document.getElementById('hueShiftAmount');
  const hueValue = document.getElementById('hueValue');
  const outlineSlider = document.getElementById('outlineThickness');
  const outlineValue = document.getElementById('outlineValue');
  const globalEnabledToggle = document.getElementById('globalEnabled');
  const captureClicksToggle = document.getElementById('captureClicks');
  const whitelistSection = document.getElementById('whitelistSection');
  const blacklistSection = document.getElementById('blacklistSection');
  const whitelistInput = document.getElementById('whitelistInput');
  const blacklistInput = document.getElementById('blacklistInput');
  const addWhitelistBtn = document.getElementById('addWhitelist');
  const addBlacklistBtn = document.getElementById('addBlacklist');
  const whitelistDomainsEl = document.getElementById('whitelistDomains');
  const blacklistDomainsEl = document.getElementById('blacklistDomains');
  const addCurrentSiteBtn = document.getElementById('addCurrentSite');
  const saveSettingsBtn = document.getElementById('saveSettings');
  const saveNotification = document.getElementById('saveNotification');
  
  let currentSettings = null;
  let currentTabDomain = null;
  
  /**
   * Initialize options page
   */
  async function init() {
    try {
      // Load settings from storage
      currentSettings = await chrome.runtime.sendMessage({ action: 'getSettings' });
      
      // Get current tab domain for "Add Current Site" feature
      try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        if (tab?.url) {
          const url = new URL(tab.url);
          currentTabDomain = url.hostname;
        }
      } catch (e) {
        // Ignore if can't get current tab
      }
      
      // Update UI with loaded settings
      updateUI();
      
      // Attach event listeners
      attachListeners();
      
    } catch (error) {
      console.error('Options init error:', error);
    }
  }
  
  /**
   * Update UI controls with current settings
   */
  function updateUI() {
    // Sliders
    contrastSlider.value = currentSettings.contrastLevel;
    contrastValue.textContent = currentSettings.contrastLevel.toFixed(1) + 'x';
    
    hueSlider.value = currentSettings.hueShiftAmount;
    hueValue.textContent = currentSettings.hueShiftAmount + '°';
    
    outlineSlider.value = currentSettings.outlineThickness;
    outlineValue.textContent = currentSettings.outlineThickness + 'px';
    
    // Toggles
    globalEnabledToggle.checked = currentSettings.globalEnabled;
    captureClicksToggle.checked = currentSettings.captureClicks;
    
    // Show/hide whitelist/blacklist sections based on globalEnabled
    updateListVisibility();
    
    // Render domain lists
    renderDomainList('whitelist');
    renderDomainList('blacklist');
    
    // Update "Add Current Site" button text
    if (currentTabDomain) {
      addCurrentSiteBtn.textContent = `➕ Add ${currentTabDomain}`;
    } else {
      addCurrentSiteBtn.disabled = true;
      addCurrentSiteBtn.textContent = '➕ Add Current Site (unavailable)';
    }
  }
  
  /**
   * Show/hide whitelist or blacklist based on globalEnabled setting
   */
  function updateListVisibility() {
    if (currentSettings.globalEnabled) {
      whitelistSection.style.display = 'none';
      blacklistSection.style.display = 'block';
    } else {
      whitelistSection.style.display = 'block';
      blacklistSection.style.display = 'none';
    }
  }
  
  /**
   * Render domain list (whitelist or blacklist)
   */
  function renderDomainList(type) {
    const list = type === 'whitelist' ? currentSettings.whitelist : currentSettings.blacklist;
    const containerEl = type === 'whitelist' ? whitelistDomainsEl : blacklistDomainsEl;
    
    containerEl.innerHTML = '';
    
    if (list.length === 0) {
      const emptyItem = document.createElement('li');
      emptyItem.className = 'domain-item';
      emptyItem.textContent = `No domains in ${type}`;
      emptyItem.style.background = 'transparent';
      emptyItem.style.color = '#5f6368';
      containerEl.appendChild(emptyItem);
      return;
    }
    
    list.forEach(domain => {
      const item = document.createElement('li');
      item.className = 'domain-item';
      
      const domainText = document.createElement('span');
      domainText.textContent = domain;
      
      const removeBtn = document.createElement('button');
      removeBtn.textContent = 'Remove';
      removeBtn.addEventListener('click', () => removeDomain(type, domain));
      
      item.appendChild(domainText);
      item.appendChild(removeBtn);
      containerEl.appendChild(item);
    });
  }
  
  /**
   * Add domain to list
   */
  function addDomain(type, domain) {
    // Normalize domain (remove protocol, path, etc.)
    domain = domain.trim().toLowerCase();
    domain = domain.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
    
    if (!domain) {
      alert('Please enter a valid domain');
      return;
    }
    
    const list = type === 'whitelist' ? currentSettings.whitelist : currentSettings.blacklist;
    
    // Check if already exists
    if (list.includes(domain)) {
      alert(`${domain} is already in the ${type}`);
      return;
    }
    
    // Add to list
    list.push(domain);
    
    // Update UI
    renderDomainList(type);
    
    // Clear input
    if (type === 'whitelist') {
      whitelistInput.value = '';
    } else {
      blacklistInput.value = '';
    }
    
    // Show save reminder
    showSaveReminder();
  }
  
  /**
   * Remove domain from list
   */
  function removeDomain(type, domain) {
    const list = type === 'whitelist' ? currentSettings.whitelist : currentSettings.blacklist;
    const index = list.indexOf(domain);
    
    if (index > -1) {
      list.splice(index, 1);
      renderDomainList(type);
      showSaveReminder();
    }
  }
  
  /**
   * Show temporary save reminder
   */
  function showSaveReminder() {
    saveSettingsBtn.style.background = '#fbbc04';
    saveSettingsBtn.textContent = '⚠️ Save Changes to Apply';
    
    setTimeout(() => {
      saveSettingsBtn.style.background = '#1a73e8';
      saveSettingsBtn.textContent = '💾 Save All Settings';
    }, 3000);
  }
  
  /**
   * Save all settings
   */
  async function saveSettings() {
    try {
      // Update settings object from UI
      currentSettings.contrastLevel = parseFloat(contrastSlider.value);
      currentSettings.hueShiftAmount = parseInt(hueSlider.value);
      currentSettings.outlineThickness = parseInt(outlineSlider.value);
      currentSettings.globalEnabled = globalEnabledToggle.checked;
      currentSettings.captureClicks = captureClicksToggle.checked;
      
      // Save to storage via service worker
      await chrome.runtime.sendMessage({
        action: 'updateSettings',
        settings: currentSettings
      });
      
      // Show success notification
      showSaveNotification();
      
      console.log('Settings saved:', currentSettings);
      
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error saving settings. Please try again.');
    }
  }
  
  /**
   * Show save success notification
   */
  function showSaveNotification() {
    saveNotification.classList.add('show');
    
    setTimeout(() => {
      saveNotification.classList.remove('show');
    }, 3000);
  }
  
  /**
   * Attach event listeners
   */
  function attachListeners() {
    // Slider value updates
    contrastSlider.addEventListener('input', (e) => {
      contrastValue.textContent = parseFloat(e.target.value).toFixed(1) + 'x';
    });
    
    hueSlider.addEventListener('input', (e) => {
      hueValue.textContent = e.target.value + '°';
    });
    
    outlineSlider.addEventListener('input', (e) => {
      outlineValue.textContent = e.target.value + 'px';
    });
    
    // Global enabled toggle
    globalEnabledToggle.addEventListener('change', () => {
      currentSettings.globalEnabled = globalEnabledToggle.checked;
      updateListVisibility();
    });
    
    // Add domain buttons
    addWhitelistBtn.addEventListener('click', () => {
      addDomain('whitelist', whitelistInput.value);
    });
    
    addBlacklistBtn.addEventListener('click', () => {
      addDomain('blacklist', blacklistInput.value);
    });
    
    // Enter key in input fields
    whitelistInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addDomain('whitelist', whitelistInput.value);
      }
    });
    
    blacklistInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        addDomain('blacklist', blacklistInput.value);
      }
    });
    
    // Add current site button
    addCurrentSiteBtn.addEventListener('click', () => {
      if (currentTabDomain) {
        const type = currentSettings.globalEnabled ? 'blacklist' : 'whitelist';
        addDomain(type, currentTabDomain);
      }
    });
    
    // Save button
    saveSettingsBtn.addEventListener('click', saveSettings);
    
    // Auto-save on slider changes (optional, can be removed if too aggressive)
    /*
    contrastSlider.addEventListener('change', saveSettings);
    hueSlider.addEventListener('change', saveSettings);
    outlineSlider.addEventListener('change', saveSettings);
    captureClicksToggle.addEventListener('change', saveSettings);
    */
  }
  
  // Initialize options page
  init();
})();
