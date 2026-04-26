import { api } from './api';

export const documentsService = {
  getCaseDocuments(caseId) {
    return api.get(`/api/documents/case/${caseId}`);
  },

  getVersions(documentId) {
    return api.get(`/api/documents/${documentId}/versions`);
  },

  // data = { case_id, category_id, title, description?,
  //           file_url, file_name, mime_type, file_size_bytes }
  upload(data) {
    return api.post('/api/documents/upload', data);
  },

  // data = { file_url, file_name, mime_type, file_size_bytes }
  uploadVersion(documentId, data) {
    return api.post(`/api/documents/${documentId}/versions`, data);
  },

  remove(documentId) {
    return api.delete(`/api/documents/${documentId}`);
  },
};
