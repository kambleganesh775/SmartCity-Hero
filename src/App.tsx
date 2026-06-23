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
  Heart
} from "lucide-react";
import { Issue, UserProfile, CivicInsights, AIAnalysisResult } from "./types";

export default function App() {
  // Application State
  const [issues, setIssues] = useState<Issue[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [insights, setInsights] = useState<CivicInsights | null>(null);
  const [loadingInsights, setLoadingInsights] = useState<boolean>(false);
  const [loadingIssues, setLoadingIssues] = useState<boolean>(false);
  
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
  const [newLat, setNewLat] = useState<number>(34.0582);
  const [newLng, setNewLng] = useState<number>(-118.2581);
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
  // Default Map center reference representing Los Angeles Downtown area coordinates matching back-end seeds
  const MAP_LAT_MIN = 34.0300;
  const MAP_LAT_MAX = 34.0750;
  const MAP_LNG_MIN = -118.2750;
  const MAP_LNG_MAX = -118.2250;

  // Notification Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" | "info" } | null>(null);

  const triggerToast = (message: string, type: "success" | "error" | "info" = "success") => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  // Fetch static endpoints
  useEffect(() => {
    fetchIssues();
    fetchProfile();
    fetchInsights();
  }, []);

  const fetchIssues = async () => {
    setLoadingIssues(true);
    try {
      const res = await fetch("/api/issues");
      if (res.ok) {
        const data = await res.json();
        setIssues(data);
        // Default to first issue if none selected
        if (data.length > 0 && !selectedIssueId) {
          setSelectedIssueId(data[0].id);
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

  const fetchInsights = async () => {
    setLoadingInsights(true);
    try {
      const res = await fetch("/api/ai/insights");
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
          aiSuggestedFix: aiResult?.aiSuggestedFix || "Inspection scheduled by utility services."
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
        fetchInsights();
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

  // Interactive Maps click simulator: Convert click on the container element relative-pixel vectors to Latitude and Longitude values
  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapContainerRef.current) return;
    const rect = mapContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Percentage ratios
    const ratioX = x / rect.width;
    const ratioY = y / rect.height;

    // Estimate coordinates
    const calcLng = MAP_LNG_MIN + ratioX * (MAP_LNG_MAX - MAP_LNG_MIN);
    const calcLat = MAP_LAT_MAX - ratioY * (MAP_LAT_MAX - MAP_LAT_MIN); // Invert Y as Latitude increases upward.

    setNewLat(parseFloat(calcLat.toFixed(5)));
    setNewLng(parseFloat(calcLng.toFixed(5)));
    setNewLocationName(`Near Landmark at coordinates Point (${calcLat.toFixed(4)}, ${calcLng.toFixed(4)})`);
    
    // Open reporting model and direct user
    setIsReportOpen(true);
    triggerToast(`Location pin placed at ${calcLat.toFixed(4)}, ${calcLng.toFixed(4)}. File details below!`, "info");
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
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">SmartCity<span className="text-indigo-600">Hero</span></h1>
              <span className="px-2 py-0.5 bg-indigo-50 text-[10px] text-indigo-700 font-bold rounded-md uppercase tracking-wider">MURAL-HQ</span>
            </div>
            <p className="text-[10.5px] text-slate-500 font-semibold tracking-wide">Report. Verify. Resolve. Build a Smarter City Together. 🚀🏙️</p>
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
          
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs font-bold text-slate-800 leading-tight">{profile?.username || "Guest User"}</p>
              <p className="text-[10px] text-indigo-600 font-extrabold uppercase mt-0.5">LEVEL {profile?.level || 1} CITIZEN</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-slate-200 border border-slate-200 shadow overflow-hidden relative group shrink-0">
              <img 
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150" 
                alt="User" 
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-indigo-600/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Award className="w-4 h-4 text-white" />
              </div>
            </div>
          </div>
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
                className="absolute inset-0 z-0 bg-slate-100 cursor-crosshair transition-all duration-300"
                style={{
                  backgroundImage: "radial-gradient(#cbd5e1 2px, transparent 2px)",
                  backgroundSize: "32px 32px",
                }}
                onClick={handleMapClick}
                ref={mapContainerRef}
              >
                {/* Simulated Parks, Rivers and Roads landmarks vector shapes background */}
                <div className="absolute top-1/4 left-1/4 w-40 h-32 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 pointer-events-none" />
                <div className="absolute bottom-1/4 right-1/4 w-52 h-44 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-60 pointer-events-none" />
                <div className="absolute top-1/2 left-1/3 w-36 h-28 bg-indigo-100 rounded-full mix-blend-multiply filter blur-xl opacity-50 pointer-events-none" />
                
                {/* Map Grid Roads Visualization */}
                <div className="absolute top-[40%] left-0 w-full h-[6px] bg-slate-200/80 -rotate-2 pointer-events-none" />
                <div className="absolute top-[70%] left-0 w-full h-[8px] bg-slate-200/80 rotate-3 pointer-events-none" />
                <div className="absolute left-[30%] top-0 h-full w-[6px] bg-slate-200/80 rotate-12 pointer-events-none" />
                <div className="absolute left-[65%] top-0 h-full w-[8px] bg-slate-200/80 -rotate-12 pointer-events-none" />

                {/* Simulated Labels */}
                <span className="absolute top-8 left-12 text-[10px] font-bold text-slate-400 bg-slate-50/80 px-2 py-0.5 rounded shadow-sm opacity-60 select-none">Downtown East Recreation Hub</span>
                <span className="absolute bottom-12 right-20 text-[10px] font-bold text-slate-400 bg-slate-50/80 px-2 py-0.5 rounded shadow-sm opacity-60 select-none">District 12 Maplewood Park</span>
                <span className="absolute top-1/2 right-12 text-[10px] font-bold text-slate-400 bg-slate-50/80 px-2 py-0.5 rounded shadow-sm opacity-60 select-none">Brook Lane Corridor</span>

                <div className="absolute top-2 left-2 bg-slate-800/85 text-white font-mono text-[9px] px-2 py-1 rounded">
                  Map Range: {MAP_LAT_MIN.toFixed(4)} N - {MAP_LAT_MAX.toFixed(4)} N
                </div>

                {/* PLOTTED ISSUE MARKERS */}
                {issues.map(issue => {
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
                      id={`map-marker-${issue.id}`}
                      key={issue.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedIssueId(issue.id);
                        triggerToast(`Inspecting report: ${issue.title}`, "info");
                      }}
                      className="absolute group z-10 transition-transform hover:scale-125"
                      style={{
                        left: `${x}%`,
                        top: `${y}%`,
                        transform: "translate(-50%, -50%)"
                      }}
                    >
                      {/* Ring pulsing for highlighted selection */}
                      {isSelected && (
                        <div className="absolute -inset-4 rounded-full bg-indigo-600/30 animate-pulse pointer-events-none" />
                      )}

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
                    </div>
                  );
                })}
              </div>

              {/* Map HUD Overlay Banner top-right */}
              <div id="map-dashboard-hud" className="absolute top-6 right-6 z-10 flex flex-col gap-2.5 max-w-xs pointer-events-auto">
                <div className="bg-white/90 backdrop-blur p-4 rounded-2xl shadow-lg border border-white/50 w-48">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">AI Priority Queue</p>
                  
                  <div className="mt-2.5 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1"> Water safety</span>
                      <span className="text-[11px] font-bold text-red-600">98%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1"> Street safety</span>
                      <span className="text-[11px] font-bold text-amber-600">72%</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[11px] font-medium text-slate-700 flex items-center gap-1"> Environment</span>
                      <span className="text-[11px] font-bold text-green-600">14%</span>
                    </div>
                  </div>
                </div>

                <button
                  id="btn-report-modal"
                  onClick={() => setIsReportOpen(true)}
                  className="bg-indigo-600 text-white px-6 py-4 rounded-2xl shadow-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition active:scale-95 text-xs text-center border-b-2 border-indigo-800"
                >
                  <Plus className="w-5 h-5 text-white" />
                  REPORT NEW ISSUE
                </button>
              </div>

              {/* Map instructions overlay HUD bottom-left */}
              <div className="absolute bottom-6 left-6 flex gap-4 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-slate-200/50 text-xs text-slate-650">
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <div className="w-2 h-2 rounded-full bg-red-500" /> Critical
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <div className="w-2 h-2 rounded-full bg-amber-500" /> In Review
                </div>
                <div className="flex items-center gap-2 text-[10px] font-bold">
                  <div className="w-2 h-2 rounded-full bg-green-500" /> Resolved
                </div>
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
                <p className="text-sm font-bold text-slate-800 mt-1">Intersection of Brook Lane & Elm Drive</p>
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
                  Road issues clustering near Outer North loop curve!
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
                <p className="text-xl font-black text-slate-800 mt-1">$450,000</p>
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
                    <p className="font-bold text-slate-800">Swift Asphalt Repair & Co.</p>
                    <p className="text-slate-400 text-[11px]">Primary responder: Roads, Potholes, Sidewalk concrete cracking</p>
                  </div>
                  <div>
                    <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 font-bold rounded-lg text-[10px] uppercase">
                      Contract Active - 4 Crews
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-bold text-slate-800">HydroShield Utility Engineering</p>
                    <p className="text-slate-400 text-[11px]">Primary responder: Water main breaks, sewer overflow, stormwater drainage</p>
                  </div>
                  <div>
                    <span className="px-2.5 py-1 bg-amber-50 text-amber-700 font-bold rounded-lg text-[10px] uppercase">
                      On-call - Emergency mode
                    </span>
                  </div>
                </div>

                <div className="p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <p className="font-bold text-slate-800">LumeGrid Power Contractors</p>
                    <p className="text-slate-400 text-[11px]">Primary responder: Damaged street lights, transformer noise, public power boxes</p>
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

    </div>
  );
}
