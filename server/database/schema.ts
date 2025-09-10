import { pgTable, serial, varchar, text } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name')
})

export const passwordHash = pgTable('password_hash', {
  userId: serial('user_id').references(() => users.id).notNull(),
  hash: text('hash').notNull()
})
