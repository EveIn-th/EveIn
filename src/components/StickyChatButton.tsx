import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface StickyChatButtonProps {
  currentUser: User | null;
  supportHistory: any[];
  setSupportHistory: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function StickyChatButton({ 
  currentUser, 
  supportHistory, 
  setSupportHistory 
}: StickyChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputText, setInputText] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Setup guest ID for anonymous visitors to segregate conversations in the admin backend
  const [guestId] = useState(() => {
    let gid = localStorage.getItem('evein_guest_id');
    if (!gid) {
      gid = `guest_${Math.floor(100000 + Math.random() * 900000)}`;
      localStorage.setItem('evein_guest_id', gid);
    }
    return gid;
  });

  const mySenderId = currentUser?.id || guestId;

  // Filter messages belonging to this user's thread
  const threadMessages = supportHistory.filter(m => m.senderId === mySenderId);

  // Welcome message template shown if there is no message history
  const welcomeMessage = {
    id: 'welcome_concierge',
    senderId: mySenderId,
    senderName: 'ฝ่ายดูแลระบบ EveIn',
    text: 'สวัสดีค่ะ ยินดีต้อนรับสู่ EveIn Concierge Service ทีมผู้ดูแลระบบสูงสุดหลังบ้านพอร์ตเรียลไทม์พร้อมเคียงข้างดูแลคุณ (ไม่มีระบบตอบรับอัตโนมัติ / เป็นการตอบกลับแท้จริงเท่านั้น) สามารถฝากความต้องการสอบถามหรือแก้ไขปัญหาเรื่องดีลแคมเปญไว้ได้เลยค่ะ เจ้าหน้าที่จะให้เบาะแสโดยเร็วที่สุดค่ะ ✨',
    time: 'ตอนนี้',
    isFromAdmin: true
  };

  const visibleMessages = threadMessages.length === 0 ? [welcomeMessage] : threadMessages;

  useEffect(() => {
    if (messagesEndRef.current && isOpen) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [visibleMessages, isOpen]);

  useEffect(() => {
    const handleOpenChat = () => setIsOpen(true);
    window.addEventListener('open-evein-chat', handleOpenChat);
    return () => {
      window.removeEventListener('open-evein-chat', handleOpenChat);
    };
  }, []);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userText = inputText;
    setInputText('');

    const newMsg = {
      id: `sup_${Date.now()}`,
      senderId: mySenderId,
      senderName: currentUser?.brandName || currentUser?.username || 'ผู้เยี่ยมชม / Guest',
      text: userText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromAdmin: false
    };

    setSupportHistory(prev => [...prev, newMsg]);
  };

  return (
    <>
      {/* Absolute floating button */}
      <div className="fixed bottom-20 md:bottom-6 right-6 z-40">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-1.5 px-4.5 py-2.5 rounded-full transition-all font-prompt shadow-xl border cursor-pointer transform hover:scale-105 active:scale-95 duration-250 ${
            isOpen 
              ? 'bg-neutral-950 text-white border border-[#D4AF37]/50'
              : 'bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 hover:text-amber-800 border-amber-600/25 hover:border-amber-600/45 shadow-amber-500/5'
          }`}
          aria-label="ติดต่อเจ้าหน้าที่ช่วยเหลือ"
        >
          {isOpen ? (
            <X className="w-4 h-4" />
          ) : (
            <div className="flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span className="text-xs font-bold tracking-wider text-amber-700">ติดต่อฝ่ายช่วยเหลือแอดมิน</span>
            </div>
          )}
        </button>
      </div>

      {/* Floating Chat Panel Widget */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 w-[365px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gold-200/60 z-50 overflow-hidden flex flex-col font-sans transition-all transform animate-in fade-in-50 slide-in-from-bottom-5">
          
          {/* Header */}
          <div className="bg-neutral-950 p-4 border-b border-gold-400 flex items-center justify-between shadow-md">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-gold-400 bg-neutral-900 flex items-center justify-center relative">
                <Sparkles className="w-4.5 h-4.5 text-gold-400 animate-pulse" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-950"></span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-widest font-serif">EveIn Concierge</h4>
                <p className="text-[9px] text-gold-400 font-light">ช่วยเหลือและดูแลระบบเรียลไทม์ (24hr)</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Banner */}
          <div className="bg-gold-50/50 px-3 py-2 border-b border-gold-100 text-[10px] text-gold-800 flex gap-1.5 items-center">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-gold-600 animate-bounce" />
            <span>ช่องทางสนับสนุนพิเศษ เชื่อมต่อแผงควมคุมแอดมินสูงสุดโดยตรง</span>
          </div>

          {/* Messages Log Panel */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {visibleMessages.map((m, idx) => {
              const isOwner = !m.isFromAdmin;
              return (
                <div
                  key={m.id || idx}
                  className={`flex flex-col ${isOwner ? 'items-end' : 'items-start'}`}
                >
                  <div className="flex items-center gap-1 text-[9px] text-neutral-400 mb-1 px-1">
                    <span>{isOwner ? (currentUser?.username || 'ผู้เยี่ยมชม') : 'แอดมินสูงสุด Poei'}</span>
                    <span>•</span>
                    <span>{m.time}</span>
                  </div>
                  <div
                    className={`max-w-[85%] text-xs px-3.5 py-2.5 rounded-2xl leading-relaxed shadow-xs ${
                      isOwner
                        ? 'bg-gradient-to-r from-neutral-950 to-neutral-900 border border-gold-400/20 text-white rounded-tr-none'
                        : 'bg-white text-neutral-800 border border-neutral-100 rounded-tl-none'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{m.text}</p>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

          {/* Form Action Input */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-100 flex gap-2 shrink-0">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="พิมพ์คำถามทิ้งไว้ แอดมินจะตอบกลับสดทันที..."
              className="flex-1 border border-neutral-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 rounded-lg text-xs px-3 outline-none transition-all placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="p-2.5 rounded-lg bg-neutral-900 border border-gold-400 hover:bg-neutral-850 text-gold-400 shadow cursor-pointer transition-transform active:scale-95 duration-100"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
