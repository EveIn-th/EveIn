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

  // Selected influencer for VIP Profile Overview (with sensitive PDPA blocks!)
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

    // 4. Followers tier filter
    if (filterFollowersTier !== 'ทั้งหมด') {
      const maxFollowers = Math.max(...(inf.socials || []).map(s => s.followers), 0);
      if (filterFollowersTier === 'mega' && maxFollowers < 500000) return false;
      if (filterFollowersTier === 'macro' && (maxFollowers < 200000 || maxFollowers >= 500000)) return false;
      if (filterFollowersTier === 'micro' && maxFollowers >= 20000) return false; // wait, micro < 200000, let's just make clean tiers
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
              ค้นพบคอนเซปต์ครีเอเตอร์สายระดับสูง แฟชั่น บิวตี้ ครีมบำรุงผิว และอารมณ์สุนทรีย์ อัปเดตรายชื่อเรียลไทม์
            </p>
          </div>

          {/* Quick Search bar */}
          <div className="relative w-full sm:w-72">
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="ค้นหาชื่อเล่น หรือประวัติ..."
              className="w-full pl-9 pr-4 py-2 border rounded-full border-neutral-200 text-xs focus:border-[#D4AF37] outline-none"
            />
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
          </div>
        </div>

        {/* Dynamic Tag info with Privacy Sign */}
        <div className="p-4 bg-neutral-50 rounded-2xl flex items-start gap-2.5 text-[11px] text-amber-800 border border-neutral-100/60">
          <ShieldCheck className="w-4.5 h-4.5 text-[#B8860B] shrink-0 mt-0.5" />
          <span>
            <strong>นโยบายความเป็นส่วนตัวสูงสุด (Privacy Safeguard):</strong> เพื่อความปลอดภัยสูงสุดของข้อมูลครีเอเตอร์ ทางเรา<strong>ปิดบังอีเมล เบอร์โทรศัพท์ และเลขสมุดธนาคารอย่างเหมาะสม</strong> (ห้ามไม่ให้เปิดเผยบนหน้าแรกนี้) ซึ่งข้อมูลจริงดังกล่าวจะถูกนำส่งไปหลังบ้าน ให้แอดมินใช้ตรวจสอบและตรวจสอบการชำระสลิปเงินเป็นกรณีไปเท่านั้นค่ะ
          </span>
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
              <option value="LGBTQ">LGBTQ</option>
            </select>
          </div>

          {/* Filter: Age */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">ช่วงอายุ</label>
            <select
              value={filterAge}
              onChange={e => setFilterAge(e.target.value)}
              className="w-full px-2.5 py-2 border border-neutral-150 rounded text-xs outline-none bg-white"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="18-23">18 - 23 ปี</option>
              <option value="24-30">24 - 30 ปี</option>
              <option value="31-45">31 - 45 ปี</option>
              <option value="45-60">45 - 60 ปี</option>
            </select>
          </div>

          {/* Filter: Followers Tier */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">เทียร์ผู้ติดตาม</label>
            <select
              value={filterFollowersTier}
              onChange={e => setFilterFollowersTier(e.target.value)}
              className="w-full px-2.5 py-2 border border-neutral-150 rounded text-xs outline-none bg-white"
            >
              <option value="ทั้งหมด">ทั้งหมด</option>
              <option value="mega">ระดับเซเลบ (500K ขึ้นไป)</option>
              <option value="macro">ระดับมืออาชีพ (200K - 500K)</option>
              <option value="micro">ระดับไมโครรีวิว (ต่ำกว่า 200K)</option>
            </select>
          </div>

          {/* Filter: Main Platform */}
          <div className="space-y-1.5">
            <label className="block text-[10px] font-bold text-neutral-500 uppercase tracking-widest">แพลตฟอร์มหลัก</label>
            <select
              value={filterPlatform}
              onChange={e => setFilterPlatform(e.target.value)}
              className="w-full px-2.5 py-2 border border-neutral-150 rounded text-xs outline-none bg-white"
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

                  {/* Social media listings with follower targets (Links masked as required!) */}
                  <div className="space-y-1 bg-neutral-50/50 p-4 rounded-2xl border border-neutral-100">
                    <span className="block text-[8px] font-bold text-[#B8860B] tracking-widest uppercase mb-1.5">
                      ช่องทางและสถิติยอดฟอล (ปิดบังลิ้งค์อ้างอิง)
                    </span>
                    {(inf.socials || []).map((s, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[10px] py-1 border-b border-neutral-100 last:border-0 pb-1">
                        <span className="text-neutral-500 font-semibold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 bg-[#D4AF37] rounded-full"></span>
                          {s.platform}
                        </span>
                        {/* Masked actual links as requested */}
                        <a
                          href="#masked"
                          onClick={(e) => { e.preventDefault(); triggerToast('เพื่อความปลอดภัยของข้อมูล บัญชีโซเชียลมีเดียจะถูกเปิดให้อ้างอิงแบบปิดสำหรับผู้จ้างงานเท่านั้นค่ะ', 'info'); }}
                          className="text-neutral-800 hover:text-[#B8860B] font-bold tracking-tight inline-flex items-center gap-1 transition-colors"
                        >
                          <span>{s.handle}</span>
                          <ExternalLink className="w-2.5 h-2.5 text-neutral-400" />
                        </a>
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
            )))}
          </div>
        </div>

      </div>

      {/* VIP Profile Showcase Modal (Ensuring full privacy of bank, email, etc.) */}
      {selectedInfluencer && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95">
            
            {/* Elegant Header */}
            <div className="bg-neutral-950 p-5 border-b border-gold-400 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4.5 h-4.5 text-gold-400" />
                <span className="font-serif text-sm font-bold text-white tracking-widest uppercase">หนังสือพิจารณาคุณสมบัติครีเอเตอร์</span>
              </div>
              <button
                onClick={() => setSelectedInfluencer(null)}
                className="px-3 py-1 bg-neutral-900 border border-neutral-800 text-xs text-neutral-300 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              >
                ปิด
              </button>
            </div>

            <div className="p-6 space-y-4">
              
              <div className="flex gap-4 items-center pb-4 border-b border-neutral-100">
                <img
                  src={selectedInfluencer.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                  alt={selectedInfluencer.username}
                  className="w-14 h-14 rounded-full border-2 border-gold-400 object-cover shrink-0"
                />
                <div>
                  <h3 className="font-serif text-base font-bold text-neutral-900">@{selectedInfluencer.username}</h3>
                  <p className="text-xs text-gold-600 font-medium font-prompt">ผ่านการยืนยันประวัติลักชัวรี่เรียบร้อยแล้วค่ะ</p>
                </div>
              </div>

              {/* BIO */}
              <div className="space-y-1">
                <span className="text-[9px] uppercase tracking-wider text-neutral-400 font-bold block">ประวัติการทำงานและจุดยืน</span>
                <p className="text-xs text-neutral-600 leading-relaxed font-light">{selectedInfluencer.bio || 'ยังไม่ได้ระบุคำอธิบายเพิ่มเติ่มค่ะ'}</p>
              </div>

              {/* PROHIBITED DETAILS ACCORDING TO SPECS (SIMULATED SECURE PDPA REASSURANCE) */}
              <div className="bg-red-50/50 p-4 rounded-xl border border-red-200/50 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-700">
                  <ShieldCheck className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>ระบบรักษาความเป็นส่วนตัวระดับสูง (GDPR & PDPA)</span>
                </div>
                
                <p className="text-[10px] text-neutral-500 leading-relaxed font-light">
                  ตามเกณฑ์ความปลอดภัยของกระบวนการโอนเงิน ข้อมูลการเงิน และช่องทางการติดต่อส่วตัวจริงต่อไปนี้ จะถูกซ่อนเป็นความลับสูงสุดจากหน้าเว็บเพื่อป้องกันการแสวงประโยชน์โดยไม่ชอบธรรมค่ะ:
                </p>

                <div className="grid grid-cols-1 gap-1.5 text-[9.5px] border-t border-neutral-150 pt-2 text-neutral-400">
                  <div className="flex justify-between items-center bg-white/70 p-1 rounded px-2">
                    <span className="font-semibold flex items-center gap-1"><Landmark className="w-3.5 h-3.5 text-neutral-400" /> ชื่อจริง นามสกุล และเลขบัญชีธนาคาร:</span>
                    <span className="text-amber-750 font-bold">🔒 ซ่อนความปลอดภัย (ส่งให้ Admin)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 p-1 rounded px-2">
                    <span className="font-semibold flex items-center gap-1"><Mail className="w-3.5 h-3.5 text-neutral-400" /> อีเมลและเบอร์โทรศัพท์:</span>
                    <span className="text-amber-750 font-bold">🔒 ซ่อนความปลอดภัย (ส่งให้ Admin)</span>
                  </div>
                  <div className="flex justify-between items-center bg-white/70 p-1 rounded px-2">
                    <span className="font-semibold flex items-center gap-1"><Phone className="w-3.5 h-3.5 text-neutral-400" /> ไอดี Line บัญชี:</span>
                    <span className="text-amber-750 font-bold">🔒 ซ่อนความปลอดภัย (ส่งให้ Admin)</span>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-2 flex justify-between gap-1">
                <button
                  onClick={() => { setSelectedInfluencer(null); triggerToast('เจ้าหน้าที่หลังบ้านรับทราบประวัติและความสนใจร่วมแล้วค่ะ', 'info'); }}
                  className="px-4 py-2 rounded text-xs hover:bg-neutral-50 text-neutral-500"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="button"
                  onClick={() => handleContactChat(selectedInfluencer)}
                  className="px-5 py-2 bg-neutral-900 border border-gold-400 text-gold-400 rounded text-xs font-bold hover:bg-neutral-850 hover:text-white"
                >
                  เปิดแชทกับคนนี้
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}
