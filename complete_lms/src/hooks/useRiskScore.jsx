// src/hooks/useRiskScore.jsx
import { useState, useEffect } from 'react';
import { fetchAssessorData } from '../services/qualityAPI'; // Mocked initially

/**
 * Custom hook for calculating and managing assessor risk scores
 * @param {string} assessorId - ID of the assessor to evaluate
 * @returns {object} { riskScore, sampleSize, isLoading, error }
 */
const useRiskScore = (assessorId) => {
  const [riskData, setRiskData] = useState({
    riskScore: 0,
    sampleSize: 0.2, // Default 20%
    isLoading: true,
    error: null
  });

  // Risk calculation weights (configurable)
  const RISK_WEIGHTS = {
    experience: 0.3,
    discrepancyRate: 0.4,
    complianceIssues: 0.2,
    learnerFeedback: 0.1
  };

  useEffect(() => {
    const calculateRisk = async () => {
      try {
        // TODO: Replace with actual API call
        const assessor = await fetchAssessorData(assessorId) || getMockData(assessorId);
        
        // Calculate composite risk score (0-10 scale)
        const score = (
          (assessor.experienceMonths * RISK_WEIGHTS.experience) +
          (assessor.discrepancyRate * RISK_WEIGHTS.discrepancyRate) +
          (assessor.complianceIssues * RISK_WEIGHTS.complianceIssues) +
          ((10 - assessor.learnerFeedback) * RISK_WEIGHTS.learnerFeedback)
        );

        // Determine recommended sample size
        const sampleSize = getRecommendedSampleSize(score);
        
        setRiskData({
          riskScore: normalizeScore(score),
          sampleSize,
          isLoading: false,
          error: null
        });
      } catch (err) {
        setRiskData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Failed to calculate risk score'
        }));
      }
    };

    calculateRisk();
  }, [assessorId]);

  // Normalize score to 0-10 scale
  const normalizeScore = (rawScore) => {
    return Math.min(10, Math.max(0, rawScore.toFixed(1)));
  };

  // Convert risk score to sample percentage
  const getRecommendedSampleSize = (score) => {
    if (score >= 8) return 0.7;  // 70% for high-risk
    if (score >= 5) return 0.5;  // 50% for medium-risk
    return 0.2;                 // 20% for low-risk
  };

  // Mock data for development
  const getMockData = (id) => ({
    id,
    experienceMonths: Math.random() > 0.5 ? 24 : 3, // 50% chance new assessor
    discrepancyRate: Math.floor(Math.random() * 5) + 1, // 1-5 discrepancies
    complianceIssues: Math.floor(Math.random() * 3), // 0-2 issues
    learnerFeedback: Math.floor(Math.random() * 3) + 7 // 7-9 feedback score
  });

  return riskData;
};

export default useRiskScore;