<script lang="ts">
  import CameraFeed from "./components/CameraFeed.svelte";
  import SetRadar from "./components/SetRadar.svelte";
  import DigMode from "./components/DigMode.svelte";
  import PartImage from "./components/PartImage.svelte";
  import { fetchMatchSets } from "./services/api";
  import { loadCatalogIndex, loadCatalogMeta, resolveColor } from "./services/catalog.svelte";
  import type { BrickPart, ScannedColorInput, MatchResult } from "./services/types";

  // --- STATE (Svelte 5 Runes) ---
  let showStartScreen = $state<boolean>(true);
  const SOURCE_REPO_URL = "https://github.com/frank3ling/brick-relic";

  // Real version comes from the generated catalog (REQ-START-002); the constant
  // is only a fallback while meta.json has not loaded.
  let databaseVersion = $state<string>("Rebrickable Catalog");
  loadCatalogMeta().then((meta) => {
    if (meta) databaseVersion = meta.version;
  });

  let scannedColors = $state<ScannedColorInput[]>([]);
  let foundParts = $state<BrickPart[]>([]);
  let selectedSetNum = $state<string | null>(null);
  let matchResults = $state<MatchResult[]>([]);
  let matchError = $state<boolean>(false);

  // Prefetch the catalog during the start-screen idle time so the first match
  // does not pay the full download latency. Errors are ignored here — a failed
  // load resets its cache and the match effect retries with visible feedback.
  loadCatalogIndex().catch(() => {});

  // --- DERIVED STATE / MATCHING ---
  const partKey = (part: BrickPart) => `${part.part_num}_${part.color_id}`;
  let scannedPartKeys = $derived(foundParts.map(partKey));

  let selectedSetMatch = $derived(
    selectedSetNum ? (matchResults.find((res) => res.set_num === selectedSetNum) || null) : null
  );

  // --- EFFECTS ---
  $effect(() => {
    let active = true;
    async function loadMatches() {
      const colorsSnapshot = $state.snapshot(scannedColors);
      const keysSnapshot = $state.snapshot(scannedPartKeys);
      const ensureSetNum = selectedSetNum;

      // Radar bleibt leer, wenn noch nichts gescannt oder erfasst wurde
      if (colorsSnapshot.length === 0 && keysSnapshot.length === 0) {
        if (active) {
          matchResults = [];
          matchError = false;
        }
        return;
      }

      try {
        const data = await fetchMatchSets(colorsSnapshot, keysSnapshot, ensureSetNum);
        if (active) {
          matchResults = data;
          matchError = false;
        }
      } catch (err) {
        console.error("Matching failed:", err);
        if (active) {
          matchResults = [];
          matchError = true;
        }
      }
    }
    loadMatches();
    return () => {
      active = false;
    };
  });

  // --- ACTIONS ---
  const handlePartIdentified = (part: BrickPart) => {
    // Add only if not already scanned
    if (!scannedPartKeys.includes(partKey(part))) {
      foundParts.unshift(part);
    }
  };

  const handleRemovePart = (part: BrickPart) => {
    const index = foundParts.findIndex((p) => partKey(p) === partKey(part));
    if (index !== -1) {
      foundParts.splice(index, 1);
    }
  };

  const handleReset = () => {
    foundParts = [];
    selectedSetNum = null;
    scannedColors = [];
  };
</script>

<div class="app-container">

  {#if showStartScreen}
    <!-- Dedicated Start Screen -->
    <div class="start-screen">
      <div class="start-content-wrapper">
        <div class="start-brand-container">
          <div class="start-logo-wrapper">
            <!-- Excavation brush — "gently unearthing" bricks. -->
            <svg xmlns="http://www.w3.org/2000/svg" class="start-logo" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08"/>
              <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z"/>
            </svg>
          </div>
          <h1 class="start-title">Brick<span>Relic</span></h1>
        </div>
        <p class="start-tagline">
          Identify scattered LEGO® bricks and discover matching sets using color analysis and AI object recognition.
        </p>
        <button class="start-btn" onclick={() => { showStartScreen = false; }}>
          <span>Unearth Relics</span>
          <!-- ArrowRight Icon -->
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
        </button>
      </div>
      <div class="start-footer">
        <div>Database: {databaseVersion}</div>
        <div class="start-footer-credits">
          Open source under AGPL-3.0 — <a href={SOURCE_REPO_URL} target="_blank" rel="noopener noreferrer">source code</a>.
          Catalog data and part images courtesy of <a href="https://rebrickable.com" target="_blank" rel="noopener noreferrer">Rebrickable</a>.
        </div>
        <div class="start-disclaimer">
          Not affiliated with, endorsed, or authorized by the LEGO Group. LEGO® is a trademark of the LEGO Group.
        </div>
      </div>
    </div>
  {:else if selectedSetMatch}
    <!-- Excavation (Dig) Screen -->
    <DigMode
      matchResult={selectedSetMatch}
      onBack={() => { selectedSetNum = null; }}
      onFindPartManually={handlePartIdentified}
      onUnmarkPart={handleRemovePart}
    />
  {:else}
    <!-- Main Search Dashboard -->
    <!-- Header -->
    <header class="app-header">
      <!-- Left: Back Button that resets search progress -->
      <button class="header-back-btn" onclick={() => { handleReset(); showStartScreen = true; }} title="End Search and Return">
        <!-- ArrowLeft Icon -->
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="19" y1="12" x2="5" y2="12"/><polyline points="12 19 5 12 12 5"/></svg>
        <span>Back</span>
      </button>

      <!-- Center: Title -->
      <h1 class="brand-title">Brick<span>Relic</span></h1>

      <!-- Right Spacer (keeps title centered) -->
      <div class="header-actions"></div>
    </header>

    <!-- Main scanner view -->
    <CameraFeed
      bind:scannedColors
      onPartIdentified={handlePartIdentified}
    />

    <!-- Found Parts Shelf -->
    <div class="found-items-container">
      <span class="panel-section-title">Scanned Bricks</span>
      {#if foundParts.length > 0}
        <div class="found-items-list">
          {#each foundParts as part (partKey(part))}
            <div class="found-item-card">
              <PartImage
                src={part.imageUrl}
                alt={part.name}
                wrapperClass="found-item-img-container"
                imgClass="found-item-img"
                colorHex={resolveColor(part.color_id).hex}
                fallbackClass="found-item-color-dot"
              />
              <div class="found-item-info">
                <span class="found-item-name">{part.name}</span>
                <!-- Disambiguate duplicate IDs by color. -->
                <span class="found-item-meta">{part.part_num} · {resolveColor(part.color_id).name}</span>
              </div>
              <button
                class="remove-item-btn"
                onclick={() => handleRemovePart(part)}
                title="Remove"
              >
                ×
              </button>
            </div>
          {/each}
        </div>
      {:else}
        <div class="found-items-empty">
          No bricks scanned yet. Tap the camera viewfinder to capture parts.
        </div>
      {/if}
    </div>

    {#if matchError}
      <div class="match-error-banner">
        The set catalog could not be loaded. Check your connection — matching retries automatically on the next scan.
      </div>
    {/if}

    <!-- Match Radar -->
    <SetRadar
      results={matchResults}
      onSelectSet={(set_num) => {
        selectedSetNum = set_num;
      }}
    />

  {/if}
</div>
