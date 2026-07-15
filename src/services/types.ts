export interface BrickColor {
  id: number;
  name: string;
  hex: string;
}

export interface BrickPart {
  part_num: string;
  name: string;
  color_id: number;
  rarity_score: number;
  imageUrl: string;
}

export interface ScannedColorInput {
  color_id: number;
  weight: number; // 0.0 bis 1.0 (Anteil im Haufen)
}

export interface MatchResult {
  set_num: string;
  name: string;
  year: string;
  imageUrl: string;
  total_parts: number;
  colorMatchScore: number; // 0.0 bis 1.0
  combinedScore: number; // 0.0 bis 1.0+
  matchedParts: BrickPart[];
  missingParts: BrickPart[];
}

