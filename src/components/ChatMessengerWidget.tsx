import React, { useState, useEffect, useRef } from 'react';
import { Send, X, ShieldCheck, Sparkles, AlertCircle, MessageSquare, Users, ChevronRight } from 'lucide-react';
import { User, LiveMessage } from '../types';

interface ChatMessengerWidgetProps {
  currentUser: User | null;
  chatWithUserId: string | null;
  onClose: () => void;
  allUsers: User[];
  triggerToast: (msg: string, status: 'success' | 'info' | 'warning') => void;
}

export default function ChatMessengerWidget({
  currentUser,
  chatWithUserId,
  onClose,
  allUsers,
  triggerToast,
}: ChatMessengerWidgetProps) {
  
  const [activeRecipientId, setActiveRecipientId] = useState<string>(chatWithUserId || '');
  const [activeTab, setActiveTab] = useState<'chat' | 'contacts'>('chat');
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load and remember message history from local storage
  const [allMessages, setAllMessages] = useState<LiveMessage[]>(() => {
    const saved = localStorage.getItem('evein_chat_history_v2');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Sync to local storage on changes
  useEffect(() => {
    localStorage.setItem('evein_chat_history_v2', JSON.stringify(allMessages));
  }, [allMessages]);

  // Sync active recipient from props when changed by parent
  useEffect(() => {
    if (chatWithUserId) {
      setActiveRecipientId(chatWithUserId);
      setActiveTab('chat');
    }
  }, [chatWithUserId]);

  const currentRecipient = allUsers.find(u => u.id === activeRecipientId);

  // Auto scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [allMessages, isTyping, activeRecipientId, activeTab]);

  if (!currentUser) return null;

  // Filter possible chat partners - only showing users who have a message history or is the current active recipient.
  const eligiblePartners = allUsers.filter(u => {
    if (u.id === currentUser.id) return false;
    
    // Check if there's any genuine messaging history between the current user and this partner
    const hasHistory = allMessages.some(
      m => (m.senderId === currentUser.id && m.receiverId === u.id) ||
           (m.senderId === u.id && m.receiverId === currentUser.id)
    );
    
    const isCurrentlySelected = u.id === chatWithUserId || u.id === activeRecipientId;
    
    return hasHistory || isCurrentlySelected;
  });

  // Obtain active messages for current dialog (genuine messages only, no auto seed generator)
  const getActiveConversationMessages = () => {
    if (!currentRecipient) return [];
    
    return allMessages.filter(
      m => (m.senderId === currentUser.id && m.receiverId === currentRecipient.id) ||
           (m.senderId === currentRecipient.id && m.receiverId === currentUser.id)
    );
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentRecipient) return;

    const sentText = inputText;
    setInputText('');

    const newMsg: LiveMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.brandName || currentUser.username,
      receiverId: currentRecipient.id,
      content: sentText,
      timestamp: new Date().toISOString()
    };

    setAllMessages(prev => [...prev, newMsg]);
    // NO automatic replies or timeouts here. Users only communicate with real responses.
  };

  const conversationMessages = getActiveConversationMessages();

  return (
    <div className="fixed bottom-22 right-6 w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl border-2 border-gold-300 z-50 overflow-hidden flex flex-col font-sans transition-all animate-in fade-in zoom-in-95">
      
      {/* Persistent Widget Header with Close Button - satisfied: 'สามารถให้มีกดปุ่มปิดทุกอัน' */}
      <div className="bg-neutral-950 px-4 py-3 border-b border-[#D4AF37] flex items-center justify-between shrink-0 font-prompt">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-4 h-4 text-[#D4AF37]" />
          <span className="text-xs font-bold text-white tracking-wider">ห้องแชทข้อตกลงพิเศษ</span>
        </div>
        <button
          onClick={onClose}
          className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          title="ปิดหน้าต่างแชท"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      
      {/* Tab select bar */}
      <div className="bg-neutral-900 px-3/4 py-1.5 flex border-b border-gold-400">
        <button
          onClick={() => {
            if (currentRecipient) {
              setActiveTab('chat');
            } else {
              triggerToast('กรุณาเลือกผู้ใช้งานจากแท็บเพื่อเริ่มพูดคุยค่ะ', 'warning');
            }
          }}
          className={`flex-1 py-1 text-center text-[10px] font-bold tracking-wider rounded-md uppercase transition-colors flex justify-center items-center gap-1.5 ${
            activeTab === 'chat'
              ? 'bg-[#D4AF37] text-neutral-950 shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>แชทคุยงาน</span>
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={`flex-1 py-1 text-center text-[10px] font-bold tracking-wider rounded-md uppercase transition-colors flex justify-center items-center gap-1.5 ${
            activeTab === 'contacts'
              ? 'bg-[#D4AF37] text-neutral-950 shadow-md'
              : 'text-neutral-300 hover:bg-neutral-800'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>คุยหลายคน ({eligiblePartners.length})</span>
        </button>
      </div>

      {/* Main content dependent on tab */}
      {activeTab === 'contacts' ? (
        // CONTACTS SELECTION CONTAINER
        <div className="flex-1 overflow-y-auto bg-slate-50 p-4 space-y-3">
          <div className="space-y-1 pb-2 border-b border-neutral-100">
             <span className="text-[10px] uppercase font-bold text-neutral-500 tracking-wider">เลือกผู้ติดต่อคุยรายคน</span>
             <p className="text-[9px] text-neutral-400">สามารถสลับเปลี่ยนไปแชทและจดจำเนื้อหาไว้แยกของแต่ละคนได้เลยค่ะ</p>
          </div>
          
          <div className="space-y-2">
            {eligiblePartners.map(part => {
              // Count messages with this partner
              const count = allMessages.filter(
                m => (m.senderId === currentUser.id && m.receiverId === part.id) ||
                     (m.senderId === part.id && m.receiverId === currentUser.id)
              ).length;

              return (
                <button
                  key={part.id}
                  onClick={() => {
                    setActiveRecipientId(part.id);
                    setActiveTab('chat');
                    triggerToast(`เริ่มบทสนทนาที่จดจำไว้กับ @${part.username} ค่ะ`, 'info');
                  }}
                  className="w-full flex items-center justify-between p-3 bg-white hover:bg-gold-50/40 rounded-xl border border-neutral-150 transition-all text-left group"
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={part.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                        alt={part.username}
                        className="w-10 h-10 rounded-full border border-neutral-200 object-cover"
                      />
                      <span className="w-2.5 h-2.5 rounded-full bg-green-500 absolute bottom-0 right-0 border-2 border-white"></span>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-neutral-900 group-hover:text-[#B8860B] transition-colors truncate max-w-[150px]">
                        {part.brandName || part.username}
                      </h4>
                      <p className="text-[9px] text-neutral-400 capitalize">
                        {part.role === 'Admin' ? 'แอดมินสูงสุด' : part.role === 'Brand' ? 'แบรนด์ผู้ว่าจ้าง' : 'อินฟลูเอนเซอร์'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-2">
                    {count > 0 ? (
                      <span className="bg-[#D4AF37]/15 text-[#B8860B] text-[9px] px-2 py-0.5 rounded-full font-bold">
                        {count} แชทดั้งเดิม
                      </span>
                    ) : (
                      <span className="text-[9px] text-neutral-300">บอร์ดใหม่</span>
                    )}
                    <ChevronRight className="w-3.5 h-3.5 text-neutral-300" />
                  </div>
                </button>
              );
            })}

            {eligiblePartners.length === 0 && (
              <div className="text-center py-10 bg-white rounded-xl border border-neutral-200">
                <p className="text-xs text-neutral-400">ไม่พบคู่แชทอื่นพร้อมใช้งานในขณะนี้ค่ะ</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        // ACTIVE CHAT DIALOGUE CONTAINER
        <>
          {currentRecipient ? (
            <>
              {/* Active Recipient Header Info */}
              <div className="bg-neutral-950 p-3.5 border-b border-gold-300 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={currentRecipient.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                      alt={currentRecipient.username}
                      className="w-8 h-8 rounded-full border border-gold-400 object-cover"
                    />
                    <span className="w-2.5 h-2.5 rounded-full bg-green-500 absolute bottom-0 right-0 border border-neutral-950"></span>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white tracking-widest font-serif">
                      {currentRecipient.brandName || currentRecipient.username}
                    </h4>
                    <span className="text-[8px] text-gold-400 block font-light">
                      {currentRecipient.role === 'Brand' ? 'คู่สัญญาแบรนด์ผู้จ้าง' : 'คู่สัญญาอินฟลูเอนเซอร์'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="bg-amber-50/50 p-2 border-b border-gold-100 text-[9px] text-[#8C6026] flex gap-1 items-center px-3 justify-center shrink-0">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                <span>แชทหลายคนถูกจดจำข้อมูลแล้ว สามารถเปลี่ยนคนคุยทางปุ่ม แชทหลายคน</span>
              </div>

              {/* Chat bubble list scroll screen */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50">
                {conversationMessages.map((m) => (
                  <div
                    key={m.id}
                    className={`flex flex-col ${m.senderId === currentUser.id ? 'items-end' : 'items-start'}`}
                  >
                    <div className={`max-w-[85%] text-xs px-3.5 py-2.5 rounded-2xl leading-relaxed shadow-xs ${
                      m.senderId === currentUser.id
                        ? 'bg-neutral-900 border border-gold-400 text-gold-50 rounded-tr-none'
                        : 'bg-white text-neutral-800 border border-neutral-100 rounded-tl-none'
                    }`}>
                      <p className="whitespace-pre-wrap">{m.content}</p>
                    </div>
                    <span className="text-[8px] text-neutral-400 mt-1 px-1">
                      {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex gap-1 items-center p-2 bg-neutral-100 w-fit rounded-full px-4 text-[9px] text-neutral-400">
                    <span className="animate-pulse">กำลังพิมพ์ตอบสนองพิเศษ...</span>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Bottom Send Input panel */}
              <form onSubmit={handleSendMessage} className="p-2 border-t border-neutral-150 bg-white flex gap-1.5 shrink-0">
                <input
                  type="text"
                  value={inputText}
                  onChange={e => setInputText(e.target.value)}
                  placeholder="พิมพ์เพื่อปรึกษางานดีลเลอร์..."
                  className="flex-1 px-3 py-2 border border-neutral-200 focus:border-gold-400 rounded-lg text-xs outline-none"
                />
                <button
                  type="submit"
                  className="px-3 py-2 bg-neutral-950 border border-gold-400 text-gold-400 hover:text-white rounded-lg text-xs font-bold shrink-0 transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </>
          ) : (
            // No current chat recipient setup error
            <div className="flex-1 flex flex-col items-center justify-center p-6 text-center space-y-3 bg-slate-50">
              <MessageSquare className="w-10 h-10 text-neutral-300 animate-bounce" />
              <p className="text-xs text-neutral-500 font-semibold font-prompt">
                ยังไม่ได้เลือกห้องสนทนาหรือคู่สัญญากับฝ่ายตรงข้ามค่ะ
              </p>
              <button
                type="button"
                onClick={() => setActiveTab('contacts')}
                className="px-4 py-2 bg-black border border-gold-400 text-gold-400 rounded-full text-[10px] font-bold uppercase tracking-wider hover:bg-neutral-900 transition-all"
              >
                เลือกคนที่ต้องการสลับแชทหลายคน
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}
