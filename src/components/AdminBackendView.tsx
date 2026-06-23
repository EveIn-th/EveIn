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
  Send,
  Lock,
  Unlock,
  Ban,
  UserCheck2,
  Building,
  CreditCard,
  Key
} from 'lucide-react';
import { User, Role } from '../types';
import { saveUserToFirestore, deleteUserFromFirestore, addSupportMessageToFirestore } from '../lib/firebase';

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
  // Subtab Navigation: 'members' | 'admins' | 'chat'
  const [subTab, setSubTab] = useState<'members' | 'admins' | 'chat'>('members');

  // Unified Search states for Members
  const [searchMemberTerm, setSearchMemberTerm] = useState('');
  const [memberRoleFilter, setMemberRoleFilter] = useState<'All' | 'Brand' | 'Influencer'>('All');

  // Editing user state (for Member Management)
  const [editingUser, setEditingUser] = useState<User | null>(null);

  // Add Member Form State
  const [showAddMemberForm, setShowAddMemberForm] = useState(false);
  const [addUsername, setAddUsername] = useState('');
  const [addRealName, setAddRealName] = useState(''); // Name + Surname
  const [addPhone, setAddPhone] = useState('');
  const [addPassword, setAddPassword] = useState('');
  const [addRole, setAddRole] = useState<'Influencer' | 'Brand'>('Influencer');
  const [addEmail, setAddEmail] = useState('');
  
  // Extra fields for Brand creation
  const [addBankName, setAddBankName] = useState('ธนาคารแนะนำ (KBank)');
  const [addBankAccount, setAddBankAccount] = useState('');

  // Admin Management tab states
  const [showAddAdminForm, setShowAddAdminForm] = useState(false);
  const [addAdminUsername, setAddAdminUsername] = useState('');
  const [addAdminPhone, setAddAdminPhone] = useState('');
  const [addAdminPassword, setAddAdminPassword] = useState('');

  // Editing Admin states (modal)
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);

  // Chat/Support center states
  const [selectedChatUserId, setSelectedChatUserId] = useState<string>('guest');
  const [replyText, setReplyText] = useState('');

  // Group support messages by senderId for the sidebar
  const supportUsersList = supportHistory.reduce((acc: any[], current: any) => {
    if (current.senderId && !acc.some(item => item.id === current.senderId)) {
      const foundUser = allUsers.find(u => u.id === current.senderId);
      const userMessages = supportHistory.filter(m => m.senderId === current.senderId);
      const lastMsg = userMessages[userMessages.length - 1];
      
      acc.push({
        id: current.senderId,
        username: foundUser?.username || current.senderName || 'guest',
        realName: foundUser?.realName || '',
        phone: foundUser?.phone || 'ไม่ได้ระบุเบอร์โทร',
        avatar: foundUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150',
        role: foundUser?.role || 'Guest',
        lastMessage: lastMsg?.text || '',
        lastTime: lastMsg?.time || '',
        createdTimestamp: lastMsg?.createdTimestamp || 0
      });
    }
    return acc;
  }, []).sort((a: any, b: any) => b.createdTimestamp - a.createdTimestamp);

  // Auto-select first chat thread if current selection is guest/invalid and threads exist
  React.useEffect(() => {
    if ((selectedChatUserId === 'guest' || !supportUsersList.some(u => u.id === selectedChatUserId)) && supportUsersList.length > 0) {
      setSelectedChatUserId(supportUsersList[0].id);
    }
  }, [supportUsersList, selectedChatUserId]);

  const activeChatMessages = supportHistory.filter(m => m.senderId === selectedChatUserId);

  // Reply submission using Firebase
  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim()) return;

    const repText = replyText;
    setReplyText('');

    const foundTarget = supportUsersList.find(u => u.id === selectedChatUserId);

    const newReply = {
      senderId: selectedChatUserId, // Maps to active thread
      senderName: currentUser?.realName || currentUser?.username || 'ผู้ดูแลระบบสูงสุด',
      text: repText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isFromAdmin: true,
      createdTimestamp: Date.now()
    };

    try {
      await addSupportMessageToFirestore(newReply);
      setSupportHistory(prev => [...prev, { ...newReply, id: `rep_${Date.now()}` }]);
      triggerToast(`ส่งข้อความหา @${foundTarget?.username || 'ลูกค้า'} เรียบร้อยค่ะ!`, 'success');
    } catch (err) {
      console.error(err);
      setSupportHistory(prev => [...prev, { ...newReply, id: `rep_fallback_${Date.now()}` }]);
      triggerToast(`ส่งข้อความดีเลย์หา @${foundTarget?.username || 'ลูกค้า'} สำเร็จเรียบร้อยค่ะ`, 'success');
    }
  };

  // Toggle user Freeze Status
  const handleToggleFreeze = async (user: User) => {
    const updatedUser: User = {
      ...user,
      isFrozen: !user.isFrozen
    };

    try {
      await saveUserToFirestore(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      if (updatedUser.isFrozen) {
        triggerToast(`ได้อายัดบัญชีของ @${user.username} เรียบร้อยแล้วค่ะ สมาชิกนี้จะไม่สามารถเข้าสู่ระบบได้`, 'warning');
      } else {
        triggerToast(`ยกเลิกการอายัดของบัญชี @${user.username} สำเร็จแล้วค่ะ`, 'success');
      }
    } catch (err) {
      console.error(err);
      triggerToast('ล้มเหลวในการแก้ไขสถานะอายัดบัญชี', 'warning');
    }
  };

  // Toggle user Ban status
  const handleToggleBan = async (user: User) => {
    const updatedUser: User = {
      ...user,
      isBanned: !user.isBanned
    };

    try {
      await saveUserToFirestore(updatedUser);
      setAllUsers(prev => prev.map(u => u.id === user.id ? updatedUser : u));
      if (updatedUser.isBanned) {
        triggerToast(`แบนบัญชี @${user.username} ตลอดชีพเรียบร้อยแล้วค่ะ สมาชิกนี้จะเข้าใช้เว็บไซต์ไม่ได้`, 'warning');
      } else {
        triggerToast(`ยกเลิกแบนบัญชี @${user.username} สำเร็จแล้วค่ะ`, 'success');
      }
    } catch (err) {
      console.error(err);
      triggerToast('ล้มเหลวในการแก้ไขสถานะแบนบัญชี', 'warning');
    }
  };

  // Permanent Delete Member
  const handleDeleteUser = async (userId: string) => {
    if (userId === currentUser?.id) {
      triggerToast('ไม่สามารถลบบัญชีที่คุณกำลังล็อกอินกระทำอยู่ได้ค่ะ', 'warning');
      return;
    }
    const target = allUsers.find(u => u.id === userId);
    if (!target) return;

    if (window.confirm(`คุณแน่ใจหรือไม่ที่จะลบข้อมูลของ @${target.username} ออกจากระบบ Firestore ถาวร? ข้อมูลนี้จะไม่สามารถกู้คืนได้`)) {
      try {
        await deleteUserFromFirestore(userId);
        setAllUsers(prev => prev.filter(u => u.id !== userId));
        triggerToast('ลบสมาชิกออกจากระบบ Firestore เรียบร้อยแล้วค่ะ', 'success');
      } catch (err) {
        console.error(err);
        triggerToast('เกิดข้อผิดพลาดในการลบสมาชิก', 'warning');
      }
    }
  };

  // Submit edits for Member Account
  const handleEditMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingUser) return;

    if (!editingUser.username.trim() || !editingUser.phone.trim()) {
      triggerToast('กรุณากรอกข้อมูลสำคัญให้ครบถ้วนค่ะ', 'warning');
      return;
    }

    try {
      await saveUserToFirestore(editingUser);
      setAllUsers(prev => prev.map(u => u.id === editingUser.id ? editingUser : u));
      triggerToast(`อัปเดตข้อมูลของ @${editingUser.username} ไปยังฐานข้อมูลเรียบร้อยแล้วค่ะ`, 'success');
      setEditingUser(null);
    } catch (err) {
      console.error(err);
      triggerToast('ล้มเหลวในการปรับปรุงข้อมูลสมาชิกลงฐานข้อมูล', 'warning');
    }
  };

  // Submit Brand or Influencer Registration via Admin
  const handleAddMemberSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addUsername.trim() || !addPhone.trim() || !addPassword.trim()) {
      triggerToast('กรุณากรอกข้อมูล Name/Username, เบอร์มือถือ และ รหัสผ่าน ด้วยค่ะ', 'warning');
      return;
    }

    if (addPassword.length < 8) {
      triggerToast('รหัสผ่านความปลอดภัยต้องมีอย่างน้อย 8 หลักค่ะ', 'warning');
      return;
    }

    if (allUsers.some(u => u.phone === addPhone)) {
      triggerToast('เบอร์โทรศัพท์นี้ลงทะเบียนในระบบไปแล้ว กรุณาใช้เบอร์อื่นค่ะ', 'warning');
      return;
    }

    const cleanUsername = addUsername.trim().replace(/\s+/g, '_');
    const newId = `u_${Date.now()}`;

    const newMember: User = {
      id: newId,
      username: cleanUsername,
      realName: addRealName.trim() || addUsername.trim(),
      phone: addPhone.trim(),
      password: addPassword,
      transactionPassword: '', // Default blank
      email: addEmail.trim() || `${cleanUsername}@evein-system.com`,
      role: addRole,
      isFrozen: false,
      isBanned: false,
      gender: 'Female',
      age: 26,
      bio: addRole === 'Brand' ? 'แบรนด์ระดับสูง ได้รับการรับรองโดย Website Manager' : 'ครีเอเตอร์อิสระ คัดสรรโดยกองบรรณาธิการ',
      avatar: addRole === 'Brand'
        ? 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=250&auto=format&fit=crop'
        : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
      brandName: addRole === 'Brand' ? (addRealName.trim() || addUsername.trim()) : undefined,
      bankName: addRole === 'Brand' ? addBankName : 'ธนาคารกสิกรไทย (KBank)',
      bankAccount: addRole === 'Brand' ? addBankAccount : '222-1-33333-3'
    };

    try {
      await saveUserToFirestore(newMember);
      setAllUsers(prev => [newMember, ...prev]);
      triggerToast(`ลงทะเบียนใหม่คุณ ${newMember.realName} บทบาท [${addRole}] ลงฐานข้อมูลFirestore สำเร็จค่ะ!`, 'success');
      
      // Reset form fields
      setShowAddMemberForm(false);
      setAddUsername('');
      setAddRealName('');
      setAddPhone('');
      setAddPassword('');
      setAddEmail('');
      setAddBankAccount('');
    } catch (err) {
      console.error(err);
      triggerToast('เกิดข้อผิดพลาดในการเซฟสมาชิกใหม่', 'warning');
    }
  };

  // Submit Super Admin addition
  const handleAddAdminSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser?.role !== 'WebsiteManager') {
      triggerToast('สิทธิ์ในการเพิ่มแอดมิน สงวนเฉพาะบัญชี Website Manager เท่านั้นค่ะ', 'warning');
      return;
    }

    if (!addAdminUsername.trim() || !addAdminPhone.trim() || !addAdminPassword.trim()) {
      triggerToast('กรุณากรอกข้อมูลให้ครบถ้วนค่ะ', 'warning');
      return;
    }

    if (allUsers.some(u => u.phone === addAdminPhone)) {
      triggerToast('เบอร์โทรศัพท์แอดมินนี้ เคยถูกใช้งานแล้วค่ะ', 'warning');
      return;
    }

    const newAdminObj: User = {
      id: `admin_${Date.now()}`,
      username: addAdminUsername.trim().replace(/\s+/g, '_'),
      realName: `แอดมิน ${addAdminUsername.trim()}`,
      phone: addAdminPhone.trim(),
      password: addAdminPassword,
      transactionPassword: '',
      email: `${addAdminUsername.trim().toLowerCase()}@evein-admin.com`,
      role: 'Admin', // Super Admin
      gender: 'Female',
      age: 30,
      isFrozen: false,
      isBanned: false,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop',
      bio: 'เจ้าหน้าที่ซัพพอร์ตแบรนด์และอินฟลูเอนเซอร์ EveIn'
    };

    try {
      await saveUserToFirestore(newAdminObj);
      setAllUsers(prev => [newAdminObj, ...prev]);
      triggerToast(`เพิ่มบัญชีแอดมินระดับสูงสุด "${newAdminObj.realName}" เรียบร้อยราบรื่นค่ะ`, 'success');
      setShowAddAdminForm(false);
      setAddAdminUsername('');
      setAddAdminPhone('');
      setAddAdminPassword('');
    } catch (err) {
      console.error(err);
      triggerToast('เกิดปัญหาระหว่างจัดเก็บแอดมินใหม่ไปยังฐานข้อมูล', 'warning');
    }
  };

  // Save admin updates
  const handleEditAdminSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAdmin) return;

    if (currentUser?.role !== 'WebsiteManager' && currentUser?.id !== editingAdmin.id) {
      triggerToast('ไม่มีสิทธิ์เข้าแก้ไขบัญชีอื่นสงวนลิขสิทธิ์ความปลอดภัยสำหรับระดับผู้ดูแลสูงสุดค่ะ', 'warning');
      return;
    }

    try {
      await saveUserToFirestore(editingAdmin);
      setAllUsers(prev => prev.map(u => u.id === editingAdmin.id ? editingAdmin : u));
      triggerToast(`บันทึกรหัสแอดมิน @${editingAdmin.username} เรียบร้อยแล้วค่ะ`, 'success');
      setEditingAdmin(null);
    } catch (err) {
      console.error(err);
      triggerToast('เซฟข้อมูลแอดมินล้มเหลว', 'warning');
    }
  };

  // Filter Members based on inputs (Phone or user ID matching)
  const filteredMembers = allUsers.filter(u => {
    // Only customer (Influencer) and store (Brand) roles in member management tab
    if (u.role === 'Admin' || u.role === 'WebsiteManager') return false;

    const matchesSearch = 
      u.id.toLowerCase().includes(searchMemberTerm.toLowerCase()) ||
      u.phone.includes(searchMemberTerm) ||
      u.username.toLowerCase().includes(searchMemberTerm.toLowerCase()) ||
      (u.realName || '').toLowerCase().includes(searchMemberTerm.toLowerCase()) ||
      (u.brandName || '').toLowerCase().includes(searchMemberTerm.toLowerCase());

    const matchesRole = memberRoleFilter === 'All' ? true : u.role === memberRoleFilter;

    return matchesSearch && matchesRole;
  });

  // Filter Administrative Accounts
  const adminUsersList = allUsers.filter(u => u.role === 'Admin' || u.role === 'WebsiteManager');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 font-sans">
      
      {/* Dynamic Header Badge depending on role */}
      <div className="bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950 p-8 rounded-3xl border border-gold-400/30 shadow-2xl relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-450/5 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold-400/10 border border-gold-450/40 text-gold-400 rounded-full text-[10px] uppercase tracking-widest font-bold">
              <Shield className="w-3.5 h-3.5 animate-pulse" />
              <span>{currentUser?.role === 'WebsiteManager' ? 'Website Manager Executive Controls' : 'Super Admin Operational Console'}</span>
            </div>
            <h1 className="font-serif text-3xl font-extrabold text-white tracking-wide">
              ตัวจัดการระบบหลังบ้าน <span className="gold-text">EveIn Console</span>
            </h1>
            <p className="text-xs text-neutral-400 font-prompt leading-relaxed max-w-2xl">
              ระบบศูนย์กลางเชื่อมโยงข้อมูลตรงระหว่างหน้าบ้านและระบบคุมคลังข้อมูล Firebase Firestore ทุกการกระทำ บันทึก ยับยั้ง หรืออัปเดตสิทธิ์จะแสดงผลสะท้อนทันควันเรียลไทม์เสมอคุณ <span className="font-semibold text-white">{currentUser?.realName || currentUser?.username}</span> ค่ะ
            </p>
          </div>
          
          <div className="bg-neutral-900 px-4 py-3 rounded-2xl border border-neutral-800">
            <span className="block text-[8px] text-neutral-400 uppercase font-black tracking-widest">ระดับล็อกอินความปลอดภัย</span>
            <span className="text-xs font-bold text-gold-400 font-prompt">
              {currentUser?.role === 'WebsiteManager' ? '👑 ผู้ดูแลสูงสุด (Website Manager)' : '🛡️ แอดมินทั่วไป (Super Admin)'}
            </span>
          </div>
        </div>
      </div>

      {/* HORIZONTAL SUB-TAB NAVIGATION */}
      <div className="flex gap-1.5 border-b border-neutral-200 pb-px mb-8 overflow-x-auto">
        <button 
          onClick={() => setSubTab('members')} 
          className={`px-5 py-3 font-prompt text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            subTab === 'members' 
              ? 'bg-[#B8860B]/5 border-[#B8860B] text-[#B8860B]' 
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>การจัดการสมาชิก (พาร์ทเนอร์)</span>
        </button>

        <button 
          onClick={() => setSubTab('admins')} 
          className={`px-5 py-3 font-prompt text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            subTab === 'admins' 
              ? 'bg-[#B8860B]/5 border-[#B8860B] text-[#B8860B]' 
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <Shield className="w-4 h-4" />
          <span>จัดการแอดมิน ({adminUsersList.length})</span>
        </button>

        <button 
          onClick={() => setSubTab('chat')} 
          className={`px-5 py-3 font-prompt text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap cursor-pointer ${
            subTab === 'chat' 
              ? 'bg-[#B8860B]/5 border-[#B8860B] text-[#B8860B]' 
              : 'border-transparent text-neutral-500 hover:text-neutral-900'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>เมนูกล่องข้อความ (Live Chat)</span>
        </button>
      </div>

      {/* SUB-TAB 1: MEMBERS MANAGEMENT */}
      {subTab === 'members' && (
        <div className="space-y-6">
          
          {/* SEARCH & FILTERS ROW */}
          <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <input 
                type="text" 
                placeholder="ค้นหาตาม Phone เบอร์ หรือ User ID เครือข่าย..."
                value={searchMemberTerm}
                onChange={e => setSearchMemberTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-neutral-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-gold-500 font-prompt"
              />
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-2.5" />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <span className="text-xs text-neutral-400 font-bold hidden xl:inline">กรองสิทธิ์:</span>
              {(['All', 'Influencer', 'Brand'] as const).map(role => (
                <button
                  key={role}
                  onClick={() => setMemberRoleFilter(role)}
                  className={`px-3.5 py-1.5 text-[11px] font-bold rounded-full border transition-all cursor-pointer ${
                    memberRoleFilter === role 
                      ? 'bg-neutral-950 text-gold-300 border-gold-400 shadow-xs' 
                      : 'bg-white text-neutral-500 border-neutral-200 hover:bg-neutral-50'
                  }`}
                >
                  {role === 'All' && 'ทั้งหมด'}
                  {role === 'Influencer' && 'บัญชีลูกค้า (Influencer)'}
                  {role === 'Brand' && 'บัญชีร้านค้า (Brand)'}
                </button>
              ))}

              <button
                onClick={() => setShowAddMemberForm(!showAddMemberForm)}
                className="ml-auto px-4 py-2 bg-[#B8860B] text-white rounded-lg text-xs font-bold flex items-center gap-1.5 hover:bg-[#8B6508] active:scale-95 transition-all cursor-pointer shadow"
              >
                <UserPlus className="w-4 h-4" />
                <span>ลงทะเบียนสมาชิกใหม่</span>
              </button>
            </div>
          </div>

          {/* ADD MEMBER COLLAPSED ACCORDION */}
          {showAddMemberForm && (
            <div className="bg-white p-6 rounded-3xl border border-gold-300/40 shadow-xl space-y-4 animate-in slide-in-from-top-4 duration-250">
              <div className="flex justify-between items-center border-b border-neutral-100 pb-3">
                <div className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-[#B8860B]" />
                  <h3 className="font-serif font-bold text-base text-neutral-800">ลงทะเบียนจัดตั้งบัญชีสมาชิก (แอดมินเปิดระบบพอร์ต)</h3>
                </div>
                <button onClick={() => setShowAddMemberForm(false)} className="text-neutral-400 hover:text-neutral-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddMemberSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-700">ชื่อล็อกอิน / Name (ภาษาอังกฤษ)*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="เช่น jane_beauty"
                      value={addUsername}
                      onChange={e => setAddUsername(e.target.value)}
                      className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-700">ชื่อจริง - นามสกุล*</label>
                    <input 
                      type="text" 
                      placeholder="เช่น เจนจิรา บิวตี้แลนด์"
                      value={addRealName}
                      onChange={e => setAddRealName(e.target.value)}
                      className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-700">กําหนดรหัสผ่านเข้าสู่ระบบ*</label>
                    <input 
                      type="text" 
                      required
                      placeholder="รหัสผ่านเข้าสู่ระบบ (ขั้นต่ำ 8 อักษร)"
                      value={addPassword}
                      onChange={e => setAddPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-700">เบอร์โทรศัพท์ติดต่อ (10 หลัก)*</label>
                    <input 
                      type="text" 
                      required
                      maxLength={10}
                      placeholder="เช่น 0951234567"
                      value={addPhone}
                      onChange={e => setAddPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-700">ประเภทสิทธิ์การใช้งาน*</label>
                    <select
                      value={addRole}
                      onChange={e => setAddRole(e.target.value as 'Influencer' | 'Brand')}
                      className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none bg-white font-prompt"
                    >
                      <option value="Influencer">บัญชีลูกค้าทั่วไป / อินฟลู (Influencer)</option>
                      <option value="Brand">บัญชีร้านค้า / พลัสบริษัท (Brand)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-[11px] font-bold text-neutral-700">อีเมลพาร์ทเนอร์ (ระบุหรือไม่ระบุก็ได้)</label>
                    <input 
                      type="email" 
                      placeholder="เช่น systems@company.com"
                      value={addEmail}
                      onChange={e => setAddEmail(e.target.value)}
                      className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                    />
                  </div>
                </div>

                {/* CONDITIONAL MERCHANT-ONLY FORM FIELDS */}
                {addRole === 'Brand' && (
                  <div className="bg-gold-50/40 p-4 rounded-2xl border border-gold-200 grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in duration-200">
                    <div className="space-y-1 col-span-1">
                      <label className="block text-[11px] font-bold text-neutral-700 font-prompt">ชื่อธนาคารปักหมุดรับเงิน*</label>
                      <select
                        value={addBankName}
                        onChange={e => setAddBankName(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none bg-white font-prompt"
                      >
                        <option value="ธนาคารกสิกรไทย (KBank)">ธนาคารกสิกรไทย (KBank)</option>
                        <option value="ธนาคารไทยพาณิชย์ (SCB)">ธนาคารไทยพาณิชย์ (SCB)</option>
                        <option value="ธนาคารกรุงเทพ (BBL)">ธนาคารกรุงเทพ (BBL)</option>
                        <option value="ธนาคารกรุงไทย (KTB)">ธนาคารกรุงไทย (KTB)</option>
                        <option value="ธนาคารกรุงศรีอยุธยา (BAY)">ธนาคารกรุงศรีอยุธยา (BAY)</option>
                      </select>
                    </div>

                    <div className="space-y-1 col-span-1">
                      <label className="block text-[11px] font-bold text-neutral-700 font-prompt">เลขที่บัญชีรับเงินแบรนด์*</label>
                      <input 
                        type="text" 
                        required={addRole === 'Brand'}
                        placeholder="เช่น 748-0-12345-6"
                        value={addBankAccount}
                        onChange={e => setAddBankAccount(e.target.value)}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                      />
                    </div>
                  </div>
                )}

                <div className="flex gap-2 justify-end pt-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMemberForm(false)}
                    className="px-4 py-2 border border-neutral-250 text-neutral-500 hover:bg-neutral-50 text-xs font-bold rounded-lg cursor-pointer"
                  >
                    ยกเลิก
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-gold-450 text-gold-300 hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                  >
                    <Check className="w-4 h-4" />
                    <span>บันทึกบัญชีลงฐานข้อมูล</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* MEMBERS TABLE VIEW LIST */}
          <div className="bg-white rounded-3xl border border-neutral-100 shadow-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-neutral-950 text-gold-400 uppercase text-[10px] tracking-wider border-b border-gold-300/25 select-none">
                    <th className="py-4.5 px-6 font-semibold">User ID & ข้อมูลผู้ใช้งาน</th>
                    <th className="py-4.5 px-6 font-semibold">ประเภทบัญชี/พาร์ทเนอร์</th>
                    <th className="py-4.5 px-6 font-semibold">เบอร์โทรศัพท์ติดต่อ</th>
                    <th className="py-4.5 px-6 font-semibold">รหัสผ่านหลัก & รหัสผ่านธุรกรรม</th>
                    <th className="py-4.5 px-6 font-semibold">เลขธนาคารปักหมุด</th>
                    <th className="py-4.5 px-6 font-semibold">สถานะสิทธิ์เลเบิล</th>
                    <th className="py-4.5 px-6 font-semibold text-right">การจัดระบบหลังบ้าน</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-100 text-xs text-neutral-700">
                  {filteredMembers.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-20 text-neutral-400 font-medium font-prompt bg-neutral-50/50">
                        <Info className="w-9 h-9 mx-auto text-neutral-300 mb-2" />
                        <span className="block text-xs font-semibold">ไม่พอข้อมูลบัญชีสมาชิกที่กางระบบค้นหาค่ะ</span>
                        <span className="text-[10px] text-neutral-400">กรุณาลองกรอกเบอร์โทรหรือไอดีของสมาชิกอื่นค่ะ</span>
                      </td>
                    </tr>
                  ) : (
                    filteredMembers.map(user => (
                      <tr key={user.id} className="hover:bg-neutral-50/30 transition-colors">
                        
                        {/* 1. ID & Username card */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <img 
                              src={user.avatar || 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=150&auto=format&fit=crop'} 
                              alt={user.username}
                              className="w-10 h-10 rounded-full object-cover border border-neutral-150"
                            />
                            <div>
                              <span className="block font-bold text-neutral-900 text-xs">@{user.username}</span>
                              <span className="block text-[10px] text-neutral-400 truncate max-w-[150px]">{user.realName || '-'}</span>
                              <span className="inline-block px-1.5 py-0.2 bg-neutral-100 text-neutral-500 rounded text-[8.5px] font-mono mt-0.5">
                                ID: {user.id}
                              </span>
                            </div>
                          </div>
                        </td>

                        {/* 2. Account Type */}
                        <td className="py-4 px-6 font-prompt">
                          {user.role === 'Brand' ? (
                            <div className="flex items-center gap-1.5 text-[#B8860B] font-bold text-[11px]">
                              <Building className="w-3.5 h-3.5" />
                              <span>บัญชีร้านค้า (Brand)</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5 text-emerald-600 font-bold text-[11px]">
                              <UserCheck2 className="w-3.5 h-3.5" />
                              <span>บัญชีลูกค้า (Influencer)</span>
                            </div>
                          )}
                        </td>

                        {/* 3. Phone */}
                        <td className="py-4 px-6 font-mono text-[11.5px] text-neutral-800 font-bold">
                          {user.phone}
                        </td>

                        {/* 4. Passwords details */}
                        <td className="py-4 px-6 space-y-1 font-mono">
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-neutral-400 font-prompt text-[10px] scale-90">ล็อกอิน:</span>
                            <span className="bg-neutral-100 px-1.5 py-0.2 text-neutral-800 rounded font-bold">{user.password}</span>
                          </div>
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-neutral-400 font-prompt text-[10px] scale-90">ธุรกรรม:</span>
                            {user.transactionPassword ? (
                              <span className="bg-gold-50 border border-gold-200 px-1.5 py-0.2 text-gold-800 rounded font-bold">{user.transactionPassword}</span>
                            ) : (
                              <span className="text-neutral-305 italic text-[10px] font-prompt">(ไม่ได้ตั้งค่า)</span>
                            )}
                          </div>
                        </td>

                        {/* 5. Bank Accounts details */}
                        <td className="py-4 px-6 text-neutral-600 select-all font-prompt">
                          {user.bankName ? (
                            <div>
                              <div className="flex items-center gap-1 text-[10px] text-neutral-800 font-medium truncate max-w-[120px]">
                                <CreditCard className="w-3 h-3 text-neutral-400" />
                                <span>{user.bankName}</span>
                              </div>
                              <span className="block mt-0.5 font-mono text-[10px] tracking-tight">{user.bankAccount || '-'}</span>
                            </div>
                          ) : (
                            <span className="text-neutral-300 italic font-prompt text-[10px]">ไม่มีข้อมูลธนาคาร</span>
                          )}
                        </td>

                        {/* 6. Blockage states badges */}
                        <td className="py-4 px-6 font-prompt">
                          {user.isBanned ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-neutral-900 border border-neutral-950 text-white shadow-xs">
                              <Ban className="w-3 h-3 text-red-500" />
                              <span>แบนถาวร</span>
                            </span>
                          ) : user.isFrozen ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-red-105 border border-red-200 text-red-650">
                              <Lock className="w-3 h-3 text-red-500" />
                              <span>อายัดบัญชี</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700">
                              <Unlock className="w-3 h-3 text-emerald-600" />
                              <span>ปกติ</span>
                            </span>
                          )}
                        </td>

                        {/* 7. Action controllers */}
                        <td className="py-4 px-6 text-right">
                          <div className="flex gap-1.5 justify-end items-center flex-wrap">
                            
                            <button
                              onClick={() => setEditingUser(user)}
                              className="p-1 px-2 rounded bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-all flex items-center gap-0.5 cursor-pointer text-[10px] font-bold font-prompt"
                              title="แก้ไขข้อมูลทั้งหมดของสมาชิก"
                            >
                              <Edit2 className="w-3 h-3" />
                              <span>แก้ไข</span>
                            </button>

                            {/* Freeze toggle */}
                            <button
                              onClick={() => handleToggleFreeze(user)}
                              className={`p-1 px-2 rounded border transition-all text-[10px] font-bold font-prompt cursor-pointer ${
                                user.isFrozen
                                  ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-neutral-600'
                                  : 'bg-red-50 hover:bg-red-100 border-red-200 text-red-650'
                              }`}
                              title={user.isFrozen ? "ยกเลิกอายัด" : "อายัดบัญชีไม่ให้เข้าเล่น"}
                            >
                              {user.isFrozen ? 'ปลดอายัด' : 'อายัด'}
                            </button>

                            {/* Lifetime Ban Toggle */}
                            <button
                              onClick={() => handleToggleBan(user)}
                              className={`p-1 px-2 rounded border transition-all text-[10px] font-bold font-prompt cursor-pointer ${
                                user.isBanned
                                  ? 'bg-neutral-50 hover:bg-neutral-100 border-neutral-300 text-neutral-600'
                                  : 'bg-neutral-900 border-neutral-950 text-white hover:bg-neutral-800'
                              }`}
                              title={user.isBanned ? "ยกเลิกแบน" : "แบนสมาชิกถาวร"}
                            >
                              {user.isBanned ? 'ปลดแบน' : 'แบนชีพ'}
                            </button>

                            {/* Permanent Delete */}
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="p-1 rounded bg-red-50 text-red-650 border border-red-200 hover:bg-red-100 cursor-pointer"
                              title="ลบบัญชีออกจาก Firestore ถาวร"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
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

          {/* EDIT MEMBER ACCOUNT DETAILS MODAL */}
          {editingUser && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95 font-sans">
                
                {/* Modal Header */}
                <div className="bg-neutral-950 p-5 text-white border-b border-gold-450 flex justify-between items-center bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
                  <div className="flex items-center gap-2">
                    <Edit2 className="w-5 h-5 text-gold-400" />
                    <div>
                      <h3 className="font-serif font-black text-sm text-white">แก้ไขพอร์ตอนุญาตพาร์ทเนอร์</h3>
                      <p className="text-[9px] text-gold-350 uppercase tracking-widest mt-0.5 font-mono">FIRESTORE RECORD ID: {editingUser.id}</p>
                    </div>
                  </div>
                  <button onClick={() => setEditingUser(null)} className="text-neutral-400 hover:text-white p-1 rounded-full border border-neutral-850">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <form onSubmit={handleEditMemberSubmit} className="p-6 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-700">ชื่อล็อกอินผู้ใช้*</label>
                      <input 
                        type="text" 
                        required
                        value={editingUser.username}
                        onChange={e => setEditingUser({ ...editingUser, username: e.target.value.replace(/\s+/g, '_') })}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-700">ชื่อจริง - นามสกุล*</label>
                      <input 
                        type="text" 
                        required
                        value={editingUser.realName || ''}
                        onChange={e => setEditingUser({ ...editingUser, realName: e.target.value })}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-700">เบอร์โทรศัพท์ติดต่อ*</label>
                      <input 
                        type="text" 
                        required
                        value={editingUser.phone}
                        onChange={e => setEditingUser({ ...editingUser, phone: e.target.value.replace(/\D/g, '') })}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-700">สิทธิ์พาร์ทเนอร์การใช้งาน (ประเภท)*</label>
                      <select
                        value={editingUser.role}
                        onChange={e => setEditingUser({ ...editingUser, role: e.target.value as Role })}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none bg-white font-prompt"
                      >
                        <option value="Influencer">บัญชีลูกค้าทั่วไป/อินฟลู (Influencer)</option>
                        <option value="Brand">บัญชีร้านค้า/สปอนเซอร์ (Brand)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-gold-450 font-bold flex items-center gap-1">
                        <Key className="w-3.5 h-3.5" />
                        <span>รหัสผ่านเข้าเล่นล็อกอิน*</span>
                      </label>
                      <input 
                        type="text" 
                        value={editingUser.password || ''}
                        onChange={e => setEditingUser({ ...editingUser, password: e.target.value })}
                        required
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs font-mono outline-none bg-yellow-50/20"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-gold-450 font-bold flex items-center gap-1">
                        <Key className="w-3.5 h-3.5 text-[#B8860B]" />
                        <span>รหัสผ่านธุรกรรมทางการเงิน (6 หลัก)*</span>
                      </label>
                      <input 
                        type="text" 
                        value={editingUser.transactionPassword || ''}
                        onChange={e => setEditingUser({ ...editingUser, transactionPassword: e.target.value })}
                        placeholder="กรุณากําหนดรหัสสาส์นสากล เช่น 123456"
                        maxLength={6}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs font-mono outline-none bg-amber-50/10"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-700">ชื่อธนาคารบัญชีรับปันผล</label>
                      <select
                        value={editingUser.bankName || 'ธนาคารกสิกรไทย (KBank)'}
                        onChange={e => setEditingUser({ ...editingUser, bankName: e.target.value })}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none bg-white font-prompt"
                      >
                        <option value="ธนาคารกสิกรไทย (KBank)">ธนาคารกสิกรไทย (KBank)</option>
                        <option value="ธนาคารไทยพาณิชย์ (SCB)">ธนาคารไทยพาณิชย์ (SCB)</option>
                        <option value="ธนาคารกรุงเทพ (BBL)">ธนาคารกรุงเทพ (BBL)</option>
                        <option value="ธนาคารกรุงไทย (KTB)">ธนาคารกรุงไทย (KTB)</option>
                        <option value="ธนาคารกรุงศรีอยุธยา (BAY)">ธนาคารกรุงศรีอยุธยา (BAY)</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="block text-xs font-bold text-neutral-700">เลขที่บัญชีรับเงินแคมเปญ</label>
                      <input 
                        type="text" 
                        value={editingUser.bankAccount || ''}
                        onChange={e => setEditingUser({ ...editingUser, bankAccount: e.target.value })}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                      />
                    </div>

                    {editingUser.role === 'Brand' && (
                      <div className="space-y-1 col-span-1 md:col-span-2">
                        <label className="block text-xs font-bold text-neutral-700">ชื่อบริษัท / ตราสินค้าพรีเมียม (Brand Name)</label>
                        <input 
                          type="text" 
                          value={editingUser.brandName || ''}
                          onChange={e => setEditingUser({ ...editingUser, brandName: e.target.value, brandNameTh: e.target.value })}
                          className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                        />
                      </div>
                    )}

                    <div className="space-y-1 col-span-1 md:col-span-2">
                      <label className="block text-xs font-bold text-neutral-700">คำอธิบายประวัติตนเอง (Bio)</label>
                      <textarea 
                        value={editingUser.bio || ''}
                        onChange={e => setEditingUser({ ...editingUser, bio: e.target.value })}
                        rows={2.5}
                        className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none text-neutral-705"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className="px-4 py-2 border border-neutral-250 text-neutral-550 text-xs font-bold rounded-lg hover:bg-neutral-50 cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-neutral-950 hover:bg-neutral-900 border border-gold-450 text-gold-300 hover:text-white text-xs font-bold rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Save className="w-4 h-4" />
                      <span>บันทึกและส่งสัญญา Firestore</span>
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 2: ADMIN MANAGEMENT */}
      {subTab === 'admins' && (
        <div className="space-y-6">
          
          {/* SECURITY WARNING BANNER */}
          {currentUser?.role !== 'WebsiteManager' && (
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-2xl flex items-start gap-3 animated text-xs text-amber-800">
              <Lock className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">โหมดดูอย่างเดียวเพื่อความปลอดภัยสูง (Super Admin Read-Only)</p>
                <p className="mt-0.5 text-neutral-600 font-prompt">บัญชีของคุณคือสิทธิ์ ซูเปอร์แอดมิน คุณสามารถสแกนบงการสมาชิกร้านค้าได้จริง แต่สงวนปุ่มการ "เพิ่มแอดมินสูงสุด" หรือ "แก้ไขแอดมินหลัก" ไว้เฉพาะสัญชาติ Website Manager ยอดผู้คุมสูงสุด (คุณ Poei) เท่านั้นค่ะ สำหรับการขอปรับโครงสร้างแอฟฟิลิเอตกรุณาสะกิดเจ้าของโครงการค่ะ</p>
              </div>
            </div>
          )}

          {/* ADD ADMIN ACCORDION (Website Manager role only) */}
          {currentUser?.role === 'WebsiteManager' && (
            <div className="bg-white p-5 rounded-3xl border border-neutral-100 shadow-sm flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="font-serif font-bold text-sm text-neutral-800">เพิ่มสมาพันธ์เจ้าหน้าที่แอดมินใหม่ (Super Admin Account)</h3>
                <p className="text-[10px] text-neutral-400 font-prompt">ขยายสิทธิ์พาร์ทเนอร์ช่วยเหลือของคุณเพื่อเข้ารักษากระดานสนทนากับพาร์ทเนอร์</p>
              </div>
              <button
                onClick={() => setShowAddAdminForm(!showAddAdminForm)}
                className="px-4 py-2 rounded-lg bg-neutral-950 border border-gold-400 text-gold-400 text-xs font-bold flex items-center gap-2 hover:bg-neutral-900 active:scale-95 transition-all cursor-pointer shadow-sm"
              >
                <UserPlus className="w-4 h-4" />
                <span>{showAddAdminForm ? 'ปิดฟอร์มแต่งตั้ง' : 'แต่งตั้งแอดมินใหม่'}</span>
              </button>
            </div>
          )}

          {/* ADD ADMIN COMPACT FORM */}
          {showAddAdminForm && currentUser?.role === 'WebsiteManager' && (
            <div className="bg-white p-6 rounded-3xl border border-gold-300 shadow-xl space-y-4 animate-in slide-in-from-top-4">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-gold-700">แบบฟอร์มสถาปนา Admin บัญชีช่วยเหลือร่วม</h4>
              
              <form onSubmit={handleAddAdminSubmit} className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-700">ชื่อเรียกแอดมิน (ภาษาอังกฤษ)</label>
                  <input 
                    type="text" 
                    required
                    placeholder="เช่น cherry_admin"
                    value={addAdminUsername}
                    onChange={e => setAddAdminUsername(e.target.value)}
                    className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-700">เบอร์โทรศัพท์ประจำตำแหน่ง*</label>
                  <input 
                    type="text" 
                    required
                    maxLength={10}
                    placeholder="เบอร์โทร 10 หลัก"
                    value={addAdminPhone}
                    onChange={e => setAddAdminPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-neutral-700">กำหนดรหัสผ่านเข้าเล่น*</label>
                  <input 
                    type="text" 
                    required
                    placeholder="รหัสผ่านล็อกอิน (8 หลัก)"
                    value={addAdminPassword}
                    onChange={e => setAddAdminPassword(e.target.value)}
                    className="w-full px-3 py-2 border rounded border-neutral-200 text-xs outline-none"
                  />
                </div>

                <div className="flex items-end pb-0.5">
                  <button
                    type="submit"
                    className="w-full py-2 bg-[#B8860B] hover:bg-[#8B6508] text-white text-xs font-bold rounded-lg shadow cursor-pointer transition-all flex items-center justify-center gap-1.5"
                  >
                    <Check className="w-4 h-4" />
                    <span>สร้างบัญชีแอดมิน</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* ADMIN LIST ROW CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {adminUsersList.map(admin => {
              const isManager = admin.role === 'WebsiteManager';
              const canEditThis = currentUser?.role === 'WebsiteManager' || currentUser?.id === admin.id;

              return (
                <div 
                  key={admin.id} 
                  className={`p-6 rounded-3xl border bg-white luxury-shadow space-y-4 relative overflow-hidden transition-all hover:scale-[1.01] ${
                    isManager ? 'border-amber-400' : 'border-neutral-150'
                  }`}
                >
                  {isManager && (
                    <div className="absolute top-0 right-0 py-1 px-3 bg-amber-500/10 border-l border-b border-amber-300 text-amber-700 font-bold text-[9px] uppercase tracking-wider rounded-bl-xl font-prompt select-none">
                      👑 EXECUTIVE Website Manager
                    </div>
                  )}

                  <div className="flex items-start gap-4">
                    <img 
                      src={admin.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=250&auto=format&fit=crop'} 
                      alt={admin.username}
                      className="w-14 h-14 rounded-2xl object-cover border border-neutral-200 shadow-inner"
                    />
                    <div className="space-y-1">
                      <span className="block text-xs font-bold text-[#B8860B] uppercase tracking-wide">
                        {isManager ? 'ผู้ดูแลเว็บไซต์สูงสุด' : 'ซูเปอร์แอดมินสนับสนุน'}
                      </span>
                      <h4 className="font-serif font-black text-[#1c1917] text-base">@{admin.username}</h4>
                      <p className="text-[10px] text-neutral-400">{admin.realName || admin.username}</p>
                    </div>
                  </div>

                  <div className="bg-neutral-50 p-4 rounded-2xl grid grid-cols-2 gap-4 text-xs font-prompt">
                    <div>
                      <span className="block text-[9px] text-neutral-400 font-bold">เบอร์โทรศัพท์โทรเข้าระบบ:</span>
                      <span className="font-mono font-bold text-neutral-800">{admin.phone}</span>
                    </div>
                    <div>
                      <span className="block text-[9px] text-neutral-400 font-bold">รหัสผ่านล็อกอิน:</span>
                      <span className="font-mono font-bold text-[#B8860B] select-all">{admin.password}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-neutral-100">
                    <span className="text-[10px] text-neutral-400 font-mono">ID: {admin.id}</span>
                    
                    {canEditThis ? (
                      <button
                        onClick={() => setEditingAdmin(admin)}
                        className="px-4.5 py-2 text-xs font-bold border border-gold-450 bg-neutral-950 text-gold-300 hover:text-white rounded-xl flex items-center gap-1.5 hover:bg-neutral-900 cursor-pointer shadow-xs"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                        <span>แก้ไขข้อมูลแอดมิน</span>
                      </button>
                    ) : (
                      <span className="inline-flex items-center gap-1 py-1.5 px-3 bg-neutral-100 text-neutral-400 text-[10px] font-bold rounded-xl border border-neutral-154 select-none">
                        <Lock className="w-3 h-3 text-neutral-400" />
                        <span>สิทธิ์ของระบบขังไว้</span>
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* EDIT ADMIN DETAILS MODAL */}
          {editingAdmin && (
            <div className="fixed inset-0 bg-black/65 backdrop-blur-xs flex items-center justify-center p-4 z-50">
              <div className="bg-white w-full max-w-md rounded-3xl shadow-xl border border-[#D4AF37] overflow-hidden transform animate-in fade-in-60 zoom-in-95 font-sans">
                
                <div className="bg-neutral-950 p-5 text-white flex justify-between items-center border-b border-gold-400">
                  <div className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-gold-400" />
                    <h3 className="font-serif font-black text-sm text-white">แก้ไขบัญชีผู้ดูแลหลังบ้าน</h3>
                  </div>
                  <button onClick={() => setEditingAdmin(null)} className="text-neutral-400 hover:text-white">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleEditAdminSave} className="p-6 space-y-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700 font-prompt">เบอร์โทรศัพท์ล็อกอินหลัก*</label>
                    <input 
                      type="text" 
                      required
                      value={editingAdmin.phone}
                      onChange={e => setEditingAdmin({ ...editingAdmin, phone: e.target.value.replace(/\D/g, '') })}
                      className="w-full px-3 py-2 border rounded border-neutral-200 text-xs font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700 font-prompt">รหัสผ่านสำหรับเข้าเล่น*</label>
                    <input 
                      type="text" 
                      required
                      value={editingAdmin.password || ''}
                      onChange={e => setEditingAdmin({ ...editingAdmin, password: e.target.value })}
                      className="w-full px-3 py-2 border rounded border-neutral-200 text-xs font-mono outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-bold text-neutral-700 font-prompt">ชื่อแอดมิน / นามสมมุติหลังบ้าน*</label>
                    <input 
                      type="text" 
                      required
                      value={editingAdmin.realName || ''}
                      onChange={e => setEditingAdmin({ ...editingAdmin, realName: e.target.value })}
                      className="w-full px-3 py-2 border rounded border-neutral-202 text-xs outline-none"
                    />
                  </div>

                  <div className="pt-4 border-t border-neutral-100 flex gap-2 justify-end">
                    <button
                      type="button"
                      onClick={() => setEditingAdmin(null)}
                      className="px-4 py-2 border border-neutral-250 text-neutral-500 hover:bg-neutral-50 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      ยกเลิก
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2.5 bg-neutral-950 hover:bg-neutral-900 text-gold-300 hover:text-white text-xs font-bold border border-gold-450 rounded-lg flex items-center gap-1.5 cursor-pointer shadow-md"
                    >
                      <Check className="w-4 h-4" />
                      <span>ยืนยันคำสั่งบันทึก</span>
                    </button>
                  </div>
                </form>

              </div>
            </div>
          )}

        </div>
      )}

      {/* SUB-TAB 3: MESSAGE DESK LIVE CHAT (ตอบกลับข้อความผู้ใช้งาน) */}
      {subTab === 'chat' && (
        <div className="bg-white rounded-3xl border border-[#D4AF37]/20 overflow-hidden luxury-shadow font-sans">
          
          <div className="bg-neutral-950 p-6 border-b border-[#D4AF37] flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gradient-to-r from-neutral-950 via-neutral-900 to-neutral-950">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-gold-400 animate-pulse" />
                <h2 className="font-serif font-black text-lg text-white">แผงรับสายพูดคุยช่วยเหลือลูกค้า <span className="gold-text">Support Chat Console</span></h2>
              </div>
              <p className="text-[10px] text-neutral-400 uppercase tracking-widest leading-relaxed">
                ตอบกลับข้อความจริง คุยปรึกษา ตรวจสอบปัญหาให้พาร์ทเนอร์และอินฟูเอนเซอร์ในระเบียบแบบเรียลไทม์
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-gold-450/10 border border-gold-400/30 text-gold-400 text-[10px] font-bold uppercase tracking-wider">
              คิวข้อความติดต่อ: {supportUsersList.length} รายห้องสนทนา
            </span>
          </div>

          {supportUsersList.length === 0 ? (
            <div className="p-20 text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-neutral-50 border border-neutral-150 flex items-center justify-center mx-auto text-neutral-400 shadow-inner">
                <MessageSquare className="w-6 h-6 text-gold-500 animate-pulse" />
              </div>
              <p className="text-xs font-bold text-neutral-500">ในขณะนี้ยังไม่มีผู้ใช้งานส่งประวัติแชตแอดมินหรือเปิดเรื่องติดต่อเข้ามาค่ะ</p>
              <p className="text-[10px] text-neutral-400">เมื่อผู้เยี่ยมชมหรือสมาชิกกดปุ่ม "ติดต่อแอดมิน" หน้าจอหลังบ้านแห่งนี้จะเชื่อมโยงข้อความเข้ามาอย่างเรียลไทม์อัตโนมัติค่ะ</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 min-h-[480px]">
              
              {/* Left sidebar: list of user threads */}
              <div className="md:col-span-1 border-r border-neutral-100 bg-neutral-50/50 p-4 space-y-3 overflow-y-auto max-h-[500px]">
                <span className="block text-[9px] uppercase tracking-widest text-[#B8860B] font-extrabold mb-2 font-prompt select-none">รายชื่อผู้อนุญาตติดต่อเข้ามา</span>
                
                <div className="space-y-2">
                  {supportUsersList.map((usr: any) => {
                    const isActive = selectedChatUserId === usr.id;
                    return (
                      <button
                        key={usr.id}
                        onClick={() => setSelectedChatUserId(usr.id)}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border text-left transition-all ${
                          isActive
                            ? 'bg-neutral-950 text-white border-neutral-950 shadow-md transform scale-[1.01]'
                            : 'bg-white text-neutral-800 border-neutral-150 hover:bg-gold-50/10'
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <img
                            src={usr.avatar}
                            alt={usr.username}
                            className="w-9 h-9 rounded-full border border-neutral-200 object-cover shrink-0 shadow-inner"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold truncate max-w-[130px]">@{usr.username}</h4>
                            <span className={`inline-block text-[8px] px-1.5 py-0.2 rounded font-bold uppercase ${
                              usr.role === 'Admin' ? 'bg-indigo-150 text-indigo-800' :
                              usr.role === 'Brand' ? 'bg-amber-150 text-amber-800' :
                              usr.role === 'Influencer' ? 'bg-emerald-150 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                            }`}>
                              {usr.role === 'Guest' ? 'ผู้เยี่ยมชม' : usr.role}
                            </span>
                            <p className="text-[10px] text-neutral-400 truncate mt-0.5 max-w-[140px] font-prompt leading-tight font-light">
                              {usr.lastMessage}
                            </p>
                          </div>
                        </div>
                        <span className="text-[8.5px] text-neutral-400 self-start mt-0.5">{usr.lastTime}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Right: Active chat viewport */}
              <div className="md:col-span-2 flex flex-col justify-between bg-white max-h-[500px]">
                
                {/* Target user recipient active status */}
                <div className="p-4 border-b border-neutral-100 flex flex-col sm:flex-row justify-between sm:items-center gap-2 bg-neutral-50/20 shrink-0 select-none">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 absolute -bottom-0.5 -right-0.5 border border-white z-10"></div>
                      <img 
                        src={supportUsersList.find(u => u.id === selectedChatUserId)?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150'} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover border border-[#D4AF37]/20"
                      />
                    </div>
                    <div className="text-xs">
                      <span className="text-neutral-400 font-light block">กำลังสนทนาสดกับผู้ติดต่อ:</span>
                      <div className="flex flex-wrap items-center gap-1.5 mt-0.5">
                        <span className="font-bold text-neutral-900 text-sm">
                          @{supportUsersList.find(u => u.id === selectedChatUserId)?.username || selectedChatUserId}
                        </span>
                        {supportUsersList.find(u => u.id === selectedChatUserId)?.realName && (
                          <span className="text-neutral-500">
                            ({supportUsersList.find(u => u.id === selectedChatUserId)?.realName})
                          </span>
                        )}
                        <span className={`text-[8.5px] px-1.5 py-0.2 rounded font-bold uppercase ${
                          supportUsersList.find(u => u.id === selectedChatUserId)?.role === 'Admin' ? 'bg-indigo-150 text-indigo-800' :
                          supportUsersList.find(u => u.id === selectedChatUserId)?.role === 'Brand' ? 'bg-amber-150 text-amber-800' :
                          supportUsersList.find(u => u.id === selectedChatUserId)?.role === 'Influencer' ? 'bg-emerald-150 text-emerald-800' : 'bg-neutral-200 text-neutral-700'
                        }`}>
                          {supportUsersList.find(u => u.id === selectedChatUserId)?.role}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Account Name and Phone display details as requested by user! */}
                  <div className="flex flex-col text-[11px] text-right bg-amber-500/5 border border-amber-500/10 rounded-2xl p-2.5 sm:px-4 space-y-0.5 self-start sm:self-auto">
                    <div className="text-neutral-500 font-light">
                      ข้อมูลติดต่อประสานงานแอดมิน:
                    </div>
                    <div className="font-bold text-neutral-950 font-sans">
                      📱 เบอร์โทรศัพท์: <span className="text-amber-800 font-mono text-xs">{supportUsersList.find(u => u.id === selectedChatUserId)?.phone || 'ไม่ได้ระบุเบอร์โทร'}</span>
                    </div>
                  </div>
                </div>

                {/* Message logs log */}
                <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-zinc-50/30">
                  {activeChatMessages.length === 0 ? (
                    <div className="h-full flex items-center justify-center">
                      <p className="text-xs italic text-neutral-400 font-prompt">เลือกหัวข้อสนทนาที่กราบเรียนเข้ามาด้านซ้าย เพื่อเปิดกล่องพิมพ์โต้ตอบแบบเรียลไทม์ได้เลยค่ะ</p>
                    </div>
                  ) : (
                    activeChatMessages.map((msg: any) => (
                      <div
                        key={msg.id || Math.random()}
                        className={`flex flex-col ${msg.isFromAdmin ? 'items-end' : 'items-start'}`}
                      >
                        <span className="text-[9px] text-neutral-400 mb-0.5 px-1 font-prompt">
                          {msg.isFromAdmin ? 'คุณ (แอดมินระบบหลังบ้าน)' : msg.senderName} • {msg.time}
                        </span>
                        <div
                          className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-xs shadow-xs leading-relaxed ${
                            msg.isFromAdmin
                              ? 'bg-neutral-950 text-white rounded-br-none border border-gold-400/20'
                              : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-none'
                          }`}
                        >
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Chat form box controls */}
                <form onSubmit={handleSendReply} className="p-4 border-t border-neutral-100 flex gap-2 shrink-0 bg-white">
                  <input
                    type="text"
                    value={replyText}
                    onChange={e => setReplyText(e.target.value)}
                    placeholder={`พิมพ์สาส์นตอบกลับส่งตรงถึงคุณ @${supportUsersList.find(u => u.id === selectedChatUserId)?.username || 'พาร์ทเนอร์'}...`}
                    className="flex-1 px-4 py-2.5 text-xs border border-neutral-250 rounded-full outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] font-prompt"
                  />
                  <button
                    type="submit"
                    className="px-5 py-2 bg-neutral-950 hover:bg-neutral-900 text-gold-300 hover:text-white rounded-full text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow"
                  >
                    <span>ส่งข้อความ</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>

              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
}
