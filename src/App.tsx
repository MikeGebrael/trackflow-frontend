import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import AdminPage from './pages/AdminPage';
import ManagerPage from './pages/ManagerPage';
import EmployeePage from './pages/EmployeePage';

/**
 * App component handles routing and rendering of pages based on user roles.
 *
 * The application uses React Router to define routes for different user roles
 * (admin, manager, and employee), with a login page accessible at the root path.
 *
 * @returns JSX.Element - The rendered application with routing.
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Login page route */}
        <Route path="/" element={<LoginPage />} />
        
        {/* Routes for specific roles */}
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/manager" element={<ManagerPage />} />
        <Route path="/employee" element={<EmployeePage />} />
      </Routes>
    </Router>
  );
};

export default App;
