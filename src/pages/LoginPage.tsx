import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginEmployee, LoginResponse } from '../services/authService';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const { employee, token }: LoginResponse = await loginEmployee(username, password);

      // Store the JWT token in localStorage (or another storage method)
      localStorage.setItem('token', token);

      // Render the appropriate page based on the employee's role
      if (employee.role === 'admin') {
        // Redirect to the AdminPage
        navigate('/admin');
      } else if (employee.role === 'manager') {
        // Redirect to the ManagerPage
        navigate('/manager');
      } else {
        // Redirect to the EmployeePage
        navigate('/employee');
      }
    } catch (error) {
      setError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center">Login</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit} className="w-50 mx-auto">
        <div className="mb-3">
          <label htmlFor="username" className="form-label">Username</label>
          <input
            type="text"
            id="username"
            className="form-control"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">Password</label>
          <input
            type="password"
            id="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary w-100">Login</button>
      </form>
    </div>
  );
};

export default LoginPage;
