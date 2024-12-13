import React, { useState, useEffect } from 'react';
import {
  getAllTasks,
  createTask,
  updateTaskById,
  deleteTaskById,
  Task,
  CreateTaskDto,
  UpdateTaskDto,
} from '../services/taskService';
import { getAllEmployees, Employee } from '../services/employeeService';
import { getAllServices, Service } from '../services/serviceService';
import { createNotification } from '../services/notificationService';

/**
 * TaskList Component
 *
 * The TaskList component is responsible for displaying, adding, updating, and deleting tasks within the system.
 * It allows administrators or users to manage tasks, assign them to employees, and link them to specific services.
 *
 * Key Features:
 * - Displays a list of tasks with relevant information such as title, description, status, deadline, assigned employee, and service.
 * - Provides functionality to add a new task, including specifying a title, description, deadline, assigned employee, and service.
 * - Allows editing of tasks, with a modal form to update task details.
 * - Enables deletion of tasks from the list.
 * - Dynamically fetches data for tasks, employees, and services from APIs.
 * - Ensures that only valid and existing employees and services are available for task assignment.
 *
 * States:
 * - `tasks` (Task[]): Holds the list of tasks fetched from the API.
 * - `employees` (Employee[]): Holds the list of employees fetched from the API.
 * - `services` (Service[]): Holds the list of services fetched from the API.
 * - `newTask` (CreateTaskDto): Stores data for the task being added.
 * - `editingTask` (UpdateTaskDto | null): Stores data for the task being edited.
 * - `editingTaskId` (string | null): Keeps track of the ID of the task being edited.
 * - `showModal` (boolean): Controls the visibility of the modal for editing tasks.
 *
 * Usage:
 * This component is primarily used in the context of managing tasks, allowing the user to:
 * - View a list of existing tasks.
 * - Add new tasks with relevant details.
 * - Edit existing tasks using a modal form.
 * - Delete tasks from the system.
 *
 * Example:
 * ```
 * <TaskList />
 * ```
 */


const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [newTask, setNewTask] = useState<CreateTaskDto>({
    title: '',
    description: '',
    status: 'Pending',
    deadline: '',
    assignedTo: null,
    service: null,
  });
  const [editingTask, setEditingTask] = useState<UpdateTaskDto | null>(null);
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const taskList = await getAllTasks();
        setTasks(taskList);

        const employeeList = await getAllEmployees();
        setEmployees(employeeList);

        const serviceList = await getAllServices();
        setServices(serviceList);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleAddTask = async () => {
    try {
      // Check if assignedTo is not null before proceeding
      if (newTask.assignedTo) {
        const addedTask = await createTask(newTask);
        const notification = await createNotification('You have been assigned a task', 'info', newTask.assignedTo._id);
        setTasks([...tasks, addedTask]);
  
        // Reset the task form
        setNewTask({
          title: '',
          description: '',
          status: 'Pending',
          deadline: '',
          assignedTo: null,
          service: null,
        });
      } else {
        console.error('Assigned employee is required');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };
  const handleUpdateTask = async () => {
    if (!editingTaskId || !editingTask) return;
    try {
      const updatedTask = await updateTaskById(editingTaskId, editingTask);
      setTasks(tasks.map((task) => (task._id === editingTaskId ? updatedTask : task)));
      setEditingTask(null);
      setEditingTaskId(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      await deleteTaskById(taskId);
      setTasks(tasks.filter((task) => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Task List</h1>

      {/* Add Task Form */}
      <div className="card mb-4">
        <div className="card-header">Add Task</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Title</label>
            <input
              type="text"
              className="form-control"
              placeholder="Task title"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Task description"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Deadline</label>
            <input
              type="date"
              className="form-control"
              value={newTask.deadline}
              onChange={(e) => setNewTask({ ...newTask, deadline: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Assign To</label>
            <select
              className="form-select"
              value={newTask.assignedTo?._id || ''}
              onChange={(e) => {
                const selectedEmployee = employees.find((emp) => emp._id === e.target.value);
                setNewTask({ ...newTask, assignedTo: selectedEmployee || null });
              }}
            >
              <option value="">Select an employee</option>
              {employees.length > 0 ? (
                employees.map((employee) => (
                  <option key={employee._id} value={employee._id}>
                    {employee.firstName} {employee.lastName}
                  </option>
                ))
              ) : (
                <option value="">Loading employees...</option>
              )}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Service</label>
            <select
              className="form-select"
              value={newTask.service?._id || ''}
              onChange={(e) => {
                const selectedService = services.find((service) => service._id === e.target.value);
                setNewTask({ ...newTask, service: selectedService || null });
              }}
            >
              <option value="">Select a service</option>
              {services.length > 0 ? (
                services.map((service) => (
                  <option key={service._id} value={service._id}>
                    {service.name}
                  </option>
                ))
              ) : (
                <option value="">Loading services...</option>
              )}
            </select>
          </div>
          <button className="btn btn-primary" onClick={handleAddTask}>
            Add Task
          </button>
        </div>
      </div>

      {/* Task List */}
      <div className="mb-4">
        <h2>Tasks</h2>
        {tasks.map((task) => {
          const assignedEmployee = task.assignedTo;
          const taskService = task.service;
          return (
            <div key={task._id} className="card mb-3">
              <div className="card-body">
                <h5 className="card-title">{task.title}</h5>
                <p className="card-text">{task.description}</p>
                <p className="card-text">
                  <strong>Status:</strong> {task.status}
                </p>
                <p className="card-text">
                  <strong>Deadline:</strong> {new Date(task.deadline).toLocaleDateString()}
                </p>
                <p className="card-text">
                  <strong>Assigned To:</strong> {assignedEmployee ? `${assignedEmployee.firstName} ${assignedEmployee.lastName}` : 'Unknown'}
                </p>
                <p className="card-text">
                  <strong>Service:</strong> {taskService ? taskService.name : 'None'}
                </p>
                <button
                  className="btn btn-secondary me-2"
                  onClick={() => {
                    setEditingTask({
                      title: task.title,
                      description: task.description,
                      status: task.status,
                      deadline: task.deadline,
                      assignedTo: task.assignedTo,
                      service: task.service || null,
                    });
                    setEditingTaskId(task._id);
                    setShowModal(true);
                  }}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => handleDeleteTask(task._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Task Modal */}
      {showModal && editingTaskId && (
        <div className="modal show" style={{ display: 'block' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Task</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingTask?.title || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={editingTask?.description || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Deadline</label>
                  <input
                    type="date"
                    className="form-control"
                    value={editingTask?.deadline || ''}
                    onChange={(e) => setEditingTask({ ...editingTask, deadline: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Assign To</label>
                  <select
                    className="form-select"
                    value={editingTask?.assignedTo?._id || ''}
                    onChange={(e) => {
                      const selectedEmployee = employees.find((emp) => emp._id === e.target.value);
                      setEditingTask({ ...editingTask, assignedTo: selectedEmployee || null });
                    }}
                  >
                    <option value="">Select an employee</option>
                    {employees.map((employee) => (
                      <option key={employee._id} value={employee._id}>
                        {employee.firstName} {employee.lastName}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Service</label>
                  <select
                    className="form-select"
                    value={editingTask?.service?._id || ''}
                    onChange={(e) => {
                      const selectedService = services.find((service) => service._id === e.target.value);
                      setEditingTask({ ...editingTask, service: selectedService || null });
                    }}
                  >
                    <option value="">Select a service</option>
                    {services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateTask}>
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

export default TaskList;
