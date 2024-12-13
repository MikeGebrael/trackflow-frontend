import axios from 'axios';

// Define the interfaces directly here
export interface Service {
  _id: string;
  name: string;
  description: string;
  rate: number;
}

export interface CreateServiceDto {
  name: string;
  description: string;
  rate: number;
}

export interface UpdateServiceDto {
  name?: string;
  description?: string;
  rate?: number;
}

// Base URL for the API (adjust if necessary)
const API_URL = 'http://localhost:3000/services';

/**
 * Retrieves the authentication token from localStorage.
 * @returns {string | null} The stored token or null if not found.
 */
const getAuthToken = () => {
  return localStorage.getItem('token'); // Adjust as necessary
};

// Axios instance with Authorization header
const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach token to every request
axiosInstance.interceptors.request.use((config) => {
  const token = getAuthToken();
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

/**
 * Fetches all services from the API.
 * @returns {Promise<Service[]>} A promise that resolves to an array of services.
 * @throws Will throw an error if the request fails.
 */
export const getAllServices = async (): Promise<Service[]> => {
  try {
    const response = await axiosInstance.get('/');
    return response.data;
  } catch (error) {
    console.error('Error fetching services:', error);
    throw error;  // Rethrow the error for the caller to handle
  }
};

/**
 * Fetches a specific service by its ID from the API.
 * @param {string} id The ID of the service to retrieve.
 * @returns {Promise<Service>} A promise that resolves to the service with the specified ID.
 * @throws Will throw an error if the request fails.
 */
export const getServiceById = async (id: string): Promise<Service> => {
  try {
    const response = await axiosInstance.get(`/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching service by ID:', error);
    throw error;  // Rethrow the error for the caller to handle
  }
};

/**
 * Creates a new service using the provided data.
 * @param {CreateServiceDto} createServiceDto The data to create a new service.
 * @returns {Promise<Service>} A promise that resolves to the newly created service.
 * @throws Will throw an error if the request fails.
 */
export const createService = async (createServiceDto: CreateServiceDto): Promise<Service> => {
  try {
    const response = await axiosInstance.post('/', createServiceDto);
    return response.data;
  } catch (error) {
    console.error('Error creating service:', error);
    throw error;  // Rethrow the error for the caller to handle
  }
};

/**
 * Updates an existing service by its ID.
 * @param {string} id The ID of the service to update.
 * @param {UpdateServiceDto} updateServiceDto The data to update the service.
 * @returns {Promise<Service>} A promise that resolves to the updated service.
 * @throws Will throw an error if the request fails.
 */
export const updateService = async (
  id: string,
  updateServiceDto: UpdateServiceDto
): Promise<Service> => {
  try {
    const response = await axiosInstance.put(`/${id}`, updateServiceDto);
    return response.data;
  } catch (error) {
    console.error('Error updating service:', error);
    throw error;  // Rethrow the error for the caller to handle
  }
};

/**
 * Deletes a service by its ID.
 * @param {string} id The ID of the service to delete.
 * @returns {Promise<void>} A promise that resolves once the service is deleted.
 * @throws Will throw an error if the request fails.
 */
export const deleteService = async (id: string): Promise<void> => {
  try {
    await axiosInstance.delete(`/${id}`);
  } catch (error) {
    console.error('Error deleting service:', error);
    throw error;  // Rethrow the error for the caller to handle
  }
};
