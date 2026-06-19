import React, { useState, useEffect, useRef } from 'react';
import { Send, X, ShieldAlert, Sparkles, AlertCircle } from 'lucide-react';
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
  
  const recipient = allUsers.find(u => u.id === chatWithUserId);
  const [messages, setMessages] = useState<LiveMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load pre seeded discussion
  useEffect(() => {
    if (!currentUser || !recipient) return;

    const baseMsgs: LiveMessage[] = [
      {
        id: 'm1',
        senderId: recipient.id,
        senderName: recipient.brandName || recipient.username,
        receiverId: currentUser.id,
        content: `สวัสดีค่ะคุณ ${currentUser.username} ดีใจมากที่ให้ความสนใจแคมเปญงานของเรานะคะ ไม่ทราบว่ามีตรงสัดส่วนและเงื่อนไขไหนที่ต้องการปรับปรุงไหมคะ? ✨`,
        timestamp: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'm2',
        senderId: currentUser.id,
        senderName: currentUser.brandName || currentUser.username,
        receiverId: recipient.id,
        content: `สวัสดีค่ะ ยินดีเป็นอย่างยิ่งค่ะ! ฉันสามารถจัดเตรียมสื่อและทำวิดีโอ 1 นาทีลง TikTok และรีวิวภาพลง Instagram ให้สวยหรูเข้าธีมแบรนด์สปาทองคำได้เลยค่ะ`,
        timestamp: new Date(Date.now() - 1800000).toISOString()
      }
    ];

    setMessages(baseMsgs);
  }, [currentUser, recipient]);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  if (!currentUser || !recipient) return null;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const sentText = inputText;
    setInputText('');

    const newMsg: LiveMessage = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.brandName || currentUser.username,
      receiverId: recipient.id,
      content: sentText,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, newMsg]);

    // Simulate luxury auto-reply from candidate or brand
    setIsTyping(true);
    setTimeout(() => {
      let replyContent = 'เข้าใจขอบเขตงานทั้งหมดเรียบร้อยแล้วค่ะ! ฉันกำลังระเบียบผลิตงานลักชัวรี่ส่งแนบสลิปให้ตรวจในแดชบอร์ด EveIn นะคะ';
      
      const lower = sentText.toLowerCase();
      if (lower.includes('ราคา') || lower.includes('ต่อรอง') || lower.includes('บาท')) {
        replyContent = 'สำหรับยอดงบเสนอราคานี้ ถูกต้องและเหมาะสมตามมาตรการภาษีหัก ณ ที่จ่าย 7% แล้วค่ะ ยินดีร่วมงานอย่างยิ่งจ้ะ!';
      } else if (lower.includes('สลิป') || lower.includes('ชำระ') || lower.includes('จ่ายเงิน')) {
        replyContent = 'ขอบคุณมากค่ะสำหรับความว่องไว! ระบบตรวจแอนิเมชั่นสลิปของแอดมิน EveIn จะดำเนินการยืนยันเงินตรงเข้าบัญชีทันทีเลยค่ะ';
      } else if (lower.includes('แก้ไข') || lower.includes('ปรับปรุง') || lower.includes('แก้')) {
        replyContent = 'รับทราบฟีดแบคการแก้ไขค่ะ เดี๋ยวฉันจะแจ้งปรับมุมรับภาพวิดีโอ ท่าโพสสกินแคร์ และนำเสนอลิ้งค์ใหม่ในหน้า Dashboard ค่ะ';
      }

      const replyMsg: LiveMessage = {
        id: `msg_reply_${Date.now()}`,
        senderId: recipient.id,
        senderName: recipient.brandName || recipient.username,
        receiverId: currentUser.id,
        content: replyContent,
        timestamp: new Date().toISOString()
      };

      setMessages(prev => [...prev, replyMsg]);
      setIsTyping(false);
      triggerToast('ได้รับข้อความจากแชทคู่สัญญาเรียบร้อยค่ะ', 'info');
    }, 1500);
  };

  return (
    <div className="fixed bottom-22 right-6 sm:right-[400px] w-[350px] h-[480px] bg-white rounded-2xl shadow-2xl border-2 border-gold-300 z-50 overflow-hidden flex flex-col font-sans transition-all animate-in fade-in zoom-in-95">
      
      {/* Luxury Chat Header */}
      <div className="bg-neutral-950 p-4 border-b border-gold-400 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative">
            <img
              src={recipient.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
              alt={recipient.username}
              className="w-8 h-8 rounded-full border border-gold-400 object-cover"
            />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 absolute bottom-0 right-0 border-2 border-neutral-950"></span>
          </div>
          <div>
            <h4 className="text-xs font-bold text-white tracking-widest uppercase font-serif">
              {recipient.brandName || recipient.username}
            </h4>
            <span className="text-[8px] text-gold-400 block font-light">
              {recipient.role === 'Brand' ? 'คู่สัญญาแบรนด์วาจ้าง' : 'คู่สัญญาอินฟลูเอนเซอร์'}
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

      <div className="bg-amber-50/40 p-2 border-b border-gold-100 text-[9px] text-[#8C6026] flex gap-1 items-center px-3 justify-center">
        <AlertCircle className="w-3.5 h-3.5 shrink-0" />
        <span>สนทนาปรึกษางาน และต่อรองราคากรอกสลิปอย่างปลอดภัย</span>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3.5 bg-slate-50/50">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex flex-col ${m.senderId === currentUser.id ? 'items-end' : 'items-start'}`}
          >
            <div className={`max-w-[85%] text-xs px-3.5 py-2.5 rounded-2xl leading-relaxed shadow-sm ${
              m.senderId === currentUser.id
                ? 'bg-neutral-900 border border-gold-400 text-gold-50 rounded-tr-none'
                : 'bg-white text-neutral-800 border border-neutral-100 rounded-tl-none'
            }`}>
              <p>{m.content}</p>
            </div>
            <span className="text-[8px] text-neutral-400 mt-1 px-1">
              {new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
        ))}
        {isTyping && (
          <div className="flex gap-1 items-center p-2 bg-neutral-100 w-fit rounded-full px-4 text-[9px] text-neutral-400">
            <span>กำลังร่างแชท...</span>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Sender input */}
      <form onSubmit={handleSendMessage} className="p-2 border-t border-neutral-100 bg-white flex gap-1.5">
        <input
          type="text"
          value={inputText}
          onChange={e => setInputText(e.target.value)}
          placeholder="พิมพ์เพื่อส่งต่อข้อตกลง..."
          className="flex-1 px-3 py-1.5 border border-neutral-200 focus:border-gold-400 rounded-lg text-xs outline-none"
        />
        <button
          type="submit"
          className="px-3 py-1.5 bg-neutral-950 border border-gold-400 text-gold-450 hover:text-white rounded-lg text-xs font-bold"
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
      
    </div>
  );
}
