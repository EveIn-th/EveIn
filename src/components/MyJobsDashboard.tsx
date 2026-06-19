import React, { useState } from 'react';
import { Briefcase, CheckCircle2, XCircle, Clock, Link as LinkIcon, Send, Sparkles, Check, ChevronRight, AlertCircle, RefreshCw, QrCode, FileText, Upload, Plus, Trash2, Edit, MessageSquare } from 'lucide-react';
import { User, JobItem, JobApplication } from '../types';

interface MyJobsDashboardProps {
  currentUser: User | null;
  jobs: JobItem[];
  setJobs: React.Dispatch<React.SetStateAction<JobItem[]>>;
  applications: JobApplication[];
  setApplications: React.Dispatch<React.SetStateAction<JobApplication[]>>;
  triggerToast: (msg: string, status: 'success' | 'info' | 'warning') => void;
  setChatWithUser: (userId: string | null) => void;
  setChatOpen: (open: boolean) => void;
  notifications: any[];
  setNotifications: any;
}

export default function MyJobsDashboard({
  currentUser,
  jobs,
  setJobs,
  applications,
  setApplications,
  triggerToast,
  setChatWithUser,
  setChatOpen,
  setNotifications,
}: MyJobsDashboardProps) {
  
  // Tab states for Influencer
  const [influencerTab, setInfluencerTab] = useState<'applied' | 'progress' | 'completed' | 'cancelled'>('applied');
  
  // Tab states for Brand Applicants manager
  const [brandSubTab, setBrandSubTab] = useState<'applications' | 'submissions' | 'payments'>('applications');

  // Submit Work Modal state (Influencer)
  const [submitWorkApp, setSubmitWorkApp] = useState<JobApplication | null>(null);
  const [submitLinks, setSubmitLinks] = useState<Array<{ platform: string; url: string }>>([
    { platform: 'Instagram', url: '' }
  ]);

  // Invoice / Payment slips Modal state (Brand)
  const [paymentApp, setPaymentApp] = useState<JobApplication | null>(null);
  const [wantTaxInvoice, setWantTaxInvoice] = useState(false);
  const [slipFile, setSlipFile] = useState<string>(''); // mock file name string
  const [slipPreview, setSlipPreview] = useState<string>(''); // real base64 file data or preview url
  const [viewingSlipUrl, setViewingSlipUrl] = useState<string | null>(null); // lightbox trigger
  const [submittingSlip, setSubmittingSlip] = useState(false);

  // Edit Job Modal State
  const [editJobItem, setEditJobItem] = useState<JobItem | null>(null);

  if (!currentUser) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center space-y-4">
        <Briefcase className="w-12 h-12 text-neutral-300 mx-auto" />
        <h2 className="font-serif text-2xl font-bold">เข้าสู่หน้าต่างประมวลผลงานของฉัน</h2>
        <p className="text-xs text-neutral-400 max-w-sm mx-auto">เฉพาะผู้เข้าใช้งานระบบผ่านบัญชี EveIn ส่วตัวเป็นทางการเท่านั้น จึงจะเห็นกระบวนการคัดกรองงานค่ะ</p>
      </div>
    );
  }

  const isBrand = currentUser.role === 'Brand';

  // State actions helper
  const triggerSystemNotification = (title: string, message: string) => {
    const newNotif = {
      id: `notif_${Date.now()}`,
      title,
      message,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'success' as const
    };
    setNotifications((prev: any) => [newNotif, ...prev]);
  };

  // --- ACTIONS FOR INFLUENCER ---
  const handleAddNewLinkField = () => {
    setSubmitLinks(prev => [...prev, { platform: 'Instagram', url: '' }]);
  };

  const handleRemoveLinkField = (index: number) => {
    if (submitLinks.length <= 1) return;
    setSubmitLinks(prev => prev.filter((_, idx) => idx !== index));
  };

  const handleUpdateLink = (index: number, field: 'platform' | 'url', value: string) => {
    setSubmitLinks(prev =>
      prev.map((l, idx) => (idx === index ? { ...l, [field]: value } : l))
    );
  };

  const handleSubmitWork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submitWorkApp) return;

    const vacantLink = submitLinks.some(l => !l.url.trim());
    if (vacantLink) {
      triggerToast('กรุณากรอกลิงก์ผลงานที่ส่งมอบให้เรียบร้อยครบทุกช่องค่ะ (หรือลบฟิลด์ที่ไม่จำเป็นออก)', 'warning');
      return;
    }

    setApplications(prev =>
      prev.map(app => {
        if (app.id === submitWorkApp.id) {
          return {
            ...app,
            status: 'In Progress', // await brand review while remaining in progress
            submittedLinks: submitLinks,
            isApproved: false
          };
        }
        return app;
      })
    );

    triggerSystemNotification(
      'อินฟลูฯ แนบลิงก์ส่งงานแล้ว',
      `อินฟลูเอนเซอร์ @${currentUser.username} ได้อัปส่งลิงก์งานรีวิวสำหรับแคมเปญ "${submitWorkApp.jobTitle}" แล้ว โปรดตรวจสอบในแดชบอร์ดแบรนด์ค่ะ`
    );

    triggerToast('ส่งผลงานตรวจเช็กเรียบร้อยแล้วค่ะ! แบรนด์กำลังพิจารณาผ่านแชทลักชัวรี่', 'success');
    setSubmitWorkApp(null);
    setSubmitLinks([{ platform: 'Instagram', url: '' }]);
  };

  // --- ACTIONS FOR BRAND ---
  // Toggle recruitment status (isOpen flag)
  const handleToggleJobStatus = (jobId: string) => {
    setJobs(prev =>
      prev.map(job => (job.id === jobId ? { ...job, isOpen: !job.isOpen } : job))
    );
    const updatedJob = jobs.find(j => j.id === jobId);
    const newState = updatedJob ? !updatedJob.isOpen : false;
    triggerToast(`เปลี่ยนสถานะรับสมัครของแคมเปญงานเป็น ${newState ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'} เรียบร้อยค่ะ`, 'info');
  };

  // Applicant management
  const handleAcceptApplicant = (appId: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: 'In Progress' } : app))
    );
    const app = applications.find(x => x.id === appId);
    if (app) {
      triggerSystemNotification(
        'แบรนด์ตอบรับความร่วมมือแล้ว',
        `ยินดีด้วยค่ะ แบรนด์ตอบรับแคมเปญงาน "${app.jobTitle}" ของท่านเรียบร้อย เริ่มผลิตงานได้ทันที!`
      );
    }
    triggerToast('ตอบรับอินฟลูเอนเซอร์เข้าร่วมงานแล้วค่ะ! งานขยับไปที่แท็บ "กำลังทำ/รอตรวจ"', 'success');
  };

  const handleDeclineApplicant = (appId: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, status: 'Cancelled' } : app))
    );
    triggerToast('ปฏิเสธคำสมัครแล้วค่ะ แคมเปญนี้ถูกย้ายไปช่องยกเลิก', 'info');
  };

  const handlePassJob = (appId: string) => {
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, isApproved: true } : app))
    );
    const app = applications.find(x => x.id === appId);
    if (app) {
      triggerSystemNotification(
        'งานผ่านตรวจแล้ว!',
        `แบรนด์ตรวจสอบลิงก์และอนุมัติผ่านงานรีวิวสำหรับ "${app.jobTitle}" แนะนำให้ติดตามกระบวนการชำระสลิปตารางการจ่ายเงินค่ะ`
      );
    }
    triggerToast('บันทึกปรับสถานะตรวจสอบงานรีวิวผ่านสำเร็จแล้วค่ะ พร้อมดำเนินการในกระบวนการจ่ายเงิน', 'success');
  };

  const handleSendBackModification = (appId: string) => {
    // Keep in progress, remove submitted links to allow re-submission
    setApplications(prev =>
      prev.map(app => (app.id === appId ? { ...app, submittedLinks: [], isApproved: false } : app))
    );
    const app = applications.find(x => x.id === appId);
    if (app) {
      triggerSystemNotification(
        'งานของท่านถูกส่งกลับแก้ไข',
        `กรุณาตรวจสอบรายละเอียดแชท บิลงาน "${app.jobTitle}" ถูกสั่งปรับปรุงเพื่อความเหมาะสม`
      );
    }
    triggerToast('ส่งกลับแก้ไขสำเร็จ อินฟลูฯ สามารถแนบส่งลิงก์ใหม่ได้ทันทีค่ะ', 'info');
  };

  // Invoice payment slip confirmation
  const handlePaySlipSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentApp) return;

    setSubmittingSlip(true);
    setTimeout(() => {
      setApplications(prev =>
        prev.map(app => {
          if (app.id === paymentApp.id) {
            return {
              ...app,
              paymentStatus: 'Verifying', // verifying slide
              taxInvoiceRequested: wantTaxInvoice,
              paymentSlipUrl: slipPreview || slipFile || 'slip_signature_receipt4050.png',
              paymentSlipUploadedAt: new Date().toISOString()
            };
          }
          return app;
        })
      );

      triggerSystemNotification(
        'แบรนด์อัปสลิปชำระเงินงานสำเร็จ',
        `ยอดชำระของชื่องาน "${paymentApp.jobTitle}" ได้แนบเข้าสู่ระบบแล้ว แอดมินกำลังตรวจโอนเงินสดให้อินฟลูฯ ค่ะ`
      );

      triggerToast('ส่งข้อมูลโอนเงินเรียบร้อยแล้วค่ะ! แอดมินกำลังประมวลยอดเพื่อดรอปเงินโอนเข้าบัญชีครีเอเตอร์', 'success');
      setSubmittingSlip(false);
      setPaymentApp(null);
      setWantTaxInvoice(false);
      setSlipFile('');
      setSlipPreview('');
    }, 1000);
  };

  const handleAdminApprovePaymentInstant = (appId: string) => {
    setApplications(prev =>
      prev.map(app => {
        if (app.id === appId) {
          return {
            ...app,
            status: 'Completed',
            paymentStatus: 'Paid'
          };
        }
        return app;
      })
    );
    const app = applications.find(x => x.id === appId);
    if (app) {
      triggerSystemNotification(
        'ได้รับเงินรางวัลเรียบร้อย!',
        `แอดมินอนุมัติสลิปโอนเงินเสร็จสิ้น ยอดเงินสุทธิพร้อมภาษีหัก ณ ที่จ่าย สำหรับ "${app.jobTitle}" เข้าบัญชีทางการของท่านแล้วค่ะ`
      );
    }
    triggerToast('[แอดมินจำลอง] อนุมัติสลิปเรียบร้อยสถานะแคมเปญสลับเป็น Completed สมบูรณ์!', 'success');
  };

  const handleBrandEditJobSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editJobItem) return;

    setJobs(prev => prev.map(j => (j.id === editJobItem.id ? editJobItem : j)));
    triggerToast('แก้ไขรายละเอียดข้อมูลแคมเปญงานเรียบร้อยแล้วค่ะ', 'success');
    setEditJobItem(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in duration-300">
      
      {/* 1. Profile Dashboard Header Summary */}
      <div className="bg-neutral-950 p-6 sm:p-8 rounded-3xl border border-gold-400 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <img
            src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop'}
            alt={currentUser.username}
            className="w-16 h-16 rounded-full border-2 border-gold-400 object-cover shrink-0"
          />
          <div>
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-gold-500/10 border border-gold-400/20 text-[10px] font-bold text-gold-400 uppercase">
              <Sparkles className="w-3 h-3 text-gold-400" />
              <span>{currentUser.role === 'Brand' ? 'แบรนด์ผู้ว่าจ้างระดับสูง' : 'ครีเอเตอร์กิตติมศักดิ์'}</span>
            </div>
            <h1 className="font-serif text-xl sm:text-2xl font-bold text-white tracking-wide mt-1.5">
              {currentUser.brandName || currentUser.realName || currentUser.username}
            </h1>
            <p className="text-[11px] text-neutral-400 mt-1">
              {currentUser.email} • {currentUser.phone} (ดูแลและซ่อนปลอดภัย)
            </p>
          </div>
        </div>

        {/* Dynamic Status Counter badges */}
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-850">
            <span className="block text-[8px] uppercase tracking-wider text-neutral-400">แคมเปญที่เกียวข้อง</span>
            <span className="font-serif text-lg font-bold text-gold-400">
              {isBrand ? jobs.filter(j => j.createdBy === currentUser.id).length : applications.filter(a => a.influencerId === currentUser.id).length}
            </span>
          </div>
          <div className="text-center px-4 py-2 bg-neutral-900 rounded-lg border border-neutral-850">
            <span className="block text-[8px] uppercase tracking-wider text-neutral-400">สิทธิ์พิจารณางาน</span>
            <span className="font-serif text-xs font-bold text-emerald-400 uppercase mt-1 block">Active</span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* CASE A: INFLUENCER PERSPECTIVE VIEW        */}
      {/* ========================================== */}
      {!isBrand && (
        <div className="space-y-8 font-sans">
          
          <div className="space-y-2">
            <h2 className="font-sans text-xl font-light text-neutral-900">พื้นที่ติดตามงานของ<span className="font-bold">อินฟลูเอนเซอร์</span> (Influencer Deck)</h2>
            <p className="text-xs text-neutral-400 font-light uppercase tracking-wider">ควบคุมสถานะงานจ้างของท่าน ส่งมอบลิงก์วิดีโอ/รูปภาพ แนบสถิติความร่วมมือให้กับแบรนด์ตรวจงบด่วน</p>
          </div>

          {/* 4 Tabs switcher */}
          <div className="flex border-b border-neutral-200 gap-2 overflow-x-auto pb-px">
            {[
              { id: 'applied', label: '1. งานที่ยื่นคำขอ (Applied)', count: applications.filter(a => a.influencerId === currentUser.id && a.status === 'Applied').length },
              { id: 'progress', label: '2. กำลังทำ/รอตรวจ (In Progress)', count: applications.filter(a => a.influencerId === currentUser.id && a.status === 'In Progress').length },
              { id: 'completed', label: '3. ทำเสร็จแล้ว (Completed)', count: applications.filter(a => a.influencerId === currentUser.id && a.status === 'Completed').length },
              { id: 'cancelled', label: '4. งานที่ยกเลิก (Cancelled)', count: applications.filter(a => a.influencerId === currentUser.id && a.status === 'Cancelled').length }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setInfluencerTab(t.id as any)}
                className={`py-3 px-4 text-xs font-semibold tracking-wider whitespace-nowrap transition-all border-b-2 outline-none cursor-pointer uppercase ${
                  influencerTab === t.id
                    ? 'border-[#D4AF37] text-[#B8860B] font-bold bg-[#D4AF37]/5'
                    : 'border-transparent text-neutral-400 hover:text-neutral-700'
                }`}
              >
                {t.label} <span className="ml-1.5 px-2 py-0.5 rounded-full bg-neutral-100 text-[10px] text-neutral-600 font-normal">{t.count}</span>
              </button>
            ))}
          </div>

          {/* Tab contents list */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {applications
              .filter(app => app.influencerId === currentUser.id && app.status === (influencerTab === 'applied' ? 'Applied' : influencerTab === 'progress' ? 'In Progress' : influencerTab === 'completed' ? 'Completed' : 'Cancelled'))
              .map((app) => (
                <div
                  key={app.id}
                  className="p-6 bg-white rounded-3xl border border-[#D4AF37]/10 luxury-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex justify-between items-start">
                      <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider font-mono">
                        ลงประกาศเมื่อ {new Date(app.appliedAt).toLocaleDateString()}
                      </span>
                      
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold tracking-wider uppercase ${
                        app.status === 'Applied' ? 'bg-amber-100/60 text-amber-800' :
                        app.status === 'In Progress' ? 'bg-blue-100/60 text-blue-850' :
                        app.status === 'Completed' ? 'bg-emerald-100/60 text-emerald-800' : 'bg-neutral-100 text-neutral-500'
                      }`}>
                        {app.status}
                      </span>
                    </div>

                    <h3 className="font-sans text-base font-semibold text-neutral-900">{app.jobTitle}</h3>
                    <p className="text-xs text-[#B8860B] uppercase tracking-wider">แบรนด์ผู้ว่าจ้าง: <strong>{app.brandName}</strong></p>

                    {/* Links list if already submitted */}
                    {app.submittedLinks && app.submittedLinks.length > 0 && (
                      <div className="bg-slate-50 p-3 rounded-lg border border-neutral-100 space-y-1">
                        <span className="block text-[9px] uppercase text-neutral-400 font-bold">ลิงก์งานที่ส่งมอบแล้ว</span>
                        {app.submittedLinks.map((l, idx) => (
                          <div key={idx} className="flex justify-between items-center text-[10px]">
                            <span className="text-neutral-500 font-medium font-prompt">{l.platform}:</span>
                            <a href={l.url} target="_blank" rel="noreferrer" className="text-gold-600 hover:underline truncate max-w-[180px] inline-flex items-center gap-0.5">
                              {l.url}
                              <LinkIcon className="w-2.5 h-2.5" />
                            </a>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Progress tracking status info */}
                    {app.status === 'In Progress' && (
                      <div className="text-[11px] leading-relaxed text-amber-700 bg-amber-50/50 p-2.5 rounded border border-amber-200/40">
                        {app.isApproved ? (
                          <span className="text-green-700 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />
                            <span>แบรนด์ตรวจภาพ/วิดีโอผ่านแล้วค่ะ! กำลังเตรียมการโอนสลิปจ่ายเงิน</span>
                          </span>
                        ) : app.submittedLinks && app.submittedLinks.length > 0 ? (
                          <span>📤 ส่งลิงก์ผลงานแล้ว แบรนด์กำลังตรวจเช็คใน 24 ชม.</span>
                        ) : (
                          <span>✍️ แบรนด์ตอบรับให้เข้าร่วมแล้ว กรุณาผลิตสื่อและอัปโหลด "ส่งงาน" แนบลิ้งค์ค่ะ</span>
                        )}
                      </div>
                    )}

                    {app.status === 'Completed' && (
                      <div className="text-[11px] bg-emerald-50 text-emerald-700 p-2.5 rounded border border-emerald-250 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4.5 h-4.5 text-emerald-500 shrink-0" />
                        <span>ได้รับยอดเงินสดและภาษีสุทธิเรียบร้อย การันตี PDP-Safe 🔒</span>
                      </div>
                    )}
                  </div>

                  {/* Operational actions */}
                  <div className="pt-4 mt-4 border-t border-neutral-50 flex justify-between items-center">
                    
                    {/* Payment tracker badge */}
                    <span className="text-[10px]">
                      สถานะเงิน: <strong className={app.paymentStatus === 'Paid' ? 'text-emerald-600' : 'text-amber-500'}>{app.paymentStatus === 'Paid' ? 'ชำระเสร็จสิ้นแล้ว' : app.paymentStatus === 'Verifying' ? 'กำลังตรวจเช็คสลิปโอนเงิน' : 'รอชำระจากแบรนด์'}</strong>
                    </span>

                    <div className="flex gap-2">
                      <button
                        onClick={() => { setChatWithUser(app.brandId); setChatOpen(true); }}
                        className="p-1 px-2.5 border rounded border-neutral-200 text-neutral-600 hover:text-gold-600 bg-white"
                        title="ติดต่อแชทชี้แจงส่วนตัว"
                      >
                        <MessageSquare className="w-3.5 h-3.5 inline-block mr-1" />
                        <span className="text-[10px]">แชทคุยแบรนด์</span>
                      </button>

                      {/* SPECIAL IN PROGRESS SEND WORK BUTTON (ส่งงาน) */}
                      {app.status === 'In Progress' && !app.isApproved && (
                        <button
                          onClick={() => {
                            setSubmitWorkApp(app);
                            setSubmitLinks([{ platform: 'Instagram', url: '' }]);
                          }}
                          className="px-4 py-1.5 rounded bg-neutral-900 border border-gold-400 text-gold-400 hover:text-white hover:bg-neutral-850 text-[11px] font-bold animate-pulse"
                        >
                          ส่งงาน
                        </button>
                      )}
                    </div>

                  </div>
                </div>
              ))}
            {applications.filter(app => app.influencerId === currentUser.id && app.status === (influencerTab === 'applied' ? 'Applied' : influencerTab === 'progress' ? 'In Progress' : influencerTab === 'completed' ? 'Completed' : 'Cancelled')).length === 0 && (
              <div className="col-span-full py-12 text-center bg-white border border-dashed border-neutral-200 rounded-2xl text-xs text-neutral-400">
                ไม่มีประวัติงานแคมเปญตามแท็บที่เลือกในขณะนี้ค่ะ
              </div>
            )}
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* CASE B: BRAND PERSPECTIVE VIEW           */}
      {/* ========================================== */}
      {isBrand && (
        <div className="space-y-12 font-sans-body">
          
          {/* Part 1: "ควบคุมงานที่โพสต์" (Active Campaigns and active Toggle) */}
          <div className="space-y-4">
            <div className="pb-3 border-b border-neutral-100 flex justify-between items-center">
              <div>
                <h2 className="font-sans text-lg sm:text-xl font-light text-neutral-900">1. ควบคุม<span className="font-bold">งานแคมเปญที่โพสต์</span></h2>
                <p className="text-xs text-neutral-400 font-light uppercase tracking-wider">เปิด-ปิดการจ้างงานคิวสมัคร และปรับความคืบหน้าระบบการตกลงใจ</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {jobs
                .filter(job => job.createdBy === currentUser.id)
                .map((job) => (
                  <div
                    key={job.id}
                    className="p-6 bg-white rounded-3xl border border-[#D4AF37]/10 luxury-shadow space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="px-3 py-1 rounded-full bg-neutral-50 text-[#B8860B] text-[9px] font-bold uppercase tracking-wider border border-neutral-100">
                          {job.category}
                        </span>
                        <h3 className="font-sans text-base font-semibold text-neutral-900 mt-2">{job.title}</h3>
                      </div>

                      {/* Active open/close toggle */}
                      <div className="flex flex-col items-end">
                        <button
                          onClick={() => handleToggleJobStatus(job.id)}
                          className={`relative inline-flex h-5 w-10 items-center rounded-full transition-colors ${
                            job.isOpen ? 'bg-[#D4AF37]' : 'bg-neutral-200'
                          }`}
                          aria-label="เปลี่ยนสถานะสมัคร"
                         >
                          <span
                            className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                              job.isOpen ? 'translate-x-[22px]' : 'translate-x-[4px]'
                            }`}
                          />
                        </button>
                        <span className="text-[8px] text-neutral-400 font-bold uppercase mt-1 tracking-wider">
                          {job.isOpen ? 'เปิดรับสมัคร' : 'ปิดรับสมัคร'}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-neutral-500 leading-relaxed font-light line-clamp-2">{job.description}</p>

                    <div className="flex justify-between items-center text-[11px] pt-4 border-t border-neutral-100 mt-4">
                      <span className="uppercase tracking-wider text-neutral-400">งบราคากลาง: <strong className="text-neutral-900 font-mono text-xs">฿{job.budget.toLocaleString()}</strong></span>
                      <button
                        onClick={() => setEditJobItem(job)}
                        className="text-[#B8860B] text-xs font-semibold flex items-center gap-1 hover:underline transition-all uppercase tracking-wider"
                      >
                        <Edit className="w-3.5 h-3.5 text-[#D4AF37]" />
                        <span>แก้ไขงาน</span>
                      </button>
                    </div>

                  </div>
                ))}
            </div>
          </div>

          {/* Part 2: "ควบคุมงานที่อินฟลูเข้าร่วม" (Workflow Tabs) */}
          <div className="space-y-6">
            <div className="pb-3 border-b border-neutral-100">
              <h2 className="font-sans text-lg sm:text-xl font-light text-neutral-900">2. ควบคุม<span className="font-bold">งานที่อินฟลูเข้าร่วม</span> (Workflow Desk)</h2>
              <p className="text-xs text-neutral-400 font-light uppercase tracking-wider">กระบวนการพิจารณาผู้สมัคร คัดกรองไฟล์/ลิงค์ที่ส่งเข้ามา และอัปโอนเงินรางวัล</p>
            </div>

            {/* Workflow sub tabs */}
            <div className="flex bg-neutral-100 p-1.5 rounded-xl gap-2 w-fit max-w-full overflow-x-auto text-xs">
              <button
                onClick={() => setBrandSubTab('applications')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold cursor-pointer ${
                  brandSubTab === 'applications' ? 'bg-white text-neutral-900 shadow-sm font-bold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <span>แท็บ 1 [คำขอสมัคร]</span>
                <span className="px-1.5 py-0.5 rounded-full bg-neutral-205 text-[9px] text-neutral-600">
                  {applications.filter(a => a.brandId === currentUser.id && a.status === 'Applied').length}
                </span>
              </button>
              <button
                onClick={() => setBrandSubTab('submissions')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold cursor-pointer ${
                  brandSubTab === 'submissions' ? 'bg-white text-neutral-900 shadow-sm font-bold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <span>แท็บ 2 [อินฟลูส่งงาน]</span>
                <span className="px-1.5 py-0.5 rounded-full bg-neutral-205 text-[9px] text-neutral-600">
                  {applications.filter(a => a.brandId === currentUser.id && a.status === 'In Progress' && a.submittedLinks && a.submittedLinks.length > 0 && !a.isApproved).length}
                </span>
              </button>
              <button
                onClick={() => setBrandSubTab('payments')}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg font-semibold cursor-pointer ${
                  brandSubTab === 'payments' ? 'bg-white text-neutral-900 shadow-sm font-bold' : 'text-neutral-500 hover:text-neutral-800'
                }`}
              >
                <span>แท็บ 3 [รอชำระเงินให้อินฟลู]</span>
                <span className="px-1.5 py-0.5 rounded-full bg-neutral-205 text-[9px] text-neutral-600">
                  {applications.filter(a => a.brandId === currentUser.id && ((a.status === 'In Progress' && a.isApproved) || a.paymentStatus === 'Verifying')).length}
                </span>
              </button>
            </div>

            {/* Workflow sub tab rendering */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* BRAND TAB 1: Applications reviewing */}
              {brandSubTab === 'applications' && (
                applications
                  .filter(app => app.brandId === currentUser.id && app.status === 'Applied')
                  .map((app) => (
                    <div key={app.id} className="p-6 bg-white rounded-2xl border border-neutral-150 space-y-4">
                      <div>
                        <span className="block text-[8px] uppercase tracking-wider text-neutral-400 font-bold">แคมเปญเป้าหมาย</span>
                        <h4 className="font-serif text-base font-bold text-neutral-950 mt-0.5">{app.jobTitle}</h4>
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-lg space-y-1.5 text-xs text-neutral-600 border border-neutral-100">
                        <span className="block text-[8px] uppercase tracking-wider text-neutral-400">ผู้สมัคร (มีประวัติยืนยันลักชัวรี่)</span>
                        <div className="font-bold text-neutral-850">@{app.influencerName}</div>
                        <div className="text-[10px] text-neutral-400 flex items-center gap-1">
                          <span>สถิติผู้ดีล: {app.influencerPlatformDetails || 'ซ่อนรายละเอียด (ความปลอดภัย)'}</span>
                        </div>
                      </div>

                      <div className="pt-2 flex gap-1.5 justify-end">
                        <button
                          onClick={() => { setChatWithUser(app.influencerId); setChatOpen(true); }}
                          className="px-3 py-1.5 rounded border border-neutral-250 text-xs text-neutral-600 bg-white"
                        >
                          แชทติดต่อ
                        </button>
                        <button
                          onClick={() => handleDeclineApplicant(app.id)}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded text-xs font-semibold"
                        >
                          ปฏิเสธ
                        </button>
                        <button
                          onClick={() => handleAcceptApplicant(app.id)}
                          className="px-4 py-1.5 bg-gold-400 hover:bg-gold-500 text-white rounded text-xs font-bold"
                        >
                          รับเข้าร่วมงาน
                        </button>
                      </div>
                    </div>
                  ))
              )}

              {/* BRAND TAB 2: inspecting submitted social media links */}
              {brandSubTab === 'submissions' && (
                applications
                  .filter(app => app.brandId === currentUser.id && app.status === 'In Progress' && app.submittedLinks && app.submittedLinks.length > 0 && !app.isApproved)
                  .map((app) => (
                    <div key={app.id} className="p-6 bg-white rounded-2xl border border-neutral-150 space-y-4">
                      <div>
                        <span className="block text-[9px] uppercase tracking-wider text-neutral-400">แคมเปญ</span>
                        <h4 className="font-serif text-base font-bold text-neutral-950">{app.jobTitle}</h4>
                        <span className="block text-[10px] text-neutral-500 mt-1">อินฟลูเอนเซอร์: <strong>@{app.influencerName}</strong></span>
                      </div>

                      <div className="space-y-2 bg-slate-50 p-3.5 rounded-lg border border-neutral-100">
                        <span className="block text-[9px] uppercase text-neutral-400 font-bold">ลิงก์งานรีวิวที่อินฟลูแนบส่งมอบ</span>
                        {app.submittedLinks && app.submittedLinks.map((l, index) => (
                          <div key={index} className="flex justify-between items-center text-[11px] font-prompt bg-white/70 p-1 px-3 border border-neutral-100 rounded">
                            <span className="text-neutral-500 font-semibold">{l.platform}</span>
                            <a
                              href={l.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-gold-600 hover:underline max-w-[150px] truncate inline-flex items-center gap-0.5 text-[10px]"
                            >
                              <span>{l.url}</span>
                              <LinkIcon className="w-3 h-3 text-neutral-400" />
                            </a>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex gap-1.5 justify-end">
                        <button
                          onClick={() => { setChatWithUser(app.influencerId); setChatOpen(true); }}
                          className="px-3 py-1.5 rounded border border-neutral-250 text-xs text-neutral-600 bg-white"
                        >
                          แชทติดต่อ
                        </button>
                        <button
                          onClick={() => handleSendBackModification(app.id)}
                          className="px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-600 text-xs font-semibold rounded"
                        >
                          ส่งกลับแก้ไข
                        </button>
                        <button
                          onClick={() => handlePassJob(app.id)}
                          className="px-4 py-1.5 bg-green-500 hover:bg-green-600 text-white text-xs font-bold rounded"
                        >
                          กดผ่านงาน
                        </button>
                      </div>
                    </div>
                  ))
              )}

              {/* BRAND TAB 3: Invoice settlement payments */}
              {brandSubTab === 'payments' && (
                applications
                  .filter(app => app.brandId === currentUser.id && ((app.status === 'In Progress' && app.isApproved) || app.paymentStatus === 'Verifying'))
                  .map((app) => (
                    <div key={app.id} className="p-6 bg-white rounded-2xl border border-neutral-150 space-y-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="block text-[8px] uppercase tracking-wider text-neutral-400">บิลประมวลชำระ</span>
                          <h4 className="font-serif text-base font-bold text-neutral-950 mt-0.5">{app.jobTitle}</h4>
                          <span className="block text-[10px] text-neutral-500">อินฟลูเอนเซอร์: <strong>@{app.influencerName}</strong></span>
                        </div>
                        
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          app.paymentStatus === 'Verifying' ? 'bg-amber-100/60 text-amber-800 animate-pulse' : 'bg-red-100 text-red-650'
                        }`}>
                          {app.paymentStatus === 'Verifying' ? 'กำลังตรวจสลิปโอน' : 'รอชำระเงิน'}
                        </span>
                      </div>

                      <div className="p-3 bg-neutral-50 rounded-lg space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span className="text-neutral-450">ค่าดำเนินการงาน:</span>
                          <strong className="text-neutral-900">฿{(jobs.find(j => j.id === app.jobId)?.budget || 35000).toLocaleString()}</strong>
                        </div>
                        <div className="flex justify-between text-[11px] text-neutral-400 italic">
                          <span className="flex items-center gap-0.5">ภาษีหัก ณ ที่จ่าย 7%:</span>
                          <span>฿{((jobs.find(j => j.id === app.jobId)?.budget || 35000) * 0.07).toLocaleString()}</span>
                        </div>
                      </div>

                      {/* Payment Slip and action triggers */}
                      <div className="pt-2 flex gap-2 justify-end items-center">
                        
                        {/* Simulated Admin Approver bypass widget */}
                        {app.paymentStatus === 'Verifying' && (
                          <button
                            onClick={() => handleAdminApprovePaymentInstant(app.id)}
                            className="mr-auto px-2.5 py-1 text-[10px] uppercase tracking-wider rounded bg-gold-400 text-neutral-950 font-bold hover:bg-gold-500"
                            title="แอดมินหลังบ้านตกลงอนุมัติยอดเพื่อจำลอง"
                          >
                            [Admin] อนุมัติสลิปโอน
                          </button>
                        )}

                        <button
                          onClick={() => { setChatWithUser(app.influencerId); setChatOpen(true); }}
                          className="px-3 py-1.5 rounded border border-neutral-250 text-xs text-neutral-600 bg-white"
                        >
                          แชทติดต่อ
                        </button>
                        
                        {app.paymentStatus !== 'Verifying' ? (
                          <button
                            onClick={() => {
                              setPaymentApp(app);
                              setWantTaxInvoice(false);
                              setSlipFile('');
                              setSlipPreview('');
                            }}
                            className="px-4 py-1.5 bg-neutral-900 border border-gold-400 text-gold-400 hover:text-white rounded text-xs font-bold"
                          >
                            ชำระเงิน
                          </button>
                        ) : (
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] text-amber-500 font-semibold italic flex items-center gap-1 font-prompt">
                              แอดมินกำลังตรวจสลิป...
                            </span>
                            {app.paymentSlipUrl && (
                              <button
                                onClick={() => setViewingSlipUrl(app.paymentSlipUrl)}
                                className="text-[10px] text-[#D4AF37] hover:underline hover:text-amber-500 font-bold font-prompt transition-colors cursor-pointer"
                              >
                                🔍 ดูสลิปที่อัปโหลด
                              </button>
                            )}
                          </div>
                        )}

                      </div>
                    </div>
                  ))
              )}

              {/* Conditional empty state handlers for brand */}
              {brandSubTab === 'applications' && applications.filter(a => a.brandId === currentUser.id && a.status === 'Applied').length === 0 && (
                <div className="col-span-full py-12 text-center bg-white border border-dashed border-neutral-200 rounded-2xl text-xs text-neutral-400">
                  ไม่มีผู้ยื่นสมัครเข้าร่วมงานใหม่ในขณะนี้ค่ะ
                </div>
              )}
              {brandSubTab === 'submissions' && applications.filter(a => a.brandId === currentUser.id && a.status === 'In Progress' && a.submittedLinks && a.submittedLinks.length > 0 && !a.isApproved).length === 0 && (
                <div className="col-span-full py-12 text-center bg-white border border-dashed border-neutral-200 rounded-2xl text-xs text-neutral-400">
                  ไม่มีลิงก์รีวิวที่ส่งเข้ามาใหม่ให้ตรวจสอบในกระบวนการผลิตงานค่ะ
                </div>
              )}
              {brandSubTab === 'payments' && applications.filter(a => a.brandId === currentUser.id && ((a.status === 'In Progress' && a.isApproved) || a.paymentStatus === 'Verifying')).length === 0 && (
                <div className="col-span-full py-12 text-center bg-white border border-dashed border-neutral-200 rounded-2xl text-xs text-neutral-400">
                  ไม่มีธุรกรรมโอนเงินหรือตรวจสอบบิลสลิปที่รอดำเนินการชำระค่ะ
                </div>
              )}

            </div>
          </div>

        </div>
      )}

      {/* ========================================== */}
      {/* 2. MODAL: INFLUENCER SUBMIT WORK WEB-LINKS */}
      {/* ========================================== */}
      {submitWorkApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95">
            
            {/* Header */}
            <div className="bg-neutral-950 p-5 border-b border-gold-400 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Send className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-base font-bold text-white tracking-widest uppercase">ส่งมอบงานรีวิวและลิ้งค์โฆษณา</h3>
              </div>
              <button
                onClick={() => setSubmitWorkApp(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                关闭
              </button>
            </div>

            <form onSubmit={handleSubmitWork} className="p-6 space-y-4">
              <div className="p-3 bg-gold-50/50 rounded-lg text-[11px] text-amber-800 border border-gold-100 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-gold-600 mt-0.5" />
                <span>
                  <strong>ข้อตกลง:</strong> กรุณาแนบลิงก์ที่โพสวิดีโอ/รูปภาพรีวิวสินค้าที่ถูกต้องในแพลตฟอร์มของคุณอย่างน้อย 1 ลิงก์ เพื่อให้ทีมงานเจ้าของแบรนด์สามารถตรวจสอบความถูกต้องได้อย่างประณีตค่ะ
                </span>
              </div>

              <div className="space-y-3 max-h-56 overflow-y-auto pr-1">
                {submitLinks.map((link, idx) => (
                  <div key={idx} className="flex gap-2 items-center p-3 rounded-lg bg-neutral-50/80 border border-neutral-200">
                    
                    {/* Platform Selector dropdown */}
                    <div className="w-28 shrink-0">
                      <select
                        value={link.platform}
                        onChange={e => handleUpdateLink(idx, 'platform', e.target.value)}
                        className="w-full px-2 py-1.5 border border-neutral-200 rounded text-xs outline-none bg-white font-prompt"
                      >
                        <option value="Instagram">Instagram</option>
                        <option value="Tiktok">Tiktok</option>
                        <option value="Facebook">Facebook</option>
                        <option value="YouTube">YouTube</option>
                      </select>
                    </div>

                    {/* URL Input */}
                    <input
                      type="url"
                      required
                      value={link.url}
                      onChange={e => handleUpdateLink(idx, 'url', e.target.value)}
                      placeholder="https://..."
                      className="flex-1 px-3 py-1.5 border border-neutral-200 rounded text-xs focus:ring-1 focus:ring-gold-500 outline-none"
                    />

                    {/* Remove button if multiple fields exist */}
                    {submitLinks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleRemoveLinkField(idx)}
                        className="p-1 px-2.5 bg-red-50 hover:bg-red-100 text-red-500 rounded text-xs font-bold"
                      >
                        ลบ
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Trigger multiple fields */}
              <button
                type="button"
                onClick={handleAddNewLinkField}
                className="w-full py-2 border-2 border-dashed border-gold-250 text-gold-700 hover:bg-gold-50/30 text-xs font-semibold rounded-lg flex items-center justify-center gap-1"
              >
                <Plus className="w-4 h-4" />
                <span>เพิ่มลิงก์ช่องทางเพิ่มเติม</span>
              </button>

              <div className="pt-4 flex justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setSubmitWorkApp(null)}
                  className="px-4 py-2 border rounded text-xs text-neutral-500"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 hover:bg-neutral-900 border border-gold-400 text-gold-400 rounded text-xs font-bold"
                >
                  ยื่นเอกสารส่งงวดงาน
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 3. MODAL: BRAND SETTLEMENT AND PAYSLIP     */}
      {/* ========================================== */}
      {paymentApp && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95">
            
            {/* Elite Invoice Header */}
            <div className="bg-neutral-950 p-5 border-b border-gold-400 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <QrCode className="w-5 h-5 text-gold-400" />
                <h3 className="font-serif text-base font-bold text-white tracking-widest uppercase">ช่องทางชำระภาษีและค่าจ้างด่วน</h3>
              </div>
              <button
                onClick={() => setPaymentApp(null)}
                className="p-1 text-neutral-400 hover:text-white"
              >
                关闭
              </button>
            </div>

            <form onSubmit={handlePaySlipSubmit} className="p-6 space-y-5 max-h-[80vh] overflow-y-auto">
              
              {/* Grand summary billing breakdown */}
              <div className="border border-gold-200/55 p-4 rounded-xl bg-gold-50/30 space-y-3 font-prompt">
                <span className="block text-[8px] uppercase tracking-wider text-gold-700 font-bold">เอกสารแจกแจงรายละเอียดธุรกรรม</span>
                
                <div className="text-xs text-neutral-600 space-y-1">
                  <div className="flex justify-between">
                    <span>แคมเปญเป้าหมาย:</span>
                    <span className="font-bold text-neutral-900">{paymentApp.jobTitle}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>อินฟลูเอนเซอร์ปลายทาง:</span>
                    <span className="text-neutral-900 font-bold">@{paymentApp.influencerName}</span>
                  </div>
                </div>

                <div className="border-t border-dashed border-neutral-200 pt-3 space-y-1.5 text-xs text-neutral-600">
                  <div className="flex justify-between">
                    <span>ราคาจ้างงานสุทธิ:</span>
                    <span>฿{(jobs.find(j => j.id === paymentApp.jobId)?.budget || 35000).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-neutral-405 italic">
                    <span>ค่าภาษีมูลค่าเพิ่ม ณ ที่จ่าย (7%):</span>
                    <span>+฿{((jobs.find(j => j.id === paymentApp.jobId)?.budget || 35000) * 0.07).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-base font-serif text-neutral-950 font-bold border-t border-neutral-100 pt-2">
                    <span className="text-neutral-900 text-xs">ราคารวมสุทธิทั้งสิ้น (VAT Incl.):</span>
                    <span className="text-gold-700">฿{((jobs.find(j => j.id === paymentApp.jobId)?.budget || 35000) * 1.07).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* QR CODE BOX of the platform */}
              <div className="flex flex-col items-center bg-slate-50 p-4 rounded-xl border border-neutral-150 space-y-3">
                <span className="text-[10px] uppercase text-neutral-400 font-bold">QR CODE สแกนโอนเงินเว็ปชำระ EveIn เท่านั้น</span>
                
                <div className="w-36 h-36 bg-white p-2 rounded-lg border border-neutral-200 shadow-sm flex items-center justify-center">
                  {/* Real visual QR placeholder using SVG style */}
                  <div className="text-center font-serif text-[10px] text-neutral-500 flex flex-col items-center gap-1 justify-center h-full">
                    <QrCode className="w-20 h-20 text-neutral-900 mx-auto" />
                    <strong>EVEIN CO., LTD.</strong>
                  </div>
                </div>
                
                <p className="text-[10px] text-neutral-400 leading-relaxed max-w-xs text-center font-light">
                  *สแกนชำระผ่านแอปพลิเคชั่นธนาคาร ยอดราคารวมสุทธิจะถูกพักประมวลผลด่านความปลอดภัย และโอนเข้าบัญชีครีเอเตอร์จริงหลังแกลอรี่ผ่านตรวจสอบแล้วค่ะ
                </p>
              </div>

              {/* Checkbox for Requesting Tax Invoice */}
              <label className="flex items-center gap-2.5 p-3 rounded-lg hover:bg-neutral-50 border border-neutral-150 cursor-pointer text-xs text-neutral-700">
                <input
                  type="checkbox"
                  checked={wantTaxInvoice}
                  onChange={e => setWantTaxInvoice(e.target.checked)}
                  className="w-4 h-4 rounded text-gold-500 focus:ring-gold-500 cursor-pointer"
                />
                <div className="leading-tight font-prompt">
                  <strong>ต้องการรับใบกำกับภาษีเต็มรูปแบบ</strong>
                  <span className="block text-[9px] text-neutral-400 font-light mt-0.5">ทางบริษัทจะดำเนินการออกใบกำกับส่งตรงผ่านไปรษณีย์ตามที่อยู่ในประวัติบริษัทค่ะ</span>
                </div>
              </label>

              {/* Attachment / Slip Uploader */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-neutral-700">
                  แนบไฟล์หลักฐาน (Upload Slip) เพื่อส่งตรวจเช็ก <span className="text-red-500">*</span>
                </label>
                
                {/* Real hidden file input */}
                <input
                  type="file"
                  id="slip-file-input"
                  accept="image/*,application/pdf"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setSlipFile(file.name);
                      const reader = new FileReader();
                      reader.onload = (event) => {
                        setSlipPreview(event.target?.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                />

                {/* Visible drag/drop upload canvas area */}
                {!slipPreview ? (
                  <div
                    onClick={() => document.getElementById('slip-file-input')?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) {
                        setSlipFile(file.name);
                        const reader = new FileReader();
                        reader.onload = (event) => {
                          setSlipPreview(event.target?.result as string);
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                    className="group border-2 border-dashed border-neutral-300 hover:border-[#D4AF37] bg-neutral-50/50 hover:bg-gold-50/10 p-6 rounded-xl flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200"
                  >
                    <div className="p-3 bg-white rounded-full shadow-sm border border-neutral-100 group-hover:scale-110 transition-transform duration-200">
                      <Upload className="w-5 h-5 text-[#D4AF37]" />
                    </div>
                    <span className="block mt-2.5 text-xs font-semibold text-neutral-800">
                      เลือกรูปภาพจากคลังรูปภาพ หรือไฟล์ในเครื่อง
                    </span>
                    <span className="block mt-1 text-[10px] text-neutral-400 font-light">
                      หรือสตรีมวางไฟล์ลงที่นี่ (รองรับ PNG, JPG, JPEG, PDF)
                    </span>
                  </div>
                ) : (
                  <div className="border border-neutral-200 bg-neutral-50 p-3 rounded-xl space-y-2.5">
                    <div className="relative rounded-lg overflow-hidden border border-neutral-200 bg-white flex items-center justify-center py-2 min-h-36">
                      {slipPreview.startsWith('data:application/pdf') ? (
                        <div className="flex flex-col items-center justify-center p-4 text-center">
                          <FileText className="w-12 h-12 text-red-500" />
                          <span className="text-[11px] font-bold text-neutral-800 mt-1 truncate max-w-[200px]">
                            {slipFile}
                          </span>
                          <span className="text-[9px] text-neutral-400">PDF Document</span>
                        </div>
                      ) : (
                        <img
                          src={slipPreview}
                          alt="Slip Preview"
                          className="max-h-48 object-contain rounded drop-shadow-sm/60"
                        />
                      )}
                      
                      <button
                        type="button"
                        onClick={() => {
                          setSlipFile('');
                          setSlipPreview('');
                          const fileInput = document.getElementById('slip-file-input') as HTMLInputElement;
                          if (fileInput) fileInput.value = '';
                        }}
                        className="absolute top-2 right-2 p-1.5 bg-black/75 hover:bg-black text-white rounded-full shadow-lg hover:scale-105 transition-transform cursor-pointer"
                        title="เอาไฟล์ออก / เลือกใหม่"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    </div>
                    
                    <div className="flex justify-between items-center px-1 text-[10px]">
                      <span className="text-neutral-500 truncate max-w-[180px]">
                        📄 {slipFile}
                      </span>
                      <button
                        type="button"
                        onClick={() => document.getElementById('slip-file-input')?.click()}
                        className="text-[#D4AF37] hover:underline font-bold"
                      >
                        เปลี่ยนไฟล์อื่น
                      </button>
                    </div>
                  </div>
                )}

                {/* Validation helper input with fallback text to ensure form action validity */}
                <input
                  type="text"
                  required
                  className="sr-only"
                  value={slipFile}
                  onChange={(e) => setSlipFile(e.target.value)}
                />
                
                <span className="block text-[9px] text-neutral-400">
                  *สลิปประมวลชำระนี้จะส่งเพื่อเซกเตอร์ความปลอดภัยทางการเงินกับ EveIn
                </span>
              </div>

              {/* Action operations and cancel */}
              <div className="pt-4 flex gap-2 border-t border-neutral-100 justify-end">
                <button
                  type="button"
                  onClick={() => setPaymentApp(null)}
                  className="px-4 py-2 border rounded text-xs text-neutral-500"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  disabled={submittingSlip}
                  className="px-5 py-2 bg-gradient-to-r from-gold-500 to-amber-600 hover:from-gold-600 text-white rounded text-xs font-bold shadow-md"
                >
                  {submittingSlip ? 'กำลังส่งสลิป...' : 'ส่งสลิปส่งตรวจความคืบหน้า'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 4. MODAL: EDIT JOB CAMPAIGN DETAILS        */}
      {/* ========================================== */}
      {editJobItem && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gold-300 overflow-hidden transform animate-in fade-in-50 zoom-in-95">
            
            <div className="bg-neutral-950 p-5 border-b border-gold-400 flex justify-between items-center">
              <span className="font-serif text-sm font-bold text-white tracking-widest uppercase">แก้ไขแคมเปญจ้างงาน</span>
              <button onClick={() => setEditJobItem(null)} className="p-1 text-neutral-400 hover:text-white">ปิด</button>
            </div>

            <form onSubmit={handleBrandEditJobSave} className="p-6 space-y-4">
              
              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">ชื่องานโพสจัดจ้าง</label>
                <input
                  type="text"
                  required
                  value={editJobItem.title}
                  onChange={e => setEditJobItem({ ...editJobItem, title: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded text-xs outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">รายละเอียดขอบเขตงาน</label>
                <textarea
                  rows={3}
                  required
                  value={editJobItem.description}
                  onChange={e => setEditJobItem({ ...editJobItem, description: e.target.value })}
                  className="w-full px-3.5 py-2 border rounded text-xs outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">พื้นที่จัดจ้าง</label>
                  <select
                    value={editJobItem.province}
                    onChange={e => setEditJobItem({ ...editJobItem, province: e.target.value })}
                    className="w-full px-3 py-2 border rounded text-xs outline-none bg-white font-prompt"
                  >
                    {['กรุงเทพมหานคร', 'นนทบุรี', 'ชลบุรี', 'ภูเก็ต'].map(p => (
                      <option key={p} value={p}>{p}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="block text-xs font-bold text-neutral-700">งบจ้างงาน (THB)</label>
                  <input
                    type="number"
                    required
                    value={editJobItem.budget}
                    onChange={e => setEditJobItem({ ...editJobItem, budget: Number(e.target.value) })}
                    className="w-full px-3 py-2 border rounded text-xs outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold text-neutral-700">เกณฑ์ช่วงผู้ติดตามอินฟลูฯ</label>
                <select
                  value={editJobItem.followerRange || 'All'}
                  onChange={e => setEditJobItem({ ...editJobItem, followerRange: e.target.value })}
                  className="w-full px-3 py-2 border rounded text-xs outline-none bg-white font-prompt"
                >
                  <option value="All">ทั้งหมด (ไม่จำกัดยอดผู้ติดตาม)</option>
                  <option value="Under 10k">ต่ำกว่า 10,000 คน (Nano)</option>
                  <option value="10k-50k">10,000 - 50,000 คน (Micro)</option>
                  <option value="50k-100k">50,000 - 100,000 คน (Mid-tier)</option>
                  <option value="100k-500k">100,000 - 500,000 คน (Macro)</option>
                  <option value="500k+">500,000 คนขึ้นไป (Mega)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-2 border-t border-neutral-100">
                <button
                  type="button"
                  onClick={() => setEditJobItem(null)}
                  className="px-4 py-2 border rounded text-xs text-neutral-500"
                >
                  ย้อนกลับ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-neutral-950 text-gold-300 hover:text-white rounded text-xs font-bold"
                >
                  บันทึกการแก้ไข
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* ========================================== */}
      {/* 5. PORTABLE LIGHTBOX: VIEW PAYMENT SLIP    */}
      {/* ========================================== */}
      {viewingSlipUrl && (
        <div className="fixed inset-0 bg-neutral-950/80 backdrop-blur-md flex items-center justify-center p-4 z-[9999] animate-in fade-in duration-200">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden relative border border-gold-200/50 flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-250">
            <div className="bg-neutral-950 p-4 border-b border-gold-400/30 flex justify-between items-center text-white">
              <span className="font-serif text-xs font-bold tracking-widest uppercase text-gold-300">หลักฐานการชำระเงิน (Slipped Proof)</span>
              <button 
                onClick={() => setViewingSlipUrl(null)} 
                className="p-1 text-neutral-400 hover:text-white transition-colors cursor-pointer"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-neutral-50 flex items-center justify-center">
              {viewingSlipUrl.startsWith('data:application/pdf') ? (
                <div className="text-center py-10 space-y-3">
                  <FileText className="w-20 h-20 text-red-500 mx-auto" />
                  <p className="text-xs text-neutral-800 font-bold">เอกสาร PDF หลักฐานการชำระสลิป</p>
                  <a 
                    href={viewingSlipUrl} 
                    download="payment_slip.pdf" 
                    className="inline-block px-4 py-2 bg-[#D4AF37] text-neutral-950 text-xs font-bold rounded-lg hover:bg-gold-500 transition-colors"
                  >
                    ดาวน์โหลดไฟล์ PDF
                  </a>
                </div>
              ) : (
                <img 
                  src={viewingSlipUrl} 
                  alt="Full-sized Payment Slip" 
                  className="max-h-[50vh] object-contain rounded-lg shadow-lg border border-neutral-200 bg-white"
                />
              )}
            </div>
            <div className="p-4 bg-white text-center border-t border-neutral-100 flex justify-end">
              <button
                type="button"
                onClick={() => setViewingSlipUrl(null)}
                className="px-5 py-2.5 bg-neutral-900 hover:bg-neutral-800 text-gold-300 font-bold text-xs rounded-xl shadow-md transition-all cursor-pointer"
              >
                ปิดหน้าต่าง
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
