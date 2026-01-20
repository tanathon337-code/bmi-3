import { test, expect } from '@playwright/test';

test.describe('BMI Web Application Full Journey', () => {
  // Use serial mode to ensure tests run in order if we split them, 
  // but here we use a single test with steps for state continuity.
  // test.describe.configure({ mode: 'serial' });

  const randomId = Math.floor(Math.random() * 10000);
  const user = {
    name: `Test User ${randomId}`,
    email: `test${randomId}@example.com`,
    password: 'password123'
  };

  test('Complete User Journey (Auth, BMI, Reports)', async ({ page }) => {
    
    // AUTH-01: Register Success
    await test.step('AUTH-01: Register Success', async () => {
      await page.goto('/register');
      await page.getByLabel('Name').fill(user.name);
      await page.getByLabel('Email').fill(user.email);
      await page.getByLabel('Password').fill(user.password);
      await page.getByRole('button', { name: 'Register' }).click();
      // Expect redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

    // AUTH-03: Login Fail
    await test.step('AUTH-03: Login Fail', async () => {
      // Ensure we are on login page
      await page.goto('/login'); 
      await page.getByLabel('Email').fill(user.email);
      await page.getByLabel('Password').fill('wrongpassword');
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Verify we are still on login page (URL hasn't changed to dashboard)
      await expect(page).toHaveURL(/\/login/);
      
      // Optional: Check for error message if UI displays one
      // await expect(page.getByText(/invalid/i)).toBeVisible(); 
    });

    // AUTH-02: Login Success
    await test.step('AUTH-02: Login Success', async () => {
      await page.getByLabel('Email').fill(user.email);
      await page.getByLabel('Password').fill(user.password);
      await page.getByRole('button', { name: 'Login' }).click();
      
      // Expect redirect to dashboard
      await expect(page).toHaveURL(/\/dashboard/);
      await expect(page.getByText(`Hello, ${user.name}`)).toBeVisible();
    });

    // BMI-03: Input Validation
    await test.step('BMI-03: Input Validation', async () => {
      // Verify calculator is visible
      await expect(page.getByRole('heading', { name: 'Calculate BMI' })).toBeVisible();
      
      const weightInput = page.getByLabel('Weight (kg)');
      const heightInput = page.getByLabel('Height (cm)');
      const calculateBtn = page.getByRole('button', { name: 'Calculate' });

      // Check validation for empty inputs
      await weightInput.fill('');
      await heightInput.fill('');
      await calculateBtn.click();

      // Check HTML5 validity
      const isWeightValid = await weightInput.evaluate((input: HTMLInputElement) => input.validity.valid);
      const isHeightValid = await heightInput.evaluate((input: HTMLInputElement) => input.validity.valid);
      
      expect(isWeightValid, 'Weight input should be invalid when empty').toBe(false);
      expect(isHeightValid, 'Height input should be invalid when empty').toBe(false);
    });

    // BMI-01 & BMI-02: Calculate & Save
    await test.step('BMI-01 & BMI-02: Calculate BMI & Save Record', async () => {
      await page.getByLabel('Weight (kg)').fill('70');
      await page.getByLabel('Height (cm)').fill('175');
      await page.getByRole('button', { name: 'Calculate' }).click();
      
      // Check inputs cleared (indicating success)
      await expect(page.getByLabel('Weight (kg)')).toHaveValue('');
      
      // Check result card or text. BMI = 70 / (1.75^2) = 22.86
      // We expect "Normal" and "22.86" to be visible
      await expect(page.getByText('Normal').first()).toBeVisible();
      await expect(page.getByText('22.86').first()).toBeVisible();
    });

    // BMI-04: View History
    await test.step('BMI-04: View History', async () => {
      // Check if record exists in table
      const table = page.locator('table');
      await expect(table).toBeVisible();
      
      // Check the first row of body
      const firstRow = table.locator('tbody tr').first();
      await expect(firstRow).toContainText('22.86');
      await expect(firstRow).toContainText('Normal');
      await expect(firstRow).toContainText('70 kg');
    });

    // REP-02: Reports Page & Filter
    await test.step('REP-02: Reports Page & Filter', async () => {
      // Navigate to Reports
      await page.click('text=View MIS Reports');
      await expect(page).toHaveURL(/\/dashboard\/reports/);
      
      // Default should be Daily
      await expect(page.getByText('Daily Trends')).toBeVisible();
      
      // Switch to Weekly
      await page.getByRole('button', { name: 'Weekly' }).click();
      await expect(page.getByText('Weekly Trends')).toBeVisible();
      
      // Switch back to Daily or just verify chart exists
      await expect(page.locator('.recharts-responsive-container')).toBeVisible();
    });

    // AUTH-04: Logout
    await test.step('AUTH-04: Logout', async () => {
        // Go back to dashboard main to access logout if needed
        await page.goto('/dashboard');
        
        // Find logout button (assuming it's 'Sign out')
        await page.getByRole('button', { name: 'Sign out' }).click();
        
        // Verify redirect to login
        await expect(page).toHaveURL(/\/login/);
    });

    // AUTH-05: Protected Route
    await test.step('AUTH-05: Protected Route', async () => {
      // Try to access dashboard while logged out
      await page.goto('/dashboard');
      // Should redirect to login
      await expect(page).toHaveURL(/\/login/);
    });

  });
});
