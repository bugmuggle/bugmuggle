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
