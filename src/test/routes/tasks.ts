import * as tasksApi from '../../main/api/tasksApi';
import { app } from '../../main/app';

import request from 'supertest';

jest.mock('../../main/api/tasksApi', () => {
  const actual = jest.requireActual('../../main/api/tasksApi');
  return {
    ...actual,
    getTasks: jest.fn(),
    getTask: jest.fn(),
    createTask: jest.fn(),
    updateStatus: jest.fn(),
    deleteTask: jest.fn(),
  };
});
const mockedApi = tasksApi as jest.Mocked<typeof tasksApi>;

describe('GET /tasks', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders the list of tasks from the backend', async () => {
    mockedApi.getTasks.mockResolvedValue([
      {
        id: 1,
        title: 'Review case file',
        description: 'Check documents',
        status: 'PENDING',
        dueDateTime: '2026-07-10T09:00:00',
      },
    ]);

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Review case file');
    expect(response.text).toContain('PENDING');
  });

  test('shows a friendly message when the backend cannot be reached', async () => {
    mockedApi.getTasks.mockRejectedValue(new Error('backend down'));

    const response = await request(app).get('/tasks');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Unable to load tasks at the moment.');
  });
});

describe('GET /tasks/:id', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('renders a single task when it exists', async () => {
    mockedApi.getTask.mockResolvedValue({
      id: 1,
      title: 'Review case file',
      description: 'Check documents',
      status: 'PENDING',
      dueDateTime: '2026-07-10T09:00:00',
    });

    const response = await request(app).get('/tasks/1');

    expect(mockedApi.getTask).toHaveBeenCalledWith(1);
    expect(response.status).toBe(200);
    expect(response.text).toContain('Review case file');
    expect(response.text).toContain('Check documents');
  });

  test('returns 404 when the task does not exist', async () => {
    mockedApi.getTask.mockRejectedValue(new Error('not found'));

    const response = await request(app).get('/tasks/999');

    expect(response.status).toBe(404);
    expect(response.text).toContain('Task not found');
  });

  test('returns 404 for a non-numeric id without calling the backend', async () => {
    const response = await request(app).get('/tasks/abc');

    expect(response.status).toBe(404);
    expect(mockedApi.getTask).not.toHaveBeenCalled();
  });
});

describe('Creating a task', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('GET /tasks/new renders the create form', async () => {
    const response = await request(app).get('/tasks/new');

    expect(response.status).toBe(200);
    expect(response.text).toContain('Create a task');
    expect(response.text).toContain('PENDING');
  });

  test('POST /tasks creates the task and redirects to its page', async () => {
    mockedApi.createTask.mockResolvedValue({
      id: 5,
      title: 'Review case file',
      status: 'PENDING',
      dueDateTime: '2026-07-10T09:00',
    });

    const response = await request(app).post('/tasks').type('form').send({
      title: 'Review case file',
      description: 'Check documents',
      status: 'PENDING',
      dueDateTime: '2026-07-10T09:00',
    });

    expect(mockedApi.createTask).toHaveBeenCalledWith({
      title: 'Review case file',
      description: 'Check documents',
      status: 'PENDING',
      dueDateTime: '2026-07-10T09:00',
    });
    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/tasks/5');
  });

  test('POST /tasks re-renders the form with field errors when the backend rejects it', async () => {
    mockedApi.createTask.mockRejectedValue({
      isAxiosError: true,
      response: { data: { fieldErrors: { title: 'title is required' } } },
    });

    const response = await request(app).post('/tasks').type('form').send({
      title: '',
      status: 'PENDING',
      dueDateTime: '2026-07-10T09:00',
    });

    expect(response.status).toBe(400);
    expect(response.text).toContain('title is required');
    expect(response.text).toContain('Create a task');
  });
});
