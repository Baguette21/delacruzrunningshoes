export interface RunningShoe {
  id?: number;
  brand: string;
  name: string;
  description?: string;
  price: number;
  dropHeight?: string;
  weight?: string;
  stabilityType?: StabilityType;
  terrainType?: TerrainType;
  experienceType?: ExperienceType;
  stockQuantity?: number;
  gender?: Gender;
  inStock?: boolean;
  active?: boolean;
  idealFor?: string;
  keyFeatures?: string;
  imageUrl?: string;
  carbonPlated?: boolean;
  mensSizes?: string; // Comma-separated US sizes
  womensSizes?: string; // Comma-separated US sizes
  sizeStockJson?: string; // JSON format: {"MEN_7": 10, "MEN_7.5": 10, "WOMEN_5": 10, ...}
}

export enum StabilityType {
  NEUTRAL = 'NEUTRAL',
  STABILITY = 'STABILITY',
  MOTION_CONTROL = 'MOTION_CONTROL',
  MILD_STABILITY = 'MILD_STABILITY'
}

export enum TerrainType {
  ROAD = 'ROAD',
  TRAIL = 'TRAIL',
  MIXED = 'MIXED'
}

export enum ExperienceType {
  BOUNCY = 'BOUNCY',
  SPRINGY = 'SPRINGY',
  STRUCTURED = 'STRUCTURED'
}

export enum Gender {
  MEN = 'MEN',
  WOMEN = 'WOMEN',
  UNISEX = 'UNISEX'
}

