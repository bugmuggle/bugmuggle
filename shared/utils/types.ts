export type UserPref = {
  id: number
  key?: string
  value?: string
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
  createdBy: UserPref
  createdAt: number
}

export type CreateProjectParams = {
  name: string
  createdBy: number
}
