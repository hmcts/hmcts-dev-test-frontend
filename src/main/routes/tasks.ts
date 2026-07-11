import { getTask, getTasks } from '../api/tasksApi';

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

  app.get('/tasks/:id', async (req, res) => {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      res.status(404).render('tasks/not-found');
      return;
    }

    try {
      const task = await getTask(id);
      res.render('tasks/detail', { task });
    } catch {
      res.status(404).render('tasks/not-found');
    }
  });
}
