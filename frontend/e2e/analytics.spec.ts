import { test, expect } from '@playwright/test';

test.describe('Analytics page', () => {
	test('loads and shows heading in layout', async ({ page }) => {
		await page.goto('/analytics');
		await expect(page).toHaveURL(/.*analytics/);
		// The app sets a page heading via context; prefer accessible heading lookup
		const heading = page.getByRole('heading', { name: 'Analytics' });
		await expect(heading).toBeVisible();
	});

	test('shows chart titles and big numbers', async ({ page }) => {
		await page.goto('/analytics');
		await expect(page.getByText('Vehicle Status Distribution')).toBeVisible();
		await expect(page.getByText('Vehicle Type Distribution')).toBeVisible();
		await expect(page.getByText('Average Charge Level Over Time')).toBeVisible();
		await expect(page.getByText('Average Energy Consumption Over Time')).toBeVisible();
	  await expect(page.getByText(/\d+%/).first()).toBeVisible();
    await expect(page.getByText(/\d+(\.\d+)?\s*kWh\/100km/)).toBeVisible();
	});

	test('renders charts', async ({ page }) => {
		await page.goto('/analytics');
		await page.waitForTimeout(200);
		const svgCount = await page.locator('svg').count();
		expect(svgCount).toBeGreaterThanOrEqual(3);
	});

	test('top-level analytics container and grid layout exist', async ({ page }) => {
		await page.goto('/analytics');
		await expect(page.locator('.fleet-status')).toBeVisible();
		await expect(page.locator('.bar-chart')).toHaveCount(2);
    await expect(page.locator('.area-chart')).toHaveCount(2);
	});
});
