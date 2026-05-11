import apiClient from './client';

export const login = (username, password) =>
  apiClient.post('/login', { username, password }).then((r) => r.data);
