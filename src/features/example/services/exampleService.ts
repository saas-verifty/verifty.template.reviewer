import { apiClient } from '@/api/client'
import { Example, ExampleCreateDTO, ExampleUpdateDTO } from '../types'

export const exampleService = {
  async getAll(): Promise<Example[]> {
    // Mock data for demonstration
    // Replace with actual API call: const { data } = await apiClient.get('/examples')
    return Promise.resolve([
      {
        id: '1',
        title: 'Example Task 1',
        description: 'This is a sample task to demonstrate the feature structure',
        status: 'pending',
        createdAt: new Date('2024-01-15'),
      },
      {
        id: '2',
        title: 'Example Task 2',
        description: 'Another example showing the component architecture',
        status: 'in_progress',
        createdAt: new Date('2024-01-16'),
      },
      {
        id: '3',
        title: 'Example Task 3',
        description: 'Completed task example with full functionality',
        status: 'completed',
        createdAt: new Date('2024-01-14'),
      },
    ])
  },

  async getById(id: string): Promise<Example> {
    const { data } = await apiClient.get(`/examples/${id}`)
    return data
  },

  async create(example: ExampleCreateDTO): Promise<Example> {
    const { data } = await apiClient.post('/examples', example)
    return data
  },

  async update(id: string, example: ExampleUpdateDTO): Promise<Example> {
    const { data } = await apiClient.patch(`/examples/${id}`, example)
    return data
  },

  async delete(id: string): Promise<void> {
    await apiClient.delete(`/examples/${id}`)
  },
}
