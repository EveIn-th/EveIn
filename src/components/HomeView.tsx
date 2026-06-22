import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowUpRight, Award, Trophy, Users, ShieldCheck, HeartHandshake, Eye, MessageSquare } from 'lucide-react';

interface HomeViewProps {
  onNavigate: (tab: string) => void;
  onJoinUs: (show: 'login' | 'register') => void;
  isLoggedIn: boolean;
}

export default function HomeView({ onNavigate, onJoinUs, isLoggedIn }: HomeViewProps) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 's1',
      title: 'Bangkok Golden Elite Gala 2026',
      tag: 'PRESENCE & NETWORKING EXCLUSIVE',
      desc: 'พบกับงานราตรีสโมสรระดับประเทศที่รวมแบรนด์แถวหน้าและดาราครีเอเตอร์ท็อป 100 ดื่มด่ำค่ำคืนแชมเปญ และสร้างความร่วมมือธุรกิจระดับลักชัวรี่',
      image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1200&auto=format&fit=crop',
      actionText: 'ดูตารางอิเวนต์',
      targetTab: 'events'
    },
    {
      id: 's2',
      title: 'Phuket Riviera Yacht Sunset Drive',
      tag: 'LIFESTYLE CAMPAIGN PROMOTION',
      desc: 'แบรนด์ผู้พัฒนาคอนโดและเรือสำราญพรีเมียม สนับสนุนทริปครีเอทีฟถ่ายแบบและการโปรโมตเนื้อหาลักชัวรี่ไลฟ์สไตล์ช่วงพระอาทิตย์อัสดง',
      image: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=1200&auto=format&fit=crop',
      actionText: 'ค้นหาแคมเปญงาน',
      targetTab: 'reviewJobs'
    },
    {
      id: 's3',
      title: 'Modern Gold Aesthetics Launching',
      tag: 'BEAUTY CLINIC EXPOSITION',
      desc: 'เปิดสิทธิ์ให้อินฟลูเอนเซอร์ด้านกลุ่มความงามและสกินแคร์ เข้าร่วมทดลองคอร์สบำบัดผิวหน้าทองคำ 24K ฟรี พร้อมค่าจ้างรีวิวระดับพรีเมียม',
      image: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=1200&auto=format&fit=crop',
      actionText: 'ดูแบรนด์ทั้งหมด',
      targetTab: 'findInfluencers'
    }
  ];

  // Automatic slide ticking interval
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <div className="space-y-16 animate-in fade-in duration-500">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-white py-24 px-4 sm:px-6 lg:px-8 border-b border-[#D4AF37]/20">
        <div className="absolute inset-0 bg-[radial-gradient(#D4AF37_1px,transparent_1px)] [background-size:32px_32px] opacity-10"></div>
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-8">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FCFAF7] border border-[#D4AF37]/40 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#B8860B] animate-spin" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B8860B] uppercase font-sans">
              The Prestige Matchmaker for Brands & Influencers
            </span>
          </div>

          <h1 className="font-sans text-4xl sm:text-6xl font-light tracking-tight text-neutral-900 leading-tight">
            เชื่อมต่อแบรนด์ลักชัวรี่ <br className="hidden sm:inline" />
            <span className="gold-gradient-text font-bold">กับอินฟลูเอนเซอร์ระดับพรีเมียม</span>
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-neutral-500 font-light leading-relaxed uppercase tracking-wider">
            สัมผัสประสบการณ์การสรรหางานและประกาศอิเวนต์ที่ไม่เคยมีมาก่อน ปิดงานจ้างรีวิว สินค้าหรู ดีไซน์เรียบสวย สะดวก รวดเร็ว พร้อมการปกป้องผู้ใช้งานและระบบประมวลผลทางการเงินที่โปร่งใส 100%
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('reviewJobs')}
              className="px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-black text-white hover:bg-[#B8860B] transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer luxury-shadow"
            >
              <span>สำรวจแคมเปญงานรีวิว</span>
              <ArrowUpRight className="w-4 h-4 text-[#D4AF37]" />
            </button>
            {!isLoggedIn ? (
              <button
                onClick={() => onJoinUs('register')}
                className="px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest border border-[#D4AF37] text-[#B8860B] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer"
              >
                ร่วมเป็นพรีเมียมพาร์ทเนอร์
              </button>
            ) : (
              <button
                onClick={() => onNavigate('dashboard')}
                className="px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest border border-[#D4AF37] text-[#B8860B] hover:bg-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer"
              >
                เข้าสู่หน้าแดชบอร์ดของฉัน
              </button>
            )}
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-evein-chat'))}
              className="px-8 py-4 rounded-full text-xs font-bold uppercase tracking-widest bg-amber-500/5 hover:bg-amber-500/10 text-amber-700 hover:text-amber-800 border border-amber-600/35 hover:border-amber-600/60 transition-all duration-300 cursor-pointer flex items-center justify-center gap-1.5 font-prompt"
            >
              <MessageSquare className="w-4 h-4 text-[#D4AF37] animate-pulse" />
              <span>คุยกับแอดมินทีมงาน</span>
            </button>
          </div>
        </div>
      </section>

      {/* 1.5 Luxury Announcement Poster - Campaign for Influencers */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-neutral-950 border-2 border-[#D4AF37]/80 px-6 py-12 sm:p-14 text-center shadow-2xl">
          {/* Subtle elegant shimmering background details */}
          <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 via-transparent to-neutral-950 opacity-90" />
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent" />
          
          <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
            {/* Announcement Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-neutral-900 border border-[#D4AF37]/50 shadow-inner">
              <Trophy className="w-4 h-4 text-[#D3BC8E] animate-bounce" />
              <span className="font-prompt text-[10px] sm:text-[11px] font-bold tracking-[0.15em] text-[#D4AF37] uppercase">
                แคมเปญรางวัลพิเศษสำหรับเพื่อนพ้องครีเอเตอร์อินฟลูกลุ่มพรีเมียม
              </span>
            </div>

            {/* Title / Main Hook */}
            <h2 className="font-sans text-2xl sm:text-4xl font-extrabold text-white tracking-tight leading-tight uppercase">
              ชวนรีวิวสร้างคอนเทนต์ท้าทายยอดฝีมือ <br />
              <span className="bg-gradient-to-r from-[#F3E5AB] via-[#D4AF37] to-[#F3E5AB] bg-clip-text text-transparent drop-shadow-sm font-light">
                ร่วมโปรโมตเปิดตัว <span className="font-bold">EVEIN</span> ชิงเงินแสนทันที!
              </span>
            </h2>

            {/* Short Subtext */}
            <p className="font-prompt text-xs sm:text-xs text-neutral-300 font-light max-w-2xl mx-auto leading-relaxed">
              สิทธิประโยชน์สุดฟินสำหรับอินฟลูเอนเซอร์และคอนเทนต์ครีเอเตอร์ทุกท่าน! เพียงรีวิวหรือทำคลิปแนะนำแพลตฟอร์มแมตชิ่งสุดหรูของเรา คว้ารางวัลใหญ่พิเศษแบบไม่มีวันหมดอายุกิจกรรมจนกว่าจะหาแชมป์ครบแต่ละเงื่อนไข:
            </p>

            {/* Bento Grid Rewards Poster Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-4 text-neutral-100 select-none">
              
              {/* Reward 1 */}
              <div className="relative flex flex-col justify-between p-5 rounded-2xl bg-neutral-900/90 border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all group duration-300">
                <div className="absolute top-4 right-4 bg-[#D4AF37]/10 p-2 rounded-xl text-[#D4AF37]">
                  <Users className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left space-y-2 mt-2">
                  <span className="block text-[8px] text-[#D3BC8E] font-bold uppercase tracking-widest font-prompt">รางวัลยอดสถิติตามรหัสคำเชิญ</span>
                  <h3 className="font-prompt text-sm font-bold text-white">ชวนผู้ใช้งานสำเร็จสูงสุด</h3>
                  <p className="font-prompt text-[11px] text-zinc-400 font-light leading-relaxed">
                    อินฟลูท่านไหนที่รีวิวแล้ว <span className="text-[#D4AF37]">มีคนมาสมัครและใช้งานตามรหัสเชิญของคุณมากที่สุด</span> เพื่อรับความหรูหราทันสมัย
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-zinc-800 text-left">
                  <span className="block text-[10px] text-zinc-500 font-semibold uppercase">รับเงินรางวัลสูงสุด</span>
                  <span className="font-sans text-2xl font-black text-[#D4AF37]">50,000 <span className="text-xs text-white">บาท</span></span>
                </div>
              </div>

              {/* Reward 2 */}
              <div className="relative flex flex-col justify-between p-5 rounded-2xl bg-neutral-900/90 border-2 border-[#D4AF37] hover:border-gold-300 transition-all group duration-300 shadow-[0_0_20px_rgba(212,175,55,0.1)]">
                <div className="absolute top-4 right-4 bg-[#D4AF37]/10 p-2 rounded-xl text-[#D4AF37]">
                  <Award className="w-4 h-4 animate-pulse text-[#D4AF37]" />
                </div>
                <div className="text-left space-y-2 mt-2">
                  <span className="block text-[8px] text-amber-400 font-bold uppercase tracking-widest font-prompt">รางวัลขวัญใจมิตรรักแฟนคลับ</span>
                  <h3 className="font-prompt text-sm font-bold text-white">ยอดกดใจเยอะที่สุด (Top Likes)</h3>
                  <p className="font-prompt text-[11px] text-zinc-300 font-light leading-relaxed">
                    สร้างคลิปรีวิวแล้วโพสต์ลงหน้าโปรไฟล์โซเชียลของคุณ <span className="text-white font-medium">อินฟลูท่านไหนโกยคะแนนไลก์/กดใจเยอะที่สุด</span> ในบรรดาผู้สมัคร
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-[#D4AF37]/35 text-left">
                  <span className="block text-[10px] text-zinc-400 font-semibold uppercase">รับเงินรางวัลกลับบ้าน</span>
                  <span className="font-sans text-2xl font-black text-amber-400">30,000 <span className="text-xs text-white">บาท</span></span>
                </div>
              </div>

              {/* Reward 3 */}
              <div className="relative flex flex-col justify-between p-5 rounded-2xl bg-neutral-900/90 border border-[#D4AF37]/35 hover:border-[#D4AF37] transition-all group duration-300">
                <div className="absolute top-4 right-4 bg-[#D4AF37]/10 p-2 rounded-xl text-[#D4AF37]">
                  <Trophy className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </div>
                <div className="text-left space-y-2 mt-2">
                  <span className="block text-[8px] text-[#D3BC8E] font-bold uppercase tracking-widest font-prompt">รางวัลยอดฝีมือไอเดียสร้างสรรค์</span>
                  <h3 className="font-prompt text-sm font-bold text-white">คลิปถูกใจวิทยากรและผู้ชม</h3>
                  <p className="font-prompt text-[11px] text-zinc-400 font-light leading-relaxed">
                    ทำคลิปวีดีโอแนะนำโดนใจกรรมการและคนดูเฉียบขาดที่สุด <span className="text-white font-medium">แจกหนักจำนวน 5 ท่าน</span> รับสิทธิ์สะสมรางวัลอย่างทั่วถึง
                  </p>
                </div>
                <div className="mt-5 pt-3.5 border-t border-zinc-800 text-left">
                  <span className="block text-[10px] text-zinc-500 font-semibold">รับคนละ</span>
                  <span className="font-sans text-2xl font-black text-[#D4AF37]">5,000 <span className="text-xs text-white">บาท</span></span>
                  <span className="block text-[9px] text-zinc-650 mt-0.5">(แบ่งจ่ายพิเศษ 5 รางวัล รวม 25,000 บาท)</span>
                </div>
              </div>

            </div>

            {/* Campaign Information Footer info */}
            <div className="pt-6 border-t border-zinc-900 text-center space-y-3 font-prompt">
              <p className="text-[11px] text-zinc-400 font-normal leading-relaxed">
                📢 <span className="text-[#D3BC8E]">เงื่อนไขการส่งร่วมแคมเปญ:</span> สามารถเริ่มทำการริวิวเผยแพร่ผลงานคลิปวีดีโอแนะนำได้เลยทันที! ไม่มีกำหนดวันปิดจัดกิจกรรม จนกว่าแอดมินแพลตฟอร์มจะสามารถเฟ้นหาอินฟลูเอนเซอร์ที่ผ่านข้อตกลงได้รับรางวัลครบทุกประเภทกิจกรรม
              </p>
              <button 
                onClick={() => onNavigate('reviewJobs')}
                className="inline-flex items-center gap-1.5 px-6 py-2.5 rounded-full bg-gradient-to-r from-neutral-100 to-neutral-200 text-neutral-900 hover:from-[#D4AF37] hover:to-[#B8860B] hover:text-white transition-all text-xs font-bold uppercase tracking-wider cursor-pointer shadow-md duration-300"
              >
                <span>เริ่มรับงานและโปรโมตสตอรีเลย!</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Interactive Premium Events Slider */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-6">
          <div className="flex items-center gap-2">
            <div className="h-[1px] w-8 bg-[#D4AF37]"></div>
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B8860B] uppercase">HIGHLIGHT EVENTS & PROMOTIONS</span>
          </div>
          <h2 className="font-sans text-2xl font-semibold tracking-tight text-neutral-900">กิจกรรมเด่นและโปรโมชั่นแชร์สิทธิประโยชน์</h2>
        </div>

        {/* Outer Banner Sandbox */}
        <div className="relative h-[250px] sm:h-[400px] rounded-3xl overflow-hidden luxury-shadow border border-[#D4AF37]/35 group">
          {slides.map((s, idx) => (
            <div
              key={s.id}
              className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                idx === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
              }`}
            >
              {/* Background cover with dim light filter */}
              <div className="absolute inset-0 bg-gradient-to-r from-neutral-950/95 via-neutral-950/60 to-transparent z-10"></div>
              <img
                src={s.image}
                alt={s.title}
                className="w-full h-full object-cover transform scale-100 group-hover:scale-105 transition-transform duration-[4000ms]"
              />
              
              {/* Slide content overlay */}
              <div className="absolute inset-0 z-20 flex flex-col justify-center px-6 sm:px-16 max-w-2xl space-y-3 sm:space-y-4">
                <span className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-gold-300 uppercase">
                  {s.tag}
                </span>
                <h3 className="font-sans text-xl sm:text-3xl font-bold text-white tracking-wide leading-snug">
                  {s.title}
                </h3>
                <p className="text-[11px] sm:text-xs text-neutral-300 font-light leading-relaxed">
                  {s.desc}
                </p>
                <div className="pt-2">
                  <button
                    onClick={() => onNavigate(s.targetTab)}
                    className="px-6 py-2.5 rounded-full bg-black hover:bg-[#D4AF37] border border-[#D4AF37] text-white font-bold text-[9px] uppercase tracking-widest flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
                  >
                    <span>{s.actionText}</span>
                    <ArrowUpRight className="w-3 h-3 text-[#D4AF37]" />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Indicators dots */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-30 flex gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all ${
                  idx === currentSlide ? 'bg-[#D4AF37] w-6' : 'bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`หน้าสไลด์ที่ ${idx + 1}`}
              ></button>
            ))}
          </div>
        </div>
      </section>

      {/* 3. Why EveIn & Stat Metrics */}
      <section className="bg-[#FCFAF7] border-y border-[#D4AF37]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-3 mb-16">
            <span className="text-[10px] font-bold tracking-[0.2em] text-[#B8860B] uppercase">EVEIN STATISTIC POWER</span>
            <h2 className="font-sans text-3xl font-light text-neutral-900 tracking-tight">สถิติภาพรวมและการันตี<span className="font-bold">ความเป็นเลิศ</span></h2>
            <p className="max-w-lg mx-auto text-xs text-neutral-400 font-light uppercase tracking-wider">
              ผลลัพธ์การันตียอดจัดจ้างและแคมเปญอสังหา/บิวตี้ที่ประสบความสำเร็จสูงสุดในภูมิภาคเอเชียตะวันออกเฉียงใต้
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            {/* Stat Item 1 */}
            <div className="p-8 bg-white border border-[#D4AF37]/10 rounded-3xl text-center space-y-20 luxury-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex p-3 bg-[#FCFAF7] rounded-full text-[#B8860B]">
                  <Users className="w-6 h-6" />
                </div>
                <div className="font-sans text-3xl font-bold text-neutral-900 tracking-tighter">1,200+</div>
                <div className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase">แบรนด์ระดับลักชัวรี่เข้าร่วม</div>
              </div>
              <p className="text-[11px] text-neutral-450 leading-relaxed font-light">ตั้งแต่แบรนด์แฟชั่นระดับไฮเอนด์ คลินิกสกินแคร์ ไปจนถึงอสังหาริมทรัพย์ระดับพรีเมียม</p>
            </div>

            {/* Stat Item 2 */}
            <div className="p-8 bg-white border border-[#D4AF37]/10 rounded-3xl text-center space-y-20 luxury-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex p-3 bg-[#FCFAF7] rounded-full text-[#B8860B]">
                  <Trophy className="w-6 h-6" />
                </div>
                <div className="font-sans text-3xl font-bold text-neutral-900 tracking-tighter">25,000+</div>
                <div className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase">แมสท์ชิ่งแคมเปญสำเร็จ</div>
              </div>
              <p className="text-[11px] text-neutral-450 leading-relaxed font-light">การอนุมัติส่งงานและทำรายงานส่งตรวจอย่างรวดเร็ว ได้ผลผลิตสูงตามเป้าหมายแบรนด์</p>
            </div>

            {/* Stat Item 3 */}
            <div className="p-8 bg-white border border-[#D4AF37]/10 rounded-3xl text-center space-y-20 luxury-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex p-3 bg-[#FCFAF7] rounded-full text-[#B8860B]">
                  <Award className="w-6 h-6" />
                </div>
                <div className="font-sans text-3xl font-bold text-neutral-900 tracking-tighter">1.5M+</div>
                <div className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase">สถิติผู้ติดตามสื่อโฆษณา</div>
              </div>
              <p className="text-[11px] text-neutral-450 leading-relaxed font-light">ยอดรวมกลุ่มผู้เข้าชมที่ได้รับอิทธิพลจากครีเอเตอร์สายแฟชั่น สกินแคร์ และไลฟ์สไตล์ระดับบลูชิป</p>
            </div>

            {/* Stat Item 4 */}
            <div className="p-8 bg-white border border-[#D4AF37]/10 rounded-3xl text-center space-y-20 luxury-shadow flex flex-col justify-between">
              <div className="space-y-3">
                <div className="inline-flex p-3 bg-[#FCFAF7] rounded-full text-[#B8860B]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div className="font-sans text-3xl font-bold text-neutral-900 tracking-tighter">100%</div>
                <div className="text-[10px] font-bold text-[#B8860B] tracking-widest uppercase">ปลอดภัยตามหลักสิทธิส่วนตัว</div>
              </div>
              <p className="text-[11px] text-neutral-450 leading-relaxed font-light">ปกป้องข้อมูลสมุดเงินฝาก อีเมลและเบอร์โทรศัพท์ของครีเอเตอร์ จากสายตาแฮกเกอร์สาธารณะ</p>
            </div>

          </div>

          {/* Interactive Feature Block */}
          <div className="mt-20 bg-neutral-950 rounded-3xl p-8 sm:p-12 border border-[#D4AF37] flex flex-col md:flex-row items-center justify-between gap-8 luxury-shadow text-white">
            <div className="space-y-4 max-w-xl text-left">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#D4AF37] uppercase">PRESTIGE WORKFLOW</span>
              <h3 className="font-sans text-xl sm:text-2xl font-semibold text-white tracking-normal leading-snug">
                ยินดีต้อนรับสู่ระบบตรวจงานด่วน และการชำระผ่าน QR Code สากล
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed font-light font-sans">
                บอกลาการโอนเงินที่ล่าช้า แบรนด์ชั้นนำสามารถออกใบกำกับภาษีผ่านแพลตฟอร์ม ดำเนินการชำระภาษีหัก ณ ที่จ่าย 7% และอัปสลิปเพื่อส่งให้แอดมินหลังบ้านอนุมัติบัญชีเงินโอนให้แก่อินฟลูเอนเซอร์ใน 2 ชั่วโมง
              </p>
            </div>
            <div className="shrink-0 flex flex-col sm:flex-row gap-3 w-full md:w-auto">
              <button
                onClick={() => onNavigate('reviewJobs')}
                className="px-6 py-3 rounded-full text-center text-xs font-bold uppercase tracking-widest bg-white text-black hover:bg-[#D4AF37] hover:text-white transition-all cursor-pointer shadow-md"
              >
                ดูงานรีวิวทั้งหมด
              </button>
              <button
                onClick={() => onNavigate('findInfluencers')}
                className="px-6 py-3 rounded-full text-center text-xs font-bold uppercase tracking-widest bg-black text-[#D4AF37] border border-[#D4AF37]/50 hover:bg-[#D4AF37] hover:text-white transition-all cursor-pointer"
              >
                ดูอินฟลูเอนเซอร์
              </button>
            </div>
          </div>

        </div>
      </section>

    </div>
  );
}
