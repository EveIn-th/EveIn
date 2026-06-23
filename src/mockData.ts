import { EventItem, JobItem, User, JobApplication } from './types';

export const THAI_PROVINCES = [
  'กรุงเทพมหานคร', 'กระบี่', 'กาญจนบุรี', 'กาฬสินธุ์', 'กำแพงเพชร', 
  'ขอนแก่น', 'จันทบุรี', 'ฉะเชิงเทรา', 'ชลบุรี', 'ชัยนาท', 
  'ชัยภูมิ', 'ชุมพร', 'เชียงราย', 'เชียงใหม่', 'ตรัง', 
  'ตราด', 'ตาก', 'นครนายก', 'นครปฐม', 'นครพนม', 
  'นครราชสีมา', 'นครศรีธรรมราช', 'นครสวรรค์', 'นนทบุรี', 'นราธิวาส', 
  'น่าน', 'บึงกาฬ', 'บุรีรัมย์', 'ปทุมธานี', 'ประจวบคีรีขันธ์', 
  'ปราจีนบุรี', 'ปัตตานี', 'พระนครศรีอยุธยา', 'พะเยา', 'พังงา', 
  'พัทลุง', 'พิจิตร', 'พิษณุโลก', 'เพชรบุรี', 'เพชรบูรณ์', 
  'แพร่', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 
  'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 
  'ระยอง', 'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 
  'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 
  'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 
  'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 
  'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 
  'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี'
];

export const MOCK_USERS: User[] = [
  {
    id: 'admin_evein',
    username: 'Admin_Poei',
    realName: 'ผู้ดูแลระบบสูงสุด Poei',
    role: 'WebsiteManager',
    gender: 'LGBTQ',
    age: 35,
    email: 'adminpoei@evein.com',
    phone: '0812411982',
    password: 'Poei2411982A',
    bio: 'ผู้ดูแลสูงสุดระบบ EveIn Luxury Platform มีสิทธิ์เข้าถึงทุกปุ่มและจัดการระบบ แชทเรียลไทม์กับผู้ใช้งาน',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=250&auto=format&fit=crop'
  },
  {
    id: 'inf_chanya',
    username: 'Chanya_Lux',
    realName: 'ชัญญา ลุกซ์',
    role: 'Influencer',
    gender: 'Female',
    age: 24,
    email: 'chanya@evein.com',
    phone: '0812345678',
    password: 'Password123!',
    bio: 'สวัสดีค่ะ ชัญญาเป็นบิวตี้และสกินแคร์กูรู ผู้ติดตามสายคุณหนูลุกซ์หวานฉ่ำ ยินดีร่วมงานกับแบรนด์ลักชัวรี่ค่ะ',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop',
    workCategories: ['เครื่องสำอาง', 'สกินแคร์', 'ไลฟ์สไตล์'],
    bankName: 'ธนาคารกสิกรไทย (KBank)',
    bankAccount: '123-4-56789-0',
    socials: [
      {
        platform: 'Instagram',
        handle: 'chanya.looks',
        followers: 125000,
        url: 'https://instagram.com'
      },
      {
        platform: 'Tiktok',
        handle: 'chanya.looks.official',
        followers: 430000,
        url: 'https://tiktok.com'
      }
    ]
  },
  {
    id: 'inf_nont',
    username: 'Nont_Style',
    realName: 'นนท์ ชลธิศ',
    role: 'Influencer',
    gender: 'Male',
    age: 27,
    email: 'nont@evein.com',
    phone: '0823456789',
    password: 'Password123!',
    bio: 'ครีเอเตอร์แนะนำไลฟ์สไตล์คนกรุง คอนโดหรู ยานพาหนะ และของสะสมไฮเอนด์ ถ่ายทอดภาพลักษณ์แบรนด์ให้มีระดับน่าค้นหา',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=250&auto=format&fit=crop',
    workCategories: ['คอนโดและอสังหาริมทรัพย์', 'โทรศัพท์มือถือและไอที', 'อื่นๆ'],
    bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
    bankAccount: '987-6-54321-0',
    socials: [
      {
        platform: 'YouTube',
        handle: 'NontStyle_Channel',
        followers: 780000,
        url: 'https://youtube.com'
      }
    ]
  },
  {
    id: 'inf_porsche',
    username: 'Porsche_LGBT',
    realName: 'พอร์ช พีรวัส',
    role: 'Influencer',
    gender: 'LGBTQ',
    age: 22,
    email: 'porsche@evein.com',
    phone: '0834567890',
    password: 'Password123!',
    bio: 'Lifestyle & Spa reviewer. เน้นโปรโมตคลินิกความงามระดับบนและการท่องเที่ยวหรูกลางกรุงแบบชิคๆ',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    workCategories: ['คลินิกเสริมความงาม', 'กีฬาและสุขภาพ', 'ไลฟ์สไตล์'],
    bankName: 'ธนาคารกรุงเทพ (BBL)',
    bankAccount: '111-2-33333-4',
    socials: [
      {
        platform: 'Tiktok',
        handle: 'porsche_spa_review',
        followers: 95000,
        url: 'https://tiktok.com'
      }
    ]
  }
];

export const INITIAL_EVENTS: EventItem[] = [];

export const INITIAL_JOBS: JobItem[] = [
  {
    id: 'j_skincare_exclusive',
    title: 'รีวิวผลิตภัณฑ์เซรั่มทองคำกู้ผิวใสเร่งด่วน 24k Aurum Gold',
    brandName: 'Aurum Wellness Group',
    description: 'แคมเปญส่งเสริมแบรนด์พรีเมียม สกินแคร์ทองคำบริสุทธิ์เพื่อความกระจ่างใส คัดเลือกเฉพาะสกินแคร์ครีเอเตอร์ที่นำเสนอลุกซ์พรีเมียมเป็นธรรมชาติ',
    province: 'กรุงเทพมหานคร',
    platforms: ['Instagram', 'Tiktok'],
    category: 'สกินแคร์',
    ageRange: '18-23',
    genderRequired: 'All',
    budget: 35000,
    isOpen: true,
    followerRange: '10k-50k',
    createdBy: 'brand_aurum',
    createdAt: new Date().toISOString()
  },
  {
    id: 'j_condo_highrise',
    title: 'แต่งคอนโดหรูริมแม่น้ำเจ้าพระยาถ่ายทอดไลฟ์สไตล์ชิคๆ Luxury Living',
    brandName: 'Villas Riverside',
    description: 'แคมเปญนำเสนอห้องชุดระดับไฮเอนด์ริมแม่น้ำเจ้าพระยา แบรนด์ต้องการอินฟลูเอนเซอร์ในการผลิตคลิปสไตล์ไลฟ์สไตล์พาชมห้องและสิ่งอำนวยความสะดวกสุดอลังการ',
    province: 'นนทบุรี',
    platforms: ['YouTube'],
    category: 'คอนโดและอสังหาริมทรัพย์',
    ageRange: '24-30',
    genderRequired: 'All',
    budget: 95000,
    isOpen: true,
    followerRange: '100k-500k',
    createdBy: 'brand_aurum',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [];
