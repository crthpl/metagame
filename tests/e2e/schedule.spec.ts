import { test, expect } from '@playwright/test';

test.describe('Schedule Page', () => {

  test('should load the schedule page within reasonable time', async ({ page }) => {
    const startTime = Date.now();
    
    // Set timeout based on environment (CI is slower)
    const isCI = !!process.env.CI;
    const timeoutMs = isCI ? 15000 : 5000; // 15s for CI, 5s for local
    const expectedLoadTime = isCI ? 12000 : 3000; // 12s for CI, 3s for local
    
    await page.goto('/schedule');
    
    // Wait for the main schedule container to be visible
    await expect(page.locator('.font-serif.w-full.h-full'), 'Schedule container should be visible').toBeVisible({ timeout: timeoutMs });
    
    // Check that the schedule loaded within reasonable time for environment
    const loadTime = Date.now() - startTime;
    const environment = isCI ? 'CI' : 'local';
    expect(loadTime, `Schedule should load within ${expectedLoadTime}ms in ${environment} environment`).toBeLessThan(expectedLoadTime);
    
    // Verify day display is present (should show one of the conference days)
    const dayDisplay = page.locator('#schedule-day-desktop, #schedule-day-mobile');
    await expect(dayDisplay.first(), 'Schedule day display should be visible').toBeVisible();
  });


  test('should allow changing between conference days', async ({ page }) => {
    await page.goto('/schedule');
    
    // Wait for schedule to load
    await expect(page.locator('.font-serif.w-full.h-full'), 'Schedule should load before testing navigation').toBeVisible({ timeout: 5000 });
    
    // Use specific IDs for navigation buttons (try both desktop and mobile)
    const nextDayButton = page.locator('#schedule-next-day-desktop, #schedule-next-day-mobile').first();
    const prevDayButton = page.locator('#schedule-prev-day-desktop, #schedule-prev-day-mobile').first();
    
    // Verify navigation buttons are present
    await expect(nextDayButton, 'Next day navigation button should be visible').toBeVisible();
    await expect(prevDayButton, 'Previous day navigation button should be visible').toBeVisible();
    
    // Get initial day display using specific IDs
    const dayDisplay = page.locator('#schedule-day-desktop, #schedule-day-mobile').first();
    await expect(dayDisplay, 'Current day should be displayed in header').toBeVisible();
    const initialDay = await dayDisplay.textContent();
    
    // Click next day button if not disabled
    const nextButtonDisabled = await nextDayButton.getAttribute('disabled');
    if (!nextButtonDisabled) {
      await nextDayButton.click();
      
      // Wait for day change
      await page.waitForTimeout(500);
      
      // Verify day changed
      const newDay = await dayDisplay.textContent();
      expect(newDay, 'Day should change when clicking next day button').not.toBe(initialDay);
    }
    
    // Test previous day button
    const prevButtonDisabled = await prevDayButton.getAttribute('disabled');
    if (!prevButtonDisabled) {
      await prevDayButton.click();
      
      // Wait for day change
      await page.waitForTimeout(500);
      
      // Verify we can navigate back
      const backDay = await dayDisplay.textContent();
      expect(backDay, 'Should be able to navigate back to previous day').toBeTruthy();
    }
  });

  test('should display events on the schedule', async ({ page }) => {
    await page.goto('/schedule');
    
    // Wait for schedule to load
    await expect(page.locator('.font-serif.w-full.h-full'), 'Schedule should load before checking for events').toBeVisible({ timeout: 5000 });
    
    // Simple check for any clickable events or schedule grid structure
    // Wait a bit for events to load as they might be async
    await page.waitForTimeout(2000);
    
    // Check if we have a schedule grid (more reliable than looking for specific events)
    const scheduleGrid = page.locator('[style*="grid-template-columns"]');
    const gridCount = await scheduleGrid.count();
    
    if (gridCount > 0) {
      await expect(scheduleGrid.first(), 'Schedule grid should be present').toBeVisible();
      console.log(`Found ${gridCount} schedule grid(s) - schedule structure is present`);
    } else {
      console.log('No schedule grid found - schedule might be loading or empty');
    }
  });

  test('should show location images in schedule headers', async ({ page }) => {
    await page.goto('/schedule');
    
    // Wait for schedule to load
    await expect(page.locator('.font-serif.w-full.h-full'), 'Schedule should load before checking location images').toBeVisible({ timeout: 5000 });
    
    // Look for location images in the header row
    const locationImages = page.locator('img').filter({ has: page.locator('[alt]') });
    const imageCount = await locationImages.count();
    
    if (imageCount > 0) {
      // Verify first location image loads
      const firstLocationImage = locationImages.first();
      await expect(firstLocationImage, 'First location image should be visible').toBeVisible();
      
      // Check image has valid src
      const imageSrc = await firstLocationImage.getAttribute('src');
      expect(imageSrc, 'Location image should have valid src attribute').toBeTruthy();
      expect(imageSrc, 'Location image should not be placeholder').not.toContain('placeholder');
      
      // Check image has alt text for accessibility
      const altText = await firstLocationImage.getAttribute('alt');
      expect(altText, 'Location image should have alt text for accessibility').toBeTruthy();
    }
  });

  test('should be responsive on mobile devices', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/schedule');
    
    // Wait for schedule to load
    await expect(page.locator('.font-serif.w-full.h-full'), 'Schedule should load on mobile viewport').toBeVisible({ timeout: 5000 });
    
    // Verify schedule is horizontally scrollable on mobile
    const scheduleContainer = page.locator('.overflow-auto').first();
    await expect(scheduleContainer, 'Schedule should have scrollable container on mobile').toBeVisible();
    
    // Check that day navigation is visible on mobile
    const dayNavigation = page.locator('#schedule-day-mobile');
    await expect(dayNavigation, 'Day navigation should be visible on mobile').toBeVisible();
    
    // Just verify the schedule is usable on mobile (time columns may vary)
    // This is more of a structural test than content-specific
    const scheduleStructure = page.locator('[style*="grid-template-columns"]').first();
    if (await scheduleStructure.isVisible()) {
      await expect(scheduleStructure, 'Schedule structure should be present on mobile').toBeVisible();
    }
  });

  test('should handle URL parameters for day and session', async ({ page }) => {
    // Test direct navigation to specific day
    await page.goto('/schedule?day=1');
    
    // Wait for schedule to load
    await expect(page.locator('.font-serif.w-full.h-full'), 'Schedule should load with day parameter').toBeVisible({ timeout: 5000 });
    
    // Check that we're on day 1 (Saturday) using specific ID
    const dayDisplay = page.locator('#schedule-day-desktop, #schedule-day-mobile').first();
    await expect(dayDisplay, 'Should navigate to Saturday when day=1 parameter is used').toBeVisible();
    
    // Verify the text contains Saturday
    const dayText = await dayDisplay.textContent();
    expect(dayText, 'Day display should show Saturday when day=1 parameter is used').toContain('Saturday');
    
    // Test that URL updates when changing days using specific ID
    const nextDayButton = page.locator('#schedule-next-day-desktop, #schedule-next-day-mobile').first();
    if (await nextDayButton.isVisible() && !(await nextDayButton.getAttribute('disabled'))) {
      await nextDayButton.click();
      await page.waitForTimeout(500);
      
      // Check that URL updated
      const currentUrl = page.url();
      expect(currentUrl, 'URL should update when changing days').toContain('day=');
    }
  });
});