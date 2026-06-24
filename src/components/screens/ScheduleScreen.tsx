import { useState } from 'react'
import { ChevronLeft, ChevronRight, Plus, MapPin, Clock } from 'lucide-react'
import { sampleEvents, sampleTasks } from '../../data/sampleData'

const MONTHS = [
  'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
  'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม',
]
const DAY_LABELS = ['อา', 'จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส']

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfMonth(year: number, month: number) {
  return new Date(year, month, 1).getDay()
}

export default function ScheduleScreen() {
  const today = new Date()
  const [viewYear, setViewYear] = useState(today.getFullYear())
  const [viewMonth, setViewMonth] = useState(today.getMonth())
  const [selectedDay, setSelectedDay] = useState(today.getDate())

  const daysInMonth = getDaysInMonth(viewYear, viewMonth)
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth)
  const thaiYear = viewYear + 543

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const calendarDays: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ]

  const eventsWithDots = new Set([7, 14, 15, 21, 24, 28])
  const isToday = (d: number) =>
    d === today.getDate() && viewMonth === today.getMonth() && viewYear === today.getFullYear()

  return (
    <div className="screen-content animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-xl font-bold text-text-main">ตารางเวลา</h1>
        <button className="icon-box bg-primary text-white active:scale-90 transition-transform shadow-soft">
          <Plus size={18} />
        </button>
      </div>

      {/* Calendar Card */}
      <div className="card">
        {/* Month nav */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={prevMonth}
            className="w-9 h-9 bg-background rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronLeft size={18} className="text-text-main" />
          </button>
          <div className="text-center">
            <p className="font-bold text-text-main">{MONTHS[viewMonth]}</p>
            <p className="text-xs text-text-sub">{thaiYear}</p>
          </div>
          <button
            onClick={nextMonth}
            className="w-9 h-9 bg-background rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <ChevronRight size={18} className="text-text-main" />
          </button>
        </div>

        {/* Day labels */}
        <div className="grid grid-cols-7 mb-2">
          {DAY_LABELS.map((d, i) => (
            <div
              key={d}
              className={`text-center text-xs font-semibold py-1 ${i === 0 ? 'text-danger' : i === 6 ? 'text-primary' : 'text-text-sub'}`}
            >
              {d}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-y-1">
          {calendarDays.map((day, idx) => {
            if (!day) return <div key={`empty-${idx}`} />
            const selected = day === selectedDay
            const today_ = isToday(day)
            const hasEvent = eventsWithDots.has(day)

            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`relative flex flex-col items-center justify-center h-10 rounded-xl transition-all duration-200 active:scale-90 ${
                  selected
                    ? 'bg-primary text-white shadow-soft'
                    : today_
                    ? 'bg-primary-light text-primary font-bold'
                    : 'text-text-main hover:bg-background'
                }`}
              >
                <span className={`text-sm font-semibold ${selected ? 'text-white' : ''}`}>{day}</span>
                {hasEvent && (
                  <span
                    className={`absolute bottom-1.5 w-1 h-1 rounded-full ${selected ? 'bg-white' : 'bg-primary'}`}
                  />
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected Day Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-text-main">
          {selectedDay} {MONTHS[viewMonth]} — กิจกรรม
        </h2>
        <span className="badge bg-primary-light text-primary">
          {sampleEvents.length} รายการ
        </span>
      </div>

      {/* Timeline Events */}
      <div className="card space-y-0 p-0 overflow-hidden">
        {sampleEvents.map((event, idx) => (
          <div key={event.id} className="relative">
            <div className="flex items-stretch gap-0">
              {/* Time column */}
              <div className="flex flex-col items-center w-16 py-3 px-2 flex-shrink-0">
                <p className="text-xs font-bold text-text-main">{event.time}</p>
                {event.endTime && (
                  <p className="text-xs text-text-sub">{event.endTime}</p>
                )}
                <div className="flex-1 w-px bg-gray-100 my-1" />
              </div>

              {/* Color bar */}
              <div className="w-1 self-stretch my-3 rounded-full flex-shrink-0" style={{ backgroundColor: event.color }} />

              {/* Event card */}
              <div className="flex-1 py-3 px-3">
                <p className="text-sm font-bold text-text-main">{event.title}</p>
                {event.location && (
                  <div className="flex items-center gap-1 mt-1">
                    <MapPin size={11} className="text-text-sub" />
                    <p className="text-xs text-text-sub">{event.location}</p>
                  </div>
                )}
                <div className="flex items-center gap-1 mt-1">
                  <Clock size={11} className="text-text-sub" />
                  <p className="text-xs text-text-sub">{event.time} - {event.endTime}</p>
                </div>
                <span
                  className="mt-2 inline-flex badge text-xs"
                  style={{ backgroundColor: event.color + '20', color: event.color }}
                >
                  {event.category}
                </span>
              </div>
            </div>

            {idx < sampleEvents.length - 1 && (
              <div className="h-px bg-gray-50 mx-4" />
            )}
          </div>
        ))}
      </div>

      {/* Reminders */}
      <div>
        <h2 className="section-title mb-3">การแจ้งเตือน</h2>
        <div className="space-y-2">
          {sampleTasks.filter(t => !t.done).slice(0, 3).map(task => (
            <div key={task.id} className="card-sm flex items-center gap-3 p-3 active:scale-98 transition-transform">
              <div
                className="w-2 h-2 rounded-full flex-shrink-0"
                style={{
                  backgroundColor: task.priority === 'high' ? '#EF4444' : task.priority === 'medium' ? '#F59E0B' : '#22C55E',
                }}
              />
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-main">{task.title}</p>
                <p className="text-xs text-text-sub">{task.time} น.</p>
              </div>
              <span className={`badge ${
                task.priority === 'high' ? 'bg-danger-light text-danger' :
                task.priority === 'medium' ? 'bg-warning-light text-warning' :
                'bg-success-light text-success'
              }`}>
                {task.category}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
