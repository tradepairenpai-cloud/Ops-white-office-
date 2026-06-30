import {
  createContext, useContext, useEffect, useRef, useState,
  type ReactNode,
} from 'react'
import { sampleHealth, monthlyBudget } from '../data/sampleData'
import type {
  ActivityItem, AgentInsight, LiveFinance, LiveHealth, RealtimeValue,
} from '../types'

// ── helpers ─────────────────────────────────────────────────────────────────
const randInt = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min + 1)) + min
const clamp = (n: number, min: number, max: number) =>
  Math.max(min, Math.min(max, n))

function nowTime() {
  const d = new Date()
  const p = (n: number) => n.toString().padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}`
}
function nowClock() {
  const d = new Date()
  const p = (n: number) => n.toString().padStart(2, '0')
  return `${p(d.getHours())}:${p(d.getMinutes())}:${p(d.getSeconds())}`
}

// Simulated micro-purchases that stream into the live finance feed.
const PURCHASES = [
  { icon: '☕', name: 'ร้านกาแฟ', min: 45, max: 180 },
  { icon: '🍜', name: 'อาหารกลางวัน', min: 60, max: 220 },
  { icon: '🚗', name: 'ค่าเดินทาง', min: 25, max: 150 },
  { icon: '🛒', name: 'ของใช้', min: 80, max: 350 },
  { icon: '🍿', name: 'ของว่าง', min: 20, max: 90 },
]

interface CoreState {
  tick: number
  health: LiveHealth
  finance: LiveFinance
  activity: ActivityItem[]
  agent: AgentInsight
}

function buildInsights(h: LiveHealth, f: LiveFinance): string[] {
  const out: string[] = []
  const stepsLeft = h.stepsGoal - h.steps
  out.push(stepsLeft > 0
    ? `เดินอีก ${stepsLeft.toLocaleString()} ก้าวก็ถึงเป้าหมายวันนี้ 🎯`
    : `เยี่ยมมาก! เดินครบ ${h.stepsGoal.toLocaleString()} ก้าวแล้ว 🏆`)
  if (h.water < h.waterGoal)
    out.push(`ดื่มน้ำอีก ${h.waterGoal - h.water} แก้วเพื่อสุขภาพที่ดี 💧`)
  out.push(`หัวใจเต้น ${h.heartRate} bpm — ${h.heartRate > 95 ? 'กำลังกระฉับกระเฉง' : 'อยู่ในเกณฑ์ปกติ'} ❤️`)
  const calLeft = h.caloriesGoal - h.calories
  if (calLeft > 0) out.push(`พลังงานเหลืออีก ${calLeft} kcal สำหรับวันนี้ 🍽️`)
  out.push(`คงเหลือเดือนนี้ ฿${(f.income - f.expense).toLocaleString()} · ใช้ไป ฿${f.expense.toLocaleString()} 💰`)
  return out
}

function simulate(prev: CoreState): CoreState {
  const tick = prev.tick + 1
  const events: ActivityItem[] = []
  const time = nowTime()

  // Steps tick up
  const steps = clamp(prev.health.steps + randInt(8, 46), 0, 14000)
  if (Math.floor(steps / 1000) > Math.floor(prev.health.steps / 1000)) {
    events.push({
      id: `s-${tick}`, icon: '👟', tone: 'primary', time,
      text: `เดินถึง ${(Math.floor(steps / 1000) * 1000).toLocaleString()} ก้าวแล้ว`,
    })
  }

  // Heart-rate random walk + rolling history for the sparkline
  const heartRate = clamp(prev.health.heartRate + randInt(-4, 4), 60, 118)
  const heartRateHistory = [...prev.health.heartRateHistory, heartRate].slice(-24)
  if (heartRate >= 100 && prev.health.heartRate < 100) {
    events.push({
      id: `h-${tick}`, icon: '❤️', tone: 'warning', time,
      text: `หัวใจเต้นเร็วขึ้น ${heartRate} bpm`,
    })
  }

  // Calories drift upward
  const calories = clamp(prev.health.calories + randInt(0, 7), 0, prev.health.caloriesGoal + 600)

  // Finance: occasional micro-purchase streams in
  let expense = prev.finance.expense
  if (Math.random() < 0.22) {
    const p = PURCHASES[randInt(0, PURCHASES.length - 1)]!
    const amt = randInt(p.min, p.max)
    expense += amt
    events.push({
      id: `f-${tick}`, icon: p.icon, tone: 'danger', time,
      text: `${p.name} -฿${amt.toLocaleString()}`,
    })
  }

  const health: LiveHealth = { ...prev.health, steps, heartRate, heartRateHistory, calories }
  const finance: LiveFinance = { ...prev.finance, expense }

  const insights = buildInsights(health, finance)
  const agent: AgentInsight = {
    status: tick % 6 === 0 ? 'thinking' : 'active',
    message: insights[tick % insights.length]!,
    updatedAt: time,
  }

  const activity = events.length ? [...events, ...prev.activity].slice(0, 14) : prev.activity

  return { tick, health, finance, activity, agent }
}

function makeInitial(): CoreState {
  const health: LiveHealth = {
    steps: sampleHealth.steps,
    stepsGoal: sampleHealth.stepsGoal,
    water: sampleHealth.water,
    waterGoal: sampleHealth.waterGoal,
    sleep: sampleHealth.sleep,
    sleepGoal: sampleHealth.sleepGoal,
    calories: sampleHealth.calories,
    caloriesGoal: sampleHealth.caloriesGoal,
    heartRate: sampleHealth.heartRate,
    heartRateHistory: [70, 72, 71, 73, 72, 74, sampleHealth.heartRate],
  }
  const finance: LiveFinance = {
    income: monthlyBudget.income,
    expense: monthlyBudget.expense,
    budget: monthlyBudget.budget,
  }
  return {
    tick: 0,
    health,
    finance,
    activity: [
      { id: 'init-1', icon: '🤖', tone: 'primary', time: nowTime(), text: 'AI Agent เริ่มติดตามข้อมูลแบบเรียลไทม์' },
    ],
    agent: { status: 'active', message: buildInsights(health, finance)[0]!, updatedAt: nowTime() },
  }
}

const RealtimeContext = createContext<RealtimeValue | null>(null)

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const [core, setCore] = useState<CoreState>(makeInitial)
  const [clock, setClock] = useState<string>(nowClock())
  const coreRef = useRef(core)
  coreRef.current = core

  // Main simulation loop — evolves every metric on a 2s cadence.
  useEffect(() => {
    const id = setInterval(() => setCore(prev => simulate(prev)), 2000)
    return () => clearInterval(id)
  }, [])

  // Live wall clock (seconds).
  useEffect(() => {
    const id = setInterval(() => setClock(nowClock()), 1000)
    return () => clearInterval(id)
  }, [])

  const setWater = (n: number) =>
    setCore(prev => ({
      ...prev,
      health: { ...prev.health, water: clamp(n, 0, prev.health.waterGoal) },
    }))
  const addWater = (n = 1) => setWater(coreRef.current.health.water + n)

  const value: RealtimeValue = {
    live: true,
    tick: core.tick,
    clock,
    health: core.health,
    finance: core.finance,
    activity: core.activity,
    agent: core.agent,
    addWater,
    setWater,
  }

  return <RealtimeContext.Provider value={value}>{children}</RealtimeContext.Provider>
}

export function useRealtime(): RealtimeValue {
  const ctx = useContext(RealtimeContext)
  if (!ctx) throw new Error('useRealtime must be used within a RealtimeProvider')
  return ctx
}
