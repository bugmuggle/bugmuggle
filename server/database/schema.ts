import { pgTable, serial, varchar, text, integer, timestamp } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  provider: text('provider'),
  createdAt: timestamp('created_at').defaultNow(),
})

export const userPref = pgTable('user_pref', {
  id: serial('id').primaryKey(),
  key: text('key'),
  value: text('value'),
  userId: serial('user_id').references(() => users.id).notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
})

export const passwordHash = pgTable('password_hash', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
  hash: text('hash').notNull()
})

export const projects = pgTable('projects', {
	id: serial('id').primaryKey(),
	name: text('name').notNull(),
	createdBy: integer('created_by').notNull().references(() => users.id, { onDelete: 'cascade', onUpdate: 'cascade' }),
	createdAt: timestamp('created_at').defaultNow(),
	updatedAt: timestamp('updated_at'),
})
