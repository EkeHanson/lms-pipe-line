// src/contexts/CertificateContext.jsx
import React, { createContext, useContext, useReducer } from 'react';

const initialState = {
  template: null,
  title: 'Certificate of Completion',
  recipientName: '',
  courseName: '',
  completionDate: new Date().toLocaleDateString(),
  completionText: 'has successfully completed the course',
  borderColor: '#000000',
  borderWidth: 2,
  borderStyle: 'solid',
  background: '#ffffff',
  elements: [],
  signatures: [],
  logos: [],
  qrCode: null,
};

const CertificateContext = createContext();

const certificateReducer = (state, action) => {
  switch (action.type) {
    case 'SET_TEMPLATE':
      return { ...state, template: action.payload };
    case 'UPDATE_TEXT':
      return { ...state, [action.field]: action.value };
    case 'ADD_SIGNATURE':
      return { ...state, signatures: [...state.signatures, action.payload] };
    case 'ADD_LOGO':
      return { ...state, logos: [...state.logos, action.payload] };
    case 'SET_QR_CODE':
      return { ...state, qrCode: action.payload };
    case 'UPDATE_STYLE':
      return { ...state, [action.property]: action.value };
    default:
      return state;
  }
};

export const CertificateProvider = ({ children }) => {
  const [state, dispatch] = useReducer(certificateReducer, initialState);

  const value = {
    ...state,
    setTemplate: (templateId) => dispatch({ type: 'SET_TEMPLATE', payload: templateId }),
    updateText: (field, value) => dispatch({ type: 'UPDATE_TEXT', field, value }),
    addSignature: (signature) => dispatch({ type: 'ADD_SIGNATURE', payload: signature }),
    addLogo: (logo) => dispatch({ type: 'ADD_LOGO', payload: logo }),
    setQRCode: (data) => dispatch({ type: 'SET_QR_CODE', payload: data }),
    updateStyle: (property, value) => dispatch({ type: 'UPDATE_STYLE', property, value }),
  };

  return (
    <CertificateContext.Provider value={value}>
      {children}
    </CertificateContext.Provider>
  );
};

export const useCertificate = () => {
  const context = useContext(CertificateContext);
  if (!context) {
    throw new Error('useCertificate must be used within a CertificateProvider');
  }
  return context;
};