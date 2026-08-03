# Playwright Automation Exercise

Playwright and TypeScript portfolio test suite for the public
[Automation Exercise](https://automationexercise.com) practice site.

## Current scope

- 26 UI scenarios in `tests/e2e/automationExercise.spec.ts`
- 14 API scenarios in `tests/api/automationExerciseApi.spec.ts`
- Chromium UI and API Playwright projects
- Page Objects for the site UI
- HTML reports, traces, screenshots, and videos for failed tests

## Prerequisites

- Node.js 24
- npm

## Installation

```bash
npm ci
npx playwright install chromium
```

Copy `.env.example` to `.env` and replace its clearly fake example values before running tests locally.
The local `.env` file is ignored by Git.

## Commands

```bash
npm test
npm run test:e2e
npm run test:api
npm run test:smoke
npm run test:regression
npm run test:list
npm run format:check
npm run lint
npm run report
```

The UI project is named `chromium`; the API project is named `api`.

## Generated artifacts

Playwright writes its HTML report to `playwright-report/` and failure artifacts to `test-results/`.
Both directories are ignored by Git.

## Known limitation

The suite tests a shared public demo service. Availability, response time, advertisements, and server-side test data
are outside this repository's control.

## Author

Uladzislau Piratsinski
