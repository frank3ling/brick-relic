<script lang="ts">
  import PartImage from "./PartImage.svelte";
  import type { MatchResult } from "../services/types";

  // --- PROPS (Svelte 5 Runes) ---
  interface Props {
    results: MatchResult[];
    onSelectSet: (setNum: string) => void;
  }
  let { results, onSelectSet }: Props = $props();
</script>

<div class="radar-panel">
  <div class="radar-header">
    <span class="panel-section-title">
      Relic Radar
    </span>
  </div>

  <div class="radar-list">
    {#each results.slice(0, 3) as res (res.set_num)}
      {@const percent = Math.round(res.combinedScore * 100)}
      <!-- svelte-ignore a11y_click_events_have_key_events -->
      <!-- svelte-ignore a11y_no_static_element_interactions -->
      <div
        class="radar-set-card"
        onclick={() => onSelectSet(res.set_num)}
      >
        <!-- Left: Set Thumbnail -->
        <PartImage
          src={res.imageUrl}
          alt={res.name}
          wrapperClass="radar-set-img-wrapper"
          imgClass="radar-set-img"
        />

        <!-- Center: Set number (first line) & Name (second line) -->
        <div class="radar-set-details">
          <div class="radar-set-num-row">
            <span class="radar-set-number-small">{res.set_num}</span>
          </div>
          <h3 class="radar-set-name-large">{res.name}</h3>
        </div>

        <!-- Right: Probability Match -->
        <div class="radar-set-score-large">
          <span class="radar-score-percent-large">{percent}%</span>
          <span class="radar-score-label-small">Match</span>
        </div>
      </div>
    {:else}
      <div class="radar-empty-state">
        No matching sets found. Scan parts or adjust colour distribution.
      </div>
    {/each}
  </div>
</div>
