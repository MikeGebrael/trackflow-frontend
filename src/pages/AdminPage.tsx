import React, { useState } from 'react';
import Notification from '../components/NotificationList';
import TaskList from '../components/TaskList';
import VideoCallComponent from '../components/VideoCallComponent';
import ServiceList from '../components/ServiceList';
import EmployeeList from '../components/EmployeeList';

/**
 * AdminPage Component
 *
 * The AdminPage component is the main dashboard for administrators. It provides a sidebar for navigation
 * and a main content area where different sections (tasks, video call, services, and employees) are displayed
 * based on the user's selection.
 *
 * Components displayed include:
 * - `Notification`: A list of active notifications.
 * - `TaskList`: A list of tasks assigned to employees.
 * - `VideoCallComponent`: A video call interface for the admin to manage calls.
 * - `ServiceList`: A service management interface for the admin.
 * - `EmployeeList`: A list of employees and their management options.
 *
 * States:
 * - `view` (string): Keeps track of the current section being viewed in the main content area. The state toggles between
 *   'tasks', 'videoCall', 'services', and 'employees'.
 *
 * Usage:
 * This page is designed for admins to manage different aspects of the system, such as tasks, services, employees,
 * and ongoing video calls. The sidebar allows switching between different views, while the main content area dynamically
 * updates to show the selected section.
 *
 * Example:
 * ```
 * <AdminPage />
 * ```
 */
const AdminPage: React.FC = () => {
  // State to track the selected view in the main content area
  const [view, setView] = useState<'tasks' | 'videoCall' | 'services' | 'employees'>('tasks'); // Default view: 'tasks'

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar for navigation */}
        <div className="col-md-3 col-lg-2 sidebar bg-dark text-light p-4 vh-100">
          <h4 className="mb-4 text-center text-white">Admin Panel</h4>
          <div className="list-group">
            {/* Task List Button */}
            <button
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              onClick={() => setView('tasks')}
            >
              <i className="fas fa-tasks me-2"></i> Task List
            </button>
            {/* Video Call Button */}
            <button
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              onClick={() => setView('videoCall')}
            >
              <i className="fas fa-video me-2"></i> Video Call
            </button>
            {/* Service List Button */}
            <button
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              onClick={() => setView('services')}
            >
              <i className="fas fa-cogs me-2"></i> Service List
            </button>
            {/* Employee List Button */}
            <button
              className="list-group-item list-group-item-action bg-dark text-light border-0"
              onClick={() => setView('employees')}
            >
              <i className="fas fa-users me-2"></i> Employee List
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9 col-lg-10 content-area p-4">
          {/* Notification Card */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Notifications</h5>
              <span className="badge bg-success">Active</span>
            </div>
            <div className="card-body">
              <Notification />  {/* Renders the Notification component */}
            </div>
          </div>

          {/* Section for displaying selected view */}
          <div className="card shadow-sm">
            <div className="card-body">
              {view === 'tasks' && <TaskList />}                {/* Displays the TaskList component */}
              {view === 'videoCall' && <VideoCallComponent />}  {/* Displays the VideoCallComponent */}
              {view === 'services' && <ServiceList />}          {/* Displays the ServiceList component */}
              {view === 'employees' && <EmployeeList />}        {/* Displays the EmployeeList component */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;

