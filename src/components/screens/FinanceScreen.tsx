import { useState } from 'react'
import {
  TrendingUp, TrendingDown, Plus, ChevronRight,
  PiggyBank, ArrowUpRight, ArrowDownRight, Wallet
} from 'lucide-react'
import { sampleTransactions, monthlyBudget } from '../../data/sampleData'
import type { Transaction } from '../../types'
import { useRealtime } from '../../context/RealtimeContext'
import AnimatedNumber from '../AnimatedNumber'

const MONTHS_SHORT = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.']

const INCOME_BAR_DATA = [28000, 32000, 45000, 38000, 42000, 53500]
const EXPENSE_BAR_DATA = [18000, 22000, 25000, 19000, 21000, 18420]

function SavingsRing({ value, max }: { value: number; max: number }) {
  const size = 100
  const stroke = 10
  const radius = (size - stroke) / 2
  const circ = 2 * Math.PI * radius
  const pct = Math.min(value / max, 1)
  const offset = circ * (1 - pct)
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="#F3F4F6" strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={radius} fill="none"
        stroke="#22C55E" strokeWidth={stroke}
        strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%', transition: 'stroke-dashoffset 0.7s ease' }}
      />
    </svg>
  )
}

export default function FinanceScreen() {
  const { finance } = useRealtime()
  const [activeFilter, setActiveFilter] = useState<'all' | 'income' | 'expense'>('all')

  const savings = finance.income - finance.expense
  const savingsRate = Math.round((savings / finance.income) * 100)

  const filtered = sampleTransactions.filter(t => activeFilter === 'all' || t.type === activeFilter)

  const maxBar = Math.max(...INCOME_BAR_DATA, ...EXPENSE_BAR_DATA)

  return (
    <div className="screen-content animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <h1 className="text-xl font-bold text-text-main">การเงิน</h1>
        <button className="icon-box bg-primary text-white active:scale-90 transition-transform shadow-soft">
          <Plus size={18} />
        </button>
      </div>

      {/* Balance Hero */}
      <div className="gradient-primary rounded-3xl p-5 text-white shadow-float relative overflow-hidden">
        <div className="absolute top-0 right-0 w-36 h-36 bg-white/10 rounded-full -translate-y-10 translate-x-10" />
        <div className="absolute bottom-0 left-16 w-24 h-24 bg-white/5 rounded-full translate-y-10" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-1">
            <Wallet size={16} className="text-white/70" />
            <p className="text-white/70 text-sm font-medium">ยอดคงเหลือ</p>
          </div>
          <p className="text-4xl font-bold tracking-tight">
            ฿<AnimatedNumber value={savings} />
          </p>
          <p className="text-white/70 text-sm mt-1">มิถุนายน 2569</p>

          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white/15 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowUpRight size={14} className="text-green-300" />
                <span className="text-white/80 text-xs">รายรับ</span>
              </div>
              <p className="text-lg font-bold text-white">฿<AnimatedNumber value={finance.income} /></p>
            </div>
            <div className="bg-white/15 rounded-2xl p-3">
              <div className="flex items-center gap-1.5 mb-1">
                <ArrowDownRight size={14} className="text-red-300" />
                <span className="text-white/80 text-xs">รายจ่าย</span>
              </div>
              <p className="text-lg font-bold text-white">฿<AnimatedNumber value={finance.expense} /></p>
            </div>
          </div>
        </div>
      </div>

      {/* Savings Rate */}
      <div className="card flex items-center gap-4">
        <div className="relative flex-shrink-0">
          <SavingsRing value={savings} max={finance.income} />
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <PiggyBank size={18} className="text-success" />
            <p className="text-xs font-bold text-success mt-0.5">{savingsRate}%</p>
          </div>
        </div>
        <div className="flex-1">
          <h2 className="font-bold text-text-main">อัตราการออม</h2>
          <p className="text-sm text-text-sub mt-0.5">
            คุณออมได้ <span className="font-bold text-success">฿{savings.toLocaleString()}</span> เดือนนี้
          </p>
          <div className="mt-2 progress-bar">
            <div className="progress-fill bg-success" style={{ width: `${savingsRate}%` }} />
          </div>
          <p className="text-xs text-text-sub mt-1">เป้าหมาย 30% ของรายรับ</p>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="card">
        <div className="section-header">
          <h2 className="section-title">6 เดือนที่ผ่านมา</h2>
          <button className="section-action flex items-center gap-0.5">
            ดูเพิ่ม <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex items-end justify-between gap-1.5 mt-3">
          {INCOME_BAR_DATA.map((inc, i) => {
            const exp = EXPENSE_BAR_DATA[i] ?? 0
            const maxH = 64
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex gap-0.5 items-end" style={{ height: `${maxH}px` }}>
                  <div
                    className="flex-1 rounded-t-lg bg-success/30 transition-all duration-700"
                    style={{ height: `${(inc / maxBar) * maxH}px` }}
                  />
                  <div
                    className="flex-1 rounded-t-lg bg-danger/30 transition-all duration-700"
                    style={{ height: `${(exp / maxBar) * maxH}px` }}
                  />
                </div>
                <span className="text-xs text-text-sub">{MONTHS_SHORT[i + 6] ?? MONTHS_SHORT[i]}</span>
              </div>
            )
          })}
        </div>
        <div className="flex items-center gap-4 mt-3 justify-center">
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-success/50" />
            <span className="text-xs text-text-sub">รายรับ</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm bg-danger/50" />
            <span className="text-xs text-text-sub">รายจ่าย</span>
          </div>
        </div>
      </div>

      {/* Budget Categories */}
      <div className="card">
        <div className="section-header">
          <h2 className="section-title">งบประมาณหมวดหมู่</h2>
        </div>
        <div className="space-y-3">
          {monthlyBudget.categories.map(cat => {
            const pct = Math.round((cat.amount / cat.budget) * 100)
            return (
              <div key={cat.name}>
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                    <p className="text-sm font-semibold text-text-main">{cat.name}</p>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-bold ${pct > 90 ? 'text-danger' : pct > 70 ? 'text-warning' : 'text-text-main'}`}>
                      ฿{cat.amount.toLocaleString()}
                    </span>
                    <span className="text-xs text-text-sub"> / ฿{cat.budget.toLocaleString()}</span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div
                    className="progress-fill transition-all duration-700"
                    style={{
                      width: `${Math.min(pct, 100)}%`,
                      backgroundColor: pct > 90 ? '#EF4444' : pct > 70 ? '#F59E0B' : cat.color,
                    }}
                  />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Transactions */}
      <div className="card">
        <div className="section-header">
          <h2 className="section-title">รายการล่าสุด</h2>
          <button className="section-action flex items-center gap-0.5">
            ดูทั้งหมด <ChevronRight size={14} />
          </button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 mb-4">
          {(['all', 'income', 'expense'] as const).map(f => (
            <button
              key={f}
              onClick={() => setActiveFilter(f)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all duration-200 active:scale-95 ${
                activeFilter === f ? 'bg-primary text-white shadow-soft' : 'bg-background text-text-sub'
              }`}
            >
              {f === 'all' ? 'ทั้งหมด' : f === 'income' ? 'รายรับ' : 'รายจ่าย'}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          {filtered.map((tx: Transaction) => (
            <div key={tx.id} className="flex items-center gap-3 p-3 bg-background rounded-2xl active:scale-98 transition-transform">
              <div className="w-10 h-10 rounded-2xl bg-white shadow-soft flex items-center justify-center text-xl flex-shrink-0">
                {tx.icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-main truncate">{tx.title}</p>
                <p className="text-xs text-text-sub">{tx.category} · {tx.date}</p>
              </div>
              <div className={`text-sm font-bold flex items-center gap-0.5 ${tx.type === 'income' ? 'text-success' : 'text-danger'}`}>
                {tx.type === 'income' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                {tx.type === 'income' ? '+' : '-'}฿{tx.amount.toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
