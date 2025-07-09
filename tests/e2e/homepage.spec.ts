import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {

  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    // Check main heading is visible
    const heroSection = page.getByText('METAGAME 2025');
    await expect(heroSection).toBeVisible();
  });

  test('should display all main sections', async ({ page }) => {
    await page.goto('/');
    
    // Check for main sections
    await expect(page.locator('#hero')).toBeVisible();
    await expect(page.locator('#calendar')).toBeVisible();
  });

  test('should be responsive on mobile', async ({ page, viewport }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that content is still visible and properly formatted
    await expect(page.locator('#hero')).toBeVisible();
    
  });
}); 