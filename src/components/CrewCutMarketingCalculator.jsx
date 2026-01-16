/**
 * @fileoverview Enterprise-grade marketing budget calculator for CrewCut/Crewcare
 * @module components/CrewCutMarketingCalculator
 * @version 2.0.0
 * 
 * Business Context:
 * Enables marketing team to model various budget scenarios across multiple channels
 * (Google Ads, Meta Ads, LinkedIn) and calculate projected ROI based on historical
 * conversion data and customer lifetime value metrics.
 * 
 * Technical Architecture:
 * - Separation of concerns (UI/Logic/Data)
 * - React hooks for state management
 * - Memoized calculations for performance
 * - Accessibility-first design
 * - Mobile-responsive layout
 * 
 * @author CrewCut Development Team
 * @since 2026-01-16
 */

import React, { useState, useCallback } from 'react';
import { Calculator, TrendingUp, DollarSign, Target, Users, Building } from 'lucide-react';
import InputGroup from './InputGroup';
import { useMarketingCalculations } from '../hooks/useMarketingCalculations';
import { formatCurrency, formatNumber, formatPercentage } from '../utils/utils';
import { BUSINESS_CONSTANTS, UI_TEXT } from '../utils/constants';

/**
 * Main calculator component orchestrating all sub-components and business logic
 * 
 * State Management Strategy:
 * - Each input has dedicated state to enable granular updates
 * - Calculations memoized via custom hook to prevent unnecessary recomputation
 * - setState callbacks wrapped in useCallback where beneficial for child component optimization
 * 
 * @component
 * @returns {React.ReactElement} The complete calculator interface
 */
export default function CrewCutMarketingCalculator() {
  // ═══════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT - Lead Targets
  // Organized by business domain for maintainability
  // ═══════════════════════════════════════════════════════════════════════
  
  const [rmfRegionCount, setRmfRegionCount] = useState(
    BUSINESS_CONSTANTS.REGIONS.DEFAULT_RMF_COUNT
  );
  const [serviceLeadsPerWeekRMF, setServiceLeadsPerWeekRMF] = useState(15);
  const [aucklandServiceLeadsPerWeek, setAucklandServiceLeadsPerWeek] = useState(100);
  const [franchiseLeadsPerMonth, setFranchiseLeadsPerMonth] = useState(5);
  const [commercialLeadsPerQuarter, setCommercialLeadsPerQuarter] = useState(1);

  // ═══════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT - Cost Per Lead (CPL) Metrics
  // Platform-specific CPL targets based on historical performance
  // ═══════════════════════════════════════════════════════════════════════
  
  const [googleServiceCPL, setGoogleServiceCPL] = useState(
    BUSINESS_CONSTANTS.DEFAULT_CPL.GOOGLE_SERVICE
  );
  const [metaServiceCPL, setMetaServiceCPL] = useState(
    BUSINESS_CONSTANTS.DEFAULT_CPL.META_SERVICE
  );
  const [googleFranchiseCPL, setGoogleFranchiseCPL] = useState(
    BUSINESS_CONSTANTS.DEFAULT_CPL.GOOGLE_FRANCHISE
  );
  const [metaFranchiseCPL, setMetaFranchiseCPL] = useState(
    BUSINESS_CONSTANTS.DEFAULT_CPL.META_FRANCHISE
  );
  const [linkedInCommercialCPL, setLinkedInCommercialCPL] = useState(
    BUSINESS_CONSTANTS.DEFAULT_CPL.LINKEDIN_COMMERCIAL
  );

  // ═══════════════════════════════════════════════════════════════════════
  // STATE MANAGEMENT - Customer Lifecycle & ROI Inputs
  // Critical for accurate revenue projection modeling
  // ═══════════════════════════════════════════════════════════════════════
  
  const [avgMonthlyServiceFee, setAvgMonthlyServiceFee] = useState(
    BUSINESS_CONSTANTS.CUSTOMER_METRICS.DEFAULT_MONTHLY_FEE
  );
  const [avgCustomerRetentionMonths, setAvgCustomerRetentionMonths] = useState(
    BUSINESS_CONSTANTS.CUSTOMER_METRICS.DEFAULT_RETENTION_MONTHS
  );
  const [serviceLeadConversionRate, setServiceLeadConversionRate] = useState(
    BUSINESS_CONSTANTS.CUSTOMER_METRICS.DEFAULT_CONVERSION_RATE
  );
  const [googleServiceSplit, setGoogleServiceSplit] = useState(
    BUSINESS_CONSTANTS.CUSTOMER_METRICS.DEFAULT_GOOGLE_SERVICE_SPLIT
  );

  // ═══════════════════════════════════════════════════════════════════════
  // CALCULATION ENGINE
  // Custom hook encapsulates all business logic - see useMarketingCalculations.js
  // ═══════════════════════════════════════════════════════════════════════
  
  const calculations = useMarketingCalculations({
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
  });

  // ═══════════════════════════════════════════════════════════════════════
  // CONVENIENCE DESTRUCTURING
  // Improves code readability in JSX
  // ═══════════════════════════════════════════════════════════════════════
  
  const { leadMetrics, channelLeads, budgetAllocation, financialMetrics } = calculations;

  /**
   * Calculates total marketing budget including non-paid media expenses
   * Out-of-home and content production are fixed costs
   */
  const totalMarketingBudget = 
    budgetAllocation.totalPaidAds + 
    BUSINESS_CONSTANTS.ADDITIONAL_BUDGET.OUT_OF_HOME + 
    BUSINESS_CONSTANTS.ADDITIONAL_BUDGET.CONTENT_PRODUCTION;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* ═══════════════════════════════════════════════════════════ */}
        {/* HEADER SECTION */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
        <header className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="w-8 h-8 text-green-600" aria-hidden="true" />
            <h1 className="text-3xl font-bold text-gray-900">
              {UI_TEXT.HEADERS.MAIN_TITLE}
            </h1>
          </div>
          <p className="text-gray-600">{UI_TEXT.HEADERS.MAIN_SUBTITLE}</p>
        </header>

        <div className="grid lg:grid-cols-2 gap-6">
          
          {/* ═══════════════════════════════════════════════════════════ */}
          {/* LEFT COLUMN - INPUT CONTROLS */}
          {/* ═══════════════════════════════════════════════════════════ */}
          
          <div className="space-y-6">
            
            {/* Lead Targets Input Panel */}
            <section className="bg-white rounded-xl shadow-lg p-6" aria-labelledby="lead-targets-heading">
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-5 h-5 text-green-600" aria-hidden="true" />
                <h2 id="lead-targets-heading" className="text-xl font-bold text-gray-900">
                  {UI_TEXT.HEADERS.LEAD_TARGETS}
                </h2>
              </div>
              <div className="space-y-4">
                <InputGroup
                  label={UI_TEXT.LABELS.RMF_REGIONS}
                  value={rmfRegionCount}
                  onChange={setRmfRegionCount}
                  min={BUSINESS_CONSTANTS.REGIONS.MIN_RMF_COUNT}
                  max={BUSINESS_CONSTANTS.REGIONS.MAX_RMF_COUNT}
                />
                <InputGroup
                  label={UI_TEXT.LABELS.SERVICE_LEADS_RMF}
                  value={serviceLeadsPerWeekRMF}
                  onChange={setServiceLeadsPerWeekRMF}
                  min={BUSINESS_CONSTANTS.VALIDATION.LEADS.MIN_PER_WEEK_RMF}
                  max={BUSINESS_CONSTANTS.VALIDATION.LEADS.MAX_PER_WEEK_RMF}
                />
                <InputGroup
                  label={UI_TEXT.LABELS.AUCKLAND_LEADS}
                  value={aucklandServiceLeadsPerWeek}
                  onChange={setAucklandServiceLeadsPerWeek}
                  min={BUSINESS_CONSTANTS.VALIDATION.LEADS.MIN_PER_WEEK_AUCKLAND}
                  max={BUSINESS_CONSTANTS.VALIDATION.LEADS.MAX_PER_WEEK_AUCKLAND}
                />
                <InputGroup
                  label={UI_TEXT.LABELS.FRANCHISE_LEADS}
                  value={franchiseLeadsPerMonth}
                  onChange={setFranchiseLeadsPerMonth}
                  min={BUSINESS_CONSTANTS.VALIDATION.LEADS.MIN_FRANCHISE_MONTHLY}
                  max={BUSINESS_CONSTANTS.VALIDATION.LEADS.MAX_FRANCHISE_MONTHLY}
                />
                <InputGroup
                  label={UI_TEXT.LABELS.COMMERCIAL_LEADS}
                  value={commercialLeadsPerQuarter}
                  onChange={setCommercialLeadsPerQuarter}
                  min={BUSINESS_CONSTANTS.VALIDATION.LEADS.MIN_COMMERCIAL_QUARTERLY}
                  max={BUSINESS_CONSTANTS.VALIDATION.LEADS.MAX_COMMERCIAL_QUARTERLY}
                />
              </div>
            </section>

            {/* CPL Input Panel */}
            <section className="bg-white rounded-xl shadow-lg p-6" aria-labelledby="cpl-heading">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" aria-hidden="true" />
                <h2 id="cpl-heading" className="text-xl font-bold text-gray-900">
                  {UI_TEXT.HEADERS.CPL}
                </h2>
              </div>
              <div className="space-y-4">
                <InputGroup
                  label={UI_TEXT.LABELS.GOOGLE_SERVICE_CPL}
                  value={googleServiceCPL}
                  onChange={setGoogleServiceCPL}
                  min={BUSINESS_CONSTANTS.VALIDATION.CPL.MIN}
                  max={BUSINESS_CONSTANTS.VALIDATION.CPL.MAX_SERVICE}
                  step={BUSINESS_CONSTANTS.VALIDATION.CPL.STEP_PRECISION}
                  prefix="$"
                />
                <InputGroup
                  label={UI_TEXT.LABELS.META_SERVICE_CPL}
                  value={metaServiceCPL}
                  onChange={setMetaServiceCPL}
                  min={BUSINESS_CONSTANTS.VALIDATION.CPL.MIN}
                  max={BUSINESS_CONSTANTS.VALIDATION.CPL.MAX_SERVICE}
                  step={BUSINESS_CONSTANTS.VALIDATION.CPL.STEP_PRECISION}
                  prefix="$"
                />
                <InputGroup
                  label={UI_TEXT.LABELS.GOOGLE_FRANCHISE_CPL}
                  value={googleFranchiseCPL}
                  onChange={setGoogleFranchiseCPL}
                  min={BUSINESS_CONSTANTS.VALIDATION.CPL.MIN}
                  max={BUSINESS_CONSTANTS.VALIDATION.CPL.MAX_SERVICE}
                  step={BUSINESS_CONSTANTS.VALIDATION.CPL.STEP_PRECISION}
                  prefix="$"
                />
                <InputGroup
                  label={UI_TEXT.LABELS.META_FRANCHISE_CPL}
                  value={metaFranchiseCPL}
                  onChange={setMetaFranchiseCPL}
                  min={BUSINESS_CONSTANTS.VALIDATION.CPL.MIN}
                  max={BUSINESS_CONSTANTS.VALIDATION.CPL.MAX_SERVICE}
                  step={BUSINESS_CONSTANTS.VALIDATION.CPL.STEP_PRECISION}
                  prefix="$"
                />
                <InputGroup
                  label={UI_TEXT.LABELS.LINKEDIN_CPL}
                  value={linkedInCommercialCPL}
                  onChange={setLinkedInCommercialCPL}
                  min={BUSINESS_CONSTANTS.VALIDATION.CPL.MIN}
                  max={BUSINESS_CONSTANTS.VALIDATION.CPL.MAX_COMMERCIAL}
                  step={1}
                  prefix="$"
                />
              </div>
            </section>

            {/* LTV & Channel Strategy Panel */}
            <section className="bg-white rounded-xl shadow-lg p-6" aria-labelledby="ltv-heading">
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5 text-green-600" aria-hidden="true" />
                <h2 id="ltv-heading" className="text-xl font-bold text-gray-900">
                  {UI_TEXT.HEADERS.LTV_STRATEGY}
                </h2>
              </div>
              <div className="space-y-4">
                <InputGroup
                  label={UI_TEXT.LABELS.AVG_MONTHLY_FEE}
                  value={avgMonthlyServiceFee}
                  onChange={setAvgMonthlyServiceFee}
                  min={BUSINESS_CONSTANTS.VALIDATION.LTV.MIN_MONTHLY_FEE}
                  max={BUSINESS_CONSTANTS.VALIDATION.LTV.MAX_MONTHLY_FEE}
                  step={10}
                  prefix="$"
                />
                <InputGroup
                  label={UI_TEXT.LABELS.AVG_RETENTION}
                  value={avgCustomerRetentionMonths}
                  onChange={setAvgCustomerRetentionMonths}
                  min={BUSINESS_CONSTANTS.VALIDATION.LTV.MIN_RETENTION_MONTHS}
                  max={BUSINESS_CONSTANTS.VALIDATION.LTV.MAX_RETENTION_MONTHS}
                />
                <InputGroup
                  label={UI_TEXT.LABELS.CONVERSION_RATE}
                  value={serviceLeadConversionRate * 100}
                  onChange={(val) => setServiceLeadConversionRate(val / 100)}
                  min={BUSINESS_CONSTANTS.VALIDATION.LTV.MIN_CONVERSION_RATE}
                  max={BUSINESS_CONSTANTS.VALIDATION.LTV.MAX_CONVERSION_RATE}
                  step={1}
                  suffix="%"
                />
                <InputGroup
                  label={UI_TEXT.LABELS.GOOGLE_SPLIT}
                  value={googleServiceSplit * 100}
                  onChange={(val) => setGoogleServiceSplit(val / 100)}
                  min={BUSINESS_CONSTANTS.VALIDATION.LTV.MIN_GOOGLE_SPLIT}
                  max={BUSINESS_CONSTANTS.VALIDATION.LTV.MAX_GOOGLE_SPLIT}
                  step={5}
                  suffix="%"
                />
              </div>
            </section>
          </div>

          {/* ═══════════════════════════════════════════════════════════ */}
          {/* RIGHT COLUMN - RESULTS & INSIGHTS */}
          {/* ═══════════════════════════════════════════════════════════ */}
          
          <div className="space-y-6">
            
            {/* Lead Volume Summary Panel */}
            <section className="bg-white rounded-xl shadow-lg p-6" aria-labelledby="lead-volume-heading">
              <div className="flex items-center gap-2 mb-4">
                <Users className="w-5 h-5 text-green-600" aria-hidden="true" />
                <h2 id="lead-volume-heading" className="text-xl font-bold text-gray-900">
                  {UI_TEXT.HEADERS.ANNUAL_VOLUME}
                </h2>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">RMF Service Leads</span>
                  <span className="font-bold text-gray-900">
                    {formatNumber(leadMetrics.rmfServiceLeadsAnnual)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Auckland Service Leads</span>
                  <span className="font-bold text-gray-900">
                    {formatNumber(leadMetrics.aucklandServiceLeadsAnnual)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b-2 border-green-200">
                  <span className="font-semibold text-gray-700">Total Service Leads</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatNumber(leadMetrics.totalServiceLeads)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Franchise Leads</span>
                  <span className="font-bold text-gray-900">
                    {formatNumber(leadMetrics.totalFranchiseLeads)}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Commercial Leads</span>
                  <span className="font-bold text-gray-900">
                    {formatNumber(leadMetrics.totalCommercialLeads)}
                  </span>
                </div>
              </div>
            </section>

            {/* Budget Allocation Panel */}
            <section className="bg-white rounded-xl shadow-lg p-6" aria-labelledby="budget-heading">
              <div className="flex items-center gap-2 mb-4">
                <DollarSign className="w-5 h-5 text-green-600" aria-hidden="true" />
                <h2 id="budget-heading" className="text-xl font-bold text-gray-900">
                  {UI_TEXT.HEADERS.BUDGET_ALLOCATION}
                </h2>
              </div>
              <div className="space-y-4">
                
                {/* Google Ads Breakdown */}
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="font-semibold text-blue-900 mb-2">Google Ads</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-blue-700">
                        Service ({formatNumber(channelLeads.googleServiceLeads)} leads)
                      </span>
                      <span className="font-semibold text-blue-900">
                        {formatCurrency(budgetAllocation.googleServiceBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-blue-700">Franchise</span>
                      <span className="font-semibold text-blue-900">
                        {formatCurrency(budgetAllocation.googleFranchiseBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-blue-200">
                      <span className="font-semibold text-blue-900">Total Google</span>
                      <span className="font-bold text-blue-900">
                        {formatCurrency(budgetAllocation.totalGoogleBudget)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Meta Ads Breakdown */}
                <div className="bg-purple-50 rounded-lg p-4">
                  <div className="font-semibold text-purple-900 mb-2">Meta Ads</div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-purple-700">
                        Service ({formatNumber(channelLeads.metaServiceLeads)} leads)
                      </span>
                      <span className="font-semibold text-purple-900">
                        {formatCurrency(budgetAllocation.metaServiceBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-purple-700">Franchise</span>
                      <span className="font-semibold text-purple-900">
                        {formatCurrency(budgetAllocation.metaFranchiseBudget)}
                      </span>
                    </div>
                    <div className="flex justify-between pt-2 border-t border-purple-200">
                      <span className="font-semibold text-purple-900">Total Meta</span>
                      <span className="font-bold text-purple-900">
                        {formatCurrency(budgetAllocation.totalMetaBudget)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* LinkedIn Commercial */}
                <div className="bg-indigo-50 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-indigo-900">LinkedIn (Commercial)</span>
                    <span className="font-bold text-indigo-900">
                      {formatCurrency(budgetAllocation.commercialBudget)}
                    </span>
                  </div>
                </div>

                {/* Total Paid Ads */}
                <div className="bg-green-100 rounded-lg p-4 border-2 border-green-300">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-green-900 text-lg">Total Paid Ads Budget</span>
                    <span className="font-bold text-green-900 text-2xl">
                      {formatCurrency(budgetAllocation.totalPaidAds)}
                    </span>
                  </div>
                </div>
              </div>
            </section>

            {/* ROI Analysis Panel */}
            <section 
              className="bg-gradient-to-br from-green-500 to-blue-600 rounded-xl shadow-lg p-6 text-white"
              aria-labelledby="roi-heading"
            >
              <div className="flex items-center gap-2 mb-4">
                <TrendingUp className="w-5 h-5" aria-hidden="true" />
                <h2 id="roi-heading" className="text-xl font-bold">
                  {UI_TEXT.HEADERS.ROI_PROJECTION}
                </h2>
              </div>
              <div className="space-y-4">
                
                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <div className="text-sm opacity-90 mb-1">Customer LTV</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(financialMetrics.customerLTV)}
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <div className="text-sm opacity-90 mb-1">Expected Converted Customers</div>
                  <div className="text-2xl font-bold">
                    {formatNumber(financialMetrics.convertedCustomers)}
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    From {formatNumber(leadMetrics.totalServiceLeads)} service leads 
                    at {formatPercentage(serviceLeadConversionRate)} conversion
                  </div>
                </div>

                <div className="bg-white/10 rounded-lg p-4 backdrop-blur">
                  <div className="text-sm opacity-90 mb-1">Projected Revenue</div>
                  <div className="text-2xl font-bold">
                    {formatCurrency(financialMetrics.totalRevenue)}
                  </div>
                </div>

                <div className="bg-white/20 rounded-lg p-4 backdrop-blur border-2 border-white/30">
                  <div className="text-sm opacity-90 mb-1">Return on Ad Spend (ROAS)</div>
                  <div className="text-3xl font-bold">
                    {financialMetrics.roi.toFixed(0)}%
                  </div>
                  <div className="text-xs opacity-75 mt-1">
                    {financialMetrics.roi > 0 
                      ? `Every $1 spent returns $${(financialMetrics.roi / 100 + 1).toFixed(2)}` 
                      : 'Adjust targets or CPL to improve ROI'}
                  </div>
                </div>

                {/* Additional Financial Metrics */}
                <div className="grid grid-cols-2 gap-3 pt-3 border-t border-white/20">
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">Cost Per Acquisition</div>
                    <div className="text-lg font-bold">
                      {formatCurrency(financialMetrics.costPerAcquisition)}
                    </div>
                  </div>
                  <div className="bg-white/10 rounded-lg p-3">
                    <div className="text-xs opacity-75 mb-1">LTV:CAC Ratio</div>
                    <div className="text-lg font-bold">
                      {financialMetrics.ltvCacRatio.toFixed(2)}:1
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Additional Budget Items Panel */}
            <section className="bg-white rounded-xl shadow-lg p-6" aria-labelledby="additional-budget-heading">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-green-600" aria-hidden="true" />
                <h2 id="additional-budget-heading" className="text-xl font-bold text-gray-900">
                  {UI_TEXT.HEADERS.ADDITIONAL_BUDGET}
                </h2>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Out-of-Home (Billboards/Posters)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(BUSINESS_CONSTANTS.ADDITIONAL_BUDGET.OUT_OF_HOME)}
                  </span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b">
                  <span className="text-gray-600">Content Production (Paloma)</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(BUSINESS_CONSTANTS.ADDITIONAL_BUDGET.CONTENT_PRODUCTION)}
                  </span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t-2 border-gray-300">
                  <span className="font-bold text-gray-900">Total Marketing Budget</span>
                  <span className="font-bold text-green-600 text-lg">
                    {formatCurrency(totalMarketingBudget)}
                  </span>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════ */}
        {/* KEY INSIGHTS PANEL - Full Width */}
        {/* ═══════════════════════════════════════════════════════════ */}
        
        <section className="bg-white rounded-xl shadow-lg p-6" aria-labelledby="insights-heading">
          <h2 id="insights-heading" className="text-xl font-bold text-gray-900 mb-4">
            {UI_TEXT.HEADERS.KEY_INSIGHTS}
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Budget Distribution</h3>
              <p className="text-sm text-blue-700">
                Google: {((budgetAllocation.totalGoogleBudget / budgetAllocation.totalPaidAds) * 100).toFixed(0)}% | 
                Meta: {((budgetAllocation.totalMetaBudget / budgetAllocation.totalPaidAds) * 100).toFixed(0)}% | 
                LinkedIn: {((budgetAllocation.commercialBudget / budgetAllocation.totalPaidAds) * 100).toFixed(0)}%
              </p>
            </div>

            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="font-semibold text-green-900 mb-2">Average CPL (All Channels)</h3>
              <p className="text-sm text-green-700">
                {formatCurrency(financialMetrics.averageCPL)} per lead across all campaigns
              </p>
            </div>

            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-2">Service Lead Strategy</h3>
              <p className="text-sm text-purple-700">
                Targeting {formatNumber(leadMetrics.totalServiceLeads)} service leads annually 
                at {formatPercentage(googleServiceSplit)} Google / {formatPercentage(1 - googleServiceSplit)} Meta split
              </p>
            </div>

            <div className="bg-orange-50 rounded-lg p-4">
              <h3 className="font-semibold text-orange-900 mb-2">Break-Even Analysis</h3>
              <p className="text-sm text-orange-700">
                Need {((budgetAllocation.totalPaidAds / leadMetrics.totalServiceLeads) / financialMetrics.customerLTV * 100).toFixed(1)}% 
                conversion rate to break even on service leads
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
