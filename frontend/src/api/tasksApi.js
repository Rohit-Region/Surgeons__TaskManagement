import apiClient, { isBackendOnline } from './client';
import { demoListTasks, demoCreateTask, demoAssignTask, demoUpdateTaskStatus, demoDeleteTask } from './demoStore';

export function listTasks(userId, role) {
  if (isBackendOnline() === false) return Promise.resolve(demoListTasks(userId, role));
  return apiClient.get('/tasks').then((r) => r.data);
}

export function createTask(data) {
  if (isBackendOnline() === false) return Promise.resolve(demoCreateTask(data));
  return apiClient.post('/tasks', data).then((r) => r.data);
}

export function assignTask(taskId, userId) {
  if (isBackendOnline() === false) return Promise.resolve(demoAssignTask(taskId, userId));
  return apiClient.patch(`/tasks/${taskId}/assign`, { userId }).then((r) => r.data);
}

export function updateTaskStatus(taskId, status) {
  if (isBackendOnline() === false) {
    // get userId and role from token
    const token = localStorage.getItem('auth_token');
    let userId = null, role = 'user';
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        userId = payload.sub; role = payload.role;
      } catch {}
    }
    return Promise.resolve(demoUpdateTaskStatus(taskId, userId, role, status));
  }
  return apiClient.patch(`/tasks/${taskId}/status`, { status }).then((r) => r.data);
}

export function deleteTask(id) {
  if (isBackendOnline() === false) { demoDeleteTask(id); return Promise.resolve(); }
  return apiClient.delete(`/tasks/${id}`);
}
