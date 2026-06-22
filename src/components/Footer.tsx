import React from 'react';
import { Sparkles, Instagram, Facebook, Youtube, Share2, Shield, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export default function Footer({ setActiveTab }: FooterProps) {
  return (
    <footer className="bg-neutral-950 text-neutral-400 font-sans border-t-2 border-[#D4AF37]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          
          {/* Brand Presentation */}
          <div className="md:col-span-1.5 space-y-4">
            <div 
              onClick={() => {
                setActiveTab('home');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }} 
              className="flex items-center gap-2.5 cursor-pointer group select-none"
              title="EveIn Premium Event Matching"
            >
              <div className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-neutral-900 to-neutral-800 border border-[#D4AF37]/80 shadow-md overflow-hidden group-hover:border-gold-300 transition-all font-serif">
                {/* Luxury shimmering backdrop */}
                <div className="absolute inset-0 bg-gradient-to-tr from-gold-500/10 via-transparent to-gold-400/20" />
                
                {/* Monogram letters */}
                <span className="text-sm font-bold tracking-tighter text-[#D4AF37] font-serif select-none select-none">E</span>
                <span className="text-[10px] font-semibold tracking-tighter text-white -ml-0.5 mt-1.5 select-none">i</span>
                
                {/* Sparkling effect representing curated events */}
                <div className="absolute top-1 right-1">
                  <Sparkles className="w-1.5 h-1.5 text-[#D4AF37] animate-pulse" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-widest text-[#ffffff] leading-none mb-0.5 flex items-center">
                  EVE<span className="text-[#D4AF37] font-light">IN</span>
                </span>
                <span className="text-[7px] font-bold tracking-[0.25em] text-neutral-500 uppercase leading-none">Premium Matching</span>
              </div>
            </div>
            
            <p className="text-xs text-neutral-400 leading-relaxed font-light">
              ศูนย์รวมการประกาศงานอิเวนต์ระดับไฮเอนด์ และสเปซแพลตฟอร์มจับคู่อินฟลูเอนเซอร์กับแบรนด์ชั้นนำ ด้วยระบบคัดสรรอัจฉริยะและการรักษาความปลอดภัยข้อมูลส่วนตัวที่เข้มงวดที่สุดในประเทศไทย
            </p>
            
            <div className="flex items-center gap-3 pt-2">
              <a href="#facebook" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all">
                <Facebook className="w-4 h-4" />
              </a>
              <a href="#instagram" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all">
                <Instagram className="w-4 h-4" />
              </a>
              <a href="#youtube" className="w-8 h-8 rounded-full bg-neutral-900 border border-neutral-800 flex items-center justify-center text-neutral-400 hover:text-[#D4AF37] hover:border-[#D4AF37]/50 transition-all">
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-[10px] font-bold text-white tracking-[0.2em] uppercase mb-4">บริการของ EveIn</h4>
            <ul className="space-y-2 text-xs font-light">
              <li>
                <button onClick={() => setActiveTab('events')} className="hover:text-[#D4AF37] transition-colors">
                  หางานอิเวนต์พรีเมียม
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('reviewJobs')} className="hover:text-[#D4AF37] transition-colors">
                  ประกาศจัดจ้างรีวิวสินค้า
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('findInfluencers')} className="hover:text-[#D4AF37] transition-colors">
                  ค้นหาอินฟลูเอนเซอร์ / KOL
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('dashboard')} className="hover:text-[#D4AF37] transition-colors">
                  แดชบอร์ดควบคุมงาน (Brand & KOL)
                </button>
              </li>
            </ul>
          </div>

          {/* Privacy & Guarantee Policy */}
          <div>
            <h4 className="text-[10px] font-bold text-white tracking-[0.2em] uppercase mb-4">การคุ้มครองข้อมูลส่วนบุคคล</h4>
            <div className="space-y-3 text-xs leading-relaxed text-neutral-400 font-light">
              <div className="flex gap-2 items-start">
                <Shield className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>
                  <strong>PDPA Guarantee:</strong> ข้อมูลทางการเงิน เลขที่บัญชีธนาคาร ประวัติบัตรประชาชน และข้อมูลติดต่อจริงของอินฟลูเอนเซอร์ จะถูกปิดบังเป็นความลับสูงสุดระดับองค์กร ให้สิทธิ์เฉพาะแอดมินสำหรับการจ่ายเงินเท่านั้น
                </span>
              </div>
              <div className="text-[11px] text-neutral-500 font-light uppercase tracking-wide">
                อ่านเงื่อนไขการให้บริการเพิ่มเติม และนโยบายลบล้างข้อมูลบุคคล (GDPR) ได้ในศูนย์ช่วยเหลือของพนักงาน
              </div>
            </div>
          </div>



        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-900 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-[11px] text-neutral-500 font-light">
          <div className="flex items-center gap-1">
            <span>© 2026 EveIn International Co., Ltd. สงวนลิขสิทธิ์ทั้งหมด</span>
          </div>
          <div className="flex items-center gap-1.5 mt-4 sm:mt-0">
            <span>สรรค์สร้างด้วยความประณีตเพื่อการทำงานระดับดีเลิศ</span>
            <Heart className="w-3.5 h-3.5 text-[#D4AF37] animate-pulse fill-[#D4AF37]" />
            <span>โดย EveIn Dev Team</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
