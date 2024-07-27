import { test, expect } from './baseFixtures';

test('Ready Waiting Room', async ({ context, browser }) => {
	const page = await context.newPage();
	await page.goto('/#chatEvent[eventChat0]');
	await page.waitForTimeout(1000);
	const newContext = await browser.newContext();
	const page1 = await newContext.newPage();
	await page1.waitForTimeout(1000);
	await page1.goto('/#chatEvent[eventChat1]');
	await page1.waitForTimeout(1000);
	await page.waitForTimeout(1000);
	expect(await page.isVisible("text='0 player ready of 2'")).toBe(true);
	await page1.getByRole('button', { name: 'Set ready' }).click();
	await page1.waitForTimeout(1000);
	await page.waitForTimeout(1000);
	expect(await page.isVisible("text='1 player ready of 2'")).toBe(true);
	await page1.getByRole('button', { name: 'Unset ready' }).click();
	await page1.waitForTimeout(1000);
	await page.waitForTimeout(1000);
	expect(await page.isVisible("text='0 player ready of 2'")).toBe(true);
	await page1.waitForTimeout(1000);
	await page.waitForTimeout(1000);
	await page.getByRole('button', { name: 'Leave' }).click();
	await page1.getByRole('button', { name: 'Leave' }).click();
});
