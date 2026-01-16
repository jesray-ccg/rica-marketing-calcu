/**
 * @fileoverview Custom React hook for marketing budget calculations
 * @module hooks/useMarketingCalculations
 * 
 * Separates business logic from UI components following Single Responsibility Principle
 * Enables independent testing of calculation logic
 * Memoization prevents unnecessary recalculations on unrelated state changes
 */

import { useMemo } from 'react';
import { BUSINESS_CONSTANTS } from '../utils/constants';

/**
 * Performs all marketing budget calculations with comprehensive ROI analysis
 * 
 * Architecture decision: useMemo prevents expensive recalculations
 * All monetary values returned in base currency units (dollars, not cents)
 * 
 * @param {Object} inputs - All calculator input values
 * @returns {Object} Comprehensive calculation results
 * 
 * @example
 * const calculations = useMarketingCalculations({
 *   rmfRegionCount: 13,
 *   serviceLeadsPerWeekRMF: 15,
 *   // ... other inputs
 * });
 */
export const useMarketingCalculations = (inputs) => {
  return useMemo(() => {
    const {
      rmfRegionCount,
      serviceLeadsPerWeekRMF,
      aucklandServiceLeadsPerWeek,
      franchiseLeadsPerMonth,
      commercialLeadsPerQuarter,
      googleServiceCPL,
      metaServiceCPL,
      googleFranchiseCPL,
      metaFranchiseCPL,
      linkedInCommercialCPL,
      avgMonthlyServiceFee,
      avgCustomerRetentionMonths,
      serviceLeadConversionRate,
      googleServiceSplit,
    } = inputs;

    // ═══════════════════════════════════════════════════════════════════════
    // LEAD VOLUME CALCULATIONS
    // Annualize all lead targets to standardize budget planning
    // ═══════════════════════════════════════════════════════════════════════
    
    const rmfServiceLeadsAnnual = 
      rmfRegionCount * 
      serviceLeadsPerWeekRMF * 
      BUSINESS_CONSTANTS.TIME_PERIODS.WEEKS_PER_YEAR;
    
    const aucklandServiceLeadsAnnual = 
      aucklandServiceLeadsPerWeek * 
      BUSINESS_CONSTANTS.TIME_PERIODS.WEEKS_PER_YEAR;
    
    const totalServiceLeads = rmfServiceLeadsAnnual + aucklandServiceLeadsAnnual;
    
    const totalFranchiseLeads = 
      franchiseLeadsPerMonth * 
      BUSINESS_CONSTANTS.TIME_PERIODS.MONTHS_PER_YEAR;
    
    const totalCommercialLeads = 
      commercialLeadsPerQuarter * 
      BUSINESS_CONSTANTS.TIME_PERIODS.QUARTERS_PER_YEAR;

    // ═══════════════════════════════════════════════════════════════════════
    // CHANNEL DISTRIBUTION - SERVICE CAMPAIGNS
    // Split based on historical performance and platform capabilities
    // Google: Higher intent, better for bottom-funnel conversions
    // Meta: Better for awareness and top-funnel engagement
    // ═══════════════════════════════════════════════════════════════════════
    
    const googleServiceLeads = totalServiceLeads * googleServiceSplit;
    const metaServiceLeads = totalServiceLeads * (1 - googleServiceSplit);
    
    const googleServiceBudget = googleServiceLeads * googleServiceCPL;
    const metaServiceBudget = metaServiceLeads * metaServiceCPL;

    // ═══════════════════════════════════════════════════════════════════════
    // CHANNEL DISTRIBUTION - FRANCHISE CAMPAIGNS
    // 70/30 split reflects franchise prospect behavior patterns
    // Franchise buyers typically conduct extensive research (Google strength)
    // ═══════════════════════════════════════════════════════════════════════
    
    const googleFranchiseBudget = 
      totalFranchiseLeads * 
      BUSINESS_CONSTANTS.CHANNEL_SPLITS.GOOGLE_FRANCHISE_RATIO * 
      googleFranchiseCPL;
    
    const metaFranchiseBudget = 
      totalFranchiseLeads * 
      BUSINESS_CONSTANTS.CHANNEL_SPLITS.META_FRANCHISE_RATIO * 
      metaFranchiseCPL;

    // ═══════════════════════════════════════════════════════════════════════
    // COMMERCIAL CAMPAIGN BUDGET
    // LinkedIn exclusivity due to B2B targeting capabilities
    // Higher CPL justified by larger contract values and longer sales cycles
    // ═══════════════════════════════════════════════════════════════════════
    
    const commercialBudget = totalCommercialLeads * linkedInCommercialCPL;

    // ═══════════════════════════════════════════════════════════════════════
    // BUDGET AGGREGATION
    // ═══════════════════════════════════════════════════════════════════════
    
    const totalGoogleBudget = googleServiceBudget + googleFranchiseBudget;
    const totalMetaBudget = metaServiceBudget + metaFranchiseBudget;
    const totalPaidAds = totalGoogleBudget + totalMetaBudget + commercialBudget;

    // ═══════════════════════════════════════════════════════════════════════
    // CUSTOMER LIFETIME VALUE & ROI PROJECTIONS
    // Critical assumptions:
    // - LTV calculation assumes constant monthly fee (conservative)
    // - Retention period based on historical churn analysis
    // - Only service leads contribute to immediate revenue (franchise/commercial excluded)
    // ═══════════════════════════════════════════════════════════════════════
    
    const customerLTV = avgMonthlyServiceFee * avgCustomerRetentionMonths;
    const convertedCustomers = totalServiceLeads * serviceLeadConversionRate;
    const totalRevenue = convertedCustomers * customerLTV;
    
    /**
     * ROI Calculation Method: (Revenue - Cost) / Cost × 100
     * This represents return percentage on marketing investment
     * Example: 300% ROI means every $1 spent returns $4 total ($3 profit)
     */
    const roi = totalPaidAds > 0 
      ? ((totalRevenue - totalPaidAds) / totalPaidAds) * 100 
      : 0;
    
    /** Cost per acquisition - total marketing spend divided by converted customers */
    const costPerAcquisition = convertedCustomers > 0 
      ? totalPaidAds / convertedCustomers 
      : 0;
    
    /** LTV:CAC ratio - industry benchmark is 3:1 for healthy business */
    const ltvCacRatio = costPerAcquisition > 0 
      ? customerLTV / costPerAcquisition 
      : 0;

    // ═══════════════════════════════════════════════════════════════════════
    // RETURN COMPREHENSIVE METRICS OBJECT
    // All values rounded where appropriate for UI presentation
    // ═══════════════════════════════════════════════════════════════════════
    
    return {
      // Lead volume metrics
      leadMetrics: {
        rmfServiceLeadsAnnual: Math.round(rmfServiceLeadsAnnual),
        aucklandServiceLeadsAnnual: Math.round(aucklandServiceLeadsAnnual),
        totalServiceLeads: Math.round(totalServiceLeads),
        totalFranchiseLeads: Math.round(totalFranchiseLeads),
        totalCommercialLeads: Math.round(totalCommercialLeads),
        totalLeads: Math.round(totalServiceLeads + totalFranchiseLeads + totalCommercialLeads),
      },
      
      // Channel-specific lead distribution
      channelLeads: {
        googleServiceLeads: Math.round(googleServiceLeads),
        metaServiceLeads: Math.round(metaServiceLeads),
      },
      
      // Budget allocation by platform and campaign type
      budgetAllocation: {
        googleServiceBudget,
        metaServiceBudget,
        googleFranchiseBudget,
        metaFranchiseBudget,
        commercialBudget,
        totalGoogleBudget,
        totalMetaBudget,
        totalPaidAds,
      },
      
      // Financial performance indicators
      financialMetrics: {
        customerLTV,
        convertedCustomers: Math.round(convertedCustomers),
        totalRevenue,
        roi,
        costPerAcquisition,
        ltvCacRatio,
        averageCPL: totalPaidAds / (totalServiceLeads + totalFranchiseLeads + totalCommercialLeads),
      },
    };
  }, [
    inputs.rmfRegionCount,
    inputs.serviceLeadsPerWeekRMF,
    inputs.aucklandServiceLeadsPerWeek,
    inputs.franchiseLeadsPerMonth,
    inputs.commercialLeadsPerQuarter,
    inputs.googleServiceCPL,
    inputs.metaServiceCPL,
    inputs.googleFranchiseCPL,
    inputs.metaFranchiseCPL,
    inputs.linkedInCommercialCPL,
    inputs.avgMonthlyServiceFee,
    inputs.avgCustomerRetentionMonths,
    inputs.serviceLeadConversionRate,
    inputs.googleServiceSplit,
  ]);
};
