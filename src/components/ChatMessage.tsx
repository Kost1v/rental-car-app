import { Bot, UserRound } from 'lucide-react'
import type { ChatMessage as ChatMessageType } from '../types'
import CarCard from './CarCard'

function ChatMessage({ message, index }: { message: ChatMessageType; index: number }) {
  return (
    <div className={`mb-4 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
      <div className={`mb-2 flex items-center gap-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
        {message.role === 'assistant' && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100 text-indigo-600"><Bot className="h-4 w-4" /></span>}
        {message.role === 'user' && <span className="flex h-8 w-8 items-center justify-center rounded-full bg-slate-900 text-white"><UserRound className="h-4 w-4" /></span>}
      </div>
      <div className={`inline-block max-w-[85%] rounded-2xl px-4 py-3 text-left shadow-sm ${message.role === 'user' ? 'rounded-br-md bg-slate-900 text-white' : 'rounded-bl-md border border-slate-100 bg-slate-50 text-slate-900'}`}>{message.text}</div>
      {message.role === 'assistant' && message.cars && message.cars.length > 0 && (
        <div className="mt-4 grid grid-cols-1 gap-6 text-left md:grid-cols-2">
          {message.cars.map((car) => <CarCard car={car} key={`${car.id}-${index}`} />)}
        </div>
      )}
    </div>
  )
}

export default ChatMessage
