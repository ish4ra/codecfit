import type { UserSetup } from '../types'

const KEY = 'codecfit:setup:v1'

export function loadSetup(): UserSetup | null {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? (JSON.parse(raw) as UserSetup) : null
  } catch {
    return null
  }
}

export function saveSetup(setup: UserSetup): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(setup))
  } catch {
    // Local storage is a convenience only; CodecFit still works without it.
  }
}
