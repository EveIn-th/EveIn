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
  where,
  getDoc,
  getDocFromServer
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
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
export let db = getFirestore(app, "ai-studio-47cdf789-4710-42ec-bbd4-cea522efd00b");
export const auth = getAuth(app);

// Use default DB lock to fall back cleanly on Spark plans
let useDefaultDbOnly = false;

export function forceFallbackToDefault() {
  if (!useDefaultDbOnly) {
    console.warn("Forcing fallback to default database '(default)'...");
    useDefaultDbOnly = true;
    try {
      db = getFirestore(app);
    } catch (e) {
      console.error("Failed to reinitialize to default database:", e);
    }
  }
}

// Wrapper to automatically retry once with default database if a database error occurs
async function runWithFallback<T>(op: () => Promise<T>): Promise<T> {
  try {
    return await op();
  } catch (err: any) {
    if (!useDefaultDbOnly) {
      forceFallbackToDefault();
      return await op();
    }
    throw err;
  }
}

async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log("Firestore connection validated successfully.");
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client appears to be offline.");
    } else {
      console.warn("Verify Firestore database availability:", error);
    }
  }
}
testConnection();

// Error handling structures as mandated by the firebase-integration skill
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

/**
 * Seeding helper to pre-populate database if empty.
 * This guarantees a smooth first experience for the user with luxury demo data.
 */
export async function seedDatabaseIfEmpty() {
  return runWithFallback(async () => {
    try {
      // 1. Seed Users individually if missing
      for (const u of MOCK_USERS) {
        try {
          const uDocRef = doc(db, "users", u.id);
          const uSnap = await getDoc(uDocRef);
          if (!uSnap.exists()) {
            console.log(`Seeding mock user: ${u.username}`);
            await setDoc(uDocRef, u);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `users/${u.id}`);
        }
      }

      // 2. Seed Events
      const eventsColl = collection(db, "events");
      let eventSnap;
      try {
        eventSnap = await getDocs(eventsColl);
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "events");
        return;
      }

      if (eventSnap.empty) {
        console.log("Seeding mock events to Firestore...");
        for (const e of INITIAL_EVENTS) {
          try {
            await setDoc(doc(db, "events", e.id), e);
          } catch (err) {
            handleFirestoreError(err, OperationType.WRITE, `events/${e.id}`);
          }
        }
      }

      // 3. Seed Jobs individually if missing
      for (const j of INITIAL_JOBS) {
        try {
          const jDocRef = doc(db, "jobs", j.id);
          const jSnap = await getDoc(jDocRef);
          if (!jSnap.exists()) {
            console.log(`Seeding mock job: ${j.title}`);
            await setDoc(jDocRef, j);
          }
        } catch (err) {
          handleFirestoreError(err, OperationType.WRITE, `jobs/${j.id}`);
        }
      }
    } catch (error) {
      console.error("Firebase seeding failed: ", error);
    }
  });
}

// --- Dynamic Firestore API wrapper functions ---

// 1. Users Firestore API
export async function fetchAllUsers(): Promise<User[]> {
  return runWithFallback(async () => {
    try {
      let snap;
      try {
        snap = await getDocs(collection(db, "users"));
      } catch (err) {
        handleFirestoreError(err, OperationType.GET, "users");
        return [];
      }
      const list: User[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as User);
      });
      return list;
    } catch (err) {
      console.error("Error fetching users:", err);
      return [];
    }
  });
}

export async function saveUserToFirestore(user: User): Promise<void> {
  return runWithFallback(async () => {
    try {
      await setDoc(doc(db, "users", user.id), user);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `users/${user.id}`);
    }
  });
}

export function subscribeUsers(callback: (users: User[]) => void) {
  let unsubscribe: (() => void) | null = null;
  const setup = () => {
    return onSnapshot(collection(db, "users"), (snap) => {
      const list: User[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as User);
      });
      callback(list);
    }, (err) => {
      if (!useDefaultDbOnly) {
        console.warn("Users subscription failed. Switching to default database...", err);
        forceFallbackToDefault();
        if (unsubscribe) unsubscribe();
        unsubscribe = setup();
      } else {
        handleFirestoreError(err, OperationType.GET, "users");
      }
    });
  };
  unsubscribe = setup();
  return () => {
    if (unsubscribe) unsubscribe();
  };
}

// 2. Events Firestore API
export async function saveEventToFirestore(event: EventItem): Promise<void> {
  return runWithFallback(async () => {
    try {
      await setDoc(doc(db, "events", event.id), event);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `events/${event.id}`);
    }
  });
}

export function subscribeEvents(callback: (events: EventItem[]) => void) {
  let unsubscribe: (() => void) | null = null;
  const setup = () => {
    return onSnapshot(collection(db, "events"), (snap) => {
      const list: EventItem[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as EventItem);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    }, (err) => {
      if (!useDefaultDbOnly) {
        console.warn("Events subscription failed. Switching to default database...", err);
        forceFallbackToDefault();
        if (unsubscribe) unsubscribe();
        unsubscribe = setup();
      } else {
        handleFirestoreError(err, OperationType.GET, "events");
      }
    });
  };
  unsubscribe = setup();
  return () => {
    if (unsubscribe) unsubscribe();
  };
}

// 3. Jobs Firestore API
export async function saveJobToFirestore(job: JobItem): Promise<void> {
  return runWithFallback(async () => {
    try {
      await setDoc(doc(db, "jobs", job.id), job);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `jobs/${job.id}`);
    }
  });
}

export function subscribeJobs(callback: (jobs: JobItem[]) => void) {
  let unsubscribe: (() => void) | null = null;
  const setup = () => {
    return onSnapshot(collection(db, "jobs"), (snap) => {
      const list: JobItem[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as JobItem);
      });
      list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(list);
    }, (err) => {
      if (!useDefaultDbOnly) {
        console.warn("Jobs subscription failed. Switching to default database...", err);
        forceFallbackToDefault();
        if (unsubscribe) unsubscribe();
        unsubscribe = setup();
      } else {
        handleFirestoreError(err, OperationType.GET, "jobs");
      }
    });
  };
  unsubscribe = setup();
  return () => {
    if (unsubscribe) unsubscribe();
  };
}

// 4. Job Applications Firestore API
export async function saveApplicationToFirestore(app: JobApplication): Promise<void> {
  return runWithFallback(async () => {
    try {
      await setDoc(doc(db, "applications", app.id), app);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `applications/${app.id}`);
    }
  });
}

export function subscribeApplications(callback: (apps: JobApplication[]) => void) {
  let unsubscribe: (() => void) | null = null;
  const setup = () => {
    return onSnapshot(collection(db, "applications"), (snap) => {
      const list: JobApplication[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() } as JobApplication);
      });
      callback(list);
    }, (err) => {
      if (!useDefaultDbOnly) {
        console.warn("Applications subscription failed. Switching to default database...", err);
        forceFallbackToDefault();
        if (unsubscribe) unsubscribe();
        unsubscribe = setup();
      } else {
        handleFirestoreError(err, OperationType.GET, "applications");
      }
    });
  };
  unsubscribe = setup();
  return () => {
    if (unsubscribe) unsubscribe();
  };
}

export async function deleteUserFromFirestore(id: string): Promise<void> {
  return runWithFallback(async () => {
    try {
      await deleteDoc(doc(db, "users", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${id}`);
    }
  });
}

export async function deleteEventFromFirestore(id: string): Promise<void> {
  return runWithFallback(async () => {
    try {
      await deleteDoc(doc(db, "events", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `events/${id}`);
    }
  });
}

export async function deleteJobFromFirestore(id: string): Promise<void> {
  return runWithFallback(async () => {
    try {
      await deleteDoc(doc(db, "jobs", id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `jobs/${id}`);
    }
  });
}

// 5. Support History / Messages Firestore API (Live Support Chat)
export function subscribeSupportMessages(callback: (messages: any[]) => void) {
  let unsubscribe: (() => void) | null = null;
  const setup = () => {
    return onSnapshot(collection(db, "support_messages"), (snap) => {
      const list: any[] = [];
      snap.forEach((d) => {
        list.push({ id: d.id, ...d.data() });
      });
      list.sort((a, b) => {
        const timeA = a.createdTimestamp || 0;
        const timeB = b.createdTimestamp || 0;
        return timeA - timeB;
      });
      callback(list);
    }, (err) => {
      if (!useDefaultDbOnly) {
        console.warn("Support messages subscription failed. Switching to default database...", err);
        forceFallbackToDefault();
        if (unsubscribe) unsubscribe();
        unsubscribe = setup();
      } else {
        handleFirestoreError(err, OperationType.GET, "support_messages");
      }
    });
  };
  unsubscribe = setup();
  return () => {
    if (unsubscribe) unsubscribe();
  };
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
  return runWithFallback(async () => {
    try {
      const id = message.id || `msg_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`;
      await setDoc(doc(db, "support_messages", id), {
        ...message,
        id
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `support_messages/${message.id}`);
    }
  });
}
