export type TabId = 'home' | 'schedule' | 'health' | 'finance' | 'ai'

export interface Task {
  id: string
  title: string
  time?: string
  done: boolean
  priority: 'high' | 'medium' | 'low'
  category: string
}

export interface Event {
  id: string
  title: string
  time: string
  endTime?: string
  location?: string
  color: string
  category: string
}

export interface HealthMetric {
  steps: number
  stepsGoal: number
  water: number
  waterGoal: number
  sleep: number
  sleepGoal: number
  calories: number
  caloriesGoal: number
  heartRate: number
}

export interface Transaction {
  id: string
  title: string
  category: string
  amount: number
  type: 'income' | 'expense'
  date: string
  icon: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
}

export interface WeatherData {
  temp: number
  condition: string
  humidity: number
  wind: number
  feelsLike: number
  icon: string
}

export interface Meal {
  id: string
  name: string
  calories: number
  time: string
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack'
}
