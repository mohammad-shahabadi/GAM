import { test, expect } from '@playwright/test';

test('login redirects to /admin, navigates to users, adds a new user, and completes form submission', async ({ page }) => {
  await page.goto('http://localhost:3000/en');

  const emailInput = page.locator('input[type="text"]');
  await emailInput.fill('admin@admin.com');

  const passwordInput = page.locator('input[type="password"]');
  await passwordInput.fill('admin');

  const loginButton = page.locator('button', { hasText: 'Login' });
  await loginButton.click();

  await page.waitForURL('http://localhost:3000/en/admin');
  expect(page.url()).toBe('http://localhost:3000/en/admin');

  const usersNavLink = page.locator('a[href="/en/admin/users"]').first();
  await usersNavLink.click();

  await page.waitForURL('http://localhost:3000/en/admin/users');
  expect(page.url()).toBe('http://localhost:3000/en/admin/users');

  const addUserButton = page.locator('a[href="/en/admin/users/add"]').first();
  await addUserButton.click();

  await page.waitForURL('http://localhost:3000/en/admin/users/add');
  expect(page.url()).toBe('http://localhost:3000/en/admin/users/add');

  await page.locator('input[name="email"]').fill('user@user.com');
  await page.locator('input[name="password"]').fill('12345678abc');
  await page.locator('input[name="first_name"]').fill('reza');
  await page.locator('input[name="last_name"]').fill('nabavi');
  await page.locator('input[name="student_number"]').fill('9765123');

  const submitButton = page.locator('button', { hasText: 'Submit' });
  await submitButton.click();

  await page.waitForURL('http://localhost:3000/en/admin/users');
  expect(page.url()).toBe('http://localhost:3000/en/admin/users');



  const classesNavLink = page.locator('a[href="/en/admin/classes"]').first();
  await classesNavLink.click();

  await page.waitForURL('http://localhost:3000/en/admin/classes');
  expect(page.url()).toBe('http://localhost:3000/en/admin/classes');

  const addClassButton = page.locator('a[href="/en/admin/classes/add"]').first();
  await addClassButton.click();

  await page.waitForURL('http://localhost:3000/en/admin/classes/add');
  expect(page.url()).toBe('http://localhost:3000/en/admin/classes/add');

  await page.locator('input[name="title"]').fill('test1');
  await page.locator('input[name="description"]').fill('test12213');
  await page.locator('input[name="git_path"]').fill('test11');


  const submitButton2 = page.locator('button', { hasText: 'Submit' });
  await submitButton2.click();

  await page.waitForURL('http://localhost:3000/en/admin/classes');
  expect(page.url()).toBe('http://localhost:3000/en/admin/classes');
});
