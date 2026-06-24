import { useState, useEffect } from 'react'

const THAI_DAYS = ['อาทิตย์', 'จันทร์', 'อังคาร', 'พุธ', 'พฤหัสบดี', 'ศุกร์', 'เสาร์']
const THAI_MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]

export function useDateTime() {
  const [now, setNow] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const thaiYear = now.getFullYear() + 543
  const day = THAI_DAYS[now.getDay()]
  const date = now.getDate()
  const month = THAI_MONTHS[now.getMonth()]

  const hours = now.getHours().toString().padStart(2, '0')
  const minutes = now.getMinutes().toString().padStart(2, '0')
  const seconds = now.getSeconds().toString().padStart(2, '0')

  return {
    dateString: `วัน${day}ที่ ${date} ${month} ${thaiYear}`,
    timeString: `${hours}:${minutes}`,
    secondsString: seconds,
    greeting: now.getHours() < 12 ? 'อรุณสวัสดิ์' : now.getHours() < 17 ? 'สวัสดีตอนบ่าย' : 'สวัสดีตอนเย็น',
    raw: now,
  }
}
