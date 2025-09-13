import { pgTable, serial, varchar, text, timestamp, pgEnum, jsonb } from 'drizzle-orm/pg-core'

export const projectMembershipTypeEnum = pgEnum("project_membership_types", ["admin", "member", "guest"])
export const workItemTypeEnum = pgEnum("work_item_types", ["task", "bug"])

const id = serial('id').primaryKey()
const createdBy = serial('created_by').references(() => users.id).notNull()
const createdAt = timestamp('created_at', { withTimezone: true, mode: 'date' }).defaultNow().notNull()
const updatedAt = timestamp('updated_at', { withTimezone: true, mode: 'date' })

export const users = pgTable('users', {
  id,
  email: varchar('email', { length: 255 }).notNull().unique(),
  firstName: text('first_name'),
  lastName: text('last_name'),
  provider: text('provider'),
  createdAt,
  updatedAt
})

export const userPref = pgTable('user_pref', {
  id,
  pref: jsonb('pref'),
  userId: serial('user_id').references(() => users.id).notNull()
})

export const passwordHash = pgTable('password_hash', {
  id,
  userId: serial('user_id').references(() => users.id).notNull(),
  hash: text('hash').notNull()
})

export const projects = pgTable("projects", {
  id,
  name: text('name').notNull(),
  createdBy,
  createdAt,
  updatedAt
})

export const projectMemberships = pgTable("project_memberships", {
  id,
  type: projectMembershipTypeEnum('type').notNull().default('member'),
  userId: serial('user_id').references(() => users.id).notNull(),
  projectId: serial('project_id').references(() => projects.id).notNull(),
  createdBy,
  createdAt,
  updatedAt
})

export const stories = pgTable('stories', {
  id,
  projectId: serial('project_id').references(() => projects.id).notNull(),
  title: text('title').notNull(),
  description: text('description'),
  status: varchar('status', { length: 60 }),
  createdBy,
  createdAt,
  updatedAt
})

export const workItems = pgTable('work_items', {
  id,
  type: workItemTypeEnum('type').notNull().default('task'),
  title: text('title').notNull(),
  description: text('description'),
  projectId: serial('project_id').references(() => projects.id).notNull(),
  status: varchar('status', { length: 60 }),
  createdBy,
  createdAt,
  updatedAt
})

export const storyItems = pgTable('story_items', {
  id,
  workItemId: serial('work_item_id').references(() => workItems.id).notNull(),
  storyId: serial("story_id").references(() => stories.id).notNull(),
  createdBy,
  createdAt,
  updatedAt
})

export const assignWorkItems = pgTable('assign_work_items', {
  id,
  userId: serial('user_id').references(() => users.id).notNull(),
  workItemId: serial('work_item_id').references(() => workItems.id).notNull(),
})

export const assignStory = pgTable('assign_story', {
  id,
  userId: serial('user_id').references(() => users.id).notNull(),
  storyId: serial('story_id').references(() => stories.id).notNull(),
})
