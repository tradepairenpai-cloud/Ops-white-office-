import { useState } from 'react'
import StatusBar from './components/StatusBar'
import BottomNav from './components/BottomNav'
import HomeScreen from './components/screens/HomeScreen'
import ScheduleScreen from './components/screens/ScheduleScreen'
import HealthScreen from './components/screens/HealthScreen'
import FinanceScreen from './components/screens/FinanceScreen'
import AIAssistantScreen from './components/screens/AIAssistantScreen'
import { useDateTime } from './hooks/useDateTime'
import type { TabId } from './types'

const SCREEN_TITLES: Record<TabId, string> = {
  home: 'Daily Life OS',
  schedule: 'ตารางเวลา',
  health: 'สุขภาพ',
  finance: 'การเงิน',
  ai: 'AI Assistant',
}

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('home')
  const { timeString } = useDateTime()

  const handleTabChange = (tab: TabId) => {
    setActiveTab(tab)
  }

  return (
    <div className="phone-frame">
      {/* Status Bar */}
      <StatusBar timeString={timeString} />

      {/* Screen label for non-home tabs */}
      {activeTab !== 'home' && activeTab !== 'ai' && (
        <div className="px-4 pt-1 pb-0">
          <h1 className="text-xl font-bold text-text-main sr-only">
            {SCREEN_TITLES[activeTab]}
          </h1>
        </div>
      )}

      {/* Main content */}
      <main className="relative">
        <div
          key={activeTab}
          className="animate-slide-up"
          style={{ animationDuration: '0.3s' }}
        >
          {activeTab === 'home' && <HomeScreen />}
          {activeTab === 'schedule' && <ScheduleScreen />}
          {activeTab === 'health' && <HealthScreen />}
          {activeTab === 'finance' && <FinanceScreen />}
          {activeTab === 'ai' && <AIAssistantScreen />}
        </div>
      </main>

      {/* Bottom Navigation */}
      <BottomNav active={activeTab} onChange={handleTabChange} />
    </div>
  )
}
