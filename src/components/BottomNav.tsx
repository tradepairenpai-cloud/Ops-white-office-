import { Home, Calendar, Heart, Wallet, Bot } from 'lucide-react'
import type { TabId } from '../types'

interface NavItem {
  id: TabId
  label: string
  icon: typeof Home
}

const NAV_ITEMS: NavItem[] = [
  { id: 'home', label: 'หน้าแรก', icon: Home },
  { id: 'schedule', label: 'ตาราง', icon: Calendar },
  { id: 'health', label: 'สุขภาพ', icon: Heart },
  { id: 'finance', label: 'การเงิน', icon: Wallet },
  { id: 'ai', label: 'AI', icon: Bot },
]

interface BottomNavProps {
  active: TabId
  onChange: (tab: TabId) => void
}

export default function BottomNav({ active, onChange }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] z-50">
      <div className="glass border-t border-white/60 shadow-nav px-2 pb-5 pt-2">
        <div className="flex items-end justify-around">
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const isActive = active === id
            return (
              <button
                key={id}
                onClick={() => onChange(id)}
                className="flex flex-col items-center gap-1 min-w-[56px] py-1 transition-all duration-200 active:scale-90"
              >
                <div
                  className={`relative flex items-center justify-center transition-all duration-300 ${
                    isActive
                      ? 'w-12 h-12 bg-primary rounded-2xl shadow-float -translate-y-2'
                      : 'w-10 h-10'
                  }`}
                >
                  <Icon
                    size={isActive ? 22 : 20}
                    className={`transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-gray-400'
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                  {isActive && (
                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                  )}
                </div>
                <span
                  className={`text-xs transition-all duration-300 ${
                    isActive ? 'text-primary font-bold' : 'text-gray-400 font-medium'
                  }`}
                >
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
