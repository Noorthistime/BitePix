import { expect, test } from '@playwright/test';

const tinyPng = Buffer.from(
  'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR4nGNgYGD4DwABBAEAH4h2WQAAAABJRU5ErkJggg==',
  'base64'
);

test('uploads, converts, and prepares an image download', async ({ page }) => {
  await page.goto('/');

  await page.getByLabel('Upload image').setInputFiles({
    name: 'tiny.png',
    mimeType: 'image/png',
    buffer: tinyPng,
  });

  await expect(page.getByText('tiny.png')).toBeVisible();

  await page.getByRole('button', { name: 'Convert image' }).click();

  const downloadLink = page.getByRole('link', { name: 'Download converted image' });
  await expect(downloadLink).toBeVisible();
  await expect(downloadLink).toHaveAttribute('download', 'converted_tiny.webp');
});
