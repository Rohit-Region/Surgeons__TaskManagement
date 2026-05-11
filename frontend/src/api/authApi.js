import apiClient, { checkBackend, setBackendOnline } from './client';
import { demoLogin, seedDemoData } from './demoStore';

export async function login(username, password) {
  const online = await checkBackend();
  if (!online) {
    seedDemoData();
    setBackendOnline(false);
    return demoLogin(username, password);
  }
  return apiClient.post('/login', { username, password }).then((r) => r.data);
}
