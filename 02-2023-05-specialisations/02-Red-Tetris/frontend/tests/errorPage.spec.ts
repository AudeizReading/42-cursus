import { test, expect } from './baseFixtures';

test('Error Page', async ({ page }) => {
	const response = await page.goto('/room/player_name/not_found', { waitUntil: 'load' });
	await page.waitForTimeout(1000);
	expect(await page.title()).toEqual(
		`${response?.status()} - ${response?.statusText()} | Red Tetris`,
	);
});
