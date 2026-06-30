export interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  tags: string[];
  lat: number;
  lng: number;
  imageUrl?: string;
  status: "reported" | "verified" | "in_progress" | "resolved";
  reportedBy: string;
  upvotes: number;
  upvotedBy: string[];
  verifications: number;
  verifiedBy: string[];
  createdAt: string;
  resolvedAt?: string;
  aiSuggestedFix?: string;
  comments: Comment[];
  locationName: string;
  safetyNote?: string;
  city?: string;
}

export interface CityConfig {
  id: string;
  cityName: string;
  stateName: string;
  latMin: number;
  latMax: number;
  lngMin: number;
  lngMax: number;
  landmarks: Array<{ name: string; x: number; y: number }>;
  agencies: {
    roads: { name: string; desc: string };
    water: { name: string; desc: string };
    power: { name: string; desc: string };
  };
  budget: string;
  parks?: Array<{ name: string; x: number; y: number; w: number; h: number }>;
  waterBodies?: Array<{ name: string; x: number; y: number; w: number; h: number; rotate?: number }>;
  roadsList?: Array<{ name: string; x: number; y: number; w: number; h: number; rotate?: number; isPrimary?: boolean; isCircular?: boolean }>;
}

export interface UserProfile {
  username: string;
  points: number;
  level: number;
  reportsSubmitted: number;
  verificationsMade: number;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }>;
}

export interface AIAnalysisResult {
  title: string;
  category: string;
  severity: "low" | "medium" | "high" | "critical";
  tags: string[];
  aiSuggestedFix: string;
  safetyNote: string;
  simulated?: boolean;
}

export interface PredictorHotspot {
  title: string;
  location: string;
  explanation: string;
  remedy: string;
}

export interface VolunteerCampaign {
  title: string;
  description: string;
  targetUnits: string;
  difficulty: string;
}

export interface CivicInsights {
  hotspots: PredictorHotspot[];
  volunteerCampaign: VolunteerCampaign;
  civicBrief: string;
  topArea: string;
  simulated?: boolean;
}
