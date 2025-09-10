import { defineStore } from 'pinia'

export const useUser = defineStore('user', () => {
  const userData = ref<{ profile: UserProfile, pref: [UserPref] } | null>(null)

  const getPrefByKey = (key: string, defaultReturnValue: string | boolean | null) => 
    (userData.value?.pref ?? []).find((x: UserPref) =>
      x.key === key
    )?.value ?? defaultReturnValue

  return { userData, getPrefByKey }
})
