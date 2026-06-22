import React, { useState } from 'react';
import { Menu, X, Bell, MessageSquare, ChevronDown, Award, Sparkles, LogOut, Shield, User as UserIcon } from 'lucide-react';
import { User, SystemNotification, LiveMessage } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  allUsers: User[];
  notifications: SystemNotification[];
  setNotifications: React.Dispatch<React.SetStateAction<SystemNotification[]>>;
  messages: LiveMessage[];
  setChatOpen: (open: boolean) => void;
  setChatWithUser: (userId: string | null) => void;
  setShowAuthModal: (show: 'login' | 'register' | null) => void;
}

export default function Header({
  activeTab,
  setActiveTab,
  currentUser,
  setCurrentUser,
  allUsers,
  notifications,
  setNotifications,
  messages,
  setChatOpen,
  setChatWithUser,
  setShowAuthModal,
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showNotificationDropdown, setShowNotificationDropdown] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showDemoUserSwitcher, setShowDemoUserSwitcher] = useState(false);

  const unreadNotifications = notifications.filter(n => !n.read).length;

  const handleNotificationClick = (id: string) => {
    setNotifications(prev =>
      prev.map(n => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setActiveTab('home');
    setShowUserDropdown(false);
  };

  const selectUserRole = (userId: string | null) => {
    if (!userId) {
      setCurrentUser(null);
    } else {
      const u = allUsers.find(x => x.id === userId);
      if (u) setCurrentUser(u);
    }
    setShowDemoUserSwitcher(false);
  };

  const navItems = [
    { id: 'home', label: 'หน้าแรก' },
    { id: 'events', label: 'งานอิเวนต์' },
    { id: 'reviewJobs', label: 'งานรีวิว' },
    { id: 'findInfluencers', label: 'ค้นหาอินฟลูเอนเซอร์' },
    { id: 'dashboard', label: 'หน้างานของฉัน' },
  ];

  return (
    <header className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          
          {/* Custom Elegant Logo related to EveIn (Event + Influencer) - No Star */}
          <div 
            onClick={() => {
              setActiveTab('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }} 
            className="flex items-center gap-2.5 cursor-pointer group select-none"
            title="EveIn Premium Event Matching"
          >
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-neutral-950 to-neutral-900 border-2 border-[#D4AF37]/90 shadow-md overflow-hidden group-hover:border-gold-400 transition-all font-serif duration-300">
              {/* Luxury subtle gradient backdrop */}
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-neutral-900" />
              
              {/* Monogram letters */}
              <span className="text-lg font-extrabold tracking-tighter text-[#D4AF37] font-serif select-none group-hover:translate-x-0.5 transition-transform">E</span>
              <span className="text-xs font-semibold tracking-tighter text-white -ml-0.5 mt-2 select-none group-hover:-translate-y-0.5 transition-transform">i</span>
            </div>
            <div className="flex flex-col">
              <span className="text-[22px] font-extrabold tracking-widest text-[#1a1a1a] leading-none mb-0.5 flex items-center">
                EVE<span className="text-[#D4AF37] font-light">IN</span>
              </span>
              <span className="text-[8px] font-bold tracking-[0.25em] text-neutral-400 uppercase leading-none">Premium Matching</span>
            </div>
          </div>

          {/* Desktop Navigation - Removed and relocated entirely to universal sticky bottom bar */}
          <div className="hidden md:flex items-center">
            {/* Kept header background clean and spacious as requested */}
          </div>

          {/* Right Accessories */}
          <div className="flex items-center gap-3">

            {currentUser && (
              <>
                {/* Chat Inbox Button */}
                <button
                  onClick={() => {
                    setChatWithUser(currentUser.role === 'Brand' ? 'u1' : 'b1');
                    setChatOpen(true);
                  }}
                  className="p-2.5 text-neutral-600 hover:text-gold-600 hover:bg-gold-50/60 rounded-full transition-all relative"
                  title="ข้อความ"
                >
                  <MessageSquare className="w-5.5 h-5.5" />
                  <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-gold-500 rounded-full animate-ping"></span>
                </button>

                {/* Notification Dropdown Panel */}
                <div className="relative">
                  <button
                    onClick={() => setShowNotificationDropdown(!showNotificationDropdown)}
                    className="p-2.5 text-neutral-600 hover:text-gold-600 hover:bg-gold-50/60 rounded-full transition-all relative"
                    title="การแจ้งเตือน"
                  >
                    <Bell className="w-5.5 h-5.5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute top-1 right-1 flex items-center justify-center px-1.5 py-0.5 text-[9px] font-bold text-white bg-red-500 rounded-full">
                        {unreadNotifications}
                      </span>
                    )}
                  </button>

                  {showNotificationDropdown && (
                    <>
                      {/* Unified background wrapper: Positioned at top-center on mobile to look balanced, reset on desktop */}
                      <div 
                        className="fixed inset-0 z-[100] flex items-start justify-center p-4 pt-20 md:p-0 md:absolute md:inset-auto md:right-0 md:top-full md:mt-2 md:z-50"
                        onClick={() => setShowNotificationDropdown(false)}
                      >
                        {/* Mobile glass-blur backdrop */}
                        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs md:hidden" />

                        {/* Modal window */}
                        <div 
                          className="relative z-10 w-full max-w-[340px] md:w-80 bg-white rounded-2xl md:rounded-xl shadow-2xl border border-gold-100 flex flex-col text-neutral-900 font-prompt animate-in fade-in slide-in-from-top-10 md:zoom-in-95 md:slide-in-from-right-3 duration-300 cursor-default"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <div className="p-4 border-b border-neutral-100 flex justify-between items-center bg-neutral-50/50 rounded-t-2xl md:rounded-t-xl">
                            <span className="font-serif font-bold text-xs tracking-wider text-neutral-800">การแจ้งเตือนระบบ</span>
                            <div className="flex items-center gap-3">
                              {unreadNotifications > 0 && (
                                <button 
                                  onClick={markAllNotificationsRead}
                                  className="text-[10px] text-gold-600 hover:underline font-semibold cursor-pointer"
                                >
                                  อ่านทั้งหมด
                                </button>
                              )}
                              <button
                                onClick={() => setShowNotificationDropdown(false)}
                                className="text-neutral-400 hover:text-neutral-700 p-1 cursor-pointer transition-colors"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="max-h-[45vh] md:max-h-80 overflow-y-auto p-2 space-y-1.5 scrollbar-thin">
                            {notifications.length === 0 ? (
                              <div className="text-center py-8 text-xs text-neutral-400 font-medium">ไม่มีการแจ้งเตือนในขณะนี้</div>
                            ) : (
                              notifications.map((notif) => (
                                <div 
                                  key={notif.id}
                                  onClick={() => handleNotificationClick(notif.id)}
                                  className={`p-3 rounded-xl text-left transition-all cursor-pointer ${
                                    notif.read ? 'bg-white opacity-60' : 'bg-gold-50/20'
                                  } hover:bg-neutral-50 border border-transparent hover:border-neutral-100`}
                                >
                                  <div className="flex justify-between items-start gap-1">
                                    <span className={`text-xs ${notif.read ? 'text-neutral-700' : 'text-neutral-900 font-semibold'}`}>
                                      {notif.title}
                                    </span>
                                    <span className="text-[9px] text-neutral-400 whitespace-nowrap">
                                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-neutral-500 mt-1 leading-relaxed">
                                    {notif.message}
                                  </p>
                                </div>
                              ))
                            )}
                          </div>
                          {/* Mobile action panel at bottom */}
                          <div className="p-3 border-t border-neutral-100 md:hidden bg-neutral-50/30 rounded-b-2xl">
                            <button
                              onClick={() => setShowNotificationDropdown(false)}
                              className="w-full py-2.5 bg-[#D4AF37] hover:bg-[#B8860B] active:scale-[0.98] transition-transform text-black font-bold text-xs rounded-xl shadow-md shadow-gold-500/10 cursor-pointer"
                            >
                              ตกลง / ปิดหน้าต่าง
                            </button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                {/* Profile Circle Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setShowUserDropdown(!showUserDropdown)}
                    className="flex items-center gap-2 focus:outline-none cursor-pointer"
                  >
                    <div className="w-10 h-10 rounded-full gold-gradient p-[2px] flex items-center justify-center overflow-hidden shrink-0 shadow-xs">
                      <div className="w-full h-full rounded-full bg-white flex items-center justify-center overflow-hidden">
                        <img
                          src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                          alt={currentUser.username}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="text-left hidden sm:block">
                      <p className="text-[11px] font-bold text-gray-800 leading-tight">
                        {currentUser.brandName ? currentUser.brandName.substring(0, 18) : currentUser.username}
                      </p>
                      <p className="text-[9px] text-gray-400 leading-none">
                        {currentUser.role === 'Admin' ? 'Super Administrator' : currentUser.role === 'Brand' ? 'Premium Brand' : 'Creator'}
                      </p>
                    </div>
                    <ChevronDown className="w-3.5 h-3.5 text-neutral-500 hidden sm:block" />
                  </button>

                  {showUserDropdown && (
                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-xl shadow-2xl border border-gold-100 py-2 z-50">
                      <div className="px-4 py-2 border-b border-neutral-100">
                        <div className="text-xs text-neutral-400 uppercase tracking-widest font-semibold">
                          {currentUser.role === 'Admin' ? 'ผู้ดูแลระบบหลักสูงสุด' : currentUser.role === 'Brand' ? 'แบรนด์ผู้ว่าจ้าง' : 'อินฟลูเอนเซอร์'}
                        </div>
                        <div className="font-bold text-neutral-950 truncate max-w-full">
                          {currentUser.brandName || currentUser.realName || currentUser.username}
                        </div>
                      </div>
                      <div className="p-1">
                        {currentUser.role === 'Admin' && (
                          <button
                            onClick={() => { setActiveTab('adminBackend'); setShowUserDropdown(false); }}
                            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-900 bg-gold-50/50 hover:bg-gold-50 font-bold rounded-lg text-left border-b border-gold-100/50 mb-1"
                          >
                            <Shield className="w-4 h-4 text-gold-600 shrink-0 animate-pulse" />
                            <span>ตัวจัดการเว็บไซต์</span>
                          </button>
                        )}
                        <button
                          onClick={() => { setActiveTab('profile'); setShowUserDropdown(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-gold-50/50 rounded-lg text-left"
                        >
                          <UserIcon className="w-4 h-4 text-gold-500" />
                          <span>โปรไฟล์ส่วนตัว</span>
                        </button>
                        <button
                          onClick={() => { setActiveTab('dashboard'); setShowUserDropdown(false); }}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-neutral-700 hover:bg-gold-50/50 rounded-lg text-left"
                        >
                          <Shield className="w-4 h-4 text-gold-500" />
                          <span>แดชบอร์ดงาน</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-600 hover:bg-red-50 rounded-lg text-left border-t border-neutral-100 mt-1"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>ออกจากระบบ</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}


            {!currentUser && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAuthModal('login')}
                  className="px-4 py-2 text-xs font-semibold tracking-wider text-neutral-700 hover:text-gold-600 hover:bg-gold-50/40 rounded transition-all"
                >
                  เข้าสู่ระบบ
                </button>
                <button
                  onClick={() => setShowAuthModal('register')}
                  className="px-4 py-2 text-xs font-semibold tracking-wider text-white bg-gold-500 hover:bg-gold-600 rounded shadow-md shadow-gold-500/10 hover:shadow-lg hover:shadow-gold-500/25 transition-all"
                >
                  สมัครสมาชิก
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
}
