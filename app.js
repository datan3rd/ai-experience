// State
const state = {
  current: 0,
  total: 5,
  answers: { q1: null, q2: null, q3: null, q4: null, q5: null }
};

// Snapshots
const snapshots = [
  {
    id: "demo-gremlins",
    title: "Demo Gremlins",
    subtitle: "You're one impressive demo away from a spectacular postmortem.",
    tags: ["High vibes", "Low governance", "Surprise incidents"],
    move: "Next move: define <strong>outcome acceptance criteria</strong> + a simple <strong>handoff rule</strong> (do / draft / escalate). You'll get stability fast and fewer Slack fires."
  },
  {
    id: "pilot-purgatory",
    title: "Pilot Purgatory",
    subtitle: "It works… until it meets edge cases and political stakeholders.",
    tags: ["Some signal", "Some chaos", "Lots of debating"],
    move: "Next move: add <strong>observability</strong> (inputs → decisions → tools → outputs) and pick <strong>one ROI metric</strong> to stop arguing in circles."
  },
  {
    id: "system-mode",
    title: "System Mode",
    subtitle: "Congrats. You're building a system — not a magic trick.",
    tags: ["Use-case driven", "Outcome validated", "Ready to scale"],
    move: "Next move: extract a reusable <strong>framework</strong> (roles, policies, telemetry, evals) so scaling from 1 agent to many doesn't require 100 babysitters."
  }
];

// Navigation
function goTo(n) {
  if (n < 0 || n > 6) return;
  
  const current = document.querySelector('.screen.active');
  const next = document.querySelector(`.screen[data-screen="${n}"]`);
  
  if (!next) return;
  
  if (current) {
    current.classList.add('exiting');
    current.classList.remove('active');
  }
  
  setTimeout(() => {
    if (current) current.classList.remove('exiting');
    next.classList.add('active');
    state.current = n;
    update();
  }, 200);
}

function next() {
  const q = `q${state.current}`;
  if (state.current >= 1 && state.current <= 5 && !state.answers[q]) return;
  if (state.current < 6) goTo(state.current + 1);
}

function prev() {
  if (state.current > 0) goTo(state.current - 1);
}

function restart() {
  state.current = 0;
  state.answers = { q1: null, q2: null, q3: null, q4: null, q5: null };
  
  document.querySelectorAll('.option').forEach(el => {
    el.classList.remove('selected');
  });
  
  const url = new URL(window.location.href);
  url.searchParams.delete('s');
  history.replaceState({}, '', url.toString());
  
  goTo(0);
}

// Update UI
function update() {
  const progress = (state.current / 6) * 100;
  document.getElementById('progress').style.width = `${progress}%`;
  document.getElementById('currentStep').textContent = state.current;
  document.getElementById('navBack').disabled = state.current === 0;
  
  if (state.current === 6) showResults();
}

// Answer selection
function select(q, a) {
  state.answers[q] = a;
  
  document.querySelectorAll(`.option[data-q="${q}"]`).forEach(el => {
    el.classList.toggle('selected', el.dataset.a === a);
  });
  
  setTimeout(next, 300);
}

// Scoring
function score() {
  let s = 0;
  
  if (state.answers.q1 === 'useCase') s += 3;
  else if (state.answers.q1 === 'workflowBreak') s += 2;
  else if (state.answers.q1 === 'experiment') s += 1;
  
  if (state.answers.q2 === 'outcome') s += 3;
  else if (state.answers.q2 === 'human') s += 2;
  else if (state.answers.q2 === 'spot') s += 1;
  
  if (state.answers.q3 === 'adaptiveRoles') s += 3;
  else if (state.answers.q3 === 'roles') s += 2;
  else if (state.answers.q3 === 'oneAgentTools') s += 1;
  
  if (state.answers.q4 === 'triple') s += 3;
  else if (state.answers.q4 === 'adoptionOnly') s += 2;
  else if (state.answers.q4 === 'feelsFaster') s += 1;
  
  if (state.answers.q5 === 'framework') s += 3;
  else if (state.answers.q5 === 'copyPaste') s += 1;
  
  return s;
}

function getSnapshot(s) {
  if (s >= 12) return snapshots[2];
  if (s >= 7) return snapshots[1];
  return snapshots[0];
}

// Show results
function showResults() {
  const s = score();
  const snap = getSnapshot(s);
  
  document.getElementById('resultTitle').textContent = snap.title;
  document.getElementById('resultSubtitle').textContent = snap.subtitle;
  
  const tagsHtml = snap.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
  document.getElementById('resultTags').innerHTML = tagsHtml;
  
  document.getElementById('resultMove').innerHTML = snap.move + 
    `<div style="margin-top: 16px; opacity: 0.6; font-size: 15px;">Want a second opinion? Book 15 minutes. I'll map your answers to a plan and show how to unlock more ROI.</div>`;
  
  const url = new URL(window.location.href);
  url.searchParams.set('s', snap.id);
  history.replaceState({}, '', url.toString());
}

// Load from URL
function loadUrl() {
  const url = new URL(window.location.href);
  const id = url.searchParams.get('s');
  
  if (id) {
    const snap = snapshots.find(s => s.id === id);
    if (snap) {
      state.current = 6;
      goTo(6);
      
      document.getElementById('resultTitle').textContent = snap.title;
      document.getElementById('resultSubtitle').textContent = snap.subtitle;
      
      const tagsHtml = snap.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      document.getElementById('resultTags').innerHTML = tagsHtml;
      
      document.getElementById('resultMove').innerHTML = snap.move + 
        `<div style="margin-top: 16px; opacity: 0.6; font-size: 15px;">Want a second opinion? Book 15 minutes. I'll map your answers to a plan and show how to unlock more ROI.</div>`;
    }
  }
}

// Init
function init() {
  document.getElementById('start')?.addEventListener('click', () => goTo(1));
  document.getElementById('navBack')?.addEventListener('click', prev);
  document.getElementById('navRestart')?.addEventListener('click', restart);
  document.getElementById('restart')?.addEventListener('click', restart);
  
  document.querySelectorAll('.option').forEach(el => {
    el.addEventListener('click', () => {
      const q = el.dataset.q;
      const a = el.dataset.a;
      if (q && a) select(q, a);
    });
  });
  
  document.addEventListener('keydown', e => {
    if (e.key === 'ArrowRight' && state.current > 0 && state.current < 6) {
      const q = `q${state.current}`;
      if (state.answers[q]) next();
    } else if (e.key === 'ArrowLeft' && state.current > 0) {
      prev();
    }
  });
  
  document.getElementById('year').textContent = new Date().getFullYear();
  
  loadUrl();
  update();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

window.addEventListener('popstate', loadUrl);
