import { createFileRoute } from "@tanstack/react-router";
import { PageShell } from "@/components/page-shell";
import { fetchJson, type Method } from "@/lib/api-client";
import { JsonView } from "@/components/json-view";
import { useApp } from "@/lib/mode-context";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Hash,
  KeyRound,
  Loader2,
  Lock,
  ServerCrash,
  ShieldAlert,
  TerminalSquare,
  Trash2,
  Play,
  Pencil,
  PlusCircle,
} from "lucide-react";

export const Route = createFileRoute("/dev/")({
  head: () => ({
    meta: [
      { title: "Developer Console - Zeyad Mohammed" },
      { name: "description", content: "Interactive API console with live requests and polished developer UX." },
    ],
  }),
  component: Explorer,
});

type StateKind = "success" | "validation" | "auth" | "forbidden" | "server";

interface ApiResponse {
  status: number;
  headers: Record<string, string>;
  body: unknown;
  ms?: number;
}

interface Scenario {
  kind: StateKind;
  label: string;
  hint: string;
  build: (ctx: { token: string | null; adminToken: string | null }) => {
    method: Method;
    url: string;
    headers?: Record<string, string>;
    body?: string;
  };
}

interface EndpointCard {
  id: string;
  group: string;
  method: Method;
  path: string;
  summary: string;
  scenarios: Scenario[];
}

const json = (value: unknown) => JSON.stringify(value, null, 2);
const authHeader = (token: string | null | undefined): Record<string, string> => (token ? { Authorization: `Bearer ${token}` } : {});

const endpointCards: EndpointCard[] = [
  {
    id: "list-projects",
    group: "Public",
    method: "GET",
    path: "/api/projects",
    summary: "Fetches the public project collection for the portfolio.",
    scenarios: [
      {
        kind: "success",
        label: "List projects",
        hint: "Public route with no authentication required.",
        build: () => ({ method: "GET", url: "/api/projects" }),
      },
    ],
  },
  {
    id: "list-education",
    group: "Public",
    method: "GET",
    path: "/api/education",
    summary: "Retrieves the educational background timeline.",
    scenarios: [
      {
        kind: "success",
        label: "List education",
        hint: "Returns a sorted list of academic achievements.",
        build: () => ({ method: "GET", url: "/api/education" }),
      },
    ],
  },
  {
    id: "contact",
    group: "Public",
    method: "POST",
    path: "/api/contact",
    summary: "Sends a contact request with server-side validation.",
    scenarios: [
      {
        kind: "success",
        label: "Valid submission",
        hint: "Shows the happy path for the contact form.",
        build: () => ({
          method: "POST",
          url: "/api/contact",
          headers: { "content-type": "application/json" },
          body: json({
            name: "Jenny Doe",
            email: "jenny@example.com",
            message: "I want a premium portfolio redesign and advanced dev pages.",
          }),
        }),
      },
      {
        kind: "validation",
        label: "Validation error",
        hint: "Demonstrates backend field validation.",
        build: () => ({
          method: "POST",
          url: "/api/contact",
          headers: { "content-type": "application/json" },
          body: json({ name: "A", email: "bad-email", message: "short" }),
        }),
      },
    ],
  },
  {
    id: "auth",
    group: "Auth",
    method: "POST",
    path: "/api/auth/login",
    summary: "Gets a JWT token for the console and admin endpoints.",
    scenarios: [
      {
        kind: "success",
        label: "Login demo user",
        hint: "Saves a token in the current app session.",
        build: () => ({
          method: "POST",
          url: "/api/auth/login",
          headers: { "content-type": "application/json" },
          body: json({ email: "demo", password: "demo1234" }),
        }),
      },
    ],
  },
  {
    id: "admin-projects",
    group: "Admin",
    method: "GET",
    path: "/api/admin/projects",
    summary: "Tests an authenticated admin route using the stored token.",
    scenarios: [
      {
        kind: "success",
        label: "Admin access",
        hint: "Uses an admin token when available.",
        build: ({ adminToken }) => ({ method: "GET", url: "/api/admin/projects", headers: authHeader(adminToken) }),
      },
      {
        kind: "success",
        label: "Create Project",
        hint: "Demonstrates project creation payload.",
        build: ({ adminToken }) => ({ 
          method: "POST", 
          url: "/api/admin/projects", 
          headers: { ...authHeader(adminToken), "Content-Type": "application/json" },
          body: json({
            name: "New System",
            tagline: "Building the future of digital architecture.",
            description: "A deep dive into resilient infrastructure.",
            type: "fullstack",
            stack: ["React", ".NET", "PostgreSQL"],
            year: 2024,
            repo: "github.com/zeyad/new-system",
            url: "new-system.dev"
          })
        }),
      },
      {
        kind: "success",
        label: "Update Project",
        hint: "Modify an existing project. Replace {id} with real ID.",
        build: ({ adminToken }) => ({ 
          method: "PUT", 
          url: "/api/admin/projects/1", 
          headers: { ...authHeader(adminToken), "Content-Type": "application/json" },
          body: json({
            name: "Updated System Name",
            tagline: "The evolved digital architecture.",
            description: "Deep dive into resilience.",
            type: "fullstack",
            stack: ["React", "Go", "PostgreSQL"],
            year: 2024,
            repo: "github.com/zeyad/updated-system",
            url: "updated-system.dev"
          })
        }),
      },
      {
        kind: "forbidden",
        label: "Delete Project",
        hint: "Remove a project from the portfolio.",
        build: ({ adminToken }) => ({ 
          method: "DELETE", 
          url: "/api/admin/projects/1", 
          headers: authHeader(adminToken)
        }),
      },
    ],
  },
  {
    id: "admin-upload",
    group: "Admin",
    method: "POST",
    path: "/api/admin/upload",
    summary: "Upload binary assets (images) to the edge storage.",
    scenarios: [
      {
        kind: "success",
        label: "Upload Image",
        hint: "Multipart/form-data upload simulation.",
        build: ({ adminToken }) => ({ 
          method: "POST", 
          url: "/api/admin/upload", 
          headers: authHeader(adminToken),
        }),
      },
    ],
  },
  {
    id: "admin-education",
    group: "Admin",
    method: "GET",
    path: "/api/admin/education",
    summary: "Fetch all education records including non-public metadata.",
    scenarios: [
      {
        kind: "success",
        label: "Admin list",
        hint: "Full access to educational database.",
        build: ({ adminToken }) => ({ method: "GET", url: "/api/admin/education", headers: authHeader(adminToken) }),
      },
      {
        kind: "success",
        label: "Create Course",
        hint: "Add a new academic record.",
        build: ({ adminToken }) => ({ 
          method: "POST", 
          url: "/api/admin/education", 
          headers: { ...authHeader(adminToken), "Content-Type": "application/json" },
          body: json({
            school: "New University",
            degree: "Master of Science in Software Engineering",
            year: "2024 - 2026",
          })
        }),
      },
      {
        kind: "success",
        label: "Update Course",
        hint: "Modify an existing education record. Replace {id} with real ID.",
        build: ({ adminToken }) => ({ 
          method: "PUT", 
          url: "/api/admin/education/1", 
          headers: { ...authHeader(adminToken), "Content-Type": "application/json" },
          body: json({
            school: "Updated School Name",
            degree: "Bachelors of Computer Science",
            year: "2020 - 2024",
          })
        }),
      },
      {
        kind: "forbidden",
        label: "Delete Course",
        hint: "Remove a record from the database.",
        build: ({ adminToken }) => ({ 
          method: "DELETE", 
          url: "/api/admin/education/1", 
          headers: authHeader(adminToken)
        }),
      },
    ],
  },
  {
    id: "admin-messages",
    group: "Admin",
    method: "GET",
    path: "/api/admin/contact",
    summary: "Review incoming contact messages from the database.",
    scenarios: [
      {
        kind: "success",
        label: "Fetch inbox",
        hint: "Returns all unread and archived messages.",
        build: ({ adminToken }) => ({ method: "GET", url: "/api/admin/contact", headers: authHeader(adminToken) }),
      },
    ],
  },
  {
    id: "admin-stats",
    group: "Admin",
    method: "GET",
    path: "/api/admin/stats",
    summary: "Fetch global system statistics and node counts.",
    scenarios: [
      {
        kind: "success",
        label: "Get stats",
        hint: "Returns project, education, and contact metrics.",
        build: ({ adminToken }) => ({ method: "GET", url: "/api/admin/stats", headers: authHeader(adminToken) }),
      },
    ],
  },
  {
    id: "boom",
    group: "Debug",
    method: "GET",
    path: "/api/debug/boom",
    summary: "Intentional error route for observing error envelopes.",
    scenarios: [
      {
        kind: "server",
        label: "Trigger server error",
        hint: "Useful for verifying error states and payload shape.",
        build: () => ({ method: "GET", url: "/api/debug/boom" }),
      },
    ],
  },
];

const kindIcon: Record<StateKind, typeof CheckCircle2> = {
  success: CheckCircle2,
  validation: ShieldAlert,
  auth: Lock,
  forbidden: ShieldAlert,
  server: ServerCrash,
};

// Per-scenario mutable state: body text + resource ID
interface ScenarioState { resourceId: string; body: string; }

function Explorer() {
  const { token, setToken, user } = useApp();
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [activeEndpointId, setActiveEndpointId] = useState(endpointCards[0].id);
  const [activeScenarioIdx, setActiveScenarioIdx] = useState<number | "custom">(0);
  const [responses, setResponses] = useState<Record<string, ApiResponse>>({});
  const [busy, setBusy] = useState<string | null>(null);
  const [customBody, setCustomBody] = useState("");
  const [scenarioStates, setScenarioStates] = useState<Record<string, ScenarioState>>({});

  const activeEndpoint = useMemo(
    () => endpointCards.find((card) => card.id === activeEndpointId) ?? endpointCards[0],
    [activeEndpointId],
  );

  // Initialise custom body when endpoint changes
  useEffect(() => {
    try {
      const defaultScen = activeEndpoint.scenarios.find(s => s.build({ token: null, adminToken: null }).body);
      setCustomBody(defaultScen?.build({ token: null, adminToken: null }).body ?? "{\n  \n}");
    } catch {
      setCustomBody("{\n  \n}");
    }
  }, [activeEndpointId]);

  // Initialise per-scenario state (body + id) when endpoint changes
  useEffect(() => {
    setScenarioStates(prev => {
      const next = { ...prev };
      activeEndpoint.scenarios.forEach((scenario, i) => {
        const key = `${activeEndpointId}:${i}`;
        if (!next[key]) {
          const built = scenario.build({ token: null, adminToken: null });
          next[key] = { resourceId: "1", body: built.body ?? "{\n  \n}" };
        }
      });
      return next;
    });
  }, [activeEndpointId]);

  function getScenState(scenIdx: number): ScenarioState {
    return scenarioStates[`${activeEndpointId}:${scenIdx}`] ?? { resourceId: "1", body: "{\n  \n}" };
  }

  function setScenField(scenIdx: number, field: keyof ScenarioState, value: string) {
    const key = `${activeEndpointId}:${scenIdx}`;
    setScenarioStates(prev => ({ ...prev, [key]: { ...getScenState(scenIdx), [field]: value } }));
  }

  async function ensureAdminToken() {
    if (adminToken) return adminToken;
    try {
      const result = await fetchJson<{ token: string }>("POST", "/api/auth/login", {
        email: "zeyad.shosha@outlook.com",
        password: "admin1234",
      });
      if (result?.token) {
        setAdminToken(result.token);
        return result.token;
      }
    } catch {
      return null;
    }
    return null;
  }

  async function trigger(scenarioIndex: number | "custom") {
    const key = `${activeEndpoint.id}:${scenarioIndex}`;
    setBusy(key);
    setActiveScenarioIdx(scenarioIndex);

    let resolvedAdminToken = adminToken;
    const isAdminRoute = activeEndpoint.group === "Admin";
    if (isAdminRoute && !resolvedAdminToken) {
      resolvedAdminToken = await ensureAdminToken();
    }

    let builtMethod = activeEndpoint.method;
    let builtUrl = activeEndpoint.path;
    let builtHeaders: Record<string, string> = { "Content-Type": "application/json" };
    let builtBody: string | undefined = undefined;

    if (scenarioIndex === "custom") {
      Object.assign(builtHeaders, authHeader(resolvedAdminToken || token));
      if (["POST", "PUT", "PATCH"].includes(activeEndpoint.method)) {
        builtBody = customBody;
      }
    } else {
      const built = activeEndpoint.scenarios[scenarioIndex].build({ token, adminToken: resolvedAdminToken });
      builtMethod = built.method;
      builtUrl = built.url;
      if (built.headers) Object.assign(builtHeaders, built.headers);

      // Use per-scenario body if user edited it
      const scenState = getScenState(scenarioIndex);
      if (["POST", "PUT", "PATCH"].includes(builtMethod)) {
        builtBody = scenState.body || built.body;
      }
      // Replace placeholder ID in URL with user-supplied ID
      if (scenState.resourceId && /\/\d+(\/.*)?$/.test(builtUrl)) {
        builtUrl = builtUrl.replace(/(\/)(\d+)(\/.*)?$/, `$1${scenState.resourceId}$3`);
      }
    }

    const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? "https://zeyadportfolio.runasp.net";
    let urlPath = builtUrl;
    if (urlPath.startsWith("/api/") && !urlPath.startsWith("/api/v1/")) {
      urlPath = urlPath.replace("/api/", "/api/v1/");
    }

    try {
      const started = performance.now();
      const response = await fetch(`${apiBaseUrl}${urlPath}`, {
        method: builtMethod,
        headers: builtHeaders,
        body: builtBody,
      });
      const text = await response.text();
      let body: unknown = text;
      try {
        body = text ? JSON.parse(text) : {};
      } catch {
        body = text;
      }

      const payload = {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        body,
        ms: Math.round(performance.now() - started),
      };
      setResponses((previous) => ({ ...previous, [key]: payload }));

      if (activeEndpoint.id === "auth" && response.ok) {
        const authToken = (body as { data?: { accessToken?: string }; token?: string })?.data?.accessToken
          ?? (body as { token?: string })?.token;
        if (authToken) setToken(authToken);
      }
    } catch (error) {
      setResponses((previous) => ({
        ...previous,
        [key]: { status: 0, headers: {}, body: (error as Error).message, ms: 0 },
      }));
    } finally {
      setBusy(null);
    }
  }

  const activeResponse = responses[`${activeEndpoint.id}:${activeScenarioIdx}`];

  return (
    <PageShell>
      <div className="pb-24">
        <section className="responsive-shell pt-20 lg:pt-32 pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="pill-label mb-8"
          >
            <span className="h-2 w-2 rounded-full bg-primary" />
            Developer Tools
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-5xl sm:text-6xl lg:text-7xl tracking-tight leading-[0.9] text-foreground mb-4"
          >
            Postman, but <span className="text-muted-foreground italic">better</span>.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-lg text-muted-foreground font-medium leading-relaxed max-w-2xl"
          >
            Construct requests, test payloads, and verify real-time responses in an advanced dev interface.
          </motion.p>
        </section>

        <section className="responsive-shell pt-8">
          <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
            {/* Left Sidebar */}
            <div className="flex flex-col gap-6">
              {/* Auth Status */}
              <div className="rounded-3xl bg-surface p-5 flex items-center gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-background/50 text-muted-foreground">
                  <KeyRound className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">
                    Authentication
                  </div>
                  <div className="text-sm font-medium text-foreground truncate max-w-[180px]">
                    {user ? `${user.username} [${user.role}]` : "Unauthenticated"}
                  </div>
                </div>
              </div>

              {/* Endpoints List */}
              <div className="rounded-[2.5rem] bg-surface p-4">
                <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-4 py-3 mb-2">
                  Endpoints Directory
                </div>
                <div className="flex flex-col gap-2">
                  {endpointCards.map((card) => {
                    const active = card.id === activeEndpointId;
                    return (
                      <button
                        key={card.id}
                        onClick={() => {
                          setActiveEndpointId(card.id);
                          setActiveScenarioIdx(0);
                        }}
                        className={`flex w-full items-center justify-between gap-3 rounded-2xl p-4 text-left transition-all ${
                          active
                            ? "bg-primary/10 text-primary"
                            : "text-muted-foreground hover:bg-background/50 hover:text-foreground"
                        }`}
                      >
                        <div>
                          <div className={`text-[10px] font-semibold uppercase tracking-wider mb-1 ${active ? "text-primary/70" : "opacity-60"}`}>
                            {card.group}
                          </div>
                          <div className={`text-sm font-medium ${active ? "text-primary" : "text-foreground"}`}>
                            {card.path}
                          </div>
                        </div>
                        <div className={`text-[10px] font-semibold uppercase tracking-wider px-2 py-1 rounded-md ${active ? "bg-primary/20" : "bg-background/50"}`}>
                          {card.method}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Main Panel */}
            <div className="flex flex-col gap-6">
              {/* Request Builder */}
              <div className="rounded-[2.5rem] bg-surface p-6 sm:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <span className="inline-flex items-center px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-wider">
                    {activeEndpoint.group}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 mb-6">
                  <div className="flex flex-1 items-center rounded-2xl bg-background/50 border border-white/5 overflow-hidden p-1.5">
                    <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-surface rounded-xl">
                      {activeEndpoint.method}
                    </div>
                    <div className="px-4 py-2 text-sm font-medium text-foreground font-mono truncate">
                      {activeEndpoint.path}
                    </div>
                  </div>
                  <button
                    onClick={() => trigger("custom")}
                    disabled={Boolean(busy)}
                    className="pill-button shrink-0 h-12"
                  >
                    {busy === `${activeEndpoint.id}:custom` ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Play className="h-4 w-4 mr-2 fill-current" />
                    )}
                    Send Request
                  </button>
                </div>

                <p className="text-sm font-medium text-muted-foreground mb-8">
                  {activeEndpoint.summary}
                </p>

                {["POST", "PUT", "PATCH"].includes(activeEndpoint.method) && (
                  <div className="mb-8">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                      Request Body (JSON)
                    </h3>
                    <textarea
                      value={customBody}
                      onChange={(e) => setCustomBody(e.target.value)}
                      className="w-full h-48 rounded-2xl bg-background/50 border border-white/5 p-5 font-mono text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 focus:border-primary/50 resize-y custom-scrollbar"
                      spellCheck={false}
                    />
                  </div>
                )}

                <div className="pt-6 border-t border-white/5">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                    Quick Scenarios
                  </h3>
                  <div className="flex flex-col gap-4">
                    {activeEndpoint.scenarios.map((scenario, index) => {
                      const Icon = kindIcon[scenario.kind];
                      const key = `${activeEndpoint.id}:${index}`;
                      const isBusy = busy === key;
                      const built0 = scenario.build({ token: null, adminToken: null });
                      const scenMethod = built0.method;
                      const needsId = /\/\d+(\/.*)?$/.test(built0.url);
                      const needsBody = ["POST", "PUT", "PATCH"].includes(scenMethod);
                      const isDelete = scenMethod === "DELETE";
                      const isUpdate = scenMethod === "PUT" || scenMethod === "PATCH";
                      const scenState = getScenState(index);

                      const methodColors: Record<string, string> = {
                        GET: "text-green-400 bg-green-400/10",
                        POST: "text-blue-400 bg-blue-400/10",
                        PUT: "text-amber-400 bg-amber-400/10",
                        PATCH: "text-amber-400 bg-amber-400/10",
                        DELETE: "text-red-400 bg-red-400/10",
                      };

                      const ScenIcon = isDelete ? Trash2 : isUpdate ? Pencil : needsBody ? PlusCircle : Icon;

                      return (
                        <div key={scenario.label} className="rounded-2xl bg-background/50 border border-white/5 p-6 flex flex-col gap-5 group hover:border-white/10 transition-colors">
                          {/* Header */}
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className={`flex items-center justify-center w-9 h-9 rounded-full ${isDelete ? "bg-red-400/10" : isUpdate ? "bg-amber-400/10" : "bg-surface"}`}>
                                <ScenIcon className={`h-4 w-4 ${isDelete ? "text-red-400" : isUpdate ? "text-amber-400" : "text-primary"}`} />
                              </div>
                              <div>
                                <p className="text-sm font-semibold leading-tight">{scenario.label}</p>
                                <p className="text-xs font-medium text-muted-foreground mt-0.5">{scenario.hint}</p>
                              </div>
                            </div>
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-md shrink-0 ${methodColors[scenMethod] ?? "bg-surface text-muted-foreground"}`}>
                              {scenMethod}
                            </span>
                          </div>

                          {/* URL Preview */}
                          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-black/20 border border-white/5 font-mono text-xs text-muted-foreground">
                            <span className="text-primary/60 shrink-0">URL</span>
                            <span className="truncate">{built0.url.replace(/\/\d+/, needsId ? `/{id}` : "" )}</span>
                          </div>

                          {/* ID Input — for PUT / DELETE routes with a numeric segment */}
                          {needsId && (
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1.5">
                                <Hash className="h-3 w-3" /> Resource ID
                              </label>
                              <input
                                type="text"
                                value={scenState.resourceId}
                                onChange={e => setScenField(index, "resourceId", e.target.value)}
                                placeholder="e.g. 1, abc-123"
                                className="w-full rounded-xl bg-black/30 border border-white/5 px-4 py-2.5 font-mono text-sm text-foreground placeholder:text-muted-foreground/30 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all"
                              />
                            </div>
                          )}

                          {/* Body Editor — for POST / PUT / PATCH */}
                          {needsBody && (
                            <div className="flex flex-col gap-1.5">
                              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                                Request Body (JSON)
                              </label>
                              <textarea
                                value={scenState.body}
                                onChange={e => setScenField(index, "body", e.target.value)}
                                rows={6}
                                spellCheck={false}
                                className="w-full rounded-xl bg-black/30 border border-white/5 px-4 py-3 font-mono text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y transition-all custom-scrollbar"
                              />
                            </div>
                          )}

                          {/* Run Button */}
                          <button
                            onClick={() => trigger(index)}
                            disabled={Boolean(busy)}
                            className={`self-start h-9 px-5 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${
                              isDelete
                                ? "bg-red-500/10 text-red-400 hover:bg-red-500/20"
                                : "bg-primary/10 text-primary hover:bg-primary/20"
                            } disabled:opacity-40`}
                          >
                            {isBusy ? (
                              <><Loader2 className="h-3 w-3 animate-spin" /> Running...</>
                            ) : (
                              <><Play className="h-3 w-3 fill-current" /> Run</>  
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Response Panel */}
              <div className="rounded-[2.5rem] bg-surface p-6 sm:p-10 flex flex-col min-h-[400px]">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-foreground">
                    Response
                  </h3>
                  {activeResponse && (
                    <div className="flex items-center gap-3">
                      <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        activeResponse.status >= 400 
                          ? "bg-destructive/10 text-destructive" 
                          : "bg-success/10 text-success"
                      }`}>
                        {activeResponse.status}
                      </div>
                      <div className="px-3 py-1 rounded-full bg-background/50 text-xs font-medium text-muted-foreground">
                        {activeResponse.ms}ms
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 rounded-2xl bg-[#FBFBF9] border border-border p-6 overflow-hidden flex flex-col">
                  {activeResponse ? (
                    <div className="flex-1 overflow-auto custom-scrollbar text-sm text-[#1A1A1A]">
                      <JsonView data={activeResponse.body} />
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center">
                      <div className="flex items-center gap-3 text-[#71717A]/50 text-sm font-semibold uppercase tracking-widest">
                        <TerminalSquare className="h-5 w-5" />
                        Awaiting Request
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </PageShell>
  );
}
