import { test, expect, type Page } from '@playwright/test';

test.describe('Scoped Styles', () => {
  test('should apply scoped styles correctly', async ({ page }: { page: Page }) => {
    // Navigate to the page with scoped styles
    await page.goto('/');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Get the elements
    const rootElement = page.locator('[data-test-id="component-root"]');
    const globalElement = page.locator('.global-class');
    const scopedElement = page.locator('.some-locally-scoped-class');
    const nestedElements = page.locator('.some-nested-class');

    // Wait for elements to be visible
    await rootElement.waitFor({ state: 'visible' });
    await globalElement.waitFor({ state: 'visible' });
    await scopedElement.waitFor({ state: 'visible' });
    await nestedElements.first().waitFor({ state: 'visible' });

    // Verify root element has style-scope attribute
    const scopeRef = await rootElement.getAttribute('style-scope');
    expect(scopeRef).toBeTruthy();
    expect(scopeRef).toMatch(/^scoped-[a-f0-9]{6}$/);

    // Verify scoped styles are applied to local element
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

    // Verify that global styles are not affected
    const globalStyles = await globalElement.evaluate((el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      return {
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // Global element should have default styles
    expect(globalStyles.fontWeight).not.toBe('700');
    expect(globalStyles.color).not.toBe('rgb(255, 0, 0)');
    expect(globalStyles.backgroundColor).not.toBe('rgb(0, 0, 255)');

    // Get both nested components (with and without style-propagate)
    const allNestedElements = await nestedElements.all();
    expect(allNestedElements).toHaveLength(2);

    // First nested component (without style-propagate)
    const nonPropagatedStyles = await allNestedElements[0].evaluate((el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      return {
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // Should not inherit parent styles
    expect(nonPropagatedStyles.fontWeight).not.toBe('700');
    expect(nonPropagatedStyles.color).not.toBe('rgb(255, 0, 0)');
    expect(nonPropagatedStyles.backgroundColor).not.toBe('rgb(0, 0, 255)');

    // Second nested component (with style-propagate)
    const propagatedStyles = await allNestedElements[1].evaluate((el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      return {
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // Should inherit parent styles
    expect(propagatedStyles.fontWeight).toBe('700');
    expect(propagatedStyles.color).toBe('rgb(31, 30, 30)');
    expect(propagatedStyles.backgroundColor).toBe('rgb(200, 200, 204)');

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'e2e/screenshots/scoped-styles.png' });
  });

  test('should handle dynamic style-propagate changes', async ({ page }: { page: Page }) => {
    // Navigate to the page
    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Get the nested components
    const nestedElements = page.locator('.some-nested-class');
    await nestedElements.first().waitFor({ state: 'visible' });

    // Verify initial state
    const allNestedElements = await nestedElements.all();
    expect(allNestedElements).toHaveLength(2);

    // TODO: Add tests for dynamic style-propagate changes once implemented
    // This would involve:
    // 1. Adding a toggle button to switch style-propagate
    // 2. Clicking the button
    // 3. Verifying styles update accordingly
  });
}); 