// ============================
// Navbar & Mobile Menu
// ============================
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');
const overlay = document.getElementById('overlay');

window.addEventListener('scroll', () => {
  if (window.innerWidth > 900) {
    navbar.classList.toggle('scrolled', window.scrollY > 100);
  } else {
    navbar.classList.remove('scrolled');
  }
});

hamburger?.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('active');
  overlay.classList.toggle('active');
});

overlay?.addEventListener('click', () => {
  hamburger.classList.remove('active');
  mobileMenu.classList.remove('active');
  overlay.classList.remove('active');
});

document.querySelectorAll('.mobile-nav-circle a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('active');
    overlay.classList.remove('active');
  });
});

// ============================
// Hero Beams Animation
// ============================
const beamsContainer = document.querySelector('.hero .beams');
const beamLines = [220, 440, 1100, 1320];
const lastUsed = {};
const minDelay = 2000;
const beamColors = ["#5C3DF3", "#DD0D49"];

function createBeam() {
  const available = beamLines.filter(line => !lastUsed[line] || (Date.now() - lastUsed[line]) > minDelay);
  if (!available.length) return;

  const left = available[Math.floor(Math.random() * available.length)];
  lastUsed[left] = Date.now();

  const beam = document.createElement('div');
  beam.classList.add('beam');
  beam.style.left = left + 'px';
  const color = beamColors[Math.floor(Math.random() * beamColors.length)];
  beam.style.background = `linear-gradient(to bottom, ${color}, ${color}, transparent)`;
  const duration = 2500 + Math.random() * 2000;
  beam.style.animationDuration = duration + 'ms';
  beamsContainer?.appendChild(beam);
  beam.addEventListener('animationend', () => beam.remove());
}

setInterval(() => { if (Math.random() < 0.5) createBeam(); }, 800);







// ============================
// Daily Incremental Counters (Production)
// ============================

const DAY_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

const counters = {
  ai: {
    el: document.getElementById('live-counter'),
    key: 'aiCounter',
    start: 100,
    dailyIncrement: 50
  },
  dev: {
    el: document.querySelector('.stats .stat:nth-child(2) .stat-number'),
    key: 'devCounter',
    start: 50,
    dailyIncrement: 20
  }
};

// Initialize counters
function initializeCounter(counter) {
  const now = Date.now();

  let savedValue = localStorage.getItem(counter.key);
  let savedTimestamp = localStorage.getItem(counter.key + '_timestamp');
  let savedIncremented = localStorage.getItem(counter.key + '_incremented');

  let currentValue = savedValue ? parseInt(savedValue) : counter.start;
  const lastUpdateDate = savedTimestamp ? new Date(parseInt(savedTimestamp)).toDateString() : null;
  const currentDate = new Date(now).toDateString();
  const alreadyIncremented = savedIncremented === currentDate;

  // Display initial value
  updateDisplay(counter, currentValue);

  // Increment only if not incremented today
  if (!alreadyIncremented) {
    const targetValue = currentValue + counter.dailyIncrement;

    // Mark increment for today
    localStorage.setItem(counter.key + '_timestamp', now.toString());
    localStorage.setItem(counter.key + '_incremented', currentDate);

    // Gradual increment throughout the day
    startDailyIncrement(counter, currentValue, targetValue);
  }
}

// Gradual increment function
function startDailyIncrement(counter, startValue, targetValue) {
  const increments = targetValue - startValue;
  if (increments <= 0) return;

  const baseInterval = DAY_DURATION / increments;
  let current = startValue;

  function step() {
    current++;
    localStorage.setItem(counter.key, current.toString());
    updateDisplay(counter, current);

    if (current < targetValue) {
      const randomVariation = baseInterval * (0.7 + Math.random() * 0.6);
      setTimeout(step, randomVariation);
    }
  }

  step();
}

// Update the display
function updateDisplay(counter, value) {
  if (counter.el) counter.el.textContent = value.toLocaleString();
}

// Initialize all counters on page load
document.addEventListener('DOMContentLoaded', function () {
  initializeCounter(counters.ai);
  initializeCounter(counters.dev);
});










// ============================
// Early Access — Full Working JS with Duplicate Email Handling
// ============================
document.addEventListener("DOMContentLoaded", () => {
  const earlyBtn = document.getElementById('early-access-btn');
  const earlyModal = document.getElementById('early-access-modal');
  const earlyForm = document.getElementById('early-form');
  const nameInput = document.getElementById('ea-name');
  const emailInput = document.getElementById('ea-email');
  const roleInput = document.getElementById('ea-role');
  const earlyCancel = document.getElementById('ea-cancel');
  const waitlistBox = document.getElementById('waitlist-box');

  if (!earlyForm) return;

  const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,10}$/;

  function isValidEmail(v) { return v?.trim() && EMAIL_RE.test(v.trim()); }
  function isValidName(v) { return v?.trim()?.length >= 2; }
  function isValidRole(v) { return !v || v.trim().length <= 80; }
  function escapeHtml(s) { return String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }

  function showFieldError(input, msg) {
    clearFieldError(input);
    const err = document.createElement('div');
    err.className = 'field-error';
    err.setAttribute('role', 'alert');
    err.style.cssText = 'color:#ff6b6b;font-size:0.9rem;margin-top:6px;';
    err.textContent = msg;
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    input.parentNode.insertBefore(err, input.nextSibling);
  }

  function clearFieldError(input) {
    if (!input) return;
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    const next = input.nextSibling;
    if (next?.classList?.contains('field-error')) next.remove();
  }

  function clearAllErrors() {
    [nameInput, emailInput, roleInput].forEach(clearFieldError);
    const formError = earlyForm.querySelector('.form-error');
    if (formError) formError.remove();
    const successAlert = earlyForm.querySelector('.form-success');
    if (successAlert) successAlert.remove();
    if (waitlistBox) waitlistBox.innerHTML = '';
  }

  function showFormError(msg) {
    let el = earlyForm.querySelector('.form-error');
    if (!el) {
      el = document.createElement('div');
      el.className = 'form-error';
      el.setAttribute('role', 'alert');
      el.style.cssText = 'background:#3a1e1e;color:#ffdcdc;padding:10px;border-radius:6px;margin-bottom:12px;font-size:0.95rem;';
      earlyForm.prepend(el);
    }
    el.textContent = msg;
  }

  function showSuccessAlert(msg) {
    let el = earlyForm.querySelector('.form-success');
    if (!el) {
      el = document.createElement('div');
      el.className = 'form-success';
      el.setAttribute('role', 'status');
      el.style.cssText = 'background:#d4edda;color:#155724;padding:10px;border-radius:6px;margin-bottom:12px;font-size:0.95rem;';
      earlyForm.prepend(el);
    }
    el.textContent = msg;
  }

  function showSuccessMessage(msg, name, email, position) {
    if (waitlistBox) {
      waitlistBox.innerHTML = `
        <div style="display:flex;gap:10px;align-items:flex-start;">
          <div style="font-size:2rem">✅</div>
          <div>
            <div style="font-weight:600;font-size:1rem">${escapeHtml(msg)}</div>
            <div style="color:#bdbdbd;margin-top:4px">Welcome ${escapeHtml(name)} (${escapeHtml(email)})</div>
            ${position ? `<div style="margin-top:4px;color:#28a745">Your waitlist position: #${String(position)}</div>` : ''}
          </div>
        </div>
      `;
    }
    showSuccessAlert(msg);
  }

  function focusFirstInvalid() {
    if (!isValidName(nameInput.value)) { nameInput.focus(); return; }
    if (!isValidEmail(emailInput.value)) { emailInput.focus(); return; }
    if (!isValidRole(roleInput.value)) { roleInput.focus(); return; }
  }

  function updateSubmitState() {
    submitBtn.disabled = !(isValidName(nameInput.value) && isValidEmail(emailInput.value) && isValidRole(roleInput.value));
  }

  [nameInput, emailInput, roleInput].forEach(input => {
    input.addEventListener('input', () => {
      clearFieldError(input);
      updateSubmitState();
    });
    input.addEventListener('blur', () => {
      if (input === nameInput && input.value && !isValidName(input.value)) showFieldError(input, 'Enter a valid name (at least 2 letters)');
      if (input === emailInput && input.value && !isValidEmail(input.value)) showFieldError(input, 'Enter a valid email (example: you@example.com)');
    });
  });

  function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  earlyBtn?.addEventListener('click', () => openModal(earlyModal));
  earlyCancel?.addEventListener('click', () => closeModal(earlyModal));
  earlyModal?.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-backdrop')) closeModal(earlyModal);
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal(earlyModal);
  });

  const submitBtn = earlyForm.querySelector('button[type="submit"]');

  earlyForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    clearAllErrors();

    const name = nameInput.value.trim();
    const email = emailInput.value.trim();
    const role = roleInput.value.trim();

    let hadError = false;
    if (!isValidName(name)) { showFieldError(nameInput, 'Please enter your name'); hadError = true; }
    if (!isValidEmail(email)) { showFieldError(emailInput, 'Please enter a valid email'); hadError = true; }
    if (!isValidRole(role)) { showFieldError(roleInput, 'Role must be under 80 characters'); hadError = true; }
    if (hadError) { showFormError('Please fix the highlighted fields'); focusFirstInvalid(); return; }

    submitBtn.disabled = true;
    submitBtn.innerHTML = 'Joining… ⏳';

    const endpoint = "http://15.206.125.43:8005/waitlist";
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ name, email, role }),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      const json = await res.json().catch(() => ({}));

      if (res.ok) {
        const message = json.message || 'You have joined the waitlist!';
        const position = json.position || json.waitlist_position || json.rank || null;
        showSuccessMessage(message, name, email, position);
        return;
      }

      // ---------- Error handling ----------
      if (res.status === 400) {
        showFormError(json.message || 'Invalid request. Please check your input.');
      } else if (res.status === 409 || /already/i.test(json.message || '')) {
        const msg = 'You already joined the waitlist with this email.';
        showFieldError(emailInput, msg);
        showFormError(msg);
      } else if (res.status === 422 && Array.isArray(json.detail)) {
        json.detail.forEach(d => {
          const msg = d.msg || d.message || 'Invalid input';
          if (/email/i.test(d.loc?.[1])) showFieldError(emailInput, msg);
          else if (/name/i.test(d.loc?.[1])) showFieldError(nameInput, msg);
          else if (/role/i.test(d.loc?.[1])) showFieldError(roleInput, msg);
        });
        showFormError('Please fix the highlighted fields and try again.');
      } else if (res.status === 429) {
        showFormError('Too many requests. Please wait a moment and try again.');
      } else if (res.status >= 500) {
        showFormError('Server error. Please try again later.');
      } else {
        showFormError(json.message || `Unexpected error (status ${res.status})`);
      }

    } catch (err) {
      if (err.name === 'AbortError') showFormError('Server timed out. Please try again.');
      else showFormError('Network error. Please check your connection and try again.');
      console.error(err);
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = 'Join Waitlist';
      updateSubmitState();
    }
  });

  updateSubmitState();
});










document.addEventListener('DOMContentLoaded', function () {
  // Video AI animation - object detection boxes
  const detectionBoxes = document.querySelectorAll('.detection-box');
  detectionBoxes.forEach((box, index) => {
    box.style.animationDelay = `${index * 0.5}s`;
  });

  // Chat simulation for Text AI
  const chatMessages = document.querySelector('.chat-messages');
  const typingIndicator = document.querySelector('.typing-indicator');

  // Simulate conversation
  setTimeout(() => {
    typingIndicator.style.display = 'none';
    const newMessage = document.createElement('div');
    newMessage.className = 'message ai-message';
    newMessage.textContent = "I'm constantly learning to serve you better!";
    chatMessages.appendChild(newMessage);
  }, 3000);
});









// ============================
// State & Elements
// ============================
const state = {
  challengeScore: 0,
  challengeStreak: 0,
  totalChallenges: 0,
  lastPointsEarned: 0,
  achievements: {},
  challengeCategory: "creative",
  challengeResult: "",
  username: "You"
};

const elements = {
  challengeScore: document.getElementById("challenge-score"),
  challengeStreak: document.getElementById("challenge-streak"),
  challengePrompt: document.getElementById("challenge-prompt"),
  challengeSubmit: document.getElementById("challenge-submit"),
  responseText: document.getElementById("response-text"),
  shareBtn: document.getElementById("share-btn"),
  shareModal: document.getElementById("share-modal"),
  closeShareModal: document.getElementById("close-share-modal"),
  shareScore: document.getElementById("share-score"),
  shareStreak: document.getElementById("share-streak"),
  shareCategory: document.getElementById("share-category"),
  categoryDescription: document.getElementById("category-description"),
  categoryButtons: document.querySelectorAll(".category-btn")
};

// Error box
let errorBox = document.getElementById("error-box");
if (!errorBox) {
  errorBox = document.createElement("div");
  errorBox.id = "error-box";
  errorBox.style.cssText = `
        margin-top: 10px;
        padding: 12px;
        border: 1px solid #ff6b6b;
        background: #ffecec;
        color: #a70000;
        border-radius: 8px;
        font-size: 0.95rem;
        display: none;
    `;
  elements.responseText?.parentElement?.appendChild(errorBox);
}

// ============================
// Helper Functions
// ============================
function escapeHtml(str) {
  return str
    ? str.replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
    : "";
}

function formatTextToHTML(raw) {
  if (!raw) return "<p><em>No response</em></p>";
  return escapeHtml(raw)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .split(/\n+/)
    .map(line => `<p>${line}</p>`)
    .join("");
}

function showErrorUI(message, details = "") {
  errorBox.innerHTML = `<div style="display:flex;align-items:flex-start;gap:8px;">
        <span style="font-size:1.2rem;">⚠️</span>
        <div>
            <strong>Error:</strong> ${escapeHtml(message)}
            ${details ? `<div style="margin-top:4px;font-size:0.85rem;color:#550000;">${escapeHtml(details)}</div>` : ""}
        </div>
    </div>`;
  errorBox.style.display = "block";
}

function hideErrorUI() {
  errorBox.style.display = "none";
}

// ============================
// Update UI Functions
// ============================
function updateUI() {
  if (elements.challengeScore) elements.challengeScore.textContent = state.challengeScore;
  if (elements.challengeStreak) elements.challengeStreak.textContent = state.challengeStreak;
  updateAchievementsUI();
  updateLeaderboardUI();
  updateShareButton();
}

function updateShareButton() {
  if (elements.shareBtn) {
    if (state.challengeScore > 0) {
      elements.shareBtn.disabled = false;
      elements.shareBtn.style.opacity = "1";
      elements.shareBtn.style.cursor = "pointer";
      elements.shareBtn.title = "Share your achievement!";
    } else {
      elements.shareBtn.disabled = true;
      elements.shareBtn.style.opacity = "0.6";
      elements.shareBtn.style.cursor = "not-allowed";
      elements.shareBtn.title = "Complete a challenge first";
    }
  }
}

function updateAchievementsUI() {
  const container = document.querySelector(".achievements-grid");
  if (!container) return;

  const items = container.querySelectorAll(".achievement-item");
  items.forEach(item => {
    const name = item.querySelector(".achievement-name")?.textContent.trim();
    if (state.achievements[name]) {
      item.style.opacity = "1";
      item.style.borderColor = "#5C3DF3";
      item.style.background = "rgba(92, 61, 243, 0.2)";
    } else {
      item.style.opacity = "0.4";
      item.style.borderColor = "rgba(255,255,255,0.1)";
      item.style.background = "#1f1f1f";
    }
  });
}

// ============================
// API Communication
// ============================
async function handleChallengeSubmit() {
  const challengeText = elements.challengePrompt?.value?.trim();
  if (!challengeText) {
    showErrorUI("Please enter a challenge!");
    return;
  }

  elements.challengeSubmit.disabled = true;
  elements.responseText.innerHTML = "<p><em>Thinking... 🤔</em></p>";
  hideErrorUI();

  const controller = new AbortController();
  const timeoutMs = 15000;
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const res = await fetch("http://15.206.125.43:8005/challenge", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        category: state.challengeCategory,
        challenge_text: challengeText
      }),
      signal: controller.signal
    });

    clearTimeout(timer);

    const contentType = res.headers.get("content-type") || "";
    if (!res.ok) {
      const errorText = contentType.includes("application/json")
        ? (await res.json()).detail?.[0]?.msg
        : await res.text();
      throw new Error(errorText || `Server error ${res.status}`);
    }

    const data = contentType.includes("application/json")
      ? await res.json()
      : { ai_response: await res.text() };

    processAPIResult(data, challengeText);

  } catch (err) {
    if (err.name === "AbortError") {
      showErrorUI("Request timed out", `Server did not respond within ${timeoutMs / 1000}s`);
    } else {
      showErrorUI(err.message || "Unknown error", "Please try again later.");
    }
    elements.responseText.innerHTML = "";
  } finally {
    elements.challengeSubmit.disabled = false;
    if (elements.challengePrompt) elements.challengePrompt.value = "";
  }
}

function processAPIResult(data, challengeText = "") {
  hideErrorUI();
  const ai_raw = data.ai_response ?? "";
  state.challengeResult = ai_raw;

  if (elements.responseText) {
    elements.responseText.innerHTML = `<div class="ai-response">${formatTextToHTML(ai_raw)}</div>`;
  }

  // Gamification
  const points = Math.floor(Math.random() * 50) + 10;
  const streakIncrease = points >= 25 ? 1 : 0;

  state.challengeScore += points;
  state.challengeStreak = streakIncrease ? state.challengeStreak + 1 : 0;
  state.lastPointsEarned = points;
  state.totalChallenges += 1;

  // Unlock achievements
  if (state.challengeScore >= 500) state.achievements["500 Points"] = true;
  if (state.challengeStreak >= 3) state.achievements["3-Day Streak"] = true;
  if (state.totalChallenges === 1) state.achievements["First Challenge"] = true;
  if (state.challengeScore >= 1000) state.achievements["Top 10"] = true;

  updateUI();
  updateShareModalStats();
}

// ============================
// Data Fetching
// ============================
async function fetchUserStats() {
  try {
    const res = await fetch("http://15.206.125.43:8005/user-stats");
    if (!res.ok) throw new Error("Failed to fetch user stats");
    const data = await res.json();
    state.challengeScore = data.score ?? 0;
    state.challengeStreak = data.streak ?? 0;
    state.totalChallenges = data.total_challenges ?? 0;
    state.username = data.username ?? "You";
    updateUI();
  } catch (err) {
    console.error("User stats fetch error:", err.message);
  }
}

async function fetchAchievements() {
  try {
    const res = await fetch("http://15.206.125.43:8005/achievements");
    if (!res.ok) throw new Error("Failed to fetch achievements");
    const data = await res.json();
    state.achievements = data;
    updateAchievementsUI();
  } catch (err) {
    console.error("Achievements fetch error:", err.message);
  }
}

async function fetchLeaderboard() {
  const container = document.querySelector(".leaderboard-list");
  if (!container) return;

  try {
    const res = await fetch("http://15.206.125.43:8005/leaderboard");
    if (!res.ok) throw new Error("Failed to fetch leaderboard");
    const data = await res.json();

    const userIncluded = data.some(u => u.username === state.username);
    if (!userIncluded) {
      data.push({ username: state.username, points: state.challengeScore });
    }

    data.sort((a, b) => b.points - a.points);

    container.innerHTML = "";
    data.forEach((entry, index) => {
      const div = document.createElement("div");
      div.classList.add("leaderboard-item");
      if (entry.username === state.username) div.classList.add("user-item");

      const medal = index < 3 ? ["🥇", "🥈", "🥉"][index] : "";
      div.innerHTML = `<span>${medal} ${entry.username}</span>
                           <span>${entry.points} pts</span>`;
      container.appendChild(div);
    });

  } catch (err) {
    console.error("Leaderboard error:", err.message);
    container.innerHTML = `<div style="color:#ff6b6b; padding: 0.5rem;">⚠️ Error loading leaderboard</div>`;
  }
}

function updateLeaderboardUI() {
  fetchLeaderboard();
}

// ============================
// Share Modal Functionality
// ============================
function updateShareModalStats() {
  if (elements.shareScore) elements.shareScore.textContent = state.challengeScore;
  if (elements.shareStreak) elements.shareStreak.textContent = state.challengeStreak;
  if (elements.shareCategory) {
    elements.shareCategory.textContent = state.challengeCategory.charAt(0).toUpperCase() +
      state.challengeCategory.slice(1);
  }
}

function updateMetaTags() {
  const title = `AI Challenge Arena - ${state.challengeScore} Points!`;
  const description = `I scored ${state.challengeScore} points with a ${state.challengeStreak}-day streak in ${state.challengeCategory} challenges!`;
  const url = window.location.href;
  const imageUrl = "http://127.0.0.1:5500/img/backimg.png";

  // Update or create Open Graph tags
  let ogTitle = document.querySelector('meta[property="og:title"]');
  if (!ogTitle) {
    ogTitle = document.createElement('meta');
    ogTitle.setAttribute('property', 'og:title');
    document.head.appendChild(ogTitle);
  }
  ogTitle.setAttribute('content', title);

  let ogDescription = document.querySelector('meta[property="og:description"]');
  if (!ogDescription) {
    ogDescription = document.createElement('meta');
    ogDescription.setAttribute('property', 'og:description');
    document.head.appendChild(ogDescription);
  }
  ogDescription.setAttribute('content', description);

  let ogImage = document.querySelector('meta[property="og:image"]');
  if (!ogImage) {
    ogImage = document.createElement('meta');
    ogImage.setAttribute('property', 'og:image');
    document.head.appendChild(ogImage);
  }
  ogImage.setAttribute('content', imageUrl);

  let ogUrl = document.querySelector('meta[property="og:url"]');
  if (!ogUrl) {
    ogUrl = document.createElement('meta');
    ogUrl.setAttribute('property', 'og:url');
    document.head.appendChild(ogUrl);
  }
  ogUrl.setAttribute('content', url);

  // Update Twitter Card tags
  let twitterTitle = document.querySelector('meta[name="twitter:title"]');
  if (!twitterTitle) {
    twitterTitle = document.createElement('meta');
    twitterTitle.setAttribute('name', 'twitter:title');
    document.head.appendChild(twitterTitle);
  }
  twitterTitle.setAttribute('content', title);

  let twitterDescription = document.querySelector('meta[name="twitter:description"]');
  if (!twitterDescription) {
    twitterDescription = document.createElement('meta');
    twitterDescription.setAttribute('name', 'twitter:description');
    document.head.appendChild(twitterDescription);
  }
  twitterDescription.setAttribute('content', description);

  let twitterImage = document.querySelector('meta[name="twitter:image"]');
  if (!twitterImage) {
    twitterImage = document.createElement('meta');
    twitterImage.setAttribute('name', 'twitter:image');
    document.head.appendChild(twitterImage);
  }
  twitterImage.setAttribute('content', imageUrl);
}

function getShareData(platform) {
  const baseUrl = window.location.href;
  const score = state.challengeScore;
  const streak = state.challengeStreak;
  const category = state.challengeCategory.charAt(0).toUpperCase() + state.challengeCategory.slice(1);

  switch (platform) {
    case 'twitter':
      return {
        text: `🎯 I scored ${score} points in the AI Challenge Arena! 🔥 ${streak}-day streak | ${category} category\n\nCan you beat me?`,
        url: baseUrl,
        hashtags: 'AIChallenge,ArtificialIntelligence'
      };

    case 'facebook':
      return {
        text: `I scored ${score} points with a ${streak}-day streak in the ${category} category at AI Challenge Arena!`,
        url: baseUrl
      };

    case 'linkedin':
      return {
        text: `Achieved ${score} points in the AI Challenge Arena! ${streak}-day streak in ${category} challenges.`,
        url: baseUrl
      };

    case 'whatsapp':
      return {
        text: `Check out my AI Challenge Arena score: ${score} points with a ${streak}-day streak in ${category}!`,
        url: baseUrl
      };

    default:
      return {
        text: `AI Challenge Arena: ${score} points, ${streak}-day streak, ${category} category`,
        url: baseUrl
      };
  }
}

function shareToPlatform(platform) {
  updateMetaTags();
  const shareData = getShareData(platform);

  switch (platform) {
    case 'twitter':
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(shareData.url)}&hashtags=${encodeURIComponent(shareData.hashtags)}`;
      window.open(twitterUrl, '_blank', 'width=600,height=400');
      break;

    case 'facebook':
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareData.url)}&quote=${encodeURIComponent(shareData.text)}`;
      window.open(facebookUrl, '_blank', 'width=600,height=400');
      break;

    case 'linkedin':
      const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareData.url)}`;
      window.open(linkedinUrl, '_blank', 'width=600,height=400');
      break;

    case 'whatsapp':
      const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(shareData.text + ' ' + shareData.url)}`;
      window.open(whatsappUrl, '_blank', 'width=600,height=400');
      break;

    case 'copy':
      const fullText = `${shareData.text}\n\n${shareData.url}`;
      navigator.clipboard.writeText(fullText).then(() => {
        showCopyFeedback();
      });
      break;

    case 'native':
      if (navigator.share) {
        navigator.share({
          title: `AI Challenge Score: ${state.challengeScore} Points`,
          text: shareData.text,
          url: shareData.url,
        }).catch((error) => {
          console.log('Share cancelled:', error);
        });
      }
      break;
  }
}

function showCopyFeedback() {
  const copyBtn = document.querySelector('.platform-btn[data-platform="copy"]');
  if (!copyBtn) return;

  const originalHTML = copyBtn.innerHTML;
  const originalBg = copyBtn.style.background;

  copyBtn.innerHTML = '<i class="fas fa-check"></i> Copied!';
  copyBtn.style.background = "#4CAF50";
  copyBtn.disabled = true;

  setTimeout(() => {
    copyBtn.innerHTML = originalHTML;
    copyBtn.style.background = originalBg;
    copyBtn.disabled = false;
  }, 2000);
}

// ============================
// Event Listeners & Initialization
// ============================
function initEventListeners() {
  // Category buttons
  elements.categoryButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      elements.categoryButtons.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      state.challengeCategory = btn.dataset.category;
      if (elements.categoryDescription) {
        elements.categoryDescription.textContent = `Test our AI with ${state.challengeCategory} challenges`;
      }
    });
  });

  // Challenge submit
  if (elements.challengeSubmit) {
    elements.challengeSubmit.addEventListener("click", handleChallengeSubmit);
  }

  // Share modal
  if (elements.shareBtn) {
    elements.shareBtn.addEventListener("click", () => {
      if (state.challengeScore > 0) {
        updateShareModalStats();
        elements.shareModal.classList.add("active");
      }
    });
  }

  // Close modal
  if (elements.closeShareModal) {
    elements.closeShareModal.addEventListener("click", () => {
      elements.shareModal.classList.remove("active");
    });
  }

  // Close modal when clicking outside
  if (elements.shareModal) {
    elements.shareModal.addEventListener("click", (e) => {
      if (e.target === elements.shareModal) {
        elements.shareModal.classList.remove("active");
      }
    });
  }

  // Platform share buttons
  document.querySelectorAll(".platform-btn").forEach(btn => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const platform = btn.dataset.platform;
      shareToPlatform(platform);
    });
  });

  // Add native share button if supported
  if (navigator.share && !document.querySelector('.platform-btn[data-platform="native"]')) {
    const sharePlatforms = document.querySelector('.share-platforms');
    if (sharePlatforms) {
      const nativeBtn = document.createElement('button');
      nativeBtn.className = 'platform-btn';
      nativeBtn.setAttribute('data-platform', 'native');
      nativeBtn.innerHTML = '<i class="fas fa-share-alt"></i> Native Share';
      nativeBtn.style.background = '#FF6B35';
      sharePlatforms.appendChild(nativeBtn);

      nativeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        shareToPlatform('native');
      });
    }
  }

  // Enter key to submit challenge
  if (elements.challengePrompt) {
    elements.challengePrompt.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleChallengeSubmit();
      }
    });
  }
}

// ============================
// Initialize Application
// ============================
function initArena() {
  initEventListeners();
  fetchUserStats().then(() => {
    fetchLeaderboard();
    fetchAchievements();
    updateUI();
  });

  // Initialize with creative category
  if (elements.categoryDescription) {
    elements.categoryDescription.textContent = "Test our AI with creative challenges";
  }
}

// Start the application when DOM is loaded
document.addEventListener("DOMContentLoaded", initArena);

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    state,
    elements,
    handleChallengeSubmit,
    shareToPlatform,
    initArena
  };
}







document.addEventListener("DOMContentLoaded", function () {
  const chatInput = document.getElementById("chat-input");
  const sendButton = document.getElementById("send-button");
  const messagesContainer = document.getElementById("messages");

  if (!chatInput || !sendButton || !messagesContainer) {
    console.warn("⚠️ Chat elements not found in DOM.");
    return;
  }

  const chatHistory = [];

  function formatTime(date) {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }

  function addMessage(type, message) {
    chatHistory.push({ type, message, time: new Date() });
    updateChatDisplay();
  }

  function updateChatDisplay() {
    messagesContainer.innerHTML = "";
    chatHistory.forEach((chat) => {
      const msgDiv = document.createElement("div");
      msgDiv.className = `message ${chat.type}-message`;

      // ✅ Only bot has an avatar (clean professional UI)
      if (chat.type === "ai") {
        const avatar = document.createElement("span");
        avatar.className = "avatar";
        avatar.innerHTML = `<i class="fas fa-robot"></i>`;
        msgDiv.appendChild(avatar);
      }

      const text = document.createElement("span");
      text.className = "message-text";
      text.textContent = chat.message;

      const timeSpan = document.createElement("span");
      timeSpan.className = "message-time";
      timeSpan.textContent = formatTime(chat.time);

      msgDiv.appendChild(text);
      msgDiv.appendChild(timeSpan);
      messagesContainer.appendChild(msgDiv);
    });
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  }

  // ✅ Professional validation messages
  function validateMessage(message) {
    if (!message || message.trim() === "") {
      return "I didn’t receive any input. Please type your message to continue.";
    }
    if (message.trim().length < 2) {
      return "Your message is too short. Could you provide more details?";
    }
    if (message.trim().length > 500) {
      return "Your message is too long. Please keep it under 500 characters.";
    }
    if (/^[^a-zA-Z0-9]+$/.test(message)) {
      return "It looks like your message only contains symbols. Please use words or sentences.";
    }
    return null;
  }

  // ✅ API Call with polished error responses
  async function sendMessageToAPI(message) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 8000); // ⏳ 8s timeout

      const response = await fetch("http://15.206.125.43:8005/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: message }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (!response.ok) {
        if (response.status === 422) {
          return "I wasn’t able to process your request. Please rephrase your message.";
        }
        if (response.status >= 500) {
          return "The server is currently unavailable. Please try again in a moment.";
        }
        throw new Error("API error " + response.status);
      }

      const data = await response.json();
      if (!data || !data.answer) {
        return "I didn’t receive a valid response. Could you try again?";
      }

      return data.answer;
    } catch (error) {
      console.error("❌ API Error:", error);
      if (error.name === "AbortError") {
        return "The request is taking too long. Please try again.";
      }
      return "Something went wrong while processing your request. Please try again later.";
    }
  }

  // ✅ Typing simulation
  function simulateBotTyping(callback) {
    const typingIndex = chatHistory.push({
      type: "ai",
      message: "Typing...",
      time: new Date(),
    }) - 1;
    updateChatDisplay();

    setTimeout(() => {
      callback(typingIndex);
    }, 800 + Math.random() * 1200);
  }

  // ✅ Handle user submit
  async function handleSubmit() {
    let message = chatInput.value.trim();
    chatInput.value = "";

    // Always show user message
    if (message) addMessage("user", message);

    // Validation check
    const validationError = validateMessage(message);
    if (validationError) {
      simulateBotTyping((typingIndex) => {
        chatHistory[typingIndex] = { type: "ai", message: validationError, time: new Date() };
        updateChatDisplay();
      });
      return;
    }

    // Bot typing before API
    simulateBotTyping(async (typingIndex) => {
      const aiReply = await sendMessageToAPI(message);
      chatHistory[typingIndex] = { type: "ai", message: aiReply, time: new Date() };
      updateChatDisplay();
    });
  }

  sendButton.addEventListener("click", handleSubmit);
  chatInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSubmit();
  });

  updateChatDisplay();
});






const userInterestInput = document.getElementById('user-interest');
const trainingInput = document.getElementById('training-input');
const generateButton = document.getElementById('generate-button');
const aiResponseContainer = document.getElementById('ai-response');

// Notification (alert box)
const trainingAlert = document.createElement('div');
trainingAlert.className = 'training-alert hidden';
const trainingAlertText = document.createElement('span');
trainingAlert.appendChild(trainingAlertText);

// Insert alert inside input card, just before button
const inputCard = document.querySelector('.training-card .card-inner');
inputCard.insertBefore(trainingAlert, generateButton);

// Enable/disable generate button
function updateButtonState() {
  const hasInterest = userInterestInput.value.trim() !== '';
  const hasInput = trainingInput.value.trim() !== '';
  generateButton.disabled = !hasInterest || !hasInput;
}

// Show AI loading spinner
function showGenerating() {
  aiResponseContainer.innerHTML = `
    <div class="generating">
      <div class="spinner"></div>
      <span>Generating AI response...</span>
    </div>`;
}

// Format AI response: clean text, split into paragraphs, bold key phrases
function formatAIResponse(text) {
  if (!text) return "";

  // Replace **bold** with <b>bold</b>
  let formatted = text.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

  // Split into paragraphs by double line breaks
  formatted = formatted
    .split(/\n\s*\n/) // detect empty line
    .map(p => `<p>${p.trim()}</p>`)
    .join("");

  return formatted;
}

// Show AI response
function showResponse(response) {
  aiResponseContainer.innerHTML = `
    <div class="response-content">${formatAIResponse(response)}</div>
  `;
}

// Show training alert
function showTrainingAlert(message, type = 'error') {
  trainingAlertText.textContent = message;
  trainingAlert.className = `training-alert ${type} show`;

  setTimeout(() => {
    trainingAlert.className = 'training-alert hidden';
  }, 8000);
}

// Handle submission
async function handleSubmit() {
  const interest = userInterestInput.value.trim();
  const challenge = trainingInput.value.trim();

  if (!interest || !challenge) return;

  showGenerating();
  generateButton.disabled = true;

  try {
    const response = await fetch('http://15.206.125.43:8005/insight', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ interest, challenge })
    });

    const data = await response.json();

    if (response.ok && data?.insight) {
      showResponse(data.insight);
    } else if (response.status === 422 && data?.detail?.length > 0) {
      const msg = data.detail[0].msg || 'Validation error. Please check your input.';
      showTrainingAlert(msg, 'error');
      aiResponseContainer.innerHTML = `<div class="response-placeholder">
        <i class="fas fa-robot"></i>
        <p>Share your input to see AI-generated insights</p>
      </div>`;
    } else {
      showTrainingAlert('Something went wrong. Try again later.', 'error');
      aiResponseContainer.innerHTML = `<div class="response-placeholder">
        <i class="fas fa-robot"></i>
        <p>Share your input to see AI-generated insights</p>
      </div>`;
    }
  } catch (err) {
    showTrainingAlert('Unable to connect. Please check your internet.', 'error');
    aiResponseContainer.innerHTML = `<div class="response-placeholder">
      <i class="fas fa-robot"></i>
      <p>Share your input to see AI-generated insights</p>
    </div>`;
  } finally {
    generateButton.disabled = false;
  }
}

// Listeners
userInterestInput.addEventListener('input', updateButtonState);
trainingInput.addEventListener('input', updateButtonState);
generateButton.addEventListener('click', handleSubmit);
updateButtonState();











// Email subscription
(() => {
  const emailForm = document.getElementById("email-form");
  const emailInput = document.getElementById("email-input");
  const subscribeButton = document.getElementById("subscribe-button");
  const successMessage = document.getElementById("success-message");
  const changeEmail = document.getElementById("change-email");

  const notificationEl = document.getElementById("notification");
  const notificationTextEl = document.getElementById("notification-text");

  // Show notification
  function showNotification(message, type = "error") {
    if (!notificationEl || !notificationTextEl) return;

    notificationTextEl.textContent = message;
    notificationEl.className = `notification ${type} show`;

    setTimeout(() => {
      notificationEl.className = "notification hidden";
    }, 8000);
  }

  // Hide notification
  function hideNotification() {
    if (!notificationEl || !notificationTextEl) return;

    notificationEl.className = "notification hidden";
    notificationTextEl.textContent = "";
  }

  // Strong email validation
  function isValidEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|org|edu|io|ai)$/i;
    return emailPattern.test(email);
  }

  emailForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = emailInput.value.trim();

    if (!isValidEmail(email)) {
      showNotification("Enter a valid email (e.g., yourname@example.com).", "error");
      return;
    }

    subscribeButton.disabled = true;
    subscribeButton.textContent = "Subscribing...";

    try {
      const response = await fetch("http://15.206.125.43:8005/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      let data;
      try { data = await response.json(); } catch { data = {}; }

      if (response.ok) {
        // Hide any previous notification
        hideNotification();

        // Show success message
        emailForm.classList.add("hidden");
        successMessage.classList.remove("hidden");
        successMessage.classList.add("show");
      } else if (response.status === 422) {
        let msg = "Invalid email. Please try again.";
        if (data?.detail?.length > 0) msg = data.detail[0].msg || msg;
        else if (data?.message) msg = data.message;
        if (/already/i.test(msg)) msg = "This email is already subscribed.";
        showNotification(msg, "error");
      } else {
        showNotification(data?.message || "Subscription failed. Please try again later.", "error");
      }
    } catch (err) {
      showNotification("Unable to connect. Please check your internet.", "error");
    } finally {
      subscribeButton.disabled = false;
      subscribeButton.textContent = "Subscribe";
    }
  });

  // "Subscribe with a different email"
  changeEmail.addEventListener("click", () => {
    successMessage.classList.remove("show");
    successMessage.classList.add("hidden");
    emailForm.classList.remove("hidden");
    emailInput.value = "";

    hideNotification();
  });
})();
