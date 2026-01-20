import { test, expect, Page } from '@playwright/test';

test.describe.configure({ mode: 'serial' });

test.describe('Focus Scenario: Login & BMI Input', () => {
  let page: Page;
  const user = {
    name: 'Focus User',
    email: `focus_${Date.now()}@example.com`,
    password: 'password123'
  };

  test.beforeAll(async ({ browser }) => {
    // Create a new context and page manually to share across tests
    const context = await browser.newContext();
    page = await context.newPage();

    // Pre-requisite: Register a new user so we can test login
    await page.goto('/register');
    await page.getByLabel('Name').fill(user.name);
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Register' }).click();
    await expect(page).toHaveURL(/\/login/);
  });

  test.afterAll(async () => {
    await page.close();
  });

  test('Login', async () => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(user.email);
    await page.getByLabel('Password').fill(user.password);
    await page.getByRole('button', { name: 'Login' }).click();
    
    // Verify successful login
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText(`Hello, ${user.name}`)).toBeVisible();
  });

  test('Input Weight & Height', async () => {
    // Ensure we are on dashboard and form is visible
    await expect(page.getByRole('heading', { name: 'Calculate BMI' })).toBeVisible();

    // Input data
    await page.getByLabel('Weight (kg)').fill('65');
    await page.getByLabel('Height (cm)').fill('170');
    
    // Verify inputs are filled correctly
    await expect(page.getByLabel('Weight (kg)')).toHaveValue('65');
    await expect(page.getByLabel('Height (cm)')).toHaveValue('170');

    // Calculate
    await page.getByRole('button', { name: 'Calculate' }).click();

    // Verify Result
    // 65 / (1.7 * 1.7) = 22.49
    await expect(page.getByText('Normal').first()).toBeVisible();
    await expect(page.getByText('22.49').first()).toBeVisible();
    
    // Verify inputs are cleared after success
    await expect(page.getByLabel('Weight (kg)')).toHaveValue('');
  });
});
