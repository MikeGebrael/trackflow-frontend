import axios from 'axios';

// The API base URL for notifications
const API_BASE_URL = 'http://localhost:3000/notifications';

// Notification Interface for structure
export interface Notification {
  _id: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: Date;
}

// Function to retrieve the stored JWT token from localStorage
/**
 * Retrieves the JWT token from localStorage.
 * @returns {string | null} The stored token or null if not found.
 */
const getStoredToken = (): string | null => {
  return localStorage.getItem('token');
};

// Function to retrieve the employee ID from localStorage
/**
 * Retrieves the employee ID from localStorage.
 * @returns {string | null} The stored employee ID or null if not found.
 */
export const getEmployeeIdFromLocalStorage = (): string | null => {
  const employee = JSON.parse(localStorage.getItem('employee') || '{}');
  return employee._id || null;
};

// Axios instance with dynamic authorization header
const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${getStoredToken()}`, // Attach the token dynamically
  },
});

/**
 * Fetches notifications for the employee from the backend.
 * @returns {Promise<Notification[]>} A promise that resolves to an array of notifications.
 * @throws Will throw an error if the request fails or if no employee ID is found.
 */
export const getNotificationsForEmployee = async (): Promise<Notification[]> => {
  const employeeId = getEmployeeIdFromLocalStorage();
  if (!employeeId) throw new Error('Employee not found in local storage.');

  try {
    const response = await axiosInstance.get(`${API_BASE_URL}/employee/${employeeId}`);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching notifications:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch notifications');
  }
};

/**
 * Creates a new notification for a specific employee.
 * @param message The message content of the notification.
 * @param type The type of the notification (e.g., "info", "warning").
 * @param employeeId The ID of the employee the notification is for.
 * @returns {Promise<Notification>} A promise that resolves to the created notification.
 * @throws Will throw an error if required fields are missing or if the request fails.
 */
export const createNotification = async (message: string, type: string, employeeId: string): Promise<Notification> => {
  if (!message || !type || !employeeId) {
    throw new Error('Message, type, and employeeId are required');
  }

  const createNotificationDto = {
    message,
    type,
    employeeId,
  };

  try {
    const response = await axiosInstance.post(`${API_BASE_URL}/employee/${employeeId}`, createNotificationDto);
    return response.data;
  } catch (error: any) {
    console.error('Error creating notification:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create notification');
  }
};

/**
 * Marks a notification as read or unread.
 * @param notificationId The ID of the notification to update.
 * @param read A boolean indicating whether the notification is read.
 * @returns {Promise<Notification>} A promise that resolves to the updated notification.
 * @throws Will throw an error if the request fails.
 */
export const markNotificationAsRead = async (notificationId: string, read: boolean): Promise<Notification> => {
  const updateNotificationDto = {
    read,
  };

  try {
    const response = await axiosInstance.patch(`${API_BASE_URL}/${notificationId}`, updateNotificationDto);
    return response.data;
  } catch (error: any) {
    console.error('Error marking notification as read:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to mark notification as read');
  }
};

/**
 * Deletes a notification by its ID.
 * @param notificationId The ID of the notification to delete.
 * @returns {Promise<void>} A promise that resolves once the notification is deleted.
 * @throws Will throw an error if the request fails or if the notification ID is missing.
 */
export const deleteNotification = async (notificationId: string): Promise<void> => {
  if (!notificationId) {
    throw new Error('Notification ID is required');
  }

  try {
    await axiosInstance.delete(`${API_BASE_URL}/${notificationId}`);
    console.log(`Notification with ID ${notificationId} deleted successfully.`);
  } catch (error: any) {
    console.error('Error deleting notification:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete notification');
  }
};
