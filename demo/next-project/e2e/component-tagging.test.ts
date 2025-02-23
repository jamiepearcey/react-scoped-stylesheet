import { test, expect } from '@playwright/test';

test('components should have data-component attributes', async ({ page }) => {
  // Navigate to the home page
  await page.goto('/');

  // Check if components have data-component attributes
  const components = [
    { selector: 'button', name: 'Button' },
    { selector: '[data-component="Card"]', name: 'Card' },
    { selector: '[data-component="Container"]', name: 'Container' },
  ];

  for (const { selector, name } of components) {
    const element = await page.locator(selector).first();
    await expect(element).toHaveAttribute('data-component', name);
  }
});

test('nested components should have correct data-component attributes', async ({ page }) => {
  await page.goto('/');

  // Find a Card component that contains a Button
  const cardWithButton = await page.locator('[data-component="Card"]').filter({
    has: page.locator('[data-component="Button"]')
  });

  // Verify both components have their attributes
  await expect(cardWithButton).toHaveAttribute('data-component', 'Card');
  const button = cardWithButton.locator('[data-component="Button"]');
  await expect(button).toHaveAttribute('data-component', 'Button');
});

test('HTML elements should not have data-component attributes', async ({ page }) => {
  await page.goto('/');

  // Check common HTML elements
  const htmlElements = ['div', 'span', 'p', 'a', 'img'];

  for (const element of htmlElements) {
    const elements = await page.locator(element).all();
    for (const el of elements) {
      const hasAttr = await el.evaluate((node) => 
        node.hasAttribute('data-component')
      );
      expect(hasAttr).toBe(false);
    }
  }
}); 