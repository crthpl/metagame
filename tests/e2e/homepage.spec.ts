import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {

  test('should load the homepage successfully', async ({ page }) => {
    await page.goto('/');
    
    // Check main heading is visible using specific ID
    await expect(page.locator('#hero-title'), 'Hero title should be visible on homepage').toBeVisible();
    
    // Verify page title
    await expect(page, 'Page title should contain METAGAME 2025').toHaveTitle(/METAGAME 2025/);
  });

  test('should display all main sections with content', async ({ page }) => {
    await page.goto('/');
    
    // Hero section - check for key elements using specific IDs
    await expect(page.locator('#hero'), 'Hero section should be visible on homepage').toBeVisible();
    await expect(page.locator('#hero-title'), 'Hero title should display METAGAME 2025').toContainText('METAGAME 2025');
    await expect(page.locator('#hero'), 'Hero should display conference dates').toContainText('September 12-14');
    await expect(page.locator('#hero-cta-button'), 'Hero CTA button should be present').toBeVisible();
    
    // Calendar section
    await expect(page.locator('#calendar'), 'Calendar section should be visible').toBeVisible();
    
    // Speakers section - validate it loads and has content using specific IDs
    await expect(page.locator('#speakers'), 'Speakers section should be visible').toBeVisible();
    await expect(page.locator('#speakers-title'), 'Speakers title should be present').toContainText('Speakers');
    
    // Wait for speaker cards to load and check we have at least one
    // Speaker cards are div elements containing images and names
    await expect(page.locator('#speakers img').first(), 'At least one speaker image should load').toBeVisible({ timeout: 10000 });
    const speakerImageCount = await page.locator('#speakers img').count();
    expect(speakerImageCount, 'Should have at least one speaker with image').toBeGreaterThan(0);
    
    // Sponsors section - validate it loads and has content using specific ID
    await expect(page.locator('#sponsors'), 'Sponsors section should be visible').toBeVisible();
    await expect(page.locator('#sponsors-title'), 'Sponsors title should be present').toContainText('Sponsors');
    
    // Set animation section
    await expect(page.locator('#set-animation'), 'Set animation section should be present').toBeVisible();
    
    // Tickets section - validate ticket cards load using specific ID
    await expect(page.locator('#tickets'), 'Tickets section should be visible').toBeVisible();
    await expect(page.locator('#tickets-title'), 'Tickets title should have call-to-action text').toContainText('Grab a ticket!');
    
    // Check that ticket cards are present (look for the grid structure with ticket content)
    await expect(page.locator('#tickets .grid'), 'Tickets should display in grid layout').toBeVisible();
    const ticketElements = page.locator('#tickets .grid > div');
    const ticketCount = await ticketElements.count();
    expect(ticketCount, 'Should have at least one ticket option available').toBeGreaterThan(0);
  });

  test('should load speaker images successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for speakers section to load
    await expect(page.locator('#speakers'), 'Speakers section must be present before checking images').toBeVisible();
    
    // Wait for at least one speaker image to be present
    await expect(page.locator('#speakers img').first(), 'First speaker image should load within 10 seconds').toBeVisible({ timeout: 10000 });
    
    // Check that speaker images load (look for img elements that aren't broken)
    const speakerImages = page.locator('#speakers img');
    const imageCount = await speakerImages.count();
    
    if (imageCount > 0) {
      // Check first few images have loaded successfully
      const firstImage = speakerImages.first();
      await expect(firstImage, 'First speaker image should be visible after loading').toBeVisible();
      
      // Ensure image has src attribute and is not a broken image placeholder
      const imageSrc = await firstImage.getAttribute('src');
      expect(imageSrc, 'Speaker image should have valid src attribute').toBeTruthy();
      expect(imageSrc, 'Speaker image should not be a placeholder').not.toContain('placeholder');
    }
  });

  test('should load sponsor logos successfully', async ({ page }) => {
    await page.goto('/');
    
    // Wait for sponsors section to load
    await expect(page.locator('#sponsors'), 'Sponsors section should be present on homepage').toBeVisible();
    
    // Check for sponsor images
    const sponsorImages = page.locator('#sponsors img');
    const sponsorCount = await sponsorImages.count();
    
    if (sponsorCount > 0) {
      // Verify first sponsor image loads
      const firstSponsorImage = sponsorImages.first();
      await expect(firstSponsorImage, 'First sponsor logo should load and be visible').toBeVisible({ timeout: 10000 });
      
      const imageSrc = await firstSponsorImage.getAttribute('src');
      expect(imageSrc, 'Sponsor logo should have valid src attribute').toBeTruthy();
    }
  });

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/');
    
    // Test ticket button link using specific ID
    const ticketButton = page.locator('#hero-cta-button');
    await expect(ticketButton, 'Hero CTA button should be visible').toBeVisible();
    
    // Click and verify it scrolls to tickets section
    await ticketButton.click();
    
    // Give a moment for scroll animation
    await page.waitForTimeout(1000);
    
    // Verify tickets section is visible (should be scrolled into view)
    await expect(page.locator('#tickets'), 'Tickets section should be visible after clicking hero button').toBeVisible();
  });

  test('should be responsive on mobile', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    
    // Check that main sections are still visible and properly formatted
    await expect(page.locator('#hero'), 'Hero section should be visible on mobile').toBeVisible();
    await expect(page.locator('#hero-title'), 'Hero title should be visible on mobile').toBeVisible();
    
    // Check speakers section adapts to mobile
    await expect(page.locator('#speakers'), 'Speakers section should adapt to mobile viewport').toBeVisible();
    
    // Check tickets section on mobile
    await expect(page.locator('#tickets'), 'Tickets section should be accessible on mobile').toBeVisible();
    
    // Verify mobile navigation doesn't break layout
    const heroHeight = await page.locator('#hero').boundingBox();
    expect(heroHeight?.height, 'Hero section should have reasonable height on mobile (>200px)').toBeGreaterThan(200);
  });

  test('should display proper meta information', async ({ page }) => {
    await page.goto('/');
    
    // Check page has proper title
    await expect(page, 'Page title should contain METAGAME 2025').toHaveTitle(/METAGAME 2025/);
    
    // Verify key conference details are visible
    await expect(page.locator('text=September 12-14'), 'Conference dates should be visible on homepage').toBeVisible();
    await expect(page.locator('text=Berkeley, California'), 'Conference location should be displayed').toBeVisible();
  });
}); 