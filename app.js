// Cuberto-ish walkthrough (simple)
const BOOKING = "https://tidycal.com/jasonfishbein/briefchat";

const state = {
  answers: { q1:null, q2:null, q3:null, q4:null },
};

const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
const year = new Date().getFullYear();
$("#year").textContent = String(year);

function scrollToPanel(panel){
  const el = document.querySelector(`[data-panel="${panel}"]`);
  if(!el) return;
  el.scrollIntoView({ behavior:"smooth", block:"start" });
}

function setProgress(){
  const total = 4;
  const done = Object.values(state.answers).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);
  $("#fill").style.width = `${pct}%`;
  $("#pText").textContent = `${pct}%`;
}

function setSelected(q, a){
  state.answers[q] = a;
  $$(`.choice[data-q="${q}"]`).forEach(btn=>{
    btn.classList.toggle("selected", btn.dataset.a === a);
  });
  setProgress();
  updateResult();
}

function getArchetype(){
  const { q1, q2, q3, q4 } = state.answers;

  // Simple mapping → minimal, opinionated, and readable.
  // "Vibes" and "guess" heavily push toward prototype trap.
  let score = { system:0, risk:0, context:0, guard:0 };

  if(q1 === "pressure" || q1 === "fear") score.risk += 1;
  if(q1 === "efficiency" || q1 === "cx") score.system += 1;

  if(q2 === "guess") score.risk += 2;
  if(q2 === "failClosed") score.guard += 2;
  if(q2 === "clarify") score.system += 1;
  if(q2 === "escalate") score.guard += 1;

  if(q3 === "vibes") score.risk += 2;
  if(q3 === "rules") score.system += 2;
  if(q3 === "humanLoop") score.guard += 2;
  if(q3 === "evals") score.system += 2;

  if(q4 === "promptOnly") score.context += 2;
  if(q4 === "rag") score.context += 1;
  if(q4 === "structured") score.system += 2;
  if(q4 === "tools") score.system += 2, score.guard += 1;

  // Archetypes
  if(score.system >= 6 && score.risk <= 2) return "system_builder";
  if(score.risk >= 4 && score.guard <= 2) return "prototype_trap";
  if(score.context >= 3 && score.system <= 4) return "context_thin";
  if(score.guard <= 2 && score.risk >= 3) return "guardrail_gap";
  return "prototype_trap";
}

const archetypes = {
  prototype_trap: {
    title: "Prototype Trap",
    sub: "Impressive demo energy… but not designed for trust at scale.",
    pills: ["Demo energy", "Hidden risk", "Accuracy theater"],
    move: "Define a <strong>risk ladder</strong> (low / medium / high). Then decide: what the agent does alone, what it drafts for approval, and what always escalates. No ladders = chaos with nicer UI."
  },
  guardrail_gap: {
    title: "Guardrail Gap",
    sub: "You’re building fast — but the safety story is improvisational.",
    pills: ["Fast build", "Soft controls", "Liability"],
    move: "Design handoff rules around <strong>business risk</strong>, not model confidence. Confidence is vibes in a lab coat."
  },
  context_thin: {
    title: "Thin Context",
    sub: "The agent is being asked to reason without seeing enough truth.",
    pills: ["Generic answers", "Hallucination bait", "Too much prompting"],
    move: "Give the agent <strong>structured reality</strong> (entities, states, policies) and tools to validate outcomes against source systems. Reality is the best guardrail."
  },
  system_builder: {
    title: "Real System",
    sub: "You’re thinking in workflows, risk, and inspection. That’s how this scales.",
    pills: ["Risk‑gated", "Observable", "Scalable trust"],
    move: "Productize the pattern: reusable risk tiers, logging standards, eval suites. This is how you scale capability without scaling liability."
  }
};

function updateResult(){
  const answered = Object.values(state.answers).filter(Boolean).length;
  if(answered < 4){
    $("#resultTitle").textContent = "Answer the 4 questions above.";
    $("#resultSub").textContent = "Then I’ll give you a clean snapshot + the one move I’d make first.";
    $("#pillRow").innerHTML = "";
    $("#resultMove").innerHTML = "No tricks. Just finish the walkthrough.";
    return;
  }
  const key = getArchetype();
  const a = archetypes[key];
  $("#resultTitle").textContent = a.title;
  $("#resultSub").textContent = a.sub;
  $("#pillRow").innerHTML = a.pills.map((p,i)=>`<span class="mini ${i===0?"hot":""}">${p}</span>`).join("");
  $("#resultMove").innerHTML = a.move;

  // write result into URL so it can be shared
  const url = new URL(window.location.href);
  url.searchParams.set("r", key);
  history.replaceState({}, "", url.toString());
}

function loadFromUrl(){
  const url = new URL(window.location.href);
  const r = url.searchParams.get("r");
  if(r && archetypes[r]){
    $("#resultTitle").textContent = archetypes[r].title;
    $("#resultSub").textContent = archetypes[r].sub;
    $("#pillRow").innerHTML = archetypes[r].pills.map((p,i)=>`<span class="mini ${i===0?"hot":""}">${p}</span>`).join("");
    $("#resultMove").innerHTML = archetypes[r].move;
  }
}

function copyLink(){
  const url = new URL(window.location.href);
  navigator.clipboard.writeText(url.toString()).then(()=>{
    $("#copy").textContent = "Copied ✓";
    setTimeout(()=>$("#copy").textContent = "Copy a sharable link", 1200);
  }).catch(()=>{
    $("#copy").textContent = "Copy failed";
    setTimeout(()=>$("#copy").textContent = "Copy a sharable link", 1200);
  });
}

function restart(){
  state.answers = { q1:null, q2:null, q3:null, q4:null };
  $$(".choice").forEach(b=>b.classList.remove("selected"));
  const url = new URL(window.location.href);
  url.searchParams.delete("r");
  history.replaceState({}, "", url.toString());
  setProgress();
  updateResult();
  scrollToPanel("hero");
}

function wire(){
  $("#start").addEventListener("click", ()=>scrollToPanel("q1"));
  $("#skipToBook").addEventListener("click", ()=>scrollToPanel("result"));
  $("#restart").addEventListener("click", restart);
  $("#copy").addEventListener("click", copyLink);
  $("#book").setAttribute("href", BOOKING);

  const brand = $("#toTop");
  brand.addEventListener("click", restart);
  brand.addEventListener("keydown", (e)=>{ if(e.key==="Enter") restart(); });

  $$(".choice").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const q = btn.dataset.q;
      const a = btn.dataset.a;
      setSelected(q, a);

      // smooth guide to next panel
      const nextMap = { q1:"q2", q2:"q3", q3:"q4", q4:"result" };
      setTimeout(()=>scrollToPanel(nextMap[q] || "result"), 260);
    });
  });

  // Progress based on scroll (feels premium, without being noisy)
  const panels = $$("[data-panel]");
  const io = new IntersectionObserver((entries)=>{
    for(const e of entries){
      if(e.isIntersecting){
        const idx = panels.indexOf(e.target);
        const pct = Math.max($("#fill").style.width.replace("%","")|0, Math.round((idx/(panels.length-1))*100));
        $("#fill").style.width = `${pct}%`;
        $("#pText").textContent = `${pct}%`;
      }
    }
  }, { threshold: 0.55 });
  panels.forEach(p=>io.observe(p));

  // Cursor follower (subtle)
  const dot = document.querySelector(".cursorDot");
  const ring = document.querySelector(".cursorRing");
  let x=0,y=0, rx=0, ry=0;
  window.addEventListener("mousemove",(e)=>{
    x = e.clientX; y = e.clientY;
    dot.style.left = x+"px"; dot.style.top = y+"px";
  });
  function raf(){
    rx += (x - rx) * 0.10;
    ry += (y - ry) * 0.10;
    ring.style.left = rx+"px"; ring.style.top = ry+"px";
    requestAnimationFrame(raf);
  }
  raf();
}

setProgress();
updateResult();
loadFromUrl();
wire();
