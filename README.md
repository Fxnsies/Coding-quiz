# ⚡ DevDuel: The Ultimate HTML & Python Coding Quiz

A hilarious, beautifully animated, medium-to-hard coding quiz built for you and your friends — now with **real-time Firebase database integration** so you can see all your friends' submissions, scores, and answer autopsies live!

---

## 🎮 How to Open & Play

1. **Take the Quiz**: Double-click **`index.html`** in any browser.
2. **View Live Submissions Dashboard**: Double-click **`admin.html`** (or click the "📊 Live Results" button in the quiz header).

Or run via PowerShell:
```powershell
Start-Process index.html
```

---

## 🔥 Connecting with Firebase (Step-by-Step)

To see your friends' submissions in your database and on your live dashboard, connect your free Firebase project:

### Step 1: Create a Free Firebase Project
1. Open the [Firebase Console](https://console.firebase.google.com/).
2. Click **"Add project"** and give it a name (e.g. `DevDuelQuiz`).
3. You can disable Google Analytics for simplicity, then click **"Create project"**.

### Step 2: Enable Cloud Firestore Database
1. In your Firebase project dashboard, click **Build > Firestore Database** in the left sidebar.
2. Click **"Create database"**.
3. Choose your preferred server location (e.g., `us-central` or `asia-south1`).
4. Select **"Start in test mode"** (this allows anyone with the quiz link to write their scores without needing a login account).
   > **Note on Rules**: Under the **Rules** tab in Firestore, make sure it says:
   > ```javascript
   > rules_version = '2';
   > service cloud.firestore {
   >   match /databases/{database}/documents {
   >     match /{document=**} {
   >       allow read, write: if true;
   >     }
   >   }
   > }
   > ```
   > Click **"Publish"** if you make any changes.

### Step 3: Get your Web App Config
1. In the Firebase project overview, click the **Web icon (`</>`)** to register a web app.
2. Enter an app nickname (e.g. `DevDuel Web`) and click **"Register app"**.
3. You will see a `firebaseConfig` snippet that looks like this:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyD-...",
     authDomain: "devduel-12345.firebaseapp.com",
     projectId: "devduel-12345",
     storageBucket: "devduel-12345.appspot.com",
     messagingSenderId: "123456789012",
     appId: "1:123456789012:web:abcdef123456"
   };
   ```

### Step 4: Add your Config (Two Easy Ways)

- **Option A (Via the UI — No coding needed!)**:
  1. Open [admin.html](file:///c:/Users/mehak/OneDrive/Desktop/Forms/admin.html) in your browser.
  2. Click **"⚙️ Firebase Setup"**.
  3. Paste the entire `firebaseConfig = { ... }` snippet or fill in the API Key and Project ID.
  4. Click **"Save & Connect"**. Done!

- **Option B (Direct in file)**:
  Open [firebase-config.js](file:///c:/Users/mehak/OneDrive/Desktop/Forms/firebase-config.js) and replace the placeholder values in `DEFAULT_FIREBASE_CONFIG`.

---

## 📊 What Data is Captured for Each Participant?

Whenever a friend finishes the quiz, their entry is automatically written to your Firestore collection `quiz_submissions` with:
- 👤 **Player Name / Alias**
- 🎯 **Total Score** (e.g., 285 / 310 PTS)
- 📈 **Accuracy Percentage**
- 🏆 **Humorous Dev Rank** (e.g., *10x Full-Stack Demi-God*, *Senior Caffeine Addict*, *Intern on Day 1*)
- 🔥 **Best Streak Combo**
- ⏱️ **Time Taken** (in seconds)
- 🕒 **Server Timestamp**
- 📜 **Full Question Breakdown**:
  - Every question answered
  - The exact option they selected
  - Whether it was correct or wrong
  - The correct answer and explanation

---

## 📁 File Structure

- [index.html](file:///c:/Users/mehak/OneDrive/Desktop/Forms/index.html) — Main Quiz interface with auto-sync to Firebase
- [admin.html](file:///c:/Users/mehak/OneDrive/Desktop/Forms/admin.html) — Real-time live submissions viewer & analytics dashboard
- [firebase-config.js](file:///c:/Users/mehak/OneDrive/Desktop/Forms/firebase-config.js) — Firebase Firestore client service & storage helpers
- [admin.js](file:///c:/Users/mehak/OneDrive/Desktop/Forms/admin.js) — Live leaderboard & autopsy review logic
- [app.js](file:///c:/Users/mehak/OneDrive/Desktop/Forms/app.js) — Quiz game controller & auto-save hook
- [questions.js](file:///c:/Users/mehak/OneDrive/Desktop/Forms/questions.js) — 12 HTML & Python questions (Easy ➔ Boss)
- [audio.js](file:///c:/Users/mehak/OneDrive/Desktop/Forms/audio.js) — 8-bit retro sound synthesizer
- [style.css](file:///c:/Users/mehak/OneDrive/Desktop/Forms/style.css) — Cyber dark mode, animations & dashboard styling
