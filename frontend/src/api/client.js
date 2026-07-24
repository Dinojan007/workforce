const BASE_URL = '';

function getToken() {
  return localStorage.getItem('workforce_token');
}

function buildHeaders(isMultipart = false) {
  const headers = {};
  const token = getToken();
  if (token) headers['Authorization'] = `Token ${token}`;
  if (!isMultipart) headers['Content-Type'] = 'application/json';
  return headers;
}

async function apiFetch(endpoint, options = {}) {
  const { body, isMultipart = false, ...rest } = options;
  const config = {
    ...rest,
    headers: buildHeaders(isMultipart),
  };
  if (body) {
    config.body = isMultipart ? body : JSON.stringify(body);
  }
  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await response.json();
  return data;
}

export const api = {
  // Auth
  registerJobSeeker: (data) =>
    apiFetch('/authentication/registerJobSeeker', { method: 'POST', body: data }),

  registerClient: (data) =>
    apiFetch('/authentication/registerClientAndContractor', { method: 'POST', body: data }),

  login: (data) =>
    apiFetch('/authentication/memberLoginUsingPassword', { method: 'POST', body: data }),

  sendOtp: (data) =>
    apiFetch('/authentication/sendOtp', { method: 'POST', body: data }),

  dashboard: () =>
    apiFetch('/authentication/dashboard', { method: 'POST', body: {} }),

  changePassword: (data) =>
    apiFetch('/authentication/changePasswordApi', { method: 'POST', body: data }),

  // Jobs
  getJobList: (filters = {}) =>
    apiFetch('/jobs/getJobList', { method: 'POST', body: filters }),

  createJob: (data) =>
    apiFetch('/jobs/createJob', { method: 'POST', body: data }),

  applyJob: (data) =>
    apiFetch('/jobs/applyJob', { method: 'POST', body: data }),

  getJobApplicant: (data) =>
    apiFetch('/jobs/getJobApplicant', { method: 'POST', body: data }),

  getApplicationStatus: (data) =>
    apiFetch('/jobs/getApplicationStatus', { method: 'POST', body: data }),

  addApplicationStatus: (data) =>
    apiFetch('/jobs/addApplicationStatus', { method: 'POST', body: data }),

  addJobDetails: (data) =>
    apiFetch('/jobs/addJobDetails', { method: 'POST', body: data }),

  addPortfolio: (formData) =>
    apiFetch('/jobs/addPortfolio', { method: 'POST', body: formData, isMultipart: true }),
};
