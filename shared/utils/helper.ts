import type { UserPref } from './types'

export const getPrefByKey = (data: UserPref[] | undefined, key: string, defaultReturnValue: string | boolean | null) => 
  (data ?? []).find((x: UserPref) =>
    x.key === key
  )?.value ?? defaultReturnValue
