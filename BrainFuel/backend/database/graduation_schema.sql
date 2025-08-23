-- Database schema for Graduation Projects Platform

-- Students table
CREATE TABLE IF NOT EXISTS students (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id VARCHAR(20 UNIQUE NOT NULL,
    name VARCHAR(100OT NULL,
    email VARCHAR(100 UNIQUE NOT NULL,
    password_hash VARCHAR(255LL,
    department VARCHAR(100university VARCHAR(100   graduation_year INTEGER NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Supervisors table
CREATE TABLE IF NOT EXISTS supervisors (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100OT NULL,
    email VARCHAR(100 UNIQUE NOT NULL,
    password_hash VARCHAR(255LL,
    department VARCHAR(100university VARCHAR(100),
    title VARCHAR(50) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Departments table
CREATE TABLE IF NOT EXISTS departments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100 UNIQUE NOT NULL,
    university VARCHAR(100),
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Project categories table
CREATE TABLE IF NOT EXISTS project_categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(50 UNIQUE NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Graduation projects table
CREATE TABLE IF NOT EXISTS graduation_projects (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(200NULL,
    abstract TEXT NOT NULL,
    description TEXT NOT NULL,
    objectives TEXT,
    methodology TEXT,
    results TEXT,
    conclusion TEXT,
    keywords TEXT,
    department_id INTEGER NOT NULL,
    category_id INTEGER NOT NULL,
    student_id INTEGER NOT NULL,
    supervisor_id INTEGER NOT NULL,
    co_supervisor_id INTEGER,
    status VARCHAR(20FAULT 'in_progress CHECK (status IN ('in_progress',completed', 'defended,published)),
    grade DECIMAL(3,1),
    defense_date DATE,
    submission_date DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    file_url TEXT,
    presentation_url TEXT,
    github_url TEXT,
    demo_url TEXT,
    views INTEGER DEFAULT 0,
    downloads INTEGER DEFAULT 0
    FOREIGN KEY (department_id) REFERENCES departments(id),
    FOREIGN KEY (category_id) REFERENCES project_categories(id),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (supervisor_id) REFERENCES supervisors(id),
    FOREIGN KEY (co_supervisor_id) REFERENCES supervisors(id)
);

-- Project files table
CREATE TABLE IF NOT EXISTS project_files (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    file_name VARCHAR(255NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size INTEGER,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES graduation_projects(id) ON DELETE CASCADE
);

-- Project comments table
CREATE TABLE IF NOT EXISTS project_comments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student, upervisor', 'admin')),
    content TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES graduation_projects(id) ON DELETE CASCADE
);

-- Project likes table
CREATE TABLE IF NOT EXISTS project_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    user_type VARCHAR(20) NOT NULL CHECK (user_type IN ('student, upervisor', 'admin')),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES graduation_projects(id) ON DELETE CASCADE,
    UNIQUE(project_id, user_id, user_type)
);

-- Project views table
CREATE TABLE IF NOT EXISTS project_views (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    project_id INTEGER NOT NULL,
    user_id INTEGER,
    user_type VARCHAR(20ip_address VARCHAR(45   user_agent TEXT,
    viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id) REFERENCES graduation_projects(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_projects_department ON graduation_projects(department_id);
CREATE INDEX IF NOT EXISTS idx_projects_category ON graduation_projects(category_id);
CREATE INDEX IF NOT EXISTS idx_projects_student ON graduation_projects(student_id);
CREATE INDEX IF NOT EXISTS idx_projects_supervisor ON graduation_projects(supervisor_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON graduation_projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_submission_date ON graduation_projects(submission_date);
CREATE INDEX IF NOT EXISTS idx_project_files_project ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_comments_project ON project_comments(project_id);
CREATE INDEX IF NOT EXISTS idx_project_likes_project ON project_likes(project_id);
CREATE INDEX IF NOT EXISTS idx_project_views_project ON project_views(project_id); 