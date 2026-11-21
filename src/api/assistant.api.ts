import api from './axios'
import type { Car } from './cars.api'

export interface AssistantRecommendationResponse {
  text: string
  cars: Car[]
}

interface RawAssistantRecommendationResponse {
  text?: string
  response?: string
  answer?: string
  message?: string
  cars?: Car[]
  recommendations?: Car[]
  items?: Car[]
}

export const getAssistantRecommendations = async (
  message: string,
): Promise<AssistantRecommendationResponse> => {
  const response = await api.post<RawAssistantRecommendationResponse>(
    '/assistant/recommendations',
    { message },
  )

  return {
    text:
      response.data.text ??
      response.data.response ??
      response.data.answer ??
      response.data.message ??
      '',
    cars:
      response.data.cars ??
      response.data.recommendations ??
      response.data.items ??
      [],
  }
}
