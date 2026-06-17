<<<<<<< HEAD
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
=======
# Playwright Automation Exercise

End-to-end and API automation test suite for [Automation Exercise](https://automationexercise.com), built with Playwright, TypeScript, and the Page Object Model pattern.

The project covers the public Automation Exercise practice scenarios: user registration, login, cart flows, checkout, products, brands, subscriptions, contact form, reviews, invoice download, and API contract checks.

## Tech Stack

| Tool | Purpose |
| --- | --- |
| Playwright Test | Browser automation, API testing, assertions, fixtures, reports |
| TypeScript | Typed test code and reusable page objects |
| dotenv | Local environment configuration |
| Page Object Model | Maintainable UI actions and assertions |

## Test Coverage

### UI tests

The UI suite contains 26 Automation Exercise scenarios, including:

- User registration, login, logout, and account deletion
- Contact Us form with file upload
- Product listing, details, search, categories, and brands
- Cart operations and product quantity checks
- Checkout flows with registration before, during, and after login
- Address verification, payment flow, and invoice download
- Subscription checks from the home and cart pages
- Scroll up and scroll down behavior

### API tests

The API suite contains 14 checks for Automation Exercise API endpoints:

- Products and brands list
- Product search
- Login verification
- User creation, update, deletion, and lookup
- Negative checks for unsupported methods and missing parameters

## Project Structure

```text
tests/
+-- api/
|   +-- Api.spec.ts
+-- e2e/
|   +-- Main.spec.ts
+-- support/
    +-- api/
    |   +-- automationExerciseApi.ts
    +-- elements/
    |   +-- cartPage.ts
    |   +-- checkoutPage.ts
    |   +-- contactUsPage.ts
    |   +-- loginPage.ts
    |   +-- mainPage.ts
    |   +-- paymentPage.ts
    |   +-- productsPage.ts
    +-- fixtures/
    |   +-- apiData.ts
    |   +-- authData.ts
    |   +-- SampleFile.txt
    +-- functions/
        +-- e2eFlows.ts
```

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- Google Chrome installed locally

### Installation
>>>>>>> main

```bash
npm install
npx playwright install
```

<<<<<<< HEAD
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
=======
## Environment Variables

Create a `.env` file in the project root:

```env
BASE_URL=https://automationexercise.com
LOGIN_USERNAME=LukeSkywalker
LOGIN_EMAIL=lukeskywalker.aqa@example.com
LOGIN_PASSWORD=PlaywrightTest1234
INVALID_LOGIN_EMAIL=invalidlogintest@example.com
INVALID_LOGIN_PASSWORD=Password123
```

`BASE_URL` is required by the Playwright config. Login values are optional because the test data has defaults, but keeping them in `.env` makes local runs easier to adjust.

## Running Tests

Run the full test suite:

```bash
npx playwright test
```

Run only UI tests:

```bash
npx playwright test --project=chrome
```

Run only API tests:

```bash
npx playwright test --project=api
```

Run tests in headed mode:

```bash
npx playwright test --project=chrome --headed
```

Run a specific spec file:

```bash
npx playwright test tests/e2e/Main.spec.ts
```

## Reports and Debugging

Open the latest HTML report:

```bash
npx playwright show-report
```

Run tests with Playwright UI mode:

```bash
npx playwright test --ui
```

Traces are collected on the first retry and can be inspected from the HTML report.

## Configuration

The main configuration lives in `playwright.config.ts`:

- `testDir`: `./tests`
- `reporter`: `html`
- `baseURL`: loaded from `.env`
- `trace`: enabled on first retry
- `chrome` project: runs UI tests in Desktop Chrome
- `api` project: runs API tests without browser context

## Notes

- The UI tests create and delete reusable users as part of setup and teardown.
- Some flows interact with live public test data, so occasional instability can happen if the target site is slow or unavailable.
- Generated folders such as `test-results/`, `playwright-report/`, `.pw-tmp/`, and `node_modules/` are ignored by Git.

## Author

Uladzislau Piratsinski
>>>>>>> main
