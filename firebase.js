
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  signOut
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-auth.js";
import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  onSnapshot,
  doc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore.js";

// Test Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyTest-KEYEXAMPLE",
  authDomain: "test-diary.firebaseapp.com",
  projectId: "test-diary",
  storageBucket: "test-diary.appspot.com",
  messagingSenderId: "1234567890",
  appId: "1:1234567890:web:example12345"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Registration for guests
export async function registerGuest(email, password) {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  await sendEmailVerification(userCredential.user);
  return userCredential.user;
}

// Login function
export async function loginUser(email, password) {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return userCredential.user;
}

// Logout
export async function logoutUser() {
  await signOut(auth);
}

// Save post to Firestore
export async function publishPost(text, mediaURL, mediaType, author) {
  const docRef = await addDoc(collection(db, "posts"), {
    text,
    mediaURL,
    mediaType,
    author,
    createdAt: new Date()
  });
  return docRef.id;
}

// Load all posts
export async function loadPosts(callback) {
  onSnapshot(collection(db, "posts"), (snapshot) => {
    const posts = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    callback(posts);
  });
}

// Add comment
export async function addComment(postId, username, comment) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    comments: arrayUnion({ username, comment, time: new Date() })
  });
}

// Toggle like
export async function toggleLike(postId, userId, liked) {
  const postRef = doc(db, "posts", postId);
  await updateDoc(postRef, {
    likes: arrayUnion({ userId, liked })
  });
}
