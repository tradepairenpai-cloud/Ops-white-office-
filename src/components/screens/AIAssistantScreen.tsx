import { useState, useRef, useEffect } from 'react'
import { Send, Mic, Sparkles, RefreshCw, ChevronRight } from 'lucide-react'
import { sampleMessages } from '../../data/sampleData'
import type { ChatMessage } from '../../types'

const QUICK_PROMPTS = [
  'สรุปงานวันนี้',
  'วางแผนสุขภาพ',
  'ตรวจสอบการเงิน',
  'แนะนำมื้ออาหาร',
  'วิเคราะห์การนอน',
  'สรุปสัปดาห์',
]

const AI_RESPONSES: Record<string, string> = {
  'สรุปงานวันนี้': 'วันนี้คุณมีงานทั้งหมด 6 รายการ เสร็จแล้ว 2 รายการ (จ่ายค่าน้ำค่าไฟ, ออกกำลังกาย) \n\nงานที่ยังค้างอยู่:\n• 09:00 ประชุมทีมพัฒนา ⚡ด่วน\n• 12:00 ส่งรายงานรายเดือน ⚡ด่วน\n• 19:00 โทรหาคุณแม่\n• 21:00 อ่านหนังสือ\n\nแนะนำให้เริ่มจากงานด่วนก่อนเลยครับ 💪',
  'วางแผนสุขภาพ': 'จากข้อมูลสุขภาพของคุณวันนี้:\n✅ นอนหลับ 7.5 ชั่วโมง (ดี)\n⚠️ ก้าว 6,842 จาก 10,000 (ขาดอีก 3,158)\n💧 ดื่มน้ำ 5/8 แก้ว\n\nแนะนำ:\n• เดินเพิ่มช่วงเย็นหลังงาน ~30 นาที\n• ดื่มน้ำอีก 3 แก้วก่อนเที่ยงคืน\n• พยายามเข้านอนก่อน 23:00 ครับ 🌙',
  'ตรวจสอบการเงิน': 'สรุปการเงินเดือนมิถุนายน:\n💰 รายรับ: ฿53,500\n💸 รายจ่าย: ฿18,420\n💚 คงเหลือ: ฿35,080 (ออมได้ 65.6%)\n\nหมวดที่ใช้สูงสุด: อาหาร (฿7,200)\nงบประมาณยังไม่เกินเป้าหมาย 🎉\n\nถ้าต้องการประหยัดเพิ่ม ลองทำอาหารกินเองสัปดาห์ละ 3 มื้อครับ 🍳',
  'แนะนำมื้ออาหาร': 'จากแคลอรี่ที่ทานไปแล้ว 1,640 kcal\nเป้าหมาย: 2,000 kcal\nเหลืออีก: ~360 kcal\n\nมื้อเย็นแนะนำ:\n🥗 สลัดไก่ย่าง (~300 kcal)\n🍚 ข้าวกล้องหรือข้าวไรซ์เบอร์รี่\n🥦 ผักนึ่ง\n\nหลีกเลี่ยงของทอดและอาหารหนักมื้อเย็นเพื่อคุณภาพการนอนที่ดีครับ 😊',
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
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages)
  const [input, setInput] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isTyping])

  const sendMessage = (text: string) => {
    if (!text.trim()) return
    const newMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: text.trim(),
      timestamp: new Date().toLocaleTimeString('th', { hour: '2-digit', minute: '2-digit' }),
    }
    setMessages(prev => [...prev, newMsg])
    setInput('')
    setIsTyping(true)

    const responseText =
      AI_RESPONSES[text.trim()] ??
      `ขอบคุณสำหรับคำถามครับ! ฉันกำลังวิเคราะห์ข้อมูลของคุณ...\n\n"${text.trim()}" เป็นเรื่องที่น่าสนใจมาก ฉันจะช่วยคุณจัดการเรื่องนี้ให้ดีที่สุดครับ 🤖`

    setTimeout(() => {
      setIsTyping(false)
      const aiMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: responseText,
        timestamp: new Date().toLocaleTimeString('th', { hour: '2-digit', minute: '2-digit' }),
      }
      setMessages(prev => [...prev, aiMsg])
    }, 1500)
  }

  const clearChat = () => {
    setMessages([{
      id: 'reset',
      role: 'ai',
      content: 'สวัสดีครับ! เริ่มต้นใหม่แล้ว ฉันสามารถช่วยอะไรคุณได้บ้าง? 😊',
      timestamp: new Date().toLocaleTimeString('th', { hour: '2-digit', minute: '2-digit' }),
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
              <h1 className="text-base font-bold text-text-main">Daily AI</h1>
              <div className="flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse-soft" />
                <p className="text-xs text-text-sub">ออนไลน์</p>
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
                <p className="text-sm leading-relaxed whitespace-pre-line">{msg.content}</p>
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
