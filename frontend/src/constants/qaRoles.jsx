export const QA_ROLES = {
    IQA_LEAD: {
      permissions: [
        'view_assessments', 
        'sample_work', 
        'conduct_observations',
        'manage_feedback'
      ],
      dashboard: '/dashboard/iqa'
    },
    EQA_AUDITOR: {
      permissions: [
        'view_reports',
        'manage_evidence',
        'schedule_audits',
        'submit_compliance'
      ],
      dashboard: '/dashboard/eqa'
    },
    TRAINER: {
      permissions: [
        'submit_work',
        'view_feedback',
        'request_verification'
      ],
      dashboard: '/dashboard/trainer'
    },
    ADMIN: {
      permissions: ['*'],
      dashboard: '/dashboard/admin'
    }
  };