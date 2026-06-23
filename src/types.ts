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
