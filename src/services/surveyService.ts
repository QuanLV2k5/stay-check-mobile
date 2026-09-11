import { Network } from '@capacitor/network'

import { stayCheckDb, type QueuedSurvey } from '../db/stayCheckDb'

const GOOGLE_SCRIPT_URL =
  import.meta.env.VITE_GOOGLE_SCRIPT_URL

type SubmitSurveyResult = {
  queued: boolean
  message: string
}

type SyncResult = {
  syncedCount: number
  failedCount: number
  message: string
}

function createLocalId() {
  if (
    typeof crypto !== 'undefined' &&
    crypto.randomUUID
  ) {
    return `LOCAL-${crypto.randomUUID()}`
  }

  return `LOCAL-${Math.random().toString(36).slice(2)}`
}

function getCurrentIsoTime() {
  return new Date().toISOString()
}

export async function isDeviceOnline() {
  try {
    const status = await Network.getStatus()
    return status.connected
  } catch {
    return navigator.onLine
  }
}

async function sendSurveyToGoogleSheets(
  payload: Record<string, unknown>,
) {
  if (!GOOGLE_SCRIPT_URL) {
    throw new Error(
      'Chưa cấu hình VITE_GOOGLE_SCRIPT_URL.',
    )
  }

  await fetch(GOOGLE_SCRIPT_URL, {
    method: 'POST',
    mode: 'no-cors',
    headers: {
      'Content-Type': 'text/plain;charset=utf-8',
    },
    body: JSON.stringify(payload),
  })
}

export async function saveSurveyToQueue(
  payload: Record<string, unknown>,
) {
  const now = getCurrentIsoTime()

  const queuedSurvey: QueuedSurvey = {
    localId: createLocalId(),
    payload,
    status: 'pending',
    retries: 0,
    createdAt: now,
    updatedAt: now,
  }

  await stayCheckDb.surveyQueue.add(queuedSurvey)

  return queuedSurvey
}

export async function submitSurvey(
  payload: Record<string, unknown>,
): Promise<SubmitSurveyResult> {
  const online = await isDeviceOnline()

  if (!online) {
    await saveSurveyToQueue(payload)

    return {
      queued: true,
      message:
        'Thiết bị đang offline. Khảo sát đã được lưu tạm và sẽ tự đồng bộ khi có mạng.',
    }
  }

  try {
    await sendSurveyToGoogleSheets(payload)

    return {
      queued: false,
      message: 'Khảo sát đã được gửi thành công.',
    }
  } catch {
    await saveSurveyToQueue(payload)

    return {
      queued: true,
      message:
        'Không thể gửi ngay lúc này. Khảo sát đã được lưu vào hàng chờ đồng bộ.',
    }
  }
}

export async function syncPendingSurveys(): Promise<SyncResult> {
  const online = await isDeviceOnline()

  if (!online) {
    return {
      syncedCount: 0,
      failedCount: 0,
      message:
        'Thiết bị đang offline nên chưa thể đồng bộ.',
    }
  }

  const pendingSurveys =
    await stayCheckDb.surveyQueue
      .where('status')
      .anyOf('pending', 'failed')
      .toArray()

  if (pendingSurveys.length === 0) {
    return {
      syncedCount: 0,
      failedCount: 0,
      message:
        'Không có khảo sát nào đang chờ đồng bộ.',
    }
  }

  if (!GOOGLE_SCRIPT_URL) {
    return {
      syncedCount: 0,
      failedCount: pendingSurveys.length,
      message:
        'Chưa cấu hình VITE_GOOGLE_SCRIPT_URL. Vui lòng kiểm tra file .env rồi build lại ứng dụng.',
    }
  }

  let syncedCount = 0
  let failedCount = 0

  for (const survey of pendingSurveys) {
    if (!survey.id) continue

    try {
      await stayCheckDb.surveyQueue.update(survey.id, {
        status: 'syncing',
        updatedAt: getCurrentIsoTime(),
      })

      await sendSurveyToGoogleSheets(survey.payload)

      await stayCheckDb.surveyQueue.delete(survey.id)

      syncedCount += 1
    } catch (error) {
      failedCount += 1

      await stayCheckDb.surveyQueue.update(survey.id, {
        status: 'failed',
        retries: survey.retries + 1,
        updatedAt: getCurrentIsoTime(),
        lastError:
          error instanceof Error
            ? error.message
            : String(error),
      })
    }
  }

  return {
    syncedCount,
    failedCount,
    message:
      syncedCount > 0
        ? `Đã đồng bộ ${syncedCount} khảo sát lên Google Sheets.`
        : 'Chưa đồng bộ được khảo sát nào. Vui lòng kiểm tra kết nối mạng hoặc cấu hình Google Apps Script.',
  }
}

export async function getPendingSurveyCount() {
  return stayCheckDb.surveyQueue
    .where('status')
    .anyOf('pending', 'failed')
    .count()
}