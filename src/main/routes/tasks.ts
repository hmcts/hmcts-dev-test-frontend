import { CreateTaskInput, createTask, deleteTask, getTask, getTasks, taskStatuses, updateStatus } from '../api/tasksApi';

import axios from 'axios';
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

  app.get('/tasks/new', (req, res) => {
    res.render('tasks/new', { values: {}, fieldErrors: {}, statuses: taskStatuses });
  });

  app.post('/tasks', async (req, res) => {
    const input: CreateTaskInput = {
      title: req.body.title,
      description: req.body.description,
      status: req.body.status,
      dueDateTime: req.body.dueDateTime,
    };

    try {
      const task = await createTask(input);
      res.redirect('/tasks/' + task.id);
    } catch (error) {
      let fieldErrors = {};
      if (axios.isAxiosError(error) && error.response) {
        fieldErrors = error.response.data.fieldErrors || {};
      }
      res.status(400).render('tasks/new', { values: input, fieldErrors, statuses: taskStatuses });
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
      res.render('tasks/detail', { task, statuses: taskStatuses });
    } catch {
      res.status(404).render('tasks/not-found');
    }
  });

  app.post('/tasks/:id/status', async (req, res) => {
    const id = Number(req.params.id);

    try {
      await updateStatus(id, req.body.status);
      res.redirect('/tasks/' + id);
    } catch {
      res.status(404).render('tasks/not-found');
    }
  });

  app.post('/tasks/:id/delete', async (req, res) => {
    const id = Number(req.params.id);

    try {
      await deleteTask(id);
      res.redirect('/tasks');
    } catch {
      res.status(404).render('tasks/not-found');
    }
  });
}
