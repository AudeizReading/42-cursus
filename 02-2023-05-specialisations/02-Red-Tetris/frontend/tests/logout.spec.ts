import { test, expect } from './baseFixtures';

test('Logout', async ({ page }) => {
	await page.goto('/');
	await page.waitForTimeout(1000);
	expect(await page.title()).toEqual('Registration | Red Tetris');

	await page.getByPlaceholder('username').click();
	await page.getByPlaceholder('username').fill('master');
	await page.getByRole('button', { name: 'Enter in Red Tetris' }).click();

	expect(await page.title()).toEqual('ListRoom | Red Tetris');

	await page.getByRole('button', { name: 'Reset your username' }).click();

	expect(await page.title()).toEqual('Registration | Red Tetris');
});
