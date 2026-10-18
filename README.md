# GAM — GitLab Assignment Manager

A web platform for running programming courses on top of GitLab. Instructors create assignments, students submit through GitLab repositories, and GAM tracks submissions automatically, runs grading pipelines and flags similar code.

## Features

- **GitLab integration**: creates and manages course groups, assignment repositories and student access through the GitLab API (python-gitlab)
- **Webhook-driven submission tracking**: GitLab webhooks record every push as a submission in real time, with no polling
- **Automated grading**: submissions run through GitLab CI pipelines and results are collected back into the platform
- **Code-similarity detection**: compares submissions to flag possible plagiarism for instructor review
- **Authentication**: SSO and JWT-based auth with role-based access for instructors and students
- **Multilingual frontend** built with Next.js and next-intl

## Tech stack

| Layer | Technologies |
|---|---|
| Backend | Python, Django 4.2, Django REST Framework, PyJWT |
| Data | PostgreSQL 16, Redis 7 (caching) |
| Integration | GitLab CE, GitLab REST API (python-gitlab), webhooks, GitLab CI |
| Frontend | Next.js 14, React 18, MUI, NextAuth, next-intl |
| Infrastructure | Docker, Docker Compose, Gunicorn |

## Architecture

```
Next.js client (:3000)
        │  REST / JWT
        ▼
Django REST API (:8000) ──► PostgreSQL
   │        │          └──► Redis (cache)
   │        ▲
   ▼        │ webhooks
 GitLab CE (repos, CI pipelines)
```

The backend is split into Django apps:

- `app_api`: courses, assignments, submissions and grading endpoints
- `app_auth`: authentication and user roles
- `gitlab_wrapper`: wrapper around the GitLab API and webhook handling

## Getting started

**Requirements:** Docker and Docker Compose.

```bash
git clone https://github.com/mohammad-shahabadi/GAM.git
cd GAM
cp server/.env.example server/.env   # then fill in your values
docker compose up --build
```

This starts the whole stack, including a local GitLab instance:

| Service | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| GitLab | http://localhost |
| PostgreSQL | localhost:5439 |
| Redis | localhost:6379 |

On startup the backend applies migrations and creates a default admin account (`python manage.py create_default_admin`) using `DEFAULT_ADMIN_EMAIL` and `DEFAULT_ADMIN_PASSWORD` from `server/.env`. The local GitLab container can take a few minutes to become available on first run.

## Project structure

```
GAM/
├── client/              # Next.js frontend
│   └── src/
├── server/              # Django backend
│   ├── app_api/
│   ├── app_auth/
│   ├── gitlab_wrapper/
│   └── gam/             # project settings and URLs
└── docker-compose.yml
```
