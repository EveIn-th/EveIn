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
  'แพร่', 'พัทลุง', 'ภูเก็ต', 'มหาสารคาม', 'มุกดาหาร', 
  'แม่ฮ่องสอน', 'ยโสธร', 'ยะลา', 'ร้อยเอ็ด', 'ระนอง', 
  'ระยอง', 'ราชบุรี', 'ลพบุรี', 'ลำปาง', 'ลำพูน', 
  'เลย', 'ศรีสะเกษ', 'สกลนคร', 'สงขลา', 'สตูล', 
  'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'sara_buri', 'สระบุรี', 
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
    id: 'b1',
    username: 'Lux_Chanel_Official',
    realName: 'บจก. ชาแนล ประเทศไทย',
    role: 'Brand',
    gender: 'All',
    age: 40,
    email: 'contact@chanel-th.com',
    phone: '021112222',
    password: 'Password123',
    brandName: 'Chanel Luxury Makeup',
    productCategories: ['เครื่องสำอาง', 'สกินแคร์', 'ไลฟ์สไตล์'],
    bio: 'ผู้นำเข้าและจัดจำหน่ายเครื่องสำอางและน้ำหอม Chanel ระดับไฮเอนด์อย่างเป็นทางการในประเทศไทย',
    avatar: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=250&auto=format&fit=crop'
  },
  {
    id: 'b2',
    username: 'Siri_Developments',
    realName: 'บมจ. แสนสิริ คอนโดลักซ์',
    role: 'Brand',
    gender: 'All',
    age: 45,
    email: 'marketing@sansiri-condo.com',
    phone: '023334444',
    password: 'Password123',
    brandName: 'Sansiri Property Group',
    productCategories: ['คอนโดและอสังหาริมทรัพย์', 'ไลฟ์สไตล์'],
    bio: 'ผู้พัฒนาอสังหาริมทรัพย์ระดับลักชัวรี่และอัลตร้าลักชัวรี่ชั้นนำของเมืองไทย คอนโดและทาวน์โฮม',
    avatar: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=250&auto=format&fit=crop'
  },
  {
    id: 'u1',
    username: 'Pearl_Pearl_Nano',
    realName: 'ชลธิชา พิงค์พิมุกต์',
    role: 'Influencer',
    gender: 'Female',
    age: 21,
    email: 'pearl_cute@gmail.com',
    phone: '0991112222',
    password: 'Password123',
    bio: 'สายน่ารัก สกินแคร์เกาหลี งานรีวิวเน้นความจริงใจ ถ่ายรูปแบบฟรุ้งฟริ้งสไตล์ธรรมชาติค่ะ รับงานทุกจังหวัด',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    workCategories: ['สกินแคร์', 'เครื่องสำอาง', 'ไลฟ์สไตล์'],
    bankName: 'ธนาคารกสิกรไทย (KBank)',
    bankAccount: '111-2-12345-6',
    lineId: 'pearl_sweetie',
    socials: [
      {
        platform: 'Instagram',
        handle: 'pearl_sweetie_ig',
        followers: 5500,
        url: 'https://instagram.com/pearl_sweetie_ig'
      },
      {
        platform: 'Tiktok',
        handle: 'pearl_tiktok_nano',
        followers: 8200,
        url: 'https://tiktok.com/@pearl_tiktok_nano'
      }
    ]
  },
  {
    id: 'u2',
    username: 'Jane_Jane_Micro',
    realName: 'เจนจิรา แก้วตา',
    role: 'Influencer',
    gender: 'Female',
    age: 25,
    email: 'jane_beauty@hotmail.com',
    phone: '0855554444',
    password: 'Password123',
    bio: 'รีวิวเมคอัพ สกินแคร์เคาเตอร์แบรนด์ ไลฟ์สไตล์ผู้หญิงหรูหรา และที่เที่ยวคาเฟ่เก๋ๆ ในกรุงเทพค่ะ',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop',
    workCategories: ['เครื่องสำอาง', 'สกินแคร์', 'คลินิกเสริมความงาม'],
    bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
    bankAccount: '222-3-45678-9',
    lineId: 'jane_makeup_stylist',
    socials: [
      {
        platform: 'Tiktok',
        handle: 'jane_beauty_tiktok',
        followers: 28500,
        url: 'https://tiktok.com/@jane_beauty_tiktok'
      }
    ]
  },
  {
    id: 'u3',
    username: 'Ken_Ken_MidTier',
    realName: 'กิตติศักดิ์ ศรีวิโรจน์',
    role: 'Influencer',
    gender: 'Male',
    age: 28,
    email: 'ken_vlogger@gmail.com',
    phone: '0867778888',
    password: 'Password123',
    bio: 'สายท่องเที่ยวลุยเดี่ยว ถ่าย Vlog อาหารอร่อย อสังหาริมทรัพย์และอุปกรณ์ไอทีแกดเจ็ตเทคโนโลยีชั้นยอดครับ',
    avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=250&auto=format&fit=crop',
    workCategories: ['กีฬาและสุขภาพ', 'โทรศัพท์มือถือและไอที', 'คอนโดและอสังหาริมทรัพย์'],
    bankName: 'ธนาคารกรุงเทพ (BBL)',
    bankAccount: '333-4-56789-0',
    lineId: 'ken_vlogs_line',
    socials: [
      {
        platform: 'YouTube',
        handle: 'KenTravelWithStyle',
        followers: 75000,
        url: 'https://youtube.com/c/KenTravelWithStyle'
      }
    ]
  },
  {
    id: 'u4',
    username: 'Sophia_Sophia_Macro',
    realName: 'โซเฟีย คอร์เตลล่า',
    role: 'Influencer',
    gender: 'Female',
    age: 30,
    email: 'sophia_style@elite.com',
    phone: '0887766554',
    password: 'Password123',
    bio: 'นางแบบและผู้สร้างสไตล์บิวตี้เครื่องแต่งกายลักชัวรี่ รีวิวคลินิกผิวพรรณระดับพรีเมียม ถ่ายงานแฟชั่นภาพนิ่งสวยงาม',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=250&auto=format&fit=crop',
    workCategories: ['เครื่องสำอาง', 'คลินิกเสริมความงาม', 'ไลฟ์สไตล์'],
    bankName: 'ธนาคารกสิกรไทย (KBank)',
    bankAccount: '444-5-67890-1',
    lineId: 'sophia_luxe',
    socials: [
      {
        platform: 'Instagram',
        handle: 'sophia_lux_model',
        followers: 180000,
        url: 'https://instagram.com/sophia_lux_model'
      },
      {
        platform: 'Facebook',
        handle: 'SophiaStyleFanpage',
        followers: 110000,
        url: 'https://facebook.com/SophiaStyleFanpage'
      }
    ]
  },
  {
    id: 'u5',
    username: 'Bow_PremiumMacro',
    realName: 'วรัญญู สุขวิเศษ',
    role: 'Influencer',
    gender: 'LGBTQ',
    age: 24,
    email: 'bow_rainbow@gmail.com',
    phone: '0956667788',
    password: 'Password123',
    bio: 'ครีเอเตอร์ความสวยแนวตลกฮาสนุก รีวิวคลินิกอาหารเสริม ความน่ารักและมีสาระ แฟนนับแสนพร้อมกดแชร์รีวิวให้ค่ะ',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=250&auto=format&fit=crop',
    workCategories: ['เครื่องสำอาง', 'คลินิกเสริมความงาม', 'ไลฟ์สไตล์'],
    bankName: 'ธนาคารกรุงไทย (KTB)',
    bankAccount: '555-6-78901-2',
    lineId: 'bow_rainbowy',
    socials: [
      {
        platform: 'Tiktok',
        handle: 'bow_rainbow_dance',
        followers: 450000,
        url: 'https://tiktok.com/@bow_rainbow_dance'
      }
    ]
  },
  {
    id: 'u6',
    username: 'Ploy_Mega_Star',
    realName: 'พลอยชนก จิตต์สุวรรณ',
    role: 'Influencer',
    gender: 'Female',
    age: 32,
    email: 'ploy_mega@universe.com',
    phone: '0811119999',
    password: 'Password123',
    bio: 'เซเลบริตี้และบิวตี้บล็อกเกอร์เบอร์ต้นๆ ของไทย ผลงานการันตีความเด่นระดับนิตยสาร พรีเซนเตอร์แบรนด์ท็อปคลาสระดับชาติ',
    avatar: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?q=80&w=250&auto=format&fit=crop',
    workCategories: ['สกินแคร์', 'เครื่องสำอาง', 'ไลฟ์สไตล์'],
    bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
    bankAccount: '666-7-89012-3',
    lineId: 'ploy_celebrity',
    socials: [
      {
        platform: 'Instagram',
        handle: 'ploy_mega_official',
        followers: 1200000,
        url: 'https://instagram.com/ploy_mega_official'
      },
      {
        platform: 'YouTube',
        handle: 'PloyMegaSpace',
        followers: 850000,
        url: 'https://youtube.com/c/PloyMegaSpace'
      }
    ]
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'EveIn Luxury Gala & Award Ceremony 2026',
    location: 'Siam Paragon Royal Paragon Hall, กรุงเทพมหานคร',
    startDate: '2026-08-15',
    endDate: '2026-08-16',
    description: 'งานร่วมตัวครั้งยิ่งใหญ่สุดตระการตาสำหรับเหล่าลักชัวรี่แบรนด์ระดับท็อปร้อยแบรนด์ และสุดยอดครีเอเตอร์แถวหน้าของวงการ แลกเปลี่ยนคอนเนคชั่นทางธุรกิจ พร้อมรับรางวัลเกียรติยศผู้ทรงอิทธิพล',
    bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    budget: '฿500,000+',
    createdBy: 'admin_evein',
    createdByName: 'แอดมินสูงสุด Poei',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_JOBS: JobItem[] = [
  {
    id: 'j1',
    title: 'รับสมัครรีวิว Chanel Rouge Allure ลิปสติกรุ่นลิมิเต็ด มอบลุคปากหรูฉ่ำเงา',
    brandName: 'Chanel Luxury Makeup',
    description: 'ต้องการหาครีเอเตอร์/อินฟลูเอนเซอร์ในการรีวิวสวอชสีลิปสติกคอลเลกชันใหม่ล่าสุด Chanel Rouge Allure ถ่ายวิดีโอ 1 คลิปสั้นลงแพลตฟอร์มของคุณ และรูปถ่ายภาพโพสต์เดี่ยวที่สวยงามคมชัด โดยจะจัดส่งลิปตัวจริงไปให้ทดลองถึงบ้านค่ะ เงินจ้างพูลสูง',
    province: 'กรุงเทพมหานคร',
    platforms: ['Instagram', 'Tiktok'],
    category: 'เครื่องสำอาง',
    ageRange: '18-23',
    genderRequired: 'All',
    budget: 25000,
    isOpen: true,
    followerRange: '10k-50k',
    createdBy: 'b1',
    createdAt: new Date().toISOString()
  },
  {
    id: 'j2',
    title: 'ถ่ายคลิปโปรโมตคอนโดพรีเมียม Sansiri Signature สุขุมวิท ใกล้รถไฟฟ้า',
    brandName: 'Sansiri Property Group',
    description: 'รับครีเอเตอร์ท่องเที่ยว ไลฟ์สไตล์ หรือสายรีวิวบ้าน คอนโด แนะนำไลฟ์สไตล์สุดฮิประดับพรีเมียม ถ่ายรีวิวห้องนอน ห้องนั่งเล่น และส่วนกลางลอยฟ้าสระว่ายน้ำพาโนรามา ถ่ายทอดความคุ้มค่าน่าอยู่อาศัย ลงช่องทาง YouTube หรือ Facebook',
    province: 'กรุงเทพมหานคร',
    platforms: ['YouTube', 'Facebook'],
    category: 'คอนโดและอสังหาริมทรัพย์',
    ageRange: '24-30',
    genderRequired: 'All',
    budget: 85000,
    isOpen: true,
    followerRange: '100k-500k',
    createdBy: 'b2',
    createdAt: new Date().toISOString()
  },
  {
    id: 'j3',
    title: 'รีวิวผลิตภัณฑ์เซรั่มฟื้นฟูผิวข้ามคืนเข้มข้นพิเศษ ระดับพรีเมียมออร์แกนิก',
    brandName: 'Chanel Luxury Makeup',
    description: 'ประกาศรับสมัครเฉพาะนาโน-ไมโครครีเอเตอร์ ถ่ายทอดเสียงสะท้อนจากการใช้จริงก่อน-หลังเซรั่มแชลแนลคืนความชุ่มชื้น เน้นถ่ายใกล้ผิวพรรณธรรมชาติแท้ๆ เผยความกระจ่างใส มีสัมผัสของภาพที่คุมสีโทนลักชัวรี่',
    province: 'นนทบุรี',
    platforms: ['Instagram'],
    category: 'สกินแคร์',
    ageRange: '18-23',
    genderRequired: 'Female',
    budget: 8000,
    isOpen: true,
    followerRange: 'Under 10k',
    createdBy: 'b1',
    createdAt: new Date().toISOString()
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [];
