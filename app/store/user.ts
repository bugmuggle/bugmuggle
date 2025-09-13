import { defineStore } from 'pinia'

export const useUser = defineStore('user', () => {
  const userData = ref<{ profile: UserProfile, pref: [UserPref] } | null>(null)

  return { userData }
})
