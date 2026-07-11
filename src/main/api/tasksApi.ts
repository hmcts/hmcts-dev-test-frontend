import axios from 'axios';

export type TaskStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';

export interface Task {
  id: number;
  title: string;
  description?: string;
  status: TaskStatus;
  dueDateTime: string;
}

export interface CreateTaskInput {
  title: string;
  description?: string;
  status: TaskStatus;
  dueDateTime: string;
}

const apiBaseUrl = process.env.API_URL || 'http://localhost:4000';
const tasksUrl = apiBaseUrl + '/api/tasks';

export async function getTasks(): Promise<Task[]> {
  const response = await axios.get<Task[]>(tasksUrl);
  return response.data;
}

export async function getTask(id: number): Promise<Task> {
  const response = await axios.get<Task>(tasksUrl + '/' + id);
  return response.data;
}

export async function createTask(input: CreateTaskInput): Promise<Task> {
  const response = await axios.post<Task>(tasksUrl, input);
  return response.data;
}

export async function updateStatus(id: number, status: TaskStatus): Promise<Task> {
  const response = await axios.patch<Task>(tasksUrl + '/' + id + '/status', { status });
  return response.data;
}

export async function deleteTask(id: number): Promise<void> {
  await axios.delete(tasksUrl + '/' + id);
}
