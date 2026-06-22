import { initializeApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  onSnapshot, 
  query, 
  orderBy, 
  addDoc,
  updateDoc,
  deleteDoc,
  where
} from "firebase/firestore";
import { User, EventItem, JobItem, JobApplication } from "../types";
import { MOCK_USERS, INITIAL_EVENTS, INITIAL_JOBS } from "../mockData";

// API credentials from firebase-applet-config.json
const firebaseConfig = {
  apiKey: "AIzaSyCMNUgZMBkcMsjJt7m09YkdAS_ZOizg3Vk",
  authDomain: "steam-axle-2pwwt.firebaseapp.com",
  projectId: "steam-axle-2pwwt",
  storageBucket: "steam-axle-2pwwt.firebasestorage.app",
  messagingSenderId: "1051427856659",
  appId: "1:1051427856659:web:745b81bb8ee9a98b5b7ae6"
};

// Initialize Firebase app
const app = initializeApp(firebaseConfig);

// Initialize Firestore with the custom databaseId provided in metadata config
export const db = getFirestore(app, "ai-studio-47cdf789-4710-42ec-bbd4-cea522efd00b");

/**
 * Seeding helper to pre-populate database if empty.
 * This guarantees a smooth first experience for the user with luxury demo data.
 */
export async function seedDatabaseIfEmpty() {
  try {
    // 1. Seed Users
    const usersColl = collection(db, "users");
    const userSnap = await getDocs(usersColl);
    if (userSnap.empty) {
      console.log("Seeding mock users to Firestore...");
      for (const u of MOCK_USERS) {
        await setDoc(doc(db, "users", u.id), u);
      }
    }

    // 2. Seed Events
    const eventsColl = collection(db, "events");
    const eventSnap = await getDocs(eventsColl);
    if (eventSnap.empty) {
      console.log("Seeding mock events to Firestore...");
      for (const e of INITIAL_EVENTS) {
        await setDoc(doc(db, "events", e.id), e);
      }
    }

    // 3. Seed Jobs
    const jobsColl = collection(db, "jobs");
    const jobSnap = await getDocs(jobsColl);
    if (jobSnap.empty) {
      console.log("Seeding mock jobs to Firestore...");
      for (const j of INITIAL_JOBS) {
        await setDoc(doc(db, "jobs", j.id), j);
      }
    }
  } catch (error) {
    console.error("Firebase seeding failed: ", error);
  }
}

// --- Dynamic Firestore API wrapper functions ---

// 1. Users Firestore API
export async function fetchAllUsers(): Promise<User[]> {
  try {
    const snap = await getDocs(collection(db, "users"));
    const list: User[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as User);
    });
    return list;
  } catch (err) {
    console.error("Error fetching users:", err);
    return [];
  }
}

export async function saveUserToFirestore(user: User): Promise<void> {
  try {
    await setDoc(doc(db, "users", user.id), user);
  } catch (err) {
    console.error("Error saving user:", err);
  }
}

export function subscribeUsers(callback: (users: User[]) => void) {
  return onSnapshot(collection(db, "users"), (snap) => {
    const list: User[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as User);
    });
    callback(list);
  }, (err) => console.error("Error watching users snapshot:", err));
}

// 2. Events Firestore API
export async function saveEventToFirestore(event: EventItem): Promise<void> {
  try {
    await setDoc(doc(db, "events", event.id), event);
  } catch (err) {
    console.error("Error saving event:", err);
  }
}

export function subscribeEvents(callback: (events: EventItem[]) => void) {
  return onSnapshot(collection(db, "events"), (snap) => {
    const list: EventItem[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as EventItem);
    });
    // Sort recently created event first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => console.error("Error watching events snapshot:", err));
}

// 3. Jobs Firestore API
export async function saveJobToFirestore(job: JobItem): Promise<void> {
  try {
    await setDoc(doc(db, "jobs", job.id), job);
  } catch (err) {
    console.error("Error saving job:", err);
  }
}

export function subscribeJobs(callback: (jobs: JobItem[]) => void) {
  return onSnapshot(collection(db, "jobs"), (snap) => {
    const list: JobItem[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as JobItem);
    });
    // Sort recently created jobs first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    callback(list);
  }, (err) => console.error("Error watching jobs snapshot:", err));
}

// 4. Job Applications Firestore API
export async function saveApplicationToFirestore(app: JobApplication): Promise<void> {
  try {
    await setDoc(doc(db, "applications", app.id), app);
  } catch (err) {
    console.error("Error saving application:", err);
  }
}

export function subscribeApplications(callback: (apps: JobApplication[]) => void) {
  return onSnapshot(collection(db, "applications"), (snap) => {
    const list: JobApplication[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() } as JobApplication);
    });
    callback(list);
  }, (err) => console.error("Error watching applications snapshot:", err));
}

export async function deleteUserFromFirestore(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "users", id));
  } catch (err) {
    console.error("Error deleting user:", err);
  }
}

// 5. Support History / Messages Firestore API (Live Support Chat)
export function subscribeSupportMessages(callback: (messages: any[]) => void) {
  // Ordered by a custom numeric timestamp or just client sorted so it's simple
  return onSnapshot(collection(db, "support_messages"), (snap) => {
    const list: any[] = [];
    snap.forEach((d) => {
      list.push({ id: d.id, ...d.data() });
    });
    // Sort by chronological order
    list.sort((a, b) => {
      const timeA = a.createdTimestamp || 0;
      const timeB = b.createdTimestamp || 0;
      return timeA - timeB;
    });
    callback(list);
  }, (err) => console.error("Error watching support messages:", err));
}

export async function addSupportMessageToFirestore(message: {
  id?: string;
  senderId: string;
  senderName: string;
  text: string;
  time: string;
  isFromAdmin: boolean;
  createdTimestamp: number;
}): Promise<void> {
  try {
    const id = message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
    await setDoc(doc(db, "support_messages", id), {
      ...message,
      id
    });
  } catch (err) {
    console.error("Error adding support message:", err);
  }
}
