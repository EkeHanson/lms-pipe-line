// Simulates API calls with delayed responses
const mockData = {
    accreditation: {
      status: 'Active',
      expiry: '2024-12-31',
      progress: 85
    },
    audits: [
      { id: 1, type: 'Annual Review', date: '2023-11-15', status: 'scheduled' },
      { id: 2, type: 'Spot Check', date: '2023-09-28', status: 'pending' }
    ],
    compliance: {
      total: 22,
      met: 18,
      pending: 3,
      nonCompliant: 1
    },
    activity: [
      { id: 1, action: 'Reviewed learner portfolios', date: '2023-08-10', user: 'EQA User 1' },
      { id: 2, action: 'Submitted audit report', date: '2023-08-08', user: 'EQA User 2' }
    ]
  };
  
  const simulateNetworkDelay = () => 
    new Promise(resolve => setTimeout(resolve, Math.random() * 800 + 200));
  
  export default {
    fetchDashboardData: async () => {
      await simulateNetworkDelay();
      return {
        ...mockData,
        timestamp: new Date().toISOString()
      };
    },
    downloadReports: async (type) => {
      await simulateNetworkDelay();
      return {
        success: true,
        url: `/api/reports/${type}_${new Date().toISOString()}.pdf`,
        message: `${type} report generated`
      };
    },
    getAuditDetails: async (id) => {
      await simulateNetworkDelay();
      const audit = mockData.audits.find(a => a.id === id);
      return audit 
        ? { 
            ...audit, 
            details: `Detailed report for ${audit.type} audit`,
            requirements: ['Documentation', 'Assessment Samples', 'Trainer Records']
          }
        : null;
    }
  };