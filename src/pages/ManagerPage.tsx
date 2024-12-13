import React, { useState } from 'react';
import Notification from '../components/NotificationList';  // Assuming the Notification component already handles its own logic
import TaskList from '../components/TaskList';              // Assuming TaskList already handles its own logic
import VideoCallComponent from '../components/VideoCallComponent';  // Assuming VideoCallComponent already handles its own logic
import ServiceList from '../components/ServiceList';        // Assuming ServiceList handles service management logic
import EmployeeList from '../components/EmployeeList';      // Assuming EmployeeList manages employees (e.g., creating, updating, deleting employees)

/**
 * ManagerPage Component
 *
 * The ManagerPage component serves as the dashboard for managers. It allows managers to navigate between different views
 * such as the task list, video call interface, service list, and employee list. The sidebar provides navigation buttons,
 * and the content area dynamically displays the selected view.
 *
 * Components displayed include:
 * - `Notification`: Displays notifications relevant to the manager.
 * - `TaskList`: Displays a list of tasks assigned to employees or the manager.
 * - `VideoCallComponent`: Displays the video call interface for communication.
 * - `ServiceList`: Displays a list of services being managed.
 * - `EmployeeList`: Displays a list of employees for management purposes (e.g., creating, updating, deleting employees).
 *
 * States:
 * - `view` (string): A state variable used to toggle between the different views ('tasks', 'videoCall', 'services', or 'employees') based
 *   on the manager's selection from the sidebar.
 *
 * Usage:
 * This page is intended for managers to manage tasks, video calls, services, and employees. The sidebar provides easy access to each section,
 * and the content area dynamically renders the selected view based on the `view` state.
 *
 * Example:
 * ```
 * <ManagerPage />
 * ```
 */
const ManagerPage: React.FC = () => {
  // State to track the selected view in the main content area
  const [view, setView] = useState<'tasks' | 'videoCall' | 'services' | 'employees'>('tasks'); // Default view: 'tasks'

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar for navigation */}
        <div className="col-md-3 col-lg-2 sidebar bg-secondary text-light p-4 vh-100">
          <h4 className="mb-4 text-center text-white">Manager Panel</h4>
          <div className="list-group">
            {/* Task List Button */}
            <button
              className="list-group-item list-group-item-action bg-secondary text-light border-0"
              onClick={() => setView('tasks')}
            >
              <i className="fas fa-tasks me-2"></i> Task List
            </button>
            {/* Video Call Button */}
            <button
              className="list-group-item list-group-item-action bg-secondary text-light border-0"
              onClick={() => setView('videoCall')}
            >
              <i className="fas fa-video me-2"></i> Video Call
            </button>
            {/* Service List Button */}
            <button
              className="list-group-item list-group-item-action bg-secondary text-light border-0"
              onClick={() => setView('services')}
            >
              <i className="fas fa-cogs me-2"></i> Service List
            </button>
            {/* Employee List Button */}
            <button
              className="list-group-item list-group-item-action bg-secondary text-light border-0"
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
              <span className="badge bg-info">New</span>
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

export default ManagerPage;
