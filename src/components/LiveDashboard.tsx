import type { ReactNode } from 'react'
import { Activity, Heart, Footprints, Flame, Droplets, Sparkles } from 'lucide-react'
import { useRealtime } from '../context/RealtimeContext'
import AnimatedNumber from './AnimatedNumber'
import ProgressRing from './ProgressRing'
import Sparkline from './Sparkline'
import TypewriterText from './TypewriterText'
import type { ActivityTone } from '../types'

const toneText: Record<ActivityTone, string> = {
  primary: 'text-primary',
  success: 'text-success',
  warning: 'text-warning',
  danger: 'text-danger',
}

// The animated, always-live hero of the Home screen: a daily-score ring, a
// streaming AI-agent banner, a live heart-rate card, and a scrolling activity
// ticker — all driven by the realtime store.
export default function LiveDashboard() {
  const { health, finance, agent, activity, clock } = useRealtime()

  const stepsPct = Math.round((health.steps / health.stepsGoal) * 100)
  const waterPct = Math.round((health.water / health.waterGoal) * 100)
  const caloriesPct = Math.round((health.calories / health.caloriesGoal) * 100)
  const budgetPct = Math.round((finance.expense / finance.budget) * 100)
  const dailyScore = Math.min(
    Math.round((stepsPct + waterPct + caloriesPct + Math.max(0, 100 - budgetPct)) / 4),
    100,
  )

  // Duplicate the activity list so the marquee can loop seamlessly.
  const tickerItems = [...activity, ...activity]

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Agent banner */}
      <div className="gradient-primary rounded-3xl p-4 text-white shadow-float relative overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="relative">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 bg-white/20 rounded-2xl flex items-center justify-center">
                <Sparkles size={18} className="text-white" />
              </div>
              <div>
                <p className="font-bold text-sm leading-tight">AI Agent</p>
                <p className="text-white/70 text-xs">
                  {agent.status === 'thinking' ? 'กำลังวิเคราะห์…' : 'ติดตามแบบเรียลไทม์'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-2.5 py-1">
              <span className="w-2 h-2 bg-green-300 rounded-full live-dot" />
              <span className="text-xs font-bold tracking-wide">LIVE</span>
            </div>
          </div>
          <p className="text-sm text-white/95 min-h-[2.5rem] leading-relaxed">
            <TypewriterText text={agent.message} />
            <span className="caret-blink ml-0.5">▌</span>
          </p>
          <p className="text-white/60 text-xs mt-1">อัปเดต {clock}</p>
        </div>
      </div>

      {/* Daily score + heart rate */}
      <div className="flex gap-3">
        {/* Daily score ring */}
        <div className="card flex-1 flex flex-col items-center justify-center py-4">
          <ProgressRing value={dailyScore} max={100} color="#4F8CFF" size={104} stroke={10}>
            <Activity size={18} className="text-primary mb-0.5" />
            <p className="text-2xl font-bold text-text-main leading-none">
              <AnimatedNumber value={dailyScore} />
            </p>
            <p className="text-[10px] text-text-sub">คะแนนวันนี้</p>
          </ProgressRing>
          <p className="text-xs text-text-sub mt-2">สุขภาพ · งาน · การเงิน</p>
        </div>

        {/* Live heart rate */}
        <div className="gradient-danger flex-1 rounded-3xl p-4 text-white shadow-float flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <Heart size={16} className="text-white animate-heartbeat" fill="currentColor" />
              <span className="text-xs text-white/80">หัวใจ</span>
            </div>
            <span className="w-1.5 h-1.5 bg-white rounded-full live-dot" />
          </div>
          <p className="text-3xl font-bold leading-none mt-1">
            <AnimatedNumber value={health.heartRate} duration={500} />
            <span className="text-sm font-normal text-white/80"> bpm</span>
          </p>
          <div className="-mx-1 mt-1">
            <Sparkline data={health.heartRateHistory} color="rgba(255,255,255,0.9)" width={140} height={32} />
          </div>
        </div>
      </div>

      {/* Live metric chips */}
      <div className="grid grid-cols-3 gap-3">
        <LiveChip
          icon={<Footprints size={15} className="text-primary" />}
          tint="bg-primary-light"
          value={<AnimatedNumber value={health.steps} />}
          label="ก้าว"
          pct={stepsPct}
          bar="bg-primary"
        />
        <LiveChip
          icon={<Flame size={15} className="text-orange-500" />}
          tint="bg-orange-50"
          value={<AnimatedNumber value={health.calories} />}
          label="kcal"
          pct={caloriesPct}
          bar="bg-orange-400"
        />
        <LiveChip
          icon={<Droplets size={15} className="text-blue-500" />}
          tint="bg-blue-50"
          value={<><AnimatedNumber value={health.water} />/{health.waterGoal}</>}
          label="แก้วน้ำ"
          pct={waterPct}
          bar="bg-blue-500"
        />
      </div>

      {/* Activity ticker */}
      <div className="card overflow-hidden py-3">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-2 h-2 bg-success rounded-full live-dot" />
          <p className="text-xs font-bold text-text-sub uppercase tracking-wide">ฟีดสด</p>
        </div>
        <div className="relative overflow-hidden">
          <div className="flex gap-2 w-max animate-ticker">
            {tickerItems.map((item, i) => (
              <div
                key={`${item.id}-${i}`}
                className="flex items-center gap-1.5 bg-background rounded-xl px-3 py-1.5 flex-shrink-0"
              >
                <span className="text-sm">{item.icon}</span>
                <span className={`text-xs font-semibold ${toneText[item.tone]}`}>{item.text}</span>
                <span className="text-[10px] text-text-sub">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function LiveChip({ icon, tint, value, label, pct, bar }: {
  icon: ReactNode
  tint: string
  value: ReactNode
  label: string
  pct: number
  bar: string
}) {
  return (
    <div className="stat-card">
      <div className={`icon-box-sm ${tint} mb-1`}>{icon}</div>
      <p className="text-base font-bold text-text-main leading-tight">{value}</p>
      <p className="text-xs text-text-sub">{label}</p>
      <div className="progress-bar mt-1.5">
        <div className={`progress-fill ${bar}`} style={{ width: `${Math.min(pct, 100)}%` }} />
      </div>
    </div>
  )
}
