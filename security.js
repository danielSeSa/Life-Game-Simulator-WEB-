// security.js
// This module contains functions to enhance basic security by disabling developer tools shortcuts.

/**
 * Initializes security features to prevent easy access to developer tools.
 * This is not a foolproof method but acts as a deterrent.
 */
export function initializeSecurity() {
  // Disable right-click context menu
  document.addEventListener('contextmenu', event => event.preventDefault());

  // Disable specific key combinations
  document.onkeydown = function (e) {
    // Disable F12
    if(e.keyCode == 123) {
        return false;
    }
    // Disable Ctrl+Shift+I
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)){
        return false;
    }
    // Disable Ctrl+Shift+C
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)){
        return false;
    }
    // Disable Ctrl+Shift+J
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)){
        return false;
    }
    // Disable Ctrl+U
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)){
        return false;
    }
  };
}