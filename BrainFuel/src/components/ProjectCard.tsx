import { motion } from 'framer-motion'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import { Project, TrendingProject } from '../types'
import { useNavigate } from 'react-router-dom'

interface ProjectCardProps {
  project: Project | TrendingProject
  isTrending?: boolean
}

const ProjectCard = ({ project, isTrending = false }: ProjectCardProps) => {
  const navigate = useNavigate();
  const trendingProject = isTrending ? project as TrendingProject : null

  const handleCardClick = () => {
    navigate(`/project/${project.id}`);
  };

  const formatNumber = (num: number): string => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
    return num.toString()
  }

  const getCategoryColor = (category: string) => {
    const colors = {
      'AI': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Robotics': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Medicine': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Engineering': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Computer Science': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
      'Environmental': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
      'Business': 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      'Arts': 'bg-pink-500/20 text-pink-400 border-pink-500/30',
      'Social Impact': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      'Other': 'bg-gray-500/20 text-gray-400 border-gray-500/30'
    }
    return colors[category as keyof typeof colors] || colors['Other']
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-background-secondary border border-border-primary rounded-xl overflow-hidden card-hover cursor-pointer"
      onClick={handleCardClick}
    >
      {/* Project Image */}
      <div className="relative h-48 overflow-hidden">
        <img
          src={project.imageUrl}
          alt={project.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 to-transparent" />
        
        {/* Category Badge */}
        <div className="absolute top-4 left-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getCategoryColor(project.category)}`}>
            {project.category}
          </span>
        </div>

        {/* Trending Indicator */}
        {isTrending && trendingProject && (
          <div className="absolute top-4 right-4 flex items-center space-x-1 bg-background-primary/90 backdrop-blur-sm px-2 py-1 rounded-full">
            {trendingProject.trend === 'up' && (
              <TrendingUp className="w-3 h-3 text-accent-success" />
            )}
            {trendingProject.trend === 'down' && (
              <TrendingDown className="w-3 h-3 text-accent-danger" />
            )}
            {trendingProject.trend === 'stable' && (
              <Minus className="w-3 h-3 text-accent-warning" />
            )}
            <span className="text-xs font-medium text-text-primary">
              {trendingProject.changePercent > 0 ? '+' : ''}{trendingProject.changePercent}%
            </span>
          </div>
        )}
      </div>

      {/* Project Content */}
      <div className="p-6">
        {/* Title and University */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-text-primary mb-1 line-clamp-2">
            {project.title}
          </h3>
          <p className="text-sm text-text-secondary flex items-center">
            <span className="w-2 h-2 bg-accent-primary rounded-full mr-2" />
            {project.university}
          </p>
        </div>

        {/* Description */}
        <p className="text-sm text-text-muted mb-4 line-clamp-2">
          {project.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.slice(0, 3).map((tag, index) => (
            <span
              key={index}
              className="px-2 py-1 bg-background-tertiary text-text-secondary text-xs rounded-md"
            >
              {tag}
            </span>
          ))}
                      {project.tags.length > 3 && (
                             <span className="px-2 py-1 bg-background-tertiary text-text-secondary text-xs rounded-md">
                 +{project.tags.length - 3}
               </span>
            )}
        </div>

        {/* Score */}
        <div className="flex items-center justify-end">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-full flex items-center justify-center">
              <span className="text-xs font-bold text-white">{project.score}</span>
            </div>
          </div>
        </div>

        {/* Author */}
        <div className="flex items-center mt-4 pt-4 border-t border-border-primary">
          <img
            src={project.author.avatar}
            alt={project.author.name}
            className="w-8 h-8 rounded-full mr-3"
          />
          <div>
            <p className="text-sm font-medium text-text-primary">{project.author.name}</p>
            <p className="text-xs text-text-muted">{project.author.department}</p>
          </div>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-accent-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </motion.div>
  )
}

export default ProjectCard 