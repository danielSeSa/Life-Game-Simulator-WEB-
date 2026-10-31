// firebase-auth.js
// This module handles all Firebase authentication and Firestore database interactions.

// IMPORTANT: Replace this with your own Firebase project configuration!
const firebaseConfig = {
  apiKey: "",
  authDomain: "",
  projectId: "",
  storageBucket: "",
  messagingSenderId: "",
  appId: "",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

/**
 * Registers a new user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.auth.UserCredential>}
 */
export async function registerUser(email, password) {
  try {
    const userCredential = await auth.createUserWithEmailAndPassword(
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Error registering new user:", error);
    throw error; // Re-throw the error to be handled by the caller
  }
}

/**
 * Signs in a user with email and password.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<firebase.auth.UserCredential>}
 */
export async function loginUser(email, password) {
  try {
    const userCredential = await auth.signInWithEmailAndPassword(
      email,
      password
    );
    return userCredential;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
}

/**
 * Signs in the user anonymously (as a guest).
 * @returns {Promise<firebase.auth.UserCredential>}
 */
export async function signInAsGuest() {
  try {
    const userCredential = await auth.signInAnonymously();
    return userCredential;
  } catch (error) {
    console.error("Error signing in as guest:", error);
    throw error;
  }
}

/**
 * Signs out the current user.
 * @returns {Promise<void>}
 */
export async function logoutUser() {
  try {
    await auth.signOut();
  } catch (error) {
    console.error("Error signing out:", error);
    throw error;
  }
}

/**
 * Listens for changes in the authentication state (login/logout).
 * @param {function} callback - A function to call when the auth state changes. It receives the user object or null.
 * @returns {firebase.Unsubscribe} A function to unsubscribe the listener.
 */
export function onAuthStateChanged(callback) {
  return auth.onAuthStateChanged(callback);
}

/**
 * Saves the player's game state to Firestore.
 * @param {string} userId - The UID of the authenticated user.
 * @param {object} playerData - The player object to save.
 * @returns {Promise<void>}
 */
export async function saveGameState(userId, playerData) {
  if (!userId) {
    console.warn("Cannot save game state without a userId.");
    return;
  }
  try {
    // We need to convert the class instance to a plain object for Firestore
    const plainPlayerData = JSON.parse(JSON.stringify(playerData));

    // Add a timestamp for the last save
    plainPlayerData.lastSaved = firebase.firestore.FieldValue.serverTimestamp();

    const userDocRef = db.collection("playerSaves").doc(userId);
    await userDocRef.set(plainPlayerData);
    console.log("Game state saved successfully for user:", userId);
  } catch (error) {
    console.error("Error saving game state:", error);
    throw error;
  }
}

/**
 * Loads the player's game state from Firestore.
 * @param {string} userId - The UID of the authenticated user.
 * @returns {Promise<object|null>} The player data object, or null if no save exists.
 */
export async function loadGameState(userId) {
  if (!userId) {
    console.warn("Cannot load game state without a userId.");
    return null;
  }
  try {
    const userDocRef = db.collection("playerSaves").doc(userId);
    const docSnap = await userDocRef.get();

    if (docSnap.exists) {
      console.log("Game state loaded successfully for user:", userId);
      return docSnap.data();
    } else {
      console.log("No saved game found for user:", userId);
      return null; // No save data exists for this user
    }
  } catch (error) {
    console.error("Error loading game state:", error);
    throw error;
  }
}
