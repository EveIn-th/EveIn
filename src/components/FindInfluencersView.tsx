import React, { useState } from 'react';
import { Search, Eye, Filter, Sparkles, MessageSquare, ShieldCheck, Mail, Phone, Landmark, ExternalLink, HelpCircle } from 'lucide-react';
import { User } from '../types';

interface FindInfluencersViewProps {
  influencers: User[];
  currentUser: User | null;
  triggerToast: (msg: string, status: 'success' | 'info' | 'warning') => void;
  setChatWithUser: (userId: string | null) => void;
  setChatOpen: (open: boolean) => void;
}

export default function FindInfluencersView({
  influencers,
  currentUser,
  triggerToast,
  setChatWithUser,
  setChatOpen,
}: FindInfluencersViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter states
  const [filterGender, setFilterGender] = useState('ทั้งหมด');
  const [filterAge, setFilterAge] = useState('ทั้งหมด');
  const [filterFollowersTier, setFilterFollowersTier] = useState('ทั้งหมด');
  const [filterPlatform, setFilterPlatform] = useState('ทั้งหมด');
  
  // Custom followers ranges
  const [minFollowers, setMinFollowers] = useState('');
  const [maxFollowersInput, setMaxFollowersInput] = useState('');

  // Selected influencer for VIP Profile Overview
  const [selectedInfluencer, setSelectedInfluencer] = useState<User | null>(null);

  // Filter implementation
  const filteredInfluencers = influencers.filter(inf => {
    // 1. Search term (nickname or bio)
    const matchesSearch = inf.username.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (inf.bio && inf.bio.toLowerCase().includes(searchTerm.toLowerCase()));
    if (!matchesSearch) return false;

    // 2. Gender filter
    if (filterGender !== 'ทั้งหมด' && inf.gender !== filterGender) return false;

    // 3. Age filter
    if (filterAge !== 'ทั้งหมด') {
      if (filterAge === '18-23' && (inf.age < 18 || inf.age > 23)) return false;
      if (filterAge === '24-30' && (inf.age < 24 || inf.age > 30)) return false;
      if (filterAge === '31-45' && (inf.age < 31 || inf.age > 45)) return false;
      if (filterAge === '45-60' && (inf.age < 45 || inf.age > 60)) return false;
    }

    // Determine the highest follower count among all socials of this user
    const maxLocalFollowers = Math.max(...(inf.socials || []).map(s => s.followers), 0);

    // 4. Followers tier filter (Multi-level search)
    if (filterFollowersTier !== 'ทั้งหมด') {
      if (filterFollowersTier === 'nano' && (maxLocalFollowers < 1000 || maxLocalFollowers > 10000)) return false;
      if (filterFollowersTier === 'micro' && (maxLocalFollowers < 10000 || maxLocalFollowers > 50000)) return false;
      if (filterFollowersTier === 'mid' && (maxLocalFollowers < 50000 || maxLocalFollowers > 100000)) return false;
      if (filterFollowersTier === 'macro' && (maxLocalFollowers < 100000 || maxLocalFollowers > 300000)) return false;
      if (filterFollowersTier === 'premium_macro' && (maxLocalFollowers < 300000 || maxLocalFollowers > 1000000)) return false;
      if (filterFollowersTier === 'mega' && maxLocalFollowers < 1000000) return false;
    }

    // Custom followers inputs
    if (minFollowers.trim() !== '') {
      const minVal = parseInt(minFollowers);
      if (!isNaN(minVal) && maxLocalFollowers < minVal) return false;
    }
    if (maxFollowersInput.trim() !== '') {
      const maxVal = parseInt(maxFollowersInput);
      if (!isNaN(maxVal) && maxLocalFollowers > maxVal) return false;
    }

    // 5. platform filter
    if (filterPlatform !== 'ทั้งหมด') {
      const matchesPlatform = (inf.socials || []).some(s => s.platform === filterPlatform);
      if (!matchesPlatform) return false;
    }

    return true;
  });

  const getFollowersFormat = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M ผู้ติดตาม`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K ผู้ติดตาม`;
    return `${num} ผู้ติดตาม`;
  };

  const handleContactChat = (inf: User) => {
    if (!currentUser) {
      triggerToast('กรุณาเข้าสู่ระบบก่อนเพื่อทำการคุยแชทกับอินฟลูเอนเซอร์ค่ะ', 'warning');
      return;
    }
    setChatWithUser(inf.id);
    setChatOpen(true);
    triggerToast(`เปิดหน้าต่างแชทเพื่อพูดคุยสิทธิพิเศษกับเรียบร้อยแล้วค่ะ`, 'info');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Page Header */}
      <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/20 luxury-shadow space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#B8860B] animate-spin" />
              <span className="text-[10px] tracking-[0.2em] text-[#B8860B] font-bold uppercase font-sans">
                Curated Premium KOL Database
              </span>
            </div>
            <h1 className="font-sans text-2xl sm:text-3xl font-light text-neutral-900">
              ค้นหา<span className="font-bold">อินฟลูเอนเซอร์ / KOL</span>
            </h1>
            <p className="text-xs text-neutral-400 font-light uppercase tracking-wider">
              ค้นพบคอนเซปต์ครีเอเตอร์สายระดับสูง แฟชั่น บิวตี้ ครีมบำรุงผิว และอารมณ์สุนทรีย์ อัปเดตล่าสุด
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid: Filters Sidebar + Results Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Panel left */}
        <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/20 space-y-5 h-fit luxury-shadow">
          <div className="flex gap-2 items-center pb-3 border-b border-neutral-100">
            <Filter className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-900 uppercase">กรองครีเอเตอร์</span>
          </div>

          {/* Filter: Gender */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">เพศวิถี</label>
            <select
              value={filterGender}
              onChange={e => setFilterGender(e.target.value)}
              className="w-full px-2.5 py-2 border border-neutral-150 rounded text-xs outline-none bg-white font-prompt"
            >
              <option value="ทั้งหมด">ทั้งหมดทุกเพศ</option>
              <option value="Female">ผู้หญิง (Female)</option>
              <option value="Male">ผู้ชาย (Male)</option>
              <option value="LGBTQ">ความหลากหลายทางเพศ (LGBTQ+)</option>
            </select>
          </div>

          {/* Filter: Age */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">ช่วงอายุ</label>
            <select
              value={filterAge}
              onChange={e => setFilterAge(e.target.value)}
              className="w-full px-2.5 py-2 border border-neutral-150 rounded text-xs outline-none bg-white font-prompt"
            >
              <option value="ทั้งหมด">ทั้งหมดทุกอายุ</option>
              <option value="18-23">18 - 23 ปี (วัยนักศึกษา/KOL รุ่นใหม่)</option>
              <option value="24-30">24 - 30 ปี (วัยเริ่มทำงาน/Lifestyle)</option>
              <option value="31-45">31 - 45 ปี (วัยภูมิฐาน/ความลักชัวรี่)</option>
              <option value="45-60">45 - 60 ปี (วัยอาวุโสพรีเมียม)</option>
            </select>
          </div>

          {/* Filter: Followers Tier Multi-level */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">ระดับยอดผู้ติดตาม (Followers Tier)</label>
            <select
              value={filterFollowersTier}
              onChange={e => setFilterFollowersTier(e.target.value)}
              className="w-full px-2.5 py-2 border border-neutral-150 rounded text-xs outline-none bg-white font-prompt"
            >
              <option value="ทั้งหมด">ทั้งหมด (ทุกเทียร์)</option>
              <option value="nano">Nano-Influencer (1,000 - 10,000 ฟอล)</option>
              <option value="micro">Micro-Influencer (10,000 - 50,000 ฟอล)</option>
              <option value="mid">Mid-tier Influencer (50,000 - 100,000 ฟอล)</option>
              <option value="macro">Macro-Influencer (100,000 - 300,000 ฟอล)</option>
              <option value="premium_macro">Premium Macro (300,000 - 1,000,000 ฟอล)</option>
              <option value="mega">Mega-Influencer (1,000,000+ ฟอลขึ้นไป)</option>
            </select>
          </div>

          {/* Filter: Custom Followers Range */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-100">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">ช่วงผู้ติดตามระบุเอง</label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[9px] text-neutral-400">ขั้นต่ำ (คน)</span>
                <input
                  type="number"
                  value={minFollowers}
                  onChange={e => setMinFollowers(e.target.value)}
                  placeholder="เช่น 1000"
                  className="w-full p-2 border border-neutral-200 rounded text-xs outline-none bg-white focus:border-[#D4AF37]"
                />
              </div>
              <div>
                <span className="text-[9px] text-neutral-400">สูงสุด (คน)</span>
                <input
                  type="number"
                  value={maxFollowersInput}
                  onChange={e => setMaxFollowersInput(e.target.value)}
                  placeholder="เช่น 50000"
                  className="w-full p-2 border border-neutral-200 rounded text-xs outline-none bg-white focus:border-[#D4AF37]"
                />
              </div>
            </div>
          </div>

          {/* Filter: Main Platform */}
          <div className="space-y-1.5 pt-2 border-t border-neutral-100">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">แพลตฟอร์มหลัก</label>
            <select
              value={filterPlatform}
              onChange={e => setFilterPlatform(e.target.value)}
              className="w-full px-2.5 py-2 border border-[#D4AF37]/20 rounded text-xs outline-none bg-white"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="Tiktok">Tiktok</option>
              <option value="Instagram">Instagram</option>
              <option value="Facebook">Facebook</option>
              <option value="YouTube">YouTube</option>
            </select>
          </div>

        </div>

        {/* Results Page right */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>พบดาวเด่นทั้งหมด {filteredInfluencers.length} คน</span>
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterGender('ทั้งหมด');
                setFilterAge('ทั้งหมด');
                setFilterFollowersTier('ทั้งหมด');
                setFilterPlatform('ทั้งหมด');
                setMinFollowers('');
                setMaxFollowersInput('');
              }}
              className="text-gold-600 hover:underline"
            >
              เคลียร์ทั้งหมด
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {filteredInfluencers.length === 0 ? (
              <div className="col-span-1 sm:col-span-2 text-center py-16 bg-white rounded-3xl border border-neutral-100 p-8 space-y-3">
                <p className="text-sm font-medium text-neutral-500">ไม่พบครีเอเตอร์ที่ตรงตามสเปกตัวกรองของคุณในขณะนี้</p>
                <p className="text-xs text-neutral-400">คุณสามารถเริ่มต้นโดยสร้างโปรไฟล์ครีเอเตอร์ของคุณเองได้ค่ะ!</p>
              </div>
            ) : (
              filteredInfluencers.map((inf) => (
                <div
                  key={inf.id}
                  className="bg-white rounded-3xl border border-[#D4AF37]/10 hover:border-[#D4AF37]/35 overflow-hidden flex flex-col justify-between p-6 transition-all duration-500 luxury-shadow"
                >
                  <div className="space-y-4">
                    {/* Photo & Handle Info */}
                    <div className="flex gap-4 items-center">
                      <img
                        src={inf.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                        alt={inf.username}
                        className="w-14 h-14 rounded-full border border-[#D4AF37]/30 p-0.5 object-cover shrink-0"
                      />

                      <div>
                        <h3 className="font-sans text-base font-semibold text-neutral-900 flex items-center gap-1.5">
                          <span>@{inf.username}</span>
                          <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-medium uppercase tracking-wider">
                          เพศ {inf.gender === 'Female' ? 'หญิง' : inf.gender === 'Male' ? 'ชาย' : 'LGBTQ'} • อายุ {inf.age} ปี • กทม. และปริมณฑล
                        </p>
                      </div>
                    </div>

                    {/* BIO summary */}
                    <p className="text-xs text-neutral-500 leading-relaxed font-light line-clamp-2">
                      {inf.bio || 'ครีเอเตอร์แฟชั่นและลักชัวรี่ไลฟ์สไตล์ผู้เป็นพันธมิตรของ EveIn'}
                    </p>

                    {/* Categories Tags */}
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {(inf.workCategories || ['ความงาม', 'ทั่วไป']).map(cat => (
                        <span key={cat} className="px-3 py-1 rounded-full bg-neutral-50 text-[9px] text-[#B8860B] font-bold uppercase tracking-wider border border-neutral-100">
                          {cat}
                        </span>
                      ))}
                    </div>

                    {/* Social media listings with follower targets */}
                    <div className="space-y-1.5 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100">
                      <span className="block text-[8px] font-bold text-[#B8860B] tracking-widest uppercase mb-1.5">
                        ช่องทางและสถิติผู้ติดตาม
                      </span>
                      {(inf.socials || []).map((s, idx) => (
                        <div key={idx} className="flex justify-between items-center text-[10px] py-1 border-b border-neutral-100 last:border-0 pb-1 flex-wrap gap-1">
                          <span className="text-neutral-500 font-semibold flex items-center gap-1.5 animate-in fade-in">
                            <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                            <span className="font-extrabold uppercase text-[9px] bg-neutral-200/60 px-1 py-0.2 rounded">{s.platform}</span>
                            <span className="text-neutral-900 font-bold">{s.handle}</span>
                            {s.url ? (
                              <a
                                href={s.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5 text-[9.5px] font-normal"
                              >
                                <span>(ลิงก์)</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            ) : (
                              <span className="text-neutral-300 text-[9px]">(ไม่มีลิงก์)</span>
                            )}
                          </span>
                          <span className="text-neutral-600 text-[10px] font-semibold font-mono">
                            {(s.followers || 0).toLocaleString()} ฟอล
                          </span>
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Control elements */}
                  <div className="pt-4 mt-6 border-t border-neutral-100 flex gap-2 justify-end">
                    <button
                      onClick={() => handleContactChat(inf)}
                      className="p-2.5 border border-neutral-200 hover:border-[#D4AF37] hover:bg-[#D4AF37]/5 rounded-full transition-all text-neutral-600 hover:text-[#B8860B] cursor-pointer"
                      title="เริ่มแชทขอข้อตกลงพิเศษ"
                    >
                      <MessageSquare className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => setSelectedInfluencer(inf)}
                      className="px-4 py-2.5 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37]/35 text-xs font-bold tracking-wide hover:bg-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer"
                    >
                      ดูข้อมูลอินฟลู
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

      {/* VIP Profile Showcase Modal (Strict privacy, only showing requested information) */}
      {selectedInfluencer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border-2 border-[#D4AF37] overflow-hidden transform animate-in fade-in-50 zoom-in-95 font-sans">
            
            {/* Elegant Header */}
            <div className="bg-neutral-950 p-4 border-b border-[#D4AF37] flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#D4AF37] animate-pulse" />
                <span className="font-serif text-xs font-bold text-white tracking-widest uppercase">ข้อมูลโปรไฟล์อินฟลูเอนเซอร์</span>
              </div>
              <button
                onClick={() => setSelectedInfluencer(null)}
                className="px-2.5 py-1 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                ปิด
              </button>
            </div>
 
            <div className="p-6 space-y-5">
              
              <div className="flex gap-4 items-center pb-3 border-b border-neutral-100">
                <img
                  src={selectedInfluencer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                  alt={selectedInfluencer.username}
                  className="w-14 h-14 rounded-full border-2 border-[#D4AF37] object-cover shrink-0"
                />
                <div>
                  <h3 className="font-serif text-base font-bold text-neutral-900">@{selectedInfluencer.username}</h3>
                  <p className="text-[10px] text-neutral-400 font-medium">เพศ {selectedInfluencer.gender === 'Female' ? 'หญิง' : selectedInfluencer.gender === 'Male' ? 'ชาย' : 'LGBTQ'} • อายุ {selectedInfluencer.age} ปี</p>
                </div>
              </div>
 
              {/* BIO */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-[#B8860B] font-bold block">คำอธิบายเกี่ยวกับอินฟลูเอนเซอร์</span>
                <p className="text-xs text-neutral-700 leading-relaxed font-light whitespace-pre-wrap">{selectedInfluencer.bio || 'ไม่มีคำอธิบายเพิ่มเติมค่ะ'}</p>
              </div>

              {/* Categories */}
              <div className="space-y-1.5">
                <span className="text-[9px] uppercase tracking-wider text-[#B8860B] font-bold block">หมวดหมู่ที่รับงานรีวิวหรือประเภทงานดีล</span>
                <div className="flex flex-wrap gap-1.5 pt-0.5">
                  {(selectedInfluencer.workCategories || ['ทั่วไป']).map(cat => (
                    <span key={cat} className="px-2.5 py-1 rounded bg-neutral-100 text-[10px] text-neutral-700 font-semibold border border-neutral-200">
                      {cat}
                    </span>
                  ))}
                </div>
              </div>

              {/* Platforms & Links */}
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <span className="text-[9px] uppercase tracking-wider text-[#B8860B] font-bold block">ช่องทางแพลตฟอร์มและลิงก์ติดต่อ</span>
                <div className="space-y-2">
                  {(!selectedInfluencer.socials || selectedInfluencer.socials.length === 0) ? (
                    <p className="text-xs text-neutral-400 italic">ไม่ได้ลงทะเบียนช่องทางไซเบอร์ไว้ค่ะ</p>
                  ) : (
                    selectedInfluencer.socials.map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center text-xs bg-neutral-50 px-3 py-2 rounded-xl border border-neutral-150">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-neutral-950 bg-[#D4AF37]/20 px-1.5 py-0.5 rounded text-[8px] uppercase">{s.platform}</span>
                          <span className="font-bold text-neutral-800">{s.handle}</span>
                          {s.url ? (
                            <a
                              href={s.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline inline-flex items-center gap-0.5 text-[11px]"
                            >
                              <span>(ลิงก์ไปยัง {s.platform})</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="text-neutral-300 text-[10px] italic">(ไม่มีลิงก์)</span>
                          )}
                        </div>
                        <span className="text-neutral-600 text-[10.5px] font-semibold">
                          {(s.followers || 0).toLocaleString()} ฟอล
                        </span>
                      </div>
                    ))
                  )}
                </div>
              </div>
 
              {/* Action buttons */}
              <div className="pt-2 border-t border-neutral-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedInfluencer(null)}
                  className="px-4 py-2 border border-neutral-200 hover:bg-neutral-50 rounded-lg text-xs text-neutral-500 cursor-pointer"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const recipient = selectedInfluencer;
                    setSelectedInfluencer(null);
                    handleContactChat(recipient);
                  }}
                  className="px-5 py-2 bg-neutral-950 border border-gold-400 text-[#D4AF37] hover:text-white rounded-lg text-xs font-bold hover:bg-neutral-900 transition-colors cursor-pointer"
                >
                  เริ่มแชทคุยดีลงาน
                </button>
              </div>
 
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
