import { Router, Request, Response, Application } from 'express';
import fetch from 'node-fetch';

//  FIX: Corrected the port back to 4000 (as shown in your backend logs) 
// and kept the corrected API path (/api/task/new).
const TASK_API_URL = 'http://localhost:4000/api/task/new'; 

//  Define the expected structure for a successful Task object 
interface Task {
    id: string;
    title: string;
    dueDate: string;
    status: string;
}

//  Define the expected structure for an Error response
interface ErrorResponse {
    message?: string;
}

// The entire file logic must be wrapped in a function 
// that accepts 'app' and is exported as the default.
export default (app: Application) => {
    const taskRouter = Router();

    // 1. GET route to display the form
    taskRouter.get('/task/new', (req: Request, res: Response) => {
        res.render('task-form', { 
            data: {},
            errors: [],
            successMessage: null
        });
    });

    // 2. POST route to submit the form data
    taskRouter.post('/task/new', async (req: Request, res: Response) => {
        const { title, dueDate, status = 'TO_DO' } = req.body;
        let errors = [];

        // Basic server-side validation
        if (!title || title.trim() === '') {
            errors.push({ text: 'The task title cannot be empty.', href: '#title' });
        }
        if (!dueDate || dueDate.trim() === '') {
            errors.push({ text: 'The due date cannot be empty.', href: '#due-date' });
        }

        if (errors.length > 0) {
            return res.render('task-form', { data: req.body, errors });
        }

        // Format the date to match the ISO 8601 format (including seconds) expected by the backend
        const formattedDueDate = `${dueDate}:00`; 

        const taskPayload = { title, status, dueDate: formattedDueDate };

        try {
            const response = await fetch(TASK_API_URL, { 
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskPayload),
            });

            if (response.ok) {
                const newTask = await response.json() as Task;
                return res.render('task-form', {
                    data: {}, 
                    errors: [],
                    successMessage: `Success! Task '${newTask.title}' created with ID: ${newTask.id}`
                });
            } else {
                const errorBody = await response.json() as ErrorResponse;
                errors.push({ text: `Backend error: ${errorBody.message || response.statusText}`, href: '#title' });
                return res.render('task-form', { data: req.body, errors });
            }

        } catch (error) {
            // Updated error message to reflect the correct port.
            errors.push({ text: 'Network Error: Could not connect to the backend on port 4000. Ensure "gradlew bootRun" is active.', href: '#title' });
            return res.render('task-form', { data: req.body, errors });
        }
    });

    // Attach the router to the main application instance
    app.use(taskRouter);
};