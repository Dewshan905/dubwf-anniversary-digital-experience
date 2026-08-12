export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4010'

export type ApiResponse<T> = {
  success: boolean
  message?: string
  data?: T
  issues?: unknown
}

export async function apiFetch<T>(path: string, init?: RequestInit): Promise<ApiResponse<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers || {}),
    },
    ...init,
  })

  const json = (await response.json()) as ApiResponse<T>
  if (!response.ok) {
    throw new Error(json.message || 'Request failed')
  }
  return json
}
