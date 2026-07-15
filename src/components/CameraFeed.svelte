<script lang="ts">
  import type { BrickPart, ScannedColorInput } from "../services/types";
  import { predictPartFromImage } from "../services/api";
  import { loadColors, resolveColor } from "../services/catalog.svelte";
  import { buildRgbLookup, analyzeDominantColors, sameDominantColors, type RgbLookupEntry } from "../services/colorAnalyzer";

  const ANALYZE_INTERVAL_MS = 1500;
  const FLASH_DURATION_MS = 400;
  const SCAN_FEEDBACK_MS = 2500;
  const CAPTURE_JPEG_QUALITY = 0.85;
  const DEFAULT_COLOR_ID = 15; // Standard White placeholder when no colors were detected yet

  let colorRgbLookup = $state<RgbLookupEntry[]>([]);

  // loadColors never rejects (it falls back to the built-in palette internally)
  loadColors().then((colors) => {
    colorRgbLookup = buildRgbLookup(colors);
  });

  // --- PROPS (Svelte 5 Runes) ---
  interface Props {
    scannedColors: ScannedColorInput[];
    onPartIdentified: (part: BrickPart) => void;
  }
  let {
    scannedColors = $bindable(),
    onPartIdentified
  }: Props = $props();

  // --- STATE ---
  let videoElement = $state<HTMLVideoElement | null>(null);
  let canvasElement = $state<HTMLCanvasElement | null>(null);
  let streamActive = $state<boolean>(false);
  let cameraError = $state<string | null>(null);
  let isFrozen = $state<boolean>(false);
  let showFlash = $state<boolean>(false);
  let tapPosition = $state<{ x: number; y: number } | null>(null);
  let activeStream = $state<MediaStream | null>(null);
  let isCameraRequested = $state<boolean>(true);
  let scanFeedback = $state<string | null>(null);
  let scanFeedbackTimeout: ReturnType<typeof setTimeout> | null = null;

  const showScanFeedback = (message: string) => {
    scanFeedback = message;
    if (scanFeedbackTimeout) clearTimeout(scanFeedbackTimeout);
    scanFeedbackTimeout = setTimeout(() => {
      scanFeedback = null;
    }, SCAN_FEEDBACK_MS);
  };

  // Start/Stop video stream
  $effect(() => {
    if (!isCameraRequested) {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
        activeStream = null;
      }
      streamActive = false;
      return;
    }

    let activeStreamInstance: MediaStream | null = null;

    async function startCamera() {
      try {
        cameraError = null;
        let stream: MediaStream;

        try {
          // Versuch 1: Rückkamera (optimal für Handys)
          stream = await navigator.mediaDevices.getUserMedia({
            video: { facingMode: "environment" },
            audio: false,
          });
        } catch (envErr) {
          console.warn("Rear camera not available, trying default camera (webcam)...", envErr);
          // Versuch 2: Beliebige Kamera (Laptop-Webcam)
          stream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
          });
        }

        activeStreamInstance = stream;
        activeStream = stream;
        streamActive = true;

        if (videoElement) {
          videoElement.srcObject = stream;
        } else {
          // Fallback falls es beim allerersten Frame noch eine Verzögerung beim Binding gibt
          setTimeout(() => {
            if (videoElement) videoElement.srcObject = stream;
          }, 50);
        }
      } catch (err: any) {
        console.warn("Camera could not be started.", err);
        cameraError = "Enable camera in settings to scan.";
        streamActive = false;
        isCameraRequested = false;
      }
    }

    startCamera();

    return () => {
      if (activeStreamInstance) {
        activeStreamInstance.getTracks().forEach((track) => track.stop());
      }
    };
  });

  // Reset colors if camera is stopped
  $effect(() => {
    if (!streamActive) {
      scannedColors = [];
    }
  });

  // Periodic color extraction from camera if running
  $effect(() => {
    if (!streamActive || isFrozen) return;

    const interval = setInterval(() => {
      if (videoElement && canvasElement) {
        const canvas = canvasElement;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Draw video frame to small offscreen canvas to analyze pixels
        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
        const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);

        const detectedColors = analyzeDominantColors(imgData.data, colorRgbLookup);

        // Only publish a change when the dominant colors actually moved —
        // otherwise every 1.5s tick would trigger a full matching run.
        if (detectedColors.length > 0 && !sameDominantColors(detectedColors, scannedColors)) {
          scannedColors = detectedColors;
        }
      }
    }, ANALYZE_INTERVAL_MS);

    return () => clearInterval(interval);
  });

  // Core capture and classification logic
  const triggerCapture = async (clickX?: number, clickY?: number) => {
    if (isFrozen) return;

    if (clickX !== undefined && clickY !== undefined) {
      tapPosition = { x: clickX, y: clickY };
    } else {
      // Put marker in center of video element or fallback
      const rect = videoElement ? videoElement.getBoundingClientRect() : { width: 320, height: 240 };
      tapPosition = { x: rect.width / 2, y: rect.height / 2 };
    }

    isFrozen = true;
    showFlash = true;

    setTimeout(() => {
      showFlash = false;
    }, FLASH_DURATION_MS);

    if (streamActive && videoElement) {
      // Real classification with the Brickognize API
      try {
        const canvas = document.createElement("canvas");
        canvas.width = videoElement.videoWidth || 640;
        canvas.height = videoElement.videoHeight || 480;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("Could not get 2D context from canvas");

        ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

        canvas.toBlob(async (blob) => {
          if (!blob) {
            isFrozen = false;
            tapPosition = null;
            return;
          }

          try {
            const detectedParts = await predictPartFromImage(blob);
            if (detectedParts.length > 0) {
              const detectedPart = detectedParts[0];
              // Use dominant scanned color or default white
              const primaryColorId = scannedColors.length > 0 ? scannedColors[0].color_id : DEFAULT_COLOR_ID;
              detectedPart.color_id = primaryColorId;

              onPartIdentified(detectedPart);
            } else {
              showScanFeedback("No part recognized — try again closer to the brick.");
            }
          } catch (err) {
            console.error("Error in Brickognize classification:", err);
            showScanFeedback("Scan failed — check your connection and try again.");
          } finally {
            isFrozen = false;
            tapPosition = null;
          }
        }, "image/jpeg", CAPTURE_JPEG_QUALITY);
      } catch (err) {
        console.error("Error during image capture:", err);
        isFrozen = false;
        tapPosition = null;
      }
    } else {
      isFrozen = false;
      tapPosition = null;
    }
  };

  // Tap/click to scan handler
  const handleViewportClick = (e: MouseEvent) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    triggerCapture(x, y);
  };

  // Handle keydown for Spacebar (to trigger scan on desktop webcams)
  const handleKeyDown = (e: KeyboardEvent) => {
    if (!streamActive || isFrozen) return;
    if (e.code === "Space") {
      e.preventDefault(); // Prevent page scrolling
      triggerCapture();
    }
  };
</script>

<svelte:window onkeydown={handleKeyDown} />

<div class="main-content">
  <!-- svelte-ignore a11y_click_events_have_key_events -->
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div class="scanner-viewport" onclick={handleViewportClick} style="cursor: {isFrozen ? 'default' : 'crosshair'}">
    <video
      bind:this={videoElement}
      autoplay
      playsinline
      muted
      class="camera-video {streamActive ? '' : 'hidden'}"
    >
      <track kind="captions" />
    </video>

    {#if !streamActive}
      <div class="camera-fallback-container">
        {#if isCameraRequested && !cameraError}
          <div class="camera-fallback-icon fallback-pulse" style="color: var(--primary)">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
          </div>
          <div class="camera-fallback-title">Connecting...</div>
          <div class="camera-fallback-desc">
            Please allow camera access if prompted by your browser.
          </div>
        {:else}
          <div class="camera-fallback-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/></svg>
          </div>
          {#if cameraError}
            <div class="camera-fallback-title camera-fallback-error">Camera access denied</div>
            <div class="camera-fallback-desc">{cameraError}</div>
          {:else}
            <div class="camera-fallback-title">Ready to scan</div>
            <div class="camera-fallback-desc">
              Tap to start scanning — we'll ask for camera access.
            </div>
          {/if}
          <button class="activate-camera-btn" onclick={() => { isCameraRequested = true; }}>
            Start Camera
          </button>
        {/if}
      </div>
    {/if}

    <!-- Offscreen canvas for analyzing video pixels -->
    <canvas bind:this={canvasElement} width="64" height="80" class="hidden"></canvas>

    <!-- Capture Flash Effect -->
    <div class="flash-effect {showFlash ? 'trigger' : ''}"></div>

    <!-- Scan HUD Overlay -->
    {#if streamActive}
      <div class="scanner-overlay">


        <!-- Persistent amber viewfinder brackets — a target for placing a brick. -->
        <div class="viewfinder {isFrozen ? 'active' : ''}">
          <span class="viewfinder-corner tl"></span>
          <span class="viewfinder-corner tr"></span>
          <span class="viewfinder-corner bl"></span>
          <span class="viewfinder-corner br"></span>
        </div>

        <!-- Tap Marker -->
        {#if tapPosition}
          <div class="tap-marker" style="top: {tapPosition.y}px; left: {tapPosition.x}px;"></div>
        {/if}

        <div class="hud-bottom">
          <div class="hud-hint">
            {#if isFrozen}
              Processing image...
            {:else if scanFeedback}
              {scanFeedback}
            {:else}
              Tap to scan
            {/if}
          </div>
        </div>
      </div>
    {/if}
  </div>

  <!-- Color Profile Bar -->
  <div class="color-profile-panel">
    <div class="color-profile-header">
      <span class="panel-section-title">Dominant Colors</span>
    </div>

    {#if scannedColors.length > 0}
      <div class="color-bars-container">
        {#each scannedColors as sc (sc.color_id)}
          {@const colorInfo = resolveColor(sc.color_id)}
          <div
            class="color-bar"
            style="width: {sc.weight * 100}%; background-color: {colorInfo?.hex || '#777'};"
            title="{colorInfo?.name || 'Unknown'}: {Math.round(sc.weight * 100)}%"
          ></div>
        {/each}
      </div>
      <div class="color-bar-label">
        {#each scannedColors as sc (sc.color_id)}
          {@const colorInfo = resolveColor(sc.color_id)}
          <div class="color-chip-legend" title="{colorInfo?.name || 'Unknown'} · {Math.round(sc.weight * 100)}%">
            <span class="color-dot" style="background-color: {colorInfo?.hex || '#777'}"></span>
            <span class="color-chip-name">{colorInfo?.name}</span>
            <span class="color-chip-percent">{Math.round(sc.weight * 100)}%</span>
          </div>
        {/each}
      </div>
    {:else}
      <div class="color-profile-empty">
        Move camera over bricks to detect colors.
      </div>
    {/if}
  </div>
</div>
