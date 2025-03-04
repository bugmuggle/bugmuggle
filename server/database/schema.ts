import { sqliteTable, text, integer, blob } from 'drizzle-orm/sqlite-core'

export const channels = sqliteTable('channels', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  name: text('name').notNull(),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  userId: integer('user_id').references(() => users.id),
  memberCount: integer('member_count').notNull(),
})

export const users = sqliteTable('users', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  githubId: text('github_id').notNull(),
  githubUsername: text('github_username').notNull(),
  githubAvatarUrl: text('github_avatar_url').notNull(),
  lastVisitedChannelId: integer('last_visited_channel_id').references(() => channels.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const members = sqliteTable('members', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  userId: integer('user_id').references(() => users.id),
  type: text('type').notNull(),
  channelId: integer('channel_id').references(() => channels.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})

export const tasks = sqliteTable('tasks', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  priority: integer('priority'),
  description: text('description'),
  createdBy: integer('created_by').references(() => users.id),
  channelId: integer('channel_id').references(() => channels.id),
  order: integer('order'),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
  dueDate: integer('due_date', { mode: 'timestamp' }),
  status: text('status'),
  archived: integer('archived', { mode: 'boolean' }),
  updatedBy: integer('updated_by').references(() => users.id),
})

export const taskAssignees = sqliteTable('task_assignees', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  taskId: integer('task_id').references(() => tasks.id),
  userId: integer('user_id').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' }).notNull(),
})

export const taskAttachments = sqliteTable('task_attachments', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  taskId: integer('task_id').references(() => tasks.id),
  fileName: text('file_name').notNull(),
  fileSize: integer('file_size').notNull(),
  fileType: text('file_type').notNull(),
  filePath: text('file_path').notNull(),
  uploadedBy: integer('uploaded_by').references(() => users.id),
  createdAt: integer('created_at', { mode: 'timestamp' }).notNull(),
})
