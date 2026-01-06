import { pgTable, text, serial, timestamp, integer, boolean } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: serial().primaryKey(),
  name: text().notNull(),
  email: text().notNull().unique(),
  password: text().notNull(),
  avatar: text().notNull(),
  createdAt: timestamp().notNull().defaultNow(),
})

export const admins = pgTable("admins", {
  id: serial().primaryKey(),
  uid: integer().notNull().references(() => users.id),
  rootAdmin: boolean(),
})

export const projects = pgTable("projects", {
  id: serial().primaryKey(),
  name: text().notNull()
})
