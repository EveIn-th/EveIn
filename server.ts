import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

// Since we compile with we must support both ESM and CommonJS or simplified path calculations
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '35mb' }));

// Ensure data folder holds our JSON archives
const DATA_DIR = path.join(process.cwd(), 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// File Paths
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const EVENTS_FILE = path.join(DATA_DIR, 'events.json');
const JOBS_FILE = path.join(DATA_DIR, 'jobs.json');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');
const NOTIFICATIONS_FILE = path.join(DATA_DIR, 'notifications.json');
const CHAT_HISTORY_FILE = path.join(DATA_DIR, 'chat_history.json');
const SUPPORT_HISTORY_FILE = path.join(DATA_DIR, 'support_history.json');

// Default Mocks from src/mockData for seeding
import { MOCK_USERS, INITIAL_EVENTS, INITIAL_JOBS, INITIAL_APPLICATIONS } from './src/mockData.ts';

// Dynamic Helpers to read/write JSON archives safely
function readJSONFile<T>(filePath: string, defaultData: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(content || 'null') ?? defaultData;
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  // Write default if not exist
  writeJSONFile(filePath, defaultData);
  return defaultData;
}

function writeJSONFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Initial Data Seed Load
let allUsers = readJSONFile(USERS_FILE, MOCK_USERS);
let eventsList = readJSONFile(EVENTS_FILE, INITIAL_EVENTS);
let jobsList = readJSONFile(JOBS_FILE, INITIAL_JOBS);
let applicationsList = readJSONFile(APPLICATIONS_FILE, INITIAL_APPLICATIONS);
let notificationsList = readJSONFile(NOTIFICATIONS_FILE, []);
let chatHistory = readJSONFile(CHAT_HISTORY_FILE, []);
let supportHistory = readJSONFile(SUPPORT_HISTORY_FILE, [
  {
    sender: 'admin',
    text: 'สวัสดีค่ะ ยินดีต้อนรับสู่ EveIn Concierge Service ทีมผู้ดูแลระดับสูงของเราพร้อมบริการแก้ไขข้อสังสัยและช่วยเหลือในการประกาศงาน/รับสมัครงาน ตลอด 24 ชั่วโมงค่ะ สามารถพิมพ์สอบถามได้เลยนะคะ ✨',
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }
]);

// Ensure Admin is always seeded inside allUsers
const hasAdmin = allUsers.some((u: any) => u.email.toLowerCase() === 'adminpoei@evein.com');
if (!hasAdmin) {
  allUsers = [...MOCK_USERS, ...allUsers.filter((u: any) => u.email.toLowerCase() !== 'adminpoei@evein.com')];
  writeJSONFile(USERS_FILE, allUsers);
}

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Load Consolidated System State
app.get('/api/state', (req, res) => {
  res.json({
    allUsers: readJSONFile(USERS_FILE, allUsers),
    events: readJSONFile(EVENTS_FILE, eventsList),
    jobs: readJSONFile(JOBS_FILE, jobsList),
    applications: readJSONFile(APPLICATIONS_FILE, applicationsList),
    notifications: readJSONFile(NOTIFICATIONS_FILE, notificationsList),
    chatHistory: readJSONFile(CHAT_HISTORY_FILE, chatHistory),
    supportHistory: readJSONFile(SUPPORT_HISTORY_FILE, supportHistory)
  });
});

// Single Unified State Sync (called from front-end on any storage changes)
app.post('/api/sync', (req, res) => {
  const { allUsers: inputUsers, events: inputEvents, jobs: inputJobs, applications: inputApps, notifications: inputNotifs, chatHistory: inputChats, supportHistory: inputSupports } = req.body;

  if (inputUsers) {
    allUsers = inputUsers;
    writeJSONFile(USERS_FILE, allUsers);
  }
  if (inputEvents) {
    eventsList = inputEvents;
    writeJSONFile(EVENTS_FILE, eventsList);
  }
  if (inputJobs) {
    jobsList = inputJobs;
    writeJSONFile(JOBS_FILE, jobsList);
  }
  if (inputApps) {
    applicationsList = inputApps;
    writeJSONFile(APPLICATIONS_FILE, applicationsList);
  }
  if (inputNotifs) {
    notificationsList = inputNotifs;
    writeJSONFile(NOTIFICATIONS_FILE, notificationsList);
  }
  if (inputChats) {
    chatHistory = inputChats;
    writeJSONFile(CHAT_HISTORY_FILE, chatHistory);
  }
  if (inputSupports) {
    supportHistory = inputSupports;
    writeJSONFile(SUPPORT_HISTORY_FILE, supportHistory);
  }

  res.json({ success: true, message: 'All backend store files successfully synchronized' });
});

// Boot servers
async function start() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server is running at http://localhost:${PORT}`);
  });
}

start();
