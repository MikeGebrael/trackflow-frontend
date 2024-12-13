import React, { useState } from 'react';
import Notification from '../components/NotificationList';
import TaskList from '../components/SimpleTaskList';
import VideoCallComponent from '../components/VideoCallComponent';

/**
 * EmployeePage Component
 *
 * The EmployeePage component is designed to serve as the dashboard for employees. It provides a sidebar
 * for navigation between different views and a main content area to display the selected view, either the
 * task list or the video call interface.
 *
 * Components displayed include:
 * - `Notification`: Displays notifications relevant to the employee.
 * - `TaskList`: Displays a list of tasks assigned to the employee.
 * - `VideoCallComponent`: Displays the video call interface for communication with others.
 *
 * States:
 * - `view` (string): A state variable used to toggle between the different views ('tasks' or 'videoCall') based
 *   on the employee's selection from the sidebar.
 *
 * Usage:
 * This page is intended for employees to manage their tasks, view notifications, and participate in video calls.
 * The sidebar provides easy access to the task list and video call features, and the content area dynamically
 * renders the selected view.
 *
 * Example:
 * ```
 * <EmployeePage />
 * ```
 */
const EmployeePage: React.FC = () => {
  // State to track the selected view in the main content area
  const [view, setView] = useState<'tasks' | 'videoCall'>('tasks'); // Default view: 'tasks'

  return (
    <div className="container-fluid">
      <div className="row">
        {/* Sidebar for navigation */}
        <div className="col-md-3 col-lg-2 sidebar bg-info text-light p-4 vh-100">
          <h4 className="mb-4 text-center">Employee Dashboard</h4>
          <div className="list-group">
            {/* Task List Button */}
            <button
              className="list-group-item list-group-item-action bg-info text-light border-0"
              onClick={() => setView('tasks')}
            >
              <i className="fas fa-tasks me-2"></i> Task List
            </button>
            {/* Video Call Button */}
            <button
              className="list-group-item list-group-item-action bg-info text-light border-0"
              onClick={() => setView('videoCall')}
            >
              <i className="fas fa-video me-2"></i> Video Call
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="col-md-9 col-lg-10 content-area p-4">
          {/* Notification Card */}
          <div className="card mb-4 shadow-sm">
            <div className="card-header d-flex justify-content-between align-items-center">
              <h5 className="mb-0">Notifications</h5>
              <span className="badge bg-warning">New</span>
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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeePage;
