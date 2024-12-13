import React, { useState } from 'react';
import {
  getAllEmployees,
  createEmployee,
  updateEmployeeById,
  deleteEmployeeById,
  Employee,
  CreateEmployeeDto,
  UpdateEmployeeDto,
} from '../services/employeeService';

/**
 * EmployeeList Component
 *
 * The EmployeeList component is responsible for displaying a list of employees, allowing the creation, 
 * updating, and deletion of employee records. It manages the state for employee data, form data, and 
 * error or success messages, providing an interactive UI to handle employee management tasks.
 *
 * State Variables:
 * - employees: Stores the list of employee objects fetched from the server.
 * - error: Stores error messages that occur during API calls, such as failed fetch, create, update, or delete operations.
 * - message: Stores success messages to notify users about successful operations.
 * - formData: Stores the form data for creating a new employee, including username, password, first and last name, email, role, and skills.
 * - updateModalData: Stores the data for an employee when opening the update modal, including the employee's ID, first name, last name, email, role, and skills.
 *
 * useEffect Hook:
 * - Fetches the list of employees when the component is first mounted by calling the `fetchEmployees` function.
 *
 * Event Handlers:
 * - fetchEmployees: Fetches the employee data from the server and updates the `employees` state. Handles success and failure cases with appropriate messages.
 * - handleInputChange: Updates the `formData` state when the user interacts with the input fields in the employee creation form. It also processes the skills input to split the string into an array.
 * - handleCreateEmployee: Handles the creation of a new employee by sending the `formData` to the server. After a successful creation, the employee list is refreshed.
 * - handleUpdateEmployee: Handles updating an existing employee by sending the updated data in `updateModalData` to the server. After a successful update, the employee list is refreshed and the modal is closed.
 * - handleDeleteEmployee: Deletes an employee record from the server by ID. After successful deletion, the employee list is refreshed.
 * - handleModalOpen: Opens the modal to update an employee's details by populating the `updateModalData` with the employee's current data.
 * - handleModalClose: Closes the modal for updating an employee.
 * - handleUpdateInputChange: Updates the `updateModalData` when the user interacts with the update form fields.
 *
 * UI Elements:
 * - Employee List Table: Displays the list of employees with columns for ID, username, and action buttons (update and delete).
 * - Create Employee Form: Allows the creation of a new employee by providing input fields for username, password, first and last name, email, role, and skills.
 * - Update Employee Modal: Displays a modal for updating an employee's details. This modal contains input fields pre-filled with the employee's current data, which can be updated and saved.
 *
 * Error and Success Messages:
 * - The component displays success or error messages based on the outcome of the API calls (fetch, create, update, delete).
 *
 * The component uses Bootstrap classes for styling and modal functionality, and integrates with the backend services to manage employee data.
 */

const EmployeeList: React.FC = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [formData, setFormData] = useState<CreateEmployeeDto>({
    username: '',
    password: '',
    firstName: '',
    lastName: '',
    email: '',
    role: 'employee',
    skills: [],
  });
  const [updateModalData, setUpdateModalData] = useState<UpdateEmployeeDto | null>(null);

  const fetchEmployees = async () => {
    setError(null);
    setMessage(null);
    try {
      const data = await getAllEmployees();
      setEmployees(data);
      setMessage('Employees fetched successfully');
    } catch (err) {
      setError('Failed to fetch employees');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: name === 'skills' ? value.split(',').map((skill) => skill.trim()) : value,
    }));
  };

  const handleCreateEmployee = async () => {
    setError(null);
    setMessage(null);
    try {
      const newEmployee = await createEmployee(formData);
      setMessage(`Employee ${newEmployee.username} created successfully`);
      fetchEmployees();
    } catch (err) {
      setError('Failed to create employee');
    }
  };

  const handleUpdateEmployee = async () => {
    if (!updateModalData) return;

    setError(null);
    setMessage(null);
    try {
      const updatedEmployee = await updateEmployeeById(updateModalData._id as string, updateModalData);
      setMessage(`Employee ${updatedEmployee.username} updated successfully`);
      fetchEmployees();
      setUpdateModalData(null);
    } catch (err) {
      setError('Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    setError(null);
    setMessage(null);
    try {
      await deleteEmployeeById(id);
      setMessage(`Employee with ID ${id} deleted successfully`);
      fetchEmployees();
    } catch (err) {
      setError('Failed to delete employee');
    }
  };

  const handleModalOpen = (employee: Employee) => {
    setUpdateModalData({
      _id: employee._id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      role: employee.role,
      skills: employee.skills,
    });
  };

  const handleModalClose = () => {
    setUpdateModalData(null);
  };

  const handleUpdateInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setUpdateModalData((prevData) => ({
      ...prevData,
      [name]: name === 'skills' ? value.split(',').map((skill) => skill.trim()) : value,
    }));
  };

  return (
    <div className="container mt-4">
      <h2>Employee List</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {message && <div className="alert alert-success">{message}</div>}

      <div className="mb-4">
        <button className="btn btn-primary me-2" onClick={fetchEmployees}>
          Fetch Employees
        </button>
      </div>

      <div className="mb-4">
        <h4>Create Employee</h4>
        <form>
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              type="text"
              className="form-control"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">First Name</label>
            <input
              type="text"
              className="form-control"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Last Name</label>
            <input
              type="text"
              className="form-control"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Role</label>
            <select
              className="form-select"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Skills (comma-separated)</label>
            <input
              type="text"
              className="form-control"
              name="skills"
              value={formData.skills.join(', ')}
              onChange={handleInputChange}
            />
          </div>
          <button type="button" className="btn btn-success" onClick={handleCreateEmployee}>
            Create Employee
          </button>
        </form>
      </div>

      <h4>Employee List</h4>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee._id}>
              <td>{employee._id}</td>
              <td>{employee.username}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => handleModalOpen(employee)}
                >
                  Update
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteEmployee(employee._id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal for updating employee */}
      {updateModalData && (
        <div className="modal fade show" style={{ display: 'block' }} tabIndex={-1} aria-labelledby="updateModalLabel" aria-hidden="true">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="updateModalLabel">Update Employee</h5>
                <button type="button" className="btn-close" onClick={handleModalClose}></button>
              </div>
              <div className="modal-body">
                <form>
                  <div className="mb-3">
                    <label className="form-label">First Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="firstName"
                      value={updateModalData.firstName || ''}
                      onChange={handleUpdateInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Last Name</label>
                    <input
                      type="text"
                      className="form-control"
                      name="lastName"
                      value={updateModalData.lastName || ''}
                      onChange={handleUpdateInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      name="email"
                      value={updateModalData.email || ''}
                      onChange={handleUpdateInputChange}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role</label>
                    <select
                      className="form-select"
                      name="role"
                      value={updateModalData.role || 'employee'}
                      onChange={handleUpdateInputChange}
                    >
                      <option value="employee">Employee</option>
                      <option value="manager">Manager</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Skills (comma-separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="skills"
                      value={updateModalData.skills?.join(', ') || ''}
                      onChange={handleUpdateInputChange}
                    />
                  </div>
                </form>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleModalClose}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateEmployee}>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
