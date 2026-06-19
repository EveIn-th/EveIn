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
  'สมุทรปราการ', 'สมุทรสงคราม', 'สมุทรสาคร', 'สระแก้ว', 'สระบุรี', 
  'สิงห์บุรี', 'สุโขทัย', 'สุพรรณบุรี', 'สุราษฎร์ธานี', 'สุรินทร์', 
  'หนองคาย', 'หนองบัวลำภู', 'อ่างทอง', 'อำนาจเจริญ', 'อุดรธานี', 
  'อุตรดิตถ์', 'อุทัยธานี', 'อุบลราชธานี'
];

export const MOCK_USERS: User[] = [
  {
    id: 'b1',
    username: 'Aurum_Spa',
    realName: 'Aurum Wellness Group Co., Ltd.',
    role: 'Brand',
    gender: 'Female',
    age: 32,
    email: 'contact@aurumspa.co.th',
    phone: '0812345678',
    bio: 'Aurum Spa & Wellness, the premier luxury retreat in Siam, providing bespoke skincare and revitalizing clinical gold-infused therapies.',
    avatar: 'https://images.unsplash.com/photo-1540555700478-4be289fbecef?q=80&w=250&auto=format&fit=crop',
    lineId: 'aurum_spa',
    brandName: 'Aurum Luxury Spa & Aesthetics',
    productCategories: ['คลินิกเสริมความงาม', 'สกินแคร์', 'เครื่องสำอาง']
  },
  {
    id: 'b2',
    username: 'Opal_Condo',
    realName: 'Opal Development Thailand',
    role: 'Brand',
    gender: 'Male',
    age: 41,
    email: 'info@opalresidences.com',
    phone: '0898765432',
    bio: 'Pioneers of ultra-luxury condominiums and waterfront penthouses overlooking the Chao Phraya River.',
    avatar: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?q=80&w=250&auto=format&fit=crop',
    lineId: 'opal_condo',
    brandName: 'Opal Luxury Residences',
    productCategories: ['คอนโดและอสังหาริมทรัพย์', 'ไลฟ์สไตล์']
  },
  {
    id: 'u1',
    username: 'Chanya_Luxe',
    realName: 'Chanya Sornakarin',
    role: 'Influencer',
    gender: 'Female',
    age: 24,
    email: 'chanya.l@glammail.com', // sensitive, hidden in general interface
    phone: '0855554321', // sensitive
    bio: 'Bilingual fashion pioneer and luxury skincare reviewer. Loving aesthetic clinics and elite high-society stays.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=250&auto=format&fit=crop',
    lineId: 'chanya_lux',
    workCategories: ['เครื่องสำอาง', 'สกินแคร์', 'คลินิกเสริมความงาม', 'ไลฟ์สไตล์'],
    bankName: 'ธนาคารกสิกรไทย (KBank)',
    bankAccount: '123-4-56789-0',
    socials: [
      { platform: 'Instagram', handle: '@chanya_luxe_official', followers: 285000 },
      { platform: 'Tiktok', handle: '@chanya_luxe_style', followers: 420000 },
      { platform: 'Facebook', handle: 'Chanya Luxe Beauty & Lifestyle', followers: 150000 }
    ]
  },
  {
    id: 'u2',
    username: 'Ken_Aesthetic',
    realName: 'Kittisak Phumphothong',
    role: 'Influencer',
    gender: 'Male',
    age: 27,
    email: 'ken.fit@aesthetic.net',
    phone: '0834449988',
    bio: 'Men’s grooming advocate, fitness coach and luxury condo reviewer. Passionate about health supplements and urban living.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=250&auto=format&fit=crop',
    lineId: 'ken_fit99',
    workCategories: ['กีฬาและสุขภาพ', 'คลินิกเสริมความงาม', 'คอนโดและอสังหาริมทรัพย์', 'ไลฟ์สไตล์'],
    bankName: 'ธนาคารไทยพาณิชย์ (SCB)',
    bankAccount: '987-6-54321-0',
    socials: [
      { platform: 'Instagram', handle: '@ken_fit_aesthetics', followers: 125000 },
      { platform: 'YouTube', handle: 'Ken Fit & Glow', followers: 310000 }
    ]
  },
  {
    id: 'u3',
    username: 'Zephyr_Gamer',
    realName: 'Arinnat Chaiprasert',
    role: 'Influencer',
    gender: 'LGBTQ',
    age: 22,
    email: 'zephyr.gaming@gmail.com',
    phone: '0821112233',
    bio: 'Top-tier tech setup and high-refresh gaming reviews. Connecting technology and premium lifestyle designs.',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=250&auto=format&fit=crop',
    lineId: 'zephyr_game',
    workCategories: ['เกม', 'โทรศัพท์มือถือและไอที', 'ไลฟ์สไตล์'],
    bankName: 'ธนาคารกรุงเทพ (BBL)',
    bankAccount: '555-5-55555-5',
    socials: [
      { platform: 'Tiktok', handle: '@zephyr_plays', followers: 890000 },
      { platform: 'YouTube', handle: 'Zephyr Tech & Gaming Studio', followers: 580000 }
    ]
  }
];

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: 'e1',
    title: 'Bangkok Golden Elite Gala 2026',
    location: ' Waldorf Astoria Bangkok Grand Ballroom, กรุงเทพมหานคร',
    startDate: '2026-11-20T18:00',
    endDate: '2026-11-20T23:00',
    description: 'The definitive annual high-society gala gathering over 150 elite luxury brands and Thailand’s top 100 high-fashion creators. An exquisite night of gold carpet walk, champagne tasting, and exclusive brand-influencer networking.',
    bannerUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800&auto=format&fit=crop',
    budget: '1,500,000 THB',
    createdBy: 'b1',
    createdByName: 'Aurum Luxury Spa',
    createdAt: '2026-06-15T10:00'
  },
  {
    id: 'e2',
    title: 'Phuket Yacht Riviera & Lifestyle Showcase',
    location: 'Royal Phuket Marina, ภูเก็ต',
    startDate: '2026-12-05T14:00',
    endDate: '2026-12-07T20:00',
    description: 'Enjoy a multi-day sunset cruise party and photoshoot campaign. This prestige exhibition pairs ultra-high-end real estate brands with visual creators to capture lifestyle aesthetics against ocean backdrops.',
    bannerUrl: 'https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?q=80&w=800&auto=format&fit=crop',
    budget: '3,200,000 THB',
    createdBy: 'b2',
    createdByName: 'Opal Luxury Residences',
    createdAt: '2026-06-16T12:00'
  },
  {
    id: 'e3',
    title: 'Gold Glow Aesthetics Summit',
    location: 'Gurney Siam Paragon Hall, กรุงเทพมหานคร',
    startDate: '2026-09-12T10:00',
    endDate: '2026-09-13T18:00',
    description: 'A revolutionary premium convention highlighting advancements in gold-standard dermal therapies, organic wellness serums, and modern face sculpting treatments. Celebrated with premium celebrity panels.',
    bannerUrl: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?q=80&w=800&auto=format&fit=crop',
    budget: '800,000 THB',
    createdBy: 'b1',
    createdByName: 'Aurum Luxury Spa',
    createdAt: '2026-06-17T09:00'
  }
];

export const INITIAL_JOBS: JobItem[] = [
  {
    id: 'j1',
    title: 'Sartorial Gold Youth Elixir Review',
    brandName: 'Aurum Luxury Spa & Aesthetics',
    description: 'Review our signature 24K Pure Gold Firming Serum. Creators are requested to post a high-production 60-second video displaying the application, highlighting glowing skin results, and tagging our premium clinic page.',
    province: 'กรุงเทพมหานคร',
    platforms: ['Instagram', 'Tiktok'],
    category: 'สกินแคร์',
    ageRange: '20-35',
    genderRequired: 'All',
    budget: 45000,
    isOpen: true,
    followerRange: '10k-50k',
    createdBy: 'b1',
    createdAt: '2026-06-17T11:00'
  },
  {
    id: 'j2',
    title: 'Opal Penthouses Celestial Living Experience',
    brandName: 'Opal Luxury Residences',
    description: 'Exquisite property-tour campaign for influencers to experience our million-dollar riverfront penthouses. Requires beautiful static photos or architectural video walkthrough showcasing the panoramic view.',
    province: 'นนทบุรี',
    platforms: ['Instagram', 'YouTube'],
    category: 'คอนโดและอสังหาริมทรัพย์',
    ageRange: '25-45',
    genderRequired: 'All',
    budget: 120000,
    isOpen: true,
    followerRange: '100k-500k',
    createdBy: 'b2',
    createdAt: '2026-06-17T14:30'
  },
  {
    id: 'j3',
    title: 'Luxury Lip Glow-Kit Launch Drive',
    brandName: 'Aurum Luxury Spa & Aesthetics',
    description: 'Seeking premium beauty influencers to try and review our newly launched Champagne Liquid Lips collection. Aesthetic Swatches and high-contrast styling required.',
    province: 'ชลบุรี',
    platforms: ['Tiktok', 'Instagram', 'Facebook'],
    category: 'เครื่องสำอาง',
    ageRange: '18-28',
    genderRequired: 'Female',
    budget: 25000,
    isOpen: true,
    followerRange: 'Under 10k',
    createdBy: 'b1',
    createdAt: '2026-06-18T01:00'
  },
  {
    id: 'j4',
    title: 'Gold Shield Activewear Campaign',
    brandName: 'Opal Luxury Residences',
    description: 'Sponsoring athletic influencers with premium fitness wear made with high-performance bamboo weave. High-resolution imagery inside modern condo wellness center required.',
    province: 'ภูเก็ต',
    platforms: ['Instagram'],
    category: 'กีฬาและสุขภาพ',
    ageRange: '22-38',
    genderRequired: 'Male',
    budget: 35000,
    isOpen: false, // Closed for applicants initially to showcase "closed" state toggle
    followerRange: '50k-100k',
    createdBy: 'b2',
    createdAt: '2026-06-18T03:15'
  }
];

export const INITIAL_APPLICATIONS: JobApplication[] = [
  {
    id: 'app1',
    jobId: 'j1',
    jobTitle: 'Sartorial Gold Youth Elixir Review',
    brandId: 'b1',
    brandName: 'Aurum Luxury Spa & Aesthetics',
    influencerId: 'u1',
    influencerName: 'Chanya_Luxe',
    influencerPlatformDetails: 'Instagram: @chanya_luxe_official (285k followers)',
    status: 'In Progress',
    submittedLinks: [],
    paymentStatus: 'Unpaid',
    appliedAt: '2026-06-17T15:00'
  },
  {
    id: 'app2',
    jobId: 'j2',
    jobTitle: 'Opal Penthouses Celestial Living Experience',
    brandId: 'b2',
    brandName: 'Opal Luxury Residences',
    influencerId: 'u2',
    influencerName: 'Ken_Aesthetic',
    influencerPlatformDetails: 'YouTube: Ken Fit & Glow (310k subscribers)',
    status: 'Applied',
    paymentStatus: 'Unpaid',
    appliedAt: '2026-06-17T18:00'
  }
];
