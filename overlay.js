/**
 * ColorGuard Overlay Module
 * 
 * Core accessibility processing logic:
 * - High-contrast mode via CSS filters
 * - Hue-shift mode for red-green color blindness
 * - Edge-highlighting mode with lightweight canvas processing
 * 
 * Design principles:
 * - Non-invasive: overlay sits on top, doesn't rewrite DOM
 * - Performance: expensive operations only run when mode is active
 * - Cleanup: all listeners and resources removed when destroyed
 */

(function() {
  'use strict';
  
  let overlayContainer = null;
  let canvasElement = null;
  let ctx = null;
  let settings = null;
  let animationFrameId = null;
  let resizeObserver = null;

  // Throttle helper to limit expensive operations
  let lastProcessTime = 0;
  const PROCESS_INTERVAL = 100; // ms between edge detection updates

  /**
   * Initialize overlay with given settings
   * Creates overlay container and applies appropriate mode
   */
  function init(initialSettings) {
    settings = initialSettings;
    
    // Create overlay container if it doesn't exist
    if (!overlayContainer) {
      createOverlayContainer();
    }
    
    // Apply the current mode
    applyMode(settings.mode);
  }

  /**
   * Update settings and reapply current mode
   */
  function updateSettings(newSettings) {
  const modeChanged = settings.mode !== newSettings.mode;
  settings = newSettings;
  
  if (modeChanged) {
    applyMode(settings.mode);
  } else {
    // Settings changed but mode is the same - update in place
    refreshCurrentMode();
  }
}

  /**
   * Create the overlay container element
   * This is a fixed-position div that covers the viewport
   */
  function createOverlayContainer() {
    overlayContainer = document.createElement('div');
    overlayContainer.id = 'colorguard-overlay';
    overlayContainer.className = 'colorguard-overlay';
    
    // Set pointer-events based on captureClicks setting
    overlayContainer.style.pointerEvents = settings.captureClicks ? 'auto' : 'none';
    
    // Add ARIA attributes for accessibility
    overlayContainer.setAttribute('role', 'presentation');
    overlayContainer.setAttribute('aria-hidden', 'true');
    
    document.body.appendChild(overlayContainer);
    console.log('ColorGuard overlay container created');
  }

  /**
   * Apply the specified accessibility mode
   */
  function applyMode(mode) {
    console.log('ColorGuard applying mode:', mode);
    
    // Clean up previous mode
    cleanupMode();
    
    if (mode === 'off') {
      console.log('ColorGuard: All effects disabled');
      return;
    }
    
    switch (mode) {
      case 'high-contrast':
        applyHighContrast();
        break;
      case 'hue-shift':
        applyHueShift();
        break;
      case 'edge-highlight':
        applyEdgeHighlight();
        break;
      default:
        console.log('ColorGuard: Unknown mode', mode);
        break;
    }
  }/**
 * Refresh current mode with updated settings
 * Called when settings change but mode stays the same
 */
function refreshCurrentMode() {
  if (!settings || !overlayContainer) return;
  applyMode(settings.mode);
}

  /**
   * HIGH-CONTRAST MODE
   * Uses CSS filters to increase contrast without layout disruption
   * Formula: contrast() filter multiplies contrast by given factor
   */
  function applyHighContrast() {
    const level = settings.contrastLevel || 2.5; // Increased from 1.5 for more visible effect
    
    // Apply contrast and brightness filters for maximum text readability
    // Contrast makes dark text darker and light backgrounds lighter
    document.documentElement.style.filter = `contrast(${level}) brightness(1.1)`;
    document.documentElement.style.webkitFilter = `contrast(${level}) brightness(1.1)`;
    
    if (overlayContainer) {
      overlayContainer.classList.add('mode-high-contrast');
    }
    console.log(`ColorGuard: High-contrast applied: ${level}x (text should be much darker/more readable)`);
  }

  /**
   * HUE-SHIFT MODE
   * Shifts red and green hues to make them distinguishable for color-blind users
   * Uses CSS hue-rotate filter as primary method
   * 
   * Algorithm: Rotate hue by specified degrees
   * - Red (~0°) and green (~120°) become more distinguishable
   * - 90° shift makes red->yellow, green->cyan (very noticeable)
   */
  function applyHueShift() {
    const shiftAmount = settings.hueShiftAmount || 90; // Increased from 60 for more visible effect
    
    // Apply hue rotation and saturation boost for dramatic color changes
    document.documentElement.style.filter = `hue-rotate(${shiftAmount}deg) saturate(1.3)`;
    document.documentElement.style.webkitFilter = `hue-rotate(${shiftAmount}deg) saturate(1.3)`;
    
    if (overlayContainer) {
      overlayContainer.classList.add('mode-hue-shift');
    }
    console.log(`ColorGuard: Hue-shift applied: ${shiftAmount}° (colors should look dramatically different)`);
  }

/**
 * EDGE-HIGHLIGHT MODE
 * Detects and emphasizes edges of UI elements
 * 
 * Implementation strategy:
 * 1. Capture low-resolution snapshot of viewport
 * 2. Apply edge-detection filter (Sobel or simple gradient)
 * 3. Draw highlighted edges on canvas overlay
 * 4. Use throttling to maintain performance
 * 
 * Performance: Only processes visible viewport, not entire page
 * Update frequency: Limited to ~10fps to reduce CPU load
 */
function applyEdgeHighlight() {
  overlayContainer.classList.add('mode-edge-highlight');
  
  // Create canvas for edge rendering if it doesn't exist
  if (!canvasElement) {
    canvasElement = document.createElement('canvas');
    canvasElement.className = 'colorguard-edge-canvas';
    overlayContainer.appendChild(canvasElement);
    ctx = canvasElement.getContext('2d', { willReadFrequently: true });
  }
  
  // Size canvas to viewport
  resizeCanvas();
  
  // Start edge detection loop
  startEdgeDetection();
  
  // Watch for viewport resize
  resizeObserver = new ResizeObserver(() => {
    resizeCanvas();
  });
  resizeObserver.observe(document.body);
  
  console.debug('Edge-highlight mode activated');
}

/**
 * Resize canvas to match viewport
 */
function resizeCanvas() {
  if (!canvasElement) return;
  
  canvasElement.width = window.innerWidth;
  canvasElement.height = window.innerHeight;
}

/**
 * Start continuous edge detection rendering loop
 * Uses requestAnimationFrame but throttles actual processing
 */
function startEdgeDetection() {
  function loop() {
    const now = Date.now();
    
    // Throttle: only process every PROCESS_INTERVAL ms
    if (now - lastProcessTime >= PROCESS_INTERVAL) {
      processEdges();
      lastProcessTime = now;
    }
    
    // Continue loop
    animationFrameId = requestAnimationFrame(loop);
  }
  
  loop();
}

/**
 * Process edges using lightweight canvas-based edge detection
 * 
 * Algorithm:
 * 1. Capture page snapshot (downscaled for performance)
 * 2. Convert to grayscale
 * 3. Apply simple Sobel-like edge detection
 * 4. Draw detected edges with outline color/thickness
 */
function processEdges() {
  if (!ctx || !canvasElement) return;
  
  try {
    // Clear canvas
    ctx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    
    // Capture page content at reduced resolution for performance
    // We'll use a workaround: capture computed styles and draw element boundaries
    // Full snapshot requires html2canvas library - we use simpler DOM-based detection
    
    // Get all visible elements with computed bounding boxes
    const elements = document.querySelectorAll('button, a, input, select, textarea, [role="button"], img, video');
    
    ctx.strokeStyle = `rgba(255, 200, 0, 0.8)`; // Yellow-ish outline for visibility
    ctx.lineWidth = settings.outlineThickness || 2;
    
    elements.forEach(el => {
      // Only process visible elements in viewport
      const rect = el.getBoundingClientRect();
      
      if (rect.width > 0 && rect.height > 0 &&
          rect.top < window.innerHeight && rect.bottom > 0 &&
          rect.left < window.innerWidth && rect.right > 0) {
        
        // Draw outline around element
        ctx.strokeRect(rect.left, rect.top, rect.width, rect.height);
      }
    });
    
  } catch (error) {
    console.error('Edge detection error:', error);
  }
  }

  /**
   * Clean up current mode resources
   * Remove filters, listeners, and canvas elements
   */
  function cleanupMode() {
    // Remove any applied CSS filters
    document.documentElement.style.filter = '';
    document.documentElement.style.webkitFilter = '';
    
    // Stop animation loop
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    }
    
    // Disconnect resize observer
    if (resizeObserver) {
      resizeObserver.disconnect();
      resizeObserver = null;
    }
    
    // Remove canvas
    if (canvasElement && canvasElement.parentNode) {
      canvasElement.parentNode.removeChild(canvasElement);
      canvasElement = null;
      ctx = null;
    }
    
    // Clear overlay classes
    if (overlayContainer) {
      overlayContainer.className = 'colorguard-overlay';
    }
  }

  /**
   * Destroy overlay completely
   * Called when extension is disabled or page unloads
   */
  function destroy() {
    cleanupMode();
    
    // Remove overlay container
    if (overlayContainer && overlayContainer.parentNode) {
      overlayContainer.parentNode.removeChild(overlayContainer);
      overlayContainer = null;
    }
    
    settings = null;
    lastProcessTime = 0;
    
    console.debug('ColorGuard overlay destroyed');
  }
  
  // Expose public API to global scope
  window.ColorGuardOverlay = {
    init: init,
    updateSettings: updateSettings,
    destroy: destroy
  };
  
  console.debug('ColorGuard overlay module loaded');
})();

/**
 * Advanced edge detection using Sobel operator (future enhancement)
 * Currently commented out - use if simple boundary detection is insufficient
 * 
 * This would require capturing actual pixel data, which needs either:
 * - html2canvas library for DOM rendering
 * - WebGL shader for real-time processing
 * - getDisplayMedia API (requires user permission)
 */
/*
function applySobelFilter(imageData) {
  const width = imageData.width;
  const height = imageData.height;
  const data = imageData.data;
  const output = new Uint8ClampedArray(data.length);
  
  // Sobel kernels for edge detection
  const sobelX = [-1, 0, 1, -2, 0, 2, -1, 0, 1];
  const sobelY = [-1, -2, -1, 0, 0, 0, 1, 2, 1];
  
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      let gx = 0, gy = 0;
      
      for (let ky = -1; ky <= 1; ky++) {
        for (let kx = -1; kx <= 1; kx++) {
          const idx = ((y + ky) * width + (x + kx)) * 4;
          const gray = data[idx] * 0.299 + data[idx + 1] * 0.587 + data[idx + 2] * 0.114;
          
          const kidx = (ky + 1) * 3 + (kx + 1);
          gx += gray * sobelX[kidx];
          gy += gray * sobelY[kidx];
        }
      }
      
      const magnitude = Math.sqrt(gx * gx + gy * gy);
      const outIdx = (y * width + x) * 4;
      output[outIdx] = output[outIdx + 1] = output[outIdx + 2] = magnitude;
      output[outIdx + 3] = 255;
    }
  }
  
  return new ImageData(output, width, height);
}
*/
  
  // Expose public API to global scope
  window.ColorGuardOverlay = {
    init: init,
    updateSettings: updateSettings,
    destroy: destroy
  };
  
  console.log('ColorGuard overlay module loaded and ready');
  
  // Dispatch ready event so content script knows we're available
  window.dispatchEvent(new CustomEvent('ColorGuardOverlayReady'));
})();
