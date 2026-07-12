import { app } from '../../main/app';

import request from 'supertest';

describe('Home page', () => {
  test('GET / redirects to the tasks page', async () => {
    const response = await request(app).get('/');

    expect(response.status).toBe(302);
    expect(response.headers.location).toBe('/tasks');
  });
});
