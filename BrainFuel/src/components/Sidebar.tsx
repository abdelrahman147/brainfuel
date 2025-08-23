import { NavLink } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Home, 
  Search, 
  Plus, 
  DollarSign,
  MessageCircle, 
  HelpCircle,
  GraduationCap,
  LogIn,
  ShoppingBag,
  User,
  Trophy
} from 'lucide-react'

interface SidebarProps {
  onRouteChange?: () => void;
}

const typingVariants = {
  hidden: { opacity: 0 },
  visible: (i: number) => ({
    opacity: 1,
    transition: {
      delay: i * 0.1,
    },
  }),
};

const iconVariants = {
  animate: {
    scale: [1, 1.2, 1],
    rotate: [0, 10, -10, 0],
    transition: {
      duration: 2,
      ease: "easeInOut",
      repeat: Infinity,
      repeatType: "loop",
    },
  },
};

const Sidebar = ({ onRouteChange }: SidebarProps) => {
  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/explore', icon: Search, label: 'Explore' },
    { path: '/exhibition', icon: Trophy, label: 'Projects Exhibition' },
    { path: '/submit', icon: Plus, label: 'Submit Project' },
    { path: '/store', icon: ShoppingBag, label: 'Store' },
    { path: '/profile', icon: User, label: 'Profile' },
    { path: '/payments', icon: DollarSign, label: 'Plans & Pay' },
    { path: '/chat', icon: MessageCircle, label: 'Chat' },
    { path: '/support', icon: HelpCircle, label: 'Support' },
    { path: '/login', icon: LogIn, label: 'Login' },
  ]

  const subtitle = "Student Innovation Hub".split("")

  const handleNavClick = () => {
    if (onRouteChange) {
      onRouteChange();
    }
  };

  return (
          <motion.div 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="w-64 lg:w-64 md:w-56 sm:w-52 bg-gradient-to-b from-[#0e0a1f] to-[#18103b] border-r border-border-primary flex flex-col relative overflow-hidden h-screen"
      >
        {/* Floating Elements in Sidebar */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
              animate={{
                x: [0, 30, 0],
                y: [0, -30, 0],
                opacity: [0.1, 0.4, 0.1],
              }}
              transition={{
                duration: 8 + i * 2,
                repeat: Infinity,
                delay: i * 0.8,
              }}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
            />
          ))}
        </div>
      {/* Logo */}
      <div className="p-4 lg:p-6 border-b border-border-primary">
        <NavLink to="/" className="cursor-pointer" onClick={handleNavClick}>
          <div className="flex items-center space-x-2 lg:space-x-3">
            <div className="w-8 h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-accent-primary to-accent-secondary rounded-lg flex items-center justify-center">
              <motion.div
                variants={iconVariants}
                animate="animate"
              >
                <GraduationCap className="w-4 h-4 lg:w-6 lg:h-6 text-white" />
              </motion.div>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg lg:text-xl font-bold bg-gradient-to-r from-[#7c3aed] via-[#9f67fa] to-[#a78bfa] bg-clip-text text-transparent truncate">
                BrainFuel
              </h1>
              <p className="text-xs text-text-muted hidden sm:block">
                <AnimatePresence>
                  {subtitle.map((char, i) => (
                    <motion.span
                      key={`${char}-${i}`}
                      variants={typingVariants}
                      initial="hidden"
                      animate="visible"
                      custom={i}
                      style={{ display: 'inline-block' }}
                    >
                      {char === " " ? "\u00A0" : char}
                    </motion.span>
                  ))}
                </AnimatePresence>
              </p>
              <p className="text-xs text-text-muted sm:hidden">Student Innovation Hub</p>
            </div>
          </div>
        </NavLink>
      </div>

      {/* Enhanced Navigation */}
      <nav className="flex-1 p-3 lg:p-4 space-y-1 lg:space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={handleNavClick}
            className={({ isActive }) =>
              `flex items-center space-x-2 lg:space-x-3 px-3 lg:px-4 py-2.5 lg:py-3 rounded-xl transition-all duration-300 ease-in-out transform group relative overflow-hidden ${
                isActive
                  ? 'bg-gradient-to-r from-accent-primary/20 to-accent-secondary/20 text-accent-primary border border-accent-primary/30 shadow-lg shadow-purple-500/20'
                  : 'text-text-secondary hover:text-text-primary hover:bg-gradient-to-r hover:from-purple-600/10 hover:to-indigo-600/10 hover:scale-[1.02] hover:shadow-md'
              }`
            }
          >
            {/* Active indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-accent-primary to-accent-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            <item.icon className="w-4 h-4 lg:w-5 lg:h-5 flex-shrink-0 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-12" />
            <span className="font-medium text-sm lg:text-base truncate transition-all duration-300">{item.label}</span>
            
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/5 to-indigo-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-3 lg:p-4 border-t border-border-primary">
        <div className="text-center">
          <p className="text-xs text-text-muted">
            All rights reserved to BrainFuel
          </p>
          <p className="text-xs text-text-muted mt-1">
            Version 1.0.0.0
          </p>
        </div>
      </div>
    </motion.div>
  )
}

export default Sidebar
