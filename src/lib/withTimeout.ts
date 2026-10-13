/**
 * Menggagalkan janji yang terlalu lama (mis. Firestore menunggu sinyal tanpa batas).
 * `ms` dalam milidetik. Janji asli tidak dibatalkan, hanya tidak ditunggu lagi.
 */
export function withTimeout<T>(promise: Promise<T>, ms: number, error: Error): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => {
      reject(error)
    }, ms)
  })
  return Promise.race([promise, timeout]).finally(() => {
    clearTimeout(timer)
  })
}
