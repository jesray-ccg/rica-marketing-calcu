/**
 * @fileoverview Business constants and configuration values for marketing calculator
 * @module constants
 * 
 * Centralizing configuration enables:
 * - Single source of truth for business rules
 * - Easy A/B testing and experimentation
 * - Environment-specific overrides
 * - Compliance with data governance policies
 */

export const BUSINESS_CONSTANTS = {
  /** Regional structure constants - reflects current organizational footprint */
  REGIONS: {
    DEFAULT_RMF_COUNT: 13,
    MIN_RMF_COUNT: 1,
    MAX_RMF_COUNT: 20,
  },

  /** Time period multipliers for annualization calculations */
  TIME_PERIODS: {
    WEEKS_PER_YEAR: 52,
    MONTHS_PER_YEAR: 12,
    QUARTERS_PER_YEAR: 4,
  },

  /** 
   * Channel distribution ratios
   * Based on historical performance data and platform-specific conversion patterns
   * Google typically delivers higher intent traffic for service-based businesses
   */
  CHANNEL_SPLITS: {
    GOOGLE_FRANCHISE_RATIO: 0.7,
    META_FRANCHISE_RATIO: 0.3,
  },

  /** Default cost-per-lead benchmarks by platform and campaign type */
  DEFAULT_CPL: {
    GOOGLE_SERVICE: 10,
    META_SERVICE: 8,
    GOOGLE_FRANCHISE: 15,
    META_FRANCHISE: 12,
    LINKEDIN_COMMERCIAL: 50,
  },

  /** Customer lifecycle metrics - critical for LTV calculations */
  CUSTOMER_METRICS: {
    DEFAULT_MONTHLY_FEE: 120,
    DEFAULT_RETENTION_MONTHS: 24,
    DEFAULT_CONVERSION_RATE: 0.25, // 25%
    DEFAULT_GOOGLE_SERVICE_SPLIT: 0.85, // 85% Google, 15% Meta
  },

  /** Input validation boundaries - prevents calculation errors and unrealistic scenarios */
  VALIDATION: {
    LEADS: {
      MIN_PER_WEEK_RMF: 1,
      MAX_PER_WEEK_RMF: 50,
      MIN_PER_WEEK_AUCKLAND: 1,
      MAX_PER_WEEK_AUCKLAND: 200,
      MIN_FRANCHISE_MONTHLY: 1,
      MAX_FRANCHISE_MONTHLY: 20,
      MIN_COMMERCIAL_QUARTERLY: 1,
      MAX_COMMERCIAL_QUARTERLY: 10,
    },
    CPL: {
      MIN: 1,
      MAX_SERVICE: 100,
      MAX_COMMERCIAL: 200,
      STEP_PRECISION: 0.5,
    },
    LTV: {
      MIN_MONTHLY_FEE: 50,
      MAX_MONTHLY_FEE: 500,
      MIN_RETENTION_MONTHS: 6,
      MAX_RETENTION_MONTHS: 60,
      MIN_CONVERSION_RATE: 5,
      MAX_CONVERSION_RATE: 50,
      MIN_GOOGLE_SPLIT: 50,
      MAX_GOOGLE_SPLIT: 100,
    },
  },

  /** Marketing budget allocations beyond paid media */
  ADDITIONAL_BUDGET: {
    OUT_OF_HOME: 30000,
    CONTENT_PRODUCTION: 15000,
  },
};

/** 
 * Locale configuration for formatting
 * Standardizes number and currency presentation across the application
 */
export const LOCALE_CONFIG = {
  REGION: 'en-NZ',
  CURRENCY: 'NZD',
  NUMBER_FORMAT: {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  },
};

/**
 * UI text constants - enables easy internationalization and A/B testing of copy
 */
export const UI_TEXT = {
  HEADERS: {
    MAIN_TITLE: 'CrewCut Marketing Budget Calculator',
    MAIN_SUBTITLE: 'Model lead targets, CPL scenarios, and budget allocation for 2026',
    LEAD_TARGETS: 'Lead Targets',
    CPL: 'Cost Per Lead (CPL)',
    LTV_STRATEGY: 'LTV & Channel Strategy',
    ANNUAL_VOLUME: 'Annual Lead Volume',
    BUDGET_ALLOCATION: 'Budget Allocation',
    ROI_PROJECTION: 'ROI Projection',
    ADDITIONAL_BUDGET: 'Recommended Additional Budget',
    KEY_INSIGHTS: 'Key Insights',
  },
  LABELS: {
    RMF_REGIONS: 'RMF Regions (excluding Auckland)',
    SERVICE_LEADS_RMF: 'Service Leads per Week (per RMF region)',
    AUCKLAND_LEADS: 'Auckland Service Leads per Week',
    FRANCHISE_LEADS: 'Qualified Franchise Leads per Month',
    COMMERCIAL_LEADS: 'Qualified Commercial Leads per Quarter',
    GOOGLE_SERVICE_CPL: 'Google Service CPL',
    META_SERVICE_CPL: 'Meta Service CPL',
    GOOGLE_FRANCHISE_CPL: 'Google Franchise CPL',
    META_FRANCHISE_CPL: 'Meta Franchise CPL',
    LINKEDIN_CPL: 'LinkedIn Commercial CPL',
    AVG_MONTHLY_FEE: 'Average Monthly Service Fee',
    AVG_RETENTION: 'Average Customer Retention (months)',
    CONVERSION_RATE: 'Service Lead → Customer Conversion Rate',
    GOOGLE_SPLIT: 'Service Leads: Google Split',
  },
};

/**
 * Error messages for validation failures
 */
export const ERROR_MESSAGES = {
  INVALID_NUMBER: 'Please enter a valid number',
  OUT_OF_RANGE: 'Value is outside acceptable range',
  CALCULATION_ERROR: 'Error in calculation. Please check inputs.',
};
