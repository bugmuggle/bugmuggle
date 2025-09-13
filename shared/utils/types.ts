import type { PostgresJsDatabase } from 'drizzle-orm/postgres-js'
import type * as schema from '../../server/database/schema'

declare module 'h3' {
  interface H3EventContext {
    db: PostgresJsDatabase<typeof schema>
    user: {
      id: number
      email: string
    }
  }
}

export type UserPref = {
  id: number
  pref?: {
    key: string
    value: string | boolean | number | undefined | null
  } | unknown
  userId: number
}

export type UserProfile = {
  id: number
  email: string
  firstName?: string
  lastName?: string
}

export type Project = {
  id: number
  name: string
  createdBy: UserPref | number
  createdAt: string
  updatedAt?: string
}

export type ProjectMembership = {
  id: number
  type: string
  userId: UserPref | number
  projectId: Project | number
  createdBy: UserPref | number
  createdAt: string
  updatedAt?: string
}

export type ProjectMembershipPayload = {
  type?: string
  userId: UserPref | number
  projectId: Project | number
}

export type CreateProjectParams = {
  name: string
  createdBy: number
}

export type ServerErrObject = {
  statusCode: number
  statusMessage: string
}
