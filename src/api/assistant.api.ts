import api from './axios'
import type { AssistantRecommendationResponse, RawAssistantRecommendationResponse } from '../types'

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
