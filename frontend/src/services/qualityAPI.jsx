// Mock API for Quality Context
export const qualityAPI = {
    getActionItems: () => Promise.resolve([
      { id: 1, title: 'Update grading rubric', assignee: 'Trainer A', due: '2023-11-30' },
      { id: 2, title: 'Verify 50% of new assessor samples', assignee: 'IQA Lead', due: '2023-11-15' }
    ]),
  
    getStandardizationMeetings: () => Promise.resolve([
      { id: 1, title: 'Q4 Standardization', date: '2023-11-20', attendees: ['IQA Lead', 'Assessor B'] }
    ]),
  
    calculateRisk: (assessorId) => Promise.resolve({
      riskScore: assessorId % 2 === 0 ? 0.7 : 0.3 // Dummy logic
    })
  };