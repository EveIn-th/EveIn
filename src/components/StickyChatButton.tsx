import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { User } from '../types';

interface StickyChatButtonProps {
  currentUser: User | null;
}

export default function StickyChatButton({ currentUser }: StickyChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'admin'; text: string; time: string }>>([
    {
      sender: 'admin',
      text: 'สวัสดีค่ะ ยินดีต้อนรับสู่ EveIn Concierge Service ทีมผู้ดูแลระดับสูงของเราพร้อมบริการแก้ไขข้อสังสัยและช่วยเหลือในการประกาศงาน/รับสมัครงาน ตลอด 24 ชั่วโมงค่ะ สามารถพิมพ์สอบถามได้เลยนะคะ ✨',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg = inputText;
    setInputText('');

    const newMsgs = [
      ...messages,
      {
        sender: 'user' as const,
        text: userMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
    setMessages(newMsgs);

    // Trigger luxurious auto-reply based on custom keyword checks
    setIsTyping(true);
    setTimeout(() => {
      let reply = 'ทางเราได้รับข้อความของท่านแล้วค่ะ เจ้าหน้าที่ฝ่ายบุคคลด้านความร่วมมือกับแบรนด์ลักชัวรี่ได้รับเรื่องแล้ว และจะติดต่อกลับท่านผ่านแชทหลักโดยทีมผู้ชำนาญการค่ะ มีส่วนไหนให้ช่วยเหลือเพิ่มเติมไหมคะ?';
      
      const lower = userMsg.toLowerCase();
      if (lower.includes('งาน') || lower.includes('จ้าง') || lower.includes('จัดจ้าง')) {
        reply = 'สำหรับการประกาศงานจ้างรีวิวสินค้า แบรนด์ของคุณสามารถเข้าสู่ระบบและกดปุ่ม "ประกาศงานจ้าง" ในหน้า "งานรีวิว" ได้ทันทีค่ะ โดยระบบจะรองรับตัวเลือก 77 จังหวัด ฟิลเตอร์เพศ และมีระบบคิดภาษี ณ ที่จ่าย 7% ให้อัตโนมัติค่ะ';
      } else if (lower.includes('สมัคร') || lower.includes('อินฟลู') || lower.includes('สมัครงาน')) {
        reply = 'หากท่านเป็นอินฟลูเอนเซอร์ ท่านสามารถกดสมัครเป็นสมาชิก โดยสามารถแนบประวัติส่วนตัว ช่องทางโซเชียลมีเดียพร้อมผู้ใช้งานเพื่อรับงานได้ทันทีค่ะ ข้อมูลการเงินของท่านจะถูกซ่อนไว้เพื่อความปลอดภัยลักชัวรี่สูงสุดค่ะ';
      } else if (lower.includes('ลืมรหัสผ่าน') || lower.includes('รหัสผ่าน')) {
        reply = 'ท่านต้องการกู้คืนรหัสผ่านใช่หรือไม่คะ? กรุณาระบุอีเมล์หรือเบอร์โทรศัพท์ที่ใช้ลงทะเบียน เพื่อให้ฝ่ายเจ้าหน้าที่เทคนิคทำการตรวจสอบและส่งลิงก์การตั้งรหัสผ่านใหม่ให้ท่านโดยด่วนที่สุดภายใน 5 นาทีค่ะ';
      } else if (lower.includes('เงิน') || lower.includes('ชำระ') || lower.includes('จ่ายเงิน')) {
        reply = 'ระบบชำระเงินของ EveIn ดำเนินการผ่าน QR Code ปลอดภัยแบบเรียลไทม์ พร้อมการหักยอดภาษีที่ถูกต้อง หากแนบหลักฐานสลิปโอนเงินเสร็จสิ้น เจ้าหน้าที่จะตรวจเช็คและอนุมัติรายรับให้แก่อินฟลูเอนเซอร์ในทันทีค่ะ';
      }

      setMessages(prev => [
        ...prev,
        {
          sender: 'admin' as const,
          text: reply,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <>
      {/* Absolute floating button */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 hover:to-amber-700 text-white rounded-full shadow-2xl hover:shadow-gold-500/30 transition-all transform hover:scale-105 active:scale-95 duration-200 cursor-pointer ${
            isOpen ? 'rotate-90 bg-neutral-900 border border-gold-300' : ''
          }`}
          aria-label="ติดต่อเจ้าหน้าที่ช่วยเหลือ"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-white" />
          ) : (
            <div className="flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cream-100 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <MessageSquare className="w-5 h-5" />
              <span className="text-xs font-medium font-prompt tracking-wider hidden sm:inline">ติดต่อแอดมิน</span>
            </div>
          )}
        </button>
      </div>

      {/* Floating Chat Panel Widget */}
      {isOpen && (
        <div className="fixed bottom-22 right-6 w-[365px] h-[520px] bg-white rounded-2xl shadow-2xl border border-gold-200/60 z-50 overflow-hidden flex flex-col font-sans transition-all transform animate-in fade-in-50 slide-in-from-bottom-5">
          
          {/* Elite Header */}
          <div className="bg-neutral-950 p-4 border-b border-gold-400 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full border border-gold-400 bg-neutral-900 flex items-center justify-center relative">
                <Sparkles className="w-4.5 h-4.5 text-gold-400" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-neutral-950"></span>
              </div>
              <div>
                <h4 className="text-xs font-semibold text-white tracking-widest font-serif">EveIn Concierge</h4>
                <p className="text-[9px] text-gold-400 font-light">ช่วยเหลือและดูแลระบบเรียลไทม์ (24hr)</p>
              </div>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Guidelines Notice */}
          <div className="bg-gold-50/50 px-3 py-2 border-b border-gold-100 text-[10px] text-gold-800 flex gap-1.5 items-center">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-gold-600" />
            <span>ช่องทางช่วยเหลือพิเศษสำหรับแบรนด์และครีเอเตอร์ทั่วไป สดตรง</span>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50/50">
            {messages.map((m, idx) => (
              <div
                key={idx}
                className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div className="flex items-center gap-1 text-[9px] text-neutral-400 mb-1 px-1">
                  <span>{m.sender === 'user' ? (currentUser?.username || 'ผู้เยี่ยมชม') : 'เจ้าหน้าที่ EveIn'}</span>
                  <span>•</span>
                  <span>{m.time}</span>
                </div>
                <div
                  className={`max-w-[85%] text-xs px-3.5 py-2.5 rounded-2xl leading-relaxed shadow-sm ${
                    m.sender === 'user'
                      ? 'bg-gradient-to-r from-gold-500 to-amber-600 text-white rounded-tr-none'
                      : 'bg-white text-neutral-800 border border-neutral-100 rounded-tl-none'
                  }`}
                >
                  <p>{m.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex flex-col items-start font-prompt">
                <div className="text-[9px] text-neutral-400 mb-1">เจ้าหน้าที่กำลังร่วมพิมพ์...</div>
                <div className="bg-white px-3 py-2 rounded-2xl border border-neutral-100 rounded-tl-none flex gap-1 items-center">
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-gold-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input Area */}
          <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-neutral-100 flex gap-2">
            <input
              type="text"
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder="พิมพ์ข้อความสอบถามที่นี่..."
              className="flex-1 border border-neutral-200 focus:border-gold-400 focus:ring-1 focus:ring-gold-400 rounded-lg text-xs px-3 outline-none transition-all placeholder:text-neutral-400"
            />
            <button
              type="submit"
              className="p-2.5 rounded-lg bg-neutral-900 border border-gold-400 hover:bg-neutral-800 text-gold-400 shadow transition-all shrink-0 cursor-pointer"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>
      )}
    </>
  );
}
