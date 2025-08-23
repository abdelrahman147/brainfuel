export interface Project {
  id: string
  title: string
  description: string
  university: string
  category: ProjectCategory
  tags: string[]
  tools: string[]
  imageUrl: string
  images: string[];
  score: number
  supportCount: number
  views: number
  createdAt: string
  author: {
    name: string
    avatar: string
    department: string
  }
  status: 'active' | 'completed' | 'fundraising'
}

export type ProjectCategory = 
  | 'AI'
  | 'Robotics'
  | 'Medicine'
  | 'Engineering'
  | 'Computer Science'
  | 'Environmental'
  | 'Business'
  | 'Arts'
  | 'Social Impact'
  | 'Other'

export interface TrendingProject extends Project {
  trend: 'up' | 'down' | 'stable'
  changePercent: number
}

export interface CategoryFilter {
  category: ProjectCategory
  count: number
  isActive: boolean
} 