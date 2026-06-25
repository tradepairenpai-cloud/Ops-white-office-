import type { Task, Event, HealthMetric, Transaction, ChatMessage, WeatherData, Meal } from '../types'

export const sampleTasks: Task[] = [
  { id: '1', title: 'ประชุมทีมพัฒนา', time: '09:00', done: false, priority: 'high', category: 'งาน' },
  { id: '2', title: 'ส่งรายงานรายเดือน', time: '12:00', done: false, priority: 'high', category: 'งาน' },
  { id: '3', title: 'ออกกำลังกาย 30 นาที', time: '17:30', done: true, priority: 'medium', category: 'สุขภาพ' },
  { id: '4', title: 'โทรหาคุณแม่', time: '19:00', done: false, priority: 'medium', category: 'ครอบครัว' },
  { id: '5', title: 'อ่านหนังสือ 20 นาที', time: '21:00', done: false, priority: 'low', category: 'พัฒนาตนเอง' },
  { id: '6', title: 'จ่ายค่าน้ำค่าไฟ', time: '10:00', done: true, priority: 'high', category: 'การเงิน' },
]

export const sampleEvents: Event[] = [
  { id: '1', title: 'ประชุมทีม', time: '09:00', endTime: '10:00', location: 'ห้องประชุม A', color: '#4F8CFF', category: 'งาน' },
  { id: '2', title: 'พักกลางวัน', time: '12:00', endTime: '13:00', location: 'โรงอาหาร', color: '#22C55E', category: 'ส่วนตัว' },
  { id: '3', title: 'รีวิวโปรเจกต์', time: '14:00', endTime: '15:30', location: 'ออนไลน์', color: '#8B5CF6', category: 'งาน' },
  { id: '4', title: 'ออกกำลังกาย', time: '17:30', endTime: '18:30', location: 'ฟิตเนส', color: '#F59E0B', category: 'สุขภาพ' },
  { id: '5', title: 'อาหารเย็นครอบครัว', time: '19:00', endTime: '20:30', location: 'บ้าน', color: '#EF4444', category: 'ครอบครัว' },
]

export const sampleHealth: HealthMetric = {
  steps: 6842,
  stepsGoal: 10000,
  water: 5,
  waterGoal: 8,
  sleep: 7.5,
  sleepGoal: 8,
  calories: 1650,
  caloriesGoal: 2000,
  heartRate: 72,
}

export const sampleTransactions: Transaction[] = [
  { id: '1', title: 'เงินเดือน', category: 'รายได้', amount: 45000, type: 'income', date: '24 มิ.ย.', icon: '💰' },
  { id: '2', title: 'ค่าอาหาร', category: 'อาหาร', amount: 350, type: 'expense', date: '24 มิ.ย.', icon: '🍜' },
  { id: '3', title: 'Grab', category: 'เดินทาง', amount: 120, type: 'expense', date: '24 มิ.ย.', icon: '🚗' },
  { id: '4', title: 'ร้านกาแฟ', category: 'อาหาร', amount: 185, type: 'expense', date: '23 มิ.ย.', icon: '☕' },
  { id: '5', title: 'Netflix', category: 'บันเทิง', amount: 419, type: 'expense', date: '23 มิ.ย.', icon: '🎬' },
  { id: '6', title: 'ฟิตเนส', category: 'สุขภาพ', amount: 500, type: 'expense', date: '22 มิ.ย.', icon: '💪' },
  { id: '7', title: 'Freelance', category: 'รายได้', amount: 8500, type: 'income', date: '22 มิ.ย.', icon: '💻' },
]

export const sampleMeals: Meal[] = [
  { id: '1', name: 'ข้าวต้ม + ไข่', calories: 320, time: '07:30', type: 'breakfast' },
  { id: '2', name: 'ข้าวมันไก่', calories: 520, time: '12:30', type: 'lunch' },
  { id: '3', name: 'ผลไม้รวม', calories: 150, time: '15:00', type: 'snack' },
  { id: '4', name: 'ข้าวผัดกุ้ง', calories: 650, time: '19:00', type: 'dinner' },
]

export const sampleWeather: WeatherData = {
  temp: 31,
  condition: 'มีเมฆบางส่วน',
  humidity: 74,
  wind: 12,
  feelsLike: 35,
  icon: '⛅',
}

export const sampleMessages: ChatMessage[] = [
  {
    id: '1',
    role: 'ai',
    content: 'สวัสดีครับ! วันนี้ฉันสามารถช่วยอะไรคุณได้บ้าง? 😊',
    timestamp: '09:00',
  },
  {
    id: '2',
    role: 'user',
    content: 'วันนี้ฉันมีงานอะไรบ้าง?',
    timestamp: '09:01',
  },
  {
    id: '3',
    role: 'ai',
    content: 'วันนี้คุณมี 3 งานสำคัญ:\n• 09:00 ประชุมทีมพัฒนา\n• 12:00 ส่งรายงานรายเดือน\n• 19:00 โทรหาคุณแม่\n\nนอกจากนี้ยังมีการออกกำลังกายและอ่านหนังสือที่ตั้งใจไว้ด้วยนะครับ 💪',
    timestamp: '09:01',
  },
]

export const weeklyStepsData = [5200, 8100, 6500, 9200, 7800, 6842, 0]
export const weeklyWaterData = [6, 7, 5, 8, 6, 5, 0]
export const weeklySleepData = [7, 6.5, 8, 7.5, 6, 7.5, 0]

export const monthlyBudget = {
  income: 53500,
  expense: 18420,
  budget: 25000,
  categories: [
    { name: 'อาหาร', amount: 7200, budget: 8000, color: '#F59E0B' },
    { name: 'เดินทาง', amount: 3100, budget: 4000, color: '#4F8CFF' },
    { name: 'บันเทิง', amount: 2800, budget: 3000, color: '#8B5CF6' },
    { name: 'สุขภาพ', amount: 2320, budget: 3000, color: '#22C55E' },
    { name: 'ช้อปปิ้ง', amount: 3000, budget: 5000, color: '#EF4444' },
  ],
}

export const sleepData = [
  { day: 'จ', hours: 7.0, quality: 'ดี' },
  { day: 'อ', hours: 6.5, quality: 'พอใช้' },
  { day: 'พ', hours: 8.0, quality: 'ดีมาก' },
  { day: 'พฤ', hours: 7.5, quality: 'ดี' },
  { day: 'ศ', hours: 6.0, quality: 'พอใช้' },
  { day: 'ส', hours: 7.5, quality: 'ดี' },
  { day: 'อา', hours: 0, quality: '' },
]

export const daysOfWeek = ['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา']
