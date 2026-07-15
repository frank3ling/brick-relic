import { test, expect, type Page } from "@playwright/test";

// Full user flow against the real generated catalog with a fake camera device.
// Only the Brickognize API is mocked — everything else runs like production.

const SCANNED_PART = {
  id: "3001",
  name: "Brick 2 x 4",
  score: "0.95",
  img_url: "https://cdn.rebrickable.com/media/parts/photos/1/3001-1-large.jpg"
};

async function mockBrickognize(page: Page, items: unknown[] = [SCANNED_PART]) {
  await page.route("https://api.brickognize.com/**", (route) =>
    route.fulfill({ json: { items } })
  );
}

async function enterScanner(page: Page) {
  await page.goto("/");
  await page.getByRole("button", { name: "Unearth Relics" }).click();
  // Fake camera device: wait until the stream is live (video shown, HUD hint visible)
  await expect(page.locator("video.camera-video:not(.hidden)")).toBeVisible({ timeout: 15_000 });
  await expect(page.locator(".hud-hint")).toContainText("Tap to scan");
}

test("start screen shows branding, database version, and legal footer (REQ-START-001/002)", async ({ page }) => {
  await page.goto("/");

  await expect(page.locator(".start-title")).toHaveText("BrickRelic");
  await expect(page.getByRole("button", { name: "Unearth Relics" })).toBeVisible();
  // Database version derived from catalog/meta.json (fallback label is "Rebrickable Catalog")
  await expect(page.locator(".start-footer")).toContainText(/Database: Rebrickable Catalog v\d{4}/);
  await expect(page.locator(".start-disclaimer")).toContainText("LEGO® is a trademark");
  await expect(page.locator(".start-footer-credits")).toContainText("Rebrickable");
  // Camera must NOT be active on the start screen (REQ-SYS-003)
  await expect(page.locator("video")).toHaveCount(0);
});

test("tap-to-scan adds the recognized part to the Found Shelf and populates the radar (REQ-RAD-003/004/005)", async ({ page }) => {
  await mockBrickognize(page);
  await enterScanner(page);

  await page.locator(".scanner-viewport").click({ position: { x: 150, y: 150 } });

  // Recognized part lands on the Found Shelf with its catalogue name
  await expect(page.locator(".found-item-card")).toHaveCount(1, { timeout: 10_000 });
  await expect(page.locator(".found-item-name")).toHaveText("Brick 2 x 4");

  // Set Radar shows at most the top 3 matches once the catalog index is loaded
  await expect(page.locator(".radar-set-card").first()).toBeVisible({ timeout: 20_000 });
  expect(await page.locator(".radar-set-card").count()).toBeLessThanOrEqual(3);
});

test("failed recognition surfaces distinguishable HUD feedback (REQ-SYS-005)", async ({ page }) => {
  await mockBrickognize(page, []); // API answers, but recognizes nothing
  await enterScanner(page);

  await page.locator(".scanner-viewport").click({ position: { x: 150, y: 150 } });
  await expect(page.locator(".hud-hint")).toContainText("No part recognized", { timeout: 10_000 });
  await expect(page.locator(".found-item-card")).toHaveCount(0);
});

test("excavation mode: unearth boosts progress, found badge un-marks, set stays open (REQ-RAD-006/007)", async ({ page }) => {
  await mockBrickognize(page);
  await enterScanner(page);

  // Populate the radar via color analysis of the fake camera stream
  await expect(page.locator(".radar-set-card").first()).toBeVisible({ timeout: 20_000 });
  await page.locator(".radar-set-card").first().click();

  // Dig panel with hero, progress gauge and found-first checklist
  await expect(page.locator(".dig-panel")).toBeVisible();
  await expect(page.locator(".dig-progress-header")).toContainText("Key artifacts unearthed");
  const unearthButtons = page.locator(".btn-action", { hasText: "Unearth" });
  await expect(unearthButtons.first()).toBeVisible({ timeout: 15_000 });

  // Unearth one part → it flips to the green Found state; the set stays open
  // even though the re-match may change the top 3 (FIND-033 regression)
  await unearthButtons.first().click();
  await expect(page.locator(".badge-found").first()).toBeVisible({ timeout: 10_000 });
  await expect(page.locator(".dig-panel")).toBeVisible();

  // Found is a toggle: un-marking returns the part to the missing state
  const foundCount = await page.locator(".badge-found").count();
  await page.locator(".badge-found").first().click();
  await expect(page.locator(".badge-found")).toHaveCount(foundCount - 1, { timeout: 10_000 });
  await expect(page.locator(".dig-panel")).toBeVisible();
});

test("header back button resets all search progress (REQ-START-003)", async ({ page }) => {
  await mockBrickognize(page);
  await enterScanner(page);

  await page.locator(".scanner-viewport").click({ position: { x: 150, y: 150 } });
  await expect(page.locator(".found-item-card")).toHaveCount(1, { timeout: 10_000 });

  await page.locator(".header-back-btn").click();
  await expect(page.getByRole("button", { name: "Unearth Relics" })).toBeVisible();

  // Re-entering shows a clean slate
  await page.getByRole("button", { name: "Unearth Relics" }).click();
  await expect(page.locator(".found-item-card")).toHaveCount(0);
  await expect(page.locator(".found-items-empty")).toBeVisible();
});
