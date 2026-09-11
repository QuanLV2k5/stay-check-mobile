import { Network } from '@capacitor/network'

import { syncPendingSurveys } from './surveyService'

let isSyncing = false

async function runSync() {
  if (isSyncing) return

  isSyncing = true

  try {
    const result = await syncPendingSurveys()

    console.log(
      '[StayCheck Sync]',
      result.message,
      {
        syncedCount: result.syncedCount,
        failedCount: result.failedCount,
      },
    )
  } catch (error) {
    console.error(
      '[StayCheck Sync] Lỗi đồng bộ:',
      error,
    )
  } finally {
    isSyncing = false
  }
}

export async function setupNetworkSync() {
  const syncNow = () => {
    window.setTimeout(() => {
      runSync()
    }, 1000)
  }

  window.addEventListener('online', syncNow)
  window.addEventListener('focus', syncNow)

  const listener = await Network.addListener(
    'networkStatusChange',
    (status) => {
      if (status.connected) {
        syncNow()
      }
    },
  )

  const currentStatus = await Network.getStatus()

  if (currentStatus.connected) {
    syncNow()
  }

  return () => {
    window.removeEventListener('online', syncNow)
    window.removeEventListener('focus', syncNow)
    listener.remove()
  }
}