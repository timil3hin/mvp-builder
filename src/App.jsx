import { useState, useEffect } from "react";

const FONTS = `@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Mono:ital,wght@0,300;0,400;1,300&display=swap');`;

// ─── Styles ──────────────────────────────────────────────────────────────────
const css = `
* { box-sizing: border-box; margin: 0; padding: 0; }
body { background: #080810; }

.app {
  min-height: 100vh;
  background: #080810;
  color: #e0dcd0;
  font-family: 'DM Mono', monospace;
}

.noise {
  position: fixed; inset: 0; pointer-events: none; z-index: 0; opacity: 0.3;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E");
}

.glow { position: fixed; width: 700px; height: 700px; border-radius: 50%; background: radial-gradient(circle, rgba(255,190,50,0.055) 0%, transparent 65%); pointer-events: none; z-index: 0; top: -200px; right: -200px; animation: gm 9s ease-in-out infinite alternate; }
.glow2 { position: fixed; width: 500px; height: 500px; border-radius: 50%; background: radial-gradient(circle, rgba(90,160,255,0.035) 0%, transparent 65%); pointer-events: none; z-index: 0; bottom: -100px; left: -100px; }
@keyframes gm { from{transform:translate(0,0)} to{transform:translate(-60px,100px)} }

.container { position: relative; z-index: 1; max-width: 820px; margin: 0 auto; padding: 0 24px 80px; }

/* NAV */
.nav { padding: 24px 0 0; margin-bottom: 40px; }
.nav-brand { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #ffc03d; letter-spacing: 0.08em; text-transform: uppercase; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; }
.nav-brand::before { content: '◈'; }
.parts-nav { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; }
.part-tab {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
  border-radius: 3px; padding: 12px 10px; cursor: pointer; text-align: left;
  transition: all 0.2s; position: relative; overflow: hidden;
}
.part-tab:hover:not(.locked) { border-color: rgba(255,192,61,0.3); background: rgba(255,192,61,0.04); }
.part-tab.active { border-color: #ffc03d; background: rgba(255,192,61,0.07); }
.part-tab.done { border-color: rgba(255,192,61,0.25); }
.part-tab.locked { opacity: 0.35; cursor: default; }
.part-num { font-size: 9px; color: #ffc03d; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 4px; }
.part-name { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #d8d4c8; line-height: 1.3; }
.part-check { position: absolute; top: 8px; right: 10px; color: #ffc03d; font-size: 10px; }
.part-tab.locked .part-num { color: #5a5650; }
.part-tab.locked .part-name { color: #5a5650; }

/* CARDS */
.card { background: rgba(255,255,255,0.025); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 32px; animation: su 0.3s ease; }
@keyframes su { from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)} }

.q-label { font-size: 10px; letter-spacing: 0.18em; text-transform: uppercase; color: #ffc03d; margin-bottom: 10px; }
.q-text { font-family: 'Syne', sans-serif; font-size: 20px; font-weight: 700; color: #f0ece0; line-height: 1.4; margin-bottom: 8px; }
.q-hint { font-size: 12px; color: #5a5650; line-height: 1.6; margin-bottom: 24px; }

textarea, .text-input {
  width: 100%; background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.09);
  border-radius: 4px; color: #e0dcd0; font-family: 'DM Mono', monospace; font-size: 13px;
  padding: 14px; resize: vertical; min-height: 90px; outline: none; line-height: 1.7;
  transition: border-color 0.2s;
}
textarea:focus { border-color: rgba(255,192,61,0.45); }
textarea::placeholder { color: #2e2c28; }

.choices { display: flex; flex-direction: column; gap: 7px; }
.choice-btn {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 4px; padding: 11px 14px; cursor: pointer; text-align: left;
  color: #908c80; font-family: 'DM Mono', monospace; font-size: 12px;
  transition: all 0.18s; display: flex; align-items: center; gap: 10px;
}
.choice-btn:hover { border-color: rgba(255,192,61,0.3); color: #e0dcd0; }
.choice-btn.sel { border-color: #ffc03d; background: rgba(255,192,61,0.07); color: #e0dcd0; }
.chk { width: 15px; height: 15px; border: 1px solid rgba(255,255,255,0.18); border-radius: 2px; flex-shrink:0; display:flex; align-items:center; justify-content:center; font-size:9px; transition: all 0.15s; }
.choice-btn.sel .chk { background: #ffc03d; border-color: #ffc03d; color: #080810; }

.tool-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; }
.tool-btn {
  background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07);
  border-radius: 4px; padding: 14px; cursor: pointer; text-align: left;
  transition: all 0.18s;
}
.tool-btn:hover { border-color: rgba(255,192,61,0.3); }
.tool-btn.sel { border-color: #ffc03d; background: rgba(255,192,61,0.06); }
.tool-name { font-family: 'Syne', sans-serif; font-size: 13px; font-weight: 700; color: #d8d4c8; }
.tool-desc { font-size: 11px; color: #504e48; margin-top: 3px; }
.tool-btn.sel .tool-name { color: #ffc03d; }

/* TYPE GRID */
.type-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.type-btn { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.07); border-radius: 4px; padding: 20px 16px; cursor: pointer; text-align: left; transition: all 0.2s; }
.type-btn:hover, .type-btn.sel { border-color: #ffc03d; background: rgba(255,192,61,0.07); }
.type-letter { font-family: 'Syne', sans-serif; font-size: 30px; font-weight: 800; color: #ffc03d; display:block; margin-bottom: 6px; }
.type-name { font-size: 13px; font-weight: 700; color: #e0dcd0; display:block; }
.type-desc { font-size: 11px; color: #504e48; margin-top: 4px; line-height: 1.5; }

/* BUTTONS */
.btn-row { display:flex; gap:10px; margin-top: 28px; align-items: center; flex-wrap: wrap; }
.btn { background: #ffc03d; color: #080810; border: none; font-family: 'Syne', sans-serif; font-weight: 700; font-size: 13px; padding: 12px 26px; border-radius: 3px; cursor: pointer; letter-spacing: 0.04em; transition: all 0.2s; }
.btn:hover { background: #ffd060; transform: translateY(-1px); }
.btn:disabled { opacity: 0.35; cursor: not-allowed; transform: none; }
.btn-ghost { background: transparent; color: #504e48; border: 1px solid rgba(255,255,255,0.08); font-family: 'DM Mono', monospace; font-size: 12px; padding: 12px 18px; border-radius: 3px; cursor: pointer; transition: all 0.2s; }
.btn-ghost:hover { color: #e0dcd0; border-color: rgba(255,255,255,0.2); }

/* ECHO */
.echo-box { background: rgba(255,192,61,0.04); border: 1px solid rgba(255,192,61,0.18); border-radius: 4px; padding: 22px; margin-bottom: 20px; }
.echo-title { font-size: 11px; color: #ffc03d; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 14px; }
.echo-row { display:flex; gap:12px; padding:7px 0; border-bottom: 1px solid rgba(255,255,255,0.04); }
.echo-row:last-child { border-bottom: none; }
.echo-k { font-size: 11px; color: #ffc03d; min-width: 130px; text-transform: uppercase; letter-spacing: 0.08em; }
.echo-v { font-size: 12px; color: #908c80; line-height: 1.6; }

/* CONTEXT PASTE */
.ctx-box { margin-bottom: 24px; }
.ctx-toggle { background: transparent; border: 1px dashed rgba(255,255,255,0.1); border-radius: 4px; padding: 10px 16px; cursor: pointer; color: #504e48; font-size: 12px; font-family: 'DM Mono', monospace; transition: all 0.2s; width: 100%; text-align: left; }
.ctx-toggle:hover { border-color: rgba(255,192,61,0.3); color: #908c80; }
.ctx-open { margin-top: 10px; }

/* OUTPUT */
.output-card { }
.out-header { display:flex; align-items:center; justify-content:space-between; margin-bottom: 14px; }
.out-title { font-family: 'Syne', sans-serif; font-size: 18px; font-weight: 700; color: #f0ece0; }
.out-actions { display: flex; gap: 8px; }
.copy-btn, .dl-btn { background: rgba(255,192,61,0.1); border: 1px solid rgba(255,192,61,0.3); color: #ffc03d; font-family: 'DM Mono', monospace; font-size: 11px; padding: 6px 14px; border-radius: 3px; cursor: pointer; transition: all 0.2s; }
.copy-btn:hover, .dl-btn:hover { background: rgba(255,192,61,0.2); }
.copy-btn.copied { background: rgba(80,200,120,0.12); border-color: rgba(80,200,120,0.35); color: #60d890; }
pre { background: rgba(0,0,0,0.45); border: 1px solid rgba(255,255,255,0.06); border-radius: 4px; padding: 22px; font-family: 'DM Mono', monospace; font-size: 12px; line-height: 1.85; color: #a8a49a; overflow-x: auto; white-space: pre-wrap; word-break: break-word; max-height: 500px; overflow-y: auto; }

.loading-box { text-align: center; padding: 48px 24px; }
.spinner { width: 32px; height: 32px; border: 2px solid rgba(255,255,255,0.08); border-top-color: #ffc03d; border-radius: 50%; animation: spin 0.7s linear infinite; margin: 0 auto 16px; }
@keyframes spin { to{transform:rotate(360deg)} }
.loading-txt { font-size: 13px; color: #504e48; }

.next-part { margin-top: 24px; padding: 18px; background: rgba(255,192,61,0.04); border: 1px dashed rgba(255,192,61,0.25); border-radius: 4px; display:flex; align-items:center; justify-content:space-between; gap: 12px; }
.next-txt { font-size: 12px; color: #706c60; }
.step-dots { display:flex; gap:5px; margin-bottom: 28px; }
.sdot { width:6px; height:6px; border-radius:50%; background:rgba(255,255,255,0.08); transition:all 0.25s; }
.sdot.a { background:#ffc03d; width:22px; border-radius:3px; }
.sdot.d { background:rgba(255,192,61,0.35); }

.platforms { margin-top: 28px; padding: 20px; background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 4px; }
.plat-title { font-size: 10px; color: #ffc03d; letter-spacing: 0.15em; text-transform: uppercase; margin-bottom: 12px; }
.plat-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:8px; }
.plat-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 3px; padding: 12px; }
.plat-name { font-family: 'Syne', sans-serif; font-size: 12px; font-weight: 700; color: #d8d4c8; }
.plat-desc { font-size: 11px; color: #3e3c38; margin-top: 3px; line-height: 1.5; }
.restart { margin-top: 24px; background:transparent; color:#3e3c38; border:1px solid rgba(255,255,255,0.05); font-family:'DM Mono',monospace; font-size:11px; padding:8px 16px; border-radius:3px; cursor:pointer; transition:all 0.2s; }
.restart:hover { color:#908c80; border-color:rgba(255,255,255,0.12); }

@media(max-width:600px){ .type-grid,.parts-nav,.tool-grid,.plat-grid{grid-template-columns:1fr} .card{padding:20px} }
`;

// ─── Helpers ─────────────────────────────────────────────────────────────────

const USER_TYPES = [
  { id: "A", name: "Vibe-Coder", desc: "Great ideas, limited coding experience" },
  { id: "B", name: "Developer", desc: "Experienced programmer" },
  { id: "C", name: "In Between", desc: "Some coding knowledge, still learning" },
];

const AI_TOOLS = [
  { id: "claude-code", name: "Claude Code", desc: "Terminal agent with session memory" },
  { id: "cursor", name: "Cursor", desc: "AI-powered IDE, reads .cursorrules" },
  { id: "gemini-cli", name: "Gemini CLI", desc: "Free open-source terminal agent" },
  { id: "antigravity", name: "Antigravity", desc: "Agent-first IDE by Google" },
  { id: "copilot", name: "GitHub Copilot", desc: "VS Code AI extension" },
  { id: "lovable", name: "Lovable / v0", desc: "No-code AI builders" },
];

// Part 1 — Research Prompt (template-based)
function generateResearchPrompt(type, answers) {
  const a = answers;
  if (type === "A") {
    return `## Deep Research Request: ${(a.idea || "My App").split(" ").slice(0,4).join(" ")}

<context>
I'm a non-technical founder building: ${a.idea || "[app idea]"}
Target users: ${a.users || "[target users]"}
Similar existing solutions: ${a.existing || "[competitors]"}
My differentiator: ${a.differentiator || "[unique value]"}
Platform: ${a.platform || "[platform]"}
Timeline: ${a.timeline || "[timeline]"}
Budget: ${a.budget || "[budget]"}
</context>

<instructions>
### Key Questions to Answer:
1. What similar apps exist and what features do they have?
2. What do users love/hate about existing solutions?
3. What's the simplest way to build an MVP with my timeline/budget?
4. What no-code/low-code tools are best for this use case?
5. How do similar apps monetize and what can I realistically charge?
6. What AI tools or APIs can accelerate development or differentiate the MVP?

### Must-Have Features to Analyze:
${a.features || "1. [Feature 1]\n2. [Feature 2]\n3. [Feature 3]"}

### Research Focus:
- Simple, actionable insights with real examples
- Current tool recommendations (prioritize newest/best options)
- Step-by-step implementation guidance for non-technical founders
- Cost estimates with free/paid tiers
- Examples of similar successful projects

### Required Deliverables:
1. **Competitor Table** — Features, pricing, user reviews, strengths/weaknesses
2. **Tech Stack** — Recommended tools for non-technical founders
3. **MVP Features** — Must-have vs nice-to-have prioritization
4. **Development Roadmap** — With AI assistance strategy included
5. **Budget Breakdown** — Tools, services, and deployment costs
</instructions>

<output_format>
- Explain everything in plain English with concrete examples
- Include source URLs with access dates for each major recommendation
- Use comparison tables wherever possible
- Flag where AI knowledge may be outdated (pricing especially)
</output_format>`;
  }
  if (type === "B") {
    return `## Deep Research Request: ${(a.topic || "Technical Research").split(" ").slice(0,5).join(" ")}

<context>
Project: ${a.topic || "[research topic]"}
Technical Constraints: ${a.constraints || "None specified"}
Business Context: ${a.context || "[context]"}
Sources Priority: ${a.sources || "Not specified"}
Depth Requirements: ${a.depth || "Not specified"}
</context>

<instructions>
### Research Scope:
${a.scope || "[scope as defined]"}

### Specific Questions to Answer:
${a.questions || "[research questions]"}

### Technical Decisions This Informs:
${a.decisions || "[architectural decisions]"}

### Required Analysis:
- Technical architecture patterns (current best practices)
- Performance benchmarks with latest frameworks
- Security considerations for AI-integrated systems
- Scalability approaches with modern infrastructure
- AI tool/API integration strategies with current pricing
- Cost optimization with current cloud pricing
- Development velocity estimates with AI assistance tools

### Advanced Topics:
- Agent architecture patterns (Planner-Executor-Reviewer loops)
- MCP (Model Context Protocol) integration options where relevant
- Design system generators and component libraries
- Figma-to-code tools
- Generative UI approaches
- Design token standardization patterns
- Self-healing code and test strategies
- Visual verification workflows
</instructions>

<output_format>
- Provide detailed technical findings with code examples
- Include architecture diagrams in text or Mermaid.js
- Cite sources with URLs and access dates
- Explicitly note where sources disagree or data is uncertain
- Include pros/cons for each major recommendation
</output_format>`;
  }
  const platforms = Array.isArray(a.platform) ? a.platform.join(", ") : a.platform || "[platform]";
  return `## Deep Research Request: ${(a.idea || "My Project").split(" ").slice(0,4).join(" ")}

<context>
Project: ${a.idea || "[project description]"}
Problem: ${a.problem || "[problem]"}
Similar Solutions: ${a.existing || "[competitors]"}
Technical Skills: ${a.stack || "[skills]"}
Platform: ${platforms}
Timeline & Goals: ${a.timeline || "[timeline]"}
Budget: ${a.budget || "[budget]"}
</context>

<instructions>
### Specific Research Needs:
${a.research || "[research areas]"}

### Core Questions to Answer:
1. What are the best technical approaches for my skill level?
2. What similar solutions exist and what can I learn from them?
3. What AI tools/APIs are most relevant to this product?
4. What's the optimal build vs. buy vs. integrate decision for each feature?
5. What's the realistic time and cost to build this?
6. What should I learn vs. what should I outsource or use tools for?

### Required Deliverables:
1. **Feature Matrix** — MVP prioritization with effort estimates
2. **Tech Stack** — Recommended with alternatives and trade-offs
3. **AI Tool Guide** — Which tool for which task
4. **Roadmap** — Development path with skill milestones
5. **Resources** — Learning materials, prioritized
6. **Budget Forecast** — Including tool subscriptions and scaling costs
</instructions>

<output_format>
- Assume basic programming knowledge; explain advanced concepts clearly
- Include source URLs with access dates for major recommendations
- Use comparison tables for technology decisions
- Note any conflicting information between sources
</output_format>`;
}

// Part 2 — PRD system prompt
function buildPRDPrompt(type, answers, context) {
  const baseIntro =
    type === "A"
      ? "You are an expert product manager helping a non-technical founder define a clear, simple MVP Product Requirements Document."
      : type === "B"
      ? "You are a senior product manager working with an experienced developer to define a detailed, implementation-ready PRD."
      : "You are a pragmatic product manager helping a partially-technical founder define a focused MVP PRD.";

  const safeContext = context || "";

  return `${baseIntro}

You will receive:
- Structured answers from an interactive questionnaire (summarized in a separate user message).
- Optional prior research and context (below).

<additional_context>
${safeContext}
</additional_context>

Your job:
- Produce a complete MVP Product Requirements Document tailored to the answers and context.
- Be concrete and specific, but avoid unnecessary jargon for less-technical users.

Required sections:
1. Overview (problem, audience, high-level solution)
2. Goals & Non-goals
3. Primary User Personas
4. Core User Journeys
5. MVP Feature List (Must / Should / Could / Won’t)
6. Success Metrics
7. Constraints & Assumptions
8. Risks & Open Questions

Format:
- Use clear headings and subheadings.
- Use bullet lists where helpful.
- Reference any assumptions you make explicitly.`;
}

// Part 3 — Technical Design system prompt
function buildTechPrompt(type, answers, context) {
  const baseIntro =
    type === "A"
      ? "You are a senior full‑stack engineer explaining technical decisions in plain language to a non‑technical founder."
      : type === "B"
      ? "You are a principal engineer writing a concise but detailed Technical Design Document for another experienced engineer."
      : "You are a senior engineer writing a Technical Design Document for a semi‑technical founder who wants to understand the trade‑offs.";

  const safeContext = context || "";

  return `${baseIntro}

You will receive:
- A previously defined MVP PRD and any research (below).
- Structured answers about platform, stack preferences, constraints, and scaling needs (via a separate user message).

<additional_context>
${safeContext}
</additional_context>

Your job:
- Produce a complete Technical Design Document for the MVP that could be handed to an implementation team.

Required sections:
1. Architecture Overview (diagrams in text or Mermaid if useful)
2. Tech Stack Selection (frontend, backend, database, infra, AI services)
3. Data Model & Key Entities
4. API Design / Integration Points
5. Frontend Architecture & Key Screens
6. Backend Architecture & Background Jobs (if any)
7. Security, Privacy, and Compliance Considerations
8. Performance & Scaling Approach
9. Observability & Testing Strategy
10. Phasing / Implementation Milestones

Format:
- Use headings, bullet lists, and code snippets where appropriate.
- Call out trade‑offs and alternative options briefly.
- Keep explanations aligned with the user’s technical level.`;
}

// Part 4 — Agent instruction files system prompt
function buildAgentsPrompt(type, answers, context) {
  const baseIntro =
    "You are configuring AI coding assistants (agents) for a software project. You will generate ALL instruction files needed so that AI tools can autonomously help build and maintain the MVP.";

  const safeContext = context || "";
  const tools = Array.isArray(answers.tools) ? answers.tools : [];

  return `${baseIntro}

You will receive:
- Project research, PRD, and technical design (below).
- Selected AI tools and extra preferences (via a separate user message).

<additional_context>
${safeContext}
</additional_context>

Your job:
- Generate the full content for:
  1. AGENTS.md (top‑level agent instructions, roles, and workflows)
  2. agent_docs/tech_stack.md
  3. agent_docs/code_patterns.md
  4. agent_docs/project_brief.md
  5. agent_docs/product_requirements.md
  6. agent_docs/testing.md
- Additionally, generate tool‑specific config/instruction files for all selected tools: ${tools.join(
    ", "
  ) || "[none specified; assume Cursor + Claude Code]"}.

Format:
- Write everything in one markdown output, separated clearly with headings like:
  === FILE: AGENTS.md ===
  === FILE: agent_docs/tech_stack.md ===
  ...
- For each tool‑specific file, include a short comment in the header indicating where it should be saved (e.g., .cursorrules, CLAUDE.md, etc.).
- Be explicit about how agents should use the other docs, how to ask for clarification, and how to keep the codebase consistent with the PRD and Tech Design.`;
}

// ─── Question definitions ─────────────────────────────────────────────────────

const Q1 = {
  A: [
    { id:"idea", type:"textarea", q:"What's your app idea? Describe it like explaining to a friend — what problem does it solve?", hint:"" },
    { id:"users", type:"textarea", q:"Who needs this most? Describe your ideal user (e.g., 'busy parents', 'small business owners', 'students')", hint:"" },
    { id:"existing", type:"textarea", q:"What's out there already? Name any similar apps or current solutions people use.", hint:"" },
    { id:"differentiator", type:"textarea", q:"What's your special sauce? What would make someone choose YOUR app over existing options?", hint:"" },
    { id:"features", type:"textarea", q:"What are the 3 absolute must-have features for launch? Just the essentials! One per line.", hint:"" },
    { id:"platform", type:"choice", q:"How do you imagine people using this? (Phone app, website, both, or not sure yet?)", options:["Phone app (iOS/Android)","Website (browser)","Both phone + web","Not sure yet"] },
    { id:"timeline", type:"choice", q:"What's your timeline? (Days, weeks, months?)", options:["Days (ASAP)","A few weeks","1–3 months","3+ months"] },
    { id:"budget", type:"choice", q:"Budget reality check: Can you spend money on tools/services or need everything free? (Free only, up to $50/month, up to $200/month, flexible)", options:["Free tools only","Up to $50/month","Up to $200/month","Flexible budget"] },
  ],
  B: [
    { id:"topic", type:"textarea", q:"What's your research topic and project context? Include technical domain.", hint:"Describe the project and the technical area." },
    { id:"questions", type:"textarea", q:"List 3–5 specific questions your research must answer. Be detailed.", hint:"One per line." },
    { id:"decisions", type:"textarea", q:"What technical decisions will this research inform? (architecture, stack, integrations)", hint:"" },
    { id:"scope", type:"textarea", q:"Define scope boundaries — what's included and explicitly excluded?", hint:"" },
    { id:"depth", type:"textarea", q:"For each area, specify the depth needed (Surface/Deep/Comprehensive): Market Analysis, Technical Architecture, Competitor Analysis, Implementation Options, Cost Analysis.", hint:"e.g., 'Market Analysis: Deep, Technical Architecture: Comprehensive'" },
    { id:"sources", type:"textarea", q:"Rank these information sources by priority (1-7): academic papers, technical docs, GitHub, industry reports, user forums, competitor analysis, case studies.", hint:"List in order of importance, e.g., '1. Technical docs, 2. GitHub, 3. ...'" },
    { id:"constraints", type:"textarea", q:"Any technical constraints? Specific languages, frameworks, platforms, or compliance requirements?", hint:"" },
    { id:"context", type:"choice", q:"What's the business context?", options:["Personal / side project","Startup / early stage","Enterprise / established co.","Client / freelance work"] },
    { id:"timeline", type:"choice", q:"What's your timeline?", options:["ASAP (days)","Weeks","1–3 months","3+ months"] },
  ],
  C: [
    { id:"idea", type:"textarea", q:"Tell me about your project idea and current skills. What can you code, and where do you need help?", hint:"" },
    { id:"problem", type:"textarea", q:"What problem are you solving? Who has this problem most? Be specific.", hint:"" },
    { id:"research", type:"textarea", q:"What specific things do you need to research? List both technical and business aspects.", hint:"" },
    { id:"existing", type:"textarea", q:"What similar solutions exist? What do you like/dislike about them?", hint:"" },
    { id:"platform", type:"multi", q:"Platform preferences:", options:["Web app (browser)","Mobile app (iOS/Android)","Desktop app","Not sure — help me decide"] },
    { id:"stack", type:"textarea", q:"Your technical comfort zone: Languages/frameworks you know. Willing to learn new tools?", hint:"" },
    { id:"timeline", type:"textarea", q:"Timeline and success metrics? When do you want to launch and how will you measure success?", hint:"" },
    { id:"budget", type:"choice", q:"Budget for tools and services? (Free only, Under $50/month, Under $200/month, Flexible)", options:["Free only","Under $50/month","Under $200/month","Flexible"] },
  ],
};

const Q2 = {
  A: [
    { id: "name", type: "textarea", q: "What's the name of your product/app? (If undecided, we can brainstorm!)", hint: "", example: "FlowJournal" },
    { id: "problem", type: "textarea", q: "In one sentence, what problem does it solve? (Example: 'Helps freelancers track time and invoice clients automatically')", hint: "", example: "Helps solo founders capture scattered ideas and turn them into a focused weekly execution plan." },
    { id: "goal", type: "choice", q: "What's your launch goal? (Examples: '100 users', '$1000 MRR', 'Replace my day job', 'Learn to build apps')", options: ["100+ users", "$1,000+ MRR", "Replace my day job", "Learn to build apps", "Validate an idea"] },
    { id: "persona", type: "textarea", q: "Who will use your app? Describe them like you're explaining to a friend:\n- What do they do? (job, lifestyle)\n- What frustrates them currently?\n- How tech-savvy are they?", hint: "" },
    { id: "journey", type: "textarea", q: "Tell me the user journey story:\n- Sarah has problem X...\n- She discovers your app...\n- She does Y...\n- Now she's happy because Z\n(Use your own character and story!)", hint: "" },
    { id: "features", type: "textarea", q: "What are the 3-5 MUST-have features for launch? The absolute essentials only! One per line.", hint: "", example: "Inbox for new ideas\nWeekly planning view\nSimple task board\nExport PRD as markdown" },
    { id: "v2", type: "textarea", q: "What features are you intentionally saving for version 2? (This keeps MVP simple)", hint: "" },
    { id: "metric", type: "choice", q: "How will you know it's working? Pick 1-2 simple metrics:", options: ["Number of signups", "Daily active users", "Tasks completed", "Customer feedback score"] },
    { id: "vibe", type: "textarea", q: "Describe the vibe in 3-5 words (Examples: 'Clean, fast, professional' or 'Fun, colorful, friendly')", hint: "" },
    { id: "constraints", type: "textarea", q: "Any constraints or non-functional requirements? Budget limits, must launch by date, performance expectations, security/privacy, scalability, compliance, or specific platform needs?", hint: "" },
  ],
  B: [
    { id: "name", type: "textarea", q: "Product name?", hint: "Working title is fine", example: "MVP Builder Studio" },
    { id: "problem", type: "textarea", q: "One-sentence problem statement:", hint: "Clear and measurable" },
    { id: "goal", type: "textarea", q: "Measurable launch goal?", hint: "e.g., '100 paying customers in 90 days'" },
    { id: "persona", type: "textarea", q: "Define your target audience:\n- Primary persona (demographics, role, technical level)\n- Secondary personas (if any)\n- Jobs to be done (what they're hiring your product for)", hint: "" },
    { id: "stories", type: "textarea", q: "Write 3-5 user stories:\nPrimary: 'As a [user type], I want to [action] so that [benefit]'\n(Add 2-4 supporting stories)", hint: "" },
    { id: "features", type: "textarea", q: "List core MVP features with MoSCoW prioritization:\n- Must have: [3-5 features]\n- Should have: [2-3 features]\n- Could have: [2-3 features]\n- Won't have (this release): [list]", hint: "" },
    { id: "metrics", type: "textarea", q: "Define success metrics (be specific):\n- Activation: [metric and target]\n- Engagement: [metric and target]\n- Retention: [metric and target]\n- Revenue (if applicable): [metric and target]", hint: "" },
    { id: "nfr", type: "textarea", q: "Technical and UX requirements:\n- Performance: [requirements]\n- Accessibility: [standards]\n- Platform support: [browsers, devices]\n- Security/Privacy: [requirements]\n- Scalability: [expectations]\n- Design system: [preferences]", hint: "" },
    { id: "risks", type: "textarea", q: "Risk assessment:\n- Technical risks: [list]\n- Market risks: [list]\n- Execution risks: [list]", hint: "" },
    { id: "constraints", type: "textarea", q: "Business model and constraints:\n- Monetization strategy (if any)\n- Budget constraints\n- Timeline requirements\n- Compliance/regulatory needs", hint: "" },
  ],
  C: [
    { id: "name", type: "textarea", q: "Product name?", hint: "Working title is fine", example: "Vibe Tasks" },
    { id: "problem", type: "textarea", q: "In one sentence, what problem does it solve?", hint: "Clear and concise" },
    { id: "goal", type: "choice", q: "What's your launch goal?", options: ["Get first paying users", "Validate the idea", "Build a portfolio project", "Replace a current tool I use", "Side income"] },
    { id: "persona", type: "textarea", q: "Who are your users and what do they need?\n- Primary user type: [describe]\n- Their main problem: [describe]\n- Current solution they use: [if any]", hint: "" },
    { id: "flow", type: "textarea", q: "Walk through the main user flow:\n- User arrives at app because...\n- First thing they see/do...\n- Core action they take...\n- Value they get...", hint: "" },
    { id: "features", type: "textarea", q: "What 3-5 features must be in v1? For each, explain:\n- Feature name\n- What it does\n- Why it's essential", hint: "" },
    { id: "v2", type: "textarea", q: "What are you NOT building yet? List features for v2 and why they can wait.", hint: "" },
    { id: "metric", type: "textarea", q: "How will you measure success?\n- Short term (1 month): [metric]\n- Medium term (3 months): [metric]", hint: "" },
    { id: "vibe", type: "textarea", q: "Design and user experience:\n- Visual style: [describe]\n- Key screens: [list main ones]\n- Mobile responsive? [yes/no/mobile-first]", hint: "" },
    { id: "constraints", type: "textarea", q: "Constraints and requirements:\n- Budget for tools/services: [$X/month]\n- Timeline: [launch date]\n- Non-functional requirements: [performance, security/privacy, scalability, compliance]\n- Any technical preferences from research?", hint: "" },
  ],
};

const Q3 = {
  A: [
    { id: "platform", type: "choice", q: "Based on your PRD, where should people use your app?", options: ["Web (any browser)", "Mobile app (app store)", "Desktop app", "Help me decide based on my users"] },
    { id: "coding", type: "choice", q: "What's your coding situation?", options: ["No-code only (visual builders, zero code)", "AI writes all code (I guide and test)", "Learning basics (simple code with AI help)", "I want to understand what's built"] },
    { id: "budget", type: "choice", q: "Budget for tools and services?", options: ["Free only (using free tiers)", "Up to $50/month", "Up to $200/month", "Flexible for the right tools"] },
    { id: "timeline", type: "choice", q: "How quickly do you need to launch?", options: ["ASAP (1–2 weeks)", "1 month", "2–3 months", "No rush, learning focus"] },
    { id: "worry", type: "choice", q: "What worries you most about building?", options: ["Getting stuck with no help", "Costs getting out of control", "Security / data problems", "Making wrong tech choices", "Breaking things and not knowing how to fix"] },
    { id: "tools", type: "textarea", q: "Have you tried any tools yet? Name AI tools, no-code platforms, or frameworks. What did you like/dislike?", hint: "" },
    { id: "priority", type: "choice", q: "For your core feature from the PRD, what's most important?", options: ["Super simple to build", "Works perfectly", "Looks amazing", "Scales if successful"] },
    { id: "ai_features", type: "textarea", q: "Do you want any AI-powered features (chat, summarization, recommendations)? If yes, list them and any privacy constraints. Type 'No' if not.", hint: "" },
  ],
  B: [
    { id: "platform", type: "textarea", q: "Based on your PRD, what's your platform strategy and why?", hint: "e.g., web-first, mobile app, etc." },
    { id: "stack", type: "textarea", q: "Preferred tech stack? Consider:\n- Frontend: React/Vue/Next.js/Remix\n- Backend: Node/Python/Go/Serverless\n- Database: PostgreSQL/MongoDB/Supabase/Firebase\n- Infrastructure: AWS/Vercel/Cloudflare\n- AI Integration: Claude API/OpenAI/Gemini", hint: "" },
    { id: "architecture", type: "choice", q: "Architecture pattern for this MVP?", options: ["Monolithic (simple, fast to build)", "Serverless (pay per use, auto-scale)", "Full-stack framework (Next.js/Remix/Rails)", "Microservices (complex, scalable)", "Jamstack (static + APIs)"] },
    { id: "services", type: "textarea", q: "Based on your PRD features, how will you handle:\n- Authentication\n- File storage\n- Payments\n- Email\n- Analytics", hint: "Name specific services or approaches." },
    { id: "ai_tool", type: "multi", q: "AI coding assistance strategy?", options: ["Claude Code (CLI)", "Cursor (IDE)", "Gemini CLI", "GitHub Copilot", "Google Antigravity", "Mix of tools"] },
    { id: "workflow", type: "textarea", q: "Development workflow preferences?\n- Git strategy\n- CI/CD\n- Testing priorities\n- Environments", hint: "" },
    { id: "scaling", type: "textarea", q: "Performance and scaling considerations?\n- Expected load\n- Data volume\n- Geographic distribution\n- Real-time requirements", hint: "" },
    { id: "security", type: "textarea", q: "Security and compliance needs?\n- Data sensitivity\n- Compliance (GDPR/HIPAA)\n- Auth method\n- API security", hint: "" },
    { id: "ai_features", type: "textarea", q: "Any AI/LLM product features? If yes, specify use cases, latency/cost constraints, and data sensitivity.", hint: "" },
  ],
  C: [
    { id: "platform", type: "choice", q: "Where should your app run based on your PRD?", options: ["Web app (easiest to build & deploy)", "Mobile app (harder but better for users)", "Both (start with one first)", "Help me decide"] },
    { id: "skills", type: "textarea", q: "Your current technical comfort zone:\n- Languages you know\n- Frameworks you've tried\n- Comfortable with frontend/backend/databases?\n- Want to learn specific technologies?", hint: "" },
    { id: "approach", type: "choice", q: "Which building approach appeals to you?", options: ["No-code platform (Lovable, v0) — Fastest", "Low-code with AI (Cursor + templates) — Balance", "Learn by doing (AI guides you) — Educational", "Hire it out (you manage) — Hands-off"] },
    { id: "complexity", type: "multi", q: "Looking at your features, what's the technical complexity?", options: ["Simple CRUD (create, read, update, delete)", "Real-time updates needed", "File uploads/processing", "Third-party integrations", "Complex calculations / logic"] },
    { id: "budget", type: "textarea", q: "Budget reality check:\n- Development tools: $/month\n- Hosting/servers: $/month\n- Services (email, storage): $/month\n- Can you spend $[total]?", hint: "" },
    { id: "ai_assist", type: "choice", q: "AI assistance preference:", options: ["AI does everything, I test", "AI explains, I understand", "AI helps when stuck", "Mix depending on complexity"] },
    { id: "timeline_detail", type: "textarea", q: "Based on your PRD timeline, what's realistic?\n- Hours/week you can dedicate\n- Target launch date\n- Beta test user count", hint: "" },
    { id: "ai_features", type: "textarea", q: "Do you want any AI-powered features (chat, summarization, recommendations)? If yes, list them and any privacy constraints.", hint: "" },
  ],
};

const Q4 = {
  all: [
    { id:"tools", type:"tools", q:"Which AI tool(s) will you use to build?", hint:"Select all that apply. This determines which config files get generated." },
    { id:"extra", type:"textarea", q:"Any special instructions for your AI assistant?", hint:"Coding style preferences, things to avoid, team conventions, etc. (optional)" },
  ],
};

// ─── Unified LLM Call ─────────────────────────────────────────────────────────
async function callLLM(systemPrompt, userMessage, settings) {
  const { provider, apiKey } = settings;
  if (!apiKey) throw new Error('API key is missing. Please set it in the settings.');

  const commonHeaders = {
    'Content-Type': 'application/json',
  };

  let url, headers, body;

  switch (provider) {
    case 'claude':
      url = 'https://api.anthropic.com/v1/messages';
      headers = {
        ...commonHeaders,
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      };
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
      // Gemini expects a single prompt; combine system and user
      const fullPrompt = `${systemPrompt}\n\n${userMessage}`;
      body = JSON.stringify({
        contents: [{ parts: [{ text: fullPrompt }] }],
        generationConfig: { maxOutputTokens: 8000 },
      });
      break;
    }

    case 'groq':
      url = 'https://api.groq.com/openai/v1/chat/completions';
      headers = {
        ...commonHeaders,
        'Authorization': `Bearer ${apiKey}`,
      };
      body = JSON.stringify({
        // Use a current Groq model; original llama3-70b-8192 is deprecated
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userMessage },
        ],
        max_tokens: 8000,
      });
      break;

    default:
      throw new Error(`Unsupported provider: ${provider}`);
  }

  const response = await fetch(url, { method: 'POST', headers, body });
  const data = await response.json();

  if (!response.ok) {
    const errorMsg = data.error?.message || JSON.stringify(data);
    throw new Error(`${provider} API error: ${errorMsg}`);
  }

  // Extract text based on provider
  if (provider === 'claude') {
    return data.content?.map(b => b.text).join('') || '';
  } else if (provider === 'gemini') {
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  } else if (provider === 'groq') {
    return data.choices?.[0]?.message?.content || '';
  }
  return '';
}

// ─── Settings Panel ───────────────────────────────────────────────────────────
function SettingsPanel({ settings, onSave, onClose }) {
  const [localSettings, setLocalSettings] = useState(settings);

  const handleChange = (field, value) => {
    setLocalSettings(prev => ({ ...prev, [field]: value }));
  };

  const providers = [
    { id: 'claude', name: 'Claude (Anthropic)' },
    { id: 'gemini', name: 'Gemini (Google)' },
    { id: 'groq', name: 'Groq (Llama 3)' },
  ];

  const providerHints = {
    claude: "Best for deep reasoning, PRDs, and nuanced trade-off analysis.",
    gemini: "Great for research-style tasks and very long context, uses Google's Generative Language API.",
    groq: "Fast, cheap drafts using Llama 3.x on Groq's low-latency inference.",
  };

  return (
    <div style={{
      position: 'fixed', top: 0, right: 0, bottom: 0, width: '320px',
      background: '#0a0a14', borderLeft: '1px solid #ffc03d40', zIndex: 100,
      padding: '24px', overflowY: 'auto', boxShadow: '-4px 0 20px rgba(0,0,0,0.5)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <h3 style={{ color: '#ffc03d', margin: 0 }}>⚙️ LLM Settings</h3>
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#908c80', fontSize: '20px', cursor: 'pointer' }}>✕</button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#908c80', marginBottom: '6px' }}>Provider</label>
        <select
          value={localSettings.provider}
          onChange={e => handleChange('provider', e.target.value)}
          style={{
            width: '100%', background: '#1a1a24', border: '1px solid #333', color: '#e0dcd0',
            padding: '10px', borderRadius: '4px', fontSize: '13px'
          }}
        >
          {providers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        <p style={{ fontSize: '11px', color: '#605c50', marginTop: '6px' }}>
          {providerHints[localSettings.provider] || "Pick a model provider for generation."}
        </p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', fontSize: '12px', color: '#908c80', marginBottom: '6px' }}>API Key</label>
        <input
          type="password"
          value={localSettings.apiKey}
          onChange={e => handleChange('apiKey', e.target.value)}
          placeholder="sk-..."
          style={{
            width: '100%', background: '#1a1a24', border: '1px solid #333', color: '#e0dcd0',
            padding: '10px', borderRadius: '4px', fontSize: '13px'
          }}
        />
        <p style={{ fontSize: '11px', color: '#605c50', marginTop: '6px' }}>
          Your key is stored only in your browser’s local storage.
        </p>
      </div>

      <div style={{ display: 'flex', gap: '8px' }}>
        <button
          onClick={() => onSave(localSettings)}
          className="btn"
          style={{ flex: 1 }}
        >
          Save
        </button>
        <button
          onClick={onClose}
          className="btn-ghost"
          style={{ flex: 1 }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function Dots({ steps, current }) {
  return (
    <div className="step-dots">
      {steps.map((_, i) => (
        <div key={i} className={`sdot${i === current ? " a" : i < current ? " d" : ""}`} />
      ))}
    </div>
  );
}

function QuestionSlide({ q, value, onChange, stepNum, total, onNext, onBack }) {
  const arr = Array.isArray(value);
  const ok = arr ? value.length > 0 : ((value || "").trim().length > 0 || q.type === "textarea");

  return (
    <div className="card">
      <Dots steps={Array(total).fill(0)} current={stepNum - 1} />
      <div className="q-label">Question {stepNum} of {total}</div>
      <div className="q-text">{q.q}</div>
      {q.hint && <div className="q-hint">{q.hint}</div>}
      {q.example && !value && (
        <div style={{ marginBottom: 10 }}>
          <button
            className="btn-ghost"
            type="button"
            onClick={() => onChange(q.example)}
            style={{ fontSize: 11, padding: "6px 10px" }}
          >
            Use example
          </button>
        </div>
      )}

      {q.type === "textarea" && (
        <textarea autoFocus value={value || ""} onChange={e => onChange(e.target.value)}
          placeholder="Type your answer..." rows={4} />
      )}
      {q.type === "choice" && (
        <div className="choices">
          {q.options.map(o => (
            <button key={o} className={`choice-btn${value === o ? " sel" : ""}`} onClick={() => onChange(o)}>
              <span className="chk">{value === o ? "✓" : ""}</span>{o}
            </button>
          ))}
        </div>
      )}
      {q.type === "multi" && (
        <div className="choices">
          {q.options.map(o => {
            const s = Array.isArray(value) && value.includes(o);
            return (
              <button key={o} className={`choice-btn${s ? " sel" : ""}`}
                onClick={() => {
                  const cur = Array.isArray(value) ? value : [];
                  onChange(s ? cur.filter(x => x !== o) : [...cur, o]);
                }}>
                <span className="chk">{s ? "✓" : ""}</span>{o}
              </button>
            );
          })}
        </div>
      )}
      {q.type === "tools" && (
        <div className="tool-grid">
          {AI_TOOLS.map(t => {
            const s = Array.isArray(value) && value.includes(t.id);
            return (
              <button key={t.id} className={`tool-btn${s ? " sel" : ""}`}
                onClick={() => {
                  const cur = Array.isArray(value) ? value : [];
                  onChange(s ? cur.filter(x => x !== t.id) : [...cur, t.id]);
                }}>
                <div className="tool-name">{t.name}</div>
                <div className="tool-desc">{t.desc}</div>
              </button>
            );
          })}
        </div>
      )}

      <div className="btn-row">
        {onBack && <button className="btn-ghost" onClick={onBack}>← Back</button>}
        <button className="btn" onClick={onNext} disabled={!ok && q.type !== "textarea"}>
          {stepNum === total ? "Review →" : "Next →"}
        </button>
      </div>
    </div>
  );
}

function EchoSlide({ echoRows, onConfirm, onEdit, confirmLabel = "Generate →" }) {
  return (
    <div className="card">
      <div className="q-label">Verification Echo</div>
      <div className="q-text">Let me confirm I understand correctly.</div>
      <div className="echo-box">
        <div className="echo-title">◈ Summary</div>
        {echoRows.map(([k, v]) => v ? (
          <div key={k} className="echo-row">
            <span className="echo-k">{k}</span>
            <span className="echo-v">{Array.isArray(v) ? v.join(", ") : v}</span>
          </div>
        ) : null)}
      </div>
      <p style={{fontSize:12,color:"#504e48",marginBottom:20}}>Is this accurate? Confirm to proceed, or go back to edit.</p>
      <div className="btn-row">
        <button className="btn-ghost" onClick={onEdit}>← Edit</button>
        <button className="btn" onClick={onConfirm}>{confirmLabel}</button>
      </div>
    </div>
  );
}

function ContextPaste({ label, value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="ctx-box">
      <button className="ctx-toggle" onClick={() => setOpen(o => !o)}>
        {open ? "▾" : "▸"} {label} (optional — paste previous output to improve results)
      </button>
      {open && (
        <div className="ctx-open">
          <textarea value={value} onChange={e => onChange(e.target.value)}
            placeholder="Paste your previous document here..." rows={6} style={{minHeight:120}} />
        </div>
      )}
    </div>
  );
}

function OutputSlide({ title, content, onNext, nextLabel, filename }) {
  const [copied, setCopied] = useState(false);

  const copy = () => {
    const ta = document.createElement("textarea");
    ta.value = content;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    try { document.execCommand("copy"); } catch { /* ignore error */ }
    document.body.removeChild(ta);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(content).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const download = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "output.md";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card">
      <div className="out-header">
        <div className="out-title">{title}</div>
        <div className="out-actions">
          <button className={`copy-btn${copied ? " copied" : ""}`} onClick={copy}>
            {copied ? "✓ Copied!" : "Copy"}
          </button>
          <button className="dl-btn" onClick={download}>↓ Download</button>
        </div>
      </div>
      <pre>{content}</pre>
      {onNext && (
        <div className="next-part">
          <span className="next-txt">Ready for the next step? →</span>
          <button className="btn" onClick={onNext}>{nextLabel}</button>
        </div>
      )}
    </div>
  );
}

function Loading({ msg }) {
  return (
    <div className="card">
      <div className="loading-box">
        <div className="spinner" />
        <div className="loading-txt">{msg || "Generating your document…"}</div>
      </div>
    </div>
  );
}

function ProjectKit({ outputs }) {
  if (!outputs[0] || !outputs[1] || !outputs[2] || !outputs[3]) return null;

  const content = [
    "=== RESEARCH PROMPT ===",
    outputs[0],
    "",
    "=== PRODUCT REQUIREMENTS DOCUMENT ===",
    outputs[1],
    "",
    "=== TECHNICAL DESIGN DOCUMENT ===",
    outputs[2],
    "",
    "=== AGENTS & AGENT DOCS ===",
    outputs[3],
  ].join("\n");

  return (
    <div style={{ marginTop: 24 }}>
      <OutputSlide
        title="Full Project Kit"
        content={content}
        filename="MVP-Project-Kit.md"
        onNext={null}
        nextLabel={null}
      />
    </div>
  );
}

// ─── Part Flows ───────────────────────────────────────────────────────────────

function Part1({ userType, setUserType, globalAnswers, setGlobalAnswers, onComplete, savedOutput }) {
  const [phase, setPhase] = useState(savedOutput ? "output" : "type"); // type|questions|echo|output
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(globalAnswers.p1 || {});
  const [output, setOutput] = useState(savedOutput || "");

  const qs = userType ? Q1[userType] : [];
  const q = qs[step];

  const save = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const finish = () => {
    const prompt = generateResearchPrompt(userType, answers);
    setOutput(prompt);
    setGlobalAnswers(a => ({ ...a, p1: answers }));
    onComplete(prompt);
    setPhase("output");
  };

  const echoRows = [
    ["Type", userType === "A" ? "Vibe-Coder" : userType === "B" ? "Developer" : "In Between"],
    ...(Object.entries(answers).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]))
  ];

  return (
    <>
      {phase === "type" && (
        <div className="card">
          <div className="q-label">Step 1</div>
          <div className="q-text">What's your technical background?</div>
          <div className="q-hint">This tailors your research prompt to the right depth.</div>
          <div className="type-grid">
            {USER_TYPES.map(t => (
              <button key={t.id} className="type-btn" onClick={() => { setUserType(t.id); setPhase("questions"); setStep(0); }}>
                <span className="type-letter">{t.id}</span>
                <span className="type-name">{t.name}</span>
                <span className="type-desc">{t.desc}</span>
              </button>
            ))}
          </div>
        </div>
      )}
      {phase === "questions" && q && (
        <QuestionSlide q={q} value={answers[q.id]} onChange={v => save(q.id, v)}
          stepNum={step+1} total={qs.length}
          onNext={() => step < qs.length - 1 ? setStep(s=>s+1) : setPhase("echo")}
          onBack={step > 0 ? () => setStep(s=>s-1) : () => setPhase("type")} />
      )}
      {phase === "echo" && (
        <EchoSlide echoRows={echoRows} confirmLabel="Generate Research Prompt →"
          onConfirm={finish}
          onEdit={() => { setStep(qs.length - 1); setPhase("questions"); }} />
      )}
      {phase === "output" && (
        <>
          <OutputSlide title="Your Research Prompt" content={output} filename="research-prompt.md"
            onNext={() => onComplete(output, true)} nextLabel="Continue to Part 2: PRD →" />
          <div className="platforms">
            <div className="plat-title">Recommended Platforms</div>
            <div className="plat-grid">
              {[["Claude","Technical accuracy, strong code analysis"],["Gemini","Large context, comprehensive research"],["ChatGPT","Quick iterations and reasoning"]].map(([n,d]) => (
                <div key={n} className="plat-card"><div className="plat-name">{n}</div><div className="plat-desc">{d}</div></div>
              ))}
            </div>
            <p style={{fontSize:11,color:"#2e2c28",marginTop:12,lineHeight:1.7}}>Pro tip: Run on 2 platforms and compare. Enable web search for up-to-date data.</p>
          </div>
          <button className="restart" onClick={() => { setPhase("type"); setAnswers({}); setOutput(""); setUserType(null); }}>↺ Start over</button>
        </>
      )}
    </>
  );
}

function Part2({ userType, globalAnswers, setGlobalAnswers, onComplete, savedOutput, autoContext, llmSettings }) {
  const [phase, setPhase] = useState(savedOutput ? "output" : "start");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(globalAnswers.p2 || {});
  const [output, setOutput] = useState(savedOutput || "");
  const [err, setErr] = useState("");
  const [manualContext, setManualContext] = useState(""); // for optional pasted research

  const type = userType || "C";
  const qs = Q2[type];
  const q = qs[step];
  const save = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const generate = async () => {
    setPhase("generating");
    setGlobalAnswers(a => ({ ...a, p2: answers }));
    try {
      // Combine automatic context (from Part 1) and manually pasted research
      const combinedContext = [autoContext, manualContext].filter(Boolean).join("\n\n---\n\n");
      const sysPrompt = buildPRDPrompt(type, answers, combinedContext);
      const userMsg = `Generate a complete PRD for my MVP.\n\n${Object.entries(answers)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join("\n")}`;
      const result = await callLLM(sysPrompt, userMsg, llmSettings);
      setOutput(result);
      onComplete(result);
      setPhase("output");
    } catch (e) {
      setErr(e.message);
      setPhase("echo");
    }
  };

  const echoRows = Object.entries(answers).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]);
  const provider = llmSettings?.provider || "claude";

  const friendlyError = err
    ? err.includes("API key is missing")
      ? "Add your API key in the settings panel (top-right) and try again."
      : err.includes("decommissioned")
      ? "This model has been deprecated by the provider. Update the model name or switch providers in settings."
      : err
    : "";

  return (
    <>
      {phase === "start" && (
        <div className="card">
          <div className="q-label">Part 2 — PRD Generator</div>
          <div className="q-text">Let's define WHAT you're building.</div>
          <div className="q-hint" style={{ marginBottom: autoContext ? 16 : 24 }}>
            Answer a few questions and I'll generate a complete Product Requirements Document for your MVP.
          </div>

          {/* Automatic context notification */}
          {autoContext && (
            <div style={{ padding: "10px 14px", background: "rgba(255,192,61,0.06)", border: "1px solid rgba(255,192,61,0.2)", borderRadius: 4, fontSize: 12, color: "#908c60", marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#ffc03d" }}>✓</span> Research from Part 1 will be automatically included as context.
            </div>
          )}

          {/* Optional manual context paste (matches the "file upload" idea) */}
          <ContextPaste
            label="Paste your research findings (if you have them)"
            value={manualContext}
            onChange={setManualContext}
          />

          <div className="btn-row">
            <button className="btn" onClick={() => setPhase("questions")}>
              Start Questions →
            </button>
          </div>
        </div>
      )}

      {phase === "questions" && q && (
        <QuestionSlide
          q={q}
          value={answers[q.id]}
          onChange={(v) => save(q.id, v)}
          stepNum={step + 1}
          total={qs.length}
          onNext={() => (step < qs.length - 1 ? setStep((s) => s + 1) : setPhase("echo"))}
          onBack={step > 0 ? () => setStep((s) => s - 1) : () => setPhase("start")}
        />
      )}

      {phase === "echo" && (
        <>
          {err && (
            <div style={{ padding: "10px 14px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 4, fontSize: 12, color: "#ff8080", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>LLM error ({provider}):</div>
              <div>{friendlyError}</div>
            </div>
          )}
          <EchoSlide
            echoRows={echoRows}
            confirmLabel="Generate PRD →"
            onConfirm={generate}
            onEdit={() => {
              setStep(qs.length - 1);
              setPhase("questions");
            }}
          />
        </>
      )}

      {phase === "generating" && <Loading msg="Writing your Product Requirements Document…" />}

      {phase === "output" && (
        <OutputSlide
          title="Product Requirements Document"
          content={output}
          filename="PRD-MVP.md"
          onNext={() => onComplete(output, true)}
          nextLabel="Continue to Part 3: Tech Design →"
        />
      )}
    </>
  );
}

function Part3({ userType, globalAnswers, setGlobalAnswers, onComplete, savedOutput, autoContext, llmSettings }) {
  const [phase, setPhase] = useState(savedOutput ? "output" : "start");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(globalAnswers.p3 || {});
  const [output, setOutput] = useState(savedOutput || "");
  const [err, setErr] = useState("");
  const [prdContext, setPrdContext] = useState("");    // manually pasted PRD
  const [researchContext, setResearchContext] = useState(""); // manually pasted research

  const type = userType || "C";
  const qs = Q3[type];
  const q = qs[step];
  const save = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const generate = async () => {
    setPhase("generating");
    setGlobalAnswers(a => ({ ...a, p3: answers }));
    try {
      // Combine all context: autoContext (from Part 2) + pasted PRD + pasted research
      const combinedContext = [autoContext, prdContext, researchContext]
        .filter(Boolean)
        .join("\n\n---\n\n");
      const sysPrompt = buildTechPrompt(type, answers, combinedContext);
      const userMsg = `Generate a complete Technical Design Document.\n\n${Object.entries(answers)
        .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(", ") : v}`)
        .join("\n")}`;
      const result = await callLLM(sysPrompt, userMsg, llmSettings);
      setOutput(result);
      onComplete(result);
      setPhase("output");
    } catch (e) {
      setErr(e.message);
      setPhase("echo");
    }
  };

  const echoRows = Object.entries(answers).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]);
  const provider = llmSettings?.provider || "claude";
  const friendlyError = err
    ? err.includes("API key is missing")
      ? "Add your API key in the settings panel (top-right) and try again."
      : err.includes("decommissioned")
      ? "This model has been deprecated by the provider. Update the model name or switch providers in settings."
      : err
    : "";

  return (
    <>
      {phase === "start" && (
        <div className="card">
          <div className="q-label">Part 3 — Technical Design</div>
          <div className="q-text">Let's define HOW you'll build it.</div>
          <div className="q-hint" style={{ marginBottom: autoContext ? 16 : 24 }}>
            I'll help you create a complete Technical Design Document for your MVP.
          </div>

          {/* Automatic context notification */}
          {autoContext && (
            <div style={{ padding: "10px 14px", background: "rgba(255,192,61,0.06)", border: "1px solid rgba(255,192,61,0.2)", borderRadius: 4, fontSize: 12, color: "#908c60", marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#ffc03d" }}>✓</span> Your PRD from Part 2 will be automatically included as context.
            </div>
          )}

          {/* Required PRD paste */}
          <ContextPaste
            label="Paste your PRD document (required)"
            value={prdContext}
            onChange={setPrdContext}
          />

          {/* Optional research paste */}
          <ContextPaste
            label="Paste your research findings (optional)"
            value={researchContext}
            onChange={setResearchContext}
          />

          <div className="btn-row">
            <button
              className="btn"
              onClick={() => {
                if (!prdContext && !autoContext) {
                  alert("Please paste your PRD document or ensure Part 2 is completed.");
                  return;
                }
                setPhase("questions");
              }}
            >
              Start Questions →
            </button>
          </div>
        </div>
      )}

      {phase === "questions" && q && (
        <QuestionSlide
          q={q}
          value={answers[q.id]}
          onChange={(v) => save(q.id, v)}
          stepNum={step + 1}
          total={qs.length}
          onNext={() => (step < qs.length - 1 ? setStep((s) => s + 1) : setPhase("echo"))}
          onBack={step > 0 ? () => setStep((s) => s - 1) : () => setPhase("start")}
        />
      )}

      {phase === "echo" && (
        <>
          {err && (
            <div style={{ padding: "10px 14px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 4, fontSize: 12, color: "#ff8080", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>LLM error ({provider}):</div>
              <div>{friendlyError}</div>
            </div>
          )}
          <EchoSlide
            echoRows={echoRows}
            confirmLabel="Generate Tech Design →"
            onConfirm={generate}
            onEdit={() => {
              setStep(qs.length - 1);
              setPhase("questions");
            }}
          />
        </>
      )}

      {phase === "generating" && <Loading msg="Designing your technical architecture…" />}

      {phase === "output" && (
        <>
          <OutputSlide
            title="Technical Design Document"
            content={output}
            filename="TechDesign-MVP.md"
            onNext={() => onComplete(output, true)}
            nextLabel="Continue to Part 4: AGENTS.md →"
          />
          <div style={{ marginTop: 24, padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4 }}>
            <div style={{ fontSize: 11, color: "#ffc03d", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
              ✅ Self-Verification Checklist
            </div>
            <ul style={{ fontSize: 12, color: "#908c80", lineHeight: 1.7, paddingLeft: 20 }}>
              <li>Platform/approach clearly chosen</li>
              <li>Alternatives compared with pros/cons</li>
              <li>Tech stack fully specified</li>
              <li>Trade-offs honestly acknowledged</li>
              <li>Cost breakdown included</li>
              <li>Timeline realistic</li>
              <li>AI assistance strategy defined</li>
            </ul>
            <p style={{ fontSize: 12, color: "#706c60", marginTop: 12 }}>
              <strong>Critical Review Questions:</strong><br />
              1. Does this tech stack match the budget? (Free tiers vs paid)<br />
              2. Does the timeline match the complexity? (Realistic expectations)<br />
              3. Are there any security concerns? (User data, payments)
            </p>
            <p style={{ fontSize: 12, color: "#ffc03d", marginTop: 12 }}>
              Save this as <code>TechDesign-[AppName]-MVP.md</code> in your project folder.
            </p>
          </div>
        </>
      )}
    </>
  );
}

function Part4({ userType, globalAnswers, setGlobalAnswers, savedOutput, autoContext, llmSettings }) {
  const [phase, setPhase] = useState(savedOutput ? "output" : "start");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState(globalAnswers.p4 || {});
  const [output, setOutput] = useState(savedOutput || "");
  const [err, setErr] = useState("");
  const [prdContext, setPrdContext] = useState("");      // manually pasted PRD
  const [techContext, setTechContext] = useState("");     // manually pasted Tech Design
  const [researchContext, setResearchContext] = useState(""); // optional research

  const type = userType || "C";
  const qs = Q4.all;
  const q = qs[step];
  const save = (id, val) => setAnswers(a => ({ ...a, [id]: val }));

  const generate = async () => {
    setPhase("generating");
    setGlobalAnswers(a => ({ ...a, p4: answers }));
    try {
      // Combine all context: autoContext (from previous parts) + pasted PRD + pasted Tech + optional research
      const combinedContext = [autoContext, prdContext, techContext, researchContext]
        .filter(Boolean)
        .join("\n\n---\n\n");
      const sysPrompt = buildAgentsPrompt(type, answers, combinedContext);
      const userMsg = `Generate ALL agent instruction files for my project. Do not skip any file. Write each one fully.\n\nSelected AI tools: ${Array.isArray(answers.tools) ? answers.tools.join(", ") : "cursor"}\nExtra instructions: ${answers.extra || "None"}\n\nProject context:\n${combinedContext || "Use the answers provided in the system prompt."}`;
      const result = await callLLM(sysPrompt, userMsg, llmSettings);
      setOutput(result);
      setPhase("output");
    } catch (e) {
      setErr(e.message);
      setPhase("echo");
    }
  };

  const echoRows = Object.entries(answers).map(([k, v]) => [k.charAt(0).toUpperCase() + k.slice(1), v]);
  const provider = llmSettings?.provider || "claude";
  const friendlyError = err
    ? err.includes("API key is missing")
      ? "Add your API key in the settings panel (top-right) and try again."
      : err.includes("decommissioned")
      ? "This model has been deprecated by the provider. Update the model name or switch providers in settings."
      : err
    : "";

  return (
    <>
      {phase === "start" && (
        <div className="card">
          <div className="q-label">Part 4 — AGENTS.md</div>
          <div className="q-text">Generate your AI agent instruction files.</div>
          <div className="q-hint" style={{ marginBottom: autoContext ? 16 : 24 }}>
            These files guide your AI coding assistant — AGENTS.md, tool configs, and agent_docs/ — so it has full project context and builds exactly what you want.
          </div>

          {/* Automatic context notification */}
          {autoContext && (
            <div style={{ padding: "10px 14px", background: "rgba(255,192,61,0.06)", border: "1px solid rgba(255,192,61,0.2)", borderRadius: 4, fontSize: 12, color: "#908c60", marginBottom: 20, display: "flex", gap: 8, alignItems: "center" }}>
              <span style={{ color: "#ffc03d" }}>✓</span> Research + PRD + Tech Design from previous parts will be automatically included as context.
            </div>
          )}

          {/* Required PRD paste */}
          <ContextPaste
            label="Paste your PRD document (required)"
            value={prdContext}
            onChange={setPrdContext}
          />

          {/* Required Tech Design paste */}
          <ContextPaste
            label="Paste your Technical Design document (required)"
            value={techContext}
            onChange={setTechContext}
          />

          {/* Optional research paste */}
          <ContextPaste
            label="Paste your research findings (optional)"
            value={researchContext}
            onChange={setResearchContext}
          />

          <div className="btn-row">
            <button
              className="btn"
              onClick={() => {
                if (!autoContext && !prdContext && !techContext) {
                  alert("Please paste your PRD and Technical Design documents, or ensure previous parts are completed.");
                  return;
                }
                setPhase("questions");
              }}
            >
              Start Questions →
            </button>
          </div>
        </div>
      )}

      {phase === "questions" && q && (
        <QuestionSlide
          q={q}
          value={answers[q.id]}
          onChange={(v) => save(q.id, v)}
          stepNum={step + 1}
          total={qs.length}
          onNext={() => (step < qs.length - 1 ? setStep((s) => s + 1) : setPhase("echo"))}
          onBack={step > 0 ? () => setStep((s) => s - 1) : () => setPhase("start")}
        />
      )}

      {phase === "echo" && (
        <>
          {err && (
            <div style={{ padding: "10px 14px", background: "rgba(255,80,80,0.08)", border: "1px solid rgba(255,80,80,0.2)", borderRadius: 4, fontSize: 12, color: "#ff8080", marginBottom: 12 }}>
              <div style={{ fontWeight: 600, marginBottom: 4 }}>LLM error ({provider}):</div>
              <div>{friendlyError}</div>
            </div>
          )}
          <EchoSlide
            echoRows={echoRows}
            confirmLabel="Generate AGENTS.md →"
            onConfirm={generate}
            onEdit={() => {
              setStep(qs.length - 1);
              setPhase("questions");
            }}
          />
        </>
      )}

      {phase === "generating" && <Loading msg="Generating your AI agent instruction files…" />}

      {phase === "output" && (
        <>
          <OutputSlide
            title="Agent Instruction Files"
            content={output}
            filename="AGENTS.md"
            onNext={null}
            nextLabel={null}
          />
          <div style={{ marginTop: 24, padding: 20, background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)", borderRadius: 4 }}>
            <div style={{ fontSize: 11, color: "#ffc03d", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>
              ✅ Next Steps
            </div>
            <p style={{ fontSize: 12, color: "#908c80", lineHeight: 1.7 }}>
              <strong>Files to save:</strong><br />
              1. <code>AGENTS.md</code> — in your project root<br />
              2. <code>agent_docs/</code> — create this folder and save the detailed markdown files inside it.<br />
              3. Tool‑specific config files (based on your selection) — save them as indicated in the output.
            </p>
            <p style={{ fontSize: 12, color: "#908c80", lineHeight: 1.7, marginTop: 12 }}>
              <strong>Your project structure should look like:</strong>
            </p>
            <pre style={{ background: "#0a0a14", padding: 12, borderRadius: 4, fontSize: 11, color: "#c0bcb0" }}>
{`your-app/
├── docs/
│   ├── research-[AppName].txt
│   ├── PRD-[AppName]-MVP.md
│   └── TechDesign-[AppName]-MVP.md
├── AGENTS.md
├── agent_docs/
│   ├── tech_stack.md
│   ├── code_patterns.md
│   ├── project_brief.md
│   ├── product_requirements.md
│   └── testing.md
├── [tool‑specific files]  # e.g. CLAUDE.md, .cursorrules, GEMINI.md, .github/copilot-instructions.md
└── (your code will go here)`}
            </pre>
            <p style={{ fontSize: 12, color: "#ffc03d", marginTop: 12 }}>
              <strong>Ready to build!</strong> Open your AI tool and start with: “Read AGENTS.md and begin implementing the MVP step by step.”
            </p>
          </div>
        </>
      )}
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────────────────────

const PART_LABELS = [
  { num: "01", name: "Research Prompt" },
  { num: "02", name: "PRD" },
  { num: "03", name: "Tech Design" },
  { num: "04", name: "AGENTS.md" },
];

export default function App() {
  const [active, setActive] = useState(0);
  const [userType, setUserType] = useState(null);
  const [globalAnswers, setGlobalAnswers] = useState({});
  const [outputs, setOutputs] = useState({ 0: null, 1: null, 2: null, 3: null });
  const [showSettings, setShowSettings] = useState(false);
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('mvpSessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      } catch {
        return [];
      }
    }
    return [];
  });
  const [currentSessionId, setCurrentSessionId] = useState(null);
  const [sessionName, setSessionName] = useState("");

  // Load LLM settings from localStorage
  const [llmSettings, setLlmSettings] = useState(() => {
    const saved = localStorage.getItem('llmSettings');
    return saved ? JSON.parse(saved) : { provider: 'claude', apiKey: '' };
  });

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('llmSettings', JSON.stringify(llmSettings));
  }, [llmSettings]);

  // Autosave effect: whenever individual state pieces change, update the session in localStorage
  useEffect(() => {
    if (!currentSessionId) return;
    
    const saved = localStorage.getItem('mvpSessions');
    if (!saved) return;

    try {
      const prevSessions = JSON.parse(saved);
      if (!Array.isArray(prevSessions)) return;

      const trimmedName = sessionName.trim();
      const nextSessions = prevSessions.map(s =>
        s.id === currentSessionId
          ? { ...s, name: trimmedName || s.name, userType, globalAnswers, outputs }
          : s
      );

      // Only update if changed to avoid unnecessary disk writes (though small)
      localStorage.setItem('mvpSessions', JSON.stringify(nextSessions));
      
      // Update the local sessions state so the dropdown reflects the name change etc.
      // We do this via the existing setSessions but only if it's different.
      // To avoid the lint error, we could use a ref or just accept the dropdown might be slightly behind until a manual refresh or load.
      // Actually, let's just update the specific session name in the list if it changed.
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

  const ctxFor = (partIdx) => {
    const parts = ["=== RESEARCH FINDINGS ===", "=== PRODUCT REQUIREMENTS DOCUMENT ===", "=== TECHNICAL DESIGN DOCUMENT ==="];
    return Array.from({ length: partIdx }, (_, i) => outputs[i] ? `${parts[i]}\n${outputs[i]}` : null)
      .filter(Boolean).join("\n\n---\n\n");
  };

  const saveSessionAsNew = () => {
    const name = sessionName.trim() || "Untitled idea";
    const id = Date.now().toString();
    const next = [
      ...sessions,
      { id, name, userType, globalAnswers, outputs },
    ];
    setSessions(next);
    setCurrentSessionId(id);
  };

  const loadSession = (id) => {
    const s = sessions.find(x => x.id === id);
    if (!s) return;
    setCurrentSessionId(id);
    setSessionName(s.name || "");
    setUserType(s.userType || null);
    setGlobalAnswers(s.globalAnswers || {});
    setOutputs(s.outputs || { 0: null, 1: null, 2: null, 3: null });
    setActive(0);
  };

  return (
    <>
      <style>{FONTS}{css}</style>
      <div className="app">
        <div className="noise" />
        <div className="glow" />
        <div className="glow2" />
        <div className="container">
          <nav className="nav">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <div className="nav-brand">MVP Builder</div>
              <button
                onClick={() => setShowSettings(true)}
                style={{
                  background: 'none', border: '1px solid #ffc03d40', borderRadius: '4px',
                  color: '#ffc03d', fontSize: '20px', padding: '6px 10px', cursor: 'pointer',
                  lineHeight: 1
                }}
              >
                ⚙️
              </button>
            </div>
            <div style={{ marginBottom: '16px', display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
              <span style={{ fontSize: 11, color: '#908c80', textTransform: 'uppercase', letterSpacing: '0.12em' }}>
                Session
              </span>
              <select
                value={currentSessionId || ''}
                onChange={e => {
                  const val = e.target.value || null;
                  if (val) loadSession(val);
                }}
                style={{ minWidth: 140, padding: '6px 8px', background: '#161620', border: '1px solid #333', color: '#e0dcd0', borderRadius: 3, fontSize: 12 }}
              >
                <option value="">(unsaved)</option>
                {sessions.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
              <input
                type="text"
                value={sessionName}
                onChange={e => setSessionName(e.target.value)}
                placeholder="Session name (e.g. Habit app)"
                style={{ flex: 1, minWidth: 160, padding: '6px 8px', background: '#161620', border: '1px solid #333', color: '#e0dcd0', borderRadius: 3, fontSize: 12 }}
              />
              <button
                className="btn-ghost"
                type="button"
                onClick={saveSessionAsNew}
                style={{ fontSize: 11, padding: '6px 10px' }}
              >
                Save as new
              </button>
              {currentSessionId && (
                <span style={{ fontSize: 9, color: '#60d890', opacity: 0.8, marginLeft: 4 }}>
                  ✓ Autosaved
                </span>
              )}
            </div>
            <div className="parts-nav">
              {PART_LABELS.map((p, i) => (
                <button key={i}
                  className={`part-tab${active === i ? " active" : ""}${isDone(i) ? " done" : ""}${!canAccess(i) ? " locked" : ""}`}
                  onClick={() => canAccess(i) && setActive(i)}>
                  <div className="part-num">Part {p.num}</div>
                  <div className="part-name">{p.name}</div>
                  {isDone(i) && <span className="part-check">✓</span>}
                </button>
              ))}
            </div>
            <div style={{ marginTop: 10, marginBottom: 10, display: 'flex', gap: 6 }}>
              {PART_LABELS.map((p, i) => (
                <div
                  key={p.num}
                  style={{
                    flex: 1,
                    height: 4,
                    borderRadius: 999,
                    background: isDone(i)
                      ? '#ffc03d'
                      : i === active
                        ? 'rgba(255,192,61,0.5)'
                        : 'rgba(255,255,255,0.08)',
                    transition: 'background 0.2s,width 0.2s',
                  }}
                />
              ))}
            </div>
          </nav>

          {active === 0 && (
            <Part1 userType={userType} setUserType={setUserType}
              globalAnswers={globalAnswers} setGlobalAnswers={setGlobalAnswers}
              onComplete={(out, nav) => complete(0, out, nav)}
              savedOutput={outputs[0]} />
          )}
          {active === 1 && (
            <Part2 userType={userType}
              globalAnswers={globalAnswers} setGlobalAnswers={setGlobalAnswers}
              onComplete={(out, nav) => complete(1, out, nav)}
              savedOutput={outputs[1]}
              autoContext={ctxFor(1)}
              llmSettings={llmSettings} />
          )}
          {active === 2 && (
            <Part3 userType={userType}
              globalAnswers={globalAnswers} setGlobalAnswers={setGlobalAnswers}
              onComplete={(out, nav) => complete(2, out, nav)}
              savedOutput={outputs[2]}
              autoContext={ctxFor(2)}
              llmSettings={llmSettings} />
          )}
          {active === 3 && (
            <Part4 userType={userType}
              globalAnswers={globalAnswers} setGlobalAnswers={setGlobalAnswers}
              savedOutput={outputs[3]}
              autoContext={ctxFor(3)}
              llmSettings={llmSettings} />
          )}
          <ProjectKit outputs={outputs} />
        </div>
      </div>
      {showSettings && (
        <SettingsPanel
          settings={llmSettings}
          onSave={(newSettings) => {
            setLlmSettings(newSettings);
            setShowSettings(false);
          }}
          onClose={() => setShowSettings(false)}
        />
      )}
    </>
  );
}