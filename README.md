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
npm run test:headed
npm run test:debug
npm run test:list
```

Open the latest HTML report:

```bash
npm run report
```

## Project Structure

```text
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

## Reports And Debug Artifacts

Playwright is configured to keep useful artifacts for failed tests:

- HTML report in `playwright-report/`
- traces in `test-results/`
- screenshots on failure
- videos on failure

These folders are ignored by Git because they are generated during test runs.
