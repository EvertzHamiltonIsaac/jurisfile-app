import { api } from './api';

export const clientsService = {
  getAll() {
    return api.get('/api/clients');
  },

  getOne(id) {
    return api.get(`/api/clients/${id}`);
  },

  getClientCases(id) {
    return api.get(`/api/clients/${id}/cases`);
  },

  create(data) {
    return api.post('/api/clients', data);
  },

  update(id, data) {
    return api.patch(`/api/clients/${id}`, data);
  },

  remove(id) {
    return api.delete(`/api/clients/${id}`);
  },
};
