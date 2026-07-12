# HMCTS Task Management (Frontend)

A web frontend that lets caseworkers create, view, update and delete their tasks.
Built for the HMCTS DTS Developer Technical Test.

It is a server-rendered application: the Express routes call the backend Task API,
and render GOV.UK-styled pages with Nunjucks. The browser only ever talks to this
frontend, which talks to the backend on its behalf.

## How to run

> **Note:** The `cd` paths below are examples. Change them to wherever you cloned
> the two repositories on your machine.

This solution has two parts that run together: the **backend** (the API) and the
**frontend** (this web UI). Run each in its own terminal, and start the backend first.

### 1. Backend (start first) — http://localhost:4000

```bash
cd /Users/user/HMCTSTest/hmcts-dev-test-backend
./gradlew bootRun
```

### 2. Frontend — http://localhost:3100

```bash
cd /Users/user/HMCTSTest/hmcts-dev-test-frontend
yarn install   # first time only
yarn build     # first time, or after changes
yarn start
```

Then open **http://localhost:3100** in your browser (it redirects to the task list).

- API docs (Swagger UI): http://localhost:4000/swagger-ui.html
- Start the backend before the frontend, because the frontend calls the backend API.
- If a port is already in use, free it with `lsof -ti tcp:3100 | xargs kill -9`
  (or `tcp:4000` for the backend).

## Tech stack

- Node.js 20
- Express 5 + Nunjucks templates
- GOV.UK Frontend
- TypeScript
- axios (calls to the backend API)
- Webpack (builds CSS/JS assets)
- Jest + supertest (tests)
- Yarn (Berry / Plug'n'Play)

## Prerequisites

- Node.js 20 (see `.nvmrc`)
- The [backend API](../hmcts-dev-test-backend) running on `http://localhost:4000`

## Running the application

The frontend needs the backend running first (see the backend README).

```bash
yarn install
yarn build      # builds the webpack assets (CSS/JS)
yarn start      # starts on http://localhost:3100
```

Then open http://localhost:3100/tasks.

The backend URL can be overridden with the `API_URL` environment variable
(default `http://localhost:4000`):

```bash
API_URL=http://localhost:4000 yarn start
```

> Note: `yarn start:dev` runs over HTTPS and expects local SSL certificates in
> `src/main/resources/localhost-ssl`. If you don't have those, use `yarn start`
> (HTTP) as shown above.

## Pages and routes

| Method | Path                | Description                        |
| ------ | ------------------- | ---------------------------------- |
| `GET`  | `/tasks`            | List all tasks                     |
| `GET`  | `/tasks/new`        | Show the create-task form          |
| `POST` | `/tasks`            | Create a task, then redirect to it |
| `GET`  | `/tasks/:id`        | View a single task                 |
| `POST` | `/tasks/:id/status` | Update the task's status           |
| `POST` | `/tasks/:id/delete` | Delete the task                    |

Validation errors returned by the backend (for example a missing title) are shown
back on the create form next to the relevant field.

## How it talks to the backend

All backend calls live in one small module, `src/main/api/tasksApi.ts`, which wraps
the Task API endpoints with typed `axios` functions (`getTasks`, `getTask`,
`createTask`, `updateStatus`, `deleteTask`). The route handlers in
`src/main/routes/tasks.ts` call these functions and render the views in
`src/main/views/tasks/`.

## Testing

```bash
yarn test:unit    # unit tests (the API client, with axios mocked)
yarn test:routes  # route tests (boot the app with supertest, API client mocked)
yarn lint         # eslint + prettier + stylelint
```

## Project structure (task feature)

```
src/main/api/tasksApi.ts        Typed backend API client
src/main/routes/tasks.ts        Express routes for the task pages
src/main/views/tasks/           Nunjucks templates (list, detail, new, not-found)
src/test/unit/tasksApi.ts       Unit tests for the API client
src/test/routes/tasks.ts        Route tests for the task pages
```
