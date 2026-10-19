# EDU-PREDICT — React Frontend

**AI-Based Student Performance & Academic Management System**

The React + TypeScript web frontend for EDU-PREDICT, an academic management platform for an educational institute. It covers course discovery, student registration and enrolment, attendance, assignments, assessments and academic performance, and shows a **Linear Regression** prediction of each student's expected final score, served by the Django REST backend.

It has two portals:

- **Student / Public portal** — browse and search courses, register, enrol, and track attendance, assignments, results, performance and predicted final score.
- **Admin / Faculty portal** — manage students, faculty, courses, categories, enrolments and academic records, monitor performance and predictions, and view reports.

> The predicted score is an analytical aid for students and faculty. It is not a guaranteed result and does not replace academic judgement.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [State Management Strategy](#state-management-strategy)
- [Feature Modules](#feature-modules)
- [Routes](#routes)
- [Backend API Integration](#backend-api-integration)
- [Authentication & Role-Based Access](#authentication--role-based-access)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Coding Conventions](#coding-conventions)
- [Related Repositories](#related-repositories)
- [Author](#author)

---

## Tech Stack

| Concern | Tool |
| --- | --- |
| UI library | React 19 |
| Language | TypeScript (strict mode) |
| Build tool / dev server | Vite |
| Client state | Redux Toolkit + React Redux |
| Server state / data fetching | TanStack Query (React Query) |
| HTTP client | Axios (with interceptors for JWT access/refresh) |
| Routing | React Router |
| Forms & validation | React Hook Form + Zod |
| Styling | Tailwind CSS (converted from the HTML/Tailwind templates) |
| Charts | Recharts (performance & analytics dashboards) |
| Linting | ESLint (typescript-eslint, react-hooks, react-refresh) |

---

## Architecture

The app uses a **feature-based folder structure** with a **layer-based separation of concerns inside each feature**.

- **Feature-based:** everything belonging to one business domain (courses, attendance, predictions…) lives together in `src/features/<feature>/`. A feature can be built, reviewed or removed without touching unrelated code.
- **Layer-based:** inside a feature, code is split by responsibility, and dependencies only point downwards:

```
pages / components      →  presentation (UI, no direct HTTP calls)
        ↓
hooks                   →  TanStack Query hooks (useQuery / useMutation) + feature logic
        ↓
api                     →  typed request functions built on the shared Axios client
        ↓
types / schemas         →  domain types, DTOs and Zod validation schemas
```

`store/` holds the feature's Redux slice (client-only state), if it needs one.

**Rules**

1. Components never call Axios directly — they use hooks from the `hooks` layer.
2. Features never import from another feature's internal files; they import only from its public `index.ts`.
3. Code used by two or more features moves to `src/shared/`.
4. Server data lives in TanStack Query's cache, not in Redux (see [State Management Strategy](#state-management-strategy)).

High-level system flow:

```
Browser → React Frontend → Django REST Framework API → PostgreSQL
                                     ↓
                     Linear Regression model → Prediction API → React Dashboard
```

---

## Folder Structure

```
src/
├── app/                        # Application wiring
│   ├── store.ts                # Redux store configuration
│   ├── hooks.ts                # Typed useAppDispatch / useAppSelector
│   ├── queryClient.ts          # TanStack QueryClient + default options
│   ├── providers.tsx           # Redux, QueryClient and Router providers
│   └── router/
│       ├── index.tsx           # Route tree
│       ├── ProtectedRoute.tsx  # Requires an authenticated user
│       └── RoleRoute.tsx       # Requires a specific role
│
├── features/
│   ├── auth/
│   │   ├── api/                # authApi.ts (login, register, refresh, logout, OTP)
│   │   ├── hooks/              # useLogin, useRegister, useLogout
│   │   ├── components/         # LoginForm, RegisterForm
│   │   ├── pages/              # LoginPage, RegisterPage, ForgotPasswordPage
│   │   ├── store/              # authSlice.ts (session, user, role)
│   │   ├── schemas/            # loginSchema, registerSchema (Zod)
│   │   ├── types/              # User, Role, AuthTokens
│   │   └── index.ts            # Public API of the feature
│   ├── courses/
│   ├── categories/
│   ├── enrolments/
│   ├── attendance/
│   ├── assignments/
│   ├── assessments/
│   ├── performance/
│   ├── predictions/
│   ├── students/
│   ├── faculty/
│   ├── notifications/
│   ├── reports/
│   ├── dashboard/
│   └── settings/
│
├── layouts/                    # PublicLayout, StudentLayout, AdminLayout
│
├── shared/
│   ├── api/
│   │   ├── client.ts           # Axios instance + JWT interceptors
│   │   ├── endpoints.ts        # Central endpoint paths
│   │   └── types.ts            # ApiResponse<T> envelope, ApiError
│   ├── components/             # Button, Input, Modal, Table, Card, Spinner, EmptyState…
│   ├── hooks/                  # useDebounce, usePagination…
│   ├── config/                 # env.ts (typed import.meta.env access)
│   ├── constants/              # roles, query keys, route paths
│   ├── lib/                    # small framework helpers
│   ├── types/                  # globally shared types
│   └── utils/                  # formatters, storage helpers
│
├── assets/
├── styles/
├── App.tsx
└── main.tsx
```

---

## State Management Strategy

| Kind of state | Where it lives | Examples |
| --- | --- | --- |
| **Server state** (data owned by the backend) | TanStack Query | courses, enrolments, attendance, results, predictions, dashboard stats |
| **Client / session state** | Redux Toolkit | logged-in user, role, auth status, sidebar state, theme, UI filters |
| **Local UI state** | `useState` / React Hook Form | form inputs, open/closed modals |

Query keys are defined per feature with a key factory, so caches can be invalidated precisely after mutations:

```ts
export const courseKeys = {
  all: ['courses'] as const,
  lists: () => [...courseKeys.all, 'list'] as const,
  list: (filters: CourseFilters) => [...courseKeys.lists(), filters] as const,
  detail: (id: number) => [...courseKeys.all, 'detail', id] as const,
};
```

---

## Feature Modules

| Feature | Responsibility |
| --- | --- |
| `auth` | Registration (student / faculty), login, logout, token refresh, forgot password with OTP, change password |
| `courses` | Course listing, search, filters, course details; admin course CRUD |
| `categories` | Course categories; admin category management |
| `enrolments` | Enrol in courses, "My Courses"; admin enrolment management |
| `attendance` | Attendance percentage per course; faculty/admin attendance entry |
| `assignments` | Assignments, marks, completion and averages |
| `assessments` | Mock tests, assessments, results and marks management |
| `performance` | Combined academic indicators and performance dashboard |
| `predictions` | Generate and display the predicted final score; admin ML prediction dashboard |
| `students` | Student profile; admin student management |
| `faculty` | Trainer/faculty information; admin faculty management |
| `notifications` | Course, assessment, academic and administrative notifications |
| `reports` | Course, student, attendance, performance and prediction analytics |
| `dashboard` | Student and admin/faculty dashboard pages composed from other features |
| `settings` | System settings (admin) |

---

## Routes

**Public**

| Path | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Institute |
| `/courses` | Course listing, search & filters |
| `/courses/:id` | Course details |
| `/faculty` | Trainer / faculty information |
| `/contact` | Contact |
| `/login` | Login |
| `/register` | Registration |

**Student** (role: `student`)

| Path | Page |
| --- | --- |
| `/student/dashboard` | Student dashboard |
| `/student/profile` | Profile |
| `/student/courses` | My courses & enrolments |
| `/student/attendance` | Attendance |
| `/student/assignments` | Assignments |
| `/student/assessments` | Mock tests / assessments |
| `/student/results` | Results |
| `/student/performance` | Academic performance & predicted final score |
| `/student/notifications` | Notifications |

**Admin / Faculty** (roles: `faculty`, `admin`, `super_admin`)

| Path | Page |
| --- | --- |
| `/admin/login` | Admin / faculty login |
| `/admin/dashboard` | Dashboard |
| `/admin/students` | Student management |
| `/admin/faculty` | Faculty management |
| `/admin/courses` | Course management |
| `/admin/categories` | Category management |
| `/admin/enrolments` | Enrolment management |
| `/admin/attendance` | Attendance management |
| `/admin/assignments` | Assignment management |
| `/admin/assessments` | Assessment & marks management |
| `/admin/performance` | Performance monitoring |
| `/admin/predictions` | ML prediction dashboard |
| `/admin/reports` | Reports & analytics |
| `/admin/notifications` | Notifications |
| `/admin/settings` | System settings |

---

## Backend API Integration

The frontend consumes the EDU-PREDICT **Django REST Framework** backend. Every response follows one envelope, typed once in `src/shared/api/types.ts`:

```ts
export interface ApiResponse<T> {
  status: 'success' | 'error';
  message: string;
  data: T | null;
  errors: Record<string, string[]> | null;
}
```

Main endpoints used:

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register/` | Register student / faculty |
| POST | `/api/auth/login/` | Authenticate user |
| POST | `/api/auth/logout/` | Logout |
| GET | `/api/courses/` | List courses |
| GET | `/api/courses/{id}/` | Course details |
| GET | `/api/student/profile/` | Student profile |
| GET | `/api/student/courses/` | Enrolled courses |
| GET | `/api/student/attendance/` | Attendance |
| GET | `/api/student/assignments/` | Assignments |
| GET | `/api/student/results/` | Assessment results |
| GET | `/api/student/performance/` | Performance summary |
| POST | `/api/ml/predict/` | Generate performance prediction |
| GET | `/api/ml/prediction/{student_id}/` | Retrieve prediction |
| GET | `/api/admin/dashboard/` | Admin dashboard |
| GET | `/api/admin/students/` | Student management |

### ML prediction

The prediction API takes academic features and returns a predicted final score (0–100):

| Feature | Example |
| --- | --- |
| Attendance % | 88 |
| Assignment average | 84 |
| Mock test average | 78 |
| Practice hours / week | 10 |
| Previous score | 80 |
| Modules completed % | 90 |

Example output: **Predicted Final Score = 83.7 / 100**, with an indicator (Good / Average / Needs Attention). Figures are illustrative; real values come from the trained model.

---

## Authentication & Role-Based Access

- The backend issues **JWT access and refresh tokens** (PyJWT).
- The shared Axios client attaches the access token to every request. On a `401`, it calls the refresh endpoint once, retries the original request, and logs the user out if the refresh fails.
- `ProtectedRoute` blocks unauthenticated users; `RoleRoute` blocks users without the required role.
- Public registration offers only **Student** and **Faculty** roles. Admin and Super Admin accounts are created by the backend, never through the public form.

| Role | Access |
| --- | --- |
| Student | Own profile, courses, enrolments, attendance, assignments, results and prediction |
| Faculty / Staff | Assigned students, attendance, marks, performance and prediction viewing |
| Admin | Students, courses, academic records, reports and ML dashboard |
| Super Admin | Users, roles, permissions and full system configuration |

---

## Getting Started

### Prerequisites

- Node.js **20.19+** or **22.12+** (required by Vite)
- npm
- The EDU-PREDICT Django backend running locally (default `http://localhost:8000`)

### Installation

```bash
git clone <repository-url>
cd react-edu-predict

npm install

npm install @reduxjs/toolkit react-redux @tanstack/react-query axios react-router-dom react-hook-form zod @hookform/resolvers recharts
npm install -D @tanstack/react-query-devtools tailwindcss @tailwindcss/vite

cp .env.example .env
npm run dev
```

The app runs at `http://localhost:5173`.

> Add `http://localhost:5173` to `CORS_ALLOWED_ORIGINS` in the Django backend's `.env` so the browser can reach the API.

---

## Environment Variables

Create `.env` from `.env.example`. Only variables prefixed with `VITE_` are exposed to the browser, so **never put secrets here**.

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Django REST API base URL | `http://localhost:8000/api` |
| `VITE_APP_NAME` | Application name shown in the UI | `EDU-PREDICT` |

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run lint` | Run ESLint |

---

## Coding Conventions

- **Strict TypeScript:** `strict` is on; no `any` (use `unknown` and narrow it). Every API request and response has an explicit type.
- **Type-only imports** use `import type` (`verbatimModuleSyntax` is enabled).
- **Naming:** `PascalCase` for components and types, `camelCase` for functions and hooks (`useCourses`), `kebab-case` or `camelCase` for non-component files, consistently per folder.
- **One public entry per feature:** import from `@/features/courses`, never from `@/features/courses/api/coursesApi`.
- **Typed Redux hooks:** always use `useAppDispatch` / `useAppSelector` from `src/app/hooks.ts`.
- **Forms:** React Hook Form with a Zod schema; the schema is the single source of truth for the form's type (`z.infer`).
- **Validation rules** match the backend: password at least 6 characters with an uppercase letter, a lowercase letter and a special character; phone number exactly 10 digits.

---

## Related Repositories

- **Django backend** — REST API, authentication, academic records and the Linear Regression prediction API
- **edu-predict-frontend** — Flutter mobile app (Android & iOS) using the same APIs

---

## Author

**Dion James Smith** — Software Engineer