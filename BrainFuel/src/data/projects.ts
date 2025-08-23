import { Project, TrendingProject } from '../types'

export const mockProjects: Project[] = [
  {
    id: '1',
    title: 'AI-Powered Medical Diagnosis Assistant',
    description: 'An intelligent system that helps doctors diagnose rare diseases using machine learning and medical imaging.',
    university: 'Stanford University',
    category: 'AI',
    tags: ['Machine Learning', 'Healthcare', 'Computer Vision'],
    tools: ['Python', 'TensorFlow', 'OpenCV', 'Django', 'PostgreSQL', 'Docker'],
    imageUrl: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop',
      'https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop'
    ],
    score: 9.8,
    supportCount: 1247,
    views: 15420,
    createdAt: '2024-01-15',
    author: {
      name: 'Dr. Sarah Chen',
      avatar: '/Dr. Sarah Chen.jpeg',
      department: 'Computer Science'
    },
    status: 'active'
  },
  {
    id: '2',
    title: 'Autonomous Campus Delivery Robot',
    description: 'A self-navigating robot that delivers packages and food across university campuses.',
    university: 'MIT',
    category: 'Robotics',
    tags: ['Autonomous Systems', 'Logistics', 'IoT'],
    tools: ['ROS (Robot Operating System)', 'Python', 'C++', 'Arduino', 'Raspberry Pi', 'OpenCV', 'SLAM'],
    imageUrl: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=400&h=300&fit=crop'],
    score: 9.5,
    supportCount: 892,
    views: 12340,
    createdAt: '2024-01-10',
    author: {
      name: 'Alex Rodriguez',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      department: 'Mechanical Engineering'
    },
    status: 'active'
  },
  {
    id: '3',
    title: 'Smart Prosthetic Hand with Neural Interface',
    description: 'Advanced prosthetic hand that responds to neural signals for natural movement control.',
    university: 'UC Berkeley',
    category: 'Medicine',
    tags: ['Neural Interface', 'Biomedical', 'Prosthetics'],
    tools: ['MATLAB', 'Python', 'Arduino', '3D Printing', 'Neural Networks', 'Signal Processing', 'SolidWorks'],
    imageUrl: '/Smart Prosthetic Hand with Neural Interface.jpeg',
    images: ['/Smart Prosthetic Hand with Neural Interface.jpeg'],
    score: 9.9,
    supportCount: 2156,
    views: 28940,
    createdAt: '2024-01-05',
    author: {
      name: 'Dr. Michael Park',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      department: 'Biomedical Engineering'
    },
    status: 'active'
  },
  {
    id: '4',
    title: 'Sustainable Energy Management System',
    description: 'Smart grid system that optimizes energy consumption across university buildings.',
    university: 'Harvard University',
    category: 'Engineering',
    tags: ['Renewable Energy', 'Smart Grid', 'Sustainability'],
    tools: ['Node.js', 'React', 'MongoDB', 'IoT Sensors', 'Python', 'Machine Learning', 'AWS'],
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=400&h=300&fit=crop'],
    score: 9.2,
    supportCount: 567,
    views: 8760,
    createdAt: '2024-01-12',
    author: {
      name: 'Emma Thompson',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      department: 'Electrical Engineering'
    },
    status: 'active'
  },
  {
    id: '5',
    title: 'Blockchain-Based Academic Credentials',
    description: 'Secure and verifiable digital credentials system using blockchain technology.',
    university: 'Yale University',
    category: 'Computer Science',
    tags: ['Blockchain', 'Education', 'Security'],
    tools: ['Solidity', 'Web3.js', 'React', 'Node.js', 'Ethereum', 'IPFS', 'MetaMask'],
    imageUrl: 'https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=400&h=300&fit=crop'],
    score: 8.9,
    supportCount: 423,
    views: 6540,
    createdAt: '2024-01-08',
    author: {
      name: 'David Kim',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      department: 'Computer Science'
    },
    status: 'active'
  },
  {
    id: '6',
    title: 'Ocean Cleanup Drone Network',
    description: 'Autonomous drones that collect plastic waste from oceans and coastal areas.',
    university: 'UC San Diego',
    category: 'Environmental',
    tags: ['Ocean Conservation', 'Drones', 'Plastic Waste'],
    tools: ['Python', 'OpenCV', 'Arduino', 'GPS', 'Computer Vision', 'Drone SDK', 'Machine Learning'],
    imageUrl: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=400&h=300&fit=crop'],
    score: 9.6,
    supportCount: 1345,
    views: 18760,
    createdAt: '2024-01-03',
    author: {
      name: 'Lisa Wang',
      avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face',
      department: 'Environmental Engineering'
    },
    status: 'active'
  },
  {
    id: '7',
    title: 'Virtual Reality Campus Tour Platform',
    description: 'Immersive VR experience for prospective students to explore university campuses remotely.',
    university: 'University of Michigan',
    category: 'Computer Science',
    tags: ['Virtual Reality', 'Education', 'Campus Life'],
    tools: ['Unity', 'C#', 'Oculus SDK', 'Blender', '3D Modeling', 'WebVR', 'Three.js'],
    imageUrl: 'https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=400&h=300&fit=crop'],
    score: 8.7,
    supportCount: 298,
    views: 4320,
    createdAt: '2024-01-14',
    author: {
      name: 'James Wilson',
      avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=100&h=100&fit=crop&crop=face',
      department: 'Computer Science'
    },
    status: 'active'
  },
  {
    id: '8',
    title: 'Social Impact Investment Platform',
    description: 'Crowdfunding platform connecting student entrepreneurs with impact investors.',
    university: 'NYU',
    category: 'Business',
    tags: ['Social Impact', 'Crowdfunding', 'Entrepreneurship'],
    tools: ['React', 'Node.js', 'MongoDB', 'Stripe API', 'AWS', 'Docker', 'Jest Testing'],
    imageUrl: 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop',
    images: ['https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=400&h=300&fit=crop'],
    score: 9.1,
    supportCount: 756,
    views: 10980,
    createdAt: '2024-01-07',
    author: {
      name: 'Maria Garcia',
      avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
      department: 'Business Administration'
    },
    status: 'active'
  }
]

export const trendingProjects: TrendingProject[] = mockProjects.slice(0, 5).map((project, index) => ({
  ...project,
  trend: ['up', 'down', 'stable'][index % 3] as 'up' | 'down' | 'stable',
  changePercent: [12.5, -3.2, 8.7, 15.3, 2.1][index]
}))