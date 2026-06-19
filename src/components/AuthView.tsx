import React, { useState } from 'react';
import { Mail, Phone, Lock, User as UserIcon, Sparkles, X, ShieldAlert, HeartHandshake } from 'lucide-react';
import { User, Role } from '../types';

interface AuthViewProps {
  onAuthSuccess: (user: User) => void;
  allUsers: User[];
  allUsersSet: React.Dispatch<React.SetStateAction<User[]>>;
  showType: 'login' | 'register';
  onClose: () => void;
  triggerToast: (msg: string, status: 'success' | 'info' | 'warning') => void;
}

export default function AuthView({
  onAuthSuccess,
  allUsers,
  allUsersSet,
  showType,
  onClose,
  triggerToast,
}: AuthViewProps) {
  const [currentView, setCurrentView] = useState<'login' | 'register'>(showType);
  
  // Login States
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  // Register States
  const [regRole, setRegRole] = useState<Role>('Influencer');
  const [regUsername, setRegUsername] = useState('');
  const [regGender, setRegGender] = useState('Female');
  const [regAge, setRegAge] = useState<number>(25);
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');

  const [formError, setFormError] = useState<string | null>(null);

  // LOGIN OPERATION
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Validate min password 8 length
    if (loginPassword.length < 8) {
      setFormError('รหัสผ่านต้องมีความยาวอย่างน้อย 8 ตัวอักษรค่ะ');
      return;
    }

    // Try finding matching mock user in database
    let foundUser: User | undefined;
    if (loginMethod === 'email') {
      foundUser = allUsers.find(u => u.email.toLowerCase() === loginEmail.toLowerCase());
    } else {
      foundUser = allUsers.find(u => u.phone === loginPhone);
    }

    if (foundUser) {
      if (foundUser.email.toLowerCase() === 'adminpoei@evein.com') {
        if (loginPassword !== 'Poei2411982A') {
          setFormError('รหัสผ่านผู้ดูแลระบบสูงสุดไม่ถูกต้อง การอนุญาตถูกปฏิเสธค่ะ');
          return;
        }
      } else if (foundUser.password && foundUser.password !== loginPassword) {
        setFormError('รหัสผ่านไม่ถูกต้องสำหรับบัญชีผู้ใช้นี้ กรุณาลองใหม่อีกครั้งค่ะ');
        return;
      }
      onAuthSuccess(foundUser);
      triggerToast(`ยินดีต้อนรับกลับเข้าสู่ระบบค่ะ คุณ ${foundUser.brandName || foundUser.username}!`, 'success');
      onClose();
    } else {
      if (loginMethod === 'email') {
        setFormError('ไม่พบบัญชีผู้ใช้งานที่มีอีเมลนี้ในระบบค่ะ กรุณาสมัครสมาชิกก่อนเข้าใช้งาน หรือตรวจสอบความถูกต้องสะกดคำค่ะ');
      } else {
        setFormError('ไม่พบบัญชีผู้ใช้งานที่มีเบอร์โทรศัพท์นี้ในระบบค่ะ กรุณาสมัครสมาชิกก่อนเข้าใช้งาน หรือตรวจสอบความถูกต้องค่ะ');
      }
    }
  };

  // REGISTER OPERATION
  const handleRegisterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!regUsername.trim() || !regEmail.trim() || !regPhone.trim() || !regPassword.trim()) {
      setFormError('กรุณากรอกข้อมูลสำคัญให้ครบถ้วนทุกช่องค่ะ');
      return;
    }

    if (regPassword.length < 8) {
      setFormError('รหัสผ่านความยาวรวมต้องมีอย่างน้อย 8 หลักนะคะ');
      return;
    }

    if (regPhone.length !== 10) {
      setFormError('เบอร์โทรศัพท์มือถือต้องมีความยาวรวม 10 หลักเท่านั้นค่ะ');
      return;
    }

    const targetEmail = regEmail.trim().toLowerCase();
    if (targetEmail === 'adminpoei@evein.com' || allUsers.some(u => u.email.toLowerCase() === targetEmail)) {
      setFormError('ขออภัยค่ะ อีเมลนี้ได้ลงทะเบียนระบบไปแล้ว กรุณาไปที่หน้าเข้าสู่ระบบนะคะ');
      return;
    }

    const newUser: User = {
      id: `u_${Date.now()}`,
      username: regUsername.replace(/\s+/g, '_'),
      realName: regUsername,
      role: regRole,
      gender: regGender,
      age: Number(regAge),
      email: regEmail,
      phone: regPhone,
      password: regPassword,
      bio: regRole === 'Brand' 
        ? 'แบรนด์ผู้สร้างสรรค์สินค้าเกรดพรีเมียม สมาชิกอย่างเป็นทางการของ EveIn'
        : 'ครีเอเตอร์/อินฟลูเอนเซอร์อิสระ ผู้ผ่านการลงทะเบียนแบบปลอดภัย',
      avatar: regRole === 'Brand'
        ? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=250&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
      brandName: regRole === 'Brand' ? regUsername : undefined,
      productCategories: regRole === 'Brand' ? ['เครื่องสำอาง', 'สกินแคร์'] : undefined,
      workCategories: regRole === 'Influencer' ? ['เครื่องสำอาง', 'ไลฟ์สไตล์'] : undefined,
      bankName: 'ธนาคารกสิกรไทย (KBank)',
      bankAccount: '111-2-22222-2'
    };

    allUsersSet(prev => [...prev, newUser]);
    onAuthSuccess(newUser);
    triggerToast('สมัครสมาชิกและยืนยันตัวตนสำเร็จแล้วค่ะ! ขอแสดงความยินดีในความร่วมมือ', 'success');
    onClose();
  };

  const handlePhoneInput = (e: React.FormEvent<HTMLInputElement>) => {
    // Limit to digits only and strictly max 10 chars as per specs
    const val = e.currentTarget.value.replace(/\D/g, '');
    if (val.length <= 10) {
      if (currentView === 'login') {
        setLoginPhone(val);
      } else {
        setRegPhone(val);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95 font-sans">
        
        {/* Banner with close button */}
        <div className="bg-neutral-950 p-6 text-center border-b border-gold-400 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 rounded-full bg-neutral-900 border border-neutral-850 text-neutral-400 hover:text-white"
          >
            <X className="w-4.5 h-4.5" />
          </button>
          
          <div className="inline-flex p-2 rounded-full border border-gold-400 bg-neutral-900 mb-2">
            <Sparkles className="w-5 h-5 text-gold-400" />
          </div>
          <h2 className="font-serif text-lg font-bold text-white tracking-widest uppercase">
            {currentView === 'login' ? 'เข้าสู่ระบบเครือข่าย' : 'ร่วมเป้นพรีเมียมพาร์ทเนอร์'}
          </h2>
          <p className="text-[10px] text-gold-400 uppercase font-light tracking-wide mt-1">
            EveIn Prestige Platform
          </p>
        </div>

        {/* View body */}
        <div className="p-6 space-y-5">
          {formError && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 text-xs text-red-600 flex items-center gap-1.5 rounded">
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* ================= LOGIN VIEW CONTENT ================= */}
          {currentView === 'login' && (
            <form onSubmit={handleLoginSubmit} className="space-y-4">
              
              {/* Phone or Email Switch toggling */}
              <div className="flex bg-neutral-100 p-1 rounded-lg border border-neutral-200">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${
                    loginMethod === 'email' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  เข้าด้วยอีเมล
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('phone')}
                  className={`flex-1 py-1.5 text-center text-xs font-semibold rounded-md transition-all ${
                    loginMethod === 'phone' ? 'bg-white text-neutral-950 shadow-xs' : 'text-neutral-500'
                  }`}
                >
                  เข้าด้วยเบอร์โทรศัพท์
                </button>
              </div>

              {/* Input for Email */}
              {loginMethod === 'email' ? (
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">อีเมลลงทะเบียน</label>
                  <div className="relative">
                    <input
                      type="email"
                      required
                      value={loginEmail}
                      onChange={e => setLoginEmail(e.target.value)}
                      placeholder="เช่น corporate@aurumspa.co.th"
                      className="w-full pl-9 pr-4 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                    <Mail className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              ) : (
                /* Input for Phone */
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">เบอร์โทรศัพท์มือถือ (10 หลัก)</label>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      value={loginPhone}
                      onInput={handlePhoneInput}
                      placeholder="เช่น 0812345678"
                      className="w-full pl-9 pr-4 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                    />
                    <Phone className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                  </div>
                </div>
              )}

              {/* Password min 8 chars validator field */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">รหัสผ่านบัญชี (8 ตัวอักษรขึ้นไป)</label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    minLength={8}
                    value={loginPassword}
                    onChange={e => setLoginPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-4 py-2 border rounded border-neutral-150 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                  <Lock className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 border border-gold-400 text-gold-300 hover:text-white rounded text-xs font-bold uppercase transition-all tracking-wider shadow-md"
              >
                เข้าสู่ระบบลักชัวรี่
              </button>

              {/* Disclaimer footer notice about password retrieval as specs */}
              <div className="text-center pt-2">
                <p className="text-[11px] text-neutral-400">
                  หากท่านลืมรหัสผ่านใช้งาน? <br className="sm:hidden" />
                  <span className="font-semibold text-gold-600 block sm:inline">กรุณาติดต่อแอดมินที่ปุ่มช่วยเหลือด้านข้าง</span>
                </p>
              </div>

            </form>
          )}

          {/* ================= REGISTER VIEW CONTENT ================= */}
          {currentView === 'register' && (
            <form onSubmit={handleRegisterSubmit} className="space-y-4">
              
              {/* Radio role selector */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">ระบุประเภทบัญชีของท่าน</label>
                <div className="grid grid-cols-2 gap-3">
                  
                  {/* Option Influencer */}
                  <label className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    regRole === 'Influencer' ? 'bg-gold-50/40 border-gold-400 ring-1 ring-gold-400' : 'bg-white border-neutral-200'
                  }`}>
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-neutral-800">อินฟลูเอนเซอร์</span>
                      <span className="block text-[9px] text-neutral-400">ครีเอเตอร์ / KOL</span>
                    </div>
                    <input
                      type="radio"
                      name="role"
                      checked={regRole === 'Influencer'}
                      onChange={() => setRegRole('Influencer')}
                      className="w-4 h-4 text-gold-500 cursor-pointer"
                    />
                  </label>

                  {/* Option Brand */}
                  <label className={`p-3 border rounded-xl flex items-center justify-between cursor-pointer transition-all ${
                    regRole === 'Brand' ? 'bg-gold-50/40 border-gold-400 ring-1 ring-gold-400' : 'bg-white border-neutral-200'
                  }`}>
                    <div className="space-y-0.5">
                      <span className="block text-xs font-bold text-neutral-800">แบรนด์ระดับสูง</span>
                      <span className="block text-[9px] text-neutral-400">แบรนด์ / ผู้ว่าจ้าง</span>
                    </div>
                    <input
                      type="radio"
                      name="role"
                      checked={regRole === 'Brand'}
                      onChange={() => setRegRole('Brand')}
                      className="w-4 h-4 text-gold-500 cursor-pointer"
                    />
                  </label>

                </div>
              </div>

              {/* Username / Brand Name */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">
                  {regRole === 'Brand' ? 'ชื่อแบรนด์หรือบริษัทจัดจ้าง' : 'ชื่อเล่นจริงความยาวเหมาะสม'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={regUsername}
                    onChange={e => setRegUsername(e.target.value)}
                    placeholder={regRole === 'Brand' ? 'เช่น Aurum Wellness Group' : 'เช่น ชัญญา ลุกซ์'}
                    className="w-full pl-9 pr-4 py-2 border rounded border-neutral-200 text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                  />
                  <UserIcon className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
                </div>
              </div>

              {/* Gender and Age details block in grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">เพศสภาพ</label>
                  <select
                    value={regGender}
                    onChange={e => setRegGender(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-xs outline-none bg-white font-prompt"
                  >
                    <option value="Female">หญิง (Female)</option>
                    <option value="Male">ชาย (Male)</option>
                    <option value="LGBTQ">LGBTQ</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">อายุของครีเอเตอร์ (18 - 60 ปี)</label>
                  <input
                    type="number"
                    min={18}
                    max={60}
                    value={regAge}
                    onChange={e => setRegAge(Number(e.target.value))}
                    className="w-full px-3 py-1.5 border rounded text-xs outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">อีเมลบริษัท / สารติดต่อ</label>
                <input
                  type="email"
                  required
                  value={regEmail}
                  onChange={e => setRegEmail(e.target.value)}
                  placeholder="เช่น contact@corporate.com"
                  className="w-full px-3.5 py-2 border rounded text-xs focus:ring-1 focus:ring-gold-500 outline-none font-prompt"
                />
              </div>

              {/* Telephone (capped strictly at 10 characters length) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">เบอร์โทรศัพท์มือถือ (ล็อก 10 หลัก)</label>
                <input
                  type="text"
                  required
                  value={regPhone}
                  onInput={handlePhoneInput}
                  placeholder="เช่น 0812345678"
                  className="w-full px-3.5 py-2 border rounded text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                />
              </div>

              {/* Password (8 characters upwards) */}
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">รหัสผ่านส่วนบุคคล (ขั้นต่ำ 8 หลักขึ้นไป)</label>
                <input
                  type="password"
                  required
                  minLength={8}
                  value={regPassword}
                  onChange={e => setRegPassword(e.target.value)}
                  placeholder="อย่างน้อย 8 หลักสำหรับสล๊อตความปลอดภัย"
                  className="w-full px-3.5 py-2 border rounded text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-650 hover:to-amber-700 text-white font-bold rounded text-xs uppercase tracking-wider transition-all"
              >
                ลงทะเบียนเสร็จสมบูรณ์
              </button>

            </form>
          )}

          {/* Toggle between views link footer */}
          <div className="text-center pt-3 border-t border-neutral-100 text-xs">
            {currentView === 'login' ? (
              <p className="text-neutral-500 font-light">
                ยังไม่เป็นสมาชิกเครือข่าย EveIn?{' '}
                <button
                  onClick={() => setCurrentView('register')}
                  className="text-gold-600 hover:underline font-bold"
                >
                  สมัครสมาชิกตอนนี้
                </button>
              </p>
            ) : (
              <p className="text-neutral-500 font-light">
                มีบัญชีลักชัวรี่อยู่แล้วกับเรา?{' '}
                <button
                  onClick={() => setCurrentView('login')}
                  className="text-gold-600 hover:underline font-bold"
                >
                  เข้าสู่ระบบเลย
                </button>
              </p>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}
