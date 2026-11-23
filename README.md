# EDU-PREDICT — React Frontend

**AI-Based Student Performance & Academic Management System** (ABC Academy)

The React + TypeScript web frontend for EDU-PREDICT, an academic management platform for an educational institute. It covers course discovery, student registration and enrolment, attendance, assignments, assessments and academic performance. It also shows a **Linear Regression** prediction of each student's expected final score, served by the Django REST backend.

Every request from the public site, the Student portal and the Admin/Faculty portal goes to the Django REST server.

It has two portals:

- **Student / Public portal**: browse and search courses, register, enrol, and track attendance, assignments, results, performance and predicted final score.
- **Admin / Faculty portal**: manage students, faculty, courses, categories, enrolments and academic records, monitor performance and predictions, and view reports.

> The predicted score is an analytical aid for students and faculty. It is not a guaranteed result and does not replace academic judgement.

---

## Table of Contents

- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Available Scripts](#available-scripts)
- [Architecture](#architecture)
- [Folder Structure](#folder-structure)
- [State Management Strategy](#state-management-strategy)
- [Feature Modules](#feature-modules)
- [Routes](#routes)
- [Backend API Integration](#backend-api-integration)
- [Authentication & Role-Based Access](#authentication--role-based-access)
- [Coding Conventions](#coding-conventions)
- [Design Notes](#design-notes)
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
| Styling | Tailwind CSS v4 (converted from the HTML/Tailwind templates) |
| Charts | Recharts (performance & analytics dashboards) |
| Icons | lucide-react |
| Linting | ESLint (typescript-eslint, react-hooks, react-refresh) |

---

## Getting Started

### Prerequisites

- Node.js **20.19+** or **22.12+** (required by Vite)
- npm
- The EDU-PREDICT Django backend (default `https://django-api-server-71ti.onrender.com`)

### Installation

```bash
git clone https://github.com/SDLC-EduPredict/reactjs-edu-predict.git
cd reactjs-edu-predict

npm install            # installs every dependency listed in package.json
cp .env.example .env   # skip if .env is already present
npm run dev            # http://localhost:5173
```

The app talks to the API URL set in `.env` (default `VITE_API_BASE_URL=https://django-api-server-71ti.onrender.com`):

```bash
python manage.py runserver 127.0.0.1:8000
```

The Django backend must allow the frontend origin. Set `CORS_ALLOWED_ORIGINS` in the backend's `.env` / `settings.py` so the browser can reach the API:

```python
CORS_ALLOWED_ORIGINS = ["http://localhost:5173", "http://127.0.0.1:5173"]
```

---

## Environment Variables

All runtime configuration lives in `.env` (copy `.env.example`). Only variables prefixed with `VITE_` are exposed to the browser, so **never put secrets here**.

The API base URL is read once in `src/config/env.ts` and exported as `API_BASE_URL`. The Axios client (`src/lib/api/httpClient.ts`) uses it for every request. To point the app at a different server, change the URL in `.env` only; no code changes are needed.

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_BASE_URL` | Django server root. No trailing slash and no `/api` (endpoint paths already start with `/api/`) | `https://django-api-server-71ti.onrender.com` |
| `VITE_MEDIA_BASE_URL` | Prefix for relative `/media/...` photo and thumbnail paths | `https://django-api-server-71ti.onrender.com` |
| `VITE_API_TIMEOUT_MS` | Axios request timeout | `20000` |
| `VITE_AUTH_STORAGE_KEY` | localStorage key for tokens + user | `edu_predict_auth` |
| `VITE_TOKEN_TYPE` | Authorization header prefix | `Bearer` |
| `VITE_DEFAULT_PAGE_SIZE` | `page_size` sent to paginated endpoints | `10` |
| `VITE_QUERY_STALE_TIME_MS` | TanStack Query stale time | `30000` |
| `VITE_QUERY_RETRY_COUNT` | TanStack Query retries (4xx errors are never retried) | `1` |
| `VITE_NOTIFICATION_POLL_INTERVAL_MS` | How often the unread-notification count refreshes | `60000` |
| `VITE_ENABLE_QUERY_DEVTOOLS` | Show React Query devtools in development | `true` |
| `VITE_APP_NAME` | Application name shown in the UI | `EDU-PREDICT` |
| `VITE_APP_TAGLINE` | Tagline shown in the footer and auth pages | `AI-Based Student Performance & Academic Management System` |
| `VITE_INSTITUTE_NAME` | Institute name | `ABC Academy` |
| `VITE_APP_ENV` | `development` / `staging` / `production` | `development` |
| `VITE_CONTACT_EMAIL`, `VITE_CONTACT_PHONE`, `VITE_CONTACT_ADDRESS` | Contact details on the footer, About and Contact pages | `admissions@abcacademy.edu` |
| `VITE_DEV_HOST`, `VITE_DEV_PORT` | Vite dev server host and port | `localhost`, `5173` |

---

## Available Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server |
| `npm run build` | Type-check (`tsc -b`) and build for production into `dist/` |
| `npm run preview` | Preview the production build locally |
| `npm run typecheck` | Type-check only |
| `npm run lint` | Run ESLint |

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

1. Components never call Axios directly. They use hooks from the `hooks` layer.
2. Every URL comes from `src/lib/api/endpoints.ts`. No endpoint strings are hard-coded inside features.
3. When one feature needs another feature's data or UI, it imports that feature's `hooks` or `components`, never its `api` layer.
4. Code used by many features lives outside `features/` in `components/`, `lib/` or `types/`.
5. Server data lives in TanStack Query's cache, not in Redux (see [State Management Strategy](#state-management-strategy)).

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
├── app/                          # Application wiring
│   ├── App.tsx                   # RouterProvider
│   ├── providers/
│   │   └── AppProviders.tsx      # Redux, QueryClient, ErrorBoundary, devtools
│   ├── router/
│   │   ├── router.tsx            # Route tree (lazy-loaded pages)
│   │   ├── guards.tsx            # RequireAuth, RequireRole, GuestOnly, SessionWatcher
│   │   ├── RootShell.tsx         # Session watcher + toaster around every route
│   │   └── paths.ts              # Route path constants, homePathForRole()
│   └── store/
│       ├── store.ts              # Redux store + auth persistence listener
│       ├── hooks.ts              # Typed useAppDispatch / useAppSelector
│       └── slices/               # uiSlice (toasts, sidebar), listFiltersSlice (table filters)
│
├── config/
│   └── env.ts                    # Typed import.meta.env access, API_BASE_URL
│
├── lib/
│   ├── api/
│   │   ├── httpClient.ts         # Axios instance + JWT access/refresh interceptors
│   │   ├── endpoints.ts          # Every endpoint path, in one place
│   │   ├── request.ts            # api.get/post/patch/delete (unwrap envelope), FormData, CSV download
│   │   ├── apiError.ts           # ApiError + error normalizer (field errors)
│   │   └── normalize.ts          # Tolerant list/count readers
│   ├── query/
│   │   ├── queryClient.ts        # QueryClient, global success/error toasts via mutation meta
│   │   └── queryKeys.ts          # Query key factory
│   ├── hooks/                    # useToast, useListFilter, useDebouncedValue, useDocumentTitle
│   ├── storage/                  # tokenStorage (localStorage)
│   └── utils/                    # formatters, cn
│
├── types/                        # API envelope, pagination, User / roles, shared refs
│
├── components/
│   ├── ui/                       # Button, Input, Select, Card, Badge, Modal, DataTable, Pagination, StatCard…
│   ├── layout/                   # PublicLayout, PublicNavbar, SiteFooter, PortalLayout, navigation config
│   ├── charts/                   # Recharts wrappers, ScoreGauge
│   └── feedback/                 # Toaster, ErrorBoundary
│
├── features/
│   ├── auth/
│   │   ├── api/                  # authApi.ts (login, register, logout, me, profile, OTP, passwords)
│   │   ├── hooks/                # useLogin, useRegister, useLogout, useCurrentUser, useSessionSync…
│   │   ├── components/           # AuthShell, PasswordInput
│   │   ├── pages/                # Login, Register, ForgotPassword, ResetPassword, VerifyEmail
│   │   ├── store/                # authSlice.ts (tokens, user, role), selectors
│   │   ├── schemas/              # Zod schemas (login, register, reset, change password…)
│   │   └── types.ts              # Request / response types
│   ├── courses/                  # catalogue + admin courses & categories (+ catalogSlice)
│   ├── faculty/
│   ├── students/
│   ├── enrolments/
│   ├── attendance/
│   ├── assignments/
│   ├── assessments/
│   ├── performance/
│   ├── predictions/              # + predictionSlice (what-if simulator)
│   ├── notifications/
│   ├── dashboard/
│   ├── reports/
│   └── settings/
│
├── pages/                        # Static public pages: Home, About, Contact, 404
├── styles/                       # index.css (Tailwind theme tokens, footer gradient)
├── main.tsx
└── vite-env.d.ts                 # Typed environment variables
```

Each feature follows the same shape: `types.ts`, `api/`, `hooks/`, `components/`, `pages/`, and `store/` when needed.

---

## State Management Strategy

| Kind of state | Where it lives | Examples |
| --- | --- | --- |
| **Server state** (data owned by the backend) | TanStack Query | courses, enrolments, attendance, results, predictions, dashboard stats |
| **Client / session state** | Redux Toolkit | logged-in user, tokens, role, toasts, sidebar, table filters, prediction simulator |
| **Local UI state** | `useState` / React Hook Form | form inputs, open/closed modals |

Redux slices:

| Slice | Holds |
| --- | --- |
| `auth` | Access/refresh tokens, user, permissions. Persisted to localStorage by listener middleware |
| `ui` | Toasts, sidebar and mobile navigation state |
| `listFilters` | Search, page and filters for every admin table, keyed by table |
| `catalog` | Public course catalogue filters (search, category, level, mode, page) |
| `prediction` | What-if simulator inputs, last prediction result, selected student |

TanStack Query handles all server data, caching, pagination (`keepPreviousData`) and invalidation after mutations. Query keys come from one key factory (`src/lib/query/queryKeys.ts`), so caches can be invalidated precisely:

```ts
export const queryKeys = {
  catalog: {
    all: ['catalog'] as const,
    categories: ['catalog', 'categories'] as const,
    courses: (params: QueryParams) => ['catalog', 'courses', params] as const,
    course: (idOrSlug: string | number) => ['catalog', 'course', String(idOrSlug)] as const,
  },
  // …one group per feature
};
```

Mutations declare their toast text through `meta` (`successMessage`, `errorTitle`). The global `MutationCache` shows the toast, so pages don't repeat that code.

---

## Feature Modules

| Feature | Responsibility |
| --- | --- |
| `auth` | Registration (student / faculty), login, logout, token refresh, forgot password with OTP, reset and change password, email and phone verification |
| `courses` | Course listing, search, filters, course details, categories; admin course and category CRUD |
| `enrolments` | Enrol in courses, "My Courses"; admin enrolment management |
| `attendance` | Attendance percentage per course; faculty/admin attendance entry and correction |
| `assignments` | Assignments, submissions, marks, completion and averages |
| `assessments` | Mock tests, assessments, results and marks management |
| `performance` | Combined academic indicators, performance dashboard, faculty monitoring |
| `predictions` | Generate and display the predicted final score, what-if simulator; admin ML prediction dashboard |
| `students` | Student profile; admin student management |
| `faculty` | Trainer/faculty directory and profiles; admin faculty management and approval |
| `notifications` | Course, assignment, assessment, academic and administrative notifications; admin broadcasts |
| `reports` | Course, student, attendance, performance and prediction analytics, CSV export |
| `dashboard` | Student and admin/faculty dashboard pages composed from other features |
| `settings` | Account details, password, faculty profile, and system configuration view (admin) |

---

## Routes

**Public**

| Path | Page |
| --- | --- |
| `/` | Home |
| `/about` | About Institute |
| `/courses` | Course listing, search & filters |
| `/courses/:slug` | Course details |
| `/categories` | Course categories |
| `/faculty` | Trainer / faculty directory |
| `/faculty/:id` | Faculty profile and their courses |
| `/contact` | Contact |
| `/login` | Login for all roles (students, faculty and admins) |
| `/register` | Registration |
| `/forgot-password` | Request a password-reset OTP |
| `/reset-password` | Reset password with OTP |
| `/verify-email` | Email and phone verification (signed in) |

**Student** (role: `STUDENT`)

| Path | Page |
| --- | --- |
| `/student/dashboard` | Student dashboard |
| `/student/profile` | Profile |
| `/student/courses` | My courses & enrolments |
| `/student/attendance` | Attendance |
| `/student/assignments` | Assignments |
| `/student/results` | Mock tests, assessments & results |
| `/student/performance` | Academic performance |
| `/student/prediction` | Predicted final score & what-if simulator |
| `/student/notifications` | Notifications |

**Admin / Faculty** (roles: `FACULTY`, `ADMIN`, `SUPER_ADMIN`)

| Path | Page | Access |
| --- | --- | --- |
| `/admin/dashboard` | Dashboard (admin or faculty view) | All staff |
| `/admin/students` | Student management | Admin only |
| `/admin/faculty` | Faculty management | Admin only |
| `/admin/courses` | Course management | Admin only |
| `/admin/categories` | Category management | Admin only |
| `/admin/enrolments` | Enrolment management | Admin only |
| `/admin/attendance` | Attendance management | All staff |
| `/admin/assignments` | Assignment management | All staff |
| `/admin/assessments` | Assessment & marks management | All staff |
| `/admin/performance` | Performance monitoring | All staff |
| `/admin/predictions` | ML prediction dashboard | All staff |
| `/admin/reports` | Reports & analytics | Admin, or `VIEW_REPORTS` permission |
| `/admin/notifications` | Send notifications | Admin, or `SEND_NOTIFICATIONS` permission |
| `/admin/notifications/inbox` | Personal notifications | All staff |
| `/admin/settings` | Profile & system settings | All staff |

There is no separate admin login page. Everyone signs in at `/login` and is sent to the portal that matches their role.

---

## Backend API Integration

The frontend consumes the EDU-PREDICT **Django REST Framework** backend. Every response follows one envelope, typed once in `src/types/api.ts`:

```ts
export interface ApiEnvelope<T> {
  status: 'success' | 'error';
  status_code: number;
  message: string;
  data: T;
  errors: Record<string, string[] | string> | null;
}

export interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}
```

Login and refresh return the tokens at the top level, matching Postman. Field errors in `errors` are mapped onto the matching form fields automatically.

All endpoint paths live in `src/lib/api/endpoints.ts`.

### Main endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| POST | `/api/auth/register/` | Register student / faculty |
| POST | `/api/auth/login/` | Authenticate user |
| POST | `/api/auth/refresh/` | Refresh tokens |
| POST | `/api/auth/logout/` | Logout |
| GET | `/api/auth/me/` | Current user + permissions |
| GET | `/api/categories` | List categories |
| GET | `/api/courses/` | List courses |
| GET | `/api/courses/{id or slug}/` | Course details |
| GET | `/api/faculty/` | Public faculty list |
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

### Source of each endpoint

**Taken from the published Postman collection (exact request/response shapes):**
auth register / login / refresh / logout / me / profile / change-password / forgot-password / verify-phone-otp / verify-email-otp / reset-password / send-email-verification · `GET/PATCH /api/faculty/profile/` · `GET/POST /api/admin/faculty/`, `GET/PATCH/DELETE /api/admin/faculty/{id}/` · `GET /api/categories` · `GET /api/courses/`, `/api/courses/{id|slug}/` · `GET /api/faculty/`, `/api/faculty/{id}/` · `GET /api/admin/categories/`.

**From the project report and Phase 7 notes (shapes follow the same conventions):**
`/api/admin/students/…`, `/api/admin/dashboard/`, `/api/faculty/dashboard/`, `/api/faculty/students/…`, `/api/notifications/…`, `/api/admin/notifications/…`, `/api/reports/…`, `/api/student/profile|courses|attendance|assignments|results|performance/`, `POST /api/ml/predict/`, `GET /api/ml/prediction/{student_id}/`.

**Assumed (if Django differs, change the path in `endpoints.ts` and the type in the feature's `types.ts`):**
admin category/course create-update-delete (`/api/admin/categories/{id}/`, `/api/admin/courses/…`), `/api/admin/enrolments/…`, student enrol `POST /api/student/enrolments/` `{course}`, `/api/attendance/…`, `/api/assignments/…`, `/api/assignments/{id}/submissions/`, `/api/submissions/{id}/grade/`, `/api/student/assignments/{id}/submit/`, `/api/assessments/…`, `/api/assessments/{id}/results/`.

List responses for these screens are read tolerantly (a plain array, `{results}` or a named key), so small shape differences don't break the UI.

### ML prediction

The prediction API takes academic features and returns a predicted final score (0–100):

| Feature | Request field | Example |
| --- | --- | --- |
| Attendance % | `attendance_percentage` | 88 |
| Assignment average | `assignment_average` | 84 |
| Mock test average | `mock_test_average` | 78 |
| Practice hours / week | `practice_hours_per_week` | 10 |
| Previous score | `previous_score` | 80 |
| Modules completed % | `modules_completed` | 90 |

`POST /api/ml/predict/` is called either with `{ "student_id": … }` (predict from the student's stored records) or with the feature values above (what-if simulation).

Example output: **Predicted Final Score = 83.7 / 100**, with an indicator (Excellent / Good / Average / Needs Attention). Figures are illustrative; real values come from the trained model.

---

## Authentication & Role-Based Access

- The backend issues **JWT access and refresh tokens** (PyJWT). `POST /api/auth/login/` returns `access_token`, `refresh_token` and `user`.
- The shared Axios client attaches `Authorization: Bearer <access>` to every request. On a `401`, it calls `POST /api/auth/refresh/` once (simultaneous requests share the same refresh), retries the original request, and logs the user out if the refresh fails.
- `RequireAuth` blocks unauthenticated users and sends them to `/login?next=…`. `RequireRole` blocks users without the required role. `GuestOnly` keeps signed-in users away from login and registration.
- Route protection: `/student/*` → `STUDENT`; `/admin/*` → `FACULTY` / `ADMIN` / `SUPER_ADMIN`; student, faculty, course, category and enrolment management → `ADMIN` / `SUPER_ADMIN` only. Reports, CSV export and broadcasts also check the `VIEW_REPORTS`, `EXPORT_REPORTS` and `SEND_NOTIFICATIONS` permissions.
- Public registration offers only **Student** and **Faculty** roles. Faculty accounts become active after an admin approves them. Admin and Super Admin accounts are created by the backend, never through the public form.

| Role | Access |
| --- | --- |
| Student | Own profile, courses, enrolments, attendance, assignments, results and prediction |
| Faculty / Staff | Assigned students, attendance, marks, performance and prediction viewing |
| Admin | Students, courses, academic records, reports and ML dashboard |
| Super Admin | Users, roles, permissions and full system configuration |

---

## Deploying on Render

The repo includes `render.yaml` (Blueprint) and `public/_redirects`, so it deploys as a **Static Site**.

1. **Remove macOS duplicate files.** Finder creates copies such as `useAuth 2.ts`. TypeScript compiles every file under `src/`, so they break `tsc -b`. Delete them and commit:
   ```bash
   find . -name "* 2.*" -not -path "./node_modules/*" -delete
   rm -rf __MACOSX
   git add -A && git commit -m "Remove macOS duplicate files" && git push
   ```
   `.gitignore` now ignores `* 2.*` and `__MACOSX/` so they can't come back.
2. **Service type:** Static Site (or New → Blueprint and pick this repo).
   - Build command: `npm ci && npm run build`
   - Publish directory: `dist`
3. **Environment variables** (Vite reads them at *build* time; `.env` is not committed):
   - `VITE_API_BASE_URL=https://django-api-server-71ti.onrender.com`
   - `VITE_MEDIA_BASE_URL=https://django-api-server-71ti.onrender.com`
   - `NODE_VERSION=22`
4. **Rewrite rule:** Source `/*` → Destination `/index.html`, Action **Rewrite**. Without it, refreshing `/student/dashboard` returns 404.
5. **Django CORS:** add the frontend URL (e.g. `https://reactjs-edu-predict.onrender.com`) to `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS` on the API service.

Free Render API instances sleep when idle, so the first request after a pause can take 30–60 s.

---

## Coding Conventions

- **Strict TypeScript:** `strict` is on; no `any` (use `unknown` and narrow it). Every API request and response has an explicit type.
- **Type-only imports** use `import type` (`verbatimModuleSyntax` is enabled).
- **Path alias:** import from `@/…` (maps to `src/`).
- **Naming:** `PascalCase` for components and types, `camelCase` for functions and hooks (`useCourses`), `camelCase` for non-component files.
- **Typed Redux hooks:** always use `useAppDispatch` / `useAppSelector` from `src/app/store/hooks.ts`.
- **Forms:** React Hook Form with a Zod schema; the schema is the single source of truth for the form's type (`z.infer`).
- **Validation rules** match the backend: password at least 6 characters with an uppercase letter, a lowercase letter and a special character; phone number exactly 10 digits.
- **Pages are lazy-loaded** and each exports a default component for `React.lazy`.

---

## Design Notes

The design language follows the original EDU-PREDICT prototype: Plus Jakarta Sans, an indigo/violet brand palette and rounded cards. The footer no longer switches abruptly to a dark block. It starts in the page colour and fades through soft indigo into lavender, and the portal footer uses a matching gradient. Layouts are responsive for desktop, tablet and mobile.

---

## Related Repositories

- **Django backend**: REST API, authentication, academic records and the Linear Regression prediction API
- **edu-predict-frontend**: Flutter mobile app (Android & iOS) using the same APIs

---

## Author

**Dion James Smith**, Software Engineer