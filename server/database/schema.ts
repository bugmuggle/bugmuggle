import { pgTable, serial, varchar, text, timestamp, pgEnum } from 'drizzle-orm/pg-core'
const projectMembershipTypeEnum = pgEnum("project_membership_types", ["admin", "member", "guest"])

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }),
  provider: text('provider')
})

export const userPref = pgTable('user_pref', {
  id: serial('id').primaryKey(),
  key: text('key'),
  value: text('value'),
  userId: serial('user_id').references(() => users.id).notNull()
})

export const passwordHash = pgTable('password_hash', {
  id: serial('id').primaryKey(),
  userId: serial('user_id').references(() => users.id).notNull(),
  hash: text('hash').notNull()
})

export const projects = pgTable("projects", {
  id: serial('id').primaryKey(),
  createdBy: serial('created_by').references(() => users.id).notNull(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }),
})

export const projectMemberships = pgTable("project_memberships", {
  id: serial('id').primaryKey(),
  type: projectMembershipTypeEnum('type').notNull().default('member'),
  userId: serial('user_id').references(() => users.id).notNull(),
  projectId: serial('project_id').references(() => projects.id).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true, mode: 'date' }),
})
