# E2E Tests with Playwright

This directory contains end-to-end tests for the Metagame website using Playwright.

## Test Structure

```
tests/
├── e2e/
│   ├── homepage.spec.ts      # Homepage visibility and responsiveness tests
│   └── ticket-purchase.spec.ts # Ticket purchase flow tests
└── README.md
```

## Writing New Tests

Create new test files in `tests/e2e/` with the `.spec.ts` extension:

```typescript
import { expect, test } from '@playwright/test'

test.describe('Feature Name', () => {
  test('should do something', async ({ page }) => {
    await page.goto('/')

    // Your test assertions
    await expect(page.locator('#element')).toBeVisible()
  })
})
```

## Common Patterns

### Waiting for Elements

```typescript
// Wait for element to be visible
await expect(page.locator('#hero')).toBeVisible()

// Wait for text
await expect(page.getByText('METAGAME 2025')).toBeVisible()

// Wait with timeout
await expect(page.locator('.slow-element')).toBeVisible({ timeout: 10000 })
```

### Navigation

```typescript
// Basic navigation
await page.goto('/')

// With options for better reliability
await page.goto('/', {
  waitUntil: 'domcontentloaded',
  timeout: 30000,
})
```

### Mobile Testing

```typescript
test('mobile view', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 667 })
  await page.goto('/')
  // Mobile-specific assertions
})
```

## Tips

1. **Use data-testid** attributes for more reliable selectors
2. **Keep tests independent** - each test should be able to run alone
3. **Use descriptive test names** that explain what's being tested
4. **Avoid hard-coded waits** - use Playwright's built-in waiting mechanisms

## Environment Variables

For tests to run properly, you need to set up environment variables:

### Local Development

Create a `.env` file in the project root:

```bash
PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### GitHub Actions

Add the following secret to your repository:

1. Go to Repository Settings → Secrets and variables → Actions
2. Add `PUBLIC_STRIPE_PUBLISHABLE_KEY` with your Stripe test publishable key

Note: This is a publishable (public) key, so it's safe to share. You can find it in your [Stripe Dashboard](https://dashboard.stripe.com/test/apikeys).
