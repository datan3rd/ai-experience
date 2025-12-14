// AI Reality Check — Pro
const TIDYCAL_LINK = "https://tidycal.com/jasonfishbein/briefchat";

const QUESTIONS = [
  { kicker:"The setup", aside:"The part where leadership says “quick question” and your weekend evaporates.",
    title:"Why does your team want an AI agent right now?",
    sub:"Pick the closest truth. Incentives are everything.",
    options:[
      {label:"Leadership pressure", desc:"We need to show progress. Yesterday.", tag:"pressure", w:{demo:2,risk:1}},
      {label:"Efficiency / cost reduction", desc:"Automation that survives contact with reality.", tag:"efficiency", w:{system:2}},
      {label:"Customer experience", desc:"Faster answers without the support fire drill.", tag:"cx", w:{system:1,guard:1}},
      {label:"Competitive fear", desc:"We don’t want to be the last company without “agentic.”", tag:"fear", w:{demo:1,risk:2}},
    ]},
  { kicker:"Trust vs vibes", aside:"If your control strategy is “it felt confident,” I have news.",
    title:"When your agent gives an answer, how do you know it’s safe?",
    sub:"Model confidence ≠ business safety. Different planets.",
    options:[
      {label:"Confidence score", desc:"If it’s high enough, we let it pass.", tag:"confidence", w:{demo:1,risk:2}},
      {label:"Business rules / thresholds", desc:"We gate actions by risk + value + policy.", tag:"rules", w:{system:2}},
      {label:"Human review", desc:"Humans approve anything that could matter.", tag:"human", w:{guard:2}},
      {label:"We don’t — we trust it", desc:"We ship and hope. A classic.", tag:"trust", w:{risk:3}},
    ]},
  { kicker:"Data reality", aside:"This is where “smart” becomes “confidently wrong.”",
    title:"What happens when the input data is incomplete or wrong?",
    sub:"If you don’t design the behavior here, the model will… improvise.",
    options:[
      {label:"It stops", desc:"Fail closed. No guesses. No drama.", tag:"stop", w:{guard:2}},
      {label:"It asks clarifying questions", desc:"It pauses and requests missing fields.", tag:"clarify", w:{system:2}},
      {label:"It escalates", desc:"It routes to a human / specialist queue.", tag:"escalate", w:{guard:1,system:1}},
      {label:"It answers anyway", desc:"It fills gaps with best guesses.", tag:"guess", w:{risk:3}},
    ]},
  { kicker:"Context", aside:"If your agent can’t see reality… it will invent one. Beautifully.",
    title:"Where does your agent get its context from?",
    sub:"If context is thin, accuracy debates are just theater.",
    options:[
      {label:"Prompt only", desc:"Mostly instructions. Minimal real data.", tag:"prompt", w:{demo:2}},
      {label:"RAG over docs", desc:"It retrieves from docs, tickets, or KBs.", tag:"rag", w:{system:1}},
      {label:"Structured business data", desc:"It sees entities, states, policies.", tag:"structured", w:{system:2}},
      {label:"Tools + systems", desc:"It validates & executes real workflows.", tag:"tools", w:{system:2,guard:1}},
    ]},
  { kicker:"Accountability", aside:"If something breaks, do you have an owner… or a meeting?",
    title:"If the agent makes a costly mistake, who is accountable?",
    sub:"If this isn’t defined, production becomes liability.",
    options:[
      {label:"The model", desc:"We treat it like a black box oracle.", tag:"oracle", w:{risk:3}},
      {label:"Engineering", desc:"The build team owns outcomes.", tag:"eng", w:{guard:1}},
      {label:"The business owner", desc:"Workflow owners define acceptable risk.", tag:"biz", w:{system:2}},
      {label:"We haven’t defined that", desc:"If it breaks, it’s… a debate.", tag:"undef", w:{risk:2,demo:1}},
    ]},
  { kicker:"Observability", aside:"You can’t pack the parachutes after you take off.",
    title:"Can you explain why the agent did what it did… after the fact?",
    sub:"If you can’t inspect behavior, you can’t scale trust.",
    options:[
      {label:"Yes, with traces", desc:"Inputs, tools used, decisions — captured.", tag:"traces", w:{system:2}},
      {label:"Partially", desc:"We have logs, but not decision-grade.", tag:"partial", w:{guard:1,demo:1}},
      {label:"Not really", desc:"We rely on anecdotal QA.", tag:"anecdotal", w:{demo:2}},
      {label:"We don’t measure it", desc:"We’ll add it later. Sure.", tag:"none", w:{risk:2}},
    ]},
  { kicker:"Handoff design", aside:"This is where your agent learns humility. Or doesn’t.",
    title:"How does the agent decide when to hand off to a human?",
    sub:"This is the difference between automation and chaos.",
    options:[
      {label:"Always", desc:"It drafts. Humans decide.", tag:"draft", w:{guard:2}},
      {label:"Confidence threshold", desc:"If low confidence, it escalates.", tag:"confhandoff", w:{demo:1,guard:1}},
      {label:"Business risk gating", desc:"High-risk routes to humans by design.", tag:"riskgate", w:{system:2}},
      {label:"It doesn’t", desc:"It tries to finish everything. Bold.", tag:"finishall", w:{risk:3}},
    ]},
];

const ARCHETYPES = [
  { id:"prototype_trap", name:"You’re in the Prototype Trap",
    sub:"Your agent looks impressive in demos… but it’s not designed as a trustworthy system yet.",
    tags:["Demo energy","Production risk","Accuracy theater"],
    looks:["A dazzling demo… and unpredictable outcomes","Confidence scores treated like safety signals","“We’ll add guardrails later” keeps slipping"],
    risk:["One high-visibility failure nukes trust","Support/ops absorbs the blast radius","Your best people become prompt babysitters"],
    move:"Define **risk tiers** + **handoff rules** first. Then instrument traces (inputs, tools, decisions). When you can inspect behavior, you can scale it."},
  { id:"guardrail_gap", name:"You’ve got a Guardrail Gap",
    sub:"You’re moving fast, but escalation and safety controls aren’t designed — they’re improvised.",
    tags:["Fast build","Soft controls","Hidden liability"],
    looks:["Humans are the safety net… with holes","Edge cases show up as fire drills","“It worked yesterday” becomes a status update"],
    risk:["Teams quietly revert to manual work","Leadership asks for ROI while risk is undefined","Incidents become meetings instead of fixes"],
    move:"Build a **handoff ladder**: what the agent does alone, what it drafts for approval, and what always escalates. Tie it to business value + risk — not confidence."},
  { id:"context_thin", name:"Your Context Is Too Thin",
    sub:"The agent is being asked to reason without seeing the actual truth of your business.",
    tags:["Thin context","Generic answers","Hallucination bait"],
    looks:["Heavy prompting, light data","RAG helps… but answers still feel generic","Users ask follow-ups because context is missing"],
    risk:["Hallucinations become predictable under missing context","Your domain experts lose patience (quietly)","You hit a ceiling and blame “the model”"],
    move:"Give the agent **structured reality**: entities, policies, states. Then add tools that validate outcomes against source systems. Reality is the best guardrail."},
  { id:"system_builder", name:"You’re Building a Real System",
    sub:"You’re thinking in workflows, risk, and inspection — which is how this scales without chaos.",
    tags:["Risk-gated","Observable","Scalable trust"],
    looks:["Risk gating is intentional","Escalation paths exist and are explainable","Observability is a prerequisite, not a nice-to-have"],
    risk:["Your main risk is scope creep, not chaos","You’ll be asked to replicate this across teams","You might become the AI adult in the room"],
    move:"Productize your pattern: reusable risk tiers, logging standards, eval suites. Expand capabilities without expanding liability."},
];

const $ = (id)=>document.getElementById(id);
const state = { i:0, answers:Array(QUESTIONS.length).fill(null), sound:false };
let audioCtx = null;

function beep(freq=520, ms=35, type="sine", gain=0.02){
  if(!state.sound) return;
  try{
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.value = gain;
    o.connect(g); g.connect(audioCtx.destination);
    o.start();
    setTimeout(()=>o.stop(), ms);
  }catch(e){}
}

function show(view){
  ["introView","quizView","resultsView"].forEach(v => $(v).classList.add("hidden"));
  $(view).classList.remove("hidden");
  $(view).classList.add("fadeIn");
  setTimeout(()=>$(view).classList.remove("fadeIn"), 260);
}

function toast(msg){
  const t = $("toast");
  t.textContent = msg;
  t.classList.remove("hidden");
  setTimeout(()=>t.classList.add("hidden"), 1400);
}

function escapeHtml(s){ return s.replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;"); }
function md(s){ return escapeHtml(s).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>"); }
function setYear(){ $("year").textContent = String(new Date().getFullYear()); }

function setProgress(){
  const pct = (state.i / QUESTIONS.length) * 100;
  $("fill").style.width = `${pct}%`;
  $("qCount").textContent = `Question ${state.i+1} of ${QUESTIONS.length}`;
}

function renderQ(){
  const q = QUESTIONS[state.i];
  $("qKicker").textContent = q.kicker;
  $("qAside").textContent = q.aside || "";
  $("qTitle").textContent = q.title;
  $("qSub").textContent = q.sub;

  const chosen = state.answers[state.i]?.optIndex ?? null;
  $("nextBtn").disabled = chosen == null;

  $("options").innerHTML = q.options.map((o, idx)=>{
    const sel = chosen===idx ? "selected" : "";
    return `
      <div class="opt ${sel}" role="button" tabindex="0" data-idx="${idx}">
        <div class="n">${idx+1}</div>
        <div class="optMain">
          <div class="optTitle">${escapeHtml(o.label)}</div>
          <div class="optDesc">${escapeHtml(o.desc)}</div>
        </div>
      </div>
    `;
  }).join("");

  document.querySelectorAll(".opt").forEach(el=>{
    el.addEventListener("click", ()=>select(Number(el.dataset.idx)));
    el.addEventListener("keydown", (e)=>{
      if(e.key==="Enter"||e.key===" "){ e.preventDefault(); select(Number(el.dataset.idx)); }
    });
  });

  $("qCard").classList.add("fadeIn");
  setTimeout(()=>$("qCard").classList.remove("fadeIn"), 260);

  setProgress();
}

function select(idx){
  const opt = QUESTIONS[state.i].options[idx];
  state.answers[state.i] = { optIndex: idx, w: opt.w || {} };
  $("nextBtn").disabled = false;
  beep(640, 30, "triangle", 0.02);
  renderQ();
}

function compute(){
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

function renderResults(a){
  $("rTitle").textContent = a.name;
  $("rSub").textContent = a.sub;
  $("tags").innerHTML = a.tags.map((t,i)=>`<span class="tag ${i===0?"hot":""}">${escapeHtml(t)}</span>`).join("");
  $("looks").innerHTML = a.looks.map(x=>`<li>${escapeHtml(x)}</li>`).join("");
  $("risk").innerHTML = a.risk.map(x=>`<li>${escapeHtml(x)}</li>`).join("");
  $("move").innerHTML = md(a.move);
  $("bookBtn").setAttribute("href", TIDYCAL_LINK);

  const url = new URL(window.location.href);
  url.searchParams.set("result", a.id);
  history.replaceState({}, "", url.toString());
}

function start(){
  show("quizView");
  state.i = 0;
  renderQ();
  $("fill").style.width = `${(1/QUESTIONS.length)*100}%`;
  toast("Alright. No lying. (The UI will judge silently.)");
  beep(520, 45, "sine", 0.02);
}

function next(){
  if(state.answers[state.i] == null){
    toast("Pick one. “It depends” is not an option.");
    beep(180, 60, "sawtooth", 0.015);
    return;
  }
  if(state.i < QUESTIONS.length - 1){
    state.i += 1;
    renderQ();
    beep(740, 30, "triangle", 0.018);
  }else{
    const a = compute();
    show("resultsView");
    $("fill").style.width = "100%";
    renderResults(a);
    toast("Diagnosis complete. Proceed with adult supervision.");
    beep(880, 60, "sine", 0.02);
  }
}

function back(){
  if(state.i > 0){ state.i -= 1; renderQ(); beep(320, 30, "triangle", 0.016); }
  else{ show("introView"); }
}

function restart(){
  state.i = 0;
  state.answers = Array(QUESTIONS.length).fill(null);
  const url = new URL(window.location.href);
  url.searchParams.delete("result");
  history.replaceState({}, "", url.toString());
  show("introView");
  toast("Reset. Your agent is safe. For now.");
  beep(260, 40, "sine", 0.015);
}

function copyLink(){
  const url = new URL(window.location.href);
  navigator.clipboard.writeText(url.toString()).then(()=>{
    $("copyBtn").textContent = "Copied ✓";
    toast("Link copied. Deploy it into Slack.");
    beep(900, 30, "triangle", 0.02);
    setTimeout(()=>$("copyBtn").textContent="Copy results link", 1200);
  }).catch(()=>toast("Copy failed. Clipboard is in governance review."));
}

function again(){ restart(); start(); }

function openModal(html){
  $("modalBody").innerHTML = html;
  $("modal").classList.remove("hidden");
  beep(600, 30, "sine", 0.015);
}
function closeModal(){ $("modal").classList.add("hidden"); }

function peek(){
  const html = QUESTIONS.map((q, i)=>{
    const opts = q.options.map((o, j)=>`<li><strong>${j+1}. ${escapeHtml(o.label)}</strong> — ${escapeHtml(o.desc)}</li>`).join("");
    return `<h3>Q${i+1} • ${escapeHtml(q.kicker)}</h3>
      <div style="margin-bottom:6px;opacity:.95;"><strong>${escapeHtml(q.title)}</strong></div>
      <div style="margin-bottom:8px;opacity:.85;">${escapeHtml(q.sub)}</div>
      <ul>${opts}</ul>`;
  }).join("");
  openModal(html);
}

function loadResult(){
  const url = new URL(window.location.href);
  const r = url.searchParams.get("result");
  if(!r) return false;
  const a = ARCHETYPES.find(x=>x.id===r);
  if(!a) return false;
  show("resultsView");
  renderResults(a);
  return true;
}

function wire(){
  $("startBtn").addEventListener("click", start);
  $("peekBtn").addEventListener("click", peek);
  $("backBtn").addEventListener("click", back);
  $("restartBtn").addEventListener("click", restart);
  $("nextBtn").addEventListener("click", next);
  $("copyBtn").addEventListener("click", copyLink);
  $("againBtn").addEventListener("click", again);
  $("homeBtn").addEventListener("click", restart);

  $("backdrop").addEventListener("click", closeModal);
  $("closeModal").addEventListener("click", closeModal);

  $("toggleSound").addEventListener("click", ()=>{
    state.sound = !state.sound;
    $("toggleSound").setAttribute("aria-pressed", String(state.sound));
    $("soundLabel").textContent = `Sound: ${state.sound ? "On" : "Off"}`;
    $("toggleSound").querySelector(".pillDot").style.background = state.sound ? "rgba(34,197,94,.55)" : "rgba(255,255,255,.25)";
    toast(state.sound ? "Sound on. Tiny dopamine enabled." : "Sound off. Silence is a feature.");
    beep(state.sound ? 760 : 220, 60, "sine", 0.02);
  });

  window.addEventListener("keydown", (e)=>{
    if(e.key==="Escape"){
      if(!$("modal").classList.contains("hidden")){ closeModal(); return; }
      restart(); return;
    }
    const quizVisible = !$("quizView").classList.contains("hidden");
    if(!quizVisible) return;
    if(["1","2","3","4"].includes(e.key)) select(Number(e.key)-1);
    if(e.key==="Enter") next();
    if(e.key==="ArrowLeft") back();
    if(e.key==="ArrowRight") next();
  });
}

(function init(){
  setYear();
  wire();
  const loaded = loadResult();
  if(!loaded) show("introView");
})();
