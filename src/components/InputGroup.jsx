/**
 * @fileoverview Real-time input component with immediate validation
 * @version 2.1.1
 * 
 * Pattern: Optimistic updates with graceful error recovery
 * Best for: Dashboards requiring instant feedback
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { clamp } from '../utils/utils';

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
  const [displayValue, setDisplayValue] = useState(String(value));
  const previousValueRef = useRef(value);

  // Sync display with external value changes
  useEffect(() => {
    if (previousValueRef.current !== value) {
      setDisplayValue(String(value));
      previousValueRef.current = value;
    }
  }, [value]);

  /**
   * Real-time validation with graceful handling
   * Updates parent immediately for valid numbers
   */
  const handleChange = useCallback((event) => {
    const newValue = event.target.value;
    setDisplayValue(newValue);
    
    // Attempt to parse and validate
    const parsed = parseFloat(newValue);
    
    // Only commit valid, finite numbers
    if (isFinite(parsed)) {
      let validated = parsed;
      
      // Apply constraints
      if (max !== undefined) {
        validated = clamp(parsed, min, max);
      } else {
        validated = Math.max(parsed, min);
      }
      
      // Commit to parent immediately
      onChange(validated);
      previousValueRef.current = validated;
    }
  }, [min, max, onChange]);

  /**
   * Clean up on blur - ensure valid state
   */
  const handleBlur = useCallback(() => {
    const parsed = parseFloat(displayValue);
    let finalValue = min;
    
    if (isFinite(parsed)) {
      finalValue = max !== undefined ? clamp(parsed, min, max) : Math.max(parsed, min);
    }
    
    onChange(finalValue);
    setDisplayValue(String(finalValue));
    previousValueRef.current = finalValue;
  }, [displayValue, min, max, onChange]);

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
          type="text"
          inputMode="decimal"
          value={displayValue}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={disabled}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg 
                     focus:ring-2 focus:ring-green-500 focus:border-transparent 
                     disabled:bg-gray-100 disabled:cursor-not-allowed
                     transition-all duration-200 text-gray-500"
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
