import { test, expect } from './baseFixtures';

test('Update Channel List', async ({ context, browser }) => {
	const page = await context.newPage();
	await page.goto('/');
	await page.getByPlaceholder('username').click();
	await page.getByPlaceholder('username').fill('master');
	await page.getByRole('button', { name: 'Enter in Red Tetris' }).click();
	await page.getByRole('button', { name: 'Create a room' }).click();
	await page.getByRole('textbox').click();
	await page.getByRole('textbox').fill('update channel number');
	await page.getByRole('button', { name: 'send' }).click();
	await page.waitForTimeout(1000);
	await page.goto('/');
	await page.waitForTimeout(1000);
	expect(await page.title()).toEqual('ListRoom | Red Tetris');

	const newContext = await browser.newContext();
	const newPage = await newContext.newPage();
	await newPage.goto('/');
	await newPage.getByPlaceholder('username').click();
	await newPage.getByPlaceholder('username').fill('master2');
	await newPage.getByRole('button', { name: 'Enter in Red Tetris' }).click();
	await newPage.waitForTimeout(1000);
	await newPage.getByRole('button', { name: 'update channel number 1 player' }).click();
	await newPage.waitForTimeout(1000);

	expect(
		await page.getByRole('button', { name: 'update channel number 2 players' }).count(),
	).toEqual(1);

	await newPage.getByRole('button', { name: 'Leave' }).click();
	await newPage.waitForTimeout(1000);

	expect(
		await page.getByRole('button', { name: 'update channel number 1 player' }).count(),
	).toEqual(1);

	const page1 = await context.newPage();
	await page1.goto('/');
	await page1.waitForTimeout(1000);
	await page1.getByRole('button', { name: 'update channel number 1 player' }).click();
	await page1.waitForTimeout(1000);
	await page1.getByRole('button', { name: 'Leave' }).click();
	await page1.waitForTimeout(1000);

	expect(
		await page.getByRole('button', { name: 'update channel number 0 player' }).count(),
	).toEqual(0);
});
