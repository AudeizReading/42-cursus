import { test } from './baseFixtures';

test('Update Channel List', async ({ context, browser }) => {
	const page = await context.newPage();
	await page.goto('/roomchat/usertestchat0');
	await page.waitForTimeout(1000);

	const page2 = await browser.newPage();
	await page2.goto('/roomchat/usertestchat1');
	await page2.waitForTimeout(1000);

	const page3 = await browser.newPage();
	await page3.goto('/roomchat/usertestchat2');
	await page3.waitForTimeout(1000);

	await page.getByPlaceholder('your message').click();
	await page.getByPlaceholder('your message').fill('Hello');
	await page.getByPlaceholder('your message').press('Enter');

	await page2.getByPlaceholder('your message').click();
	await page2.getByPlaceholder('your message').fill('Hello, Are you ready?');
	await page2.getByPlaceholder('your message').press('Enter');

	await page.getByPlaceholder('your message').click();
	await page.getByPlaceholder('your message').fill('Yes, lets Go!');
	await page.getByPlaceholder('your message').press('Enter');

	await page2.getByPlaceholder('your message').click();
	await page2.getByPlaceholder('your message').fill('Yes!');
	await page2.getByPlaceholder('your message').press('Enter');

	await page2.getByRole('button', { name: 'Set ready' }).click();

	await page.getByRole('button', { name: 'Run Game' }).click();
	await page.getByRole('button', { name: 'Yes' }).click();

	await page3.waitForTimeout(60000);
});
