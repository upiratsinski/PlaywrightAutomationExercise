# Playwright Automation Exercise Tests

Automation QA portfolio project for [automationexercise.com](https://automationexercise.com).  
The suite covers UI end-to-end scenarios and API checks using Playwright Test, Page Object Model, simple test data files, and environment-based configuration.

## Tech Stack

- TypeScript
- Playwright Test
- dotenv
- Page Object Model
- HTML reports, traces, screenshots, and videos on failure

## Installation

```bash
npm install
npx playwright install
```

## Environment Setup

Create a local `.env` file from the example:

```bash
cp .env.example .env
```

Fill in the required values in `.env`. The real `.env` file is ignored by Git, so credentials and environment-specific values stay local.

## Running Tests

```bash
npm test
npm run test:e2e
npm run test:api
npm run test:smoke
npm run test:regression
npm run test:headed
npm run test:debug
npm run test:list
```

Open the latest HTML report:

```bash
npm run report
```

For a quick local confidence check, run:

```bash
npm run format:check
npm run lint
npm run test:smoke
```

## Lint And Format

ESLint and Prettier are configured with simple rules for a TypeScript Playwright project.

```bash
npm run lint
npm run lint:fix
npm run format
npm run format:check
```

The lint setup also catches focused tests, skipped tests, and `waitForTimeout` usage.

## CI/CD

GitHub Actions workflow is stored in `.github/workflows/ci.yml`.

It runs on every push and pull request:

- installs dependencies with `npm ci`
- installs Chromium for Playwright
- checks formatting
- runs ESLint
- checks for known hardcoded demo secrets
- runs the full Playwright suite
- uploads the HTML report as an artifact

Configure the required repository secrets from `.env.example` before enabling CI for real runs.

## Project Structure

```text
.github/workflows/             GitHub Actions CI workflow
scripts/                       small project maintenance scripts
tests/
  api/                         API specs
  e2e/                         UI end-to-end specs
  support/
    api/                       API object with request helpers and assertions
    config/                    environment loader
    data/                      test data and upload fixtures
    flows/                     reusable cross-page user journeys
    pages/                     Page Object classes
    utils/                     small shared utilities
```

## Page Object Model Approach

Specs contain only high-level scenario steps. Locators, assertions, waits, and page-specific logic live inside Page Object or API object methods.

Example:

```ts
const loginPage = await mainPage.openLoginPage();
const loggedInMainPage = await loginPage.loginAsValidUser();

await loggedInMainPage.shouldShowLoginUser();
```

This keeps tests readable while leaving implementation details close to the page or API they belong to.

## Test Tags

Smoke and regression tests are tagged in test titles:

- `@smoke` for fast core confidence checks
- `@regression` for full coverage of the current suite

Use `npm run test:smoke` or `npm run test:regression` to run each group.

## Speed And Stability

The suite keeps UI scenarios sequential inside the UI spec because the public demo site uses shared server state. API and UI projects can still run side by side in the full suite.

The reusable UI login user is prepared through API setup instead of browser setup. This keeps the UI run faster while preserving real UI login/logout scenarios where they are the behavior under test.

## Reports And Debug Artifacts

Playwright is configured to keep useful artifacts for failed tests:

- HTML report in `playwright-report/`
- traces in `test-results/`
- screenshots on failure
- videos on failure

These folders are ignored by Git because they are generated during test runs.
