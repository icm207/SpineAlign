import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:4000/api',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('spinealign_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.error || err.message || 'Error de red';
    return Promise.reject(new Error(message));
  }
);

export function login(email, password) {
  return api.post('/auth/login', { email, password }).then((r) => r.data);
}

export function getPatients() {
  return api.get('/patients').then((r) => (Array.isArray(r.data) ? r.data : r.data.value));
}

export function createPatient(data) {
  return api.post('/patients', data).then((r) => r.data);
}

export function getAssessments(patientId) {
  return api.get(`/patients/${patientId}/assessments`).then((r) => (Array.isArray(r.data) ? r.data : r.data.value));
}

export function createAssessment(patientId, file, coords) {
  const fd = new FormData();
  fd.append('image', file);
  fd.append('leftShoulder', JSON.stringify(coords.leftShoulder));
  fd.append('rightShoulder', JSON.stringify(coords.rightShoulder));
  fd.append('imageWidth', coords.imageWidth);
  fd.append('imageHeight', coords.imageHeight);
  return api.post(`/patients/${patientId}/assessments`, fd).then((r) => r.data);
}

export function getAssessment(id) {
  return api.get(`/assessments/${id}`).then((r) => r.data);
}

export function imageUrl(id) {
  return `${api.defaults.baseURL}/assessments/${id}/image`;
}

export async function downloadReport(id) {
  const res = await api.get(`/assessments/${id}/report`, { responseType: 'blob' });
  const url = URL.createObjectURL(res.data);
  const a = document.createElement('a');
  a.href = url;
  a.download = `spinealign-${id}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function fetchImageBlob(id) {
  const res = await api.get(`/assessments/${id}/image`, { responseType: 'blob' });
  return URL.createObjectURL(res.data);
}
