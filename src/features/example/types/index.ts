export interface Example {
  id: string
  title: string
  description: string
  status: 'pending' | 'in_progress' | 'completed'
  createdAt: Date
}

export interface ExampleCreateDTO {
  title: string
  description: string
}

export interface ExampleUpdateDTO {
  title?: string
  description?: string
  status?: 'pending' | 'in_progress' | 'completed'
}
