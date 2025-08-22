import { useCallback, useSyncExternalStore } from 'react'

function getItem<T>(key: string, initialValue: T): T {
  if (typeof window === 'undefined') return initialValue
  try {
    const raw = window.localStorage.getItem(key)
    return raw == null ? initialValue : (JSON.parse(raw) as T)
  } catch (e) {
    console.warn(`Error reading localStorage key "${key}":`, e)
    return initialValue
  }
}

function setItem<T>(key: string, value: T) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    // Notify subscribers on this tab as well
    window.dispatchEvent(
      new StorageEvent('storage', {
        key,
        newValue: JSON.stringify(value),
        storageArea: window.localStorage,
      }),
    )
  } catch (e) {
    console.warn(`Error setting localStorage key "${key}":`, e)
  }
}

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((val: T) => T)) => void] {
  // Subscribe to cross-tab and same-tab updates via the 'storage' event
  const subscribe = (onStoreChange: () => void) => {
    if (typeof window === 'undefined') return () => {}
    const handler = (e: StorageEvent) => {
      if (e.key === key) onStoreChange()
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }

  // Read current snapshot (client) and server snapshot (SSR)
  const getSnapshot = () => getItem<T>(key, initialValue)
  const getServerSnapshot = () => initialValue

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  const setValue = useCallback(
    (v: T | ((val: T) => T)) => {
      const next = v instanceof Function ? v(value) : v
      if (typeof window !== 'undefined') setItem(key, next)
    },
    [key, value],
  )

  return [value, setValue]
}
