# DispenXCore

Angular 21 frontend application with mock REST API via json-server.

---

## Requirements

- Node.js 18+
- npm 11+
- json-server: `npm install -g json-server@0.17.4`

---

## Installation

```bash
npm install
```

---

## Running the app

### 1. Start the mock server

Go to the `server/` folder and run:

**Windows:**
```bat
cd server
start.bat
```

**Linux/Mac:**
```bash
cd server
./start.sh
```

The mock API will be available at `http://localhost:3000`.

### 2. Start the Angular app

```bash
npm start
```

App runs at `http://localhost:4200`.

---

## Mock users (db.json)

| Email | Password | Role |
|---|---|---|
| admin@gmail.com | admin1234 | ADMIN |
| radv@gmail.com | 123456789 | USER |

---

## Routing (`src/app/app.routes.ts`)

| Path | Component | Guard |
|---|---|---|
| `/sign-in` | SignInComponent | — |
| `/sign-up` | SignUpComponent | — |
| `/dashboard` | DashboardComponent | authenticationGuard |
| `/schedule` | NotFoundComponent | authenticationGuard |
| `/history` | NotFoundComponent | authenticationGuard |
| `/settings` | NotFoundComponent | authenticationGuard |
| `/support` | NotFoundComponent | authenticationGuard |

All protected routes use `authenticationGuard` which checks for a valid token in `localStorage`. Unauthenticated users are redirected to `/sign-in`.

---

## Global styles (`src/styles.css`)

Defines CSS variables for the entire app:

| Group | Variables |
|---|---|
| Primary | `--color-primary` → `--color-primary-9` |
| Secondary (Teal) | `--color-secondary` → `--color-secondary-4` |
| Tertiary (Sky Blue) | `--color-tertiary` → `--color-tertiary-4` |
| Neutral | `--color-neutral` → `--color-neutral-dark` |
| Alerts | `--color-info`, `--color-success`, `--color-warning`, `--color-error` |
| Backgrounds | `--bg-light`, `--bg-medium`, `--bg-dark` |

Also includes base typography, responsive breakpoints, and Material snackbar styles.

---

## Internationalization (i18n)

Translation files are located in `public/assets/i18n/`:

| File | Language |
|---|---|
| `en.json` | English |
| `es.json` | Spanish |

Translations cover: `sign-in`, `sign-up`, and `sidebar` sections.

The language switcher (`app-language-switcher`) is available on the Sign In and Sign Up pages. The selected language is persisted in `localStorage` under the key `app-lang` and restored on reload.

---

## Project structure


```
src/app/
  public/          → Sign In, Sign Up pages
  user-access/     → Auth service, guard, interceptor, models
  shared/          → Layout, sidebar, header, language switcher, dashboard
  features/        → Future feature modules
environments/    → API base URL configuration
server/
  db.json          → Mock database
  start.bat        → Windows server launcher
  start.sh         → Linux/Mac server launcher

```
