import apiClient from './client';

export const createUser = (data) => apiClient.post('/users', data).then((r) => r.data);
export const listUsers = () => apiClient.get('/users').then((r) => r.data);
export const deleteUser = (id) => apiClient.delete(`/users/${id}`);
