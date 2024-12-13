import React, { useState, useEffect } from 'react';
import { Service, CreateServiceDto, UpdateServiceDto } from '../services/serviceService';
import { getAllServices, createService, updateService, deleteService } from '../services/serviceService';

/**
 * ServiceList Component
 *
 * The ServiceList component is used to manage the services within an application. It allows users to:
 * - View a list of existing services.
 * - Add a new service with name, description, and rate.
 * - Edit an existing service's details.
 * - Delete a service.
 * 
 * Key Features:
 * - Services are fetched from an API and displayed in a list.
 * - New services can be added with a form that captures service name, description, and rate.
 * - Existing services can be edited through a modal where the user can modify service details.
 * - Users can delete services, which are removed from the displayed list after deletion.
 * - A modal is used for editing services, providing an interactive interface for modifications.
 *
 * States:
 * - `services` (Service[]): Holds the list of all services fetched from the server.
 * - `newService` (CreateServiceDto): Contains the data for the new service being added (name, description, rate).
 * - `editingService` (UpdateServiceDto | null): Holds the data of the service being edited.
 * - `editingServiceId` (string | null): Tracks the ID of the service being edited.
 * - `showModal` (boolean): Determines whether the modal for editing a service is shown or not.
 *
 * Usage:
 * This component is primarily used in service management interfaces, allowing admins or users with the right permissions to manage services by adding, editing, and deleting them.
 *
 * Example:
 * ```
 * <ServiceList />
 * ```
 */

const ServiceList: React.FC = () => {
  const [services, setServices] = useState<Service[]>([]);
  const [newService, setNewService] = useState<CreateServiceDto>({ name: '', description: '', rate: 0 });
  const [editingService, setEditingService] = useState<UpdateServiceDto | null>(null);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const serviceList = await getAllServices();
        setServices(serviceList);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  const handleAddService = async () => {
    try {
      const addedService = await createService(newService);
      setServices([...services, addedService]);
      setNewService({ name: '', description: '', rate: 0 });
    } catch (error) {
      console.error('Error adding service:', error);
    }
  };

  const handleUpdateService = async () => {
    if (!editingServiceId || !editingService) return;
    try {
      const updatedService = await updateService(editingServiceId, editingService);
      setServices(services.map((service) => (service._id === editingServiceId ? updatedService : service)));
      setEditingService(null);
      setEditingServiceId(null);
      setShowModal(false);
    } catch (error) {
      console.error('Error updating service:', error);
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    try {
      await deleteService(serviceId);
      setServices(services.filter((service) => service._id !== serviceId));
    } catch (error) {
      console.error('Error deleting service:', error);
    }
  };

  const handleEditService = (service: Service) => {
    setEditingService({
      name: service.name || '', 
      description: service.description || '',
      rate: service.rate || 0,
    });
    setEditingServiceId(service._id);
    setShowModal(true);
  };

  return (
    <div className="container mt-4">
      <h1 className="mb-4">Service List</h1>

      {/* Add Service Form */}
      <div className="card mb-4">
        <div className="card-header">Add Service</div>
        <div className="card-body">
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input
              type="text"
              className="form-control"
              placeholder="Service name"
              value={newService.name}
              onChange={(e) => setNewService({ ...newService, name: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              placeholder="Service description"
              value={newService.description}
              onChange={(e) => setNewService({ ...newService, description: e.target.value })}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Rate</label>
            <input
              type="number"
              className="form-control"
              value={newService.rate}
              onChange={(e) => setNewService({ ...newService, rate: Number(e.target.value) })}
            />
          </div>
          <button className="btn btn-primary" onClick={handleAddService}>
            Add Service
          </button>
        </div>
      </div>

      {/* Services List */}
      <div className="mb-4">
        <h2>Existing Services</h2>
        {services.map((service) => (
          <div key={service._id} className="card mb-3">
            <div className="card-body">
              <h5 className="card-title">{service.name}</h5>
              <p className="card-text">{service.description}</p>
              <p className="card-text">
                <strong>Rate:</strong> ${service.rate}
              </p>
              <button
                className="btn btn-secondary me-2"
                onClick={() => handleEditService(service)}
              >
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteService(service._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Service Modal */}
      {showModal && editingServiceId && (
        <div className="modal show" style={{ display: 'block' }} onClick={() => setShowModal(false)}>
          <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Service</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editingService?.name || ''}
                    onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={editingService?.description || ''}
                    onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Rate</label>
                  <input
                    type="number"
                    className="form-control"
                    value={editingService?.rate || 0}
                    onChange={(e) => setEditingService({ ...editingService, rate: Number(e.target.value) })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Close
                </button>
                <button type="button" className="btn btn-primary" onClick={handleUpdateService}>
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

export default ServiceList;
