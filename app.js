const TIDYCAL_LINK = "https://tidycal.com/jasonfishbein/briefchat";

const QUESTIONS = [
  {
    kicker: "Intent",
    title: "Why does your team want an AI agent right now?",
    sub: "Pick the closest truth. This sets the incentives (and the failure modes).",
    options: [
      { label: "Leadership pressure", desc: "We need to show progress. Yesterday.", tag: "pressure", w: { demo: 2, risk: 1 } },
      { label: "Efficiency / cost reduction", desc: "We want automation that actually holds up in production.", tag: "efficiency", w: { system: 2 } },
      { label: "Customer experience", desc: "We need faster, better answers without the support fire drill.", tag: "cx", w: { system: 1, risk: 1 } },
      { label: "Competitive fear", desc: "We don’t want to be the last company without an agent.", tag: "fear", w: { demo: 1, risk: 2 } },
    ],
  },
  {
    kicker: "Trust",
    title: "When your agent gives an answer, how do you know it’s safe?",
    sub: "Most teams confuse model confidence with business safety.",
    options: [
      { label: "Confidence score", desc: "If it’s high enough, we let it pass.", tag: "confidence", w: { demo: 1, risk: 2 } },
      { label: "Business rules / thresholds", desc: "We gate actions based on risk, value, and policy.", tag: "rules", w: { system: 2 } },
      { label: "Human review", desc: "Humans approve anything that could matter.", tag: "human", w: { guard: 2 } },
      { label: "We don’t — we trust it", desc: "We ship and hope. (This is more common than people admit.)", tag: "trust", w: { risk: 3 } },
    ],
  },
  {
    kicker: "Data reality",
    title: "What happens when the input data is incomplete or wrong?",
    sub: "This is where “smart” agents turn into expensive confusion machines.",
    options: [
      { label: "It stops", desc: "We prefer failure over fabricated confidence.", tag: "stop", w: { guard: 2 } },
      { label: "It asks clarifying questions", desc: "It can pause the workflow and request missing fields.", tag: "clarify", w: { system: 2 } },
      { label: "It escalates", desc: "It routes to a human or a specialist queue.", tag: "escalate", w: { guard: 1, system: 1 } },
      { label: "It answers anyway", desc: "It fills gaps with best guesses.", tag: "guess", w: { risk: 3 } },
    ],
  },
  {
    kicker: "Architecture",
    title: "Where does your agent get its “context” from?",
    sub: "If context is weak, accuracy arguments don’t matter.",
    options: [
      { label: "Prompt only", desc: "Mostly instructions. Minimal real data.", tag: "prompt", w: { demo: 2 } },
      { label: "RAG over documents", desc: "It retrieves from docs, tickets, or knowledge bases.", tag: "rag", w: { system: 1 } },
      { label: "Structured business data", desc: "It sees the truth: customers, products, policies, metrics.", tag: "structured", w: { system: 2 } },
      { label: "Tools + systems", desc: "It can execute actions, validate states, and call real workflows.", tag: "tools", w: { system: 2, guard: 1 } },
    ],
  },
  {
    kicker: "Risk",
    title: "If the agent makes a costly mistake, who is accountable?",
    sub: "If this isn’t defined, production is a liability, not an upgrade.",
    options: [
      { label: "The model", desc: "We treat it like a black box oracle.", tag: "oracle", w: { risk: 3 } },
      { label: "Engineering", desc: "The build team owns outcomes.", tag: "eng", w: { guard: 1 } },
      { label: "The business owner", desc: "The workflow owner defines acceptable risk.", tag: "biz", w: { system: 2 } },
      { label: "We haven’t defined that", desc: "If something breaks, it’s a debate.", tag: "undef", w: { risk: 2, demo: 1 } },
    ],
  },
  {
    kicker: "Observability",
    title: "Can you explain why the agent did what it did… after the fact?",
    sub: "If you can’t inspect behavior, you can’t scale trust.",
    options: [
      { label: "Yes, with traces", desc: "We capture inputs, tools used, and decisions.", tag: "traces", w: { system: 2 } },
      { label: "Partially", desc: "We have logs, but they’re not decision-grade.", tag: "partial", w: { guard: 1, demo: 1 } },
      { label: "Not really", desc: "We mostly rely on anecdotal QA.", tag: "anecdotal", w: { demo: 2 } },
      { label: "We don’t measure it", desc: "We’ll add it later. (Famous last words.)", tag: "none", w: { risk: 2 } },
    ],
  },
  {
    kicker: "Escalation design",
    title: "How does the agent decide when to hand off to a human?",
    sub: "This is the difference between automation and chaos.",
    options: [
      { label: "Always", desc: "It drafts. Humans decide.", tag: "draft", w: { guard: 2 } },
      { label: "Confidence threshold", desc: "If low confidence, it escalates.", tag: "confhandoff", w: { demo: 1, guard: 1 } },
      { label: "Business risk gating", desc: "High-value or high-risk routes to humans by design.", tag: "riskgate", w: { system: 2 } },
      { label: "It doesn’t", desc: "It tries to finish everything.", tag: "finishall", w: { risk: 3 } },
    ],
  },
];

// Archetypes: compute based on weighted totals
const ARCHETYPES = [
  {
    id: "prototype_trap",
    name: "You’re in the Prototype Trap",
    subtitle:
      "Your agent looks impressive in demos, but it’s not designed as a trustworthy system yet.",
    looksLike: [
      "Great internal excitement… and inconsistent outcomes",
      "Confidence scores are treated like safety signals",
      "“We’ll add guardrails later” keeps slipping",
    ],
    risk: [
      "You ship a demo into a real workflow and create hidden liability",
      "A single high-visibility failure breaks trust with leadership",
      "Your team burns cycles arguing about “accuracy” instead of architecture",
    ],
    nextMove:
      "Define **risk tiers** and **handoff rules** first. Then instrument basic traces (inputs, tools, decisions). Once you can inspect behavior, you can scale it.",
  },
  {
    id: "guardrail_gap",
    name: "You’ve got a Guardrail Gap",
    subtitle:
      "You’re moving fast, but escalation and safety controls aren’t designed — they’re improvised.",
    looksLike: [
      "Humans are the safety net, but the net has holes",
      "Edge cases show up as fire drills",
      "You can’t explain behavior cleanly after incidents",
    ],
    risk: [
      "Teams quietly revert to manual work (and stop trusting the agent)",
      "Support/ops absorbs the blast radius",
      "Leadership asks for ROI while risk is undefined",
    ],
    nextMove:
      "Build a **handoff ladder**: what the agent can do alone, what it drafts for approval, and what always escalates. Tie it to business value + risk, not model confidence.",
  },
  {
    id: "context_thin",
    name: "Your Context Is Too Thin",
    subtitle:
      "The agent is being asked to reason without seeing the actual truth of your business.",
    looksLike: [
      "Heavy prompting, light data",
      "RAG helps, but answers still feel generic",
      "Users ask follow-ups because the agent lacks grounded context",
    ],
    risk: [
      "Hallucinations aren’t random — they’re predictable under missing context",
      "Your best people become prompt babysitters",
      "You hit a ceiling and call it “model limitations”",
    ],
    nextMove:
      "Give the agent **structured reality**: the business entities + policies + states it needs. Then add tools that validate outcomes against source systems.",
  },
  {
    id: "system_builder",
    name: "You’re Building a Real System",
    subtitle:
      "You’re thinking in workflows, risk, and inspection — which is how this actually scales.",
    looksLike: [
      "Risk gating is intentional",
      "Escalation paths exist and are explainable",
      "You treat observability as a prerequisite, not a nice-to-have",
    ],
    risk: [
      "Your main risk is scope creep, not chaos",
      "You can move faster than peers — if you keep constraints sharp",
      "You’ll be asked to replicate this across teams (plan for it)",
    ],
    nextMove:
      "Productize your pattern: define reusable risk tiers, logging standards, and eval suites. Then expand capabilities without expanding liability.",
  },
];

const $ = (id) => document.getElementById(id);

const state = {
  i: 0,
  answers: Array(QUESTIONS.length).fill(null), // { optIndex, tags, w }
  selected: null,
};

function setYear() {
  $("year").textContent = String(new Date().getFullYear());
}

function show(viewId) {
  const views = ["viewIntro", "viewQuiz", "viewResults"];
  views.forEach((v) => $(v).classList.add("hidden"));
  $(viewId).classList.remove("hidden");
}

function openModal(html) {
  $("modalBody").innerHTML = html;
  $("modal").classList.remove("hidden");
}

function closeModal() {
  $("modal").classList.add("hidden");
}

function renderPeek() {
  const items = QUESTIONS.map((q, idx) => {
    const opts = q.options
      .map((o, i) => `<li><strong>${i + 1}. ${escapeHtml(o.label)}</strong> — ${escapeHtml(o.desc)}</li>`)
      .join("");
    return `
      <div style="margin-bottom:14px;">
        <div style="letter-spacing:.12em;text-transform:uppercase;font-size:12px;opacity:.7;">Q${idx + 1} • ${escapeHtml(q.kicker)}</div>
        <div style="font-weight:800;letter-spacing:-.02em;margin:6px 0 8px;">${escapeHtml(q.title)}</div>
        <ul style="margin:0;padding-left:18px;opacity:.9;line-height:1.7;">${opts}</ul>
      </div>
    `;
  }).join("");
  openModal(items);
}

function escapeHtml(s) {
  return s.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function progress() {
  const pct = ((state.i) / (QUESTIONS.length)) * 100;
  $("progressFill").style.width = `${pct}%`;
  $("progressText").textContent = `Question ${state.i + 1} of ${QUESTIONS.length}`;
}

function renderQuestion() {
  const q = QUESTIONS[state.i];

  $("qKicker").textContent = q.kicker;
  $("qTitle").textContent = q.title;
  $("qSub").textContent = q.sub;

  $("nextBtn").disabled = state.answers[state.i] == null;

  // options
  const chosen = state.answers[state.i]?.optIndex ?? null;
  $("options").innerHTML = q.options
    .map((o, idx) => {
      const selected = chosen === idx ? "selected" : "";
      return `
        <div class="opt ${selected}" role="button" tabindex="0" data-idx="${idx}">
          <div class="badge">${idx + 1}</div>
          <div class="opt-main">
            <div class="opt-title">${escapeHtml(o.label)}</div>
            <div class="opt-desc">${escapeHtml(o.desc)}</div>
          </div>
        </div>
      `;
    })
    .join("");

  // attach click/keyboard to options
  document.querySelectorAll(".opt").forEach((el) => {
    el.addEventListener("click", () => selectOption(Number(el.dataset.idx)));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        selectOption(Number(el.dataset.idx));
      }
    });
  });

  progress();
}

function selectOption(optIndex) {
  const q = QUESTIONS[state.i];
  const opt = q.options[optIndex];

  state.answers[state.i] = {
    optIndex,
    tag: opt.tag,
    w: opt.w || {},
  };

  // re-render to reflect selection
  renderQuestion();
  $("nextBtn").disabled = false;
}

function computeArchetype() {
  // weights: demo vs risk vs system vs guard
  const totals = { demo: 0, risk: 0, system: 0, guard: 0 };

  for (const a of state.answers) {
    if (!a) continue;
    for (const k of Object.keys(totals)) totals[k] += (a.w[k] || 0);
  }

  // scoring logic:
  // - system high + risk low => system_builder
  // - risk high => guardrail_gap (if guard low) or prototype_trap
  // - demo high + system low => prototype_trap
  // - system moderate but context/data weak => context_thin
  const { demo, risk, system, guard } = totals;

  // Strong system builder
  if (system >= 9 && risk <= 5) return ARCHETYPES.find((a) => a.id === "system_builder");

  // High risk with low guardrails
  if (risk >= 9 && guard <= 5) return ARCHETYPES.find((a) => a.id === "prototype_trap");

  // Guardrails gap: risk notable, system not terrible, but guard not strong enough
  if (risk >= 7 && guard <= 6) return ARCHETYPES.find((a) => a.id === "guardrail_gap");

  // Context thin: system low/moderate + demo reliance
  if (system <= 7 && demo >= 6) return ARCHETYPES.find((a) => a.id === "context_thin");

  // Default
  if (system >= 8) return ARCHETYPES.find((a) => a.id === "system_builder");
  return ARCHETYPES.find((a) => a.id === "prototype_trap");
}

function renderResults(archetype) {
  $("resultTitle").textContent = archetype.name;
  $("resultSubtitle").textContent = archetype.subtitle;

  $("resultLooksLike").innerHTML = archetype.looksLike.map((x) => `<li>${escapeHtml(x)}</li>`).join("");
  $("resultRisk").innerHTML = archetype.risk.map((x) => `<li>${escapeHtml(x)}</li>`).join("");

  // allow light markdown emphasis for ** **
  $("resultNextMove").innerHTML = toMiniMarkdown(archetype.nextMove);

  // Results link for sharing
  const url = new URL(window.location.href);
  url.searchParams.set("result", archetype.id);
  history.replaceState({}, "", url.toString());

  // Ensure booking link correct
  $("bookBtn").setAttribute("href", TIDYCAL_LINK);
}

function toMiniMarkdown(s) {
  // extremely small: **bold** only
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

function next() {
  if (state.answers[state.i] == null) return;
  if (state.i < QUESTIONS.length - 1) {
    state.i += 1;
    renderQuestion();
  } else {
    const arch = computeArchetype();
    show("viewResults");
    // progress fill to 100
    $("progressFill").style.width = "100%";
    renderResults(arch);
  }
}

function back() {
  if (state.i > 0) {
    state.i -= 1;
    renderQuestion();
  } else {
    show("viewIntro");
  }
}

function restart() {
  state.i = 0;
  state.answers = Array(QUESTIONS.length).fill(null);
  show("viewIntro");
  // Clear URL params
  const url = new URL(window.location.href);
  url.searchParams.delete("result");
  history.replaceState({}, "", url.toString());
}

function copyResultsLink() {
  const url = new URL(window.location.href);
  navigator.clipboard.writeText(url.toString()).then(() => {
    $("shareBtn").textContent = "Copied ✓";
    setTimeout(() => ($("shareBtn").textContent = "Copy results link"), 1300);
  });
}

function startQuiz() {
  show("viewQuiz");
  renderQuestion();
  // set progress to first
  $("progressFill").style.width = `${(1 / QUESTIONS.length) * 100}%`;
  $("progressText").textContent = `Question 1 of ${QUESTIONS.length}`;
}

function loadResultFromUrl() {
  const url = new URL(window.location.href);
  const r = url.searchParams.get("result");
  if (!r) return false;
  const arch = ARCHETYPES.find((a) => a.id === r);
  if (!arch) return false;
  show("viewResults");
  renderResults(arch);
  return true;
}

function wireEvents() {
  $("startBtn").addEventListener("click", startQuiz);
  $("peekBtn").addEventListener("click", renderPeek);

  $("modalBackdrop").addEventListener("click", closeModal);
  $("modalClose").addEventListener("click", closeModal);

  $("nextBtn").addEventListener("click", next);
  $("backBtn").addEventListener("click", back);
  $("restartBtn").addEventListener("click", restart);

  $("shareBtn").addEventListener("click", copyResultsLink);

  // Keyboard support
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape") restart();
    if ($("modal") && !$("modal").classList.contains("hidden") && e.key === "Escape") closeModal();

    // Only when quiz view visible
    const quizVisible = !$("viewQuiz").classList.contains("hidden");
    if (!quizVisible) return;

    // 1-4 to choose
    if (["1", "2", "3", "4"].includes(e.key)) {
      selectOption(Number(e.key) - 1);
    }
    if (e.key === "Enter") next();
    if (e.key === "ArrowLeft") back();
    if (e.key === "ArrowRight") next();
  });
}

(function init() {
  setYear();
  wireEvents();

  // If someone lands on a shared results link, show it instantly
  const loaded = loadResultFromUrl();
  if (!loaded) {
    show("viewIntro");
  }
})();
