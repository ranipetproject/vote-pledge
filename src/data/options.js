// Book Fair form options.
// "value" is what is stored in the database (English, used in reports).
// "ta" is the Tamil label shown to visitors.
// To add / change an option, edit here AND the same file in the admin dashboard.

export const GENDERS = [
  { value: 'Male', ta: 'ஆண்' },
  { value: 'Female', ta: 'பெண்' },
  { value: 'Transgender', ta: 'மூன்றாம் பாலினம்' },
]

export const OCCUPATIONS = [
  { value: 'School Student', ta: 'பள்ளி மாணவர்' },
  { value: 'College Student', ta: 'கல்லூரி மாணவர்' },
  { value: 'Teacher / Professor', ta: 'ஆசிரியர் / பேராசிரியர்' },
  { value: 'Government Employee', ta: 'அரசு ஊழியர்' },
  { value: 'Private Employee', ta: 'தனியார் ஊழியர்' },
  { value: 'Business', ta: 'வணிகம் / சுயதொழில்' },
  { value: 'Farmer', ta: 'விவசாயி' },
  { value: 'Homemaker', ta: 'இல்லத்தரசி' },
  { value: 'Retired', ta: 'ஓய்வு பெற்றவர்' },
  { value: 'Other', ta: 'மற்றவை' },
]

export const AREA_TYPES = [
  { value: 'Rural', ta: 'கிராமம் (இராணிப்பேட்டை)' },
  { value: 'Urban', ta: 'நகரம் (இராணிப்பேட்டை)' },
  { value: 'Other District', ta: 'வேறு மாவட்டம்' },
]

export const BLOCKS = ['Arakkonam', 'Arcot', 'Kaveripakkam', 'Nemili', 'Sholinghur', 'Thimiri', 'Walajah']

export const ULBS = [
  'Arakkonam MP', 'Arcot MP', 'Melvisharam MP', 'Ranipet MP', 'Sholinghur MP', 'Wallajah MP',
  'Ammoor TP', 'Kalavai TP', 'Kaveripakkam TP', 'Nemili TP', 'Panapakkam TP',
  'Thakkolam TP', 'Thimiri TP', 'Vilapakkam TP',
]

export const PURPOSES = [
  { value: 'Buy books', ta: 'புத்தகம் வாங்க' },
  { value: 'Competitive exam books', ta: 'போட்டித் தேர்வு புத்தகங்கள்' },
  { value: 'Books for children', ta: 'குழந்தைகளுக்கான புத்தகங்கள்' },
  { value: 'Browse / Visit', ta: 'பார்வையிட மட்டும்' },
  { value: 'Author / Speaker events', ta: 'எழுத்தாளர் / சொற்பொழிவு நிகழ்ச்சி' },
  { value: 'Cultural programmes', ta: 'கலை நிகழ்ச்சிகள்' },
  { value: 'School / College visit', ta: 'பள்ளி / கல்லூரி மூலம் வருகை' },
]

export const GENRES = [
  { value: 'Novels / Fiction', ta: 'நாவல் / புனைவு' },
  { value: 'Short stories', ta: 'சிறுகதைகள்' },
  { value: 'Poetry', ta: 'கவிதை' },
  { value: 'Tamil classics / Sangam', ta: 'தமிழ் இலக்கியம் / சங்க இலக்கியம்' },
  { value: 'History', ta: 'வரலாறு' },
  { value: 'Biography / Autobiography', ta: 'வாழ்க்கை வரலாறு' },
  { value: 'Competitive exams (TNPSC / UPSC etc.)', ta: 'போட்டித் தேர்வுகள் (TNPSC / UPSC)' },
  { value: 'Children books', ta: 'சிறுவர் நூல்கள்' },
  { value: 'Self-help / Motivation', ta: 'தன்னம்பிக்கை' },
  { value: 'Science & Technology', ta: 'அறிவியல் & தொழில்நுட்பம்' },
  { value: 'Spiritual / Religious', ta: 'ஆன்மீகம்' },
  { value: 'Health / Cooking', ta: 'உடல்நலம் / சமையல்' },
  { value: 'Agriculture', ta: 'விவசாயம்' },
  { value: 'Politics / Current affairs', ta: 'அரசியல் / நடப்பு நிகழ்வுகள்' },
  { value: 'Comics / Puzzles', ta: 'காமிக்ஸ் / புதிர்கள்' },
]

export const LANGUAGES = [
  { value: 'Tamil', ta: 'தமிழ்' },
  { value: 'English', ta: 'ஆங்கிலம்' },
  { value: 'Other', ta: 'பிற மொழிகள்' },
]

export const AMOUNTS = [
  { value: 'Nil', ta: 'இல்லை' },
  { value: 'Below 500', ta: '₹500-க்குள்' },
  { value: '500-1000', ta: '₹500 – ₹1,000' },
  { value: '1000-2000', ta: '₹1,000 – ₹2,000' },
  { value: 'Above 2000', ta: '₹2,000-க்கு மேல்' },
]

export const HOW_HEARD = [
  { value: 'Newspaper', ta: 'செய்தித்தாள்' },
  { value: 'TV / Radio', ta: 'தொலைக்காட்சி / வானொலி' },
  { value: 'WhatsApp / Social media', ta: 'வாட்ஸ்அப் / சமூக ஊடகம்' },
  { value: 'School / College', ta: 'பள்ளி / கல்லூரி' },
  { value: 'Banner / Poster', ta: 'பேனர் / சுவரொட்டி' },
  { value: 'Friends / Family', ta: 'நண்பர்கள் / குடும்பம்' },
  { value: 'Other', ta: 'மற்றவை' },
]
