import React, { useState } from 'react';
import { Shield, User, Landmark, Pencil, Check, Sparkles, AlertCircle, EyeOff, ShieldCheck } from 'lucide-react';
import { User as UserType } from '../types';

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
  
  if (!currentUser) {
    return (
      <div className="max-w-xl mx-auto py-20 text-center space-y-4">
        <AlertCircle className="w-10 h-10 text-neutral-300 mx-auto" />
        <h2 className="font-serif text-lg font-bold">กรุณาเข้าสู่ระบบก่อนติตตั้งค่าส่วนตัวค่ะ</h2>
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
  
  // Influencer Sensitive states (secure behind scenes)
  const [realName, setRealName] = useState(currentUser.realName || '');
  const [bankName, setBankName] = useState(currentUser.bankName || '');
  const [bankAccount, setBankAccount] = useState(currentUser.bankAccount || '');
  const [lineId, setLineId] = useState(currentUser.lineId || '');
  const [email, setEmail] = useState(currentUser.email || '');
  const [phone, setPhone] = useState(currentUser.phone || '');

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

  // Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();

    const updatedUser: UserType = {
      ...currentUser,
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
      bankName: isBrand ? currentUser.bankName : bankName,
      bankAccount: isBrand ? currentUser.bankAccount : bankAccount,
      lineId: isBrand ? currentUser.lineId : lineId,
      email: email,
      phone: phone
    };

    setCurrentUser(updatedUser);
    setAllUsers(prev => 
      prev.map(u => u.id === updatedUser.id ? updatedUser : u)
    );
    triggerToast('บันทึกปรับแก้ไขประวัติบัญชีสำเร็จเรียบร้อยแล้วค่ะ! ข้อมูลของท่านได้รับการซิงก์เข้าระบบจัดการหลังบ้านแล้ว', 'success');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8 animate-in fade-in duration-300 font-sans">
      
      {/* Header section card */}
      <div className="bg-white p-8 rounded-3xl border border-[#D4AF37]/20 luxury-shadow space-y-2">
        <h1 className="font-sans text-2xl font-light text-neutral-900">จัดการ<span className="font-bold">ข้อมูลบัตรสมาชิก</span></h1>
        <p className="text-xs text-neutral-400 font-light uppercase tracking-wider">อัปเกรดรายละเอียดจุดยืน แก้ไขบัญชีติดต่อ และจัดเก็บข้อมูลอย่างเป็นความลับที่สุดตามมาตรฐานความปลอดภัยสูง</p>
      </div>

      <form onSubmit={handleSaveProfile} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left Side: Avatar & Privacy Info Box */}
        <div className="space-y-6 md:col-span-1">
          
          <div className="bg-white p-6 rounded-3xl border border-[#D4AF37]/10 text-center space-y-4 luxury-shadow">
            <div className="relative w-28 h-28 mx-auto">
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
                alt={currentUser.username}
                className="w-28 h-28 rounded-full border border-[#D4AF37]/35 p-0.5 object-cover"
              />
              <span className="absolute bottom-1 right-1 p-1 bg-black border border-[#D4AF37]/45 text-[#D4AF37] rounded-full cursor-pointer" title="แก้ไข">
                <Pencil className="w-3.5 h-3.5" />
              </span>
            </div>

            <div className="space-y-1">
              <h3 className="font-sans text-base font-semibold text-neutral-950">
                {currentUser.brandName || currentUser.username}
              </h3>
              <span className="text-[9px] font-bold tracking-widest text-[#B8860B] bg-[#D4AF37]/10 px-3 py-0.5 rounded-full uppercase">
                {currentUser.role}
              </span>
            </div>
            
            <p className="text-[11px] text-neutral-400 font-light">
              ดูแลระบบรักษาความปลอดภัยเครือข่ายของ EveIn ปิดบังข้อมูลส่วนบุคคลของคุณอย่างปลอดภัยเสมอค่ะ
            </p>
          </div>

          <div className="bg-neutral-950 p-6 rounded-3xl border border-[#D4AF37]/30 text-white space-y-3 shadow-xl">
            <div className="flex gap-2 items-center text-xs font-bold text-[#D4AF37] tracking-wider uppercase">
              <ShieldCheck className="w-4 h-4 shrink-0 text-[#D4AF37]" />
              <span>PDPA SECURITY POLICY</span>
            </div>
            
            <p className="text-[10px] text-neutral-400 leading-relaxed font-light">
              ข้อมูลที่อ่อนไหว เช่น <strong>บัญชีธนาคาร ชื่อนามสกุลจริง เบอร์ติดต่อ และไอดีไลน์</strong> จะถูกบันทึกและซ่อนไว้สำหรับการประมวลผลภายในเท่านั้น บุคคลสาธารณะจะไม่สามารถเห็นช่องทางและตารางการโอนเลขจริงเหล่านี้ได้เลยค่ะ
            </p>
          </div>

        </div>

        {/* Right Side: Inputs form */}
        <div className="md:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#D4AF37]/10 luxury-shadow space-y-6">
          
          <div className="flex justify-between items-center pb-4 border-b border-neutral-100">
            <h2 className="text-xs font-bold tracking-widest text-[#B8860B] uppercase flex items-center gap-2">
              <Sparkles className="w-4.5 h-4.5" />
              <span>แก้ไขรายละเอียดตามประเภท {currentUser.role === 'Brand' ? 'แบรนด์ผู้จ้าง' : 'อินฟลูเอนเซอร์'}</span>
            </h2>
          </div>

          {/* ======================================= */}
          {/* BRAND PROFILE SPECIFIC INPUTS           */}
          {/* ======================================= */}
          {isBrand ? (
            <div className="space-y-4">
              
              {/* Brand Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">ชื่อแบรนด์ / บริษัทที่จ้างงาน</label>
                <input
                  type="text"
                  required
                  value={brandName}
                  onChange={e => setBrandName(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                />
              </div>

              {/* Bio Description */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">คำอธิบายภาพรวมแบรนด์ (Bio)</label>
                <textarea
                  rows={4}
                  value={brandBio}
                  onChange={e => setBrandBio(e.target.value)}
                  placeholder="แนะนำประวัติความงามสปา หรือความเป็นคุณ..."
                  className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                />
              </div>

              {/* Product categories interest checkboxes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">ประเภทโปรดักส์สินค้าที่ต้องการรีวิว (เลือกคละกันได้)</label>
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
                            ? 'bg-gold-500 text-white border-gold-500 font-semibold'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

            </div>
          ) : (
            /* ======================================= */
            /* INFLUENCER PROFILE SPECIFIC INPUTS      */
            /* ======================================= */
            <div className="space-y-5">
              
              <div className="space-y-2 text-neutral-800 font-bold text-xs pb-2 border-b border-neutral-100">
                <span>ส่วนที่ 1: ข้อมูลสาธารณะที่คนอื่นเห็นและแก้ไขได้</span>
              </div>

              {/* Nickname / Display handle */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">ชื่อเล่นใช้งาน / นามแฝงดีลเลอร์</label>
                <input
                  type="text"
                  required
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Age */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">อายุ (18 - 60 ปี)</label>
                  <input
                    type="number"
                    min={18}
                    max={60}
                    value={age}
                    onChange={e => setAge(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded border-neutral-200 text-xs"
                  />
                </div>

                {/* Gender */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">เพศสภาพ</label>
                  <select
                    value={gender}
                    onChange={e => setGender(e.target.value)}
                    className="w-full px-3 py-1.5 border rounded border-neutral-200 text-xs bg-white font-prompt"
                  >
                    <option value="Female">หญิง (Female)</option>
                    <option value="Male">ชาย (Male)</option>
                    <option value="LGBTQ">LGBTQ</option>
                  </select>
                </div>
              </div>

              {/* Bio summary */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">ประมวลคำอธิบายตัวเองย่อๆ เพื่อความร่วมมือ</label>
                <textarea
                  rows={3}
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs outline-none"
                />
              </div>

              {/* Work categories checkboxes */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">ประเภทงานรีวิวที่สะดวกรับดีล</label>
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
                            ? 'bg-gold-500 text-white border-gold-500 font-semibold'
                            : 'bg-white text-neutral-600 border-neutral-200 hover:bg-neutral-50'
                        }`}
                      >
                        {cat}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="space-y-2 text-neutral-800 font-bold text-xs pt-4 pb-2 border-b border-neutral-100 flex items-center gap-1">
                <EyeOff className="w-4 h-4 text-amber-600" />
                <span>ส่วนที่ 2: ข้อมูลส่วนตัว (อินฟลูฯ ต้องกรอกแต่จะส่งไปเก็บหลังบ้านให้เฉพาะแอดมินดูเท่านั้น)</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Full Real name */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700">ชื่อจริง - นามสกุลจริง (สำหรับบิลชำระภาษี)</label>
                  <input
                    type="text"
                    required
                    value={realName}
                    onChange={e => setRealName(e.target.value)}
                    placeholder="เช่น น.ส. ชัญญา โสณกุล"
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </div>

                {/* Bank account details */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">ชื่อธนาคารบัญชีรับเงินโอน</label>
                  <input
                    type="text"
                    required
                    value={bankName}
                    onChange={e => setBankName(e.target.value)}
                    placeholder="เช่น ธนาคารกสิกรไทย (KBank)"
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none font-prompt"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">เลขที่บัญชีธนาคาร</label>
                  <input
                    type="text"
                    required
                    value={bankAccount}
                    onChange={e => setBankAccount(e.target.value)}
                    placeholder="เช่น 055-1-11111-1"
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                </div>

                {/* Contact channels */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">เบอร์โทรศัพท์ติดต่อโดยตรง</label>
                  <input
                    type="text"
                    required
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded text-xs outline-none"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">Line ID ทางการ</label>
                  <input
                    type="text"
                    required
                    value={lineId}
                    onChange={e => setLineId(e.target.value)}
                    placeholder="เช่น chanya_line_official"
                    className="w-full px-3.5 py-2 border rounded text-xs outline-none"
                  />
                </div>

              </div>
              
            </div>
          )}

          {/* Core submit button */}
          <div className="pt-6 border-t border-neutral-100 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 bg-black text-[#D4AF37] hover:text-white rounded-full font-bold text-xs uppercase tracking-widest border border-[#D4AF37]/45 transition-all duration-300 font-sans cursor-pointer"
            >
              บันทึกการปรับปรุงประวัติ
            </button>
          </div>

        </div>

      </form>
    </div>
  );
}
