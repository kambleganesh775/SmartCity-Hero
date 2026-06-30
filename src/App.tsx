import React, { useState, useEffect, useRef } from "react";
import {
  MapPin,
  AlertTriangle,
  Flame,
  CheckCircle,
  Clock,
  Sparkles,
  Award,
  ShieldCheck,
  ShieldAlert,
  MessageSquare,
  ThumbsUp,
  Plus,
  RefreshCw,
  Droplet,
  Lightbulb,
  Trash,
  Info,
  Calendar,
  X,
  User,
  Filter,
  Check,
  Zap,
  Volume2,
  Camera,
  Activity,
  Heart,
  ZoomIn,
  ZoomOut,
  Search,
  Compass,
  Layers,
  ChevronUp,
  ChevronDown
} from "lucide-react";
import { motion } from "motion/react";
import { Issue, UserProfile, CivicInsights, AIAnalysisResult, CityConfig } from "./types";

const DEFAULT_CITIES: CityConfig[] = [
  {
    id: "bengaluru",
    cityName: "Bengaluru",
    stateName: "Karnataka",
    latMin: 12.9500,
    latMax: 12.9900,
    lngMin: 77.5600,
    lngMax: 77.6300,
    landmarks: [
      { name: "Cubbon Park Botanical Zone", x: 18, y: 12 },
      { name: "Koramangala Community Playgrounds", x: 75, y: 85 },
      { name: "MG Road Metro Corridor", x: 75, y: 50 }
    ],
    agencies: {
      roads: { name: "BBMP Road Maintenance Cell", desc: "Primary responder: Roads, Potholes, Sidewalk concrete cracking" },
      water: { name: "BWSSB Water & Sewerage Division", desc: "Primary responder: Water main breaks, sewer overflow, stormwater drainage" },
      power: { name: "BESCOM Electrical Grid Solutions", desc: "Primary responder: Damaged street lights, transformer noise, public power boxes" }
    },
    budget: "₹4.5 Crores",
    parks: [
      { name: "Cubbon Park", x: 22, y: 20, w: 25, h: 22 },
      { name: "Koramangala Club Ground", x: 75, y: 78, w: 15, h: 12 }
    ],
    waterBodies: [
      { name: "Ulsoor Lake", x: 55, y: 35, w: 22, h: 18, rotate: 12 }
    ],
    roadsList: [
      { name: "MG Road Corridor", x: 50, y: 50, w: 100, h: 2, rotate: -3, isPrimary: true },
      { name: "100 Feet Road", x: 65, y: 65, w: 2, h: 45, rotate: -15, isPrimary: false },
      { name: "Outer Ring Road segment", x: 82, y: 50, w: 2.5, h: 100, rotate: 5, isPrimary: true }
    ]
  },
  {
    id: "mumbai",
    cityName: "Mumbai",
    stateName: "Maharashtra",
    latMin: 18.9100,
    latMax: 18.9600,
    lngMin: 72.8000,
    lngMax: 72.8600,
    landmarks: [
      { name: "Marine Drive Promenade", x: 20, y: 80 },
      { name: "Chhatrapati Shivaji Terminus", x: 65, y: 40 },
      { name: "Gateway of India Plaza", x: 80, y: 90 }
    ],
    agencies: {
      roads: { name: "BMC Road & Traffic Department", desc: "Primary responder: Asphalt resurfacing, pothole filling, lane marking" },
      water: { name: "BMC Hydraulic Engineering Division", desc: "Primary responder: Potable supply lines, water contamination, valve repairs" },
      power: { name: "BEST Electricity Board", desc: "Primary responder: Street lamp replacement, transformer maintenance" }
    },
    budget: "₹12.8 Crores",
    parks: [
      { name: "Sanjay Gandhi Eco-belt", x: 45, y: 15, w: 32, h: 14 }
    ],
    waterBodies: [
      { name: "Back Bay Sea Outfall", x: 15, y: 85, w: 35, h: 28, rotate: -10 },
      { name: "Arabian Sea Inlet", x: 5, y: 45, w: 20, h: 70 }
    ],
    roadsList: [
      { name: "Marine Drive Bypass", x: 18, y: 70, w: 2, h: 55, rotate: 15, isPrimary: true },
      { name: "Colaba Causeway Main", x: 65, y: 55, w: 2, h: 75, rotate: -25, isPrimary: true },
      { name: "Netaji Subhash Highway", x: 50, y: 78, w: 100, h: 2.5, rotate: -4, isPrimary: true }
    ]
  },
  {
    id: "delhi",
    cityName: "New Delhi",
    stateName: "Delhi NCR",
    latMin: 28.5900,
    latMax: 28.6500,
    lngMin: 77.1900,
    lngMax: 77.2500,
    landmarks: [
      { name: "Connaught Place Circle", x: 50, y: 30 },
      { name: "India Gate Central Lawns", x: 70, y: 65 },
      { name: "Rajpath Boulevard Area", x: 35, y: 80 }
    ],
    agencies: {
      roads: { name: "MCD Public Works Department", desc: "Primary responder: Urban bypass roads, sidewalks, flyover repairs" },
      water: { name: "Delhi Jal Board (DJB)", desc: "Primary responder: Yamuna supply canals, household sewerage, water supply leaks" },
      power: { name: "TPDDL / BSES Power Grid", desc: "Primary responder: High tension wires, overhead cable bundling, dark streetlights" }
    },
    budget: "₹9.5 Crores",
    parks: [
      { name: "India Gate Boulevard Lawns", x: 55, y: 60, w: 30, h: 28 },
      { name: "Lodhi Historic Gardens", x: 20, y: 72, w: 18, h: 22 }
    ],
    waterBodies: [
      { name: "Yamuna Canal Feed", x: 88, y: 50, w: 12, h: 100, rotate: -5 }
    ],
    roadsList: [
      { name: "Rajpath Central Boulevard", x: 50, y: 55, w: 100, h: 3, rotate: 0, isPrimary: true },
      { name: "Connaught Place Ring", x: 50, y: 30, w: 28, h: 28, isCircular: true, isPrimary: true },
      { name: "Barakhamba Road Express", x: 68, y: 22, w: 2.5, h: 45, rotate: 40, isPrimary: false }
    ]
  },
  {
    id: "chennai",
    cityName: "Chennai",
    stateName: "Tamil Nadu",
    latMin: 13.0200,
    latMax: 13.0800,
    lngMin: 80.2100,
    lngMax: 80.2900,
    landmarks: [
      { name: "Marina Beach Promenade", x: 85, y: 50 },
      { name: "T. Nagar Shopping District", x: 30, y: 70 },
      { name: "Guindy National Park Edge", x: 15, y: 25 }
    ],
    agencies: {
      roads: { name: "GCC Stormwater & Roads Wing", desc: "Primary responder: Pavement leveling, concrete roads, stormwater drain filters" },
      water: { name: "CMWSSB Metro Water Board", desc: "Primary responder: Seawater desalination feeds, canal overflows, pipe repairs" },
      power: { name: "TANGEDCO Electrical Utility", desc: "Primary responder: Street lamp fixtures, phase failures, grid repairs" }
    },
    budget: "₹5.2 Crores",
    parks: [
      { name: "Guindy Forest Reserve", x: 15, y: 22, w: 24, h: 22 }
    ],
    waterBodies: [
      { name: "Bay of Bengal Shoreline", x: 88, y: 50, w: 18, h: 100 },
      { name: "Adyar River Estuary", x: 45, y: 62, w: 100, h: 10, rotate: -12 }
    ],
    roadsList: [
      { name: "Marina Beach Loop Rd", x: 79, y: 50, w: 2, h: 100, rotate: 1, isPrimary: true },
      { name: "Mount Road Expressway", x: 40, y: 45, w: 100, h: 3, rotate: -25, isPrimary: true },
      { name: "Usman Commercial Road", x: 28, y: 65, w: 2, h: 42, rotate: 8, isPrimary: false }
    ]
  },
  {
    id: "hyderabad",
    cityName: "Hyderabad",
    stateName: "Telangana",
    latMin: 17.3400,
    latMax: 17.4500,
    lngMin: 78.3600,
    lngMax: 78.4900,
    landmarks: [
      { name: "Charminar Heritage Circle", x: 50, y: 85 },
      { name: "Hussain Sagar Lake Walkway", x: 45, y: 25 },
      { name: "HITEC City Tech Corridor", x: 10, y: 40 }
    ],
    agencies: {
      roads: { name: "GHMC Engineering Division", desc: "Primary responder: Concrete road corridors, pedestrian underpasses" },
      water: { name: "HMWSSB Water Supply Division", desc: "Primary responder: Krishna & Godavari feeds, residential valve leakage" },
      power: { name: "TSSPDCL Power Distribution", desc: "Primary responder: Distribution box sealing, smart streetlight replacements" }
    },
    budget: "₹6.1 Crores",
    parks: [
      { name: "KBR National Sanctuary", x: 18, y: 36, w: 22, h: 20 }
    ],
    waterBodies: [
      { name: "Hussain Sagar Lake", x: 44, y: 24, w: 26, h: 22, rotate: -5 }
    ],
    roadsList: [
      { name: "NH65 Highway Corridor", x: 50, y: 62, w: 100, h: 3, rotate: -6, isPrimary: true },
      { name: "Inner Ring Expressway", x: 50, y: 50, w: 68, h: 68, isCircular: true, isPrimary: true },
      { name: "HITEC Main Tech Road", x: 14, y: 32, w: 2, h: 48, rotate: 10, isPrimary: false }
    ]
  },
  {
    id: "kolkata",
    cityName: "Kolkata",
    stateName: "West Bengal",
    latMin: 22.5200,
    latMax: 22.5900,
    lngMin: 88.3200,
    lngMax: 88.3800,
    landmarks: [
      { name: "Victoria Memorial Gardens", x: 40, y: 65 },
      { name: "Howrah Bridge Junction", x: 45, y: 15 },
      { name: "Park Street Boulevard", x: 65, y: 50 }
    ],
    agencies: {
      roads: { name: "KMC Civil Engineering Dept", desc: "Primary responder: Road grading, heritage paving repair, cobblestones" },
      water: { name: "KMC Water Supply Department", desc: "Primary responder: Hooghly river filtration conduits, localized pipe leakage" },
      power: { name: "CESC Electrical Supply", desc: "Primary responder: Overhead cabling, streetlamp restoration, box safety" }
    },
    budget: "₹4.2 Crores",
    parks: [
      { name: "Kolkata Maidan Greenery", x: 30, y: 54, w: 26, h: 32 }
    ],
    waterBodies: [
      { name: "Hooghly River Canal", x: 10, y: 50, w: 16, h: 100, rotate: 3 }
    ],
    roadsList: [
      { name: "Howrah Bridge Approach", x: 25, y: 18, w: 55, h: 3, rotate: 14, isPrimary: true },
      { name: "Park Street Boulevard", x: 55, y: 52, w: 75, h: 2, rotate: -1, isPrimary: true },
      { name: "AJC Bose Flyover Link", x: 48, y: 72, w: 90, h: 2, rotate: -12, isPrimary: false }
    ]
  }
];

export default function App() {
  // Application State
  const [issues, setIssues] = useState<Issue[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [insights, setInsights] = useState<CivicInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [loadingIssues, setLoadingIssues] = useState<boolean>(false);

  // Dynamic Cities Config & active state
  const [cities, setCities] = useState<CityConfig[]>(DEFAULT_CITIES);
  const [selectedCityId, setSelectedCityId] = useState<string>("bengaluru");
  const activeCity = cities.find(c => c.id === selectedCityId) || DEFAULT_CITIES[0];

  // Map limits derived dynamically
  const MAP_LAT_MIN = activeCity.latMin;
  const MAP_LAT_MAX = activeCity.latMax;
  const MAP_LNG_MIN = activeCity.lngMin;
  const MAP_LNG_MAX = activeCity.lngMax;

  // Authentication Switcher State
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [availableCitizens, setAvailableCitizens] = useState<UserProfile[]>([]);
  const [loginInputUsername, setLoginInputUsername] = useState<string>("");
  const [authError, setAuthError] = useState<string | null>(null);
  
  // UI Controls
  const [selectedIssueId, setSelectedIssueId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"live" | "heatmap" | "insights" | "governance">("live");
  const [isReportOpen, setIsReportOpen] = useState<boolean>(false);
  const [categoryFilter, setCategoryFilter] = useState<string>("All");
  const [severityFilter, setSeverityFilter] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"recent" | "upvotes">("recent");

  // New Issue Form Inputs
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newCategory, setNewCategory] = useState("Roads & Sidewalks");
  const [newSeverity, setNewSeverity] = useState<"low" | "medium" | "high" | "critical">("medium");
  const [newLat, setNewLat] = useState<number>(12.97);
  const [newLng, setNewLng] = useState<number>(77.59);
  const [newLocationName, setNewLocationName] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);
  const [dragActive, setDragActive] = useState(false);

  // Comments State
  const [commentText, setCommentText] = useState("");

  // Map Simulation Coordinates and Interaction
  const mapContainerRef = useRef<HTMLDivElement>(null);

  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  // Interactive Map Enhancements States
  const [zoomScale, setZoomScale] = useState<number>(1.0);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState<number>(0);
  const [dragMode, setDragMode] = useState<"pan" | "rotate">("pan");
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [hasDragged, setHasDragged] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [mapStyle, setMapStyle] = useState<"grid" | "satellite">("grid");
  const [isLegendExpanded, setIsLegendExpanded] = useState<boolean>(false);
  const [searchFocused, setSearchFocused] = useState<boolean>(false);
  const [showParks, setShowParks] = useState<boolean>(true);
  const [showWater, setShowWater] = useState<boolean>(true);
  const [showRoads, setShowRoads] = useState<boolean>(true);
  const [showLandmarks, setShowLandmarks] = useState<boolean>(true);
  const [isLayersOpen, setIsLayersOpen] = useState<boolean>(false);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch static endpoints
  useEffect(() => {
    const init = async () => {
      try {
        const res = await fetch("/api/cities");
        if (res.ok) {
          const data = await res.json();
          setCities(data);
        }
      } catch (err) {
        console.error("Failed to fetch cities config", err);
      }
      fetchProfile();
      fetchCitizens();
    };
    init();
  }, []);

  // Update dynamic coords and refetch issues/insights on selectedCityId change
  useEffect(() => {
    if (activeCity) {
      setNewLat(parseFloat(((activeCity.latMin + activeCity.latMax) / 2).toFixed(5)));
      setNewLng(parseFloat(((activeCity.lngMin + activeCity.lngMax) / 2).toFixed(5)));
    }
    fetchIssues(selectedCityId);
    fetchInsights(selectedCityId);
  }, [selectedCityId]);

  const fetchIssues = async (cityId: string = selectedCityId) => {
    setLoadingIssues(true);
    try {
      const res = await fetch(`/api/issues?city=${cityId}`);
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
        // Default to first issue if none selected
        if (data.length > 0) {
          setSelectedIssueId(data[0].id);
        } else {
          setSelectedIssueId(null);
        }
      } else {
        triggerToast("Failed to sync neighborhood reports", "error");
      }
    } catch (err) {
      console.error(err);
      triggerToast("Network link sluggish. Reconnecting...", "info");
    } finally {
      setLoadingIssues(false);
    }
  };

  const fetchProfile = async () => {
    try {
      const res = await fetch("/api/user/profile");
      if (res.ok) {
        const data = await res.json();
        setProfile(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCitizens = async () => {
    try {
      const res = await fetch("/api/users");
      if (res.ok) {
        const data = await res.json();
        setAvailableCitizens(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleSwitchLogin = async (usernameToLogin: string) => {
    if (!usernameToLogin.trim()) {
      setAuthError("Username is required");
      return;
    }
    setAuthError(null);
    try {
      const res = await fetch("/api/user/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: usernameToLogin.trim() })
      });
      if (res.ok) {
        const data = await res.json();
        setProfile(data.profile);
        setIsLoginModalOpen(false);
        setLoginInputUsername("");
        triggerToast(`Logged in as ${usernameToLogin.trim()}`, "success");
        fetchIssues(selectedCityId);
        fetchInsights(selectedCityId);
        fetchCitizens();
      } else {
        const data = await res.json();
        setAuthError(data.error || "Failed to log in");
      }
    } catch (err) {
      setAuthError("Network authorization timeout.");
    }
  };

  const handleSwitchLogout = async () => {
    try {
      const res = await fetch("/api/user/logout", { method: "POST" });
      if (res.ok) {
        setProfile(null);
        triggerToast("Logged out from SmartCity Hub.", "info");
        fetchIssues(selectedCityId);
        fetchInsights(selectedCityId);
        fetchCitizens();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchInsights = async (cityId: string = selectedCityId) => {
    setLoadingInsights(true);
    try {
      const res = await fetch(`/api/ai/insights?city=${cityId}`);
      if (res.ok) {
        const data = await res.json();
        setInsights(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingInsights(false);
    }
  };

  // Action: Upvote
  const handleUpvote = async (issueId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    try {
      const res = await fetch(`/api/issues/${issueId}/upvote`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        // Update issues local state array smoothly
        setIssues(issues.map(i => i.id === issueId ? data.issue : i));
        setProfile(data.profile);
        triggerToast("Voted on issue. Influence level updated!");
      }
    } catch (err) {
      triggerToast("Error casting vote", "error");
    }
  };

  // Action: Verify
  const handleVerify = async (issueId: string, event?: React.MouseEvent) => {
    if (event) event.stopPropagation();
    try {
      const res = await fetch(`/api/issues/${issueId}/verify`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      const data = await res.json();
      if (res.ok) {
        setIssues(issues.map(i => i.id === issueId ? data.issue : i));
        setProfile(data.profile);
        triggerToast("Civic verification logged! Received +15 points.");
        // Re-compile insights periodically to reflect verification status
        fetchInsights();
      } else {
        triggerToast(data.error || "Cannot verify this complaint", "error");
      }
    } catch (err) {
      triggerToast("Verification failed", "error");
    }
  };

  // Action: Add Comment
  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedIssueId || !commentText.trim()) return;

    try {
      const res = await fetch(`/api/issues/${selectedIssueId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          author: profile?.username || "SmartCity Hero",
          text: commentText.trim()
        })
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(issues.map(i => i.id === selectedIssueId ? data.issue : i));
        setProfile(data.profile);
        setCommentText("");
        triggerToast("Comment added! Civic engagement reward: +10 pts.");
      }
    } catch (err) {
      triggerToast("Could not publish comment", "error");
    }
  };

  // Action: Volunteer resolve
  const handleResolve = async (issueId: string) => {
    try {
      const res = await fetch(`/api/issues/${issueId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });
      if (res.ok) {
        const data = await res.json();
        setIssues(issues.map(i => i.id === issueId ? data.issue : i));
        setProfile(data.profile);
        triggerToast("Outstanding achievement! Logged solution with +100 points!");
        fetchInsights();
      }
    } catch (err) {
      triggerToast("Error triggering resolution sequence", "error");
    }
  };

  // Action: File upload drag and drop handlers
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processAndAnalyzeFile = async (file: File) => {
    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64String = (reader.result as string).split(",")[1];
      setImagePreview(reader.result as string);
      
      // Auto-trigger Gemini analysis with image as prompt to categorise dynamically
      setAiAnalyzing(true);
      triggerToast("Smart Vision AI is analyzing upload clues...", "info");
      try {
        const res = await fetch("/api/ai/analyze-issue", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            description: newDescription || file.name.replace(/\.[^/.]+$/, ""), // Fallback if description is still blank
            imageBase64: base64String,
            mimeType: file.type
          })
        });

        if (res.ok) {
          const analysis: AIAnalysisResult = await res.json();
          setAiResult(analysis);
          setNewTitle(analysis.title);
          setNewCategory(analysis.category);
          setNewSeverity(analysis.severity);
          triggerToast("AI successfully classified image and auto-completed reporting data!", "success");
        }
      } catch (err) {
        triggerToast("AI analysis timeout. Reverting to manual entry mode.", "info");
      } finally {
        setAiAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processAndAnalyzeFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processAndAnalyzeFile(e.target.files[0]);
    }
  };

  // Action: Process manually typed description through Smart Triage AI
  const handleManualAiAnalyze = async () => {
    if (!newDescription.trim()) {
      triggerToast("Type a short description first for AI to analyze", "info");
      return;
    }
    setAiAnalyzing(true);
    try {
      const res = await fetch("/api/ai/analyze-issue", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: newDescription })
      });
      if (res.ok) {
        const data: AIAnalysisResult = await res.json();
        setAiResult(data);
        setNewTitle(data.title);
        setNewCategory(data.category);
        setNewSeverity(data.severity);
        triggerToast("AI classification complete!");
      }
    } catch (err) {
      triggerToast("Analysis engine currently busy", "error");
    } finally {
      setAiAnalyzing(false);
    }
  };

  // Action: Submit Issue Form
  const handleSubmitIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDescription.trim() || !newCategory) {
      triggerToast("Please fill in essential fields or upload a visual first", "error");
      return;
    }

    try {
      const response = await fetch("/api/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          category: newCategory,
          severity: newSeverity,
          tags: aiResult?.tags || ["community", "reported"],
          lat: newLat,
          lng: newLng,
          imageUrl: imagePreview ? "uploaded" : undefined,
          reportedBy: profile?.username || "SmartCityHero",
          locationName: newLocationName || `${newLat.toFixed(4)} N, ${newLng.toFixed(4)} W`,
          aiSuggestedFix: aiResult?.aiSuggestedFix || "Inspection scheduled by utility services.",
          city: selectedCityId
        })
      });

      if (response.ok) {
        const data = await response.json();
        setIssues([data.issue, ...issues]);
        setProfile(data.profile);
        setSelectedIssueId(data.issue.id);
        
        // Reset form
        setNewTitle("");
        setNewDescription("");
        setImagePreview(null);
        setAiResult(null);
        setIsReportOpen(false);
        triggerToast("Issue published! Awarded +50 points.");
        
        // Refresh insights
        fetchInsights(selectedCityId);
      }
    } catch (err) {
      triggerToast("Error saving ticket", "error");
    }
  };

  // Action: Reset Database
  const handleResetDB = async () => {
    if (confirm("Are you sure you want to reset simulation files back to pristine sample records?")) {
      try {
        const res = await fetch("/api/reset", { method: "POST" });
        if (res.ok) {
          triggerToast("All simulation records successfully reset!", "success");
          fetchIssues();
          fetchProfile();
          fetchInsights();
        }
      } catch (err) {
        triggerToast("Clean error", "error");
      }
    }
  };

  // Interactive Maps click simulator: Convert click on the container element relative-pixel vectors to Latitude and Longitude values, taking zoom, pan, and rotation into account
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (hasDragged) {
      // It was a pan drag or rotation drag, ignore click
      return;
    }
    const viewportGrid = document.getElementById("viewport-grid");
    if (!viewportGrid) return;
    const rect = viewportGrid.getBoundingClientRect();

    // Map center relative to client coordinates
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;

    // Click relative to map center, accounting for the current panOffset
    const dx = e.clientX - (cx + panOffset.x);
    const dy = e.clientY - (cy + panOffset.y);

    // Rotate back by -rotation (to align with unrotated map coordinate system)
    const rad = (-rotation * Math.PI) / 180;
    const rx = dx * Math.cos(rad) - dy * Math.sin(rad);
    const ry = dx * Math.sin(rad) + dy * Math.cos(rad);

    // Scale back down by zoomScale
    const unscaledX = rx / zoomScale;
    const unscaledY = ry / zoomScale;

    // Convert back to absolute container percentage (where center of container is 50%, 50%)
    const ratioX = (unscaledX / rect.width) + 0.5;
    const ratioY = (unscaledY / rect.height) + 0.5;

    // Bound values inside container boundaries [0, 1]
    const boundedRatioX = Math.max(0, Math.min(1, ratioX));
    const boundedRatioY = Math.max(0, Math.min(1, ratioY));

    // Estimate coordinates
    const calcLng = MAP_LNG_MIN + boundedRatioX * (MAP_LNG_MAX - MAP_LNG_MIN);
    const calcLat = MAP_LAT_MAX - boundedRatioY * (MAP_LAT_MAX - MAP_LAT_MIN); // Invert Y as Latitude increases upward.

    setNewLat(parseFloat(calcLat.toFixed(5)));
    setNewLng(parseFloat(calcLng.toFixed(5)));
    setNewLocationName(`Near Landmark at coordinates Point (${calcLat.toFixed(4)}, ${calcLng.toFixed(4)})`);
    
    // Open reporting model and direct user
    setIsReportOpen(true);
    triggerToast(`Location pin placed at ${calcLat.toFixed(4)}, ${calcLng.toFixed(4)}. File details below!`, "info");
  };

  // Drag to Pan or Rotate Handlers for Map
  const handleMapMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 0) return; // only left click
    setIsDragging(true);
    setHasDragged(false);
    
    if (e.shiftKey) {
      setDragMode("rotate");
      setDragStart({ x: e.clientX, y: e.clientY });
    } else {
      setDragMode("pan");
      setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
    }
  };

  const handleMapMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    
    if (dragMode === "rotate") {
      const dx = e.clientX - dragStart.x;
      // Adjust rotation by delta x (1px = 0.8 degrees)
      setRotation(prev => {
        const nextRot = (prev + dx * 0.8) % 360;
        return nextRot < 0 ? nextRot + 360 : nextRot;
      });
      setDragStart({ x: e.clientX, y: e.clientY });
      setHasDragged(true);
    } else {
      const dx = e.clientX - dragStart.x;
      const dy = e.clientY - dragStart.y;

      if (Math.abs(dx - panOffset.x) > 3 || Math.abs(dy - panOffset.y) > 3) {
        setHasDragged(true);
      }
      setPanOffset({ x: dx, y: dy });
    }
  };

  const handleMapMouseUp = () => {
    setIsDragging(false);
  };

  // Center Map view on specific relative percentage coordinates
  const centerOnRelativeCoords = (xPercent: number, yPercent: number, targetZoom = 1.5) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    
    // Get unscaled map container size
    const unscaledWidth = rect.width / zoomScale;
    const unscaledHeight = rect.height / zoomScale;

    setZoomScale(targetZoom);
    
    // Center calculation: find offset to bring (xPercent, yPercent) to center (50%, 50%)
    const dx = - (xPercent / 100 - 0.5) * unscaledWidth * targetZoom;
    const dy = - (yPercent / 100 - 0.5) * unscaledHeight * targetZoom;

    setPanOffset({ x: dx, y: dy });
  };

  // Zoom control triggers
  const handleZoomIn = () => {
    setZoomScale(prev => Math.min(2.5, prev + 0.25));
  };

  const handleZoomOut = () => {
    setZoomScale(prev => {
      const next = Math.max(0.5, prev - 0.25);
      if (next <= 1.0) {
        setPanOffset({ x: 0, y: 0 });
      }
      return next;
    });
  };

  const handleZoomReset = () => {
    setZoomScale(1.0);
    setPanOffset({ x: 0, y: 0 });
    setRotation(0);
    triggerToast("Map scale, panning, and rotation reset", "info");
  };

  const handleMapWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Zoom in or out relative to current zoomScale
    const delta = e.deltaY < 0 ? 0.15 : -0.15;
    setZoomScale(prev => {
      const next = Math.max(0.5, Math.min(2.5, prev + delta));
      if (next <= 1.0 && prev > 1.0) {
        setPanOffset({ x: 0, y: 0 });
      }
      return parseFloat(next.toFixed(2));
    });
  };

  // Dynamic landmark locations matching our map decals for the active city
  const LANDMARKS = activeCity.landmarks;

  // Helper search result filtering
  const getSearchResults = () => {
    if (!searchQuery.trim()) return [];
    const query = searchQuery.toLowerCase().trim();

    const matchedLandmarks = LANDMARKS.filter(landmark =>
      landmark.name.toLowerCase().includes(query)
    ).map(l => ({
      type: "landmark",
      id: `landmark-${l.name}`,
      name: l.name,
      x: l.x,
      y: l.y,
      subtext: "Simulated Urban Landmark Area"
    }));

    const matchedIssues = issues.filter(issue =>
      issue.title.toLowerCase().includes(query) ||
      issue.locationName.toLowerCase().includes(query) ||
      issue.category.toLowerCase().includes(query)
    ).map(issue => {
      const { x, y } = getMapCoordinates(issue.lat, issue.lng);
      return {
        type: "issue",
        id: issue.id,
        name: issue.title,
        x,
        y,
        subtext: `${issue.category} • ${issue.locationName}`
      };
    });

    return [...matchedLandmarks, ...matchedIssues].slice(0, 5);
  };

  const handleSelectSearchItem = (item: { type: string; id: string; name: string; x: number; y: number }) => {
    centerOnRelativeCoords(item.x, item.y, 1.75);
    if (item.type === "issue") {
      setSelectedIssueId(item.id);
    }
    setSearchQuery(item.name);
    setSearchFocused(false);
    triggerToast(`Centered view on: ${item.name}`, "success");
  };

  // Helper converter: translates Lat Long coordinates into relative percentage locations for positioning elements inside simulated map frame
  const getMapCoordinates = (lat: number, lng: number) => {
    const pctX = ((lng - MAP_LNG_MIN) / (MAP_LNG_MAX - MAP_LNG_MIN)) * 100;
    const pctY = ((MAP_LAT_MAX - lat) / (MAP_LAT_MAX - MAP_LAT_MIN)) * 100; // Invert latitude
    return {
      x: Math.max(2, Math.min(98, pctX)),
      y: Math.max(2, Math.min(98, pctY))
    };
  };

  // Category Icon Resolver mapping categories to relevant Lucide icons
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "Roads & Sidewalks":
        return <AlertTriangle className="w-4 h-4" />;
      case "Water & Sanitation":
        return <Droplet className="w-4 h-4" />;
      case "Streetlights & Power":
        return <Lightbulb className="w-4 h-4" />;
      case "Waste & Environment":
        return <Trash className="w-4 h-4" />;
      default:
        return <Info className="w-4 h-4" />;
    }
  };

  const getSeverityBadgeClass = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-red-500/15 text-red-600 border border-red-500/30 font-extrabold";
      case "high":
        return "bg-orange-500/15 text-orange-600 border border-orange-500/30 font-bold";
      case "medium":
        return "bg-amber-500/15 text-amber-600 border border-amber-500/30 font-medium";
      default:
        return "bg-slate-500/15 text-slate-600 border border-slate-500/30 font-normal";
    }
  };

  const getHeadingDirection = (deg: number) => {
    const d = (deg % 360 + 360) % 360;
    if (d >= 337.5 || d < 22.5) return "N";
    if (d >= 22.5 && d < 67.5) return "NE";
    if (d >= 67.5 && d < 112.5) return "E";
    if (d >= 112.5 && d < 157.5) return "SE";
    if (d >= 157.5 && d < 202.5) return "S";
    if (d >= 202.5 && d < 247.5) return "SW";
    if (d >= 247.5 && d < 292.5) return "W";
    return "NW";
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "resolved":
        return "bg-green-500 text-white font-semibold";
      case "in_progress":
        return "bg-indigo-600 text-white font-semibold animate-pulse";
      case "verified":
        return "bg-blue-600 text-white font-medium";
      default:
        return "bg-slate-100 text-slate-800 border border-slate-300";
    }
  };

  // Filter & sort issues logic
  const filteredIssues = issues
    .filter(i => {
      if (categoryFilter === "All") return true;
      return i.category === categoryFilter;
    })
    .filter(i => {
      if (severityFilter === "All") return true;
      return i.severity === severityFilter;
    })
    .sort((a, b) => {
      if (sortBy === "upvotes") {
        return b.upvotes - a.upvotes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const selectedIssue = issues.find(i => i.id === selectedIssueId) || issues[0];

  return (
    <div className="w-full min-h-screen bg-[#F1F5F9] text-slate-900 font-sans flex flex-col overflow-x-hidden antialiased">
      
      {/* Toast Alert message banner */}
      {toast && (
        <div 
          id="system-toast"
          className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl transition-all duration-300 border backdrop-blur-md transform translate-y-0 ${
            toast.type === "error" 
              ? "bg-red-50 border-red-200 text-red-800"
              : toast.type === "info"
              ? "bg-indigo-50 border-indigo-200 text-indigo-800"
              : "bg-emerald-50 border-emerald-200 text-emerald-800"
          }`}
        >
          <div className="w-2 h-2 rounded-full bg-current animate-ping" />
          <p className="text-xs font-semibold">{toast.message}</p>
        </div>
      )}

      {/* Header Navigation */}
      <nav id="header-nav" className="min-h-16 py-3 lg:h-16 lg:py-0 bg-white border-b border-slate-200 flex flex-col lg:flex-row items-center justify-between px-4 md:px-6 shrink-0 z-20 sticky top-0 shadow-sm gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-md shadow-indigo-100 transform hover:rotate-6 transition-transform shrink-0">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">SmartCity<span className="text-indigo-600">Hero</span></h1>
              <div className="relative inline-block text-left">
                <select
                  id="city-state-selector"
                  value={selectedCityId}
                  onChange={(e) => {
                    setSelectedCityId(e.target.value);
                    triggerToast(`Switched active state/city to ${cities.find(c => c.id === e.target.value)?.cityName}, ${cities.find(c => c.id === e.target.value)?.stateName}`, "info");
                  }}
                  className="bg-indigo-50 border border-indigo-100 text-indigo-700 text-[11px] font-bold rounded-lg px-2.5 py-1 pr-6 hover:bg-indigo-100 hover:border-indigo-200 transition-colors cursor-pointer appearance-none outline-none focus:ring-1 focus:ring-indigo-500 shadow-sm"
                >
                  {cities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.stateName} ({city.cityName})
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-1.5 flex items-center text-indigo-700">
                  <svg className="fill-current h-3.5 w-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                    <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                  </svg>
                </div>
              </div>
            </div>
            <p className="text-[10.5px] text-slate-500 font-semibold tracking-wide">National Citizen Civic Hub for all Indian States & Municipal Administrations. 🚀🏙️</p>
          </div>
        </div>

        {/* Navigation Categories */}
        <div className="flex items-center gap-1 overflow-x-auto w-full lg:w-auto px-1 py-1 whitespace-nowrap bg-slate-50 lg:bg-transparent rounded-xl shrink-0 scrollbar-none justify-start lg:justify-center">
          <button
            id="nav-tab-live"
            onClick={() => setActiveTab("live")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
              activeTab === "live" 
                ? "bg-white lg:bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 lg:border-transparent" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            Live Feed
          </button>
          <button
            id="nav-tab-heatmap"
            onClick={() => setActiveTab("heatmap")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
              activeTab === "heatmap" 
                ? "bg-white lg:bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 lg:border-transparent" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            Heatmap
          </button>
          <button
            id="nav-tab-insights"
            onClick={() => setActiveTab("insights")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
              activeTab === "insights" 
                ? "bg-white lg:bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 lg:border-transparent" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            Predictive Insights
          </button>
          <button
            id="nav-tab-governance"
            onClick={() => setActiveTab("governance")}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all shrink-0 ${
              activeTab === "governance" 
                ? "bg-white lg:bg-indigo-50 text-indigo-700 shadow-sm border border-indigo-100 lg:border-transparent" 
                : "text-slate-500 hover:text-slate-900 hover:bg-slate-100/50"
            }`}
          >
            City Governance
          </button>
        </div>

        {/* User Identity Section */}
        <div className="flex items-center justify-between lg:justify-end gap-3 w-full lg:w-auto border-t lg:border-t-0 pt-2.5 lg:pt-0 border-slate-100">
          <button
            id="btn-reseed"
            onClick={handleResetDB}
            title="Reseed simulation back-end data"
            className="p-1 px-2.5 hover:bg-slate-100 rounded-lg text-[10px] uppercase font-bold text-slate-500 hover:text-slate-700 transition-colors border border-dashed border-slate-200 flex items-center gap-1.5 shrink-0"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset State
          </button>
          
          {profile && profile.username ? (
            <div className="flex items-center gap-3 bg-indigo-50/70 hover:bg-indigo-50 px-3 py-1.5 rounded-2xl border border-indigo-100/50 transition duration-150">
              <div className="text-right">
                <p className="text-xs font-black text-slate-800 leading-tight truncate max-w-[120px]">{profile.username}</p>
                <button 
                  onClick={() => { fetchCitizens(); setIsLoginModalOpen(true); }}
                  className="text-[10px] text-indigo-650 hover:text-indigo-800 font-bold underline cursor-pointer block"
                >
                  Switch Profile
                </button>
              </div>
              <button 
                id="btn-profile-card-open"
                onClick={() => { fetchCitizens(); setIsLoginModalOpen(true); }}
                className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 shadow overflow-hidden relative group shrink-0 cursor-pointer"
                title="Manage accounts and points"
              >
                <img 
                  src={`https://api.dicebear.com/7.x/bottts/svg?seed=${profile.username}`} 
                  alt="Active Citizen Avatar" 
                  className="w-full h-full object-cover"
                />
              </button>
              <button
                onClick={handleSwitchLogout}
                className="text-[10px] bg-white text-rose-600 hover:bg-rose-50 border border-slate-200 rounded-lg px-2 py-1 font-bold transition-all shrink-0 cursor-pointer"
                title="Logout current user"
              >
                Log Out
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-xs font-bold text-slate-500 leading-tight">Anonymous Guest</p>
                <p className="text-[10px] text-slate-400 font-medium">Limited Access</p>
              </div>
              <button
                onClick={() => { fetchCitizens(); setIsLoginModalOpen(true); }}
                className="px-4 py-1.5 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow transition duration-150 cursor-pointer shrink-0"
              >
                Log In
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Main Responsive Grid Layout inside App */}
      <main className="flex-1 flex flex-col xl:flex-row gap-6 p-4 md:p-6 xl:h-[calc(100vh-4rem)] overflow-y-auto xl:overflow-hidden w-full max-w-[1600px] mx-auto">
        
        {/* VIEW 1: MAIN COMBINED LIVE HUB AND INTERACTIVE MAP */}
        {activeTab === "live" && (
          <>
            {/* COLUMN A: Citizen Report Feed */}
            <aside id="reports-feed-panel" className="w-full xl:w-80 flex flex-col gap-4 shrink-0">
              
              {/* Header block with stats */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-extrabold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3.5 h-3.5 text-indigo-600" />
                    Active Reports
                  </h2>
                  <p className="text-[10px] text-slate-400 mt-0.5">{issues.length} community cases found</p>
                </div>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-[10px] font-bold rounded-full border border-indigo-200/50 shadow-sm">
                  {issues.filter(i => i.status !== "resolved").length} LIVE
                </span>
              </div>

              {/* Filters Controls block */}
              <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-100 pb-1.5">
                  <span className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Filtering & Sorting</span>
                  <button 
                    onClick={() => { setCategoryFilter("All"); setSeverityFilter("All"); setSortBy("recent"); }}
                    className="text-[10px] text-indigo-600 uppercase hover:underline"
                  >
                    Clear
                  </button>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Category</label>
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="w-full mt-0.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      <option value="All">All Categories</option>
                      <option value="Roads & Sidewalks">Roads & Sidewalks</option>
                      <option value="Water & Sanitation">Water & Sanitation</option>
                      <option value="Streetlights & Power">Streetlights & Power</option>
                      <option value="Waste & Environment">Waste & Environment</option>
                      <option value="Public Facilities">Public Facilities</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[9px] uppercase tracking-wider text-slate-400 font-extrabold">Severity</label>
                    <select
                      value={severityFilter}
                      onChange={(e) => setSeverityFilter(e.target.value)}
                      className="w-full mt-0.5 px-2 py-1 bg-slate-50 border border-slate-200 rounded-lg text-xs font-medium focus:ring-1 focus:ring-indigo-500 outline-none"
                    >
                      <option value="All">All Severities</option>
                      <option value="critical">Critical</option>
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="flex bg-slate-50 p-1.5 rounded-xl border border-slate-200 justify-between items-center text-xs">
                  <span className="font-semibold text-slate-400 text-[10px]">Sort by metric:</span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setSortBy("recent")}
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
                        sortBy === "recent" ? "bg-white text-indigo-700 shadow-sm border border-slate-200" : "text-slate-500"
                      }`}
                    >
                      Recent
                    </button>
                    <button
                      onClick={() => setSortBy("upvotes")}
                      className={`px-2 py-0.5 rounded-md font-bold text-[10px] transition-colors ${
                        sortBy === "upvotes" ? "bg-white text-indigo-700 shadow-sm border border-slate-200" : "text-slate-500"
                      }`}
                    >
                      Upvotes
                    </button>
                  </div>
                </div>
              </div>

              {/* Feed Card Scroller list */}
              <div id="feed-scroller" className="xl:flex-1 overflow-y-auto max-h-[360px] xl:max-h-none space-y-3.5 pr-1">
                {loadingIssues ? (
                  <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-2">
                    <RefreshCw className="w-8 h-8 animate-spin text-indigo-600" />
                    <p className="text-xs font-bold">Synchronizing issues pipeline...</p>
                  </div>
                ) : filteredIssues.length === 0 ? (
                  <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-400 shadow-sm">
                    <p className="text-xs font-semibold">No issues matching selected parameters.</p>
                    <button 
                      onClick={() => { setCategoryFilter("All"); setSeverityFilter("All"); }}
                      className="mt-3 text-xs font-bold text-indigo-600 hover:underline"
                    >
                      Reset Filters
                    </button>
                  </div>
                ) : (
                  filteredIssues.map((issue) => {
                    const isSelected = selectedIssueId === issue.id;
                    const dateFormatted = new Date(issue.createdAt).toLocaleDateString(undefined, {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit"
                    });
                    
                    return (
                      <div
                        id={`issue-card-${issue.id}`}
                        key={issue.id}
                        onClick={() => setSelectedIssueId(issue.id)}
                        className={`p-4 rounded-2xl border cursor-pointer hover:border-indigo-400 hover:shadow-md transition-all duration-200 ${
                          isSelected
                            ? "bg-white border-indigo-500 ring-2 ring-indigo-500/10 shadow-md transform -translate-y-0.5"
                            : "bg-white border-slate-200 shadow-sm opacity-90"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex gap-2 items-center">
                            <span className={`px-2 py-0.5 text-[10px] uppercase font-bold rounded ${getSeverityBadgeClass(issue.severity)}`}>
                              {issue.severity}
                            </span>
                            <span className="text-[10px] text-slate-400 font-bold flex items-center gap-1">
                              {getCategoryIcon(issue.category)}
                              {issue.category}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-400 font-bold bg-slate-50 px-1 rounded">
                            {issue.id}
                          </span>
                        </div>

                        <h3 className="font-bold text-slate-800 leading-tight mb-1 text-sm">
                          {issue.title}
                        </h3>
                        <p className="text-xs text-slate-500 mb-2.5 line-clamp-2">
                          {issue.description}
                        </p>

                        <div className="flex items-center justify-between text-[11px] text-slate-400 font-semibold mb-3">
                          <span className="text-[10px]">By: <span className="text-slate-600 font-bold">{issue.reportedBy}</span></span>
                          <span className="flex items-center gap-1 text-[10px]">
                            <Clock className="w-3 h-3 text-slate-300" />
                            {dateFormatted}
                          </span>
                        </div>

                        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                          <div className="flex items-center gap-3">
                            <button
                              id={`btn-upvote-${issue.id}`}
                              onClick={(e) => handleUpvote(issue.id, e)}
                              className={`flex items-center gap-1 px-2.5 py-1 rounded-xl transition ${
                                issue.upvotedBy.includes(profile?.username || "")
                                  ? "bg-indigo-50 text-indigo-600 font-bold"
                                  : "bg-slate-50 text-slate-500 hover:bg-indigo-50 hover:text-indigo-600"
                              }`}
                            >
                              <ThumbsUp className="w-3.5 h-3.5" />
                              <span className="font-semibold text-xs">{issue.upvotes}</span>
                            </button>

                            <span className="text-[10px] font-medium text-slate-400">
                              {issue.verifications} Verified
                            </span>
                          </div>

                          <div className="flex gap-1.5">
                            {issue.status === "reported" && (
                              <button
                                id={`btn-validate-${issue.id}`}
                                onClick={(e) => handleVerify(issue.id, e)}
                                className="px-3 py-1 bg-indigo-600 text-white text-[10px] font-bold rounded-lg hover:bg-indigo-700 shadow-sm uppercase active:scale-95 transition-transform"
                              >
                                VALIDATE
                              </button>
                            )}
                            <span className={`px-2 py-0.5 text-[9px] uppercase rounded-full font-bold flex items-center ${getStatusBadgeClass(issue.status)}`}>
                              {issue.status === "resolved" && <Check className="w-2.5 h-2.5 mr-0.5" />}
                              {issue.status.replace("_", " ")}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </aside>

            {/* COLUMN B: Interactive Map Segment */}
            <section id="interactive-map-panel" className="flex-1 bg-slate-200 rounded-3xl relative overflow-hidden shadow-inner border border-slate-300 flex flex-col min-h-[400px] md:min-h-[500px] xl:min-h-0">
              {/* Map background grid representing stylized neighborhood block segments */}
              <div 
                id="viewport-grid"
                className="absolute inset-0 z-0 bg-slate-100 transition-all duration-300 overflow-hidden"
              >
                {/* ZOOMABLE AND PANNABLE MAP LAYER */}
                <div
                  id="map-transform-container"
                  ref={mapContainerRef}
                  className="absolute inset-0 select-none cursor-grab active:cursor-grabbing origin-center"
                  style={{
                    transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomScale}) rotate(${rotation}deg)`,
                    transition: isDragging ? "none" : "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                  }}
                  onMouseDown={handleMapMouseDown}
                  onMouseMove={handleMapMouseMove}
                  onMouseUp={handleMapMouseUp}
                  onMouseLeave={handleMapMouseUp}
                  onClick={handleMapClick}
                  onWheel={handleMapWheel}
                >
                  {/* Grid background layer */}
                  <div 
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      mapStyle === "grid" ? "opacity-100" : "opacity-0"
                    }`}
                    style={{
                      backgroundImage: "radial-gradient(#cbd5e1 2px, transparent 2px)",
                      backgroundSize: "32px 32px",
                    }}
                  />

                  {/* Satellite background layer */}
                  <div 
                    className={`absolute inset-0 bg-slate-900 bg-cover bg-center grayscale contrast-110 brightness-90 transition-opacity duration-500 ${
                      mapStyle === "satellite" ? "opacity-35" : "opacity-0"
                    }`}
                    style={{
                      backgroundImage: "url('https://images.unsplash.com/photo-1569336415962-a4bd9f69cd83?auto=format&fit=crop&w=1200&q=80')"
                    }}
                  />

                  {/* Dynamic Parks, Rivers, and Roads vector shapes background */}
                  {showParks && activeCity.parks?.map((park, i) => (
                    <div
                      key={`park-${i}`}
                      className="absolute bg-emerald-200/50 border border-emerald-300/30 rounded-3xl flex items-center justify-center pointer-events-none transition-all duration-500 overflow-hidden shadow-sm"
                      style={{
                        left: `${park.x}%`,
                        top: `${park.y}%`,
                        width: `${park.w}%`,
                        height: `${park.h}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      <span className="text-[8px] sm:text-[9.5px] font-bold text-emerald-800/50 font-sans tracking-wide uppercase select-none text-center px-1">
                        {park.name}
                      </span>
                    </div>
                  ))}

                  {showWater && activeCity.waterBodies?.map((water, i) => (
                    <div
                      key={`water-${i}`}
                      className="absolute bg-sky-200/50 border border-sky-300/30 rounded-2xl flex items-center justify-center pointer-events-none transition-all duration-500 overflow-hidden shadow-sm"
                      style={{
                        left: `${water.x}%`,
                        top: `${water.y}%`,
                        width: `${water.w}%`,
                        height: `${water.h}%`,
                        transform: `translate(-50%, -50%) rotate(${water.rotate || 0}deg)`
                      }}
                    >
                      <span className="text-[8px] sm:text-[9.5px] font-bold text-sky-800/50 font-sans tracking-wide uppercase select-none text-center px-1">
                        {water.name}
                      </span>
                    </div>
                  ))}

                  {showRoads && activeCity.roadsList?.map((road, i) => {
                    if (road.isCircular) {
                      return (
                        <div
                          key={`road-${i}`}
                          className="absolute border-[4px] border-slate-300/45 rounded-full flex items-center justify-center pointer-events-none transition-all duration-500"
                          style={{
                            left: `${road.x}%`,
                            top: `${road.y}%`,
                            width: `${road.w}%`,
                            height: `${road.h}%`,
                            transform: "translate(-50%, -50%)"
                          }}
                        >
                          <span className="text-[7.5px] font-bold text-slate-400/80 font-mono uppercase tracking-wider bg-white/80 px-1 py-0.5 rounded-md select-none transform -translate-y-1/2">
                            {road.name}
                          </span>
                        </div>
                      );
                    }
                    return (
                      <div
                        key={`road-${i}`}
                        className={`absolute bg-slate-300/40 pointer-events-none transition-all duration-500 flex items-center justify-center`}
                        style={{
                          left: `${road.x}%`,
                          top: `${road.y}%`,
                          width: `${road.isPrimary ? "100%" : `${road.w}%`}`,
                          height: `${road.h}%`,
                          transform: `translate(-50%, -50%) rotate(${road.rotate || 0}deg)`,
                          borderRadius: "4px"
                        }}
                      >
                        <span className="text-[7px] font-bold text-slate-400/80 font-mono uppercase tracking-wider bg-white/70 px-1 rounded select-none whitespace-nowrap">
                          {road.name}
                        </span>
                      </div>
                    );
                  })}

                  {/* Simulated Labels */}
                  {showLandmarks && LANDMARKS.map((landmark, idx) => (
                    <span
                      key={idx}
                      className="absolute text-[10px] font-bold text-slate-500 bg-white/90 border border-slate-100 px-2 py-0.5 rounded-lg shadow-sm opacity-90 select-none transition-all duration-300 pointer-events-none"
                      style={{
                        left: `${landmark.x}%`,
                        top: `${landmark.y}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      📍 {landmark.name}
                    </span>
                  ))}

                  {/* PLOTTED ISSUE MARKERS */}
                  {issues.map((issue, idx) => {
                    const isSelected = selectedIssueId === issue.id;
                    const { x, y } = getMapCoordinates(issue.lat, issue.lng);
                    
                    // Color codes for markers
                    let pinColorClass = "bg-slate-500 shadow-indigo-150";
                    if (issue.status === "resolved") {
                      pinColorClass = "bg-emerald-500 shadow-emerald-200";
                    } else if (issue.severity === "critical") {
                      pinColorClass = "bg-red-500 shadow-red-200 anim-pulse";
                    } else if (issue.severity === "high") {
                      pinColorClass = "bg-orange-500 shadow-orange-200";
                    } else {
                      pinColorClass = "bg-amber-500 shadow-amber-200";
                    }

                    return (
                      <div
                        key={issue.id}
                        className="absolute z-10"
                        style={{
                          left: `${x}%`,
                          top: `${y}%`,
                          transform: `translate(-50%, -50%) rotate(${-rotation}deg)`,
                          transition: "transform 0.1s ease-out"
                        }}
                      >
                        {/* Ring pulsing for highlighted selection */}
                        {isSelected && (
                          <div className="absolute -inset-4 rounded-full bg-indigo-600/30 animate-pulse pointer-events-none" />
                        )}

                        {/* Subtle Entrance Animation Wrapper */}
                        <motion.div
                          id={`map-marker-${issue.id}`}
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 260,
                            damping: 18,
                            delay: Math.min(1.2, idx * 0.04)
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedIssueId(issue.id);
                            triggerToast(`Inspecting report: ${issue.title}`, "info");
                          }}
                          className="group cursor-pointer transition hover:scale-115"
                        >
                          {/* Pin Button */}
                          <button
                            className={`w-8 h-8 rounded-full border-[3px] border-white shadow-xl flex items-center justify-center text-white cursor-pointer transition ${pinColorClass} ${
                              isSelected ? "scale-110 ring-4 ring-indigo-500/20" : ""
                            }`}
                          >
                            {getCategoryIcon(issue.category)}
                          </button>

                          {/* Hover Info window with Dynamic Verification Impact Score */}
                          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900/95 backdrop-blur-md text-white p-3 rounded-2xl shadow-2xl w-56 hidden group-hover:block z-50 text-left pointer-events-none border border-slate-800 transition-all duration-200">
                            <div className="flex justify-between items-center mb-1.5">
                              <span className={`px-2 py-0.5 text-[8px] uppercase rounded font-bold ${getSeverityBadgeClass(issue.severity)}`}>
                                {issue.severity}
                              </span>
                              <span className="text-[9px] text-slate-400 font-medium">
                                {issue.status.replace("_", " ").toUpperCase()}
                              </span>
                            </div>
                            
                            <p className="text-xs font-bold text-slate-100 line-clamp-1">{issue.title}</p>
                            <p className="text-[9px] text-slate-400 line-clamp-1 mt-0.5 flex items-center gap-1">
                              <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-500" />
                              {issue.locationName}
                            </p>

                            {/* Verification-based Impact Score Badge */}
                            {(() => {
                              const score = (issue.upvotes * 8) + (issue.verifications * 25);
                              let badgeStyle = "bg-slate-800/80 text-slate-400 border-slate-700";
                              let dotStyle = "bg-slate-500";
                              let impactName = "Initiated";

                              if (issue.verifications === 1) {
                                badgeStyle = "bg-sky-500/10 text-sky-300 border-sky-500/25";
                                dotStyle = "bg-sky-450";
                                impactName = "Community Active";
                              } else if (issue.verifications >= 2 && issue.verifications < 5) {
                                badgeStyle = "bg-amber-500/10 text-amber-300 border-amber-500/25";
                                dotStyle = "bg-amber-400";
                                impactName = "High Priority Impact";
                              } else if (issue.verifications >= 5) {
                                badgeStyle = "bg-rose-500/15 text-rose-300 border-rose-500/25";
                                dotStyle = "bg-rose-400 animate-pulse";
                                impactName = "Critical Civic Priority";
                              }

                              return (
                                <div className="mt-2.5 pt-2 border-t border-slate-800/90 space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-[9px] text-slate-400 font-medium">Impact Score</span>
                                    <span className="text-xs font-black text-white font-mono tracking-wider">{score} pts</span>
                                  </div>
                                  <div className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border text-[8px] font-bold ${badgeStyle}`}>
                                    <span className={`w-1.5 h-1.5 rounded-full ${dotStyle}`} />
                                    <span className="uppercase tracking-wider truncate">{impactName}</span>
                                  </div>
                                </div>
                              );
                            })()}

                            <div className="flex justify-between items-center mt-2.5 pt-2 border-t border-slate-800/95 text-[9px] text-slate-400 font-semibold">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="w-3.5 h-3.5 text-slate-500" /> {issue.upvotes} Votes
                              </span>
                              <span className="flex items-center gap-1">
                                <CheckCircle className="w-3.5 h-3.5 text-slate-500" /> {issue.verifications} Verified
                              </span>
                            </div>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FLOATING HUD: Top-Left Search and Map Style controls */}
              <div id="map-controls-hud-top-left" className="absolute top-6 left-6 z-20 flex flex-col sm:flex-row gap-2 max-w-[calc(100%-48px)] sm:max-w-md pointer-events-auto">
                {/* Search Bar Input Container */}
                <div className="relative flex-1 min-w-[200px] bg-white/95 backdrop-blur shadow-lg border border-slate-200/80 rounded-2xl">
                  <div className="flex items-center px-3 py-2">
                    <Search className="w-4 h-4 text-slate-400 shrink-0 mr-2" />
                    <input
                      type="text"
                      placeholder="Search landmarks or issues..."
                      value={searchQuery}
                      onChange={(e) => {
                        setSearchQuery(e.target.value);
                        setSearchFocused(true);
                      }}
                      onFocus={() => setSearchFocused(true)}
                      className="w-full text-xs bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 focus:ring-0"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => {
                          setSearchQuery("");
                          setSearchFocused(false);
                        }}
                        className="text-slate-400 hover:text-slate-600 focus:outline-none ml-1.5 cursor-pointer"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Search suggestions dropdown */}
                  {searchFocused && searchQuery.trim() && (
                    <div className="absolute left-0 right-0 mt-1.5 bg-white rounded-2xl shadow-xl border border-slate-200/80 max-h-60 overflow-y-auto overflow-x-hidden z-50 animate-fade-in divide-y divide-slate-100">
                      {getSearchResults().length === 0 ? (
                        <div className="p-3 text-[11px] text-slate-400 italic text-center">
                          No matches found
                        </div>
                      ) : (
                        getSearchResults().map((item) => (
                          <button
                            key={item.id}
                            onMouseDown={(e) => {
                              e.preventDefault(); // prevent input onBlur from closing immediately
                              handleSelectSearchItem(item);
                            }}
                            className="w-full text-left p-2.5 hover:bg-slate-50 flex items-start gap-2.5 transition duration-150 cursor-pointer"
                          >
                            <div className="mt-0.5 shrink-0">
                              {item.type === "landmark" ? (
                                <Compass className="w-4 h-4 text-indigo-500" />
                              ) : (
                                <MapPin className="w-4 h-4 text-slate-500" />
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-800 truncate">{item.name}</p>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">{item.subtext}</p>
                            </div>
                          </button>
                        ))
                      )}
                    </div>
                  )}
                </div>

                {/* Background Map View Toggle */}
                <div className="flex bg-white/95 backdrop-blur p-1 rounded-2xl shadow-lg border border-slate-200/80 shrink-0 self-start sm:self-auto">
                  <button
                    onClick={() => setMapStyle("grid")}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition duration-150 cursor-pointer ${
                      mapStyle === "grid"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    Grid
                  </button>
                  <button
                    onClick={() => setMapStyle("satellite")}
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition duration-150 cursor-pointer ${
                      mapStyle === "satellite"
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                    }`}
                  >
                    Satellite
                  </button>
                </div>

                {/* Interactive Map Layers Selector Button & Popover */}
                <div className="relative">
                  <button
                    onClick={() => setIsLayersOpen(!isLayersOpen)}
                    className={`p-2 bg-white/95 backdrop-blur shadow-lg border border-slate-200/80 rounded-2xl flex items-center justify-center hover:bg-slate-50 transition active:scale-95 cursor-pointer text-slate-600 ${isLayersOpen ? "ring-2 ring-indigo-500 text-indigo-600" : ""}`}
                    title="Toggle Map Layers"
                  >
                    <Layers className="w-4.5 h-4.5" />
                  </button>

                  {isLayersOpen && (
                    <div className="absolute left-0 mt-2 bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-slate-200/80 p-3 w-48 z-50 animate-fade-in space-y-2.5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Map Layers</p>
                      
                      <div className="space-y-2 text-xs">
                        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700 hover:text-slate-950 transition-colors">
                          <input
                            type="checkbox"
                            checked={showParks}
                            onChange={(e) => setShowParks(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                          Parks & Greenery
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700 hover:text-slate-950 transition-colors">
                          <input
                            type="checkbox"
                            checked={showWater}
                            onChange={(e) => setShowWater(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                          Water Channels
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700 hover:text-slate-950 transition-colors">
                          <input
                            type="checkbox"
                            checked={showRoads}
                            onChange={(e) => setShowRoads(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                          Road Networks
                        </label>

                        <label className="flex items-center gap-2 cursor-pointer select-none font-medium text-slate-700 hover:text-slate-950 transition-colors">
                          <input
                            type="checkbox"
                            checked={showLandmarks}
                            onChange={(e) => setShowLandmarks(e.target.checked)}
                            className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 w-3.5 h-3.5"
                          />
                          Major Landmarks
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Map Range Info Overlay with rotation instruction */}
              <div className="absolute top-[120px] sm:top-20 left-6 z-10 flex flex-col gap-1.5 pointer-events-none select-none">
                <div className="bg-slate-800/85 text-white font-mono text-[9px] px-2.5 py-1.5 rounded-xl shadow-md backdrop-blur-sm">
                  Range: {MAP_LAT_MIN.toFixed(4)} N - {MAP_LAT_MAX.toFixed(4)} N
                </div>
                <div className="bg-slate-800/85 text-white font-mono text-[9px] px-2.5 py-1.5 rounded-xl shadow-md backdrop-blur-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                  <span>Shift + Drag to Rotate</span>
                </div>
              </div>

              {/* Map HUD Overlay Banner top-right */}
              <div id="map-dashboard-hud" className="absolute top-6 right-6 z-10 flex flex-col gap-2.5 max-w-xs pointer-events-auto">
                <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-white/50 w-48">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Priority Queue</p>
                  
                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1 flex-1 truncate">Water safety</span>
                      <span className="text-[11px] font-bold text-red-600 shrink-0 ml-1">98%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1 flex-1 truncate">Street safety</span>
                      <span className="text-[11px] font-bold text-amber-600 shrink-0 ml-1">72%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1 flex-1 truncate">Environment</span>
                      <span className="text-[11px] font-bold text-green-600 shrink-0 ml-1">14%</span>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-report-modal"
                  onClick={() => setIsReportOpen(true)}
                  className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition active:scale-95 text-xs text-center border-b-2 border-indigo-800 cursor-pointer"
                >
                  <Plus className="w-5 h-5 text-white" />
                  REPORT NEW ISSUE
                </button>
              </div>

              {/* FLOATING ZOOM & ROTATION CONTROLS WITH COMPASS: bottom-right */}
              <div id="map-zoom-controls" className="absolute bottom-6 right-6 z-20 flex flex-col gap-2.5 pointer-events-auto select-none">
                {/* Visual Compass dial that updates with rotation state */}
                <div 
                  id="map-compass-widget"
                  className="w-10 h-10 bg-white/95 backdrop-blur hover:bg-slate-50 text-slate-750 border border-slate-200/80 rounded-full shadow-lg flex items-center justify-center transition active:scale-95 cursor-pointer relative group"
                  onClick={() => {
                    setRotation(0);
                    triggerToast("Orientation aligned to North", "info");
                  }}
                  title="Reset to North"
                >
                  {/* Rotating Dial */}
                  <div 
                    className="absolute inset-1 rounded-full border border-slate-100 flex items-center justify-center transition-transform"
                    style={{ transform: `rotate(${-rotation}deg)` }}
                  >
                    <span className="absolute top-0 text-[8px] font-black text-red-500 tracking-tighter">N</span>
                    <span className="absolute bottom-0 text-[7px] font-black text-slate-400 tracking-tighter">S</span>
                    <span className="absolute left-0.5 text-[7px] font-black text-slate-400 tracking-tighter">W</span>
                    <span className="absolute right-0.5 text-[7px] font-black text-slate-400 tracking-tighter">E</span>
                    
                    {/* Visual Compass Needle */}
                    <div className="w-1 h-5 rounded-full bg-gradient-to-b from-red-500 to-slate-300 absolute" style={{ transform: 'translateY(-1px)' }} />
                    <div className="w-1.5 h-1.5 rounded-full bg-white border border-slate-400 z-10" />
                  </div>
                  
                  {/* Dynamic Heading Tooltip */}
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 bg-slate-900/95 backdrop-blur text-white text-[9px] font-bold px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition pointer-events-none whitespace-nowrap shadow-xl border border-slate-800">
                    Heading: {Math.round(rotation)}° {getHeadingDirection(rotation)}
                  </div>
                </div>

                <div className="flex flex-col bg-white/95 backdrop-blur rounded-xl border border-slate-200/80 shadow-lg divide-y divide-slate-100 overflow-hidden">
                  <button
                    onClick={handleZoomIn}
                    className="w-9 h-9 hover:bg-slate-50 text-slate-750 hover:text-indigo-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomOut}
                    className="w-9 h-9 hover:bg-slate-50 text-slate-750 hover:text-indigo-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <button
                    onClick={handleZoomReset}
                    className="w-9 h-9 hover:bg-slate-50 text-slate-750 hover:text-indigo-600 flex items-center justify-center transition active:scale-90 cursor-pointer"
                    title="Reset View"
                  >
                    <Compass className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* DETAILED, EXPANDABLE LEGEND Overlay bottom-left */}
              <div id="map-expandable-legend" className="absolute bottom-6 left-6 z-20 flex flex-col gap-2 max-w-xs sm:max-w-sm pointer-events-auto">
                {/* Dynamic Map Scale Bar */}
                <div className="bg-slate-900/90 text-white font-mono text-[9px] px-2.5 py-1.5 rounded-xl shadow-md backdrop-blur-sm flex items-center gap-2 self-start pointer-events-none select-none border border-slate-800">
                  <div className="flex flex-col gap-0.5">
                    <span className="font-bold text-slate-400 tracking-wider">SCALE</span>
                    <div className="flex items-center gap-2">
                      <div className="h-1 bg-white border-x border-white" style={{ width: `${Math.min(80, Math.max(15, 30 * zoomScale))}px` }} />
                      <span className="text-white font-black font-mono">
                        {zoomScale >= 1.8 ? "250 m" : zoomScale >= 1.2 ? "500 m" : zoomScale >= 0.8 ? "1 km" : "2 km"}
                      </span>
                    </div>
                  </div>
                </div>

                {isLegendExpanded ? (
                  <div className="bg-white/95 backdrop-blur rounded-2xl shadow-xl border border-slate-200/85 p-4 w-72 max-h-[300px] overflow-hidden flex flex-col">
                    <div className="flex justify-between items-center mb-3 pb-1.5 border-b border-slate-100 shrink-0">
                      <h4 className="text-xs font-black text-slate-800 uppercase tracking-wider font-mono flex items-center gap-1.5">
                        <Layers className="w-3.5 h-3.5 text-indigo-600" />
                        Map Legend
                      </h4>
                      <button
                        onClick={() => setIsLegendExpanded(false)}
                        className="text-slate-400 hover:text-slate-600 cursor-pointer focus:outline-none p-0.5"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-4 overflow-y-auto pr-1 flex-1">
                      {/* Severity Legend */}
                      <div>
                        <h5 className="text-[9px] font-bold text-slate-450 uppercase tracking-widest mb-1.5 font-mono">Issue Severities</h5>
                        <div className="grid grid-cols-3 gap-1.5">
                          <div className="flex items-center gap-1 bg-red-50 border border-red-100 px-1.5 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                            <span className="text-[9px] font-bold text-red-700 truncate">Critical</span>
                          </div>
                          <div className="flex items-center gap-1 bg-orange-50 border border-orange-100 px-1.5 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-orange-500 shrink-0" />
                            <span className="text-[9px] font-bold text-orange-700 truncate">High</span>
                          </div>
                          <div className="flex items-center gap-1 bg-amber-50 border border-amber-100 px-1.5 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                            <span className="text-[9px] font-bold text-amber-700 truncate">Med/Low</span>
                          </div>
                        </div>
                      </div>

                      {/* Categories Legend */}
                      <div>
                        <h5 className="text-[9px] font-bold text-slate-450 uppercase tracking-widest mb-1.5 font-mono">Categories</h5>
                        <div className="grid grid-cols-2 gap-1.5">
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-medium">
                            <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
                              <AlertTriangle className="w-2.5 h-2.5" />
                            </div>
                            <span className="truncate">Roads/Sidewalks</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-medium">
                            <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
                              <Droplet className="w-2.5 h-2.5" />
                            </div>
                            <span className="truncate">Water/Sanitation</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-medium">
                            <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
                              <Lightbulb className="w-2.5 h-2.5" />
                            </div>
                            <span className="truncate">Power/Light</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-700 font-medium">
                            <div className="w-4 h-4 rounded bg-slate-100 border border-slate-200/60 flex items-center justify-center text-slate-600 shrink-0">
                              <Trash className="w-2.5 h-2.5" />
                            </div>
                            <span className="truncate">Waste/Env</span>
                          </div>
                        </div>
                      </div>

                      {/* Resolution Statuses Legend */}
                      <div>
                        <h5 className="text-[9px] font-bold text-slate-450 uppercase tracking-widest mb-1.5 font-mono">Resolution Statuses</h5>
                        <div className="grid grid-cols-3 gap-1">
                          <div className="flex items-center justify-center gap-1 bg-slate-50 border border-slate-200/60 px-1 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 shrink-0" />
                            <span className="text-[8px] font-extrabold text-slate-600 uppercase tracking-tighter">Reported</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 bg-sky-50 border border-sky-150 px-1 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />
                            <span className="text-[8px] font-extrabold text-sky-700 uppercase tracking-tighter">Verified</span>
                          </div>
                          <div className="flex items-center justify-center gap-1 bg-emerald-50 border border-emerald-150 px-1 py-1 rounded-lg">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" />
                            <span className="text-[8px] font-extrabold text-emerald-700 uppercase tracking-tighter">Resolved</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsLegendExpanded(true)}
                    className="flex items-center gap-2 bg-white/95 backdrop-blur px-4 py-2.5 rounded-2xl shadow-lg border border-slate-250 hover:bg-slate-50 transition font-bold text-xs text-slate-700 cursor-pointer"
                  >
                    <Layers className="w-4 h-4 text-indigo-600" />
                    <span>Show Legend</span>
                    <ChevronUp className="w-4 h-4 text-slate-400 ml-1" />
                  </button>
                )}
              </div>
            </section>
          </>
        )}

        {/* VIEW 2: DENSITY HEATMAP VISUALIZATION */}
        {activeTab === "heatmap" && (
          <div id="heatmap-panel" className="flex-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Regional Cluster Heatmap Simulator</h2>
                <p className="text-sm text-slate-500">Visualizes municipal infrastructure report frequency to optimize civic budgets and resource distributions.</p>
              </div>
              <button 
                onClick={() => triggerToast("Updated regional cluster algorithms based on live coordinates.", "success")}
                className="flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50"
              >
                <RefreshCw className="w-3.5 h-3.5" /> Re-cluster Data
              </button>
            </div>

            {/* Generated matrix representing coordinate heatmap segments */}
            <div className="flex-1 grid grid-cols-5 md:grid-cols-10 gap-2 font-mono text-[10px]">
              {Array.from({ length: 40 }).map((_, idx) => {
                // Generate varied density values with custom styles matching sleek interface color layout themes
                const randomWeight = [10, 40, 85, 20, 95, 12, 60, 5, 25, 0][idx % 10];
                let bgStyle = "bg-slate-50"; 
                let textColor = "text-slate-400";
                
                if (randomWeight > 80) {
                  bgStyle = "bg-red-500/90 text-white font-bold animate-pulse";
                } else if (randomWeight > 50) {
                  bgStyle = "bg-orange-400/80 text-white font-semibold";
                } else if (randomWeight > 20) {
                  bgStyle = "bg-indigo-100 text-indigo-800";
                }

                return (
                  <div key={idx} className={`p-3 rounded-xl border border-slate-100 flex flex-col justify-between items-center transition hover:scale-105 shadow-sm text-center ${bgStyle}`}>
                    <span>ZONE {100 + idx}</span>
                    <span className="text-xs font-bold mt-2">{randomWeight}%</span>
                    <span className="text-[8px] opacity-84">{randomWeight > 50 ? "Critical" : randomWeight > 20 ? "Active" : "Quiet"}</span>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 p-4 bg-slate-50 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="border-r border-slate-200 pr-4 text-left">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Highest density pocket</p>
                <p className="text-sm font-bold text-slate-800 mt-1">
                  {selectedCityId === "bengaluru" ? "100 Feet Road, Indiranagar Area" :
                   selectedCityId === "mumbai" ? "Colaba Causeway Crossing" :
                   selectedCityId === "delhi" ? "Connaught Place Outer Circle" :
                   selectedCityId === "chennai" ? "Usman Road Footpath" :
                   selectedCityId === "hyderabad" ? "Laad Bazar Promenade" :
                   selectedCityId === "kolkata" ? "College Street Crossing" :
                   "Central Junction Zone"}
                </p>
                <p className="text-slate-400 mt-0.5">Target repair priority: Water Leakage networks</p>
              </div>
              <div className="border-r border-slate-200 px-4 text-left">
                <p className="font-bold text-slate-400 uppercase text-[10px]">Response Efficiency odds</p>
                <p className="text-sm font-bold text-indigo-600 mt-1">82.4 hours median lock resolution</p>
                <p className="text-slate-400 mt-0.5">Community verification speeds have increased by 40%</p>
              </div>
              <div className="pl-4 text-left">
                <p className="font-bold text-slate-400 uppercase text-[10px]">AI Strategic Alert</p>
                <div className="bg-amber-100 text-amber-800 p-2 rounded-lg font-bold mt-1 text-[11px] flex gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                  {selectedCityId === "bengaluru" ? "Pavement issues clustering near MG Road Junction curve!" :
                   selectedCityId === "mumbai" ? "Waterlogging issues clustering near Marine Drive Promenade curve!" :
                   selectedCityId === "delhi" ? "Overhead cable slacking near Connaught Place Outer Circle!" :
                   selectedCityId === "chennai" ? "Sewer overflow issues clustering near Beach Loop Road!" :
                   selectedCityId === "hyderabad" ? "Streetlight grid blackouts near HITEC City Corridor!" :
                   selectedCityId === "kolkata" ? "Bitumen cracking near College Street tram tracks!" :
                   "Pavement issues clustering near central corridor!"}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: DYNAMIC PREDICTIVE INSIGHTS POWERED BY SERVER GEMINI */}
        {activeTab === "insights" && (
          <div id="ai-insights-panel" className="flex-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-indigo-600 animate-pulse" />
                  Smart City Predictive CRM & Insights
                </h2>
                <p className="text-sm text-slate-500">
                  Powered by Google Gemini 3.5. Compiles trends, forecasts future public maintenance hotspots, recommends custom volunteer workflows.
                </p>
              </div>

              <button
                id="btn-trigger-insights"
                onClick={fetchInsights}
                disabled={loadingInsights}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-3 rounded-xl flex items-center gap-2 transition"
              >
                <RefreshCw className={`w-4 h-4 ${loadingInsights ? "animate-spin" : ""}`} />
                Re-Analyze Neighborhood Data
              </button>
            </div>

            {loadingInsights ? (
              <div className="flex-1 flex flex-col items-center justify-center py-24 gap-4">
                <RefreshCw className="w-10 h-10 animate-spin text-indigo-600" />
                <div className="text-center font-bold">
                  <p className="text-slate-700">Gemini model is scanning the active reports coordinate logs...</p>
                  <p className="text-xs text-slate-400 mt-1">Refactoring risk matrices, extracting municipal priorities & volunteer campaigns.</p>
                </div>
              </div>
            ) : insights ? (
              <div className="space-y-6 text-left">
                
                {/* Mayoral Summary Alert */}
                <div className="p-5 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border border-indigo-100 flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white shrink-0 shadow">
                    <Sparkles className="w-6 h-6 animate-pulse text-indigo-200" />
                  </div>
                  <div>
                    <h3 className="text-xs uppercase tracking-widest font-extrabold text-indigo-600">Chief Urban Scientist Executive Brief</h3>
                    <p className="text-sm font-semibold text-slate-800 mt-1 leading-relaxed">
                      {insights.civicBrief}
                    </p>
                    <div className="mt-3 flex items-center gap-2 text-xs">
                      <span className="font-extrabold text-slate-400 uppercase text-[10px]">Current Priority Hotspot Class:</span>
                      <span className="bg-red-100 text-red-800 px-2 py-0.5 rounded-full font-bold">
                        {insights.topArea}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Hotspot Cards Grid */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">AI Forecasted Local Risk Pockets</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {insights.hotspots.map((spot, idx) => (
                      <div key={idx} className="bg-slate-50 p-5 rounded-2xl border border-slate-200 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-slate-850 text-sm">{spot.title}</span>
                            <span className="px-2 py-0.5 bg-amber-500/10 text-amber-700 border border-amber-500/20 rounded text-[9px] uppercase font-bold">
                              {spot.location}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed mt-2.5">
                            {spot.explanation}
                          </p>
                        </div>
                        <div className="mt-4 pt-3 border-t border-slate-200/60 text-xs">
                          <span className="font-extrabold text-indigo-600 uppercase text-[9px]">Advised Remedy Structure:</span>
                          <p className="font-medium text-slate-800 mt-0.5">{spot.remedy}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Volunteer campaign component */}
                <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-6">
                  <div className="flex-1">
                    <span className="px-2.5 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                      Featured Weekend Volunteer Campaign
                    </span>
                    <h3 className="text-lg font-bold text-slate-800 mt-2">{insights.volunteerCampaign.title}</h3>
                    <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                      {insights.volunteerCampaign.description}
                    </p>

                    <div className="flex gap-4 mt-4 text-xs font-semibold text-slate-500">
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Target Sector:</span>
                        <p className="text-slate-800 text-xs">{insights.volunteerCampaign.targetUnits}</p>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase">Estimated Effort Rank:</span>
                        <p className="text-slate-800 text-xs font-extrabold uppercase text-emerald-600">{insights.volunteerCampaign.difficulty}</p>
                      </div>
                    </div>
                  </div>

                  <div className="w-full md:w-auto shrink-0">
                    <button
                      id="btn-volunteer-join"
                      onClick={() => triggerToast("Registered! Check your inbox for physical meeting logistics and safety kits.", "success")}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs p-4 py-3 rounded-2xl block w-full text-center hover:opacity-90 shadow-md transition"
                    >
                      JOIN CAMPAIGN (+15 points)
                    </button>
                    <p className="text-[9px] text-center text-slate-400 mt-1.5 uppercase font-bold">14 SmartCity Heroes going</p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-sm">No insights derived yet.</p>
              </div>
            )}
          </div>
        )}

        {/* VIEW 4: CITY GOVERNANCE WORKFLOWS */}
        {activeTab === "governance" && (
          <div id="governance-panel" className="flex-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-6 text-left">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Municipal Agency Coordination Controls</h2>
              <p className="text-sm text-slate-500">Monitors contractor assignments, emergency response queues, and public budget utilization rates.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Total Town Hall Budget</p>
                <p className="text-xl font-black text-slate-800 mt-1">{activeCity.budget}</p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-2">
                  <div className="bg-indigo-600 h-full w-[45%] rounded-full" />
                </div>
                <p className="text-[9px] text-slate-400 mt-1">45% assigned for infrastructure repairs</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Contractor Dispatch Load</p>
                <p className="text-xl font-black text-slate-800 mt-1">11 active teams</p>
                <p className="text-[9px] text-slate-400 mt-2">Maximum capacity: 15 simultaneous crews</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Emergency Safety Score</p>
                <p className="text-xl font-black text-emerald-600 mt-1">94.8% Safe</p>
                <p className="text-[9px] text-slate-400 mt-2">Based on unresolved hazard resolution curves</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                <p className="text-[10px] font-bold text-slate-400 uppercase">Verification Accuracy</p>
                <p className="text-xl font-black text-indigo-600 mt-1">98.2% Accurate</p>
                <p className="text-[9px] text-slate-400 mt-2">Verified community reports compared with contractor audits</p>
              </div>
            </div>

            <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
              <div className="p-4 bg-slate-50 border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500">
                Active municipal contractor contracts
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-bold text-slate-800">{activeCity.agencies.roads.name}</p>
                    <p className="text-slate-400 text-[11px]">{activeCity.agencies.roads.desc}</p>
                  </div>
                  <div>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[10px] uppercase">
                      Contract Active - 4 Crews
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-bold text-slate-800">{activeCity.agencies.water.name}</p>
                    <p className="text-slate-400 text-[11px]">{activeCity.agencies.water.desc}</p>
                  </div>
                  <div>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-[10px] uppercase">
                      On-call - Emergency mode
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-bold text-slate-800">{activeCity.agencies.power.name}</p>
                    <p className="text-slate-400 text-[11px]">{activeCity.agencies.power.desc}</p>
                  </div>
                  <div>
                    <span className="px-2.5 py-1 bg-green-50 text-green-700 font-bold rounded-lg text-[10px] uppercase">
                      Maintenance Round completed
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* COLUMN C: Community Member Dashboard / Active Issue Detail sidebar panel */}
        <aside id="community-dashboard-panel" className="w-full xl:w-64 flex flex-col gap-6 shrink-0">
          
          {/* Active Issue Inspection Portal (If there's a selected issue) */}
          {selectedIssue ? (
            <div id="issue-inspection-card" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm flex flex-col gap-4 text-left">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest block">REPORT INSPECT</span>
                  <span className="text-xs font-mono font-bold text-indigo-600">{selectedIssue.id}</span>
                </div>
                <span className={`px-2 py-0.5 text-[9px] uppercase font-bold rounded-full ${getStatusBadgeClass(selectedIssue.status)}`}>
                  {selectedIssue.status.replace("_", " ")}
                </span>
              </div>

              {/* Form Image representation mapping */}
              <div className="w-full h-36 bg-slate-100 rounded-xl overflow-hidden relative border border-slate-200">
                {selectedIssue.imageUrl ? (
                  // Custom realistic graphics according to category for high visual polish
                  <div className="w-full h-full bg-slate-900 flex flex-col items-center justify-center text-white relative">
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-3 z-10 flex justify-between items-end">
                      <span className="text-[10px] text-slate-300 font-medium">By: {selectedIssue.reportedBy}</span>
                      <span className="text-[9px] bg-indigo-600 px-1.5 py-0.5 rounded text-white font-extrabold">Photo Attached</span>
                    </div>
                    {selectedIssue.category === "Roads & Sidewalks" && (
                      <div className="text-center p-4">
                        <AlertTriangle className="w-10 h-10 mx-auto text-amber-500 mb-1 animate-bounce" />
                        <span className="font-bold text-xs uppercase text-amber-500">Pothole Visual Entry</span>
                      </div>
                    )}
                    {selectedIssue.category === "Water & Sanitation" && (
                      <div className="text-center p-4">
                        <Droplet className="w-10 h-10 mx-auto text-blue-400 mb-1 animate-pulse" />
                        <span className="font-bold text-xs uppercase text-blue-400">Water Leak Flow</span>
                      </div>
                    )}
                    {selectedIssue.category === "Streetlights & Power" && (
                      <div className="text-center p-4">
                        <Lightbulb className="w-10 h-10 mx-auto text-yellow-400 mb-1 animate-pulse" />
                        <span className="font-bold text-xs uppercase text-yellow-400">Luminaire outage</span>
                      </div>
                    )}
                    {selectedIssue.category === "Waste & Environment" && (
                      <div className="text-center p-4">
                        <Trash className="w-10 h-10 mx-auto text-green-400 mb-1" />
                        <span className="font-bold text-xs uppercase text-green-400">Garbage Accumulation</span>
                      </div>
                    )}
                    {selectedIssue.category === "Public Facilities" && (
                      <div className="text-center p-4">
                        <Info className="w-10 h-10 mx-auto text-emerald-400 mb-1" />
                        <span className="font-bold text-xs uppercase text-emerald-400">Public Park Bench</span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400">
                    <MapPin className="w-8 h-8 opacity-40 shrink-0 text-slate-300 mr-2" />
                    <div className="text-left text-xs text-slate-400">
                      <span className="font-bold block text-[11px]">No live photo</span>
                      <span className="text-[10px]">Reference coordinate model</span>
                    </div>
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-bold text-slate-850 text-base leading-tight">
                  {selectedIssue.title}
                </h3>
                <p className="text-[11px] text-slate-400 font-bold mt-1 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-indigo-500" />
                  {selectedIssue.locationName}
                </p>
                <p className="text-xs text-slate-600 mt-2.5 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {selectedIssue.description}
                </p>
              </div>

              {/* Gemini AI Auto-suggested Strategy Overlay */}
              <div className="bg-indigo-50/60 p-4 rounded-2xl border border-indigo-100/80">
                <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-indigo-700 uppercase tracking-widest">
                  <Sparkles className="w-3.5 h-3.5 animate-pulse text-indigo-600" />
                  AI Suggested Fix
                </div>
                <p className="text-xs text-slate-650 mt-1.5 leading-relaxed italic">
                  "{selectedIssue.aiSuggestedFix || "Analysing municipal task queue directives..."}"
                </p>
                {selectedIssue.safetyNote && (
                  <div className="mt-2.5 p-2 bg-red-100/80 text-red-850 rounded-lg text-[10px] font-bold flex items-center gap-1.5 border border-red-200/50">
                    <AlertTriangle className="w-3.5 h-3.5 shrink-0 text-red-600" />
                    <span>Resident Warning: {selectedIssue.safetyNote}</span>
                  </div>
                )}
              </div>

              {/* Resolve volunteering command */}
              {selectedIssue.status !== "resolved" && (
                <div className="flex flex-col gap-2">
                  <button 
                    id="btn-mark-resolved"
                    onClick={() => handleResolve(selectedIssue.id)}
                    className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-[11px] uppercase tracking-wider rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" /> Mark Solved (+100 XP)
                  </button>
                  <p className="text-[9px] text-center text-slate-400 font-semibold h-4">Only mark if physically safe !</p>
                </div>
              )}

              {/* Discussion & Comments */}
              <div className="border-t border-slate-100 pt-4 flex-1 flex flex-col min-h-[180px]">
                <h4 className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider mb-2.5 flex items-center gap-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  Discussion ({selectedIssue.comments.length})
                </h4>

                {/* Scrolled comments feed */}
                <div className="space-y-3 overflow-y-auto max-h-40 pr-1 flex-1">
                  {selectedIssue.comments.length === 0 ? (
                    <p className="text-[11px] text-slate-400 italic text-center py-4">No comments posted yet. Start the community thread!</p>
                  ) : (
                    selectedIssue.comments.map(c => (
                      <div key={c.id} className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex gap-2 items-start">
                        <img 
                          src={c.avatar} 
                          alt="avatar" 
                          className="w-5 h-5 rounded-full border border-slate-200 mt-0.5 object-cover"
                        />
                        <div className="flex-1 text-xs">
                          <div className="flex justify-between items-center mb-0.5 text-[9px] text-slate-400">
                            <span className="font-extrabold text-slate-600">{c.author}</span>
                            <span>{new Date(c.createdAt).toLocaleDateString()}</span>
                          </div>
                          <p className="text-slate-600 leading-tight mt-0.5">{c.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <form onSubmit={handleAddComment} className="mt-3 flex gap-2">
                  <input
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Coordinate tip..."
                    className="flex-1 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                  <button
                    type="submit"
                    className="px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl active:scale-95 transition"
                  >
                    Post
                  </button>
                </form>
              </div>

            </div>
          ) : (
            <div className="bg-white rounded-3xl p-6 border border-slate-200 text-center text-slate-400 shadow-sm py-16">
              <MapPin className="w-12 h-12 mx-auto opacity-30 text-slate-300 mb-3" />
              <p className="text-xs font-semibold">Select ANY listed neighbor conflict card or click the coordinates map to view detailed citizen inspect metrics.</p>
            </div>
          )}

          {/* User community impact card: badges, level up meter */}
          <div id="user-community-scorecard" className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm text-left">
            <h2 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-4 font-mono">Your SmartCity Impact</h2>
            
            <div className="flex items-end gap-2">
              <span className="text-4xl font-black text-slate-900">{profile?.points || 0}</span>
              <span className="text-green-500 text-xs font-bold mb-1">+12%</span>
            </div>
            <p className="text-xs text-slate-500 mt-1">Points earned this month</p>

            <div className="mt-6 space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-650">Verified Reports</span>
                <span className="font-bold text-slate-800">{profile?.verificationsMade || 0}</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-655">Reports Sent</span>
                <span className="font-bold text-slate-800">{profile?.reportsSubmitted || 0}</span>
              </div>
              
              <div className="w-full bg-slate-100 h-2 rounded-full mt-4">
                <div 
                  className="bg-indigo-600 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${Math.min(100, ((profile?.points || 0) / 800) * 100)}%` }} 
                />
              </div>
              <p className="text-[10px] text-center text-slate-400 font-bold">Next Level: {profile?.level ? (profile.level + 1) * 200 : 200} Pts</p>
            </div>

            {/* Badges row */}
            <div className="mt-5 pt-3.5 border-t border-slate-100 text-left">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block mb-2 font-mono">My Badges ({profile?.badges.length || 0})</span>
              <div className="flex flex-wrap gap-2">
                {profile?.badges.map(b => (
                  <div 
                    key={b.id} 
                    title={`${b.name}: ${b.description}`}
                    className="p-1 px-2 bg-indigo-50 border border-indigo-100 rounded-lg text-[9px] font-mono font-bold text-indigo-700 flex items-center gap-1 cursor-help hover:bg-indigo-100 transition"
                  >
                    <Award className="w-3 h-3" />
                    <span>{b.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
        </aside>

      </main>

      {/* FOOTER BAR MANDATE ACCORDING TO SLEEK INTERFACE THEME */}
      <footer id="footer-status" className="h-10 bg-slate-900 text-slate-400 flex items-center justify-between px-6 text-[10px] font-medium shrink-0 z-10 w-full mt-auto">
        <div className="flex gap-6">
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-green-400"></span> SERVER: ACTIVE</span>
          <span className="flex items-center gap-1.5"><span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> AI AGENT: MONITORING</span>
        </div>
        <div className="hidden md:flex gap-6 uppercase tracking-widest text-[9px]">
          <span>3,402 Active Citizens</span>
          <span>94.2% Resolution Rate</span>
          <span>District 04 (Downtown)</span>
        </div>
      </footer>


      {/* REPORT NEW ISSUE DIALOG / MODAL FRAME */}
      {isReportOpen && (
        <div id="new-issue-modal" className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-slate-300 transform scale-100 transition-all flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-5 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white flex justify-between items-center">
              <div>
                <h3 className="text-lg font-bold">Report Public Infrastructure Hazard</h3>
                <p className="text-[11px] text-indigo-200">Submit coordinates, categories, or take advantage of high-speed Smart AI categorization</p>
              </div>
              <button 
                onClick={() => setIsReportOpen(false)}
                className="p-1 text-indigo-200 hover:text-white rounded-lg hover:bg-indigo-500 transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form Scroll Container */}
            <form onSubmit={handleSubmitIssue} className="p-6 overflow-y-auto space-y-4 flex-1 text-xs text-left">
              
              {/* Placement coordinates confirmation banner */}
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl flex items-center gap-3">
                <MapPin className="w-5 h-5 text-indigo-600 border-indigo-200 border rounded-full p-0.5" />
                <div className="flex-1">
                  <p className="font-bold text-slate-800">Coordinate placement location</p>
                  <p className="text-[10px] text-indigo-600 font-mono">Latitude: {newLat.toFixed(5)}° N, Longitude: {newLng.toFixed(5)}° W</p>
                  <input
                    value={newLocationName}
                    onChange={(e) => setNewLocationName(e.target.value)}
                    placeholder="Landmark name / Street intersection..."
                    className="w-full mt-1.5 p-1 px-2 border border-slate-200 bg-white rounded text-[11px] outline-none"
                    required
                  />
                </div>
              </div>

              {/* Upload Drag & Drop section with Gemini AI Trigger */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1.5">
                  Visual camera photograph (Drag and Drop enabled)
                </label>
                
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  className={`border-2 border-dashed rounded-2xl p-5 text-center transition cursor-pointer ${
                    dragActive 
                      ? "border-indigo-600 bg-indigo-50/50" 
                      : imagePreview 
                      ? "border-emerald-500 bg-emerald-50/10" 
                      : "border-slate-300 hover:border-indigo-400 bg-slate-50"
                  }`}
                >
                  {imagePreview ? (
                    <div className="space-y-2">
                      <div className="w-[180px] h-[110px] mx-auto rounded-lg overflow-hidden border border-slate-200 relative">
                        <img src={imagePreview} alt="Snapshot Preview" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => { setImagePreview(null); setImageFile(null); setAiResult(null); }}
                          className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 cursor-pointer"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">Image uploaded ready. Coordinates attached.</p>
                    </div>
                  ) : (
                    <div className="space-y-2 text-slate-450">
                      <Camera className="w-8 h-8 mx-auto opacity-60 text-slate-450" />
                      <p className="font-bold text-[11px]">Drag & Drop your snapshot photo here</p>
                      <p className="text-[10px] text-slate-400">Supports PNG, JPG (Max 5MB). Submitting triggers automated visual categorization!</p>
                      
                      <div className="pt-1">
                        <label className="px-3 py-1 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg font-bold text-[10px] text-slate-650 cursor-pointer shadow-sm">
                          Browse Local Files
                          <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Description Input */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">
                    Describe situation details
                  </label>
                  
                  {/* AI Assistant dispatch assistant button */}
                  <button
                    type="button"
                    onClick={handleManualAiAnalyze}
                    disabled={aiAnalyzing || !newDescription}
                    className="p-1 px-2.5 bg-gradient-to-r from-indigo-50 to-indigo-100 hover:from-indigo-100 hover:to-indigo-200 text-indigo-700 text-[10px] font-extrabold rounded-lg border border-indigo-200/50 flex items-center gap-1 transition"
                  >
                    <Sparkles className="w-3 h-3 text-indigo-600 animate-pulse" />
                    AI Analyze Text
                  </button>
                </div>

                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  placeholder="Detail the issue: e.g. Deep Pothole has opened up, water is overflowing onto sidewalk at Maple curve, creating dark risk near primary school pathway..."
                  rows={3}
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* AI Auto-Completed Preview HUD */}
              {aiAnalyzing && (
                <div className="p-4 bg-indigo-50 text-indigo-800 rounded-xl border border-indigo-200 text-center animate-pulse flex items-center justify-center gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-600" />
                  <span className="font-bold text-[11px]">Gemini Model analyzing context clues and catalog regulations...</span>
                </div>
              )}

              {/* Dynamic Categories selection */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                    Select public division category
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    required
                  >
                    <option value="Roads & Sidewalks">Roads & Sidewalks</option>
                    <option value="Water & Sanitation">Water & Sanitation</option>
                    <option value="Streetlights & Power">Streetlights & Power</option>
                    <option value="Waste & Environment">Waste & Environment</option>
                    <option value="Public Facilities">Public Facilities</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1">
                    Emergency Severity Level
                  </label>
                  <select
                    value={newSeverity}
                    onChange={(e) => setNewSeverity(e.target.value as any)}
                    className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500 font-medium"
                    required
                  >
                    <option value="low">Low - Minor Inconvenience</option>
                    <option value="medium">Medium - Standard Repair Queue</option>
                    <option value="high">High - Safety hazard</option>
                    <option value="critical">Critical - Active emergency danger</option>
                  </select>
                </div>
              </div>

              {/* Title input */}
              <div>
                <label className="block text-[10px] font-extrabold text-slate-400 uppercase tracking-widest mb-1 text-left">
                  Professional Report Title
                </label>
                <input
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Ruptured sewer line creating sidewalk overflow"
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:ring-1 focus:ring-indigo-500"
                  required
                />
              </div>

              {/* AI parameters previews if any generated */}
              {aiResult && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1.5 text-[11px] text-emerald-800">
                  <p className="font-extrabold uppercase text-[9px] text-emerald-700 flex items-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-emerald-600 animate-pulse" />
                    AI classification approved
                  </p>
                  <div>
                    <span className="font-bold">Proposed Fix Action:</span> "{aiResult.aiSuggestedFix}"
                  </div>
                  {aiResult.safetyNote && (
                    <div className="font-bold text-red-700">
                      ⚠️ Safety note: "{aiResult.safetyNote}"
                    </div>
                  )}
                </div>
              )}

              {/* Actions */}
              <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReportOpen(false)}
                  className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={aiAnalyzing}
                  className="px-6 py-2 bg-indigo-600 text-white font-extrabold rounded-xl hover:bg-indigo-700 active:scale-95 transition shadow-md shadow-indigo-100"
                >
                  Publish Civic Ticket
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Dynamic Login & Switch Citizen Identity Modal */}
      {isLoginModalOpen && (
        <div 
          id="login-modal-overlay"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fade-in"
        >
          <div 
            id="login-modal-box"
            className="bg-white rounded-3xl max-w-lg w-full p-6 md:p-8 shadow-2xl border border-slate-100 flex flex-col max-h-[85vh] overflow-hidden"
          >
            {/* Header */}
            <div className="flex justify-between items-start mb-5">
              <div>
                <span className="text-[10px] font-bold text-indigo-650 uppercase tracking-widest block mb-1 font-mono">Civic Access Point</span>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-600 shrink-0" />
                  Sign In / Switch Profile
                </h2>
                <p className="text-slate-500 text-xs mt-1">
                  Authenticate as an existing verified neighborhood guard, or register a new handle.
                </p>
              </div>
              <button 
                id="btn-close-login"
                onClick={() => setIsLoginModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-50 hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-600 transition"
              >
                ✕
              </button>
            </div>

            {/* Content scroller */}
            <div className="flex-1 overflow-y-auto space-y-6 pr-1">
              
              {/* Profile directory card sector */}
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 font-mono">
                  Select Existing Active Citizen
                </h3>
                {availableCitizens.length === 0 ? (
                  <p className="text-xs text-slate-400 italic">No registered citizens. Be the first!</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {availableCitizens.map((cit) => (
                      <button
                        key={cit.username}
                        onClick={() => handleSwitchLogin(cit.username)}
                        className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition duration-150 group cursor-pointer ${
                          profile?.username === cit.username 
                            ? "bg-indigo-50/70 border-indigo-200 ring-2 ring-indigo-600/10" 
                            : "bg-slate-50 hover:bg-slate-100/75 border-slate-200/60"
                        }`}
                      >
                        <div className="w-10 h-10 rounded-full bg-white border border-slate-200 shadow-sm shrink-0 overflow-hidden flex items-center justify-center">
                          <img 
                            src={`https://api.dicebear.com/7.x/bottts/svg?seed=${cit.username}`}
                            alt={cit.username}
                            className="w-8 h-8"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={`text-sm font-bold truncate ${profile?.username === cit.username ? "text-indigo-900" : "text-slate-800"}`}>
                            {cit.username}
                          </p>
                          <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-400 font-bold uppercase tracking-tight">
                            <span>Level {cit.level}</span>
                            <span>•</span>
                            <span className="text-indigo-600 font-extrabold">{cit.points} pts</span>
                          </div>
                        </div>
                        <div className="w-5 h-5 rounded-full border border-slate-200 bg-white items-center justify-center flex shrink-0 group-hover:border-indigo-300">
                          {profile?.username === cit.username ? (
                            <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                          ) : (
                            <div className="w-1.5 h-1.5 rounded-full bg-transparent group-hover:bg-slate-300 transition" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Create new Profile form sector */}
              <div className="border-t border-slate-100 pt-5">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Register New Civic Identity
                </h3>
                <p className="text-slate-500 text-[11px] mb-3">
                  This creates a brand-new profile, initialized with 0 influence points.
                </p>
                <form 
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSwitchLogin(loginInputUsername);
                  }}
                  className="flex gap-2"
                >
                  <div className="relative flex-1 min-w-0">
                    <input 
                      type="text"
                      placeholder="e.g. UrbanSpire99"
                      value={loginInputUsername}
                      onChange={(e) => {
                        const sanitized = e.target.value.replace(/[^a-zA-Z0-9_-]/g, "");
                        setLoginInputUsername(sanitized);
                      }}
                      maxLength={18}
                      className="w-full h-10 px-3 py-2 text-sm bg-slate-50 hover:bg-slate-100/50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-650 transition placeholder-slate-400"
                    />
                  </div>
                  <button
                    type="submit"
                    className="h-10 px-4 text-xs font-extrabold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-95 transition rounded-xl flex items-center justify-center cursor-pointer shrink-0"
                  >
                    Register Handle
                  </button>
                </form>
                {authError && (
                  <p className="text-rose-600 text-xs mt-2 font-semibold">⚠️ {authError}</p>
                )}
              </div>

            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
              <span className="font-mono">SmartCity Node auth://v1</span>
              <button 
                onClick={() => setIsLoginModalOpen(false)}
                className="px-4 py-2 hover:bg-slate-50 hover:text-slate-600 font-bold rounded-xl transition cursor-pointer"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
