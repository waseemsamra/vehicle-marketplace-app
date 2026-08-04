import { listVehicles, getVehicle, searchVehicles, getMakes, getModels, createVehicle, updateVehicle, deleteVehicle } from './mcpClient.js';
import { findVehicles, findVehicleById, findMakes, findModels, createVehicle as mongoCreate, updateVehicle as mongoUpdate, deleteVehicle as mongoDelete, aggregateVehicles } from './mongoClient.js';

class VehicleBot {
  constructor() {
    this.mcpAvailable = false;
    this.mongoAvailable = false;
  }

  async init() {
    try {
      await getMakes();
      this.mcpAvailable = true;
    } catch {
      this.mcpAvailable = false;
    }
    try {
      await findMakes();
      this.mongoAvailable = true;
    } catch {
      this.mongoAvailable = false;
    }
    return { mcp: this.mcpAvailable, mongo: this.mongoAvailable };
  }

  async listVehicles(params = {}) {
    const { make, model, minPrice, maxPrice, minYear, maxYear, fuelType, transmission, bodyType, keyword, status, limit, offset } = params;
    if (this.mcpAvailable) {
      try {
        return await listVehicles({ make, model, minPrice, maxPrice, minYear, maxYear, fuelType, transmission, bodyType, keyword, status, limit, offset });
      } catch {
        if (!this.mongoAvailable) throw new Error('Both MCP and MongoDB are unavailable');
      }
    }
    if (this.mongoAvailable) {
      const filter = {};
      if (make) filter.make = make;
      if (model) filter.model = model;
      if (minPrice || maxPrice) {
        filter.priceNum = {};
        if (minPrice) filter.priceNum.$gte = Number(minPrice);
        if (maxPrice) filter.priceNum.$lte = Number(maxPrice);
      }
      if (minYear) filter.year = { $gte: Number(minYear) };
      if (maxYear) filter.year = { ...filter.year, $lte: Number(maxYear) };
      if (fuelType) filter.fuel = fuelType;
      if (bodyType) filter.body = bodyType;
      if (status) filter.status = status;
      return await findVehicles(filter, { limit: limit || 50, offset: offset || 0 });
    }
    throw new Error('No data source available');
  }

  async getVehicle(id) {
    if (this.mcpAvailable) {
      try {
        return await getVehicle(id);
      } catch {
        if (!this.mongoAvailable) throw new Error('Both MCP and MongoDB are unavailable');
      }
    }
    if (this.mongoAvailable) {
      return await findVehicleById(id);
    }
    throw new Error('No data source available');
  }

  async searchVehicles(query, params = {}) {
    if (this.mcpAvailable) {
      try {
        return await searchVehicles(query, params);
      } catch {
        if (!this.mongoAvailable) throw new Error('Both MCP and MongoDB are unavailable');
      }
    }
    if (this.mongoAvailable) {
      const filter = {};
      if (query) {
        filter.$or = [
          { make: { $regex: query, $options: 'i' } },
          { model: { $regex: query, $options: 'i' } },
          { title: { $regex: query, $options: 'i' } },
        ];
      }
      if (params.make) filter.make = params.make;
      if (params.model) filter.model = params.model;
      if (params.maxPrice) {
        filter.priceNum = { $lte: Number(params.maxPrice) };
      }
      return await findVehicles(filter, { limit: params.limit || 50 });
    }
    throw new Error('No data source available');
  }

  async getMakes() {
    if (this.mcpAvailable) {
      try {
        return await getMakes();
      } catch {
        if (!this.mongoAvailable) throw new Error('Both MCP and MongoDB are unavailable');
      }
    }
    if (this.mongoAvailable) {
      const makes = await findMakes();
      return makes.map(m => ({ makeName: m.makeName }));
    }
    throw new Error('No data source available');
  }

  async getModels(make) {
    if (this.mcpAvailable) {
      try {
        return await getModels(make);
      } catch {
        if (!this.mongoAvailable) throw new Error('Both MCP and MongoDB are unavailable');
      }
    }
    if (this.mongoAvailable) {
      const models = await findModels(make);
      return models.map(m => ({ modelName: m.modelName, brandName: m.brandName }));
    }
    throw new Error('No data source available');
  }

  async addVehicle(data, token) {
    if (this.mcpAvailable && token) {
      try {
        return await createVehicle(data, token);
      } catch {
        if (!this.mongoAvailable) throw new Error('Both MCP and MongoDB are unavailable');
      }
    }
    if (this.mongoAvailable) {
      return await mongoCreate(data);
    }
    throw new Error('No data source available');
  }

  async editVehicle(id, data, token) {
    if (this.mcpAvailable && token) {
      try {
        return await updateVehicle(id, data, token);
      } catch {
        if (!this.mongoAvailable) throw new Error('Both MCP and MongoDB are unavailable');
      }
    }
    if (this.mongoAvailable) {
      return await mongoUpdate(id, data);
    }
    throw new Error('No data source available');
  }

  async removeVehicle(id, token) {
    if (this.mcpAvailable && token) {
      try {
        return await deleteVehicle(id, token);
      } catch {
        if (!this.mongoAvailable) throw new Error('Both MCP and MongoDB are unavailable');
      }
    }
    if (this.mongoAvailable) {
      return await mongoDelete(id);
    }
    throw new Error('No data source available');
  }

  async aggregate(pipeline) {
    if (!this.mongoAvailable) throw new Error('MongoDB is unavailable');
    return await aggregateVehicles(pipeline);
  }
}

export default VehicleBot;