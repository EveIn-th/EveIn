import React, { useState, useEffect } from 'react';
import { MOCK_USERS, INITIAL_EVENTS, INITIAL_JOBS, INITIAL_APPLICATIONS } from './mockData';
import { User, EventItem, JobItem, JobApplication, SystemNotification } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import StickyChatButton from './components/StickyChatButton';
import HomeView from './components/HomeView';
import EventsView from './components/EventsView';
import ReviewJobsView from './components/ReviewJobsView';
import FindInfluencersView from './components/FindInfluencersView';
import MyJobsDashboard from './components/MyJobsDashboard';
import AuthView from './components/AuthView';
import ProfileView from './components/ProfileView';
import ChatMessengerWidget from './components/ChatMessengerWidget';
import AdminBackendView from './components/AdminBackendView';
import { Sparkles, ShieldCheck, X, AlertCircle, Home, Calendar, Briefcase, Users, LayoutDashboard, Shield } from 'lucide-react';

export default function App() {
  
  // Tab Routing ('home', 'events', 'reviewJobs', 'findInfluencers', 'dashboard', 'profile')
  const [activeTab, setActiveTab] = useState<string>('home');

  // Unified global data stores with Express Server and LocalStorage dual persistence
  const [allUsers, setAllUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('evein_users');
    try {
      return saved ? JSON.parse(saved) : MOCK_USERS;
    } catch {
      return MOCK_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('evein_current_user');
    try {
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  
  const [events, setEvents] = useState<EventItem[]>([]);
  const [jobs, setJobs] = useState<JobItem[]>([]);
  const [applications, setApplications] = useState<JobApplication[]>([]);
  const [notifications, setNotifications] = useState<SystemNotification[]>([]);
  const [supportHistory, setSupportHistory] = useState<any[]>([]);

  // Load from Backend API on mount
  useEffect(() => {
    fetch('/api/state')
      .then(res => res.json())
      .then(data => {
        if (data.allUsers && data.allUsers.length > 0) {
          setAllUsers(data.allUsers);
        }
        if (data.events) setEvents(data.events);
        if (data.jobs) setJobs(data.jobs);
        if (data.applications) setApplications(data.applications);
        if (data.notifications) setNotifications(data.notifications);
        if (data.supportHistory) setSupportHistory(data.supportHistory);
      })
      .catch(err => {
        console.warn('Backend server state loading offline, falling back to localStorage buffer:', err);
        // Fallback loads
        const savedJobs = localStorage.getItem('evein_jobs');
        if (savedJobs) setJobs(JSON.parse(savedJobs));
        const savedApps = localStorage.getItem('evein_applications');
        if (savedApps) setApplications(JSON.parse(savedApps));
        const savedEvents = localStorage.getItem('evein_events');
        if (savedEvents) setEvents(JSON.parse(savedEvents));
        const savedNotifs = localStorage.getItem('evein_notifications');
        if (savedNotifs) setNotifications(JSON.parse(savedNotifs));
        const savedSupports = localStorage.getItem('evein_support_history');
        if (savedSupports) setSupportHistory(JSON.parse(savedSupports));
      });
  }, []);

  // Synchronize state mutations to backend API & localStorage as backup
  useEffect(() => {
    if (allUsers.length === 0) return;

    localStorage.setItem('evein_users', JSON.stringify(allUsers));
    localStorage.setItem('evein_current_user', currentUser ? JSON.stringify(currentUser) : '');
    localStorage.setItem('evein_events', JSON.stringify(events));
    localStorage.setItem('evein_jobs', JSON.stringify(jobs));
    localStorage.setItem('evein_applications', JSON.stringify(applications));
    localStorage.setItem('evein_notifications', JSON.stringify(notifications));
    localStorage.setItem('evein_support_history', JSON.stringify(supportHistory));

    // Post sync payload to backend server
    const syncPayload = {
      allUsers,
      events,
      jobs,
      applications,
      notifications,
      supportHistory
    };

    fetch('/api/sync', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(syncPayload)
    })
    .catch(err => console.error('Error syncing state with backend server:', err));
  }, [allUsers, currentUser, events, jobs, applications, notifications, supportHistory]);

  // Auth Dialog state
  const [showAuthModal, setShowAuthModal] = useState<'login' | 'register' | null>(null);

  // Private partner messaging chat
  const [chatOpen, setChatOpen] = useState(false);
  const [chatWithUser, setChatWithUser] = useState<string | null>(null);

  // Custom Toast state
  const [toast, setToast] = useState<{ message: string; status: 'success' | 'info' | 'warning' } | null>(null);

  // Auto disappear toast helper
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const triggerToast = (message: string, status: 'success' | 'info' | 'warning' = 'info') => {
    setToast({ message, status });
  };

  // State mutators passed to children
  const handleCreateEvent = (newEvent: Omit<EventItem, 'id' | 'createdBy' | 'createdByName' | 'createdAt'>) => {
    const item: EventItem = {
      ...newEvent,
      id: `event_${Date.now()}`,
      createdBy: currentUser?.id || 'guest',
      createdByName: currentUser?.brandName || currentUser?.username || 'ผู้ใช้ทั่วไป',
      createdAt: new Date().toISOString()
    };
    setEvents(prev => [item, ...prev]);
  };

  const handleApplyForJob = (jobId: string) => {
    if (!currentUser || (currentUser.role !== 'Influencer' && currentUser.role !== 'Admin')) return;

    const targetJob = jobs.find(j => j.id === jobId);
    if (!targetJob) return;

    const newApp: JobApplication = {
      id: `app_${Date.now()}`,
      jobId,
      jobTitle: targetJob.title,
      brandId: targetJob.createdBy,
      brandName: targetJob.brandName,
      influencerId: currentUser.id,
      influencerName: currentUser.username,
      influencerPlatformDetails: `${currentUser.socials?.[0]?.platform || 'Instagram'}: ${currentUser.socials?.[0]?.handle || '@handle'} (${((currentUser.socials?.[0]?.followers || 150000) / 1000).toFixed(0)}k followers)`,
      status: 'Applied',
      paymentStatus: 'Unpaid',
      appliedAt: new Date().toISOString()
    };

    setApplications(prev => [newApp, ...prev]);

    // Push system notification for brand
    const newNotif: SystemNotification = {
      id: `notif_${Date.now()}`,
      title: 'มีอินฟลูเอนเซอร์ยื่นสมัครงานใหม่',
      message: `คุณ @${currentUser.username} ส่งเอกสารเข้าร่วมเกณฑ์แคมเปญงาน "${targetJob.title}" เรียบร้อยแล้วค่ะ`,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'success'
    };
    setNotifications(prev => [newNotif, ...prev]);

    triggerToast('สมัครเข้าร่วมสำเร็จแล้วค่ะ! ทางบริษัทผู้จ้างจะได้รับการแจ้งเตือนและแชทติดต่อคุณโดยด่วน', 'success');
  };

  return (
    <div className="min-h-screen bg-[#FDFCF7] text-neutral-900 selection:bg-gold-200 flex flex-col font-sans relative">
      
      {/* 1. Header Navigation elements */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        setCurrentUser={setCurrentUser}
        allUsers={allUsers}
        notifications={notifications}
        setNotifications={setNotifications}
        messages={[]}
        setChatOpen={setChatOpen}
        setChatWithUser={setChatWithUser}
        setShowAuthModal={setShowAuthModal}
      />



      {/* 3. Main core view content wrapper */}
      <main className="flex-1 pb-28 md:pb-16">
        {activeTab === 'home' && (
          <HomeView
            onNavigate={setActiveTab}
            onJoinUs={setShowAuthModal}
            isLoggedIn={currentUser !== null}
          />
        )}

        {activeTab === 'events' && (
          <EventsView
            events={events}
            onCreateEvent={handleCreateEvent}
            currentUser={currentUser}
            triggerToast={triggerToast}
            setShowAuthModal={setShowAuthModal}
          />
        )}

        {activeTab === 'reviewJobs' && (
          <ReviewJobsView
            jobs={jobs}
            setJobs={setJobs}
            currentUser={currentUser}
            applications={applications}
            onApplyForJob={handleApplyForJob}
            triggerToast={triggerToast}
            setShowAuthModal={setShowAuthModal}
          />
        )}

        {activeTab === 'findInfluencers' && (
          <FindInfluencersView
            influencers={allUsers.filter(u => u.role === 'Influencer')}
            currentUser={currentUser}
            triggerToast={triggerToast}
            setChatWithUser={setChatWithUser}
            setChatOpen={setChatOpen}
          />
        )}

        {activeTab === 'dashboard' && (
          <MyJobsDashboard
            currentUser={currentUser}
            jobs={jobs}
            setJobs={setJobs}
            applications={applications}
            setApplications={setApplications}
            triggerToast={triggerToast}
            setChatWithUser={setChatWithUser}
            setChatOpen={setChatOpen}
            notifications={notifications}
            setNotifications={setNotifications}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileView
            currentUser={currentUser}
            setCurrentUser={setCurrentUser}
            setAllUsers={setAllUsers}
            triggerToast={triggerToast}
          />
        )}

        {/* Website Manager backend - strictly guarded for Admin users */}
        {activeTab === 'adminBackend' && currentUser?.role === 'Admin' && (
          <AdminBackendView
            allUsers={allUsers}
            setAllUsers={setAllUsers}
            currentUser={currentUser}
            triggerToast={triggerToast}
            supportHistory={supportHistory}
            setSupportHistory={setSupportHistory}
          />
        )}
      </main>

      {/* 4. Elegant custom floating notifications Toast system */}
      {toast && (
        <div className="fixed bottom-24 md:bottom-28 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-neutral-950 border border-gold-400 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 max-w-sm w-11/12">
          <div className="w-2.5 h-10 rounded-full bg-gold-450 shrink-0"></div>
          <div className="flex-1">
            <span className="block text-[8px] uppercase tracking-wider text-gold-400 font-bold">ประกาศระบบ EveIn</span>
            <p className="text-[11.5px] text-zinc-100 font-medium font-prompt leading-tight mt-0.5">{toast.message}</p>
          </div>
          <button onClick={() => setToast(null)} className="text-zinc-500 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 5. Sticky Float Support Concierge Bot (Guest user accessible as specs) */}
      <StickyChatButton 
        currentUser={currentUser} 
        supportHistory={supportHistory}
        setSupportHistory={setSupportHistory}
      />

      {/* 6. Partner/Candidate Messenger Window */}
      {chatOpen && chatWithUser && (
        <ChatMessengerWidget
          currentUser={currentUser}
          chatWithUserId={chatWithUser}
          onClose={() => setChatOpen(false)}
          allUsers={allUsers}
          triggerToast={triggerToast}
        />
      )}

      {/* 7. Authentications Switch modal */}
      {showAuthModal && (
        <AuthView
          onAuthSuccess={setCurrentUser}
          allUsers={allUsers}
          allUsersSet={setAllUsers}
          showType={showAuthModal}
          onClose={() => setShowAuthModal(null)}
          triggerToast={triggerToast}
        />
      )}

      {/* 8. Footer */}
      <Footer setActiveTab={setActiveTab} />

      {/* 9. Mobile Sticky Bottom Navigation Bar (ล็อคคงที่ด้านล่างสุด) */}
      <div className="fixed bottom-0 left-0 right-0 md:hidden bg-white/95 backdrop-blur-md border-t border-[#D4AF37]/25 h-16 flex justify-around items-center z-50 px-2 shadow-[0_-5px_15px_-3px_rgba(0,0,0,0.05)]">
        {[
          { id: 'home', label: 'หน้าแรก', icon: Home },
          { id: 'events', label: 'งานอิเวนต์', icon: Calendar },
          { id: 'reviewJobs', label: 'งานรีวิว', icon: Briefcase },
          { id: 'findInfluencers', label: 'ค้นหาอินฟลู', icon: Users },
          { id: 'dashboard', label: 'งานของฉัน', icon: LayoutDashboard },
        ].map((item) => {
          const IconComp = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (!currentUser && item.id === 'dashboard') {
                  setShowAuthModal('login');
                } else {
                  setActiveTab(item.id);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }
              }}
              className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-prompt font-semibold tracking-tight transition-all cursor-pointer ${
                isActive ? 'text-[#B8860B]' : 'text-zinc-400 hover:text-zinc-600'
              }`}
            >
              <div className={`p-1.5 rounded-full transition-all duration-200 ${isActive ? 'bg-[#D4AF37]/10 scale-110' : ''}`}>
                <IconComp className={`w-4 h-4 ${isActive ? 'text-[#B8860B]' : 'text-zinc-400'}`} />
              </div>
              <span className="-mt-0.5 scale-90">{item.label}</span>
            </button>
          );
        })}

        {/* Exclusive matching admin backend tab */}
        {currentUser?.role === 'Admin' && (
          <button
            onClick={() => {
              setActiveTab('adminBackend');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-prompt font-semibold tracking-tight transition-all cursor-pointer ${
              activeTab === 'adminBackend' ? 'text-[#B8860B]' : 'text-zinc-400 hover:text-zinc-650'
            }`}
          >
            <div className={`p-1.5 rounded-full transition-transform duration-200 ${activeTab === 'adminBackend' ? 'bg-[#D4AF37]/10 scale-110' : ''}`}>
              <Shield className={`w-4 h-4 ${activeTab === 'adminBackend' ? 'text-[#B8860B]' : 'text-zinc-400'}`} />
            </div>
            <span className="-mt-0.5 scale-90">แอดมิน</span>
          </button>
        )}
      </div>

    </div>
  );
}
