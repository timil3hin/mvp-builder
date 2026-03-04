import { useState, useEffect } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Search, 
  FileText, 
  Cpu, 
  Terminal, 
  Save, 
  Plus, 
  CheckCircle2, 
  ChevronRight, 
  ChevronLeft,
  Copy,
  Download,
  Loader2,
  AlertCircle,
  Sparkles,
  Layout,
  Layers,
  Monitor
} from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** Utility for Tailwind class merging */
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// ─── Constants & Types ───────────────────────────────────────────────────────

const USER_TYPES = [
  { id: "A", name: "Vibe-Coder", desc: "Great ideas, limited coding experience", icon: Sparkles },
  { id: "B", name: "Developer", desc: "Experienced programmer", icon: Terminal },
  { id: "C", name: "In Between", desc: "Some coding knowledge, still learning", icon: Cpu },
];

const AI_TOOLS = [
  { id: "claude-code", name: "Claude Code", desc: "Terminal agent with session memory" },
  { id: "cursor", name: "Cursor", desc: "AI-powered IDE, reads .cursorrules" },
  { id: "gemini-cli", name: "Gemini CLI", desc: "Free open-source terminal agent" },
  { id: "antigravity", name: "Antigravity", desc: "Agent-first IDE by Google" },
  { id: "copilot", name: "GitHub Copilot", desc: "VS Code AI extension" },
  { id: "lovable", name: "Lovable / v0", desc: "No-code AI builders" },
];

const PART_LABELS = [
  { num: "01", name: "Research Prompt", icon: Search },
  { num: "02", name: "PRD", icon: FileText },
  { num: "03", name: "Tech Design", icon: Layout },
  { num: "04", name: "AGENTS.md", icon: Layers },
];

// ─── LLM Helpers ─────────────────────────────────────────────────────────────

async function callLLM(systemPrompt, userMessage, settings) {
  const { provider, apiKey } = settings;
  if (!apiKey) throw new Error('API key is missing. Please set it in the settings.');

  const commonHeaders = { 'Content-Type': 'application/json' };
  let url, headers, body;

  switch (provider) {
    case 'claude':
      url = 'https://api.anthropic.com/v1/messages';
      headers = { ...commonHeaders, 'x-api-key': apiKey, 'anthropic-version': '2023-06-01' };
      body = JSON.stringify({
        model: 'claude-3-sonnet-20241022',
        max_tokens: 8000,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      });
      break;
    case 'gemini': {
      url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      headers = commonHeaders;
      const fullPrompt = `${systemPrompt}\n\n${userMessage}`;
      body = JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { maxOutputTokens: 8000 },
      });
      break;
    }
    case 'groq':
      url = 'https://api.groq.com/openai/v1/chat/completions';
      headers = { ...commonHeaders, 'Authorization': `Bearer ${apiKey}` };
      body = JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
        max_tokens: 8000,
      });
      break;
    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  const response = await fetch(url, { method: 'POST', headers, body });
  const data = await response.json();
  if (!response.ok) throw new Error(`${provider} API error: ${data.error?.message || JSON.stringify(data)}`);

  if (provider === 'claude') return data.content?.map(b => b.text).join('') || '';
  if (provider === 'gemini') return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  if (provider === 'groq') return data.choices?.[0]?.message?.content || '';
  return '';
}

// ─── UI Components ───────────────────────────────────────────────────────────

function SettingsPanel({ settings, onSave, onClose }) {
  const [localSettings, setLocalSettings] = useState(settings);
  const providers = [
    { id: 'claude', name: 'Claude (Anthropic)' },
    { id: 'gemini', name: 'Gemini (Google)' },
    { id: 'groq', name: 'Groq (Llama 3)' },
  ];

  return (
    <Motion.div 
      initial={{ x: 320 }} animate={{ x: 0 }} exit={{ x: 320 }}
      className="fixed inset-y-0 right-0 w-80 bg-slate-900 border-l border-white/5 z-50 p-6 shadow-2xl overflow-y-auto"
    >
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings className="w-5 h-5 text-primary" /> Settings
        </h3>
        <button onClick={onClose} className="btn-ghost p-1">✕</button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">Provider</label>
          <select
            value={localSettings.provider}
            onChange={e => setLocalSettings(p => ({ ...p, provider: e.target.value }))}
            className="input-base py-2.5 text-sm"
          >
            {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-400 uppercase tracking-wider mb-2">API Key</label>
          <input
            type="password"
            value={localSettings.apiKey}
            onChange={e => setLocalSettings(p => ({ ...p, apiKey: e.target.value }))}
            placeholder="sk-..."
            className="input-base py-2.5 text-sm"
          />
          <p className="text-[10px] text-slate-500 mt-2">Stored locally in your browser.</p>
        </div>

        <div className="flex gap-3 pt-4">
          <button onClick={() => onSave(localSettings)} className="btn-primary flex-1">Save</button>
          <button onClick={onClose} className="btn-ghost flex-1">Cancel</button>
        </div>
      </div>
    </Motion.div>
  );
}

function Dots({ steps, current }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {steps.map((_, i) => (
        <div 
          key={i} 
          className={cn(
            "h-1 rounded-full transition-all duration-300",
            i === current ? "w-8 bg-primary" : i < current ? "w-3 bg-primary/40" : "w-3 bg-white/5"
          )} 
        />
      ))}
    </div>
  );
}

function QuestionSlide({ q, value, onChange, stepNum, total, onNext, onBack }) {
  const arr = Array.isArray(value);
  const ok = arr ? value.length > 0 : ((value || "").toString().trim().length > 0 || q.type === "textarea");

  return (
    <Motion.div 
      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
      className="glass-card"
    >
      <Dots steps={Array(total).fill(0)} current={stepNum - 1} />
      <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-3">Question {stepNum} / {total}</div>
      <h2 className="text-2xl font-bold text-white mb-2 leading-tight">{q.q}</h2>
      {q.hint && <p className="text-slate-400 text-sm mb-8 leading-relaxed">{q.hint}</p>}

      <div className="space-y-4">
        {q.type === "textarea" && (
          <textarea 
            autoFocus value={value || ""} onChange={e => onChange(e.target.value)}
            placeholder="Type your response..." className="input-base min-h-[120px] resize-none"
          />
        )}
        {(q.type === "choice" || q.type === "multi") && (
          <div className="grid gap-3">
            {q.options.map(o => {
              const selected = q.type === "choice" ? value === o : (Array.isArray(value) && value.includes(o));
              return (
                <button 
                  key={o} 
                  className={cn(
                    "flex items-center gap-3 p-4 rounded-lg border text-left transition-all",
                    selected ? "bg-primary/10 border-primary text-white" : "bg-white/[0.02] border-white/5 text-slate-400 hover:border-white/10 hover:text-slate-200"
                  )}
                  onClick={() => {
                    if (q.type === "choice") onChange(o);
                    else {
                      const cur = Array.isArray(value) ? value : [];
                      onChange(selected ? cur.filter(x => x !== o) : [...cur, o]);
                    }
                  }}
                >
                  <div className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center text-[10px]",
                    selected ? "border-primary bg-primary text-white" : "border-slate-700"
                  )}>
                    {selected && "✓"}
                  </div>
                  <span className="text-sm font-medium">{o}</span>
                </button>
              );
            })}
          </div>
        )}
        {q.type === "tools" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {AI_TOOLS.map(t => {
              const selected = Array.isArray(value) && value.includes(t.id);
              return (
                <button 
                  key={t.id}
                  className={cn(
                    "p-4 rounded-lg border text-left transition-all group",
                    selected ? "bg-primary/10 border-primary" : "bg-white/[0.02] border-white/5 hover:border-white/10"
                  )}
                  onClick={() => {
                    const cur = Array.isArray(value) ? value : [];
                    onChange(selected ? cur.filter(x => x !== t.id) : [...cur, t.id]);
                  }}
                >
                  <div className={cn("text-sm font-semibold mb-1", selected ? "text-white" : "text-slate-200 group-hover:text-white")}>{t.name}</div>
                  <div className="text-[11px] text-slate-500 leading-normal">{t.desc}</div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="flex gap-3 mt-10">
        {onBack && <button className="btn-ghost" onClick={onBack}><ChevronLeft className="w-4 h-4 mr-1" /> Back</button>}
        <button className="btn-primary ml-auto flex items-center" onClick={onNext} disabled={!ok && q.type !== "textarea"}>
          {stepNum === total ? "Finalize" : "Continue"} <ChevronRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </Motion.div>
  );
}

function EchoSlide({ echoRows, onConfirm, onEdit, confirmLabel = "Generate", showConfirmPrompt = false }) {
  return (
    <Motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="glass-card">
      <div className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-4">Verification</div>
      <h2 className="text-2xl font-bold text-white mb-2">Confirm Requirements</h2>
      {showConfirmPrompt && (
        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
          Let me confirm I understand your project correctly. Is this accurate? Should I adjust anything before creating your research prompt?
        </p>
      )}
      {!showConfirmPrompt && <div className="mb-6" />}
      
      <div className="space-y-1 bg-white/[0.02] rounded-xl border border-white/5 p-2 mb-8 max-h-80 overflow-y-auto">
        {echoRows.map(([k, v]) => v ? (
          <div key={k} className="flex gap-4 p-3 border-b border-white/5 last:border-0">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider w-32 shrink-0">{k}</span>
            <span className="text-sm text-slate-300 leading-relaxed">{Array.isArray(v) ? v.join(", ") : v}</span>
          </div>
        ) : null)}
      </div>

      <div className="flex gap-3">
        <button className="btn-ghost" onClick={onEdit}><ChevronLeft className="w-4 h-4 mr-1" /> Edit</button>
        <button className="btn-primary ml-auto" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </Motion.div>
  );
}

function OutputSlide({ title, content, onNext, nextLabel, filename }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = filename || "output.md";
    document.body.appendChild(a); a.click(); document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-primary" /> {title}
        </h2>
        <div className="flex gap-2">
          <button onClick={copy} className={cn("btn-ghost text-xs flex items-center gap-2", copied && "text-primary border-primary/20 bg-primary/5")}>
            {copied ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />} {copied ? "Copied" : "Copy"}
          </button>
          <button onClick={download} className="btn-ghost text-xs flex items-center gap-2">
            <Download className="w-3.5 h-3.5" /> Download
          </button>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute inset-0 bg-primary/5 blur-xl group-hover:bg-primary/10 transition-all -z-10 rounded-xl" />
        <pre className="bg-slate-950/80 border border-white/5 rounded-xl p-6 text-sm font-mono leading-relaxed text-slate-400 overflow-x-auto max-h-[500px] whitespace-pre-wrap">
          {content}
        </pre>
      </div>

      {onNext && (
        <div className="mt-8 pt-8 border-t border-white/5 flex items-center justify-between bg-white/[0.01] -mx-8 px-8 rounded-b-xl">
          <div className="text-sm text-slate-500 font-medium">Ready for the next step?</div>
          <button className="btn-primary" onClick={onNext}>{nextLabel}</button>
        </div>
      )}
    </Motion.div>
  );
}

function Loading({ msg }) {
  return (
    <div className="glass-card flex flex-col items-center justify-center py-20 text-center">
      <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
      <p className="text-slate-200 font-medium">{msg || "Generating..."}</p>
      <p className="text-slate-500 text-sm mt-2">Thinking via your selected LLM...</p>
    </div>
  );
}

function ContextPaste({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="mb-6">
      <button 
        onClick={() => setOpen(!open)}
        className="w-full text-left p-4 rounded-lg border border-dashed border-white/10 text-slate-500 text-sm hover:border-primary/30 hover:text-slate-300 transition-all flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <Plus className={cn("w-4 h-4 transition-transform", open && "rotate-45")} />
          <span>{label}</span>
        </div>
        {!open && value && <CheckCircle2 className="w-4 h-4 text-primary" />}
      </button>
      <AnimatePresence>
        {open && (
          <Motion.div 
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <textarea 
              value={value} onChange={e => onChange(e.target.value)}
              placeholder="Paste content here..." className="input-base mt-2 min-h-[150px] text-xs font-mono"
            />
          </Motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Part flows ───────────────────────────────────────────────────────────────

function Part1({ userType, setUserType, globalAnswers, setGlobalAnswers, onComplete, savedOutput }) {
  const [phase, setPhase] = useState(savedOutput ? "output" : "type");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(globalAnswers.p1 || {});
  const [output, setOutput] = useState(savedOutput || "");

  const Q1 = {
    A: [
      { id:"idea", type:"textarea", q:"What's your app idea?", hint:"Describe it like you're explaining to a friend — what problem does it solve?" },
      { id:"users", type:"textarea", q:"Who needs this most?", hint:"Describe your ideal user — e.g., 'busy parents', 'small business owners', 'students'" },
      { id:"existing", type:"textarea", q:"What's out there already?", hint:"Name any similar apps or current solutions people use." },
      { id:"differentiator", type:"textarea", q:"What would make someone choose YOUR app?", hint:"What's the special sauce?" },
      { id:"features", type:"textarea", q:"What are the 3 absolute must-have features for launch?", hint:"Just the essentials!" },
      { id:"platform", type:"choice", q:"How do you imagine people using this?", options:["Mobile App","Web App","Both Mobile & Web","Not sure"] },
      { id:"timeline", type:"choice", q:"What's your timeline?", options:["Days","Weeks","Months","Not sure"] },
      { id:"budget", type:"choice", q:"Budget reality check: can you spend money on tools/services?", options:["Free only — need everything free","Some budget — budget-friendly tools ok","Comfortable spending — premium ok","Flexible"] },
    ],
    B: [
      { id:"topic", type:"textarea", q:"What's your main research topic and project context?", hint:"Include the technical domain and what you're building." },
      { id:"questions", type:"textarea", q:"List 3–5 specific questions your research must answer.", hint:"Be detailed — these will drive the entire research output." },
      { id:"decisions", type:"textarea", q:"What technical decisions will this research inform?", hint:"e.g., architecture choices, stack selection, integrations." },
      { id:"scope", type:"textarea", q:"Define your scope boundaries.", hint:"What's explicitly included — and what's explicitly excluded?" },
      { id:"depth", type:"textarea", q:"For each area, specify the depth needed.", hint:"Market Analysis, Technical Architecture, Competitor Analysis, Implementation Options, Cost Analysis — Surface / Deep / Comprehensive?" },
      { id:"sources", type:"textarea", q:"Rank your preferred information sources by priority (1–7).", hint:"Academic papers, Technical docs, GitHub repos, Industry reports, User forums/Reddit, Competitor analysis, Case studies." },
      { id:"constraints", type:"textarea", q:"Any technical constraints?", hint:"Specific languages, frameworks, platforms, or compliance requirements?" },
      { id:"context", type:"choice", q:"What's the business context?", options:["Side project","Startup","Enterprise","Client work"] },
    ],
    C: [
      { id:"idea", type:"textarea", q:"Tell me about your project idea and your current skills.", hint:"What can you code, and where do you need help?" },
      { id:"problem", type:"textarea", q:"What problem are you solving? Who has this problem most?", hint:"Be specific about the pain point and who feels it." },
      { id:"research", type:"textarea", q:"What specific things do you need to research?", hint:"List both technical and business aspects." },
      { id:"existing", type:"textarea", q:"What similar solutions exist?", hint:"What do you like and dislike about them?" },
      { id:"platform", type:"multi", q:"Platform preferences:", options:["Web app (works in browser)","Mobile app (iOS/Android)","Desktop app","Not sure — help me decide"] },
      { id:"stack", type:"textarea", q:"What's your technical comfort zone?", hint:"Languages/frameworks you know. Willing to learn new tools? Prefer familiar or optimal?" },
      { id:"timeline", type:"textarea", q:"What's your timeline and how will you measure success?", hint:"When do you want to launch and what does success look like?" },
      { id:"budget", type:"choice", q:"Budget for tools and services?", options:["Free only","Under $50/month","Under $200/month","Flexible"] },
    ]
  };

  const qs = userType ? Q1[userType] : [];
  const q = qs[step];
  const save = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  // Spec-required 7-field echo template, mapped per user type
  const ECHO_MAPS = {
    A: [
      ["Project",       a => a.idea],
      ["Target Users",  a => a.users],
      ["Problem Solved",a => a.idea],
      ["Key Features",  a => a.features],
      ["Platform",      a => a.platform],
      ["Timeline",      a => a.timeline],
      ["Budget",        a => a.budget],
    ],
    B: [
      ["Project",       a => a.topic],
      ["Target Users",  a => a.context],
      ["Problem Solved",a => a.questions],
      ["Key Features",  a => a.decisions],
      ["Platform",      a => a.constraints],
      ["Timeline",      a => a.scope],
      ["Budget",        a => a.depth],
    ],
    C: [
      ["Project",       a => a.idea],
      ["Target Users",  a => a.problem],
      ["Problem Solved",a => a.research],
      ["Key Features",  a => a.existing],
      ["Platform",      a => Array.isArray(a.platform) ? a.platform.join(", ") : a.platform],
      ["Timeline",      a => a.timeline],
      ["Budget",        a => a.budget],
    ],
  };

  const echoRows = userType
    ? ECHO_MAPS[userType].map(([label, getter]) => [label, getter(answers)])
    : Object.entries(answers);

  const generateResearchPrompt = (type, a) => {
    return `## Deep Research Request: ${a.idea || a.topic || "My MVP"}

Context: ${JSON.stringify(a)}
Instructions: Analyze competitors, technical feasibility, MVP scope, and provide a recommended tech stack. Output in detailed markdown.`;
  };

  const finish = () => {
    const prompt = generateResearchPrompt(userType, answers);
    setOutput(prompt);
    setGlobalAnswers(a => ({ ...a, p1: answers }));
    onComplete(prompt);
    setPhase("output");
  };

  return (
    <div className="max-w-3xl mx-auto">
      {phase === "type" && (
        <Motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-4 tracking-tight">Project Genesis</h1>
            <p className="text-slate-400 max-w-lg mx-auto leading-relaxed">Select your background to tailor the MVP generation process.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {USER_TYPES.map(t => (
              <button key={t.id} onClick={() => { setUserType(t.id); setPhase("questions"); }} className="glass-card hover:bg-white/[0.04] transition-all group text-left flex flex-col h-full">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                  <t.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{t.name}</h3>
                <p className="text-xs text-slate-500 leading-normal mb-6">{t.desc}</p>
                <div className="mt-auto flex items-center text-[10px] font-bold text-primary uppercase tracking-widest">
                  Start <ChevronRight className="w-3 h-3 ml-1" />
                </div>
              </button>
            ))}
          </div>
        </Motion.div>
      )}
      {phase === "questions" && q && (
        <QuestionSlide q={q} value={answers[q.id]} onChange={v => save(q.id, v)} stepNum={step+1} total={qs.length} 
          onNext={() => step < qs.length - 1 ? setStep(s=>s+1) : setPhase("echo")}
          onBack={step > 0 ? () => setStep(s=>s-1) : () => setPhase("type")} 
        />
      )}
      {phase === "echo" && <EchoSlide echoRows={echoRows} onConfirm={finish} onEdit={() => setStep(qs.length - 1)} showConfirmPrompt />}
      {phase === "output" && <OutputSlide title="Research Strategy" content={output} filename="research-prompt.md" onNext={() => onComplete(output, true)} nextLabel="Create PRD" />}
    </div>
  );
}

function Part2({ userType, globalAnswers, setGlobalAnswers, onComplete, savedOutput, autoContext, llmSettings }) {
  const [phase, setPhase] = useState(savedOutput ? "output" : "start");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(globalAnswers.p2 || {});
  const [output, setOutput] = useState(savedOutput || "");
  const [err, setErr] = useState("");
  const [manualContext, setManualContext] = useState("");

  const Q2 = {
    A: [
      { id: "name", type: "textarea", q: "App Name?", hint: "Working title is fine." },
      { id: "problem", type: "textarea", q: "Core problem statement?", hint: "Single sentence pain point." },
      { id: "goal", type: "choice", q: "Launch Goal?", options: ["100+ Users", "$1k MRR", "VC Pitch", "Validation"] },
      { id: "persona", type: "textarea", q: "Define User Persona", hint: "Role, tech-savviness, and frustrations." },
      { id: "features", type: "textarea", q: "Must-have Features", hint: "Absolute essentials for v1." },
      { id: "vibe", type: "textarea", q: "Design Vibe", hint: "Minimal, Bold, Fun, Pro?" },
    ],
    B: [
      { id: "name", type: "textarea", q: "Product Name?" },
      { id: "problem", type: "textarea", q: "Problem Statement" },
      { id: "stories", type: "textarea", q: "User Stories", hint: "As a [role], I want to [action] so that [benefit]" },
      { id: "features", type: "textarea", q: "Feature Prioritization", hint: "Must, Should, Could, Won't" },
      { id: "metrics", type: "textarea", q: "Success Metrics", hint: "Activation, Engagement, Retention" },
      { id: "nfr", type: "textarea", q: "Tech Requirements", hint: "Performance, Accessibility, Platform" },
    ],
    C: [
      { id: "name", type: "textarea", q: "Product Name?" },
      { id: "problem", type: "textarea", q: "The Problem" },
      { id: "goal", type: "choice", q: "Goal", options: ["First Users", "Validation", "Portfolio", "Income"] },
      { id: "flow", type: "textarea", q: "Primary User Flow", hint: "Arrival -> Action -> Value" },
      { id: "features", type: "textarea", q: "V1 Feature List" },
      { id: "constraints", type: "textarea", q: "Business Constraints" },
    ]
  };

  const qs = Q2[userType || "C"];
  const q = qs[step];
  const save = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const generate = async () => {
    setPhase("generating");
    setGlobalAnswers(a => ({ ...a, p2: answers }));
    try {
      const prompt = `Generate a PRD. Context: ${autoContext}\n\nAnswers: ${JSON.stringify(answers)}`;
      const result = await callLLM("You are a PM. Write a detailed PRD.", prompt, llmSettings);
      setOutput(result); onComplete(result); setPhase("output");
    } catch (e) { setErr(e.message); setPhase("echo"); }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {phase === "start" && (
        <div className="glass-card">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Build Requirements</h1>
            <p className="text-slate-400">Define the core functions and audience for your MVP.</p>
          </div>
          <ContextPaste label="Import Research Context" value={manualContext} onChange={setManualContext} />
          <button className="btn-primary w-full" onClick={() => setPhase("questions")}>Start PRD Wizard</button>
        </div>
      )}
      {phase === "questions" && q && (
        <QuestionSlide q={q} value={answers[q.id]} onChange={v => save(q.id, v)} stepNum={step+1} total={qs.length}
          onNext={() => (step < qs.length - 1 ? setStep((s) => s + 1) : setPhase("echo"))}
          onBack={step > 0 ? () => setStep((s) => s - 1) : () => setPhase("start")}
        />
      )}
      {phase === "echo" && (
        <div className="space-y-4">
          {err && <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm flex items-start gap-3"><AlertCircle className="w-4 h-4 mt-0.5 shrink-0" /> {err}</div>}
          <EchoSlide echoRows={Object.entries(answers)} confirmLabel="Generate PRD" onConfirm={generate} onEdit={() => setPhase("questions")} />
        </div>
      )}
      {phase === "generating" && <Loading msg="Synthesizing Requirements..." />}
      {phase === "output" && <OutputSlide title="Product Requirements" content={output} filename="PRD.md" onNext={() => onComplete(output, true)} nextLabel="Design Architecture" />}
    </div>
  );
}

// ─── Main App ───────────────────────────────────────────────────────────────

export default function App() {
  const [active, setActive] = useState(0);
  const [userType, setUserType] = useState(null);
  const [globalAnswers, setGlobalAnswers] = useState({});
  const [outputs, setOutputs] = useState({ 0: null, 1: null, 2: null, 3: null });
  const [showSettings, setShowSettings] = useState(false);
  
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('mvpSessions');
    try { return saved ? JSON.parse(saved) : []; } catch { return []; }
  });
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionName, setSessionName] = useState("");

  const [llmSettings, setLlmSettings] = useState(() => {
    const saved = localStorage.getItem('llmSettings');
    return saved ? JSON.parse(saved) : { provider: 'claude', apiKey: '' };
  });

  useEffect(() => localStorage.setItem('llmSettings', JSON.stringify(llmSettings)), [llmSettings]);
  useEffect(() => localStorage.setItem('mvpSessions', JSON.stringify(sessions)), [sessions]);

  // Autosave current session
  useEffect(() => {
    if (!currentSessionId) return;
    const saved = localStorage.getItem('mvpSessions');
    if (!saved) return;
    try {
      const prevSessions = JSON.parse(saved);
      const nextSessions = prevSessions.map(s => s.id === currentSessionId ? { ...s, name: sessionName.trim() || s.name, userType, globalAnswers, outputs } : s);
      localStorage.setItem('mvpSessions', JSON.stringify(nextSessions));
    } catch {
      // ignore
    }
  }, [sessionName, userType, globalAnswers, outputs, currentSessionId]);

  const isDone = i => !!outputs[i];
  const canAccess = i => i === 0 || isDone(i - 1);
  const complete = (partIdx, output, navigate) => {
    setOutputs(o => ({ ...o, [partIdx]: output }));
    if (navigate && partIdx < 3) setActive(partIdx + 1);
  };

  const loadSession = (id) => {
    const s = sessions.find(x => x.id === id);
    if (!s) return;
    setCurrentSessionId(id); setSessionName(s.name || ""); setUserType(s.userType || null);
    setGlobalAnswers(s.globalAnswers || {}); setOutputs(s.outputs || {}); setActive(0);
  };

  const saveSessionAsNew = () => {
    const id = Date.now().toString();
    const next = [...sessions, { id, name: sessionName || "Untitled", userType, globalAnswers, outputs }];
    setSessions(next); setCurrentSessionId(id);
  };

  const currentPart = PART_LABELS[active];

  return (
    <div className="min-h-screen bg-noise selection:bg-primary/30">
      <div className="fixed inset-0 bg-gradient-to-br from-background via-background to-slate-900 -z-20" />
      <div className="fixed top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-50" />
      
      <div className="max-w-[1000px] mx-auto px-6 py-8 md:py-12">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center text-white shadow-lg shadow-primary/20">
              <Monitor className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-tight text-white leading-none">MVP Builder</h1>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-1.5 flex items-center gap-1.5">
                Agent Protocol <div className="w-1 h-1 rounded-full bg-primary animate-pulse" /> Live
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 bg-white/[0.02] border border-white/5 p-1.5 rounded-xl backdrop-blur-sm">
            <select 
              value={currentSessionId || ""} onChange={e => loadSession(e.target.value)}
              className="bg-transparent text-sm text-slate-300 px-3 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="">(Draft)</option>
              {sessions.map(s => <option key={s.id} value={s.id} className="bg-slate-900">{s.name}</option>)}
            </select>
            <input 
              type="text" value={sessionName} onChange={e => setSessionName(e.target.value)}
              placeholder="Session Name" className="bg-white/5 text-xs text-white px-3 py-1.5 rounded-lg focus:outline-none w-32 border border-white/5"
            />
            <button onClick={saveSessionAsNew} className="btn-ghost p-1.5" title="Save Session"><Plus className="w-4 h-4" /></button>
            <div className="w-px h-6 bg-white/5 mx-1" />
            <button onClick={() => setShowSettings(true)} className="btn-ghost p-1.5" title="Settings"><Settings className="w-4 h-4" /></button>
          </div>
        </header>

        <div className="flex flex-col items-center">
          {/* Horizontal Stepper */}
          <div className="w-full max-w-3xl mb-12">
            <div className="grid grid-cols-4 gap-2 md:gap-4">
              {PART_LABELS.map((p, i) => {
                const active_p = active === i;
                const done = isDone(i);
                const locked = !canAccess(i);
                return (
                  <button 
                    key={p.num} 
                    disabled={locked} 
                    onClick={() => setActive(i)}
                    className={cn(
                      "group relative flex flex-col items-center gap-2 transition-all",
                      locked ? "opacity-30 grayscale cursor-not-allowed" : "cursor-pointer"
                    )}
                  >
                    <div className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center transition-all border shrink-0",
                      active_p ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-110" : 
                      done ? "bg-slate-800 border-primary/30 text-primary" : "bg-white/5 border-white/5 text-slate-500 group-hover:border-white/10 group-hover:text-slate-300"
                    )}>
                      {done ? <CheckCircle2 className="w-5 h-5" /> : <p.icon className="w-5 h-5" />}
                    </div>
                    <div className="text-center hidden md:block">
                      <div className={cn(
                        "text-[10px] font-bold uppercase tracking-wider mb-0.5",
                        active_p ? "text-primary" : "text-slate-500"
                      )}>Part {p.num}</div>
                      <div className={cn(
                        "text-[11px] font-semibold truncate max-w-[80px]",
                        active_p ? "text-white" : "text-slate-400"
                      )}>{p.name}</div>
                    </div>
                    {/* Connecting line */}
                    {i < 3 && (
                      <div className="absolute top-5 left-[calc(50%+24px)] w-[calc(100%-48px)] h-px bg-white/5 hidden md:block">
                        <div className={cn("h-full bg-primary transition-all duration-500", done ? "w-full" : "w-0")} />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main Content Area */}
          <main className="w-full max-w-3xl">
            <AnimatePresence mode="wait">
              {active === 0 && (
                <Part1 key="p1" userType={userType} setUserType={setUserType} globalAnswers={globalAnswers} setGlobalAnswers={setGlobalAnswers} onComplete={complete} savedOutput={outputs[0]} />
              )}
              {active === 1 && (
                <Part2 key="p2" userType={userType} globalAnswers={globalAnswers} setGlobalAnswers={setGlobalAnswers} onComplete={complete} savedOutput={outputs[1]} autoContext={outputs[0]} llmSettings={llmSettings} />
              )}
              {active > 1 && (
                <Motion.div 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  exit={{ opacity: 0, y: -20 }}
                  className="glass-card text-center py-20"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-800 flex items-center justify-center mx-auto mb-6 border border-white/5">
                    <currentPart.icon className="w-8 h-8 text-slate-500" />
                  </div>
                  <h2 className="text-2xl font-bold text-white mb-2">{currentPart.name}</h2>
                  <p className="text-slate-500 max-w-sm mx-auto leading-relaxed">
                    This stage of the generator is coming in the next update. You can manually synthesize this using the previous outputs.
                  </p>
                </Motion.div>
              )}
            </AnimatePresence>
          </main>
        </div>
      </div>

      <AnimatePresence>
        {showSettings && <SettingsPanel settings={llmSettings} onSave={s => { setLlmSettings(s); setShowSettings(false); }} onClose={() => setShowSettings(false)} />}
      </AnimatePresence>
    </div>
  );
}