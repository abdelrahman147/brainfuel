import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart, MessageCircle, Eye, Share2, Send, User, Calendar, MapPin, Users, Star, Play, Image, Video, X, ArrowLeft } from 'lucide-react';
import { mockProjects, trendingProjects } from '../data/projects';
import { Project, TrendingProject } from '../types';

interface Comment {
  id: string;
  user: {
    name: string;
    avatar: string;
    department: string;
  };
  content: string;
  timestamp: Date;
  likes: number;
}

interface ProjectMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnail?: string;
  title: string;
}

const ProjectDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  // State Management
  const [project, setProject] = useState<Project | TrendingProject | null>(null);
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [selectedMedia, setSelectedMedia] = useState<ProjectMedia | null>(null);
  const [projectMedia, setProjectMedia] = useState<ProjectMedia[]>([]);


  // Find project by ID
  useEffect(() => {
    if (id) {
      const foundProject = [...mockProjects, ...trendingProjects].find(p => p.id === id);
      if (foundProject) {
        setProject(foundProject);
        setLikesCount(foundProject.supportCount);
        
        // Mock comments data
        setComments([
          {
            id: '1',
            user: {
              name: 'Ahmed Mohamed',
              avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
              department: 'Computer Science'
            },
            content: 'Amazing project! I love how you implemented the AI algorithms.',
            timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
            likes: 12
          },
          {
            id: '2',
            user: {
              name: 'Sarah Ahmed',
              avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
              department: 'Engineering'
            },
            content: 'Can you share the source code? I would love to learn from this project.',
            timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000), // 5 hours ago
            likes: 8
          },
          {
            id: '3',
            user: {
              name: 'Mohamed Ali',
              avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
              department: 'AI Research'
            },
            content: 'Excellent performance! This project will revolutionize the AI field.',
            timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            likes: 25
          }
        ]);

        // Mock project media
        setProjectMedia([
          {
            id: '1',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            title: 'Project Screenshot 1'
          },
          {
            id: '2',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            title: 'Project Screenshot 2'
          },
          {
            id: '3',
            type: 'video',
            url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            thumbnail: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            title: 'Project Demo Video'
          },
          {
            id: '4',
            type: 'image',
            url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=600&fit=crop',
            title: 'Architecture Diagram'
          }
        ]);
      }
      setIsLoading(false);
    }
  }, [id]);

  // Handle like/unlike
  const handleLike = () => {
    setIsLiked(!isLiked);
    setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  // Handle comment submission
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        user: {
          name: 'You',
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face',
          department: 'Student'
        },
        content: newComment,
        timestamp: new Date(),
        likes: 0
      };
      setComments(prev => [newCommentObj, ...prev]);
      setNewComment('');
    }
  };

  // Handle media selection
  const handleMediaClick = (media: ProjectMedia) => {
    setSelectedMedia(media);
  };

  // Get YouTube video ID from URL
  const getYouTubeVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  // Format timestamp
  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `منذ ${minutes} دقيقة`;
    if (hours < 24) return `منذ ${hours} ساعة`;
    return `منذ ${days} يوم`;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-accent-primary"></div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent">
        <h2 className="text-2xl font-bold text-white mb-4">Project Not Found</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-3 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6 sm:py-8">
        
        {/* Header with Back Button */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 px-3 sm:px-4 py-2 rounded-full border border-purple-600 text-purple-100 bg-gray-900 hover:bg-gradient-to-r hover:from-purple-600 hover:to-indigo-600 transition relative overflow-hidden"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="font-medium text-xs sm:text-sm">Back</span>
          </motion.button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Project Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative h-64 sm:h-80 md:h-96 rounded-xl overflow-hidden mb-6 sm:mb-8"
            >
              <img
                src={project.imageUrl}
                alt={project.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background-primary/80 to-transparent" />
              
              {/* Category Badge */}
              <div className="absolute top-3 sm:top-4 left-3 sm:left-4">
                <span className="px-3 sm:px-4 py-1.5 sm:py-2 bg-accent-primary/20 text-accent-primary rounded-full text-xs sm:text-sm font-medium backdrop-blur-sm">
                  {project.category}
                </span>
              </div>

              {/* Success Indicator */}
              <div className="absolute top-3 sm:top-4 right-3 sm:right-4">
                <div className="flex items-center space-x-1 px-2 py-1 bg-black/80 backdrop-blur-sm rounded-full shadow-lg">
                  <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  <span className="text-white text-xs font-bold">+12.5%</span>
                </div>
              </div>
            </motion.div>

            {/* Project Title and Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="mb-6 sm:mb-8"
            >
              <h1 className="text-2xl sm:text-3xl font-bold text-text-primary mb-3 sm:mb-4">{project.title}</h1>
              
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-6 text-white/70 mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                <div className="flex items-center space-x-2">
                  <Calendar className="w-4 h-4" />
                  <span className="text-sm sm:text-base">Published 3 days ago</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4" />
                  <span className="text-sm sm:text-base">{project.university}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span className="text-sm sm:text-base">1,234 followers</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLike}
                  className={`flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg transition-colors ${
                    isLiked 
                      ? 'bg-accent-danger text-white' 
                      : 'bg-background-tertiary text-text-secondary hover:bg-background-primary'
                  }`}
                >
                  <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
                  <span>{likesCount}</span>
                </motion.button>

                <button className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-background-tertiary text-text-secondary rounded-lg hover:bg-background-primary transition-colors">
                  <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="text-sm sm:text-base">{project.views}</span>
                </button>

                <div className="flex items-center space-x-2 px-3 sm:px-4 py-2.5 sm:py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg shadow-lg shadow-orange-500/25">
                  <Star className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-bold text-sm sm:text-base">{project.score}</span>
                </div>

                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 text-white shadow-lg shadow-purple-600/25"
                >
                  <Share2 className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium text-sm sm:text-base">Share</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Project Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6 sm:mb-8"
            >
              <h2 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">Project Description</h2>
              <p className="text-white/80 leading-relaxed text-sm sm:text-base">{project.description}</p>
            </motion.div>

            {/* Tools Used */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-6 sm:mb-8"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Tools Used</h3>
              <div className="flex flex-wrap gap-2 sm:gap-3">
                {project.tools.map((tool, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    className="px-3 sm:px-4 py-1.5 sm:py-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 text-blue-300 rounded-lg text-xs sm:text-sm font-medium backdrop-blur-sm border border-blue-400/30 hover:from-blue-500/30 hover:to-purple-500/30 transition-all duration-300 cursor-default"
                  >
                    {tool}
                  </motion.span>
                ))}
              </div>
            </motion.div>

            {/* Project Media Gallery */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-6 sm:mb-8"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Project Gallery</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                {projectMedia.map((media) => (
                  <motion.div
                    key={media.id}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleMediaClick(media)}
                    className="relative group cursor-pointer rounded-lg overflow-hidden bg-black/20 backdrop-blur-sm"
                  >
                    {media.type === 'image' ? (
                      <img
                        src={media.url}
                        alt={media.title}
                        className="w-full h-32 object-cover"
                      />
                    ) : (
                      <div className="relative w-full h-32 bg-black/40">
                        <img
                          src={media.thumbnail}
                          alt={media.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                            <Play className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute bottom-2 left-2 right-2">
                      <p className="text-white text-xs font-medium truncate">{media.title}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Project Tags */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="mb-6 sm:mb-8"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-white/10 text-white rounded-lg text-sm backdrop-blur-sm"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Author Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 mb-4 sm:mb-6 border border-white/10"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Author Information</h3>
              <div className="flex items-center space-x-3 sm:space-x-4 mb-3 sm:mb-4">
                <img
                  src={project.author.avatar}
                  alt={project.author.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 rounded-full"
                />
                <div>
                  <h4 className="font-semibold text-white text-sm sm:text-base">{project.author.name}</h4>
                  <p className="text-white/70 text-xs sm:text-sm">{project.author.department}</p>
                </div>
              </div>
              <button className="w-full px-3 sm:px-4 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors text-sm sm:text-base">
                Follow Author
              </button>
            </motion.div>

            {/* Similar Projects */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10"
            >
              <h3 className="text-base sm:text-lg font-semibold text-white mb-3 sm:mb-4">Similar Projects</h3>
              <div className="space-y-3 sm:space-y-4">
                {mockProjects.slice(0, 3).map((similarProject) => (
                  <div key={similarProject.id} className="flex items-center space-x-2 sm:space-x-3 p-2 sm:p-3 bg-white/10 rounded-lg hover:bg-white/20 transition-colors cursor-pointer">
                    <img
                      src={similarProject.imageUrl}
                      alt={similarProject.title}
                      className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h4 className="font-medium text-white text-xs sm:text-sm line-clamp-1">{similarProject.title}</h4>
                      <p className="text-white/70 text-xs">{similarProject.university}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 sm:mt-12"
        >
          <div className="bg-black/20 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/10">
            <h3 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6">Comments ({comments.length})</h3>
            
            {/* Add Comment */}
            <form onSubmit={handleCommentSubmit} className="mb-6 sm:mb-8">
              <div className="flex items-start space-x-3 sm:space-x-4">
                <img
                  src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop&crop=face"
                  alt="Your avatar"
                  className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                />
                <div className="flex-1">
                  <textarea
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    placeholder="Write your comment here..."
                    className="w-full p-3 sm:p-4 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 resize-none focus:outline-none focus:ring-2 focus:ring-accent-primary backdrop-blur-sm text-sm sm:text-base"
                    rows={3}
                  />
                  <div className="flex justify-end mt-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="submit"
                      disabled={!newComment.trim()}
                      className="px-4 sm:px-6 py-2 bg-accent-primary text-white rounded-lg hover:bg-accent-secondary transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 text-sm sm:text-base"
                    >
                      <Send className="w-4 h-4" />
                      <span>Send</span>
                    </motion.button>
                  </div>
                </div>
              </div>
            </form>

            {/* Comments List */}
            <div className="space-y-4 sm:space-y-6">
              {comments.map((comment) => (
                <motion.div
                  key={comment.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-start space-x-3 sm:space-x-4 p-3 sm:p-4 bg-white/10 rounded-lg backdrop-blur-sm"
                >
                  <img
                    src={comment.user.avatar}
                    alt={comment.user.name}
                    className="w-8 h-8 sm:w-10 sm:h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-2 mb-2 space-y-1 sm:space-y-0">
                      <h4 className="font-semibold text-white text-sm sm:text-base">{comment.user.name}</h4>
                      <span className="text-white/60 text-xs sm:text-sm">{comment.user.department}</span>
                      <span className="text-white/60 text-xs sm:text-sm hidden sm:inline">•</span>
                      <span className="text-white/60 text-xs sm:text-sm">{formatTimestamp(comment.timestamp)}</span>
                    </div>
                    <p className="text-white/80 mb-3 text-sm sm:text-base">{comment.content}</p>
                    <div className="flex items-center space-x-3 sm:space-x-4">
                      <button className="flex items-center space-x-1 text-white/60 hover:text-accent-danger transition-colors">
                        <Heart className="w-4 h-4" />
                        <span className="text-xs sm:text-sm">{comment.likes}</span>
                      </button>
                      <button className="text-white/60 hover:text-accent-primary transition-colors text-xs sm:text-sm">
                        Reply
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Media Modal */}
      <AnimatePresence>
        {selectedMedia && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-2 sm:p-4"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-black/40 backdrop-blur-sm rounded-xl overflow-hidden border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-10">
                <button
                  onClick={() => setSelectedMedia(null)}
                  className="w-8 h-8 sm:w-10 sm:h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
              
              <div className="p-4 sm:p-6">
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-3 sm:mb-4">{selectedMedia.title}</h3>
                
                {selectedMedia.type === 'image' ? (
                  <div className="flex justify-center">
                    <img
                      src={selectedMedia.url}
                      alt={selectedMedia.title}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="flex justify-center">
                    <div className="w-full max-w-4xl aspect-video">
                      <iframe
                        src={`https://www.youtube.com/embed/${getYouTubeVideoId(selectedMedia.url)}`}
                        title={selectedMedia.title}
                        className="w-full h-full rounded-lg"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectDetails;
