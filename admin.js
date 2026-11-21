// Admin Dashboard Script for DevDuel

class AdminDashboard {
  constructor() {
    this.submissions = [];
    this.unsubscribeListener = null;

    this.dom = {
      connectionBanner: document.getElementById('connectionBanner'),
      statusTitle: document.getElementById('statusTitle'),
      statusSub: document.getElementById('statusSub'),
      openSetupBtn: document.getElementById('openSetupBtn'),
      configBtn: document.getElementById('configBtn'),
      addTestBtn: document.getElementById('addTestBtn'),
      exportCsvBtn: document.getElementById('exportCsvBtn'),

      // Metrics
      totalParticipants: document.getElementById('totalParticipants'),
      topScore: document.getElementById('topScore'),
      avgScore: document.getElementById('avgScore'),
      maxStreak: document.getElementById('maxStreak'),

      // List
      submissionsList: document.getElementById('submissionsList'),
      emptyState: document.getElementById('emptyState'),
      searchInput: document.getElementById('searchInput'),
      refreshBtn: document.getElementById('refreshBtn'),

      // Setup Modal
      setupModal: document.getElementById('setupModal'),
      closeModalBtn: document.getElementById('closeModalBtn'),
      cfgApiKey: document.getElementById('cfgApiKey'),
      cfgProjectId: document.getElementById('cfgProjectId'),
      cfgAuthDomain: document.getElementById('cfgAuthDomain'),
      cfgAppId: document.getElementById('cfgAppId'),
      cfgRawSnippet: document.getElementById('cfgRawSnippet'),
      parseSnippetBtn: document.getElementById('parseSnippetBtn'),
      saveConfigBtn: document.getElementById('saveConfigBtn'),
      clearConfigBtn: document.getElementById('clearConfigBtn'),

      // Detail Modal
      detailModal: document.getElementById('detailModal'),
      closeDetailModal: document.getElementById('closeDetailModal'),
      detailPlayerTitle: document.getElementById('detailPlayerTitle'),
      detailModalBody: document.getElementById('detailModalBody')
    };

    this.init();
  }

  init() {
    this.bindEvents();
    this.checkConnection();
  }

  bindEvents() {
    this.dom.openSetupBtn.addEventListener('click', () => this.openSetupModal());
    this.dom.configBtn.addEventListener('click', () => this.openSetupModal());
    this.dom.closeModalBtn.addEventListener('click', () => this.closeSetupModal());
    this.dom.closeDetailModal.addEventListener('click', () => this.closeDetailModal());

    this.dom.addTestBtn.addEventListener('click', () => this.addSampleSubmission());
    this.dom.exportCsvBtn.addEventListener('click', () => this.exportCsv());

    this.dom.saveConfigBtn.addEventListener('click', () => this.saveConfig());
    this.dom.clearConfigBtn.addEventListener('click', () => this.clearConfig());
    this.dom.parseSnippetBtn.addEventListener('click', () => this.parseSnippet());

    this.dom.searchInput.addEventListener('input', () => this.renderSubmissions());
    this.dom.refreshBtn.addEventListener('click', () => {
      this.checkConnection();
      soundEngine.playClick();
    });

    // Close modals when clicking backdrop
    window.addEventListener('click', (e) => {
      if (e.target === this.dom.setupModal) this.closeSetupModal();
      if (e.target === this.dom.detailModal) this.closeDetailModal();
    });
  }

  checkConnection() {
    const isReady = firebaseService.init();

    if (isReady && firebaseService.isConfigured) {
      this.dom.connectionBanner.className = "connection-status-bar status-connected";
      this.dom.statusTitle.textContent = "Firebase Connected & Syncing";
      this.dom.statusSub.textContent = `Connected to Project: "${firebaseService.config.projectId}". Listening for real-time submissions.`;
      this.dom.openSetupBtn.textContent = "Edit Config";
    } else {
      this.dom.connectionBanner.className = "connection-status-bar status-disconnected";
      this.dom.statusTitle.textContent = "Running in Local Storage Mode";
      this.dom.statusSub.textContent = "Submissions are recorded in your browser's local database. Connect Firebase when you want cloud sync across friends' phones/laptops.";
      this.dom.openSetupBtn.textContent = "Connect Firebase";
    }

    this.startRealtimeListener();
  }

  startRealtimeListener() {
    if (this.unsubscribeListener) {
      this.unsubscribeListener();
    }

    this.unsubscribeListener = firebaseService.onSubmissionsUpdate((data, err, mode) => {
      if (err) {
        console.warn("Firestore listener warning:", err);
        this.dom.statusSub.textContent = `Firestore Notice: ${err.message}. Showing local submissions.`;
      }

      this.submissions = data || [];
      this.updateMetrics();
      this.renderSubmissions();
    });
  }

  updateMetrics() {
    const total = this.submissions.length;
    this.dom.totalParticipants.textContent = total;

    if (total === 0) {
      this.dom.topScore.textContent = "0";
      this.dom.avgScore.textContent = "0";
      this.dom.maxStreak.textContent = "0x";
      return;
    }

    const scores = this.submissions.map(s => Number(s.score) || 0);
    const streaks = this.submissions.map(s => Number(s.bestStreak) || 0);

    const highest = Math.max(...scores);
    const average = Math.round(scores.reduce((a, b) => a + b, 0) / total);
    const maxStreak = Math.max(...streaks);

    this.dom.topScore.textContent = highest;
    this.dom.avgScore.textContent = average;
    this.dom.maxStreak.textContent = `${maxStreak}x`;
  }

  renderSubmissions() {
    const query = this.dom.searchInput.value.trim().toLowerCase();
    const filtered = this.submissions.filter(s => {
      const name = (s.playerName || "").toLowerCase();
      const rank = (s.rank || "").toLowerCase();
      return name.includes(query) || rank.includes(query);
    });

    if (filtered.length === 0) {
      this.dom.emptyState.style.display = 'block';
      this.dom.submissionsList.innerHTML = '';
      this.dom.submissionsList.appendChild(this.dom.emptyState);
      return;
    }

    this.dom.emptyState.style.display = 'none';
    this.dom.submissionsList.innerHTML = '';

    filtered.forEach(item => {
      const card = document.createElement('div');
      card.className = 'submission-item';

      let timeAgo = "Just now";
      if (item.submittedAt && item.submittedAt.toDate) {
        timeAgo = this.formatDate(item.submittedAt.toDate());
      } else if (item.clientTimestamp) {
        timeAgo = this.formatDate(new Date(item.clientTimestamp));
      }

      const isCloud = item.isCloud || (item.id && !item.id.startsWith('local_'));
      const storageBadge = isCloud 
        ? `<span class="badge-source badge-cloud" title="Synced via Firebase Cloud">☁️ Cloud</span>` 
        : `<span class="badge-source badge-local" title="Stored in Local Storage">💾 Local</span>`;

      card.innerHTML = `
        <div class="submission-main">
          <div class="sub-avatar">👤</div>
          <div class="sub-info">
            <div class="sub-header">
              <strong class="sub-name">${this.escapeHTML(item.playerName || 'Anonymous')}</strong>
              ${storageBadge}
              <span class="sub-time">${timeAgo}</span>
            </div>
            <div class="sub-rank">${this.escapeHTML(item.rank || 'Participant')}</div>
          </div>
        </div>

        <div class="submission-stats">
          <div class="sub-stat">
            <span class="sub-stat-num">${item.score || 0}</span>
            <span class="sub-stat-label">/ ${item.maxScore || 310} PTS</span>
          </div>
          <div class="sub-stat">
            <span class="sub-stat-num">${item.accuracy || 0}%</span>
            <span class="sub-stat-label">Accuracy</span>
          </div>
          <div class="sub-stat">
            <span class="sub-stat-num">🔥 ${item.bestStreak || 0}x</span>
            <span class="sub-stat-label">Streak</span>
          </div>
        </div>

        <div class="submission-actions">
          <button class="btn btn-secondary btn-sm view-btn">View Answers</button>
          <button class="btn-icon delete-btn" title="Delete entry">🗑️</button>
        </div>
      `;

      card.querySelector('.view-btn').addEventListener('click', () => this.openDetailModal(item));
      card.querySelector('.delete-btn').addEventListener('click', async () => {
        if (confirm(`Delete submission from "${item.playerName || 'participant'}"?`)) {
          await firebaseService.deleteSubmission(item.id, item.isLocal);
          this.checkConnection();
        }
      });

      this.dom.submissionsList.appendChild(card);
    });
  }

  formatDate(date) {
    try {
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (e) {
      return "Recently";
    }
  }

  escapeHTML(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  openDetailModal(item) {
    soundEngine.playClick();
    this.dom.detailPlayerTitle.textContent = `Autopsy: ${item.playerName || 'Anonymous'} (${item.score || 0} / ${item.maxScore || 310} PTS)`;

    const answers = item.detailedAnswers || [];
    let answersHTML = '';

    if (answers.length === 0) {
      answersHTML = `<p style="color:var(--text-muted); padding:1rem;">No detailed question breakdown recorded for this entry.</p>`;
    } else {
      answersHTML = answers.map((a, idx) => {
        const isCorrect = a.isCorrect;
        const icon = isCorrect ? '✅' : '❌';
        return `
          <div class="review-item" style="margin-bottom:0.75rem;">
            <div class="review-q-title">
              <span>${icon} Q${idx + 1}: ${this.escapeHTML(a.question)}</span>
              <span style="float:right; color:${isCorrect ? '#34d399' : '#fb7185'}">
                ${isCorrect ? `+${a.pointsEarned || a.points} pts` : `0 / ${a.points} pts`}
              </span>
            </div>
            ${a.code ? `<pre class="terminal-body" style="background:#090c12; border-radius:6px; margin: 0.5rem 0; padding:0.5rem; font-size:0.8rem;"><code>${this.escapeHTML(a.code)}</code></pre>` : ''}
            <div class="review-answers" style="font-size:0.88rem; margin:0.4rem 0;">
              <div><strong>Chosen:</strong> ${this.escapeHTML(a.selectedAnswer)}</div>
              ${!isCorrect ? `<div style="color:#34d399;"><strong>Correct:</strong> ${this.escapeHTML(a.correctAnswer)}</div>` : ''}
            </div>
            <div class="review-expl" style="font-size:0.8rem;">💡 ${this.escapeHTML(a.explanation || '')}</div>
          </div>
        `;
      }).join('');
    }

    this.dom.detailModalBody.innerHTML = `
      <div class="detail-overview-grid">
        <div><strong>Time Taken:</strong> ${item.timeSeconds || 0}s</div>
        <div><strong>Best Streak:</strong> 🔥 ${item.bestStreak || 0}x</div>
        <div><strong>Rank:</strong> ${this.escapeHTML(item.rank || 'N/A')}</div>
        <div><strong>Accuracy:</strong> ${item.accuracy || 0}%</div>
      </div>
      <hr style="border:none; border-top:1px solid var(--border-subtle); margin:1rem 0;">
      <h4 style="margin-bottom:0.75rem; color:#fff;">Questions Answered:</h4>
      ${answersHTML}
    `;

    this.dom.detailModal.classList.remove('hidden');
  }

  closeDetailModal() {
    this.dom.detailModal.classList.add('hidden');
  }

  openSetupModal() {
    soundEngine.playClick();
    const cfg = firebaseService.config || {};
    this.dom.cfgApiKey.value = cfg.apiKey && !cfg.apiKey.includes("YOUR_") ? cfg.apiKey : '';
    this.dom.cfgProjectId.value = cfg.projectId && !cfg.projectId.includes("YOUR_") ? cfg.projectId : '';
    this.dom.cfgAuthDomain.value = cfg.authDomain && !cfg.authDomain.includes("YOUR_") ? cfg.authDomain : '';
    this.dom.cfgAppId.value = cfg.appId && !cfg.appId.includes("YOUR_") ? cfg.appId : '';

    this.dom.setupModal.classList.remove('hidden');
  }

  closeSetupModal() {
    this.dom.setupModal.classList.add('hidden');
  }

  parseSnippet() {
    const raw = this.dom.cfgRawSnippet.value;
    if (!raw) return;

    try {
      const apiKeyMatch = raw.match(/apiKey:\s*["']([^"']+)["']/);
      const projMatch = raw.match(/projectId:\s*["']([^"']+)["']/);
      const authMatch = raw.match(/authDomain:\s*["']([^"']+)["']/);
      const appMatch = raw.match(/appId:\s*["']([^"']+)["']/);

      if (apiKeyMatch) this.dom.cfgApiKey.value = apiKeyMatch[1];
      if (projMatch) this.dom.cfgProjectId.value = projMatch[1];
      if (authMatch) this.dom.cfgAuthDomain.value = authMatch[1];
      if (appMatch) this.dom.cfgAppId.value = appMatch[1];

      soundEngine.playCorrect();
    } catch (e) {
      alert("Could not parse snippet automatically. Please copy the values into the fields manually.");
    }
  }

  saveConfig() {
    const apiKey = this.dom.cfgApiKey.value.trim();
    const projectId = this.dom.cfgProjectId.value.trim();
    const authDomain = this.dom.cfgAuthDomain.value.trim() || `${projectId}.firebaseapp.com`;
    const appId = this.dom.cfgAppId.value.trim();

    if (!apiKey || !projectId) {
      alert("Please provide at least the API Key and Project ID!");
      return;
    }

    const newConfig = {
      apiKey,
      projectId,
      authDomain,
      storageBucket: `${projectId}.appspot.com`,
      messagingSenderId: "1234567890",
      appId: appId || "1:1234567890:web:abcdef"
    };

    firebaseService.saveConfigToStorage(newConfig);
    this.closeSetupModal();
    this.checkConnection();
    soundEngine.playCorrect();
  }

  clearConfig() {
    if (confirm("Reset Firebase configuration back to Local Storage mode?")) {
      firebaseService.clearStoredConfig();
      this.closeSetupModal();
      this.checkConnection();
    }
  }

  // Inject a mock friend submission for testing
  addSampleSubmission() {
    soundEngine.playClick();
    const sampleNames = ["Sarah Dev", "Alex (Python Guru)", "Dave 'HTML King'", "CodeNinja_99"];
    const randomName = sampleNames[Math.floor(Math.random() * sampleNames.length)];
    const randomScore = Math.floor(Math.random() * 120) + 180; // 180-300
    const randomAccuracy = Math.floor((randomScore / 310) * 100);

    const sample = {
      playerName: randomName,
      score: randomScore,
      maxScore: 310,
      accuracy: randomAccuracy,
      rank: randomScore > 260 ? "⚡ 10x Full-Stack Demi-God" : "☕ Senior Caffeine Addict",
      bestStreak: Math.floor(Math.random() * 6) + 3,
      timeSeconds: Math.floor(Math.random() * 90) + 45,
      detailedAnswers: [
        {
          question: "What does HTML stand for?",
          selectedAnswer: "HyperText Markup Language",
          correctAnswer: "HyperText Markup Language",
          isCorrect: true,
          points: 10,
          pointsEarned: 10,
          explanation: "Standard markup language for the web."
        },
        {
          question: "What does print('dev' * 3) output?",
          selectedAnswer: "devdevdev",
          correctAnswer: "devdevdev",
          isCorrect: true,
          points: 10,
          pointsEarned: 10,
          explanation: "String repetition in Python."
        },
        {
          question: "What is bool([]) == bool([False])?",
          selectedAnswer: "False",
          correctAnswer: "False",
          isCorrect: true,
          points: 20,
          pointsEarned: 20,
          explanation: "Empty list is False, list with [False] is True."
        }
      ]
    };

    firebaseService.saveSubmission(sample).then(() => {
      this.checkConnection();
      soundEngine.playCorrect();
    });
  }

  // Export submissions to CSV for Excel / Google Sheets
  exportCsv() {
    soundEngine.playClick();
    if (this.submissions.length === 0) {
      alert("No submissions to export yet!");
      return;
    }

    const headers = ["Player Name", "Score", "Max Score", "Accuracy %", "Rank", "Streak", "Time (seconds)", "Submitted Date"];
    const rows = this.submissions.map(s => {
      const date = s.clientTimestamp || (s.submittedAt && s.submittedAt.toDate ? s.submittedAt.toDate().toISOString() : "N/A");
      return [
        `"${(s.playerName || 'Anonymous').replace(/"/g, '""')}"`,
        s.score || 0,
        s.maxScore || 310,
        `${s.accuracy || 0}%`,
        `"${(s.rank || 'Participant').replace(/"/g, '""')}"`,
        `${s.bestStreak || 0}x`,
        s.timeSeconds || 0,
        `"${date}"`
      ].join(",");
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(","), ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `devduel_quiz_submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    link.remove();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.admin = new AdminDashboard();
});
