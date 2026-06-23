import React, { useState, useRef } from 'react';
import { Shield, User, Landmark, Pencil, Check, Sparkles, AlertCircle, EyeOff, ShieldCheck, Plus, Trash2, ExternalLink, Image } from 'lucide-react';
import { User as UserType } from '../types';
import { saveUserToFirestore } from '../lib/firebase';

interface ProfileViewProps {
  currentUser: UserType | null;
  setCurrentUser: React.Dispatch<React.SetStateAction<UserType | null>>;
  setAllUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
  triggerToast: (msg: string, status: 'success' | 'info' | 'warning') => void;
}

export default function ProfileView({
  currentUser,
  setCurrentUser,
  setAllUsers,
  triggerToast,
}: ProfileViewProps) {
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4 font-sans">
        <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto" />
        <h2 className="font-serif text-lg font-bold">กรุณาเข้าสู่ระบบก่อนตั้งค่าประวัติส่วนตัวค่ะ</h2>
      </div>
    );
  }

  const isBrand = currentUser.role === 'Brand';

  // State values for BRAND
  const [brandName, setBrandName] = useState(currentUser.brandName || '');
  const [selectedProductCats, setSelectedProductCats] = useState<string[]>(currentUser.productCategories || []);
  const [brandBio, setBrandBio] = useState(currentUser.bio || '');

  // State values for INFLUENCER
  const [nickname, setNickname] = useState(currentUser.username || '');
  const [age, setAge] = useState(currentUser.age || 25);
  const [gender, setGender] = useState(currentUser.gender || 'Female');
  const [bio, setBio] = useState(currentUser.bio || '');
  const [workCategories, setWorkCategories] = useState<string[]>(currentUser.workCategories || []);
  
  // Influencer contacts details
  const [realName, setRealName] = useState(currentUser.realName || '');
  const [lineId, setLineId] = useState(currentUser.lineId || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');

  // Bank Info Lock State (If bank details already exist in user database, they can NEVER edit them again!)
  const initialBankName = currentUser.bankName || '';
  const initialBankAccount = currentUser.bankAccount || '';
  const hasLoadedBankInfo = !!(initialBankName && initialBankAccount);
  
  const [bankName, setBankName] = useState(initialBankName);
  const [bankAccount, setBankAccount] = useState(initialBankAccount);
  const [bankLocked, setBankLocked] = useState(hasLoadedBankInfo);

  // Social Links platforms state (allows multiple platform records)
  const [socials, setSocials] = useState<{
    platform: 'Tiktok' | 'Facebook' | 'Instagram' | 'YouTube' | string;
    handle: string;
    followers: number;
    url: string;
  }[]>(() => {
    return (currentUser.socials || []).map(s => ({
      platform: s.platform,
      handle: s.handle,
      followers: s.followers,
      url: s.url || ''
    }));
  });

  // Local state for image file upload (Base64)
  const [avatar, setAvatar] = useState(currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop');

  // New social link input controls
  const [newPlatform, setNewPlatform] = useState('Instagram');
  const [newHandle, setNewHandle] = useState('');
  const [newUrl, setNewUrl] = useState('');
  const [newFollowers, setNewFollowers] = useState<number>(5000);

  const availableProductCategories = ['เครื่องสำอาง', 'สกินแคร์', 'คลินิกเสริมความงาม', 'กีฬาและสุขภาพ', 'โทรศัพท์มือถือและไอที', 'คอนโดและอสังหาริมทรัพย์', 'อื่นๆ'];
  const availableWorkCategories = ['เครื่องสำอาง', 'สกินแคร์', 'คลินิกเสริมความงาม', 'กีฬาและสุขภาพ', 'โทรศัพท์มือถือและไอที', 'คอนโดและอสังหาริมทรัพย์', 'เกม', 'อาหาร', 'ไลฟ์สไตล์', 'อื่นๆ'];

  const toggleProductCategory = (cat: string) => {
    setSelectedProductCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const toggleWorkCategory = (cat: string) => {
    setWorkCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  // Profile Picture File Selection handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        triggerToast('ขนาดไฟล์รูปภาพใหญ่เกิน 2MB ค่ะ กรุณาเลือกไฟล์ที่เล็กลง', 'warning');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setAvatar(reader.result);
          triggerToast('ดึงภาพโปรไฟล์จากอุปกรณ์ของคุณสำเร็จเรียบร้อยค่ะ!', 'success');
        }
      };
      reader.onerror = () => {
        triggerToast('เกิดข้อผิดพลาดในการโหลดไฟล์รูปภาพค่ะ', 'warning');
      };
      reader.readAsDataURL(file);
    }
  };

  // Add a new platform social handle link
  const handleAddSocialLink = () => {
    if (!newHandle.trim()) {
      triggerToast('กรุณากรอกชื่อช่องหรือ Handle ก่อนการเพิ่มลิงก์ค่ะ', 'warning');
      return;
    }
    if (!newUrl.trim() || !newUrl.startsWith('http')) {
      triggerToast('กรุณากรอก URL ลิงก์ที่ถูกต้อง (ขึ้นต้นด้วย http:// หรือ https://)', 'warning');
      return;
    }

    const exists = socials.some(s => s.platform === newPlatform && s.handle.toLowerCase() === newHandle.toLowerCase());
    if (exists) {
      triggerToast('คุณมีช่องแพลตฟอร์มนี้ชื่อช่องนี้อยู่แล้วค่ะ', 'warning');
      return;
    }

    setSocials(prev => [
      ...prev,
      {
        platform: newPlatform,
        handle: newHandle,
        followers: Math.max(1, Number(newFollowers)),
        url: newUrl
      }
    ]);

    setNewHandle('');
    setNewUrl('');
    setNewFollowers(5000);
    triggerToast('เพิ่มข้อมูลช่องทางแพลตฟอร์มสำเร็จแล้ว อย่าลืมกดบันทึกเพื่อบันทึกลงระบบหลักนะคะ!', 'info');
  };

  const handleRemoveSocial = (idx: number) => {
    setSocials(prev => prev.filter((_, i) => i !== idx));
    triggerToast('ลบช่องสังคมออนไลน์ที่ไม่ต้องการออกแล้ว อย่าลืมกดบันทึกนะคะ', 'info');
  };

  // Profile General details submission (Does not allow changing bank database if already lock)
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser: UserType = {
      ...currentUser,
      avatar: avatar,
      username: isBrand ? currentUser.username : nickname,
      age: isBrand ? currentUser.age : age,
      gender: isBrand ? currentUser.gender : gender,
      bio: isBrand ? brandBio : bio,
      
      // Brand Specific
      brandName: isBrand ? brandName : undefined,
      productCategories: isBrand ? selectedProductCats : undefined,
      
      // Influencer Specific
      workCategories: isBrand ? undefined : workCategories,
      realName: isBrand ? currentUser.realName : realName,
      bankName: isBrand ? undefined : bankName,
      bankAccount: isBrand ? undefined : bankAccount,
      lineId: isBrand ? currentUser.lineId : lineId,
      email: email,
      phone: phone,
      
      // Multi platform socials
      socials: isBrand ? undefined : socials.map(s => ({
        platform: s.platform as any,
        handle: s.handle,
        followers: Number(s.followers),
        url: s.url
      }))
    };

    try {
      await saveUserToFirestore(updatedUser);
      setCurrentUser(updatedUser);
      setAllUsers(prev => 
        prev.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      triggerToast('บันทึกปรับปรุงประวัติบัญชีสำเร็จเรียบร้อยแล้วค่ะ! ข้อมูลส่วนตัวได้รับการอัปเดตแล้วและพร้อมแสดงผลในการค้นหาทันที', 'success');
    } catch (err) {
      console.error(err);
      setCurrentUser(updatedUser);
      setAllUsers(prev => 
        prev.map(u => u.id === updatedUser.id ? updatedUser : u)
      );
      triggerToast('บันทึกปรับปรุงประวัติบัญชีสำเร็จเรียบร้อยแล้วค่ะ', 'success');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* Header section card */}
      <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/20 luxury-shadow space-y-2">
        <h1 className="font-sans text-2xl font-light text-neutral-900">จัดการ<span className="font-bold">ข้อมูลส่วนตัวและแพลตฟอร์ม</span></h1>
        <p className="text-xs text-neutral-400 font-light uppercase tracking-wider">อัปเกรดรายละเอียดจุดยืน คัดเลือกช่องทางโซเชียลมีเดียหลายแพลตฟอร์ม และจัดตั้งระดับระบบการเงินรับงานอย่างราบรื่น</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* LEFT SIDEBAR: Avatar details & Regular User identification */}
        <div className="space-y-6 md:col-span-1">
          
          <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/10 text-center space-y-4 luxury-shadow">
            
            {/* Click to change avatar box (loads local device files and uploads with base64 conversion) */}
            <div className="relative w-32 h-32 mx-auto group">
              <img
                src={avatar}
                alt={currentUser.username}
                className="w-32 h-32 rounded-full border-2 border-[#D4AF37] p-1 object-cover"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="absolute inset-0 bg-black/60 rounded-full flex flex-col items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer text-[10px] font-bold"
              >
                <Image className="w-5 h-5 mb-1 text-[#D4AF37]" />
                <span>เปลี่ยนรูปประวัติ</span>
              </button>
              
              {/* Hidden file input for native device image upload */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>

            {/* Click info banner */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="text-[10px] font-semibold text-gold-600 hover:underline inline-flex items-center gap-1"
            >
              <Pencil className="w-3 h-3" /> ดึงภาพจากเครื่องและไฟล์ดิบ
            </button>

            <div className="space-y-2 pt-2 border-t border-neutral-100">
              <h3 className="font-sans text-base font-bold text-neutral-950">
                {currentUser.brandName || currentUser.username}
              </h3>
              
              {/* Role Indicator along with explicit type (อินฟู / แบรนด์) */}
              <div className="flex flex-col gap-1.5 items-center justify-center">
                {currentUser.role === 'Admin' ? (
                  <span className="text-[10px] font-bold tracking-widest text-[#D4AF37] bg-neutral-950 border border-[#D4AF37] px-3.5 py-1 rounded-full uppercase">
                    👑 ผู้ดูแลระบบสูงสุด (Admin)
                  </span>
                ) : (
                  <div className="space-y-1">
                    <span className="block text-[11.5px] font-bold text-gray-700">
                      ประเภทสมาชิก: {currentUser.role === 'Brand' ? '🏢 แบรนด์ผู้ว่าจ้าง (Brand)' : '✨ อินฟลูเอนเซอร์ (Influencer)'}
                    </span>
                  </div>
                )}
              </div>
            </div>
            
            <p className="text-[10px] text-neutral-400 font-light">
              ข้อมูลประวัติของบัญชีผู้ใช้นี้ ซิงค์โดยตรงกับแอดมินหลังบ้านเพื่อจัดสรรมูลค่าและการส่งสลิปดีลค่ะ
            </p>
          </div>

          {/* Secure Reassurance Policy info */}
          <div className="bg-neutral-950 p-6 rounded-3xl border border-[#D4AF37]/35 text-white space-y-3 shadow-xl">
            <div className="flex gap-2 items-center text-xs font-bold text-[#D4AF37] tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#D4AF37]" />
              <span>การจดจำประวัติเข้าระบบจัดการหลังบ้าน</span>
            </div>
            <p className="text-[10px] text-neutral-300 leading-relaxed font-light font-sans">
              ตามคำสั่งทางเทคนิค ข้อมูลที่ถูกแก้ไขและลิ้งค์แพลตฟอร์มทั้งหมดจะซอฟต์บันทึกไปยังระบบ <strong>Backend การจัดการเว็บไซต์</strong> (Admin Portal) เพื่อให้แอดมินและผู้ดูแลระบบหลักใช้ประเมินและโอนยอดงบตามจริงเท่านั้นค่ะ
            </p>
          </div>

        </div>

        {/* RIGHT AREA: Editable Information Form */}
        <form onSubmit={handleSaveProfile} className="md:col-span-2 space-y-6">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-neutral-150 luxury-shadow space-y-6">
            
            <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
              <h2 className="text-xs font-bold tracking-widest text-[#B8860B] uppercase flex items-center gap-1.5 font-sans">
                <Sparkles className="w-5 h-5 text-[#B8860B] animate-pulse" />
                <span>บัญชีแก้ไขรายละเอียดทั่วไป (แก้ไขได้ตลอดเวลา)</span>
              </h2>
            </div>

            {/* BRAND DETAILS INPUTS */}
            {isBrand ? (
              <div className="space-y-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">ชื่อแบรนด์ผู้ว่าจ้าง / บริษัท</label>
                  <input
                    type="text"
                    required
                    value={brandName}
                    onChange={e => setBrandName(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">แนะนำโปรไฟล์แบรนด์และประวัติความงามสปา (Bio)</label>
                  <textarea
                    rows={4}
                    value={brandBio}
                    onChange={e => setBrandBio(e.target.value)}
                    placeholder="ความโดดเด่นทางความงาม หรือคความน่าเชื่อถือแบรนด์..."
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-700">ประเภทรีวิวที่แบรนด์คุณต้องการร่วมดีล (เลือกคละขอบเขตได้)</label>
                  <div className="flex flex-wrap gap-2 pt-1 font-prompt">
                    {availableProductCategories.map((cat) => {
                      const active = selectedProductCats.includes(cat);
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => toggleProductCategory(cat)}
                          className={`px-3 py-1.5 rounded text-xs border transition-all ${
                            active
                              ? 'bg-[#B8860B] text-white border-[#B8860B] font-semibold'
                              : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-700">อีเมลทางกลางดีลงาน</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2 border rounded text-xs outline-none"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-700">เบอร์โทรติดต่อประสานงาน</label>
                    <input
                      type="text"
                      required
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      className="w-full px-3.5 py-2 border rounded text-xs outline-none"
                    />
                  </div>
                </div>
              </div>
            ) : (
              // INFLUENCER DETAILS INPUTS
              <div className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-neutral-700">ชื่อเล่น / นามแฝงดีลเลอร์ออนไลน์</label>
                    <input
                      type="text"
                      required
                      value={nickname}
                      onChange={e => setNickname(e.target.value)}
                      className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-700">อายุของอินฟลู</label>
                      <input
                        type="number"
                        min={18}
                        max={60}
                        value={age}
                        onChange={e => setAge(Number(e.target.value))}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="block text-xs font-bold text-neutral-700">เพศสภาพ</label>
                      <select
                        value={gender}
                        onChange={e => setGender(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs bg-white font-prompt"
                      >
                        <option value="Female">ผู้หญิง (Female)</option>
                        <option value="Male">ผู้ชาย (Male)</option>
                        <option value="LGBTQ">LGBTQ</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">ประวัติและคติการรีวิวแบรนด์สปา (Bio ย่อ)</label>
                  <textarea
                    rows={3}
                    value={bio}
                    onChange={e => setBio(e.target.value)}
                    placeholder="เช่น สะดวกถ่ายงานนอกสถานที่ สายบิวตี้เครื่องสำอางลุกราตรีพรีเมียม..."
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs outline-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-neutral-700">ประเภทดีลงานที่คุณโปรดปราน (เลือกหลายอันได้)</label>
                  <div className="flex flex-wrap gap-2 pt-1 font-prompt">
                    {availableWorkCategories.map((cat) => {
                      const active = workCategories.includes(cat);
                      return (
                        <button
                          type="button"
                          key={cat}
                          onClick={() => toggleWorkCategory(cat)}
                          className={`px-3 py-1.5 rounded text-xs border transition-all ${
                            active
                              ? 'bg-[#B8860B] text-white border-[#B8860B] font-semibold'
                              : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                          }`}
                        >
                          {cat}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-neutral-100">
                  <span className="block text-xs font-bold text-amber-800 uppercase tracking-widest">ข้อมูลการติดต่อส่วนบุคคล (ส่งแอดมินกลาง)</span>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-neutral-500">ชื่อ-นามสกุลจริงผู้ถือบัญชี</label>
                      <input
                        type="text"
                        required
                        value={realName}
                        onChange={e => setRealName(e.target.value)}
                        placeholder="เช่น น.ส. ชัญญา โสณกุล"
                        className="w-full px-3 py-2 border rounded text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-neutral-500">อีเมลส่วนตัว</label>
                      <input
                        type="email"
                        required
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="block text-[11px] font-bold text-neutral-500">เบอร์โทรศัพท์ติดต่อ</label>
                      <input
                        type="text"
                        required
                        value={phone}
                        onChange={e => setPhone(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-1 sm:w-1/2 pt-1">
                    <label className="block text-[11px] font-bold text-neutral-500">Line ID ติดต่องานราชการ</label>
                    <input
                      type="text"
                      required
                      value={lineId}
                      onChange={e => setLineId(e.target.value)}
                      placeholder="เช่น chanya_line"
                      className="w-full px-3.5 py-2 border rounded text-xs outline-none"
                    />
                  </div>
                </div>

                {/* ======================================= */}
                {/* 1. DYNAMIC MULTIPLE PLATFORM SOCIAL LINKS */}
                {/* ======================================= */}
                <div className="space-y-4 pt-6 border-t border-neutral-100 bg-[#D4AF37]/5 p-5 rounded-2xl border border-[#D4AF37]/15">
                  <div className="space-y-1">
                    <h3 className="text-xs font-bold text-gray-900 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-amber-700" />
                      <span>ระบุช่องทางโซเชียลมีเดียหลายแบบสำหรับดีลเลอร์แบรนด์</span>
                    </h3>
                    <p className="text-[10px] text-neutral-400">ระบุลิงก์แท้และตัวเลขผู้ติดตามเพื่อให้แบรนด์ผู้ว่าชื่นชมความคุ้มมูลค่าค่ะ</p>
                  </div>

                  {/* List of currently associated platform links */}
                  <div className="space-y-2">
                    {socials.length === 0 ? (
                      <div className="p-4 bg-white rounded-lg border border-neutral-200 text-center">
                        <span className="text-xs text-neutral-400">ยังไม่มีลิงก์ช่องทางโซเชียล ยื่นกรอกฟอร์มสถิติด้านล่างได้ทันทีค่ะ</span>
                      </div>
                    ) : (
                      socials.map((soc, idx) => (
                        <div key={idx} className="flex flex-col sm:flex-row sm:items-center justify-between bg-white p-3.5 rounded-xl border border-neutral-150 gap-2">
                          <div className="space-y-1 flex-1">
                            <span className="inline-block px-2.5 py-0.5 rounded text-[10px] font-extrabold tracking-wider bg-neutral-900 text-[#D4AF37]">
                              {soc.platform}
                            </span>
                            
                            {/* EXPLICIT DESIGN COMPLIANCE: "พร้อมแสดงชื่อช่องแพลตฟอร์มนั้นพร้อมแนบลิงก์อยู่ด้านหลังชื่อ และระบุจำนวนผู้ติดตามไว้ด้วย" */}
                            <div className="text-xs text-neutral-800 font-semibold flex flex-wrap items-center gap-1.5">
                              <span>ชื่อช่อง: <strong className="text-black font-extrabold">{soc.handle}</strong></span>
                              {soc.url && (
                                <a 
                                  href={soc.url} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="inline-flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 hover:underline shrink-0"
                                >
                                  <span>(ลิงก์: {soc.url})</span>
                                  <ExternalLink className="w-3 h-3" />
                                </a>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex justify-between sm:justify-end items-center gap-4 border-t sm:border-t-0 pt-2 sm:pt-0 border-neutral-100 shrink-0">
                            <span className="text-xs font-bold text-neutral-600">
                              👉 {soc.followers.toLocaleString()} ผู้ติดตาม
                            </span>
                            <button
                              type="button"
                              onClick={() => handleRemoveSocial(idx)}
                              className="p-1 px-2.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 transition-colors text-[10px] font-bold flex items-center gap-1 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> ลบ
                            </button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Add platform form block */}
                  <div className="bg-white p-4 rounded-xl border border-neutral-200 space-y-3.5">
                    <span className="block text-[10.5px] font-bold text-amber-900 uppercase tracking-widest">+ ป้อนและเพิ่มลิงก์ช่องทางสถิติใหม่</span>
                    
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400">เลือกแพลตฟอร์ม</label>
                        <select
                          value={newPlatform}
                          onChange={e => setNewPlatform(e.target.value)}
                          className="w-full p-2 border border-neutral-200 rounded text-xs bg-white focus:ring-1 focus:ring-amber-500"
                        >
                          <option value="Instagram">Instagram</option>
                          <option value="Tiktok">TikTok</option>
                          <option value="Facebook">Facebook</option>
                          <option value="YouTube">YouTube</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400">ชื่อช่อง (Handle)</label>
                        <input
                          type="text"
                          value={newHandle}
                          onChange={e => setNewHandle(e.target.value)}
                          placeholder="เช่น Peary_Beauty"
                          className="w-full p-2 border border-neutral-200 rounded text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-neutral-400">จำนวนฟอลโลเวอร์</label>
                        <input
                          type="number"
                          value={newFollowers}
                          onChange={e => setNewFollowers(Number(e.target.value))}
                          className="w-full p-2 border border-neutral-200 rounded text-xs outline-none"
                        />
                      </div>

                      <div className="space-y-1 flex items-end">
                        <button
                          type="button"
                          onClick={handleAddSocialLink}
                          className="w-full p-2 bg-[#D4AF37] text-neutral-950 text-xs font-bold uppercase rounded hover:bg-opacity-80 transition-all flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5 shrink-0" /> เพิ่มช่อง
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold text-neutral-400 block">ลิงก์ URL อ้างอิงสู่ช่องทางของคุณ (แนบในปุ่มหลังชื่อ)</label>
                      <input
                        type="text"
                        value={newUrl}
                        onChange={e => setNewUrl(e.target.value)}
                        placeholder="เช่น https://www.tiktok.com/@peary_beauty"
                        className="w-full p-2 border border-neutral-200 rounded text-xs outline-none focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  </div>
                </div>

              </div>
            )}

            {/* Submit changes but excludes block lock fields */}
            <div className="pt-6 border-t border-neutral-150 flex justify-end">
              <button
                type="submit"
                className="px-8 py-3 bg-neutral-950 text-[#D4AF37] hover:text-white rounded-full font-bold text-xs uppercase tracking-widest border border-[#D4AF37]/50 transition-all duration-300 font-sans cursor-pointer shadow-lg"
              >
                บันทึกประวัติตามประเภทงาน
              </button>
            </div>

          </div>

          {/* ======================================= */}
          {/* 2. INFLUENCER BANK INFORMATION EDITABLE (BRAND EXCLUDED) */}
          {/* ======================================= */}
          {!isBrand && (
            <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#D4AF37]/20 luxury-shadow space-y-4">
              <div className="flex gap-2 items-center pb-3 border-b border-neutral-100">
                <Landmark className="w-5 h-5 text-amber-600" />
                <div>
                  <h3 className="text-xs font-bold text-neutral-900 uppercase tracking-wider">ช่องข้อมูลเลขบัญชีธนาคาร</h3>
                  <span className="text-[10px] text-neutral-400 block">กรอกข้อมูลบัญชีธนาคารรับค่าจ้าง (สามารถแก้ไขเปลี่ยนแปลงได้ตลอดเวลา)</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-600">ชื่อสถาบันธนาคาร</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="เช่น ธนาคารกสิกรไทย (KBank)"
                    className="w-full px-3 py-2 border border-neutral-200 rounded text-xs outline-none bg-white font-prompt"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-600">เลขที่บัญชีธนาคาร</label>
                  <input
                    type="text"
                    value={bankAccount}
                    onChange={e => setBankAccount(e.target.value)}
                    placeholder="เช่น 055-2-45210-9"
                    className="w-full px-3 py-2 border border-neutral-200 rounded text-xs outline-none bg-white"
                  />
                </div>
              </div>
            </div>
          )}

        </form>
      </div>
    </div>
  );
}
