import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Sparkles, RefreshCw, ChevronRight } from 'lucide-react'
import type { ChatMessage, LiveFinance, LiveHealth } from '../../types'
import { useRealtime } from '../../context/RealtimeContext'
import TypewriterText from '../TypewriterText'

const QUICK_PROMPTS = [
  'สรุปงานวันนี้',
  'วางแผนสุขภาพ',
  'ตรวจสอบการเงิน',
  'แนะนำมื้ออาหาร',
  'วิเคราะห์การนอน',
  'สรุปสัปดาห์',
]

const nowStamp = () =>
  new Date().toLocaleTimeString('th', { hour: '2-digit', minute: '2-digit' })

// Builds an answer from the user's *live* metrics so the assistant behaves like
// an agent watching real-time data rather than returning canned text.
function buildResponse(text: string, h: LiveHealth, f: LiveFinance): string {
  const stepsLeft = Math.max(0, h.stepsGoal - h.steps)
  const calLeft = Math.max(0, h.caloriesGoal - h.calories)
  const savings = f.income - f.expense
  const savingsRate = Math.round((savings / f.income) * 100)

  switch (text) {
    case 'สรุปงานวันนี้':
      return 'วันนี้คุณมีงานทั้งหมด 6 รายการ เสร็จแล้ว 2 รายการ\n\nงานที่ยังค้างอยู่:\n• 09:00 ประชุมทีมพัฒนา ⚡ด่วน\n• 12:00 ส่งรายงานรายเดือน ⚡ด่วน\n• 19:00 โทรหาคุณแม่\n\nแนะนำให้เริ่มจากงานด่วนก่อนเลยครับ 💪'
    case 'วางแผนสุขภาพ':
      return `ข้อมูลสุขภาพเรียลไทม์ของคุณตอนนี้:\n👣 ก้าว ${h.steps.toLocaleString()}/${h.stepsGoal.toLocaleString()} (ขาดอีก ${stepsLeft.toLocaleString()})\n💧 น้ำ ${h.water}/${h.waterGoal} แก้ว\n❤️ หัวใจ ${h.heartRate} bpm\n\nแนะนำ: ${stepsLeft > 0 ? `เดินเพิ่มอีก ${stepsLeft.toLocaleString()} ก้าว` : 'เดินครบเป้าแล้ว เยี่ยม!'} และ${h.water < h.waterGoal ? `ดื่มน้ำอีก ${h.waterGoal - h.water} แก้ว` : 'ดื่มน้ำครบแล้ว'} ครับ 🌙`
    case 'ตรวจสอบการเงิน':
      return `สรุปการเงินแบบเรียลไทม์:\n💰 รายรับ ฿${f.income.toLocaleString()}\n💸 รายจ่าย ฿${f.expense.toLocaleString()}\n💚 คงเหลือ ฿${savings.toLocaleString()} (ออม ${savingsRate}%)\n\n${savingsRate >= 30 ? 'อัตราการออมเกินเป้า 30% แล้ว เยี่ยมมากครับ 🎉' : 'ลองคุมรายจ่ายเพิ่มเพื่อให้ถึงเป้าออม 30% ครับ 🍳'}`
    case 'แนะนำมื้ออาหาร':
      return `ตอนนี้ทานไปแล้ว ${h.calories.toLocaleString()} kcal จากเป้า ${h.caloriesGoal.toLocaleString()} kcal\nเหลืออีก ~${calLeft.toLocaleString()} kcal\n\nมื้อถัดไปแนะนำ:\n🥗 สลัดไก่ย่าง (~300 kcal)\n🍚 ข้าวกล้อง\n🥦 ผักนึ่ง\n\nเลี่ยงของทอดเพื่อการนอนที่ดีครับ 😊`
    case 'วิเคราะห์การนอน':
      return `คืนที่ผ่านมาคุณนอน ${h.sleep} ชม. จากเป้า ${h.sleepGoal} ชม.\n${h.sleep >= h.sleepGoal ? 'นอนได้ตามเป้า ร่างกายฟื้นตัวดีครับ 🌙' : `ขาดอีก ${(h.sleepGoal - h.sleep).toFixed(1)} ชม. คืนนี้ลองเข้านอนเร็วขึ้นนะครับ 😴`}`
    case 'สรุปสัปดาห์':
      return `ภาพรวมตอนนี้:\n👣 ${h.steps.toLocaleString()} ก้าว\n❤️ หัวใจ ${h.heartRate} bpm\n💰 ออมได้ ${savingsRate}% ของรายรับ\n\nทำได้ดีมากครับ รักษาจังหวะนี้ไว้ 💪`
    default:
      return `ผมกำลังดูข้อมูลเรียลไทม์ของคุณอยู่ครับ 🤖\nตอนนี้: ${h.steps.toLocaleString()} ก้าว · ${h.heartRate} bpm · คงเหลือ ฿${savings.toLocaleString()}\n\n"${text}" — ผมจะช่วยวิเคราะห์ให้นะครับ`
  }
}

function greeting(h: LiveHealth, f: LiveFinance): string {
  return `สวัสดีครับ 👋 ผมเป็น AI Agent ที่คอยติดตามข้อมูลของคุณแบบเรียลไทม์\n\nสถานะตอนนี้:\n👣 ${h.steps.toLocaleString()} ก้าว · ❤️ ${h.heartRate} bpm\n💰 คงเหลือ ฿${(f.income - f.expense).toLocaleString()}\n\nมีอะไรให้ช่วยวิเคราะห์ไหมครับ?`
}

function TypingIndicator() {
  return (
    <div className="flex items-start gap-3">
      <div className="w-8 h-8 gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
        <Sparkles size={14} className="text-white" />
      </div>
      <div className="chat-bubble-ai">
        <div className="flex items-center gap-1.5 py-1">
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-gray-300 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  )
}

export default function AIAssistantScreen() {
  const { health, finance, agent } = useRealtime()
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    { id: 'agent-hello', role: 'ai', content: greeting(health, finance), timestamp: nowStamp() },
  ])
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  // Proactive agent insight shortly after opening the chat — pushed once.
  useEffect(() => {
    const t = setTimeout(() => {
      setMessages(prev => [
        ...prev,
        { id: 'agent-proactive', role: 'ai', content: `💡 ข้อสังเกตเรียลไทม์: ${agent.message}`, timestamp: nowStamp() },
      ])
    }, 2500)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const lastAiId = [...messages].reverse().find(m => m.role === 'ai')?.id

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: nowStamp(),
    }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setIsTyping(true)

    const responseText = buildResponse(text.trim(), health, finance)

    setTimeout(() => {
      setIsTyping(false)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: responseText,
        timestamp: nowStamp(),
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1200)
  }

  const clearChat = () => {
    setMessages([{
      id: 'reset',
      role: 'ai',
      content: greeting(health, finance),
      timestamp: nowStamp(),
    }])
  }

  return (
    <div className="flex flex-col animate-fade-in" style={{ height: 'calc(100vh - 130px)' }}>
      {/* Header */}
      <div className="px-4 pt-4 pb-3 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 gradient-primary rounded-2xl flex items-center justify-center shadow-soft">
              <Sparkles size={18} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-text-main">Daily AI Agent</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-success rounded-full live-dot" />
                <p className="text-xs text-text-sub">
                  {agent.status === 'thinking' ? 'กำลังวิเคราะห์…' : 'ออนไลน์ · เรียลไทม์'}
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={clearChat}
            className="w-9 h-9 bg-background rounded-xl flex items-center justify-center active:scale-90 transition-transform"
          >
            <RefreshCw size={16} className="text-text-sub" />
          </button>
        </div>

        {/* Capabilities */}
        <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
          {['วิเคราะห์ข้อมูล', 'วางแผนชีวิต', 'แนะนำสุขภาพ', 'ตรวจการเงิน'].map(cap => (
            <span key={cap} className="badge bg-primary-light text-primary whitespace-nowrap text-xs font-semibold px-3 py-1.5 rounded-xl">
              {cap}
            </span>
          ))}
        </div>
      </div>

      {/* Quick prompts */}
      <div className="px-4 flex-shrink-0 mb-2">
        <p className="text-xs font-semibold text-text-sub mb-2">คำถามด่วน</p>
        <div className="grid grid-cols-3 gap-2">
          {QUICK_PROMPTS.map(prompt => (
            <button
              key={prompt}
              onClick={() => sendMessage(prompt)}
              className="p-2.5 bg-white rounded-2xl shadow-soft text-xs font-semibold text-text-main text-center active:scale-95 transition-transform border border-gray-50 flex items-center justify-center gap-1"
            >
              <ChevronRight size={10} className="text-primary flex-shrink-0" />
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Chat area */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-hide"
      >
        {messages.map(msg => (
          <div key={msg.id} className={`flex items-start gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft mt-0.5">
                <Sparkles size={14} className="text-white" />
              </div>
            )}
            <div className={`max-w-[75%] ${msg.role === 'user' ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
              <div className={msg.role === 'ai' ? 'chat-bubble-ai' : 'chat-bubble-user'}>
                <p className="text-sm leading-relaxed whitespace-pre-line">
                  {msg.role === 'ai' && msg.id === lastAiId
                    ? <TypewriterText text={msg.content} />
                    : msg.content}
                </p>
              </div>
              <p className={`text-xs text-text-sub px-1 ${msg.role === 'user' ? 'text-right' : ''}`}>
                {msg.timestamp}
              </p>
            </div>
          </div>
        ))}

        {isTyping && <TypingIndicator />}
      </div>

      {/* Input bar */}
      <div className="px-4 pb-2 pt-2 flex-shrink-0">
        <div className="flex items-center gap-2 bg-white rounded-2xl shadow-card px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            placeholder="พิมพ์ข้อความ..."
            className="flex-1 text-sm bg-transparent outline-none text-text-main placeholder:text-gray-300 font-medium py-1"
          />
          <button className="w-9 h-9 bg-background rounded-xl flex items-center justify-center active:scale-90 transition-transform flex-shrink-0">
            <Mic size={16} className="text-text-sub" />
          </button>
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isTyping}
            className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-90 ${
              input.trim() && !isTyping
                ? 'bg-primary shadow-soft'
                : 'bg-background'
            }`}
          >
            <Send
              size={16}
              className={input.trim() && !isTyping ? 'text-white' : 'text-gray-300'}
            />
          </button>
        </div>
      </div>
    </div>
  )
}
