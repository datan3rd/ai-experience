// AI Maturity Walkthrough — 5 questions, heavy humor, clear path.
const BOOKING = "https://tidycal.com/jasonfishbein/briefchat";
const state = { answers: { q1:null, q2:null, q3:null, q4:null, q5:null } };
const $ = (s)=>document.querySelector(s);
const $$ = (s)=>Array.from(document.querySelectorAll(s));
$("#year").textContent = String(new Date().getFullYear());

function scrollToPanel(panel){
  const el = document.querySelector(`[data-panel="${panel}"]`);
  if(!el) return;
  el.scrollIntoView({ behavior:"smooth", block:"start" });
}
function setProgressFromAnswers(){
  const total = 5;
  const done = Object.values(state.answers).filter(Boolean).length;
  const pct = Math.round((done / total) * 100);
  $("#fill").style.width = `${pct}%`;
  $("#pText").textContent = `${pct}%`;
}
function select(q, a){
  state.answers[q] = a;
  $$(`.choice[data-q="${q}"]`).forEach(btn=>{
    btn.classList.toggle("selected", btn.dataset.a === a);
  });
  setProgressFromAnswers();
  updateResult();
}
function maturityScore(){
  let score = 0;
  if(state.answers.q1 === "useCase") score += 3;
  if(state.answers.q1 === "workflowBreak") score += 2;
  if(state.answers.q1 === "experiment") score += 1;

  if(state.answers.q2 === "outcome") score += 3;
  if(state.answers.q2 === "human") score += 2;
  if(state.answers.q2 === "spot") score += 1;

  if(state.answers.q3 === "adaptiveRoles") score += 3;
  if(state.answers.q3 === "roles") score += 2;
  if(state.answers.q3 === "oneAgentTools") score += 1;

  if(state.answers.q4 === "triple") score += 3;
  if(state.answers.q4 === "adoptionOnly") score += 2;
  if(state.answers.q4 === "feelsFaster") score += 1;

  if(state.answers.q5 === "framework") score += 3;
  if(state.answers.q5 === "copyPaste") score += 1;

  return score; // max 15
}

const snapshots = [
  {
    id: "demo-gremlins",
    title: "Demo Gremlins",
    pills: ["High vibes", "Low governance", "Surprise incidents"],
    sub: "You’re one impressive demo away from a spectacular postmortem.",
    move: "Next move: define <strong>outcome acceptance criteria</strong> + a simple <strong>handoff rule</strong> (do / draft / escalate). You’ll get stability fast and fewer Slack fires."
  },
  {
    id: "pilot-purgatory",
    title: "Pilot Purgatory",
    pills: ["Some signal", "Some chaos", "Lots of debating"],
    sub: "It works… until it meets edge cases and political stakeholders.",
    move: "Next move: add <strong>observability</strong> (inputs → decisions → tools → outputs) and pick <strong>one ROI metric</strong> to stop arguing in circles."
  },
  {
    id: "system-mode",
    title: "System Mode",
    pills: ["Use-case driven", "Outcome validated", "Ready to scale"],
    sub: "Congrats. You’re building a system — not a magic trick.",
    move: "Next move: extract a reusable <strong>framework</strong> (roles, policies, telemetry, evals) so scaling from 1 agent to many doesn’t require 100 babysitters."
  }
];
function snapshotFromScore(score){
  if(score >= 12) return snapshots[2];
  if(score >= 7) return snapshots[1];
  return snapshots[0];
}
function updateResult(){
  const answered = Object.values(state.answers).filter(Boolean).length;
  document.body.classList.toggle("incomplete", answered < 5);
  if(answered < 5){
    $("#resultTitle").textContent = "Finish the 5 clicks.";
    $("#resultSub").textContent = "Then you’ll get a maturity snapshot + the cleanest next move.";
    $("#pillRow").innerHTML = "";
    $("#resultMove").innerHTML = "Your agent can’t mature on vibes alone. (It can try. It will fail.)";
    return;
  }
  const score = maturityScore();
  const snap = snapshotFromScore(score);
  $("#resultTitle").textContent = snap.title;
  $("#resultSub").textContent = snap.sub;
  $("#pillRow").innerHTML = snap.pills.map((p,i)=>`<span class="mini ${i===0?"hot":""}">${p}</span>`).join("");
  $("#resultMove").innerHTML = snap.move + `<div style="margin-top:10px;opacity:.85;color:rgba(255,255,255,.75)">Want a fast second opinion? Book 15 minutes. I’ll map your answers to a mature plan and show how to unlock more ROI.</div>`;
  const url = new URL(window.location.href);
  url.searchParams.set("s", snap.id);
  history.replaceState({}, "", url.toString());
}
function loadFromUrl(){
  const url = new URL(window.location.href);
  const s = url.searchParams.get("s");
  const snap = snapshots.find(x=>x.id===s);
  if(!snap) return;
  $("#resultTitle").textContent = snap.title;
  $("#resultSub").textContent = snap.sub;
  $("#pillRow").innerHTML = snap.pills.map((p,i)=>`<span class="mini ${i===0?"hot":""}">${p}</span>`).join("");
  $("#resultMove").innerHTML = snap.move + `<div style="margin-top:10px;opacity:.85;color:rgba(255,255,255,.75)">Want a fast second opinion? Book 15 minutes. I’ll map your answers to a mature plan and show how to unlock more ROI.</div>`;
}
function copyLink(){
  const url = new URL(window.location.href);
  navigator.clipboard.writeText(url.toString()).then(()=>{
    $("#copy").textContent = "Copied ✓";
    setTimeout(()=>$("#copy").textContent = "Copy sharable link", 1200);
  }).catch(()=>{
    $("#copy").textContent = "Copy failed";
    setTimeout(()=>$("#copy").textContent = "Copy sharable link", 1200);
  });
}
function restart(){
  state.answers = { q1:null, q2:null, q3:null, q4:null, q5:null };
  $$(".choice").forEach(b=>b.classList.remove("selected"));
  const url = new URL(window.location.href);
  url.searchParams.delete("s");
  history.replaceState({}, "", url.toString());
  setProgressFromAnswers();
  updateResult();
  scrollToPanel("hero");
}

function on(id, event, handler){
  const el = document.getElementById(id);
  if(!el) return;
  el.addEventListener(event, handler);
}

function wire(){
  on("start","click", ()=>scrollToPanel("q1"));
  // Optional buttons (may not exist in some versions)
  on("skipToBook","click", ()=>scrollToPanel("result"));
  on("restart","click", restart);
  on("copy","click", copyLink);

  const book = document.getElementById("book");
  if(book) book.setAttribute("href", BOOKING);

  const brand = document.getElementById("toTop");
  if(brand){
    brand.addEventListener("click", restart);
    brand.addEventListener("keydown", (e)=>{ if(e.key==="Enter") restart(); });
  }

  const nextMap = { q1:"q2", q2:"q3", q3:"q4", q4:"q5", q5:"result" };
  document.querySelectorAll(".choice").forEach(btn=>{
    btn.addEventListener("click", ()=>{
      const q = btn.dataset.q;
      const a = btn.dataset.a;
      if(!q || !a) return;
      select(q, a);
      setTimeout(()=>scrollToPanel(nextMap[q] || "result"), 240);
    });
  });

  // Scroll-based progress (safe even if some nodes missing)
  const panels = Array.from(document.querySelectorAll("[data-panel]"));
  const fill = document.getElementById("fill");
  const pText = document.getElementById("pText");
  if(panels.length && fill && pText){
    const io = new IntersectionObserver((entries)=>{
      for(const e of entries){
        if(e.isIntersecting){
          const idx = panels.indexOf(e.target);
          const pct = Math.round((idx/(panels.length-1))*100);
          const current = parseInt((pText.textContent || "0").replace("%",""), 10) || 0;
          if(pct > current){
            fill.style.width = `${pct}%`;
            pText.textContent = `${pct}%`;
          }
        }
      }
    }, { threshold: 0.55 });
    panels.forEach(p=>io.observe(p));
  }

  // Cursor follower (optional; no-op on touch)
  const dot = document.querySelector(".cursorDot");
  const ring = document.querySelector(".cursorRing");
  if(dot && ring){
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
}

setProgressFromAnswers();
updateResult();
loadFromUrl();
wire();
