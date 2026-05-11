import apiClient from './client';

export const createTask = (data) => apiClient.post('/tasks', data).then((r) => r.data);
export const assignTask = (taskId, userId) =>
  apiClient.patch(`/tasks/${taskId}/assign`, { userId }).then((r) => r.data);
export const listTasks = () => apiClient.get('/tasks').then((r) => r.data);
export const updateTaskStatus = (taskId, status) =>
  apiClient.patch(`/tasks/${taskId}/status`, { status }).then((r) => r.data);
export const deleteTask = (id) => apiClient.delete(`/tasks/${id}`);
