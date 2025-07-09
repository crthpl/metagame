// import { test, expect } from '@playwright/test';

// test.describe('Ticket Purchase Flow', () => {

//   test('should display ticket information correctly', async ({ page }) => {
//     // Check that ticket cards show price and details
//     const ticketCards = page.locator('[data-ticket-type]');
    
//     // Check first ticket card has essential elements
//     const firstCard = ticketCards.first();
//     await expect(firstCard).toBeVisible();
    
//     // Check for price display
//     const priceElement = firstCard.locator('text=/$[0-9]+/');
//     await expect(priceElement).toBeVisible();
//   });

//   test('should open purchase modal when clicking buy button', async ({ page }) => {
//     // Click on a buy button
//     const buyButton = page.locator('button:has-text("Buy"), button:has-text("Purchase"), button:has-text("Get Ticket")').first();
//     await buyButton.click();
    
//     // Check if modal or form appears
//     const purchaseForm = page.locator('form, [role="dialog"], .modal').first();
//     await expect(purchaseForm).toBeVisible({ timeout: 5000 });
//   });
// }); 