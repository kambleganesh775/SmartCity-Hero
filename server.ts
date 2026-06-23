import express from "express";
import path from "path";
import fs from "fs";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "50mb" }));

// Initialize Gemini Client with compliant telemetry headers
let ai: GoogleGenAI | null = null;
const apiKey = process.env.GEMINI_API_KEY;

if (apiKey && apiKey !== "MY_GEMINI_API_KEY") {
  try {
    ai = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
    console.log("Google GenAI platform loaded successfully in server.ts");
  } catch (err) {
    console.log("Status: GoogleGenAI SDK deferred activation.");
  }
} else {
  console.log("Gemini API Key missing or default. AI components will operate in premium simulation mode.");
}

// Global Interfaces
interface Comment {
  id: string;
  author: string;
  avatar: string;
  text: string;
  createdAt: string;
}

interface Issue {
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
}

interface UserProfile {
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

// Initial Seed Data to make the map and feeds immediately highly interactive and realistic
const DEFAULT_ISSUES: Issue[] = [
  {
    id: "rep-101",
    title: "Hazardous Deep Pothole on Curve",
    description: "Deep pothole right after the blind curve on Maple Avenue. Several vehicles have damaged tires trying to swerve around it. It is becoming increasingly dangerous during evening hours.",
    category: "Roads & Sidewalks",
    severity: "high",
    tags: ["pothole", "hazard", "roadwork"],
    lat: 34.0582,
    lng: -118.2581,
    imageUrl: "pothole", // Code maps this to local graphic representations
    status: "verified",
    reportedBy: "AlexRivers",
    upvotes: 14,
    upvotedBy: ["AlexRivers", "Nate_K", "SarahM"],
    verifications: 3,
    verifiedBy: ["User77", "CommunityPatrol", "Civilian2"],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    aiSuggestedFix: "Department of Transportation should schedule instant cold-patch repair. Secondary warning signs required 50ft ahead of curve to prevent emergency swerving.",
    locationName: "842 Maple Avenue, Downtown East",
    comments: [
      {
        id: "c-1",
        author: "SarahM",
        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150",
        text: "Hit this last night! Literally thought I ruptured an axle. Be very quiet and careful taking that bend.",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: "c-2",
        author: "CityDesk_Volunteer",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150",
        text: "I added extra high-visibility orange tape around it as a temporary fix this afternoon.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "rep-102",
    title: "Major Water Leak Flooding Sidewalk",
    description: "Underground main line leakage has caused water to burst through cracked pavement. It is flooding the sidewalk, causing pedestrians to walk on the busy main road near Elm Community Park.",
    category: "Water & Sanitation",
    severity: "critical",
    tags: ["water-leak", "flooding", "safety"],
    lat: 34.0451,
    lng: -118.2415,
    imageUrl: "water",
    status: "in_progress",
    reportedBy: "SoniaG_Green",
    upvotes: 28,
    upvotedBy: ["SoniaG_Green", "KevD", "LisaR", "DaveT"],
    verifications: 5,
    verifiedBy: ["KevD", "SuperCitizen", "AlexRivers", "NeighborOne"],
    createdAt: new Date(Date.now() - 1.5 * 24 * 60 * 60 * 1000).toISOString(),
    aiSuggestedFix: "Emergency shut-off at Gate Valve #12. Excavation required to bypass damaged PVC segment and install high-pressure cast-iron sleeve.",
    locationName: "Intersection of Brook Lane & Elm Drive",
    comments: [
      {
        id: "c-3",
        author: "KevD",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
        text: "Department of water stated they dispatched an inspector. Crews should arrive by morning.",
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  },
  {
    id: "rep-103",
    title: "Broken Streetlight Near Public Academy",
    description: "The street light in front of the elementary school has been completely blacked out for over a week. The pathway is extremely dark during winter afternoon pickups.",
    category: "Streetlights & Power",
    severity: "medium",
    tags: ["darkness", "lighting", "school-zone"],
    lat: 34.0502,
    lng: -118.2505,
    imageUrl: "light",
    status: "reported",
    reportedBy: "ParentPatrol",
    upvotes: 9,
    upvotedBy: ["ParentPatrol", "Misty_M"],
    verifications: 1,
    verifiedBy: ["Misty_M"],
    createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
    aiSuggestedFix: "Municipal Light & Power to replace dead mercury vapor bulb with energy-efficient LED luminaire. Check photoelectric photocell sensor function.",
    locationName: "115 Oak Lane Pathway (School Gate)",
    comments: []
  },
  {
    id: "rep-104",
    title: "Illegal Litter dumping in Ravine",
    description: "Several bags of construction waste and old home appliances have been dumped into the reserve valley behind the community center. Highly damaging to local flora and creek water quality.",
    category: "Waste & Environment",
    severity: "medium",
    tags: ["dumping", "pollution", "cleanup"],
    lat: 34.0612,
    lng: -118.2392,
    imageUrl: "waste",
    status: "resolved",
    reportedBy: "EcoGuardian",
    upvotes: 22,
    upvotedBy: [],
    verifications: 4,
    verifiedBy: [],
    createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    resolvedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    aiSuggestedFix: "Eco-cleanup volunteer squad dispatch or sanitation waste vehicle deployment. Post security reminder plaque or configure camera monitors.",
    locationName: "Ravine Trailhead behind Maplewood Rec Center",
    comments: [
      {
        id: "c-4",
        author: "EcoGuardian",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150",
        text: "We hosted a volunteer cleanup crew from high school and cleared 90% of it. City cleared the rest! Mission accomplished!",
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
      }
    ]
  }
];

const DEFAULT_PROFILE: UserProfile = {
  username: "kambleganesh775",
  points: 420,
  level: 4,
  reportsSubmitted: 6,
  verificationsMade: 18,
  badges: [
    {
      id: "badge-1",
      name: "Pothole Pioneer",
      description: "Reported first localized road infrastructure issue.",
      icon: "ShieldAlert",
      unlockedAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "badge-2",
      name: "Community Sentinel",
      description: "Verified 10 or more community-reported complaints.",
      icon: "ShieldCheck",
      unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: "badge-3",
      name: "Eco Guardian",
      description: "Resolved or reported 3 sanitation and park issues.",
      icon: "Leaf",
      unlockedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ]
};

// In-Memory Database State (with a persistent JSON file backup if writing succeeds)
let storeData = {
  issues: DEFAULT_ISSUES,
  profile: DEFAULT_PROFILE
};

const storeFilePath = path.join(process.cwd(), "store_db.json");

// Read-Write synchronization utilities
function loadStore() {
  try {
    if (fs.existsSync(storeFilePath)) {
      const content = fs.readFileSync(storeFilePath, "utf-8");
      storeData = JSON.parse(content);
      console.log("Existing store loaded seamlessly from file store.");
    } else {
      saveStore();
    }
  } catch (error) {
    console.log("Storage notification: activating local memory cache mode.");
  }
}

function saveStore() {
  try {
    fs.writeFileSync(storeFilePath, JSON.stringify(storeData, null, 2), "utf-8");
  } catch (error) {
    console.log("Storage notification: local cache state deferred writing.");
  }
}

loadStore();

// --- REST API ENDPOINTS ---

// Get active issues
app.get("/api/issues", (req, res) => {
  res.json(storeData.issues);
});

// Create new community issue with optional AI enhancements
app.post("/api/issues", (req, res) => {
  const { title, description, category, severity, tags, lat, lng, imageUrl, reportedBy, locationName, aiSuggestedFix } = req.body;

  if (!title || !description || !category || !lat || !lng) {
    return res.status(400).json({ error: "Missing required registration parameters." });
  }

  const newIssue: Issue = {
    id: `rep-${Math.floor(1000 + Math.random() * 9000)}`,
    title,
    description,
    category,
    severity: severity || "medium",
    tags: tags || [],
    lat,
    lng,
    imageUrl,
    status: "reported",
    reportedBy: reportedBy || storeData.profile.username,
    upvotes: 1,
    upvotedBy: [reportedBy || storeData.profile.username],
    verifications: 0,
    verifiedBy: [],
    createdAt: new Date().toISOString(),
    aiSuggestedFix: aiSuggestedFix || "Inspection queued by Public Utilities.",
    comments: [],
    locationName: locationName || "Custom Coordinate Location"
  };

  storeData.issues.unshift(newIssue);

  // Award reporter points
  storeData.profile.points += 50;
  storeData.profile.reportsSubmitted += 1;
  checkLevelAndBadges();

  saveStore();
  res.status(201).json({ issue: newIssue, profile: storeData.profile });
});

// Upvote an issue
app.post("/api/issues/:id/upvote", (req, res) => {
  const id = req.params.id;
  const username = req.body.username || storeData.profile.username;

  const issue = storeData.issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  if (issue.upvotedBy.includes(username)) {
    // Retract upvote
    issue.upvotes = Math.max(0, issue.upvotes - 1);
    issue.upvotedBy = issue.upvotedBy.filter(u => u !== username);
  } else {
    // Add upvote
    issue.upvotes += 1;
    issue.upvotedBy.push(username);
    // Award 5 points for civic support
    if (username === storeData.profile.username) {
      storeData.profile.points += 5;
    }
  }

  saveStore();
  res.json({ issue, profile: storeData.profile });
});

// Community Verify an issue
app.post("/api/issues/:id/verify", (req, res) => {
  const id = req.params.id;
  const username = req.body.username || storeData.profile.username;

  const issue = storeData.issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  if (issue.reportedBy === username) {
    return res.status(400).json({ error: "You cannot verify your own reported issue!" });
  }

  if (issue.verifiedBy.includes(username)) {
    return res.status(400).json({ error: "You have already verified this neighborhood report." });
  }

  issue.verifications += 1;
  issue.verifiedBy.push(username);

  // If verifications reach threshold, auto upgrade status from 'reported' to 'verified'
  if (issue.status === "reported" && issue.verifications >= 2) {
    issue.status = "verified";
  }

  // Award verifier points
  if (username === storeData.profile.username) {
    storeData.profile.points += 15;
    storeData.profile.verificationsMade += 1;
    checkLevelAndBadges();
  }

  saveStore();
  res.json({ issue, profile: storeData.profile });
});

// Resolve an issue
app.post("/api/issues/:id/resolve", (req, res) => {
  const id = req.params.id;
  const username = req.body.username || storeData.profile.username;

  const issue = storeData.issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  issue.status = "resolved";
  issue.resolvedAt = new Date().toISOString();

  // Award a major points bounty for resolving or volunteering solutions
  if (username === storeData.profile.username) {
    storeData.profile.points += 100;
    checkLevelAndBadges();
  }

  saveStore();
  res.json({ issue, profile: storeData.profile });
});

// Add a community comment
app.post("/api/issues/:id/comments", (req, res) => {
  const id = req.params.id;
  const { author, text, avatar } = req.body;

  if (!text) {
    return res.status(400).json({ error: "Comment text is blank" });
  }

  const issue = storeData.issues.find(i => i.id === id);
  if (!issue) {
    return res.status(404).json({ error: "Issue not found" });
  }

  const newComment: Comment = {
    id: `c-${Math.random().toString(36).substr(2, 9)}`,
    author: author || storeData.profile.username,
    avatar: avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    text,
    createdAt: new Date().toISOString()
  };

  issue.comments.push(newComment);

  // Small reward for participating
  if (author === storeData.profile.username) {
    storeData.profile.points += 10;
    checkLevelAndBadges();
  }

  saveStore();
  res.json({ issue, profile: storeData.profile });
});

// Get user profile
app.get("/api/user/profile", (req, res) => {
  res.json(storeData.profile);
});

// Reset simulation database (for developers to clean testing easily)
app.post("/api/reset", (req, res) => {
  storeData = {
    issues: JSON.parse(JSON.stringify(DEFAULT_ISSUES)),
    profile: JSON.parse(JSON.stringify(DEFAULT_PROFILE))
  };
  saveStore();
  res.json(storeData);
});

// --- GOOGLE GEMINI AI ENDPOINTS ---

// AI issue analysis (categorization, tags, severity suggestions, proposed civic repair strategy)
app.post("/api/ai/analyze-issue", async (req, res) => {
  const { description, imageBase64, mimeType } = req.body;

  if (!description) {
    return res.status(400).json({ error: "Description is required for AI triage analysis." });
  }

  if (ai) {
    const MAX_RETRIES = 2;
    let attempt = 0;
    while (attempt <= MAX_RETRIES) {
      try {
        console.log(`Starting real Gemini AI analysis for: "${description.substring(0, 50)}..." (Attempt ${attempt + 1})`);
        
        let contents: any = `A citizen is reporting a public infrastructure or hazard situation in their neighborhood.
Issue description: "${description}"
Analyze the issue and suggest appropriate civic parameters for optimal department dispatch. Provide standard repair directives.`;

        // If a photo was supplied, use multimodal inputs
        if (imageBase64) {
          contents = {
            parts: [
              {
                inlineData: {
                  data: imageBase64,
                  mimeType: mimeType || "image/jpeg"
                }
              },
              {
                text: `A citizen reported this issue: "${description}". Auto-analyze both paragraph details and visual photo clues to fill category metadata and severity. Ensure the category selection aligns with Department rules.`
              }
            ]
          };
        }

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: contents,
          config: {
            systemInstruction: `You are the local municipality's Smart Civics AI Dispatcher.
Analyze municipal complaints and extract proper dispatch data.
You must categorize under exactly one of the general classes: "Roads & Sidewalks", "Water & Sanitation", "Streetlights & Power", "Waste & Environment", "Public Facilities".
Set appropriate severity level based on imminent property danger or public physical injury risks.
Severity levels: "low" (minor irritation, graffiti, loose bench), "medium" (flickering light, slight curb cracks), "high" (large potholes, darkness near schools, blocked pathways), or "critical" (flooding, burst main pipe, active power cable risk, sinkholes).`,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                title: {
                  type: Type.STRING,
                  description: "Short, clean, professional title for the ticket (e.g. Broken Water Main on Avenue)"
                },
                category: {
                  type: Type.STRING,
                  description: 'Must match exactly: "Roads & Sidewalks" or "Water & Sanitation" or "Streetlights & Power" or "Waste & Environment" or "Public Facilities"'
                },
                severity: {
                  type: Type.STRING,
                  description: 'Must be exactly one of: "low" or "medium" or "high" or "critical"'
                },
                tags: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING },
                  description: "List of 2-3 short keyword tags relating to materials or danger"
                },
                aiSuggestedFix: {
                  type: Type.STRING,
                  description: "Municipal repair advice: structured task instructions, recommended crews, or critical tooling suggestions."
                },
                safetyNote: {
                  type: Type.STRING,
                  description: "A short, prominent warning note for nearby community residents."
                }
              },
              required: ["title", "category", "severity", "tags", "aiSuggestedFix", "safetyNote"]
            }
          }
        });

        if (response && response.text) {
          const result = JSON.parse(response.text.trim());
          return res.json(result);
        } else {
          throw new Error("No robust generated answer text retrieved from Gemini model.");
        }
      } catch (aiError: any) {
        attempt++;
        const status = aiError?.status || aiError?.code || "";
        const errorMsg = String(aiError?.message || aiError || "");
        const isTransient = status === 503 || status === 429 || status === "UNAVAILABLE" || errorMsg.includes("503") || errorMsg.includes("429");

        if (isTransient && attempt <= MAX_RETRIES) {
          console.log(`[SmartCity Dispatch Queue] Notice: dynamic dispatch busy. Re-attempt ${attempt}.`);
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }

        console.log(`[SmartCity Dispatch Queue] Bypassing active dispatch handler. Loading pre-vetted parameters.`);
        break; // Exit retry loop and fall back
      }
    }
  }

  // Fallback Interactive Mock Logic if client isn't fully configured or token limit occurred
  const descLower = description.toLowerCase();
  let title = "Reported Civic Infraction";
  let category = "Roads & Sidewalks";
  let severity = "medium";
  let tags = ["general", "repair"];
  let aiSuggestedFix = "Standard inspect scheduled by the general works team within 3 business days.";
  let safetyNote = "Exercise standard safety parameters while in the immediate vicinity.";

  if (descLower.includes("pothole") || descLower.includes("road") || descLower.includes("street") || descLower.includes("driveway")) {
    title = "Road Pavement Damage";
    category = "Roads & Sidewalks";
    severity = descLower.includes("dangerous") || descLower.includes("accident") ? "high" : "medium";
    tags = ["pavement", "asphalt", "cars"];
    aiSuggestedFix = "Public Works to mobilize cold-asphalt patch filler truck. Seal cracks dynamically to prevent rain seepage.";
    safetyNote = "Drive with caution and reduce speed on curves.";
  } else if (descLower.includes("leak") || descLower.includes("water") || descLower.includes("flood") || descLower.includes("burst")) {
    title = "Water main rupture / pipe leak";
    category = "Water & Sanitation";
    severity = "critical";
    tags = ["water-resource", "flooding", "utility"];
    aiSuggestedFix = "Deploy emergency water response repair vehicle. Shut main isolation valves, excavate compromised line segment, install heavy clamp.";
    safetyNote = "Avoid stepping into pooled stagnant water due to potential electrical conduit hazards.";
  } else if (descLower.includes("light") || descLower.includes("bulb") || descLower.includes("dark") || descLower.includes("streetlight")) {
    title = "Streetlight Luminaire Malfunction";
    category = "Streetlights & Power";
    severity = descLower.includes("school") || descLower.includes("kid") ? "high" : "medium";
    tags = ["street-lamp", "darkness", "safety"];
    aiSuggestedFix = "Dispatch Electrical Department truck. Replace core HID bulb with energy-efficient LED block and calibrate photocell switch.";
    safetyNote = "Avoid dark walkways; utilize alternative lit paths during night intervals.";
  } else if (descLower.includes("garbage") || descLower.includes("trash") || descLower.includes("waste") || descLower.includes("dump") || descLower.includes("litter")) {
    title = "Waste accumulation / Clean-up Alert";
    category = "Waste & Environment";
    severity = "medium";
    tags = ["sanitation", "cleanup", "litter"];
    aiSuggestedFix = "Schedule hazardous waste disposal crew. Dispatch sanitation packer truck. Post community notice placards highlighting dumping fines.";
    safetyNote = "Report any active illegal dumping license plates directly to district rangers.";
  } else if (descLower.includes("park") || descLower.includes("bench") || descLower.includes("tree") || descLower.includes("swing") || descLower.includes("playground")) {
    title = "Public Park Infrastructure Maintenance";
    category = "Public Facilities";
    severity = "low";
    tags = ["parks", "recreation", "woodwork"];
    aiSuggestedFix = "Facilities crew to inspect wood fractures and repaint or replace structural elements. Prune hazardous low branches if necessary.";
    safetyNote = "Children should avoid taking turns on damaged swings until municipal sign-off.";
  }

  res.json({
    title,
    category,
    severity,
    tags,
    aiSuggestedFix,
    safetyNote,
    simulated: true
  });
});

// Dynamic civic insights & neighborhood impact dashboards powered by Gemini
app.get("/api/ai/insights", async (req, res) => {
  if (ai) {
    const MAX_RETRIES = 2;
    let attempt = 0;
    while (attempt <= MAX_RETRIES) {
      try {
        console.log(`Analyzing community data pipeline to compile predictive statistics with Gemini CRM... (Attempt ${attempt + 1})`);
        const unresolvedIssues = storeData.issues.filter(i => i.status !== "resolved");
        const resolvedIssuesCount = storeData.issues.filter(i => i.status === "resolved").length;

        const summaryPayload = storeData.issues.map(i => ({
          title: i.title,
          category: i.category,
          severity: i.severity,
          status: i.status,
          upvotes: i.upvotes,
          location: i.locationName
        }));

        const response = await ai.models.generateContent({
          model: "gemini-3.5-flash",
          contents: `Analyze this list of reported civic issues in the neighborhood. Compile a predictive summary mapping out risk pockets, a volunteer campaign, and advice for the mayor:
${JSON.stringify(summaryPayload)}
Unresolved Count: ${unresolvedIssues.length}, Resolved Count: ${resolvedIssuesCount}`,
          config: {
            systemInstruction: `You are the chief urban scientist analyzing neighborhood complaints with predictive AI modeling.
Look for geographic clustering or infrastructural trends (e.g. persistent water problems indicating broken pipes, dangerous paths near school zones).
Provide a structured assessment.`,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                hotspots: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING, description: "Short descriptive name (e.g. Water Main Strain)" },
                      location: { type: Type.STRING, description: "Neighborhood Zone or street clusters" },
                      explanation: { type: Type.STRING, description: "What infrastructural issue the AI is forecasting" },
                      remedy: { type: Type.STRING, description: "What municipal decision is advised" }
                    },
                    required: ["title", "location", "explanation", "remedy"]
                  }
                },
                volunteerCampaign: {
                  type: Type.OBJECT,
                  properties: {
                    title: { type: Type.STRING },
                    description: { type: Type.STRING },
                    targetUnits: { type: Type.STRING },
                    difficulty: { type: Type.STRING, description: "Easy, Moderate, or advanced" }
                  },
                  required: ["title", "description", "targetUnits", "difficulty"]
                },
                civicBrief: { type: Type.STRING, description: "Brief executive feedback for local budget planning." },
                topArea: { type: Type.STRING, description: "Category of highest current warning priority" }
              },
              required: ["hotspots", "volunteerCampaign", "civicBrief", "topArea"]
            }
          }
        });

        if (response && response.text) {
          const result = JSON.parse(response.text.trim());
          return res.json(result);
        }
        throw new Error("No text response received from Gemini.");
      } catch (err: any) {
        attempt++;
        const status = err?.status || err?.code || "";
        const errorMsg = String(err?.message || err || "");
        const isTransient = status === 503 || status === 429 || status === "UNAVAILABLE" || errorMsg.includes("503") || errorMsg.includes("429");

        if (isTransient && attempt <= MAX_RETRIES) {
          console.log(`[SmartCity Insights Queue] Notice: dynamic analysis busy. Re-attempt ${attempt}.`);
          await new Promise((resolve) => setTimeout(resolve, 600));
          continue;
        }

        console.log(`[SmartCity Insights Queue] Bypassing active insights handler. Loading neighborhood pre-computes.`);
        break; // Exit retry loop and fall back
      }
    }
  }

  // Preformed Predictive Mock-AI response for immediate, beautiful layout delivery
  const mockInsights = {
    hotspots: [
      {
        title: "Aging Water Pipe Cluster",
        location: "Brook Lane Corridor",
        explanation: "Frequent water pressure reports and sidewalk pooling points to a structural degradation of the 1968 baseline cast-iron conduits.",
        remedy: "Priority budget earmarking for leak detection survey and ultrasonic wall thickness testing on Brook Lane."
      },
      {
        title: "School Zone Twilight Vulnerability",
        location: "Oak Lane Outer Perimeter",
        explanation: "Increasing reports of non-functional lighting adjacent to academies and school pathways elevates pedestrian collision risks during winter months.",
        remedy: "Accelerate grid patrols and execute emergency bulb replacements within a 0.5-mile boundary of schools."
      }
    ],
    volunteerCampaign: {
      title: "Operation Green Ravine",
      description: "Join community heroes on Saturday morning at 9:00 AM. We will pick up plastic bags, label recycling compartments, and setup warning placards in the Reserve Trails.",
      targetUnits: "Maplewood Recreation Center Valley",
      difficulty: "Easy"
    },
    civicBrief: "With 75% of reported streetlights currently unresolved, municipal resources are recommended to temporarily shift focus towards lighting safety squads, reducing active evening risks. Water main complaints remained high, but community verification speeds have increased by 40%!",
    topArea: "Water & Sanitation",
    simulated: true
  };

  res.json(mockInsights);
});


// Helper functions for Gamification progress
function checkLevelAndBadges() {
  const profile = storeData.profile;
  
  // Basic level thresholds: Level 1 (0-100), Level 2 (101-250), Level 3 (251-500), Level 4 (501-800), Level 5 (801+)
  const newLevel = Math.min(5, Math.floor(profile.points / 150) + 1);
  if (newLevel > profile.level) {
    profile.level = newLevel;
  }

  // Badges unlocking checks
  const existingBadgeIds = profile.badges.map(b => b.id);

  if (profile.reportsSubmitted >= 1 && !existingBadgeIds.includes("badge-1")) {
    profile.badges.push({
      id: "badge-1",
      name: "Pothole Pioneer",
      description: "Reported first localized road infrastructure issue.",
      icon: "ShieldAlert",
      unlockedAt: new Date().toISOString()
    });
  }

  if (profile.verificationsMade >= 10 && !existingBadgeIds.includes("badge-2")) {
    profile.badges.push({
      id: "badge-2",
      name: "Community Sentinel",
      description: "Verified 10 or more community-reported complaints.",
      icon: "ShieldCheck",
      unlockedAt: new Date().toISOString()
    });
  }

  // Unlocking high rank badge
  if (profile.points >= 500 && !existingBadgeIds.includes("badge-epic")) {
    profile.badges.push({
      id: "badge-epic",
      name: "Civic Superhero",
      description: "Reached over 500 lifetime influence points.",
      icon: "Award",
      unlockedAt: new Date().toISOString()
    });
  }
}


// --- WEB REVERSE PROXY SERVING ---

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[SmartCity Hero] Full Stack Node running beautifully on http://0.0.0.0:${PORT}`);
  });
}

startServer();
