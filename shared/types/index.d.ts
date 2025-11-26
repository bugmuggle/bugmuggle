export {}


declare global {

  export interface Task {
    id: number
    title: string
    status: TaskStatus
    deadline: string
    assignee: number
    createdBy: number
  }

  export type TaskStatus = 'COMPLETED' | 'PROGRESS' | 'PENDING' | 'BLOCKED' | 'CANCELLED'

  export interface UserOption {
    id: number
    name: string
    avatar: string
  }

}
