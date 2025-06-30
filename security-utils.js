// security-utils.js
// Security utilities for safe DOM manipulation and input sanitization

/**
 * Security utilities for safe DOM manipulation
 */
export class SecurityUtils {
  /**
   * Safely set text content of an element
   */
  static setTextContent(element, text) {
    if (!element) return;
    element.textContent = String(text || '');
  }

  /**
   * Safely set HTML content with basic sanitization
   */
  static setInnerHTML(element, html) {
    if (!element) return;
    // Basic HTML sanitization - remove script tags and on* attributes
    const sanitized = String(html || '')
      .replace(/<script[^>]*>.*?<\/script>/gi, '')
      .replace(/on\w+\s*=\s*"[^"]*"/gi, '')
      .replace(/on\w+\s*=\s*'[^']*'/gi, '')
      .replace(/javascript:/gi, '');
    element.innerHTML = sanitized;
  }

  /**
   * Safely create an element with attributes
   */
  static createElement(tagName, attributes = {}, textContent = '') {
    const element = document.createElement(tagName);
    
    // Set safe attributes
    Object.entries(attributes).forEach(([key, value]) => {
      if (key.startsWith('on')) {
        console.warn('Event handler attributes not allowed in createElement');
        return;
      }
      element.setAttribute(key, String(value));
    });
    
    if (textContent) {
      this.setTextContent(element, textContent);
    }
    
    return element;
  }

  /**
   * Sanitize input text for safe usage
   */
  static sanitizeText(input) {
    if (typeof input !== 'string') return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Validate and sanitize form input
   */
  static sanitizeFormInput(input) {
    if (typeof input !== 'string') return '';
    return input.trim().replace(/[<>]/g, '');
  }

  /**
   * Safely add event listener
   */
  static addEventListenerSafe(element, eventType, handler) {
    if (!element || typeof handler !== 'function') return;
    element.addEventListener(eventType, handler);
  }
}

/**
 * DOM utilities for safe manipulation
 */
export class DOMUtils {
  /**
   * Safely remove all children from an element
   */
  static clearChildren(element) {
    if (!element) return;
    while (element.firstChild) {
      element.removeChild(element.firstChild);
    }
  }

  /**
   * Safely append child element
   */
  static appendChild(parent, child) {
    if (!parent || !child) return;
    parent.appendChild(child);
  }

  /**
   * Find element safely with error handling
   */
  static getElementById(id) {
    try {
      return document.getElementById(id);
    } catch (error) {
      console.warn(`Element with id '${id}' not found:`, error);
      return null;
    }
  }

  /**
   * Find elements safely with error handling
   */
  static querySelectorAll(selector, parent = document) {
    try {
      return parent.querySelectorAll(selector);
    } catch (error) {
      console.warn(`Query selector '${selector}' failed:`, error);
      return [];
    }
  }
}

// Export default for backward compatibility
export default SecurityUtils;