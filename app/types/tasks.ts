export interface Assignee {
  name: string
  initials: string
  color?: string
}

export interface Task {
  title: string
  comments?: number
  assignee?: Assignee
  dueDate?: string | null
  project?: string | null
  completed: boolean
}
