import React, { useContext } from 'react';
import { CertificateContext } from '../contexts/CertificateContext';

const CompletionTextControl = () => {
  const { certificate, updateCertificateField } = useContext(CertificateContext);

  return (
    <div className="form-group">
      <label>Completion Text</label>
      <input
        type="text"
        value={certificate.completionText}
        onChange={(e) => updateCertificateField('completionText', e.target.value)}
        placeholder="e.g., 'has successfully completed the course'"
        className="form-control"
      />
      <small className="form-text text-muted">
        This text appears between the recipient name and course name
      </small>
    </div>
  );
};

export default CompletionTextControl;