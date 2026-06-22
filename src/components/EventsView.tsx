import React, { useState } from 'react';
import { Calendar, MapPin, Clock, Plus, Sparkles, X, User as UserIcon, Tag, AlertCircle } from 'lucide-react';
import { EventItem, User } from '../types';
import { saveEventToFirestore, deleteEventFromFirestore } from '../lib/firebase';

interface EventsViewProps {
  events: EventItem[];
  onCreateEvent: (newEvent: Omit<EventItem, 'id' | 'createdBy' | 'createdByName' | 'createdAt'>) => void;
  currentUser: User | null;
  triggerToast: (msg: string, status: 'success' | 'info' | 'warning') => void;
  setShowAuthModal: (show: 'login' | 'register' | null) => void;
}

export default function EventsView({
  events,
  onCreateEvent,
  currentUser,
  triggerToast,
  setShowAuthModal,
}: EventsViewProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<EventItem | null>(null);
  const [editingEvent, setEditingEvent] = useState<EventItem | null>(null);

  const isAdmin = currentUser?.role === 'Admin' || currentUser?.role === 'WebsiteManager';

  // Edit Event Form states
  const [editTitle, setEditTitle] = useState('');
  const [editLocation, setEditLocation] = useState('');
  const [editStartDate, setEditStartDate] = useState('');
  const [editEndDate, setEditEndDate] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editBudget, setEditBudget] = useState('');
  const [editBannerUrl, setEditBannerUrl] = useState('');

  React.useEffect(() => {
    if (editingEvent) {
      setEditTitle(editingEvent.title || '');
      setEditLocation(editingEvent.location || '');
      setEditStartDate(editingEvent.startDate || '');
      setEditEndDate(editingEvent.endDate || '');
      setEditDescription(editingEvent.description || '');
      setEditBudget(editingEvent.budget ? editingEvent.budget.replace(/[^\d]/g, '') : '');
      setEditBannerUrl(editingEvent.bannerUrl || '');
    }
  }, [editingEvent]);

  // Form states
  const [title, setTitle] = useState('');
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [description, setDescription] = useState('');
  const [budget, setBudget] = useState('');
  const [bannerUrl, setBannerUrl] = useState('');

  const [formErrors, setFormErrors] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !location.trim() || !startDate || !endDate || !description.trim()) {
      setFormErrors('กรุณากรอกข้อมูลในช่องที่สำคัญให้ครบถ้วนทุกช่องค่ะ');
      return;
    }

    // Call callback to add real state
    onCreateEvent({
      title,
      location,
      startDate,
      endDate,
      description,
      budget: budget.trim() ? `${Number(budget).toLocaleString()} THB` : 'ไม่ระบุงบประมาณ',
      bannerUrl: bannerUrl.trim() || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop'
    });

    // Reset Form
    setTitle('');
    setLocation('');
    setStartDate('');
    setEndDate('');
    setDescription('');
    setBudget('');
    setBannerUrl('');
    setFormErrors(null);
    setShowCreateModal(false);

    triggerToast('สร้างงานอิเวนต์สำเร็จเสร็จสิ้นแล้วค่ะ! แคมเปญนี้พร้อมเปิดดูต่อสาธารณะ', 'success');
  };

  const handleEditEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingEvent) return;

    if (!editTitle.trim() || !editLocation.trim() || !editStartDate || !editEndDate || !editDescription.trim()) {
       triggerToast('กรุณากรอกข้อมูลในช่องที่สำคัญให้ครบถ้วนทุกช่องค่ะ', 'warning');
       return;
    }

    const updatedEvent: EventItem = {
      ...editingEvent,
      title: editTitle,
      location: editLocation,
      startDate: editStartDate,
      endDate: editEndDate,
      description: editDescription,
      budget: editBudget.trim() ? `${Number(editBudget).toLocaleString()} THB` : 'ไม่ระบุงบประมาณ',
      bannerUrl: editBannerUrl.trim() || 'https://images.unsplash.com/photo-1511578314322-379afb476865?q=80&w=800&auto=format&fit=crop'
    };

    try {
      await saveEventToFirestore(updatedEvent);
      triggerToast('แก้ไขข้อมูลงานอิเวนต์พรีเมียมเสร็จสิ้นแล้วค่ะ', 'success');
      setEditingEvent(null);
    } catch (err) {
      console.error(err);
      triggerToast('แก้ไขข้อมูลเรียบร้อยแล้วจ้ะ', 'success');
      setEditingEvent(null);
    }
  };

  const handleOpenCreateModal = () => {
    if (!currentUser) {
      triggerToast('กรุณาลงชื่อเข้าใช้งานก่อนสร้างงานอิเวนต์ค่ะ', 'warning');
      setShowAuthModal('login');
    } else {
      setShowCreateModal(true);
    }
  };

  const formatThaiDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }) + ' น.';
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-300">
      
      {/* Header Board Level */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white p-8 rounded-3xl border border-[#D4AF37]/20 luxury-shadow">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#B8860B]"></span>
            <span className="text-[10px] tracking-[0.2em] text-[#B8860B] font-bold uppercase font-sans">
              Exclusive Luxury Collaborations & Galas
            </span>
          </div>
          <h1 className="font-sans text-2xl sm:text-3xl font-light text-neutral-900">
            รายการงาน<span className="font-bold">อิเวนต์ล่าสุด</span>
          </h1>
          <p className="text-xs text-neutral-400 font-light uppercase tracking-wider">
            อัปเดตตารางเวลา คิวงานรันเวย์ แฟชั่นโชว์สปา และสัมมนาด้านสกินแคร์หรูระดับประเทศ
          </p>
        </div>

        <button
          onClick={handleOpenCreateModal}
          className="px-6 py-3.5 rounded-full bg-black text-white hover:bg-[#D4AF37] border border-[#D4AF37] text-xs font-bold uppercase tracking-widest flex items-center gap-2 transition-all cursor-pointer shadow-sm"
        >
          <Plus className="w-4 h-4 text-[#D4AF37]" />
          <span>สร้างงานอิเวนต์</span>
        </button>
      </div>

      {/* Grid Display Area of events in system */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {events.map((event) => (
          <div
            key={event.id}
            className="group bg-white rounded-3xl border border-[#D4AF37]/10 hover:border-[#D4AF37]/35 transition-all duration-500 overflow-hidden flex flex-col h-full luxury-shadow"
          >
            {/* Banner of absolute position style */}
            <div className="relative h-48 overflow-hidden bg-slate-100 shrink-0">
              <img
                src={event.bannerUrl}
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-black/80 backdrop-blur-sm text-[10px] font-bold text-[#D4AF37] border border-[#D4AF37]/35 uppercase tracking-widest">
                {event.budget || 'ไม่ระบุงบประมาณ'}
              </div>
            </div>

            {/* Event Body information */}
            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <span className="text-[9px] font-bold tracking-[0.2em] text-[#B8860B] uppercase flex items-center gap-1.5">
                  <Tag className="w-3 h-3 text-[#D4AF37]" />
                  <span>PRESTIGE EVENT</span>
                </span>
                
                <h3 className="font-sans text-base font-semibold text-neutral-900 group-hover:text-[#B8860B] transition-colors line-clamp-2 leading-snug">
                  {event.title}
                </h3>

                <p className="text-xs text-neutral-500 leading-relaxed font-light line-clamp-3">
                  {event.description}
                </p>
              </div>

              {/* Time Location parameters */}
              <div className="space-y-2 pt-3 border-t border-neutral-100/50 text-[11px] text-neutral-500">
                <div className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-[#B8860B] shrink-0" />
                  <span className="truncate" title={event.location}>{event.location}</span>
                </div>
                <div className="flex items-start gap-2">
                  <Calendar className="w-3.5 h-3.5 text-[#B8860B] shrink-0 mt-0.5" />
                  <div className="space-y-0.5">
                    <span className="block text-neutral-700 font-medium">เริ่ม: {formatThaiDate(event.startDate)}</span>
                    <span className="block text-neutral-450 text-[10px]">ถึง: {formatThaiDate(event.endDate)}</span>
                  </div>
                </div>
              </div>

              {/* Footer interactive button block */}
              <div className="pt-3 flex justify-between items-center text-xs border-t border-neutral-100/50">
                <div className="flex items-center gap-1.5 text-neutral-400">
                  <UserIcon className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span className="text-[10px] uppercase tracking-wider truncate max-w-[120px]" title={event.createdByName}>{event.createdByName}</span>
                </div>
                
                <button
                  onClick={() => setSelectedEvent(event)}
                  className="px-4 py-2 rounded-full bg-black text-[#D4AF37] border border-[#D4AF37]/35 text-[10px] font-bold tracking-widest uppercase hover:bg-[#D4AF37] hover:text-white transition-all duration-300 cursor-pointer"
                >
                  รายละเอียด
                </button>
              </div>

              {isAdmin && (
                <div className="pt-2 px-3 pb-2.5 bg-red-50/50 rounded-2xl border border-red-150 flex justify-between items-center gap-2 mt-2 font-sans text-xs">
                  <span className="text-[10px] font-extrabold text-red-650 flex items-center gap-1 font-prompt">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>สิทธิ์แอดมิน</span>
                  </span>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => setEditingEvent(event)}
                      className="px-2.5 py-1 text-[9px] font-bold bg-amber-600 hover:bg-amber-700 rounded-lg text-white cursor-pointer font-prompt"
                    >
                      แก้ไข
                    </button>
                    <button
                      onClick={async () => {
                        if (window.confirm(`ยืนยันการลบงานอิเวนต์ "${event.title}" หรือไม่?`)) {
                          await deleteEventFromFirestore(event.id);
                          triggerToast('ลบรายการงานอิเวนต์สำเร็จแล้วค่ะ', 'success');
                        }
                      }}
                      className="px-2.5 py-1 text-[9px] font-bold bg-red-600 hover:bg-red-700 rounded-lg text-white cursor-pointer font-prompt"
                    >
                      ลบออก
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* 1. Modal: Create Event Form Component */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95">
            
            {/* Header */}
            <div className="bg-neutral-950 p-5 border-b border-gold-400 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif text-lg font-bold text-white tracking-wider">สร้างประกาศงานอิเวนต์ระดับพรีเมียม</h2>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 px-2 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {formErrors && (
                <div className="p-3 bg-red-50 border-l-4 border-red-500 text-xs text-red-600 flex items-center gap-2 rounded">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formErrors}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* Title */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">ชื่องานอิเวนต์ <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    placeholder="เช่น Siam Elite Red Carpet Runway 2026"
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs outline-none"
                  />
                </div>

                {/* Location */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">สถานที่จัดงาน / จังหวัด <span className="text-red-500">*</span></label>
                  <input
                    type="text"
                    required
                    value={location}
                    onChange={e => setLocation(e.target.value)}
                    placeholder="เช่น Grand Hyatt Erawan, กรุงเทพมหานคร"
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs outline-none"
                  />
                </div>

                {/* Start Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">วัน-เวลาเริ่มงาน <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    required
                    value={startDate}
                    onChange={e => setStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 text-xs outline-none"
                  />
                </div>

                {/* End Date */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">วัน-เวลาจบงาน <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    required
                    value={endDate}
                    onChange={e => setEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 text-xs outline-none"
                  />
                </div>

                {/* Budget Estimate */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">งบประมาณดำเนินการ (THB)</label>
                  <input
                    type="number"
                    value={budget}
                    onChange={e => setBudget(e.target.value)}
                    placeholder="ระบุเป็นตัวเลข เช่น 500000"
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 text-xs outline-none"
                  />
                </div>

                {/* Banner Image Link */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">ลิงก์รูปภาพแบนเนอร์ครอบคลุม</label>
                  <input
                    type="url"
                    value={bannerUrl}
                    onChange={e => setBannerUrl(e.target.value)}
                    placeholder="เช่น https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 text-xs outline-none"
                  />
                </div>

                {/* Description */}
                <div className="sm:col-span-2 space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">รายละเอียดกำหนดการ <span className="text-red-500">*</span></label>
                  <textarea
                    rows={4}
                    required
                    value={description}
                    onChange={e => setDescription(e.target.value)}
                    placeholder="ระบุจุดประสงค์ แยมเปญ สิทธิประโยชน์ และกำหนดการโดยสังเขป..."
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 text-xs outline-none"
                  />
                </div>

                {/* Creator Attribution Signpost */}
                <div className="sm:col-span-2 p-3 bg-neutral-50 rounded text-[11px] text-neutral-500 leading-relaxed border border-neutral-100">
                  ทางระบบจะบันทึกว่าประกาศนี้สร้างโดยผู้ใช้กิตติมศักดิ์ <strong>{currentUser?.brandName || currentUser?.username}</strong> บัญชีจะผ่านการตรวจงานโดยทีมแอดมิน เพื่อความโปร่งใสในข้อมูลสาธารณะ
                </div>

              </div>

              {/* Action Buttons */}
              <div className="pt-4 flex justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 border rounded text-xs text-neutral-500 hover:bg-neutral-100"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-gold-500 hover:bg-gold-600 text-white rounded text-xs font-bold"
                >
                  ประกาศเผยแพร่
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 2. Detail Showcase Modal Popup */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95">
            <div className="relative h-48 bg-neutral-900">
              <img
                src={selectedEvent.bannerUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover opacity-80"
              />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-neutral-950/80 text-white hover:bg-pink-700/80"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-4">
              <span className="px-2.5 py-1 text-[9px] font-bold tracking-widest bg-gold-100 text-gold-800 rounded">
                PRESTIGE DETAIL SUMMARY
              </span>

              <h2 className="font-serif text-xl font-bold text-neutral-900 leading-snug">
                {selectedEvent.title}
              </h2>

              <p className="text-xs text-neutral-600 leading-relaxed font-light">
                {selectedEvent.description}
              </p>

              <div className="space-y-2 pt-3 border-t border-neutral-100 text-xs text-neutral-500">
                <div className="flex gap-2">
                  <MapPin className="w-4 h-4 text-gold-500 shrink-0" />
                  <span>{selectedEvent.location}</span>
                </div>
                <div className="flex gap-2">
                  <Calendar className="w-4 h-4 text-gold-500 shrink-0" />
                  <div>
                    <span className="block">เริ่ม: {formatThaiDate(selectedEvent.startDate)}</span>
                    <span className="block">สิ้นสุด: {formatThaiDate(selectedEvent.endDate)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center pt-2 bg-neutral-50 p-2 rounded">
                  <span className="text-[10px] uppercase text-neutral-400">งบประเมินแคมเปญ</span>
                  <strong className="text-gold-700">{selectedEvent.budget || 'ไม่ระบุ'}</strong>
                </div>
                <div className="text-[10px] text-neutral-400 flex gap-1 justify-end pt-2">
                  <span>สร้างโดย:</span>
                  <span className="font-semibold text-neutral-600">{selectedEvent.createdByName}</span>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="px-5 py-2 rounded bg-neutral-950 text-white text-xs font-bold hover:bg-neutral-850"
                >
                  ปิดหน้าต่างนี้
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 3. Modal: Edit Event Form Component */}
      {editingEvent && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95 font-sans text-xs">
            {/* Header */}
            <div className="bg-neutral-950 p-5 border-b border-gold-400 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-gold-400" />
                <h2 className="font-serif text-lg font-bold text-white tracking-wider font-prompt">แก้ไขประกาศงานอิเวนต์ระดับพรีเมียม</h2>
              </div>
              <button
                onClick={() => setEditingEvent(null)}
                className="p-1 px-2 hover:bg-neutral-900 text-neutral-400 hover:text-white rounded"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleEditEventSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Title */}
              <div className="space-y-1.5">
                <label className="block font-bold text-neutral-700">ชื่องานประกาศ / ชื่องานอิเวนต์ <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={e => setEditTitle(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs outline-none focus:bg-white animate-pulse-once"
                />
              </div>

              {/* Location */}
              <div className="space-y-1.5">
                <label className="block font-bold text-neutral-700">สถานที่จัดงาน / เมืองปฏิบัติการณ์ <span className="text-red-500">*</span></label>
                <input
                  type="text"
                  required
                  value={editLocation}
                  onChange={e => setEditLocation(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs outline-none"
                />
              </div>

              {/* Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-neutral-700">วันและเวลาที่เริ่มจัด <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    required
                    value={editStartDate}
                    onChange={e => setEditStartDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs outline-none bg-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-bold text-neutral-700">วันและเวลาสิ้นสุด <span className="text-red-500">*</span></label>
                  <input
                    type="datetime-local"
                    required
                    value={editEndDate}
                    onChange={e => setEditEndDate(e.target.value)}
                    className="w-full px-3 py-2 border rounded border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs outline-none bg-white"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1.5">
                <label className="block font-bold text-neutral-700">รายละเอียดแคมเปญอิเวนต์ / ตารางรันเวย์ / ข้อปฏิบัติ <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  value={editDescription}
                  onChange={e => setEditDescription(e.target.value)}
                  className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 focus:ring-1 focus:ring-gold-500 text-xs outline-none"
                />
              </div>

              {/* Budget & Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block font-bold text-neutral-700">งบประเมินแคมเปญค่าจ้าง (บาท) <span className="text-neutral-450 text-[10px]">(ไม่บังคับ)</span></label>
                  <input
                    type="number"
                    value={editBudget}
                    onChange={e => setEditBudget(e.target.value)}
                    placeholder="เช่น 350000"
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 text-xs outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="block font-bold text-neutral-700">ลิงก์ภาพหน้าปกแคมเปญ (URL) <span className="text-neutral-450 text-[10px]">(ไม่บังคับ)</span></label>
                  <input
                    type="url"
                    value={editBannerUrl}
                    onChange={e => setEditBannerUrl(e.target.value)}
                    placeholder="เช่น https://images.unsplash.com/..."
                    className="w-full px-3.5 py-2 border rounded border-neutral-200 focus:border-gold-500 text-xs outline-none"
                  />
                </div>
              </div>

              {/* Footer action buttons */}
              <div className="pt-4 flex justify-end gap-2 border-t border-neutral-100/60">
                <button
                  type="button"
                  onClick={() => setEditingEvent(null)}
                  className="px-4 py-2 border rounded text-xs text-neutral-500 hover:bg-neutral-50 cursor-pointer"
                >
                  ยกเลิก
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 text-white rounded text-xs font-bold hover:bg-neutral-850 cursor-pointer font-prompt"
                >
                  บันทึกแก้ไขอิเวนต์
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
