// DevDuel Application Controller

class QuizApp {
  constructor() {
    this.questions = [...QUIZ_QUESTIONS];
    this.currentIndex = 0;
    this.score = 0;
    this.maxPossibleScore = this.calculateMaxScore();
    this.streak = 0;
    this.bestStreak = 0;
    this.startTime = null;
    this.endTime = null;
    this.playerName = "Anonymous Coder";
    this.isAnswered = false;
    
    // Lifelines
    this.lifelines = {
      fifty: 2,
      ai: 2
    };

    // User response logs for end review
    this.userAnswers = [];

    // DOM Elements
    this.dom = {
      // Screens
      startScreen: document.getElementById('startScreen'),
      quizScreen: document.getElementById('quizScreen'),
      resultScreen: document.getElementById('resultScreen'),

      // Header & Sound
      soundToggle: document.getElementById('soundToggle'),
      soundIcon: document.getElementById('soundIcon'),

      // Start Screen
      friendNameInput: document.getElementById('friendName'),
      startBtn: document.getElementById('startBtn'),
      introMascot: document.getElementById('introMascot'),

      // Quiz HUD
      questionCounter: document.getElementById('questionCounter'),
      diffBadge: document.getElementById('diffBadge'),
      streakBadge: document.getElementById('streakBadge'),
      streakFire: document.getElementById('streakFire'),
      streakCount: document.getElementById('streakCount'),
      scoreDisplay: document.getElementById('scoreDisplay'),
      progressBar: document.getElementById('progressBar'),

      // Question Card
      questionCard: document.getElementById('questionCard'),
      langTag: document.getElementById('langTag'),
      pointsTag: document.getElementById('pointsTag'),
      questionText: document.getElementById('questionText'),
      codeTerminal: document.getElementById('codeTerminal'),
      terminalTitle: document.getElementById('terminalTitle'),
      codeSnippet: document.getElementById('codeSnippet'),
      optionsGrid: document.getElementById('optionsGrid'),

      // Lifelines
      lifelineFifty: document.getElementById('lifelineFifty'),
      lifelineAi: document.getElementById('lifelineAi'),
      fiftyCount: document.getElementById('fiftyCount'),
      aiCount: document.getElementById('aiCount'),
      aiHintBox: document.getElementById('aiHintBox'),
      aiHintText: document.getElementById('aiHintText'),
      closeAiHint: document.getElementById('closeAiHint'),

      // Mascot
      liveMascot: document.getElementById('liveMascot'),
      mascotBubble: document.getElementById('mascotBubble'),

      // Feedback
      feedbackBanner: document.getElementById('feedbackBanner'),
      feedbackIcon: document.getElementById('feedbackIcon'),
      feedbackTitle: document.getElementById('feedbackTitle'),
      feedbackRoast: document.getElementById('feedbackRoast'),
      feedbackExplanation: document.getElementById('feedbackExplanation'),
      nextBtn: document.getElementById('nextBtn'),

      // Results
      resultMascot: document.getElementById('resultMascot'),
      resultRankBadge: document.getElementById('resultRankBadge'),
      resultTitle: document.getElementById('resultTitle'),
      resultShoutout: document.getElementById('resultShoutout'),
      finalScore: document.getElementById('finalScore'),
      finalMaxScore: document.getElementById('finalMaxScore'),
      statAccuracy: document.getElementById('statAccuracy'),
      statStreak: document.getElementById('statStreak'),
      statTime: document.getElementById('statTime'),
      certTitle: document.getElementById('certTitle'),
      certDescription: document.getElementById('certDescription'),
      copyShareBtn: document.getElementById('copyShareBtn'),
      copyToast: document.getElementById('copyToast'),
      restartBtn: document.getElementById('restartBtn'),
      reviewBtn: document.getElementById('reviewBtn'),
      reviewContainer: document.getElementById('reviewContainer'),
      reviewList: document.getElementById('reviewList'),

      // Firebase Sync
      firebaseSyncStatus: document.getElementById('firebaseSyncStatus'),
      firebaseSyncText: document.getElementById('firebaseSyncText')
    };

    this.init();
  }

  calculateMaxScore() {
    return this.questions.reduce((acc, q) => acc + q.points, 0);
  }

  init() {
    this.dom.introMascot.textContent = "💻";
    this.dom.liveMascot.textContent = "👾";

    // Attach Event Listeners
    this.dom.soundToggle.addEventListener('click', () => this.toggleSound());
    this.dom.startBtn.addEventListener('click', () => this.startQuiz());
    this.dom.friendNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.startQuiz();
    });

    this.dom.nextBtn.addEventListener('click', () => this.nextQuestion());
    this.dom.lifelineFifty.addEventListener('click', () => this.useFiftyFifty());
    this.dom.lifelineAi.addEventListener('click', () => this.useAiHint());
    this.dom.closeAiHint.addEventListener('click', () => this.dom.aiHintBox.classList.add('hidden'));

    this.dom.copyShareBtn.addEventListener('click', () => this.copyShareCard());
    this.dom.restartBtn.addEventListener('click', () => this.restartQuiz());
    this.dom.reviewBtn.addEventListener('click', () => this.toggleReview());

    // Keyboard Shortcuts (1-4, A-D, Enter)
    window.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  toggleSound() {
    const isEnabled = soundEngine.toggle();
    this.dom.soundIcon.textContent = isEnabled ? '🔊' : '🔇';
    if (isEnabled) soundEngine.playClick();
  }

  switchScreen(fromScreen, toScreen) {
    fromScreen.classList.remove('active');
    setTimeout(() => {
      fromScreen.style.display = 'none';
      toScreen.style.display = 'block';
      setTimeout(() => toScreen.classList.add('active'), 20);
    }, 200);
  }

  startQuiz() {
    soundEngine.ensureContext();
    soundEngine.playClick();

    const inputVal = this.dom.friendNameInput.value.trim();
    if (inputVal) {
      this.playerName = inputVal;
    }

    this.startTime = Date.now();
    this.switchScreen(this.dom.startScreen, this.dom.quizScreen);
    this.loadQuestion(0);
  }

  loadQuestion(index) {
    this.currentIndex = index;
    this.isAnswered = false;
    const q = this.questions[index];

    // Reset feedback & lifelines visuals
    this.dom.feedbackBanner.classList.add('hidden');
    this.dom.aiHintBox.classList.add('hidden');

    // Update Counter & Progress
    this.dom.questionCounter.textContent = `${index + 1} / ${this.questions.length}`;
    const progressPercent = ((index) / this.questions.length) * 100;
    this.dom.progressBar.style.width = `${progressPercent}%`;

    // Difficulty Badge & Points
    this.dom.diffBadge.className = `difficulty-badge diff-${q.difficulty.toLowerCase()}`;
    this.dom.diffBadge.textContent = `${q.difficulty} • ${q.points} pts`;

    this.dom.langTag.textContent = q.topic;
    this.dom.pointsTag.textContent = `+${q.points} PTS`;

    // Question text
    this.dom.questionText.textContent = q.question;

    // Code snippet display
    if (q.code) {
      this.dom.codeTerminal.classList.remove('hidden');
      this.dom.codeSnippet.textContent = q.code;
      this.dom.terminalTitle.textContent = q.filename || (q.topic === 'HTML' ? 'index.html' : 'main.py');
    } else {
      this.dom.codeTerminal.classList.add('hidden');
    }

    // Mascot speech & emoji
    this.updateMascotForQuestion(q);

    // Build Options
    this.dom.optionsGrid.innerHTML = '';
    const letterKeys = ['A', 'B', 'C', 'D'];

    q.options.forEach((optText, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.dataset.index = optIdx;

      btn.innerHTML = `
        <span class="option-key">${letterKeys[optIdx]}</span>
        <span class="option-text">${this.escapeHTML(optText)}</span>
      `;

      btn.addEventListener('mouseenter', () => soundEngine.playHover());
      btn.addEventListener('click', (e) => this.selectAnswer(optIdx, btn, e));

      this.dom.optionsGrid.appendChild(btn);
    });

    // Update lifeline states
    this.dom.lifelineFifty.disabled = this.lifelines.fifty <= 0;
    this.dom.fiftyCount.textContent = `${this.lifelines.fifty} left`;

    this.dom.lifelineAi.disabled = this.lifelines.ai <= 0;
    this.dom.aiCount.textContent = `${this.lifelines.ai} left`;
  }

  escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  updateMascotForQuestion(q) {
    if (q.difficulty === 'Boss') {
      this.dom.liveMascot.textContent = "😈";
      this.dom.mascotBubble.textContent = "FINAL BOSS: One comma will decide your fate.";
    } else if (q.difficulty === 'Hard') {
      this.dom.liveMascot.textContent = "🧐";
      this.dom.mascotBubble.textContent = "Senior dev question incoming. Do not panic!";
    } else if (q.difficulty === 'Medium') {
      this.dom.liveMascot.textContent = "😼";
      this.dom.mascotBubble.textContent = "Careful, there might be a sneaky trick here.";
    } else {
      this.dom.liveMascot.textContent = "👾";
      this.dom.mascotBubble.textContent = `Warm up time, ${this.playerName}!`;
    }
  }

  selectAnswer(selectedIndex, clickedBtn, mouseEvent) {
    if (this.isAnswered) return;
    this.isAnswered = true;

    soundEngine.playClick();
    const q = this.questions[this.currentIndex];
    const isCorrect = selectedIndex === q.correct;
    const optionButtons = this.dom.optionsGrid.querySelectorAll('.option-btn');

    // Freeze options
    optionButtons.forEach(btn => btn.disabled = true);

    // Calculate score
    let pointsEarned = 0;
    if (isCorrect) {
      pointsEarned = q.points;
      this.streak++;
      if (this.streak > this.bestStreak) {
        this.bestStreak = this.streak;
      }
      this.score += pointsEarned;

      // Visual updates
      clickedBtn.classList.add('correct');
      soundEngine.playCorrect();

      // Confetti burst for correct answer
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 40,
          spread: 60,
          origin: { y: 0.7 }
        });
      }

      // Floating points popup
      this.spawnScorePopup(mouseEvent, `+${pointsEarned} PTS`);

      // Streak celebration
      if (this.streak >= 3) {
        soundEngine.playStreak();
        this.dom.streakBadge.classList.add('streak-onfire');
        this.dom.streakFire.textContent = "🔥🔥";
      }

      this.dom.liveMascot.textContent = "😎";
      this.dom.mascotBubble.textContent = "Look at you! Certified Big Brain moment!";

      this.showFeedback(true, q.cheer, q.explanation);
    } else {
      // Wrong answer
      this.streak = 0;
      this.dom.streakBadge.classList.remove('streak-onfire');
      this.dom.streakFire.textContent = "🔥";

      clickedBtn.classList.add('wrong');
      // Highlight the correct answer
      const correctBtn = optionButtons[q.correct];
      if (correctBtn) correctBtn.classList.add('correct');

      soundEngine.playWrong();
      this.spawnScorePopup(mouseEvent, `0 PTS 💀`);

      this.dom.liveMascot.textContent = "🤦‍♂️";
      this.dom.mascotBubble.textContent = "My RAM physically hurts after that choice.";

      this.showFeedback(false, q.roast, q.explanation);
    }

    // Update HUD
    this.dom.scoreDisplay.textContent = this.score;
    this.dom.streakCount.textContent = `${this.streak}x`;

    // Save answer log
    this.userAnswers.push({
      question: q.question,
      code: q.code,
      topic: q.topic,
      difficulty: q.difficulty,
      points: q.points,
      pointsEarned: pointsEarned,
      selectedAnswer: q.options[selectedIndex],
      correctAnswer: q.options[q.correct],
      isCorrect: isCorrect,
      explanation: q.explanation
    });
  }

  spawnScorePopup(e, text) {
    const popup = document.createElement('div');
    popup.className = 'score-float';
    popup.textContent = text;

    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    if (e && e.clientX) {
      x = e.clientX;
      y = e.clientY;
    }

    popup.style.left = `${x - 40}px`;
    popup.style.top = `${y - 30}px`;

    document.body.appendChild(popup);
    setTimeout(() => popup.remove(), 1000);
  }

  showFeedback(isCorrect, message, explanation) {
    this.dom.feedbackBanner.classList.remove('hidden');

    if (isCorrect) {
      this.dom.feedbackIcon.textContent = "🎉";
      this.dom.feedbackTitle.textContent = "Spot On!";
      this.dom.feedbackTitle.style.color = "#34d399";
    } else {
      this.dom.feedbackIcon.textContent = "💀";
      this.dom.feedbackTitle.textContent = "Critical Bug!";
      this.dom.feedbackTitle.style.color = "#fb7185";
    }

    this.dom.feedbackRoast.textContent = message;
    this.dom.feedbackExplanation.innerHTML = `<strong>Why:</strong> ${explanation}`;

    // Focus next button
    this.dom.nextBtn.focus();
  }

  useFiftyFifty() {
    if (this.lifelines.fifty <= 0 || this.isAnswered) return;
    this.lifelines.fifty--;
    soundEngine.playLifeline();

    const q = this.questions[this.currentIndex];
    const optionButtons = Array.from(this.dom.optionsGrid.querySelectorAll('.option-btn'));

    // Filter wrong option buttons
    const wrongButtons = optionButtons.filter((btn, idx) => idx !== q.correct);

    // Randomly pick 2 to disable
    const shuffledWrong = wrongButtons.sort(() => 0.5 - Math.random()).slice(0, 2);
    shuffledWrong.forEach(btn => {
      btn.classList.add('disabled-50');
      btn.disabled = true;
    });

    this.dom.fiftyCount.textContent = `${this.lifelines.fifty} left`;
    if (this.lifelines.fifty <= 0) this.dom.lifelineFifty.disabled = true;

    this.dom.mascotBubble.textContent = "50/50 deployed! 2 bogus options deleted.";
    this.dom.liveMascot.textContent = "✂️";
  }

  useAiHint() {
    if (this.lifelines.ai <= 0 || this.isAnswered) return;
    this.lifelines.ai--;
    soundEngine.playLifeline();

    const q = this.questions[this.currentIndex];
    this.dom.aiHintText.textContent = q.aiHint;
    this.dom.aiHintBox.classList.remove('hidden');

    this.dom.aiCount.textContent = `${this.lifelines.ai} left`;
    if (this.lifelines.ai <= 0) this.dom.lifelineAi.disabled = true;

    this.dom.mascotBubble.textContent = "Sarcastic AI has spoken. Listen up!";
    this.dom.liveMascot.textContent = "🤖";
  }

  nextQuestion() {
    soundEngine.playClick();
    if (this.currentIndex < this.questions.length - 1) {
      this.loadQuestion(this.currentIndex + 1);
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    this.endTime = Date.now();
    soundEngine.playVictory();

    // Trigger grand victory confetti
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
      setTimeout(() => {
        confetti({
          particleCount: 80,
          angle: 60,
          spread: 70,
          origin: { x: 0 }
        });
        confetti({
          particleCount: 80,
          angle: 120,
          spread: 70,
          origin: { x: 1 }
        });
      }, 350);
    }

    this.switchScreen(this.dom.quizScreen, this.dom.resultScreen);
    this.renderResults();
  }

  renderResults() {
    const totalQuestions = this.questions.length;
    const correctCount = this.userAnswers.filter(a => a.isCorrect).length;
    const accuracy = Math.round((correctCount / totalQuestions) * 100);
    const durationSeconds = Math.round((this.endTime - this.startTime) / 1000);

    // Find Rank
    const matchedRank = QUIZ_RANKS.find(r => this.score >= r.minScore) || QUIZ_RANKS[QUIZ_RANKS.length - 1];

    this.dom.resultMascot.textContent = this.score >= 200 ? "🏆" : (this.score >= 120 ? "☕" : "🐣");
    this.dom.resultRankBadge.className = `result-tag ${matchedRank.badgeClass}`;
    this.dom.resultRankBadge.textContent = matchedRank.rank;

    this.dom.resultTitle.textContent = matchedRank.title;
    this.dom.resultShoutout.textContent = `Honest evaluation for: ${this.playerName}`;

    this.dom.finalScore.textContent = this.score;
    this.dom.finalMaxScore.textContent = `/ ${this.maxPossibleScore} PTS`;

    this.dom.statAccuracy.textContent = `${accuracy}%`;
    this.dom.statStreak.textContent = `${this.bestStreak}x`;
    this.dom.statTime.textContent = `${durationSeconds}s`;

    this.dom.certTitle.textContent = `Official Code Assessment for ${this.playerName}`;
    this.dom.certDescription.textContent = matchedRank.description;

    this.matchedRank = matchedRank;
    this.accuracy = accuracy;

    // Automatically send data to Firebase
    this.syncToFirebase(durationSeconds);
  }

  async syncToFirebase(durationSeconds) {
    if (!this.dom.firebaseSyncStatus) return;

    this.dom.firebaseSyncStatus.className = "firebase-sync-status sync-pending";
    this.dom.firebaseSyncText.textContent = "Recording quiz results...";

    const payload = {
      playerName: this.playerName,
      score: this.score,
      maxScore: this.maxPossibleScore,
      accuracy: this.accuracy,
      rank: this.matchedRank ? this.matchedRank.rank : 'Participant',
      bestStreak: this.bestStreak,
      timeSeconds: durationSeconds,
      detailedAnswers: this.userAnswers
    };

    const res = await firebaseService.saveSubmission(payload);
    if (res.mode === "cloud") {
      this.dom.firebaseSyncStatus.className = "firebase-sync-status sync-success";
      this.dom.firebaseSyncText.textContent = "☁️ Synced to Firebase Cloud! Host can view your score live.";
    } else {
      this.dom.firebaseSyncStatus.className = "firebase-sync-status sync-success";
      this.dom.firebaseSyncText.innerHTML = `💾 Submission recorded! <a href="admin.html" style="color:#c084fc; text-decoration:underline; font-weight:700;">View in Dashboard ➔</a>`;
    }
  }

  copyShareCard() {
    soundEngine.playClick();
    const rankTitle = this.matchedRank ? this.matchedRank.rank : "Coder";
    const shareText = 
`⚡ DevDuel: HTML & Python Coding Quiz
👤 Player: ${this.playerName}
🏆 Rank: ${rankTitle}
🎯 Score: ${this.score} / ${this.maxPossibleScore} PTS (${this.accuracy}%)
🔥 Best Streak: ${this.bestStreak}x
Can you beat my score? Try the DevDuel Quiz!`;

    navigator.clipboard.writeText(shareText).then(() => {
      this.dom.copyToast.classList.remove('hidden');
      setTimeout(() => {
        this.dom.copyToast.classList.add('hidden');
      }, 3000);
    }).catch(err => {
      alert("Copied to clipboard!\n\n" + shareText);
    });
  }

  toggleReview() {
    soundEngine.playClick();
    const isHidden = this.dom.reviewContainer.classList.contains('hidden');
    if (isHidden) {
      this.dom.reviewContainer.classList.remove('hidden');
      this.dom.reviewBtn.textContent = "Hide Answers Review";
      this.renderReviewList();
      this.dom.reviewContainer.scrollIntoView({ behavior: 'smooth' });
    } else {
      this.dom.reviewContainer.classList.add('hidden');
      this.dom.reviewBtn.textContent = "📜 Review All Answers";
    }
  }

  renderReviewList() {
    this.dom.reviewList.innerHTML = '';

    this.userAnswers.forEach((ans, idx) => {
      const item = document.createElement('div');
      item.className = 'review-item';

      const statusIcon = ans.isCorrect ? '✅' : '❌';
      const pointsFormatted = ans.isCorrect ? `+${ans.pointsEarned} pts` : `0 / ${ans.points} pts`;

      item.innerHTML = `
        <div class="review-q-title">
          <span>${statusIcon} Q${idx + 1}: ${this.escapeHTML(ans.question)}</span>
          <span style="float: right; font-family: var(--font-code); color: ${ans.isCorrect ? '#34d399' : '#fb7185'}">${pointsFormatted}</span>
        </div>
        ${ans.code ? `<pre class="terminal-body" style="background:#090c12; border-radius:6px; margin: 0.5rem 0; padding:0.6rem; font-size:0.85rem;"><code>${this.escapeHTML(ans.code)}</code></pre>` : ''}
        <div class="review-answers">
          <div class="review-user-ans"><strong>Your Answer:</strong> ${this.escapeHTML(ans.selectedAnswer)}</div>
          ${!ans.isCorrect ? `<div class="review-correct-ans"><strong>Correct Answer:</strong> ${this.escapeHTML(ans.correctAnswer)}</div>` : ''}
        </div>
        <div class="review-expl">💡 ${this.escapeHTML(ans.explanation)}</div>
      `;

      this.dom.reviewList.appendChild(item);
    });
  }

  restartQuiz() {
    soundEngine.playClick();
    this.currentIndex = 0;
    this.score = 0;
    this.streak = 0;
    this.bestStreak = 0;
    this.isAnswered = false;
    this.lifelines = { fifty: 2, ai: 2 };
    this.userAnswers = [];

    this.dom.scoreDisplay.textContent = '0';
    this.dom.streakCount.textContent = '0x';
    this.dom.streakBadge.classList.remove('streak-onfire');
    this.dom.reviewContainer.classList.add('hidden');
    this.dom.reviewBtn.textContent = "📜 Review All Answers";

    this.switchScreen(this.dom.resultScreen, this.dom.quizScreen);
    this.loadQuestion(0);
  }

  handleKeyboard(e) {
    // Only active during quiz screen
    if (!this.dom.quizScreen.classList.contains('active')) return;

    // Next question with Enter or Space when feedback is open
    if (this.isAnswered && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault();
      this.nextQuestion();
      return;
    }

    if (this.isAnswered) return;

    const key = e.key.toUpperCase();
    const map = {
      '1': 0, 'A': 0,
      '2': 1, 'B': 1,
      '3': 2, 'C': 2,
      '4': 3, 'D': 3
    };

    if (key in map) {
      const idx = map[key];
      const buttons = this.dom.optionsGrid.querySelectorAll('.option-btn');
      if (buttons[idx] && !buttons[idx].disabled) {
        buttons[idx].click();
      }
    }
  }
}

// Boot application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new QuizApp();
});
