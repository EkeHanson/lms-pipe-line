
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

// Define QualityContext
const QualityContext = createContext();

// QualityProvider component
export const QualityProvider = ({ children }) => {
  const [riskThresholds, setRiskThresholds] = useState({
    samplingRate: 0.1, // Default: 10% of assessments sampled
    complianceThreshold: 0.9, // Default: 90% compliance required
    trainerPerformanceThreshold: 0.8, // Default: 80% trainer performance score
  });

  // Update risk thresholds
  const updateRiskThresholds = (newThresholds) => {
    setRiskThresholds((prev) => ({
      ...prev,
      ...newThresholds,
    }));
  };

  // Context value
  const value = {
    riskThresholds,
    updateRiskThresholds,
  };

  return <QualityContext.Provider value={value}>{children}</QualityContext.Provider>;
};

QualityProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Hook to use QualityContext
export const useQuality = () => {
  const context = useContext(QualityContext);
  if (!context) {
    throw new Error('useQuality must be used within a QualityProvider');
  }
  return context;
};