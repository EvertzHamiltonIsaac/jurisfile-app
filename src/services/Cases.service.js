import { api } from './api';

export const casesService = {
  getAll() {
    return api.get('/api/cases');
  },

  getCasesStatus() {
    return api.get('');
  },

  getCasesType() {
    return api.get('');
  },

  getOne(id) {
    return api.get(`/api/cases/${id}`);
  },

  getTeam(id) {
    return api.get(`/api/cases/${id}/team`);
  },

  create(data) {
    return api.post('/api/cases', data);
  },

  update(id, data) {
    return api.patch(`/api/cases/${id}`, data);
  },

  assignUser(id, data) {
    return api.post(`/api/cases/${id}/team`, data);
  },
};
