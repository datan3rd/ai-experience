// ============================================
// AI Maturity Reality Check
// Horizontal Navigation System
// ============================================

const CONFIG = {
  BOOKING_URL: "https://tidycal.com/jasonfishbein/briefchat",
  TOTAL_QUESTIONS: 5,
  TOTAL_STEPS: 6 // 0 = welcome, 1-5 = questions, 6 = results
};

// State Management
const state = {
  currentStep: 0,
  answers: {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null
  }
};

// Maturity Snapshots
const SNAPSHOTS = [
  {
    id: "demo-gremlins",
    title: "Demo Gremlins",
    tags: ["High vibes", "Low governance", "Surprise incidents"],
    subtitle: "You're one impressive demo away from a spectacular postmortem.",
    nextMove: "Next move: define <strong>outcome acceptance criteria</strong> + a simple <strong>handoff rule</strong> (do / draft / escalate). You'll get stability fast and fewer Slack fires."
  },
  {
    id: "pilot-purgatory",
    title: "Pilot Purgatory",
    tags: ["Some signal", "Some chaos", "Lots of debating"],
    subtitle: "It works… until it meets edge cases and political stakeholders.",
    nextMove: "Next move: add <strong>observability</strong> (inputs → decisions → tools → outputs) and pick <strong>one ROI metric</strong> to stop arguing in circles."
  },
  {
    id: "system-mode",
    title: "System Mode",
    tags: ["Use-case driven", "Outcome validated", "Ready to scale"],
    subtitle: "Congrats. You're building a system — not a magic trick.",
    nextMove: "Next move: extract a reusable <strong>framework</strong> (roles, policies, telemetry, evals) so scaling from 1 agent to many doesn't require 100 babysitters."
  }
];

// ============================================
// Utility Functions
// ============================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

// ============================================
// Navigation Functions
// ============================================

function goToStep(stepNum) {
  if (stepNum < 0 || stepNum > CONFIG.TOTAL_STEPS) return;
  
  const currentScreen = $(`.screen[data-step="${state.currentStep}"]`);
  const nextScreen = $(`.screen[data-step="${stepNum}"]`);
  
  if (!nextScreen) return;
  
  // Add exiting class to current screen
  if (currentScreen) {
    currentScreen.classList.add('exiting');
    currentScreen.classList.remove('active');
  }
  
  // Wait for exit animation, then show next screen
  setTimeout(() => {
    if (currentScreen) {
      currentScreen.classList.remove('exiting');
    }
    
    nextScreen.classList.add('active');
    state.currentStep = stepNum;
    
    updateUI();
  }, 200);
}

function nextStep() {
  // Check if current question is answered (if we're on a question screen)
  if (state.currentStep >= 1 && state.currentStep <= 5) {
    const questionId = `q${state.currentStep}`;
    if (!state.answers[questionId]) {
      // Don't allow proceeding without answering
      return;
    }
  }
  
  if (state.currentStep < CONFIG.TOTAL_STEPS) {
    goToStep(state.currentStep + 1);
  }
}

function prevStep() {
  if (state.currentStep > 0) {
    goToStep(state.currentStep - 1);
  }
}

function restart() {
  // Reset state
  state.currentStep = 0;
  state.answers = {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null
  };
  
  // Clear selections
  $$('.option-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Clear URL
  const url = new URL(window.location.href);
  url.searchParams.delete('s');
  history.replaceState({}, '', url.toString());
  
  // Go to welcome screen
  goToStep(0);
}

// ============================================
// UI Updates
// ============================================

function updateUI() {
  // Update progress bar
  const progress = (state.currentStep / CONFIG.TOTAL_STEPS) * 100;
  $('#progressBar').style.width = `${progress}%`;
  
  // Update step indicator
  $('#stepNum').textContent = state.currentStep;
  
  // Update back button state
  $('#backBtn').disabled = state.currentStep === 0;
  
  // Show results if on final step
  if (state.currentStep === CONFIG.TOTAL_STEPS) {
    displayResults();
  }
}

function updateProgress() {
  const progress = (state.currentStep / CONFIG.TOTAL_STEPS) * 100;
  $('#progressBar').style.width = `${progress}%`;
}

// ============================================
// Answer Selection
// ============================================

function selectAnswer(question, answer) {
  state.answers[question] = answer;
  
  // Update UI
  $$('.option-card').forEach(card => {
    if (card.dataset.q === question) {
      card.classList.toggle('selected', card.dataset.a === answer);
    }
  });
  
  // Auto-advance after a short delay
  setTimeout(() => {
    nextStep();
  }, 400);
}

// ============================================
// Scoring System
// ============================================

function calculateScore() {
  let score = 0;
  
  // Question 1: Intent
  if (state.answers.q1 === 'useCase') score += 3;
  else if (state.answers.q1 === 'workflowBreak') score += 2;
  else if (state.answers.q1 === 'experiment') score += 1;
  
  // Question 2: Validation
  if (state.answers.q2 === 'outcome') score += 3;
  else if (state.answers.q2 === 'human') score += 2;
  else if (state.answers.q2 === 'spot') score += 1;
  
  // Question 3: Complexity
  if (state.answers.q3 === 'adaptiveRoles') score += 3;
  else if (state.answers.q3 === 'roles') score += 2;
  else if (state.answers.q3 === 'oneAgentTools') score += 1;
  
  // Question 4: ROI
  if (state.answers.q4 === 'triple') score += 3;
  else if (state.answers.q4 === 'adoptionOnly') score += 2;
  else if (state.answers.q4 === 'feelsFaster') score += 1;
  
  // Question 5: Scale
  if (state.answers.q5 === 'framework') score += 3;
  else if (state.answers.q5 === 'copyPaste') score += 1;
  
  return score; // Max: 15
}

function getSnapshot(score) {
  if (score >= 12) return SNAPSHOTS[2]; // System Mode
  if (score >= 7) return SNAPSHOTS[1];  // Pilot Purgatory
  return SNAPSHOTS[0];                   // Demo Gremlins
}

// ============================================
// Results Display
// ============================================

function displayResults() {
  const score = calculateScore();
  const snapshot = getSnapshot(score);
  
  // Update title and subtitle
  $('#resultTitle').textContent = snapshot.title;
  $('#resultSubtitle').textContent = snapshot.subtitle;
  
  // Update tags
  const tagsHTML = snapshot.tags.map((tag, i) => 
    `<span class="tag ${i === 0 ? 'primary' : ''}">${tag}</span>`
  ).join('');
  $('#resultTags').innerHTML = tagsHTML;
  
  // Update next move
  $('#resultMove').innerHTML = snapshot.nextMove + 
    `<div style="margin-top: 16px; opacity: 0.7; font-size: 15px;">
      Want a fast second opinion? Book 15 minutes. I'll map your answers to a mature plan and show how to unlock more ROI.
    </div>`;
  
  // Update URL
  const url = new URL(window.location.href);
  url.searchParams.set('s', snapshot.id);
  history.replaceState({}, '', url.toString());
}

function loadFromURL() {
  const url = new URL(window.location.href);
  const snapshotId = url.searchParams.get('s');
  
  if (snapshotId) {
    const snapshot = SNAPSHOTS.find(s => s.id === snapshotId);
    if (snapshot) {
      // Go directly to results
      state.currentStep = CONFIG.TOTAL_STEPS;
      goToStep(CONFIG.TOTAL_STEPS);
      
      // Display the snapshot
      $('#resultTitle').textContent = snapshot.title;
      $('#resultSubtitle').textContent = snapshot.subtitle;
      
      const tagsHTML = snapshot.tags.map((tag, i) => 
        `<span class="tag ${i === 0 ? 'primary' : ''}">${tag}</span>`
      ).join('');
      $('#resultTags').innerHTML = tagsHTML;
      
      $('#resultMove').innerHTML = snapshot.nextMove + 
        `<div style="margin-top: 16px; opacity: 0.7; font-size: 15px;">
          Want a fast second opinion? Book 15 minutes. I'll map your answers to a mature plan and show how to unlock more ROI.
        </div>`;
    }
  }
}

// ============================================
// Event Listeners
// ============================================

function initEventListeners() {
  // Start button
  $('#startBtn')?.addEventListener('click', () => {
    goToStep(1);
  });
  
  // Navigation buttons
  $('#backBtn')?.addEventListener('click', prevStep);
  $('#restartBtn')?.addEventListener('click', restart);
  $('#restartFromResults')?.addEventListener('click', restart);
  
  // Option cards
  $$('.option-card').forEach(card => {
    card.addEventListener('click', () => {
      const question = card.dataset.q;
      const answer = card.dataset.a;
      if (question && answer) {
        selectAnswer(question, answer);
      }
    });
  });
  
  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' && state.currentStep > 0 && state.currentStep < CONFIG.TOTAL_STEPS) {
      // Check if current question is answered
      const questionId = `q${state.currentStep}`;
      if (state.answers[questionId]) {
        nextStep();
      }
    } else if (e.key === 'ArrowLeft' && state.currentStep > 0) {
      prevStep();
    }
  });
  
  // Set year in footer
  $('#year').textContent = new Date().getFullYear();
}

// ============================================
// Initialization
// ============================================

function init() {
  console.log('🚀 Initializing AI Maturity Assessment...');
  
  // Initialize event listeners
  initEventListeners();
  
  // Load from URL if present
  loadFromURL();
  
  // Update UI
  updateUI();
  
  console.log('✨ Ready');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle browser back/forward buttons
window.addEventListener('popstate', () => {
  loadFromURL();
});
