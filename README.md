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

```bash
npm install
npx playwright install
```

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
