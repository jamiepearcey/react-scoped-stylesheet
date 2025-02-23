import { test, expect, type Page } from '@playwright/test';

test.describe('Scoped Styles', () => {
  test('should apply scoped styles correctly', async ({ page }: { page: Page }) => {
    // Navigate to the page with scoped styles
    await page.goto('/some-component');

    // Wait for the page to be fully loaded
    await page.waitForLoadState('networkidle');

    // Get the elements
    const scopedElement = page.locator('.some-locally-scoped-class');
    const globalElement = page.locator('.global-class');

    // Wait for elements to be visible
    await scopedElement.waitFor({ state: 'visible' });
    await globalElement.waitFor({ state: 'visible' });

    // Verify scoped styles are applied
    const scopedStyles = await scopedElement.evaluate((el: HTMLElement) => {
      const styles = window.getComputedStyle(el);
      return {
        fontWeight: styles.fontWeight,
        color: styles.color,
        backgroundColor: styles.backgroundColor
      };
    });

    // Check that scoped styles match our CSS
    expect(scopedStyles.fontWeight).toBe('400');
    expect(scopedStyles.color).toBe('rgb(23, 23, 23)'); 
    expect(scopedStyles.backgroundColor).toBe('rgba(0, 0, 0, 0)'); 

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

    // Verify scoping class is applied to the parent
    const parentElement = page.locator('[data-test-id="component-root"]').first();
    await parentElement.waitFor({ state: 'visible' });
    
    const parentClasses = await parentElement.getAttribute('class');
    expect(parentClasses).toBeTruthy();
    expect(parentClasses).toMatch(/^scoped-[a-f0-9]{6}$/);

    // Take a screenshot for visual verification
    await page.screenshot({ path: 'e2e/screenshots/scoped-styles.png' });
  });
}); 