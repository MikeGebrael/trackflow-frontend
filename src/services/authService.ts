// src/services/authService.ts

import axios from 'axios';

// Interface for the login response data structure
export interface LoginResponse {
  employee: {
    _id: string;
    username: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    skills: string[];
    salary: number;
    tasksCompleted: number;
  };
  token: string;
};

/**
 * Log in an employee by sending the provided username and password to the backend API.
 * The response will include the employee details and JWT token, which will be saved to localStorage.
 * 
 * @param username The username of the employee.
 * @param password The password of the employee.
 * @returns {Promise<LoginResponse>} The login response containing employee data and JWT token.
 * @throws Will throw an error if the login fails.
 */
export const loginEmployee = async (username: string, password: string): Promise<LoginResponse> => {
  try {
    // Sending POST request to authenticate the employee
    const response = await axios.post('http://localhost:3000/auth/login', {
      username,
      password,
    });

    const loginResponse: LoginResponse = response.data;

    // Save the employee object and token in localStorage for session persistence
    localStorage.setItem('employee', JSON.stringify(loginResponse.employee)); // Save employee object
    localStorage.setItem('token', loginResponse.token); // Save the Bearer token

    return loginResponse; // Return the login response
  } catch (error) {
    // Log error to console and throw a new error for further handling
    console.error("Login failed: ", error);
    throw new Error('Failed to login');
  }
};

/**
 * Retrieve the stored employee data from localStorage.
 * 
 * @returns {any | null} The stored employee object or null if not found.
 */
export const getStoredEmployee = (): any | null => {
  try {
    // Retrieve employee data from localStorage
    const employee = localStorage.getItem('employee');
    return employee ? JSON.parse(employee) : null; // Parse the data if found, otherwise return null
  } catch (error) {
    // Log error and return null if data retrieval fails
    console.error("Failed to retrieve stored employee: ", error);
    return null;
  }
};

/**
 * Retrieve the stored token from localStorage.
 * 
 * @returns {string | null} The stored token or null if not found.
 */
export const getStoredToken = (): string | null => {
  try {
    // Retrieve the token from localStorage
    return localStorage.getItem('token');
  } catch (error) {
    // Log error and return null if token retrieval fails
    console.error("Failed to retrieve stored token: ", error);
    return null;
  }
};

/**
 * Log out the employee by removing their data and token from localStorage.
 * 
 * This function is used when the employee wants to log out.
 */
export const logoutEmployee = () => {
  try {
    // Remove employee and token data from localStorage
    localStorage.removeItem('employee');
    localStorage.removeItem('token');
  } catch (error) {
    // Log error if any failure occurs during logout
    console.error("Logout failed: ", error);
  }
};
