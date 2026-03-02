import { useState, useEffect } from 'react';
import { customerService } from '../services/customerService';

export const useCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCustomers = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await customerService.getAll();
      setCustomers(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customer) => {
    setLoading(true);
    setError(null);
    try {
      const newCustomer = await customerService.create(customer);
      setCustomers([...customers, newCustomer]);
      return newCustomer;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCustomer = async (id, customer) => {
    setLoading(true);
    setError(null);
    try {
      const updated = await customerService.update(id, customer);
      setCustomers(customers.map(c => c.id === id ? updated : c));
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteCustomer = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await customerService.delete(id);
      setCustomers(customers.filter(c => c.id !== id));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  return { customers, loading, error, fetchCustomers, createCustomer, updateCustomer, deleteCustomer };
};
