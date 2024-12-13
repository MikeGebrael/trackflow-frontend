import React, { useState, useEffect } from 'react';
import { getAllTasks, updateTaskById, Task } from '../services/taskService';
import { getEmployeeIdFromLocalStorage } from '../services/employeeService';

/**
 * SimpleTaskList Component
 *
 * The SimpleTaskList component is designed for employees to view and manage their assigned tasks. It provides functionality to:
 * - Display a list of tasks that are assigned to the employee.
 * - Allow the employee to start, pause, or resume tasks (i.e., toggle task status).
 * - Track the time spent on tasks and calculate associated costs when the task is completed.
 * - Display completed tasks with their corresponding cost.
 *
 * Key Features:
 * - Tasks assigned to the current employee are fetched and displayed.
 * - Tasks that are in progress can be paused, and paused tasks can be resumed.
 * - The time spent on tasks is tracked when they are in progress, and a cost is calculated based on the time spent and the service rate.
 * - Tasks can be marked as completed, and the cost is calculated based on the time spent, the employee's salary, and the service rate.
 * - Completed tasks are displayed separately with the total cost of the task.
 *
 * States:
 * - `tasks` (Task[]): Holds the list of tasks that are currently in progress or on standby.
 * - `completedTasks` (Task[]): Holds the list of tasks that have been marked as completed.
 * - `timingTask` (Task | null): Keeps track of the task that is currently being timed (in progress).
 * - `startTime` (number | null): Stores the start time of the task being worked on, used to calculate the time spent.
 *
 * Usage:
 * This component is primarily used in the context of employees viewing and managing their tasks, allowing them to:
 * - View the list of tasks assigned to them.
 * - Start, pause, or resume tasks, and track the time spent on each task.
 * - Complete tasks and view the associated costs for completed tasks.
 *
 * Example:
 * ```
 * <SimpleTaskList />
 * ```
 */

const SimpleTaskList = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [completedTasks, setCompletedTasks] = useState<Task[]>([]);
  const [timingTask, setTimingTask] = useState<Task | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        // Fetch all tasks
        const tasksData = await getAllTasks();
        console.log('Fetched Tasks:', tasksData);

        // Get employeeId from local storage
        const employeeId = getEmployeeIdFromLocalStorage();
        if (!employeeId) {
          console.error('No employee ID found in local storage');
          return;
        }

        const employeeTasks = tasksData.filter((task: Task) => task.assignedTo?._id === employeeId);
        console.log('Employee Tasks:', employeeTasks);

        const activeTasks = employeeTasks.filter((task) => task.status !== 'Completed');
        const completedTasks = employeeTasks.filter((task) => task.status === 'Completed');
        
        // Set state
        setTasks(activeTasks);
        setCompletedTasks(completedTasks);

      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  const toggleTaskStatus = async (task: Task) => {
    const currentTime = startTime ? (Date.now() - startTime) / 1000 : 0;
    const updatedTask = { ...task, time: currentTime };

    if (task.status === 'In Progress') {
      updatedTask.status = 'On Standby';
      // Stop timing and update task with time spent
      await updateTaskById(task._id, updatedTask);
      setTimingTask(null);
      setStartTime(null);
    } else {
      updatedTask.status = 'In Progress';
      // Start timing
      setTimingTask(task);
      setStartTime(Date.now());
      await updateTaskById(task._id, updatedTask);
    }

    setTasks((prevTasks) =>
      prevTasks.map((t) => (t._id === task._id ? updatedTask : t))
    );
  };

  const completeTask = async (task: Task) => {
    const updatedTask = { ...task, status: 'Completed' };
    const totalTimeSpent = task.time || 0;
    const serviceRate = task.service?.rate || 0;
    const salary = task.assignedTo?.salary || 0;

    updatedTask.cost = totalTimeSpent * serviceRate * (salary / 1000);

    await updateTaskById(task._id, updatedTask);

    setCompletedTasks((prevCompletedTasks) => [...prevCompletedTasks, updatedTask]);
    setTasks((prevTasks) => prevTasks.filter((t) => t._id !== task._id));
  };

  return (
    <div className="container mt-4">
      <h1>Assigned Tasks</h1>
      {tasks.length === 0 ? (
        <p>No tasks assigned.</p>
      ) : (
        <ul className="list-group mb-4">
          {tasks.map((task) => (
            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{task.title}</h5>
                <p>{task.description}</p>
                <p><strong>Status:</strong> {task.status}</p>
                <p><strong>Time Spent:</strong> {task.time || 0} seconds</p>
              </div>
              <div>
                <button
                  className={`btn ${task.status === 'In Progress' ? 'btn-warning' : 'btn-success'} mr-2`}
                  onClick={() => toggleTaskStatus(task)}
                >
                  {task.status === 'In Progress' ? 'Pause' : 'Resume'}
                </button>
                {task.status === 'In Progress' && (
                  <button className="btn btn-primary" onClick={() => completeTask(task)}>
                    Complete Task
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      <h2>Completed Tasks</h2>
      {completedTasks.length === 0 ? (
        <p>No completed tasks.</p>
      ) : (
        <ul className="list-group">
          {completedTasks.map((task) => (
            <li key={task._id} className="list-group-item d-flex justify-content-between align-items-center">
              <div>
                <h5>{task.title}</h5>
                <p><strong>Cost:</strong> ${task.cost || 0}</p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SimpleTaskList;
