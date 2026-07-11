import * as tasksApi from '../../main/api/tasksApi';
import { app } from '../../main/app';

import request from 'supertest';

jest.mock('../../main/api/tasksApi');
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
