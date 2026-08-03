# Playwright Automation Exercise

[![Playwright CI](https://github.com/upiratsinski/PlaywrightAutomationExercise/actions/workflows/ci.yml/badge.svg)](https://github.com/upiratsinski/PlaywrightAutomationExercise/actions/workflows/ci.yml)

Playwright and TypeScript portfolio project that automates the public
[Automation Exercise](https://automationexercise.com) UI and API practice scenarios.

## Project scope

The repository intentionally stays small enough to explain end to end in an interview. It uses one Chromium UI
project and one API project without adding a second automation framework or infrastructure layer.

## Test coverage

- 26 numbered UI scenarios covering authentication, products, cart, checkout, navigation, subscriptions, contact,
  reviews, invoice download, and scrolling
- 14 numbered API scenarios covering the catalog, authentication, and user lifecycle endpoints
- A focused smoke subset for the main registration, login, catalog, search, and cart paths
- A regression tag on all 40 scenarios

The numbers in test titles map directly to the scenarios published by Automation Exercise.

## Tech stack

- Playwright Test
- TypeScript with strict type checking
- Node.js 24 and npm
- ESLint with the Playwright recommended rules
- Prettier
- GitHub Actions

## Project structure

```text
.github/workflows/ci.yml              CI quality checks and Playwright run
tests/
  api/                                catalog, authentication, and user API specs
  e2e/                                UI specs grouped by business feature
  support/
    api/                              typed request client and response types
    config/                           lazy environment access
    data/                             domain data and unique-user factories
    fixtures/                         page setup and user lifecycle teardown
    flows/                            reusable multi-page business flows
    pages/                            Page Objects and UI locators
```

## Key design decisions

- Page Objects describe page-level UI behavior. Tests and flows provide credentials, search terms, contact details,
  and payment data rather than hiding global data inside Page Objects.
- UI and API scenarios live in separate Playwright projects and separate specs.
- Every account factory uses `crypto.randomUUID()`. A retry receives a new email, and parallel CI runs do not share
  one fixed user.
- Fixtures create accounts through the API only when a scenario needs an existing user. Teardown runs after failed
  assertions as well as successful tests and validates both the transport status and the API response body.
- Known advertising hosts are blocked once in UI fixture setup because ads can cover controls on the public demo
  site. Application and unrelated third-party traffic are not broadly blocked.
- `data-qa` is configured as Playwright's test-id attribute and is accessed through `getByTestId()`.
- Smoke and regression selection use Playwright's structured tag metadata, so tags do not clutter test titles.
- The live suite uses one worker locally and in CI to avoid sending concurrent traffic to the shared demo service.

Automation Exercise commonly returns HTTP `200` even when the JSON body contains a business `responseCode` such as
`400`, `404`, or `405`. API specs therefore assert the transport status and the body code separately.

## Installation

Prerequisites: Node.js 24 and npm.

```bash
git clone https://github.com/upiratsinski/PlaywrightAutomationExercise.git
cd PlaywrightAutomationExercise
npm ci
npx playwright install --with-deps chromium
```

## Environment configuration

Copy `.env.example` to `.env`. `BASE_URL` is optional and defaults to `https://automationexercise.com`; all other
values are read only when the relevant factory or checkout flow is used.

```bash
cp .env.example .env
```

On PowerShell, use `Copy-Item .env.example .env`.

The example and CI values are intentionally fake test data. Do not commit a local `.env` file or put personal
credentials or real payment data in this project. An API-only run does not require payment variables.

## Commands

| Command                   | Purpose                                     |
| ------------------------- | ------------------------------------------- |
| `npm test`                | Run all UI and API scenarios                |
| `npm run test:e2e`        | Run the `chromium` UI project               |
| `npm run test:api`        | Run the `api` project                       |
| `npm run test:smoke`      | Run the focused smoke subset                |
| `npm run test:regression` | Run all regression-tagged scenarios         |
| `npm run test:headed`     | Run the UI project in headed mode           |
| `npm run test:debug`      | Debug the UI project                        |
| `npm run test:list`       | List collected tests without executing them |
| `npm run check`           | Run formatting, lint, and TypeScript checks |
| `npm run report`          | Open the latest HTML report                 |

## CI/CD

GitHub Actions runs on pushes, pull requests, and manual dispatch. Fast quality gates run before Chromium is
installed: `npm ci`, Prettier, ESLint, and TypeScript. The workflow then installs Chromium and runs the complete
suite with safe demo values. Concurrent runs for the same branch or pull request cancel older runs.

The repository keeps `.env` files ignored, and GitHub secret scanning with push protection is enabled. It does not
present a short list of known strings as a complete security scanner.

## Reports and debugging

Local runs use the list and HTML reporters. CI uses the GitHub and HTML reporters. Playwright keeps:

- screenshots only on failure;
- traces only for failed tests;
- videos only for failed tests;
- the HTML report in `playwright-report/`;
- failure artifacts in `test-results/`.

CI uploads the HTML report even after a failure and uploads `test-results` when a job fails.

## Known limitations

- The target is a shared public demo site. Availability, response time, advertisements, and server-side data are
  outside this repository's control.
- Tests intentionally exercise the live site rather than replacing failures with mocks.
- Chromium is the only UI browser project; Firefox and WebKit are not included just to increase the matrix size.
- Demo payment fields validate the practice checkout flow only and do not represent a real payment integration.

## Author

Uladzislau Piratsinski
