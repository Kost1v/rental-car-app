import type { Car } from './car'

export interface AssistantRecommendationResponse {
  text: string
  cars: Car[]
}

export interface ChatMessage {
  role: 'user' | 'assistant'
  text: string
  cars?: Car[]
}

export interface RawAssistantRecommendationResponse {
  text?: string
  response?: string
  answer?: string
  message?: string
  cars?: Car[]
  recommendations?: Car[]
  items?: Car[]
}
