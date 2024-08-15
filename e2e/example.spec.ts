import { test, expect } from '@playwright/test';
import * as path from 'path';

test('map details', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'Map details' })).toBeVisible({ timeout: 10000 });
  await expect(page.getByTestId('map-title-input')).toBeVisible();

  await page.getByTestId('map-title-input').fill('Africa Population');
  await expect(page.locator('h3')).toContainText('Africa Population');
});

test('map type', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByRole('heading', { name: 'What type of map do you want' })).toBeVisible();
  await expect(page.getByText('Choropleth')).toBeVisible();
  await expect(page.getByText('Symbol')).toBeVisible();
  await page.getByTestId('map-type').locator('div').nth(1).click();
  await expect(page.getByRole('heading', { name: 'Select map' })).toBeVisible();
});

test('load data', async ({ page }) => {
  await page.goto('/');

  await page.getByTestId('map-type').locator('div').nth(1).click();
  await page.getByRole('button', { name: 'Continue' }).click();

  const dataFile = path.join(__dirname, 'data/population-africa.csv');
  console.log(dataFile);
  await page.getByTestId('file-input').setInputFiles(dataFile);
  await expect(page.locator('tbody')).toContainText('Ethiopia');
  await expect(page.locator('tbody')).toContainText('Kenya');
});