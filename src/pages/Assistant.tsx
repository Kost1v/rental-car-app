import { isAxiosError } from 'axios'
import { type FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { Bot, Send, Sparkles } from 'lucide-react'
import { getAssistantRecommendations } from '../api/assistant.api'
import ChatMessage from '../components/ChatMessage'
import type { ChatMessage as ChatMessageType } from '../types'

const quickPrompts = [
  'Економне авто для міста',
  'Позашляховик для подорожі',
  'Комфортне авто для сімейної поїздки',
]

function Assistant() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessageType[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim()
    if (!trimmedText || isLoading) return
    setMessages((current) => [...current, { role: 'user', text: trimmedText }])
    setMessage('')
    setIsLoading(true)
    try {
      const response = await getAssistantRecommendations(trimmedText)
      setMessages((current) => [...current, { role: 'assistant', text: response.text, cars: response.cars }])
    } catch (error) {
      if (isAxiosError(error) && [503, 502, 504, 429].includes(error.response?.status ?? 0)) toast.error('Асистент тимчасово недоступний. Спробуйте пізніше.')
      else toast.error('Не вдалося отримати рекомендації асистента.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(message)
  }

  return (
    <main className="min-h-screen px-4 py-8 sm:py-10">
      <div className="mx-auto max-w-5xl">
        <div className="overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl shadow-slate-200/40">
          <header className="flex items-center gap-3 border-b border-slate-100 px-5 py-4 sm:px-6">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-indigo-600 text-white shadow-md shadow-indigo-200"><Sparkles className="h-5 w-5" /></span>
            <div><h1 className="font-extrabold text-slate-900">AI-асистент AutoRent</h1><p className="text-xs text-slate-500">Допоможе підібрати авто під вашу подорож</p></div>
          </header>
          <div className="h-130 overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 && (
              <div className="mx-auto max-w-md py-16 text-center">
                <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><Bot className="h-7 w-7" /></span>
                <h2 className="mt-5 text-xl font-extrabold text-slate-900">Куди плануєте поїздку?</h2>
                <p className="mt-2 text-sm text-slate-500">Опишіть місто, бюджет або побажання до автомобіля.</p>
              </div>
            )}
            {messages.map((chatMessage, index) => <ChatMessage message={chatMessage} index={index} key={`${chatMessage.role}-${index}`} />)}
            {isLoading && (
              <div className="flex items-center gap-3 text-sm text-slate-500">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"><Bot className="h-4 w-4" /></span>
                <span>Асистент підбирає авто</span>
                <span className="flex gap-1">{[0, 1, 2].map((dot) => <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" key={dot} style={{ animationDelay: `${dot * 120}ms` }} />)}</span>
              </div>
            )}
          </div>
          <div className="border-t border-slate-100 bg-slate-50/60 p-4 sm:p-5">
            <div className="mb-4 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-600 shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:text-indigo-600 hover:shadow-md disabled:opacity-50" disabled={isLoading} key={prompt} onClick={() => void sendMessage(prompt)} type="button">{prompt}</button>)}
            </div>
            <form className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-lg shadow-slate-200/50" onSubmit={handleSubmit}>
              <input className="min-w-0 flex-1 border-0 bg-transparent px-3 py-2 outline-none placeholder:text-slate-400" disabled={isLoading} onChange={(event) => setMessage(event.target.value)} placeholder="Опишіть, який автомобіль вам потрібен" value={message} />
              <button className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50" disabled={isLoading || message.trim().length === 0} type="submit"><Send className="h-4 w-4" /></button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Assistant
