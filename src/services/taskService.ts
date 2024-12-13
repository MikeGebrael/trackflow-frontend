import axios from 'axios';
import { Employee, getEmployeeIdFromLocalStorage } from './employeeService';
import { Service } from './serviceService';

// Task DTOs
export interface Task {
  _id: string;
  title: string;
  description: string;
  status: string; // 'On Standby', 'In Progress', 'Completed'
  deadline: string; // ISO string format
  service: Service | null;
  assignedTo: Employee | null; // Full Employee object
  cost: number;
  time: number;
}

export interface CreateTaskDto {
  title: string;
  description: string;
  status: string; // 'Pending', 'In Progress', 'Completed'
  deadline: string; // ISO string format
  service?: Service | null;
  assignedTo: Employee | null; // Full Employee object
}

export interface UpdateTaskDto {
  title?: string;
  description?: string;
  status?: string; // 'Pending', 'In Progress', 'Completed'
  deadline?: string; // ISO string format
  service?: Service | null;
  assignedTo?: Employee | null; // Full Employee object
}

// Get token from local storage
const getToken = (): string | null => {
  return localStorage.getItem('token');
};

// Create Axios instance with token
const API_BASE_URL = 'http://localhost:3000/tasks';
const apiClient = axios.create({
  baseURL: API_BASE_URL,
});

// Add a request interceptor to include the Authorization header
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// API functions with error handling

/**
 * Fetches all tasks from the API.
 * @returns {Promise<Task[]>} A promise that resolves to an array of tasks.
 * @throws Will throw an error if the request fails.
 */
export const getAllTasks = async (): Promise<Task[]> => {
  try {
    const response = await apiClient.get<Task[]>('');
    return response.data;
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    throw new Error('Failed to fetch tasks. Please try again later.');
  }
};

/**
 * Fetches a specific task by its ID from the API.
 * @param {string} id The ID of the task to retrieve.
 * @returns {Promise<Task>} A promise that resolves to the task with the specified ID.
 * @throws Will throw an error if the request fails.
 */
export const getTaskById = async (id: string): Promise<Task> => {
  try {
    const response = await apiClient.get<Task>(`/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching task with ID ${id}:`, error);
    throw new Error('Failed to fetch task. Please try again later.');
  }
};

/**
 * Creates a new task using the provided data.
 * @param {CreateTaskDto} createTaskDto The data to create a new task.
 * @returns {Promise<Task>} A promise that resolves to the newly created task.
 * @throws Will throw an error if the request fails.
 */
export const createTask = async (createTaskDto: CreateTaskDto): Promise<Task> => {
  try {
    const response = await apiClient.post<Task>('', createTaskDto);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    throw new Error('Failed to create task. Please check the data and try again.');
  }
};

/**
 * Updates an existing task by its ID.
 * @param {string} id The ID of the task to update.
 * @param {UpdateTaskDto} updateTaskDto The data to update the task.
 * @returns {Promise<Task>} A promise that resolves to the updated task.
 * @throws Will throw an error if the request fails.
 */
export const updateTaskById = async (id: string, updateTaskDto: UpdateTaskDto): Promise<Task> => {
  try {
    const response = await apiClient.put<Task>(`/${id}`, updateTaskDto);
    return response.data;
  } catch (error) {
    console.error(`Error updating task with ID ${id}:`, error);
    throw new Error('Failed to update task. Please check the data and try again.');
  }
};

/**
 * Deletes a task by its ID.
 * @param {string} id The ID of the task to delete.
 * @returns {Promise<void>} A promise that resolves once the task is deleted.
 * @throws Will throw an error if the request fails.
 */
export const deleteTaskById = async (id: string): Promise<void> => {
  try {
    await apiClient.delete(`/${id}`);
  } catch (error) {
    console.error(`Error deleting task with ID ${id}:`, error);
    throw new Error('Failed to delete task. Please try again later.');
  }
};

/**
 * Fetches all tasks assigned to the currently logged-in employee.
 * @returns {Promise<Task[]>} A promise that resolves to an array of tasks for the employee.
 * @throws Will throw an error if the request fails or if the employee ID is not found.
 */
export const getTasksByEmployeeId = async (): Promise<Task[]> => {
  const employeeId = getEmployeeIdFromLocalStorage();
  if (!employeeId) {
    throw new Error('Employee ID is not found in localStorage.');
  }

  try {
    const response = await apiClient.get<Task[]>(`/employee/${employeeId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching tasks for employee with ID ${employeeId}:`, error);
    throw new Error('Failed to fetch tasks for employee. Please try again later.');
  }
};
