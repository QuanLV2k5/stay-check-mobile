import Dexie, { type Table } from 'dexie'

export type QueueStatus = 'pending' | 'syncing' | 'synced' | 'failed'

export type QueuedSurvey = {
  id?: number
  localId: string
  payload: Record<string, unknown>
  status: QueueStatus
  retries: number
  createdAt: string
  updatedAt: string
  lastError?: string
}

class StayCheckDatabase extends Dexie {
  surveyQueue!: Table<QueuedSurvey, number>

  constructor() {
    super('StayCheckDB')

    this.version(1).stores({
      surveyQueue: '++id, localId, status, createdAt',
    })
  }
}

export const stayCheckDb = new StayCheckDatabase()