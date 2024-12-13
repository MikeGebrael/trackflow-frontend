import axios from 'axios';

// Your API base URL for employees
const API_BASE_URL = 'http://localhost:3000/employees';

// Updated Employee Interface (without tasks and projects)
export interface Employee {
  _id: string;
  username: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  skills: string[];
  salary: number;
  tasksCompleted: number;
  projectsCompleted: number;
  hoursWorked?: number; // Optional field
}

// Updated CreateEmployeeDto Interface (without tasks and projects)
export interface CreateEmployeeDto {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  skills: string[];
  salary?: number; // Optional field
  tasksCompleted?: number; // Optional field
  projectsCompleted?: number; // Optional field
  hoursWorked?: number; // Optional field
}

// Updated UpdateEmployeeDto Interface (without tasks and projects)
export interface UpdateEmployeeDto {
  _id?: string; // Optional field
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
  skills?: string[];
  salary?: number;
  tasksCompleted?: number;
  hoursWorked?: number;
}

// Function to get the token from local storage
/**
 * Retrieves the stored JWT token from localStorage.
 * @returns {string | null} The stored token, or null if not found.
 */
const getStoredToken = (): string | null => {
  return localStorage.getItem('token'); // Assuming the token is stored under 'token' in local storage
};

// Axios instance with dynamic authorization header
const axiosInstance = axios.create({
  headers: {
    Authorization: `Bearer ${getStoredToken()}`, // Attach the token dynamically
  },
});

/**
 * Fetches a list of all employees from the backend API.
 * @returns {Promise<Employee[]>} A promise that resolves to an array of Employee objects.
 * @throws Will throw an error if the request fails.
 */
export const getAllEmployees = async (): Promise<Employee[]> => {
  try {
    const response = await axiosInstance.get(API_BASE_URL);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching employees:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch employees');
  }
};

/**
 * Creates a new employee by sending data to the backend API.
 * @param employeeData The data for the new employee to be created.
 * @returns {Promise<Employee>} A promise that resolves to the created Employee object.
 * @throws Will throw an error if the request fails.
 */
export const createEmployee = async (employeeData: CreateEmployeeDto): Promise<Employee> => {
  // Ensure default values for optional fields
  const employeeDataWithDefaults = {
    ...employeeData,
    salary: employeeData.salary || 0,
    tasksCompleted: employeeData.tasksCompleted || 0,
    projectsCompleted: employeeData.projectsCompleted || 0,
    hoursWorked: employeeData.hoursWorked || 0,
  };

  try {
    const response = await axiosInstance.post(API_BASE_URL, employeeDataWithDefaults);
    return response.data;
  } catch (error: any) {
    console.error('Error creating employee:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create employee');
  }
};

/**
 * Updates an existing employee by ID.
 * @param id The ID of the employee to be updated.
 * @param employeeData The updated employee data.
 * @returns {Promise<Employee>} A promise that resolves to the updated Employee object.
 * @throws Will throw an error if the request fails.
 */
export const updateEmployeeById = async (id: string, employeeData: UpdateEmployeeDto): Promise<Employee> => {
  try {
    const response = await axiosInstance.put(`${API_BASE_URL}/${id}`, employeeData);
    return response.data;
  } catch (error: any) {
    console.error('Error updating employee:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to update employee');
  }
};

/**
 * Deletes an employee by ID.
 * @param id The ID of the employee to be deleted.
 * @returns {Promise<{ message: string }>} A promise that resolves to a confirmation message.
 * @throws Will throw an error if the request fails.
 */
export const deleteEmployeeById = async (id: string): Promise<{ message: string }> => {
  try {
    const response = await axiosInstance.delete(`${API_BASE_URL}/${id}`);
    return response.data;
  } catch (error: any) {
    console.error('Error deleting employee:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to delete employee');
  }
};

/**
 * Retrieves the stored employee object from localStorage.
 * @returns {Employee} The stored employee object, or an empty object if not found.
 */
export const getEmployeeFromLocalStorage = () => {
  try {
    const employee = JSON.parse(localStorage.getItem('employee') || '{}');
    return employee;
  } catch (error) {
    console.error('Error retrieving employee from localStorage:', error);
    return {}; // Return empty object in case of error
  }
};

/**
 * Retrieves the stored employee ID from localStorage.
 * @returns {string | null} The stored employee ID, or null if not found.
 */
export const getEmployeeIdFromLocalStorage = (): string | null => {
  try {
    const employee = JSON.parse(localStorage.getItem('employee') || '{}');
    return employee._id || null;
  } catch (error) {
    console.error('Error retrieving employee ID from localStorage:', error);
    return null; // Return null in case of error
  }
};
