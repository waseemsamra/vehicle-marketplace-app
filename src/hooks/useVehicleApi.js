import { useState, useEffect, useCallback, useRef } from 'react';
import { vehicleApi } from '../services/vehicleApi';
import toast from 'react-hot-toast';

export const useVehicleApi = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastKey, setLastKey] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  
  const abortControllerRef = useRef(null);
  const fetchVehiclesRef = useRef(null);

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const fetchVehicles = useCallback(async (reset = false) => {
    const key = reset ? null : lastKey;
    if (!reset && !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await vehicleApi.getAll(key, 20);
      
      setVehicles(prev => reset ? result.items : [...prev, ...result.items]);
      setLastKey(result.lastKey);
      setHasMore(result.hasMore);
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch vehicles: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [lastKey, hasMore]);

  fetchVehiclesRef.current = fetchVehicles;

  const fetchVehicle = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const vehicle = await vehicleApi.getById(id);
      return vehicle;
    } catch (err) {
      setError(err.message);
      toast.error(`Failed to fetch vehicle: ${err.message}`);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createVehicle = useCallback(async (vehicle) => {
    setLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const newVehicle = await vehicleApi.create(vehicle, abortControllerRef.current.signal);
      setVehicles(prev => [newVehicle, ...prev]);
      toast.success('Vehicle created successfully!');
      return newVehicle;
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.message);
        toast.error(`Failed to create vehicle: ${err.message}`);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateVehicle = useCallback(async (id, vehicle) => {
    setLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      const updated = await vehicleApi.update(id, vehicle, abortControllerRef.current.signal);
      setVehicles(prev => prev.map(v => v.vehicleId === id ? updated : v));
      toast.success('Vehicle updated successfully!');
      return updated;
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.message);
        toast.error(`Failed to update vehicle: ${err.message}`);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteVehicle = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    abortControllerRef.current = new AbortController();

    try {
      await vehicleApi.delete(id, abortControllerRef.current.signal);
      setVehicles(prev => prev.filter(v => v.vehicleId !== id));
      toast.success('Vehicle deleted successfully!');
    } catch (err) {
      if (err.name !== 'CanceledError') {
        setError(err.message);
        toast.error(`Failed to delete vehicle: ${err.message}`);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const searchVehicles = useCallback(async (query) => {
    if (!query.trim()) {
      setLastKey(null);
      setHasMore(true);
      setVehicles([]);
      setTimeout(() => fetchVehiclesRef.current(true), 0);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const results = await vehicleApi.search(query);
      setVehicles(results);
      setHasMore(false);
    } catch (err) {
      setError(err.message);
      toast.error(`Search failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const filterVehicles = useCallback(async (filters) => {
    setLoading(true);
    setError(null);

    try {
      const results = await vehicleApi.filter(filters);
      setVehicles(results);
      setHasMore(false);
    } catch (err) {
      setError(err.message);
      toast.error(`Filter failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      fetchVehiclesRef.current(false);
    }
  }, [loading, hasMore]);

  const refresh = useCallback(() => {
    setLastKey(null);
    setHasMore(true);
    setVehicles([]);
    fetchVehiclesRef.current(true);
  }, []);

  return {
    vehicles,
    loading,
    error,
    hasMore,
    fetchVehicles,
    fetchVehicle,
    createVehicle,
    updateVehicle,
    deleteVehicle,
    searchVehicles,
    filterVehicles,
    loadMore,
    refresh,
  };
};
