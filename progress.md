# Aergus Progress

Last reviewed: 2026-09-08

## Completed

### Backend

- Express server is configured with JSON parsing, cookies, CORS, environment variables, and a health endpoint.
- Authentication routes and services exist for user registration, login, session handling, JWTs, cookies, and Google authentication.
- Protected authentication middleware is in place.
- Drizzle database connection and schema files exist for users, workspaces, projects, resources, and websites.
- Workspace API is available for listing and creating workspaces.
- Project API is available for project operations.
- Resource API is available for resource operations.
- Tier configuration and workspace-limit handling are present.
- Shared application error and JWT/cookie utilities exist.

### Dashboard

- Next.js dashboard application is set up with Tailwind CSS, shared theme variables, and Aergus brand colors.
- Login and registration UI exists, including password fields, Google sign-in, session checks, and redirects.
- Authenticated users with no workspace are redirected to workspace creation.
- Workspace creation form supports name, generated slug preview, optional description, submission loading state, errors, and tier upgrade handling.
- Workspace data is managed through a Zustand store connected to the backend API.
- Workspace layout, workspace switching, activity, projects, team, and project creation routes exist.
- Project views exist for dashboard, alerts, automation, health, insights, integrations, monitoring, resources, and settings.
- Developer pages exist for API, CLI, docs, SDK, and webhooks.
- Shared header, sidebar, workspace switcher, navigation items, inputs, loading state, and toast components exist.
- Public workspace illustration assets are available for the login and workspace creation screens.

## Services Built So Far

### Backend (Express + TypeScript)

All services live inside their feature folders (`backend/src/<feature>/<feature>Service*.ts`).

| Service file | Exported services |
|---|---|
| `backend/src/user/userService.ts` | `registerService`, `loginService`, `getCurrentUser`, `getGoogleAuthorizationURL`, `exchangeGoogleCode`, `getGoogleUserprofile`, `handleGoogleLogin`, `revokeRefreshTokenService`, `refreshTokenService` |
| `backend/src/workspace/workspaceService.ts` | `createWorkspaceService`, `addWorkspaceMemberService`, `updateWorkspaceService` |
| `backend/src/project/projectServices.ts` | `createProjectService`, `updateProjectService` |
| `backend/src/resources/resourceService.ts` | `createResourceService`, `getProjectResourcesService`, `getResourceService`, `updateResourceService`, `deleteResourceService` |

Supporting layers per feature: Controller, Repository, and Routes (e.g. `projectController.ts`, `projectRepository.ts`, `projectRoutes.ts`), plus shared `config/`, `db/schema/`, `middleware/authMiddleware.ts`, and `utils/` (AppError, cookie, jwt).

### Dashboard (Next.js frontend, Zustand stores)

No `*service*` files exist on the frontend; the data layer is the Zustand stores under `dashboard/app/store/`:

| Store file | Actions |
|---|---|
| `dashboard/app/store/authStore.ts` | `login`, `logout`, `googleLogin`, `register`, `checkSession`, `upgradeTier` (Axios with token/refresh interceptor + storage) |
| `dashboard/app/store/workspaceStore.ts` | `fetchWorkspaces`, `createWorkspace`, `setActiveWorkspace` |
| `dashboard/app/store/projectStore.ts` | `fetchProjects`, `createProject`, `setActiveProject`, `clearProjects` |
| `dashboard/app/store/toastStore.ts` | `addToast`, `removeToast` |

Note: `dashboard/app/workspace/team/page.tsx` also calls the API directly (Axios) for member invites, outside the store layer.

## Still To Create Or Finish

### Product functionality

- Finish and verify the complete project lifecycle: create, edit, delete, archive, and switch projects.
- Connect each project subpage to real backend data instead of placeholder or static content where applicable.
- Complete website/resource creation, editing, deletion, and detail workflows.
- Add project health, monitoring, insights, alerts, and automation data processing.
- Add team member invitation, role management, removal, and permission enforcement.
- Add workspace settings, workspace rename, workspace deletion, and ownership transfer.
- Define and enforce a complete tier and billing workflow rather than only the current upgrade handling.
- Complete Google OAuth callback behavior and verify production redirect URLs.

### Experience and design

- Add and test the login-to-workspace-create transition with the rotating SVG rings and right-side card handoff.
- Finish responsive behavior for dense workspace and project screens on tablet and mobile sizes.
- Add empty, loading, success, and failure states for every data-driven page.
- Improve accessibility: keyboard navigation, focus states, form messages, labels, and reduced-motion coverage.
- Replace remaining placeholder copy and static metrics with real product data.

### Engineering quality

- Add backend and dashboard automated tests, especially for auth, workspace limits, permissions, and CRUD operations.
- Add request validation and consistent typed error handling across frontend and backend.
- Remove existing TypeScript ESLint `any` errors and other lint warnings.
- Add database migration and seed workflows for local development.
- Document environment variables, local setup, API endpoints, and deployment steps.
- Add CI checks for typechecking, linting, tests, and production builds.
- Verify CORS, cookies, refresh-token behavior, and production security settings.

## Suggested Next Steps

1. Stabilize authentication and workspace creation in local and production environments.
2. Finish project and resource CRUD flows end to end.
3. Replace placeholder dashboard data with API-backed data.
4. Add tests for auth, workspace limits, permissions, and core CRUD operations.
5. Complete responsive and accessibility review before launch.
