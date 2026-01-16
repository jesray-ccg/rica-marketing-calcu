/**
 * @fileoverview Utility functions for formatting and calculations
 * @module utils
 * 
 * Pure functions with no side effects - fully testable and reusable
 * Follows functional programming principles for maintainability
 */

import { LOCALE_CONFIG } from './constants';

/**
 * Formats a number as NZD currency without decimal places
 * Memoization candidate for performance optimization in high-frequency renders
 * 
 * @param {number} amount - The numeric value to format
 * @returns {string} Formatted currency string (e.g., "$1,234")
 * @example
 * formatCurrency(1234.56) // Returns "$1,235"
 */
export const formatCurrency = (amount) => {
  if (!isFinite(amount)) return '$0';
  
  try {
    return new Intl.NumberFormat(LOCALE_CONFIG.REGION, {
      style: 'currency',
      currency: LOCALE_CONFIG.CURRENCY,
      ...LOCALE_CONFIG.NUMBER_FORMAT,
    }).format(amount);
  } catch (error) {
    console.error('Currency formatting error:', error);
    return `$${Math.round(amount).toLocaleString()}`;
  }
};

/**
 * Formats a number with locale-appropriate thousand separators
 * 
 * @param {number} value - The numeric value to format
 * @returns {string} Formatted number string (e.g., "1,234")
 */
export const formatNumber = (value) => {
  if (!isFinite(value)) return '0';
  
  try {
    return new Intl.NumberFormat(LOCALE_CONFIG.REGION).format(Math.round(value));
  } catch (error) {
    console.error('Number formatting error:', error);
    return Math.round(value).toString();
  }
};

/**
 * Formats a decimal as a percentage
 * 
 * @param {number} value - Decimal value (0-1)
 * @param {number} decimals - Number of decimal places
 * @returns {string} Formatted percentage (e.g., "25.0%")
 */
export const formatPercentage = (value, decimals = 0) => {
  if (!isFinite(value)) return '0%';
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Safely parses a numeric input, returning 0 for invalid values
 * Prevents NaN propagation through calculations
 * 
 * @param {string|number} value - Input value to parse
 * @param {number} defaultValue - Fallback value if parsing fails
 * @returns {number} Parsed number or default
 */
export const safeParseFloat = (value, defaultValue = 0) => {
  const parsed = parseFloat(value);
  return isFinite(parsed) ? parsed : defaultValue;
};

/**
 * Validates a number is within specified range
 * 
 * @param {number} value - Value to validate
 * @param {number} min - Minimum allowed value
 * @param {number} max - Maximum allowed value
 * @returns {boolean} True if valid
 */
export const isWithinRange = (value, min, max) => {
  return isFinite(value) && value >= min && value <= max;
};

/**
 * Clamps a value between min and max bounds
 * 
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export const clamp = (value, min, max) => {
  return Math.min(Math.max(value, min), max);
};

/**
 * Calculates percentage split between two values
 * Used for channel distribution calculations
 * 
 * @param {number} value - The specific value
 * @param {number} total - The total value
 * @returns {number} Percentage (0-100)
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return (value / total) * 100;
};

/**
 * Rounds to specified decimal places
 * More precise than toFixed() for calculations
 * 
 * @param {number} value - Value to round
 * @param {number} decimals - Number of decimal places
 * @returns {number} Rounded value
 */
export const roundToDecimals = (value, decimals = 2) => {
  const multiplier = Math.pow(10, decimals);
  return Math.round(value * multiplier) / multiplier;
};
