import { getTasks } from '../api/tasksApi';

import { Application } from 'express';

export default function (app: Application): void {
  app.get('/tasks', async (req, res) => {
    try {
      const tasks = await getTasks();
      res.render('tasks/list', { tasks });
    } catch {
      res.render('tasks/list', { tasks: [], errorMessage: 'Unable to load tasks at the moment.' });
    }
  });
}
