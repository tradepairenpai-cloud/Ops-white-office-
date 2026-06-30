import { useState } from 'react'
import {
  Droplets, Moon, Footprints, ChevronRight,
  Bell, Sparkles, TrendingUp, TrendingDown,
  Flame, Wind, Thermometer, Check, Plus
} from 'lucide-react'
import type { Task } from '../../types'
import { sampleTasks, sampleWeather } from '../../data/sampleData'
import { useDateTime } from '../../hooks/useDateTime'
import { useRealtime } from '../../context/RealtimeContext'
import LiveDashboard from '../LiveDashboard'
import AnimatedNumber from '../AnimatedNumber'

export default function HomeScreen() {
  const { dateString, timeString, greeting } = useDateTime()
  const { health, finance } = useRealtime()
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }

  const todayTasks = tasks.slice(0, 4)
  const completedCount = tasks.filter(t => t.done).length
  const totalCount = tasks.length

  const stepsPercent = Math.round((health.steps / health.stepsGoal) * 100)
  const waterPercent = Math.round((health.water / health.waterGoal) * 100)
  const sleepPercent = Math.round((health.sleep / health.sleepGoal) * 100)

  const spent = finance.expense
  const budget = finance.budget
  const budgetPercent = Math.round((spent / budget) * 100)

  const priorityColor: Record<string, string> = {
    high: 'bg-danger-light text-danger',
    medium: 'bg-warning-light text-warning',
    low: 'bg-success-light text-success',
  }

  const priorityLabel: Record<string, string> = {
    high: 'ด่วน',
    medium: 'ปานกลาง',
    low: 'ทั่วไป',
  }

  return (
    <div className="screen-content animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-sm text-text-sub font-medium">{dateString}</p>
          <h1 className="text-2xl font-bold text-text-main mt-0.5">
            {greeting} คุณแฝง! 👋
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <button className="w-10 h-10 bg-white rounded-2xl shadow-soft flex items-center justify-center active:scale-90 transition-transform">
            <Bell size={18} className="text-text-main" />
            <span className="absolute top-0.5 right-0.5 w-2 h-2 bg-danger rounded-full" />
          </button>
          <div className="w-10 h-10 rounded-2xl overflow-hidden shadow-soft">
            <div className="w-full h-full gradient-primary flex items-center justify-center text-white font-bold text-sm">
              ฝ
            </div>
          </div>
        </div>
      </div>

      {/* Time Hero Card */}
      <div className="gradient-primary rounded-3xl p-5 text-white shadow-float animate-slide-up relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-8 translate-x-8" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-8 -translate-x-8" />
        <div className="relative">
          <p className="text-white/70 text-sm font-medium">เวลาปัจจุบัน</p>
          <p className="text-5xl font-bold tracking-tight mt-1">{timeString}</p>
          <div className="flex items-center gap-3 mt-3">
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <span className="text-lg">{sampleWeather.icon}</span>
              <span className="font-semibold">{sampleWeather.temp}°C</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <Droplets size={14} />
              <span className="font-semibold">{sampleWeather.humidity}%</span>
            </div>
            <div className="flex items-center gap-1.5 bg-white/20 rounded-xl px-3 py-1.5">
              <Wind size={14} />
              <span className="font-semibold">{sampleWeather.wind} km/h</span>
            </div>
          </div>
          <p className="text-white/80 text-sm mt-2">{sampleWeather.condition} · รู้สึกเหมือน {sampleWeather.feelsLike}°C</p>
        </div>
      </div>

      {/* Live realtime dashboard */}
      <LiveDashboard />

      {/* Task Progress */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.05s' }}>
        <div className="section-header">
          <div>
            <h2 className="section-title">งานวันนี้</h2>
            <p className="text-xs text-text-sub mt-0.5">เสร็จแล้ว {completedCount}/{totalCount} งาน</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="icon-box-sm bg-primary-light active:scale-90 transition-transform">
              <Plus size={16} className="text-primary" />
            </button>
            <button className="text-sm font-semibold text-primary flex items-center gap-0.5">
              ดูทั้งหมด <ChevronRight size={14} />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="progress-bar mb-4">
          <div
            className="progress-fill bg-primary"
            style={{ width: `${(completedCount / totalCount) * 100}%` }}
          />
        </div>

        <div className="space-y-2.5">
          {todayTasks.map((task) => (
            <button
              key={task.id}
              onClick={() => toggleTask(task.id)}
              className="w-full flex items-center gap-3 p-3 rounded-2xl bg-background hover:bg-gray-50 active:scale-98 transition-all duration-150 text-left"
            >
              <div
                className={`w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0 border-2 transition-all duration-200 ${
                  task.done
                    ? 'bg-success border-success'
                    : 'border-gray-300 bg-white'
                }`}
              >
                {task.done && <Check size={12} className="text-white" strokeWidth={3} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold truncate transition-all duration-200 ${task.done ? 'line-through text-text-sub' : 'text-text-main'}`}>
                  {task.title}
                </p>
                <p className="text-xs text-text-sub mt-0.5">{task.time} · {task.category}</p>
              </div>
              <span className={`badge ${priorityColor[task.priority]}`}>
                {priorityLabel[task.priority]}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Health Summary */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.1s' }}>
        <div className="section-header">
          <h2 className="section-title">สุขภาพวันนี้</h2>
          <button className="section-action flex items-center gap-0.5">
            ดูเพิ่ม <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Steps */}
          <div className="stat-card">
            <div className="icon-box-sm bg-primary-light w-8 h-8 rounded-xl flex items-center justify-center mb-1">
              <Footprints size={16} className="text-primary" />
            </div>
            <p className="text-lg font-bold text-text-main"><AnimatedNumber value={health.steps} /></p>
            <p className="text-xs text-text-sub">ก้าว</p>
            <div className="progress-bar mt-2">
              <div className="progress-fill bg-primary" style={{ width: `${stepsPercent}%` }} />
            </div>
            <p className="text-xs text-text-sub mt-1">{stepsPercent}%</p>
          </div>

          {/* Water */}
          <div className="stat-card">
            <div className="icon-box-sm bg-blue-50 w-8 h-8 rounded-xl flex items-center justify-center mb-1">
              <Droplets size={16} className="text-blue-500" />
            </div>
            <p className="text-lg font-bold text-text-main">{health.water}/{health.waterGoal}</p>
            <p className="text-xs text-text-sub">แก้วน้ำ</p>
            <div className="progress-bar mt-2">
              <div className="progress-fill bg-blue-500" style={{ width: `${waterPercent}%` }} />
            </div>
            <p className="text-xs text-text-sub mt-1">{waterPercent}%</p>
          </div>

          {/* Sleep */}
          <div className="stat-card">
            <div className="icon-box-sm bg-purple-50 w-8 h-8 rounded-xl flex items-center justify-center mb-1">
              <Moon size={16} className="text-purple-500" />
            </div>
            <p className="text-lg font-bold text-text-main">{health.sleep}h</p>
            <p className="text-xs text-text-sub">การนอน</p>
            <div className="progress-bar mt-2">
              <div className="progress-fill bg-purple-500" style={{ width: `${sleepPercent}%` }} />
            </div>
            <p className="text-xs text-text-sub mt-1">{sleepPercent}%</p>
          </div>
        </div>

        {/* Calories */}
        <div className="flex items-center gap-3 mt-3 p-3 bg-orange-50 rounded-2xl">
          <div className="icon-box-sm bg-orange-100 w-8 h-8 rounded-xl flex items-center justify-center">
            <Flame size={16} className="text-orange-500" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <p className="text-sm font-semibold text-text-main">แคลอรี่</p>
              <p className="text-sm font-bold text-orange-500"><AnimatedNumber value={health.calories} />/{health.caloriesGoal} kcal</p>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-orange-400"
                style={{ width: `${(health.calories / health.caloriesGoal) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Finance Summary */}
      <div className="card animate-slide-up" style={{ animationDelay: '0.15s' }}>
        <div className="section-header">
          <h2 className="section-title">การเงินเดือนนี้</h2>
          <button className="section-action flex items-center gap-0.5">
            ดูเพิ่ม <ChevronRight size={14} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div className="p-3 bg-success-light rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp size={16} className="text-success" />
              <p className="text-xs font-semibold text-success">รายรับ</p>
            </div>
            <p className="text-xl font-bold text-text-main">
              ฿<AnimatedNumber value={finance.income} />
            </p>
          </div>
          <div className="p-3 bg-danger-light rounded-2xl">
            <div className="flex items-center gap-2 mb-1">
              <TrendingDown size={16} className="text-danger" />
              <p className="text-xs font-semibold text-danger">รายจ่าย</p>
            </div>
            <p className="text-xl font-bold text-text-main">
              ฿<AnimatedNumber value={finance.expense} />
            </p>
          </div>
        </div>

        <div className="p-3 bg-background rounded-2xl">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-semibold text-text-main">งบประมาณ</p>
            <p className={`text-sm font-bold ${budgetPercent > 80 ? 'text-danger' : 'text-success'}`}>
              {budgetPercent}%
            </p>
          </div>
          <div className="progress-bar">
            <div
              className={`progress-fill ${budgetPercent > 80 ? 'bg-danger' : budgetPercent > 60 ? 'bg-warning' : 'bg-success'}`}
              style={{ width: `${Math.min(budgetPercent, 100)}%` }}
            />
          </div>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs text-text-sub">ใช้ไป ฿{spent.toLocaleString()}</p>
            <p className="text-xs text-text-sub">เป้าหมาย ฿{budget.toLocaleString()}</p>
          </div>
        </div>
      </div>

      {/* Thermometer (Weather detail) */}
      <div className="flex gap-3 animate-slide-up" style={{ animationDelay: '0.2s' }}>
        <div className="flex-1 card text-center py-4">
          <div className="flex items-center justify-center mb-1">
            <Thermometer size={20} className="text-danger" />
          </div>
          <p className="text-2xl font-bold text-text-main">{sampleWeather.feelsLike}°</p>
          <p className="text-xs text-text-sub">รู้สึกเหมือน</p>
        </div>
        <div className="flex-1 card text-center py-4">
          <div className="flex items-center justify-center mb-1">
            <Droplets size={20} className="text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-text-main">{sampleWeather.humidity}%</p>
          <p className="text-xs text-text-sub">ความชื้น</p>
        </div>
        <div className="flex-1 card text-center py-4">
          <div className="flex items-center justify-center mb-1">
            <Wind size={20} className="text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-text-main">{sampleWeather.wind}</p>
          <p className="text-xs text-text-sub">km/h ลม</p>
        </div>
      </div>

      {/* AI Quick Action */}
      <div
        className="gradient-primary rounded-3xl p-5 shadow-float animate-slide-up relative overflow-hidden"
        style={{ animationDelay: '0.25s' }}
      >
        <div className="absolute top-0 right-0 w-28 h-28 bg-white/10 rounded-full -translate-y-6 translate-x-6" />
        <div className="relative flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-3xl flex items-center justify-center flex-shrink-0">
            <Sparkles size={26} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white font-bold text-base">AI Assistant</p>
            <p className="text-white/70 text-sm mt-0.5">มีอะไรให้ช่วยไหม?</p>
          </div>
          <button className="bg-white text-primary rounded-2xl px-4 py-2 text-sm font-bold shadow-soft active:scale-90 transition-transform flex-shrink-0">
            คุย
          </button>
        </div>
      </div>
    </div>
  )
}
