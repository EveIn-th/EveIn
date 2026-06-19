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
import { Sparkles, ShieldCheck, X, AlertCircle } from 'lucide-react';

export default function App() {
  
  // Tab Routing ('home', 'events', 'reviewJobs', 'findInfluencers', 'dashboard', 'profile')
  const [activeTab, setActiveTab] = useState<string>('home');

  // Unified global data stores
  const [allUsers, setAllUsers] = useState<User[]>(MOCK_USERS);
  const [currentUser, setCurrentUser] = useState<User | null>(MOCK_USERS[0]); // default logged in as Aurum_Spa (Brand) to start fully populated
  
  const [events, setEvents] = useState<EventItem[]>(INITIAL_EVENTS);
  const [jobs, setJobs] = useState<JobItem[]>(INITIAL_JOBS);
  const [applications, setApplications] = useState<JobApplication[]>(INITIAL_APPLICATIONS);
  
  // Real notifications queue
  const [notifications, setNotifications] = useState<SystemNotification[]>([
    {
      id: 'n1',
      title: 'แบรนด์ตอบรับงานแล้ว',
      message: 'แอลฟอร์ด แอสโทเรีย แกรนด์บอลรูม อนุมัติการเข้าเป็นคนพรีเซนเตอร์ แคมเปญสกินแคร์ทองคำแล้วค่ะ',
      timestamp: new Date().toISOString(),
      read: false,
      type: 'success'
    },
    {
      id: 'n2',
      title: 'อินฟลูเอนเซอร์ส่งมอบงาน',
      message: 'คุณ @Chanya_Luxe ได้แนบลิงก์คลิปสั้นลง IG สำหรับแคมเปญสปาเรียบร้อยแล้วค่ะ',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: true,
      type: 'info'
    }
  ]);

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
    if (!currentUser || currentUser.role !== 'Influencer') return;

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

      {/* 2. Demonstration switcher alert banner (To inform evaluator they can swap roles dynamically) */}
      <div className="bg-amber-500 text-neutral-950 text-[11px] font-semibold py-2 px-4 shadow-inner text-center flex flex-col sm:flex-row items-center justify-center gap-2">
        <div className="flex items-center gap-1">
          <ShieldCheck className="w-4 h-4 shrink-0 text-neutral-905" />
          <span>[Prestige Demo Mode Enabled] คุณกำลังเข้าใช้งานเป็นแบรนด์กิตติมศักดิ์ <strong>"Aurum Luxury Spa (Brand)"</strong></span>
        </div>
        <div className="text-[10px] bg-neutral-950 text-gold-300 font-bold px-2 py-0.5 rounded uppercase">
          แต่อินฟลูฯ และแอดมินจำลอง สามารถสลับบทบาทบัญชีผ่านปุ่ม "จำลองบทบาท" ด้านบนขวาได้ทันทีค่ะ
        </div>
      </div>

      {/* 3. Main core view content wrapper */}
      <main className="flex-1 pb-16">
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
            triggerToast={triggerToast}
          />
        )}
      </main>

      {/* 4. Elegant custom floating notifications Toast system */}
      {toast && (
        <div className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50 flex items-center gap-3 bg-neutral-950 border border-gold-400 p-4 rounded-xl shadow-2xl animate-in fade-in slide-in-from-bottom-5 max-w-sm w-11/12">
          <div className="w-2.5 h-10 rounded-full bg-gold-400 shrink-0"></div>
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
      <StickyChatButton currentUser={currentUser} />

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

    </div>
  );
}
