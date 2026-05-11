import apiClient, { isBackendOnline } from './client';
import { demoListUsers, demoCreateUser, demoDeleteUser } from './demoStore';

export function listUsers() {
  if (isBackendOnline() === false) return Promise.resolve(demoListUsers());
  return apiClient.get('/users').then((r) => r.data);
}

export function createUser(data) {
  if (isBackendOnline() === false) return Promise.resolve(demoCreateUser(data));
  return apiClient.post('/users', data).then((r) => r.data);
}

export function deleteUser(id) {
  if (isBackendOnline() === false) { demoDeleteUser(id); return Promise.resolve(); }
  return apiClient.delete(`/users/${id}`);
}
