# Repository Agent Guide

## Purpose and authority

- This is a Playwright and TypeScript portfolio for `https://automationexercise.com`.
- It contains live UI and API scenarios based on the site's numbered test cases.
- Keep the project small enough for its owner to explain completely in an interview.
- Official Playwright documentation and best practices are the primary technical reference.
- Existing repository design and scenario requirements are the next authority.
- Preserve working local patterns unless a requirement or verified defect demands a change.

## Operating principles

- Prefer the smallest correct change.
- Fix the root cause.
- Do not redesign the repository or add speculative features.
- Do not copy another framework wholesale.
- Do not introduce a dependency or architecture pattern without an explicit requirement.
- Do not perform cosmetic repository-wide renames.
- Do not rewrite an entire file when a focused edit is sufficient.
- Preserve unrelated working-tree changes.

## Architecture

- `tests/e2e` contains executable UI scenarios and scenario-level assertions.
- Keep UI specs readable as business behavior with minimal technical detail.
- `tests/api` contains executable API behavior and lifecycle scenarios.
- `tests/support/pages` contains page-specific locators, actions, and natural page checks.
- `tests/support/flows` contains reusable workflows spanning pages or business steps.
- `tests/support/fixtures` owns reusable setup, cleanup, and fixture composition.
- Fixture-only infrastructure belongs in fixtures, not business flows.
- `tests/support/api` contains the typed API client and response contracts.
- `tests/support/data` contains factories, domain data, and stable test constants.
- `tests/support/config` is the only application environment configuration layer.
- Do not add BasePage, BaseTest, Screenplay, service locators, or dependency injection.
- Do not create generic Utils or Helpers dumping grounds.
- Do not add repository, service, or domain layers this project does not need.

## Test design

- Every test must be independently executable.
- No test may depend on execution order or another test's data.
- Every scenario must verify an observable outcome.
- Keep scenario numbers aligned with Automation Exercise's published lists.
- Keep titles accurate to the implemented behavior.
- Do not add duplicate scenarios or tests solely to increase the count.
- Use the API for setup when it is faster and more deterministic than the UI.
- Use the UI for setup only when that setup flow is itself under test.

## Locators

- Configure and use `data-qa` through `getByTestId()` when available.
- Otherwise prefer `getByRole()`, then `getByLabel()`.
- Next prefer `getByPlaceholder()` or meaningful visible text.
- Use scoped CSS only when the application exposes no stronger public contract.
- Avoid XPath and long CSS chains.
- Avoid selectors coupled to styling or internal DOM structure.
- Keep locators private inside their Page Object.
- Prefer an intent-revealing method over exposing a locator.
- Do not replace an already good locator merely to make it look different.
- Avoid `.nth()` and positional selection when a semantic identifier exists.
- A scenario-defined first item may use `.first()` with a concise reason comment.

## Waiting and interaction

- Never add arbitrary waits to make a flaky test pass.
- Never use `page.waitForTimeout()`.
- Do not use `networkidle` as generic synchronization.
- Prefer Playwright auto-waiting and web-first assertions.
- Use `waitForURL`, events, or locator state only for a concrete condition.
- Await every asynchronous Playwright operation.
- Avoid `force: true` unless an application-specific reason is documented.
- Do not catch and ignore navigation, interaction, or assertion failures.

## Assertions

- Never weaken an assertion to make a test pass.
- Preserve exact assertions when exact behavior is required.
- Do not delete a meaningful assertion because it fails.
- Do not convert failures into warnings.
- Do not use blanket `try/catch` around test behavior.
- Do not skip or fixme a failing scenario to obtain a green build.
- Page checks should use Playwright's web-first `expect` assertions.
- Diagnose whether a failure is code, data, environment, site, or application behavior.

## Page Objects and flows

- A Page Object implements how one page or component is operated.
- Tests describe what behavior is verified.
- Keep page-specific locators and interactions in the relevant Page Object.
- Keep cross-page reusable workflows in `tests/support/flows`.
- Pass test data into Page Objects and flows.
- Page Objects must not read environment variables or create test accounts.
- Do not turn Page Objects into god objects.
- Do not create getters for every locator mechanically.
- Small page-level checks belong in the Page Object when they read naturally.

## Fixtures, identities, and cleanup

- Preserve the existing `crypto.randomUUID()` identity strategy.
- Never share a mutable user account across tests.
- Every retry must receive a new identity.
- Keep account setup and cleanup in fixtures where applicable.
- Wrap resource lifecycle cleanup in `finally` when the fixture owns the resource.
- Cleanup must still run after a failed test whenever possible.
- Cleanup failures must remain visible.
- Assert cleanup HTTP status and business response.
- Treat an expected `404` as valid only when the scenario may already have deleted the account.
- Do not silently swallow cleanup failures.
- Keep contact, checkout, product, and user data under `tests/support/data`.
- Never place credentials or environment access inside a Page Object.

## API rules

- Route API operations through `AutomationExerciseApiClient`.
- Keep request construction out of individual API specs.
- Do not replace Playwright `APIRequestContext` with Axios or another client.
- Preserve explicit request and response domain types.
- Automation Exercise can return HTTP 200 with a body-level error code.
- Assert `httpStatus` separately from `body.responseCode` for every response.
- Assert messages, payload fields, and lifecycle results when meaningful.
- Keep API users unique and cleanup deterministic.

## TypeScript and code quality

- Keep `strict` TypeScript enabled.
- Do not use `any`.
- Avoid unnecessary `as` assertions.
- Do not use `@ts-ignore`.
- Use `@ts-expect-error` only for a documented legitimate case.
- Do not disable ESLint rules to hide a problem.
- Use type-only imports where required by the configured lint rules.
- Comments should explain why, not restate what the code does.
- Remove dead code rather than leaving speculative exports or utilities.

## Environment and secrets

- Keep environment access in `tests/support/config/env.ts`.
- Required values must fail with a clear message when accessed.
- Keep unrelated environment getters lazy.
- API-only runs must not require UI checkout values.
- Never commit `.env`, real credentials, personal accounts, or real payment data.
- Maintain `.env.example` with clearly fake values.
- Do not add a configuration validation dependency solely for environment handling.

## Tags

- Use Playwright metadata for tags; do not put tags in test titles.
- `@smoke` is only for critical, fast, representative paths.
- `@regression` covers the complete intended suite.
- Do not invent additional tag families without a requirement.

## CI

- Keep GitHub Actions as the only CI system.
- Use the Node version declared by the repository.
- CI order is checkout, Node setup, `npm ci`, Prettier, ESLint, and TypeScript.
- Then install Chromium with required dependencies and run `npm test`.
- Upload the HTML report even when tests fail.
- Upload `test-results` only on failure.
- Do not add Firefox, WebKit, Docker, Jenkins, Allure, or external SaaS gates.
- Never place real secrets in the workflow.

## Dependencies

- Prefer Playwright, TypeScript, Node.js, and existing dependencies.
- New dependencies are not permitted unless an explicit requirement cannot be met otherwise.
- Before proposing one, explain the concrete need and why existing tools are insufficient.
- Do not add tooling for appearance, boilerplate parity, or enterprise simulation.

## Definition of Done

- The requested behavior is implemented with the existing architecture.
- Relevant focused tests pass.
- `npm run check` passes.
- The relevant UI or API suite passes.
- Run `npm run test:list` when scenarios or tags change.
- Assertions remain meaningful and no test is weakened or skipped.
- No arbitrary wait, forced click, secret, or personal data is introduced.
- Test identities remain unique and cleanup remains strict.
- API tests preserve separate transport and business assertions.
- Documentation and CI claims match the implementation.
- No unnecessary dependency, abstraction, file, or generated clutter is added.
- Review `git diff` and `git status --short` before completion.
