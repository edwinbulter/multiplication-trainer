# Playwright Test Naming Convention

For this project 'User Journey-based is chosen'!

## File Naming Strategies

### 1. Component/Feature-based
- `LoginPage.spec.ts`
- `CheckoutFlow.spec.ts`
- `UserProfile.spec.ts`

### 2. URL/Route-based
- `login.spec.ts`
- `products-page.spec.ts`
- `checkout-flow.spec.ts`

### 3. User Journey-based
- `guest-checkout.spec.ts`
- `user-registration.spec.ts`
- `password-reset-flow.spec.ts`

## Best Practices

1. **Consistency** - Stick to one naming convention across your project
2. **Descriptive** - Names should clearly indicate what's being tested
3. **Lowercase with hyphens** - Common in the Playwright community
4. **Group by feature** - Organize tests in directories by feature/component

## Example Directory Structure

```
tests/
  auth/
    login.spec.ts
    signup.spec.ts
    password-reset.spec.ts
  products/
    product-listing.spec.ts
    product-details.spec.ts
    search.spec.ts
  checkout/
    cart.spec.ts
    guest-checkout.spec.ts
    payment-flow.spec.ts
```

## Test Naming Inside Files

```typescript
// Use descriptive test names
test('should display error for invalid login', async ({ page }) => { ... });

// Group related tests with describe blocks
describe('User Authentication', () => {
  test('should log in with valid credentials', async ({ page }) => { ... });
  test('should show error for invalid credentials', async ({ page }) => { ... });
  test('should navigate to password reset page', async ({ page }) => { ... });
});
```

## Common Suffixes
- `.spec.ts` - Standard suffix for test files
- `.test.ts` - Alternative suffix (less common in Playwright)

## What to Avoid
- Generic names like `test1.spec.ts`
- Spaces in filenames
- Uppercase letters (except for component names in React projects)
- Special characters in filenames (except hyphens and dots)

## Tips
- Make test names self-documenting
- Keep test files focused on a single feature/component
- Use `describe` blocks to group related tests
- Start test names with a verb (e.g., "should", "displays", "handles")
