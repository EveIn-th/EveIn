import React, { useState } from 'react';
import { Briefcase, MapPin, Filter, Plus, CheckSquare, Square, Check, ArrowUpRight, ShieldAlert, Sparkles, X, Target } from 'lucide-react';
import { JobItem, User, JobApplication } from '../types';
import { THAI_PROVINCES } from '../mockData';

interface ReviewJobsViewProps {
  jobs: JobItem[];
  setJobs: React.Dispatch<React.SetStateAction<JobItem[]>>;
  currentUser: User | null;
  applications: JobApplication[];
  onApplyForJob: (jobId: string) => void;
  triggerToast: (msg: string, status: 'success' | 'info' | 'warning') => void;
  setShowAuthModal: (show: 'login' | 'register' | null) => void;
}

export default function ReviewJobsView({
  jobs,
  setJobs,
  currentUser,
  applications,
  onApplyForJob,
  triggerToast,
  setShowAuthModal,
}: ReviewJobsViewProps) {
  const [showPostModal, setShowPostModal] = useState(false);

  // Filter States
  const [selectedProvince, setSelectedProvince] = useState('ทุกจังหวัด');
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('ทั้งหมด');
  const [selectedAge, setSelectedAge] = useState('ทั้งหมด');
  const [selectedGender, setSelectedGender] = useState('ทั้งหมด');
  const [selectedFollowers, setSelectedFollowers] = useState('ทั้งหมด');

  // Job Posting Form States (Brand only)
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [province, setProvince] = useState('กรุงเทพมหานคร');
  const [platforms, setPlatforms] = useState<('Tiktok' | 'Facebook' | 'Instagram' | 'YouTube')[]>([]);
  const [category, setCategory] = useState('เครื่องสำอาง');
  const [ageRange, setAgeRange] = useState('18-23');
  const [genderRequired, setGenderRequired] = useState<'All' | 'Male' | 'Female' | 'LGBTQ'>('All');
  const [followerRange, setFollowerRange] = useState('All');
  const [budget, setBudget] = useState('');

  const [formError, setFormError] = useState<string | null>(null);

  // Available Review categories as requested
  const CATEGORIES = [
    'เครื่องสำอาง', 'สกินแคร์', 'คลินิกเสริมความงาม', 'กีฬาและสุขภาพ',
    'โทรศัพท์มือถือและไอที', 'คอนโดและอสังหาริมทรัพย์', 'เกม', 'ร้านค้า',
    'อาหาร', 'ไลฟ์สไตล์', 'อื่นๆ'
  ];

  const PLATFORMS: ('Tiktok' | 'Facebook' | 'Instagram' | 'YouTube')[] = [
    'Tiktok', 'Facebook', 'Instagram', 'YouTube'
  ];

  // Filters logic
  const filteredJobs = jobs.filter(job => {
    // 1. Province filter
    if (selectedProvince !== 'ทุกจังหวัด' && job.province !== selectedProvince) return false;

    // 2. Platform filter (คละกันได้อย่างน้อย 1 ตัวเลือก)
    if (selectedPlatforms.length > 0) {
      const hasMatch = job.platforms.some(p => selectedPlatforms.includes(p));
      if (!hasMatch) return false;
    }

    // 3. Category filter
    if (selectedCategory !== 'ทั้งหมด' && job.category !== selectedCategory) return false;

    // 4. Age range requirements
    if (selectedAge !== 'ทั้งหมด' && job.ageRange !== selectedAge) return false;

    // 5. Gender
    if (selectedGender !== 'ทั้งหมด' && job.genderRequired !== selectedGender) return false;

    // 6. Follower range requirement
    if (selectedFollowers !== 'ทั้งหมด' && (job.followerRange || 'All') !== selectedFollowers) return false;

    return true;
  });

  const togglePlatformFilter = (plat: string) => {
    setSelectedPlatforms(prev =>
      prev.includes(plat) ? prev.filter(p => p !== plat) : [...prev, plat]
    );
  };

  const handlePostJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || currentUser.role !== 'Brand') {
      triggerToast('บัญชีของท่านต้องเป็นแบรนด์ผู้ว่าจ้างสำหรับการประกาศงานค่ะ', 'warning');
      return;
    }

    if (!title.trim() || !description.trim() || platforms.length === 0 || !budget.trim()) {
      setFormError('กรุณากรอกข้อมูล ชื่องาน รายละเอียด เลือกแพลตฟอร์มอย่างน้อย 1 ช่อง และระบุค่าจ้างจ้ะ');
      return;
    }

    const newJob: JobItem = {
      id: `j_${Date.now()}`,
      title,
      brandName: currentUser.brandName || currentUser.username,
      description,
      province,
      platforms,
      category,
      ageRange,
      genderRequired,
      budget: Number(budget),
      isOpen: true,
      followerRange,
      createdBy: currentUser.id,
      createdAt: new Date().toISOString()
    };

    setJobs(prev => [newJob, ...prev]);

    // Reset Form
    setTitle('');
    setDescription('');
    setProvince('กรุงเทพมหานคร');
    setPlatforms([]);
    setCategory('เครื่องสำอาง');
    setAgeRange('18-23');
    setGenderRequired('All');
    setFollowerRange('All');
    setBudget('');
    setFormError(null);
    setShowPostModal(false);

    triggerToast('ประกาศงานจ้างรีวิวสำเร็จแล้วค่ะ! ข้อมูลจะปรากฏบนกระดานผู้สมัครทันที', 'success');
  };

  const isBrand = currentUser?.role === 'Brand';

  const checkHasApplied = (jobId: string) => {
    if (!currentUser) return false;
    return applications.some(app => app.jobId === jobId && app.influencerId === currentUser.id);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300">
      
      {/* Upper header space */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl border border-[#D4AF37]/20 luxury-shadow">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#B8860B] animate-pulse"></span>
            <span className="text-[10px] tracking-[0.2em] text-[#B8860B] font-bold uppercase font-sans">Brand Review Campaign Board</span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-light text-neutral-900">
            ประกาศงาน<span className="font-bold">จ้างรีวิวสินค้า</span>
          </h1>
          <p className="text-xs text-neutral-400 font-light uppercase tracking-wider">
            จุดเชื่อมแคมเปญงานของแบรนด์พรีเมียม สกินแคร์ลักชัวรี่ และคอนโด อนุมัติการสมัครอย่างยุติธรรม
          </p>
        </div>

        {/* Restricted Button Block */}
        <div className="relative group">
          {isBrand ? (
            <button
              onClick={() => setShowPostModal(true)}
              className="px-6 py-3.5 rounded-full bg-black text-white hover:bg-[#D4AF37] border border-[#D4AF37] text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-sm"
            >
              <Plus className="w-4 h-4 text-[#D4AF37]" />
              <span>ประกาศงานจ้าง</span>
            </button>
          ) : (
            <div className="text-right">
              <button
                disabled
                className="px-6 py-3.5 rounded-full bg-neutral-100 text-neutral-400 font-bold text-xs tracking-widest uppercase flex items-center gap-2 border border-neutral-200 cursor-not-allowed opacity-60"
              >
                <span>ประกาศงานจ้าง (จำกัดสิทธิ์แบรนด์)</span>
              </button>
              <span className="block text-[10px] text-amber-700 italic mt-1 font-prompt font-semibold">
                *แสดงและรับสิทธิ์สมัครเฉพาะบัญชีประเภท แบรนด์ (Brand) เท่านั้น
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Grid Layout containing Filters of 5 kinds & results */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Filters Sidebar widget */}
        <div className="lg:col-span-1 bg-white p-6 rounded-3xl border border-[#D4AF37]/20 space-y-6 h-fit luxury-shadow">
          <div className="flex items-center gap-2 pb-4 border-b border-neutral-150">
            <Filter className="w-4 h-4 text-[#B8860B]" />
            <span className="text-[10px] font-bold tracking-[0.2em] text-neutral-900 uppercase">ตัวกรองขั้นสูง</span>
          </div>

          {/* Filter 1: Province Dropdown */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide">1. หมวดหมู่จังหวัด</label>
            <select
              value={selectedProvince}
              onChange={e => setSelectedProvince(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-gold-500 outline-none bg-white font-prompt"
            >
              <option value="ทุกจังหวัด">ทุกจังหวัด (รวมประเทศไทย)</option>
              {THAI_PROVINCES.map(prov => (
                <option key={prov} value={prov}>{prov}</option>
              ))}
            </select>
          </div>

          {/* Filter 2: Platforms (Checkboxes, mix and match eligible) */}
          <div className="space-y-2">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide">2. แพลตฟอร์มเผยแพร่</label>
            <div className="space-y-1.5">
              {PLATFORMS.map(p => {
                const checked = selectedPlatforms.includes(p);
                return (
                  <button
                    key={p}
                    onClick={() => togglePlatformFilter(p)}
                    className="w-full flex items-center gap-2.5 text-left text-xs text-neutral-700 hover:text-gold-600 py-1 transition-colors"
                  >
                    {checked ? (
                      <CheckSquare className="w-4 h-4 text-gold-500 shrink-0" />
                    ) : (
                      <Square className="w-4 h-4 text-neutral-300 shrink-0" />
                    )}
                    <span>{p}</span>
                  </button>
                );
              })}
              {selectedPlatforms.length > 0 && (
                <button
                  onClick={() => setSelectedPlatforms([])}
                  className="text-[10px] text-red-500 hover:underline pt-1 block"
                >
                  ล้างค่าแพลตฟอร์ม
                </button>
              )}
            </div>
          </div>

          {/* Filter 3: Review Categories */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide">3. ประเภทการรีวิว</label>
            <select
              value={selectedCategory}
              onChange={e => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-gold-500 outline-none bg-white font-prompt"
            >
              <option value="ทั้งหมด">ทั้งหมดทุกหมวดหมู่</option>
              {CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Filter 4: Age Range Requirement */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide">4. ช่วงอายุที่ต้องการ</label>
            <select
              value={selectedAge}
              onChange={e => setSelectedAge(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-gold-500 outline-none bg-white"
            >
              <option value="ทั้งหมด">ทั้งหมด (ไม่จำกัดอายุ)</option>
              <option value="18-23">18 - 23 ปี</option>
              <option value="24-30">24 - 30 ปี</option>
              <option value="31-45">31 - 45 ปี</option>
              <option value="45-60">45 - 60 ปี</option>
            </select>
          </div>

          {/* Filter 5: Gender Requirements */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide">5. เพศของครีเอเตอร์</label>
            <select
              value={selectedGender}
              onChange={e => setSelectedGender(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-gold-500 outline-none bg-white font-prompt"
            >
              <option value="ทั้งหมด">ทั้งหมด (ชาย / หญิง / LGBTQ)</option>
              <option value="Male">ชาย (Male)</option>
              <option value="Female">หญิง (Female)</option>
              <option value="LGBTQ">LGBTQ</option>
            </select>
          </div>

          {/* Filter 6: Follower Range Requirements */}
          <div className="space-y-1.5">
            <label className="block text-[11px] font-bold text-neutral-500 uppercase tracking-wide">6. ช่วงผู้ติดตามอินฟลูฯ</label>
            <select
              value={selectedFollowers}
              onChange={e => setSelectedFollowers(e.target.value)}
              className="w-full px-3 py-2 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-gold-500 outline-none bg-white font-prompt"
            >
              <option value="ทั้งหมด">ทั้งหมด (ทุกช่วงผู้ติดตาม)</option>
              <option value="Under 10k">ต่ำกว่า 10,000 คน (Nano)</option>
              <option value="10k-50k">10,000 - 50,000 คน (Micro)</option>
              <option value="50k-100k">50,000 - 100,000 คน (Mid-tier)</option>
              <option value="100k-500k">100,000 - 500,000 คน (Macro)</option>
              <option value="500k+">500,000 คนขึ้นไป (Mega)</option>
            </select>
          </div>

        </div>

        {/* Results layout showing job lists */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex justify-between items-center text-xs text-neutral-400">
            <span>พบรายการงานจ้างทั้งหมด {filteredJobs.length} รายการ</span>
            <button
              onClick={() => {
                setSelectedProvince('ทุกจังหวัด');
                setSelectedPlatforms([]);
                setSelectedCategory('ทั้งหมด');
                setSelectedAge('ทั้งหมด');
                setSelectedGender('ทั้งหมด');
                setSelectedFollowers('ทั้งหมด');
              }}
              className="text-gold-600 hover:underline"
            >
              ล้างตัวกรองทั้งหมด
            </button>
          </div>

          {filteredJobs.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-neutral-200 space-y-3">
              <ShieldAlert className="w-10 h-10 text-neutral-300 mx-auto" />
              <p className="text-sm font-semibold text-neutral-600">ไม่พบบทความโปรโมตงานจ้างตามฟิลเตอร์ที่เลือก</p>
              <p className="text-xs text-neutral-400">โปรดลองปรับตัวกรองแพลตฟอร์มหรือจังหวัดอื่นเพื่อสำรวจแคมเปญใหม่ๆ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredJobs.map((job) => {
                const applied = checkHasApplied(job.id);
                return (
                  <div
                    key={job.id}
                    className="p-8 bg-white rounded-3xl border border-[#D4AF37]/15 hover:border-[#D4AF37]/35 transition-all duration-500 luxury-shadow flex flex-col justify-between h-full"
                  >
                    <div className="space-y-3">
                      <div className="flex justify-between items-start">
                        <span className="px-3 py-1 rounded-full bg-[#B8860B]/5 text-[#B8860B] border border-[#B8860B]/20 text-[10px] font-bold uppercase tracking-wider">
                          {job.category}
                        </span>
                        
                        {job.isOpen ? (
                          <span className="flex items-center gap-1.5 text-[10px] text-emerald-600 font-bold uppercase tracking-wider">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                            <span>เปิดรับสมัคร</span>
                          </span>
                        ) : (
                          <span className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">
                            ปิดรับสมัครชั่วคราว
                          </span>
                        )}
                      </div>

                      <h3 className="font-sans text-lg font-light text-neutral-900 leading-snug">
                        <span className="font-semibold block">{job.title}</span>
                      </h3>

                      <p className="text-[#B8860B] font-medium text-[11px] uppercase tracking-wider">
                        ผู้จ้าง: {job.brandName}
                      </p>

                      <p className="text-xs text-neutral-500 leading-relaxed font-light line-clamp-3">
                        {job.description}
                      </p>
                    </div>

                    <div className="space-y-4 pt-4 mt-6 border-t border-neutral-100 text-[11px] text-neutral-500">
                      
                      {/* Requirements details inside job post */}
                      <div className="grid grid-cols-2 gap-3 bg-neutral-50/50 p-3.5 rounded-2xl text-[10px] border border-neutral-100">
                        <div>
                          <span className="block text-[8px] uppercase text-neutral-400 tracking-widest font-bold">แพลตฟอร์มจ้าง</span>
                          <span className="font-bold text-neutral-800">{job.platforms.join(', ')}</span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase text-neutral-400 tracking-widest font-bold font-prompt">เกณฑ์ผู้ติดตาม</span>
                          <span className="font-bold text-[#B8860B] truncate block">
                            {job.followerRange === 'Under 10k' ? 'ต่ำกว่า 10,000' : 
                             job.followerRange === '10k-50k' ? '10k - 50k' :
                             job.followerRange === '50k-100k' ? '50k - 100k' :
                             job.followerRange === '100k-500k' ? '100k - 500k' :
                             job.followerRange === '500k+' ? '500k+' : 'ไม่จำกัด'}
                          </span>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase text-neutral-400 tracking-widest font-bold">พื้นที่รับงาน</span>
                          <div className="flex items-center gap-0.5 font-bold text-neutral-800">
                            <MapPin className="w-2.5 h-2.5 text-[#B8860B] shrink-0" />
                            <span className="truncate">{job.province}</span>
                          </div>
                        </div>
                        <div>
                          <span className="block text-[8px] uppercase text-neutral-400 tracking-widest font-bold">เกณฑ์เพศ</span>
                          <span className="font-bold text-neutral-800 truncate block">
                            {job.genderRequired === 'All' ? 'ทุกเพศ' : job.genderRequired === 'Male' ? 'ชายเท่านั้น' : job.genderRequired === 'Female' ? 'หญิงเท่านั้น' : 'LGBTQ'}
                          </span>
                        </div>
                        <div className="col-span-2">
                          <span className="block text-[8px] uppercase text-neutral-400 tracking-widest font-bold">เกณฑ์ช่วงอายุ</span>
                          <span className="font-bold text-neutral-800">{job.ageRange} ปี</span>
                        </div>
                      </div>

                      {/* Cash Budget & Apply click */}
                      <div className="flex justify-between items-center pt-2 border-t border-neutral-50">
                        <div>
                          <span className="block text-[9px] uppercase text-neutral-400 font-medium tracking-wider">เงินรางวัลค่าจ้าง</span>
                          <span className="font-sans text-base sm:text-lg font-bold text-[#B8860B]">
                            ฿{job.budget.toLocaleString()} <span className="text-[10px] font-sans font-medium text-neutral-400">สุทธิ</span>
                          </span>
                        </div>

                        {currentUser?.role === 'Influencer' ? (
                          applied ? (
                            <button
                              disabled
                              className="px-4 py-2 rounded-full bg-neutral-100 text-neutral-400 font-bold text-[10px] tracking-widest uppercase cursor-default flex items-center gap-1.5"
                            >
                              <Check className="w-4 h-4 text-emerald-500" />
                              <span>สมัครร่วมแล้ว</span>
                            </button>
                          ) : job.isOpen ? (
                            <button
                              onClick={() => onApplyForJob(job.id)}
                              className="px-4 py-2.5 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37]/35 hover:bg-[#D4AF37] hover:text-white font-bold text-[10px] tracking-widest uppercase transition-all duration-300 flex items-center gap-1 cursor-pointer"
                            >
                              <span>ร่วมสมัครแคมเปญ</span>
                              <ArrowUpRight className="w-3.5 h-3.5" />
                            </button>
                          ) : (
                            <button
                              disabled
                              className="px-4 py-2.5 rounded-full bg-neutral-100 text-neutral-300 font-bold text-[10px] tracking-widest uppercase cursor-not-allowed"
                            >
                              ปิดรับสมัคร
                            </button>
                          )
                        ) : !currentUser ? (
                          <button
                            onClick={() => {
                              triggerToast('กรุณาลงชื่อใช้งานเพื่อส่งคำความสมัครความร่วมมือค่ะ', 'warning');
                              setShowAuthModal('login');
                            }}
                            className="px-4 py-2.5 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37]/30 hover:bg-[#D4AF37] hover:text-white text-[10px] font-bold tracking-widest uppercase transition-all duration-300 cursor-pointer"
                          >
                            ล็อกอินเพื่อสมัครงาน
                          </button>
                        ) : (
                          <div className="text-[10px] text-amber-700/80 italic font-medium font-prompt">
                            แบรนด์มองเห็นงานโพสต์
                          </div>
                        )}

                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          )}

        </div>

      </div>

      {/* Brand Posting Modal (Limited scope and beautifully responsive) */}
      {showPostModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95">
            
            {/* Header */}
            <div className="bg-neutral-950 p-5 border-b border-gold-400 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-300" />
                <h2 className="font-serif text-lg font-bold text-white tracking-widest uppercase">ประกาศหาคนรีวิวสินค้าพรีเมียม</h2>
              </div>
              <button
                onClick={() => setShowPostModal(false)}
                className="p-1 px-2 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handlePostJob} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              
              {formError && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-xs text-red-600 flex items-center gap-1.5 rounded">
                  <ShieldAlert className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">ชื่องานโพสต์จัดจ้าง <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="เช่น รีวิวครีมเซรั่มหน้าใสสูตร 24K Gold Lift"
                  className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs outline-none"
                />
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">รายละเอียดแคมเปญ ขอบเขตงาน <span className="text-red-500">*</span></label>
                <textarea
                  rows={3}
                  required
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="เช่น ต้องการอินฟลูเอนเซอร์อัปเดตรูปถ่ายผิวอิ่มน้ำ วิดีโอ 1 นาที แนบแฮชแท็กแบรนด์สปา"
                  className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Category Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">หมวดหมู่แคมเปญ <span className="text-red-500">*</span></label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs outline-none bg-white font-prompt"
                  >
                    {CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                {/* Province Selection */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">จังหวัดรับงานจริง <span className="text-red-500">*</span></label>
                  <select
                    value={province}
                    onChange={e => setProvince(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs outline-none bg-white font-prompt"
                  >
                    {THAI_PROVINCES.map(prov => (
                      <option key={prov} value={prov}>{prov}</option>
                    ))}
                  </select>
                </div>

                {/* Required Age Range */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">เกณฑ์ช่วงอายุ <span className="text-red-500">*</span></label>
                  <select
                    value={ageRange}
                    onChange={e => setAgeRange(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs outline-none bg-white"
                  >
                    <option value="18-23">18 - 23 ปี</option>
                    <option value="24-30">24 - 30 ปี</option>
                    <option value="31-45">31 - 45 ปี</option>
                    <option value="45-60">45 - 60 ปี</option>
                  </select>
                </div>

                {/* Required Gender */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">เกณฑ์เพศของอินฟลูฯ <span className="text-red-500">*</span></label>
                  <select
                    value={genderRequired}
                    onChange={e => setGenderRequired(e.target.value as any)}
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs outline-none bg-white"
                  >
                    <option value="All">ทั้งหมดทุกเพศ</option>
                    <option value="Male">ชาย (Male)</option>
                    <option value="Female">หญิง (Female)</option>
                    <option value="LGBTQ">LGBTQ</option>
                  </select>
                </div>

                {/* Required Follower Range */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">เกณฑ์ช่วงผู้ติดตามอินฟลูฯ <span className="text-red-500">*</span></label>
                  <select
                    value={followerRange}
                    onChange={e => setFollowerRange(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs outline-none bg-white font-prompt"
                  >
                    <option value="All">ทั้งหมด (ไม่จำกัดยอดผู้ติดตาม)</option>
                    <option value="Under 10k">ต่ำกว่า 10,000 คน (Nano)</option>
                    <option value="10k-50k">10,000 - 50,000 คน (Micro)</option>
                    <option value="50k-100k">50,000 - 100,000 คน (Mid-tier)</option>
                    <option value="100k-500k">100,000 - 500,000 คน (Macro)</option>
                    <option value="500k+">500,000 คนขึ้นไป (Mega)</option>
                  </select>
                </div>

                {/* Cash Budget */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">งบเสนอราคาสุทธิ (THB) <span className="text-red-500">*</span></label>
                  <input
                    type="number"
                    required
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="เช่น 35000"
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 text-xs outline-none"
                  />
                </div>

                {/* Selected platforms checkbox */}
                <div className="space-y-1.5 sm:col-span-1">
                  <label className="block text-xs font-bold text-neutral-700">แพลตฟอร์มเผยแพร่ <span className="text-red-500">*</span></label>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {PLATFORMS.map(p => {
                      const isSel = platforms.includes(p);
                      return (
                        <button
                          type="button"
                          key={p}
                          onClick={() => {
                            setPlatforms(prev =>
                              prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
                            );
                          }}
                          className={`px-2.5 py-1 text-[10px] rounded border transition-all ${
                            isSel
                              ? 'bg-gold-500 text-white border-gold-500'
                              : 'bg-white text-neutral-700 border-neutral-250 hover:bg-neutral-50'
                          }`}
                        >
                          {p}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowPostModal(false)}
                  className="px-4 py-2 border rounded text-xs text-neutral-500 hover:bg-neutral-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 hover:bg-neutral-900 border border-gold-400 text-gold-400 rounded text-xs font-bold"
                >
                  ประกาศโพสความคืบหน้า
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
