import React, { useEffect, useState } from 'react';
import { getNotificationsForEmployee, createNotification, markNotificationAsRead, deleteNotification, Notification } from '../services/notificationService';
import { getAllEmployees, Employee } from '../services/employeeService';
import { getEmployeeIdFromLocalStorage } from '../services/notificationService';

/**
 * NotificationList Component
 *
 * The NotificationList component is used to manage and display notifications for employees. It allows users to:
 * - View a list of notifications assigned to them.
 * - Mark notifications as read.
 * - Delete notifications.
 * - Create a new notification with a message, type, and assign it to a specific employee.
 * 
 * Key Features:
 * - Notifications are fetched from an API and displayed in a list.
 * - Users can mark notifications as read, which changes the appearance (opacity) of the notification.
 * - Notifications can be deleted from the list.
 * - A modal is used to create new notifications. The modal allows users to enter a message, select a type (info, warning, error), and assign the notification to an employee.
 *
 * States:
 * - `notifications` (Notification[]): Holds the list of notifications for the logged-in employee.
 * - `isModalOpen` (boolean): Tracks whether the modal for creating a notification is open or closed.
 * - `message` (string): Contains the message for the new notification.
 * - `type` ('info' | 'warning' | 'error'): Defines the type of notification (info, warning, or error).
 * - `selectedEmployeeId` (string | null): Holds the ID of the employee to whom the notification will be assigned.
 * - `employees` (Employee[]): Contains a list of all employees fetched from the API for assignment purposes.
 * - `isLoading` (boolean): Tracks the loading state while creating a notification.
 *
 * Usage:
 * This component is used in employee notification management interfaces, allowing users to view, mark, delete, and create notifications.
 *
 * Example:
 * ```
 * <NotificationList />
 * ```
 */


const NotificationList: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<'info' | 'warning' | 'error'>('info');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotificationsAndEmployees = async () => {
      try {
        const employeeId = getEmployeeIdFromLocalStorage();
        
        if (!employeeId) {
          console.error('No employee ID found in local storage.');
          return;
        }

        const fetchedNotifications = await getNotificationsForEmployee();
        setNotifications(fetchedNotifications);

        const fetchedEmployees = await getAllEmployees();
        setEmployees(fetchedEmployees);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchNotificationsAndEmployees();
  }, []);

  const handleMarkAsRead = async (notificationId: string, read: boolean) => {
    try {
      const updatedNotification = await markNotificationAsRead(notificationId, read);
      setNotifications((prevNotifications) =>
        prevNotifications.map((notification) =>
          notification._id === updatedNotification._id ? updatedNotification : notification
        )
      );
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleDeleteNotification = async (notificationId: string) => {
    try {
      await deleteNotification(notificationId);
      setNotifications((prevNotifications) =>
        prevNotifications.filter((notification) => notification._id !== notificationId)
      );
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const openModal = () => setIsModalOpen(true);

  const closeModal = () => setIsModalOpen(false);

  const handleCreateNotification = async () => {
    if (!message || !type || !selectedEmployeeId) {
      alert('Please fill in all fields.');
      return;
    }

    setIsLoading(true);
    try {
      const newNotification = await createNotification(message, type, selectedEmployeeId);
      setNotifications([...notifications, newNotification]);
      closeModal();
    } catch (error) {
      console.error('Error creating notification:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <h2>Your Notifications</h2>
      <button className="btn btn-primary mb-3" onClick={openModal}>
        Create Notification
      </button>

      <ul className="list-group">
        {notifications.map((notification) => (
          <li key={notification._id} className="list-group-item d-flex justify-content-between align-items-center" style={{ opacity: notification.read ? 0.5 : 1 }}>
            <div>
              <span>{notification.message}</span>
              <div className="text-muted">{new Date(notification.createdAt).toLocaleString()}</div>
            </div>
            <div>
              <button
                className="btn btn-sm btn-outline-primary me-2"
                onClick={() => handleMarkAsRead(notification._id, true)}
                disabled={notification.read}
              >
                Mark as Read
              </button>
              <button
                className="btn btn-sm btn-outline-danger"
                onClick={() => handleDeleteNotification(notification._id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>

      {isModalOpen && (
        <div className="modal fade show" style={{ display: 'block' }} onClick={closeModal}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Create Notification</h5>
                <button type="button" className="btn-close" onClick={closeModal}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label htmlFor="message" className="form-label">Message</label>
                  <input
                    type="text"
                    id="message"
                    className="form-control"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter notification message"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="type" className="form-label">Type</label>
                  <select
                    id="type"
                    className="form-select"
                    value={type}
                    onChange={(e) => setType(e.target.value as 'info' | 'warning' | 'error')}
                  >
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="error">Error</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="employee" className="form-label">Assign to Employee</label>
                  <select
                    id="employee"
                    className="form-select"
                    value={selectedEmployeeId || ''}
                    onChange={(e) => setSelectedEmployeeId(e.target.value)}
                  >
                    <option value="">Select Employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={handleCreateNotification}
                  disabled={isLoading}
                >
                  {isLoading ? 'Saving...' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationList;
