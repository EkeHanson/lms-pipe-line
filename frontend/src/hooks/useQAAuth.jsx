import { useAuth } from '../contexts/AuthContext';

export const useQAAuth = () => {
  const auth = useAuth();
  
  return {
    ...auth,
    isIQALead: auth.hasPermission('sample_work'),
    isEQAAuditor: auth.hasPermission('manage_evidence'),
    canViewReports: auth.hasPermission('view_reports')
  };
};