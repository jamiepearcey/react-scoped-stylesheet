import { test, expect, type Page } from '@playwright/test';

test.describe('Scoped Styles', () => {
  test('should apply scoped styles correctly', async ({ page }: { page: Page }) => {
    // Navigate to the page with scoped styles
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Get the elements
    const scopedElement = page.locator('.some-locally-scoped-class');
    const nestedElement = page.locator('.some-nested-class').first();
    const deepNestedElement = page.locator('.target-deep-class .some-nested-class');

    // Wait for elements to be visible
    await scopedElement.waitFor({ state: 'visible' });
    await nestedElement.waitFor({ state: 'visible' });
    await deepNestedElement.waitFor({ state: 'visible' });

    // Verify regular scoped styles are applied
    const scopedStyles = await scopedElement.evaluate((el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      return {
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // Check that scoped styles match our CSS
    expect(scopedStyles.fontWeight).toBe('700');
    expect(scopedStyles.color).toBe('rgb(31, 30, 30)');
    expect(scopedStyles.backgroundColor).toBe('rgb(200, 200, 204)');

    // Verify nested component styles
    const nestedStyles = await nestedElement.evaluate((el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      return {
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // Regular nested component should have its own styles
    expect(nestedStyles.fontWeight).toBe('400');
    expect(nestedStyles.color).toBe('rgb(23, 23, 23)');
    expect(nestedStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)');

    // Verify deep selector styles
    const deepStyles = await deepNestedElement.evaluate((el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      return {
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // Deep nested component should have overridden styles
    expect(deepStyles.fontWeight).toBe('700');
    expect(deepStyles.color).toBe('rgb(31, 30, 30)');
    expect(deepStyles.backgroundColor).toBe('rgb(200, 200, 204)');

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'e2e/screenshots/scoped-styles.png' });
  });
}); 