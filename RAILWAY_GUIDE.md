# Railway Deployment Guide

This guide explains how to deploy the Notenpfad application to [Railway](https://railway.app/).

## Prerequisites

1.  A GitHub account with the `Notenpfad` repository pushed.
2.  A Railway account (login with GitHub).

## Step 1: Create Project on Railway

1.  Go to your [Railway Dashboard](https://railway.app/dashboard).
2.  Click **New Project** > **Deploy from GitHub repo**.
3.  Select your `notenpfad` repository.
4.  Click **Deploy Now**.

## Step 2: Configure the Backend Service

Railway might automatically detect the Python app. If not, or to ensure it's correct:

1.  Click on the **backend** service (or the repo name card).
2.  Go to **Settings**.
3.  **Root Directory**: Set this to `/notenpfad/backend`.
4.  **Build Command**: Ensure it is empty (or just installing requirements, which Railway does automatically via `requirements.txt`).
5.  **Start Command**: `uvicorn main:app --host 0.0.0.0 --port $PORT` (This should be picked up from the `Procfile` automatically).

### variables (Environment Variables)

Go to the **Variables** tab in the Backend service and add:

- `ADMIN_PASSWORD`: (Choose a secure password)
- `STUDENT_PASSWORD`: (Choose a secure password)
- `FRONTEND_URL`: `https://<YOUR-FRONTEND-URL>.up.railway.app` (You will get this URL in Step 3, leave it as `*` for now if unsure).
- `PORT`: Railway sets this automatically, do not set it manually.

## Step 3: Add Database (PostgreSQL)

1.  In your project view, right-click (or click **+ New**) and add **Database** > **PostgreSQL**.
2.  Wait for it to deploy.
3.  Connect the Database to the Backend:
    - Railway usually injects `DATABASE_URL` automatically if they are in the same project.
    - Check the **Variables** tab of your Backend service. If `DATABASE_URL` is there, you are good.

## Step 4: Configure the Frontend Service

Since this is a monorepo (frontend and backend in one repo), you need to add the repository *again* for the frontend, or configure a second service.

1.  In the project view, click **+ New** > **GitHub Repo** > Select `notenpfad` again.
2.  Go to **Settings** for this new service.
3.  **Root Directory**: Set this to `/notenpfad/frontend`.
4.  **Build Command**: `npm install && npm run build`
5.  **Start Command**: `npm run preview -- --host --port $PORT` (Or use a static site server).

### Variables

Go to the **Variables** tab in the Frontend service and add:

- `VITE_API_URL`: The URL of your **Backend** service (e.g., `https://notenpfad-backend-production.up.railway.app`).
    - *Note: Do not add a trailing slash `/`.*

## Step 5: Finalize

1.  Once both services are deployed, update the `FRONTEND_URL` variable in your Backend service to the actual URL of your Frontend service.
2.  Redeploy the Backend.
3.  Open the Frontend URL in your browser.

## Troubleshooting

- **Backend 404 / Application Error**: Check the Deploy Logs. Ensure `DATABASE_URL` is set.
- **Frontend "Network Error"**: Check the browser console. Verify `VITE_API_URL` is correct and does NOT have a trailing slash. Verify Backend `CORS` allows the Frontend URL.
