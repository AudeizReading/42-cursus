import { test, expect } from './baseFixtures';

test('End-to-End Test: Connection, Room Creation, and Multi-Tab Management', async ({
	context,
}) => {
	const page = await context.newPage();

	await page.goto('/');
	await page.waitForTimeout(1000);

	expect(await page.title()).toEqual('Registration | Red Tetris');

	await page.getByPlaceholder('username').click();
	await page.getByPlaceholder('username').fill('master');
	await page.getByRole('button', { name: 'Enter in Red Tetris' }).click();
	await page.waitForTimeout(1000);

	expect(await page.title()).toEqual('ListRoom | Red Tetris');

	await page.getByRole('button', { name: 'Create a room' }).click();
	await page.getByRole('textbox').click();
	await page.getByRole('textbox').fill('testos');
	await page.getByRole('button', { name: 'send' }).click();
	await page.waitForTimeout(1000);

	expect(await page.title()).toEqual('WaitingRoom | Red Tetris');

	const page1 = await context.newPage();
	await page1.goto('/');
	await page1.waitForTimeout(1000);

	expect(await page1.title()).toEqual('ListRoom | Red Tetris');

	await page1.getByRole('button', { name: 'testos 1 player' }).click();
	await page1.waitForTimeout(1000);

	expect(await page1.title()).toEqual('WaitingRoom | Red Tetris');

	await page1.getByRole('button', { name: 'Leave' }).click();
	await page1.waitForTimeout(1000);

	expect(await page1.title()).toEqual('ListRoom | Red Tetris');
	await page1.waitForTimeout(1000);
	expect(await page.title()).toEqual('ListRoom | Red Tetris');
});
