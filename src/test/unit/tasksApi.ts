import { Task, createTask, deleteTask, getTask, getTasks, updateStatus } from '../../main/api/tasksApi';

import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('tasksApi', () => {
  const sampleTask: Task = {
    id: 1,
    title: 'Review case',
    description: 'Check documents',
    status: 'PENDING',
    dueDateTime: '2026-07-10T09:00:00',
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getTasks requests all tasks and returns the list', async () => {
    mockedAxios.get.mockResolvedValue({ data: [sampleTask] });

    const result = await getTasks();

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4000/api/tasks');
    expect(result).toEqual([sampleTask]);
  });

  test('getTask requests a single task by id', async () => {
    mockedAxios.get.mockResolvedValue({ data: sampleTask });

    const result = await getTask(1);

    expect(mockedAxios.get).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1');
    expect(result).toEqual(sampleTask);
  });

  test('createTask posts the input and returns the created task', async () => {
    const input = {
      title: 'Review case',
      description: 'Check documents',
      status: 'PENDING' as const,
      dueDateTime: '2026-07-10T09:00:00',
    };
    mockedAxios.post.mockResolvedValue({ data: sampleTask });

    const result = await createTask(input);

    expect(mockedAxios.post).toHaveBeenCalledWith('http://localhost:4000/api/tasks', input);
    expect(result).toEqual(sampleTask);
  });

  test('updateStatus patches the status of a task', async () => {
    mockedAxios.patch.mockResolvedValue({ data: { ...sampleTask, status: 'COMPLETED' } });

    const result = await updateStatus(1, 'COMPLETED');

    expect(mockedAxios.patch).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1/status', {
      status: 'COMPLETED',
    });
    expect(result.status).toBe('COMPLETED');
  });

  test('deleteTask deletes the task by id', async () => {
    mockedAxios.delete.mockResolvedValue({});

    await deleteTask(1);

    expect(mockedAxios.delete).toHaveBeenCalledWith('http://localhost:4000/api/tasks/1');
  });
});
