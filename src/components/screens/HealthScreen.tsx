import {
  Footprints, Droplets, Moon, Flame, Heart,
  Plus, Minus, ChevronRight, Zap, Trophy
} from 'lucide-react'
import { weeklyStepsData, sleepData, sampleMeals, daysOfWeek } from '../../data/sampleData'
import { useRealtime } from '../../context/RealtimeContext'
import AnimatedNumber from '../AnimatedNumber'
import Sparkline from '../Sparkline'

function CircularProgress({ value, max, color, size = 80, strokeWidth = 8 }: {
  value: number; max: number; color: string; size?: number; strokeWidth?: number
}) {
  const radius = (size - strokeWidth) / 2
  const circ = 2 * Math.PI * radius
  const offset = circ * (1 - Math.min(value / max, 1))

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={strokeWidth} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke={color} strokeWidth={strokeWidth}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        className="circle-progress transition-all duration-700 ease-out"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
      />
    </svg>
  )
}

function MiniBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const height = max > 0 ? Math.min((value / max) * 56, 56) : 0
  const isToday = label === 'อา'
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-6 h-14 bg-gray-100 rounded-full flex flex-col justify-end overflow-hidden relative">
        <div
          className="w-full rounded-full transition-all duration-700 ease-out"
          style={{ height: `${height}px`, backgroundColor: color, opacity: isToday ? 0.3 : 1 }}
        />
      </div>
      <span className={`text-xs font-semibold ${isToday ? 'text-text-sub' : 'text-text-main'}`}>{label}</span>
    </div>
  )
}

export default function HealthScreen() {
  const { health, addWater, setWater } = useRealtime()
  const water = health.water
  const WATER_GOAL = health.waterGoal

  const removeWater = () => setWater(water - 1)

  const stepsPercent = Math.round((health.steps / health.stepsGoal) * 100)

  const mealTypeLabel: Record<string, string> = {
    breakfast: 'มื้อเช้า',
    lunch: 'มื้อเที่ยง',
    snack: 'ของว่าง',
    dinner: 'มื้อเย็น',
  }
  const mealTypeColor: Record<string, string> = {
    breakfast: '#F59E0B',
    lunch: '#22C55E',
    snack: '#8B5CF6',
    dinner: '#4F8CFF',
  }

  const totalCalories = sampleMeals.reduce((s, m) => s + m.calories, 0)

  return (
    <div className="screen-content animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-xl font-bold text-text-main">สุขภาพ</h1>
        <div className="flex items-center gap-1.5 bg-warning-light rounded-2xl px-3 py-1.5">
          <Trophy size={14} className="text-warning" />
          <span className="text-xs font-bold text-warning">ทำได้ 5 วันติดกัน!</span>
        </div>
      </div>

      {/* Heart Rate Hero */}
      <div className="gradient-danger rounded-3xl p-5 text-white shadow-float relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative flex items-center gap-4">
          <div className="w-16 h-16 bg-white/20 rounded-3xl flex items-center justify-center">
            <Heart size={28} className="text-white animate-heartbeat" fill="currentColor" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <p className="text-white/80 text-sm">อัตราการเต้นหัวใจ</p>
              <span className="flex items-center gap-1 bg-white/20 rounded-lg px-2 py-0.5">
                <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
                <span className="text-[10px] font-bold">LIVE</span>
              </span>
            </div>
            <p className="text-4xl font-bold">
              <AnimatedNumber value={health.heartRate} duration={500} /> <span className="text-xl font-normal">bpm</span>
            </p>
            <div className="-mx-1 mt-1">
              <Sparkline data={health.heartRateHistory} color="rgba(255,255,255,0.85)" width={180} height={30} />
            </div>
          </div>
        </div>
      </div>

      {/* Steps + Calories row */}
      <div className="flex gap-3">
        {/* Steps */}
        <div className="card flex-1 flex flex-col items-center py-4">
          <div className="relative">
            <CircularProgress value={health.steps} max={health.stepsGoal} color="#4F8CFF" size={90} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Footprints size={16} className="text-primary mb-0.5" />
              <p className="text-xs font-bold text-text-main leading-none">{stepsPercent}%</p>
            </div>
          </div>
          <p className="text-xl font-bold text-text-main mt-2"><AnimatedNumber value={health.steps} /></p>
          <p className="text-xs text-text-sub">/ {health.stepsGoal.toLocaleString()} ก้าว</p>
        </div>

        {/* Calories */}
        <div className="card flex-1 flex flex-col items-center py-4">
          <div className="relative">
            <CircularProgress value={health.calories} max={health.caloriesGoal} color="#F59E0B" size={90} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <Flame size={16} className="text-warning mb-0.5" />
              <p className="text-xs font-bold text-text-main leading-none">
                {Math.round((health.calories / health.caloriesGoal) * 100)}%
              </p>
            </div>
          </div>
          <p className="text-xl font-bold text-text-main mt-2"><AnimatedNumber value={health.calories} /></p>
          <p className="text-xs text-text-sub">/ {health.caloriesGoal} kcal</p>
        </div>
      </div>

      {/* Water Intake */}
      <div className="card">
        <div className="section-header mb-4">
          <div>
            <h2 className="section-title">ดื่มน้ำวันนี้</h2>
            <p className="text-xs text-text-sub mt-0.5">{water} / {WATER_GOAL} แก้ว</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={removeWater}
              className="w-8 h-8 rounded-xl bg-background flex items-center justify-center active:scale-90 transition-transform"
            >
              <Minus size={14} className="text-text-sub" />
            </button>
            <button
              onClick={() => addWater()}
              className="w-8 h-8 rounded-xl bg-blue-500 flex items-center justify-center active:scale-90 transition-transform shadow-soft"
            >
              <Plus size={14} className="text-white" />
            </button>
          </div>
        </div>

        {/* Water cups visualization */}
        <div className="grid grid-cols-8 gap-1.5 mb-3">
          {Array.from({ length: WATER_GOAL }).map((_, i) => (
            <button
              key={i}
              onClick={() => setWater(i + 1)}
              className={`aspect-square rounded-xl flex items-center justify-center transition-all duration-300 ${
                i < water ? 'bg-blue-500 shadow-soft' : 'bg-gray-100'
              }`}
            >
              <Droplets
                size={14}
                className={`transition-all duration-300 ${i < water ? 'text-white' : 'text-gray-300'}`}
              />
            </button>
          ))}
        </div>

        <div className="progress-bar">
          <div
            className="progress-fill bg-blue-500"
            style={{ width: `${(water / WATER_GOAL) * 100}%` }}
          />
        </div>
        <p className="text-xs text-text-sub mt-2 text-center">
          {water < WATER_GOAL
            ? `ดื่มน้ำอีก ${WATER_GOAL - water} แก้วเพื่อถึงเป้าหมาย`
            : '🎉 ดื่มน้ำครบตามเป้าหมายแล้ว!'}
        </p>
      </div>

      {/* Sleep Tracking */}
      <div className="card">
        <div className="section-header">
          <div>
            <h2 className="section-title">การนอนหลับ</h2>
            <p className="text-xs text-text-sub mt-0.5">คืนที่ผ่านมา {health.sleep} ชั่วโมง</p>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-50 rounded-xl px-3 py-1.5">
            <Moon size={14} className="text-purple-500" />
            <span className="text-xs font-bold text-purple-500">ดี</span>
          </div>
        </div>

        {/* Sleep bar chart */}
        <div className="flex items-end justify-between gap-1 mt-3">
          {sleepData.map((d) => (
            <MiniBar key={d.day} value={d.hours} max={10} color="#8B5CF6" label={d.day} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-2 mt-4">
          <div className="bg-purple-50 rounded-2xl p-3 text-center">
            <p className="text-base font-bold text-purple-600">22:30</p>
            <p className="text-xs text-text-sub">เข้านอน</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-3 text-center">
            <p className="text-base font-bold text-purple-600">{health.sleep}h</p>
            <p className="text-xs text-text-sub">ระยะเวลา</p>
          </div>
          <div className="bg-purple-50 rounded-2xl p-3 text-center">
            <p className="text-base font-bold text-purple-600">06:00</p>
            <p className="text-xs text-text-sub">ตื่นนอน</p>
          </div>
        </div>
      </div>

      {/* Steps Weekly Chart */}
      <div className="card">
        <div className="section-header">
          <h2 className="section-title">ก้าวเดินรายสัปดาห์</h2>
          <button className="section-action flex items-center gap-0.5">
            ดูเพิ่ม <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-end justify-between gap-1 mt-2">
          {weeklyStepsData.map((steps, i) => (
            <MiniBar key={i} value={steps} max={10000} color="#4F8CFF" label={daysOfWeek[i] ?? ''} />
          ))}
        </div>
      </div>

      {/* Meals */}
      <div className="card">
        <div className="section-header">
          <div>
            <h2 className="section-title">มื้ออาหารวันนี้</h2>
            <p className="text-xs text-text-sub mt-0.5">รวม {totalCalories} kcal</p>
          </div>
          <button className="icon-box-sm bg-success-light active:scale-90 transition-transform">
            <Plus size={14} className="text-success" />
          </button>
        </div>

        <div className="space-y-2">
          {sampleMeals.map(meal => (
            <div key={meal.id} className="flex items-center gap-3 p-3 bg-background rounded-2xl">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: mealTypeColor[meal.type] + '20' }}
              >
                <Zap size={14} style={{ color: mealTypeColor[meal.type] }} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-semibold text-text-main">{meal.name}</p>
                <p className="text-xs text-text-sub">{mealTypeLabel[meal.type]} · {meal.time}</p>
              </div>
              <p className="text-sm font-bold text-text-main">{meal.calories} kcal</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
