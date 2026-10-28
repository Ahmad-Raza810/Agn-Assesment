import api from './api';

const extractData = (response) => {
  if (response && response.data && response.data.data !== undefined) {
    return response.data.data;
  }
  return response?.data;
};

export const leadService = {
  async submitEnquiry(enquiryData) {
    const response = await api.post('/enquiries', enquiryData);
    return extractData(response);
  },

  async getDashboardSummary() {
    const response = await api.get('/leads/dashboard');
    return extractData(response);
  },

  async getLeads({ page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    const response = await api.get('/leads', {
      params: { page, size, sortBy, sortDir },
    });
    return extractData(response);
  },

  async searchLeads({ name, service, status, page = 0, size = 10, sortBy = 'createdAt', sortDir = 'desc' } = {}) {
    const params = { page, size, sortBy, sortDir };
    if (name && name.trim()) params.name = name.trim();
    if (service && service.trim()) params.service = service.trim();
    if (status && status !== 'ALL') params.status = status;

    const response = await api.get('/leads/search', { params });
    return extractData(response);
  },

  async getLeadById(id) {
    const response = await api.get(`/leads/${id}`);
    return extractData(response);
  },

  async updateLeadStatus(id, status) {
    const response = await api.patch(`/leads/${id}/status`, { status });
    return extractData(response);
  },

  async addFollowUp(id, { notes, nextFollowUpDate }) {
    const payload = { notes };
    if (nextFollowUpDate) {
      payload.nextFollowUpDate = nextFollowUpDate;
    }
    const response = await api.post(`/leads/${id}/follow-ups`, payload);
    return extractData(response);
  },

  async deleteLead(id) {
    const response = await api.delete(`/leads/${id}`);
    return extractData(response);
  },
};
