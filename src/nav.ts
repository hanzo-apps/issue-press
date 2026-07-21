import type { BaseRecord } from '@hanzo/base/react'

/**
 * In-app navigation — one static SPA, no router dependency. The signed-in
 * shell holds a single `Route` in state and hands `Go` to each view. Only
 * `/auth/callback` is matched off the URL (in app.tsx); everything else is a
 * value here, so the three views stay decoupled from each other.
 */
export type Route =
  | { at: 'newsstand' }
  | { at: 'issue'; issue: string }
  | { at: 'article'; issue: string; article: string }

export type Go = (route: Route) => void

/** One row of the `issues` collection (see schema.sql). */
export interface Issue extends BaseRecord {
  number: number
  title: string
  cover_line: string
  published_at: string
  published: boolean
}

/** One row of the `articles` collection (see schema.sql). */
export interface Article extends BaseRecord {
  issue_id: string
  title: string
  dek: string
  body: string
  department: string
  is_cover: boolean
  order: number
}

/** Departments a piece can run under — presets that guide the newsroom. */
export const departments = ['Features', 'Dispatch', 'Interview', 'Essay', 'Review', 'The Back Page'] as const
