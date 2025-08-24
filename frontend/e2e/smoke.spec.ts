import { test, expect } from '@playwright/test';

type PageCheck = { path: string; heading: string };

const PAGES: PageCheck[] = [
	{ path: '/', heading: 'Fleet Dashboard' },
	{ path: '/vehicles', heading: 'Vehicles Fleet' },
	{ path: '/vehicles/add', heading: 'Add a Vehicle' },
	{ path: '/analytics', heading: 'Analytics' },
	{ path: '/brand/add', heading: 'Add a Brand' },
	{ path: '/model/add', heading: 'Add a Vehicle Model' },
];

for (const p of PAGES) {
	test(`smoke: ${p.path} shows heading and no console errors`, async ({ page }) => {
		const consoleErrors: string[] = [];
		page.on('console', (msg) => {
			if (msg.type() === 'error') consoleErrors.push(msg.text());
		});

		await page.goto(p.path);

		// allow client-side rendering to set page heading via context
		const headingLocator = page.getByRole('heading', { name: new RegExp(p.heading, 'i') });
		await expect(headingLocator).toBeVisible({ timeout: 5000 });

		expect(consoleErrors).toEqual([]);
	});
}

