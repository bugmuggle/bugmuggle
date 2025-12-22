import type { User as SharedUser } from '../../shared/types/user'

declare module '#auth-utils' {
  interface User extends SharedUser { }
}

export { }
