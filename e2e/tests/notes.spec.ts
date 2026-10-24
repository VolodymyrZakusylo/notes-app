import { test, expect } from "@playwright/test";

test("user can create, edit, and delete a note", async ({ page }) => {
  const originalTitle = `E2E note ${Date.now()}`;
  const updatedTitle = `${originalTitle} updated`;
  const content = "This note was created by a Playwright E2E test.";

  await page.goto("/");

  await page.getByRole("button", { name: /new note/i }).click();

  await page.getByLabel("Title").fill(originalTitle);
  await page.getByLabel("Content").fill(content);

  await page.getByRole("button", { name: /create note/i }).click();

  const note = page.locator("article").filter({ hasText: originalTitle });

  await expect(note).toBeVisible();
  await expect(note).toContainText(content);

  await note
    .getByRole("button", { name: new RegExp(`Edit: ${originalTitle}`) })
    .click();

  await page.getByLabel("Title").fill(updatedTitle);
  await page.getByRole("button", { name: /save changes/i }).click();

  const updatedNote = page.locator("article").filter({ hasText: updatedTitle });

  await expect(updatedNote).toBeVisible();
  await expect(updatedNote).toContainText(content);

  await updatedNote
    .getByRole("button", { name: new RegExp(`Delete: ${updatedTitle}`) })
    .click();

  const dialog = page.getByRole("alertdialog");
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: /delete note/i }).click();

  await expect(
    page.locator("article").filter({ hasText: updatedTitle }),
  ).toHaveCount(0);
});
