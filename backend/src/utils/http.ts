export function ok<T>(data: T, message?: string) {
  return { success: true, message, data }
}

export function fail(message: string, issues?: unknown) {
  return { success: false, message, issues }
}
