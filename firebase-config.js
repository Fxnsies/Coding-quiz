// Universal Data Service for DevDuel (Firebase Cloud Firestore + Local Fallback)
// ========================================================
// 1. Go to https://console.firebase.google.com/
// 2. Click "Add project" -> "Firestore Database" (test mode)
// 3. Register Web app (</>) -> Copy your config below:
// ========================================================

const DEFAULT_FIREBASE_CONFIG = {
  apiKey: "AIzaSyC5sEz1xxv7lMjwrhrRcaC-pJr5W9ekMfc",
  authDomain: "coding-quiz-616b8.firebaseapp.com",
  projectId: "coding-quiz-616b8",
  storageBucket: "coding-quiz-616b8.firebasestorage.app",
  messagingSenderId: "632067180145",
  appId: "1:632067180145:web:68c4b2b00d34a6d778fdd0",
  measurementId: "G-Y6V8428BRW"
};

class FirebaseService {
  constructor() {
    this.db = null;
    this.isConfigured = false;
    this.config = this.loadConfig();
    this.init();
  }

  loadConfig() {
    try {
      const stored = localStorage.getItem('devduel_firebase_config');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.apiKey && !parsed.apiKey.includes("YOUR_")) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn("Could not read stored Firebase config", e);
    }
    return DEFAULT_FIREBASE_CONFIG;
  }

  saveConfigToStorage(configObj) {
    try {
      localStorage.setItem('devduel_firebase_config', JSON.stringify(configObj));
      this.config = configObj;
      const success = this.init();
      return success;
    } catch (e) {
      console.error("Failed to save Firebase config", e);
      return false;
    }
  }

  clearStoredConfig() {
    localStorage.removeItem('devduel_firebase_config');
    this.config = DEFAULT_FIREBASE_CONFIG;
    this.isConfigured = false;
    this.db = null;
  }

  init() {
    // Check if configuration is still placeholder
    if (!this.config || !this.config.apiKey || this.config.apiKey.includes("YOUR_API_KEY") || !this.config.projectId || this.config.projectId.includes("YOUR_PROJECT_ID")) {
      this.isConfigured = false;
      return false;
    }

    try {
      if (!window.firebase) {
        console.warn("Firebase SDK script not loaded yet.");
        this.isConfigured = false;
        return false;
      }

      if (!firebase.apps.length) {
        firebase.initializeApp(this.config);
      }
      this.db = firebase.firestore();
      this.isConfigured = true;
      console.log("🔥 Firebase initialized successfully for project:", this.config.projectId);
      return true;
    } catch (err) {
      console.error("Error initializing Firebase:", err);
      this.isConfigured = false;
      return false;
    }
  }

  // Save submission to Local Storage database
  saveLocalSubmission(payload) {
    try {
      const existing = this.getLocalSubmissions();
      const newEntry = {
        id: 'local_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
        ...payload,
        clientTimestamp: new Date().toISOString()
      };
      existing.unshift(newEntry);
      localStorage.setItem('devduel_local_submissions', JSON.stringify(existing));
      return newEntry;
    } catch (e) {
      console.error("Failed to save to local storage", e);
      return null;
    }
  }

  // Get all submissions from Local Storage database
  getLocalSubmissions() {
    try {
      const data = localStorage.getItem('devduel_local_submissions');
      return data ? JSON.parse(data) : [];
    } catch (e) {
      return [];
    }
  }

  // Delete local submission
  deleteLocalSubmission(id) {
    try {
      const list = this.getLocalSubmissions().filter(item => item.id !== id);
      localStorage.setItem('devduel_local_submissions', JSON.stringify(list));
      return true;
    } catch (e) {
      return false;
    }
  }

  // Save participant submission (saves to both Cloud Firestore and Local Storage)
  async saveSubmission(submissionData) {
    const localEntry = this.saveLocalSubmission(submissionData);

    if (!this.isConfigured || !this.db) {
      console.log("💾 Submission stored in Local Database (Firebase not configured yet)");
      return { 
        success: true, 
        mode: "local", 
        id: localEntry ? localEntry.id : null,
        message: "Saved to local database! Connect Firebase to sync across devices."
      };
    }

    try {
      const cloudPayload = {
        ...submissionData,
        submittedAt: firebase.firestore.FieldValue.serverTimestamp(),
        clientTimestamp: new Date().toISOString()
      };

      const docRef = await this.db.collection("quiz_submissions").add(cloudPayload);
      console.log("✅ Quiz submission saved to Cloud Firestore with ID:", docRef.id);
      return { success: true, mode: "cloud", id: docRef.id };
    } catch (err) {
      console.warn("⚠️ Cloud Firestore save failed, but saved locally:", err);
      return { 
        success: true, 
        mode: "local_fallback", 
        id: localEntry ? localEntry.id : null,
        error: err.message 
      };
    }
  }

  // Real-time listener for submissions
  onSubmissionsUpdate(callback) {
    // If Firebase is configured, listen to Firestore
    if (this.isConfigured && this.db) {
      try {
        return this.db.collection("quiz_submissions")
          .orderBy("submittedAt", "desc")
          .onSnapshot(
            snapshot => {
              const cloudList = [];
              snapshot.forEach(doc => {
                cloudList.push({ id: doc.id, isCloud: true, ...doc.data() });
              });

              // Merge with local submissions to never lose data
              const localList = this.getLocalSubmissions().map(s => ({ ...s, isLocal: true }));
              const merged = [...cloudList];
              
              localList.forEach(loc => {
                if (!merged.some(c => c.clientTimestamp === loc.clientTimestamp && c.playerName === loc.playerName)) {
                  merged.push(loc);
                }
              });

              callback(merged, null, "cloud");
            },
            error => {
              console.error("Error listening to Firestore:", error);
              // Fallback to local on error
              callback(this.getLocalSubmissions().map(s => ({ ...s, isLocal: true })), error, "local");
            }
          );
      } catch (err) {
        console.error("Failed to attach Firestore snapshot listener", err);
      }
    }

    // Fallback: immediate local data
    callback(this.getLocalSubmissions().map(s => ({ ...s, isLocal: true })), null, "local");
    return () => {};
  }

  // Delete submission
  async deleteSubmission(id, isLocal) {
    if (isLocal || id.startsWith('local_')) {
      return this.deleteLocalSubmission(id);
    }

    if (this.isConfigured && this.db) {
      try {
        await this.db.collection("quiz_submissions").doc(id).delete();
        return true;
      } catch (e) {
        console.error("Failed to delete Firestore submission", e);
        return false;
      }
    }
    return false;
  }
}

// Global Firebase instance
const firebaseService = new FirebaseService();
