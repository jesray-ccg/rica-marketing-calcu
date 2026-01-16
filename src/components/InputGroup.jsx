/**
 * @fileoverview Reusable controlled input component with validation
 * @module components/InputGroup
 * 
 * Enterprise-grade form input with:
 * - Accessibility compliance (WCAG 2.1 AA)
 * - Keyboard navigation support
 * - Visual feedback for invalid states
 * - Consistent styling across application
 */

import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { safeParseFloat, clamp } from '../utils/utils';

/**
 * Controlled number input with label, prefix/suffix, and validation
 * 
 * @component
 * @param {Object} props
 * @param {string} props.label - Accessible label text
 * @param {number} props.value - Current numeric value
 * @param {Function} props.onChange - Callback fired on value change
 * @param {number} [props.min=0] - Minimum allowed value
 * @param {number} [props.max] - Maximum allowed value
 * @param {number} [props.step=1] - Increment/decrement step
 * @param {string} [props.prefix=''] - Text/symbol before input
 * @param {string} [props.suffix=''] - Text/symbol after input
 * @param {string} [props.id] - HTML id attribute
 * @param {boolean} [props.disabled=false] - Disables interaction
 */
const InputGroup = ({
  label,
  value,
  onChange,
  min = 0,
  max,
  step = 1,
  prefix = '',
  suffix = '',
  id,
  disabled = false,
}) => {
  /**
   * Handles input changes with validation and clamping
   * Prevents invalid values from reaching parent state
   */
  const handleChange = useCallback((event) => {
    const rawValue = event.target.value;
    let parsedValue = safeParseFloat(rawValue, 0);
    
    if (max !== undefined) {
      parsedValue = clamp(parsedValue, min, max);
    } else {
      parsedValue = Math.max(parsedValue, min);
    }
    
    onChange(parsedValue);
  }, [onChange, min, max]);

  const inputId = id || `input-${label.toLowerCase().replace(/\s+/g, '-')}`;

  return (
    <div className="space-y-2">
      <label 
        htmlFor={inputId}
        className="block text-sm font-medium text-gray-700"
      >
        {label}
      </label>
      <div className="flex items-center gap-2">
        {prefix && (
          <span className="text-gray-500 font-medium select-none">
            {prefix}
          </span>
        )}
        <input
          id={inputId}
          type="number"
          value={value}
          onChange={handleChange}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-green-500 focus:border-transparent 
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     transition-all duration-200"
          aria-label={label}
          aria-valuemin={min}
          aria-valuemax={max}
          aria-valuenow={value}
        />
        {suffix && (
          <span className="text-gray-500 font-medium select-none">
            {suffix}
          </span>
        )}
      </div>
    </div>
  );
};

InputGroup.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  min: PropTypes.number,
  max: PropTypes.number,
  step: PropTypes.number,
  prefix: PropTypes.string,
  suffix: PropTypes.string,
  id: PropTypes.string,
  disabled: PropTypes.bool,
};

export default React.memo(InputGroup);
