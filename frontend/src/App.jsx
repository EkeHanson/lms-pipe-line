import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext'; // Add useAuth import here
import { QualityProvider } from './contexts/QualityContext';
import { CertificateProvider } from './contexts/CertificateContext';
import './App.css';

// Pages
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Pricing from './pages/Pricing';
import Features from './pages/Features';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BrowseListings from './components/listings/BrowseListings';
import ListingDetails from './components/listings/ListingDetails';

// Dashboard Pages
import InstructorDashboard from './pages/dashboard/InstructorDashboard';
import InstructorDashboards from './pages/dashboard/InstructorDashboard/InstructorDashboard';
import StudentDashboard from './pages/dashboard/StudentDashboard';
import StudentDashboards from './pages/dashboard/StudentDashboard/Studentdashboard';
import AdminDashboard from './pages/dashboard/AdminDashboard/Admin';
import QualityAssuranceDashboard from './pages/dashboard/AdminDashboard/QaulityAssuranceDashboard/QualityAssuranceDashboard';
// import QualityAssuranceDashboard from './pages/dashboard/AdminDashboard/QaulityAssuranceDashboard/QualityAssuranceDashboard';
import FeedbackForm from './pages/dashboard/AdminDashboard/QaulityAssuranceDashboard/IQAManagement/FeedbackForm';


// IQA Dashboard Pages
import IQADashboard from './pages/dashboard/IQA/IQADashboard.jsx';

// EQA Dashboard Pages
import EQADashboard from './pages/dashboard/EQA/EQADashboard.jsx';

const queryClient = new QueryClient();

/**
 * ProtectedRoute component to enforce authentication and role-based access
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to render
 * @param {Array} [props.allowedRoles=[]] - Array of allowed roles
 * @param {boolean} [props.requireAuth=true] - Whether authentication is required
 */
const ProtectedRoute = ({ children, allowedRoles = [], requireAuth = true }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAuth && allowedRoles.length > 0 && 
      !allowedRoles.some(role => role.toLowerCase() === user.role.toLowerCase())) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

function AppWrapper() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <QualityProvider>
          <CertificateProvider>
            <AppContent />
          </CertificateProvider>
        </QualityProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

function AppContent() {
  const theme = useTheme();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/features" element={<Features theme={theme} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/listings" element={<BrowseListings />} />
        <Route path="/listings/:id" element={<ListingDetails />} />
        <Route path="/unauthorized" element={<div>You don't have permission to access this page</div>} />

        {/* Protected Routes */}
        <Route
          path="/instructor-dashboard"
          element={
            <ProtectedRoute allowedRoles={['TRAINER']}>
              <InstructorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trainer-dashboard"
          element={
            <ProtectedRoute allowedRoles={['TRAINER','admin', 'ADMIN', 'super_admin', 'SUPER_ADMIN']}>
              <InstructorDashboards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learner-dashboard"
          element={
            <ProtectedRoute allowedRoles={['LEARNER','admin', 'ADMIN', 'super_admin', 'SUPER_ADMIN']}>
              <StudentDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/student-dashboard"
          element={
            <ProtectedRoute allowedRoles={['LEARNER']}>
              <StudentDashboards />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute allowedRoles={['admin', 'ADMIN', 'super_admin', 'SUPER_ADMIN']}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/iqa"
          element={           
              <IQADashboard />
           }
          // path="/iqa-dashboard"
          // element={
          //   <ProtectedRoute allowedRoles={['IQA_LEAD', 'EQA_AUDITOR']}>
          //     <IQADashboard />
          //   </ProtectedRoute>
          // }
        />
        <Route
        
          path="/eqa"
          element={
            <ProtectedRoute allowedRoles={['IQA_LEAD', 'EQA_AUDITOR','admin', 'ADMIN', 'super_admin', 'SUPER_ADMIN']}>
              <EQADashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default AppWrapper;