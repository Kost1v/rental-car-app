import { isAxiosError } from 'axios'
import { type FormEvent, useState } from 'react'
import toast from 'react-hot-toast'
import { getAssistantRecommendations } from '../api/assistant.api'
import type { Car } from '../api/cars.api'
import CarCard from '../components/CarCard'

interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  cars?: Car[]
}

const quickPrompts = [
  'Економне авто для міста',
  'Позашляховик для подорожі',
  'Комфортне авто для сімейної поїздки',
]

function Assistant() {
  const [message, setMessage] = useState('')
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const sendMessage = async (text: string) => {
    const trimmedText = text.trim()

    if (!trimmedText || isLoading) {
      return
    }

    setMessages((currentMessages) => [
      ...currentMessages,
      { role: 'user', text: trimmedText },
    ])
    setMessage('')
    setIsLoading(true)

    try {
      const response = await getAssistantRecommendations(trimmedText)
      setMessages((currentMessages) => [
        ...currentMessages,
        {
          role: 'assistant',
          text: response.text,
          cars: response.cars,
        },
      ])
    } catch (error) {
      if (
        isAxiosError(error) &&
        [503, 502, 504, 429].includes(error.response?.status ?? 0)
      ) {
        toast.error('Асистент тимчасово недоступний. Спробуйте пізніше.')
      } else {
        toast.error('Не вдалося отримати рекомендації асистента.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    void sendMessage(message)
  }

  return (
    <main className="min-h-screen bg-gray-100 px-4 py-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="mb-6 text-3xl font-bold text-gray-900">
          AI-асистент
        </h1>

        <div className="rounded-lg bg-white shadow-md">
          <div className="h-[480px] overflow-y-auto p-4 sm:p-6">
            {messages.length === 0 && (
              <p className="py-8 text-center text-gray-500">
                Опишіть, який автомобіль вам потрібен.
              </p>
            )}

            {messages.map((chatMessage, index) => (
              <div
                className={`mb-4 ${
                  chatMessage.role === 'user' ? 'text-right' : 'text-left'
                }`}
                key={`${chatMessage.role}-${index}`}
              >
                <div
                  className={`inline-block max-w-[85%] rounded-lg px-4 py-3 text-left ${
                    chatMessage.role === 'user'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  {chatMessage.text}
                </div>

                {chatMessage.role === 'assistant' &&
                  chatMessage.cars &&
                  chatMessage.cars.length > 0 && (
                    <div className="mt-4 grid grid-cols-1 gap-6 text-left md:grid-cols-2">
                      {chatMessage.cars.map((car) => (
                        <CarCard car={car} key={car.id} />
                      ))}
                    </div>
                  )}
              </div>
            ))}

            {isLoading && (
              <p className="text-gray-600">Асистент підбирає авто...</p>
            )}
          </div>

          <div className="border-t p-4">
            <div className="mb-4 flex flex-wrap gap-2">
              {quickPrompts.map((prompt) => (
                <button
                  className="rounded-full border border-blue-300 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 disabled:opacity-50"
                  disabled={isLoading}
                  key={prompt}
                  onClick={() => void sendMessage(prompt)}
                  type="button"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <form className="flex gap-3" onSubmit={handleSubmit}>
              <input
                className="min-w-0 flex-1 rounded border p-3"
                disabled={isLoading}
                onChange={(event) => setMessage(event.target.value)}
                placeholder="Опишіть, який автомобіль вам потрібен"
                value={message}
              />
              <button
                className="rounded bg-blue-600 px-5 py-3 text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading || message.trim().length === 0}
                type="submit"
              >
                Надіслати
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  )
}

export default Assistant
