// AI Reality Check • Magical Edition
// Static, GitHub Pages friendly. No frameworks, no trackers. Just vibes + value.

const TIDYCAL_LINK = "https://tidycal.com/jasonfishbein/briefchat";

const QUESTIONS = [
  {
    kicker: "The setup",
    snark: "You know… the part where leadership says “quick question” and your weekend evaporates.",
    title: "Why does your team want an AI agent right now?",
    sub: "Pick the closest truth. This sets the incentives (and the failure modes).",
    options: [
      { label: "Leadership pressure", desc: "We need to show progress. Yesterday.", tag: "pressure", w: { demo: 2, risk: 1 } },
      { label: "Efficiency / cost reduction", desc: "Automation that doesn’t collapse under real customers.", tag: "efficiency", w: { system: 2 } },
      { label: "Customer experience", desc: "Faster answers without the support fire drill.", tag: "cx", w: { system: 1, guard: 1 } },
      { label: "Competitive fear", desc: "We don’t want to be the last company without “agentic.”", tag: "fear", w: { demo: 1, risk: 2 } },
    ],
  },
  {
    kicker: "Trust vs vibes",
    snark: "If your control strategy is “it felt confident,” I have news.",
    title: "When your agent gives an answer, how do you know it’s safe?",
    sub: "Most teams confuse model confidence with business safety. Those are different planets.",
    options: [
      { label: "Confidence score", desc: "If it’s high enough, we let it pass.", tag: "confidence", w: { demo: 1, risk: 2 } },
      { label: "Business rules / thresholds", desc: "We gate actions by risk + value + policy.", tag: "rules", w: { system: 2 } },
      { label: "Human review", desc: "Humans approve anything that could matter.", tag: "human", w: { guard: 2 } },
      { label: "We don’t — we trust it", desc: "We ship and hope. (A classic.)", tag: "trust", w: { risk: 3 } },
    ],
  },
  {
    kicker: "Data reality",
    snark: "This is where “smart” becomes “confidently wrong.”",
    title: "What happens when the input data is incomplete or wrong?",
    sub: "If you don’t design the behavior here, the model will… improvise.",
    options: [
      { label: "It stops", desc: "Fail closed. No guesses. No drama.", tag: "stop", w: { guard: 2 } },
      { label: "It asks clarifying questions", desc: "It pauses the workflow and requests missing fields.", tag: "clarify", w: { system: 2 } },
      { label: "It escalates", desc: "It routes to a human / specialist queue.", tag: "escalate", w: { guard: 1, system: 1 } },
      { label: "It answers anyway", desc: "It fills gaps with best guesses.", tag: "guess", w: { risk: 3 } },
    ],
  },
  {
    kicker: "Context",
    snark: "If your agent can’t see reality… it will invent one. Beautifully.",
    title: "Where does your agent get its context from?",
    sub: "If context is thin, accuracy debates are just theater.",
    options: [
      { label: "Prompt only", desc: "Mostly instructions. Minimal real data.", tag: "prompt", w: { demo: 2 } },
      { label: "RAG over docs", desc: "It retrieves from docs, tickets, or KBs.", tag: "rag", w: { system: 1 } },
      { label: "Structured business data", desc: "It sees the truth: entities, states, policies.", tag: "structured", w: { system: 2 } },
      { label: "Tools + systems", desc: "It can validate & execute real workflows.", tag: "tools", w: { system: 2, guard: 1 } },
    ],
  },
  {
    kicker: "Accountability",
    snark: "If something breaks, do you have an owner… or a meeting?",
    title: "If the agent makes a costly mistake, who is accountable?",
    sub: "If this isn’t defined, production is a liability, not an upgrade.",
    options: [
      { label: "The model", desc: "We treat it like a black box oracle.", tag: "oracle", w: { risk: 3 } },
      { label: "Engineering", desc: "The build team owns outcomes.", tag: "eng", w: { guard: 1 } },
      { label: "The business owner", desc: "Workflow owners define acceptable risk.", tag: "biz", w: { system: 2 } },
      { label: "We haven’t defined that", desc: "If something breaks, it’s… a debate.", tag: "undef", w: { risk: 2, demo: 1 } },
    ],
  },
  {
    kicker: "Observability",
    snark: "You can’t pack the parachutes after you take off.",
    title: "Can you explain why the agent did what it did… after the fact?",
    sub: "If you can’t inspect behavior, you can’t scale trust.",
    options: [
      { label: "Yes, with traces", desc: "We capture inputs, tools used, and decisions.", tag: "traces", w: { system: 2 } },
      { label: "Partially", desc: "We have logs, but they’re not decision-grade.", tag: "partial", w: { guard: 1, demo: 1 } },
      { label: "Not really", desc: "We mostly rely on anecdotal QA.", tag: "anecdotal", w: { demo: 2 } },
      { label: "We don’t measure it", desc: "We’ll add it later. (Sure.)", tag: "none", w: { risk: 2 } },
    ],
  },
  {
    kicker: "Handoff design",
    snark: "This is the part where your agent learns humility. Or doesn’t.",
    title: "How does the agent decide when to hand off to a human?",
    sub: "This is the difference between automation and chaos.",
    options: [
      { label: "Always", desc: "It drafts. Humans decide.", tag: "draft", w: { guard: 2 } },
      { label: "Confidence threshold", desc: "If low confidence, it escalates.", tag: "confhandoff", w: { demo: 1, guard: 1 } },
      { label: "Business risk gating", desc: "High-value / high-risk routes to humans by design.", tag: "riskgate", w: { system: 2 } },
      { label: "It doesn’t", desc: "It tries to finish everything. Bold.", tag: "finishall", w: { risk: 3 } },
    ],
  },
];

const ARCHETYPES = [
  {
    id: "prototype_trap",
    name: "You’re in the Prototype Trap",
    subtitle: "Your agent looks impressive in demos… but it’s not designed as a trustworthy system yet.",
    tags: ["Demo energy", "Production risk", "Accuracy theater"],
    looksLike: [
      "A dazzling demo… and unpredictable outcomes",
      "Confidence scores treated like safety signals",
      "“We’ll add guardrails later” keeps slipping",
    ],
    risk: [
      "One high-visibility failure nukes trust with leadership",
      "Support/ops becomes the blast radius sponge",
      "Your best people become prompt babysitters",
    ],
    nextMove:
      "Define **risk tiers** + **handoff rules** first. Then add basic traces (inputs, tools, decisions). When you can inspect behavior, you can scale it.",
  },
  {
    id: "guardrail_gap",
    name: "You’ve got a Guardrail Gap",
    subtitle: "You’re moving fast, but escalation and safety controls aren’t designed — they’re improvised.",
    tags: ["Fast build", "Soft controls", "Hidden liability"],
    looksLike: [
      "Humans are the safety net… with holes",
      "Edge cases show up as fire drills",
      "“It worked yesterday” becomes a status update",
    ],
    risk: [
      "Teams quietly revert to manual work",
      "Leadership asks for ROI while risk is undefined",
      "Incidents become meetings instead of fixes",
    ],
    nextMove:
      "Build a **handoff ladder**: what the agent does alone, what it drafts for approval, and what always escalates. Tie it to business value + risk — not model confidence.",
  },
  {
    id: "context_thin",
    name: "Your Context Is Too Thin",
    subtitle: "The agent is being asked to reason without seeing the actual truth of your business.",
    tags: ["Thin context", "Generic answers", "Hallucination bait"],
    looksLike: [
      "Heavy prompting, light data",
      "RAG helps… but answers still feel generic",
      "Users ask follow-ups because the agent lacks grounded context",
    ],
    risk: [
      "Hallucinations aren’t random — they’re predictable under missing context",
      "Your domain experts lose patience (quietly)",
      "You hit a ceiling and blame “the model”",
    ],
    nextMove:
      "Give the agent **structured reality**: entities, policies, states. Then add tools that validate outcomes against source systems. Reality is the best guardrail.",
  },
  {
    id: "system_builder",
    name: "You’re Building a Real System",
    subtitle: "You’re thinking in workflows, risk, and inspection — which is how this scales without chaos.",
    tags: ["Risk-gated", "Observable", "Scalable trust"],
    looksLike: [
      "Risk gating is intentional",
      "Escalation paths exist and are explainable",
      "Observability is a prerequisite, not a nice-to-have",
    ],
    risk: [
      "Your main risk is scope creep, not chaos",
      "You’ll be asked to replicate this across teams (plan for it)",
      "You might accidentally become the ‘AI adult’ in the room",
    ],
    nextMove:
      "Productize your pattern: reusable risk tiers, logging standards, eval suites. Then expand capabilities without expanding liability.",
  },
];

const $ = (id) => document.getElementById(id);

const state = {
  i: 0,
  answers: Array(QUESTIONS.length).fill(null),
  sound: false,
};

function setYear() { $("year").textContent = String(new Date().getFullYear()); }

// ---------- Tiny sound (optional) ----------
let audioCtx = null;
function beep(freq=440, ms=40, type="sine", gain=0.02){
  if(!state.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type;
    o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    setTimeout(()=>{ o.stop(); }, ms);
  }catch(e){ /* ignore */ }
}

// ---------- Views ----------
function show(viewId){
  ["viewIntro","viewQuiz","viewResults"].forEach(v => $(v).classList.add("hidden"));
  $(viewId).classList.remove("hidden");
}

function toast(msg){
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(()=>t.classList.add("hidden"), 1400);
}

function escapeHtml(s){
  return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;");
}
function toMiniMarkdown(s){
  return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
}

// ---------- Progress ----------
function setProgress(){
  const pct = ((state.i) / (QUESTIONS.length)) * 100;
  $("progressFill").style.width = `${pct}%`;
  $("progressText").textContent = `Question ${state.i + 1} of ${QUESTIONS.length}`;
}

// ---------- Quiz render ----------
function renderQuestion(){
  const q = QUESTIONS[state.i];
  $("qKicker").textContent = q.kicker;
  $("qSnark").textContent = q.snark || "";
  $("qTitle").textContent = q.title;
  $("qSub").textContent = q.sub;

  const chosen = state.answers[state.i]?.optIndex ?? null;
  $("nextBtn").disabled = chosen == null;

  $("options").innerHTML = q.options.map((o, idx) => {
    const selected = chosen === idx ? "selected" : "";
    return `
      <div class="opt ${selected}" role="button" tabindex="0" data-idx="${idx}">
        <div class="badgeN">${idx+1}</div>
        <div class="opt-main">
          <div class="opt-title">${escapeHtml(o.label)}</div>
          <div class="opt-desc">${escapeHtml(o.desc)}</div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".opt").forEach(el => {
    el.addEventListener("click", () => selectOption(Number(el.dataset.idx)));
    el.addEventListener("keydown", (e) => {
      if(e.key === "Enter" || e.key === " "){
        e.preventDefault();
        selectOption(Number(el.dataset.idx));
      }
    });
  });

  setProgress();
}

function selectOption(optIndex){
  const q = QUESTIONS[state.i];
  const opt = q.options[optIndex];
  state.answers[state.i] = { optIndex, tag: opt.tag, w: opt.w || {} };
  beep(640, 30, "triangle", 0.02);
  renderQuestion();
  $("nextBtn").disabled = false;
}

// ---------- Archetype compute ----------
function computeArchetype(){
  const totals = { demo:0, risk:0, system:0, guard:0 };
  for(const a of state.answers){
    if(!a) continue;
    for(const k of Object.keys(totals)) totals[k] += (a.w[k] || 0);
  }
  const { demo, risk, system, guard } = totals;

  if(system >= 9 && risk <= 5) return ARCHETYPES.find(a=>a.id==="system_builder");
  if(risk >= 9 && guard <= 5) return ARCHETYPES.find(a=>a.id==="prototype_trap");
  if(risk >= 7 && guard <= 6) return ARCHETYPES.find(a=>a.id==="guardrail_gap");
  if(system <= 7 && demo >= 6) return ARCHETYPES.find(a=>a.id==="context_thin");
  if(system >= 8) return ARCHETYPES.find(a=>a.id==="system_builder");
  return ARCHETYPES.find(a=>a.id==="prototype_trap");
}

// ---------- Results ----------
function renderResults(arch){
  $("resultTitle").textContent = arch.name;
  $("resultSubtitle").textContent = arch.subtitle;

  $("resultTags").innerHTML = arch.tags.map((t,i)=>`<span class="tag ${i===0?"hot":""}">${escapeHtml(t)}</span>`).join("");

  $("resultLooksLike").innerHTML = arch.looksLike.map(x=>`<li>${escapeHtml(x)}</li>`).join("");
  $("resultRisk").innerHTML = arch.risk.map(x=>`<li>${escapeHtml(x)}</li>`).join("");
  $("resultNextMove").innerHTML = toMiniMarkdown(arch.nextMove);

  $("bookBtn").setAttribute("href", TIDYCAL_LINK);

  const url = new URL(window.location.href);
  url.searchParams.set("result", arch.id);
  history.replaceState({}, "", url.toString());
}

// ---------- Navigation ----------
function startQuiz(){
  show("viewQuiz");
  state.i = 0;
  renderQuestion();
  $("progressFill").style.width = `${(1/QUESTIONS.length)*100}%`;
  toast("Alright. No lying. (The UI can tell.)");
  beep(520, 40, "sine", 0.02);
}

function next(){
  if(state.answers[state.i] == null){
    toast("Pick an answer. You can’t ‘it depends’ your way out of this.");
    beep(180, 60, "sawtooth", 0.015);
    return;
  }
  if(state.i < QUESTIONS.length - 1){
    state.i += 1;
    renderQuestion();
    beep(740, 30, "triangle", 0.018);
  }else{
    const arch = computeArchetype();
    show("viewResults");
    $("progressFill").style.width = "100%";
    renderResults(arch);
    toast("Diagnosis complete. No refunds.");
    beep(880, 60, "sine", 0.02);
  }
}

function back(){
  if(state.i > 0){
    state.i -= 1;
    renderQuestion();
    beep(320, 30, "triangle", 0.016);
  }else{
    show("viewIntro");
  }
}

function restart(){
  state.i = 0;
  state.answers = Array(QUESTIONS.length).fill(null);
  const url = new URL(window.location.href);
  url.searchParams.delete("result");
  history.replaceState({}, "", url.toString());
  show("viewIntro");
  toast("Reset. Your agent is safe. For now.");
  beep(260, 40, "sine", 0.015);
}

function copyResultsLink(){
  const url = new URL(window.location.href);
  navigator.clipboard.writeText(url.toString()).then(()=>{
    $("shareBtn").textContent = "Copied ✓";
    toast("Link copied. Deploy it into Slack.");
    beep(900, 30, "triangle", 0.02);
    setTimeout(()=> $("shareBtn").textContent = "Copy results link", 1200);
  }).catch(()=>{
    toast("Copy failed. Your clipboard is in a governance review.");
  });
}

function replay(){
  restart();
  startQuiz();
}

function openModal(html){
  $("modalBody").innerHTML = html;
  $("modal").classList.remove("hidden");
  beep(600, 30, "sine", 0.015);
}
function closeModal(){
  $("modal").classList.add("hidden");
}

function renderPeek(){
  const items = QUESTIONS.map((q, idx) => {
    const opts = q.options.map((o,i)=>`<li><strong>${i+1}. ${escapeHtml(o.label)}</strong> — ${escapeHtml(o.desc)}</li>`).join("");
    return `
      <h3>Q${idx+1} • ${escapeHtml(q.kicker)}</h3>
      <div style="margin-bottom:8px;opacity:.95;"><strong>${escapeHtml(q.title)}</strong></div>
      <div style="margin-bottom:8px;opacity:.85;">${escapeHtml(q.sub)}</div>
      <ul>${opts}</ul>
    `;
  }).join("");
  openModal(items);
}

// ---------- Easter egg ----------
function popOpen(){
  $("pop").classList.remove("hidden");
  beep(120, 120, "square", 0.015);
}
function popClose(){
  $("pop").classList.add("hidden");
  beep(520, 40, "sine", 0.02);
}

// ---------- Tilt effect ----------
function wireTilt(){
  const card = $("questionCard");
  if(!card) return;

  const strength = 10; // degrees
  function onMove(e){
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    const rx = (y - 0.5) * -strength;
    const ry = (x - 0.5) * strength;
    card.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateY(-1px)`;
  }
  function onLeave(){
    card.style.transform = `rotateX(0deg) rotateY(0deg) translateY(0px)`;
  }
  card.addEventListener("mousemove", onMove);
  card.addEventListener("mouseleave", onLeave);
  card.addEventListener("touchend", onLeave);
}

// ---------- Stars / particles canvas ----------
function initStars(){
  const canvas = $("stars");
  const ctx = canvas.getContext("2d", { alpha: true });
  let w=0,h=0, dpr=1;
  let stars = [];
  let t = 0;

  const prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize(){
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    canvas.width = Math.floor(w*dpr); canvas.height = Math.floor(h*dpr);
    canvas.style.width = w+"px"; canvas.style.height = h+"px";
    ctx.setTransform(dpr,0,0,dpr,0,0);
    const count = Math.floor((w*h) / 18000); // density
    stars = new Array(count).fill(0).map(()=>({
      x: Math.random()*w,
      y: Math.random()*h,
      r: Math.random()*1.4 + 0.2,
      a: Math.random()*0.55 + 0.15,
      tw: Math.random()*0.6 + 0.2,
      sp: Math.random()*0.25 + 0.05,
    }));
  }

  function draw(){
    t += 0.01;
    ctx.clearRect(0,0,w,h);

    // subtle gradient wash
    const g = ctx.createLinearGradient(0,0,w,h);
    g.addColorStop(0, "rgba(126,87,255,0.05)");
    g.addColorStop(0.5, "rgba(56,189,248,0.03)");
    g.addColorStop(1, "rgba(34,197,94,0.02)");
    ctx.fillStyle = g;
    ctx.fillRect(0,0,w,h);

    for(const s of stars){
      const tw = prefersReduced ? 0 : Math.sin(t*s.tw + s.x*0.01) * 0.25;
      const a = Math.max(0, Math.min(1, s.a + tw));
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${a})`;
      ctx.arc(s.x, s.y, s.r, 0, Math.PI*2);
      ctx.fill();

      if(!prefersReduced){
        s.y += s.sp;
        if(s.y > h+10){ s.y = -10; s.x = Math.random()*w; }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();
}

// ---------- URL result loading ----------
function loadResultFromUrl(){
  const url = new URL(window.location.href);
  const r = url.searchParams.get("result");
  if(!r) return false;
  const arch = ARCHETYPES.find(a=>a.id===r);
  if(!arch) return false;
  show("viewResults");
  renderResults(arch);
  return true;
}

// ---------- Events ----------
function wireEvents(){
  $("startBtn").addEventListener("click", startQuiz);
  $("peekBtn").addEventListener("click", renderPeek);
  $("backBtn").addEventListener("click", back);
  $("restartBtn").addEventListener("click", restart);
  $("nextBtn").addEventListener("click", next);
  $("shareBtn").addEventListener("click", copyResultsLink);
  $("replayBtn").addEventListener("click", replay);

  $("modalBackdrop").addEventListener("click", closeModal);
  $("modalClose").addEventListener("click", closeModal);

  $("easterEgg").addEventListener("click", popOpen);
  $("popClose").addEventListener("click", popClose);

  $("brandHome").addEventListener("click", restart);

  $("soundToggle").addEventListener("click", () => {
    state.sound = !state.sound;
    $("soundLabel").textContent = `Sound: ${state.sound ? "On" : "Off"}`;
    $("soundToggle").querySelector(".chip-dot").style.background = state.sound ? "rgba(34,197,94,.55)" : "rgba(255,255,255,.28)";
    toast(state.sound ? "Sound on. Tiny dopamine enabled." : "Sound off. Silence is a feature.");
    beep(state.sound ? 760 : 220, 60, "sine", 0.02);
  });

  // keyboard
  window.addEventListener("keydown", (e) => {
    if(e.key === "Escape"){
      // close pop/modal first
      if(!$("pop").classList.contains("hidden")) { popClose(); return; }
      if(!$("modal").classList.contains("hidden")) { closeModal(); return; }
      restart();
      return;
    }

    const quizVisible = !$("viewQuiz").classList.contains("hidden");
    if(!quizVisible) return;

    if(["1","2","3","4"].includes(e.key)) selectOption(Number(e.key)-1);
    if(e.key === "Enter") next();
    if(e.key === "ArrowLeft") back();
    if(e.key === "ArrowRight") next();
  });
}

// ---------- Init ----------
(function init(){
  setYear();
  initStars();
  wireEvents();
  // Tilt only when quiz visible; safe to wire now
  wireTilt();

  const loaded = loadResultFromUrl();
  if(!loaded) show("viewIntro");
})();
