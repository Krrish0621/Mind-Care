// lib/firestore.js

import { db, auth } from './firebase';
import { collection, addDoc, serverTimestamp, query, where, onSnapshot, getDocs, orderBy, doc, updateDoc, increment, deleteDoc } from 'firebase/firestore';

// --- TEST RESULTS & BOOKINGS (from previous steps) ---
export const saveTestResult = async (testType, score) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return { success: false, error: "User not authenticated." };
  try {
    const docRef = await addDoc(collection(db, 'testResults'), { userId: currentUser.uid, testType, score, createdAt: serverTimestamp() });
    return { success: true, docId: docRef.id };
  } catch (error) { return { success: false, error: error }; }
};
export const bookAppointment = async (bookingData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return { success: false, error: "User not authenticated." };
  const generateMeetLink = () => `https://meet.google.com/${[...Array(3)].map(() => Math.random().toString(36)[2]).join('')}-${[...Array(4)].map(() => Math.random().toString(36)[2]).join('')}-${[...Array(3)].map(() => Math.random().toString(36)[2]).join('')}`;
  const meetLink = bookingData.mode === "online" ? generateMeetLink() : null;
  try {
    const docRef = await addDoc(collection(db, 'bookings'), { userId: currentUser.uid, ...bookingData, meetLink, status: 'confirmed', createdAt: serverTimestamp() });
    return { success: true, docId: docRef.id };
  } catch (error) { return { success: false, error: error }; }
};
export const getAppointments = (callback) => {
  const currentUser = auth.currentUser;
  if (!currentUser) { callback([]); return () => {}; }
  const q = query(collection(db, "bookings"), where("userId", "==", currentUser.uid), orderBy("createdAt", "desc"));
  return onSnapshot(q, (snapshot) => callback(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }))));
};

// --- FORUM (from previous step) ---
export const createPost = async (postData) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return { success: false, error: "User not authenticated." };
  try {
    const docRef = await addDoc(collection(db, 'posts'), { ...postData, authorId: currentUser.uid, authorName: `Anonymous User #${Math.floor(Math.random() * 999) + 1}`, createdAt: serverTimestamp(), upvoteCount: 0, commentCount: 0, views: 0 });
    return { success: true, docId: docRef.id };
  } catch (error) { return { success: false, error: error }; }
};
export const createComment = async (postId, content) => {
  const currentUser = auth.currentUser;
  if (!currentUser) return { success: false, error: "User not authenticated." };
  try {
    const commentRef = await addDoc(collection(db, 'comments'), { postId, content, authorId: currentUser.uid, authorName: `Anonymous User #${Math.floor(Math.random() * 999) + 1}`, createdAt: serverTimestamp(), upvoteCount: 0 });
    await updateDoc(doc(db, 'posts', postId), { commentCount: increment(1) });
    return { success: true, docId: commentRef.id };
  } catch (error) { return { success: false, error: error }; }
};
export const getPosts = (callback) => onSnapshot(query(collection(db, 'posts'), orderBy('createdAt', 'desc')), (snapshot) => callback(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().createdAt?.toDate() || new Date() }))));
export const getCommentsForPost = (postId, callback) => onSnapshot(query(collection(db, 'comments'), where('postId', '==', postId), orderBy('createdAt', 'asc')), (snapshot) => callback(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id, timestamp: doc.data().createdAt?.toDate() || new Date() }))));
export const upvoteItem = async (itemId, type) => { if (!itemId || !type) return; try { await updateDoc(doc(db, type === 'post' ? 'posts' : 'comments', itemId), { upvoteCount: increment(1) }); } catch (error) { console.error(`Error upvoting ${type}:`, error); }};
export const incrementPostView = async (postId) => { if (!postId) return; try { await updateDoc(doc(db, 'posts', postId), { views: increment(1) }); } catch (error) { console.error("Error incrementing view count:", error); }};

// --- ADMIN & COUNSELOR MANAGEMENT (New for Step 5) ---
export const getCounselors = (callback) => {
  const q = query(collection(db, 'counselors'), orderBy('name', 'asc'));
  return onSnapshot(q, (snapshot) => {
    const counselors = snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
    callback(counselors);
  });
};
export const addCounselor = async (counselorData) => {
  try {
    const docRef = await addDoc(collection(db, 'counselors'), counselorData);
    return { success: true, docId: docRef.id };
  } catch (error) {
    console.error("Error adding counselor:", error);
    return { success: false, error };
  }
};
export const deleteCounselor = async (counselorId) => {
  try {
    await deleteDoc(doc(db, 'counselors', counselorId));
    return { success: true };
  } catch (error) {
    console.error("Error deleting counselor:", error);
    return { success: false, error };
  }
};
export const getDashboardAnalytics = (callback) => {
  let analytics = {};
  const calculateAndCallback = () => { callback(analytics); };
  const unsubPosts = onSnapshot(collection(db, 'posts'), (snapshot) => { analytics.totalPosts = snapshot.size; calculateAndCallback(); });
  const unsubBookings = onSnapshot(collection(db, 'bookings'), (snapshot) => { analytics.totalBookings = snapshot.size; calculateAndCallback(); });
  const unsubUsers = onSnapshot(collection(db, 'users'), (snapshot) => { analytics.totalUsers = snapshot.size; calculateAndCallback(); });
  const unsubTestResults = onSnapshot(collection(db, 'testResults'), (snapshot) => {
    const results = snapshot.docs.map(doc => doc.data());
    const phq9Results = { minimal: 0, mild: 0, moderate: 0, severe: 0 };
    const gad7Results = { minimal: 0, mild: 0, moderate: 0, severe: 0 };
    let highRiskUsers = new Set();
    results.forEach(res => {
      if (res.testType === 'PHQ-9') {
        if (res.score <= 4) phq9Results.minimal++;
        else if (res.score <= 9) phq9Results.mild++;
        else if (res.score <= 14) phq9Results.moderate++;
        else { phq9Results.severe++; highRiskUsers.add(res.userId); }
      } else if (res.testType === 'GAD-7') {
        if (res.score <= 4) gad7Results.minimal++;
        else if (res.score <= 9) gad7Results.mild++;
        else if (res.score <= 14) gad7Results.moderate++;
        else { gad7Results.severe++; highRiskUsers.add(res.userId); }
      }
    });
    analytics.assessmentMetrics = { phq9Results, gad7Results, highRiskUsers: highRiskUsers.size };
    calculateAndCallback();
  });
  return () => { unsubPosts(); unsubBookings(); unsubUsers(); unsubTestResults(); };
};