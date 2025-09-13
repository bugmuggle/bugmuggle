import type { UserPref } from './types'

export const getPrefByKey = (
  data: UserPref[] | undefined,
  key: string,
  defaultReturnValue: string | boolean | null
) => {
  const target = (data || []).find(x => x && x.pref?.key === key)
  return target?.pref?.value ?? defaultReturnValue
}
