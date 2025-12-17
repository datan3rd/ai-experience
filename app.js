// ============================================
// QUANTUM LUXURY AI MATURITY ASSESSMENT
// Ultra-premium interactive experience
// ============================================

const CONFIG = {
  BOOKING_URL: "https://tidycal.com/jasonfishbein/briefchat",
  TOTAL_QUESTIONS: 5,
  PARTICLE_COUNT: 80,
  MAGNETIC_STRENGTH: 0.3,
  CURSOR_LERP: 0.15
};

// State Management
const state = {
  answers: {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null
  },
  cursor: {
    x: 0,
    y: 0,
    targetX: 0,
    targetY: 0
  }
};

// Maturity Snapshots
const MATURITY_SNAPSHOTS = [
  {
    id: "demo-gremlins",
    title: "Demo Gremlins",
    pills: ["High vibes", "Low governance", "Surprise incidents"],
    subtitle: "You're one impressive demo away from a spectacular postmortem.",
    nextMove: "Next move: define <strong>outcome acceptance criteria</strong> + a simple <strong>handoff rule</strong> (do / draft / escalate). You'll get stability fast and fewer Slack fires."
  },
  {
    id: "pilot-purgatory",
    title: "Pilot Purgatory",
    pills: ["Some signal", "Some chaos", "Lots of debating"],
    subtitle: "It works… until it meets edge cases and political stakeholders.",
    nextMove: "Next move: add <strong>observability</strong> (inputs → decisions → tools → outputs) and pick <strong>one ROI metric</strong> to stop arguing in circles."
  },
  {
    id: "system-mode",
    title: "System Mode",
    pills: ["Use-case driven", "Outcome validated", "Ready to scale"],
    subtitle: "Congrats. You're building a system — not a magic trick.",
    nextMove: "Next move: extract a reusable <strong>framework</strong> (roles, policies, telemetry, evals) so scaling from 1 agent to many doesn't require 100 babysitters."
  }
];

// ============================================
// UTILITY FUNCTIONS
// ============================================

const $ = (selector) => document.querySelector(selector);
const $$ = (selector) => Array.from(document.querySelectorAll(selector));

const lerp = (start, end, factor) => start + (end - start) * factor;

const getDistanceBetweenPoints = (x1, y1, x2, y2) => {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
};

const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

// ============================================
// PARTICLE SYSTEM
// ============================================

class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.mouse = { x: 0, y: 0 };
    
    this.resize();
    this.init();
    this.animate();
    
    window.addEventListener('resize', () => this.resize());
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = document.documentElement.scrollHeight;
  }
  
  init() {
    this.particles = [];
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        color: this.getRandomColor()
      });
    }
  }
  
  getRandomColor() {
    const colors = [
      'rgba(96, 165, 250, ',
      'rgba(167, 139, 250, ',
      'rgba(244, 114, 182, ',
      'rgba(34, 211, 238, '
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach((particle, i) => {
      // Move particle
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Bounce off edges
      if (particle.x < 0 || particle.x > this.canvas.width) {
        particle.vx *= -1;
      }
      if (particle.y < 0 || particle.y > this.canvas.height) {
        particle.vy *= -1;
      }
      
      // Mouse interaction
      const dx = this.mouse.x - particle.x;
      const dy = this.mouse.y - particle.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      if (distance < 150) {
        const force = (150 - distance) / 150;
        particle.x -= dx * force * 0.01;
        particle.y -= dy * force * 0.01;
      }
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color + particle.opacity + ')';
      this.ctx.fill();
      
      // Draw connections
      this.particles.slice(i + 1).forEach(otherParticle => {
        const dx = particle.x - otherParticle.x;
        const dy = particle.y - otherParticle.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(otherParticle.x, otherParticle.y);
          this.ctx.strokeStyle = particle.color + (0.15 * (1 - distance / 120)) + ')';
          this.ctx.lineWidth = 1;
          this.ctx.stroke();
        }
      });
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// ============================================
// CUSTOM CURSOR
// ============================================

class CustomCursor {
  constructor() {
    this.core = $('.cursor-core');
    this.ring = $('.cursor-ring');
    this.glow = $('.cursor-glow');
    
    if (!this.core || !this.ring || !this.glow) return;
    
    this.x = 0;
    this.y = 0;
    this.ringX = 0;
    this.ringY = 0;
    this.glowX = 0;
    this.glowY = 0;
    
    this.init();
  }
  
  init() {
    document.addEventListener('mousemove', (e) => {
      this.x = e.clientX;
      this.y = e.clientY;
      
      // Update core immediately
      this.core.style.left = `${this.x}px`;
      this.core.style.top = `${this.y}px`;
    });
    
    // Smooth follow for ring and glow
    const animate = () => {
      this.ringX = lerp(this.ringX, this.x, CONFIG.CURSOR_LERP);
      this.ringY = lerp(this.ringY, this.y, CONFIG.CURSOR_LERP);
      this.glowX = lerp(this.glowX, this.x, CONFIG.CURSOR_LERP * 0.8);
      this.glowY = lerp(this.glowY, this.y, CONFIG.CURSOR_LERP * 0.8);
      
      this.ring.style.left = `${this.ringX}px`;
      this.ring.style.top = `${this.ringY}px`;
      this.glow.style.left = `${this.glowX}px`;
      this.glow.style.top = `${this.glowY}px`;
      
      requestAnimationFrame(animate);
    };
    animate();
    
    // Add hover effects
    this.addHoverEffects();
  }
  
  addHoverEffects() {
    const interactiveElements = $$('button, a, .magnetic');
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        this.core.style.transform = 'translate(-50%, -50%) scale(1.5)';
        this.ring.style.transform = 'translate(-50%, -50%) scale(1.5)';
        this.glow.style.opacity = '1';
      });
      
      element.addEventListener('mouseleave', () => {
        this.core.style.transform = 'translate(-50%, -50%) scale(1)';
        this.ring.style.transform = 'translate(-50%, -50%) scale(1)';
        this.glow.style.opacity = '0';
      });
    });
  }
}

// ============================================
// MAGNETIC ELEMENTS
// ============================================

class MagneticElements {
  constructor() {
    this.elements = $$('.magnetic');
    this.mouse = { x: 0, y: 0 };
    this.init();
  }
  
  init() {
    document.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    this.elements.forEach(element => {
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const deltaX = (e.clientX - centerX) * CONFIG.MAGNETIC_STRENGTH;
        const deltaY = (e.clientY - centerY) * CONFIG.MAGNETIC_STRENGTH;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0, 0)';
      });
    });
  }
}

// ============================================
// SCORING SYSTEM
// ============================================

function calculateMaturityScore() {
  let score = 0;
  
  // Question 1: Intent
  if (state.answers.q1 === 'useCase') score += 3;
  if (state.answers.q1 === 'workflowBreak') score += 2;
  if (state.answers.q1 === 'experiment') score += 1;
  
  // Question 2: Validation
  if (state.answers.q2 === 'outcome') score += 3;
  if (state.answers.q2 === 'human') score += 2;
  if (state.answers.q2 === 'spot') score += 1;
  
  // Question 3: Complexity
  if (state.answers.q3 === 'adaptiveRoles') score += 3;
  if (state.answers.q3 === 'roles') score += 2;
  if (state.answers.q3 === 'oneAgentTools') score += 1;
  
  // Question 4: ROI
  if (state.answers.q4 === 'triple') score += 3;
  if (state.answers.q4 === 'adoptionOnly') score += 2;
  if (state.answers.q4 === 'feelsFaster') score += 1;
  
  // Question 5: Scale
  if (state.answers.q5 === 'framework') score += 3;
  if (state.answers.q5 === 'copyPaste') score += 1;
  
  return score; // Max: 15
}

function getSnapshotFromScore(score) {
  if (score >= 12) return MATURITY_SNAPSHOTS[2]; // System Mode
  if (score >= 7) return MATURITY_SNAPSHOTS[1];  // Pilot Purgatory
  return MATURITY_SNAPSHOTS[0];                   // Demo Gremlins
}

// ============================================
// UI UPDATES
// ============================================

function updateProgress() {
  const answeredCount = Object.values(state.answers).filter(Boolean).length;
  const percentage = Math.round((answeredCount / CONFIG.TOTAL_QUESTIONS) * 100);
  
  const fill = $('#progressFill');
  const label = $('#progressLabel');
  
  if (fill) fill.style.width = `${percentage}%`;
  if (label) label.textContent = `${percentage}%`;
}

function updateResults() {
  const answeredCount = Object.values(state.answers).filter(Boolean).length;
  const isComplete = answeredCount === CONFIG.TOTAL_QUESTIONS;
  
  document.body.classList.toggle('incomplete', !isComplete);
  
  const titleEl = $('#resultTitle');
  const subtitleEl = $('#resultSubtitle');
  const pillsEl = $('#resultPills');
  const moveEl = $('#resultMove');
  
  if (!isComplete) {
    if (titleEl) titleEl.textContent = "Finish the 5 clicks.";
    if (subtitleEl) subtitleEl.textContent = "Then you'll get a maturity snapshot + the cleanest next move.";
    if (pillsEl) pillsEl.innerHTML = "";
    if (moveEl) moveEl.innerHTML = "Your agent can't mature on vibes alone. (It can try. It will fail.)";
    return;
  }
  
  const score = calculateMaturityScore();
  const snapshot = getSnapshotFromScore(score);
  
  if (titleEl) titleEl.textContent = snapshot.title;
  if (subtitleEl) subtitleEl.textContent = snapshot.subtitle;
  
  if (pillsEl) {
    pillsEl.innerHTML = snapshot.pills.map((pill, i) => 
      `<span class="result-pill ${i === 0 ? 'hot' : ''}">${pill}</span>`
    ).join('');
  }
  
  if (moveEl) {
    moveEl.innerHTML = snapshot.nextMove + 
      `<div style="margin-top: 16px; opacity: 0.8; font-size: 15px;">
        Want a fast second opinion? Book 15 minutes. I'll map your answers to a mature plan and show how to unlock more ROI.
      </div>`;
  }
  
  // Update URL
  const url = new URL(window.location.href);
  url.searchParams.set('s', snapshot.id);
  history.replaceState({}, '', url.toString());
  
  // Animate results reveal
  setTimeout(() => {
    const resultCards = $$('.result-quantum .needs-complete');
    resultCards.forEach((card, i) => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      setTimeout(() => {
        card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
      }, i * 100);
    });
  }, 100);
}

function loadFromUrl() {
  const url = new URL(window.location.href);
  const snapshotId = url.searchParams.get('s');
  
  if (!snapshotId) return;
  
  const snapshot = MATURITY_SNAPSHOTS.find(s => s.id === snapshotId);
  if (!snapshot) return;
  
  const titleEl = $('#resultTitle');
  const subtitleEl = $('#resultSubtitle');
  const pillsEl = $('#resultPills');
  const moveEl = $('#resultMove');
  
  if (titleEl) titleEl.textContent = snapshot.title;
  if (subtitleEl) subtitleEl.textContent = snapshot.subtitle;
  
  if (pillsEl) {
    pillsEl.innerHTML = snapshot.pills.map((pill, i) => 
      `<span class="result-pill ${i === 0 ? 'hot' : ''}">${pill}</span>`
    ).join('');
  }
  
  if (moveEl) {
    moveEl.innerHTML = snapshot.nextMove + 
      `<div style="margin-top: 16px; opacity: 0.8; font-size: 15px;">
        Want a fast second opinion? Book 15 minutes. I'll map your answers to a mature plan and show how to unlock more ROI.
      </div>`;
  }
}

// ============================================
// INTERACTIONS
// ============================================

function selectAnswer(question, answer) {
  state.answers[question] = answer;
  
  // Update UI
  $$('.choice-card').forEach(card => {
    if (card.dataset.q === question) {
      card.classList.toggle('selected', card.dataset.a === answer);
    }
  });
  
  updateProgress();
  updateResults();
  
  // Auto-scroll to next section
  const nextMap = {
    q1: 'q2',
    q2: 'q3',
    q3: 'q4',
    q4: 'q5',
    q5: 'result'
  };
  
  const nextPanel = nextMap[question];
  if (nextPanel) {
    setTimeout(() => scrollToSection(nextPanel), 300);
  }
}

function scrollToSection(sectionId) {
  const section = $(`#${sectionId}`);
  if (!section) return;
  
  section.scrollIntoView({
    behavior: 'smooth',
    block: 'start'
  });
}

function restart() {
  // Reset state
  state.answers = {
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null
  };
  
  // Reset UI
  $$('.choice-card').forEach(card => {
    card.classList.remove('selected');
  });
  
  // Clear URL
  const url = new URL(window.location.href);
  url.searchParams.delete('s');
  history.replaceState({}, '', url.toString());
  
  updateProgress();
  updateResults();
  scrollToSection('hero');
}

// ============================================
// SCROLL ANIMATIONS
// ============================================

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -100px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
      }
    });
  }, observerOptions);
  
  $$('.quantum-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(40px)';
    section.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
    observer.observe(section);
  });
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
  // Start button
  const startBtn = $('#startBtn');
  if (startBtn) {
    startBtn.addEventListener('click', () => scrollToSection('q1'));
  }
  
  // Restart button
  const restartBtn = $('#restartBtn');
  if (restartBtn) {
    restartBtn.addEventListener('click', restart);
  }
  
  // Brand restart
  const brandRestart = $('#brandRestart');
  if (brandRestart) {
    brandRestart.addEventListener('click', restart);
    brandRestart.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') restart();
    });
  }
  
  // Choice cards
  $$('.choice-card').forEach(card => {
    card.addEventListener('click', () => {
      const question = card.dataset.q;
      const answer = card.dataset.a;
      if (question && answer) {
        selectAnswer(question, answer);
      }
    });
  });
  
  // Set year in footer
  const yearEl = $('#year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

// ============================================
// PARALLAX EFFECTS
// ============================================

function initParallax() {
  let ticking = false;
  
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.pageYOffset;
        
        // Parallax hero cards
        $$('.float-card').forEach((card, i) => {
          const speed = 0.5 + (i * 0.1);
          card.style.transform = `translateY(${scrolled * speed * 0.1}px)`;
        });
        
        ticking = false;
      });
      
      ticking = true;
    }
  });
}

// ============================================
// INITIALIZATION
// ============================================

function init() {
  console.log('🚀 Initializing Quantum AI Maturity Assessment...');
  
  // Initialize particle system
  const canvas = $('#particles');
  if (canvas) {
    new ParticleSystem(canvas);
  }
  
  // Initialize custom cursor (desktop only)
  if (window.innerWidth > 768) {
    new CustomCursor();
    new MagneticElements();
  }
  
  // Initialize interactions
  initEventListeners();
  initScrollAnimations();
  initParallax();
  
  // Load initial state
  updateProgress();
  loadFromUrl();
  updateResults();
  
  console.log('✨ Quantum experience ready');
}

// Start when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Handle window resize
let resizeTimeout;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    // Re-initialize magnetic elements on resize
    if (window.innerWidth > 768) {
      new MagneticElements();
    }
  }, 250);
});

// Prevent scroll during page load
window.addEventListener('load', () => {
  document.body.style.overflow = 'visible';
});
