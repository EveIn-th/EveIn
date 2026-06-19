import React, { useState } from 'react';
import { 
  Shield, 
  Users, 
  UserCheck, 
  Store, 
  Edit2, 
  Trash2, 
  UserPlus, 
  Check, 
  Save, 
  X, 
  Search, 
  Mail, 
  Phone, 
  Calendar, 
  Hash, 
  Sparkles,
  Info,
  MessageSquare,
  Send
} from 'lucide-react';
import { User, Role } from '../types';

interface AdminBackendViewProps {
  allUsers: User[];
  setAllUsers: React.Dispatch<React.SetStateAction<User[]>>;
  currentUser: User | null;
  triggerToast: (message: string, status: 'success' | 'info' | 'warning') => void;
  supportHistory: any[];
  setSupportHistory: React.Dispatch<React.SetStateAction<any[]>>;
}

export default function AdminBackendView({
  allUsers,
  setAllUsers,
  currentUser,
  triggerToast,
  supportHistory,
  setSupportHistory
}: AdminBackendViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'Brand' | 'Influencer' | 'Admin'>('All');
  
  // Editing state
  const [editingUser, setEditingUser] = useState<User | null>(null);
  
  // Adding state
  const [showAddForm, setShowAddForm] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newRealName, setNewRealName] = useState('');
  const [newRole, setNewRole] = useState<'Brand' | 'Influencer'>('Influencer');
  const [newEmail, setNewEmail] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newAge, setNewAge] = useState<number>(25);
  const [newGender, setNewGender] = useState('Female');
  const [newBrandName, setNewBrandName] = useState('');
  const [newBio, setNewBio] = useState('');

  // Support desk state
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>('guest');
  const [replyText, setReplyText] = useState('');

  // Group supportHistory by user (senderId) to list on the sidebar
  const supportUsersList = supportHistory.reduce((acc: any[], current: any) => {
    // Avoid double entries
    if (current.senderId && !acc.some(item => item.id === current.senderId)) {
      const foundUser = allUsers.find(u => u.id === current.senderId);
      const userMessages = supportHistory.filter(m => m.senderId === current.senderId);
      const lastMsg = userMessages[userMessages.length - 1];
      
      acc.push({
        id: current.senderId,
        username: foundUser?.brandName || foundUser?.username || current.senderName || 'ผู้เยี่ยมชม / Guest',
        avatar: foundUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
        role: foundUser?.role || 'Guest',
        lastMessage: lastMsg?.text || '',
        lastTime: lastMsg?.time || ''
      });
    }
    return acc;
  }, []);

  const activeChatMessages = supportHistory.filter(m => m.senderId === selectedChatUserId);

  const handleSendReply = (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const repText = replyText;
    setReplyText('');

    const foundTarget = supportUsersList.find(u => u.id === selectedChatUserId);

    const newReply = {
      id: `rep_${Date.now()}`,
      senderId: selectedChatUserId, // Mapped to the same selected chat thread
      senderName: 'แอดมินสูงสุด Poei',
      text: repText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromAdmin: true
    };

    setSupportHistory(prev => [...prev, newReply]);
    triggerToast(`ส่งข้อความตอบกลับไปยัง @${foundTarget?.username || 'ลูกค้า'} เรียบร้อยค่ะ!`, 'success');
  };

  // Handle delete user
  const handleDeleteUser = (userId: string) => {
    if (userId === currentUser?.id) {
      triggerToast('ไม่สามารถลบบัญชีแอดมินที่คุณกำลังล็อกอินค้างไว้อยู่ได้ค่ะ', 'warning');
      return;
    }
    if (window.confirm('คุณแน่ใจหรือไม่ที่จะลบผู้ใช้นี้ออกจากระบบอย่างถาวร?')) {
      setAllUsers(prev => prev.filter(u => u.id !== userId));
      triggerToast('ลบข้อมูลผู้ใช้งานสำเร็จเรียบร้อยแล้วค่ะ', 'success');
    }
  };

  // Handle edit save
  const handleEditSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editingUser.username.trim() || !editingUser.email.trim() || !editingUser.phone.trim()) {
      triggerToast('กรุณากรอกข้อมูลสำคัญที่มีสัญลักษณ์บังคับให้ครบถ้วนค่ะ', 'warning');
      return;
    }

    setAllUsers(prev => 
      prev.map(u => u.id === editingUser.id ? editingUser : u)
    );
    
    triggerToast(`ปรับปรุงข้อมูลส่วนบุคคลของกลุ่มผู้ใช้ @${editingUser.username} เรียบร้อยแล้วค่ะ`, 'success');
    setEditingUser(null);
  };

  // Handle add user save
  const handleAddUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUsername.trim() || !newEmail.trim() || !newPhone.trim() || !newPassword.trim()) {
      triggerToast('กรุณากรอกข้อมูลเพื่อใช้ยืนยันตัวตนให้ครบถ้วนค่ะ', 'warning');
      return;
    }

    const emailLower = newEmail.trim().toLowerCase();
    if (allUsers.some(u => u.email.toLowerCase() === emailLower)) {
      triggerToast('อีเมลนี้เคยได้รับการลงทะเบียนไปแล้ว กรุณาใช้อีเมลอื่นค่ะ', 'warning');
      return;
    }

    const newUserObj: User = {
      id: `u_admin_created_${Date.now()}`,
      username: newUsername.replace(/\s+/g, '_'),
      realName: newRealName || newUsername,
      role: newRole,
      gender: newGender,
      age: Number(newAge),
      email: newEmail,
      phone: newPhone,
      password: newPassword,
      bio: newBio || (newRole === 'Brand' ? 'แบรนด์พรีเมียม สมาชิกเครือข่าย' : 'อินฟลูเอนเซอร์ผ่านการคัดเลือกพิเศษ'),
      brandName: newRole === 'Brand' ? (newBrandName || newRealName || newUsername) : undefined,
      avatar: newRole === 'Brand' 
        ? 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=250&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
      bankName: 'ธนาคารกสิกรไทย (KBank)',
      bankAccount: '111-2-22222-2'
    };

    setAllUsers(prev => [...prev, newUserObj]);
    triggerToast(`เพิ่มสมาชิกผู้ใช้ใหม่ "${newRealName || newUsername}" เข้าระบบสำเร็จเรียบร้อยค่ะ`, 'success');
    
    // Reset add states
    setShowAddForm(false);
    setNewUsername('');
    setNewRealName('');
    setNewEmail('');
    setNewPhone('');
    setNewPassword('');
    setNewAge(25);
    setNewGender('Female');
    setNewBrandName('');
    setNewBio('');
  };

  // Filter users based on query and role filter
  const filteredUsers = allUsers.filter(u => {
    const matchesSearch = 
      u.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (u.realName || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.phone.includes(searchTerm) ||
      (u.brandName || '').toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRole = roleFilter === 'All' ? true : u.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  const totalBrands = allUsers.filter(u => u.role === 'Brand').length;
  const totalInfluencers = allUsers.filter(u => u.role === 'Influencer').length;
  const totalAdmins = allUsers.filter(u => u.role === 'Admin').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-8 rounded-3xl border border-gold-400/30 shadow-2xl relative overflow-hidden mb-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-450/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-400/10 border border-gold-450/40 text-gold-400 rounded-full text-[10px] uppercase tracking-widest font-bold">
              <Shield className="w-3.5 h-3.5" />
              <span>Website Super Administrator Console</span>
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-white tracking-wide">
              ตัวจัดการระบบหลังบ้าน <span className="gold-text">EveIn Back-End</span>
            </h1>
            <p className="text-xs text-neutral-400 font-prompt leading-relaxed">
              ยินดีต้อนรับแอดมินสูงสุด คุณ <span className="font-semibold text-white">{currentUser?.realName || currentUser?.username}</span> มิติพิเศษสำหรับคัดกรองและปรับสมาธิสากลของพาร์ทเนอร์แบรนด์และอินฟลูเอนเซอร์ลักชัวรี่ค่ะ
            </p>
          </div>
          
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-5 py-3 rounded-full bg-gold-500 hover:bg-gold-600 active:scale-95 text-neutral-950 text-xs font-bold uppercase tracking-wider shadow-lg shadow-gold-500/20 transition-all flex items-center gap-2 cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>เพิ่มพาร์ทเนอร์ภายนอก</span>
          </button>
        </div>
      </div>

      {/* Stats Board */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-neutral-100 rounded-2xl text-neutral-700">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400">สมาชิกทั้งหมด</span>
            <span className="text-2xl font-black text-neutral-800">{allUsers.length} บัญชี</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-gold-400/10 rounded-2xl text-gold-600">
            <Store className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400">แบรนด์ระดับสูง</span>
            <span className="text-2xl font-black text-[#B8860B]">{totalBrands} สังกัด</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-emerald-50 rounded-2xl text-emerald-600">
            <UserCheck className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400">อินฟลูเอนเซอร์</span>
            <span className="text-2xl font-black text-emerald-600">{totalInfluencers} รายการ</span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-neutral-100 shadow-xs flex items-center gap-4">
          <div className="p-3.5 bg-indigo-50 rounded-2xl text-indigo-600">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="block text-[10px] uppercase font-bold tracking-wider text-neutral-400">แอดมินหลังบ้าน</span>
            <span className="text-2xl font-black text-indigo-600">{totalAdmins} ตำแหน่ง</span>
          </div>
        </div>
      </div>

      {/* Add User Form container collapse card */}
      {showAddForm && (
        <div className="bg-white border border-gold-300 p-6 rounded-3xl mb-8 shadow-xl animate-in slide-in-from-top-10 duration-300">
          <div className="flex justify-between items-center pb-4 mb-4 border-b border-neutral-100">
            <div className="flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-gold-500" />
              <h3 className="font-serif font-bold text-base text-neutral-800">ลงทะเบียนสมาชิกใหม่ในระบบทางการ</h3>
            </div>
            <button 
              onClick={() => setShowAddForm(false)}
              className="text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleAddUserSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              
              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">ชื่อผู้ใช้ล็อกอิน (ภาษาอังกฤษ/สัญลักษณ์)</label>
                <input 
                  type="text" 
                  required
                  placeholder="เช่น cherry_luxe"
                  value={newUsername}
                  onChange={e => setNewUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">ชื่อจริงในการแสดงผล (ไทย/อังกฤษ)</label>
                <input 
                  type="text" 
                  required
                  placeholder="เช่น เชอร์รี่ รินลดา"
                  value={newRealName}
                  onChange={e => setNewRealName(e.target.value)}
                  className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">บทบาท/สิทธิ์ประชากร</label>
                <select 
                  value={newRole}
                  onChange={e => setNewRole(e.target.value as 'Brand' | 'Influencer')}
                  className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none bg-white focus:ring-1 focus:ring-gold-500 font-prompt"
                >
                  <option value="Influencer">อินฟลูเอนเซอร์ (Influencer)</option>
                  <option value="Brand">แบรนด์ / ผู้ว่าจ้าง (Brand)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">อีเมลทางการ</label>
                <input 
                  type="email" 
                  required
                  placeholder="เช่น cherry@evein-luxe.com"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">เบอร์โทรศัพท์ (10 หลัก)</label>
                <input 
                  type="text" 
                  required
                  maxLength={10}
                  placeholder="เช่น 0812345678"
                  value={newPhone}
                  onChange={e => setNewPhone(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">กำหนดรหัสผ่าน (ขั้นต่ำ 8 หลัก)</label>
                <input 
                  type="password" 
                  required
                  minLength={8}
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">เพศสภาพ</label>
                <select 
                  value={newGender}
                  onChange={e => setNewGender(e.target.value)}
                  className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none bg-white focus:ring-1 focus:ring-gold-500 font-prompt"
                >
                  <option value="Female">หญิง</option>
                  <option value="Male">ชาย</option>
                  <option value="LGBTQ">LGBTQ</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="block text-xs font-bold text-neutral-700">อายุ</label>
                <input 
                  type="number" 
                  min={18}
                  max={60}
                  value={newAge}
                  onChange={e => setNewAge(Number(e.target.value))}
                  className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>

              {newRole === 'Brand' && (
                <div className="space-y-1 animate-in fade-in duration-200">
                  <label className="block text-xs font-bold text-neutral-700">ชื่อแบรนด์หรือสังกัดทางกฎหมาย</label>
                  <input 
                    type="text" 
                    placeholder="เช่น Chanya Spa Corporation"
                    value={newBrandName}
                    onChange={e => setNewBrandName(e.target.value)}
                    className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              )}
            </div>

            <div className="space-y-1">
              <label className="block text-xs font-bold text-neutral-700">คำอธิบาย/ประวัติตัวตนขั้นต้น</label>
              <textarea 
                placeholder="เช่น บิวตี้บล็อกเกอร์ยอดผู้ติดตามกว่า 5 แสนราย แพลตฟอร์มหลัก TikTok"
                value={newBio}
                onChange={e => setNewBio(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none focus:ring-1 focus:ring-gold-500 text-neutral-700 placeholder:text-neutral-300"
              />
            </div>

            <div className="flex gap-2.5 justify-end">
              <button
                type="button"
                onClick={() => setShowAddForm(false)}
                className="px-4 py-2 text-xs border border-neutral-200 font-bold rounded-lg text-neutral-500 hover:bg-neutral-50 cursor-pointer"
              >
                ยกเลิก
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-gold-400 text-gold-400 hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow"
              >
                <Check className="w-4 h-4" />
                <span>บันทึกสมาชิกใหม่</span>
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Filtering and search controls */}
      <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-xs mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:w-96">
          <input 
            type="text" 
            placeholder="ค้นหาตามชื่อ, อีเมล, เบอร์โทร, แบรนด์..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-gold-500"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-2.5" />
        </div>

        <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          {(['All', 'Brand', 'Influencer', 'Admin'] as const).map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`px-4 py-1.5 text-xs font-bold rounded-full border transition-all whitespace-nowrap cursor-pointer ${
                roleFilter === role 
                  ? 'bg-neutral-950 text-gold-300 border-gold-400' 
                  : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
              }`}
            >
              {role === 'All' && 'ทั้งหมด'}
              {role === 'Brand' && 'แบรนด์ผู้จ้าง'}
              {role === 'Influencer' && 'อินฟลูเอนเซอร์'}
              {role === 'Admin' && 'ผู้ดูแลสูงสุด'}
            </button>
          ))}
        </div>
      </div>

      {/* Main user editing Modal / overlay if any selected */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95">
            
            {/* Modal Header */}
            <div className="bg-neutral-950 p-6 text-white border-b border-gold-450 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Edit2 className="w-5 h-5 text-gold-400" />
                <div>
                  <h3 className="font-serif font-black text-base text-white">แก้ไขข้อมูลสิทธิ์ระดับแอดมินสูงสุด</h3>
                  <p className="text-[10px] text-gold-350 uppercase tracking-widest mt-0.5">ID: {editingUser.id}</p>
                </div>
              </div>
              <button 
                onClick={() => setEditingUser(null)} 
                className="text-neutral-400 hover:text-white p-1 rounded-full border border-neutral-800"
              >
                <X className="w-4.5 h-4.5" />
              </button>
            </div>

            {/* Modal Form body */}
            <form onSubmit={handleEditSave} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">ชื่อล็อกอินผู้ใช้*</label>
                  <input 
                    type="text" 
                    required
                    value={editingUser.username}
                    onChange={e => setEditingUser({ ...editingUser, username: e.target.value.replace(/\s+/g, '_') })}
                    className="w-full px-3 py-2 border rounded text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">ชื่อจริงหลัก*</label>
                  <input 
                    type="text" 
                    required
                    value={editingUser.realName || ''}
                    onChange={e => setEditingUser({ ...editingUser, realName: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">อีเมลลงทะเบียน*</label>
                  <input 
                    type="email" 
                    required
                    value={editingUser.email}
                    onChange={e => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">เบอร์โทรศัพท์ติดต่อ*</label>
                  <input 
                    type="text" 
                    required
                    value={editingUser.phone}
                    onChange={e => setEditingUser({ ...editingUser, phone: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3 py-2 border rounded text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">รหัสผ่านสำหรับเข้าสู่ระบบ</label>
                  <input 
                    type="text" 
                    value={editingUser.password || ''}
                    onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                    placeholder="(ไม่มีรหัสผ่านความปลอดภัยพิเศษ)"
                    className="w-full px-3 py-2 border rounded text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">สิทธิ์พาร์ทเนอร์การใช้งาน</label>
                  <select
                    value={editingUser.role}
                    onChange={e => setEditingUser({ ...editingUser, role: e.target.value as Role })}
                    className="w-full px-3 py-2 border rounded text-xs outline-none bg-white font-prompt"
                  >
                    <option value="Influencer">อินฟลูเอนเซอร์ (Influencer)</option>
                    <option value="Brand">แบรนด์ระดับสูง (Brand)</option>
                    <option value="Admin">แอดมินหลังบ้านสูงสุด (Admin)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">อายุ</label>
                  <input 
                    type="number"
                    min={18}
                    max={60}
                    value={editingUser.age}
                    onChange={e => setEditingUser({ ...editingUser, age: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-neutral-700">เพศสภาพ</label>
                  <select
                    value={editingUser.gender}
                    onChange={e => setEditingUser({ ...editingUser, gender: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs outline-none bg-white font-prompt"
                  >
                    <option value="Female">หญิง</option>
                    <option value="Male">ชาย</option>
                    <option value="LGBTQ">LGBTQ</option>
                  </select>
                </div>

                {editingUser.role === 'Brand' && (
                  <div className="space-y-1 col-span-1 md:col-span-2">
                    <label className="block text-xs font-bold text-neutral-700">ชื่อแบรนด์หรือบริษัทต้นสังกัด</label>
                    <input 
                      type="text" 
                      value={editingUser.brandName || ''}
                      onChange={e => setEditingUser({ ...editingUser, brandName: e.target.value })}
                      className="w-full px-3 py-2 border rounded text-xs outline-none"
                    />
                  </div>
                )}

                <div className="space-y-1 col-span-1 md:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700">คำอธิบาย/ไบโอแนะนำตัว</label>
                  <textarea 
                    value={editingUser.bio || ''}
                    onChange={e => setEditingUser({ ...editingUser, bio: e.target.value })}
                    rows={2.5}
                    className="w-full px-3 py-2 border rounded text-xs outline-none"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-neutral-100 flex gap-2 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-4 py-2 border border-neutral-250 text-neutral-500 text-xs font-bold rounded-xl hover:bg-neutral-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-gold-400 text-gold-300 hover:text-white text-xs font-bold rounded-xl flex items-center gap-1.5 cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>บันทึกการแก้ไขข้อมูล</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Users table list */}
      <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-neutral-950 text-gold-400 uppercase text-[10px] tracking-wider border-b border-gold-300/25">
                <th className="py-4 px-6 font-semibold">ผู้ใช้งาน</th>
                <th className="py-4 px-6 font-semibold">เพศ / อายุ</th>
                <th className="py-4 px-6 font-semibold">อีเมล & เบอร์โทร</th>
                <th className="py-4 px-6 font-semibold">บทบาท</th>
                <th className="py-4 px-6 font-semibold">รหัสผ่าน</th>
                <th className="py-4 px-6 font-semibold text-right">ดำเนินการหลังบ้าน</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-16 text-neutral-400 font-medium font-prompt bg-neutral-50/30">
                    <Info className="w-8 h-8 mx-auto text-neutral-300 mb-2" />
                    <span>ไม่พบข้อมูลบัญชีสมาชิกสัญชาติสากลที่ต้องการค้นหาค่ะ</span>
                  </td>
                </tr>
              ) : (
                filteredUsers.map(user => (
                  <tr key={user.id} className="hover:bg-neutral-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img 
                          src={user.avatar || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=150&auto=format&fit=crop'} 
                          alt={user.username}
                          className="w-10 h-10 rounded-full object-cover border border-neutral-200"
                        />
                        <div>
                          <span className="block font-bold text-neutral-900 text-xs">@{user.username}</span>
                          <span className="block text-[11px] text-neutral-400">{user.realName || '-'}</span>
                          {user.brandName && (
                            <span className="inline-block mt-0.5 px-2 py-0.2 bg-gold-450/10 border border-gold-450/20 text-gold-700 rounded text-[9px] font-bold">
                              แบรนด์: {user.brandName}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    
                    <td className="py-4 px-6">
                      <div className="font-medium text-neutral-800">
                        {user.gender === 'Female' ? 'หญิง' : user.gender === 'Male' ? 'ชาย' : 'LGBTQ'}
                      </div>
                      <div className="text-[10px] text-neutral-400">{user.age} ปี</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1 text-neutral-800 font-medium">
                        <Mail className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
                        <span>{user.email}</span>
                      </div>
                      <div className="flex items-center gap-1 text-neutral-400 text-[10px] mt-0.5">
                        <Phone className="w-3.5 h-3.5 text-neutral-300 shrink-0" />
                        <span>{user.phone}</span>
                      </div>
                    </td>

                    <td className="py-4 px-6">
                      {user.role === 'Admin' ? (
                        <span className="px-3 py-1 text-[9px] uppercase tracking-wider font-extrabold rounded-full bg-indigo-50 text-indigo-600 border border-indigo-200">
                          แอดมินสูงสุด
                        </span>
                      ) : user.role === 'Brand' ? (
                        <span className="px-3 py-1 text-[9px] uppercase tracking-wider font-extrabold rounded-full bg-amber-50 text-amber-700 border border-amber-200">
                          แบรนด์ผู้ว่าจ้าง
                        </span>
                      ) : (
                        <span className="px-3 py-1 text-[9px] uppercase tracking-wider font-extrabold rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                          อินฟลูเอนเซอร์
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-6 font-mono text-[11px] text-neutral-500">
                      {user.password ? (
                        <span className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-700 font-bold font-mono">
                          {user.password}
                        </span>
                      ) : (
                        <span className="text-neutral-300 italic">ไม่มีบันทึก</span>
                      )}
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingUser(user)}
                          className="p-1 px-2.5 rounded bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 flex items-center gap-1 hover:shadow-xs transition-shadow cursor-pointer"
                          title="แก้ไขข้อมูลผู้ใช้รายนี้"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                          <span>แก้ไข</span>
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          className="p-1 px-2.5 rounded bg-red-50 border border-red-200 text-red-600 hover:bg-red-100 flex items-center gap-1 hover:shadow-xs transition-shadow cursor-pointer"
                          title="ลบบัญชีผู้ใช้นี้ถาวร"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>ลบ</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Real-time Admin Support Chat Desk (ติดต่อแอดมิน - Backstage) */}
      <div className="bg-white rounded-3xl border border-[#D4AF37]/20 overflow-hidden luxury-shadow font-sans">
        
        {/* Support desk header */}
        <div className="bg-neutral-950 p-6 border-b border-[#D4AF37] flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-gold-400 animate-pulse" />
              <h2 className="font-serif font-black text-lg text-white">แผงรับสายพูดคุยช่วยเหลือลูกค้า <span className="gold-text">Support Chat Console</span></h2>
            </div>
            <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-relaxed">
              ตอบกลับข้อความจริง คุยโทรเลข ตรวจสอบปัญหา และให้สิทธิพิเศษแก่ผู้ใช้งาน/ผู้เยี่ยมชมที่กดปุ่มติดต่อผู้ดูแล
            </p>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-gold-450/10 border border-gold-400/30 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
            คิวข้อความคงค้าง: {supportUsersList.length} หัวข้อสนทนา
          </span>
        </div>

        {supportUsersList.length === 0 ? (
          <div className="p-16 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-neutral-50 border border-neutral-150 flex items-center justify-center mx-auto text-neutral-400">
              <MessageSquare className="w-6 h-6" />
            </div>
            <p className="text-xs font-semibold text-neutral-500">ในขณะนี้ยังไม่มีผู้ใช้งานท่านใดส่งประวัติคำถามขอเปิดแชตเข้ามาค่ะ</p>
            <p className="text-[10px] text-neutral-400">เมื่อมีสมาชิกกดปุ่ม "ติดต่อแอดมิน" หน้าจอจะแสดงหน้าและเชื่อมโยงข้อมูลแบบเรียลไทม์ทันทีค่ะ</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 min-h-[460px]">
            
            {/* Left sidebar: list of user inquiries */}
            <div className="md:col-span-1 border-r border-neutral-100 bg-neutral-50/50 p-4 space-y-3 overflow-y-auto max-h-[500px]">
              <span className="block text-[9px] uppercase tracking-widest text-[#B8860B] font-bold mb-2">บทสนทนาที่เข้ามา</span>
              
              <div className="space-y-2">
                {supportUsersList.map((usr: any) => {
                  const isActive = selectedChatUserId === usr.id;
                  return (
                    <button
                      key={usr.id}
                      onClick={() => setSelectedChatUserId(usr.id)}
                      className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                        isActive
                          ? 'bg-neutral-950 text-white border-neutral-950 shadow-md'
                          : 'bg-white text-neutral-800 border-neutral-150 hover:bg-gold-50/20'
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={usr.avatar}
                          alt={usr.username}
                          className="w-10 h-10 rounded-full border border-neutral-200 object-cover shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold truncate max-w-[130px]">@{usr.username}</h4>
                          <span className={`inline-block text-[8px] px-1.5 py-0.2 rounded font-bold uppercase ${
                            usr.role === 'Admin' ? 'bg-indigo-150 text-indigo-800' :
                            usr.role === 'Brand' ? 'bg-amber-150 text-amber-800' :
                            usr.role === 'Influencer' ? 'bg-emerald-150 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                          }`}>
                            {usr.role === 'Guest' ? 'ผู้เยี่ยมชม' : usr.role}
                          </span>
                          <p className="text-[10px] text-neutral-400 truncate mt-0.5 max-w-[140px] font-light">
                            {usr.lastMessage}
                          </p>
                        </div>
                      </div>
                      <span className="text-[8px] text-neutral-400 self-start mt-0.5">{usr.lastTime}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Active chat viewport */}
            <div className="md:col-span-2 flex flex-col justify-between bg-white max-h-[500px]">
              
              {/* Target recipient bar */}
              <div className="p-4 border-b border-neutral-100 flex items-center gap-3 bg-neutral-50/20 shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
                <div className="text-xs">
                  <span className="text-neutral-400 font-light">กำลังพูดคุยกับ: </span>
                  <span className="font-bold text-neutral-900">
                    @{supportUsersList.find(u => u.id === selectedChatUserId)?.username || selectedChatUserId}
                  </span>
                </div>
              </div>

              {/* Message log */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/30">
                {activeChatMessages.length === 0 ? (
                  <p className="text-xs italic text-neutral-400 text-center py-10">ไม่มีรายละเอียดข้อความในห้องนี้ค่ะ</p>
                ) : (
                  activeChatMessages.map((msg: any) => (
                    <div
                      key={msg.id || Math.random()}
                      className={`flex flex-col ${msg.isFromAdmin ? 'items-end' : 'items-start'}`}
                    >
                      <span className="text-[9px] text-neutral-400 mb-0.5 px-1">
                        {msg.isFromAdmin ? 'แอดมินสูงสุด Poei (คุณ)' : msg.senderName} • {msg.time}
                      </span>
                      <div
                        className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                          msg.isFromAdmin
                            ? 'bg-neutral-950 text-white rounded-br-none border border-gold-400/20'
                            : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-none'
                        }`}
                      >
                        {msg.text}
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Chat action form */}
              <form onSubmit={handleSendReply} className="p-4 border-t border-neutral-100 flex gap-2 shrink-0 bg-white">
                <input
                  type="text"
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  placeholder={`พิมพ์ข้อความตอบกลับหา @${supportUsersList.find(u => u.id === selectedChatUserId)?.username || 'พาร์ทเนอร์'}...`}
                  className="flex-1 px-4 py-2 text-xs border border-neutral-200 rounded-full outline-none focus:border-[#D4AF37]"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-neutral-950 hover:bg-neutral-900 text-gold-300 hover:text-white rounded-full text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <span>ส่งข้อความ</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}
